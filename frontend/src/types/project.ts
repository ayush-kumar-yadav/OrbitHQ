export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: string;

  organizationId: string;

  createdAt: string;
  updatedAt: string;
}