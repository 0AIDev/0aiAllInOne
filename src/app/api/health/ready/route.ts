import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  // Simple readiness - the server is accepting connections
  return NextResponse.json(
    { status: "ready", timestamp: new Date().toISOString() },
    {
      status: 200,
      headers: { "Cache-Control": "no-cache" },
    }
  );
}
