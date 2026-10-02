import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    ExternalLink,
    LogOut,
    Settings,
    UserCircle,
} from 'lucide-react';

import logo from '@/assets/shared/logo.png';
import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

/* ==========================================================================
   PATHS
============================================================================ */

const PROFILE_PATHS = {
    individual: '/individual/dashboard/profile',
    organization: '/organization/dashboard/profile',
    admin: '/admin/dashboard/profile',
};

const SETTINGS_PATHS = {
    individual: '/individual/dashboard/settings',
    organization: '/organization/dashboard/settings',
    admin: '/admin/dashboard/settings',
};

/* ==========================================================================
   HELPERS
============================================================================ */

const normalizePath = (path = '') => {
    if (!path) return '/';

    const normalized = path.replace(/\/+$/, '');

    return normalized || '/';
};

const isPathActive = (itemPath, currentPath) => {
    if (!itemPath) return false;

    const target = normalizePath(itemPath);
    const current = normalizePath(currentPath);

    const isDashboardRoot =
        target === '/individual/dashboard' ||
        target === '/organization/dashboard' ||
        target === '/admin/dashboard';

    if (isDashboardRoot) {
        return current === target;
    }

    return current === target || current.startsWith(`${target}/`);
};

const hasActiveChild = (item, currentPath) => {
    if (!item?.children?.length) {
        return false;
    }

    return item.children.some((child) => {
        if (isPathActive(child.path, currentPath)) {
            return true;
        }

        return hasActiveChild(child, currentPath);
    });
};

const isNavItemActive = (item, currentPath) => {
    if (!item) return false;

    if (isPathActive(item.path, currentPath)) {
        return true;
    }

    return hasActiveChild(item, currentPath);
};

const getInitials = (value = '') => {
    const cleaned = value.trim();

    if (!cleaned) return 'SP';

    return cleaned
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
};

const getStoredUser = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const sources = [
        window.localStorage.getItem('user'),
        window.sessionStorage.getItem('user'),
    ];

    for (const source of sources) {
        if (!source) continue;

        try {
            const parsed = JSON.parse(source);

            return parsed?.user || parsed;
        } catch {
            // Ignore malformed values.
        }
    }

    return null;
};

const getUserName = (user, role) => {
    return (
        user?.name ||
        user?.username ||
        user?.full_name ||
        user?.fullName ||
        user?.organization_name ||
        user?.organizationName ||
        user?.email ||
        ROLE_LABELS[role] ||
        'Account'
    );
};

const getUserEmail = (user) => user?.email || '';

const getUserAvatar = (user) =>
    user?.avatar ||
    user?.avatar_url ||
    user?.avatarUrl ||
    user?.profile_image ||
    user?.profileImage ||
    null;

/* ==========================================================================
   SECTION LABEL
============================================================================ */

const SectionLabel = ({ label, collapsed }) => {
    if (collapsed) {
        return (
            <div
                className="
                    flex
                    h-7
                    items-center
                    justify-center
                "
                aria-hidden="true"
            >
                <span
                    className="
                        h-px
                        w-4
                        bg-[#343944]
                    "
                />
            </div>
        );
    }

    return (
        <div
            className="
                mb-1.5
                mt-5
                px-3
                first:mt-0
            "
        >
            <p
                className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.17em]
                    !text-[#6F7785]
                "
            >
                {label}
            </p>
        </div>
    );
};

/* ==========================================================================
   SUB MENU
============================================================================ */

const SubMenu = ({ item, currentPath, open, collapsed, onNavigate }) => {
    if (!item.children?.length || collapsed || !open) {
        return null;
    }

    return (
        <div
            className="
                relative
                ml-7
                mt-1
                space-y-0.5
                pb-1
                pl-3

                before:absolute
                before:bottom-1
                before:left-0
                before:top-0
                before:w-px
                before:bg-[#343944]
            "
        >
            {item.children.map((child) => {
                const active = isNavItemActive(child, currentPath);

                return (
                    <Link
                        key={child.key}
                        to={child.path}
                        onClick={onNavigate}
                        className={`
                                group/sub
                                relative

                                flex
                                min-h-8
                                items-center
                                gap-2.5

                                rounded-md

                                px-2.5

                                text-[11.5px]
                                font-medium

                                transition-colors
                                duration-150

                                ${
                                    active
                                        ? `
                                            bg-[#303641]
                                            !text-[#F1F2F4]
                                        `
                                        : `
                                            !text-[#8B93A1]

                                            hover:bg-[#2C303A]
                                            hover:!text-[#D3D6DC]
                                        `
                                }
                            `}
                    >

                        <span className="min-w-0 truncate">{child.label} </span>
                    </Link>
                );
            })}
        </div>
    );
};

/* ==========================================================================
   NAV ITEM
============================================================================ */

const NavItem = ({
    item,
    currentPath,
    collapsed,
    open,
    onToggle,
    onNavigate,
}) => {
    const Icon = item.icon;

    const hasChildren = Boolean(item.children?.length);

    const active = isNavItemActive(item, currentPath);

    const childActive = hasActiveChild(item, currentPath);

    /* ======================================================================
       DIRECT ITEM
    ====================================================================== */

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={`
                    group
                    relative

                    flex
                    min-h-10
                    items-center

                    rounded-md

                    transition-colors
                    duration-150

                    ${
                        collapsed
                            ? `
                                mx-auto
                                w-10
                                justify-center
                            `
                            : `
                                w-full
                                gap-3
                                px-3
                            `
                    }

                    ${
                        active
                            ? `
                                bg-[#303641]
                                !text-[#F1F2F4]
                            `
                            : `
                                !text-[#C3C7CF]

                                hover:bg-[#2C303A]
                                hover:!text-[#F1F2F4]
                            `
                    }
                `}
            >
                {active && (
                    <span
                        className="
                            absolute
                            bottom-2.5
                            left-0
                            top-2.5

                            w-0.5

                            rounded-r-full

                            bg-[#D1D4DB]
                        "
                    />
                )}

                {Icon && (
                    <Icon
                        size={17}
                        strokeWidth={1.7}
                        className={`
                            shrink-0

                            transition-colors
                            duration-150

                            ${
                                active
                                    ? '!text-[#E5E7EB]'
                                    : `
                                        !text-[#969EAC]
                                        group-hover:!text-[#D3D6DC]
                                    `
                            }
                        `}
                    />
                )}

                {!collapsed && (
                    <span
                        className={`
                            min-w-0
                            flex-1
                            truncate

                            text-[13px]

                            ${active ? 'font-semibold' : 'font-medium'}
                        `}
                    >
                        {item.label}
                    </span>
                )}
            </Link>
        );
    }

    /* ======================================================================
       EXPANDABLE ITEM
    ====================================================================== */

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                title={collapsed ? item.label : undefined}
                aria-expanded={open}
                className={`
                    group

                    flex
                    min-h-10
                    items-center

                    rounded-md

                    text-left

                    transition-colors
                    duration-150

                    ${
                        collapsed
                            ? `
                                mx-auto
                                w-10
                                justify-center
                            `
                            : `
                                w-full
                                gap-3
                                px-3
                            `
                    }

                    ${
                        childActive
                            ? `
                                !text-[#F1F2F4]
                            `
                            : `
                                !text-[#C3C7CF]

                                hover:bg-[#2C303A]
                                hover:!text-[#F1F2F4]
                            `
                    }
                `}
            >
                {Icon && (
                    <Icon
                        size={17}
                        strokeWidth={1.7}
                        className={`
                            shrink-0

                            ${
                                childActive
                                    ? '!text-[#D3D6DC]'
                                    : `
                                        !text-[#969EAC]
                                        group-hover:!text-[#D3D6DC]
                                    `
                            }
                        `}
                    />
                )}

                {!collapsed && (
                    <>
                        <span
                            className={`
                                min-w-0
                                flex-1
                                truncate

                                text-[13px]

                                ${childActive ? 'font-semibold' : 'font-medium'}
                            `}
                        >
                            {item.label}
                        </span>

                        <ChevronDown
                            size={13}
                            strokeWidth={1.8}
                            className={`
                                shrink-0

                                !text-[#6F7785]

                                transition-transform
                                duration-200

                                group-hover:!text-[#C3C7CF]

                                ${open ? 'rotate-180' : ''}
                            `}
                        />
                    </>
                )}
            </button>

            <SubMenu
                item={item}
                currentPath={currentPath}
                open={open}
                collapsed={collapsed}
                onNavigate={onNavigate}
            />
        </div>
    );
};

/* ==========================================================================
   ACCOUNT MENU
============================================================================ */

const AccountMenu = ({
    role,
    userName,
    userEmail,
    avatar,
    onClose,
    onSignOut,
}) => {
    const profilePath = PROFILE_PATHS[role];

    const settingsPath = SETTINGS_PATHS[role];

    const menuItemClass = `
        group

        flex
        min-h-10
        items-center
        gap-3

        rounded-md

        px-3

        text-[12px]
        font-medium

        !text-[#C3C7CF]

        transition-colors
        duration-150

        hover:bg-[#303641]
        hover:!text-[#F1F2F4]
    `;

    return (
        <div
            className="
                absolute
                bottom-[calc(100%+10px)]
                left-1
                right-1

                overflow-hidden

                rounded-lg

                border
                border-[#343944]

                bg-[#272B34]

                shadow-[0_18px_50px_rgba(7,8,11,0.3)]
            "
        >
            <div
                className="
                    border-b
                    border-[#343944]

                    bg-[#24272F]

                    px-3.5
                    py-3.5
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden

                            rounded-md

                            border
                            border-[#404754]

                            bg-[#303641]

                            text-[10.5px]
                            font-semibold

                            !text-[#F1F2F4]
                        "
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={userName}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                        ) : (
                            getInitials(userName)
                        )}
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                truncate

                                text-[12.5px]
                                font-semibold

                                !text-[#F1F2F4]
                            "
                        >
                            {userName}
                        </p>

                        <p
                            className="
                                mt-0.5
                                truncate

                                text-[10px]

                                !text-[#9299A6]
                            "
                        >
                            {userEmail || ROLE_LABELS[role]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-2">
                {profilePath && (
                    <Link
                        to={profilePath}
                        onClick={onClose}
                        className={menuItemClass}
                    >
                        <UserCircle
                            size={16}
                            strokeWidth={1.7}
                            className="
                                !text-[#969EAC]
                                group-hover:!text-[#D3D6DC]
                            "
                        />

                        <span>Profile</span>
                    </Link>
                )}

                {settingsPath && (
                    <Link
                        to={settingsPath}
                        onClick={onClose}
                        className={menuItemClass}
                    >
                        <Settings
                            size={16}
                            strokeWidth={1.7}
                            className="
                                !text-[#969EAC]
                                group-hover:!text-[#D3D6DC]
                            "
                        />

                        <span>Settings</span>
                    </Link>
                )}

                <a href="/contact" className={menuItemClass}>
                    <CircleHelp
                        size={16}
                        strokeWidth={1.7}
                        className="
                            !text-[#969EAC]
                            group-hover:!text-[#D3D6DC]
                        "
                    />

                    <span className="flex-1">Help & Support</span>

                    <ExternalLink
                        size={12}
                        strokeWidth={1.7}
                        className="
                            !text-[#6F7785]
                        "
                    />
                </a>
            </div>

            <div
                className="
                    border-t
                    border-[#343944]

                    p-2
                "
            >
                <button
                    type="button"
                    onClick={onSignOut}
                    className="
                        flex
                        min-h-10
                        w-full
                        items-center
                        gap-3

                        rounded-md

                        px-3

                        text-left
                        text-[12px]
                        font-medium

                        !text-[#CBA2A7]

                        transition-colors
                        duration-150

                        hover:bg-[#38272C]
                        hover:!text-[#E9A1A8]
                    "
                >
                    <LogOut size={16} strokeWidth={1.7} />

                    <span>Sign out</span>
                </button>
            </div>
        </div>
    );
};

/* ==========================================================================
   SIDEBAR
============================================================================ */

const DashboardSidebar = ({
    role,
    currentPath,
    collapsed = true,
    onCollapsedChange,
    user: providedUser,
}) => {
    const navigate = useNavigate();

    const accountRef = useRef(null);

    const [accountOpen, setAccountOpen] = useState(false);

    const [openMenus, setOpenMenus] = useState({});

    const navItems = useMemo(() => NAV_CONFIG[role] || [], [role]);

    const storedUser = useMemo(() => getStoredUser(), []);

    const user = providedUser || storedUser;

    const userName = getUserName(user, role);

    const userEmail = getUserEmail(user);

    const avatar = getUserAvatar(user);

    /* ======================================================================
       OUTSIDE CLICK
    ====================================================================== */

    useEffect(() => {
        if (!accountOpen) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (
                accountRef.current &&
                !accountRef.current.contains(event.target)
            ) {
                setAccountOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
        };
    }, [accountOpen]);

    /* ======================================================================
       MENUS
    ====================================================================== */

    const isMenuOpen = (item) => {
        const explicit = Object.prototype.hasOwnProperty.call(
            openMenus,
            item.key,
        );

        if (explicit) {
            return openMenus[item.key];
        }

        return hasActiveChild(item, currentPath);
    };

    const toggleMenu = (item) => {
        if (collapsed) {
            onCollapsedChange?.(false);

            setOpenMenus((previous) => ({
                ...previous,
                [item.key]: true,
            }));

            return;
        }

        setOpenMenus((previous) => {
            const explicit = Object.prototype.hasOwnProperty.call(
                previous,
                item.key,
            );

            const currentlyOpen = explicit
                ? previous[item.key]
                : hasActiveChild(item, currentPath);

            return {
                ...previous,
                [item.key]: !currentlyOpen,
            };
        });
    };

    /* ======================================================================
       COLLAPSE
    ====================================================================== */

    const handleCollapseToggle = () => {
        if (!collapsed) {
            setAccountOpen(false);
        }

        onCollapsedChange?.(!collapsed);
    };

    /* ======================================================================
       SIGN OUT
    ====================================================================== */

    const handleSignOut = () => {
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('authToken');

        window.sessionStorage.removeItem('auth_token');
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('authToken');

        navigate('/');
    };

    return (
        <aside
            className={`
                fixed
                inset-y-0
                left-0
                z-40

                hidden
                flex-col

                border-r
                border-[#343944]

                bg-[#22252D]

                lg:flex

                ${collapsed ? 'w-[60px]' : 'w-[264px]'}

                transition-[width]
                duration-300
                ease-out
            `}
        >
            {/* =============================================================
                BRAND
            ============================================================= */}

            <div
                className={`
                    flex
                    h-16
                    shrink-0
                    items-center

                    border-b
                    border-[#343944]

                    bg-[#20232A]

                    ${
                        collapsed
                            ? `
                                justify-center
                                px-2
                            `
                            : 'px-4'
                    }
                `}
            >
                <Link
                    to="/"
                    title={collapsed ? 'Stand For People' : undefined}
                    className={`
                        flex
                        min-w-0
                        items-center

                        ${collapsed ? 'justify-center' : 'gap-2.5'}
                    `}
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                        "
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <p
                                className="
                                    truncate

                                    text-[13px]
                                    font-semibold
                                    tracking-[-0.01em]

                                    !text-[#F1F2F4]
                                "
                            >
                                Stand For People
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate

                                    text-[8.5px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.15em]

                                    !text-[#6F7785]
                                "
                            >
                                {ROLE_LABELS[role]} workspace
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            {/* =============================================================
                NAVIGATION
            ============================================================= */}

            <nav
                className={`
                    min-h-0
                    flex-1

                    overflow-x-hidden
                    overflow-y-auto

                    py-4

                    ${collapsed ? 'px-2' : 'px-3'}

                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#343944]

                    hover:[&::-webkit-scrollbar-thumb]:bg-[#404754]
                `}
            >
                <div className="space-y-1">
                    {navItems.map((item) => {
                        if (item.type === 'section') {
                            return (
                                <SectionLabel
                                    key={item.key}
                                    label={item.label}
                                    collapsed={collapsed}
                                />
                            );
                        }

                        return (
                            <NavItem
                                key={item.key}
                                item={item}
                                currentPath={currentPath}
                                collapsed={collapsed}
                                open={isMenuOpen(item)}
                                onToggle={() => toggleMenu(item)}
                                onNavigate={() => setAccountOpen(false)}
                            />
                        );
                    })}
                </div>
            </nav>

            {/* =============================================================
                ACCOUNT
            ============================================================= */}

            <div
                ref={accountRef}
                className="
                    relative
                    shrink-0

                    border-t
                    border-[#343944]

                    bg-[#20232A]

                    p-2
                "
            >
                {!collapsed && accountOpen && (
                    <AccountMenu
                        role={role}
                        userName={userName}
                        userEmail={userEmail}
                        avatar={avatar}
                        onClose={() => setAccountOpen(false)}
                        onSignOut={handleSignOut}
                    />
                )}

                <button
                    type="button"
                    onClick={() => {
                        if (collapsed) {
                            onCollapsedChange?.(false);

                            return;
                        }

                        setAccountOpen((previous) => !previous);
                    }}
                    title={collapsed ? userName : undefined}
                    className={`
                        group

                        flex
                        min-h-12
                        items-center

                        rounded-md

                        transition-colors
                        duration-150

                        ${
                            collapsed
                                ? `
                                    w-full
                                    justify-center
                                `
                                : `
                                    w-full
                                    gap-2.5
                                    px-2
                                `
                        }

                        ${accountOpen ? 'bg-[#303641]' : 'hover:bg-[#2C303A]'}
                    `}
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden

                            rounded-md

                            border
                            border-[#404754]

                            bg-[#303641]

                            text-[10px]
                            font-semibold

                            !text-[#F1F2F4]
                        "
                    >
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={userName}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                        ) : (
                            getInitials(userName)
                        )}
                    </div>

                    {!collapsed && (
                        <>
                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    text-left
                                "
                            >
                                <p
                                    className="
                                        truncate

                                        text-[12px]
                                        font-semibold

                                        !text-[#E5E7EB]
                                    "
                                >
                                    {userName}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        truncate

                                        text-[9.5px]

                                        !text-[#9299A6]
                                    "
                                >
                                    {ROLE_LABELS[role]}
                                </p>
                            </div>

                            <ChevronDown
                                size={13}
                                strokeWidth={1.8}
                                className={`
                                    shrink-0

                                    !text-[#6F7785]

                                    transition-transform
                                    duration-200

                                    group-hover:!text-[#C3C7CF]

                                    ${accountOpen ? 'rotate-180' : ''}
                                `}
                            />
                        </>
                    )}
                </button>
            </div>

            {/* =============================================================
                COLLAPSE
            ============================================================= */}

            <button
                type="button"
                onClick={handleCollapseToggle}
                aria-label={
                    collapsed
                        ? 'Expand dashboard sidebar'
                        : 'Collapse dashboard sidebar'
                }
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="
                    absolute
                    -right-3
                    top-21

                    flex
                    h-6
                    w-6
                    items-center
                    justify-center

                    rounded-md

                    border
                    border-[#404754]

                    bg-[#272B34]

                    !text-[#9299A6]

                    shadow-[0_3px_10px_rgba(7,8,11,0.25)]

                    transition-colors
                    duration-150

                    hover:border-[#505866]
                    hover:bg-[#303641]
                    hover:!text-[#F1F2F4]
                "
            >
                {collapsed ? (
                    <ChevronRight size={13} strokeWidth={2} />
                ) : (
                    <ChevronLeft size={13} strokeWidth={2} />
                )}
            </button>
        </aside>
    );
};

export default DashboardSidebar;
