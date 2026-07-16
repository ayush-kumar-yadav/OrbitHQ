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
}

export const authController = new AuthController();