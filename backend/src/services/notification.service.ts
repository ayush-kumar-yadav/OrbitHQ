import { HTTPSTATUS } from "../config/http.config";
import { ApiError } from "../errors/ApiError";

import { notificationRepository } from "../repositories/notification.repository";

class NotificationService {
  async getNotifications(
    userId: string,
    organizationId: string,
    limit?: number
  ) {
    return notificationRepository.findByUser(
      userId,
      organizationId,
      limit ?? 20
    );
  }

  async getUnreadCount(
    userId: string,
    organizationId: string
  ) {
    return notificationRepository.countUnread(
      userId,
      organizationId
    );
  }
  async markAllAsRead(userId: string) {
  return notificationRepository.markAllAsRead(
    userId
  );
}

  async markAsRead(
    notificationId: string,
    userId: string,
    organizationId: string
  ) {
    const notification =
      await notificationRepository.markAsRead(
        notificationId,
        userId,
        organizationId
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