import * as path from 'path';
import * as vscode from 'vscode';

/**
 * File cache to avoid repeated workspace scans
 */
class FileCache {
  private cache: Map<string, vscode.Uri[]> = new Map();
  private cacheValid = false;
  private watcher: vscode.Disposable | undefined;

  constructor() {
    // Watch for file changes to invalidate cache
    this.watcher = vscode.workspace.onDidChangeTextDocument(() => {
      this.invalidate();
    });
  }

  get(workspacePath: string): vscode.Uri[] | undefined {
    if (this.cacheValid) {
      return this.cache.get(workspacePath);
    }
    return undefined;
  }

  set(workspacePath: string, files: vscode.Uri[]): void {
    this.cache.set(workspacePath, files);
    this.cacheValid = true;
  }

  invalidate(): void {
    this.cacheValid = false;
  }

  dispose(): void {
    this.watcher?.dispose();
  }
}

/**
 * Vibely Completion Provider
 * Provides:
 * 1. File path completion triggered by '@'
 * 2. Symbol completion triggered by '#' after a file path
 */
class VibelyCompletionProvider implements vscode.CompletionItemProvider {
  private readonly MAX_FILES = 1000;
  private readonly MAX_SYMBOLS = 100; // Limit symbols to avoid performance issues
  private fileCache = new FileCache();

  /**
   * Main completion entry point
   * Always checks if cursor is in a valid completion context:
   * - After '@' for file path completion
   * - After '@path#' for symbol completion
   */
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | undefined> {
    const lineText = document.lineAt(position.line).text;
    const textBeforeCursor = lineText.substring(0, position.character);

    // Check if we're in symbol completion context: @path/to/file#
    const symbolMatch = textBeforeCursor.match(/@([^\s#]+)#$/);
    if (symbolMatch) {
      return this.provideSymbolCompletion(document, position, textBeforeCursor, token);
    }

    // Check if we're in file completion context: @partial/path
    const fileMatch = textBeforeCursor.match(/@([^\s#]*)$/);
    if (fileMatch) {
      // If ends with #, provide symbol completion
      if (textBeforeCursor.endsWith('#')) {
        return this.provideSymbolCompletion(document, position, textBeforeCursor, token);
      }
      // Otherwise provide file completion
      return this.provideFileCompletion(document, position, textBeforeCursor, token);
    }

    return undefined;
  }

  /**
   * Provide file path completion using VSCode's built-in file discovery
   */
  private async provideFileCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
    textBeforeCursor: string,
    token: vscode.CancellationToken
  ): Promise<vscode.CompletionItem[]> {
    const match = textBeforeCursor.match(/@([^\s#:]*)$/);
    if (!match) {
      return [];
    }

    const partialPath = match[1];
    const atIndex = textBeforeCursor.lastIndexOf('@');

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      return [];
    }

    // Check cancellation
    if (token.isCancellationRequested) {
      return [];
    }

    // Get files (with caching)
    let files = this.fileCache.get(workspaceFolder.uri.fsPath);
    if (!files) {
      files = await vscode.workspace.findFiles(
        '**/*',
        '**/node_modules/**',
        this.MAX_FILES
      );
      if (!token.isCancellationRequested) {
        this.fileCache.set(workspaceFolder.uri.fsPath, files);
      }
    }

    if (token.isCancellationRequested) {
      return [];
    }

    const items: vscode.CompletionItem[] = [];
    const range = new vscode.Range(
      position.line,
      atIndex + 1,
      position.line,
      position.character
    );

    for (const file of files) {
      // Use VSCode's built-in relative path calculation
      const relativePath = vscode.workspace.asRelativePath(file, false);

      // Filter by partial path
      if (partialPath && !relativePath.includes(partialPath)) {
        continue;
      }

      const item = new vscode.CompletionItem(
        relativePath,
        vscode.CompletionItemKind.File
      );

      item.insertText = relativePath;
      item.range = range;
      item.filterText = relativePath; // Ensure filtering works on full path
      item.detail = file.fsPath;
      item.sortText = relativePath;

      items.push(item);
    }

    return items;
  }

  /**
   * Provide symbol completion using VSCode's symbol provider
   */
  private async provideSymbolCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
    textBeforeCursor: string,
    token: vscode.CancellationToken
  ): Promise<vscode.CompletionItem[]> {
    // Match @path/to/file# - extract file path before #
    const match = textBeforeCursor.match(/@([^\s#]+)#$/);
    if (!match) {
      return [];
    }

    const filePath = match[1];
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      return [];
    }

    // Resolve path using VSCode utilities
    const targetUri = this.resolveFileUri(filePath, workspaceFolder.uri);
    if (!targetUri) {
      return [];
    }

    if (token.isCancellationRequested) {
      return [];
    }

    // Use VSCode's symbol provider
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      targetUri
    );

    if (!symbols || symbols.length === 0) {
      return [];
    }

    const items: vscode.CompletionItem[] = [];

    // Calculate range: from after # to cursor position
    const lineText = document.lineAt(position.line).text;
    const hashIndexInLine = lineText.lastIndexOf('#', position.character);

    if (hashIndexInLine === -1) {
      return [];
    }

    const range = new vscode.Range(
      position.line,
      hashIndexInLine + 1,
      position.line,
      position.character
    );

    let count = 0;
    const processSymbols = (symbols: vscode.DocumentSymbol[], parentName = '') => {
      for (const symbol of symbols) {
        if (count >= this.MAX_SYMBOLS) {
          break;
        }

        const fullName = parentName ? `${parentName}.${symbol.name}` : symbol.name;

        const startLine = symbol.range.start.line + 1;
        const endLine = symbol.range.end.line + 1;

        const item = new vscode.CompletionItem({
          label: symbol.name,
          description: `Lines ${startLine}-${endLine}`
        }, this.symbolKindToCompletionKind(symbol.kind));

        // Use textEdit for precise control over replacement
        item.insertText = `:${startLine}-${endLine} ${fullName}`;
        item.range = range;
        item.sortText = `${String(symbol.range.start.line).padStart(6, '0')}-${symbol.name}`;

        items.push(item);
        count++;

        if (symbol.children?.length > 0) {
          processSymbols(symbol.children, fullName);
        }
      }
    };

    processSymbols(symbols);
    return items;
  }

  /**
   * Resolve file URI using VSCode workspace utilities
   */
  private resolveFileUri(
    filePath: string,
    workspaceUri: vscode.Uri
  ): vscode.Uri | undefined {
    try {
      if (path.isAbsolute(filePath)) {
        return vscode.Uri.file(filePath);
      }
      // Resolve relative to workspace root
      return vscode.Uri.joinPath(workspaceUri, filePath);
    } catch {
      return undefined;
    }
  }

  /**
   * Convert SymbolKind to CompletionItemKind
   */
  private symbolKindToCompletionKind(symbolKind: vscode.SymbolKind): vscode.CompletionItemKind {
    switch (symbolKind) {
      case vscode.SymbolKind.Function:
        return vscode.CompletionItemKind.Function;
      case vscode.SymbolKind.Method:
        return vscode.CompletionItemKind.Method;
      case vscode.SymbolKind.Class:
        return vscode.CompletionItemKind.Class;
      case vscode.SymbolKind.Interface:
        return vscode.CompletionItemKind.Interface;
      case vscode.SymbolKind.Variable:
        return vscode.CompletionItemKind.Variable;
      case vscode.SymbolKind.Constant:
        return vscode.CompletionItemKind.Constant;
      case vscode.SymbolKind.Property:
        return vscode.CompletionItemKind.Property;
      case vscode.SymbolKind.Enum:
        return vscode.CompletionItemKind.Enum;
      case vscode.SymbolKind.EnumMember:
        return vscode.CompletionItemKind.EnumMember;
      case vscode.SymbolKind.Struct:
        return vscode.CompletionItemKind.Struct;
      case vscode.SymbolKind.TypeParameter:
        return vscode.CompletionItemKind.TypeParameter;
      default:
        return vscode.CompletionItemKind.Reference;
    }
  }
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Vibely extension is now active!');

  const provider = new VibelyCompletionProvider();

  const selector: vscode.DocumentSelector = [
    { scheme: 'file', language: 'vibely' },
    { scheme: 'file', language: 'markdown' }
  ];

  // Register with both trigger characters for different contexts
  const completionDisposable = vscode.languages.registerCompletionItemProvider(
    selector,
    provider,
    '@',
    '#'
  );

  const triggerCommand = vscode.commands.registerCommand(
    'tingly-spec.triggerCompletion',
    () => vscode.commands.executeCommand('editor.action.triggerSuggest')
  );

  context.subscriptions.push(completionDisposable, triggerCommand);

  console.log('Vibely completion provider registered');
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Vibely extension deactivated');
}
