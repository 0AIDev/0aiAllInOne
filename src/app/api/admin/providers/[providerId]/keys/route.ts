import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/utils/encryption";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { providerId } = await params;
  const keys = await prisma.providerKey.findMany({
    where: { providerId },
  });
  return NextResponse.json(keys);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { providerId } = await params;
  const body = await request.json();
  const { label, apiKey, priority } = body;

  if (!apiKey) {
    return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
  }

  const encryptedKey = encrypt(apiKey);

  const key = await prisma.providerKey.create({
    data: {
      providerId,
      label: label ?? `Key-${Date.now()}`,
      encryptedKey,
      priority: priority ?? 0,
      isActive: true,
    },
  });

  return NextResponse.json({ id: key.id, label: key.label, isActive: key.isActive });
}
