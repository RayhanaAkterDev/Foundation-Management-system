import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '@/assets/shared/footerLogo.png';
import {
    HeartHandshake,
    LogOut,
    ChevronRight,
    UserRound,
    Settings,
    CircleHelp,
} from 'lucide-react';

import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

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

const ROOT_PATHS = [
    '/dashboard/individual',
    '/dashboard/organization',
    '/dashboard/admin',
];

const DashboardSidebar = ({ role, currentPath }) => {
    const navigate = useNavigate();
    const [accountOpen, setAccountOpen] = useState(false);

    const navItems = NAV_CONFIG[role] || [];
    const user = MOCK_USERS[role] || MOCK_USERS.individual;
    const roleLabel = ROLE_LABELS[role] || 'User';

    const isRootDashboard = (path) => ROOT_PATHS.includes(path);

    const isItemActive = (item) => {
        if (!item.path) return false;

        if (isRootDashboard(item.path)) {
            return currentPath === item.path;
        }

        return (
            currentPath === item.path || currentPath.startsWith(`${item.path}/`)
        );
    };

    const handleSignOut = () => {
        setAccountOpen(false);
        navigate('/');
    };

    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

    return (
        <aside
            className="
                fixed
                inset-y-0
                left-0
                z-50
                hidden
                w-69
                flex-col
                overflow-hidden
                bg-primary
                md:flex
            "
        >
            {/* ==================================================
    BRAND
================================================== */}

            <div className="shrink-0 px-5 pt-5">
                <div
                    className="
            relative
            block
            overflow-hidden
            rounded-[22px]
            border
            border-white/15
            p-5
            backdrop-blur-md
        "
                >
                    {/* Decorative accent */}
                    <div
                        className="
                absolute
                -right-8
                -top-8
                h-28
                w-28
                rounded-full
                bg-accent/10
                blur-2xl
            "
                    />

                    <div
                        className="
                absolute
                -bottom-8.75
                -left-6.25
                h-24
                w-24
                rounded-full
                bg-white/6
                blur-xl
            "
                    />

                    {/* Main brand */}
                    <div className="relative flex items-center gap-4">
                        {/* Logo */}
                        <div
                            className="
                    relative
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    text-primary
                    shadow-[0_8px_24px_rgba(0,0,0,0.14)]
                "
                        >
                            <img src={logo} alt="sp" />
                        </div>

                        {/* Wordmark */}
                        <div className="min-w-0">
                            <div
                                className="
                        font-fraunces
                        text-[22px]
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
                        mt-2.5
                        text-[8.5px]
                        font-semibold
                        uppercase
                        tracking-[0.17em]
                        text-white/50
                    "
                            >
                                Social Impact Platform
                            </p>
                        </div>
                    </div>

                    {/* Bottom identity strip */}
                    <div
                        className="
                relative
                mt-5
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-3.5
            "
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-accent
                    "
                            />

                            <span
                                className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-white/55
                    "
                            >
                                Your dashboard
                            </span>
                        </div>
                    </div>
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
                    pt-10
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
                        const isActive = isItemActive(item);

                        return (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                end={isRootDashboard(item.path)}
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
                                        isActive
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
                                {/* Active rail */}

                                {isActive && (
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

                                        ${
                                            isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-white/40 group-hover:text-white/80'
                                        }
                                    `}
                                >
                                    <Icon
                                        className="h-4.25 w-4.25"
                                        strokeWidth={isActive ? 2.05 : 1.8}
                                    />
                                </span>

                                {/* Label */}

                                <span className="min-w-0 flex-1 truncate">
                                    {item.label}
                                </span>

                                {/* Arrow */}

                                {isActive && (
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
                {/* Account Menu */}

                {accountOpen && (
                    <div
                        className="
                            absolute
                            bottom-19
                            left-4
                            right-4
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#0d6863]
                            p-2
                            shadow-[0_16px_40px_rgba(0,0,0,0.25)]
                        "
                    >
                        {/* Account heading */}

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
                            onClick={() => setAccountOpen(false)}
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
                                    group-hover:text-white/50
                                "
                            />
                        </NavLink>

                        {/* Settings */}

                        <NavLink
                            to={`/dashboard/${role}/settings`}
                            onClick={() => setAccountOpen(false)}
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
                                    group-hover:text-white/50
                                "
                            />
                        </NavLink>

                        {/* Help */}

                        <NavLink
                            to="/help"
                            onClick={() => setAccountOpen(false)}
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
                                    group-hover:text-white/50
                                "
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

                {/* Account Trigger */}

                <button
                    type="button"
                    onClick={() => setAccountOpen((prev) => !prev)}
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

                    {/* User information */}

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

                    {/* Menu indicator */}

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
    );
};

export default DashboardSidebar;
