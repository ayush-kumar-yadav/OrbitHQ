import { Types } from "mongoose";

import {
  Notification,
  INotification,
} from "../models/notification.model";

class NotificationRepository {
  async create(
    data: Partial<INotification>
  ) {
    return Notification.create(data);
  }

  async findByUser(
    userId: string,
    organizationId: string,
    limit = 20
  ) {
    return Notification.find({
      userId: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(
        organizationId
      ),
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("actorId", "name email")
      .populate("taskId", "title")
      .lean();
  }

  async markAsRead(
    notificationId: string,
    userId: string,
    organizationId: string
  ) {
    return Notification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId),
        organizationId: new Types.ObjectId(
          organizationId
        ),
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  }

  async countUnread(
    userId: string,
    organizationId: string
  ) {
    return Notification.countDocuments({
      userId: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(
        organizationId
      ),
      isRead: false,
    });
  }
  async markAllAsRead(userId: string) {
  return Notification.updateMany(
    {
      userId: new Types.ObjectId(userId),
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
}
}

export const notificationRepository =
  new NotificationRepository();