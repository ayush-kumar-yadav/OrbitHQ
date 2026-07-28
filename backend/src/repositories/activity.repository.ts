import { FilterQuery } from "mongoose";

import {
  Activity,
  IActivity,
} from "../models/activity.model";

class ActivityRepository {
  async createActivity(
    data: Partial<IActivity>
  ) {
    return Activity.create(data);
  }

  async findActivities(
    filter: FilterQuery<IActivity>
  ) {
    return Activity.find(filter)
      .populate("actor", "name email")
      .sort({
        createdAt: -1,
      })
      .lean();
  }
}

export const activityRepository =
  new ActivityRepository();