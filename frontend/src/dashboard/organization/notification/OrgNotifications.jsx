import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Bell, Check, CheckCheck, RefreshCw, Search } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import DashboardInput from '@/components/dashboard/DashboardInput';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import {
    fetchNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from '@/api/notificationApi';

// ============================================================
// HELPERS
// ============================================================

const getReadState = (notification) =>
    Boolean(notification.read ?? notification.is_read ?? notification.read_at);

const normalizeNotification = (notification) => ({
    ...notification,
    title: notification.title ?? notification.data?.title ?? 'Notification',
    read: getReadState(notification),
});

const getMessage = (notification) =>
    notification.body ??
    notification.message ??
    notification.description ??
    notification.data?.body ??
    notification.data?.message ??
    'You have a new notification.';

const getDate = (notification) =>
    notification.created_at ?? notification.createdAt ?? notification.date;

const formatDate = (value) => {
    if (!value) return 'Date unavailable';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Date unavailable';
    }

    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

// ============================================================
// NOTIFICATION ROW
// ============================================================

function NotificationRow({ notification, onMarkRead, updating, disabled }) {
    const isRead = notification.read;

    return (
        <article
            className={`
                group relative flex min-w-0 items-start
                gap-3 border-b border-[#252D38]
                px-4 py-3.5 transition-colors
                last:border-b-0 sm:gap-3.5 sm:px-5
                ${
                    isRead
                        ? 'bg-[#0E1219] hover:bg-[#151B24]'
                        : 'bg-[#141D27] hover:bg-[#19232E]'
                }
            `}
        >
            {!isRead && (
                <span className="absolute inset-y-0 left-0 w-0.75 bg-[#0F766E]" />
            )}

            <div
                className={`
                    mt-0.5 flex h-8 w-8 shrink-0
                    items-center justify-center border
                    ${
                        isRead
                            ? 'border-[#29323E] bg-[#171E28] text-[#8792A1]'
                            : 'border-[#285B57] bg-[#14332F] text-[#70C9BD]'
                    }
                `}
            >
                <Bell size={15} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3
                        className={`
                            min-w-0 wrap-break-word font-sans!
                            text-[13px] leading-5
                            ${
                                isRead
                                    ? 'font-medium! text-[#C3CBD6]!'
                                    : 'font-semibold! text-[#EEF1F5]!'
                            }
                        `}
                    >
                        {notification.title}
                    </h3>

                    {!isRead && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5EEAD4]" />
                    )}
                </div>

                <p className="mt-1 whitespace-pre-line wrap-break-word font-sans! text-[12px] leading-[1.65] text-[#AAB3BF]">
                    {getMessage(notification)}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 sm:hidden">
                    <time className="font-sans! text-[10px] text-[#8792A1]">
                        {formatDate(getDate(notification))}
                    </time>

                    {!isRead && (
                        <button
                            type="button"
                            onClick={() => onMarkRead(notification)}
                            disabled={disabled}
                            className="
                                inline-flex h-7 items-center gap-1.5
                                border border-[#343E4B] px-2.5
                                font-sans! text-[10px] font-medium!
                                text-[#B8C2CF] transition-colors
                                hover:border-[#0F766E] hover:bg-[#14332F]
                                hover:text-[#A0E3DA]
                                disabled:cursor-not-allowed disabled:opacity-50
                            "
                        >
                            {updating ? (
                                <RefreshCw size={12} className="animate-spin" />
                            ) : (
                                <Check size={12} />
                            )}
                            {updating ? 'Updating...' : 'Mark as read'}
                        </button>
                    )}
                </div>
            </div>

            <div className="hidden shrink-0 flex-col items-end gap-2.5 pl-2 sm:flex">
                <time className="whitespace-nowrap font-sans! text-[10px] leading-5 text-[#8792A1]">
                    {formatDate(getDate(notification))}
                </time>

                {!isRead && (
                    <button
                        type="button"
                        onClick={() => onMarkRead(notification)}
                        disabled={disabled}
                        className="
                            inline-flex h-7 items-center gap-1.5
                            border border-[#343E4B] px-2.5
                            font-sans! text-[10px] font-medium!
                            text-[#B8C2CF] transition-colors
                            hover:border-[#0F766E] hover:bg-[#14332F]
                            hover:text-[#A0E3DA]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        {updating ? (
                            <RefreshCw size={12} className="animate-spin" />
                        ) : (
                            <Check size={12} />
                        )}
                        {updating ? 'Updating...' : 'Mark as read'}
                    </button>
                )}
            </div>
        </article>
    );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyNotifications({ total, filter, search, onClear }) {
    const hasFilters = filter !== 'all' || Boolean(search.trim());
    const noUnread = filter === 'unread' && !search.trim();

    return (
        <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center border border-[#29323E] bg-[#151B24] text-[#8792A1]">
                {noUnread ? (
                    <CheckCheck size={21} strokeWidth={1.6} />
                ) : (
                    <Bell size={21} strokeWidth={1.6} />
                )}
            </div>

            <h3 className="mt-4 font-sans! text-[15px] font-semibold! text-[#EEF1F5]!">
                {total === 0
                    ? 'No notifications yet'
                    : noUnread
                      ? 'All caught up'
                      : 'No matching notifications'}
            </h3>

            <p className="mt-2 max-w-sm font-sans! text-[12px] leading-6 text-[#8792A1]">
                {total === 0
                    ? 'New platform updates will appear here.'
                    : noUnread
                      ? 'You have no unread notifications.'
                      : 'Try another search term or change the selected filter.'}
            </p>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 font-sans! text-[12px] font-medium! text-[#70C9BD] transition-colors hover:text-[#A0E3DA]"
                >
                    Clear search and filters
                </button>
            )}
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OrgNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [markingAll, setMarkingAll] = useState(false);

    const [actionError, setActionError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --------------------------------------------------------
    // LOAD NOTIFICATIONS
    // --------------------------------------------------------

    const loadNotifications = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError('');
            setActionError('');

            const response = await fetchNotifications();

            const items = Array.isArray(response)
                ? response
                : (response?.notifications ??
                  response?.data?.notifications ??
                  response?.data ??
                  []);

            setNotifications(
                Array.isArray(items) ? items.map(normalizeNotification) : [],
            );
        } catch (err) {
            if (showLoading) {
                setError(err?.message || 'Unable to retrieve notifications.');
            } else {
                setActionError(
                    err?.message || 'Unable to refresh notifications.',
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // --------------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------------

    useEffect(() => {
        let cancelled = false;

        const loadInitial = async () => {
            try {
                const response = await fetchNotifications();

                const items = Array.isArray(response)
                    ? response
                    : (response?.notifications ??
                      response?.data?.notifications ??
                      response?.data ??
                      []);

                if (!cancelled) {
                    setNotifications(
                        Array.isArray(items)
                            ? items.map(normalizeNotification)
                            : [],
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message || 'Unable to retrieve notifications.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitial();

        return () => {
            cancelled = true;
        };
    }, []);

    // --------------------------------------------------------
    // COUNTS
    // --------------------------------------------------------

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.read).length,
        [notifications],
    );

    const counts = useMemo(
        () => ({
            all: notifications.length,
            unread: unreadCount,
            read: notifications.length - unreadCount,
        }),
        [notifications, unreadCount],
    );

    // --------------------------------------------------------
    // FILTER + SORT
    // --------------------------------------------------------

    const filteredNotifications = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return notifications
            .filter((notification) => {
                if (activeFilter === 'unread' && notification.read) {
                    return false;
                }

                if (activeFilter === 'read' && !notification.read) {
                    return false;
                }

                if (!query) return true;

                return [
                    notification.title,
                    getMessage(notification),
                    notification.type,
                    notification.category,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query);
            })
            .sort((a, b) => {
                const first = new Date(getDate(a) ?? 0).getTime();
                const second = new Date(getDate(b) ?? 0).getTime();

                return (
                    (Number.isFinite(second) ? second : 0) -
                    (Number.isFinite(first) ? first : 0)
                );
            });
    }, [notifications, searchTerm, activeFilter]);

    // --------------------------------------------------------
    // MARK ONE AS READ
    // --------------------------------------------------------

    const handleMarkAsRead = async (notification) => {
        if (notification.read || updatingId !== null || markingAll) {
            return;
        }

        if (notification.id == null) {
            setActionError('Invalid notification ID.');
            return;
        }

        setUpdatingId(notification.id);
        setActionError('');

        try {
            await markNotificationAsRead(notification.id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? {
                              ...item,
                              read: true,
                              read_at: new Date().toISOString(),
                          }
                        : item,
                ),
            );

            setSuccessMessage('Notification marked as read.');
        } catch (err) {
            setActionError(
                err?.message || 'Unable to update this notification.',
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // --------------------------------------------------------
    // MARK ALL AS READ
    // --------------------------------------------------------

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0 || markingAll || updatingId !== null) {
            return;
        }

        setMarkingAll(true);
        setActionError('');

        try {
            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    read: true,
                    read_at: item.read_at ?? new Date().toISOString(),
                })),
            );

            setSuccessMessage('All notifications marked as read.');
        } catch (err) {
            setActionError(
                err?.message || 'Unable to mark all notifications as read.',
            );
        } finally {
            setMarkingAll(false);
        }
    };

    // --------------------------------------------------------
    // FILTER CONTROLS
    // --------------------------------------------------------

    const clearFilters = () => {
        setSearchTerm('');
        setActiveFilter('all');
    };

    const filterOptions = [
        { key: 'all', label: 'All' },
        { key: 'unread', label: 'Unread' },
        { key: 'read', label: 'Read' },
    ];

    // --------------------------------------------------------
    // PAGE HEADER
    // --------------------------------------------------------

    const header = (
        <PageHeader
            title="Notifications"
            subtitle="Updates about your campaigns, responses, and volunteers."
            action={
                <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:justify-end">
                    <button
                        type="button"
                        onClick={() => loadNotifications(false)}
                        disabled={refreshing || loading || markingAll}
                        className="
                            inline-flex h-10 items-center justify-center gap-2
                            border border-[#343E4B] bg-transparent px-3.5
                            font-sans! text-[12px] font-medium! text-[#B8C2CF]
                            transition-colors hover:border-[#4B596A]
                            hover:bg-[#1C232D] hover:text-[#F1F5F9]
                            disabled:cursor-not-allowed disabled:opacity-40
                        "
                    >
                        <RefreshCw
                            size={14}
                            className={refreshing ? 'animate-spin' : ''}
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        disabled={
                            unreadCount === 0 ||
                            markingAll ||
                            updatingId !== null
                        }
                        className="
                            inline-flex h-10 items-center justify-center gap-2
                            border border-[#0F766E] bg-[#0F766E] px-4
                            font-sans! text-[12px] font-semibold! text-white
                            transition-colors hover:border-[#115E59]
                            hover:bg-[#115E59]
                            disabled:cursor-not-allowed disabled:opacity-40
                        "
                    >
                        {markingAll ? (
                            <RefreshCw size={15} className="animate-spin" />
                        ) : (
                            <CheckCheck size={15} />
                        )}
                        {markingAll ? 'Updating...' : 'Mark all as read'}
                    </button>
                </div>
            }
        />
    );

    // --------------------------------------------------------
    // LOADING
    // --------------------------------------------------------

    if (loading) {
        return (
            <div className="space-y-10 lg:space-y-12">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading notifications..."
                    description="Please wait while we retrieve your notifications."
                />
            </div>
        );
    }

    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    if (error) {
        return (
            <div className="space-y-10 lg:space-y-12">
                {header}

                <LoadingError
                    title="Unable to load notifications"
                    message={error}
                />

                <button
                    type="button"
                    onClick={() => loadNotifications(true)}
                    className="
                        inline-flex h-10 items-center gap-2
                        border border-[#343E4B] px-4
                        font-sans! text-[12px] font-medium!
                        text-[#B8C2CF] transition-colors
                        hover:bg-[#1C232D]
                    "
                >
                    <RefreshCw size={14} />
                    Try again
                </button>
            </div>
        );
    }

    // --------------------------------------------------------
    // MAIN UI
    // --------------------------------------------------------

    return (
        <>
            <div className="space-y-10 lg:space-y-12">
                {header}

                <section className="min-w-0 pt-1">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="font-sans! text-[20px] font-semibold! leading-tight tracking-[-0.02em] text-[#EEF1F5]!">
                                Notification Inbox
                            </h2>

                            <p className="mt-2 font-sans! text-[12px] leading-[1.65] text-[#8792A1]">
                                {unreadCount > 0
                                    ? `You have ${unreadCount} unread ${
                                          unreadCount === 1
                                              ? 'notification'
                                              : 'notifications'
                                      }.`
                                    : 'You are all caught up.'}
                            </p>
                        </div>

                        <span className="shrink-0 font-sans! text-[11px] font-medium! text-[#AAB3BF]">
                            {filteredNotifications.length}{' '}
                            {filteredNotifications.length === 1
                                ? 'result'
                                : 'results'}
                        </span>
                    </div>

                    <div className="min-w-0 overflow-hidden border border-[#252D38] bg-[#0E1219]">
                        <div className="border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                <div className="w-full min-w-0 lg:max-w-md">
                                    <DashboardInput
                                        id="org-notification-search"
                                        name="org-notification-search"
                                        label=""
                                        type="text"
                                        leftIcon={Search}
                                        value={searchTerm}
                                        onChange={(value) =>
                                            setSearchTerm(
                                                typeof value === 'string'
                                                    ? value
                                                    : value.target.value,
                                            )
                                        }
                                        placeholder="Search notifications"
                                    />
                                </div>

                                <div className="flex w-full items-center gap-1 overflow-x-auto border border-[#29323E] bg-[#0E1219] p-1 sm:w-auto">
                                    {filterOptions.map((filter) => {
                                        const active =
                                            activeFilter === filter.key;

                                        return (
                                            <button
                                                key={filter.key}
                                                type="button"
                                                onClick={() =>
                                                    setActiveFilter(filter.key)
                                                }
                                                className={`
                                                    inline-flex h-8 shrink-0
                                                    items-center gap-2
                                                    whitespace-nowrap px-3
                                                    font-sans! text-[11px]
                                                    font-medium! transition-colors
                                                    ${
                                                        active
                                                            ? 'bg-[#26323E] text-[#EEF1F5]'
                                                            : 'text-[#8792A1] hover:bg-[#171E28] hover:text-[#EEF1F5]'
                                                    }
                                                `}
                                            >
                                                {filter.label}

                                                <span
                                                    className={
                                                        active
                                                            ? 'tabular-nums text-[#EEF1F5]'
                                                            : 'tabular-nums text-[#697586]'
                                                    }
                                                >
                                                    {counts[filter.key]}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {actionError && (
                            <div
                                role="alert"
                                className="border-b border-[#5B3438] bg-[#24171B] px-4 py-3 font-sans! text-[12px] text-[#F0A7AD] sm:px-5"
                            >
                                {actionError}
                            </div>
                        )}

                        {filteredNotifications.length === 0 ? (
                            <EmptyNotifications
                                total={notifications.length}
                                filter={activeFilter}
                                search={searchTerm}
                                onClear={clearFilters}
                            />
                        ) : (
                            <div>
                                {filteredNotifications.map((notification) => (
                                    <NotificationRow
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={handleMarkAsRead}
                                        updating={
                                            updatingId === notification.id
                                        }
                                        disabled={
                                            updatingId !== null || markingAll
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <SuccessDialog
                open={Boolean(successMessage)}
                title="Notification updated"
                message={successMessage}
                onClose={() => setSuccessMessage('')}
            />
        </>
    );
}
