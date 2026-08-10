import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { queueService } from "../services/queue.service";

export const testQueueController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const job =
        await queueService.addNotificationJob({
          userId: "test-user",
          type: "TEST_NOTIFICATION",
          message:
            "Hello from OrbitHQ background worker!",
        });

      return res.status(202).json({
        success: true,
        message: "Job added to queue",
        data: {
          jobId: job.id,
        },
      });
    }
  );