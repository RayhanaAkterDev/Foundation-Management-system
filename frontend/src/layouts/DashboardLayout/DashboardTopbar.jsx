import React, { useEffect, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
    Bell,
    ChevronDown,
    CircleHelp,
    LogOut,
    Menu,
    Settings,
    UserRound,
} from 'lucide-react';

const DashboardTopbar = ({ pageTitle, role, onMenuOpen }) => {
    const navigate = useNavigate();

    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // =========================================================
    // USER
    // =========================================================

    const getStoredUser = () => {
        try {
            const storedUser =
                localStorage.getItem('user') ||
                sessionStorage.getItem('user');

            if (!storedUser) return null;

            const parsedUser = JSON.parse(storedUser);

            return parsedUser?.user || parsedUser;
        } catch (error) {
            console.error('Failed to parse stored user:', error);
            return null;
        }
    };

    const user = getStoredUser();

    const userName =
        user?.name ||
        user?.username ||
        user?.full_name ||
        user?.fullName ||
        user?.email?.split('@')[0] ||
        'User';

    const userEmail = user?.email || '';

    const userAvatar =
        user?.avatar ||
        user?.avatar_url ||
        user?.profile_image ||
        user?.profileImage ||
        null;

    const userRole = user?.role || role || 'individual';

    const roleLabelMap = {
        individual: 'Individual',
        organization: 'Organization',
        admin: 'Administrator',
    };

    const roleLabel = roleLabelMap[userRole] || userRole;

    const initials =
        userName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase() || 'U';

    // =========================================================
    // CLOSE MENU
    // =========================================================

    const closeUserMenu = () => {
        setUserMenuOpen(false);
    };

    // =========================================================
    // ESCAPE KEY
    // =========================================================

    useEffect(() => {
        if (!userMenuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeUserMenu();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [userMenuOpen]);

    // =========================================================
    // SIGN OUT
    // =========================================================

    const handleSignOut = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('authToken');

        closeUserMenu();

        navigate('/');
    };

    // =========================================================
    // QUICK ACTION
    // =========================================================

    const quickActions = [
        {
            label: 'Profile',
            description: 'Account',
            icon: UserRound,
            to: '/profile',
        },
        {
            label: 'Settings',
            description: 'Preferences',
            icon: Settings,
            to: '/settings',
        },
        {
            label: 'Support',
            description: 'Get help',
            icon: CircleHelp,
            to: '/help',
        },
    ];

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-surface">
            <div
                className="
                    flex min-h-19 items-center justify-between
                    gap-3 px-4
                    sm:min-h-20 sm:px-6
                    lg:px-8
                "
            >
                {/* =====================================================
                    LEFT
                ====================================================== */}

                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    {/* Mobile menu */}

                    <button
                        type="button"
                        onClick={onMenuOpen}
                        aria-label="Open navigation menu"
                        className="
                            flex h-10 w-10 shrink-0 items-center justify-center
                            rounded-lg
                            border border-border
                            bg-surface
                            text-text-secondary
                            transition-all duration-200
                            hover:border-primary/25
                            hover:bg-primary/4
                            hover:text-primary
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary/20
                            lg:hidden
                        "
                    >
                        <Menu size={19} strokeWidth={1.9} />
                    </button>

                    {/* Page heading */}

                    <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                            <span
                                className="
                                    truncate
                                    text-[9px] font-semibold
                                    uppercase tracking-[0.17em]
                                    text-primary
                                    sm:text-[10px]
                                "
                            >
                                {roleLabel}
                            </span>

                            <span className="h-px w-4 shrink-0 bg-border sm:w-5" />

                            <span
                                className="
                                    text-[9px] font-medium
                                    uppercase tracking-[0.15em]
                                    text-text-secondary
                                    sm:text-[10px]
                                "
                            >
                                SP
                            </span>
                        </div>

                        <h1
                            className="
                                max-w-[calc(100vw-170px)]
                                truncate
                                text-[19px] font-medium
                                leading-tight
                                tracking-[-0.02em]
                                text-text-primary
                                sm:max-w-125
                                sm:text-[22px]
                            "
                        >
                            {pageTitle}
                        </h1>
                    </div>
                </div>

                {/* =====================================================
                    RIGHT
                ====================================================== */}

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    {/* Notification */}

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="
                            relative
                            flex h-10 w-10 items-center justify-center
                            rounded-lg
                            text-text-secondary
                            transition-all duration-200
                            hover:bg-primary/4
                            hover:text-text-primary
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary/20
                        "
                    >
                        <Bell size={19} strokeWidth={1.8} />

                        <span
                            className="
                                absolute right-2 top-1.75
                                h-1.5 w-1.5
                                rounded-full
                                bg-accent
                                ring-2 ring-surface
                            "
                        />
                    </button>

                    {/* Divider */}

                    <div className="mx-1 hidden h-7 w-px bg-border sm:block" />

                    {/* =================================================
                        ACCOUNT
                    ================================================== */}

                    <div className="relative">
                        {/* Account trigger */}

                        <button
                            type="button"
                            onClick={() =>
                                setUserMenuOpen((open) => !open)
                            }
                            aria-expanded={userMenuOpen}
                            aria-haspopup="menu"
                            aria-controls="account-menu"
                            className="
                                group
                                flex items-center gap-2
                                rounded-xl
                                px-1 py-1
                                transition-colors duration-200
                                hover:bg-primary/4
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary/20
                                sm:gap-2.5
                            "
                        >
                            {/* Avatar */}

                            <div
                                className="
                                    relative
                                    flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    overflow-hidden
                                    rounded-[10px]
                                    bg-primary
                                    text-[11px] font-semibold
                                    text-white
                                    ring-1 ring-primary/10
                                    transition-all duration-200
                                    group-hover:ring-primary/20
                                "
                            >
                                {userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={userName}
                                        className="h-full w-full object-cover"
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            {/* Name */}

                            <div className="hidden min-w-0 text-left sm:block">
                                <p
                                    className="
                                        max-w-37.5
                                        truncate
                                        text-[13px] font-semibold
                                        leading-4
                                        text-text-primary
                                    "
                                >
                                    {userName}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        max-w-37.5
                                        truncate
                                        text-[10px] font-medium
                                        leading-3
                                        text-text-secondary
                                    "
                                >
                                    {roleLabel}
                                </p>
                            </div>

                            {/* Chevron */}

                            <ChevronDown
                                size={15}
                                strokeWidth={1.9}
                                className={`
                                    hidden
                                    text-text-secondary
                                    transition-transform duration-200
                                    sm:block
                                    ${
                                        userMenuOpen
                                            ? 'rotate-180 text-primary'
                                            : ''
                                    }
                                `}
                            />
                        </button>

                        {/* =================================================
                            ACCOUNT DROPDOWN
                        ================================================== */}

                        {userMenuOpen && (
                            <>
                                {/* Backdrop */}

                                <button
                                    type="button"
                                    aria-label="Close account menu"
                                    onClick={closeUserMenu}
                                    className="
                                        fixed inset-0 z-40
                                        h-full w-full
                                        cursor-default
                                    "
                                />

                                {/* Dropdown */}

                                <div
                                    id="account-menu"
                                    role="menu"
                                    aria-label="Account menu"
                                    className="
                                        absolute right-0
                                        top-[calc(100%+10px)]
                                        z-50
                                        w-[min(330px,calc(100vw-24px))]
                                        overflow-hidden
                                        rounded-2xl
                                        border border-border
                                        bg-surface
                                        shadow-[0_20px_55px_rgba(15,23,42,0.14)]
                                    "
                                >
                                    {/* =================================================
                                        ACCOUNT HERO
                                    ================================================== */}

                                    <div
                                        className="
                                            relative
                                            bg-primary
                                            px-5
                                            pb-9
                                            pt-4
                                        "
                                    >
                                        {/* Meta */}

                                        <div className="flex items-center justify-between">
                                            <span
                                                className="
                                                    text-[9px] font-semibold
                                                    uppercase
                                                    tracking-[0.18em]
                                                    text-white/55
                                                "
                                            >
                                                Account
                                            </span>

                                            <span
                                                className="
                                                    inline-flex items-center gap-1.5
                                                    text-[9px] font-medium
                                                    text-white/70
                                                "
                                            >
                                                <span
                                                    className="
                                                        h-1.5 w-1.5
                                                        rounded-full
                                                        bg-emerald-300
                                                    "
                                                />

                                                Active
                                            </span>
                                        </div>

                                        {/* Welcome + Identity */}

                                        <div className="mt-6 pr-16">
                                            <p
                                                className="
                                                    text-[9px] font-medium
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-white/50
                                                "
                                            >
                                                Welcome back
                                            </p>

                                            <p
                                                className="
                                                    mt-1.5
                                                    truncate
                                                    text-[20px] font-semibold
                                                    leading-6
                                                    tracking-tight
                                                    text-white
                                                "
                                            >
                                                {userName}
                                            </p>

                                            <p
                                                className="
                                                    mt-1.5
                                                    truncate
                                                    text-[11px]
                                                    leading-4
                                                    tracking-widest
                                                    text-white/80
                                                "
                                            >
                                                {userEmail || 'Account'}
                                            </p>
                                        </div>

                                        {/* Floating avatar */}

                                        <div
                                            className="
                                                absolute
                                                -bottom-6
                                                left-5
                                            "
                                        >
                                            <div
                                                className="
                                                    flex h-12 w-12
                                                    items-center justify-center
                                                    overflow-hidden
                                                    rounded-xl
                                                    border-[3px]
                                                    border-surface
                                                    bg-primary-hover
                                                    text-[14px]
                                                    font-semibold
                                                    text-white
                                                    shadow-[0_5px_16px_rgba(15,23,42,0.18)]
                                                "
                                            >
                                                {userAvatar ? (
                                                    <img
                                                        src={userAvatar}
                                                        alt={userName}
                                                        className="
                                                            h-full w-full
                                                            object-cover
                                                        "
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                'none';
                                                        }}
                                                    />
                                                ) : (
                                                    initials
                                                )}
                                            </div>
                                        </div>

                                        {/* Role / Brand */}

                                        <div
                                            className="
                                                absolute
                                                bottom-3
                                                right-4
                                                flex items-center gap-2
                                            "
                                        >
                                            <span
                                                className="
                                                    max-w-30
                                                    truncate
                                                    text-[9px] font-semibold
                                                    uppercase
                                                    tracking-[0.13em]
                                                    text-white/65
                                                "
                                            >
                                                {roleLabel}
                                            </span>

                                            <span
                                                className="
                                                    h-1 w-1
                                                    shrink-0
                                                    rounded-full
                                                    bg-white/25
                                                "
                                            />

                                            <span
                                                className="
                                                    text-[9px] font-medium
                                                    uppercase
                                                    tracking-[0.08em]
                                                    text-white/40
                                                "
                                            >
                                                SP
                                            </span>
                                        </div>
                                    </div>

                                    {/* =================================================
                                        QUICK ACTIONS
                                    ================================================== */}

                                    <div className="pt-7">
                                        {/* Section heading */}

                                        <div
                                            className="
                                                border-b border-border
                                                px-5 py-3
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[9px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-text-primary
                                                "
                                            >
                                                Quick actions
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[9px]
                                                    leading-3
                                                    text-text-secondary
                                                "
                                            >
                                                Manage your account
                                            </p>
                                        </div>

                                        {/* Actions */}

                                        <div className="grid grid-cols-3">
                                            {quickActions.map(
                                                ({
                                                    label,
                                                    description,
                                                    icon: Icon,
                                                    to,
                                                }) => (
                                                    <NavLink
                                                        key={to}
                                                        to={to}
                                                        onClick={closeUserMenu}
                                                        role="menuitem"
                                                        className="
                                                            group
                                                            relative
                                                            flex min-w-0
                                                            flex-col
                                                            items-center
                                                            px-2
                                                            py-4
                                                            text-center
                                                            transition-colors
                                                            duration-150
                                                            hover:bg-primary/4
                                                            focus:outline-none
                                                            focus-visible:bg-primary/5
                                                            [&+a]:border-l
                                                            [&+a]:border-border
                                                        "
                                                    >
                                                        {/* Icon */}

                                                        <div
                                                            className="
                                                                flex h-8 w-8
                                                                items-center
                                                                justify-center
                                                                rounded-[9px]
                                                                bg-primary/7
                                                                transition-all
                                                                duration-150
                                                                group-hover:bg-primary/11
                                                                group-hover:scale-[1.03]
                                                            "
                                                        >
                                                            <Icon
                                                                size={16}
                                                                strokeWidth={1.8}
                                                                className="text-primary"
                                                            />
                                                        </div>

                                                        {/* Label */}

                                                        <span
                                                            className="
                                                                mt-2
                                                                max-w-full
                                                                truncate
                                                                text-[10px]
                                                                font-semibold
                                                                leading-3
                                                                text-text-primary
                                                            "
                                                        >
                                                            {label}
                                                        </span>

                                                        {/* Description */}

                                                        {description && (
                                                            <span
                                                                className="
                                                                    mt-1
                                                                    max-w-full
                                                                    truncate
                                                                    text-[8px]
                                                                    leading-3
                                                                    text-text-secondary
                                                                "
                                                            >
                                                                {description}
                                                            </span>
                                                        )}
                                                    </NavLink>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* =================================================
                                        SIGN OUT
                                    ================================================== */}

                                    <div
                                        className="
                                            border-t border-border
                                            px-4 py-3
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            role="menuitem"
                                            className="
                                                group
                                                flex w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-2 py-2
                                                text-left
                                                transition-colors
                                                duration-150
                                                hover:bg-primary/4
                                                focus:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-primary/20
                                            "
                                        >
                                            {/* Icon */}

                                            <div
                                                className="
                                                    flex h-8 w-8 shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-[9px]
                                                    bg-primary/6
                                                    transition-colors
                                                    duration-150
                                                    group-hover:bg-primary/10
                                                "
                                            >
                                                <LogOut
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="
                                                        text-text-secondary
                                                        transition-colors
                                                        duration-150
                                                        group-hover:text-primary
                                                    "
                                                />
                                            </div>

                                            {/* Label */}

                                            <span
                                                className="
                                                    text-[11px]
                                                    font-semibold
                                                    text-text-primary
                                                    transition-colors
                                                    duration-150
                                                    group-hover:text-primary
                                                "
                                            >
                                                Sign out
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardTopbar;