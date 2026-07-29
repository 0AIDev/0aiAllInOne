import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

function getTransport() {
  if (isTest || !isProduction) return undefined;
  try {
    return {
      target: "pino/file",
      options: { destination: 1 },
    };
  } catch {
    return undefined;
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
  ...(isTest ? { enabled: false } : {}),
  transport: getTransport(),
  redact: {
    paths: [
      "password",
      "passwordHash",
      "encryptedKey",
      "decryptedKey",
      "hashedKey",
      "rawKey",
      "token",
      "secret",
      "apiKey",
      "authorization",
      "cookie",
      "stripeKey",
      "webhookSecret",
    ],
    censor: "[REDACTED]",
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  base: isProduction
    ? {
        pid: process.pid,
        hostname: process.env.HOSTNAME ?? undefined,
        service: "ai0fy",
        env: process.env.NODE_ENV,
      }
    : undefined,
});

export function createChildLogger(module: string, context?: Record<string, unknown>) {
  return logger.child({ module, ...context });
}

export type Logger = typeof logger;
