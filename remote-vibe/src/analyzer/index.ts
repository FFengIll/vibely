/**
 * Request analyzer - determines the best tool for a given request
 */

import type { RequestAnalysis, TaskType } from "../adapters/types.ts";

/**
 * Keywords that indicate specific task types
 */
const TASK_KEYWORDS: Record<TaskType, string[]> = {
  code_generation: [
    "generate", "create", "scaffold", "add", "implement", "build",
    "new feature", "new component", "new function", "boilerplate"
  ],
  refactoring: [
    "refactor", "restructure", "reorganize", "clean up", "optimize",
    "improve", "rewrite", "extract", "move", "rearrange"
  ],
  debugging: [
    "debug", "fix", "bug", "error", "issue", "broken", "not working",
    "crash", "fail", "exception"
  ],
  review: [
    "review", "check", "analyze", "audit", "inspect", "examine"
  ],
  documentation: [
    "document", "docstring", "comment", "readme", "explain", "describe"
  ],
  architecture: [
    "architecture", "design", "structure", "pattern", "approach",
    "how should i", "best practice", "system design", "discuss"
  ],
  quick_fix: [
    "quick", "simple", "small", "minor", "tweak", "adjust"
  ]
};

/**
 * Keywords that indicate complexity
 */
const COMPLEXITY_KEYWORDS = {
  high: [
    "architecture", "design", "system", "multiple", "across", "workspace",
    "entire", "whole", "comprehensive", "complete", "full", "all"
  ],
  low: [
    "single", "one", "just this", "only", "quick", "simple", "small",
    "minor", "one file", "this file"
  ]
};

/**
 * Analyze a request and determine the best tool
 */
export function analyzeRequest(input: string, context?: { cwd?: string }): RequestAnalysis {
  const normalizedInput = input.toLowerCase().trim();

  // Detect task type
  const taskType = detectTaskType(normalizedInput);

  // Calculate complexity
  const complexity = calculateComplexity(normalizedInput, taskType);

  // Extract affected files (simplified - in real implementation would parse file references)
  const affectedFiles = extractFileReferences(input);

  // Determine suggested tool based on task type and complexity
  const result = selectTool(taskType, complexity, affectedFiles);

  return {
    taskType,
    complexity,
    affectedFiles,
    suggestedTool: result.tool,
    confidence: result.confidence,
    reasoning: result.reasoning
  };
}

/**
 * Detect the task type from the input
 */
function detectTaskType(input: string): TaskType {
  const scores: Record<TaskType, number> = {
    code_generation: 0,
    refactoring: 0,
    debugging: 0,
    review: 0,
    documentation: 0,
    architecture: 0,
    quick_fix: 0
  };

  // Score each task type based on keyword matches
  for (const [type, keywords] of Object.entries(TASK_KEYWORDS)) {
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        scores[type as TaskType] += 1;
      }
    }
  }

  // Find the highest scoring task type
  let maxScore = 0;
  let detectedType: TaskType = "code_generation";

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type as TaskType;
    }
  }

  return detectedType;
}

/**
 * Calculate complexity (1-10)
 */
function calculateComplexity(input: string, taskType: TaskType): number {
  let complexity = 5; // Base complexity

  // Adjust based on task type
  const typeComplexity: Record<TaskType, number> = {
    architecture: 8,
    refactoring: 6,
    debugging: 5,
    code_generation: 4,
    review: 5,
    documentation: 3,
    quick_fix: 2
  };

  complexity = typeComplexity[taskType];

  // Adjust based on keywords
  for (const keyword of COMPLEXITY_KEYWORDS.high) {
    if (input.includes(keyword)) {
      complexity += 1;
    }
  }

  for (const keyword of COMPLEXITY_KEYWORDS.low) {
    if (input.includes(keyword)) {
      complexity -= 1;
    }
  }

  // Check for file references (multiple files = higher complexity)
  const fileMatches = input.match(/@[\w./-]+/g);
  if (fileMatches) {
    if (fileMatches.length > 3) {
      complexity += 2;
    } else if (fileMatches.length > 1) {
      complexity += 1;
    }
  }

  return Math.max(1, Math.min(10, complexity));
}

/**
 * Extract file references from input (e.g., @src/file.ts)
 */
function extractFileReferences(input: string): string[] {
  const matches = input.match(/@[\w./-]+/g);
  return matches ?? [];
}

/**
 * Select the best tool based on analysis
 */
function selectTool(
  taskType: TaskType,
  complexity: number,
  affectedFiles: string[]
): { tool: string; confidence: number; reasoning: string } {
  // Complex reasoning, multi-file -> Claude Code
  if (complexity > 6 || taskType === "architecture") {
    return {
      tool: "claude-code",
      confidence: 0.9,
      reasoning: `Complex task (${complexity}/10) requiring advanced reasoning and multi-file coordination`
    };
  }

  // Fast generation, scaffolding -> OpenCode
  if (taskType === "code_generation" && complexity < 6) {
    return {
      tool: "opencode",
      confidence: 0.85,
      reasoning: "Code generation task best handled by specialized generation tool"
    };
  }

  // Debugging and refactoring -> Claude Code
  if (taskType === "debugging" || taskType === "refactoring") {
    return {
      tool: "claude-code",
      confidence: 0.8,
      reasoning: "Task requires analysis and understanding of existing code"
    };
  }

  // Review and architecture -> Claude Code
  if (taskType === "review" || taskType === "architecture") {
    return {
      tool: "claude-code",
      confidence: 0.9,
      reasoning: "Task requires deep analysis and reasoning capabilities"
    };
  }

  // Default fallback
  return {
    tool: "claude-code",
    confidence: 0.5,
    reasoning: "Using default tool for general purpose handling"
  };
}
