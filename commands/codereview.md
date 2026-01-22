# /codereview

Perform a comprehensive code review on the specified files, directories, or git changes.

## Usage

/codereview [target]

**Parameters:**
- `target` (optional): What to review
  - `--staged` - Review staged changes (default)
  - `--unstaged` - Review unstaged changes
  - `--all` - Review all uncommitted changes
  - `--branch [branch-name]` - Review changes compared to specified branch
  - `<file-path>` - Review specific file or directory
  - Leave empty to review staged changes

## Guidelines

### Review Scope
- **Code Quality**: Check for clean, maintainable, and well-structured code
- **Best Practices**: Verify adherence to language/framework conventions
- **Performance**: Identify potential performance bottlenecks or inefficient patterns
- **Security**: Look for common security vulnerabilities (XSS, SQL injection, etc.)
- **Error Handling**: Ensure proper error handling and edge cases are covered
- **Testing**: Check if appropriate tests exist and cover critical paths
- **Documentation**: Verify code is self-documenting or has comments where needed
- **Type Safety**: For TypeScript/Go, ensure type correctness

### Review Process
1. **Read & Understand**: Thoroughly read the code to understand its purpose
2. **Identify Issues**: Categorize findings by severity:
   - 🚨 **Critical**: Must fix (security, crashes, data loss)
   - ⚠️ **Major**: Should fix (performance, maintainability, bugs)
   - 💡 **Minor**: Nice to fix (style, minor improvements)
3. **Provide Solutions**: For each issue, suggest specific improvements
4. **Positive Feedback**: Acknowledge good patterns and practices used

### Language-Specific Checks

#### TypeScript/JavaScript
- Proper type annotations
- Null/undefined handling
- Async/await error handling
- Memory leaks (event listeners, subscriptions)
- Bundle size considerations

#### Go
- Error handling patterns (don't ignore errors)
- Goroutine safety and concurrency issues
- Resource cleanup (defer, close)
- Effective use of interfaces
- Package structure and exports

#### General
- Naming conventions
- Function/class size and complexity
- Code duplication
- Magic numbers/strings
- Comment quality

## Output Format

```
## Code Review Summary

**Target**: [files/changes reviewed]
**Files Changed**: [number]
**Total Issues**: [number]

### Issues Found (N issues)

[1] 🚨 Issue description - [file:line](file#line)
     - Impact: [description]
     - Suggestion: [specific fix]

[2] ⚠️ Issue description - [file:line](file#line)
     - Impact: [description]
     - Suggestion: [specific fix]

[3] ⚠️ Issue description - [file:line](file#line)
     - Impact: [description]
     - Suggestion: [specific fix]

[4] 💡 Suggestion - [file:line](file#line)
     - Suggestion: [specific improvement]

### ✅ Strengths
- [Good practice 1]
- [Good practice 2]

### Overall Assessment
[Brief summary and recommendations]

---
**💡 Tip**: Use issue numbers `[1]`, `[2]`, `[3]`... to request specific fixes
**Legend**: 🚨 Critical | ⚠️ Major | 💡 Minor
```

## Tips
- Be constructive and specific
- Provide code examples for improvements
- Consider the project's context and constraints
- Prioritize issues by impact
