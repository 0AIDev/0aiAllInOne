import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [skills, total] = await Promise.all([
    prisma.skill.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        priceCents: true,
        downloads: true,
        rating: true,
        creator: {
          select: { name: true },
        },
      },
      orderBy: { downloads: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.skill.count({ where }),
  ]);

  return NextResponse.json({
    skills: skills.map((s) => ({
      ...s,
      creatorName: s.creator.name,
      creator: undefined,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
