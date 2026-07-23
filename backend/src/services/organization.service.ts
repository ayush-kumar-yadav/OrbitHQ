import { Types } from "mongoose";
import slugify from "slugify";

import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";

import {
  createOrganizationSchema,
  CreateOrganizationInput,
} from "../validators/organization.validator";

import { organizationRepository } from "../repositories/organization.repository";
import { userRepository } from "../repositories/user.repository";

import { UserRole } from "../models/user.model";

class OrganizationService {
  async createOrganization(
    userId: string,
    body: CreateOrganizationInput
  ) {
    // 1. Validate request
    const data = createOrganizationSchema.parse(body);

    // 2. Generate slug
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // 3. Check if organization already exists
    const existing = await organizationRepository.findBySlug(slug);

    if (existing) {
      throw new ApiError(
        HTTPSTATUS.CONFLICT,
        "Organization already exists"
      );
    }

    // 4. Convert userId (string) -> ObjectId
    const ownerId = new Types.ObjectId(userId);

    // 5. Create organization
    const organization = await organizationRepository.createOrganization({
      name: data.name,
      slug,
      owner: ownerId,
      members: [
        {
          user: ownerId,
          role: UserRole.OWNER,
        },
      ],
    });

    // 6. Update user with organization and role
    await userRepository.updateUser(userId, {
      organizationId: organization._id,
      role: UserRole.OWNER,
    });

    // 7. Return safe response
    return {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    };
  }
}

export const organizationService = new OrganizationService();