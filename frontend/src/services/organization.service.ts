import { api } from "../api/client";

export const organizationService = {
  async createOrganization(data: {
    name: string;
  }) {
    const response = await api.post(
      "/organizations",
      data
    );

    return response.data;
  },

  async getMyOrganization() {
    const response = await api.get(
      "/organizations/me"
    );

    return response.data;
  },

  async getMembers() {
    const response = await api.get(
      "/organizations/members"
    );

    return response.data;
  },

  async inviteMember(data: {
    email: string;
    role: string;
  }) {
    const response = await api.post(
      "/organizations/invite",
      data
    );

    return response.data;
  },
};