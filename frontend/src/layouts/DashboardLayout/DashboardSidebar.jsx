import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import logo from '@/assets/shared/footerLogo.png';

import {
    LogOut,
    ChevronRight,
    UserRound,
    Settings,
    CircleHelp,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';

import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

// ============================================================
// MOCK USERS
// ============================================================

const MOCK_USERS = {
    individual: {
        name: 'Maria Santos',
        avatar: null,
    },

    organization: {
        name: 'Bayanihan Foundation',
        avatar: null,
    },

    admin: {
        name: 'SP Admin',
        avatar: null,
    },
};

// ============================================================
// ROUTES
// ============================================================

const ROOT_PATHS = {
    individual: '/individual/dashboard',
    organization: '/organization/dashboard',
    admin: '/admin/dashboard',
};

const PROFILE_PATHS = {
    individual: '/individual/dashboard/profile',
    organization: '/organization/dashboard/profile',
    admin: null,
};

const SETTINGS_PATHS = {
    individual: '/individual/dashboard/settings',
    organization: '/organization/dashboard/settings',
    admin: '/admin/dashboard/settings',
};

// ============================================================
// SHARED CLASSES
// ============================================================

const MENU_ITEM_BASE =
    'group flex w-full items-center gap-3 px-4 py-3 text-[11px] whitespace-nowrap transition-colors duration-200';

const MENU_ITEM_MUTED = 'text-white/55 hover:bg-white/5 hover:text-white';

const MENU_ICON =
    'h-4 w-4 shrink-0 text-white/30 transition-colors duration-200 group-hover:text-white/65';

const MENU_CHEVRON = 'h-3.5 w-3.5 shrink-0 text-white/20';

// ============================================================
// HELPERS
// ============================================================

const getInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

const isRootDashboard = (path) => Object.values(ROOT_PATHS).includes(path);

const isItemActive = (item, currentPath) => {
    if (!item?.path) {
        return false;
    }

    if (isRootDashboard(item.path)) {
        return currentPath === item.path;
    }

    return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
};

// ============================================================
// ACCOUNT AVATAR
// ============================================================

const AccountAvatar = ({ user, initials }) => (
    <div
        className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-[#e6f1ef]
            text-[9px]
            font-bold
            text-[#0b5f5b]
        "
    >
        {user.avatar ? (
            <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
            />
        ) : (
            initials
        )}
    </div>
);

// ============================================================
// ACCOUNT LINK
// ============================================================

const AccountLink = ({ to, icon: Icon, children, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={`${MENU_ITEM_BASE} ${MENU_ITEM_MUTED}`}
    >
        <Icon className={MENU_ICON} strokeWidth={1.7} />

        <span className="min-w-0 flex-1 truncate">{children}</span>

        <ChevronRight className={MENU_CHEVRON} strokeWidth={1.7} />
    </NavLink>
);

// ============================================================
// DASHBOARD SIDEBAR
// ============================================================

const DashboardSidebar = ({
    role,
    currentPath,
    collapsed,
    onCollapsedChange,
}) => {
    const navigate = useNavigate();

    const [accountOpen, setAccountOpen] = useState(false);

    const navItems = NAV_CONFIG[role] || [];

    const user = MOCK_USERS[role] || MOCK_USERS.individual;

    const roleLabel = ROLE_LABELS[role] || 'User';

    const profilePath = PROFILE_PATHS[role];

    const settingsPath = SETTINGS_PATHS[role];

    const initials = getInitials(user.name);

    // ========================================================
    // ACCOUNT
    // ========================================================

    const closeAccountMenu = () => {
        setAccountOpen(false);
    };

    const toggleAccountMenu = () => {
        setAccountOpen((previous) => !previous);
    };

    // ========================================================
    // SIGN OUT
    // ========================================================

    const handleSignOut = () => {
        setAccountOpen(false);
        navigate('/');
    };

    // ========================================================
    // SIDEBAR TOGGLE
    // ========================================================

    const toggleSidebar = () => {
        if (collapsed) {
            onCollapsedChange(false);
            return;
        }

        setAccountOpen(false);
        onCollapsedChange(true);
    };

    return (
        <aside
            className={`
                fixed
                inset-y-0
                left-0
                z-50
                hidden
                overflow-hidden
                bg-[#0d625d]
                lg:flex
                transition-[width]
                duration-300
                ease-in-out
                ${collapsed ? 'w-15' : 'w-72'}
            `}
        >
            {/* =====================================================
                SIDEBAR INNER SHELL

                This remains 288px wide internally so the expanded
                layout does not reflow its content during animation.

                The OUTER aside controls the actual occupied width.
                Therefore when collapsed, only the 60px rail occupies
                page space.
            ===================================================== */}

            <div
                className="
                    flex
                    h-full
                    w-72
                    shrink-0
                "
            >
                {/* =====================================================
                    ICON RAIL
                ===================================================== */}

                <div
                    className="
                        flex
                        w-15
                        shrink-0
                        flex-col
                        border-r
                        border-white/7
                        bg-[#09534f]
                    "
                >
                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <div
                        className="
                            flex
                            h-20
                            shrink-0
                            items-center
                            justify-center
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                            "
                        >
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="
                                    h-7
                                    w-7
                                    object-contain
                                "
                            />
                        </div>
                    </div>

                    {/* =================================================
                        RAIL NAVIGATION
                    ================================================= */}

                    <nav
                        aria-label="Quick navigation"
                        className="
                            flex
                            min-h-0
                            flex-1
                            flex-col
                            items-center
                            overflow-y-auto
                            pt-7
                        "
                    >
                        {navItems.map((item, index) => {
                            if (item.type === 'divider') {
                                return (
                                    <div
                                        key={`rail-divider-${index}`}
                                        className="
                                                my-4
                                                h-px
                                                w-6
                                                shrink-0
                                                bg-white/9
                                            "
                                    />
                                );
                            }

                            if (!item.path || !item.icon) {
                                return null;
                            }

                            const Icon = item.icon;

                            const isActive = isItemActive(item, currentPath);

                            return (
                                <NavLink
                                    key={item.key}
                                    to={item.path}
                                    end={isRootDashboard(item.path)}
                                    aria-label={item.label}
                                    title={item.label}
                                    className="
                                            group
                                            relative
                                            flex
                                            h-12
                                            w-full
                                            shrink-0
                                            items-center
                                            justify-center
                                        "
                                >
                                    {/* Active indicator */}

                                    {isActive && (
                                        <span
                                            className="
                                                    absolute
                                                    left-0
                                                    h-6
                                                    w-0.75
                                                    rounded-r-full
                                                    bg-accent
                                                "
                                        />
                                    )}

                                    {/* Icon */}

                                    <span
                                        className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-[10px]
                                                transition-all
                                                duration-200
                                                ${
                                                    isActive
                                                        ? 'bg-[#e6f1ef] text-[#0b5f5b] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                                        : 'text-white/38 group-hover:bg-white/6 group-hover:text-white/75'
                                                }
                                            `}
                                    >
                                        <Icon
                                            className="
                                                    h-4.5
                                                    w-4.5
                                                    shrink-0
                                                "
                                            strokeWidth={isActive ? 2 : 1.7}
                                        />
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* =================================================
                        RAIL FOOTER
                    ================================================= */}

                    <div
                        className="
                            flex
                            h-20
                            shrink-0
                            flex-col
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            aria-label={
                                collapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                            title={
                                collapsed
                                    ? 'Expand sidebar'
                                    : 'Collapse sidebar'
                            }
                            className="
                                group
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white/6
                                text-white/75
                                transition-colors
                                duration-200
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            {collapsed ? (
                                <PanelLeftOpen
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
                                    "
                                    strokeWidth={1.7}
                                />
                            ) : (
                                <PanelLeftClose
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
                                    "
                                    strokeWidth={1.7}
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    MAIN PANEL

                    IMPORTANT:
                    This panel is removed from the visible layout when
                    collapsed by using width 0 + overflow hidden.

                    The outer <aside> also becomes w-15, so the main
                    content shell can reduce from pl-72 to pl-15.
                ===================================================== */}

                <div
                    className={`
                        flex
                        h-full
                        shrink-0
                        flex-col
                        overflow-hidden
                        bg-[#0d625d]
                        transition-[width,opacity,transform]
                        duration-300
                        ease-in-out
                        ${
                            collapsed
                                ? `
                                    pointer-events-none
                                    w-0
                                    -translate-x-2
                                    opacity-0
                                `
                                : `
                                    w-57
                                    translate-x-0
                                    opacity-100
                                `
                        }
                    `}
                >
                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <header
                        className="
                            shrink-0
                            px-6
                            pt-7
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-3
                            "
                        >
                            {/* Brand */}

                            <div className="shrink-0">
                                <p
                                    className="
                                        whitespace-nowrap
                                        text-[8px]
                                        font-bold
                                        uppercase
                                        tracking-[0.22em]
                                        text-white/30
                                    "
                                >
                                    Platform
                                </p>

                                <div
                                    className="
                                        mt-1
                                        whitespace-nowrap
                                        font-fraunces
                                        text-[22px]
                                        font-semibold
                                        leading-[0.9]
                                        tracking-[-0.045em]
                                        text-white
                                    "
                                >
                                    Stand
                                    <span className="text-accent"> For</span>
                                </div>

                                <div
                                    className="
                                        mt-1
                                        whitespace-nowrap
                                        font-fraunces
                                        text-[22px]
                                        font-semibold
                                        leading-[0.9]
                                        tracking-[-0.045em]
                                        text-white
                                    "
                                >
                                    People
                                </div>
                            </div>

                            {/* Role */}

                            <span
                                className="
                                    mt-1
                                    shrink-0
                                    whitespace-nowrap
                                    rounded-full
                                    border
                                    border-white/10
                                    bg-white/15
                                    px-2
                                    py-1
                                    text-[7px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-white
                                "
                            >
                                {roleLabel}
                            </span>
                        </div>

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                gap-2
                                whitespace-nowrap
                            "
                        >
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    rounded-full
                                    bg-accent
                                "
                            />

                            <span
                                className="
                                    whitespace-nowrap
                                    text-[9px]
                                    font-medium
                                    text-white/40
                                "
                            >
                                Manage your workspace
                            </span>
                        </div>

                        <div
                            className="
                                mt-6
                                h-px
                                bg-white/9
                            "
                        />
                    </header>

                    {/* =================================================
                        NAVIGATION
                    ================================================= */}

                    <nav
                        aria-label="Dashboard navigation"
                        className="
                            min-h-0
                            flex-1
                            overflow-x-hidden
                            overflow-y-auto
                            px-4
                            py-7
                            scrollbar-thin
                        "
                    >
                        <div className="px-3">
                            <p
                                className="
                                    whitespace-nowrap
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.20em]
                                    text-white/25
                                "
                            >
                                Navigation
                            </p>
                        </div>

                        <div className="mt-4">
                            {navItems.map((item, index) => {
                                if (item.type === 'divider') {
                                    return (
                                        <div
                                            key={`divider-${index}`}
                                            className="
                                                    my-5
                                                    px-3
                                                "
                                        >
                                            <div className="h-px bg-white/8" />
                                        </div>
                                    );
                                }

                                if (!item.path) {
                                    return null;
                                }

                                const isActive = isItemActive(
                                    item,
                                    currentPath,
                                );

                                return (
                                    <NavLink
                                        key={item.key}
                                        to={item.path}
                                        end={isRootDashboard(item.path)}
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                        className={`
                                                group
                                                relative
                                                flex
                                                h-11
                                                w-full
                                                shrink-0
                                                items-center
                                                px-3
                                                whitespace-nowrap
                                                transition-colors
                                                duration-200
                                                ${
                                                    isActive
                                                        ? 'text-white'
                                                        : 'text-white/45 hover:text-white/80'
                                                }
                                            `}
                                    >
                                        {/* Accent dot */}

                                        <span
                                            className={`
                                                    mr-3
                                                    h-1.5
                                                    w-1.5
                                                    shrink-0
                                                    rounded-full
                                                    bg-accent
                                                    transition-all
                                                    duration-200
                                                    ${
                                                        isActive
                                                            ? 'scale-100 opacity-100'
                                                            : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                                                    }
                                                `}
                                        />

                                        {/* Label */}

                                        <span
                                            className={`
                                                    block
                                                    shrink-0
                                                    whitespace-nowrap
                                                    text-[12px]
                                                    tracking-[-0.01em]
                                                    transition-all
                                                    duration-200
                                                    ${
                                                        isActive
                                                            ? 'font-semibold'
                                                            : 'font-medium'
                                                    }
                                                `}
                                        >
                                            {item.label}
                                        </span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </nav>

                    {/* =================================================
                        ACCOUNT AREA
                    ================================================= */}

                    <div
                        className="
                            relative
                            shrink-0
                        "
                    >
                        {/* =================================================
                            ACCOUNT POPUP
                        ================================================= */}

                        {accountOpen && (
                            <div
                                className="
                                    absolute
                                    bottom-[calc(100%-8px)]
                                    left-4
                                    right-4
                                    z-30
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-[#084c49]
                                    shadow-[0_20px_45px_rgba(0,0,0,0.25)]
                                "
                            >
                                {/* User */}

                                <div className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <AccountAvatar
                                            user={user}
                                            initials={initials}
                                        />

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    truncate
                                                    whitespace-nowrap
                                                    text-[11px]
                                                    font-semibold
                                                    text-white
                                                "
                                            >
                                                {user.name}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    whitespace-nowrap
                                                    text-[7px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-white/30
                                                "
                                            >
                                                {roleLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/8" />

                                {/* Profile */}

                                {profilePath && (
                                    <AccountLink
                                        to={profilePath}
                                        icon={UserRound}
                                        onClick={closeAccountMenu}
                                    >
                                        Profile
                                    </AccountLink>
                                )}

                                {/* Settings */}

                                {settingsPath && (
                                    <AccountLink
                                        to={settingsPath}
                                        icon={Settings}
                                        onClick={closeAccountMenu}
                                    >
                                        Account settings
                                    </AccountLink>
                                )}

                                {/* Help */}

                                <AccountLink
                                    to="/help"
                                    icon={CircleHelp}
                                    onClick={closeAccountMenu}
                                >
                                    Help & support
                                </AccountLink>

                                <div className="mx-4 h-px bg-white/8" />

                                {/* Sign out */}

                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className={`
                                        ${MENU_ITEM_BASE}
                                        ${MENU_ITEM_MUTED}
                                        text-left
                                    `}
                                >
                                    <LogOut
                                        className="
                                            h-4
                                            w-4
                                            shrink-0
                                            text-white/25
                                            transition-colors
                                            duration-200
                                            group-hover:text-white/50
                                        "
                                        strokeWidth={1.7}
                                    />

                                    <span className="whitespace-nowrap">
                                        Sign out
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* =================================================
                            ACCOUNT TRIGGER
                        ================================================= */}

                        <div
                            className="
                                border-t
                                border-white/9
                                px-5
                                py-4
                            "
                        >
                            <button
                                type="button"
                                onClick={toggleAccountMenu}
                                aria-expanded={accountOpen}
                                aria-haspopup="menu"
                                className="
                                    group
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    text-left
                                "
                            >
                                {/* Avatar */}

                                <div className="relative shrink-0">
                                    <AccountAvatar
                                        user={user}
                                        initials={initials}
                                    />

                                    <span
                                        className="
                                            absolute
                                            bottom-0
                                            right-0
                                            h-2
                                            w-2
                                            rounded-full
                                            border-2
                                            border-[#0d625d]
                                            bg-[#72c6a2]
                                        "
                                    />
                                </div>

                                {/* User information */}

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="
                                            truncate
                                            whitespace-nowrap
                                            text-[11px]
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        {user.name}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            truncate
                                            whitespace-nowrap
                                            text-[7px]
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-white/30
                                        "
                                    >
                                        {roleLabel}
                                    </p>
                                </div>

                                {/* Arrow */}

                                <ChevronRight
                                    className={`
                                        h-4
                                        w-4
                                        shrink-0
                                        text-white/25
                                        transition-transform
                                        duration-200
                                        ${accountOpen ? 'rotate-90' : ''}
                                    `}
                                    strokeWidth={1.7}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
