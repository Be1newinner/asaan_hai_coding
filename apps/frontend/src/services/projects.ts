import api from './api';
import {
  ProjectCreate,
  ProjectRead,
  ProjectUpdate,
  ProjectDetailCreate,
  ProjectDetailRead,
  ProjectDetailUpdate,
} from '../types/api';

export const projectsService = {
  listProjects: async (skip: number = 0, limit: number = 20) => {
    const response = await api.get<ProjectRead[]>('/api/v1/projects', {
      params: { skip, limit },
    });
    return response.data;
  },

  createProject: async (data: ProjectCreate) => {
    const response = await api.post<ProjectRead>('/api/v1/projects', data);
    return response.data;
  },

  getProject: async (project_id: number) => {
    const response = await api.get<ProjectRead>(`/api/v1/projects/${project_id}`);
    return response.data;
  },

  updateProject: async (project_id: number, data: ProjectUpdate) => {
    const response = await api.put<ProjectRead>(`/api/v1/projects/${project_id}`, data);
    return response.data;
  },

  deleteProject: async (project_id: number) => {
    const response = await api.delete(`/api/v1/projects/${project_id}`);
    return response.data;
  },

  createProjectsBulk: async (data: ProjectCreate[]) => {
    const response = await api.post<ProjectRead[]>('/api/v1/projects/bulk', data);
    return response.data;
  },

  getProjectDetail: async (project_id: number) => {
    const response = await api.get<ProjectDetailRead>(`/api/v1/projects/${project_id}/detail`);
    return response.data;
  },

  createProjectDetail: async (project_id: number, data: ProjectDetailCreate) => {
    const response = await api.post<ProjectDetailRead>(`/api/v1/projects/${project_id}/detail`, data);
    return response.data;
  },

  updateProjectDetail: async (project_id: number, data: ProjectDetailUpdate) => {
    const response = await api.put<ProjectDetailRead>(`/api/v1/projects/${project_id}/detail`, data);
    return response.data;
  },
};