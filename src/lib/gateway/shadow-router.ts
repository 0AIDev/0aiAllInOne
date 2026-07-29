// ============================================================
// AIStack — Shadow Router (OmniRoute shadow routing)
// Fire-and-forget parallel dispatch for metrics comparison
// ============================================================

interface ShadowTask {
  providerSlug: string;
  modelId: string;
  baseUrl: string;
  apiKeyHeader: string;
  apiKeyValue: string;
  body: Record<string, unknown>;
}

interface ShadowResult {
  providerSlug: string;
  modelId: string;
  latencyMs: number;
  success: boolean;
  tokensUsed: number;
  error?: string;
}

/**
 * Shadow Router: dispatches the same request to alternative providers
 * in parallel (fire-and-forget) purely for metrics/comparison.
 * The primary response is returned immediately; shadow results are logged.
 */
export class ShadowRouter {
  private static shadowTasks: Map<string, Promise<ShadowResult>> = new Map();
  private static maxConcurrent = 3;

  /**
   * Dispatch shadow requests to alternative providers.
   * Does NOT block the primary response.
   */
  static dispatch(
    tasks: ShadowTask[],
    onResult?: (result: ShadowResult) => void
  ): void {
    const active = Array.from(this.shadowTasks.values());
    if (active.length >= this.maxConcurrent) return;

    for (const task of tasks.slice(0, this.maxConcurrent - active.length)) {
      const promise = this.executeShadow(task)
        .then((result) => {
          onResult?.(result);
          this.shadowTasks.delete(task.providerSlug + task.modelId);
          return result;
        })
        .catch((err) => {
          const result: ShadowResult = {
            providerSlug: task.providerSlug,
            modelId: task.modelId,
            latencyMs: 0,
            success: false,
            tokensUsed: 0,
            error: (err as Error).message,
          };
          onResult?.(result);
          this.shadowTasks.delete(task.providerSlug + task.modelId);
          return result;
        });

      this.shadowTasks.set(task.providerSlug + task.modelId, promise);
    }
  }

  private static async executeShadow(task: ShadowTask): Promise<ShadowResult> {
    const startTime = Date.now();

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (task.apiKeyValue) {
        headers[task.apiKeyHeader] = task.apiKeyValue;
      }

      const response = await fetch(`${task.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...task.body, model: task.modelId }),
        signal: AbortSignal.timeout(30000),
      });

      const latencyMs = Date.now() - startTime;
      const data = await response.json().catch(() => ({}));

      return {
        providerSlug: task.providerSlug,
        modelId: task.modelId,
        latencyMs,
        success: response.ok,
        tokensUsed: data?.usage?.total_tokens ?? 0,
      };
    } catch (err) {
      return {
        providerSlug: task.providerSlug,
        modelId: task.modelId,
        latencyMs: Date.now() - startTime,
        success: false,
        tokensUsed: 0,
        error: (err as Error).message,
      };
    }
  }

  /**
   * Collect recent shadow results for analytics.
   */
  static getPendingCount(): number {
    return this.shadowTasks.size;
  }
}
