import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    priceCents?: number;
    triggers?: string[];
    content?: string;
    version?: string;
    status?: "DRAFT" | "PUBLISHED";
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, slug, description, category, priceCents, triggers, content, version, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const existing = await prisma.skill.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A skill with this slug already exists" }, { status: 409 });
  }

  const skill = await prisma.skill.create({
    data: {
      creatorId: session.userId,
      title,
      slug,
      description: description ?? "",
      category: category ?? "other",
      priceCents: priceCents ?? 0,
      triggers: JSON.stringify(triggers ?? []),
      content: content ?? "",
      version: version ?? "1.0.0",
      status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    },
  });

  return NextResponse.json({ skill }, { status: 201 });
}
