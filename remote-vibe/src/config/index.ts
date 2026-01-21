/**
 * Configuration management
 */

import type { ToolConfig, RoutingConfig } from "../adapters/types.ts";

export interface Config {
  tools: ToolConfig[];
  routing: RoutingConfig;
  api?: {
    port?: number;
    host?: string;
  };
  cli?: {
    defaultTool?: string;
  };
}

/**
 * Claude Code specific options
 */
export interface ClaudeCodeOptions {
  command?: string;
  permissionMode?: "acceptEdits" | "bypassPermissions" | "default" | "delegate" | "dontAsk" | "plan";
  allowedTools?: string;
  debug?: boolean;
  addDir?: string[];
}

/**
 * Helper to get Claude Code options from a tool config
 */
export function getClaudeCodeOptions(toolConfig: ToolConfig): ClaudeCodeOptions {
  return (toolConfig.options?.claudeCode ?? {}) as ClaudeCodeOptions;
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: Config = {
  tools: [
    {
      name: "claude-code",
      enabled: true,
      priority: 1,
      command: "claude",
      args: [],
      capabilities: ["complex", "multi-file", "architecture"],
      options: {
        claudeCode: {
          permissionMode: "acceptEdits",
          allowedTools: "Bash(*) Read(*) Edit(*) Write(*)",
          debug: false,
          addDir: []
        }
      }
    },
    {
      name: "opencode",
      enabled: true,
      priority: 2,
      endpoint: "http://localhost:3000/api",
      capabilities: ["generation", "scaffolding"]
    },
    {
      name: "cursor",
      enabled: false,
      priority: 3,
      capabilities: ["quick-fix", "single-file"]
    },
    {
      name: "aider",
      enabled: false,
      priority: 4,
      command: "aider",
      capabilities: ["git-aware", "refactoring"]
    }
  ],
  routing: {
    fallbackTool: "claude-code",
    allowOverride: true
  },
  api: {
    port: 8765,
    host: "localhost"
  },
  cli: {
    defaultTool: "auto"
  }
};

/**
 * Load configuration from file
 */
export async function loadConfig(path: string): Promise<Config> {
  try {
    const file = Bun.file(path);
    const contents = await file.text();
    const userConfig = JSON.parse(contents) as Partial<Config>;

    return mergeConfig(DEFAULT_CONFIG, userConfig);
  } catch (e) {
    console.warn(`Failed to load config from ${path}:`, e);
    return DEFAULT_CONFIG;
  }
}

/**
 * Merge user config with default config
 */
function mergeConfig(defaultConfig: Config, userConfig: Partial<Config>): Config {
  return {
    tools: mergeTools(defaultConfig.tools, userConfig.tools ?? []),
    routing: { ...defaultConfig.routing, ...userConfig.routing },
    api: { ...defaultConfig.api, ...userConfig.api },
    cli: { ...defaultConfig.cli, ...userConfig.cli }
  };
}

/**
 * Merge tool configurations
 */
function mergeTools(defaultTools: ToolConfig[], userTools: ToolConfig[]): ToolConfig[] {
  const userToolMap = new Map(userTools.map(t => [t.name, t]));

  return defaultTools.map(tool => {
    const userTool = userToolMap.get(tool.name);
    return userTool ? { ...tool, ...userTool } : tool;
  });
}

/**
 * Get tool configuration by name
 */
export function getToolConfig(config: Config, name: string): ToolConfig | undefined {
  return config.tools.find(t => t.name === name);
}

/**
 * Get enabled tools
 */
export function getEnabledTools(config: Config): ToolConfig[] {
  return config.tools.filter(t => t.enabled);
}

/**
 * Validate configuration
 */
export function validateConfig(config: Config): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate routing config
  if (!config.routing.fallbackTool) {
    errors.push("routing.fallbackTool is required");
  }

  const fallbackTool = getToolConfig(config, config.routing.fallbackTool);
  if (!fallbackTool) {
    errors.push(`routing.fallbackTool "${config.routing.fallbackTool}" not found in tools`);
  }

  // Validate tool configurations
  for (const tool of config.tools) {
    if (!tool.name) {
      errors.push("Tool name is required");
    }

    if (tool.enabled) {
      if (!tool.command && !tool.endpoint) {
        errors.push(`Tool "${tool.name}" is enabled but has no command or endpoint`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
