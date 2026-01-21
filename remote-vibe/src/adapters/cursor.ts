/**
 * Cursor adapter (Placeholder)
 *
 * TODO: Implement Cursor integration for edit-focused, inline changes
 *
 * Integration options:
 * - Cursor extension API (if available)
 * - Cursor CLI (if available)
 * - VSCode extension protocol
 *
 * Use case: Quick fixes, small modifications, single-file edits
 */

import { BaseAdapter } from "./base.ts";
import type { ToolRequest, ToolCapability } from "./types.ts";
import { TaskType } from "./types.ts";

export class CursorAdapter extends BaseAdapter {
  readonly name = "cursor";
  readonly capability: ToolCapability = {
    name: "cursor",
    strengths: [
      TaskType.QuickFix,
      // Add other relevant task types
    ],
    complexity: "simple",
    requiresGit: false,
    requiresRuntime: false,
    priority: 3
  };

  protected getCommand(): string | null {
    // TODO: Return Cursor command when available
    return null;
  }

  protected getArgs(_request: ToolRequest): string[] {
    // TODO: Construct Cursor-specific arguments
    return [];
  }

  /**
   * Cursor adapter is not yet implemented
   */
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async execute(_request: ToolRequest): Promise<ReturnType<typeof this.execute> extends Promise<infer T> ? T : never> {
    return {
      success: false,
      output: "",
      error: "Cursor adapter is not yet implemented",
      sessionId: _request.options.sessionId ?? this.generateSessionId()
    } as any;
  }

  async stream(
    _request: ToolRequest,
    _onEvent: (event: import("./types.ts").StreamEvent) => void
  ): Promise<void> {
    _onEvent({
      type: "error",
      data: { error: "Cursor adapter is not yet implemented" }
    });
  }
}
