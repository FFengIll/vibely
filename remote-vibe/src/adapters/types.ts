/**
 * Base types for tool adapters
 */

export enum TaskType {
  CodeGeneration = "code_generation",
  Refactoring = "refactoring",
  Debugging = "debugging",
  Review = "review",
  Documentation = "documentation",
  Architecture = "architecture",
  QuickFix = "quick_fix"
}

/**
 * Directory context for task execution
 * The tool will work within this directory/project
 */
export interface DirectoryContext {
  /** Absolute path to the project directory */
  path: string;
  /** Optional: specific file patterns to include (glob patterns) */
  include?: string[];
  /** Optional: specific file patterns to exclude (glob patterns) */
  exclude?: string[];
}

export interface ToolRequest {
  prompt: string;
  context: {
    /** Directory where the task should be executed */
    directory: DirectoryContext;
    /** Optional: environment variables for the execution */
    env?: Record<string, string>;
  };
  options: {
    stream?: boolean;
    sessionId?: string;
  };
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
  sessionId: string;
}

export interface StreamEvent {
  type: "routing" | "output" | "error" | "complete";
  data: unknown;
}

/**
 * Base interface for all tool adapters
 */
export interface ToolAdapter {
  /** Tool identifier */
  readonly name: string;

  /** Check if the tool is available on the system */
  isAvailable(): Promise<boolean>;

  /** Execute a request and return the result */
  execute(request: ToolRequest): Promise<ToolResult>;

  /** Execute a request and stream results */
  stream(request: ToolRequest, onEvent: (event: StreamEvent) => void): Promise<void>;

  /** Cancel a running session */
  cancel(sessionId: string): Promise<void>;
}

/**
 * Tool capability metadata
 */
export interface ToolCapability {
  name: string;
  strengths: TaskType[];
  complexity: "simple" | "medium" | "complex";
  requiresGit: boolean;
  requiresRuntime: boolean;
  priority: number; // Lower is higher priority
}

/**
 * Request analysis result
 */
export interface RequestAnalysis {
  taskType: TaskType;
  complexity: number; // 1-10
  affectedDirectory?: string; // Directory that will be affected
  suggestedTool: string;
  confidence: number; // 0-1
  reasoning: string;
}

/**
 * Tool configuration
 */
export interface ToolConfig {
  name: string;
  enabled: boolean;
  priority: number;
  command?: string;
  args?: string[];
  endpoint?: string;
  capabilities: string[];
  /** Tool-specific options (e.g., claudeCode options) */
  options?: Record<string, unknown>;
}

/**
 * Routing configuration
 */
export interface RoutingConfig {
  fallbackTool: string;
  allowOverride: boolean;
}
