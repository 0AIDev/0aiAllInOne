import { NextRequest, NextResponse } from "next/server";
import { login, setSessionCookie } from "@/lib/auth/auth-options";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const token = await login(email, password);

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", setSessionCookie(token));
    return response;
  } catch (err) {
    if (err instanceof Error && "statusCode" in err) {
      const authErr = err as { statusCode: number };
      return NextResponse.json(
        { error: err.message },
        { status: authErr.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
