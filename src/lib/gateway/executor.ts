// ============================================================
// AIStack — Provider Executor (Template Method Pattern)
// Pattern: OmniRoute open-sse/executors/base.ts
// ============================================================

import { breakers } from "./circuit-breaker";

export interface ExecutorContext {
  providerId: string;
  providerName: string;
  providerSlug: string;
  modelId: string;
  baseUrl: string;
  apiKeyHeader: string;
  apiKeyPrefix: string;
  apiKeyValue: string;
  apiKeyId: string;
  stream: boolean;
  requestBody: Record<string, unknown>;
  timeoutMs: number;
  maxRetries: number;
}

export interface ExecutorResult {
  response: Response;
  url: string;
  latencyMs: number;
}

/**
 * Base executor implementing the Template Method pattern.
 * Subclasses override hooks for provider-specific behavior.
 *
 * Used hooks:
 *   buildUrl() — construct upstream URL
 *   buildHeaders() — auth + request headers
 *   transformRequest() — mutate request body for target provider
 *   parseError() — extract error details from response
 *   shouldRetry() — decide whether to retry after failure
 */
export class BaseExecutor {
  protected ctx: ExecutorContext;

  constructor(ctx: ExecutorContext) {
    this.ctx = ctx;
  }

  /** Override: construct the upstream URL */
  buildUrl(): string {
    const base = this.ctx.baseUrl.replace(/\/$/, "");
    return `${base}/chat/completions`;
  }

  /** Override: build request headers */
  buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Only add auth header if we have an actual key
    if (this.ctx.apiKeyValue && this.ctx.apiKeyValue.length > 0) {
      headers[this.ctx.apiKeyHeader] =
        this.ctx.apiKeyPrefix
          ? `${this.ctx.apiKeyPrefix}${this.ctx.apiKeyValue}`
          : this.ctx.apiKeyValue;
    }
    return headers;
  }

  /** Override: transform request body before sending */
  transformRequest(body: Record<string, unknown>): Record<string, unknown> {
    return body;
  }

  /** Override: extract error message from response */
  async parseError(response: Response): Promise<string> {
    try {
      const body = await response.clone().json();
      return body?.error?.message ?? body?.error?.toString() ?? `HTTP ${response.status}`;
    } catch {
      return `HTTP ${response.status}`;
    }
  }

  /** Override: determine if a response should be retried */
  shouldRetry(status: number): boolean {
    return status === 429 || status === 502 || status === 503 || status >= 500;
  }

  /** Execute the request to the provider */
  async execute(): Promise<ExecutorResult> {
    const startTime = Date.now();

    // Check circuit breaker
    const breakerKey = `provider:${this.ctx.providerId}`;
    if (!breakers.isAvailable(breakerKey)) {
      throw new ExecutorError(
        "CIRCUIT_OPEN",
        `Circuit breaker open for provider ${this.ctx.providerSlug}`
      );
    }

    const url = this.buildUrl();
    const headers = this.buildHeaders();
    const body = this.transformRequest(this.ctx.requestBody);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.ctx.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.ctx.timeoutMs);

        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;

        // Success
        if (response.ok) {
          breakers.recordSuccess(breakerKey);
          return { response, url, latencyMs };
        }

        // Rate limited (429)
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("retry-after") ?? "1");
          const waitMs = retryAfter * 1000 + 500;
          if (attempt < this.ctx.maxRetries) {
            await sleep(waitMs);
            continue;
          }
        }

        // Other retryable errors
        if (this.shouldRetry(response.status) && attempt < this.ctx.maxRetries) {
          await sleep(Math.min(1000 * Math.pow(2, attempt), 10000));
          continue;
        }

        // Non-retryable error
        const errorMsg = await this.parseError(response);
        breakers.recordFailure(breakerKey);
        throw new ExecutorError(
          `PROVIDER_${response.status}`,
          errorMsg,
          response.status
        );
      } catch (err) {
        if (err instanceof ExecutorError) throw err;

        const isAbort = err instanceof DOMException && err.name === "AbortError";
        const message = isAbort ? "Request timed out" : (err as Error).message;

        if (attempt < this.ctx.maxRetries && this.shouldRetry(isAbort ? 502 : 0)) {
          lastError = new ExecutorError("RETRYABLE", message);
          await sleep(Math.min(1000 * Math.pow(2, attempt), 10000));
          continue;
        }

        breakers.recordFailure(breakerKey);
        throw new ExecutorError(
          isAbort ? "TIMEOUT" : "NETWORK_ERROR",
          message,
          502
        );
      }
    }

    breakers.recordFailure(breakerKey);
    throw lastError ?? new ExecutorError("MAX_RETRIES", "Max retries exceeded", 502);
  }
}

export class ExecutorError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 502
  ) {
    super(message);
    this.name = "ExecutorError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
