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
    const data = createCommentSchema.parse(body);

const task = await taskRepository.findTaskById(taskId);
    if (!task) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Task not found."
      );
    }

    const mentions = this.extractMentions(data.content);

    const comment =
      await commentRepository.createComment({
        organizationId: new Types.ObjectId(organizationId),

        taskId: new Types.ObjectId(taskId),

        author: new Types.ObjectId(authorId),

        content: data.content,

        mentions,
      });

    await activityService.log({
      organizationId,
      actor: authorId,
      taskId,
      entity: "COMMENT",
      action: ActivityAction.COMMENT_ADDED,
      newValue: data.content,
    });

    return comment;
  }

  async getComments(
    organizationId: string,
    taskId: string
  ) {
    return commentRepository.findComments({
      organizationId: new Types.ObjectId(organizationId),

      taskId: new Types.ObjectId(taskId),

      deletedAt: null,
    });
  }

  async updateComment(
    commentId: string,
    authorId: string,
    body: UpdateCommentInput
  ) {
    const data = updateCommentSchema.parse(body);

    const comment =
      await commentRepository.findById(commentId);

    if (!comment) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Comment not found."
      );
    }

    if (
      String(comment.author._id) !== authorId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "You can only edit your own comments."
      );
    }

    const mentions = this.extractMentions(data.content);

    const updated =
      await commentRepository.updateComment(
        commentId,
        {
          content: data.content,
          mentions,
        }
      );

    await activityService.log({
      organizationId: String(comment.organizationId),
      actor: authorId,
      taskId: String(comment.taskId),
      entity: "COMMENT",
      action: ActivityAction.COMMENT_UPDATED,
      oldValue: comment.content,
      newValue: data.content,
    });

    return updated;
  }

  async deleteComment(
    commentId: string,
    authorId: string
  ) {
    const comment =
      await commentRepository.findById(commentId);

    if (!comment) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Comment not found."
      );
    }

    if (
      String(comment.author._id) !== authorId
    ) {
      throw new ApiError(
        HTTPSTATUS.FORBIDDEN,
        "You can only delete your own comments."
      );
    }

    const deleted =
      await commentRepository.softDeleteComment(
        commentId
      );

    await activityService.log({
      organizationId: String(comment.organizationId),
      actor: authorId,
      taskId: String(comment.taskId),
      entity: "COMMENT",
      action: ActivityAction.COMMENT_DELETED,
      oldValue: comment.content,
    });

    return deleted;
  }
}

export const commentService =
  new CommentService();