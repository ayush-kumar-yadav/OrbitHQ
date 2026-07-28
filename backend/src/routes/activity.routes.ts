import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { activityController } from "../controllers/activity.controller";

const router = Router();

router.get(
  "/tasks/:taskId/activity",
  authenticate,
  activityController.getTaskTimeline
);

export default router;