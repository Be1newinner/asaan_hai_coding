import { getApiUrl } from "./config";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth = false, headers = {}, ...rest } = options;

    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (!skipAuth) {
      const token = this.getAccessToken();
      if (token) {
        (requestHeaders as Record<string, string>)["Authorization"] =
          `Bearer ${token}`;
      }
    }

    const response = await fetch(getApiUrl(path), {
      ...rest,
      headers: requestHeaders,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "An error occurred" }));
      throw new Error(
        typeof error.detail === "string" ? error.detail : "Request failed"
      );
    }

    // if 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // Authentications
  async login(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(getApiUrl("/api/v1/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Login failed" }));
      throw new Error(
        typeof error.detail === "string" ? error.detail : "Login failed"
      );
    }

    return response.json();
  }

  logout() {
    this.setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token");
    }
  }
}

export const apiClient = new ApiClient();
