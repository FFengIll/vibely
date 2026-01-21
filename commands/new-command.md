# /new-command

/new-command creates or updates a slash command definition based on user requirements.

## Usage
```
/new-command <command-name> [description]
```

When invoked without arguments, it will guide you to define a new command. When provided with an existing command name, it updates that command.

## Guideline

### Command Structure
- Each command is a Markdown file in the `commands/` directory
- Filename (without `.md`) becomes the slash command name
- Supports namespacing through subdirectories, e.g., `frontend/style.md` → `/frontend:style`

### Definition Process
1. **Understand Intent**: Clarify what the command should accomplish
2. **Choose Name**: Pick a clear, concise name following existing patterns
3. **Write Content**:
   - Brief description of the command's purpose
   - Guidelines section with specific instructions
   - Examples or parameters if applicable
4. **Reference Existing**: If updating, read the existing command first and preserve useful patterns

### Best Practices
- Keep commands focused on a single responsibility
- Follow the structure of working commands like `spec.md`
- Include specific, actionable instructions (not generic advice)
- Mention file paths/patterns explicitly if relevant
- Consider frontend/backend specific guidelines if applicable

### When to Use
- Creating a new slash command for frequently used prompts
- Updating an existing command with better instructions
- Standardizing workflows that are currently ad-hoc