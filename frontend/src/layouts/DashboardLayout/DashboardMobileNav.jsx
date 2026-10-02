import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    ChevronDown,
    ChevronRight,
    CircleHelp,
    ExternalLink,
    LogOut,
    Settings,
    UserCircle,
    X,
} from 'lucide-react';

import logo from '@/assets/shared/logo.png';

import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

/* ==========================================================================
   ROUTES
============================================================================ */

const ROOT_PATHS = {
    individual: '/individual/dashboard',
    organization: '/organization/dashboard',
    admin: '/admin/dashboard',
};

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
   PATH HELPERS
============================================================================ */

const normalizePath = (path = '') => {
    if (!path) return '/';

    const normalized = path.replace(/\/+$/, '');

    return normalized || '/';
};

const isRootDashboard = (path) => {
    const normalized = normalizePath(path);

    return Object.values(ROOT_PATHS).some(
        (rootPath) => normalizePath(rootPath) === normalized,
    );
};

const isPathActive = (itemPath, currentPath) => {
    if (!itemPath) return false;

    const target = normalizePath(itemPath);
    const current = normalizePath(currentPath);

    if (isRootDashboard(target)) {
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

/* ==========================================================================
   USER HELPERS
============================================================================ */

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
            // Ignore malformed stored user data.
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
        user?.email?.split('@')[0] ||
        ROLE_LABELS[role] ||
        'Account'
    );
};

const getUserEmail = (user) => {
    return user?.email || '';
};

const getUserAvatar = (user) => {
    return (
        user?.avatar ||
        user?.avatar_url ||
        user?.avatarUrl ||
        user?.profile_image ||
        user?.profileImage ||
        null
    );
};

const getInitials = (value = '') => {
    const cleaned = value.trim();

    if (!cleaned) {
        return 'SP';
    }

    return cleaned
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
};

/* ==========================================================================
   ACCOUNT AVATAR
============================================================================ */

const AccountAvatar = ({ avatar, name, size = 'normal' }) => {
    const sizeClasses =
        size === 'large' ? 'h-10 w-10 text-[11px]' : 'h-8 w-8 text-[9.5px]';

    return (
        <div
            className={`
                flex
                shrink-0
                items-center
                justify-center
                overflow-hidden

                rounded-md

                border
                border-[#404754]

                bg-[#303641]

                font-semibold

                !text-[#F1F2F4]

                ${sizeClasses}
            `}
        >
            {avatar ? (
                <img
                    src={avatar}
                    alt={name}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />
            ) : (
                getInitials(name)
            )}
        </div>
    );
};

/* ==========================================================================
   SECTION LABEL
============================================================================ */

const SectionLabel = ({ label }) => {
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
   CHILD NAVIGATION
============================================================================ */

const MobileSubMenu = ({ item, currentPath, open, onNavigate }) => {
    if (!item.children?.length || !open) {
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
                        aria-current={active ? 'page' : undefined}
                        className={`
                            group

                            relative

                            flex
                            min-h-9
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
                        <span
                            aria-hidden="true"
                            className={`
                                h-1
                                w-1
                                shrink-0
                                rounded-full

                                transition-colors
                                duration-150

                                ${
                                    active
                                        ? 'bg-[#D7DAE0]'
                                        : `
                                            bg-[#626A78]
                                            group-hover:bg-[#9299A6]
                                        `
                                }
                            `}
                        />

                        <span
                            className="
                                min-w-0
                                flex-1
                                truncate
                            "
                        >
                            {child.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

/* ==========================================================================
   NAV ITEM
============================================================================ */

const MobileNavItem = ({ item, currentPath, open, onToggle, onNavigate }) => {
    const Icon = item.icon;

    const hasChildren = Boolean(item.children?.length);

    const active = isNavItemActive(item, currentPath);

    const childActive = hasActiveChild(item, currentPath);

    /* ======================================================================
       DIRECT LINK
    ====================================================================== */

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`
                    group
                    relative

                    flex
                    min-h-10
                    w-full
                    items-center
                    gap-3

                    rounded-md

                    px-3

                    transition-colors
                    duration-150

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
                        aria-hidden="true"
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
            </Link>
        );
    }

    /* ======================================================================
       EXPANDABLE PARENT
    ====================================================================== */

    if (hasChildren) {
        return (
            <div>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    className={`
                        group

                        flex
                        min-h-10
                        w-full
                        items-center
                        gap-3

                        rounded-md

                        px-3

                        text-left

                        transition-colors
                        duration-150

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

                                transition-colors
                                duration-150

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

                            transition-all
                            duration-200

                            group-hover:!text-[#C3C7CF]

                            ${
                                open
                                    ? `
                                        rotate-180
                                        !text-[#C3C7CF]
                                    `
                                    : ''
                            }
                        `}
                    />
                </button>

                <MobileSubMenu
                    item={item}
                    currentPath={currentPath}
                    open={open}
                    onNavigate={onNavigate}
                />
            </div>
        );
    }

    return null;
};

/* ==========================================================================
   ACCOUNT MENU LINK
============================================================================ */

const AccountMenuLink = ({
    to,
    icon: Icon,
    children,
    onClick,
    external = false,
}) => {
    const className = `
        group

        flex
        min-h-10
        w-full
        items-center
        gap-3

        rounded-md

        px-2.5

        text-[11.5px]
        font-medium

        !text-[#C3C7CF]

        transition-colors
        duration-150

        hover:bg-[#303641]
        hover:!text-[#F1F2F4]
    `;

    const content = (
        <>
            <Icon
                size={16}
                strokeWidth={1.75}
                className="
                    shrink-0

                    !text-[#969EAC]

                    transition-colors
                    duration-150

                    group-hover:!text-[#D3D6DC]
                "
            />

            <span
                className="
                    min-w-0
                    flex-1
                    truncate
                "
            >
                {children}
            </span>

            {external ? (
                <ExternalLink
                    size={12}
                    strokeWidth={1.7}
                    className="
                        shrink-0
                        !text-[#6F7785]
                    "
                />
            ) : (
                <ChevronRight
                    size={12}
                    strokeWidth={1.7}
                    className="
                        shrink-0
                        !text-[#6F7785]
                    "
                />
            )}
        </>
    );

    if (external) {
        return (
            <a href={to} onClick={onClick} className={className}>
                {content}
            </a>
        );
    }

    return (
        <Link to={to} onClick={onClick} className={className}>
            {content}
        </Link>
    );
};

/* ==========================================================================
   MOBILE NAV
============================================================================ */

const DashboardMobileNav = ({
    role,
    currentPath,
    open,
    onClose,
    user: providedUser,
}) => {
    const navigate = useNavigate();

    const [accountOpen, setAccountOpen] = useState(false);

    const [openMenus, setOpenMenus] = useState({});

    const navItems = useMemo(() => NAV_CONFIG[role] || [], [role]);

    const storedUser = useMemo(() => getStoredUser(), []);

    const user = providedUser || storedUser;

    const userName = getUserName(user, role);

    const userEmail = getUserEmail(user);

    const avatar = getUserAvatar(user);

    const roleLabel = ROLE_LABELS[role] || 'User';

    const profilePath = PROFILE_PATHS[role];

    const settingsPath = SETTINGS_PATHS[role];

    const rootPath = ROOT_PATHS[role] || ROOT_PATHS.individual;

    /* ======================================================================
       ROUTE CHANGE

       Only synchronize the external drawer state here.
       Account state is reset by navigation event handlers instead of
       synchronously calling setState inside this effect.
    ====================================================================== */

    useEffect(() => {
        if (open) {
            onClose();
        }

        // currentPath intentionally controls this behavior.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    /* ======================================================================
       BODY SCROLL
    ====================================================================== */

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

    /* ======================================================================
       ESCAPE KEY
    ====================================================================== */

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') {
                return;
            }

            if (accountOpen) {
                setAccountOpen(false);
                return;
            }

            onClose();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, accountOpen, onClose]);

    /* ======================================================================
       NAVIGATION
    ====================================================================== */

    const closeDrawer = () => {
        setAccountOpen(false);
        onClose();
    };

    const isMenuOpen = (item) => {
        const hasExplicitState = Object.prototype.hasOwnProperty.call(
            openMenus,
            item.key,
        );

        if (hasExplicitState) {
            return openMenus[item.key];
        }

        return hasActiveChild(item, currentPath);
    };

    const toggleMenu = (item) => {
        setOpenMenus((previous) => {
            const hasExplicitState = Object.prototype.hasOwnProperty.call(
                previous,
                item.key,
            );

            const currentlyOpen = hasExplicitState
                ? previous[item.key]
                : hasActiveChild(item, currentPath);

            return {
                ...previous,
                [item.key]: !currentlyOpen,
            };
        });
    };

    /* ======================================================================
       ACCOUNT
    ====================================================================== */

    const toggleAccountMenu = () => {
        setAccountOpen((previous) => !previous);
    };

    /* ======================================================================
       SIGN OUT
    ====================================================================== */

    const handleSignOut = () => {
        const authKeys = ['auth_token', 'user', 'token', 'authToken'];

        authKeys.forEach((key) => {
            window.localStorage.removeItem(key);

            window.sessionStorage.removeItem(key);
        });

        setAccountOpen(false);

        onClose();

        navigate('/');
    };

    /* ======================================================================
       CLOSED
    ====================================================================== */

    if (!open) {
        return null;
    }

    /* ======================================================================
       RENDER
    ====================================================================== */

    return (
        <div
            className="
                fixed
                inset-0
                z-50

                lg:hidden
            "
        >
            {/* =============================================================
                BACKDROP
            ============================================================= */}

            <button
                type="button"
                aria-label="Close navigation"
                onClick={closeDrawer}
                className="
                    absolute
                    inset-0

                    cursor-default

                    bg-[#0B0D11]/70

                    backdrop-blur-[2px]
                "
            />

            {/* =============================================================
                DRAWER
            ============================================================= */}

            <aside
                aria-label="Mobile dashboard navigation"
                className="
                    absolute
                    inset-y-0
                    left-0

                    flex
                    w-[286px]
                    max-w-[calc(100vw-18px)]
                    flex-col

                    overflow-hidden

                    border-r
                    border-[#343944]

                    bg-[#22252D]

                    shadow-[16px_0_45px_rgba(5,6,9,0.32)]
                "
            >
                {/* =========================================================
                    HEADER
                ========================================================= */}

                <header
                    className="
                        flex
                        h-16
                        shrink-0
                        items-center
                        justify-between
                        gap-3

                        border-b
                        border-[#343944]

                        bg-[#20232A]

                        px-4
                    "
                >
                    <Link
                        to={rootPath}
                        onClick={closeDrawer}
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                        "
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

                        <div className="min-w-0">
                            <p
                                className="
                                    truncate

                                    !font-sans

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
                                {roleLabel} workspace
                            </p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={closeDrawer}
                        aria-label="Close navigation"
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            rounded-md

                            !text-[#9299A6]

                            transition-colors
                            duration-150

                            hover:bg-[#2C303A]
                            hover:!text-[#F1F2F4]

                            focus:outline-none
                        "
                    >
                        <X size={18} strokeWidth={1.8} />
                    </button>
                </header>

                {/* =========================================================
                    NAVIGATION
                ========================================================= */}

                <nav
                    aria-label="Dashboard navigation"
                    className="
                        min-h-0
                        flex-1

                        overflow-x-hidden
                        overflow-y-auto

                        px-3
                        py-4

                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-[#343944]

                        hover:[&::-webkit-scrollbar-thumb]:bg-[#404754]
                    "
                >
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            if (item.type === 'section') {
                                return (
                                    <SectionLabel
                                        key={item.key}
                                        label={item.label}
                                    />
                                );
                            }

                            return (
                                <MobileNavItem
                                    key={item.key}
                                    item={item}
                                    currentPath={currentPath}
                                    open={isMenuOpen(item)}
                                    onToggle={() => toggleMenu(item)}
                                    onNavigate={closeDrawer}
                                />
                            );
                        })}
                    </div>
                </nav>

                {/* =========================================================
                    ACCOUNT
                ========================================================= */}

                <div
                    className="
                        relative
                        shrink-0

                        border-t
                        border-[#343944]

                        bg-[#20232A]

                        p-2
                    "
                >
                    {/* =====================================================
                        ACCOUNT POPUP
                    ===================================================== */}

                    {accountOpen && (
                        <div
                            role="menu"
                            aria-label="Account menu"
                            className="
                                absolute
                                bottom-[calc(100%+8px)]
                                left-2
                                right-2
                                z-30

                                overflow-hidden

                                rounded-lg

                                border
                                border-[#343944]

                                bg-[#272B34]

                                shadow-[0_18px_50px_rgba(5,6,9,0.34)]
                            "
                        >
                            {/* =================================================
                                IDENTITY
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3

                                    border-b
                                    border-[#343944]

                                    bg-[#24272F]

                                    px-3.5
                                    py-3.5
                                "
                            >
                                <AccountAvatar
                                    avatar={avatar}
                                    name={userName}
                                    size="large"
                                />

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

                                            text-[9.5px]

                                            !text-[#9299A6]
                                        "
                                    >
                                        {userEmail || roleLabel}
                                    </p>

                                    <p
                                        className="
                                            mt-1

                                            text-[8px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.14em]

                                            !text-[#6F7785]
                                        "
                                    >
                                        {roleLabel}
                                    </p>
                                </div>
                            </div>

                            {/* =================================================
                                LINKS
                            ================================================= */}

                            <div className="p-2">
                                {profilePath && (
                                    <AccountMenuLink
                                        to={profilePath}
                                        icon={UserCircle}
                                        onClick={closeDrawer}
                                    >
                                        Profile
                                    </AccountMenuLink>
                                )}

                                {settingsPath && (
                                    <AccountMenuLink
                                        to={settingsPath}
                                        icon={Settings}
                                        onClick={closeDrawer}
                                    >
                                        Settings
                                    </AccountMenuLink>
                                )}

                                <AccountMenuLink
                                    to="/contact"
                                    icon={CircleHelp}
                                    onClick={closeDrawer}
                                    external
                                >
                                    Help & Support
                                </AccountMenuLink>
                            </div>

                            {/* =================================================
                                SIGN OUT
                            ================================================= */}

                            <div
                                className="
                                    border-t
                                    border-[#343944]

                                    p-2
                                "
                            >
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    role="menuitem"
                                    className="
                                        group

                                        flex
                                        min-h-10
                                        w-full
                                        items-center
                                        gap-3

                                        rounded-md

                                        px-2.5

                                        text-left

                                        transition-colors
                                        duration-150

                                        hover:bg-[#38272C]

                                        focus:outline-none
                                    "
                                >
                                    <LogOut
                                        size={16}
                                        strokeWidth={1.75}
                                        className="
                                            shrink-0

                                            !text-[#B08B91]

                                            transition-colors

                                            group-hover:!text-[#E9A1A8]
                                        "
                                    />

                                    <span
                                        className="
                                            text-[11.5px]
                                            font-medium

                                            !text-[#CBA2A7]

                                            group-hover:!text-[#E9A1A8]
                                        "
                                    >
                                        Sign out
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* =====================================================
                        ACCOUNT TRIGGER
                    ===================================================== */}

                    <button
                        type="button"
                        onClick={toggleAccountMenu}
                        aria-expanded={accountOpen}
                        aria-haspopup="menu"
                        className={`
                            group

                            flex
                            min-h-12
                            w-full
                            items-center
                            gap-2.5

                            rounded-md

                            px-2

                            text-left

                            transition-colors
                            duration-150

                            ${
                                accountOpen
                                    ? 'bg-[#303641]'
                                    : 'hover:bg-[#2C303A]'
                            }
                        `}
                    >
                        <AccountAvatar avatar={avatar} name={userName} />

                        <div
                            className="
                                min-w-0
                                flex-1
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

                                    text-[9px]

                                    !text-[#9299A6]
                                "
                            >
                                {roleLabel}
                            </p>
                        </div>

                        <ChevronRight
                            size={13}
                            strokeWidth={1.8}
                            className={`
                                shrink-0

                                !text-[#6F7785]

                                transition-all
                                duration-200

                                group-hover:!text-[#C3C7CF]

                                ${
                                    accountOpen
                                        ? `
                                            rotate-90
                                            !text-[#C3C7CF]
                                        `
                                        : ''
                                }
                            `}
                        />
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default DashboardMobileNav;
