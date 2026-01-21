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

  async isAvailable(): Promise<boolean> {
    const command = this.getCommand();
    if (!command) return false;

    try {
      const proc = Bun.spawn(["which", command], {
        stdout: "pipe",
        stderr: "pipe"
      });

      const timeout = setTimeout(() => proc.kill(), 3000);
      await proc.exited;
      clearTimeout(timeout);

      return proc.exitCode === 0;
    } catch {
      return false;
    }
  }

  async execute(request: ToolRequest): Promise<ToolResult> {
    const sessionId = this.generateSessionId();
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

    // Build shell command
    const shellCmd = `cd /tmp && ${command} ${args.map((a: string) => a.includes(" ") ? `"${a}"` : a).join(" ")}`;

    console.error(`[${this.name}] ${shellCmd}`);

    try {
      // Use shell to execute command and capture both stdout and stderr
      const proc = Bun.spawn(["sh", "-c", `${shellCmd} 2>&1`], {
        stdout: "pipe",
        stderr: "pipe"
      });

      // Read all output with a timeout
      const chunks: Uint8Array[] = [];
      const reader = proc.stdout.getReader();
      const decoder = new TextDecoder();

      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 25000)
      );

      const readPromise = (async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      })();

      await Promise.race([readPromise, timeoutPromise]);

      // Kill process if still running
      try { proc.kill(); } catch {}

      const output = chunks.length > 0
        ? new TextDecoder().decode(
            chunks.reduce((acc, chunk) => {
              const merged = new Uint8Array(acc.length + chunk.length);
              merged.set(acc);
              merged.set(chunk, acc.length);
              return merged;
            }, new Uint8Array(0))
          )
        : "";

      return {
        success: true,
        output: output.trim(),
        error: undefined,
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

  async stream(
    _request: ToolRequest,
    _onEvent: (event: StreamEvent) => void
  ): Promise<void> {
    // Not implemented yet
  }

  async cancel(_sessionId: string): Promise<void> {
    // Not implemented yet
  }

  protected abstract getCommand(): string | null;
  protected abstract getArgs(request: ToolRequest): string[];

  protected generateSessionId(): string {
    return `${this.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
