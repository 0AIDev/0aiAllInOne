import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providers = await prisma.provider.findMany({
    include: { keys: true, models: true },
  });
  return NextResponse.json(providers);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, baseUrl, apiKeyHeader, apiKeyPrefix, priority } = body;

  if (!name || !slug || !baseUrl) {
    return NextResponse.json({ error: "name, slug, baseUrl are required" }, { status: 400 });
  }

  const provider = await prisma.provider.create({
    data: {
      name,
      slug,
      baseUrl,
      apiKeyHeader: apiKeyHeader ?? "Authorization",
      apiKeyPrefix: apiKeyPrefix ?? "Bearer ",
      priority: priority ?? 10,
    },
  });

  return NextResponse.json(provider);
}
