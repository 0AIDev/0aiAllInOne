// ============================================================
// AI0FY — Advanced Routing Strategies (OmniRoute: 19 strategies)
// round-robin, weighted, fill-first, priority, p2c, fusion
// ============================================================

interface RouteTarget {
  id: string;
  priority: number;
  weight: number;
  lastUsedAt: number;
  consecutiveUseCount: number;
}

type Strategy = "PRIORITY" | "ROUND_ROBIN" | "WEIGHTED" | "FILL_FIRST" | "P2C" | "FUSION" | "STRICT_RANDOM";

export class RouteStrategist {
  /**
   * Order targets according to the specified strategy.
   */
  static order<T extends RouteTarget>(
    targets: T[],
    strategy: Strategy
  ): T[] {
    switch (strategy) {
      case "PRIORITY":
        return [...targets].sort((a, b) => a.priority - b.priority);

      case "ROUND_ROBIN":
        return this.roundRobinOrder(targets);

      case "WEIGHTED":
        return this.weightedOrder(targets);

      case "FILL_FIRST":
        return [...targets].sort((a, b) => {
          // Stick with the first available
          if (a.consecutiveUseCount > 0 && b.consecutiveUseCount === 0) return -1;
          if (b.consecutiveUseCount > 0 && a.consecutiveUseCount === 0) return 1;
          return a.priority - b.priority;
        });

      case "P2C":
        return this.p2cOrder(targets);

      case "STRICT_RANDOM":
        return this.strictRandomOrder(targets);

      case "FUSION":
        // FUSION: all targets, no specific order (parallel)
        return [...targets];

      default:
        return [...targets].sort((a, b) => a.priority - b.priority);
    }
  }

  private static roundRobinOrder<T extends RouteTarget>(targets: T[]): T[] {
    return [...targets].sort((a, b) => {
      if (a.lastUsedAt === 0 && b.lastUsedAt > 0) return -1;
      if (b.lastUsedAt === 0 && a.lastUsedAt > 0) return 1;
      return a.lastUsedAt - b.lastUsedAt;
    });
  }

  private static weightedOrder<T extends RouteTarget>(targets: T[]): T[] {
    const total = targets.reduce((s, t) => s + (t.weight || 1), 0);
    return [...targets]
      .map((t) => ({ t, sort: Math.random() / (t.weight / total || 0.0001) }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.t);
  }

  private static p2cOrder<T extends RouteTarget>(targets: T[]): T[] {
    if (targets.length <= 2) return [...targets];
    const i1 = Math.floor(Math.random() * targets.length);
    let i2 = Math.floor(Math.random() * (targets.length - 1));
    if (i2 >= i1) i2++;
    const a = targets[i1]!;
    const b = targets[i2]!;
    // Lower score = better
    const scoreA = a.consecutiveUseCount * 2 + a.priority;
    const scoreB = b.consecutiveUseCount * 2 + b.priority;
    const winner = scoreA <= scoreB ? a : b;
    const others = targets.filter((t) => t.id !== winner.id);
    return [winner, ...others];
  }

  private static strictRandomOrder<T extends RouteTarget>(targets: T[]): T[] {
    const arr = [...targets];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    return arr;
  }
}
