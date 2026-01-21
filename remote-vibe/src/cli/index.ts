#!/usr/bin/env -S bun run
/**
 * CLI interface for vibe dispatcher
 */

import { analyzeRequest } from "../analyzer/index.ts";
import { getAdapter, getAllAdapters } from "../adapters/index.ts";
import { sessionManager } from "../session/index.ts";
import { DEFAULT_CONFIG, loadConfig, validateConfig } from "../config/index.ts";

interface CliOptions {
  tool?: string;
  explain?: boolean;
  interactive?: boolean;
  config?: string;
  dir?: string; // Working directory for the task
}

/**
 * Main CLI entry point
 */
export async function main(args: string[]): Promise<void> {
  const options = parseArgs(args);

  // Load configuration
  const config = options.config
    ? await loadConfig(options.config)
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

  // Get the prompt (remaining arguments)
  const prompt = args.join(" ");

  if (!prompt && !options.interactive) {
    console.error("Usage: remote-vibe [options] <prompt>");
    console.error("       remote-vibe --interactive");
    console.error("");
    console.error("Options:");
    console.error("  --dir <path>      Working directory for the task (default: current directory)");
    console.error("  --tool <name>     Explicitly select a tool");
    console.error("  --explain         Show routing decision");
    console.error("  --interactive     Start interactive mode");
    console.error("  --config <path>   Load configuration from file");
    process.exit(1);
  }

  // Interactive mode
  if (options.interactive) {
    return runInteractiveMode(config, options);
  }

  // Execute single request
  await executeRequest(prompt, config, options);
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--dir" && i + 1 < args.length) {
      options.dir = args[++i];
      args.splice(i - 1, 2);
      i -= 2;
    } else if (arg === "--tool" && i + 1 < args.length) {
      options.tool = args[++i];
      args.splice(i - 1, 2);
      i -= 2;
    } else if (arg === "--explain") {
      options.explain = true;
      args.splice(i, 1);
      i--;
    } else if (arg === "--interactive") {
      options.interactive = true;
      args.splice(i, 1);
      i--;
    } else if (arg === "--config" && i + 1 < args.length) {
      options.config = args[++i];
      args.splice(i - 1, 2);
      i -= 2;
    }
  }

  return options;
}

/**
 * Execute a single request
 */
async function executeRequest(
  prompt: string,
  config: typeof DEFAULT_CONFIG,
  options: CliOptions
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
  const adapter = getAdapter(toolName);
  if (!adapter) {
    console.error(`Error: Tool "${toolName}" not found`);
    process.exit(1);
  }

  // Check if tool is available
  const available = await adapter.isAvailable();
  if (!available) {
    console.error(`Error: Tool "${toolName}" is not available`);
    process.exit(1);
  }

  // Create session
  const session = sessionManager.create(toolName);
  sessionManager.addMessage(session.id, "user", prompt);

  // Execute request
  try {
    const result = await adapter.execute({
      prompt,
      context: {
        directory: {
          path: directory
        }
      },
      options: { sessionId: session.id, stream: false }
    });

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
  options: CliOptions
): Promise<void> {
  console.error("Vibe Dispatcher - Interactive Mode");
  console.error("Type 'exit' or 'quit' to exit");
  console.error("");

  const readline = {
    async question(prompt: string): Promise<string> {
      // Simple implementation using stdin
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

// Run CLI if this is the main module
if (import.meta.main) {
  await main(process.argv.slice(2));
}
