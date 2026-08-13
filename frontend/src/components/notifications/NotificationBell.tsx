import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { useNotifications } from "../../hooks/notifications/useNotifications";
import { useUnreadNotificationCount } from "../../hooks/notifications/useUnreadNotificationCount";
import { useMarkNotificationRead } from "../../hooks/notifications/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../../hooks/notifications/useMarkAllNotificationsRead";

export default function NotificationBell() {
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

  return (
    <div className="relative">
      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
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

          <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Notifications
                </h3>

                <p className="text-xs text-slate-500">
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
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
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
                  <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Bell className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    You're all caught up
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
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
                        onClick={() => {
                          if (!isRead) {
                            markRead.mutate(
                              notification._id
                            );
                          }
                        }}
                        className={`w-full border-b px-5 py-4 text-left transition hover:bg-slate-50 ${
                          !isRead
                            ? "bg-blue-50/50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                              !isRead
                                ? "bg-blue-500"
                                : "bg-transparent"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {notification.title ||
                                notification.type ||
                                "Notification"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {notification.message}
                            </p>

                            {notification.createdAt && (
                              <p className="mt-2 text-xs text-slate-400">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
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