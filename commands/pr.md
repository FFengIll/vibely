# /pr

/pr summarizes a git branch and generates a PR title and description following the project's commit style.

## Usage

```
/pr [base-branch]
```

**Parameters:**
- `base-branch` (optional): The base branch to compare against (default: `main`)

## Guidelines

### Commit Style Pattern
The project uses conventional commits with lowercase prefixes:
- `bugfix:` - Bug fixes
- `feat:` - New features
- `command:` - Command-related changes
- `chore:` - Chores/maintenance
- `mv:` - File/directory moves
- `doc:` - Documentation changes
- `perf.` - Performance improvements (note the dot)

### PR Generation Process

1. **Analyze Branch Changes**
   - Run `git log <base-branch>..HEAD --oneline` to get commit history
   - Run `git diff <base-branch>..HEAD --stat` to see changed files
   - Identify the main theme and scope of changes

2. **Write PR Title**
   - Follow commit message style: `[prefix]: [brief description]`
   - Use lowercase for prefix and description
   - Keep it concise (under 72 characters)
   - If multiple commits with different prefixes, use the dominant one or `feat:` for features

3. **Write PR Description**
   - Start with a brief summary (1-2 sentences)
   - Categorize changes into **Major** and **Minor** sections
   - **Major**: Core functionality, significant features, important bugfixes
   - **Minor**: Small improvements, refactors, docs, trivial changes
   - Use `-` for bullet points, keep descriptions concise
   - Optionally include commit title in parentheses if it adds useful context
   - No fluff or generic statements

4. **Test Plan (Optional but Recommended)**
   - Add a checklist of testing items if applicable
   - Use `- [ ]` for unchecked items
   - Focus on critical paths and edge cases

### Output Format

```markdown
## Summary
[1-2 sentence summary of what this PR does and why]

### Major: *(optional: major title, recommend to set)*
- [Change description] 
- [Change description]

### Minor: *(optional: minor title)*
- [Change description] 
- [Change description]

## Test Plan
- [ ] [Test case 1]
- [ ] [Test case 2]
```

### Examples

**Input commits:**
```
feat: add user authentication
feat: add login form with validation
bugfix: fix token validation edge cases
chore: update dependencies
```

**Output PR:**
```
feat: add user authentication

## Summary
Add complete user authentication flow with JWT token management.

### Major: Authentication
- Add login form component with validation *(feat: add login form with validation)*
- Implement JWT token generation and validation
- Fix token validation edge cases *(bugfix: fix token validation)*

### Minor: Cleanup
- Update dependencies to latest versions
```

## Tips
- Group related commits logically in the description
- If the branch has many unrelated commits, suggest splitting it
- Use file paths from `git diff --stat` to be specific
- Reference related issues if applicable
