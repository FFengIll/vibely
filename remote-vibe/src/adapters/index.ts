/**
 * Tool adapters registry
 */

export { BaseAdapter } from "./base.ts";
export { ClaudeCodeAdapter } from "./claude-code.ts";
export type { ClaudeCodeConfig } from "./claude-code";
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

import type { ToolAdapter, ToolConfig } from "./types.ts";
import { ClaudeCodeAdapter } from "./claude-code.ts";
import { OpenCodeAdapter } from "./opencode.ts";
import { CursorAdapter } from "./cursor.ts";
import { AiderAdapter } from "./aider.ts";
import { getClaudeCodeOptions } from "../config/index.ts";

/**
 * Get all available adapters
 */
export function getAllAdapters(toolConfigs?: ToolConfig[]): ToolAdapter[] {
  const configMap = new Map(toolConfigs?.map(t => [t.name, t]));

  return [
    createClaudeCodeAdapter(configMap.get("claude-code")),
    new OpenCodeAdapter(),
    new CursorAdapter(),
    new AiderAdapter()
  ];
}

/**
 * Get adapter by name
 */
export function getAdapter(name: string, toolConfig?: ToolConfig): ToolAdapter | undefined {
  switch (name) {
    case "claude-code":
      return createClaudeCodeAdapter(toolConfig);
    case "opencode":
      return new OpenCodeAdapter();
    case "cursor":
      return new CursorAdapter();
    case "aider":
      return new AiderAdapter();
    default:
      return undefined;
  }
}

/**
 * Create Claude Code adapter with config
 */
function createClaudeCodeAdapter(toolConfig?: ToolConfig): ClaudeCodeAdapter {
  if (!toolConfig) {
    return new ClaudeCodeAdapter();
  }

  const options = getClaudeCodeOptions(toolConfig);

  return new ClaudeCodeAdapter({
    command: toolConfig.command,
    ...options
  });
}
