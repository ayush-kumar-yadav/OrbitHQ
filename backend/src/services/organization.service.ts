import { Types } from "mongoose";
import slugify from "slugify";

import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";

import {
  createOrganizationSchema,
  CreateOrganizationInput,
  inviteMemberSchema,
  InviteMemberInput,
} from "../validators/organization.validator";

import { organizationRepository } from "../repositories/organization.repository";
import { userRepository } from "../repositories/user.repository";

import { UserRole } from "../constants/roles";

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

    // 4. Convert userId -> ObjectId
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

    // 6. Update user
    await userRepository.updateUser(userId, {
      organizationId: organization._id,
      role: UserRole.OWNER,
    });

    // 7. Return response
    return {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    };
  }

  async inviteMember(
    organizationId: string,
    body: InviteMemberInput
  ) {
    const data = inviteMemberSchema.parse(body);

    const invitedUser = await userRepository.findByEmail(data.email);

    if (!invitedUser) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "User not found"
      );
    }

    if (invitedUser.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User already belongs to an organization"
      );
    }

    const existingMember = await organizationRepository.findMember(
      organizationId,
      invitedUser._id.toString()
    );

    if (existingMember) {
      throw new ApiError(
        HTTPSTATUS.CONFLICT,
        "User is already a member"
      );
    }

    await organizationRepository.addMember(
      organizationId,
      invitedUser._id.toString(),
      data.role
    );

    await userRepository.updateUser(invitedUser._id.toString(), {
      organizationId: organizationId as any,
      role: data.role,
    });

    return {
      email: invitedUser.email,
      role: data.role,
      message: "Member invited successfully",
    };
  }
}

export const organizationService = new OrganizationService();