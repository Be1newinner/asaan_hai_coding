// Auth API Service with test/production mode
import { isTestMode } from "../config";
import { apiClient } from "../client";
import type { TokenOut, UserRead } from "../types";

// Test user data
const testUser: UserRead = {
  id: "1",
  email: "admin@example.com",
  username: "admin",
  is_active: true,
  is_superuser: true,
  is_verified: true,
  created_at: "2024-01-01T10:00:00Z",
  updated_at: "2024-03-15T14:30:00Z",
};

export const authService = {
  async login(email: string, password: string): Promise<TokenOut> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (email && password) {
        const token: TokenOut = {
          access_token: "test_access_token_" + Date.now(),
          refresh_token: "test_refresh_token_" + Date.now(),
          token_type: "bearer",
        };
        apiClient.setAccessToken(token.access_token);
        if (typeof window !== "undefined") {
          localStorage.setItem("refresh_token", token.refresh_token);
        }
        return token;
      }
      throw new Error("Invalid credentials");
    }
    const token = await apiClient.login(email, password);
    apiClient.setAccessToken(token.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", token.refresh_token);
    }
    return token;
  },

  async getMe(): Promise<UserRead> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const token = apiClient.getAccessToken();
      if (!token) throw new Error("Not authenticated");
      return testUser;
    }
    return apiClient.fetch<UserRead>("/api/v1/auth/me");
  },

  async resetPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      // Always succeed
      return;
    }
    const formData = new URLSearchParams();
    formData.append("current_password", currentPassword);
    formData.append("new_password", newPassword);

    await fetch("/api/v1/auth/reset-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${apiClient.getAccessToken()}`,
      },
      body: formData,
    });
  },

  logout() {
    apiClient.logout();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken();
  },
};
