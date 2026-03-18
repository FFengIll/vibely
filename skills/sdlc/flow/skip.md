# /sdlc skip

Skip the current phase in the SDLC workflow.

## Guideline

**You can skip any phase.** You know what you're doing - this tool won't judge.

This skill:
1. Updates the current phase status to "skipped"
2. Optionally records a skip reason
3. Advances to the next phase
4. Shows a friendly reminder (not a warning)

## Philosophy

> **Trust the developer** - You know when to skip research because requirements are clear. You know when to skip tests because you ran them manually. We're here to help, not to enforce.

## Input Format

```
/sdlc skip
/sdlc skip --reason "Already tested locally"
/sdlc skip -r "Requirements already known"
```

Natural language support:
```
跳过          # Skip current phase
skip          # Skip
略过          # Skip / Bypass
bypass        # Bypass
next          # Move to next phase
```

## All Phases Can Be Skipped

| Phase | Common Reason |
|-------|---------------|
| research | Requirements already known |
| spec | Simple change, no spec needed |
| coding | Already implemented |
| test | Already tested locally |
| verify | No spec to verify against |
| secure | Internal tool, skipping for now |
| cr | Self-reviewed or will review later |
| commit | Will commit manually |
| pr | Direct merge approved |

## Output Format

```
╔═══════════════════════════════════════════════════════════╗
║                    PHASE SKIPPED ⊘                         ║
╠═══════════════════════════════════════════════════════════╣
║  Phase:    research                                       ║
║  Reason:   Requirements already known                     ║
║  Next:     spec →                                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Proceeding to specification phase.                       ║
║                                                           ║
║  💡 Tip: You can always come back to research with        ║
║  /sdlc phase research if needed later.                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## State Update

When a phase is skipped, the state is updated:

```json
{
  "phases": {
    "test": {
      "status": "skipped",
      "started_at": "2026-03-08T14:00:00Z",
      "completed_at": "2026-03-08T14:01:23Z",
      "skip_reason": "Manual testing completed"
    }
  }
}
```

## Common Skip Reasons

| Reason | When to Use |
|--------|-------------|
| "Requirements already known" | research |
| "Simple change, no spec needed" | spec |
| "Already implemented" | coding |
| "Already tested locally" | test |
| "No spec to verify against" | verify |
| "Will do security review later" | secure |
| "Self-reviewed, good to go" | cr |
| "Will commit manually" | commit |
| "Direct merge approved" | pr |

## Completion Conditions

- [ ] Phase status updated to "skipped"
- [ ] Reason recorded (if provided)
- [ ] Next phase identified
- [ ] State updated
