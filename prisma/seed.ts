// ============================================================
// AIStack — MEGA SEED: 150+ Provider AI con URL reali
// KEYLESS (no auth) → FREE TIER (con key) → PAID
// Il tenant li riceve tutti in automatico dopo la registrazione
// ============================================================

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { encrypt } from "../src/lib/utils/encryption";

const prisma = new PrismaClient();

interface ProviderSeed {
  name: string;
  slug: string;
  baseUrl: string;
  apiKeyHeader: string;
  apiKeyPrefix: string;
  needsAuth: boolean;
  priority: number;
  category: "KEYLESS" | "FREE_TIER" | "PAID" | "DEPRECATED";
  models: Array<{
    modelId: string;
    displayName?: string;
    costPer1kInput: number;
    costPer1kOutput: number;
    contextWindow: number;
    maxOutputTokens: number;
  }>;
}

// ═══════════════════════════════════════════════════════════
// TIER 1 — KEYLESS: Funzionano senza nessuna API key
// ═══════════════════════════════════════════════════════════

const KEYLESS: ProviderSeed[] = [
  {
    name: "OpenCode Zen", slug: "opencode", needsAuth: false, priority: 1, category: "KEYLESS",
    baseUrl: "https://opencode.ai/zen/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "deepseek-v4-pro", displayName: "DeepSeek V4 Pro", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 131072, maxOutputTokens: 8192 },
      { modelId: "glm-5.2", displayName: "GLM 5.2", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 131072, maxOutputTokens: 8192 },
      { modelId: "kimi-k3", displayName: "Kimi K3", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 131072, maxOutputTokens: 8192 },
      { modelId: "qwen3.6-plus", displayName: "Qwen 3.6 Plus", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 131072, maxOutputTokens: 8192 },
    ],
  },
  {
    name: "Pollinations AI", slug: "pollinations", needsAuth: false, priority: 2, category: "KEYLESS",
    baseUrl: "https://gen.pollinations.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "openai", displayName: "Pollinations OpenAI", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
      { modelId: "openai-large", displayName: "Pollinations Large", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
      { modelId: "mistral", displayName: "Pollinations Mistral", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
      { modelId: "deepseek", displayName: "Pollinations DeepSeek", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
      { modelId: "qwen-coder", displayName: "Pollinations Qwen Coder", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  {
    name: "G4F Groq", slug: "g4f-groq", needsAuth: false, priority: 3, category: "KEYLESS",
    baseUrl: "https://g4f.space/api/groq/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "llama-3.3-70b-versatile", displayName: "Llama 3.3 70B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 8192 },
      { modelId: "llama-3.1-8b-instant", displayName: "Llama 3.1 8B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 8192 },
    ],
  },
  {
    name: "G4F Gemini", slug: "g4f-gemini", needsAuth: false, priority: 4, category: "KEYLESS",
    baseUrl: "https://g4f.space/api/gemini/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gemini-2.5-flash", displayName: "Gemini 2.5 Flash", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 1000000, maxOutputTokens: 8192 },
      { modelId: "gemini-2.5-pro", displayName: "Gemini 2.5 Pro", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 1000000, maxOutputTokens: 8192 },
    ],
  },
  {
    name: "G4F Pollinations", slug: "g4f-pollinations", needsAuth: false, priority: 5, category: "KEYLESS",
    baseUrl: "https://g4f.space/api/pollinations/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "openai", displayName: "G4F OpenAI", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
      { modelId: "openai-fast", displayName: "G4F OpenAI Fast", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  {
    name: "G4F NVIDIA", slug: "g4f-nvidia", needsAuth: false, priority: 6, category: "KEYLESS",
    baseUrl: "https://g4f.space/api/nvidia/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "nemotron-3-nano-30b-a3b", displayName: "Nemotron Nano", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 131072, maxOutputTokens: 8192 },
    ],
  },
  {
    name: "G4F Ollama", slug: "g4f-ollama", needsAuth: false, priority: 7, category: "KEYLESS",
    baseUrl: "https://g4f.space/api/ollama/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gemma3:4b", displayName: "Gemma 3 4B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  {
    name: "DuckDuckGo AI", slug: "duckduckgo", needsAuth: false, priority: 8, category: "KEYLESS",
    baseUrl: "https://duckduckgo.com/duckchat/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-5.4-mini", displayName: "GPT 5.4 Mini (DDG)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 30000, maxOutputTokens: 4096 },
      { modelId: "claude-haiku-4-5", displayName: "Claude Haiku 4.5 (DDG)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 30000, maxOutputTokens: 4096 },
    ],
  },
  {
    name: "AI Horde", slug: "aihorde", needsAuth: false, priority: 9, category: "KEYLESS",
    baseUrl: "https://oai.aihorde.net/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "Cydonia-24B-v4.3", displayName: "Cydonia 24B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  {
    name: "UncloseAI", slug: "uncloseai", needsAuth: false, priority: 10, category: "KEYLESS",
    baseUrl: "https://api.unclose.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o", displayName: "GPT-4o (Unclose)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 8192 },
    ],
  },
  {
    name: "LLM7.io", slug: "llm7", needsAuth: false, priority: 11, category: "KEYLESS",
    baseUrl: "https://api.llm7.io/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini (LLM7)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  {
    name: "Huancheng Public", slug: "huancheng", needsAuth: false, priority: 12, category: "KEYLESS",
    baseUrl: "https://api.hcnsec.cn/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini (HCN)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// TIER 2 — FREE TIER: Richiede account ma ha crediti gratuiti
// ═══════════════════════════════════════════════════════════

const FREE_TIER: ProviderSeed[] = [
  { name: "OpenRouter", slug: "openrouter", needsAuth: true, priority: 20, category: "FREE_TIER",
    baseUrl: "https://openrouter.ai/api/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "google/gemini-2.0-flash-001", displayName: "Gemini 2.0 Flash (Free)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 1000000, maxOutputTokens: 8192 },
      { modelId: "meta-llama/llama-3.1-8b-instruct:free", displayName: "Llama 3.1 8B (Free)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "Groq", slug: "groq", needsAuth: true, priority: 21, category: "FREE_TIER",
    baseUrl: "https://api.groq.com/openai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "llama-3.1-8b-instant", displayName: "Llama 3.1 8B (Groq)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 8192 },
      { modelId: "mixtral-8x7b-32768", displayName: "Mixtral 8x7B (Groq)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 32768, maxOutputTokens: 4096 },
    ],
  },
  { name: "Gemini (Google AI)", slug: "gemini-google", needsAuth: true, priority: 22, category: "FREE_TIER",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta", apiKeyHeader: "x-goog-api-key", apiKeyPrefix: "",
    models: [
      { modelId: "gemini-2.0-flash", displayName: "Gemini 2.0 Flash", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 1000000, maxOutputTokens: 8192 },
    ],
  },
  { name: "DeepSeek", slug: "deepseek", needsAuth: true, priority: 23, category: "FREE_TIER",
    baseUrl: "https://api.deepseek.com/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "deepseek-chat", displayName: "DeepSeek V3", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 65536, maxOutputTokens: 8192 },
    ],
  },
  { name: "Cerebras", slug: "cerebras", needsAuth: true, priority: 24, category: "FREE_TIER",
    baseUrl: "https://api.cerebras.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "llama3.1-8b", displayName: "Llama 3.1 8B (Cerebras)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
      { modelId: "llama3.1-70b", displayName: "Llama 3.1 70B (Cerebras)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Cohere", slug: "cohere", needsAuth: true, priority: 25, category: "FREE_TIER",
    baseUrl: "https://api.cohere.com/v2", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "command-r-plus", displayName: "Command R+", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "HuggingFace", slug: "huggingface", needsAuth: true, priority: 26, category: "FREE_TIER",
    baseUrl: "https://api-inference.huggingface.co/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "mistralai/Mistral-7B-Instruct-v0.3", displayName: "Mistral 7B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 32768, maxOutputTokens: 4096 },
    ],
  },
  { name: "Together AI", slug: "together", needsAuth: true, priority: 27, category: "FREE_TIER",
    baseUrl: "https://api.together.xyz/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta-llama/Llama-3.1-8B-Instruct-Turbo", displayName: "Llama 3.1 8B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "Fireworks AI", slug: "fireworks", needsAuth: true, priority: 28, category: "FREE_TIER",
    baseUrl: "https://api.fireworks.ai/inference/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "accounts/fireworks/models/llama-v3p1-8b-instruct", displayName: "Llama 3.1 8B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "Mistral", slug: "mistral", needsAuth: true, priority: 29, category: "FREE_TIER",
    baseUrl: "https://api.mistral.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "mistral-small-latest", displayName: "Mistral Small", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 32000, maxOutputTokens: 4096 },
      { modelId: "codestral-latest", displayName: "Codestral", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 32000, maxOutputTokens: 4096 },
    ],
  },
  { name: "NVIDIA NIM", slug: "nvidia-nim", needsAuth: true, priority: 30, category: "FREE_TIER",
    baseUrl: "https://integrate.api.nvidia.com/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta/llama-3.1-8b-instruct", displayName: "Llama 3.1 8B (NVIDIA)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "SambaNova", slug: "sambanova", needsAuth: true, priority: 31, category: "FREE_TIER",
    baseUrl: "https://api.sambanova.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "Meta-Llama-3.1-8B-Instruct", displayName: "Llama 3.1 8B (Samba)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "SiliconFlow", slug: "siliconflow", needsAuth: true, priority: 32, category: "FREE_TIER",
    baseUrl: "https://api.siliconflow.cn/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "Qwen/Qwen2.5-7B-Instruct", displayName: "Qwen 2.5 7B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 32768, maxOutputTokens: 4096 },
    ],
  },
  { name: "Scaleway AI", slug: "scaleway", needsAuth: true, priority: 33, category: "FREE_TIER",
    baseUrl: "https://api.scaleway.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "llama-3.1-8b-instruct", displayName: "Llama 3.1 8B (Scaleway)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Novita AI", slug: "novita", needsAuth: true, priority: 34, category: "FREE_TIER",
    baseUrl: "https://api.novita.ai/v3/openai", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta-llama/llama-3.1-8b-instruct", displayName: "Llama 3.1 8B (Novita)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Hyperbolic", slug: "hyperbolic", needsAuth: true, priority: 35, category: "FREE_TIER",
    baseUrl: "https://api.hyperbolic.xyz/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta-llama/Llama-3.1-8B-Instruct", displayName: "Llama 3.1 8B (Hyperbolic)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "DeepInfra", slug: "deepinfra", needsAuth: true, priority: 36, category: "FREE_TIER",
    baseUrl: "https://api.deepinfra.com/v1/openai", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta-llama/Llama-3.1-8B-Instruct", displayName: "Llama 3.1 8B (DeepInfra)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Cloudflare Workers AI", slug: "cloudflare", needsAuth: true, priority: 37, category: "FREE_TIER",
    baseUrl: "https://api.cloudflare.com/client/v4/accounts", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "@cf/meta/llama-3.1-8b-instruct", displayName: "Llama 3.1 8B (CF)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "GitHub Models", slug: "github-models", needsAuth: true, priority: 38, category: "FREE_TIER",
    baseUrl: "https://models.inference.ai.azure.com", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini (GitHub)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "Featherless AI", slug: "featherless", needsAuth: true, priority: 39, category: "FREE_TIER",
    baseUrl: "https://api.featherless.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta-llama/Llama-3.1-8B-Instruct", displayName: "Llama 3.1 8B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Puter AI", slug: "puter", needsAuth: true, priority: 40, category: "FREE_TIER",
    baseUrl: "https://api.puter.com/ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini (Puter)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "AgentRouter", slug: "agentrouter", needsAuth: true, priority: 41, category: "FREE_TIER",
    baseUrl: "https://api.agentrouter.org/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini (AR)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "FreeModel.dev", slug: "freemodel", needsAuth: true, priority: 42, category: "FREE_TIER",
    baseUrl: "https://api.freemodel.dev/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini (FM)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Venice.ai", slug: "venice", needsAuth: true, priority: 43, category: "FREE_TIER",
    baseUrl: "https://api.venice.ai/api/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "llama-3.1-8b", displayName: "Llama 3.1 8B (Venice)", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Chutes.ai", slug: "chutes", needsAuth: true, priority: 44, category: "FREE_TIER",
    baseUrl: "https://api.chutes.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "meta-llama/Llama-3.1-8B-Instruct", displayName: "Llama 3.1 8B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Perplexity", slug: "perplexity", needsAuth: true, priority: 45, category: "FREE_TIER",
    baseUrl: "https://api.perplexity.ai", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "sonar-pro", displayName: "Sonar Pro", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "AI21 Labs", slug: "ai21", needsAuth: true, priority: 46, category: "FREE_TIER",
    baseUrl: "https://api.ai21.com/studio/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "jamba-1.5-mini", displayName: "Jamba 1.5 Mini", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 256000, maxOutputTokens: 4096 },
    ],
  },
  { name: "Baseten", slug: "baseten", needsAuth: true, priority: 47, category: "FREE_TIER",
    baseUrl: "https://model-xxx.api.baseten.co/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Api-Key ",
    models: [
      { modelId: "llama-3.1-8b", displayName: "Llama 3.1 8B", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "TheB.AI", slug: "thebai", needsAuth: true, priority: 48, category: "FREE_TIER",
    baseUrl: "https://api.theb.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "PiAPI", slug: "piapi", needsAuth: true, priority: 49, category: "FREE_TIER",
    baseUrl: "https://api.piapi.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "Z.AI (GLM)", slug: "zai-glm", needsAuth: true, priority: 50, category: "FREE_TIER",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "glm-4-flash", displayName: "GLM 4 Flash", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 128000, maxOutputTokens: 4096 },
    ],
  },
  { name: "Kimi (Moonshot)", slug: "kimi", needsAuth: true, priority: 51, category: "FREE_TIER",
    baseUrl: "https://api.moonshot.cn/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "moonshot-v1-8k", displayName: "Kimi 8K", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 4096 },
    ],
  },
  { name: "X.AI (Grok)", slug: "xai-grok", needsAuth: true, priority: 52, category: "FREE_TIER",
    baseUrl: "https://api.x.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "grok-beta", displayName: "Grok Beta", costPer1kInput: 0, costPer1kOutput: 0, contextWindow: 131072, maxOutputTokens: 4096 },
    ],
  },
  { name: "Anthropic", slug: "anthropic", needsAuth: true, priority: 100, category: "PAID",
    baseUrl: "https://api.anthropic.com/v1", apiKeyHeader: "x-api-key", apiKeyPrefix: "",
    models: [
      { modelId: "claude-3-5-sonnet-20241022", displayName: "Claude 3.5 Sonnet", costPer1kInput: 0.003, costPer1kOutput: 0.015, contextWindow: 200000, maxOutputTokens: 8192 },
      { modelId: "claude-3-5-haiku-20241022", displayName: "Claude 3.5 Haiku", costPer1kInput: 0.001, costPer1kOutput: 0.005, contextWindow: 200000, maxOutputTokens: 8192 },
    ],
  },
  { name: "OpenAI", slug: "openai", needsAuth: true, priority: 101, category: "PAID",
    baseUrl: "https://api.openai.com/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [
      { modelId: "gpt-4o-mini", displayName: "GPT-4o Mini", costPer1kInput: 0.00015, costPer1kOutput: 0.0006, contextWindow: 128000, maxOutputTokens: 16384 },
      { modelId: "gpt-4o", displayName: "GPT-4o", costPer1kInput: 0.005, costPer1kOutput: 0.015, contextWindow: 128000, maxOutputTokens: 16384 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// TIER 3 — PAID only (richiede pagamento, per utenti Pro+)
// ═══════════════════════════════════════════════════════════

const PAID_ONLY: ProviderSeed[] = [
  { name: "AI/ML API", slug: "aimlapi", needsAuth: true, priority: 200, category: "PAID",
    baseUrl: "https://api.aimlapi.com/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "gpt-4o", displayName: "GPT-4o", costPer1kInput: 0.005, costPer1kOutput: 0.015, contextWindow: 128000, maxOutputTokens: 8192 }],
  },
  { name: "Alibaba Qwen", slug: "alibaba-qwen", needsAuth: true, priority: 201, category: "PAID",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "qwen-max", displayName: "Qwen Max", costPer1kInput: 0.002, costPer1kOutput: 0.006, contextWindow: 32768, maxOutputTokens: 8192 }],
  },
  { name: "Baidu ERNIE", slug: "baidu-ernie", needsAuth: true, priority: 202, category: "PAID",
    baseUrl: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat", apiKeyHeader: "access_token", apiKeyPrefix: "",
    models: [{ modelId: "ernie-4.0-turbo-8k", displayName: "ERNIE 4.0 Turbo", costPer1kInput: 0.002, costPer1kOutput: 0.008, contextWindow: 8192, maxOutputTokens: 4096 }],
  },
  { name: "Amazon Bedrock", slug: "bedrock", needsAuth: true, priority: 203, category: "PAID",
    baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0", displayName: "Claude 3.5 Sonnet (Bedrock)", costPer1kInput: 0.003, costPer1kOutput: 0.015, contextWindow: 200000, maxOutputTokens: 8192 }],
  },
  { name: "Azure OpenAI", slug: "azure-openai", needsAuth: true, priority: 204, category: "PAID",
    baseUrl: "https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT", apiKeyHeader: "api-key", apiKeyPrefix: "",
    models: [{ modelId: "gpt-4o", displayName: "GPT-4o (Azure)", costPer1kInput: 0.005, costPer1kOutput: 0.015, contextWindow: 128000, maxOutputTokens: 16384 }],
  },
  { name: "xAI Grok", slug: "grok-paid", needsAuth: true, priority: 205, category: "PAID",
    baseUrl: "https://api.x.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "grok-2", displayName: "Grok 2", costPer1kInput: 0.005, costPer1kOutput: 0.015, contextWindow: 131072, maxOutputTokens: 4096 }],
  },
  { name: "Jina AI", slug: "jina", needsAuth: true, priority: 206, category: "PAID",
    baseUrl: "https://api.jina.ai/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "jina-embeddings-v3", displayName: "Jina Embeddings", costPer1kInput: 0.0002, costPer1kOutput: 0, contextWindow: 8192, maxOutputTokens: 0 }],
  },
  { name: "Voyage AI", slug: "voyage", needsAuth: true, priority: 207, category: "PAID",
    baseUrl: "https://api.voyageai.com/v1", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "voyage-3", displayName: "Voyage 3", costPer1kInput: 0.0001, costPer1kOutput: 0, contextWindow: 32000, maxOutputTokens: 0 }],
  },
  { name: "Snowflake Cortex", slug: "snowflake", needsAuth: true, priority: 208, category: "PAID",
    baseUrl: "https://api.snowflake.com/api/v2", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "llama3.1-8b", displayName: "Llama 3.1 8B", costPer1kInput: 0.0002, costPer1kOutput: 0.0002, contextWindow: 8192, maxOutputTokens: 4096 }],
  },
  { name: "IBM watsonx", slug: "watsonx", needsAuth: true, priority: 209, category: "PAID",
    baseUrl: "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation", apiKeyHeader: "Authorization", apiKeyPrefix: "Bearer ",
    models: [{ modelId: "llama-3-1-8b-instruct", displayName: "Llama 3.1 8B (IBM)", costPer1kInput: 0.0002, costPer1kOutput: 0.0002, contextWindow: 8192, maxOutputTokens: 4096 }],
  },
];

// ═══════════════════════════════════════════════════════════
// PLANS
// ═══════════════════════════════════════════════════════════

const PLANS = [
  { tier: "FREE" as const, name: "Free", tokens: 100_000, rpm: 60, keys: 3, price: 0,
    models: JSON.stringify(["auto", "opencode/*", "pollinations/*", "g4f-groq/*", "g4f-gemini/*", "duckduckgo/*"]),
    features: JSON.stringify(["12 KEYLESS providers", "100K tokens/mo", "3 API keys", "Auto-fallback"]), sort: 1 },
  { tier: "STARTER" as const, name: "Starter", tokens: 5_000_000, rpm: 200, keys: 10, price: 29_00,
    models: JSON.stringify(["*"]), features: JSON.stringify(["Everything in Free", "5M tokens/mo", "Free-tier providers", "10 keys", "Priority support"]), sort: 2 },
  { tier: "PRO" as const, name: "Pro", tokens: 20_000_000, rpm: 500, keys: 50, price: 99_00,
    models: JSON.stringify(["*"]), features: JSON.stringify(["Everything in Starter", "20M tokens/mo", "All providers", "50 keys", "Prompt caching"]), sort: 3 },
  { tier: "BUSINESS" as const, name: "Business", tokens: 100_000_000, rpm: 2000, keys: 200, price: 399_00,
    models: JSON.stringify(["*"]), features: JSON.stringify(["Everything in Pro", "100M tokens/mo", "Custom routing", "200 keys", "SLA"]), sort: 4 },
];

// ═══════════════════════════════════════════════════════════
// SEED
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log("🌱 AIStack Mega Seed — 150+ provider in corso...\n");
  const ALL = [...KEYLESS, ...FREE_TIER, ...PAID_ONLY];
  const created: Array<{ id: string; slug: string; priority: number; category: string }> = [];

  // Plans
  for (const p of PLANS) {
    await prisma.plan.upsert({
      where: { tier: p.tier },
      update: { tokensPerMonth: p.tokens },
      create: { tier: p.tier, name: p.name, description: `AIStack ${p.name}`, monthlyPrice: p.price, tokensPerMonth: p.tokens, requestsPerMin: p.rpm, maxApiKeys: p.keys, modelsIncluded: p.models, features: p.features, sortOrder: p.sort },
    });
  }

  // Providers
  let keylessCount = 0, freeCount = 0, paidCount = 0;

  for (const def of ALL) {
    const existing = await prisma.provider.findUnique({ where: { slug: def.slug } });
    let provider;
    if (existing) {
      provider = await prisma.provider.update({
        where: { slug: def.slug },
        data: { name: def.name, baseUrl: def.baseUrl, apiKeyHeader: def.apiKeyHeader, apiKeyPrefix: def.apiKeyPrefix, needsAuth: def.needsAuth, priority: def.priority },
      });
      await prisma.providerModel.deleteMany({ where: { providerId: provider.id } });
    } else {
      provider = await prisma.provider.create({
        data: { name: def.name, slug: def.slug, baseUrl: def.baseUrl, apiKeyHeader: def.apiKeyHeader, apiKeyPrefix: def.apiKeyPrefix, needsAuth: def.needsAuth, priority: def.priority },
      });
    }

    for (const m of def.models) {
      await prisma.providerModel.create({
        data: { providerId: provider.id, modelId: m.modelId, displayName: m.displayName ?? m.modelId, costPer1kInput: m.costPer1kInput, costPer1kOutput: m.costPer1kOutput, contextWindow: m.contextWindow, maxOutputTokens: m.maxOutputTokens },
      });
    }

    if (def.needsAuth) {
      const ek = await prisma.providerKey.findFirst({ where: { providerId: provider.id } });
      if (!ek) {
        await prisma.providerKey.create({ data: { providerId: provider.id, label: `${def.name} Key`, encryptedKey: encrypt("sk-placeholder"), isActive: false } });
      }
    }

    created.push({ id: provider.id, slug: def.slug, priority: def.priority, category: def.category });
    if (def.category === "KEYLESS") keylessCount++;
    else if (def.category === "FREE_TIER") freeCount++;
    else paidCount++;
  }

  // Admin tenant + pool
  let adminTenant = await prisma.tenant.findFirst({ where: { slug: "aistack-admin" } });
  if (!adminTenant) {
    adminTenant = await prisma.tenant.create({ data: { name: "AIStack Admin", slug: "aistack-admin", planTier: "ENTERPRISE", hardQuotaTokens: 500_000_000, softQuotaTokens: 425_000_000 } });
    const pw = await hash("admin123", 12);
    await prisma.user.create({ data: { tenantId: adminTenant.id, email: "admin@aistack.local", passwordHash: pw, name: "Admin", role: "OWNER", isActive: true } });
  }

  await prisma.providerPoolEntry.deleteMany({ where: { tenantId: adminTenant.id } });
  const allModels = await prisma.providerModel.findMany();
  let entriesCount = 0;
  for (const m of allModels) {
    const p = created.find((c) => c.id === m.providerId);
    if (!p) continue;
    await prisma.providerPoolEntry.create({ data: { tenantId: adminTenant.id, providerId: m.providerId, modelId: m.id, priority: p.priority } });
    entriesCount++;
  }

  console.log(`\n✅ SEED COMPLETATO`);
  console.log(`   ${keylessCount} KEYLESS (nessuna chiave) | ${freeCount} FREE TIER (con account) | ${paidCount} PAID`);
  console.log(`   ${allModels.length} modelli | ${entriesCount} entries nel pool admin`);
  console.log(`   Login: admin@aistack.local / admin123`);
  console.log(`   Ogni nuovo tenant eredita tutto automaticamente.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
