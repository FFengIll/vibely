/**
 * Aider adapter (Placeholder)
 *
 * TODO: Implement Aider integration for git-aware, pair programming
 *
 * Integration options:
 * - aider CLI subprocess (https://github.com/paul-gauthier/aider)
 * - Use --message flag for programmatic prompts
 * - Handle git operations automatically
 *
 * Use case: Git-aware refactoring, working with git history
 */

import { BaseAdapter } from "./base.ts";
import type { ToolRequest, ToolCapability } from "./types.ts";
import { TaskType } from "./types.ts";

export class AiderAdapter extends BaseAdapter {
  readonly name = "aider";
  readonly capability: ToolCapability = {
    name: "aider",
    strengths: [
      TaskType.Refactoring,
      // Add other relevant task types
    ],
    complexity: "medium",
    requiresGit: true,
    requiresRuntime: false,
    priority: 4
  };

  private readonly command: string;

  constructor(config?: { command?: string }) {
    super();
    this.command = config?.command ?? "aider";
  }

  protected getCommand(): string | null {
    // TODO: Return aider command when implemented
    return this.command;
  }

  protected getArgs(_request: ToolRequest): string[] {
    // TODO: Construct aider-specific arguments
    // Example: ["--message", request.prompt, "--yes"]
    return [];
  }

  /**
   * Aider adapter is not yet implemented
   */
  async isAvailable(): Promise<boolean> {
    // TODO: Check if aider CLI is available
    return false;
  }

  async execute(_request: ToolRequest): Promise<ReturnType<typeof this.execute> extends Promise<infer T> ? T : never> {
    return {
      success: false,
      output: "",
      error: "Aider adapter is not yet implemented",
      sessionId: _request.options.sessionId ?? this.generateSessionId()
    } as any;
  }

  async stream(
    _request: ToolRequest,
    _onEvent: (event: import("./types.ts").StreamEvent) => void
  ): Promise<void> {
    _onEvent({
      type: "error",
      data: { error: "Aider adapter is not yet implemented" }
    });
  }
}
