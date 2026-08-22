import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";

import { useNotifications } from "../../hooks/notifications/useNotifications";
import { useUnreadNotificationCount } from "../../hooks/notifications/useUnreadNotificationCount";
import { useMarkNotificationRead } from "../../hooks/notifications/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../../hooks/notifications/useMarkAllNotificationsRead";

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
  } = useNotifications();

  const {
    data: unreadData,
  } = useUnreadNotificationCount();

  const markRead =
    useMarkNotificationRead();

  const markAllRead =
    useMarkAllNotificationsRead();

  const notifications =
    data?.data?.notifications ??
    data?.data ??
    [];

  const unreadCount =
    unreadData?.data?.count ??
    unreadData?.data ??
    0;

  function handleNotificationClick(notification: any) {
    const isRead =
      notification.read === true ||
      notification.isRead === true ||
      !!notification.readAt;

    if (!isRead) {
      markRead.mutate(notification._id);
    }

    setOpen(false);

    // taskId comes populated with { _id, title } — previously this
    // click only marked the notification read and went nowhere,
    // even when it clearly pointed at a specific task.
    const taskId = notification.taskId?._id ?? notification.taskId;

    if (taskId) {
      navigate(`/tasks/${taskId}`);
    }
  }

  return (
    <div className="relative">
      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg p-2 text-[#8D919D] transition hover:bg-white/[0.05] hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5C6C] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10121A] shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <h3 className="font-semibold text-white">
                  Notifications
                </h3>

                <p className="text-xs text-[#626775]">
                  {unreadCount} unread
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    markAllRead.mutate()
                  }
                  disabled={markAllRead.isPending}
                  className="flex items-center gap-1 text-xs font-medium text-[#7187FF] transition hover:text-[#8CA0FF] disabled:opacity-50"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[420px] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3 p-5">
                  <div className="h-16 animate-pulse rounded-lg bg-white/[0.04]" />
                  <div className="h-16 animate-pulse rounded-lg bg-white/[0.04]" />
                  <div className="h-16 animate-pulse rounded-lg bg-white/[0.04]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Bell className="mx-auto h-8 w-8 text-[#4F5460]" />

                  <p className="mt-3 text-sm font-medium text-[#EDEEF2]">
                    You're all caught up
                  </p>

                  <p className="mt-1 text-xs text-[#626775]">
                    No notifications yet.
                  </p>
                </div>
              ) : (
                notifications.map(
                  (notification: any) => {
                    const isRead =
                      notification.read === true ||
                      notification.isRead === true ||
                      !!notification.readAt;

                    return (
                      <button
                        key={notification._id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full border-b border-white/[0.05] px-5 py-4 text-left transition hover:bg-white/[0.03] ${
                          !isRead ? "bg-[#4C6FFF]/[0.06]" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                              !isRead
                                ? "bg-[#4C6FFF]"
                                : "bg-transparent"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#EDEEF2]">
                              {notification.title ||
                                notification.type ||
                                "Notification"}
                            </p>

                            <p className="mt-1 text-sm text-[#8D919D]">
                              {notification.message}
                            </p>

                            {notification.createdAt && (
                              <p className="mt-2 text-xs text-[#626775]">
                                {timeAgo(notification.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}