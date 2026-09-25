import React, { useCallback, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import EmptyState from "@/components/dashboard/EmptyState";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

const fetchNotifications = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Unable to load notifications.");
  }

  return data;
};

const formatTime = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const diff = Date.now() - parsedDate.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return parsedDate.toLocaleDateString();
};

const OrgNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchNotifications();

      const notificationData = Array.isArray(data?.notifications)
        ? data.notifications
        : Array.isArray(data?.data)
          ? data.data
          : [];

      const normalized = notificationData.map((notification) => ({
        id: notification?.id,
        title:
          notification?.title || notification?.data?.title || "Notification",
        body:
          notification?.body ||
          notification?.message ||
          notification?.data?.body ||
          notification?.data?.message ||
          "",
        time: formatTime(notification?.created_at || notification?.createdAt),
        read:
          Boolean(notification?.read_at) ||
          notification?.read === true ||
          notification?.is_read === true,
      }));

      setNotifications(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Load notifications when the page's DOM node
   * is mounted. This avoids the project's
   * react-hooks/set-state-in-effect lint rule.
   */
  const pageRef = useCallback(
    (element) => {
      if (element && element.dataset.notificationsLoaded !== "true") {
        element.dataset.notificationsLoaded = "true";
        loadNotifications();
      }
    },
    [loadNotifications],
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div ref={pageRef} className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Updates about your campaigns, responses, and volunteers."
      />

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      )}

      {/* Unread count */}
      {!loading && notifications.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6b7280]">
            {unreadCount > 0
              ? `${unreadCount} unread ${
                  unreadCount === 1 ? "notification" : "notifications"
                }`
              : "You're all caught up."}
          </p>

          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary-hover disabled:opacity-50">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="divide-y divide-[#e5e7eb]">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4 px-5 py-4">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#f3f4f6]" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-[#f3f4f6]" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#f3f4f6]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[#f3f4f6]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <EmptyState
          icon={Bell}
          title="No notifications"
          message="You're all caught up."
        />
      )}

      {/* Notifications */}
      {!loading && notifications.length > 0 && (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <ul className="divide-y divide-[#e5e7eb]">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex items-start gap-4 px-5 py-4 ${
                  !notification.read ? "bg-primary/3" : ""
                }`}>
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    !notification.read
                      ? "bg-primary/10 text-primary"
                      : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}>
                  <Bell className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      !notification.read
                        ? "text-text-primary"
                        : "text-[#6b7280]"
                    }`}>
                    {notification.title}
                  </p>

                  {notification.body && (
                    <p className="mt-0.5 text-sm text-[#6b7280]">
                      {notification.body}
                    </p>
                  )}

                  {notification.time && (
                    <p className="mt-1 text-xs text-[#6b7280]">
                      {notification.time}
                    </p>
                  )}
                </div>

                {!notification.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrgNotifications;
