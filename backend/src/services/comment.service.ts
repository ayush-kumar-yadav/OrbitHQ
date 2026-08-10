import { Types } from "mongoose";

import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";

import {
  createCommentSchema,
  updateCommentSchema,
  CreateCommentInput,
  UpdateCommentInput,
} from "../validators/comment.validator";

import { commentRepository } from "../repositories/comment.repository";
import { taskRepository } from "../repositories/task.repository";

import { activityService } from "./activity.service";
import { queueService } from "./queue.service";

import { ActivityAction } from "../constants/activity";


class CommentService {
  private extractMentions(content: string): string[] {
    const regex = /@(\w+)/g;

    const mentions: string[] = [];

    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return [...new Set(mentions)];
  }

  async createComment(
    organizationId: string,
    taskId: string,
    authorId: string,
    body: CreateCommentInput
  ) {
    // 1. Validate request
    const data = createCommentSchema.parse(body);

    // 2. Verify task exists
    const task =
      await taskRepository.findTaskById(taskId);

    if (!task) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Task not found."
      );
    }

    // 3. Extract @mentions
    const mentions =
      this.extractMentions(data.content);

    // 4. Create comment
    const comment =
      await commentRepository.createComment({
        organizationId:
          new Types.ObjectId(organizationId),

        taskId:
          new Types.ObjectId(taskId),

        author:
          new Types.ObjectId(authorId),

        content: data.content,

        mentions,
      });

    // 5. Create activity log
    await activityService.log({
      organizationId,
      actor: authorId,
      taskId,
      entity: "COMMENT",
      action: ActivityAction.COMMENT_ADDED,
      newValue: data.content,
      metadata: {
        commentId: comment._id.toString(),
        mentions,
      },
    });

    // 6. Queue notification for task assignee
    if (task.assignee) {
      await queueService.addNotificationJob({
        userId: task.assignee.toString(),
        type: "COMMENT_ADDED",
        message: `A new comment was added to task ${taskId}`,
        taskId,
        actorId: authorId,
      });
    }

    // 7. Return created comment
    return comment;
  }

  async getComments(
    organizationId: string,
    taskId: string
  ) {
    return commentRepository.findComments({
      organizationId:
        new Types.ObjectId(organizationId),

      taskId:
        new Types.ObjectId(taskId),

      deletedAt: null,
    });
  }

  async updateComment(
    commentId: string,
    authorId: string,
    body: UpdateCommentInput
  ) {
    // 1. Validate
    const data =
      updateCommentSchema.parse(body);

    // 2. Find comment
    const comment =
      await commentRepository.findById(commentId);

    if (!comment) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Comment not found."
      );
    }

    // 3. Only author can edit
    if (
      String(comment.author._id) !== authorId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "You can only edit your own comments."
      );
    }

    // 4. Extract updated mentions
    const mentions =
      this.extractMentions(data.content);

    // 5. Update comment
    const updated =
      await commentRepository.updateComment(
        commentId,
        {
          content: data.content,
          mentions,
        }
      );

    // 6. Activity log
    await activityService.log({
      organizationId:
        String(comment.organizationId),

      actor: authorId,

      taskId:
        String(comment.taskId),

      entity: "COMMENT",

      action:
        ActivityAction.COMMENT_UPDATED,

      oldValue: comment.content,

      newValue: data.content,

      metadata: {
        commentId,
        mentions,
      },
    });

    return updated;
  }

  async deleteComment(
    commentId: string,
    authorId: string
  ) {
    // 1. Find comment
    const comment =
      await commentRepository.findById(
        commentId
      );

    if (!comment) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Comment not found."
      );
    }

    // 2. Only author can delete
    if (
      String(comment.author._id) !== authorId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "You can only delete your own comments."
      );
    }

    // 3. Soft delete
    const deleted =
      await commentRepository.softDeleteComment(
        commentId
      );

    // 4. Activity log
    await activityService.log({
      organizationId:
        String(comment.organizationId),

      actor: authorId,

      taskId:
        String(comment.taskId),

      entity: "COMMENT",

      action:
        ActivityAction.COMMENT_DELETED,

      oldValue: comment.content,

      metadata: {
        commentId,
      },
    });

    return deleted;
  }
}

export const commentService =
  new CommentService();