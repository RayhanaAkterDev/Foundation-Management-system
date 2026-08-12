import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '@/assets/shared/footerLogo.png';
import {
    HeartHandshake,
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
// HELPERS
// ============================================================

const ROOT_PATHS = [
    '/dashboard/individual',
    '/dashboard/organization',
    '/dashboard/admin',
];

const isRootDashboard = (path) => ROOT_PATHS.includes(path);

// ============================================================
// MOBILE NAV
// ============================================================

const DashboardMobileNav = ({ role, currentPath, open, onClose }) => {
    const navigate = useNavigate();

    const [accountOpen, setAccountOpen] = useState(false);

    const navItems = NAV_CONFIG[role] || [];

    const user = MOCK_USERS[role] || MOCK_USERS.individual;

    const roleLabel = ROLE_LABELS[role] || 'User';

    // ========================================================
    // CLOSE AFTER ROUTE CHANGE
    // ========================================================

    useEffect(() => {
        onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    // ========================================================
    // LOCK BODY SCROLL
    // ========================================================

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // ========================================================
    // CLOSE ACCOUNT MENU
    // ========================================================

    const closeAccountMenu = () => {
        setAccountOpen(false);
    };

    // ========================================================
    // SIGN OUT
    // ========================================================

    const handleSignOut = () => {
        closeAccountMenu();
        onClose();
        navigate('/');
    };

    // ========================================================
    // INITIALS
    // ========================================================

    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* ==================================================
                BACKDROP
            ================================================== */}

            <button
                type="button"
                className="
                    absolute
                    inset-0
                    bg-text-primary/40
                    backdrop-blur-[2px]
                "
                onClick={onClose}
                aria-label="Close navigation"
            />

            {/* ==================================================
                DRAWER
            ================================================== */}

            <aside
                className="
                    absolute
                    inset-y-0
                    left-0
                    flex
                    w-69
                    max-w-[calc(100%-1.5rem)]
                    flex-col
                    overflow-hidden
                    bg-primary
                    shadow-[12px_0_35px_rgba(15,23,42,0.22)]
                "
            >
                {/* ==================================================
                    BRAND HEADER
                ================================================== */}

                <div
                    className="
                        shrink-0
                        px-6
                        pb-6
                        pt-7
                    "
                >
                    <div className="flex items-center justify-between">
                        <NavLink
                            to={`/dashboard/${role}`}
                            onClick={onClose}
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-3.5
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-[13px]
                                    bg-white
                                    text-primary
                                    shadow-sm
                                "
                            >
                                <img src={logo} alt="sp" />
                            </div>

                            <div className="min-w-0">
                                <div
                                    className="
                        font-fraunces
                        text-lg
                        font-semibold
                        leading-[0.95]
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
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-white/40
                                    "
                                >
                                    Social Impact Platform
                                </p>
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-4
                        pb-5
                        pt-3
                        scrollbar-thin
                    "
                >
                    <div className="mb-3 px-3">
                        <span
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.19em]
                                text-white/30
                            "
                        >
                            Workspace
                        </span>
                    </div>

                    <div className="space-y-1">
                        {navItems.map((item, index) => {
                            if (item.type === 'divider') {
                                return (
                                    <div
                                        key={`divider-${index}`}
                                        className="my-5 px-3"
                                    >
                                        <div className="h-px bg-white/10" />
                                    </div>
                                );
                            }

                            const Icon = item.icon;

                            const active = isRootDashboard(item.path)
                                ? currentPath === item.path
                                : currentPath === item.path ||
                                  currentPath.startsWith(`${item.path}/`);

                            return (
                                <NavLink
                                    key={item.key}
                                    to={item.path}
                                    end={isRootDashboard(item.path)}
                                    onClick={onClose}
                                    className={`
                                        group
                                        relative
                                        flex
                                        min-h-11.5
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-3
                                        text-[13px]
                                        transition-all
                                        duration-200

                                        ${
                                            active
                                                ? `
                                                    bg-white/13
                                                    font-semibold
                                                    text-white
                                                `
                                                : `
                                                    font-medium
                                                    text-white/55
                                                    hover:bg-white/6.5
                                                    hover:text-white/90
                                                `
                                        }
                                    `}
                                >
                                    {active && (
                                        <span
                                            className="
                                                absolute
                                                -left-4
                                                top-1/2
                                                h-7
                                                w-0.75
                                                -translate-y-1/2
                                                rounded-r-full
                                                bg-accent
                                            "
                                        />
                                    )}

                                    <span
                                        className={`
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg

                                            ${
                                                active
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/40 group-hover:text-white/80'
                                            }
                                        `}
                                    >
                                        <Icon
                                            className="h-4.25 w-4.25"
                                            strokeWidth={active ? 2.05 : 1.8}
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1 truncate">
                                        {item.label}
                                    </span>

                                    {active && (
                                        <ChevronRight
                                            className="
                                                h-3.5
                                                w-3.5
                                                shrink-0
                                                text-white/30
                                            "
                                            strokeWidth={2}
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

                <div className="relative shrink-0 px-4 pb-5">
                    {/* ==================================================
                        ACCOUNT MENU
                    ================================================== */}

                    {accountOpen && (
                        <div
                            className="
                                absolute
                                bottom-19.5
                                left-4
                                right-4
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#0d6863]
                                p-2
                                shadow-[0_16px_40px_rgba(0,0,0,0.28)]
                            "
                        >
                            {/* Account identity */}

                            <div className="px-3 pb-2 pt-2">
                                <p
                                    className="
                                        truncate
                                        text-[12px]
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {user.name}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[9px]
                                        font-medium
                                        uppercase
                                        tracking-[0.08em]
                                        text-white/40
                                    "
                                >
                                    {roleLabel}
                                </p>
                            </div>

                            <div className="my-1.5 h-px bg-white/10" />

                            {/* Profile */}

                            <NavLink
                                to={`/dashboard/${role}/profile`}
                                onClick={onClose}
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-[12px]
                                    font-medium
                                    text-white/65
                                    transition-colors
                                    hover:bg-white/8
                                    hover:text-white
                                "
                            >
                                <UserRound
                                    className="
                                        h-4
                                        w-4
                                        text-white/40
                                        group-hover:text-white
                                    "
                                    strokeWidth={1.8}
                                />

                                <span className="flex-1">Profile</span>

                                <ChevronRight
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-white/20
                                    "
                                    strokeWidth={1.8}
                                />
                            </NavLink>

                            {/* Settings */}

                            <NavLink
                                to={`/dashboard/${role}/settings`}
                                onClick={onClose}
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-[12px]
                                    font-medium
                                    text-white/65
                                    transition-colors
                                    hover:bg-white/8
                                    hover:text-white
                                "
                            >
                                <Settings
                                    className="
                                        h-4
                                        w-4
                                        text-white/40
                                        group-hover:text-white
                                    "
                                    strokeWidth={1.8}
                                />

                                <span className="flex-1">Account settings</span>

                                <ChevronRight
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-white/20
                                    "
                                    strokeWidth={1.8}
                                />
                            </NavLink>

                            {/* Help */}

                            <NavLink
                                to="/help"
                                onClick={onClose}
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-[12px]
                                    font-medium
                                    text-white/65
                                    transition-colors
                                    hover:bg-white/8
                                    hover:text-white
                                "
                            >
                                <CircleHelp
                                    className="
                                        h-4
                                        w-4
                                        text-white/40
                                        group-hover:text-white
                                    "
                                    strokeWidth={1.8}
                                />

                                <span className="flex-1">Help & support</span>

                                <ChevronRight
                                    className="
                                        h-3.5
                                        w-3.5
                                        text-white/20
                                    "
                                    strokeWidth={1.8}
                                />
                            </NavLink>

                            <div className="my-1.5 h-px bg-white/10" />

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
                                    transition-colors
                                    hover:bg-red-400/10
                                    hover:text-red-200
                                "
                            >
                                <LogOut
                                    className="
                                        h-4
                                        w-4
                                        text-white/40
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
                        onClick={() => setAccountOpen((previous) => !previous)}
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
                                    : 'border-transparent hover:bg-white/[0.07]'
                            }
                        `}
                    >
                        {/* Avatar */}

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
                                bg-white
                                text-[11px]
                                font-bold
                                text-primary
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

                        {/* User */}

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate
                                    text-[12px]
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
                                    text-[9px]
                                    font-medium
                                    text-white/40
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
                                text-white/30
                                transition-transform
                                duration-200
                                ${accountOpen ? 'rotate-90' : ''}
                            `}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default DashboardMobileNav;
