# /sdlc

Software Development Lifecycle management with intelligent intent detection.

## Usage

```bash
/sdlc [natural language request]  # Smart mode - AI detects intent
/sdlc [command] [args]             # Explicit command
```

## Quick Start

```bash
# Smart mode - just describe what you want
/sdlc understand the codebase       # → /sdlc understand
/sdlc fix the login bug             # → bugfix workflow
/sdlc add user authentication       # → feature workflow
/sdlc run tests                     # → /sdlc test
/sdlc commit my changes             # → /sdlc commit

# Explicit commands
/sdlc understand
/sdlc spec "Add OAuth"
/sdlc coding
/sdlc test
/sdlc commit
```

## Intent Detection

| Your Request | Detected Action |
|--------------|----------------|
| "understand the codebase" | `/sdlc understand` |
| "write a spec for auth" | `/sdlc spec` |
| "implement login" | `/sdlc coding` |
| "run tests" | `/sdlc test` |
| "fix the login bug" | bugfix workflow |
| "add user API" | feature workflow |
| "修复登录bug" | bugfix workflow (中文) |

## Commands

| Command | Description |
|---------|-------------|
| `/sdlc understand` | Build context, create architecture cache |
| `/sdlc spec [name]` | Write specification |
| `/sdlc coding [desc]` | Write code based on spec |
| `/sdlc test [type]` | Run tests (lint + unit + e2e) |
| `/sdlc verify [spec]` | Check vs spec |
| `/sdlc commit [msg]` | Commit changes |
| `/sdlc pr [action]` | Create/manage PR |
| `/sdlc debug [issue]` | Debug bugs |
| `/sdlc research [topic]` | Research solutions |

## Workflows

| Type | Description | Workflow |
|------|-------------|----------|
| `minor` | Minor modifications | coding → test → commit |
| `quick` | Small changes | understand → spec → coding → test → commit → pr |
| `feature` | New features | understand → research → spec → coding → test → verify → commit → pr |
| `bugfix` | Bug fixes | understand → debug → coding → test → verify → commit → pr |
| `research` | Research | understand → research → doc → END |

```bash
/sdlc start quick "Fix typo"     # Start workflow
/sdlc next                       # Next phase
/sdlc status                     # Show progress
/sdlc end                        # End workflow
```

## Examples

```bash
# Understanding
/sdlc understand the codebase
/sdlc explore the payment module

# Specification
/sdlc write a spec for user authentication
/sdlc create specification for OAuth

# Implementation
/sdlc implement the login feature
/sdlc write code for user profile

# Testing & Debugging
/sdlc run all tests
/sdlc debug the login timeout issue

# Commit & PR
/sdlc commit my changes
/sdlc create a pull request

# Workflows
/sdlc fix the login bug           # → bugfix workflow
/sdlc add user API endpoints      # → feature workflow
/sdlc refactor the auth module    # → refactor workflow
```

## Output Locations

```
docs/
├── spec/       # Specs
├── research/   # Research docs
├── verify/     # Verification reports
└── archive/    # Archived docs

.sdlc/state.json  # Workflow state
```

## Best Practices

1. **Always start with `/sdlc understand`** - Build context and create architecture cache
2. **Always write specs with `/sdlc spec`** - Document what you're doing
3. **Use smart mode for convenience** - Let AI detect the workflow
4. **Use explicit commands for precision** - When you know exactly what phase you need

## Migration Notes

| Old Command | New Command |
|-------------|-------------|
| `/spec` | `/sdlc spec` |
| `/git-commit` | `/commit` or `/sdlc commit` |
| `/codereview` | `/sdlc cr` |

**`/commit` and `/pr` are now standalone** - use anytime without starting an SDLC workflow.

---

# Internal: Intent Detection & Routing

> This section is for model execution. The simplified documentation above is for users.

## Intent Detection Process

When `/sdlc` is invoked with arbitrary input:

1. **Check for explicit commands first**
   - If input matches `understand|spec|coding|test|verify|commit|pr|debug|research|cr|secure`
   - Execute the corresponding phase skill directly

2. **Analyze for workflow-level intents**
   - Bug fix: `fix|bug|issue|error|problem|修复|调试`
   - Feature: `add|new feature|implement|feature|添加|新功能|实现`
   - Refactor: `refactor|clean up|restructure|重构`

3. **Analyze for phase-level intents**
   - Understand: `understand|explore|how does|explain|architecture|codebase|了解|理解|探索`
   - Spec: `spec|specification|document requirements|write spec|规范|规格|文档`
   - Research: `research|investigate|compare|best practices|研究|调研|比较`
   - Coding: `implement|code|write|build|create|develop|实现|编写|开发`
   - Test: `test|run tests|verify|check|validate|测试|运行测试`
   - Commit: `commit|save changes|提交|保存`
   - PR: `pull request|pr|submit|提交pr`

4. **Extract context**
   - Git status (uncommitted changes?)
   - Current branch name
   - Active workflow state
   - Recent specs

5. **Route and execute**
   - Show detected intent
   - Execute appropriate skill or workflow

## Routing Map

```python
# Pseudo-code for routing
if is_explicit_command(input):
    execute_phase_skill(input)
elif has_bugfix_intent(input):
    execute_workflow('bugfix', extract_description(input))
elif has_feature_intent(input):
    execute_workflow('feature', extract_description(input))
elif has_refactor_intent(input):
    execute_workflow('refactor', extract_description(input))
else:
    # Phase-level intents
    intent = detect_phase_intent(input)
    if intent:
        execute_phase_skill(intent)
    else:
        ask_for_clarification()
```

## Skill Invocations

When routing to a specific phase, invoke:
- `/sdlc understand` → read `skills/phases/understand.md`
- `/sdlc spec` → read `skills/phases/spec.md`
- `/sdlc coding` → read `skills/phases/coding.md`
- `/sdlc test` → read `skills/phases/test.md`
- `/sdlc commit` → read `skills/phases/commit.md`
- `/sdlc pr` → read `skills/phases/pr.md`

When routing to a workflow, invoke:
- bugfix → read `skills/workflows/bugfix.md`
- feature → read `skills/workflows/feature.md`
- refactor → read `skills/workflows/refactor.md`
- research → read `skills/workflows/research.md`

## Context Extraction

```bash
# Get git status
git_status=$(git status --porcelain)

# Get current branch
current_branch=$(git branch --show-current)

# Check for active workflow
if [ -f .sdlc/state.json ]; then
    active_workflow=$(jq -r '.workflow' .sdlc/state.json)
    current_phase=$(jq -r '.phase' .sdlc/state.json)
fi

# Get latest spec
latest_spec=$(find docs/spec -name "*.md" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")
```

## Execution Feedback

Always show what was detected before executing:

```
🎯 Detected intent: <intent>
📋 Scope: <extracted_scope>
→ Executing: <command or workflow>
```
