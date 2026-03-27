# Changelog: feedback v1.1.0 → v1.2.0

**Date**: 2026-03-27
**Skill**: `feedback`

## User Feedback Summary
Changelog/backup paths were saving to project `.sdlc/` instead of global location, causing mixed concerns between project and global command tracking.

## Changes Applied
1. Created dedicated `~/.sdlc.feedback/` directory structure
2. Updated all backup paths: `.sdlc/changelog/backup/` → `~/.sdlc.feedback/changelog/backup/`
3. Updated all changelog paths: `.sdlc/changelog/` → `~/.sdlc.feedback/changelog/`
4. Updated all feedback doc paths: `.sdlc/docs/` → `~/.sdlc.feedback/docs/`

## Impact
Global command history now properly separated from project-specific `.sdlc/` tracking. Cleaner separation of concerns.
