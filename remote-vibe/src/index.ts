/**
 * Vibe Dispatcher - Main entry point
 */

export { analyzeRequest } from "./analyzer/index.ts";
export { sessionManager, SessionManager } from "./session/index.ts";
export {
  BaseAdapter,
  ClaudeCodeAdapter,
  OpenCodeAdapter,
  CursorAdapter,
  AiderAdapter,
  getAllAdapters,
  getAdapter,
  type ToolAdapter,
  type ToolRequest,
  type ToolResult,
  type StreamEvent,
  type ToolCapability,
  type RequestAnalysis,
  type FileContext,
  TaskType
} from "./adapters/index.ts";
export {
  DEFAULT_CONFIG,
  loadConfig,
  validateConfig,
  getToolConfig,
  getEnabledTools
} from "./config/index.ts";
export { createApi, startServer } from "./api/index.ts";
export { main as cli } from "./cli/index.ts";
