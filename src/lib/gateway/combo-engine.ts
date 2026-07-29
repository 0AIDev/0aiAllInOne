// ============================================================
// AI0FY — Combo Engine (Multi-Model Fallback Chains)
// Pattern: OmniRoute open-sse/services/combo.ts
// ============================================================

import { P2CRouter, RoutingError } from "./p2c-router";
import { BaseExecutor } from "./executor";
import { breakers } from "./circuit-breaker";

interface ComboTarget {
  providerSlug: string;
  modelId: string;
  weight: number;
  priority: number;
}

interface ComboContext {
  tenantId: string;
  apiKeyId?: string;
  requestModel: string;
  targets: ComboTarget[];
  strategy: "PRIORITY" | "WEIGHTED" | "FILL_FIRST" | "FUSION";
  maxRetries: number;
  stream: boolean;
}

interface ComboResult {
  response: Response;
  providerSlug: string;
  modelUsed: string;
  fallbackChain: string[];
  attempts: number;
  latencyMs: number;
}

export class ComboEngine {
  /**
   * Execute a combo: try each target in order until one succeeds.
   * Implements automatic fallback across providers.
   */
  static async execute(ctx: ComboContext): Promise<ComboResult> {
    const fallbackChain: string[] = [];

    // Sort targets by strategy
    const ordered = this.orderTargets(ctx.targets, ctx.strategy);

    for (let attempt = 0; attempt < ctx.maxRetries; attempt++) {
      for (const target of ordered) {
        const targetKey = `${target.providerSlug}/${target.modelId}`;
        fallbackChain.push(targetKey);

        try {
          // Resolve the target to a concrete provider + credential
          const resolved = await P2CRouter.selectProvider(
            ctx.tenantId,
            `${target.providerSlug}/${target.modelId}`
          );

          const execCtx = {
            providerId: resolved.target.provider.id,
            providerName: resolved.target.provider.name,
            providerSlug: resolved.target.provider.slug,
            modelId: resolved.target.model.modelId,
            baseUrl: resolved.target.provider.baseUrl,
            apiKeyHeader: resolved.target.provider.apiKeyHeader,
            apiKeyPrefix: resolved.target.provider.apiKeyPrefix,
            apiKeyValue: resolved.credential.decryptedKey,
            apiKeyId: resolved.credential.keyId,
            stream: ctx.stream,
            requestBody: { model: resolved.target.model.modelId },
            timeoutMs: 120000,
            maxRetries: 1,
          };

          const executor = new BaseExecutor(execCtx);
          const result = await executor.execute();

          // Mark key as successful
          await P2CRouter.markKeySuccess(resolved.credential.keyId);

          return {
            response: result.response,
            providerSlug: resolved.target.provider.slug,
            modelUsed: resolved.target.model.modelId,
            fallbackChain,
            attempts: attempt + 1,
            latencyMs: result.latencyMs,
          };
        } catch (err) {
          if (err instanceof RoutingError) {
            // All providers for this target failed — try next target
            continue;
          }

          // Executor error — mark key failure and try next
          if (err instanceof Error && "code" in err) {
            continue;
          }

          // Unknown error — try next
          continue;
        }
      }

      // All targets exhausted in this pass — wait and retry if cooldowns allow
      if (attempt < ctx.maxRetries - 1) {
        const minCooldown = this.getMinCooldownMs(ordered[0]?.providerSlug ?? "");
        if (minCooldown > 0 && minCooldown < 30000) {
          await sleep(minCooldown + 500);
          continue;
        }
      }
    }

    throw new ComboError(
      "COMBO_EXHAUSTED",
      `All targets in combo failed. Chain: ${fallbackChain.join(" → ")}`
    );
  }

  /** Order targets based on strategy */
  private static orderTargets(
    targets: ComboTarget[],
    strategy: ComboContext["strategy"]
  ): ComboTarget[] {
    switch (strategy) {
      case "PRIORITY":
        return [...targets].sort((a, b) => a.priority - b.priority);

      case "WEIGHTED":
        return [...targets]
          .map((t) => ({ t, sort: Math.random() / (t.weight || 1) }))
          .sort((a, b) => a.sort - b.sort)
          .map((x) => x.t);

      case "FILL_FIRST":
        return [...targets].sort((a, b) => a.priority - b.priority);

      case "FUSION":
        // FUSION: try all targets in parallel, use first to respond
        return [...targets];

      default:
        return targets;
    }
  }

  private static getMinCooldownMs(providerSlug: string): number {
    const b = breakers.get(`provider:${providerSlug}`);
    return b.getRemainingCooldownMs();
  }

  /**
   * Resolve a model string to combo targets.
   * Example: "auto" → cheapest available model chain
   */
  static resolveComboTargets(
    tenantId: string,
    modelStr: string
  ): ComboTarget[] {
    // "auto" → free providers first, ordered by priority
    if (modelStr === "auto" || modelStr.startsWith("auto/")) {
      return [
        // FREE — no auth needed, always available
        { providerSlug: "opencode", modelId: "deepseek-v4-pro", weight: 3, priority: 1 },
        { providerSlug: "opencode", modelId: "glm-5.2", weight: 3, priority: 2 },
        { providerSlug: "opencode", modelId: "kimi-k3", weight: 2, priority: 3 },
        { providerSlug: "g4f-groq", modelId: "llama-3.3-70b-versatile", weight: 2, priority: 4 },
        { providerSlug: "g4f-groq", modelId: "llama-3.1-8b-instant", weight: 1, priority: 5 },
        { providerSlug: "g4f-gemini", modelId: "gemini-2.5-flash", weight: 2, priority: 6 },
        { providerSlug: "g4f-gemini", modelId: "gemini-2.5-pro", weight: 1, priority: 7 },
        { providerSlug: "pollinations", modelId: "openai", weight: 2, priority: 8 },
        { providerSlug: "pollinations", modelId: "openai-large", weight: 1, priority: 9 },
        { providerSlug: "pollinations", modelId: "mistral", weight: 1, priority: 10 },
        { providerSlug: "g4f-pollinations", modelId: "openai", weight: 1, priority: 11 },
        { providerSlug: "g4f-nvidia", modelId: "nemotron-3-nano-30b-a3b", weight: 1, priority: 12 },
        { providerSlug: "duckduckgo", modelId: "gpt-5.4-mini", weight: 1, priority: 13 },
        { providerSlug: "duckduckgo", modelId: "claude-haiku-4-5", weight: 1, priority: 14 },
        { providerSlug: "aihorde", modelId: "Cydonia-24B-v4.3", weight: 1, priority: 15 },
        // FALLBACK — paid providers (need API key configured)
        { providerSlug: "groq", modelId: "llama-3.1-8b-instant", weight: 1, priority: 90 },
        { providerSlug: "deepseek", modelId: "deepseek-chat", weight: 1, priority: 91 },
        { providerSlug: "openai", modelId: "gpt-4o-mini", weight: 1, priority: 92 },
        { providerSlug: "anthropic", modelId: "claude-3-5-haiku-20241022", weight: 1, priority: 93 },
        { providerSlug: "gemini", modelId: "gemini-2.0-flash", weight: 1, priority: 94 },
      ];
    }

    // "fast" → prioritize low-latency models
    if (modelStr === "fast" || modelStr.startsWith("fast/")) {
      return [
        { providerSlug: "groq", modelId: "llama-3.1-8b-instant", weight: 2, priority: 1 },
        { providerSlug: "gemini", modelId: "gemini-2.0-flash", weight: 1, priority: 2 },
        { providerSlug: "deepseek", modelId: "deepseek-chat", weight: 1, priority: 3 },
      ];
    }

    // "cheap" → minimize cost
    if (modelStr === "cheap" || modelStr.startsWith("cheap/")) {
      return [
        { providerSlug: "groq", modelId: "llama-3.1-8b-instant", weight: 1, priority: 1 },
        { providerSlug: "deepseek", modelId: "deepseek-chat", weight: 1, priority: 2 },
        { providerSlug: "openai", modelId: "gpt-4o-mini", weight: 1, priority: 3 },
      ];
    }

    // Specific provider/model
    const parts = modelStr.split("/");
    if (parts.length === 2) {
      return [
        { providerSlug: parts[0]!, modelId: parts[1]!, weight: 1, priority: 1 },
      ];
    }

    // Try as bare model ID across providers
    return [
      { providerSlug: "groq", modelId: modelStr, weight: 1, priority: 1 },
      { providerSlug: "deepseek", modelId: modelStr, weight: 1, priority: 2 },
      { providerSlug: "openai", modelId: modelStr, weight: 1, priority: 3 },
    ];
  }
}

export class ComboError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 502
  ) {
    super(message);
    this.name = "ComboError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
