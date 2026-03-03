# /codeclean

Identify unused code candidates in the specified scope by analyzing code usage across the project.

## Guideline

1. **Validate scope first**
   - If no scope specified, ask user to specify target (file, directory, or glob pattern)
   - Verify the target exists before proceeding
   - Common patterns: `src/utils/`, `*.ts`, `src/components/**/*.tsx`

2. **Analyze code usage**
   - Read all files in the specified scope
   - For each code element (functions, classes, variables, types, exports), search the project for references
   - Use appropriate search tools:
     - For functions/methods: search by function name in code patterns
     - For classes/types: search by class/type name
     - For exports: search import statements and usage patterns
   - Check test files, other source files, and configuration files

3. **Identify cleanup candidates**
   - Code with zero or only self-referential usage
   - Duplicated code (near duplicates across files)
   - Dead code (commented-out blocks, unreachable code)
   - Unused imports/dependencies
   - Unused type definitions

4. **Present findings**
   - List all candidates grouped by type (functions, classes, types, imports)
   - Show file path and line number for each candidate
   - Include brief rationale for why it's a candidate
   - Present as a numbered list for easy reference

5. **Get user confirmation**
   - ALWAYS ask user to confirm before any deletions
   - User can select specific items by number or choose "all"
   - Present total count and risk assessment
   - Allow user to skip or abort at any time

6. **Execute cleanup**
   - Only after explicit user confirmation
   - Delete or comment out unused code as appropriate
   - Remove unused imports first (safest)
   - Handle related cleanup (e.g., if a type is unused but a function uses it, flag both)
   - Report what was cleaned and what was skipped

## Usage

```bash
/codeclean <scope>
```

**Examples:**
```bash
/codeclean src/utils/
/codeclean *.ts
/codeclean src/components/
/codeclean pkg/api/
```

## Output Format

```
## Code Cleanup Analysis

**Scope**: [specified scope]
**Files Analyzed**: [number]
**Candidates Found**: [number]

### Unused Functions (N)
[1] `functionName` - [path/file.ts:line](path/file.ts#Lline)
   - Rationale: No references found in project

[2] `anotherFunction` - [path/file.ts:line](path/file.ts#Lline)
   - Rationale: Only referenced in same file (internal use only)

### Unused Classes (N)
[3] `ClassName` - [path/file.ts:line](path/file.ts#Lline)
   - Rationale: No instantiations or references found

### Unused Types (N)
[4] `TypeName` - [path/file.ts:line](path/file.ts#Lline)
   - Rationale: Not used in any function signature or variable

### Unused Imports (N)
[5] `import { unused } from './module'` - [path/file.ts:line](path/file.ts#Lline)
   - Rationale: Import not referenced in file

### Dead Code (N)
[6] Commented-out function block - [path/file.ts:line-line](path/file.ts#Lline-Lline)
   - Rationale: Commented code that can be removed

### ⚠️ Manual Review Required
- [file:element] - Reason for manual verification

---

**⚠️ Important**: Review the list above and confirm which items to clean.
**Options**: Specify numbers (e.g., "1,3,5"), "all", or "none"
```

## Language-Specific Patterns

### TypeScript/JavaScript
- Search for function names in `\.funcName\(`, `\.funcName = `, `\.funcName\s*\(` patterns
- Check export statements and import usage
- Look for React component usage in JSX tags
- Check type usage in type annotations and interfaces

### Go
- Search for function names as `funcName\(`, `\.funcName\(` patterns
- Check exported functions (capitalized) across packages
- Look for type usage in function signatures and struct fields
- Check interface implementations

## Important Notes
- Always verify before marking as unused—some code may be used in dynamic ways (reflection, string-based calls)
- Test files are included in search scope
- External dependencies and configuration files may reference code
- Some "unused" code may be part of a public API meant for external consumers