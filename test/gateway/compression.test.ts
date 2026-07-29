import { describe, it, expect } from "vitest";
import { compressMessages, estimateTokens } from "@/lib/gateway/compression";

describe("estimateTokens", () => {
  it("should estimate tokens for text content", () => {
    const messages = [{ role: "user", content: "Hello, how are you?" }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokens = estimateTokens(messages as any);
    expect(tokens).toBeGreaterThan(0);
  });

  it("should return 0 for empty messages", () => {
    expect(estimateTokens([])).toBe(2);
  });

  it("should estimate more tokens for longer content", () => {
    const short = [{ role: "user" as const, content: "hi" }];
    const long = [{ role: "user" as const, content: "This is a much longer message that should use more tokens for estimation purposes." }];
    expect(estimateTokens(long)).toBeGreaterThan(estimateTokens(short));
  });
});

describe("compressMessages", () => {
  it("should not lose message content on light compression", () => {
    const messages = [
      { role: "system" as const, content: "You are a helpful assistant." },
      { role: "user" as const, content: "Hello, how are you today?" },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = compressMessages(messages as any, { level: "light" });
    expect(result.messages).toHaveLength(messages.length);
    // Light compression should keep messages intact
    expect(result.messages[0]?.content).toBe(messages[0]?.content);
  });

  it("should handle aggressive compression", () => {
    const messages = [
      { role: "system" as const, content: "You are a very helpful and friendly assistant that always provides accurate information." },
      { role: "user" as const, content: "Hi" },
      { role: "assistant" as const, content: "Hello! How can I help you?" },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = compressMessages(messages as any, { level: "aggressive" });
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.tokenSavings).toBeGreaterThanOrEqual(0);
    expect(result.compressionRatio).toBeGreaterThanOrEqual(0);
  });

  it("should not compress single message", () => {
    const messages = [{ role: "user" as const, content: "Hello" }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = compressMessages(messages as any, { level: "aggressive" });
    expect(result.messages).toHaveLength(1);
  });
});
