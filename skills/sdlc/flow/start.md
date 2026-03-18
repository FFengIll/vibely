# /sdlc start

**OPTIONAL** - Start a workflow with state tracking.

## Guideline

> **You don't need to run this!** Each phase works independently.
>
> Use `/sdlc start` only if you want to track progress.

## Workflow Types

| Type | Description | Initial Phase |
|------|-------------|---------------|
| **minor** | Minor modifications (user-specified) | coding |
| **quick** | Small changes/hotfix | coding |
| **feature** | New feature | research |
| **bugfix** | Bug fix | debug |
| **refactor** | Refactoring | cr |
| **research** | Research | research |

## Phase Sequences

```
MINOR:    coding → test → commit
QUICK:    coding → test → commit → pr
FEATURE:  research → spec → coding → test → verify → commit → pr
BUGFIX:   debug → coding → test → verify → commit → pr
REFACTOR: cr → spec → coding → test → verify → commit → pr
RESEARCH: research → doc → END
```

## Input Format

```bash
/sdlc start minor "Update button color"
/sdlc start quick "Fix typo"
/sdlc start feature "User auth"
/sdlc start bugfix "Fix login"
/sdlc start research "Compare frameworks"
```

## Output Format

```
═══ SDLC Workflow Started ═══

Type:  quick
Title: Fix typo
Phase: coding →

─────────────────────────────
/sdlc next to continue
```

## Completion Conditions

- [ ] Workflow type selected
- [ ] Title provided
- [ ] State file created
- [ ] Initial phase set
