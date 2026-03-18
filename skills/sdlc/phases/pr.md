# /pr

/pr generates pull request titles and descriptions based on code changes and feature logic. Works standalone or within SDLC workflows.

**Purpose**: Generate PR content that describes what changed and why, from a feature/logic perspective

## Usage

```
/pr [base-branch]
```

**Arguments:**
- `base-branch` (optional): The base branch to compare against (default: `main`)

**Actions:**
- No argument: Generate PR title and description
- `status` - Check PR status
- `merge` - Show merge readiness status

**Examples:**
- `/pr` - Generate PR title and description against main
- `/pr develop` - Generate PR content against develop branch
- `/pr status` - Check current PR status
- `/pr merge` - Show merge readiness status

**Standalone Use:**
```bash
# Use anytime without SDLC workflow
/pr
/pr develop
```

**SDLC Workflow Use:**
```bash
# Part of SDLC workflow - includes review requirements
/sdlc pr
/sdlc pr status
/sdlc pr merge
```

## Commit Style Pattern

The project uses conventional commits with lowercase prefixes:

- `bugfix:` - Bug fixes
- `feat:` - New features
- `command:` - Command-related changes
- `chore:` - Chores/maintenance
- `mv:` - File/directory moves
- `doc:` - Documentation changes
- `perf:` - Performance improvements

## PR Generation Process

### 1. Fetch Remote Base Branch (First - Blocking)

**Critical: Must complete before any git operations**

```bash
git fetch origin <base-branch>  # default: origin/main
```

**Important:** Run this step first and wait for completion. Do NOT run in parallel with subsequent git commands.

### 2. Understand Code Changes

```bash
git log <base-branch>..HEAD --oneline    # Reference: commit history for context
git diff <base-branch>..HEAD             # Primary: full diff - what actually changed
git diff <base-branch>..HEAD --stat      # Overview: changed files summary
```

**Focus on the diff** - The commit messages are only for context. The diff tells you:
- What features were added/removed/modified
- How the code logic changed
- What the user-facing impact is

### 3. Write PR Title

- Follow commit message style: `[prefix]: [brief description]`
- Use lowercase, keep under 72 characters
- If multiple commit types, use dominant one or `feat:`
- Describe the feature/logic change, not a summary of commits

### 4. Write PR Description

**Focus on feature logic and user impact, not commit history:**

- Start with brief summary (1-2 sentences) - what problem was solved
- Organize by **functional areas** or **logical changes**, not by commits
- **Major**: Core features, significant logic changes, user-facing functionality
- **Minor**: Implementation details, refactoring, cleanup
- Describe the end result and user-facing impact
- Think: "What would a reviewer need to know to understand this change?"

### 5. Test Plan (Optional)

- Add checklist with `- [ ]` for unchecked items
- Focus on critical paths and edge cases

## PR Output Format

```markdown
## Summary
[1-2 sentences: What problem was solved? What's the user-facing change?]

### Major: [Functional Area]
- [Feature/logic change and its impact]
- [Feature/logic change and its impact]

### Minor: [Implementation Details]
- [Refactoring, cleanup, or internal changes]
```

## Test Plan
- [ ] [Test case 1]
- [ ] [Test case 2]
```

## PR Examples

**Input commits:**
```
feat: add user authentication
feat: add login form with validation
bugfix: fix token validation edge cases
chore: update dependencies
```

**Output PR:**
```
refactor: unified provider command with interactive mode

## Summary
Consolidates fragmented provider management commands into a single interactive command, simplifying user workflow and improving code maintainability.

### Major: Provider Command UX
- Interactive mode replaces separate add/list/delete commands with a unified interface
- UUID-based lookups replace name-based operations for more reliable provider identification
- Single entry point for all provider operations (add, list, get, update, delete)

### Minor: Implementation
- Rename add.go to provider_add.go for consistency with new structure
- Add UUID-based CRUD methods to AppManager (DeleteProviderByUUID, UpdateProviderByUUID)
- Remove unused shell command and tool migration code
- Clean up terminal output by removing decorative icons
```

## Create PR

This skill generates the PR title and description. Use the output to create the PR manually or with your preferred tool.

## SDLC Mode Features

When used in SDLC workflow (`/sdlc pr`):

### Enhanced PR Status Check

```
━━━ Pull Request Status ━━━

PR: #45 - feat(auth): add JWT authentication
Branch: feature/user-auth → main
Status: Ready for review

━━━ Checks ━━━
✓ CI/CD Pipeline: Passing
  - Lint: ✓
  - Type Check: ✓
  - Unit Tests: ✓ (45/45)
  - Integration Tests: ✓ (12/12)
  - E2E Tests: ✓ (8/8)

✓ Code Coverage: 87% (target: 80%)
✓ Security Scan: No vulnerabilities

━━━ Review Status ━━━
Required reviewers: 2
✓ @alice - Approved
✓ @bob - Approved

━━━ Action ━━━
Ready to merge! Use `/sdlc pr merge` to complete.
```

### Merge Requirements (SDLC Mode)

**Required:**
- All CI/CD checks passing
- Code coverage threshold met
- Security scan clean
- Minimum approvals received
- No merge conflicts

### Enhanced Description Template (SDLC Mode)

```markdown
## Overview
[Brief description]

## Changes
- [Change 1]
- [Change 2]

## Type of Change
- [ ] Bug fix / New feature / Breaking change / Refactor / Documentation

## Testing
- [ ] Unit / Integration / E2E tests added
- [ ] All tests passing

## Documentation
- [ ] Spec linked
- [ ] API docs updated
- [ ] README updated (if needed)

## Related
- Spec: `docs/spec/YYYYMMDD-title.md`
- Test Report: `docs/test/YYYYMMDD-title-test-report.md`
- Verification: `docs/verify/YYYYMMDD-title-verification.md`
```

## Best Practices

### PR Hygiene
- **Keep PRs focused**: One feature or fix per PR
- **Keep PRs small**: Easier to review and merge
- **Use draft PRs**: For work in progress
- **Reference issues**: Link to related issue numbers

### Tips
- **Always fetch remote base branch first** - Ensures accurate diff
- **Read commits and diff together** - Unified view prevents fragmentation
- Group related commits logically
- If many unrelated commits, suggest splitting
- Use file paths from `git diff --stat` to be specific

## Completion Conditions

### For PR Creation
- [ ] PR title follows format
- [ ] PR description complete with template
- [ ] All related documents linked (SDLC only)
- [ ] PR created successfully

### For PR Merge
- [ ] All required approvals received (SDLC only)
- [ ] All checks passing (SDLC only)
- [ ] No merge conflicts
- [ ] PR merged successfully
- [ ] Branch deleted (if applicable)
- [ ] PR logged to documentation (SDLC only)

## State Integration

- **Updates**: `sdlc.phase` = `pr`
- **Creates**: Pull request
- **Creates**: PR log in `docs/pr/` (SDLC only)
- **Requires**: `commit` phase completed (SDLC only)
- **Next**: After merge, workflow complete (SDLC only)

## Related Skills

- `/commit` - Prerequisite: commits must exist to create PR
- `/git` - Low-level git operations (branch, checkout, merge)
- `/sdlc cr` - (SDLC only) Code review that happens before PR review
- `/sdlc test` - (SDLC only) Tests that must pass for PR checks
