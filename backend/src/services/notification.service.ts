import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";
import { notificationRepository } from "../repositories/notification.repository";

class NotificationService {
  async getNotifications(
    userId: string,
    limit?: number
  ) {
    const notifications =
      await notificationRepository.findByUser(
        userId,
        limit ?? 20
      );

    return notifications;
  }

  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(
      userId
    );
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    const notification =
      await notificationRepository.markAsRead(
        notificationId,
        userId
      );

    if (!notification) {
      throw new ApiError(
        HTTPSTATUS.NOT_FOUND,
        "Notification not found"
      );
    }

    return notification;
  }
}

export const notificationService =
  new NotificationService();