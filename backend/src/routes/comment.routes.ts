import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { commentController } from "../controllers/comment.controller";

const router = Router();

// Task Comments
router.post(
  "/tasks/:taskId/comments",
  authenticate,
  commentController.createComment
);

router.get(
  "/tasks/:taskId/comments",
  authenticate,
  commentController.getComments
);

// Individual Comment
router.put(
  "/comments/:id",
  authenticate,
  commentController.updateComment
);

router.delete(
  "/comments/:id",
  authenticate,
  commentController.deleteComment
);

export default router;