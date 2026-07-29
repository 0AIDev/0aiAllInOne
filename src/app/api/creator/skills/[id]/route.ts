import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const publishSkillSchema = z.object({
  action: z.literal("publish"),
});

const updateSkillSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  triggers: z.string().optional(),
  priceCents: z.number().int().min(0).optional(),
  revenueShare: z.number().int().min(0).max(100).optional(),
  version: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill || skill.creatorId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ skill });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill || skill.creatorId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSkillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.title) {
    const slug = parsed.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 200);

    const existing = await prisma.skill.findFirst({
      where: { slug, id: { not: id } },
    });
    if (existing) {
      return NextResponse.json({ error: "A skill with this title already exists." }, { status: 409 });
    }

    updateData.slug = slug;
  }

  const updated = await prisma.skill.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ skill: updated });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill || skill.creatorId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = publishSkillSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const updated = await prisma.skill.update({
    where: { id },
    data: { status: "PUBLISHED", published: true },
  });

  return NextResponse.json({ skill: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill || skill.creatorId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.skill.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  return NextResponse.json({ success: true });
}
