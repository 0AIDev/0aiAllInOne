import { describe, it, expect, beforeAll } from "vitest";

// Set env before import
beforeAll(() => {
  process.env.PROVIDER_KEY_ENCRYPTION_SECRET = "dGVzdC1lbmNyeXB0aW9uLWtleS0zMi1ieXRlcw==";
});

import { encrypt, decrypt, generateApiToken, hashApiKey, getKeyPrefix } from "@/lib/utils/encryption";

describe("encryption", () => {
  describe("encrypt / decrypt", () => {
    it("should encrypt and decrypt a string correctly", () => {
      const original = "sk-test-secret-key-12345";
      const encrypted = encrypt(original);
      expect(encrypted).not.toBe(original);
      expect(encrypted).toBeTypeOf("string");
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(original);
    });

    it("should produce different ciphertexts for the same plaintext", () => {
      const plaintext = "same-key";
      const enc1 = encrypt(plaintext);
      const enc2 = encrypt(plaintext);
      expect(enc1).not.toBe(enc2);
      expect(decrypt(enc1)).toBe(plaintext);
      expect(decrypt(enc2)).toBe(plaintext);
    });

    it("should handle empty strings", () => {
      const encrypted = encrypt("");
      expect(decrypt(encrypted)).toBe("");
    });

    it("should handle special characters", () => {
      const original = "key!@#$%^&*()_+-=[]{}|;':\",./<>?";
      expect(decrypt(encrypt(original))).toBe(original);
    });

    it("should handle unicode characters", () => {
      const original = "🔑 secret-key-日本語";
      expect(decrypt(encrypt(original))).toBe(original);
    });
  });

  describe("generateApiToken", () => {
    it("should generate a token with ast_ prefix", () => {
      const token = generateApiToken();
      expect(token).toMatch(/^ast_/);
    });

    it("should generate unique tokens", () => {
      const tokens = new Set(Array.from({ length: 100 }, () => generateApiToken()));
      expect(tokens.size).toBe(100);
    });

    it("should generate tokens of consistent length", () => {
      const tokens = Array.from({ length: 10 }, () => generateApiToken());
      const lengths = new Set(tokens.map((t) => t.length));
      expect(lengths.size).toBe(1);
    });
  });

  describe("hashApiKey", () => {
    it("should produce a 64-char hex string", () => {
      const hash = hashApiKey("test-key");
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });

    it("should produce the same hash for the same input", () => {
      expect(hashApiKey("test-key")).toBe(hashApiKey("test-key"));
    });

    it("should produce different hashes for different inputs", () => {
      expect(hashApiKey("key1")).not.toBe(hashApiKey("key2"));
    });
  });

  describe("getKeyPrefix", () => {
    it("should return first 12 characters", () => {
      expect(getKeyPrefix("ast_abc123def456ghi789")).toBe("ast_abc123de");
    });

    it("should return full string if shorter than 12", () => {
      expect(getKeyPrefix("short")).toBe("short");
    });
  });
});
