import api from "./api";
import {
  BodyLoginApiV1AuthLoginPost,
  BodyResetPasswordApiV1AuthResetPasswordPatch,
  UserRead,
} from "../types/api";

export const authService = {
  login: async (data: BodyLoginApiV1AuthLoginPost) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);
    if (data.grant_type) formData.append("grant_type", data.grant_type);
    if (data.scope) formData.append("scope", data.scope);
    if (data.client_id) formData.append("client_id", data.client_id);
    if (data.client_secret)
      formData.append("client_secret", data.client_secret);

    const response = await api.post("/api/v1/auth/login", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  resetPassword: async (data: BodyResetPasswordApiV1AuthResetPasswordPatch) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);
    if (data.grant_type) formData.append("grant_type", data.grant_type);
    if (data.scope) formData.append("scope", data.scope);
    if (data.client_id) formData.append("client_id", data.client_id);
    if (data.client_secret)
      formData.append("client_secret", data.client_secret);

    const response = await api.patch(
      "/api/v1/auth/reset-password",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  },

  whoAmI: async () => {
    const response = await api.get<UserRead>("/api/v1/auth/me");
    return response.data;
  },
};
