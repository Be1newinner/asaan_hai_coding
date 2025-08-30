import { type NextRequest, NextResponse } from "next/server";
import {
  API_BASE_URL,
  AUTH_COOKIE,
  invariant,
  COOKIE_MAX_AGE_SECONDS,
} from "@/lib/config";

type TokenOut = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
};

export async function POST(req: NextRequest) {
  invariant(
    API_BASE_URL,
    "Missing API_BASE_URL. Add it in Project Settings > Environment Variables."
  );
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const username = (body?.username ?? body?.email ?? "").toString().trim();
  const password = (body?.password ?? "").toString();

  if (!username || !password) {
    return NextResponse.json(
      {
        detail: [
          ...(username
            ? []
            : [
                {
                  type: "missing",
                  loc: ["body", "username"],
                  msg: "Field required",
                  input: null,
                },
              ]),
          ...(password
            ? []
            : [
                {
                  type: "missing",
                  loc: ["body", "password"],
                  msg: "Field required",
                  input: null,
                },
              ]),
        ],
      },
      { status: 422 }
    );
  }

  const form = new URLSearchParams();
  form.set("username", username);
  form.set("password", password);

  const upstream = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  const json = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(json, { status: upstream.status });
  }

  const setCookie = upstream.headers.get("set-cookie") || "";
  const cookieMatch = setCookie.match(/refresh_token=([^;]+)/);
  const refreshFromCookie = cookieMatch
    ? decodeURIComponent(cookieMatch[1])
    : undefined;
  const refreshFromJson = (json as TokenOut).refresh_token;
  const refresh = refreshFromCookie || refreshFromJson;

  if (!refresh) {
    return NextResponse.json(
      { message: "No refresh_token returned" },
      { status: 502 }
    );
  }

  const resp = NextResponse.json({ ok: true });
  const isHttps =
    req.nextUrl.protocol === "https:" || process.env.NODE_ENV === "production";
  resp.cookies.set({
    name: AUTH_COOKIE,
    value: refresh,
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return resp;
}
