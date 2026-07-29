// ============================================================
// AIStack — Session Affinity (OmniRoute session_account_affinity)
// Sticky sessions: same session → same provider
// ============================================================

const affinityMap = new Map<string, { providerId: string; keyId: string; timestamp: number }>();

// Clean stale entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of affinityMap) {
    if (now - val.timestamp > 30 * 60 * 1000) affinityMap.delete(key);
  }
}, 5 * 60 * 1000);

const TTL_MS = 30 * 60 * 1000;

export class SessionAffinity {
  /**
   * Generate a stable session ID from request fingerprint.
   * Uses a hash of the first user message + tenant to group conversations.
   */
  static buildSessionId(tenantId: string, userMessagePreview: string): string {
    const input = `${tenantId}:${userMessagePreview.substring(0, 200)}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `sess_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Pin a session to a specific provider + key.
   */
  static pin(sessionId: string, providerId: string, keyId: string): void {
    affinityMap.set(sessionId, { providerId, keyId, timestamp: Date.now() });
  }

  /**
   * Get the pinned provider for a session, if any and not expired.
   */
  static getPinned(sessionId: string): { providerId: string; keyId: string } | null {
    const entry = affinityMap.get(sessionId);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > TTL_MS) {
      affinityMap.delete(sessionId);
      return null;
    }
    return { providerId: entry.providerId, keyId: entry.keyId };
  }

  /**
   * Release a session pin (on failure).
   */
  static release(sessionId: string): void {
    affinityMap.delete(sessionId);
  }

  /**
   * Get the number of active affinity entries (for monitoring).
   */
  static getActiveCount(): number {
    const now = Date.now();
    let count = 0;
    for (const [, val] of affinityMap) {
      if (now - val.timestamp < TTL_MS) count++;
    }
    return count;
  }
}
