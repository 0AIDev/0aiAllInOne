import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "GitHub OAuth coming soon. Use email/password for now." },
    { status: 501 }
  );
}
