import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool", "function"]),
  content: z.union([z.string(), z.null()]).optional(),
  name: z.string().optional(),
  tool_calls: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      })
    )
    .optional(),
  tool_call_id: z.string().optional(),
  refusal: z.string().optional(),
});

export const chatCompletionRequestSchema = z.object({
  model: z.string().min(1, "Model is required").max(200),
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required")
    .max(1000, "Maximum 1000 messages allowed"),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  n: z.number().min(1).max(128).optional().default(1),
  stream: z.boolean().optional().default(false),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  max_tokens: z.number().min(1).max(200000).optional(),
  max_completion_tokens: z.number().min(1).max(200000).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  logit_bias: z.record(z.string(), z.number()).optional(),
  user: z.string().optional(),
  response_format: z
    .object({
      type: z.enum(["text", "json_object", "json_schema"]),
      json_schema: z.record(z.unknown()).optional(),
    })
    .optional(),
  tools: z
    .array(
      z.object({
        type: z.literal("function"),
        function: z.object({
          name: z.string().max(64),
          description: z.string().optional(),
          parameters: z.record(z.unknown()).optional(),
          strict: z.boolean().optional(),
        }),
      })
    )
    .max(128)
    .optional(),
  tool_choice: z
    .union([
      z.literal("none"),
      z.literal("auto"),
      z.literal("required"),
      z.object({
        type: z.literal("function"),
        function: z.object({ name: z.string() }),
      }),
    ])
    .optional(),
  parallel_tool_calls: z.boolean().optional(),
  reasoning_effort: z.enum(["low", "medium", "high"]).optional(),
  seed: z.number().int().optional(),
});

export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;

const STRICT_PROHIBITED_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /eval\s*\(/i,
  /document\.cookie/i,
  /<iframe/i,
  /\bignore all previous instructions\b/i,
  /\bdisregard (all |your )?(previous |prior )?instructions\b/i,
  /\bforget (all |your )?(previous |prior )?instructions\b/i,
];

export function sanitizeInput(input: string): string {
  let sanitized = input;
  for (const pattern of STRICT_PROHIBITED_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  }
  return sanitized.trim();
}

export function sanitizeMessages(
  messages: ChatMessage[]
): ChatMessage[] {
  return messages.map((msg) => ({
    ...msg,
    content: typeof msg.content === "string" ? sanitizeInput(msg.content) : msg.content,
    name: msg.name ? sanitizeInput(msg.name) : undefined,
  }));
}
