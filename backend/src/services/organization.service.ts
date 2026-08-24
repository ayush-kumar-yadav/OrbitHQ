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

import { cacheService } from "../cache/cache.service";
import { cacheKeys } from "../cache/cache.keys";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

class OrganizationService {
  async createOrganization(
    userId: string,
    body: CreateOrganizationInput
  ) {
    const data =
      createOrganizationSchema.parse(body);

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existing =
      await organizationRepository.findBySlug(
        slug
      );

    if (existing) {
      throw new ApiError(
        HTTPSTATUS.CONFLICT,
        "Organization already exists"
      );
    }

    const ownerId =
      new Types.ObjectId(userId);

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

    const updatedUser =
      await userRepository.updateUser(
        userId,
        {
          organizationId:
            organization._id,
          role: UserRole.OWNER,
        }
      );

    if (!updatedUser) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "User not found"
      );
    }

    // The access/refresh tokens issued at login carry organizationId
    // and role baked directly into the payload — they aren't looked
    // up fresh per request. Without reissuing them here, the user's
    // existing token would keep claiming organizationId: null even
    // though the database now has the real one, and every org-scoped
    // request (dashboard, tasks, notifications...) would keep 400ing
    // until the old token happened to expire (15 minutes).
    const accessToken =
      generateAccessToken(updatedUser);

    const refreshToken =
      generateRefreshToken(updatedUser);

    await userRepository.updateRefreshToken(
      userId,
      refreshToken
    );

    return {
      id: organization._id.toString(),
      name: organization.name,
      slug: organization.slug,
      accessToken,
      refreshToken,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        organizationId: organization._id.toString(),
      },
    };
  }

  // =========================================================
  // GET MY ORGANIZATION
  // =========================================================

  async getMyOrganization(user: {
    organizationId: string | null;
  }) {
    if (!user.organizationId) {
      throw new ApiError(
        HTTPSTATUS.BAD_REQUEST,
        "User does not belong to an organization"
      );
    }

    const organizationId =
      user.organizationId;

    const cacheKey =
      cacheKeys.organization(
        organizationId
      );

    // -------------------------------------------------------
    // Redis
    // -------------------------------------------------------

    const cachedOrganization =
      await cacheService.get(
        cacheKey
      );

    if (cachedOrganization) {
      return cachedOrganization;
    }

    // -------------------------------------------------------
    // MongoDB
    // -------------------------------------------------------

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

    // -------------------------------------------------------
    // Redis
    // Organization TTL = 10 minutes
    // -------------------------------------------------------

    await cacheService.set(
      cacheKey,
      organization,
      600
    );

    return organization;
  }

  // =========================================================
  // INVITE MEMBER
  // =========================================================

  async inviteMember(
    organizationId: string,
    body: InviteMemberInput
  ) {
    const data =
      inviteMemberSchema.parse(body);

    const invitedUser =
      await userRepository.findByEmail(
        data.email
      );

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
        organizationId:
          organizationId as any,
        role: data.role,
      }
    );

    // Organization changed → invalidate cache
    await cacheService.del(
      cacheKeys.organization(
        organizationId
      )
    );

    // User changed → invalidate user cache
    await cacheService.del(
      cacheKeys.user(
        invitedUser._id.toString()
      )
    );

    return {
      email: invitedUser.email,
      role: data.role,
      message:
        "Member invited successfully",
    };
  }

  // =========================================================
  // GET MEMBERS
  // =========================================================

  async getMembers(
    organizationId: string
  ) {
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

  // =========================================================
  // UPDATE MEMBER ROLE
  // =========================================================

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

    await userRepository.updateUser(
      userId,
      {
        role,
      }
    );

    // Organization cache
    await cacheService.del(
      cacheKeys.organization(
        organizationId
      )
    );

    // User cache
    await cacheService.del(
      cacheKeys.user(userId)
    );

    return organization;
  }

  // =========================================================
  // REMOVE MEMBER
  // =========================================================

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

    await userRepository.updateUser(
      userId,
      {
        organizationId: null,
      }
    );

    // Organization cache
    await cacheService.del(
      cacheKeys.organization(
        organizationId
      )
    );

    // User cache
    await cacheService.del(
      cacheKeys.user(userId)
    );

    // Dashboard is affected by membership
    await cacheService.del(
      cacheKeys.dashboard(
        organizationId
      )
    );

    return organization;
  }
}

export const organizationService =
  new OrganizationService();