type ApiError = Error & { status?: number };

async function refreshOnce() {
  try {
    const r = await fetch("/api/auth/refresh", { method: "POST" });
    return r.ok;
  } catch {
    return false;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit & { retryOn401?: boolean }
): Promise<T> {
  const retryOn401 = init?.retryOn401 ?? true;
  const url = `/api/proxy${path.startsWith("/") ? path : `/${path}`}`;

  const doFetch = async () => {
    const res = await fetch(url, {
      credentials: "include",
      ...init,
      body:
        init?.method && !["GET", "HEAD"].includes(init.method.toUpperCase())
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (init as any).body
          : undefined,
    });

    if (res.status === 204) return null as T;
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const err = new Error(
        typeof data === "string" ? data : data?.message || "Request failed"
      ) as ApiError;
      err.status = res.status;
      throw err;
    }
    return data as T;
  };

  try {
    return await doFetch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.status === 401 && retryOn401) {
      const refreshed = await refreshOnce();
      if (refreshed) {
        return await apiFetch<T>(path, { ...init, retryOn401: false });
      }
    }
    throw e;
  }
}
