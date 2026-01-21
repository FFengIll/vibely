/**
 * Session manager - tracks and manages tool execution sessions
 */

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  tool: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  status: "active" | "completed" | "failed";
  metadata?: Record<string, unknown>;
}

/**
 * Session manager class
 */
export class SessionManager {
  private sessions = new Map<string, Session>();

  /**
   * Create a new session
   */
  create(tool: string, id?: string, metadata?: Record<string, unknown>): Session {
    const sessionId = id ?? this.generateId();
    const session: Session = {
      id: sessionId,
      tool,
      messages: [],
      startTime: new Date(),
      status: "active",
      metadata
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get a session by ID
   */
  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  /**
   * Add a message to a session
   */
  addMessage(sessionId: string, role: Message["role"], content: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.messages.push({
      role,
      content,
      timestamp: new Date()
    });
  }

  /**
   * Complete a session
   */
  complete(sessionId: string, status: "completed" | "failed" = "completed"): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.status = status;
    session.endTime = new Date();
  }

  /**
   * Delete a session
   */
  delete(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get all sessions
   */
  getAll(): Session[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get sessions by tool
   */
  getByTool(tool: string): Session[] {
    return this.getAll().filter(s => s.tool === tool);
  }

  /**
   * Get active sessions
   */
  getActive(): Session[] {
    return this.getAll().filter(s => s.status === "active");
  }

  /**
   * Clean up old completed sessions
   */
  cleanup(olderThanMs: number = 3600000): number {
    const cutoff = new Date(Date.now() - olderThanMs);
    let count = 0;

    for (const [id, session] of this.sessions) {
      if (
        session.status !== "active" &&
        session.endTime &&
        session.endTime < cutoff
      ) {
        this.sessions.delete(id);
        count++;
      }
    }

    return count;
  }

  /**
   * Generate a unique session ID
   */
  private generateId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  /**
   * Get session statistics
   */
  getStats(): {
    total: number;
    active: number;
    completed: number;
    failed: number;
    byTool: Record<string, number>;
  } {
    const sessions = this.getAll();
    const byTool: Record<string, number> = {};

    for (const session of sessions) {
      byTool[session.tool] = (byTool[session.tool] ?? 0) + 1;
    }

    return {
      total: sessions.length,
      active: sessions.filter(s => s.status === "active").length,
      completed: sessions.filter(s => s.status === "completed").length,
      failed: sessions.filter(s => s.status === "failed").length,
      byTool
    };
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();
