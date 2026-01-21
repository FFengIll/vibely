/**
 * Base adapter class that provides common functionality for all tool adapters
 */

import type {
  ToolAdapter,
  ToolRequest,
  ToolResult,
  StreamEvent,
  ToolCapability
} from "./types.ts";

export abstract class BaseAdapter implements ToolAdapter {
  abstract readonly name: string;
  abstract readonly capability: ToolCapability;

  /**
   * Check if the tool is available
   * Default implementation checks if command exists
   */
  async isAvailable(): Promise<boolean> {
    const command = this.getCommand();
    if (!command) return false;

    try {
      const proc = Bun.spawn(["which", command], {
        stdout: "pipe",
        stderr: "pipe"
      });
      await proc.exited;
      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }

  /**
   * Execute a request
   * Default implementation uses subprocess
   */
  async execute(request: ToolRequest): Promise<ToolResult> {
    const sessionId = request.options.sessionId ?? this.generateSessionId();

    const command = this.getCommand();
    const args = this.getArgs(request);

    if (!command) {
      return {
        success: false,
        output: "",
        error: `Tool ${this.name} is not configured`,
        sessionId
      };
    }

    try {
      const proc = Bun.spawn([command, ...args], {
        cwd: request.context.directory.path,
        env: { ...process.env, ...request.context.env },
        stdout: "pipe",
        stderr: "pipe"
      });

      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();
      const exitCode = await proc.exited;

      return {
        success: exitCode === 0,
        output: stdout,
        error: stderr || undefined,
        sessionId
      };
    } catch (e) {
      return {
        success: false,
        output: "",
        error: e instanceof Error ? e.message : String(e),
        sessionId
      };
    }
  }

  /**
   * Stream execution results
   * Default implementation streams subprocess output
   */
  async stream(
    request: ToolRequest,
    onEvent: (event: StreamEvent) => void
  ): Promise<void> {
    const sessionId = request.options.sessionId ?? this.generateSessionId();

    onEvent({
      type: "routing",
      data: { tool: this.name, sessionId }
    });

    const command = this.getCommand();
    const args = this.getArgs(request);

    if (!command) {
      onEvent({
        type: "error",
        data: { error: `Tool ${this.name} is not configured` }
      });
      return;
    }

    try {
      const proc = Bun.spawn([command, ...args], {
        cwd: request.context.directory.path,
        env: { ...process.env, ...request.context.env },
        stdout: "pipe",
        stderr: "pipe"
      });

      // Stream stdout
      const reader = proc.stdout.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        onEvent({
          type: "output",
          data: { content: text }
        });
      }

      const exitCode = await proc.exited;

      onEvent({
        type: "complete",
        data: { status: exitCode === 0 ? "success" : "failed", exitCode }
      });
    } catch (e) {
      onEvent({
        type: "error",
        data: { error: e instanceof Error ? e.message : String(e) }
      });
    }
  }

  /**
   * Cancel a running session
   * Default implementation is a no-op (override if tool supports cancellation)
   */
  async cancel(_sessionId: string): Promise<void> {
    // Override in subclass if tool supports cancellation
  }

  /**
   * Get the command to run for this tool
   * Override in subclass
   */
  protected abstract getCommand(): string | null;

  /**
   * Get the arguments for the request
   * Override in subclass
   */
  protected abstract getArgs(request: ToolRequest): string[];

  /**
   * Generate a unique session ID
   */
  protected generateSessionId(): string {
    return `${this.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
