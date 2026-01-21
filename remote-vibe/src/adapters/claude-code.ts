/**
 * Claude Code adapter
 * Integrates with Claude Code CLI for complex reasoning and multi-file changes
 *
 * Usage: claude -p "prompt" --permission-mode acceptEdits --allowedTools "Bash(*) Read(*) Edit(*) Write(*)"
 */

import { BaseAdapter } from "./base.ts";
import type { ToolRequest, ToolResult, ToolCapability } from "./types.ts";
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

    // Add the target directory as an additional directory
    // This allows claude to work in the target directory even when run from /tmp
    args.push("--add-dir", request.context.directory.path);

    // Add additional directories if specified
    for (const dir of this.addDir) {
      args.push("--add-dir", dir);
    }

    // Use --print for non-interactive output
    args.push("--print");

    return args;
  }

  /**
   * Override execute to work around claude hanging issue
   * We run claude from /tmp to avoid the hanging issue in certain directories
   */
  async execute(request: ToolRequest): Promise<ToolResult> {
    // Temporarily change to /tmp to run claude (workaround for hanging issue)
    const originalCwd = process.cwd();
    process.chdir("/tmp");

    try {
      // Call parent's execute method
      return await super.execute(request);
    } finally {
      // Restore original directory
      process.chdir(originalCwd);
    }
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

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => proc.kill(), 5000);
      await proc.exited;
      clearTimeout(timeout);

      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }
}
