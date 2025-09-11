import api from "./api";
import {
  SectionRead,
  SectionCreate,
  SectionReadBase,
  SectionUpdate,
  ListResponse,
} from "../types/api";

export const sectionsService = {
  listSections: async (course_id: string) => {
    const response = await api.get<ListResponse<SectionReadBase[]>>(
      "/api/v1/sections",
      {
        params: { course_id },
      }
    );
    return response.data;
  },

  createSection: async (data: SectionCreate) => {
    const response = await api.post<SectionRead>("/api/v1/sections", data);
    return response.data;
  },

  getSection: async (section_id: number) => {
    const response = await api.get<SectionRead>(
      `/api/v1/sections/${section_id}`
    );
    return response.data;
  },

  updateSection: async (section_id: number, data: SectionUpdate) => {
    const response = await api.put<SectionRead>(
      `/api/v1/sections/${section_id}`,
      data
    );
    return response.data;
  },

  deleteSection: async (section_id: number) => {
    const response = await api.delete(`/api/v1/sections/${section_id}`);
    return response.data;
  },

  createSectionsBulk: async (data: SectionCreate[]) => {
    const response = await api.post<SectionRead[]>(
      "/api/v1/sections/bulk",
      data
    );
    return response.data;
  },
};
