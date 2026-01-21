# vibe coding

Config / prompt / plugins.

# vibely
My config & setting for vibe coding.

# tingly-spec

A markdown writing plugin (support *.md and *.vibely) for coding task spec writing.

## Feature
- `@` to trigger file search and auto-completion, then the spec is feasible to use in claude code, codex and so on.
- `#` to trigger symbol list and auto-completion in corresponding file

## Example
- `@` trigger file list and search
- `@src/extension.tx` as result
- `@src/extension.tx#` trigger symbol list and search
- `@src/extension.tx:66-88 main` as result
