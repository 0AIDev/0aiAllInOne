import { describe, it, expect, beforeEach } from "vitest";

// We need to mock the breaker module since it uses module-level state
describe("circuit-breaker", () => {
  let breakers: typeof import("@/lib/gateway/circuit-breaker").breakers;

  beforeEach(async () => {
    // Re-import to reset state
    const mod = await import("@/lib/gateway/circuit-breaker");
    breakers = mod.breakers;
  });

  it("should be available by default", () => {
    expect(breakers.isAvailable("test-provider")).toBe(true);
  });

  it("should record failures", () => {
    for (let i = 0; i < 10; i++) {
      breakers.recordFailure("test-provider");
    }
    expect(breakers.isAvailable("test-provider")).toBe(false);
  });

  it("should recover after reset", () => {
    for (let i = 0; i < 10; i++) {
      breakers.recordFailure("test-provider-2");
    }
    expect(breakers.isAvailable("test-provider-2")).toBe(false);
    breakers.reset("test-provider-2");
    expect(breakers.isAvailable("test-provider-2")).toBe(true);
  });

  it("should track different breakers independently", () => {
    breakers.recordFailure("provider-A");
    breakers.recordFailure("provider-A");
    breakers.recordSuccess("provider-B");
    expect(breakers.isAvailable("provider-A")).toBe(true);
    expect(breakers.isAvailable("provider-B")).toBe(true);
  });

  it("should reset successfully", () => {
    for (let i = 0; i < 10; i++) {
      breakers.recordFailure("resettable");
    }
    expect(breakers.isAvailable("resettable")).toBe(false);
    breakers.reset("resettable");
    expect(breakers.isAvailable("resettable")).toBe(true);
  });

  it("should get stats", () => {
    breakers.recordFailure("stats-test");
    breakers.recordSuccess("stats-test");
    const stats = breakers.getStats("stats-test");
    expect(stats).toBeDefined();
    if (stats) {
      expect(stats.failures).toBe(0);
      expect(stats.successes).toBe(1);
    }
  });
});
