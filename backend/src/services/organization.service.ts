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
    const data = createOrganizationSchema.parse(body);

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existing =
      await organizationRepository.findBySlug(slug);

    if (existing) {
      throw new ApiError(
        HTTPSTATUS.CONFLICT,
        "Organization already exists"
      );
    }

    const ownerId = new Types.ObjectId(userId);

    const organization =
      await organizationRepository.createOrganization({
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

    await userRepository.updateUser(userId, {
      organizationId: organization._id,
      role: UserRole.OWNER,
    });

    return {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
    };
  }

  async getMyOrganization(user: {
    organizationId: string | null;
  }) {
    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }

    const organization =
      await organizationRepository.findById(
        user.organizationId
      );

    if (!organization) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Organization not found"
      );
    }

    return organization;
  }

  async inviteMember(
    organizationId: string,
    body: InviteMemberInput
  ) {
    const data = inviteMemberSchema.parse(body);

    const invitedUser =
      await userRepository.findByEmail(data.email);

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

    const existingMember =
      await organizationRepository.findMember(
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

    await userRepository.updateUser(
      invitedUser._id.toString(),
      {
        organizationId: organizationId as any,
        role: data.role,
      }
    );

    return {
      email: invitedUser.email,
      role: data.role,
      message: "Member invited successfully",
    };
  }

  async getMembers(organizationId: string) {
    const organization =
      await organizationRepository.findById(
        organizationId
      );

    if (!organization) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Organization not found"
      );
    }

    return organization.members;
  }

  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: UserRole
  ) {
    const organization =
      await organizationRepository.updateMemberRole(
        organizationId,
        userId,
        role
      );

    if (!organization) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Member not found"
      );
    }

    await userRepository.updateUser(userId, {
      role,
    });

    return organization;
  }

  async removeMember(
    organizationId: string,
    userId: string
  ) {
    const organization =
      await organizationRepository.removeMember(
        organizationId,
        userId
      );

    if (!organization) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Member not found"
      );
    }

    await userRepository.updateUser(userId, {
  organizationId: null,
});

    return organization;
  }
}

export const organizationService =
  new OrganizationService();