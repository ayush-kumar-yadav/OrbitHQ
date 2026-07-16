import bcrypt from "bcrypt";

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
}

export const authService = new AuthService();