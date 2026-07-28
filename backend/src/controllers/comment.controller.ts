import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { commentService } from "../services/comment.service";

class CommentController {
  createComment = asyncHandler(
    async (req: Request, res: Response) => {
      const comment = await commentService.createComment(
        req.user.organizationId!,
        req.params.taskId as string,
        req.user.id,
        req.body
      );

      return res.status(201).json(
        successResponse(comment, "Comment created successfully")
      );
    }
  );

  getComments = asyncHandler(
    async (req: Request, res: Response) => {
      const comments = await commentService.getComments(
        req.user.organizationId!,
        req.params.taskId as string
      );

      return res.status(200).json(
        successResponse(comments, "Comments fetched successfully")
      );
    }
  );

  updateComment = asyncHandler(
    async (req: Request, res: Response) => {
      const comment = await commentService.updateComment(
        req.params.id as string,
        req.user.id,
        req.body
      );

      return res.status(200).json(
        successResponse(comment, "Comment updated successfully")
      );
    }
  );

  deleteComment = asyncHandler(
    async (req: Request, res: Response) => {
      await commentService.deleteComment(
        req.params.id as string,
        req.user.id
      );

      return res.status(200).json(
        successResponse(null, "Comment deleted successfully")
      );
    }
  );
}

export const commentController = new CommentController();