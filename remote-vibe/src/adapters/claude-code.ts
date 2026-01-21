/**
 * Claude Code adapter
 * Integrates with Claude Code CLI for complex reasoning and multi-file changes
 */

import { BaseAdapter } from "./base.ts";
import type { ToolRequest, ToolCapability } from "./types.ts";
import { TaskType } from "./types.ts";

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

  constructor(config?: { command?: string }) {
    super();
    this.command = config?.command ?? "claude";
  }

  protected getCommand(): string | null {
    return this.command;
  }

  protected getArgs(request: ToolRequest): string[] {
    const args: string[] = [];

    // Add prompt as argument
    args.push(request.prompt);

    // Add file context if provided
    if (request.context.files && request.context.files.length > 0) {
      for (const file of request.context.files) {
        args.push("--file", file.path);
      }
    }

    // Enable streaming if requested
    if (request.options.stream) {
      args.push("--stream");
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
