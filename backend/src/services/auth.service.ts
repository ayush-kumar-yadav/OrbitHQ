import bcrypt from "bcrypt";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

import {
  registerSchema,
  RegisterInput,
  loginSchema,
  LoginInput,
} from "../validators/auth.validator";

import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../errors/ApiError";
import { HTTPSTATUS } from "../config/http.config";

import { cacheService } from "../cache/cache.service";
import { cacheKeys } from "../cache/cache.keys";

class AuthService {
  async register(data: RegisterInput) {
    const validatedData =
      registerSchema.parse(data);

    const existingUser =
      await userRepository.findByEmail(
        validatedData.email
      );

    if (existingUser) {
      throw new ApiError(
        HTTPSTATUS.CONFLICT,
        "Email is already registered"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        validatedData.password,
        10
      );

    const user =
      await userRepository.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified:
        user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }

  async login(data: LoginInput) {
    const validatedData =
      loginSchema.parse(data);

    const user =
      await userRepository.findByEmail(
        validatedData.email
      );

    if (!user) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        validatedData.password,
        user.password
      );

    if (!isPasswordValid) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    await userRepository.updateRefreshToken(
      user.id,
      refreshToken
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId:
          user.organizationId
            ? user.organizationId.toString()
            : null,
      },
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Refresh token is required"
      );
    }

    const payload =
      verifyRefreshToken(
        refreshToken
      ) as {
        id: string;
        email: string;
        role: string;
      };

    const user =
      await userRepository.findById(
        payload.id
      );

    if (!user) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "User not found"
      );
    }

    if (
      user.refreshToken !==
      refreshToken
    ) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Invalid refresh token"
      );
    }

    const newAccessToken =
      generateAccessToken(user);

    const newRefreshToken =
      generateRefreshToken(user);

    await userRepository.updateRefreshToken(
      user.id,
      newRefreshToken
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const cacheKey =
      cacheKeys.user(userId);

    // -----------------------------
    // 1. Check Redis
    // -----------------------------

    const cachedUser =
      await cacheService.get<{
        id: string;
        name: string;
        email: string;
        role: string;
        organizationId: string | null;
        isEmailVerified: boolean;
        createdAt: Date;
      }>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    // -----------------------------
    // 2. Cache MISS → MongoDB
    // -----------------------------

    const user =
      await userRepository.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "User not found"
      );
    }

    // -----------------------------
    // 3. Prepare response
    // -----------------------------

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId:
        user.organizationId
          ? user.organizationId.toString()
          : null,
      isEmailVerified:
        user.isEmailVerified,
      createdAt: user.createdAt,
    };

    // -----------------------------
    // 4. Save in Redis
    // -----------------------------

    await cacheService.set(
      cacheKey,
      userData,
      600
    );

    return userData;
  }

  async logout(userId: string) {
    const user =
      await userRepository.findById(
        userId
      );

    if (!user) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "User not found"
      );
    }

    await userRepository.updateRefreshToken(
      userId,
      null
    );

    // Remove cached user
    await cacheService.del(
      cacheKeys.user(userId)
    );

    return {
      message:
        "Logged out successfully",
    };
  }
}

export const authService =
  new AuthService();