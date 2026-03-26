# /sdlc

Software Development Lifecycle management with intelligent intent detection and harness.

## Usage

```bash
/sdlc [natural language request]  # Smart mode - AI detects intent
/sdlc [command] [args]             # Explicit command
```

## Quick Examples

```bash
# Smart mode - just describe what you want
/sdlc understand the codebase       # → phases:understand
/sdlc fix the login bug             # → workflows:bugfix
/sdlc add user authentication       # → workflows:feature
/sdlc review my changes             # → phases:cr
/sdlc commit my changes             # → phases:commit

# Explicit commands
/sdlc understand
/sdlc spec "Add OAuth"
/sdlc coding
/sdlc test
/sdlc commit
/sdlc pr
```

## Core Commands

| Command | Description | Skill Reference |
|---------|-------------|-----------------|
| `/sdlc guard [task]` | Safety guardrails before work | `phases:guard` |
| `/sdlc understand` | Build architecture cache | `phases:understand` |
| `/sdlc cr [scope]` | Code review - find issues | `phases:cr` |
| `/sdlc spec [title]` | Write specification | `phases:spec` |
| `/sdlc coding [desc]` | Write code | `phases:coding` |
| `/sdlc test [type]` | Run tests | `phases:test` |
| `/sdlc commit [msg]` | Commit changes | `phases:commit` |
| `/sdlc pr [action]` | Create/manage PR | `phases:pr` |
| `/sdlc debug [issue]` | Debug bugs | `phases:debug` |
| `/sdlc status` | Show workflow progress | `flow:status` |
| `/sdlc resume` | Browse recent work | `flow:resume` |

## Workflows

| Type | Workflow | Skill Reference |
|------|----------|-----------------|
| Minor changes | coding → test → commit | `workflows:minor` |
| New feature | understand → research → spec → coding → test → commit → pr | `workflows:feature` |
| Bug fix | understand → debug → coding → test → commit → pr | `workflows:bugfix` |
| Refactor | understand → spec → coding → test → commit → pr | `workflows:refactor` |
| Research | understand → research → doc → END | `workflows:research` |

## Natural Language Flow

```bash
/sdlc 做个登录功能          # Start feature workflow
继续 / 下一步                # Proceed to next phase
跳过测试                     # Skip current phase
到哪了？                     # Check status
```

## Output Structure

```
.sdlc/
├── state.json             # Workflow state
├── docs/                  # Working documents (flat)
│   ├── auth-user-login-20240115.spec.md
│   ├── auth-user-login-20240116.coding.md
│   └── payment-stripe-checkout-20240201.cr.md
├── harness/               # Verification harnesses
│   └── auth-flow-invariants-20240115.harness.md
└── arch/                  # Architecture cache
    ├── overview-20240115.arch.md
    └── auth-20240115.arch.md
```

### File Naming: `category-feature-date.type.md`

**Document Types**: `spec`, `coding`, `test`, `cr`, `debug`, `research`, `validate`, `secure`, `commit`, `pr`, `guard`, `harness`, `arch`

---

# Internal: Intent Detection & Routing

> This section is for AI execution only.

## Intent Detection

When `/sdlc` receives input:

1. **Check explicit commands first**
   ```
   guard|understand|cr|spec|harness|coding|test|validate|commit|pr|debug|research|secure|status|resume
   ```
   → Execute corresponding skill directly

2. **Detect workflow intents**
   - Bug fix: `fix|bug|issue|error|修复` → `workflows:bugfix`
   - Feature: `add|new feature|implement|添加|新功能` → `workflows:feature`
   - Refactor: `refactor|clean up|重构` → `workflows:refactor`

3. **Detect phase intents**
   - Understand (creates cache): `understand|analyze architecture|build context`
   - Explore (lightweight): `explore|show me|how does|explain|what is`
   - Review: `review|check|audit|find issues|检查`
   - Spec: `spec|specification|write spec|规范`
   - Research: `research|investigate|compare|研究`
   - Coding: `implement|code|write|build|实现`
   - Test: `test|run tests|测试`
   - Commit: `commit|save changes|提交`
   - PR: `pull request|pr|提交pr`

4. **Flow control (natural language)**
   - Continue: `continue|next|proceed|继续|下一步`
   - Skip: `skip|bypass|跳过`
   - Status: `status|progress|where am i|状态|到哪了`

## Skill Invocation Map

### Phase Skills
```
/sdlc guard     → phases:guard
/sdlc understand → phases:understand
/sdlc cr        → phases:cr
/sdlc spec      → phases:spec
/sdlc harness   → phases:harness
/sdlc coding    → phases:coding
/sdlc test      → phases:test
/sdlc validate  → phases:validate
/sdlc commit    → phases:commit
/sdlc pr        → phases:pr
/sdlc debug     → phases:debug
/sdlc research  → phases:research
/sdlc secure    → phases:secure
```

### Workflow Skills
```
bugfix workflow   → workflows:bugfix
feature workflow  → workflows:feature
refactor workflow → workflows:refactor
research workflow → workflows:research
minor workflow    → workflows:minor
```

### Flow Control
```
/sdlc status → flow:status
/sdlc resume → flow:resume
```

### Foundation Skills
```
foundation:archive     - Archive documentation
foundation:cache       - Manage architecture cache
foundation:discuss     - Discussion and collaboration
foundation:doc         - Documentation management
foundation:git         - Git operations
foundation:git-resolve - Resolve git conflicts
foundation:handoff     - Handoff between contexts
foundation:pencil      - Quick note-taking
```

## Routing Logic

```python
# Pseudo-code
if is_explicit_command(input):
    execute_skill(command_to_skill_map[input])
elif has_flow_control_intent(input):
    if wants_to_continue(): advance_to_next_phase()
    elif wants_to_skip(): skip_current_phase()
    elif wants_status(): execute_skill('flow:status')
elif has_bugfix_intent(input):
    execute_skill('workflows:bugfix', extract_description(input))
elif has_feature_intent(input):
    execute_skill('workflows:feature', extract_description(input))
elif has_refactor_intent(input):
    execute_skill('workflows:refactor', extract_description(input))
else:
    intent = detect_phase_intent(input)
    if intent: execute_skill(f'phases:{intent}')
    else: ask_for_clarification()
```

## Execution Feedback

Always show detected intent:
```
🎯 Detected: <intent>
📋 Scope: <scope>
→ Executing: <skill_reference>
```

## Key Behaviors

| Intent | Creates Files | Purpose |
|--------|--------------|---------|
| `understand` | ✅ `.sdlc/arch/`, `*.understand.md` | Reusable architecture cache |
| `cr` | ✅ `*.cr.md` | Code review with findings |
| `explore` | ❌ No files | Quick inspection only |

**When to use:**
- User says "explore/explain/how does" → Just read and explain (no skill)
- User says "understand/analyze architecture" → Execute `phases:understand`
- User says "review/check/find issues" → Execute `phases:cr`
