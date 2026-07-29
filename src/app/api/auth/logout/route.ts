import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/auth-options";
import { cookies } from "next/headers";

export async function POST(_request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("aistack_session")?.value;

  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.redirect(new URL("/", _request.url));
  response.cookies.set("aistack_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}
