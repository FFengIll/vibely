# /sdlc phase

Jump to any phase - with or without an active workflow.

## Guideline

> **Jump to any phase, anytime!** You don't need an active workflow.
>
> - Have an active workflow? Jump within it.
> - No workflow? The phase command still works independently.

This skill:
1. Executes the target phase directly
2. If workflow exists, updates state
3. No prerequisites required - you're in control
4. Records the transition if tracking

## Philosophy

> **Developer freedom** - Jump from test back to spec. Skip research and go straight to coding. You know what you're doing.

## Input Format

```
/sdlc phase <phase_name>
/sdlc phase test
/sdlc phase verify
/sdlc phase commit
```

Natural language support:
```
去测试阶段         # Go to test phase
转到验证           # Switch to verify
jump to test       # Jump to test phase
go to secure       # Go to secure phase
切换到cr           # Switch to cr
```

## Valid Phases

### All Workflows
- `research` - Research and exploration
- `spec` - Specification document
- `coding` - Implementation
- `test` - Testing and validation
- `verify` - Requirements verification
- `secure` - Security checks
- `cr` - Code review
- `commit` - Commit changes
- `pr` - Pull request

### BUGFIX Only
- `debug` - Debug and investigation

### RESEARCH Only
- `doc` - Documentation
- `discuss` - Discussion

## Output Format

### Simple Phase Jump (No Workflow)

```
╔═══════════════════════════════════════════════════════════╗
║                 RUNNING: test →                            ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Running test suite...                                    ║
║                                                           ║
║  ━━━ Lint ━━━                                            ║
║  ✓ ESLint: 0 errors, 2 warnings                           ║
║                                                           ║
║  ━━━ Type Check ━━━                                      ║
║  ✓ TypeScript: No errors                                  ║
║                                                           ║
║  ALL TESTS PASSED ✓                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Phase Jump (With Active Workflow)

```
╔═══════════════════════════════════════════════════════════╗
║               JUMPING TO PHASE: test →                     ║
╠═══════════════════════════════════════════════════════════╣
║  From:      spec (completed)                              ║
║  To:        test                                          ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  💡 Jumped to test phase                                  ║
║  You can always go back with /sdlc phase <name>           ║
║                                                           ║
║  Running test suite...                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Phase Validation by Workflow Type

| Phase | FEATURE | BUGFIX | REFACTOR | RESEARCH |
|-------|---------|--------|----------|----------|
| research | ✓ | ✗ | ✗ | ✓ |
| spec | ✓ | ✗ | ✓ | ✗ |
| coding | ✓ | ✓ | ✓ | ✗ |
| debug | ✗ | ✓ | ✗ | ✗ |
| test | ✓ | ✓ | ✓ | ✗ |
| verify | ✓ | ✓ | ✓ | ✗ |
| secure | ✓ | ✓ | ✓ | ✗ |
| cr | ✓ | ✗ | ✓ | ✗ |
| commit | ✓ | ✓ | ✓ | ✗ |
| pr | ✓ | ✓ | ✓ | ✗ |
| doc | ✗ | ✗ | ✗ | ✓ |
| discuss | ✗ | ✗ | ✗ | ✓ |

## State Update

When jumping to a phase (if workflow exists):

```json
{
  "current_phase": "test",
  "previous_phase": "spec",
  "jump_history": [
    { "from": "spec", "to": "test", "at": "2026-03-08T14:30:00Z" }
  ]
}
```

## Completion Conditions

- [ ] Phase executed
- [ ] State updated (if workflow exists)
- [ ] User informed of result
