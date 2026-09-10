import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import logo from '@/assets/shared/footerLogo.png';

import {
    X,
    LogOut,
    UserRound,
    Settings,
    CircleHelp,
    ChevronRight,
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
// Keep these identical to DashboardSidebar
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

const AccountAvatar = ({ user, initials, size = 'normal' }) => (
    <div
        className={`
            flex
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-[#e6f1ef]
            font-bold
            text-[#0b5f5b]
            ${size === 'small' ? 'h-8 w-8 text-[9px]' : 'h-9 w-9 text-[10px]'}
        `}
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
// ACCOUNT MENU LINK
// ============================================================

const AccountMenuLink = ({ to, icon: Icon, children, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-[12px]
            font-medium
            text-white/65
            whitespace-nowrap
            transition-colors
            duration-200
            hover:bg-white/8
            hover:text-white
        "
    >
        <Icon
            className="
                h-4
                w-4
                shrink-0
                text-white/40
                transition-colors
                duration-200
                group-hover:text-white
            "
            strokeWidth={1.8}
        />

        <span className="min-w-0 flex-1 truncate">{children}</span>

        <ChevronRight
            className="
                h-3.5
                w-3.5
                shrink-0
                text-white/20
            "
            strokeWidth={1.8}
        />
    </NavLink>
);

// ============================================================
// MOBILE NAV
// ============================================================

const DashboardMobileNav = ({ role, currentPath, open, onClose }) => {
    const navigate = useNavigate();

    const [accountOpen, setAccountOpen] = useState(false);

    const navItems = NAV_CONFIG[role] || [];

    const user = MOCK_USERS[role] || MOCK_USERS.individual;

    const roleLabel = ROLE_LABELS[role] || 'User';

    const profilePath = PROFILE_PATHS[role];

    const settingsPath = SETTINGS_PATHS[role];

    const rootPath = ROOT_PATHS[role] || ROOT_PATHS.individual;

    const initials = getInitials(user.name);

    // ========================================================
    // CLOSE AFTER ROUTE CHANGE
    // ========================================================

    useEffect(() => {
        if (open) {
            onClose();
        }

        // currentPath intentionally controls this behavior.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    // ========================================================
    // LOCK BODY SCROLL
    // ========================================================

    useEffect(() => {
        if (!open) {
            document.body.style.overflow = '';
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

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
        onClose();
        navigate('/');
    };

    // ========================================================
    // CLOSED STATE
    // ========================================================

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                lg:hidden
            "
        >
            {/* ==================================================
                BACKDROP
            ================================================== */}

            <button
                type="button"
                aria-label="Close navigation"
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    cursor-default
                    bg-text-primary/45
                    backdrop-blur-[2px]
                "
            />

            {/* ==================================================
                DRAWER
            ================================================== */}

            <aside
                aria-label="Mobile dashboard navigation"
                className="
                    absolute
                    inset-y-0
                    left-0
                    flex
                    w-[288px]
                    max-w-[calc(100vw-20px)]
                    flex-col
                    overflow-hidden
                    bg-[#0d625d]
                    shadow-[12px_0_35px_rgba(15,23,42,0.22)]
                "
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-white/9
                        px-5
                        py-5
                    "
                >
                    {/* Brand */}

                    <NavLink
                        to={rootPath}
                        onClick={onClose}
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        {/* Logo */}

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-[11px]
                                bg-white
                                shadow-[0_3px_10px_rgba(0,0,0,0.10)]
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

                        {/* Brand text */}

                        <div className="min-w-0">
                            <div
                                className="
                                    whitespace-nowrap
                                    font-fraunces
                                    text-[18px]
                                    font-semibold
                                    leading-[0.92]
                                    tracking-[-0.04em]
                                    text-white
                                "
                            >
                                Stand
                                <span className="text-accent"> For</span>
                                <br />
                                People
                            </div>

                            <p
                                className="
                                    mt-1.5
                                    whitespace-nowrap
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.15em]
                                    text-white/35
                                "
                            >
                                Social Impact Platform
                            </p>
                        </div>
                    </NavLink>

                    {/* Close */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="
                            ml-3
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-white/45
                            transition-colors
                            duration-200
                            hover:bg-white/8
                            hover:text-white
                        "
                    >
                        <X className="h-5 w-5" strokeWidth={1.7} />
                    </button>
                </header>

                {/* ==================================================
                    ROLE / WORKSPACE CONTEXT
                ================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        px-6
                        py-4
                    "
                >
                    <div className="flex items-center gap-2">
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
                                text-[8px]
                                font-medium
                                uppercase
                                tracking-[0.15em]
                                text-white/35
                            "
                        >
                            Workspace
                        </span>
                    </div>

                    <span
                        className="
                            shrink-0
                            whitespace-nowrap
                            rounded-full
                            border
                            border-white/10
                            px-2
                            py-1
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-widest
                            text-white/40
                        "
                    >
                        {roleLabel}
                    </span>
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav
                    aria-label="Dashboard navigation"
                    className="
                        min-h-0
                        flex-1
                        overflow-x-hidden
                        overflow-y-auto
                        px-4
                        pb-5
                        scrollbar-thin
                    "
                >
                    <div className="space-y-1">
                        {navItems.map((item, index) => {
                            {
                                /* Divider */
                            }

                            if (item.type === 'divider') {
                                return (
                                    <div
                                        key={`divider-${index}`}
                                        className="my-5 px-3"
                                    >
                                        <div className="h-px bg-white/8" />
                                    </div>
                                );
                            }

                            {
                                /* Invalid item */
                            }

                            if (!item.path || !item.icon) {
                                return null;
                            }

                            const Icon = item.icon;

                            const active = isItemActive(item, currentPath);

                            return (
                                <NavLink
                                    key={item.key}
                                    to={item.path}
                                    end={isRootDashboard(item.path)}
                                    onClick={onClose}
                                    aria-current={active ? 'page' : undefined}
                                    className={`
                                            group
                                            relative
                                            flex
                                            h-11.5
                                            w-full
                                            shrink-0
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            whitespace-nowrap
                                            transition-all
                                            duration-200
                                            ${
                                                active
                                                    ? `
                                                        bg-white/10
                                                        font-semibold
                                                        text-white
                                                    `
                                                    : `
                                                        font-medium
                                                        text-white/50
                                                        hover:bg-white/6
                                                        hover:text-white/90
                                                    `
                                            }
                                        `}
                                >
                                    {/* Active indicator */}

                                    <span
                                        className={`
                                                absolute
                                                left-0
                                                top-1/2
                                                h-6
                                                w-0.75
                                                -translate-y-1/2
                                                rounded-r-full
                                                bg-accent
                                                transition-opacity
                                                duration-200
                                                ${
                                                    active
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                }
                                            `}
                                    />

                                    {/* Icon */}

                                    <span
                                        className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                transition-colors
                                                duration-200
                                                ${
                                                    active
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-white/40 group-hover:text-white/80'
                                                }
                                            `}
                                    >
                                        <Icon
                                            className="
                                                    h-4.25
                                                    w-4.25
                                                    shrink-0
                                                "
                                            strokeWidth={active ? 2.05 : 1.8}
                                        />
                                    </span>

                                    {/* Label */}

                                    <span
                                        className="
                                                min-w-0
                                                flex-1
                                                truncate
                                                whitespace-nowrap
                                                text-[12px]
                                                tracking-[-0.01em]
                                            "
                                    >
                                        {item.label}
                                    </span>

                                    {/* Active arrow */}

                                    {active && (
                                        <ChevronRight
                                            className="
                                                    h-3.5
                                                    w-3.5
                                                    shrink-0
                                                    text-white/30
                                                "
                                            strokeWidth={1.9}
                                        />
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* ==================================================
                    ACCOUNT AREA
                ================================================== */}

                <div
                    className="
                        relative
                        shrink-0
                        border-t
                        border-white/9
                        px-4
                        py-4
                    "
                >
                    {/* ==================================================
                        ACCOUNT POPUP
                    ================================================== */}

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
                                p-2
                                shadow-[0_20px_45px_rgba(0,0,0,0.28)]
                            "
                        >
                            {/* Identity */}

                            <div className="px-3 pb-3 pt-2">
                                <div className="flex items-center gap-3">
                                    <AccountAvatar
                                        user={user}
                                        initials={initials}
                                        size="small"
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
                                                mt-0.5
                                                whitespace-nowrap
                                                text-[7px]
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-white/30
                                            "
                                        >
                                            {roleLabel}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-1 h-px bg-white/8" />

                            {/* Profile */}

                            {profilePath && (
                                <AccountMenuLink
                                    to={profilePath}
                                    icon={UserRound}
                                    onClick={closeAccountMenu}
                                >
                                    Profile
                                </AccountMenuLink>
                            )}

                            {/* Settings */}

                            {settingsPath && (
                                <AccountMenuLink
                                    to={settingsPath}
                                    icon={Settings}
                                    onClick={closeAccountMenu}
                                >
                                    Account settings
                                </AccountMenuLink>
                            )}

                            {/* Help */}

                            <AccountMenuLink
                                to="/help"
                                icon={CircleHelp}
                                onClick={closeAccountMenu}
                            >
                                Help & support
                            </AccountMenuLink>

                            <div className="mx-1 my-1 h-px bg-white/8" />

                            {/* Sign out */}

                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="
                                    group
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-left
                                    text-[12px]
                                    font-medium
                                    text-white/60
                                    whitespace-nowrap
                                    transition-colors
                                    duration-200
                                    hover:bg-red-400/10
                                    hover:text-red-200
                                "
                            >
                                <LogOut
                                    className="
                                        h-4
                                        w-4
                                        shrink-0
                                        text-white/40
                                        transition-colors
                                        duration-200
                                        group-hover:text-red-200
                                    "
                                    strokeWidth={1.8}
                                />

                                <span>Sign out</span>
                            </button>
                        </div>
                    )}

                    {/* ==================================================
                        ACCOUNT TRIGGER
                    ================================================== */}

                    <button
                        type="button"
                        onClick={toggleAccountMenu}
                        aria-expanded={accountOpen}
                        aria-haspopup="menu"
                        className={`
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            border
                            px-3
                            py-3
                            text-left
                            transition-all
                            duration-200
                            ${
                                accountOpen
                                    ? 'border-white/15 bg-white/10'
                                    : 'border-transparent hover:bg-white/6'
                            }
                        `}
                    >
                        {/* Avatar */}

                        <div className="relative shrink-0">
                            <AccountAvatar user={user} initials={initials} />

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

                        {/* User */}

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
                                    mt-0.5
                                    truncate
                                    whitespace-nowrap
                                    text-[7px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
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
            </aside>
        </div>
    );
};

export default DashboardMobileNav;
