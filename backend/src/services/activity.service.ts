import { Types } from "mongoose";

import { ActivityAction } from "../constants/activity";
import { activityRepository } from "../repositories/activity.repository";

class ActivityService {
  async log(input: {
    organizationId: string;
    actor: string;

    action: ActivityAction;

    entity: string;

    taskId?: string;

    oldValue?: unknown;
    newValue?: unknown;

    metadata?: Record<string, unknown>;
  }) {
    return activityRepository.createActivity({
      organizationId: new Types.ObjectId(
        input.organizationId
      ),

      taskId: input.taskId
        ? new Types.ObjectId(input.taskId)
        : undefined,

      actor: new Types.ObjectId(input.actor),

      action: input.action,

      entity: input.entity,

      oldValue: input.oldValue,

      newValue: input.newValue,

      metadata: input.metadata ?? {},
    });
  }

  async getTaskTimeline(
    organizationId: string,
    taskId: string
  ) {
    return activityRepository.findActivities({
      organizationId: new Types.ObjectId(
        organizationId
      ),
      taskId: new Types.ObjectId(taskId),
    });
  }
}

export const activityService =
  new ActivityService();