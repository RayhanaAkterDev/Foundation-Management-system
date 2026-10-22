import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Bell,
    Check,
    ChevronDown,
    CircleHelp,
    ExternalLink,
    LogOut,
    Menu,
    RefreshCw,
    Settings,
    UserRound,
} from 'lucide-react';

import { NAV_CONFIG } from '@/routes/dashboardNav';
import {
    fetchNotifications,
    markNotificationAsRead,
} from '@/api/notificationApi';

const NOTIFICATION_REFRESH_INTERVAL = 60000;
const MAX_VISIBLE_NOTIFICATIONS = 8;

const NOTIFICATION_PATHS = {
    admin: '/admin/dashboard/notifications',
    individual: '/individual/dashboard/notifications',
    organization: '/organization/dashboard/notifications',
};

function getStoredUser() {
    try {
        const value =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!value) return null;

        const parsed = JSON.parse(value);
        return parsed?.user || parsed;
    } catch (error) {
        console.error('Failed to parse stored user:', error);
        return null;
    }
}

function normalizeNotificationResponse(response) {
    const items = Array.isArray(response)
        ? response
        : (response?.notifications ??
          response?.data?.notifications ??
          response?.data ??
          []);

    return Array.isArray(items) ? items : [];
}

function isNotificationRead(notification) {
    return Boolean(notification.read || notification.read_at);
}

function formatNotificationTime(value) {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const elapsed = Math.max(0, Date.now() - date.getTime());

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (elapsed < minute) return 'Just now';
    if (elapsed < hour) return `${Math.floor(elapsed / minute)}m ago`;
    if (elapsed < day) return `${Math.floor(elapsed / hour)}h ago`;
    if (elapsed < 7 * day) return `${Math.floor(elapsed / day)}d ago`;

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
}

export default function DashboardTopbar({ pageTitle, role, onMenuOpen }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const notificationMenuRef = useRef(null);
    const userMenuRef = useRef(null);

    const [user, setUser] = useState(getStoredUser);
    const [userAvatarError, setUserAvatarError] = useState(false);

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationError, setNotificationError] = useState(false);
    const [markingReadIds, setMarkingReadIds] = useState([]);

    // Store the route on which each menu was opened.
    // Route changes close menus without calling setState inside an effect.
    const [userMenuPath, setUserMenuPath] = useState(null);
    const [notificationMenuPath, setNotificationMenuPath] = useState(null);

    const isUserMenuVisible = userMenuOpen && userMenuPath === pathname;

    const isNotificationMenuVisible =
        notificationMenuOpen && notificationMenuPath === pathname;

    // USER

    const refreshUser = useCallback(() => {
        setUser(getStoredUser());
        setUserAvatarError(false);
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user' || event.key === null) {
                refreshUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('user-updated', refreshUser);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('user-updated', refreshUser);
        };
    }, [refreshUser]);

    const userName =
        user?.name ||
        user?.username ||
        user?.full_name ||
        user?.fullName ||
        user?.email?.split('@')[0] ||
        'User';

    const userEmail = user?.email || '';
    const userAvatar = user?.photo || null;

    const userRole = user?.role || role || 'individual';

    const normalizedRole =
        typeof userRole === 'string' ? userRole.toLowerCase() : 'individual';

    const roleLabelMap = {
        individual: 'Individual',
        organization: 'Organization',
        admin: 'Administrator',
    };

    const roleLabel = roleLabelMap[normalizedRole] || userRole;

    const initials =
        userName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 1)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase() || 'U';

    const showAvatar = Boolean(userAvatar) && !userAvatarError;

    // PAGE TITLE

    const normalizePath = (path) => path?.replace(/\/+$/, '') || '/';

    const currentPath = normalizePath(pathname);

    const navigationItems = NAV_CONFIG[normalizedRole] || [];

    const matchingItems = navigationItems
        .filter((item) => item.type !== 'section')
        .flatMap((item) => {
            const paths = [
                item.path,
                ...(item.children || []).map((child) => child.path),
            ].filter(Boolean);

            return paths
                .map(normalizePath)
                .filter(
                    (path) =>
                        currentPath === path ||
                        (path !== '/' && currentPath.startsWith(`${path}/`)),
                )
                .map((path) => ({
                    label: item.label,
                    length: path.length,
                }));
        });

    const activeMainItem = matchingItems.sort((a, b) => b.length - a.length)[0];

    const resolvedPageTitle = activeMainItem?.label || pageTitle || 'Dashboard';

    // NOTIFICATION API

    const loadNotifications = useCallback(async (showLoader = false) => {
        if (showLoader) {
            setNotificationsLoading(true);
        }

        try {
            const response = await fetchNotifications();

            setNotifications(normalizeNotificationResponse(response));

            setNotificationError(false);
        } catch (error) {
            console.error('Failed to load notifications:', error);

            setNotificationError(true);
        } finally {
            if (showLoader) {
                setNotificationsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const refresh = async (showLoader = false) => {
            if (!mounted) return;

            if (showLoader) {
                setNotificationsLoading(true);
            }

            try {
                const response = await fetchNotifications();

                if (!mounted) return;

                setNotifications(normalizeNotificationResponse(response));

                setNotificationError(false);
            } catch (error) {
                if (!mounted) return;

                console.error('Failed to load notifications:', error);

                setNotificationError(true);
            } finally {
                if (mounted && showLoader) {
                    setNotificationsLoading(false);
                }
            }
        };

        refresh(true);

        const intervalId = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                refresh(false);
            }
        }, NOTIFICATION_REFRESH_INTERVAL);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refresh(false);
            }
        };

        const handleNotificationUpdate = () => {
            refresh(false);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        window.addEventListener(
            'notifications-updated',
            handleNotificationUpdate,
        );

        return () => {
            mounted = false;

            window.clearInterval(intervalId);

            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );

            window.removeEventListener(
                'notifications-updated',
                handleNotificationUpdate,
            );
        };
    }, []);

    const unreadCount = notifications.filter(
        (notification) => !isNotificationRead(notification),
    ).length;

    const notificationPath =
        NOTIFICATION_PATHS[normalizedRole] || NOTIFICATION_PATHS.individual;

    const visibleNotifications = notifications.slice(
        0,
        MAX_VISIBLE_NOTIFICATIONS,
    );

    const handleMarkNotificationRead = async (notification) => {
        if (
            isNotificationRead(notification) ||
            markingReadIds.includes(notification.id)
        ) {
            return;
        }

        setMarkingReadIds((current) => [...current, notification.id]);

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

            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        } finally {
            setMarkingReadIds((current) =>
                current.filter((id) => id !== notification.id),
            );
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!isNotificationRead(notification)) {
            await handleMarkNotificationRead(notification);
        }

        setNotificationMenuOpen(false);

        if (!notification.action_url) {
            navigate(notificationPath);
            return;
        }

        const actionUrl = notification.action_url;

        if (actionUrl.startsWith('/') && !actionUrl.startsWith('//')) {
            navigate(actionUrl);
            return;
        }

        try {
            const target = new URL(actionUrl, window.location.origin);

            if (target.origin === window.location.origin) {
                navigate(`${target.pathname}${target.search}${target.hash}`);
            } else {
                window.open(target.href, '_blank', 'noopener,noreferrer');
            }
        } catch {
            navigate(notificationPath);
        }
    };

    // DROPDOWN HANDLERS

    const closeUserMenu = () => {
        setUserMenuOpen(false);
    };

    const closeNotificationMenu = () => {
        setNotificationMenuOpen(false);
    };

    const toggleNotificationMenu = () => {
        const nextOpen = !isNotificationMenuVisible;

        setNotificationMenuOpen(nextOpen);
        setNotificationMenuPath(pathname);
        setUserMenuOpen(false);

        if (nextOpen) {
            loadNotifications(true);
        }
    };

    const toggleUserMenu = () => {
        const nextOpen = !isUserMenuVisible;

        setUserMenuOpen(nextOpen);
        setUserMenuPath(pathname);
        setNotificationMenuOpen(false);
    };

    // Close on outside click or Escape.
    // State updates happen inside event handlers, not the effect body.

    useEffect(() => {
        if (!isUserMenuVisible && !isNotificationMenuVisible) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false);
                setNotificationMenuOpen(false);
            }
        };

        const handleOutsideClick = (event) => {
            if (
                isUserMenuVisible &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }

            if (
                isNotificationMenuVisible &&
                notificationMenuRef.current &&
                !notificationMenuRef.current.contains(event.target)
            ) {
                setNotificationMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isUserMenuVisible, isNotificationMenuVisible]);

    // SIGN OUT

    const handleSignOut = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('authToken');

        setUser(null);
        setUserAvatarError(false);
        setNotifications([]);
        setUserMenuOpen(false);
        setNotificationMenuOpen(false);

        navigate('/');
    };

    // QUICK ACTIONS

    const dashboardBase = `/${normalizedRole}/dashboard`;

    const quickActions = [
        {
            label: 'Profile',
            icon: UserRound,
            to: `${dashboardBase}/profile`,
        },
        {
            label: 'Settings',
            icon: Settings,
            to: `${dashboardBase}/settings`,
        },
        {
            label: 'Help & Support',
            icon: CircleHelp,
            to: `${dashboardBase}/help`,
        },
    ];

    return (
        <header
            className="
                sticky top-0 z-1000 isolate
                border-b border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuOpen}
                        aria-label="Open navigation menu"
                        className="
                            flex h-9 w-9 shrink-0 items-center
                            justify-center rounded-md
                            border border-[#29323E]
                            bg-[#141922] text-[#7F8998]
                            transition-colors duration-150
                            hover:border-[#36414F]
                            hover:bg-[#181F28]
                            hover:text-[#F1F3F5]
                            focus:outline-none
                            lg:hidden
                        "
                    >
                        <Menu size={18} strokeWidth={1.8} />
                    </button>

                    <div className="min-w-0">
                        <span
                            className="
                                block truncate text-[9px]
                                font-semibold uppercase
                                tracking-[0.18em]
                                text-[#8792A1]
                            "
                        >
                            {roleLabel}
                        </span>

                        <h1
                            className="
                                max-w-[calc(100vw-170px)]
                                truncate font-sans!
                                text-[18px] font-semibold!
                                leading-6 tracking-[-0.015em]
                                text-[#EEF1F5]!
                                sm:max-w-125
                                sm:text-[19px]
                            "
                        >
                            {resolvedPageTitle}
                        </h1>
                    </div>
                </div>

                {/* RIGHT */}

                <div className="flex shrink-0 items-center gap-2">
                    {/* NOTIFICATION CENTER */}

                    <div ref={notificationMenuRef} className="relative z-1010">
                        <button
                            type="button"
                            aria-label={
                                unreadCount > 0
                                    ? `Notifications, ${unreadCount} unread`
                                    : 'Notifications'
                            }
                            aria-expanded={isNotificationMenuVisible}
                            aria-haspopup="dialog"
                            onClick={toggleNotificationMenu}
                            className="
                                relative flex h-9 w-9
                                items-center justify-center
                                rounded-md text-[#7F8998]
                                transition-colors duration-150
                                hover:bg-[#181F28]
                                hover:text-[#F1F3F5]
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#E6A15C]
                            "
                        >
                            <Bell size={18} strokeWidth={1.75} />

                            {unreadCount > 0 && (
                                <span
                                    className="
                                        absolute -right-1 -top-1
                                        flex h-4.25 min-w-4.25
                                        items-center justify-center
                                        rounded-full border-2
                                        border-[#0E1219]
                                        bg-[#E6A15C] px-1
                                        text-[9px] font-bold
                                        leading-none text-[#11161E]
                                    "
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationMenuVisible && (
                            <div
                                role="dialog"
                                aria-label="Notifications"
                                className="
                                    absolute right-0
                                    top-[calc(100%+14px)]
                                    z-1020
                                    w-[min(380px,calc(100vw-24px))]
                                    overflow-hidden rounded-xl
                                    border border-[#29323E]
                                    bg-[#141922]
                                    shadow-[0_18px_55px_rgba(0,0,0,0.42)]
                                "
                            >
                                {/* HEADER */}

                                <div
                                    className="
                                        flex items-center justify-between
                                        gap-3 border-b border-[#252D38]
                                        bg-[#11161E] px-4 py-3.5
                                    "
                                >
                                    <div className="min-w-0">
                                        <h2
                                            className="
                                                font-sans!
                                                text-[13px]
                                                font-semibold!
                                                text-[#EEF1F5]!
                                            "
                                        >
                                            Notifications
                                        </h2>

                                        <p className="mt-0.5 text-[10px] text-[#7F8998]">
                                            {unreadCount > 0
                                                ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                                                : "You're all caught up"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => loadNotifications(true)}
                                        disabled={notificationsLoading}
                                        aria-label="Refresh notifications"
                                        className="
                                            flex h-8 w-8 items-center
                                            justify-center rounded-md
                                            text-[#7F8998]
                                            transition-colors
                                            hover:bg-[#202834]
                                            hover:text-[#F1F3F5]
                                            disabled:opacity-50
                                        "
                                    >
                                        <RefreshCw
                                            size={15}
                                            strokeWidth={1.8}
                                            className={
                                                notificationsLoading
                                                    ? 'animate-spin'
                                                    : ''
                                            }
                                        />
                                    </button>
                                </div>

                                {/* NOTIFICATION LIST */}

                                <div className="max-h-[min(420px,60vh)] overflow-y-auto">
                                    {notificationsLoading &&
                                    notifications.length === 0 ? (
                                        <div
                                            className="
                                                flex items-center
                                                justify-center gap-2
                                                px-4 py-10
                                                text-[11px]
                                                text-[#8792A1]
                                            "
                                        >
                                            <span
                                                className="
                                                    h-4 w-4
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-[#465364]
                                                    border-t-[#E6A15C]
                                                "
                                            />
                                            Loading notifications...
                                        </div>
                                    ) : notificationError &&
                                      notifications.length === 0 ? (
                                        <div className="px-5 py-9 text-center">
                                            <p className="text-[12px] font-medium text-[#D9DEE6]">
                                                Couldn't load notifications
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#8792A1]">
                                                Check your connection and try
                                                again.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    loadNotifications(true)
                                                }
                                                className="
                                                    mt-3 text-[11px]
                                                    font-semibold
                                                    text-[#E6A15C]
                                                    hover:underline
                                                "
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    ) : visibleNotifications.length === 0 ? (
                                        <div className="px-5 py-10 text-center">
                                            <Bell
                                                size={23}
                                                strokeWidth={1.4}
                                                className="mx-auto text-[#596576]"
                                            />

                                            <p className="mt-3 text-[12px] font-medium text-[#D9DEE6]">
                                                No notifications yet
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#8792A1]">
                                                Updates will appear here when
                                                available.
                                            </p>
                                        </div>
                                    ) : (
                                        visibleNotifications.map(
                                            (notification) => {
                                                const isRead =
                                                    isNotificationRead(
                                                        notification,
                                                    );

                                                const isMarking =
                                                    markingReadIds.includes(
                                                        notification.id,
                                                    );

                                                return (
                                                    <div
                                                        key={notification.id}
                                                        className={`
                                                            group relative
                                                            border-b
                                                            border-[#252D38]
                                                            transition-colors
                                                            last:border-b-0
                                                            hover:bg-[#191F29]
                                                            ${
                                                                !isRead
                                                                    ? 'bg-[#171E27]'
                                                                    : ''
                                                            }
                                                        `}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    notification,
                                                                )
                                                            }
                                                            className="
                                                                flex w-full
                                                                gap-3 px-4 py-3.5
                                                                text-left
                                                                focus:outline-none
                                                                focus-visible:ring-2
                                                                focus-visible:ring-inset
                                                                focus-visible:ring-[#E6A15C]
                                                            "
                                                        >
                                                            <span
                                                                className={`
                                                                    mt-1.5 h-2 w-2
                                                                    shrink-0 rounded-full
                                                                    ${
                                                                        !isRead
                                                                            ? 'bg-[#E6A15C]'
                                                                            : 'bg-[#465364]'
                                                                    }
                                                                `}
                                                            />

                                                            <span className="min-w-0 flex-1">
                                                                <span className="flex items-start justify-between gap-2">
                                                                    <span
                                                                        className={`
                                                                            text-[11px]
                                                                            leading-4
                                                                            ${
                                                                                !isRead
                                                                                    ? 'font-semibold text-[#F1F3F5]'
                                                                                    : 'font-medium text-[#C7CFD9]'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {notification.title ||
                                                                            'Notification'}
                                                                    </span>

                                                                    <span className="shrink-0 pt-0.5 text-[9px] text-[#657184]">
                                                                        {formatNotificationTime(
                                                                            notification.created_at,
                                                                        )}
                                                                    </span>
                                                                </span>

                                                                {notification.body && (
                                                                    <span
                                                                        className="
                                                                            mt-1 block
                                                                            whitespace-normal
                                                                            wrap-break-word
                                                                            text-[10px]
                                                                            leading-[1.55]
                                                                            text-[#8792A1]
                                                                        "
                                                                    >
                                                                        {
                                                                            notification.body
                                                                        }
                                                                    </span>
                                                                )}

                                                                {notification.category && (
                                                                    <span className="mt-2 block text-[9px] capitalize text-[#657184]">
                                                                        {String(
                                                                            notification.category,
                                                                        ).replace(
                                                                            /[_-]+/g,
                                                                            ' ',
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </button>

                                                        {!isRead && (
                                                            <button
                                                                type="button"
                                                                title="Mark as read"
                                                                aria-label={`Mark ${notification.title || 'notification'} as read`}
                                                                disabled={
                                                                    isMarking
                                                                }
                                                                onClick={() =>
                                                                    handleMarkNotificationRead(
                                                                        notification,
                                                                    )
                                                                }
                                                                className="
                                                                    absolute bottom-3
                                                                    right-3 flex
                                                                    h-7 w-7
                                                                    items-center
                                                                    justify-center
                                                                    rounded-md
                                                                    text-[#8792A1]
                                                                    opacity-100
                                                                    transition-colors
                                                                    hover:bg-[#26303C]
                                                                    hover:text-[#E6A15C]
                                                                    disabled:opacity-40
                                                                    sm:opacity-0
                                                                    sm:group-hover:opacity-100
                                                                    sm:group-focus-within:opacity-100
                                                                "
                                                            >
                                                                <Check
                                                                    size={14}
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )
                                    )}
                                </div>

                                {/* FOOTER */}

                                <div
                                    className="
                                        border-t border-[#252D38]
                                        bg-[#11161E] p-2.5
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeNotificationMenu();
                                            navigate(notificationPath);
                                        }}
                                        className="
                                            flex min-h-9 w-full
                                            items-center justify-center
                                            gap-2 rounded-md px-3
                                            text-[11px] font-semibold
                                            text-[#D7DEE8]
                                            transition-colors
                                            hover:bg-[#202834]
                                            hover:text-[#F1F3F5]
                                        "
                                    >
                                        View all notifications
                                        <ExternalLink
                                            size={13}
                                            strokeWidth={1.8}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DIVIDER */}

                    <div className="hidden h-6 w-px bg-[#252D38] sm:block" />

                    {/* ACCOUNT MENU */}

                    <div ref={userMenuRef} className="relative z-1010">
                        <button
                            type="button"
                            onClick={toggleUserMenu}
                            aria-expanded={isUserMenuVisible}
                            aria-haspopup="menu"
                            aria-controls="account-menu"
                            className="
                                group flex items-center
                                gap-2.5 rounded-md
                                px-1.5 py-1
                                transition-colors duration-150
                                hover:bg-[#181F28]
                                focus:outline-none
                            "
                        >
                            <div
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    overflow-hidden rounded-md
                                    border border-[#303A47]
                                    bg-[#1B222C]
                                    text-[10px] font-semibold
                                    text-[#F1F3F5]
                                    transition-colors
                                    group-hover:border-[#414D5C]
                                "
                            >
                                {showAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={userName}
                                        className="h-full w-full object-cover"
                                        onError={() => setUserAvatarError(true)}
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            <div className="hidden min-w-0 text-left sm:block">
                                <p
                                    className="
                                        max-w-37.5 truncate
                                        text-[12px]
                                        font-semibold leading-4
                                        text-[#E8EBEF]
                                    "
                                >
                                    {userName}
                                </p>
                            </div>

                            <ChevronDown
                                size={13}
                                strokeWidth={1.8}
                                className={`
                                    hidden text-[#657184]
                                    transition-transform duration-200
                                    sm:block
                                    group-hover:text-[#B8C0CC]
                                    ${
                                        isUserMenuVisible
                                            ? 'rotate-180 text-[#B8C0CC]'
                                            : ''
                                    }
                                `}
                            />
                        </button>

                        {isUserMenuVisible && (
                            <div
                                id="account-menu"
                                role="menu"
                                aria-label="Account menu"
                                className="
                                    absolute right-0
                                    top-[calc(100%+20px)]
                                    z-1020
                                    w-[min(320px,calc(100vw-24px))]
                                    overflow-hidden rounded-xl
                                    border border-[#29323E]
                                    bg-[#141922]
                                    shadow-[0_18px_55px_rgba(0,0,0,0.38)]
                                "
                            >
                                {/* ACCOUNT HEADER */}

                                <div
                                    className="
                                        flex items-center gap-3
                                        border-b border-[#252D38]
                                        bg-[#11161E] px-4 py-4
                                    "
                                >
                                    <div
                                        className="
                                            flex h-10 w-10 shrink-0
                                            items-center justify-center
                                            overflow-hidden rounded-lg
                                            border border-[#303A47]
                                            bg-[#1B222C]
                                            text-[11px] font-semibold
                                            text-[#F1F3F5]
                                        "
                                    >
                                        {showAvatar ? (
                                            <img
                                                src={userAvatar}
                                                alt={userName}
                                                className="h-full w-full object-cover"
                                                onError={() =>
                                                    setUserAvatarError(true)
                                                }
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-semibold text-[#F1F3F5]">
                                            {userName}
                                        </p>

                                        <p className="mt-0.5 truncate text-[10px] text-[#7F8998]">
                                            {userEmail || 'Account'}
                                        </p>
                                    </div>
                                </div>

                                {/* QUICK ACCESS */}

                                <div className="p-3">
                                    <p
                                        className="
                                            mb-2 px-1 text-[9px]
                                            font-semibold uppercase
                                            tracking-[0.14em]
                                            text-[#657184]
                                        "
                                    >
                                        Quick access
                                    </p>

                                    <div className="space-y-0.5">
                                        {quickActions.map(
                                            ({ label, icon: Icon, to }) => (
                                                <NavLink
                                                    key={to}
                                                    to={to}
                                                    onClick={closeUserMenu}
                                                    role="menuitem"
                                                    className="
                                                        group flex min-h-10
                                                        items-center gap-3
                                                        rounded-md px-2.5
                                                        transition-colors
                                                        duration-150
                                                        hover:bg-[#1B222C]
                                                    "
                                                >
                                                    <Icon
                                                        size={16}
                                                        strokeWidth={1.75}
                                                        className="
                                                            text-[#7F8998]
                                                            transition-colors
                                                            group-hover:text-[#CDD3DB]
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            text-[11px]
                                                            font-medium
                                                            text-[#B8C0CC]
                                                            group-hover:text-[#F1F3F5]
                                                        "
                                                    >
                                                        {label}
                                                    </span>
                                                </NavLink>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* SIGN OUT */}

                                <div className="border-t border-[#252D38] p-3">
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        role="menuitem"
                                        className="
                                            group flex min-h-10 w-full
                                            items-center gap-3
                                            rounded-md px-2.5
                                            text-left
                                            transition-colors duration-150
                                            hover:bg-[#38272C]
                                            focus:outline-none
                                        "
                                    >
                                        <LogOut
                                            size={16}
                                            strokeWidth={1.75}
                                            className="
                                                text-[#B08B91]
                                                group-hover:text-[#E9A1A8]
                                            "
                                        />

                                        <span
                                            className="
                                                text-[11px]
                                                font-medium
                                                text-[#CBA2A7]
                                                group-hover:text-[#E9A1A8]
                                            "
                                        >
                                            Sign out
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
