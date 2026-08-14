import { api } from "../api/client";

export const globalSearchService = {
  async searchProjects(query: string) {
    const response = await api.get("/projects", {
      params: {
        search: query,
        page: 1,
        limit: 5,
      },
    });

    return response.data;
  },

  async searchTasks(query: string) {
    const response = await api.get("/tasks", {
      params: {
        search: query,
        page: 1,
        limit: 5,
      },
    });

    return response.data;
  },

  async searchMembers(query: string) {
    const response = await api.get(
      "/organizations/members"
    );

    const members =
      response.data?.data ?? [];

    return members.filter((member: any) => {
      const name =
        member.user?.name ||
        member.name ||
        "";

      const email =
        member.user?.email ||
        member.email ||
        "";

      return (
        name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        email
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    });
  },
};