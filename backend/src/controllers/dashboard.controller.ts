import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { dashboardService } from "../services/dashboard.service";

class DashboardController {
  getDashboard = asyncHandler(
    async (req: Request, res: Response) => {
      const dashboard =
        await dashboardService.getDashboard(
          req.user.organizationId!
        );

      return res.status(200).json(
        successResponse(
          dashboard,
          "Dashboard fetched successfully"
        )
      );
    }
  );
}

export const dashboardController =
  new DashboardController();