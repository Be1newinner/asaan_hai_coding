import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  API_BASE_URL,
  ACCESS_TOKEN_COOKIE,
  COOKIE_MAX_AGE_SECONDS,
} from "@/lib/config";

export async function POST(_req: NextRequest) {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const resp = NextResponse.json(
      { message: "Refresh failed" },
      { status: res.status }
    );
    resp.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: "",
      path: "/",
      maxAge: 0,
    });
    return resp;
  }

  const newToken = data?.access_token as string | undefined;
  if (!newToken)
    return NextResponse.json(
      { message: "No token from refresh" },
      { status: 500 }
    );

  const resp = NextResponse.json({ ok: true });
  resp.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: newToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return resp;
}
