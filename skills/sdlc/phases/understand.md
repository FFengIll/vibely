# Understand Phase Skill

Understands the current codebase, architecture, and implementation patterns to build context before making changes.

## Usage

```
/sdlc understand [scope]
```

## Description

Builds comprehensive knowledge of the existing codebase by analyzing architecture, mapping components, and creating cached documentation. Unlike `research` (which explores external technologies), `understand` focuses on **internal code comprehension**.

### When to Use

- **Onboarding**: When joining a project or working with unfamiliar code
- **Before changes**: Before implementing features, fixing bugs, or refactoring
- **Context building**: When you need to understand "how this works currently"
- **Architecture discovery**: When exploring how components are connected
- **Before writing specs**: To cache architecture knowledge for reuse

### What It Does

- Maps project structure and key components
- Identifies tech stack, frameworks, and dependencies
- Analyzes code patterns and conventions
- Documents module relationships and data flow
- **Creates architecture cache in `docs/arch/`**
- Identifies potential issues or technical debt

## Architecture Cache

### Cache Levels

Understand generates architecture cache at different levels based on scope:

| Level | Scope Pattern | TTL Reference | Output Path |
|-------|---------------|---------------|-------------|
| **Project** | No scope (entire project) | ~30 days | `docs/arch/{branch}/overview-arch.md` |
| **Module** | `src/[module]` or `[module]/` | ~14 days | `docs/arch/{branch}/[module]-arch.md` |
| **Sub-module** | `src/[module]/[sub]` | ~7 days | `docs/arch/{branch}/[module]/[sub]-arch.md` |
| **Component** | Deep dive into specific component | ~3 days | `docs/arch/{branch}/[module]/[sub]/[comp]-arch.md` |

> `{branch}` is the current git branch. Falls back to `main/` if branch cache doesn't exist.

### Cache File Format

Each cache file includes:

```markdown
# [Scope] Architecture

**Last Updated**: YYYY-MM-DD
**Cache Level**: Project|Module|Sub-module|Component
**Expires**: YYYY-MM-DD (~X days)
**Branch**: [branch-name]
**Hash**: [git commit hash]

## Overview
[High-level description]

## Components
[Component breakdown]

## Dependencies
[What this depends on]

## Integration Points
[How it connects to other parts]
```

### Reading Existing Cache

Before generating new cache, understand checks for existing cache:

```bash
# Get current branch
BRANCH=$(git branch --show-current)

# Priority order (most specific first)
docs/arch/${BRANCH}/[module]/[sub]/[comp]-arch.md  # Component level
docs/arch/${BRANCH}/[module]/[sub]-arch.md          # Sub-module level
docs/arch/${BRANCH}/[module]-arch.md                # Module level
docs/arch/${BRANCH}/overview-arch.md                # Project level
docs/arch/main/[module]-arch.md                       # Fallback to main
```

If cache exists and is fresh (within TTL, no code changes), understand reuses it instead of regenerating.

### Cache Invalidation

Cache is invalidated when:
- TTL has expired (reference only, check actual code changes)
- Git hash doesn't match current HEAD
- Files in scope have been modified
- Branch has changed (cache path differs)

```bash
# Check if cache is stale
BRANCH=$(git branch --show-current)
cache_hash=$(grep "Hash:" docs/arch/${BRANCH}/auth-arch.md)
current_hash=$(git rev-parse HEAD)
last_change=$(git log -1 --format=%cd --date=short -- src/auth/)

if [[ "$cache_hash" != "$current_hash" ]] || [[ "$last_change" > "$cache_created" ]]; then
    echo "Cache stale, regenerating"
fi
```

## Process

1. **Check Existing Cache**
   - Look for existing architecture cache in `docs/arch/`
   - Check if cache is fresh (hash comparison, file modification time)
   - Reuse if fresh, otherwise proceed to analysis

2. **Project Mapping**
   - Explore directory structure and organization
   - Identify entry points and key modules
   - Map component hierarchies and relationships

3. **Tech Stack Analysis**
   - Identify frameworks, libraries, and tools
   - Note dependencies and versions
   - Understand build tools and development setup

4. **Code Pattern Discovery**
   - Identify coding conventions and patterns
   - Note architectural patterns (MVC, microservices, etc.)
   - Understand state management and data flow

5. **Generate Architecture Cache**
   - Save to `docs/arch/[YYYYMMDD]-[scope]-arch.md`
   - Include hash for change detection
   - Set appropriate TTL based on level
   - Use branch directory for isolation
   - Update `docs/arch/cache-metadata.json` if needed

## Scope Options

```bash
/sdlc understand                # Entire project → overview-arch.md
/sdlc understand src/auth       # Auth module → auth-arch.md
/sdlc understand auth/login     # Login sub-module → auth/login-arch.md
/sdlc understand --deep         # Deeper analysis → detailed component cache
```

## Output Format

### Architecture Cache Template

```markdown
# [Scope] Architecture

**Last Updated**: YYYY-MM-DD
**Cache Level**: Project|Module|Sub-module|Component
**Expires**: YYYY-MM-DD (~X days)
**Branch**: [branch-name]
**Hash**: [git commit hash]
**Parent**: [parent-cache-file.md] (for sub-levels)

## Overview
[Purpose and responsibilities]

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| [Component] | [path] | [what it does] |

## Dependencies
- [Dependency 1] - [how it's used]
- [Dependency 2] - [how it's used]

## Data Flow
[How data flows through the system]

## Key Patterns
- [Pattern 1]: [description]
- [Pattern 2]: [description]

## Integration Points
- [Integration 1]: [how it connects]
- [Integration 2]: [how it connects]

## Related Areas
- [Related module/component]: [relationship]
```

## Output Locations

### Architecture Cache (Primary Output)

```
docs/arch/
├── main/
│   ├── overview-arch.md          # Project level
│   ├── auth-arch.md              # Module level
│   └── auth/login-arch.md        # Sub-module level
├── feature-a/
│   └── auth-arch.md              # Branch-specific cache
└── cache-metadata.json           # Cache metadata
```

### Understanding Reports (Secondary Output)

```
docs/understand/YYYYMMDD-[scope]-understanding.md
```

Examples:
- `docs/understand/20260308-full-project-understanding.md`
- `docs/understand/20260308-auth-module-understanding.md`

## Completion Checklist

- [ ] Checked for existing architecture cache
- [ ] Project structure mapped
- [ ] Key components identified
- [ ] Tech stack documented
- [ ] Code patterns noted
- [ ] Module relationships understood
- [ ] Dependencies mapped
- [ ] Architecture cache saved to `docs/arch/`
- [ ] Hash included for change detection
- [ ] Branch directory used for cache isolation
- [ ] Understanding report saved to `docs/understand/`

## Examples

### Example 1: Project Understanding (Creates overview cache)

```bash
/sdlc understand
```

Generates:
- `docs/arch/main/overview-arch.md` - Project architecture cache (~30 days)
- `docs/understand/20260308-full-project-understanding.md` - Full understanding report

Covers:
- Overall architecture and structure
- All major components and relationships
- Complete tech stack
- Code patterns and conventions

### Example 2: Module Understanding (Creates module cache)

```bash
/sdlc understand src/auth
```

Generates:
- `docs/arch/main/auth-arch.md` - Auth module cache (~14 days)
- `docs/understand/20260308-auth-module-understanding.md` - Module understanding

Focuses on:
- Auth module structure
- Authentication flow
- Integration with rest of app
- Dependencies and data flow

### Example 3: Sub-module Understanding (Creates sub-module cache)

```bash
/sdlc understand auth/login
```

Generates:
- `docs/arch/main/auth/login-arch.md` - Login component cache (~7 days)
- `docs/understand/20260308-login-understanding.md` - Detailed understanding

Focuses on:
- Login flow details
- Component structure
- Error handling
- Integration points

## Integration in Workflows

### Feature Development
```
understand → research → spec → coding → test → verify → commit → pr
```

### Bug Fix
```
understand → debug → coding → test → verify → commit → pr
```

### Refactor
```
understand → cr → spec → coding → test → verify → cr → commit → pr
```

### Spec Writing
```
# spec uses understand's cache
/sdlc understand src/auth    # Creates auth-arch.md
/sdlc spec "Add OAuth"       # Reads auth-arch.md for context
```

## Related Skills

- **/research** - External technology and solution research
- **/spec** - Uses architecture cache to write specifications
- **/debug** - Problem diagnosis (after understanding context)
- **/cr** - Code review and quality assessment
- **/pencil** - Create diagrams to visualize architecture
- **/doc** - Generate documentation from understanding

## Tips

- Use `understand` first when working with unfamiliar code
- Check existing cache before regenerating
- Architecture cache speeds up future spec writing
- Combine with `/pencil` for visual diagrams
- Re-run after significant changes to update cache
- Use specific scope for large codebases
- Notes on technical debt help prioritize refactor work

**See also**: `docs/arch/ARCH_CACHE_SYSTEM.md` for full cache documentation
