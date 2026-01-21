#!/usr/bin/env -S bun run
/**
 * CLI interface for vibe dispatcher
 */

import { analyzeRequest } from "../analyzer/index";
import { getAdapter } from "../adapters/index";
import { sessionManager } from "../session/index";
import { DEFAULT_CONFIG, loadConfig, validateConfig } from "../config/index";

interface CliFlags {
  dir?: string;
  tool?: string;
  explain?: boolean;
  interactive?: boolean;
  config?: string;
  help?: boolean;
  version?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): { flags: CliFlags; input: string[] } {
  const flags: CliFlags = {};
  const input: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "-h" || arg === "--help") {
      flags.help = true;
    } else if (arg === "-v" || arg === "--version") {
      flags.version = true;
    } else if (arg === "-d" || arg === "--dir") {
      flags.dir = args[++i];
    } else if (arg === "-t" || arg === "--tool") {
      flags.tool = args[++i];
    } else if (arg === "--explain") {
      flags.explain = true;
    } else if (arg === "-i" || arg === "--interactive") {
      flags.interactive = true;
    } else if (arg === "-c" || arg === "--config") {
      flags.config = args[++i];
    } else if (arg.startsWith("-")) {
      // Skip unknown flags
      if (arg.startsWith("--") && arg.includes("=")) {
        const [key, value] = arg.split("=");
        if (key === "--dir") flags.dir = value;
        else if (key === "--tool") flags.tool = value;
        else if (key === "--config") flags.config = value;
      }
    } else {
      input.push(arg);
    }
  }

  return { flags, input };
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
    Usage
      $ remote-vibe [prompt]
      $ remote-vibe tools
      $ remote-vibe interactive

    Options
      -d, --dir <path>        Working directory for the task
      -t, --tool <name>       Explicitly select a tool (claude-code, opencode, cursor, aider)
      --explain               Show routing decision and tool selection reasoning
      -i, --interactive       Start interactive mode
      -c, --config <path>     Load configuration from file
      -v, --version           Display version number
      -h, --help              Display this message

    Examples
      $ remote-vibe "帮我重构这个函数"
      $ remote-vibe "添加用户认证" --tool claude-code
      $ remote-vibe "修复登录bug" --explain
      $ remote-vibe tools
  `);
}

/**
 * Execute a single request
 */
async function executeRequest(
  prompt: string,
  config: typeof DEFAULT_CONFIG,
  options: CliFlags
): Promise<void> {
  // Resolve the working directory
  const directory = options.dir
    ? Bun.resolve(options.dir, process.cwd())
    : process.cwd();

  // Analyze request to determine tool
  const analysis = analyzeRequest(prompt, { directory });

  let toolName = options.tool ?? config.cli?.defaultTool;

  if (toolName === "auto" || !toolName) {
    toolName = analysis.suggestedTool;
  }

  // Show explanation if requested
  if (options.explain) {
    console.error(`Task: ${analysis.taskType}`);
    console.error(`Complexity: ${analysis.complexity}/10`);
    console.error(`Directory: ${directory}`);
    console.error(`Suggested: ${analysis.suggestedTool} (confidence: ${analysis.confidence})`);
    console.error(`Reasoning: ${analysis.reasoning}`);
    console.error(`Using: ${toolName}`);
    console.error("");
  }

  // Get the adapter
  const toolConfig = config.tools.find(t => t.name === toolName);
  const adapter = getAdapter(toolName, toolConfig);
  if (!adapter) {
    console.error(`Error: Tool "${toolName}" not found`);
    process.exit(1);
  }

  // Check if tool is available
  console.error(`[DEBUG] Checking tool availability...`);
  const available = await adapter.isAvailable();
  console.error(`[DEBUG] Tool available: ${available}`);
  if (!available) {
    console.error(`Error: Tool "${toolName}" is not available`);
    process.exit(1);
  }

  // Create session
  console.error(`[DEBUG] Creating session...`);
  const session = sessionManager.create(toolName);
  console.error(`[DEBUG] Session created: ${session.id}`);
  sessionManager.addMessage(session.id, "user", prompt);

  // Execute request
  try {
    console.error(`[DEBUG] Executing with tool: ${toolName}`);
    const result = await adapter.execute({
      prompt,
      context: {
        directory: {
          path: directory
        }
      },
      options: { sessionId: session.id, stream: false }
    });

    console.error(`[DEBUG] Result - success: ${result.success}, output length: ${result.output?.length ?? 0}`);

    if (result.success) {
      console.log(result.output);
      sessionManager.addMessage(session.id, "assistant", result.output);
      sessionManager.complete(session.id, "completed");
    } else {
      console.error(`Error: ${result.error}`);
      sessionManager.complete(session.id, "failed");
      process.exit(1);
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error(`Error: ${error}`);
    sessionManager.complete(session.id, "failed");
    process.exit(1);
  }
}

/**
 * Run interactive mode
 */
async function runInteractiveMode(
  config: typeof DEFAULT_CONFIG,
  options: CliFlags
): Promise<void> {
  console.error("Vibe Dispatcher - Interactive Mode");
  console.error("Type 'exit' or 'quit' to exit");
  console.error("");

  const readline = {
    async question(prompt: string): Promise<string> {
      process.stdout.write(prompt);
      const buffer = await Bun.stdin.stream().getReader().read();
      return new TextDecoder().decode(buffer.value ?? new Uint8Array()).trim();
    }
  };

  while (true) {
    const input = await readline.question("> ");

    if (!input) continue;
    if (input === "exit" || input === "quit") {
      console.error("Goodbye!");
      break;
    }

    await executeRequest(input, config, options);
  }
}

/**
 * List available tools
 */
async function listTools(config: typeof DEFAULT_CONFIG): Promise<void> {
  const { getAllAdapters } = await import("../adapters/index");
  const adapters = getAllAdapters(config.tools);

  console.log("Available tools:");
  console.log("");

  for (const adapter of adapters) {
    try {
      const available = await adapter.isAvailable();
      const status = available ? "✓" : "✗";
      const capability = (adapter as any).capability;

      console.log(`  ${status} ${adapter.name}`);
      if (capability) {
        console.log(`      Priority: ${capability.priority}`);
        console.log(`      Strengths: ${capability.strengths.join(", ")}`);
        console.log(`      Complexity: ${capability.complexity}`);
      }
      console.log("");
    } catch (e) {
      console.log(`  ✗ ${adapter.name} (error: ${e})`);
      console.log("");
    }
  }
}

// Main entry point
async function main() {
  const { flags, input } = parseArgs(process.argv.slice(2));

  // Handle help
  if (flags.help) {
    showHelp();
    return;
  }

  // Handle version
  if (flags.version) {
    console.log("0.1.0");
    return;
  }

  const prompt = input.join(" ");

  // Load configuration
  const config = flags.config
    ? await loadConfig(flags.config)
    : DEFAULT_CONFIG;

  // Validate configuration
  const validation = validateConfig(config);
  if (!validation.valid) {
    console.error("Configuration errors:");
    for (const error of validation.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  // Handle subcommands
  const command = input[0];

  if (command === "tools") {
    await listTools(config);
    return;
  }

  if (command === "interactive" || flags.interactive) {
    await runInteractiveMode(config, flags);
    return;
  }

  // Show help if no prompt
  if (!prompt) {
    showHelp();
    return;
  }

  // Execute request
  await executeRequest(prompt, config, flags);
}

main().catch(console.error);
