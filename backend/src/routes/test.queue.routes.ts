import { Router } from "express";

import { testQueueController } from "../controllers/test.queue.controller";

const router = Router();

router.post(
  "/test-queue",
  testQueueController
);

export default router;