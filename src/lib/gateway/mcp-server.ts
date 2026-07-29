// ============================================================
// AIStack — MCP/A2A Protocol (OmniRoute MCP server)
// Model Context Protocol — tool server for agent communication
// ============================================================

// MCP Tool Schema Types
interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
      default?: unknown;
    }>;
    required?: string[];
  };
}

interface MCPToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

interface MCPToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

/**
 * MCP/A2A Protocol Server.
 * Exposes tools that AI models can call during conversations.
 * Compatible with Model Context Protocol specification.
 */
export class MCPServer {
  private tools = new Map<string, MCPTool>();
  private handlers = new Map<string, (args: Record<string, unknown>, tenantId: string) => Promise<string>>();

  /**
   * Register a tool that AI models can invoke.
   */
  registerTool(
    tool: MCPTool,
    handler: (args: Record<string, unknown>, tenantId: string) => Promise<string>
  ): void {
    this.tools.set(tool.name, tool);
    this.handlers.set(tool.name, handler);
  }

  /**
   * Get all registered tools (for the /v1/tools or MCP tools/list endpoint).
   */
  getTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Execute a tool call on behalf of a tenant.
   */
  async executeTool(
    call: MCPToolCall,
    tenantId: string
  ): Promise<MCPToolResult> {
    const handler = this.handlers.get(call.name);
    if (!handler) {
      return {
        content: [{ type: "text", text: `Error: Unknown tool "${call.name}"` }],
        isError: true,
      };
    }

    try {
      const result = await handler(call.arguments, tenantId);
      return { content: [{ type: "text", text: result }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Tool error: ${(err as Error).message}` }],
        isError: true,
      };
    }
  }

  /**
   * Convert MCP tools to OpenAI-compatible function definitions.
   */
  toOpenAIFunctions(): Array<{
    type: "function";
    function: { name: string; description: string; parameters: MCPTool["inputSchema"] };
  }> {
    return this.getTools().map((tool) => ({
      type: "function" as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));
  }
}

// ═══════════════════════════════════════════════════════════
// Pre-built MCP Server with Standard Tools
// ═══════════════════════════════════════════════════════════

export const mcpServer = new MCPServer();

// Tool: Query tenant usage stats
mcpServer.registerTool(
  {
    name: "get_usage_stats",
    description: "Get the current API usage statistics for your account",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number", description: "Number of days to look back (default 7)" },
      },
    },
  },
  async (args, tenantId) => {
    const { prisma } = await import("@/lib/prisma");
    const days = (args.days as number) ?? 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const records = await prisma.usageRecord.findMany({
      where: { tenantId, createdAt: { gte: since } },
      select: { tokensInput: true, tokensOutput: true, latencyMs: true, modelId: true },
    });

    const totalTokens = records.reduce((s, r) => s + r.tokensInput + r.tokensOutput, 0);
    const avgLatency = records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.latencyMs, 0) / records.length)
      : 0;

    return JSON.stringify({
      periodDays: days,
      totalRequests: records.length,
      totalTokens,
      avgLatencyMs: avgLatency,
    });
  }
);

// Tool: List available models for tenant
mcpServer.registerTool(
  {
    name: "list_available_models",
    description: "List all AI models available to your account",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "string", description: "Optional filter: 'free', 'paid', or 'all'" },
      },
    },
  },
  async (args, tenantId) => {
    const { prisma } = await import("@/lib/prisma");
    const filter = (args.filter as string) ?? "all";

    const entries = await prisma.providerPoolEntry.findMany({
      where: { tenantId, isEnabled: true },
      include: {
        provider: { select: { slug: true, name: true, needsAuth: true } },
        model: { select: { modelId: true, displayName: true, contextWindow: true } },
      },
      orderBy: { priority: "asc" },
    });

    let filtered = entries;
    if (filter === "free") filtered = entries.filter((e) => !e.provider.needsAuth);
    if (filter === "paid") filtered = entries.filter((e) => e.provider.needsAuth);

    const models = filtered.map((e) => ({
      id: `${e.provider.slug}/${e.model.modelId}`,
      name: e.model.displayName ?? e.model.modelId,
      provider: e.provider.name,
      contextWindow: e.model.contextWindow,
      isFree: !e.provider.needsAuth,
    }));

    return JSON.stringify(models);
  }
);

// Tool: Web search simulation
mcpServer.registerTool(
  {
    name: "web_search",
    description: "Search the web for current information",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        numResults: { type: "number", description: "Number of results (1-5)" },
      },
      required: ["query"],
    },
  },
  async (args) => {
    const query = args.query as string;
    const numResults = Math.min((args.numResults as number) ?? 3, 5);

    // This would integrate with a real search API (SerpAPI, Brave Search, etc.)
    return JSON.stringify({
      query,
      results: Array.from({ length: numResults }, (_, i) => ({
        title: `Result ${i + 1} for "${query}"`,
        url: `https://example.com/result-${i + 1}`,
        snippet: `This is a placeholder search result for "${query}". In production, this integrates with a real search engine API.`,
      })),
      _note: "Web search is in preview mode. Results are simulated.",
    });
  }
);
