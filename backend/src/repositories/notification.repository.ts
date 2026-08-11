import { FilterQuery, Types } from "mongoose";
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
    limit = 20
  ) {
    return Notification.find({
      userId: new Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("actorId", "name email")
      .populate("taskId", "title")
      .lean();
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId: new Types.ObjectId(userId),
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  }

  async countUnread(userId: string) {
    return Notification.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }
}

export const notificationRepository =
  new NotificationRepository();