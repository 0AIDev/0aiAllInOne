import { describe, it, expect } from "vitest";
import { RouteStrategist } from "@/lib/gateway/route-strategies";

describe("RouteStrategist", () => {
  const mockTargets = [
    { id: "1", priority: 1, weight: 1.0, lastUsedAt: 0, consecutiveUseCount: 0 },
    { id: "2", priority: 2, weight: 1.5, lastUsedAt: 1000, consecutiveUseCount: 0 },
    { id: "3", priority: 3, weight: 0.5, lastUsedAt: 2000, consecutiveUseCount: 0 },
  ];

  describe("PRIORITY", () => {
    it("should sort by priority ascending", () => {
      const result = RouteStrategist.order(mockTargets, "PRIORITY");
      expect(result[0]?.priority).toBe(1);
      expect(result[1]?.priority).toBe(2);
      expect(result[2]?.priority).toBe(3);
    });
  });

  describe("ROUND_ROBIN", () => {
    it("should return all entries", () => {
      const result = RouteStrategist.order(mockTargets, "ROUND_ROBIN");
      expect(result).toHaveLength(mockTargets.length);
    });
  });

  describe("WEIGHTED", () => {
    it("should return all entries shuffled by weight", () => {
      const result = RouteStrategist.order(mockTargets, "WEIGHTED");
      expect(result).toHaveLength(mockTargets.length);
    });
  });

  describe("FUSION", () => {
    it("should return all entries unsorted", () => {
      const result = RouteStrategist.order(mockTargets, "FUSION");
      expect(result).toHaveLength(mockTargets.length);
    });
  });

  describe("P2C", () => {
    it("should return all entries", () => {
      const result = RouteStrategist.order(mockTargets, "P2C");
      expect(result).toHaveLength(mockTargets.length);
    });
  });

  describe("STRICT_RANDOM", () => {
    it("should return all entries", () => {
      const result = RouteStrategist.order(mockTargets, "STRICT_RANDOM");
      expect(result).toHaveLength(mockTargets.length);
    });
  });

  describe("FILL_FIRST", () => {
    it("should return all entries", () => {
      const result = RouteStrategist.order(mockTargets, "FILL_FIRST");
      expect(result).toHaveLength(mockTargets.length);
    });
  });
});
