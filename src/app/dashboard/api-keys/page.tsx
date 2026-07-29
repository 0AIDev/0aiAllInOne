import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ApiKeyManager } from "./ApiKeyManager";

export default async function ApiKeysPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const rawKeys = await prisma.apiKey.findMany({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefixKey: true,
      status: true,
      createdAt: true,
      lastUsedAt: true,
      rpmLimit: true,
      tpdLimit: true,
      allowedModels: true,
    },
  });

  const apiKeys = rawKeys.map((k) => ({
    id: k.id,
    name: k.name,
    prefixKey: k.prefixKey,
    status: k.status,
    createdAt: k.createdAt.toISOString(),
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    rpmLimit: k.rpmLimit,
    tpdLimit: k.tpdLimit,
    allowedModels: JSON.parse(k.allowedModels || "[]") as string[],
  }));

  return (
    <div
      className="p-8"
      style={{
        backgroundColor: "#F9F9F6",
        fontFamily: "'Inter Tight', sans-serif",
      }}
    >
      <h1 className="text-2xl font-bold text-[#0F0F0E]">API Keys</h1>
      <p className="mt-1 text-sm text-[#7A7870]">
        Manage your API keys. Never share your keys publicly.
      </p>

      <ApiKeyManager keys={apiKeys} />
    </div>
  );
}
