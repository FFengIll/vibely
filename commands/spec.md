/spec is a command that reads a given spec file (if provided) and understands the user request to complete tasks under the current project.

## Guideline
- spec doc
  - understand user intent at first and do design before action, always write the spec and related understanding and design into ./docs/spec/datetime-title.md, e.g. ./docs/spec/20260105-new-year-spec-name.md.
  - since arch info is cached, you can read it if possible to help (cache glob path is `./docs/arch/*-arch.md`). Recommend to use arch info cache to reduce code searching and reading.
  - DO NOT make spec doc too long and fabric; keep spec key-explored, guiding-oriented; take care of model define and file/module/function abstract for design.
- for frontend
  - use same tech stack, components, theme and design pattern
  - understand user intent and use good design and complete
  - replace solution is allowed for locale and text
- for backend
  - take care of current file structure, list dir with limited depth.
  - write necessary test for your job in corresponding programming language habits.
  - since backend cost time and may limit by network, take care of some special test cases.

## Cache
Since each spec may need to understand the project, cache architecture understanding and reuse it if possible.
The cache could be replaced into ./docs/arch/datetime-arch.md, e.g. ./docs/arch/20260105-arch.md, only update with timestamp.