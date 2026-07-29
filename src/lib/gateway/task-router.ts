// ============================================================
// AI0FY — Task-Aware Router (OmniRoute T05)
// Semantic detection: code-gen, reasoning, chat, search → best model
// ============================================================

export type TaskCategory =
  | "code-generation"
  | "code-review"
  | "debugging"
  | "reasoning"
  | "math"
  | "creative-writing"
  | "translation"
  | "summarization"
  | "chat"
  | "search"
  | "vision"
  | "data-analysis";

interface TaskRoutingRule {
  task: TaskCategory;
  patterns: RegExp[];
  preferredModels: string[];
  fallbackModels: string[];
}

const TASK_ROUTING_RULES: TaskRoutingRule[] = [
  {
    task: "code-generation",
    patterns: [
      /write\s+(a\s+)?(function|class|component|api|endpoint|route|middleware|hook|service|module)/i,
      /create\s+(a\s+)?(react\s+)?(component|page|app|api|server|client|database|schema)/i,
      /generate\s+(a\s+)?(code|script|program|lambda|dockerfile)/i,
      /implement\s+(a\s+)?(function|method|class|interface|type|algorithm)/i,
      /build\s+(me\s+)?(an?\s+)?(app|api|website|tool|cli|extension|plugin)/i,
      /(javascript|typescript|python|rust|go|java|ruby|php|c#|swift|kotlin)\s+(code|script|function)/i,
      /\b(code|refactor)\s+(this|the following)\b/i,
      /\.tsx?$|\.jsx?$|\.py$|\.rs$|\.go$/m,
    ],
    preferredModels: ["opencode/kimi-k3", "pollinations/qwen-coder", "g4f-groq/llama-3.1-8b-instant"],
    fallbackModels: ["opencode/glm-5.2", "opencode/deepseek-v4-pro"],
  },
  {
    task: "reasoning",
    patterns: [
      /\b(explain|why|reason|think\s+(about|through)|analyze|logical|deduce|infer|prove|disprove)\b/i,
      /\b(philosoph|ethic|moral|complex\s+problem|paradox|thought\s+experiment)\b/i,
      /\b(solve|puzzle|riddle|brain\s+teaser)\b/i,
      /\b(step\s+by\s+step|walk\s+through|break\s+down|elaborate|deep\s+dive)\b/i,
    ],
    preferredModels: ["opencode/deepseek-v4-pro", "g4f-gemini/gemini-2.5-pro"],
    fallbackModels: ["opencode/glm-5.2", "g4f-gemini/gemini-2.5-flash"],
  },
  {
    task: "math",
    patterns: [
      /\b(calculate|compute|solve|equation|formula|math|algebra|calculus|geometry|statistic|probability)\b/i,
      /[+\-*/^]=?\s*\d|\d\s*[+\-*/^]=?\s*\d/,
      /\b(\d+x\d+|matrix|vector|derivative|integral|limit|theorem)\b/i,
    ],
    preferredModels: ["opencode/deepseek-v4-pro", "g4f-gemini/gemini-2.5-pro"],
    fallbackModels: ["g4f-groq/llama-3.3-70b-versatile"],
  },
  {
    task: "creative-writing",
    patterns: [
      /\b(write\s+(a\s+)?(story|poem|essay|article|blog|novel|script|dialogue|letter|speech))\b/i,
      /\b(creative|fiction|narrative|storytelling|worldbuilding|character)\b/i,
      /\b(brainstorm|outline|draft|compose)\b.*\b(story|article|content|copy)\b/i,
    ],
    preferredModels: ["opencode/kimi-k3", "g4f-gemini/gemini-2.5-pro"],
    fallbackModels: ["duckduckgo/claude-haiku-4-5", "opencode/qwen3.6-plus"],
  },
  {
    task: "translation",
    patterns: [
      /\b(translate|traduci|übersetze|traduire|traducir)\b/i,
      /\b(from|to|into)\s+(english|italian|spanish|french|german|chinese|japanese|korean|portuguese|russian|arabic|hindi)\b/i,
      /\b(in\s+)(english|italian|spanish|french|german|chinese|japanese|korean)\b/i,
    ],
    preferredModels: ["g4f-gemini/gemini-2.5-flash", "opencode/qwen3.6-plus"],
    fallbackModels: ["duckduckgo/gpt-5.4-mini"],
  },
  {
    task: "summarization",
    patterns: [
      /\b(summarize|summarise|tldr|tl;dr|recap|synopsis|abstract|overview|gist|in\s+brief)\b/i,
      /\b(summary\s+of|condense|shorten)\b/i,
      /\b(give\s+me\s+(a|the)\s+(summary|overview|rundown))\b/i,
    ],
    preferredModels: ["g4f-groq/llama-3.1-8b-instant", "opencode/deepseek-v4-pro"],
    fallbackModels: ["g4f-gemini/gemini-2.5-flash"],
  },
  {
    task: "data-analysis",
    patterns: [
      /\b(analyze|analyse|visualize|chart|graph|plot|dataset|csv|json|excel|spreadsheet|sql|database|query)\b.*(data|information|results)/i,
      /\b(data\s+(analysis|science|mining|processing|cleaning|transformation))\b/i,
      /\b(pandas|numpy|matplotlib|tableau|power\s*bi)\b/i,
      /\b(extract|transform|load|etl|aggregate|pivot|group\s+by)\b/i,
    ],
    preferredModels: ["opencode/glm-5.2", "g4f-gemini/gemini-2.5-pro"],
    fallbackModels: ["opencode/deepseek-v4-pro"],
  },
];

/**
 * Detect the task category from user messages.
 * Checks assistant and system messages too for context.
 */
export function detectTask(
  messages: Array<{ role: string; content?: string | null }>
): { task: TaskCategory; confidence: number } | null {
  const userContent = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content ?? "")
    .join("\n");

  if (!userContent.trim()) return null;

  const scores: Array<{ task: TaskCategory; score: number }> = [];

  for (const rule of TASK_ROUTING_RULES) {
    let score = 0;
    for (const pattern of rule.patterns) {
      const matches = userContent.match(pattern);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      scores.push({ task: rule.task, score });
    }
  }

  if (scores.length === 0) return { task: "chat", confidence: 0.5 };

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0]!;
  const total = scores.reduce((s, sc) => s + sc.score, 0);
  const confidence = total > 0 ? best.score / total : 0;

  return { task: best.task, confidence };
}

/**
 * Get the best model for a detected task.
 */
export function getTaskModel(task: TaskCategory): string[] {
  const rule = TASK_ROUTING_RULES.find((r) => r.task === task);
  if (!rule) return [];
  return [...rule.preferredModels, ...rule.fallbackModels];
}

/**
 * Get all models for a task as ComboTarget format.
 */
export function getTaskComboTargets(task: TaskCategory): Array<{
  providerSlug: string;
  modelId: string;
  weight: number;
  priority: number;
}> {
  const allModels = getTaskModel(task);
  if (allModels.length === 0) return [];

  return allModels.map((slug, i) => {
    const parts = slug.split("/");
    const isPreferred = i < (TASK_ROUTING_RULES.find((r) => r.task === task)?.preferredModels.length ?? 0);
    return {
      providerSlug: parts[0]!,
      modelId: parts.slice(1).join("/"),
      weight: isPreferred ? 3 : 1,
      priority: i + 1,
    };
  });
}
