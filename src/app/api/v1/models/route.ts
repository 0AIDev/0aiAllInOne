import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/utils/encryption";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ object: "list", data: [] });
  }

  const rawKey = authHeader.slice(7).trim();
  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { hashedKey },
    include: {
      tenant: {
        include: {
          providerPool: {
            where: { isEnabled: true },
            include: {
              provider: true,
              model: true,
            },
          },
        },
      },
    },
  });

  if (!apiKey || apiKey.status !== "ACTIVE") {
    return NextResponse.json({ object: "list", data: [] });
  }

  const models = apiKey.tenant.providerPool.map((entry) => ({
    id: `${entry.provider.slug}/${entry.model.modelId}`,
    object: "model",
    created: Math.floor(entry.createdAt.getTime() / 1000),
    owned_by: entry.provider.slug,
    cost_per_1k_input: Number(entry.model.costPer1kInput),
    cost_per_1k_output: Number(entry.model.costPer1kOutput),
    context_window: entry.model.contextWindow,
    supports_vision: entry.model.supportsVision,
    supports_tools: entry.model.supportsTools,
  }));

  return NextResponse.json({ object: "list", data: models });
}
