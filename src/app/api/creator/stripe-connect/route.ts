import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { stripeConnectId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.stripeConnectId || typeof body.stripeConnectId !== "string") {
    return NextResponse.json({ error: "stripeConnectId is required" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      stripeConnectId: body.stripeConnectId,
      stripeConnectVerified: true,
    },
  });

  return NextResponse.json({ success: true });
}
