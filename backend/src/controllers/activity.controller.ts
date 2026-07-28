import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { activityService } from "../services/activity.service";

class ActivityController {
  getTaskTimeline = asyncHandler(
    async (req: Request, res: Response) => {
      const activities = await activityService.getTaskTimeline(
        req.user.organizationId!,
        req.params.taskId as string
      );

      return res.status(200).json(
        successResponse(
          activities,
          "Activity timeline fetched successfully"
        )
      );
    }
  );
}

export const activityController = new ActivityController();