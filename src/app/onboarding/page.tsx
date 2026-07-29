import { verifySession } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./OnboardingWizard";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const session = await verifySession();
  if (!session) redirect("/login");

  const providers = await prisma.provider.findMany({
    include: { keys: { where: { isActive: true } } },
    orderBy: { name: "asc" },
  });

  const connectedSlugs = new Set(
    providers.filter((p) => p.keys.length > 0).map((p) => p.slug)
  );

  const simpleProviders = providers.map((p) => ({
    slug: p.slug,
    name: p.name,
    connected: connectedSlugs.has(p.slug),
    needsAuth: p.needsAuth,
  }));

  const totalConnected = connectedSlugs.size;
  const totalProviders = providers.length;
  const hasApiKey = await prisma.apiKey.count({ where: { tenantId: session.tenantId } }) > 0;

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      <OnboardingWizard
        providers={simpleProviders}
        totalConnected={totalConnected}
        totalProviders={totalProviders}
        hasApiKey={hasApiKey}
      />
    </div>
  );
}
