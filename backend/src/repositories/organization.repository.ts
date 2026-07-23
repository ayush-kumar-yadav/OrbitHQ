import { Organization, IOrganization } from "../models/organization.model";
import { UserRole } from "../constants/roles";

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
  async findMember(
  organizationId: string,
  userId: string
) {
  return Organization.findOne({
    _id: organizationId,
    "members.user": userId,
  });
}

async addMember(
  organizationId: string,
  userId: string,
  role: UserRole
) {
  return Organization.findByIdAndUpdate(
    organizationId,
    {
      $push: {
        members: {
          user: userId,
          role,
        },
      },
    },
    {
      new: true,
    }
  );
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