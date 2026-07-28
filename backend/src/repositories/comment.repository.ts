import { FilterQuery, Types } from "mongoose";

import { Comment, IComment } from "../models/comment.model";

class CommentRepository {
  async createComment(data: Partial<IComment>) {
    return Comment.create(data);
  }

  async findById(id: string) {
    return Comment.findOne({
      _id: id,
      deletedAt: null,
    })
      .populate("author", "name email")
      .lean();
  }

  async findComments(
    filter: FilterQuery<IComment>
  ) {
    return Comment.find(filter)
      .populate("author", "name email")
      .sort({
        createdAt: 1,
      })
      .lean();
  }

  async updateComment(
    id: string,
    data: Partial<IComment>
  ) {
    return Comment.findByIdAndUpdate(
      id,
      {
        ...data,
        editedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  async softDeleteComment(
    id: string
  ) {
    return Comment.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  async isCommentOwner(
    commentId: string,
    userId: string
  ) {
    return Comment.exists({
      _id: commentId,
      author: new Types.ObjectId(userId),
      deletedAt: null,
    });
  }
}

export const commentRepository =
  new CommentRepository();