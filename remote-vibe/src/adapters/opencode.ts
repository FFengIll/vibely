/**
 * OpenCode adapter
 * Integrates with OpenCode for fast code generation and scaffolding
 */

import { BaseAdapter } from "./base.ts";
import type { ToolRequest, ToolResult, ToolCapability } from "./types.ts";
import { TaskType } from "./types.ts";

export interface OpenCodeConfig {
  /** REST API endpoint */
  endpoint?: string;
  /** CLI command */
  command?: string;
  /** API key for authentication */
  apiKey?: string;
}

export class OpenCodeAdapter extends BaseAdapter {
  readonly name = "opencode";
  readonly capability: ToolCapability = {
    name: "opencode",
    strengths: [
      TaskType.CodeGeneration,
      TaskType.QuickFix
    ],
    complexity: "simple",
    requiresGit: false,
    requiresRuntime: false,
    priority: 2
  };

  private readonly endpoint: string | null;
  private readonly command: string | null;
  private readonly apiKey: string | null;

  constructor(config?: OpenCodeConfig) {
    super();
    this.endpoint = config?.endpoint ?? null;
    this.command = config?.command ?? "opencode";
    this.apiKey = config?.apiKey ?? null;
  }

  protected getCommand(): string | null {
    // Prefer API endpoint if configured
    return this.endpoint ? null : this.command;
  }

  protected getArgs(request: ToolRequest): string[] {
    const args: string[] = [];

    // Use 'run' subcommand with the message
    args.push("run", request.prompt);

    return args;
  }

  /**
   * Execute using HTTP API if endpoint is configured, otherwise use CLI
   */
  async execute(request: ToolRequest): Promise<ToolResult> {
    const sessionId = request.options.sessionId ?? this.generateSessionId();

    if (this.endpoint) {
      return this.executeViaApi(request, sessionId);
    }

    return super.execute(request);
  }

  /**
   * Stream using HTTP API if endpoint is configured, otherwise use CLI
   */
  async stream(
    request: ToolRequest,
    onEvent: (event: import("./types.ts").StreamEvent) => void
  ): Promise<void> {
    if (this.endpoint) {
      return this.streamViaApi(request, onEvent);
    }

    return super.stream(request, onEvent);
  }

  /**
   * Execute via HTTP API
   */
  private async executeViaApi(request: ToolRequest, sessionId: string) {
    if (!this.endpoint) {
      const result = {
        success: false,
        output: "",
        error: "OpenCode endpoint not configured",
        sessionId
      };
      await this.saveToLog(result, request);
      return result;
    }

    try {
      const response = await fetch(`${this.endpoint}/v1/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey && { "Authorization": `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          prompt: request.prompt,
          files: request.context.files?.map(f => ({
            path: f.path,
            content: f.content,
            language: f.language
          })),
          cwd: request.context.cwd
        })
      });

      if (!response.ok) {
        const result = {
          success: false,
          output: "",
          error: `API error: ${response.status} ${response.statusText}`,
          sessionId
        };
        await this.saveToLog(result, request);
        return result;
      }

      const data = await response.json();
      const result = {
        success: true,
        output: data.output ?? "",
        sessionId
      };
      await this.saveToLog(result, request);
      return result;
    } catch (e) {
      const result = {
        success: false,
        output: "",
        error: e instanceof Error ? e.message : String(e),
        sessionId
      };
      await this.saveToLog(result, request);
      return result;
    }
  }

  /**
   * Stream via HTTP API
   */
  private async streamViaApi(
    request: ToolRequest,
    onEvent: (event: import("./types.ts").StreamEvent) => void
  ): Promise<void> {
    const sessionId = request.options.sessionId ?? this.generateSessionId();

    onEvent({
      type: "routing",
      data: { tool: this.name, sessionId }
    });

    if (!this.endpoint) {
      onEvent({
        type: "error",
        data: { error: "OpenCode endpoint not configured" }
      });
      return;
    }

    try {
      const response = await fetch(`${this.endpoint}/v1/generate/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey && { "Authorization": `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          prompt: request.prompt,
          files: request.context.files?.map(f => ({
            path: f.path,
            content: f.content,
            language: f.language
          })),
          cwd: request.context.cwd
        })
      });

      if (!response.ok) {
        onEvent({
          type: "error",
          data: { error: `API error: ${response.status} ${response.statusText}` }
        });
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        onEvent({
          type: "error",
          data: { error: "No response body" }
        });
        return;
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            onEvent({
              type: "output",
              data: { content: data.content ?? data.text ?? "" }
            });
          }
        }
      }

      onEvent({
        type: "complete",
        data: { status: "success" }
      });
    } catch (e) {
      onEvent({
        type: "error",
        data: { error: e instanceof Error ? e.message : String(e) }
      });
    }
  }

  /**
   * Check if OpenCode is available (CLI or API)
   */
  async isAvailable(): Promise<boolean> {
    if (this.endpoint) {
      try {
        // Add timeout using AbortController
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${this.endpoint}/health`, {
          method: "GET",
          headers: {
            ...(this.apiKey && { "Authorization": `Bearer ${this.apiKey}` })
          },
          signal: controller.signal
        });
        clearTimeout(timeout);
        return response.ok;
      } catch {
        return false;
      }
    }

    return super.isAvailable();
  }
}
