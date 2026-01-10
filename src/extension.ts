import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Vibely Completion Provider
 * Provides:
 * 1. File path completion triggered by '@'
 * 2. Symbol completion triggered by '#' after a file path
 */
class VibelyCompletionProvider implements vscode.CompletionItemProvider {
  // Maximum files to show in completion
  private readonly MAX_FILES = 1000;

  /**
   * Main completion entry point
   */
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | undefined> {
    const lineText = document.lineAt(position.line).text;
    const textBeforeCursor = lineText.substring(0, position.character);

    // Handle '#' trigger - symbol completion after file path
    if (context.triggerCharacter === '#' || textBeforeCursor.endsWith('#')) {
      return this.provideSymbolCompletion(document, position, textBeforeCursor);
    }

    // Handle '@' trigger - file path completion
    if (context.triggerCharacter === '@' || textBeforeCursor.includes('@')) {
      return this.provideFileCompletion(document, position, textBeforeCursor);
    }

    return undefined;
  }

  /**
   * Provide file path completion
   */
  private async provideFileCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
    textBeforeCursor: string
  ): Promise<vscode.CompletionItem[]> {
    // Extract the partial file path after @
    const match = textBeforeCursor.match(/@([^\s#:]*)$/);
    if (!match) {
      return [];
    }

    const partialPath = match[1];
    const atIndex = textBeforeCursor.lastIndexOf('@');

    // Get workspace folder
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (!workspaceFolder) {
      return [];
    }

    // Find all files in workspace
    const files = await vscode.workspace.findFiles(
      '**/*',
      '**/node_modules/**',
      this.MAX_FILES
    );

    const workspaceRoot = workspaceFolder.uri.fsPath;
    const items: vscode.CompletionItem[] = [];

    // Range to replace: from after '@' to current position
    const range = new vscode.Range(
      position.line,
      atIndex + 1,
      position.line,
      position.character
    );

    for (const file of files) {
      const filePath = file.fsPath;

      // Calculate relative path from workspace root (not current document)
      let relativePath = path.relative(workspaceRoot, filePath);

      // Normalize path separators
      relativePath = relativePath.split(path.sep).join('/');

      // Filter by partial path if user has started typing
      if (partialPath && !relativePath.includes(partialPath)) {
        continue;
      }

      const item = new vscode.CompletionItem(
        relativePath,
        vscode.CompletionItemKind.File
      );

      // Insert only the relative path, @ stays in place
      item.insertText = relativePath;
      item.range = range;

      // Show additional info
      item.detail = filePath;
      item.documentation = new vscode.MarkdownString(`File: \`${relativePath}\``);

      items.push(item);
    }

    return items;
  }

  /**
   * Provide symbol completion after file path
   */
  private async provideSymbolCompletion(
    document: vscode.TextDocument,
    position: vscode.Position,
    textBeforeCursor: string
  ): Promise<vscode.CompletionItem[]> {
    // Extract file path from pattern like @path/to/file#
    const match = textBeforeCursor.match(/@([^\s#:]+)#$/);
    if (!match) {
      return [];
    }

    const filePath = match[1];

    // Resolve the file path relative to workspace root
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

    if (!workspaceFolder) {
      return [];
    }

    const workspaceRoot = workspaceFolder.uri.fsPath;

    // Construct absolute path from workspace root
    let absolutePath: string;
    if (path.isAbsolute(filePath)) {
      absolutePath = filePath;
    } else {
      absolutePath = path.resolve(workspaceRoot, filePath);
    }

    // Normalize path
    absolutePath = absolutePath.split(path.sep).join('/');

    const targetUri = vscode.Uri.file(absolutePath);

    // Check if file exists
    try {
      await vscode.workspace.fs.stat(targetUri);
    } catch {
      // File doesn't exist
      return [];
    }

    // Get symbols for the target file
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      targetUri
    );

    if (!symbols || symbols.length === 0) {
      return [];
    }

    const items: vscode.CompletionItem[] = [];

    // Range to replace: the '#' character
    const range = new vscode.Range(
      position.line,
      position.character - 1,
      position.line,
      position.character
    );

    // Process symbols recursively
    const processSymbols = (symbols: vscode.DocumentSymbol[], parentName = '') => {
      for (const symbol of symbols) {
        const fullName = parentName ? `${parentName}.${symbol.name}` : symbol.name;

        const item = new vscode.CompletionItem(
          fullName,
          this.convertSymbolKind(symbol.kind)
        );

        // Format: :lineStart-lineEnd SymbolName
        const startLine = symbol.range.start.line + 1;
        const endLine = symbol.range.end.line + 1;

        // Replace '#' with the formatted text
        const insertText = `:${startLine}-${endLine} ${fullName}`;
        item.insertText = insertText;
        item.range = range;

        // Additional info
        item.detail = `Lines ${startLine}-${endLine}`;
        item.documentation = new vscode.MarkdownString(
          `Symbol **${fullName}** in \`${filePath}\`\n\n` +
          `Kind: \`${vscode.SymbolKind[symbol.kind]}\`\n` +
          `Range: ${startLine}:${symbol.range.start.character + 1} - ${endLine}:${symbol.range.end.character + 1}`
        );

        // Sort text for better ordering
        item.sortText = `${String(symbol.range.start.line).padStart(6, '0')}-${fullName}`;

        items.push(item);

        // Recursively process child symbols
        if (symbol.children && symbol.children.length > 0) {
          processSymbols(symbol.children, fullName);
        }
      }
    };

    processSymbols(symbols);

    return items;
  }

  /**
   * Convert vscode.SymbolKind to vscode.CompletionItemKind
   */
  private convertSymbolKind(symbolKind: vscode.SymbolKind): vscode.CompletionItemKind {
    switch (symbolKind) {
      case vscode.SymbolKind.Function:
      case vscode.SymbolKind.Method:
        return vscode.CompletionItemKind.Function;
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

  // Register completion provider for @ and # triggers
  const provider = new VibelyCompletionProvider();

  const selector: vscode.DocumentSelector = [
    { scheme: 'file', language: 'vibely' },
    { scheme: 'file', language: 'markdown' }
  ];

  const fileCompletionDisposable = vscode.languages.registerCompletionItemProvider(
    selector,
    provider,
    '@' // Trigger character for file completion
  );

  const symbolCompletionDisposable = vscode.languages.registerCompletionItemProvider(
    selector,
    provider,
    '#' // Trigger character for symbol completion
  );

  context.subscriptions.push(fileCompletionDisposable, symbolCompletionDisposable);

  console.log('Vibely completion provider registered for vibely and markdown files');
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('Vibely extension is now deactivated');
}
