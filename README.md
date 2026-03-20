# Harnessly

My prompt for ai coding with harness.

# SDLC with Harness

```
vibely/
├── .sdlc/                          # SDLC configuration and documentation
│   └── harness/                    # Harness configuration files
│       ├── sdlc-documentation-structure-20260319.harness.md
│       └── sdlc-documentation-system-20260319.harness.md
├── commands/                       # AI coding commands documentation
│   ├── codeclean.md               # Code cleaning and refactoring guide
│   ├── codereview.md              # Code review process
│   ├── discuss.md                 # Discussion documentation
│   ├── new-command.md             # New command creation guide
│   ├── pencil.md                  # Pencil tool documentation
│   ├── spec.md                    # Specification writing guide
│   └── specreview.md              # Specification review process
├── flow/                          # Workflow and flow documentation
│   ├── resume.md                  # Resume/continuation flow
│   └── status.md                  # Status tracking flow
├── foundation/                    # Foundation and core concepts
│   ├── README.md                  # Foundation overview
│   ├── archive.md                 # Archive management
│   ├── cache.md                   # Caching strategies
│   ├── discuss.md                 # Discussion protocols
│   ├── doc.md                     # Documentation standards
│   ├── git-resolve.md             # Git conflict resolution
│   ├── git.md                     # Git workflows
│   ├── handoff.md                 # Handoff procedures
│   └── pencil.md                  # Pencil framework
├── phases/                        # Development phases documentation
│   ├── coding.md                  # Coding phase
│   ├── commit.md                  # Commit phase
│   ├── cr.md                      # Code review phase
│   ├── debug.md                   # Debugging phase
│   ├── guard.md                   # Guard/validation phase
│   ├── harness.md                 # Harness integration phase
│   ├── pr.md                      # Pull request phase
│   ├── research.md                # Research phase
│   ├── secure.md                  # Security phase
│   ├── spec.md                    # Specification phase
│   ├── test.md                    # Testing phase
│   ├── understand.md              # Understanding/analysis phase
│   └── validate.md                # Validation phase
├── workflows/                     # Workflow definitions
│   ├── bugfix.md                  # Bug fix workflow
│   ├── feature.md                 # Feature development workflow
│   ├── minor.md                   # Minor changes workflow
│   ├── refactor.md                # Refactoring workflow
│   └── research.md                # Research workflow
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
├── SDLC.README.md                 # SDLC detailed documentation
├── c.md                           # Configuration/notes file
└── sdlc.md                        # SDLC main documentation
```


# Tingly-spec

A markdown writing plugin (support *.md) for coding task spec writing.

> https://github.com/FFengIll/tingly-spec.git

## Feature
- `@` to trigger file search and auto-completion, then the spec is feasible to use in claude code, codex and so on.
- `#` to trigger symbol list and auto-completion in corresponding file

## Example
- `@` trigger file list and search
- `@src/extension.tx` as result
- `@src/extension.tx#` trigger symbol list and search
- `@src/extension.tx:66-88 main` as result
