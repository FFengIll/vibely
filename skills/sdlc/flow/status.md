# /sdlc status

Check and display the current SDLC workflow status.

## Guideline

This skill reads and displays the current workflow state from `.sdlc/state.json`. It shows:
1. Workflow type and title
2. Current phase and its status
3. Progress through all phases
4. Next available actions
5. Any blocked or incomplete phases

## Output Format

```markdown
## SDLC Workflow Status

**Type**: FEATURE
**Title**: User authentication system
**Started**: 2026-03-08 10:00:00 UTC
**Updated**: 2026-03-08 14:32:15 UTC

### Progress: 60%

### Phases

- ✅ **research** - COMPLETED (10:00 - 10:45, 45m)
- ✅ **spec** - COMPLETED (10:45 - 12:30, 1h 45m)
- ✅ **coding** - COMPLETED (12:30 - 14:00, 1h 30m)
- 🔄 **test** - IN PROGRESS (started 14:00)
  - ⏳ lint - PENDING
  - ⏳ typecheck - PENDING
  - ⏳ format - PENDING
  - ⏳ unit - PENDING
  - ⏳ integ - PENDING
  - ⏳ e2e - PENDING
  - ⏳ coverage - PENDING
- ⏳ **verify** - PENDING
- ⏳ **secure** - PENDING
- ⏳ **cr** - PENDING
- ⏳ **commit** - PENDING
- ⏳ **pr** - PENDING

### Current Phase: test
**Status**: Running lint checks...

### Next Actions
- `/sdlc next` - Proceed to next phase
- `/sdlc test` - Run specific test checks
- `/sdlc skip` - Skip current phase
- `/sdlc phase cr` - Jump to specific phase
```

## Status Values

| Status | Symbol | Description |
|--------|--------|-------------|
| COMPLETED | ✓ | Phase finished successfully |
| IN PROGRESS | → | Currently running |
| PENDING | ○ | Not started yet |
| SKIPPED | ⊘ | Intentionally skipped |
| FAILED | ✗ | Failed with errors |

## No Active Workflow

If no workflow is active:

```markdown
## No Active Workflow

Start a new workflow:
- `/sdlc start minor "Quick modification description"`
- `/sdlc start quick "Small change description"`
- `/sdlc start feature "New feature description"`
- `/sdlc start bugfix "Bug description"`
- `/sdlc start refactor "What to refactor"`
- `/sdlc start research "Research topic"`
```

## Detailed Phase Status

For phases with sub-steps (like test), show detailed progress:

```
test [IN PROGRESS]
├─ ✓ lint       COMPLETED  (2s, 0 errors)
├─ ✓ typecheck  COMPLETED  (5s, 0 errors)
├─ → format     RUNNING...
├─ ○ unit       PENDING
├─ ○ integ      PENDING
├─ ○ e2e        PENDING
└─ ○ coverage   PENDING
```

## Completion Conditions

- [ ] State file read successfully
- [ ] Current workflow type displayed
- [ ] All phase statuses shown
- [ ] Next actions suggested
- [ ] Progress visualization provided
