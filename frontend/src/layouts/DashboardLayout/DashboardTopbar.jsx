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

/* ==========================================================================
   DASHBOARD TOPBAR
============================================================================ */

const DashboardTopbar = ({ pageTitle, role, onMenuOpen }) => {
    const navigate = useNavigate();

    const [userMenuOpen, setUserMenuOpen] = useState(false);

    /* ======================================================================
       USER
    ====================================================================== */

    const getStoredUser = () => {
        try {
            const storedUser =
                localStorage.getItem('user') || sessionStorage.getItem('user');

            if (!storedUser) {
                return null;
            }

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

    /* ======================================================================
       CLOSE MENU
    ====================================================================== */

    const closeUserMenu = () => {
        setUserMenuOpen(false);
    };

    /* ======================================================================
       ESCAPE
    ====================================================================== */

    useEffect(() => {
        if (!userMenuOpen) {
            return undefined;
        }

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

    /* ======================================================================
       SIGN OUT
    ====================================================================== */

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

    /* ======================================================================
       QUICK ACTIONS
    ====================================================================== */

    const dashboardBase = `/${userRole}/dashboard`;

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
            label: 'Support',
            icon: CircleHelp,
            to: '/help',
        },
    ];

    /* ======================================================================
       RENDER
    ====================================================================== */

    return (
        <header
            className="
                sticky
                top-0
                z-30

                border-b
                border-[#252D38]

                bg-[#0E1219]
            "
        >
            <div
                className="
                    flex
                    min-h-20
                    items-center
                    justify-between
                    gap-4

                    px-4
                    sm:px-6
                    lg:px-7
                "
            >
                {/* =========================================================
                    LEFT
                ========================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >
                    <button
                        type="button"
                        onClick={onMenuOpen}
                        aria-label="Open navigation menu"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center

                            rounded-md

                            border
                            border-[#29323E]

                            bg-[#141922]

                            !text-[#7F8998]

                            transition-colors
                            duration-150

                            hover:border-[#36414F]
                            hover:bg-[#181F28]
                            hover:!text-[#F1F3F5]

                            focus:outline-none

                            lg:hidden
                        "
                    >
                        <Menu size={18} strokeWidth={1.8} />
                    </button>

                    <div className="min-w-0">
                        <div
                            className="
                                mb-0.5
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className="
                                    truncate

                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]

                                    !text-[#8792A1]
                                "
                            >
                                {roleLabel}
                            </span>

                            <span
                                className="
                                    h-px
                                    w-5
                                    bg-[#303A47]
                                "
                            />

                            <span
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]

                                    !text-[#657184]
                                "
                            >
                                SP
                            </span>
                        </div>

                        <h1
                            className="
                                max-w-[calc(100vw-170px)]
                                truncate

                                !font-sans

                                text-[18px]
                                font-semibold
                                leading-5
                                tracking-[-0.015em]

                                !text-[#EEF1F5]

                                sm:max-w-125
                                sm:text-[19px]
                            "
                        >
                            {pageTitle}
                        </h1>
                    </div>
                </div>

                {/* =========================================================
                    RIGHT
                ========================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                    "
                >
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="
                            relative

                            flex
                            h-9
                            w-9
                            items-center
                            justify-center

                            rounded-md

                            !text-[#7F8998]

                            transition-colors
                            duration-150

                            hover:bg-[#181F28]
                            hover:!text-[#F1F3F5]

                            focus:outline-none
                        "
                    >
                        <Bell size={18} strokeWidth={1.75} />

                        <span
                            className="
                                absolute
                                right-1.5
                                top-1.5

                                h-1.5
                                w-1.5

                                rounded-full

                                bg-[#E6A15C]

                                ring-2
                                ring-[#0E1219]
                            "
                        />
                    </button>

                    <div
                        className="
                            hidden
                            h-6
                            w-px
                            bg-[#252D38]

                            sm:block
                        "
                    />

                    {/* =====================================================
                        ACCOUNT
                    ===================================================== */}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen((open) => !open)}
                            aria-expanded={userMenuOpen}
                            aria-haspopup="menu"
                            aria-controls="account-menu"
                            className="
                                group

                                flex
                                items-center
                                gap-2.5

                                rounded-md

                                px-1.5
                                py-1

                                transition-colors
                                duration-150

                                hover:bg-[#181F28]

                                focus:outline-none
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

                                    rounded-md

                                    border
                                    border-[#303A47]

                                    bg-[#1B222C]

                                    text-[10px]
                                    font-semibold

                                    !text-[#F1F3F5]

                                    transition-colors
                                    duration-150

                                    group-hover:border-[#414D5C]
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
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                ) : (
                                    initials
                                )}
                            </div>

                            <div
                                className="
                                    hidden
                                    min-w-0
                                    text-left

                                    sm:block
                                "
                            >
                                <p
                                    className="
                                        max-w-37.5
                                        truncate

                                        text-[12px]
                                        font-semibold
                                        leading-4

                                        !text-[#E8EBEF]
                                    "
                                >
                                    {userName}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        max-w-37.5
                                        truncate

                                        text-[9.5px]
                                        font-medium!
                                        leading-3

                                        !text-[#7F8998]
                                    "
                                >
                                    {roleLabel}
                                </p>
                            </div>

                            <ChevronDown
                                size={13}
                                strokeWidth={1.8}
                                className={`
                                    hidden
                                    !text-[#657184]

                                    transition-transform
                                    duration-200

                                    sm:block

                                    group-hover:!text-[#B8C0CC]

                                    ${
                                        userMenuOpen
                                            ? `
                                                rotate-180
                                                !text-[#B8C0CC]
                                            `
                                            : ''
                                    }
                                `}
                            />
                        </button>

                        {/* =================================================
                            DROPDOWN
                        ================================================= */}

                        {userMenuOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close account menu"
                                    onClick={closeUserMenu}
                                    className="
                                        fixed
                                        inset-0
                                        z-40
                                        h-full
                                        w-full
                                        cursor-default
                                    "
                                />

                                <div
                                    id="account-menu"
                                    role="menu"
                                    aria-label="Account menu"
                                    className="
                                        absolute
                                        right-0
                                        top-[calc(100%+20px)]
                                        z-50

                                        w-[min(320px,calc(100vw-24px))]

                                        overflow-hidden

                                        rounded-xl

                                        border
                                        border-[#29323E]

                                        bg-[#141922]

                                        shadow-[0_18px_55px_rgba(0,0,0,0.38)]
                                    "
                                >
                                    {/* =====================================
                                        USER
                                    ===================================== */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3

                                            border-b
                                            border-[#252D38]

                                            bg-[#11161E]

                                            px-4
                                            py-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                overflow-hidden

                                                rounded-lg

                                                border
                                                border-[#303A47]

                                                bg-[#1B222C]

                                                text-[11px]
                                                font-semibold

                                                !text-[#F1F3F5]
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

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    truncate

                                                    text-[13px]
                                                    font-semibold

                                                    !text-[#F1F3F5]
                                                "
                                            >
                                                {userName}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate

                                                    text-[10px]

                                                    !text-[#7F8998]
                                                "
                                            >
                                                {userEmail || 'Account'}
                                            </p>

                                            <p
                                                className="
                                                    mt-1

                                                    text-[8.5px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-[0.14em]

                                                    !text-[#657184]
                                                "
                                            >
                                                {roleLabel}
                                            </p>
                                        </div>
                                    </div>

                                    {/* =====================================
                                        QUICK ACCESS
                                    ===================================== */}

                                    <div className="p-3">
                                        <p
                                            className="
                                                mb-2
                                                px-1

                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.14em]

                                                !text-[#657184]
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
                                                            group

                                                            flex
                                                            min-h-10
                                                            items-center
                                                            gap-3

                                                            rounded-md

                                                            px-2.5

                                                            transition-colors
                                                            duration-150

                                                            hover:bg-[#1B222C]
                                                        "
                                                    >
                                                        <Icon
                                                            size={16}
                                                            strokeWidth={1.75}
                                                            className="
                                                                !text-[#7F8998]

                                                                transition-colors

                                                                group-hover:!text-[#CDD3DB]
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                text-[11px]
                                                                font-medium!

                                                                !text-[#B8C0CC]

                                                                group-hover:!text-[#F1F3F5]
                                                            "
                                                        >
                                                            {label}
                                                        </span>
                                                    </NavLink>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* =====================================
                                        SIGN OUT
                                    ===================================== */}

                                    <div
                                        className="
                                            border-t
                                            border-[#252D38]

                                            p-3
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
                                                    !text-[#B08B91]

                                                    group-hover:!text-[#E9A1A8]
                                                "
                                            />

                                            <span
                                                className="
                                                    text-[11px]
                                                    font-medium!

                                                    !text-[#CBA2A7]

                                                    group-hover:!text-[#E9A1A8]
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
