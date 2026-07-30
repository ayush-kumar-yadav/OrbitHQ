import { api } from "../api/client";

type CreateOrganizationData = {
  name: string;
};

export const organizationService = {
  async createOrganization(data: CreateOrganizationData) {
    const response = await api.post("/organizations", data);

    return response.data;
  },
};