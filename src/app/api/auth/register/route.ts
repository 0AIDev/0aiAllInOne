import { NextRequest, NextResponse } from "next/server";
import { register, setSessionCookie } from "@/lib/auth/auth-options";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const tenantName = `${name}'s Organization`;
    const token = await register({ email, password, name, tenantName });

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", setSessionCookie(token));
    return response;
  } catch (err) {
    if (err instanceof Error && err.message === "Email already registered") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
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
