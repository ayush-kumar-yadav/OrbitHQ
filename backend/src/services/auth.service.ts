import bcrypt from "bcrypt";
import { verifyRefreshToken } from "../utils/jwt";
import {
  registerSchema,
  RegisterInput,
  loginSchema,
  LoginInput,
} from "../validators/auth.validator";

import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../errors/ApiError";
import { HTTPSTATUS } from "../config/http.config";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

class AuthService {
  async register(data: RegisterInput) {
    const validatedData = registerSchema.parse(data);

    const existingUser = await userRepository.findByEmail(
      validatedData.email
    );

    if (existingUser) {
      throw new ApiError(
        HTTPSTATUS.CONFLICT,
        "Email is already registered"
      );
    }

    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      10
    );

    const user = await userRepository.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }

  async login(data: LoginInput) {
    const validatedData = loginSchema.parse(data);

    const user = await userRepository.findByEmail(
      validatedData.email
    );

    if (!user) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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

  const payload = verifyRefreshToken(refreshToken) as {
    id: string;
    email: string;
    role: string;
  };

  const user = await userRepository.findById(payload.id);

  if (!user) {
    throw new ApiError(
      HTTPSTATUS.UNAUTHORIZED,
      "User not found"
    );
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(
      HTTPSTATUS.UNAUTHORIZED,
      "Invalid refresh token"
    );
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

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
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(
      HTTPSTATUS.NOT_FOUND,
      "User not found"
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}
async logout(userId: string) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(
      HTTPSTATUS.NOT_FOUND,
      "User not found"
    );
  }

  await userRepository.updateRefreshToken(userId, null);

  return {
    message: "Logged out successfully",
  };
}
}

export const authService = new AuthService();