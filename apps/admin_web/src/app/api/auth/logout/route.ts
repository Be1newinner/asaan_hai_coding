import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/config";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const isHttps =
    req.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production";
  res.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    path: "/",
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    maxAge: 0,
  });
  return res;
}
