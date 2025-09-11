import api from "./api";
import { UserCreate, UserUpdate, UserRead, ListResponse } from "../types/api";

export const usersService = {
  updateUser: async (user_id: number, data: UserUpdate) => {
    const response = await api.put<UserRead>(`/api/v1/users/${user_id}`, data);
    return response.data;
  },

  getUser: async (user_id: number) => {
    const response = await api.get<UserRead>(`/api/v1/users/${user_id}`);
    return response.data;
  },

  deleteUser: async (user_id: number) => {
    const response = await api.delete(`/api/v1/users/${user_id}`);
    return response.data;
  },

  listUsers: async (skip: number = 0, limit: number = 50) => {
    const response = await api.get<ListResponse<UserRead[]>>("/api/v1/users", {
      params: { skip, limit },
    });
    return response.data;
  },

  createUserBulk: async (data: UserCreate[]) => {
    const response = await api.post<UserRead[]>("/api/v1/users", data);
    return response.data;
  },
};
