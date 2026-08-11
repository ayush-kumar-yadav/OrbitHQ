import { Schema, model, Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  type: string;
  message: string;
  taskId?: Types.ObjectId;
  actorId?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema =
  new Schema<INotification>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },

      type: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      taskId: {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },

      actorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      isRead: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export const Notification =
  model<INotification>(
    "Notification",
    notificationSchema
  );