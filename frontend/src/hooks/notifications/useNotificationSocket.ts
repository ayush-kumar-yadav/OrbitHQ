import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "../../services/socket";

export function useNotificationSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNotification = (notification: any) => {
      console.log(
        "🔔 New notification:",
        notification
      );

      // Refresh notification list
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      // Refresh unread count
      queryClient.invalidateQueries({
        queryKey: [
          "notifications",
          "unread-count",
        ],
      });

      // Show toast
      toast(
        notification.title ||
          "New notification",
        {
          description:
            notification.message ||
            "You have a new notification.",
        }
      );
    };

    socket.on(
      "notification:created",
      handleNotification
    );

    return () => {
      socket.off(
        "notification:created",
        handleNotification
      );
    };
  }, [queryClient]);
}