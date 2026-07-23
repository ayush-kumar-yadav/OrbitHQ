import { Organization, IOrganization } from "../models/organization.model";

class OrganizationRepository {
  async createOrganization(
    data: Partial<IOrganization>
  ) {
    return Organization.create(data);
  }

  async findBySlug(slug: string) {
    return Organization.findOne({ slug });
  }

  async findById(id: string) {
    return Organization.findById(id);
  }

  async updateOrganization(
    id: string,
    data: Partial<IOrganization>
  ) {
    return Organization.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  }
}

export const organizationRepository =
  new OrganizationRepository();