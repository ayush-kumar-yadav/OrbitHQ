import { Schema, model, Types, Document } from "mongoose";

import { ActivityAction } from "../constants/activity";

export interface IActivity extends Document {
  organizationId: Types.ObjectId;
  taskId?: Types.ObjectId;
  actor: Types.ObjectId;

  action: ActivityAction;

  entity: string;

  oldValue?: unknown;
  newValue?: unknown;

  metadata?: Record<string, unknown>;

  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: Object.values(ActivityAction),
      required: true,
    },

    entity: {
      type: String,
      required: true,
    },

    oldValue: {
      type: Schema.Types.Mixed,
    },

    newValue: {
      type: Schema.Types.Mixed,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({
  organizationId: 1,
  createdAt: -1,
});

activitySchema.index({
  taskId: 1,
  createdAt: -1,
});

export const Activity = model<IActivity>(
  "Activity",
  activitySchema
);