import api from "./api";
import {
  CourseCreate,
  CourseRead,
  CourseReadBase,
  CourseUpdate,
  ListResponse,
} from "../types/api";

export const coursesService = {
  listCourses: async (skip: number = 0, limit: number = 20) => {
    const response = await api.get<ListResponse<CourseReadBase[]>>(
      "/api/v1/courses",
      {
        params: { skip, limit },
      }
    );
    return response.data;
  },

  createCourse: async (data: CourseCreate) => {
    const response = await api.post<CourseRead>("/api/v1/courses", data);
    return response.data;
  },

  getCourse: async (course_id: string) => {
    const response = await api.get<CourseRead>(`/api/v1/courses/${course_id}`);
    return response.data;
  },

  updateCourse: async (course_id: string, data: CourseUpdate) => {
    const response = await api.put<CourseRead>(
      `/api/v1/courses/${course_id}`,
      data
    );
    return response.data;
  },

  deleteCourse: async (course_id: string) => {
    const response = await api.delete(`/api/v1/courses/${course_id}`);
    return response.data;
  },

  createCoursesBulk: async (data: CourseCreate[]) => {
    const response = await api.post<CourseReadBase[]>(
      "/api/v1/courses/bulk",
      data
    );
    return response.data;
  },
};
