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
  async updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  const response = await api.put(
    `/projects/${projectId}`,
    data
  );

  return response.data;
},
async archiveProject(projectId: string) {
  const response = await api.patch(
    `/projects/${projectId}/archive`
  );

  return response.data;
},
async deleteProject(projectId: string) {
  const response = await api.delete(
    `/projects/${projectId}`
  );

  return response.data;
},

  async createProject(data: CreateProjectData) {
    const response = await api.post("/projects", data);
    return response.data;
  },
  async getProjectById(id: string) {
  const response = await api.get(`/projects/${id}`);

  return response.data;
}
};