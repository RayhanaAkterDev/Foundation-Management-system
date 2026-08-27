import React, { useMemo, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
    Menu,
    Bell,
    ChevronDown,
    LogOut,
    UserRound,
    Settings,
    CircleHelp,
} from 'lucide-react';

import { ROLE_LABELS } from '@/routes/dashboardNav';

// ============================================================
// TOPBAR
// ============================================================

const DashboardTopbar = ({ pageTitle, role, onMenuOpen }) => {
    const navigate = useNavigate();

    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // ========================================================
    // LOGGED-IN USER
    // ========================================================

    const user = useMemo(() => {
        try {
            const storedUser =
                localStorage.getItem('user') || sessionStorage.getItem('user');

            if (!storedUser) {
                return null;
            }

            const parsedUser = JSON.parse(storedUser);

            // Supports both:
            // { name, role, ... }
            // and { user: { name, role, ... } }
            return parsedUser?.user || parsedUser;
        } catch (error) {
            console.error('Failed to read logged-in user:', error);
            return null;
        }
    }, []);

    // ========================================================
    // USER INFORMATION
    // ========================================================

    const userName =
        user?.name ||
        user?.username ||
        user?.full_name ||
        user?.fullName ||
        user?.email?.split('@')[0] ||
        'User';

    const userAvatar =
        user?.avatar ||
        user?.avatar_url ||
        user?.profile_image ||
        user?.profileImage ||
        null;

    const userRole = user?.role || role || 'individual';

    const roleLabel = ROLE_LABELS[userRole] || userRole;

    // ========================================================
    // INITIALS
    // ========================================================

    const initials = userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

    // ========================================================
    // SIGN OUT
    // ========================================================

    const handleSignOut = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        // In case your application also uses these keys
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');

        setUserMenuOpen(false);

        navigate('/');
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <header
            className="
                sticky
                top-0
                z-30
                h-18
                shrink-0
                border-b
                border-border
                bg-surface
                backdrop-blur-xl
            "
        >
            <div
                className="
                    flex
                    h-full
                    items-center
                    gap-4
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >
                {/* ==================================================
                    MOBILE MENU
                ================================================== */}

                <button
                    type="button"
                    onClick={onMenuOpen}
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        text-text-secondary
                        transition-colors
                        hover:bg-surface-soft
                        hover:text-primary
                        md:hidden
                    "
                    aria-label="Open navigation"
                >
                    <Menu className="h-5 w-5" strokeWidth={1.8} />
                </button>

                {/* ==================================================
                    PAGE CONTEXT
                ================================================== */}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h1
                            className="
                                truncate
                                font-fraunces
                                text-5
                                font-semibold
                                leading-tight
                                tracking-tight
                                text-text-primary
                                sm:text-[21px]
                            "
                        >
                            {pageTitle}
                        </h1>
                    </div>

                    <div
                        className="
                            mt-1
                            hidden
                            items-center
                            gap-2
                            sm:flex
                        "
                    >
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-primary/40
                            "
                        />

                        <span
                            className="
                                text-[10px]
                                font-medium
                                text-text-secondary
                            "
                        >
                            Stand For People 💚
                        </span>
                    </div>
                </div>

                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex items-center gap-1.5">
                    {/* ==================================================
                        NOTIFICATIONS
                    ================================================== */}

                    <button
                        type="button"
                        className="
                            group
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-text-secondary
                            transition-all
                            duration-200
                            hover:bg-surface-soft
                            hover:text-primary
                        "
                        aria-label="Notifications"
                    >
                        <Bell
                            className="
                                h-4.5
                                w-4.5
                                transition-transform
                                duration-200
                                group-hover:-rotate-6
                            "
                            strokeWidth={1.8}
                        />

                        <span
                            className="
                                absolute
                                right-2.5
                                top-2
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-accent
                                ring-2
                                ring-surface
                            "
                        />
                    </button>

                    {/* Divider */}

                    <div
                        className="
                            mx-1.5
                            hidden
                            h-7
                            w-px
                            bg-border
                            sm:block
                        "
                    />

                    {/* ==================================================
                        ACCOUNT
                    ================================================== */}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen((value) => !value)}
                            className={`
                                group
                                flex
                                items-center
                                gap-2.5
                                rounded-xl
                                px-1.5
                                py-1.5
                                transition-all
                                duration-200
                                ${
                                    userMenuOpen
                                        ? 'bg-surface-soft'
                                        : 'hover:bg-surface-soft'
                                }
                            `}
                            aria-haspopup="true"
                            aria-expanded={userMenuOpen}
                        >
                            {/* Avatar */}

                            <span
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-full
                                    bg-primary/10
                                    text-[11px]
                                    font-bold
                                    text-primary
                                "
                            >
                                {userAvatar ? (
                                    <img
                                        src={userAvatar}
                                        alt={userName}
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />
                                ) : (
                                    initials
                                )}
                            </span>

                            {/* User information */}

                            <span
                                className="
                                    hidden
                                    text-left
                                    sm:block
                                "
                            >
                                <span
                                    className="
                                        block
                                        max-w-37.5
                                        truncate
                                        text-[11.5px]
                                        font-semibold
                                        leading-tight
                                        text-text-primary
                                    "
                                >
                                    {userName}
                                </span>

                                <span
                                    className="
                                        mt-1
                                        block
                                        text-[9px]
                                        font-medium
                                        text-text-secondary
                                    "
                                >
                                    {roleLabel}
                                </span>
                            </span>

                            {/* Chevron */}

                            <ChevronDown
                                className={`
                                    hidden
                                    h-3.75
                                    w-3.75
                                    text-text-secondary
                                    transition-transform
                                    duration-200
                                    sm:block
                                    ${userMenuOpen ? 'rotate-180' : ''}
                                `}
                                strokeWidth={1.8}
                            />
                        </button>

                        {/* ==================================================
                            DROPDOWN
                        ================================================== */}

                        {userMenuOpen && (
                            <>
                                {/* Outside click */}

                                <button
                                    type="button"
                                    className="
                                        fixed
                                        inset-0
                                        z-40
                                        cursor-default
                                    "
                                    onClick={() => setUserMenuOpen(false)}
                                    aria-label="Close account menu"
                                />

                                <div
                                    className="
                                        absolute
                                        right-0
                                        z-50
                                        mt-2.5
                                        w-62
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                        shadow-[0_18px_45px_rgba(15,23,42,0.14)]
                                    "
                                >
                                    {/* ==================================================
                                        ACCOUNT HEADER
                                    ================================================== */}

                                    <div
                                        className="
                                            bg-surface-soft
                                            px-4
                                            py-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            {/* Avatar */}

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-primary/10
                                                    text-[11px]
                                                    font-bold
                                                    text-primary
                                                "
                                            >
                                                {userAvatar ? (
                                                    <img
                                                        src={userAvatar}
                                                        alt={userName}
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                        "
                                                    />
                                                ) : (
                                                    initials
                                                )}
                                            </div>

                                            {/* User information */}

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        truncate
                                                        text-[12px]
                                                        font-semibold
                                                        text-text-primary
                                                    "
                                                >
                                                    {userName} 💚
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-[9px]
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.06em]
                                                        text-text-secondary
                                                    "
                                                >
                                                    {roleLabel}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        ACCOUNT LINKS
                                    ================================================== */}

                                    <div className="p-2">
                                        {/* Profile */}

                                        <NavLink
                                            to={`/dashboard/${userRole}/profile`}
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                text-[11.5px]
                                                font-medium
                                                text-text-primary
                                                transition-colors
                                                hover:bg-surface-soft
                                            "
                                        >
                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-surface-soft
                                                    text-text-secondary
                                                    transition-colors
                                                    group-hover:bg-primary/10
                                                    group-hover:text-primary
                                                "
                                            >
                                                <UserRound
                                                    className="h-4 w-4"
                                                    strokeWidth={1.8}
                                                />
                                            </span>

                                            <span className="flex-1">
                                                Profile
                                            </span>

                                            <ChevronDown
                                                className="
                                                    h-3.5
                                                    w-3.5
                                                    -rotate-90
                                                    text-border
                                                    transition-colors
                                                    group-hover:text-text-secondary
                                                "
                                            />
                                        </NavLink>

                                        {/* Account Settings */}

                                        <NavLink
                                            to={`/dashboard/${userRole}/settings`}
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                text-[11.5px]
                                                font-medium
                                                text-text-primary
                                                transition-colors
                                                hover:bg-surface-soft
                                            "
                                        >
                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-surface-soft
                                                    text-text-secondary
                                                    transition-colors
                                                    group-hover:bg-primary/10
                                                    group-hover:text-primary
                                                "
                                            >
                                                <Settings
                                                    className="h-4 w-4"
                                                    strokeWidth={1.8}
                                                />
                                            </span>

                                            <span className="flex-1">
                                                Account settings
                                            </span>

                                            <ChevronDown
                                                className="
                                                    h-3.5
                                                    w-3.5
                                                    -rotate-90
                                                    text-border
                                                    transition-colors
                                                    group-hover:text-text-secondary
                                                "
                                            />
                                        </NavLink>

                                        {/* Help */}

                                        <NavLink
                                            to="/help"
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                            className="
                                                group
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                px-3
                                                py-2.5
                                                text-[11.5px]
                                                font-medium
                                                text-text-primary
                                                transition-colors
                                                hover:bg-surface-soft
                                            "
                                        >
                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-surface-soft
                                                    text-text-secondary
                                                    transition-colors
                                                    group-hover:bg-primary/10
                                                    group-hover:text-primary
                                                "
                                            >
                                                <CircleHelp
                                                    className="h-4 w-4"
                                                    strokeWidth={1.8}
                                                />
                                            </span>

                                            <span className="flex-1">
                                                Help & support
                                            </span>

                                            <ChevronDown
                                                className="
                                                    h-3.5
                                                    w-3.5
                                                    -rotate-90
                                                    text-border
                                                    transition-colors
                                                    group-hover:text-text-secondary
                                                "
                                            />
                                        </NavLink>

                                        {/* Divider */}

                                        <div className="my-2 h-px bg-border" />

                                        {/* Sign Out */}

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
                                                text-[11.5px]
                                                font-medium
                                                text-text-secondary
                                                transition-colors
                                                hover:bg-red-50
                                                hover:text-red-600
                                            "
                                        >
                                            <span
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-surface-soft
                                                    transition-colors
                                                    group-hover:bg-red-100
                                                "
                                            >
                                                <LogOut
                                                    className="h-4 w-4"
                                                    strokeWidth={1.8}
                                                />
                                            </span>

                                            <span>Sign out</span>
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
