import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.update({
    where: { id: session.userId },
    data: { onboardingCompleted: true },
  });

  return NextResponse.json({ success: true });
}
