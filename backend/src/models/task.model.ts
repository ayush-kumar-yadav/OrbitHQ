import { Document, Schema, Types, model } from "mongoose";

import { TaskPriority, TaskStatus } from "../constants/task";
export interface ITask extends Document {
  title: string;
  description?: string;

  projectId: Types.ObjectId;
  organizationId: Types.ObjectId;

  assignee?: Types.ObjectId;
  reporter: Types.ObjectId;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: Date;

  tags: string[];

  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },

    dueDate: {
      type: Date,
    },

    tags: {
      type: [String],
      default: [],
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
taskSchema.index({ organizationId: 1, deletedAt: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ reporter: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

export const Task = model<ITask>("Task", taskSchema);