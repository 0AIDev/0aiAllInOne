// ============================================================
// AI0FY — Circuit Breaker System
// Pattern: OmniRoute domain_circuit_breakers
// ============================================================

enum CircuitState {
  CLOSED = "CLOSED",       // Normal operation
  OPEN = "OPEN",           // Failing — reject requests
  HALF_OPEN = "HALF_OPEN", // Testing recovery
}

interface BreakerConfig {
  name: string;
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenMaxRequests: number;
}

class CircuitBreaker {
  public state: CircuitState = CircuitState.CLOSED;
  public failureCount: number = 0;
  public lastFailureTime: number = 0;
  public lastSuccessTime: number = 0;
  public halfOpenRequests: number = 0;

  constructor(private config: BreakerConfig) {}

  allowRequest(): boolean {
    switch (this.state) {
      case CircuitState.CLOSED:
        return true;

      case CircuitState.OPEN: {
        const elapsed = Date.now() - this.lastFailureTime;
        if (elapsed >= this.config.resetTimeoutMs) {
          this.state = CircuitState.HALF_OPEN;
          this.halfOpenRequests = 0;
          return true;
        }
        return false;
      }

      case CircuitState.HALF_OPEN: {
        if (this.halfOpenRequests < this.config.halfOpenMaxRequests) {
          this.halfOpenRequests++;
          return true;
        }
        return false;
      }

      default:
        return true;
    }
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.lastSuccessTime = Date.now();
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      this.halfOpenRequests = 0;
    }
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (
      this.state === CircuitState.CLOSED &&
      this.failureCount >= this.config.failureThreshold
    ) {
      this.state = CircuitState.OPEN;
    }
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
    }
  }

  getRemainingCooldownMs(): number {
    if (this.state !== CircuitState.OPEN) return 0;
    const elapsed = Date.now() - this.lastFailureTime;
    return Math.max(0, this.config.resetTimeoutMs - elapsed);
  }
}

export class BreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  get(name: string): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(
        name,
        new CircuitBreaker({
          name,
          failureThreshold: name.includes("model") ? 3 : 5,
          resetTimeoutMs: name.includes("model") ? 30_000 : 60_000,
          halfOpenMaxRequests: 1,
        })
      );
    }
    return this.breakers.get(name)!;
  }

  isAvailable(name: string): boolean {
    return this.get(name).allowRequest();
  }

  recordSuccess(name: string): void {
    this.get(name).recordSuccess();
  }

  recordFailure(name: string): void {
    this.get(name).recordFailure();
  }

  reset(name: string): void {
    this.breakers.delete(name);
  }

  getStats(name: string): { failures: number; successes: number; state: string } | null {
    const breaker = this.breakers.get(name);
    if (!breaker) return null;
    return {
      failures: breaker.failureCount,
      successes: breaker.lastSuccessTime > 0 ? 1 : 0,
      state: breaker.state,
    };
  }
}

export const breakers = new BreakerRegistry();
