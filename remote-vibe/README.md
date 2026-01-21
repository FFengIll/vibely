# Remote Vibe

A remote task dispatcher service for "vibe coding" - intelligently routes your requests to the best AI coding tool for the job.

## Features

- **Smart Routing**: Automatically analyzes your request and selects the best tool
- **Multiple Interfaces**: CLI and HTTP API
- **Tool Support**:
  - ✅ Claude Code (complex reasoning, multi-file changes)
  - ✅ OpenCode (fast code generation)
  - 🔜 Cursor (placeholder)
  - 🔜 Aider (placeholder)
- **Session Management**: Track and manage tool execution sessions
- **Streaming**: Real-time output from tools

## Installation

```bash
cd remote-vibe
bun install
```

## Usage

### CLI

```bash
# Basic usage (auto-detect best tool, runs in current directory)
bun run src/cli/index.ts "add user authentication to the app"

# Specify a working directory for the task
bun run src/cli/index.ts --dir /path/to/project "refactor the database layer"

# Explicit tool selection
bun run src/cli/index.ts --tool claude-code "fix the authentication bug"

# Show routing decision
bun run src/cli/index.ts --explain "optimize the queries"

# Interactive mode
bun run src/cli/index.ts --interactive

# Use custom config
bun run src/cli/index.ts --config ./config.json "your prompt"
```

### HTTP API

```bash
# Start the API server
bun run src/api/index.ts

# The server will start on http://localhost:8765
```

#### API Endpoints

**Execute a request:**
```bash
curl -X POST http://localhost:8765/api/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "add user authentication",
    "tool": "auto",
    "options": {
      "stream": false,
      "context": {
        "directory": "/path/to/project",
        "include": ["src/**/*.ts"],
        "exclude": ["node_modules/**"]
      }
    }
  }'
```

**Analyze routing:**
```bash
curl -X POST http://localhost:8765/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "optimize the queries",
    "context": {
      "directory": "/path/to/project"
    }
  }'
```

**Get available tools:**
```bash
curl http://localhost:8765/api/v1/tools
```

**Get session info:**
```bash
curl http://localhost:8765/api/v1/sessions/:id
```

**Get statistics:**
```bash
curl http://localhost:8765/api/v1/stats
```

## Configuration

Edit `config.json` to customize:

```json
{
  "tools": [
    {
      "name": "claude-code",
      "enabled": true,
      "priority": 1,
      "command": "claude"
    },
    {
      "name": "opencode",
      "enabled": false,
      "priority": 2,
      "endpoint": "http://localhost:3000/api"
    }
  ],
  "routing": {
    "fallbackTool": "claude-code",
    "allowOverride": true
  },
  "api": {
    "port": 8765,
    "host": "localhost"
  }
}
```

## Development

```bash
# Run tests
bun test

# Build
bun run build
```

## Architecture

```
remote-vibe/
├── src/
│   ├── cli/         # CLI interface
│   ├── api/         # HTTP API (Hono)
│   ├── analyzer/    # Request analysis logic
│   ├── adapters/    # Tool adapters
│   │   ├── base.ts
│   │   ├── claude-code.ts
│   │   ├── opencode.ts
│   │   ├── cursor.ts    # 🔜 Placeholder
│   │   └── aider.ts     # 🔜 Placeholder
│   ├── session/     # Session management
│   └── config/      # Configuration
└── config.json      # Default configuration
```

## License

MIT
