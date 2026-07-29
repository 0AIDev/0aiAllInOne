import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { generateApiToken, hashApiKey, getKeyPrefix } from "@/lib/utils/encryption";

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; rpmLimit?: number; tpdLimit?: number; budgetLimit?: number } = {};
  try {
    body = await request.json();
  } catch {}

  const rawKey = generateApiToken();
  const hashedKey = hashApiKey(rawKey);
  const prefixKey = getKeyPrefix(rawKey);

  const budgetLimit = body.budgetLimit ?? 0;

  await prisma.apiKey.create({
    data: {
      tenantId: session.tenantId,
      userId: session.userId,
      name: body.name || `Key-${prefixKey}`,
      prefixKey,
      hashedKey,
      rpmLimit: body.rpmLimit ?? 60,
      tpdLimit: body.tpdLimit ?? 1000000,
    },
  });

  return NextResponse.json({
    key: rawKey,
    prefixKey,
    name: body.name || `Key-${prefixKey}`,
    rpmLimit: body.rpmLimit ?? 60,
    tpdLimit: body.tpdLimit ?? 1000000,
    budgetLimit,
    budgetUsed: 0,
  });
}
