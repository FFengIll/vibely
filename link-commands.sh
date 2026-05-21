#!/bin/bash

# Script to symlink project files to ~/.claude/commands
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_COMMANDS_DIR="$HOME/.claude/commands"

mkdir -p "$CLAUDE_COMMANDS_DIR"

# Link sdlc.md -> ~/.claude/commands/sdlc.md
ln -sf "$PROJECT_DIR/sdlc.md" "$CLAUDE_COMMANDS_DIR/sdlc.md"
echo "Linked: sdlc.md -> $PROJECT_DIR/sdlc.md"

# Link SKILL.md -> ~/.claude/commands/SKILL.md
ln -sf "$PROJECT_DIR/SKILL.md" "$CLAUDE_COMMANDS_DIR/SKILL.md"
echo "Linked: SKILL.md -> $PROJECT_DIR/SKILL.md"

# Link workflow -> ~/.claude/commands/workflow
ln -sf "$PROJECT_DIR/workflow" "$CLAUDE_COMMANDS_DIR/workflow"
echo "Linked: workflow -> $PROJECT_DIR/workflow"

# Link action -> ~/.claude/commands/action
ln -sf "$PROJECT_DIR/action" "$CLAUDE_COMMANDS_DIR/action"
echo "Linked: action -> $PROJECT_DIR/action"

echo ""
ls -la "$CLAUDE_COMMANDS_DIR" | grep -E "workflow|action|sdlc.md|SKILL.md"
