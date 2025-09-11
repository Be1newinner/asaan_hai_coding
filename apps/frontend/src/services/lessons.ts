import api from "./api";
import {
  LessonCreate,
  LessonRead,
  LessonUpdate,
  ListResponse,
} from "../types/api";

export const lessonsService = {
  listLessons: async (section_id: number) => {
    const response = await api.get<ListResponse<LessonRead[]>>(
      "/api/v1/lessons",
      {
        params: { section_id },
      }
    );
    return response.data;
  },

  createLesson: async (data: LessonCreate) => {
    const response = await api.post<LessonRead>("/api/v1/lessons", data);
    return response.data;
  },

  getLesson: async (lesson_id: number) => {
    const response = await api.get<LessonRead>(`/api/v1/lessons/${lesson_id}`);
    return response.data;
  },

  updateLesson: async (lesson_id: number, data: LessonUpdate) => {
    const response = await api.put<LessonRead>(
      `/api/v1/lessons/${lesson_id}`,
      data
    );
    return response.data;
  },

  deleteLesson: async (lesson_id: number) => {
    const response = await api.delete(`/api/v1/lessons/${lesson_id}`);
    return response.data;
  },

  createLessonsBulk: async (data: LessonCreate[]) => {
    const response = await api.post<LessonRead[]>("/api/v1/lessons/bulk", data);
    return response.data;
  },
};
