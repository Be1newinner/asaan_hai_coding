// Projects API Service with test/production mode
import { isTestMode } from "../config";
import { apiClient } from "../client";
import { dummyProjects, generateId } from "../dummy-data";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  PaginatedResponse,
} from "../types";

// In-memory store for test mode
let testProjects = [...dummyProjects];

export const projectsService = {
  async list(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Project>> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...testProjects];
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((p) => p.status === params.status);
      }
      const skip = params?.skip || 0;
      const limit = params?.limit || 100;
      return {
        items: filtered.slice(skip, skip + limit),
        total: filtered.length,
        skip,
        limit,
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.set("skip", params.skip.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.status) queryParams.set("status", params.status);

    return apiClient.fetch<PaginatedResponse<Project>>(
      `/api/v1/projects?${queryParams}`
    );
  },

  async get(id: string): Promise<Project> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const project = testProjects.find((p) => p.id === id);
      if (!project) throw new Error("Project not found");
      return project;
    }
    return apiClient.fetch<Project>(`/api/v1/projects/${id}`);
  },

  async create(data: ProjectCreate): Promise<Project> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newProject: Project = {
        id: generateId(),
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        thumbnail: data.thumbnail || null,
        status: data.status || "draft",
        tags: data.tags || [],
        visits: 0,
        leads_count: 0,
        conversion_rate: 0,
        owner_id: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      testProjects.unshift(newProject);
      return newProject;
    }
    return apiClient.fetch<Project>("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: ProjectUpdate): Promise<Project> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = testProjects.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Project not found");
      testProjects[index] = {
        ...testProjects[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return testProjects[index];
    }
    return apiClient.fetch<Project>(`/api/v1/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = testProjects.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Project not found");
      testProjects.splice(index, 1);
      return;
    }
    return apiClient.fetch<void>(`/api/v1/projects/${id}`, {
      method: "DELETE",
    });
  },

  resetTestData() {
    testProjects = [...dummyProjects];
  },
};
