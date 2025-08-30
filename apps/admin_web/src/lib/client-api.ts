export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = text ? JSON.parse(text) : null;
      message =
        (data && (data.message || data.detail)) ||
        `${res.status} ${res.statusText}`;
    } catch {
      message = text || `${res.status} ${res.statusText}`;
    }
    throw new Error(message);
  }
  try {
    return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
  } catch {
    return text as unknown as T;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function api<T = any>(
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init?: { method?: HttpMethod; body?: any; headers?: Record<string, string> }
): Promise<T> {
  const { method = "GET", body, headers = {} } = init || {};
  const res = await fetch(`/api/proxy${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handle<T>(res);
}
