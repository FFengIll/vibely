/**
 * Tool adapters registry
 */

export { BaseAdapter } from "./base.ts";
export { ClaudeCodeAdapter } from "./claude-code.ts";
export { OpenCodeAdapter, type OpenCodeConfig } from "./opencode.ts";
export { CursorAdapter } from "./cursor.ts";
export { AiderAdapter } from "./aider.ts";

export type {
  ToolAdapter,
  ToolRequest,
  ToolResult,
  StreamEvent,
  ToolCapability,
  RequestAnalysis,
  DirectoryContext,
  ToolConfig,
  RoutingConfig
} from "./types.ts";

export { TaskType } from "./types.ts";

import type { ToolAdapter } from "./types.ts";
import { ClaudeCodeAdapter } from "./claude-code.ts";
import { OpenCodeAdapter } from "./opencode.ts";
import { CursorAdapter } from "./cursor.ts";
import { AiderAdapter } from "./aider.ts";

/**
 * Get all available adapters
 */
export function getAllAdapters(): ToolAdapter[] {
  return [
    new ClaudeCodeAdapter(),
    new OpenCodeAdapter(),
    new CursorAdapter(),
    new AiderAdapter()
  ];
}

/**
 * Get adapter by name
 */
export function getAdapter(name: string): ToolAdapter | undefined {
  const adapters: Record<string, () => ToolAdapter> = {
    "claude-code": () => new ClaudeCodeAdapter(),
    "opencode": () => new OpenCodeAdapter(),
    "cursor": () => new CursorAdapter(),
    "aider": () => new AiderAdapter()
  };

  return adapters[name]?.();
}
