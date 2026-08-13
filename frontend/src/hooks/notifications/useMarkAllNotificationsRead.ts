import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationService } from "../../services/notification.service";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      notificationService.markAllAsRead(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "notifications",
          "unread-count",
        ],
      });
    },
  });
}