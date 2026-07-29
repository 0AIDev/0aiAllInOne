// ============================================================
// AI0FY — RTK + Caveman Compression
// Pattern: OmniRoute open-sse/services/compression/
// ============================================================

type ChatRole = "system" | "user" | "assistant" | "tool" | "function";

interface ChatMessage {
  role: ChatRole;
  content?: string | null;
  name?: string;
  tool_calls?: unknown[];
  tool_call_id?: string;
  refusal?: string;
}

interface CompressOptions {
  level: "none" | "light" | "aggressive";
  maxContextTokens?: number;
}

interface CompressionResult {
  messages: ChatMessage[];
  tokenSavings: number;
  compressionRatio: number;
}

const ESTIMATED_CHARS_PER_TOKEN = 3.5;

// ─── CAVEMAN Rules ─────────────────────────────────────────

/** Patterns to strip while preserving code blocks */
const TERMINAL_NOISE_PATTERNS = [
  /\x1b\[[0-9;]*[a-zA-Z]/g,   // ANSI escape codes
  /\r\n/g,                      // Windows line endings → Unix
  /\r/g,                        // Carriage returns
  /\t{2,}/g,                    // Multiple tabs
];

/** Redundant system/ooc prefixes to shorten */
const CONDENSE_PREFIXES = [
  { pattern: /^You are a helpful,? (AI )?assistant\.?\s*/i, replace: "" },
  { pattern: /^You are an? (expert|skilled|experienced) /i, replace: "You are a " },
  { pattern: /^(Always|Never|Do not|Please) (remember|forget|note) that:?\s*/gim, replace: "" },
];

/** Tool result patterns indicating expandable output */
const TOOL_RESULT_TRUNCATION = {
  maxLines: 50,
  maxChars: 4000,
  summarySuffix: "\n[output truncated — {count} lines / {chars} chars removed]",
};

// ─── Core Compression Functions ─────────────────────────────

/**
 * Light compression: merge consecutive system messages, strip whitespace.
 */
export function compressMessagesLight(messages: ChatMessage[]): CompressionResult {
  const originalLen = JSON.stringify(messages).length;

  const result: ChatMessage[] = [];
  let lastRole = "";

  for (const msg of messages) {
    // Merge consecutive system messages
    if (msg.role === "system" && lastRole === "system" && result.length > 0) {
      const prev = result[result.length - 1]!;
      prev.content = `${prev.content ?? ""}\n${msg.content ?? ""}`;
      continue;
    }

    const cleaned = { ...msg };
    if (typeof cleaned.content === "string") {
      cleaned.content = cleanContent(cleaned.content);
    }
    if (cleaned.name) {
      cleaned.name = cleaned.name.trim();
    }
    result.push(cleaned);
    lastRole = msg.role;
  }

  const compressedLen = JSON.stringify(result).length;
  return calcSavings(originalLen, compressedLen, result);
}

/**
 * Aggressive compression: light + truncation + dedup.
 */
export function compressMessagesAggressive(
  messages: ChatMessage[],
  maxContextTokens: number = 64000
): CompressionResult {
  const light = compressMessagesLight(messages);
  let msgs = light.messages;

  // Apply caveman rules
  msgs = applyCavemanRules(msgs);

  // Deduplicate tool results
  msgs = deduplicateToolResults(msgs);

  // Truncate to fit context window
  const estimatedTokens = Math.ceil(
    msgs.reduce((len, m) => len + (typeof m.content === "string" ? m.content.length : 0), 0) /
      ESTIMATED_CHARS_PER_TOKEN
  );

  if (estimatedTokens > maxContextTokens) {
    const systemMsgs = msgs.filter((m) => m.role === "system");
    const otherMsgs = msgs.filter((m) => m.role !== "system");

    const systemTokens = Math.ceil(
      systemMsgs.reduce(
        (len, m) => len + (typeof m.content === "string" ? m.content.length : 0),
        0
      ) / ESTIMATED_CHARS_PER_TOKEN
    );

    let tokensAvailable = maxContextTokens - systemTokens;

    const kept: ChatMessage[] = [];
    for (let i = otherMsgs.length - 1; i >= 0; i--) {
      const msg = otherMsgs[i]!;
      const msgTokens = Math.ceil(
        (typeof msg.content === "string" ? msg.content.length : 0) /
          ESTIMATED_CHARS_PER_TOKEN
      );
      if (tokensAvailable - msgTokens < 0) break;
      tokensAvailable -= msgTokens;
      kept.unshift(msg);
    }

    msgs = [...systemMsgs, ...kept];
  }

  const compressedLen = JSON.stringify(msgs).length;
  const originalLen = JSON.stringify(messages).length;
  return calcSavings(originalLen, compressedLen, msgs);
}

/**
 * Main entry point.
 */
export function compressMessages(
  messages: ChatMessage[],
  options: CompressOptions = { level: "light" }
): CompressionResult {
  switch (options.level) {
    case "none":
      return { messages, tokenSavings: 0, compressionRatio: 0 };
    case "aggressive":
      return compressMessagesAggressive(messages, options.maxContextTokens);
    case "light":
    default:
      return compressMessagesLight(messages);
  }
}

// ─── Caveman Rules Engine ───────────────────────────────────

function cleanContent(content: string): string {
  let cleaned = content;

  // Strip ANSI / terminal noise
  for (const pattern of TERMINAL_NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Collapse whitespace (preserve intentional formatting)
  cleaned = cleaned
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/^\s*\n/gm, "\n")
    .trim();

  return cleaned;
}

function applyCavemanRules(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((msg) => {
    if (typeof msg.content !== "string") return msg;

    let content = msg.content;

    // Apply condensation prefixes
    for (const rule of CONDENSE_PREFIXES) {
      content = content.replace(rule.pattern, rule.replace);
    }

    // Compress tool results (role: tool)
    if (msg.role === "tool") {
      content = compressToolResult(content);
    }

    // Strip repeated "---" separators
    content = content.replace(/(\n-{3,}\n){2,}/g, "\n---\n");

    return { ...msg, content };
  });
}

function compressToolResult(content: string): string {
  const lines = content.split("\n");
  if (lines.length <= TOOL_RESULT_TRUNCATION.maxLines && content.length <= TOOL_RESULT_TRUNCATION.maxChars) {
    return content;
  }

  // Truncate long tool outputs, keeping head and tail
  const headLines = Math.floor(TOOL_RESULT_TRUNCATION.maxLines * 0.3);
  const tailLines = Math.floor(TOOL_RESULT_TRUNCATION.maxLines * 0.3);
  const middleLines = TOOL_RESULT_TRUNCATION.maxLines - headLines - tailLines;

  const head = lines.slice(0, headLines);
  const tail = lines.slice(-tailLines);
  const truncated = [...head, `... ${middleLines} lines truncated ...`, ...tail];

  const result = truncated.join("\n");
  if (result.length > TOOL_RESULT_TRUNCATION.maxChars) {
    return (
      result.substring(0, TOOL_RESULT_TRUNCATION.maxChars) +
      TOOL_RESULT_TRUNCATION.summarySuffix
        .replace("{count}", lines.length.toString())
        .replace("{chars}", content.length.toString())
    );
  }

  return result;
}

function deduplicateToolResults(messages: ChatMessage[]): ChatMessage[] {
  const seen = new Map<string, number>();
  const result: ChatMessage[] = [];

  for (const msg of messages) {
    if (msg.role === "tool" && msg.tool_call_id) {
      const key = msg.tool_call_id + (typeof msg.content === "string" ? msg.content.substring(0, 200) : "");
      const count = seen.get(key) ?? 0;
      if (count >= 2) continue; // Skip repeated identical tool results
      seen.set(key, count + 1);
    }
    result.push(msg);
  }

  return result;
}

// ─── Utilities ──────────────────────────────────────────────

function calcSavings(originalLen: number, compressedLen: number, messages: ChatMessage[]): CompressionResult {
  const tokenSavings = Math.max(
    0,
    Math.round((originalLen - compressedLen) / ESTIMATED_CHARS_PER_TOKEN)
  );
  const compressionRatio =
    originalLen > 0 ? Math.round((1 - compressedLen / originalLen) * 100) : 0;

  return { messages, tokenSavings, compressionRatio };
}

export function estimateTokens(messages: ChatMessage[]): number {
  let total = 0;
  for (const msg of messages) {
    total += 4; // message framing overhead
    if (typeof msg.content === "string") {
      total += Math.ceil(msg.content.length / ESTIMATED_CHARS_PER_TOKEN);
    }
    if (msg.name) {
      total += Math.ceil(msg.name.length / ESTIMATED_CHARS_PER_TOKEN);
    }
  }
  total += 2; // assistant priming
  return total;
}
