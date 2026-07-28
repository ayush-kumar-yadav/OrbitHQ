import { Schema, model, Types, Document } from "mongoose";

export interface IComment extends Document {
  organizationId: Types.ObjectId;
  taskId: Types.ObjectId;
  author: Types.ObjectId;

  content: string;
  mentions: string[];

  editedAt?: Date;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    mentions: {
      type: [String],
      default: [],
    },

    editedAt: Date,

    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

commentSchema.index({
  organizationId: 1,
  taskId: 1,
});

export const Comment = model<IComment>(
  "Comment",
  commentSchema
);