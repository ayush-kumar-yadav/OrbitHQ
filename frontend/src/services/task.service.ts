import { api } from "../api/client";

export const taskService = {
  async getTasks(projectId?: string) {
  const response = await api.get("/tasks", {
    params: projectId
      ? { projectId }
      : {},
  });

  return response.data;
},

  async getTaskById(id: string) {
    const response = await api.get(`/tasks/${id}`);

    return response.data;
  },

  async createTask(data: {
    title: string;
    description?: string;
    projectId: string;
  }) {
    const response = await api.post("/tasks", data);

    return response.data;
  },
  async updateTaskStatus(
  taskId: string,
  status: string
) {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    {
      status,
    }
  );
  

  return response.data;
},
async updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assignee?: string;
  }
) {
  const response = await api.put(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
},

async assignTask(taskId: string, assignee: string) {
  const response = await api.patch(
    `/tasks/${taskId}/assign`,
    { assignee }
  );

  return response.data;
},

async deleteTask(taskId: string) {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
},

};