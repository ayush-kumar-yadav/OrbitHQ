import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../errors/ApiError";
import { HTTPSTATUS } from "../config/http.config";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(
        HTTPSTATUS.UNAUTHORIZED,
        "Access token missing"
      );
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token) as {
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

    req.user = {
  id: user._id.toString(),
  email: user.email,
  role: user.role,
  organizationId: user.organizationId
    ? user.organizationId.toString()
    : null,
  isEmailVerified: user.isEmailVerified,
};

    next();
  } catch (error) {
    next(error);
  }
};