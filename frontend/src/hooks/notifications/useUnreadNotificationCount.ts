import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../../services/notification.service";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () =>
      notificationService.getUnreadCount(),
    refetchInterval: 30 * 1000,
    staleTime: 10 * 1000,
  });
}