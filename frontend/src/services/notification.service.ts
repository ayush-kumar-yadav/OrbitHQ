import { api } from "../api/client";

export const notificationService = {
  async getNotifications(limit = 20, page = 1) {
    const response = await api.get("/notifications", {
      params: {
        limit,
        page,
      },
    });

    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get(
      "/notifications/unread-count"
    );

    return response.data;
  },

  async markAsRead(notificationId: string) {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  },
};