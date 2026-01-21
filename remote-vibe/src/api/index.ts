/**
 * HTTP API for vibe dispatcher
 */

import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { analyzeRequest } from "../analyzer/index.ts";
import { getAdapter, getAllAdapters } from "../adapters/index.ts";
import { sessionManager } from "../session/index.ts";
import { DEFAULT_CONFIG, loadConfig, validateConfig } from "../config/index.ts";

// Types for API requests/responses
interface ExecuteRequest {
  prompt: string;
  tool?: string;
  options?: {
    stream?: boolean;
    context?: {
      /** Directory where the task should be executed */
      directory?: string;
      /** Optional: file patterns to include */
      include?: string[];
      /** Optional: file patterns to exclude */
      exclude?: string[];
    };
  };
}

interface ExplainResponse {
  taskType: string;
  complexity: number;
  suggestedTool: string;
  confidence: number;
  reasoning: string;
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Create the API app
 */
export function createApi(config: typeof DEFAULT_CONFIG = DEFAULT_CONFIG) {
  const app = new Hono();

  // Health check
  app.get("/health", (c) => {
    return c.json({ status: "ok", version: "0.1.0" });
  });

  // Get available tools
  app.get("/api/v1/tools", async (c) => {
    const adapters = getAllAdapters(config.tools);
    const tools = await Promise.all(
      adapters.map(async (adapter) => ({
        name: adapter.name,
        available: await adapter.isAvailable(),
        capability: (adapter as any).capability
      }))
    );

    return c.json({ tools });
  });

  // Analyze a request (explain routing)
  app.post("/api/v1/analyze", async (c) => {
    const { prompt, context } = await c.req.json<{ prompt: string; context?: { directory?: string } }>();

    if (!prompt) {
      return c.json<ErrorResponse>({ error: "prompt is required" }, 400);
    }

    const analysis = analyzeRequest(prompt, { directory: context?.directory });

    return c.json<ExplainResponse>({
      taskType: analysis.taskType,
      complexity: analysis.complexity,
      suggestedTool: analysis.suggestedTool,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning
    });
  });

  // Execute a request
  app.post("/api/v1/execute", async (c) => {
    const body = await c.req.json<ExecuteRequest>();

    if (!body.prompt) {
      return c.json<ErrorResponse>({ error: "prompt is required" }, 400);
    }

    // Resolve the working directory
    const directory = body.options?.context?.directory ?? process.cwd();

    // Analyze request to determine tool
    const analysis = analyzeRequest(body.prompt, { directory });

    let toolName = body.tool ?? "auto";

    if (toolName === "auto") {
      toolName = analysis.suggestedTool;
    }

    // Get the adapter
    const toolConfig = config.tools.find(t => t.name === toolName);
    const adapter = getAdapter(toolName, toolConfig);

    if (!adapter) {
      return c.json<ErrorResponse>({ error: `Tool "${toolName}" not found` }, 404);
    }

    // Check if tool is available
    const available = await adapter.isAvailable();

    if (!available) {
      return c.json<ErrorResponse>(
        { error: `Tool "${toolName}" is not available` },
        503
      );
    }

    // Create session
    const session = sessionManager.create(toolName);
    sessionManager.addMessage(session.id, "user", body.prompt);

    // Execute request (streaming or non-streaming)
    const shouldStream = body.options?.stream ?? false;

    if (shouldStream) {
      // Stream response using Server-Sent Events
      return streamText(c, async (stream) => {
        // Send routing event
        await stream.write(
          `data: ${JSON.stringify({
            type: "routing",
            tool: toolName,
            sessionId: session.id,
            analysis
          })}\n\n`
        );

        // Execute with streaming
        await adapter.stream(
          {
            prompt: body.prompt,
            context: {
              directory: {
                path: directory,
                include: body.options?.context?.include,
                exclude: body.options?.context?.exclude
              }
            },
            options: { sessionId: session.id, stream: true }
          },
          async (event) => {
            await stream.write(`data: ${JSON.stringify(event)}\n\n`);
          }
        );

        sessionManager.complete(session.id, "completed");
      });
    } else {
      // Non-streaming response
      try {
        const result = await adapter.execute({
          prompt: body.prompt,
          context: {
            directory: {
              path: directory,
              include: body.options?.context?.include,
              exclude: body.options?.context?.exclude
            }
          },
          options: { sessionId: session.id, stream: false }
        });

        if (result.success) {
          sessionManager.addMessage(session.id, "assistant", result.output);
          sessionManager.complete(session.id, "completed");

          return c.json({
            success: true,
            output: result.output,
            sessionId: result.sessionId,
            tool: toolName
          });
        } else {
          sessionManager.complete(session.id, "failed");

          return c.json<ErrorResponse>(
            { error: result.error ?? "Execution failed" },
            500
          );
        }
      } catch (e) {
        sessionManager.complete(session.id, "failed");

        const error = e instanceof Error ? e.message : String(e);
        return c.json<ErrorResponse>({ error, details: e }, 500);
      }
    }
  });

  // Get session info
  app.get("/api/v1/sessions/:id", (c) => {
    const id = c.req.param("id");
    const session = sessionManager.get(id);

    if (!session) {
      return c.json<ErrorResponse>({ error: "Session not found" }, 404);
    }

    return c.json(session);
  });

  // Get all sessions
  app.get("/api/v1/sessions", (c) => {
    const tool = c.req.query("tool");
    const sessions = tool
      ? sessionManager.getByTool(tool)
      : sessionManager.getAll();

    return c.json({ sessions });
  });

  // Get session statistics
  app.get("/api/v1/stats", (c) => {
    const stats = sessionManager.getStats();
    return c.json(stats);
  });

  return app;
}

/**
 * Start the API server
 */
export async function startServer(
  config: typeof DEFAULT_CONFIG = DEFAULT_CONFIG
): Promise<void> {
  const port = config.api?.port ?? 8765;
  const host = config.api?.host ?? "localhost";

  const app = createApi(config);

  console.log(`Starting Vibe Dispatcher API on http://${host}:${port}`);

  // Using Bun's native HTTP server
  const server = Bun.serve({
    port,
    hostname: host,
    fetch: app.fetch
  });

  console.log(`Server started on port ${server.port}`);

  // Keep server running
  return new Promise(() => {});
}

// Start server if this is the main module
if (import.meta.main) {
  startServer().catch(console.error);
}
