import { api } from "../api/client";

type CreateProjectData = {
  name: string;
  description: string;
};

export const projectService = {
  async getProjects() {
    const response = await api.get("/projects");
    return response.data;
  },

  async createProject(data: CreateProjectData) {
    const response = await api.post("/projects", data);
    return response.data;
  },
};