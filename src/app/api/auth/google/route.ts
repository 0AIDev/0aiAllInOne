import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Google OAuth coming soon. Use email/password for now." },
    { status: 501 }
  );
}
