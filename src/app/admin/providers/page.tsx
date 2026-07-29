import { requireAdmin } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProviderRow } from "./provider-connect";

interface ProviderGroup {
  name: string;
  count: number;
  description: string;
  providers: Array<{ slug: string; name: string; domain: string; connected: boolean }>;
}

export default async function AdminProvidersPage() {
  const adminSession = await requireAdmin().catch(() => null); if (!adminSession) redirect("/login");

  const dbProviders = await prisma.provider.findMany({
    include: { keys: { where: { isActive: true } } },
    orderBy: { name: "asc" },
  });

  const connectedMap = new Map<string, boolean>();
  for (const p of dbProviders) {
    connectedMap.set(p.slug, p.keys.length > 0);
  }

  function makeProviders(names: Array<{ slug: string; name: string; domain: string }>) {
    return names.map((n) => ({
      ...n,
      connected: connectedMap.get(n.slug) ?? false,
    }));
  }

  const groups: ProviderGroup[] = [
    {
      name: "OAuth Providers",
      count: 19,
      description: "Sign in once and AI0FY handles token rotation automatically.",
      providers: makeProviders([
        { slug: "amazon-q", name: "Amazon Q", domain: "aws.amazon.com" },
        { slug: "antigravity", name: "Antigravity", domain: "antigravity.google" },
        { slug: "antigravity-cli", name: "Antigravity CLI", domain: "antigravity.google" },
        { slug: "claude", name: "Claude Code", domain: "claude.ai" },
        { slug: "cline", name: "Cline", domain: "cline.bot" },
        { slug: "clinepass", name: "ClinePass", domain: "cline.bot" },
        { slug: "codebuddy-cn", name: "CodeBuddy CN", domain: "codebuddy.cn" },
        { slug: "devin-cli", name: "Devin CLI", domain: "devin.ai" },
        { slug: "github-copilot", name: "GitHub Copilot", domain: "github.com" },
        { slug: "gitlab-duo", name: "GitLab Duo", domain: "gitlab.com" },
        { slug: "grok-build", name: "Grok Build", domain: "x.ai" },
        { slug: "kilocode", name: "Kilo Code", domain: "kilocode.ai" },
        { slug: "kimi-coding", name: "Kimi Coding", domain: "moonshot.ai" },
        { slug: "kiro", name: "Kiro AI", domain: "kiro.ai" },
        { slug: "codex", name: "OpenAI Codex", domain: "openai.com" },
        { slug: "qoder", name: "Qoder", domain: "qoder.ai" },
        { slug: "qwen-code", name: "Qwen Code", domain: "alibaba.com" },
        { slug: "windsurf", name: "Windsurf", domain: "windsurf.com" },
        { slug: "zed-hosted", name: "Zed Hosted", domain: "zed.dev" },
      ]),
    },
    {
      name: "IDE Providers",
      count: 3,
      description: "Editors with built-in AI subscriptions. Import credentials from the IDE keychain.",
      providers: makeProviders([
        { slug: "cursor", name: "Cursor IDE", domain: "cursor.com" },
        { slug: "trae", name: "Trae", domain: "trae.ai" },
        { slug: "zed", name: "Zed IDE", domain: "zed.dev" },
      ]),
    },
    {
      name: "Web Cookie Providers",
      count: 25,
      description: "Browser session or cookie-based providers. Add session credentials.",
      providers: makeProviders([
        { slug: "adapta-web", name: "Adapta.org", domain: "adapta.org" },
        { slug: "lmarena", name: "Arena (Free)", domain: "lmarena.ai" },
        { slug: "blackbox-web", name: "Blackbox Web", domain: "blackbox.ai" },
        { slug: "chatgpt-web", name: "ChatGPT Web", domain: "chatgpt.com" },
        { slug: "claude-web", name: "Claude Web", domain: "claude.ai" },
        { slug: "deepseek-web", name: "DeepSeek Web", domain: "deepseek.com" },
        { slug: "dola-web", name: "Dola Web", domain: "bytedance.com" },
        { slug: "gemini-business", name: "Gemini Business", domain: "gemini.google.com" },
        { slug: "gemini-web", name: "Gemini Web (Free)", domain: "gemini.google.com" },
        { slug: "grok-web", name: "Grok Web", domain: "x.ai" },
        { slug: "huggingchat", name: "HuggingChat", domain: "huggingface.co" },
        { slug: "inner-ai", name: "Inner.ai", domain: "inner.ai" },
        { slug: "kimi-web", name: "Kimi Web", domain: "moonshot.ai" },
        { slug: "ms365-copilot", name: "Microsoft 365 Copilot", domain: "microsoft.com" },
        { slug: "ms-copilot-web", name: "Microsoft Copilot Web", domain: "microsoft.com" },
        { slug: "muse-spark", name: "Muse Spark", domain: "meta.ai" },
        { slug: "perplexity-web", name: "Perplexity Web", domain: "perplexity.ai" },
        { slug: "poe-web", name: "Poe Web", domain: "poe.com" },
        { slug: "qwen-web", name: "Qwen Web", domain: "alibaba.com" },
        { slug: "t3-web", name: "t3.chat", domain: "t3.chat" },
        { slug: "yuanbao-web", name: "Tencent Yuanbao", domain: "tencent.com" },
        { slug: "v0-vercel", name: "v0 Vercel", domain: "vercel.com" },
        { slug: "venice-web", name: "Venice Web", domain: "venice.ai" },
        { slug: "z-ai-web", name: "Z.ai Web", domain: "bigmodel.cn" },
        { slug: "zenmux-free", name: "ZenMux Free", domain: "zenmux.com" },
      ]),
    },
  ];

  const noAuthProviders = makeProviders([
    { slug: "auggie", name: "Augment CLI", domain: "augmentcode.com" },
    { slug: "chipotle", name: "Chipotle Pepper AI", domain: "chipotle.ai" },
    { slug: "duckduckgo-web", name: "DuckDuckGo AI Chat", domain: "duckduckgo.com" },
    { slug: "mimocode-free", name: "MiMoCode (Free)", domain: "mimo.com" },
    { slug: "opencode-free", name: "OpenCode Free", domain: "opencode.ai" },
    { slug: "theoldllm", name: "The Old LLM", domain: "theoldllm.com" },
    { slug: "veoaifree-web", name: "Veo AI Free", domain: "veo.ai" },
  ]);

  const totalConnected = dbProviders.filter((p) => p.keys.length > 0).length;

  return (
    <div className="min-h-screen bg-[#F9F9F6] p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F0F0E]">Provider Configuration</h1>
        <p className="mt-1 text-sm text-[#7A7870]">
          {totalConnected}/{dbProviders.length} connected - Manage provider keys, OAuth tokens, and web sessions.
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <ProviderGroupCard key={group.name} group={group} />
        ))}

        <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#0F0F0E]">No Auth Providers</h3>
              <p className="mt-0.5 text-xs text-[#7A7870]">
                Open endpoints that require no credentials. Ready to use immediately.
              </p>
            </div>
            <span className="text-xs font-medium text-[#7A7870]">
              {noAuthProviders.filter((p) => p.connected).length}/{noAuthProviders.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {noAuthProviders.map((p) => (
              <ProviderRow key={p.slug} {...p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderGroupCard({ group }: { group: ProviderGroup }) {
  const connected = group.providers.filter((p) => p.connected).length;
  return (
    <div className="rounded-[14px] border border-[rgba(15,15,14,0.08)] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#0F0F0E]">{group.name}</h3>
          <p className="mt-0.5 text-xs text-[#7A7870]">{group.description}</p>
        </div>
        <span className="text-xs font-medium text-[#7A7870]">
          {connected}/{group.count}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {group.providers.map((p) => (
          <ProviderRow key={p.slug} {...p} />
        ))}
      </div>
    </div>
  );
}


