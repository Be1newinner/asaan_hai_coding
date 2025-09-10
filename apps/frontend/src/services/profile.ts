import api from "./api";
import { ProfileResponseInterface } from "../types/api";

export const profileService = {
  getProfile: async () => {
    const response =
      await api.get<ProfileResponseInterface>(`/api/v1/profile/1`);
    return response.data;
  },
};
