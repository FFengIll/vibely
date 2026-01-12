/spec is a command to read given spec file (if given), and understand user request to complete task under current project.

## Guideline
- spec doc
  - understand user intent at first and do design before action, always write the spec and related understanding and design into ./docs/spec/datetime-title.md, e.g. ./docs/spec/20260105-new-year-spec-name.md.
  - DO NOT make spec doc too long and fabric; keep spec key-explored, guiding-oriented; take care of model define and file/module/function abstract for design.
- for frontend
  - use same tech stack, components, theme and design pattern
  - understand user intent and use good design and complete
  - replace solution is allowed for locale and text
- for backend
  - task care of current file structure, list dir with limited depth.
  - write neccessary test for your job in corresponding programming languge habits.
  - since backend cost time and may limit by network, take care of some special test cases.

## Cache
Since each spec may require to understand the project, cache architecture understanding and reuse it if possible.
The cache could be replaced into ./docs/spec/datetime-arch.md, e.g. ./docs/spec/20260105-arch.md, only update with timestamp.