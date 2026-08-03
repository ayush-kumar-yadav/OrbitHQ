import { api } from "../api/client";

export const dashboardService = {
  async getDashboard() {
    const response = await api.get("/dashboard");

    return response.data;
  },
};