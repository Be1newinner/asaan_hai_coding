import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE, API_BASE_URL } from "@/lib/config";

export async function getAccessToken() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  return token || null;
}

export async function requireUserOrRedirect() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    redirect("/login");
  }

  const me = await res.json().catch(() => null);
  return { token, me };
}
