# Vibely File Reference Extension Spec

**Date:** 2025-01-10

## Overview

Implement a VSCode extension that provides intelligent file and symbol completion for `.vibely` and `.md` files. The extension adds custom autocomplete support for file references (triggered by `@`) and optionally for symbols within those files (triggered by `#` after a file path).

## Requirements

### 1. File Path Completion (`@` trigger)

When user types `@` in a `.vibely` or `.md` file:

- Display a list of files in the current workspace/project
- Support VSCode's built-in file search/filtering
- Insert the **relative path** from current file to selected file
- Keep the `@` prefix in the inserted text

**Examples:**
- `@frontend/src/app.tsx`
- `@go.mod`
- `@.github/workflows/ci.yaml`

### 2. Symbol Completion (`#` trigger after file)

After user has completed a file reference (e.g., `@frontend/src/app.tsx`) and types `#`:

- Parse the file path from the current line
- List available symbols in that file (functions, classes, variables, etc.)
- Insert symbol name with line range
- Format: `@filepath:lineStart-lineEnd SymbolName`

**Example:**
- User types `@` -> selects `frontend/src/app.tsx`
- Result: `@frontend/src/app.tsx`
- User types `#` -> selects `APP` symbol
- Result: `@frontend/src/app.tsx:45-90 APP`

**Fallback behavior:**
- If language not supported or no symbols found: silently ignore (no completion)

## Technical Design

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     VSCode Editor                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              CompletionItemProvider                      │
│  - Triggers on '@' and '#'                               │
│  - Delegates to specialized completers                   │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  FileCompleter       │        │  SymbolCompleter     │
│  - Lists files       │        │  - Lists symbols     │
│  - Relative paths    │        │  - Line ranges       │
└──────────────────────┘        └──────────────────────┘
```

### Key Components

#### 1. `VibelyCompletionProvider`
Implements `vscode.CompletionItemProvider` interface:
- `provideCompletionItems()` - Main entry point
- Detects trigger character (`@` or `#`)
- Routes to appropriate sub-completer

#### 2. `FileCompleter`
- Uses `vscode.workspace.findFiles()` for file discovery
- Calculates relative paths from current document
- Filters and sorts files by relevance
- Creates `CompletionItem` with appropriate `kind`

#### 3. `SymbolCompleter`
- Extracts file path from current line (using regex)
- Uses `vscode.executeDocumentSymbolProvider()` for symbol info
- Maps symbols to line ranges
- Handles unsupported languages gracefully

### Language Configuration

```json
{
  "languages": [{
    "id": "vibely",
    "aliases": ["Vibely", "vibely"],
    "extensions": [".vibely"],
    "configuration": "./language-configuration.json"
  }],
  "grammars": [{
    "language": "vibely",
    "scopeName": "source.vibely",
    "path": "./syntaxes/vibely.tmGrammar.json"
  }]
}
```

### Package.json Contributions

```json
{
  "activationEvents": [
    "onLanguage:vibely",
    "onLanguage:markdown"
  ],
  "contributes": {
    "languages": [{
      "id": "vibely",
      "aliases": ["Vibely", "vibely"],
      "extensions": [".vibely"],
      "configuration": "./language-configuration.json"
    }]
  }
}
```

## Implementation Details

### File Completion Algorithm

1. Get workspace folder from current document
2. Use `workspace.findFiles('**/*', null, maxResults)` to get files
3. For each file:
   - Calculate relative path from current document
   - Create `CompletionItem` with file icon
   - Add detail showing full path
4. Sort by relevance (current directory first, then deeper)

### Symbol Completion Algorithm

1. Parse current line to extract file path after `@`
2. Resolve file path relative to current document
3. Open target document (or use cached)
4. Call `executeDocumentSymbolProvider(targetUri)`
5. For each symbol:
   - Get range to calculate line numbers
   - Create `CompletionItem` with symbol kind
   - Format: `:start-end SymbolName`
6. If no symbols or error, return empty array

### Regex Patterns

```typescript
// Extract file path from line like "@frontend/src/app.tsx"
const FILE_PATH_PATTERN = /@([^\s#:]+)/;

// Check if we're after a file reference
const AFTER_FILE_PATTERN = /@([^\s#:]+)#/;
```

### File Path Resolution

```typescript
function resolveRelativePath(currentFile: string, targetFile: string): string {
  const currentDir = path.dirname(currentFile);
  return path.relative(currentDir, targetFile);
}
```

## Edge Cases

1. **File not found**: Don't show symbol completion
2. **Binary files**: Skip in file completion, show warning
3. **Large workspaces**: Limit file search results (default 1000)
4. **Symbol provider unavailable**: Silently return empty
5. **Multiple workspaces**: Use current document's workspace
6. **Circular references**: Detect and prevent infinite loops

## Testing Strategy

### Unit Tests
- File path resolution logic
- Regex pattern matching
- Symbol range calculation

### Integration Tests
- Completion in `.vibely` files
- Completion in `.md` files
- Multi-workfolder scenarios
- Unsupported language fallback

### Manual Testing
1. Create test `.vibely` file
2. Type `@` and verify file list appears
3. Select a file and verify relative path inserted
4. Type `#` after file and verify symbols appear
5. Select symbol and verify formatted insert

## Success Criteria

- [ ] `@` trigger shows file list in `.vibely` and `.md` files
- [ ] File paths are relative to current document
- [ ] `#` trigger shows symbols for supported languages
- [ ] Symbol insert format: `@filepath:lineStart-lineEnd SymbolName`
- [ ] No errors when symbols unavailable
- [ ] Works with multi-root workspaces
