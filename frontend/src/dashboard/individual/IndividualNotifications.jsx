import React, { useEffect, useState } from 'react';

import { Bell, CheckCheck, Loader2 } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import EmptyState from '@/components/dashboard/EmptyState';

import {
    fetchNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from '@/api/notificationApi';

const IndividualNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [markingAllRead, setMarkingAllRead] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadNotifications = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetchNotifications();

                if (!cancelled) {
                    setNotifications(response.notifications || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Failed to load notifications.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadNotifications();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);

            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === id
                        ? {
                              ...notification,
                              read: true,
                              read_at: new Date().toISOString(),
                          }
                        : notification,
                ),
            );
        } catch (err) {
            setError(err.message || 'Failed to mark notification as read.');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setMarkingAllRead(true);
            setError('');

            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read: true,
                    read_at: notification.read_at || new Date().toISOString(),
                })),
            );
        } catch (err) {
            setError(err.message || 'Failed to mark notifications as read.');
        } finally {
            setMarkingAllRead(false);
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read,
    ).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Notifications"
                subtitle="Stay up to date with your activities and platform updates."
            />

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading notifications...
                    </div>
                </div>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon={Bell}
                    title="No notifications"
                    message="You're all caught up. New notifications will appear here."
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
                        <div>
                            <p className="text-sm font-semibold text-text-primary">
                                All notifications
                            </p>

                            <p className="mt-0.5 text-xs text-[#6b7280]">
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${
                                          unreadCount === 1 ? '' : 's'
                                      }`
                                    : 'All notifications are read'}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={markingAllRead}
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {markingAllRead ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCheck className="h-4 w-4" />
                                )}
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <ul className="divide-y divide-[#e5e7eb]">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                                    !notification.read
                                        ? 'bg-primary/3'
                                        : 'bg-white'
                                }`}
                            >
                                <span
                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                        !notification.read
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-[#f3f4f6] text-[#6b7280]'
                                    }`}
                                >
                                    <Bell className="h-4 w-4" />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`text-sm font-medium ${
                                            !notification.read
                                                ? 'text-text-primary'
                                                : 'text-[#6b7280]'
                                        }`}
                                    >
                                        {notification.title}
                                    </p>

                                    <p className="mt-0.5 text-sm text-[#6b7280]">
                                        {notification.body}
                                    </p>

                                    <p className="mt-1 text-xs text-[#6b7280]">
                                        {new Date(
                                            notification.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                {!notification.read && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMarkAsRead(notification.id)
                                        }
                                        className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default IndividualNotifications;
