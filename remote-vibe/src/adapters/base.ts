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
   * Default implementation uses subprocess with output redirected to pipe file
   */
  async execute(request: ToolRequest): Promise<ToolResult> {
    const sessionId = request.options.sessionId ?? this.generateSessionId();

    const command = this.getCommand();
    const args = this.getArgs(request);

    if (!command) {
      const error = `Tool ${this.name} is not configured`;
      return {
        success: false,
        output: "",
        error,
        sessionId
      };
    }

    // Prepare pipe file for raw output
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const filename = `${this.name}-${timestamp}.log`;
    const pipeDir = `${process.cwd()}/pipe`;
    const pipePath = `${pipeDir}/${filename}`;

    // Ensure pipe directory exists
    const procMkdir = Bun.spawn(["mkdir", "-p", pipeDir], {
      stdout: "pipe",
      stderr: "pipe"
    });
    await procMkdir.exited;

    // Write pipe header
    const header = this.formatLogHeader(request, sessionId);
    await Bun.write(pipePath, header);

    // Build shell command with output redirection to pipe file
    const shellCmd = `${command} ${args.map(a => `'${a.replace(/'/g, "'\\''")}'`).join(" ")} >> "${pipePath}" 2>&1`;

    try {
      // Execute via shell with output appended to pipe file
      const proc = Bun.spawn(["sh", "-c", shellCmd], {
        cwd: request.context.directory.path,
        env: { ...process.env, ...request.context.env },
        stdout: "pipe",
        stderr: "pipe"
      });

      const exitCode = await proc.exited;

      // Append footer using shell
      const footer = `\n${"=".repeat(60)}\nExit Code: ${exitCode}\n`;
      const footerCmd = `echo '${footer.replace(/'/g, "'\\''")}' >> "${pipePath}"`;
      const procFooter = Bun.spawn(["sh", "-c", footerCmd], { stdout: "pipe", stderr: "pipe" });
      await procFooter.exited;

      return {
        success: exitCode === 0,
        output: `Output saved to: ${pipePath}`,
        error: exitCode !== 0 ? `Exit code: ${exitCode}` : undefined,
        sessionId
      };
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      const footer = `\n${"=".repeat(60)}\nError: ${error}\n`;
      const footerCmd = `echo '${footer.replace(/'/g, "'\\''")}' >> "${pipePath}"`;
      const procFooter = Bun.spawn(["sh", "-c", footerCmd], { stdout: "pipe", stderr: "pipe" });
      await procFooter.exited;

      return {
        success: false,
        output: `Pipe saved to: ${pipePath}`,
        error,
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

  /**
   * Format log header (written before command output)
   */
  private formatLogHeader(request: ToolRequest, sessionId: string): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push(`Tool: ${this.name}`);
    lines.push(`Session ID: ${sessionId}`);
    lines.push(`Timestamp: ${new Date().toISOString()}`);
    lines.push("=".repeat(60));
    lines.push("");
    lines.push("Prompt:");
    lines.push(request.prompt);
    lines.push("");
    lines.push("-".repeat(60));
    lines.push("Output:");
    lines.push("-".repeat(60));
    lines.push("");

    return lines.join("\n");
  }

  /**
   * Save execution result to a timestamped log file
   */
  protected async saveToLog(
    result: ToolResult,
    request: ToolRequest
  ): Promise<void> {
    try {
      // Use the current working directory where bun was started
      const logsDir = `${process.cwd()}/logs`;

      // Generate timestamp-based filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const filename = `${this.name}-${timestamp}.log`;
      const logPath = `${logsDir}/${filename}`;

      // Format log content
      const logContent = this.formatLogContent(result, request);

      // Write to file
      await Bun.write(logPath, logContent);
    } catch {
      // Silently fail if logging fails
    }
  }

  /**
   * Format log content
   */
  private formatLogContent(
    result: ToolResult,
    request: ToolRequest
  ): string {
    const lines: string[] = [];

    lines.push("=".repeat(60));
    lines.push(`Tool: ${this.name}`);
    lines.push(`Session ID: ${result.sessionId}`);
    lines.push(`Timestamp: ${new Date().toISOString()}`);
    lines.push(`Success: ${result.success}`);
    lines.push("=".repeat(60));
    lines.push("");
    lines.push("Prompt:");
    lines.push(request.prompt);
    lines.push("");
    lines.push("-".repeat(60));
    lines.push("Output:");
    lines.push("-".repeat(60));
    lines.push(result.output || "(no output)");
    lines.push("");

    if (result.error) {
      lines.push("-".repeat(60));
      lines.push("Error:");
      lines.push("-".repeat(60));
      lines.push(result.error);
      lines.push("");
    }

    return lines.join("\n");
  }
}
