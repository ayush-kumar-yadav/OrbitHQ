import { Request, Response, NextFunction } from "express";

import { ApiError } from "../errors/ApiError";
import { HTTPSTATUS } from "../config/http.config";
import { UserRole } from "../constants/roles";

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new ApiError(
          HTTPSTATUS.UNAUTHORIZED,
          "Authentication required"
        )
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTPSTATUS.FORBIDDEN,
          "You do not have permission to perform this action."
        )
      );
    }

    next();
  };