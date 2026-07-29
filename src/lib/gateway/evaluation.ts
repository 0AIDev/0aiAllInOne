// ============================================================
// AIStack — Evaluation Framework (OmniRoute eval/)
// Prompt evaluation, A/B testing, quality scoring
// ============================================================

interface EvalCase {
  id: string;
  name: string;
  prompt: string;
  systemPrompt?: string;
  expectedOutput?: string;
  expectedKeywords?: string[];
  expectedMinTokens?: number;
  category: string;
}

interface EvalResult {
  caseId: string;
  providerSlug: string;
  modelId: string;
  latencyMs: number;
  success: boolean;
  tokensUsed: number;
  cost: number;
  outputText: string;
  qualityScore: number;
  error?: string;
}

interface EvalSuite {
  id: string;
  name: string;
  cases: EvalCase[];
  createdAt: Date;
  results: EvalResult[];
}

/**
 * Evaluation Framework: measures provider/model quality across
 * a suite of test cases. Supports keyword matching, token count,
 * cost comparison, and latency ranking.
 */
export class EvaluationFramework {
  private suites = new Map<string, EvalSuite>();

  /**
   * Create a test suite with evaluation cases.
   */
  createSuite(name: string, cases: EvalCase[]): EvalSuite {
    const suite: EvalSuite = {
      id: crypto.randomUUID(),
      name,
      cases,
      createdAt: new Date(),
      results: [],
    };
    this.suites.set(suite.id, suite);
    return suite;
  }

  /**
   * Score a model output against expected criteria.
   * Returns 0-100 quality score.
   */
  scoreOutput(output: string, testCase: EvalCase): number {
    let score = 50; // Baseline

    // Keyword matching
    if (testCase.expectedKeywords?.length) {
      const matched = testCase.expectedKeywords.filter(
        (kw) => output.toLowerCase().includes(kw.toLowerCase())
      ).length;
      const keywordRatio = matched / testCase.expectedKeywords.length;
      score += Math.round(keywordRatio * 30); // Up to +30
    }

    // Output length check
    if (testCase.expectedMinTokens) {
      const outputTokens = Math.round(output.length / 3.5);
      if (outputTokens >= testCase.expectedMinTokens) {
        score += 10; // Meets minimum length
      } else {
        score -= 10 * (1 - outputTokens / testCase.expectedMinTokens);
      }
    }

    // Content quality heuristics
    if (output.length > 50) score += 5; // Non-trivial output
    if (output.includes("```")) score += 3; // Contains code (likely helpful)
    if (output.split("\n").length > 1) score += 2; // Structured response

    // Penalties
    if (output.includes("I don't know") || output.includes("I cannot")) score -= 10;
    if (output.length < 20) score -= 20; // Too short
    if (output.includes("as an AI language model")) score -= 5; // Generic response

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Run an evaluation across multiple providers for a specific test case.
   */
  async runEval(
    testCase: EvalCase,
    providers: Array<{
      slug: string;
      modelId: string;
      baseUrl: string;
      apiKeyHeader: string;
      apiKeyValue: string;
    }>
  ): Promise<EvalResult[]> {
    const results: EvalResult[] = [];

    for (const p of providers) {
      const startTime = Date.now();
      try {
        const messages = [];
        if (testCase.systemPrompt) {
          messages.push({ role: "system", content: testCase.systemPrompt });
        }
        messages.push({ role: "user", content: testCase.prompt });

        const response = await fetch(`${p.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [p.apiKeyHeader]: p.apiKeyValue,
          },
          body: JSON.stringify({
            model: p.modelId,
            messages,
            max_tokens: 1000,
          }),
          signal: AbortSignal.timeout(30000),
        });

        const latencyMs = Date.now() - startTime;
        const data = await response.json().catch(() => ({}));
        const outputText = data?.choices?.[0]?.message?.content ?? "";
        const tokensUsed = data?.usage?.total_tokens ?? 0;
        const cost = tokensUsed * 0.000001; // Approximate cost
        const qualityScore = this.scoreOutput(outputText, testCase);

        results.push({
          caseId: testCase.id,
          providerSlug: p.slug,
          modelId: p.modelId,
          latencyMs,
          success: response.ok && outputText.length > 0,
          tokensUsed,
          cost,
          outputText: outputText.substring(0, 500),
          qualityScore,
        });
      } catch (err) {
        results.push({
          caseId: testCase.id,
          providerSlug: p.slug,
          modelId: p.modelId,
          latencyMs: Date.now() - startTime,
          success: false,
          tokensUsed: 0,
          cost: 0,
          outputText: "",
          qualityScore: 0,
          error: (err as Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Compare providers across a full suite.
   * Returns ranked results with aggregated scores.
   */
  async compareProviders(
    suiteId: string,
    providers: Array<{
      slug: string;
      modelId: string;
      baseUrl: string;
      apiKeyHeader: string;
      apiKeyValue: string;
    }>
  ): Promise<
    Array<{
      providerSlug: string;
      modelId: string;
      avgQualityScore: number;
      avgLatencyMs: number;
      avgCost: number;
      successRate: number;
      totalResults: number;
    }>
  > {
    const suite = this.suites.get(suiteId);
    if (!suite) throw new Error(`Suite ${suiteId} not found`);

    const allResults: EvalResult[] = [];
    for (const testCase of suite.cases) {
      const results = await this.runEval(testCase, providers);
      allResults.push(...results);
    }

    // Aggregate by provider
    const aggregated = new Map<
      string,
      {
        providerSlug: string;
        modelId: string;
        scores: number[];
        latencies: number[];
        costs: number[];
        successes: number;
        total: number;
      }
    >();

    for (const r of allResults) {
      const key = `${r.providerSlug}/${r.modelId}`;
      if (!aggregated.has(key)) {
        aggregated.set(key, {
          providerSlug: r.providerSlug,
          modelId: r.modelId,
          scores: [],
          latencies: [],
          costs: [],
          successes: 0,
          total: 0,
        });
      }
      const agg = aggregated.get(key)!;
      agg.scores.push(r.qualityScore);
      agg.latencies.push(r.latencyMs);
      agg.costs.push(r.cost);
      if (r.success) agg.successes++;
      agg.total++;
    }

    return Array.from(aggregated.values())
      .map((agg) => ({
        providerSlug: agg.providerSlug,
        modelId: agg.modelId,
        avgQualityScore: avg(agg.scores),
        avgLatencyMs: Math.round(avg(agg.latencies)),
        avgCost: avg(agg.costs),
        successRate: Math.round((agg.successes / agg.total) * 100),
        totalResults: agg.total,
      }))
      .sort((a, b) => b.avgQualityScore - a.avgQualityScore);
  }

  /**
   * Pre-built test suites for common scenarios.
   */
  static getPrebuiltSuite(name: string): EvalCase[] {
    const suites: Record<string, EvalCase[]> = {
      "code-generation": [
        { id: "c1", name: "Fibonacci", prompt: "Write a function fibonacci(n) in Python that returns the nth Fibonacci number using recursion.", expectedKeywords: ["def fibonacci", "return", "recursion"], expectedMinTokens: 20, category: "code" },
        { id: "c2", name: "Sort array", prompt: "Write a function in JavaScript to sort an array of numbers using quicksort.", expectedKeywords: ["function", "quicksort", "pivot", "partition"], expectedMinTokens: 30, category: "code" },
        { id: "c3", name: "REST API", prompt: "Create a simple Express.js GET endpoint that returns a JSON list of users.", expectedKeywords: ["app.get", "json", "users", "res.json"], expectedMinTokens: 40, category: "code" },
      ],
      "reasoning": [
        { id: "r1", name: "Logic puzzle", prompt: "If all A are B, and some B are C, are all A necessarily C? Explain step by step.", expectedKeywords: ["syllogism", "not necessarily", "counterexample"], expectedMinTokens: 50, category: "reasoning" },
        { id: "r2", name: "Ethical dilemma", prompt: "Discuss the trolley problem: is it ethical to sacrifice one person to save five?", expectedKeywords: ["utilitarian", "deontological", "sacrifice", "moral"], expectedMinTokens: 60, category: "reasoning" },
      ],
      "summarization": [
        { id: "s1", name: "Long text summary", prompt: "Summarize: Artificial intelligence has transformed industries from healthcare to finance. Machine learning models can now diagnose diseases, predict market trends, and automate complex workflows. The rapid advancement raises both opportunities and ethical concerns about job displacement and privacy.", expectedKeywords: ["AI", "transform", "healthcare", "finance", "ethical"], expectedMinTokens: 30, category: "summarization" },
      ],
    };
    return suites[name] ?? [];
  }
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}
