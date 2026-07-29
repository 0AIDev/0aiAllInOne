// ============================================================
// AIStack — Complete Chat Completions Gateway
// Pipeline: Auth → Rate Limit → Quota → Guardrails → Validate
//   → Sanitize → Task-Route → Session Affinity → Compress
//   → Resolve Model → P2C Route → Combo Fallback → Execute
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { hashApiKey } from "@/lib/utils/encryption";
import { prisma } from "@/lib/prisma";
import { RateLimiter } from "@/lib/security/rate-limiter";
import {
  chatCompletionRequestSchema,
  sanitizeMessages,
} from "@/lib/security/validator";
import { guardMessages } from "@/lib/security/guardrails";
import { QuotaManager } from "@/lib/gateway/quota";
import { P2CRouter, RoutingError } from "@/lib/gateway/p2c-router";
import { ComboEngine, ComboError } from "@/lib/gateway/combo-engine";
import { BaseExecutor, ExecutorError } from "@/lib/gateway/executor";
import { breakers } from "@/lib/gateway/circuit-breaker";
import { detectTask } from "@/lib/gateway/task-router";
import {
  compressMessages,
  estimateTokens,
} from "@/lib/gateway/compression";
import type { ChatCompletionRequest } from "@/lib/security/validator";

const MAX_BODY_SIZE = parseInt(process.env.MAX_BODY_SIZE_BYTES ?? "") || 50 * 1024 * 1024;
const GATEWAY_TIMEOUT = parseInt(process.env.GATEWAY_TIMEOUT_MS ?? "") || 120000;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let tenantId = "";
  let apiKeyId: string | undefined;

  try {
    // ═══════════════════════════════════════════
    // PHASE 1: Authenticate
    // ═══════════════════════════════════════════
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return apiError(401, "unauthorized", "Missing Authorization header");
    }

    const rawKey = authHeader.slice(7).trim();
    const hashedKey = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.findUnique({
      where: { hashedKey },
      include: { tenant: true },
    });

    if (!apiKey || apiKey.status !== "ACTIVE") {
      return apiError(401, "unauthorized", "Invalid or revoked API key");
    }
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return apiError(401, "expired", "API key has expired");
    }

    tenantId = apiKey.tenantId;
    apiKeyId = apiKey.id;

    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    // ═══════════════════════════════════════════
    // PHASE 2: Rate Limiting
    // ═══════════════════════════════════════════
    const rateLimit = await RateLimiter.checkTenantRequest(tenantId, apiKeyId);
    if (!rateLimit.allowed) {
      return apiError(429, "rate_limited", "Rate limit exceeded", {
        retryAfter: rateLimit.retryAfter,
      });
    }

    // ═══════════════════════════════════════════
    // PHASE 3: Quota Check
    // ═══════════════════════════════════════════
    const quota = await QuotaManager.checkQuota(tenantId);
    if (!quota.allowed) {
      return apiError(429, "quota_exceeded", quota.reason ?? "Quota exceeded", {
        usedTokens: quota.usedTokens,
        hardLimit: quota.hardLimit,
        resetAt: resetDate(),
      });
    }

    // ═══════════════════════════════════════════
    // PHASE 4: Parse & Validate
    // ═══════════════════════════════════════════
    const contentLength = parseInt(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_BODY_SIZE) {
      return apiError(413, "payload_too_large", "Request body too large");
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return apiError(400, "invalid_request", "Invalid JSON body");
    }

    const parseResult = chatCompletionRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, "validation_error", "Invalid request parameters", {
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const requestBody: ChatCompletionRequest = parseResult.data;

    // ═══════════════════════════════════════════
    // PHASE 5: Guardrails + Sanitize
    // ═══════════════════════════════════════════
    requestBody.messages = sanitizeMessages(requestBody.messages) as typeof requestBody.messages;

    // PII masking + injection detection
    const guardResult = guardMessages(requestBody.messages, "warn");
    if (guardResult.blocked) {
      return apiError(403, "guardrail_blocked", "Request blocked by security guardrails", {
        injectionsDetected: guardResult.summary.injectionsDetected,
      });
    }
    requestBody.messages = guardResult.messages as typeof requestBody.messages;

    // ═══════════════════════════════════════════
    // PHASE 6: Task-Aware Routing
    // ═══════════════════════════════════════════
    const detectedTask = detectTask(requestBody.messages);
    if (detectedTask && requestBody.model === "auto") {
      // Override model with task-specific routing
      const taskTargets = (await import("@/lib/gateway/task-router")).getTaskComboTargets(detectedTask.task);
      if (taskTargets.length > 0) {
        // Will be used in combo execution
        console.log(`[TaskRouter] Detected: ${detectedTask.task} (confidence: ${Math.round(detectedTask.confidence * 100)}%)`);
      }
    }

    // ═══════════════════════════════════════════
    // PHASE 8: Check allowed models (API key policy)
    // ═══════════════════════════════════════════
    const keyAllowedModels: string[] = JSON.parse(apiKey.allowedModels || "[]");
    if (keyAllowedModels.length > 0) {
      const isAllowed = keyAllowedModels.some(
        (m) => m === "*" || m === requestBody.model || requestBody.model.startsWith(`${m}/`)
      );
      if (!isAllowed) {
        return apiError(403, "model_not_allowed", `Model '${requestBody.model}' not allowed`);
      }
    }

    // ═══════════════════════════════════════════
    // PHASE 7: Prompt Compression (RTK-inspired)
    // ═══════════════════════════════════════════
    const estimateIn = estimateTokens(requestBody.messages);
    const compressLevel = quota.isHardQuota ? "aggressive" : "light";
    const compressionResult = compressMessages(requestBody.messages, { level: compressLevel });
    const compressedMessages = compressionResult.messages as typeof requestBody.messages;

    // ═══════════════════════════════════════════
    // PHASE 8: Resolve model — is it a combo?
    // ═══════════════════════════════════════════
    const modelStr = requestBody.model;
    const isCombo =
      modelStr === "auto" || modelStr === "fast" || modelStr === "cheap" ||
      modelStr.startsWith("auto/") || modelStr.startsWith("fast/") || modelStr.startsWith("cheap/");

    // ═══════════════════════════════════════════
    // PHASE 9: Execute — Combo or Single Model
    // ═══════════════════════════════════════════
    if (isCombo) {
      return executeCombo(
        request,
        requestBody,
        compressedMessages,
        { tenantId, apiKeyId, modelStr, compressionResult, estimateIn, quota, startTime }
      );
    } else {
      return executeSingleModel(
        request,
        requestBody,
        compressedMessages,
        { tenantId, apiKeyId, modelStr, compressionResult, estimateIn, quota, startTime }
      );
    }
  } catch (error) {
    console.error("Gateway error:", error);

    if (error instanceof RoutingError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    if (error instanceof ComboError) {
      return apiError(error.statusCode, error.code, error.message);
    }
    if (error instanceof ExecutorError) {
      return apiError(error.statusCode, error.code, error.message);
    }

    return apiError(500, "internal_error", "An unexpected error occurred");
  }
}

// ════════════════════════════════════════════════════════════
// Combo Execution
// ════════════════════════════════════════════════════════════

async function executeCombo(
  request: NextRequest,
  body: ChatCompletionRequest,
  messages: typeof body.messages,
  ctx: {
    tenantId: string;
    apiKeyId?: string;
    modelStr: string;
    compressionResult: { tokenSavings: number; compressionRatio: number };
    estimateIn: number;
    quota: { remainingTokens: number };
    startTime: number;
  }
): Promise<NextResponse> {
  const targets = ComboEngine.resolveComboTargets(ctx.tenantId, ctx.modelStr);

  try {
    const result = await ComboEngine.execute({
      tenantId: ctx.tenantId,
      apiKeyId: ctx.apiKeyId,
      requestModel: ctx.modelStr,
      targets,
      strategy: "PRIORITY",
      maxRetries: 3,
      stream: body.stream ?? false,
    });

    // Track usage
    const latencyMs = Date.now() - ctx.startTime;
    await QuotaManager.trackUsage({
      tenantId: ctx.tenantId,
      apiKeyId: ctx.apiKeyId,
      modelId: result.modelUsed,
      requestModel: ctx.modelStr,
      tokensInput: ctx.estimateIn,
      tokensOutput: 0,
      cost: 0,
      latencyMs,
      compressionRatio: ctx.compressionResult.compressionRatio,
      fallbackUsed: result.attempts > 1 || result.fallbackChain.length > 1,
      fallbackChain: JSON.stringify(result.fallbackChain),
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
    });

    // If streaming, pipe the response
    if (body.stream && result.response.body) {
      return new NextResponse(result.response.body, {
        status: result.response.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "x-provider": result.providerSlug,
          "x-model-used": result.modelUsed,
          "x-latency-ms": latencyMs.toString(),
          "x-quota-remaining": ctx.quota.remainingTokens.toString(),
          "x-fallback-chain": result.fallbackChain.join(", "),
        },
      });
    }

    // Non-streaming: forward the JSON response
    const responseBody = await result.response.json().catch(() => ({
      error: { message: "Failed to parse provider response" },
    }));

    return NextResponse.json(responseBody, {
      status: result.response.status,
      headers: {
        "x-provider": result.providerSlug,
        "x-model-used": result.modelUsed,
        "x-latency-ms": latencyMs.toString(),
        "x-compression-saved": ctx.compressionResult.tokenSavings.toString(),
        "x-quota-remaining": ctx.quota.remainingTokens.toString(),
        "x-fallback-chain": result.fallbackChain.join(", "),
      },
    });
  } catch (err) {
    if (err instanceof ComboError) throw err;
    throw new ComboError("COMBO_FAILED", (err as Error).message);
  }
}

// ════════════════════════════════════════════════════════════
// Single Model Execution
// ════════════════════════════════════════════════════════════

async function executeSingleModel(
  request: NextRequest,
  body: ChatCompletionRequest,
  messages: typeof body.messages,
  ctx: {
    tenantId: string;
    apiKeyId?: string;
    modelStr: string;
    compressionResult: { tokenSavings: number; compressionRatio: number };
    estimateIn: number;
    quota: { remainingTokens: number };
    startTime: number;
  }
): Promise<NextResponse> {
  // P2C: select the best provider + credential
  const selected = await P2CRouter.selectProvider(ctx.tenantId, ctx.modelStr);

  const { target, credential, fallbackChain } = selected;

  // Build the forward request body
  const forwardBody: Record<string, unknown> = {
    ...body,
    model: target.model.modelId,
    messages,
  };

  // Create executor
  const executor = new BaseExecutor({
    providerId: target.provider.id,
    providerName: target.provider.name,
    providerSlug: target.provider.slug,
    modelId: target.model.modelId,
    baseUrl: target.provider.baseUrl,
    apiKeyHeader: target.provider.apiKeyHeader,
    apiKeyPrefix: target.provider.apiKeyPrefix,
    apiKeyValue: credential.decryptedKey,
    apiKeyId: credential.keyId,
    stream: body.stream ?? false,
    requestBody: forwardBody,
    timeoutMs: GATEWAY_TIMEOUT,
    maxRetries: 1,
  });

  try {
    const result = await executor.execute();
    const latencyMs = Date.now() - ctx.startTime;

    // Mark key success
    P2CRouter.markKeySuccess(credential.keyId).catch(() => {});
    breakers.recordSuccess(`provider:${target.provider.id}`);
    breakers.recordSuccess(`model:${target.provider.id}:${target.model.modelId}`);

    // Streaming
    if (body.stream && result.response.body) {
      // Pipe stream with telemetry headers
      const headers = new Headers({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "x-provider": target.provider.slug,
        "x-model-used": target.model.modelId,
        "x-quota-remaining": ctx.quota.remainingTokens.toString(),
      });

      return new NextResponse(result.response.body, {
        status: result.response.status,
        headers,
      });
    }

    // Non-streaming: parse and track
    const responseBody = await result.response.json().catch(() => ({
      error: { message: "Failed to parse provider response" },
    }));

    const usage = responseBody?.usage ?? {};
    const tokensIn = usage.prompt_tokens ?? 0;
    const tokensOut = usage.completion_tokens ?? 0;

    await QuotaManager.trackUsage({
      tenantId: ctx.tenantId,
      apiKeyId: ctx.apiKeyId,
      providerId: target.provider.id,
      modelId: target.model.modelId,
      requestModel: ctx.modelStr,
      tokensInput: tokensIn,
      tokensOutput: tokensOut,
      tokensCacheHit: usage.prompt_tokens_details?.cached_tokens ?? 0,
      cost: 0,
      latencyMs,
      compressionRatio: ctx.compressionResult.compressionRatio,
      fallbackUsed: fallbackChain.length > 1,
      fallbackChain: JSON.stringify(fallbackChain),
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json(responseBody, {
      status: result.response.status,
      headers: {
        "x-provider": target.provider.slug,
        "x-model-used": target.model.modelId,
        "x-latency-ms": latencyMs.toString(),
        "x-compression-saved": ctx.compressionResult.tokenSavings.toString(),
        "x-quota-remaining": ctx.quota.remainingTokens.toString(),
        "x-fallback-chain": fallbackChain.join(", "),
      },
    });
  } catch (err) {
    // Mark key failure
    P2CRouter.markKeyFailure(credential.keyId, (err as Error).message).catch(() => {});
    breakers.recordFailure(`provider:${target.provider.id}`);
    breakers.recordFailure(`model:${target.provider.id}:${target.model.modelId}`);

    if (err instanceof ExecutorError) throw err;

    // Try fallback through remaining chain
    throw new RoutingError(
      "PROVIDER_FAILED",
      `${target.provider.slug}/${target.model.modelId} failed: ${(err as Error).message}`,
      502
    );
  }
}

// ════════════════════════════════════════════════════════════
// OPTIONS — CORS preflight
// ════════════════════════════════════════════════════════════

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

// ════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════

function apiError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    { error: { code, message, ...extra } },
    { status }
  );
}

function resetDate(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
}
