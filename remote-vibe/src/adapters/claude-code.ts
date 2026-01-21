/**
 * Claude Code adapter
 * Integrates with Claude Code CLI for complex reasoning and multi-file changes
 *
 * Usage: claude -p "prompt" --permission-mode acceptEdits --allowedTools "Bash(*) Read(*) Edit(*) Write(*)"
 */

import { BaseAdapter } from "./base.ts";
import type { ToolRequest, ToolCapability } from "./types.ts";
import { TaskType } from "./types.ts";

/**
 * Configuration for Claude Code adapter
 */
export interface ClaudeCodeConfig {
  /** Command to run (default: "claude") */
  command?: string;
  /** Permission mode for Claude Code (default: "acceptEdits") */
  permissionMode?: "acceptEdits" | "bypassPermissions" | "default" | "delegate" | "dontAsk" | "plan";
  /** Allowed tools for Claude Code (default: standard tool set) */
  allowedTools?: string;
  /** Enable debug mode (default: false) */
  debug?: boolean;
  /** Additional directories to allow tool access to */
  addDir?: string[];
}

export class ClaudeCodeAdapter extends BaseAdapter {
  readonly name = "claude-code";
  readonly capability: ToolCapability = {
    name: "claude-code",
    strengths: [
      TaskType.Architecture,
      TaskType.Refactoring,
      TaskType.Debugging,
      TaskType.Review
    ],
    complexity: "complex",
    requiresGit: false,
    requiresRuntime: false,
    priority: 1
  };

  private readonly command: string;
  private readonly permissionMode: string;
  private readonly allowedTools: string;
  private readonly debug: boolean;
  private readonly addDir: string[];

  constructor(config?: ClaudeCodeConfig) {
    super();
    this.command = config?.command ?? "claude";
    this.permissionMode = config?.permissionMode ?? "acceptEdits";
    this.allowedTools = config?.allowedTools ?? "Bash(*) Read(*) Edit(*) Write(*)";
    this.debug = config?.debug ?? false;
    this.addDir = config?.addDir ?? [];
  }

  protected getCommand(): string | null {
    return this.command;
  }

  protected getArgs(request: ToolRequest): string[] {
    const args: string[] = [];

    // Use -p flag for prompt (required for non-interactive mode)
    args.push("-p", request.prompt);

    // Set permission mode to allow automated edits
    args.push("--permission-mode", this.permissionMode);

    // Set allowed tools
    args.push("--allowed-tools", this.allowedTools);

    // Enable debug mode if configured
    if (this.debug) {
      args.push("--debug");
    }

    // Add additional directories if specified
    for (const dir of this.addDir) {
      args.push("--add-dir", dir);
    }

    // Use --print for non-interactive output
    args.push("--print");

    // For streaming, use stream-json output format
    if (request.options.stream) {
      args.push("--output-format", "stream-json");
    }

    return args;
  }

  /**
   * Check if Claude Code CLI is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const proc = Bun.spawn([this.command, "--version"], {
        stdout: "pipe",
        stderr: "pipe"
      });
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }
}
