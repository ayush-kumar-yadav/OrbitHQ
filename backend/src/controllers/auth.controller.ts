import { Request, Response, NextFunction } from "express";

import { authService } from "../services/auth.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

class AuthController {
  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await authService.register(req.body);

      return res.status(201).json(
        successResponse(
          user,
          "User registered successfully"
        )
      );
    }
  );
  refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const data = await authService.refresh(refreshToken);

  return res.status(200).json(
    successResponse(
      data,
      "Token refreshed successfully"
    )
  );
});
logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  return res.status(200).json(
    successResponse(
      null,
      "Logged out successfully"
    )
  );
});

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await authService.login(req.body);

      return res.status(200).json(
        successResponse(
          data,
          "Login successful"
        )
      );
    }
  );
  me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return res.status(200).json(
    successResponse(
      user,
      "User profile fetched successfully"
    )
  );
});
}

export const authController = new AuthController();