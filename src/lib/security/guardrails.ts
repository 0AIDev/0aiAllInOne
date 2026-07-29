// ============================================================
// AI0FY — Enhanced Guardrails
// PII masking, credential redaction, prompt injection detection
// Pattern: OmniRoute guardrailRegistry + promptInjection guard
// ============================================================

// ─── PII Patterns ───────────────────────────────────────────

const PII_PATTERNS: Array<{ name: string; pattern: RegExp; replace: string }> = [
  { name: "email", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replace: "[EMAIL]" },
  { name: "phone", pattern: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, replace: "[PHONE]" },
  { name: "ssn", pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replace: "[SSN]" },
  { name: "credit-card", pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replace: "[CREDIT_CARD]" },
  { name: "ip-v4", pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replace: "[IP_ADDR]" },
  { name: "api-key-openai", pattern: /sk-[a-zA-Z0-9]{32,}/g, replace: "[API_KEY]" },
  { name: "api-key-anthropic", pattern: /sk-ant-[a-zA-Z0-9]{32,}/g, replace: "[API_KEY]" },
  { name: "api-key-google", pattern: /AIza[0-9A-Za-z\-_]{35}/g, replace: "[API_KEY]" },
  { name: "bearer-token", pattern: /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/g, replace: "Bearer [REDACTED]" },
  { name: "jwt-token", pattern: /eyJ[a-zA-Z0-9\-_]+\.eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g, replace: "[JWT_REDACTED]" },
  { name: "private-key", pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g, replace: "[PRIVATE_KEY]" },
  { name: "aws-key", pattern: /\bAKIA[0-9A-Z]{16}\b/g, replace: "[AWS_KEY]" },
  { name: "connection-string", pattern: /(mongodb|postgresql|mysql|redis|sqlite):\/\/[^\s]+/gi, replace: "[DB_CONN_STRING]" },
];

// ─── Prompt Injection Patterns ──────────────────────────────

const INJECTION_PATTERNS: Array<{ name: string; pattern: RegExp; severity: "HIGH" | "MEDIUM" | "LOW" }> = [
  { name: "ignore-instructions", pattern: /\bignore\s+(all\s+)?(previous|prior|above|your)\s+(instructions|prompt|rules|guidelines)\b/i, severity: "HIGH" },
  { name: "disregard-instructions", pattern: /\bdisregard\s+(all\s+)?(previous|prior|above|your)\s+(instructions|prompt|rules)\b/i, severity: "HIGH" },
  { name: "forget-instructions", pattern: /\bforget\s+(all\s+)?(previous|prior|your)\s+(instructions|prompt|training|rules)\b/i, severity: "HIGH" },
  { name: "new-instructions", pattern: /\b(your\s+new\s+(instructions|prompt|rules|system\s+prompt)\s+(is|are|now))|(new\s+system\s+prompt:)/i, severity: "HIGH" },
  { name: "role-override", pattern: /\b(from\s+now\s+on\s+you\s+are|you\s+are\s+now\s+acting\s+as|pretend\s+you\s+are)\b/i, severity: "MEDIUM" },
  { name: "jailbreak-dan", pattern: /\b(DAN|jailbreak|developer\s+mode|god\s+mode|bypass|override\s+restrictions)\b/i, severity: "HIGH" },
  { name: "reveal-prompt", pattern: /\b(reveal|show|display|print|output|tell\s+me)\s+(your\s+)?(system\s+)?(prompt|instructions|rules|training|guidelines)\b/i, severity: "MEDIUM" },
  { name: "token-leak", pattern: /\b(what\s+is\s+your\s+(api\s+)?(key|token|secret|password|credential))\b/i, severity: "LOW" },
];

// ─── Guardrail Pipeline ─────────────────────────────────────

export interface GuardrailResult {
  passed: boolean;
  blocked: boolean;
  warnings: Array<{ type: string; message: string; severity: string }>;
  sanitizedContent: string;
  piiRedacted: number;
}

/**
 * Run the full guardrail pipeline on user input.
 * 1. PII detection + masking
 * 2. Prompt injection detection
 * 3. Credential redaction
 */
export function runGuardrails(
  content: string,
  mode: "warn" | "block" = "block"
): GuardrailResult {
  const warnings: GuardrailResult["warnings"] = [];
  let sanitized = content;
  let piiRedacted = 0;
  let blocked = false;

  // 1. PII masking
  for (const pii of PII_PATTERNS) {
      const beforeCount = (sanitized.match(pii.pattern) ?? []).length;
      sanitized = sanitized.replace(pii.pattern, pii.replace);
      if (beforeCount > 0) {
      piiRedacted += beforeCount;
      warnings.push({
        type: "PII",
        message: `Redacted ${beforeCount} ${pii.name}(s)`,
        severity: "MEDIUM",
      });
    }
  }

  // 2. Prompt injection detection
  for (const rule of INJECTION_PATTERNS) {
    if (rule.pattern.test(sanitized)) {
      warnings.push({
        type: "INJECTION",
        message: `Detected potential ${rule.name}: "${rule.pattern.source}"`,
        severity: rule.severity,
      });

      if (rule.severity === "HIGH" && mode === "block") {
        blocked = true;
      }
    }
  }

  return {
    passed: !blocked,
    blocked,
    warnings,
    sanitizedContent: sanitized,
    piiRedacted,
  };
}

/**
 * Run guardrails on an array of chat messages.
 * Skips assistant messages, processes user and system messages.
 */
export function guardMessages(
  messages: Array<{ role: string; content?: string | null }>,
  mode: "warn" | "block" = "block"
): {
  messages: Array<{ role: string; content?: string | null }>;
  blocked: boolean;
  summary: { piiRedacted: number; injectionsDetected: number };
} {
  let totalPiiRedacted = 0;
  let injectionsDetected = 0;

  const processed = messages.map((msg) => {
    if (msg.role === "assistant" || !msg.content) return msg;

    const result = runGuardrails(msg.content, mode);
    totalPiiRedacted += result.piiRedacted;
    if (result.warnings.some((w) => w.type === "INJECTION" && w.severity === "HIGH")) {
      injectionsDetected++;
    }

    return { ...msg, content: result.sanitizedContent };
  });

  return {
    messages: processed,
    blocked: injectionsDetected > 0 && mode === "block",
    summary: { piiRedacted: totalPiiRedacted, injectionsDetected },
  };
}
