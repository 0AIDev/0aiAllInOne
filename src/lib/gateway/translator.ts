// ============================================================
// AIStack — Format Translator (OmniRoute open-sse/translator/)
// OpenAI ↔ Claude ↔ Gemini ↔ Responses API
// ============================================================

type ChatRole = "system" | "user" | "assistant" | "tool" | "function";

interface Message {
  role: ChatRole;
  content?: string | null;
  name?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  refusal?: string;
}

interface OpenAIBody {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string | string[];
  tools?: Array<{
    type: "function";
    function: { name: string; description?: string; parameters?: Record<string, unknown> };
  }>;
  tool_choice?: string | { type: "function"; function: { name: string } };
  response_format?: { type: string; json_schema?: Record<string, unknown> };
  reasoning_effort?: string;
  seed?: number;
}

interface ClaudeBody {
  model: string;
  messages: Array<{ role: "user" | "assistant"; content: Array<ClaudeContentBlock> }>;
  system?: string;
  max_tokens: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  stream?: boolean;
  tools?: Array<{
    name: string;
    description?: string;
    input_schema: Record<string, unknown>;
  }>;
}

type ClaudeContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: string; media_type: string; data: string } }
  | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean };

interface GeminiBody {
  contents: Array<{
    role: "user" | "model";
    parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
  }>;
  systemInstruction?: { parts: Array<{ text: string }> };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    stopSequences?: string[];
  };
  tools?: Array<{
    functionDeclarations: Array<{
      name: string;
      description?: string;
      parameters?: Record<string, unknown>;
    }>;
  }>;
}

export type TargetFormat = "openai" | "claude" | "gemini";

/**
 * Main translator: converts OpenAI format → target format.
 */
export class FormatTranslator {
  static toTarget(body: OpenAIBody, target: TargetFormat): Record<string, unknown> {
    switch (target) {
      case "openai": return body as unknown as Record<string, unknown>;
      case "claude": return this.toClaude(body) as unknown as Record<string, unknown>;
      case "gemini": return this.toGemini(body) as unknown as Record<string, unknown>;
      default: return body as unknown as Record<string, unknown>;
    }
  }

  /**
   * OpenAI → Claude Messages API
   */
  static toClaude(body: OpenAIBody): ClaudeBody {
    const systemMessages = body.messages.filter((m) => m.role === "system");
    const nonSystemMessages = body.messages.filter((m) => m.role !== "system");

    const system = systemMessages.map((m) => m.content ?? "").join("\n\n") || undefined;

    const messages: ClaudeBody["messages"] = [];
    for (const msg of nonSystemMessages) {
      const blocks: ClaudeContentBlock[] = [];

      // Text content
      if (msg.content) {
        blocks.push({ type: "text", text: msg.content });
      }

      // Tool calls → tool_use blocks
      if (msg.tool_calls) {
        for (const tc of msg.tool_calls) {
          blocks.push({
            type: "tool_use",
            id: tc.id,
            name: tc.function.name,
            input: JSON.parse(tc.function.arguments || "{}"),
          });
        }
      }

      // Tool results → tool_result blocks
      if (msg.role === "tool" && msg.tool_call_id) {
        blocks.push({
          type: "tool_result",
          tool_use_id: msg.tool_call_id,
          content: msg.content ?? "",
        });
      }

      if (blocks.length > 0) {
        messages.push({
          role: msg.role === "assistant" || msg.role === "tool" ? "assistant" : "user",
          content: blocks,
        });
      }
    }

    // Translate tools
    const claudeTools = body.tools?.map((t) => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters || { type: "object", properties: {} },
    }));

    return {
      model: body.model,
      messages,
      system,
      max_tokens: body.max_tokens ?? body.max_completion_tokens ?? 4096,
      temperature: body.temperature,
      top_p: body.top_p,
      stop_sequences: typeof body.stop === "string" ? [body.stop] : body.stop,
      stream: body.stream,
      tools: claudeTools,
    };
  }

  /**
   * OpenAI → Gemini API
   */
  static toGemini(body: OpenAIBody): GeminiBody {
    const systemMessages = body.messages.filter((m) => m.role === "system");
    const nonSystemMessages = body.messages.filter((m) => m.role !== "system");

    const systemInstruction = systemMessages.length > 0
      ? { parts: systemMessages.map((m) => ({ text: m.content ?? "" })) }
      : undefined;

    const contents: GeminiBody["contents"] = [];
    for (const msg of nonSystemMessages) {
      const parts: GeminiBody["contents"][number]["parts"] = [];

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      // Tool calls → functionCall (embedded in model turn)
      if (msg.tool_calls) {
        for (const tc of msg.tool_calls) {
          parts.push({
            text: JSON.stringify({
              functionCall: {
                name: tc.function.name,
                args: JSON.parse(tc.function.arguments || "{}"),
              },
            }),
          });
        }
      }

      // Tool results → functionResponse
      if (msg.role === "tool" && msg.tool_call_id) {
        parts.push({
          text: JSON.stringify({
            functionResponse: {
              name: msg.name ?? "unknown",
              response: { content: msg.content ?? "" },
            },
          }),
        });
      }

      if (parts.length > 0) {
        contents.push({
          role: msg.role === "assistant" || msg.role === "tool" ? "model" : "user",
          parts,
        });
      }
    }

    // Translate tools
    const geminiTools = body.tools?.length
      ? [
          {
            functionDeclarations: body.tools.map((t) => ({
              name: t.function.name,
              description: t.function.description,
              parameters: t.function.parameters,
            })),
          },
        ]
      : undefined;

    return {
      contents,
      systemInstruction,
      generationConfig: {
        temperature: body.temperature,
        maxOutputTokens: body.max_tokens ?? body.max_completion_tokens ?? 4096,
        topP: body.top_p,
        stopSequences: typeof body.stop === "string" ? [body.stop] : body.stop,
      },
      tools: geminiTools,
    };
  }

  /**
   * Detect target format from provider name.
   */
  static detectFormat(providerSlug: string): TargetFormat {
    if (providerSlug.includes("anthropic") || providerSlug.includes("claude")) return "claude";
    if (providerSlug.includes("gemini") || providerSlug.includes("google")) return "gemini";
    return "openai"; // Default: OpenAI-compatible
  }
}
