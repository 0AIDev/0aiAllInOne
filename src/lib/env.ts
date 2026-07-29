import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url().optional(),

  // Redis
  REDIS_URL: z.string().optional(),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  CRON_SECRET: z.string().min(16, "CRON_SECRET must be at least 16 characters"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("AIStack"),

  // Encryption
  PROVIDER_KEY_ENCRYPTION_SECRET: z
    .string()
    .min(32, "PROVIDER_KEY_ENCRYPTION_SECRET must be at least 32 chars"),

  // Rate Limiting
  DEFAULT_RATE_LIMIT_REQUESTS_PER_MINUTE: z.coerce.number().int().positive().default(60),
  DEFAULT_RATE_LIMIT_TOKENS_PER_DAY: z.coerce.number().int().positive().default(1000000),

  // Gateway
  GATEWAY_TIMEOUT_MS: z.coerce.number().int().positive().default(120000),
  MAX_BODY_SIZE_BYTES: z.coerce.number().int().positive().default(52428800),
  MAX_CONCURRENT_CONNECTIONS: z.coerce.number().int().positive().default(500),

  // Logging
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),

  // OTEL
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  DISABLE_TELEMETRY: z.string().optional(),

  // Node
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  if (process.env.SKIP_ENV_VALIDATION === "1" || process.env.SKIP_ENV_VALIDATION === "true") {
    return process.env as unknown as Env;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formatted = Object.entries(errors)
      .map(([key, msgs]) => `  - ${key}: ${(msgs ?? []).join(", ")}`)
      .join("\n");

    console.error(`\n❌ Invalid environment variables:\n${formatted}\n`);

    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables. Check server logs.");
    }

    // In dev, just warn but don't crash
    console.warn("Running with invalid env - some features may not work.\n");
  }

  return process.env as unknown as Env;
}

export const env = validateEnv();

export function isProduction(): boolean {
  return env.NODE_ENV === "production";
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === "development";
}

export function isTest(): boolean {
  return env.NODE_ENV === "test";
}

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}
