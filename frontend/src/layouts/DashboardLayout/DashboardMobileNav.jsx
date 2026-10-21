import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';

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

/* ==========================================================================
   PATH HELPERS
============================================================================ */

const normalizePath = (path = '') => {
    if (!path) return '/';

    return path.replace(/\/+$/, '') || '/';
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
    if (!item?.children?.length) return false;

    return item.children.some(
        (child) =>
            isPathActive(child.path, currentPath) ||
            hasActiveChild(child, currentPath),
    );
};

const isNavItemActive = (item, currentPath) => {
    return Boolean(
        item &&
        (isPathActive(item.path, currentPath) ||
            hasActiveChild(item, currentPath)),
    );
};

const getActiveChildKey = (item, currentPath) => {
    if (!item?.children?.length) return null;

    return (
        item.children
            .filter((child) => isPathActive(child.path, currentPath))
            .sort(
                (a, b) =>
                    normalizePath(b.path).length - normalizePath(a.path).length,
            )[0]?.key || null
    );
};

/* ==========================================================================
   SECTION LABEL — ORIGINAL UI
============================================================================ */

const SectionLabel = ({ label }) => (
    <div className="mb-2.5 mt-7 px-3">
        <p
            className="
                text-[9px] font-semibold! uppercase
                tracking-[0.18em] !text-[#657184]
            "
        >
            {label}
        </p>
    </div>
);

/* ==========================================================================
   SUBMENU — ORIGINAL UI AND ANIMATION
============================================================================ */

const MobileSubMenu = ({ item, currentPath, open, onNavigate }) => {
    if (!item.children?.length) return null;

    const activeChildKey = getActiveChildKey(item, currentPath);

    return (
        <div
            aria-hidden={!open}
            className={`
                grid transition-[grid-template-rows,opacity]
                duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${
                    open
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'pointer-events-none grid-rows-[0fr] opacity-0'
                }
            `}
        >
            <div className="overflow-hidden">
                <div
                    className={`
                        relative ml-[21px] mt-1.5 space-y-0.5
                        pb-2.5 pl-5

                        before:absolute before:bottom-2.5
                        before:left-[7px] before:top-1
                        before:w-px before:bg-[#29323E]

                        transition-transform duration-300
                        ease-[cubic-bezier(0.4,0,0.2,1)]

                        ${open ? 'translate-y-0' : '-translate-y-1'}
                    `}
                >
                    {item.children.map((child) => {
                        const active =
                            child.key === activeChildKey ||
                            (!activeChildKey &&
                                isNavItemActive(child, currentPath));

                        return (
                            <Link
                                key={child.key}
                                to={child.path}
                                onClick={onNavigate}
                                tabIndex={open ? 0 : -1}
                                aria-current={active ? 'page' : undefined}
                                className={`
                                    group/sub relative flex min-h-8
                                    items-center gap-2.5 rounded-md
                                    px-2.5 text-[11.5px] font-medium!
                                    transition-colors duration-150

                                    ${
                                        active
                                            ? `
                                                bg-transparent
                                                !text-[#EEF1F5]
                                                font-semibold!

                                                before:absolute
                                                before:-left-[14px]
                                                before:h-4
                                                before:w-[2px]
                                                before:rounded-full
                                                before:bg-[#D8DDE5]
                                            `
                                            : `
                                                !text-[#8792A1]
                                                hover:bg-[#181F28]
                                                hover:!text-[#DDE2E8]
                                            `
                                    }
                                `}
                            >
                                <span className="min-w-0 truncate">
                                    {child.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   NAV ITEM — ORIGINAL UI
============================================================================ */

const MobileNavItem = ({ item, currentPath, open, onToggle, onNavigate }) => {
    const Icon = item.icon;

    const hasChildren = Boolean(item.children?.length);

    const active = isNavItemActive(item, currentPath);

    const childActive = hasActiveChild(item, currentPath);

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`
                    group relative flex min-h-[40px] w-full
                    items-center gap-3 rounded-md px-3
                    transition-colors duration-150

                    ${
                        active
                            ? 'bg-[#1B222C] !text-[#F3F5F7]'
                            : `
                                !text-[#B8C0CC]
                                hover:bg-[#181F28]
                                hover:!text-[#F1F3F5]
                            `
                    }
                `}
            >
                {active && (
                    <span
                        aria-hidden="true"
                        className="
                            absolute bottom-2.5 left-0 top-2.5
                            w-0.5 rounded-r-full bg-transparent
                        "
                    />
                )}

                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className={`
                            shrink-0 transition-colors duration-150

                            ${
                                active
                                    ? '!text-[#E5E9EE]'
                                    : `
                                        !text-[#7F8998]
                                        group-hover:!text-[#CDD3DB]
                                    `
                            }
                        `}
                    />
                )}

                <span
                    className={`
                        min-w-0 flex-1 truncate text-[12.5px]

                        ${active ? 'font-semibold!' : 'font-medium!'}
                    `}
                >
                    {item.label}
                </span>
            </Link>
        );
    }

    if (!hasChildren) return null;

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className={`
                    group flex min-h-[40px] w-full items-center
                    gap-3 rounded-md px-3 text-left
                    transition-colors duration-150

                    ${
                        childActive
                            ? 'bg-[#1B222C] !text-[#F1F3F5]'
                            : `
                                !text-[#B8C0CC]
                                hover:bg-[#181F28]
                                hover:!text-[#F1F3F5]
                            `
                    }
                `}
            >
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className={`
                            shrink-0 transition-colors duration-150

                            ${
                                childActive
                                    ? '!text-[#D5DAE1]'
                                    : `
                                        !text-[#7F8998]
                                        group-hover:!text-[#CDD3DB]
                                    `
                            }
                        `}
                    />
                )}

                <span
                    className={`
                        min-w-0 flex-1 truncate text-[12.5px]

                        ${childActive ? 'font-semibold!' : 'font-medium!'}
                    `}
                >
                    {item.label}
                </span>

                <ChevronDown
                    size={12.5}
                    strokeWidth={1.8}
                    className={`
                        shrink-0 !text-[#657184]
                        transition-transform duration-300
                        ease-[cubic-bezier(0.4,0,0.2,1)]
                        group-hover:!text-[#B8C0CC]

                        ${open ? 'rotate-180' : ''}
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
};

/* ==========================================================================
   MOBILE NAVIGATION
============================================================================ */

const DashboardMobileNav = ({ role, currentPath, open, onClose }) => {
    const [menuState, setMenuState] = useState({
        path: null,
        openKey: null,
        manuallyControlled: false,
    });

    const navItems = useMemo(() => NAV_CONFIG[role] || [], [role]);

    const roleLabel = ROLE_LABELS[role] || 'User';

    const normalizedCurrentPath = normalizePath(currentPath);

    /* ======================================================================
       MENU STATE
    ====================================================================== */

    const routeOpenMenuKey = useMemo(() => {
        const activeParent = navItems.find(
            (item) =>
                item.type !== 'section' &&
                item.children?.length &&
                hasActiveChild(item, normalizedCurrentPath),
        );

        return activeParent?.key || null;
    }, [navItems, normalizedCurrentPath]);

    const hasManualMenuState =
        menuState.manuallyControlled &&
        menuState.path === normalizedCurrentPath;

    const effectiveOpenMenuKey = hasManualMenuState
        ? menuState.openKey
        : routeOpenMenuKey;

    const isMenuOpen = (item) => effectiveOpenMenuKey === item.key;

    const toggleMenu = (item) => {
        const currentlyOpen = isMenuOpen(item);

        setMenuState({
            path: normalizedCurrentPath,
            openKey: currentlyOpen ? null : item.key,
            manuallyControlled: true,
        });
    };

    /* ======================================================================
       CLOSE ON ROUTE CHANGE
    ====================================================================== */

    useEffect(() => {
        if (open) {
            onClose?.();
        }

        // Close drawer when route changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath]);

    /* ======================================================================
       BODY SCROLL LOCK
    ====================================================================== */

    useEffect(() => {
        if (!open) return undefined;

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
        if (!open) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    const closeDrawer = () => {
        onClose?.();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* BACKDROP */}
            <button
                type="button"
                aria-label="Close navigation"
                onClick={closeDrawer}
                className="
                    absolute inset-0 cursor-default
                    bg-[#030507]/80 backdrop-blur-[2px]
                "
            />

            {/* DRAWER */}
            <aside
                aria-label="Mobile dashboard navigation"
                className="
                    absolute inset-y-0 left-0
                    flex w-[320px] max-w-[calc(100vw-16px)]
                    flex-col overflow-hidden
                    border-r border-[#252D38]
                    bg-[#0E1219]
                    shadow-[18px_0_55px_rgba(0,0,0,0.48)]
                    sm:w-[340px]
                "
            >
                {/* BRAND — ORIGINAL UI */}
                <header
                    className="
                        flex h-16 shrink-0 items-center justify-between
                        gap-3 bg-[#0E1219] px-4
                    "
                >
                    <Link
                        to="/"
                        onClick={closeDrawer}
                        className="flex min-w-0 items-center gap-2.5"
                    >
                        <div className="flex h-6 shrink-0 items-center justify-center overflow-hidden">
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    truncate text-[13px] font-semibold!
                                    tracking-[-0.01em] !text-[#EEF1F5]
                                "
                            >
                                Stand For People
                            </p>

                            <p
                                className="
                                    mt-0.5 truncate text-[8px] font-semibold!
                                    uppercase tracking-[0.17em]
                                    !text-[#657184]
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
                            flex h-8 w-8 shrink-0 items-center justify-center
                            rounded-md !text-[#8792A1]
                            transition-colors duration-150
                            hover:bg-[#181F28] hover:!text-[#F1F3F5]
                            focus:outline-none
                        "
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </header>

                {/* NAVIGATION — INVISIBLE SCROLLBAR */}
                <nav
                    aria-label="Dashboard navigation"
                    className="
                        min-h-0 flex-1 overflow-x-hidden overflow-y-auto
                        px-3 py-3.5

                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                >
                    <div className="space-y-0.5">
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
            </aside>
        </div>
    );
};

export default DashboardMobileNav;
