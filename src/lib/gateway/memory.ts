// ============================================================
// AI0FY — Memory Framework (OmniRoute memory + vector store)
// Conversation memory with embedding-based retrieval
// ============================================================

import { prisma } from "@/lib/prisma";

interface MemoryEntry {
  id: string;
  tenantId: string;
  userId?: string;
  role: string;
  content: string;
  embedding: number[] | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  importance: number; // 0-1 score
}

interface MemorySearchResult {
  entry: MemoryEntry;
  score: number;
}

/**
 * Memory Framework: stores conversation snippets and retrieves
 * relevant context for future requests. Uses cosine similarity
 * on embeddings (or keyword matching as fallback).
 */
export class MemoryFramework {
  /**
   * Store a conversation snippet in memory.
   */
  static async store(params: {
    tenantId: string;
    userId?: string;
    role: string;
    content: string;
    importance?: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    // For now, store in PromptCache as a simple key-value memory
    // In production, this would use a vector database (pgvector, Pinecone, etc.)
    const hash = simpleHash(params.content.substring(0, 200));
    const key = `mem:${params.tenantId}:${hash}`;

    await prisma.promptCache.upsert({
      where: {
        tenantId_hash_model: {
          tenantId: params.tenantId,
          hash: key,
          model: params.role,
        },
      },
      update: {
        responseJson: params.content,
        tokensSaved: Math.round(params.importance ?? 0.5 * 100),
        hitCount: { increment: 1 },
      },
      create: {
        tenantId: params.tenantId,
        hash: key,
        model: params.role,
        messagesJson: JSON.stringify({
          userId: params.userId,
          importance: params.importance ?? 0.5,
          metadata: params.metadata ?? {},
        }),
        responseJson: params.content,
        tokensSaved: Math.round((params.importance ?? 0.5) * 100),
        hitCount: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  }

  /**
   * Search memory for relevant context using keyword matching.
   */
  static async search(
    tenantId: string,
    query: string,
    limit = 5
  ): Promise<MemorySearchResult[]> {
    const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

    // Simple keyword search — in production use embeddings + vector DB
    const memories = await prisma.promptCache.findMany({
      where: {
        tenantId,
        hash: { startsWith: "mem:" },
      },
      take: 50,
    });

    const scored: MemorySearchResult[] = memories.map((m) => {
      const content = (m.responseJson || "").toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (content.includes(kw)) score += 1;
        // Bonus for multi-word phrases
        if (content.includes(query.toLowerCase())) score += 3;
      }
      // Normalize by content length to avoid bias toward long entries
      score = content.length > 0 ? score / Math.sqrt(content.length) * 100 : 0;

      return {
        entry: {
          id: m.id,
          tenantId: m.tenantId,
          role: m.model,
          content: m.responseJson,
          embedding: null,
          metadata: safeJsonParse(m.messagesJson),
          createdAt: m.createdAt,
          importance: m.tokensSaved / 100,
        },
        score,
      };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Inject relevant memories into the system prompt.
   */
  static async injectContext(
    tenantId: string,
    query: string,
    maxItems = 3
  ): Promise<string> {
    const results = await this.search(tenantId, query, maxItems);
    if (results.length === 0) return "";

    const contextParts = results.map(
      (r) => `[Memory: ${r.entry.role}] ${r.entry.content.substring(0, 500)}`
    );
    return `\n\nRelevant context from previous conversations:\n${contextParts.join("\n")}`;
  }

  /**
   * Forget / clear memory entries.
   */
  static async forget(tenantId: string, olderThanDays = 30): Promise<number> {
    const result = await prisma.promptCache.deleteMany({
      where: {
        tenantId,
        hash: { startsWith: "mem:" },
        createdAt: {
          lte: new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000),
        },
      },
    });
    return result.count;
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function safeJsonParse(str: string): Record<string, unknown> {
  try { return JSON.parse(str); } catch { return {}; }
}
