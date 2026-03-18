# /sdlc next

Execute the next phase in the current SDLC workflow.

## Guideline

> **No active workflow? No problem!** You can still use individual phases directly.
>
> - Just want to test? Run `/sdlc test`
> - Just want to commit? Run `/sdlc commit`
> - Just want to create a PR? Run `/sdlc pr`

This skill automatically advances the workflow to the next phase. It:
1. Reads current state from `.sdlc/state.json` (if exists)
2. Identifies the next incomplete phase
3. Updates phase status to "in_progress"
4. Executes the phase-specific logic
5. Updates state after completion

**If no workflow is active**, it will suggest running phases independently.

## Input Format

```
/sdlc next
/sdlc next --auto              # Run without confirmation
/sdlc next --skip-checks       # Skip verification checks
```

Natural language support:
```
继续          # Continue to next phase
下一步         # Next step
proceed       # Proceed
continue      # Continue
```

## Phase Transitions

### MINOR flow
```
coding    →  (Direct edit - user specified changes)
test      →  /sdlc test [lint+format]
commit    →  /sdlc commit
```

### QUICK flow
```
understand →  /sdlc understand [scope]
spec       →  /sdlc spec "Quick spec"
coding     →  (Manual coding - user prompted)
test       →  /sdlc test [checks]
commit     →  /sdlc commit
pr         →  /sdlc pr
```

### FEATURE flow
```
research  →  /sdlc research "Research context"
spec      →  /sdlc spec "Specification details"
coding    →  (Manual coding - user prompted)
test      →  /sdlc test [checks]
verify    →  /sdlc verify [spec_file]
secure    →  /sdlc secure [checks]
cr        →  /sdlc cr
commit    →  /sdlc commit
pr        →  /sdlc pr
```

### BUGFIX flow
```
debug     →  /sdlc debug "Issue description"
coding    →  (Manual coding - user prompted)
test      →  /sdlc test [checks]
verify    →  /sdlc verify [spec_file]
secure    →  /sdlc secure [checks]
commit    →  /sdlc commit
pr        →  /sdlc pr
```

### REFACTOR flow
```
cr        →  /sdlc cr
spec      →  /sdlc spec "Refactoring plan"
coding    →  (Manual coding - user prompted)
test      →  /sdlc test [checks]
verify    →  /sdlc verify [spec_file]
secure    →  /sdlc secure [checks]
cr        →  /sdlc cr (final review)
commit    →  /sdlc commit
pr        →  /sdlc pr
```

### RESEARCH flow
```
research  →  /sdlc research "Research topic"
doc       →  /sdlc doc
discuss   →  (Discussion prompt)
```

## Output Format

### Automatic Progression
```
╔═══════════════════════════════════════════════════════════╗
║                  PROCEEDING TO NEXT PHASE                  ║
╠═══════════════════════════════════════════════════════════╣
║  Previous: spec ✓ COMPLETED                               ║
║  Current:  coding →                                       ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Phase: coding                                            ║
║  Type: Manual                                             ║
║                                                           ║
║  Please implement the specification:                      ║
║  → ./docs/spec/20260308-user-auth.md                      ║
║                                                           ║
║  When complete, run /sdlc next to proceed to testing.     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Automatic Execution
```
╔═══════════════════════════════════════════════════════════╗
║                  PROCEEDING TO NEXT PHASE                  ║
╠═══════════════════════════════════════════════════════════╣
║  Previous: coding ✓ COMPLETED                             ║
║  Current:  test →                                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Running test suite...                                    ║
║                                                           ║
║  ━━━ Lint ━━━                                            ║
║  ✓ ESLint: 0 errors, 2 warnings                           ║
║  ✓ Prettier: Formatted 3 files                            ║
║                                                           ║
║  ━━━ Type Check ━━━                                      ║
║  ✓ TypeScript: No errors                                  ║
║                                                           ║
║  ━━━ Unit Tests ━━━                                      ║
║  ✓ 45/45 passed (234ms)                                   ║
║                                                           ║
║  ALL TESTS PASSED ✓                                      ║
║                                                           ║
║  Phase completed. Run /sdlc next to continue.              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Workflow Completion

When all phases are complete:

```
╔═══════════════════════════════════════════════════════════╗
║                   WORKFLOW COMPLETED ✓                     ║
╠═══════════════════════════════════════════════════════════╣
║  Type:     FEATURE                                         ║
║  Title:    User authentication system                     ║
║  Duration: 6h 23m                                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  All phases completed:                                    ║
║    ✓ research     45m                                     ║
║    ✓ spec         1h 45m                                  ║
║    ✓ coding       1h 30m                                  ║
║    ✓ test         45m                                     ║
║    ✓ verify       30m                                     ║
║    ✓ secure       15m                                     ║
║    ✓ cr           45m                                     ║
║    ✓ commit       5m                                      ║
║    ✓ pr           1h 43m                                  ║
║                                                           ║
║  Next steps:                                              ║
║    • Merge the pull request                               ║
║    • Close the workflow with /sdlc close                  ║
║    • Start a new workflow with /sdlc start                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Error Handling

### Phase Failed
```
✗ Phase 'test' failed

Errors found:
  • 2 unit tests failed
  • 1 type check error

Fix issues and run /sdlc test again, or use /sdlc skip to proceed anyway.
```

### No Active Workflow

```
╔═══════════════════════════════════════════════════════════╗
║              NO ACTIVE WORKFLOW - NO PROBLEM!              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  You can use any phase independently:                     ║
║                                                           ║
║  /sdlc research   - Start research phase                  ║
║  /sdlc spec       - Create specification                  ║
║  /sdlc test       - Run tests                             ║
║  /sdlc verify     - Verify against spec                   ║
║  /sdlc secure     - Security checks                       ║
║  /sdlc cr         - Code review                           ║
║  /sdlc commit     - Commit changes                        ║
║  /sdlc pr         - Create pull request                   ║
║                                                           ║
║  Or start a tracked workflow:                             ║
║  /sdlc start feature "Your feature name"                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Completion Conditions

- [ ] Current phase validated
- [ ] Next phase identified
- [ ] Phase transition executed
- [ ] State updated
- [ ] Result communicated
