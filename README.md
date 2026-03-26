# Harnessly

My prompt for ai coding with harness and feedback

# SDLC with Harness


* **Specifications matter.**
* Trust in the power of process.

  The Software Development Life Cycle (SDLC) may be classical, but it still has much to teach us.

* Do not attempt to keep every specification constantly updated as the code evolves.

  High-level specifications will inevitably lag behind.

* **Validation specifications are critical.**
  
  We refer to this layer as the `Harness`.

* Embrace the practice of maintaining and sharing the `Harness`:
  * It strengthens code reviews
  * It accelerates debugging
  * It supports safe refactoring
  * ……

* **REMEMBER** There is no silver bullet.

  The only constant is change.

---

* **规范（SPEC）很重要。**

* 相信流程的力量。

  Software Development Life Cycle (SDLC) 虽然古典，甚至略显传统，但它能教会我们的，远不止流程本身。

* 不要试图让所有 SPEC 随代码实时同步。

  一般性的 SPEC，天然会滞后，这是常态，而非问题。

* **验证型 SPEC 更关键。**
  
  我们可以称之为 `Harness`。

* 主动建设并沉淀 `Harness`：
  * 让 Code Review 更有依据
  * 让 Debug 更高效
  * 让 Refactoring 更安全
  * ……

* 不存在银弹。

  变化常在。

---

## File structure

```
vibely/
├── .sdlc/                          # SDLC configuration and documentation
│   └── harness/                    # Harness configuration files
│       ├── sdlc-documentation-structure-20260319.harness.md
│       └── sdlc-documentation-system-20260319.harness.md
├── actions/                        # SDLC action definitions (slash commands)
│   ├── coding.md                   # /coding - Coding phase
│   ├── commit.md                   # /commit - Commit phase
│   ├── cr.md                       # /cr - Code review phase
│   ├── debug.md                    # /debug - Debugging phase
│   ├── discuss.md                  # /discuss - Discussion
│   ├── guard.md                    # /guard - Guard/validation
│   ├── handoff.md                  # /handoff - Handoff procedures
│   ├── harness.md                  # /harness - Harness integration
│   ├── pr.md                       # /pr - Pull request
│   ├── research.md                 # /research - Research phase
│   ├── secure.md                   # /secure - Security phase
│   ├── spec.md                     # /spec - Specification phase
│   ├── test.md                     # /test - Testing phase
│   ├── understand.md               # /understand - Understanding/analysis
│   └── validate.md                 # /validate - Validation phase
├── commands/                       # Extended commands and utilities
│   ├── codeclean.md                # /codeclean - Code cleaning
│   ├── discuss.md                  # Discussion documentation
│   └── new-command.md              # /new-command - Create new commands
├── flow/                           # Flow control and state management
│   ├── resume.md                   # /sdlc resume - Resume workflow
│   └── status.md                   # /sdlc status - Status tracking
├── utils/                          # Utility skills and tools
│   ├── README.md                   # Utilities overview
│   ├── archive.md                  # Archive utility
│   ├── cache.md                    # Cache utility
│   ├── doc.md                      # Documentation utility
│   ├── git-resolve.md              # Git conflict resolution
│   ├── git.md                      # Git utility
│   └── pencil.md                   # Pencil framework utility
├── workflows/                      # Workflow definitions
│   ├── bugfix.md                   # Bug fix workflow
│   ├── feature.md                  # Feature development workflow
│   ├── minor.md                    # Minor changes workflow
│   ├── refactor.md                 # Refactoring workflow
│   └── research.md                 # Research workflow
├── resource/                       # Resource files
│   └── showcase-oauth.png          # OAuth showcase image
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
├── c.md                            # Configuration/notes file
├── feedback.md                     # Feedback skill
└── sdlc.md                         # SDLC main documentation
```

## Harness Showcase

![showcase-oauth](resource/showcase-oauth.png)


# SDLC with Feedback

```
# tasks done with /sdlc

# now we score them and update them
/feedback
```

- No silver-bullet, so feedback and improve, make it better and better for self
  - yep, we can catch ideas from https://github.com/karpathy/autoresearch
  - it is now /feedback


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
