import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/utils/encryption";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string; keyId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyId } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.label !== undefined) data.label = body.label;
  if (body.priority !== undefined) data.priority = body.priority;
  if (body.apiKey) data.encryptedKey = encrypt(body.apiKey);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  await prisma.providerKey.update({ where: { id: keyId }, data });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string; keyId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyId } = await params;
  await prisma.providerKey.delete({ where: { id: keyId } });

  return NextResponse.json({ success: true });
}
