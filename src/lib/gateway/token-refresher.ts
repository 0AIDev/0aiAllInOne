// ============================================================
// AIStack — OAuth Token Refresher
// Auto-refresh expired provider tokens (OmniRoute refreshCredentials)
// ============================================================

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/utils/encryption";

interface TokenRefreshConfig {
  providerId: string;
  refreshUrl: string;
  clientId?: string;
  clientSecret?: string;
  grantType: "refresh_token" | "client_credentials" | "authorization_code";
}

interface RefreshedToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  scope?: string;
}

/**
 * OAuth Token Refresher: automatically refreshes provider tokens
 * that are about to expire. Supports refresh_token and client_credentials flows.
 */
export class TokenRefresher {
  private static refreshLocks = new Map<string, Promise<RefreshedToken | null>>();

  /**
   * Check if a token needs refresh (within 5 minutes of expiry).
   */
  static needsRefresh(expiresAt: Date | null): boolean {
    if (!expiresAt) return false;
    const fiveMinutesMs = 5 * 60 * 1000;
    return Date.now() >= expiresAt.getTime() - fiveMinutesMs;
  }

  /**
   * Refresh a provider token. Uses a mutex lock to prevent concurrent refreshes
   * for the same provider (prevents thundering herd).
   */
  static async refresh(
    keyId: string,
    config: TokenRefreshConfig,
    refreshToken: string
  ): Promise<RefreshedToken | null> {
    // Mutex: only one refresh at a time per key
    const existing = this.refreshLocks.get(keyId);
    if (existing) return existing;

    const promise = this.doRefresh(config, refreshToken)
      .then(async (token) => {
        if (token) {
          await this.storeToken(keyId, token);
        }
        this.refreshLocks.delete(keyId);
        return token;
      })
      .catch((err) => {
        console.error(`Token refresh failed for key ${keyId}:`, err);
        this.refreshLocks.delete(keyId);
        return null;
      });

    this.refreshLocks.set(keyId, promise);
    return promise;
  }

  private static async doRefresh(
    config: TokenRefreshConfig,
    refreshToken: string
  ): Promise<RefreshedToken | null> {
    try {
      const body = new URLSearchParams();
      body.append("grant_type", config.grantType);

      if (config.grantType === "refresh_token") {
        body.append("refresh_token", refreshToken);
      }

      if (config.clientId && config.clientSecret) {
        body.append("client_id", config.clientId);
        body.append("client_secret", config.clientSecret);
      }

      const response = await fetch(config.refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        scope: data.scope,
      };
    } catch {
      return null;
    }
  }

  private static async storeToken(
    keyId: string,
    token: RefreshedToken
  ): Promise<void> {
    await prisma.providerKey.update({
      where: { id: keyId },
      data: {
        encryptedKey: encrypt(token.accessToken),
        // Reset error state on successful refresh
        consecutiveFails: 0,
        lastErrorAt: null,
        lastErrorMsg: null,
      },
    });
  }

  /**
   * Register standard OAuth endpoints for known providers.
   */
  static getStandardConfig(providerSlug: string): TokenRefreshConfig | null {
    const configs: Record<string, TokenRefreshConfig> = {
      anthropic: {
        providerId: "",
        refreshUrl: "https://api.anthropic.com/v1/oauth/token",
        grantType: "refresh_token",
      },
      google: {
        providerId: "",
        refreshUrl: "https://oauth2.googleapis.com/token",
        grantType: "refresh_token",
      },
      openai: {
        providerId: "",
        refreshUrl: "https://api.openai.com/v1/oauth/token",
        grantType: "refresh_token",
      },
      github: {
        providerId: "",
        refreshUrl: "https://github.com/login/oauth/access_token",
        grantType: "refresh_token",
      },
    };
    return configs[providerSlug] ?? null;
  }
}
