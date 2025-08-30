import { type NextRequest, NextResponse } from "next/server";
import {
  API_BASE_URL,
  AUTH_COOKIE,
  invariant,
  COOKIE_MAX_AGE_SECONDS,
} from "@/lib/config";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: { path: string[] } }
) {
  return handle(req, ctx);
}
export async function POST(
  req: NextRequest,
  ctx: { params: { path: string[] } }
) {
  return handle(req, ctx);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: { path: string[] } }
) {
  return handle(req, ctx);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: { path: string[] } }
) {
  return handle(req, ctx);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: { path: string[] } }
) {
  return handle(req, ctx);
}

async function handle(req: NextRequest, ctx: { params: { path: string[] } }) {
  invariant(
    API_BASE_URL,
    "Missing API_BASE_URL. Add it in Project Settings > Environment Variables."
  );
  const targetPath = "/" + ctx.params.path.join("/");
  const url = new URL(req.url);
  const upstream = `${API_BASE_URL}/api${targetPath}${url.search}`;

  const rt = (await cookies()).get(AUTH_COOKIE)?.value;
  const headers: HeadersInit = new Headers();
  req.headers.forEach((v, k) => {
    if (
      !["host", "cookie", "authorization", "content-length"].includes(
        k.toLowerCase()
      )
    ) {
      headers.set(k, v);
    }
  });
  if (rt) {
    headers.set("cookie", `refresh_token=${encodeURIComponent(rt)}`);
  }

  const body = await getBody(req);

  let res = await fetch(upstream, {
    method: req.method,
    headers,
    body,
  });

  if (res.status === 401) {
    const refreshHeaders: HeadersInit = rt
      ? { cookie: `refresh_token=${encodeURIComponent(rt)}` }
      : {};
    const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: refreshHeaders,
    });

    if (refreshRes.ok) {
      const setCookie = refreshRes.headers.get("set-cookie") || "";
      let newRt = extractCookieValue(setCookie, "refresh_token");
      if (!newRt) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const refreshJson = await refreshRes.json().catch(() => ({}) as any);
        newRt = refreshJson?.refresh_token;
      }

      if (newRt) {
        const cookieCarrier = NextResponse.next();
        const isHttps =
          req.nextUrl.protocol === "https:" ||
          process.env.NODE_ENV === "production";
        cookieCarrier.cookies.set({
          name: AUTH_COOKIE,
          value: newRt,
          httpOnly: true,
          sameSite: "lax",
          secure: isHttps,
          path: "/",
          maxAge: COOKIE_MAX_AGE_SECONDS,
        });

        headers.set("cookie", `refresh_token=${encodeURIComponent(newRt)}`);
        res = await fetch(upstream, {
          method: req.method,
          headers,
          body,
        });
        return streamResponseWithCookies(res, cookieCarrier);
      }
    }
  }

  return streamResponse(res);
}

function extractCookieValue(setCookieHeader: string, name: string) {
  const m = setCookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

async function getBody(req: NextRequest) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    return form;
  }
  if (contentType.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    return JSON.stringify(json);
  }
  return req.body;
}

async function streamResponse(upstream: Response) {
  const headers = new Headers(upstream.headers);
  headers.delete("transfer-encoding");
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function streamResponseWithCookies(
  upstream: Response,
  cookieCarrier: NextResponse
) {
  const headers = new Headers(upstream.headers);
  headers.delete("transfer-encoding");
  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
  const setCookies = cookieCarrier.headers.get("set-cookie");
  if (setCookies) {
    res.headers.append("set-cookie", setCookies);
  }
  return res;
}
