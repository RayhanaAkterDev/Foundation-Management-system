import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import logo from '@/assets/shared/logo.png';
import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

/* ==========================================================================
   CONFIGURATION
============================================================================ */

const SIDEBAR_WIDTH = {
    collapsed: 64,
    expanded: 272,
};

const DASHBOARD_ROOTS = [
    '/individual/dashboard',
    '/organization/dashboard',
    '/admin/dashboard',
];

/* ==========================================================================
   PATH HELPERS
============================================================================ */

const normalizePath = (path = '') => {
    if (!path) return '/';

    return path.replace(/\/+$/, '') || '/';
};

const isPathActive = (itemPath, currentPath) => {
    if (!itemPath || !currentPath) return false;

    const target = normalizePath(itemPath);
    const current = normalizePath(currentPath);

    if (DASHBOARD_ROOTS.includes(target)) {
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
    if (!item) return false;

    return (
        isPathActive(item.path, currentPath) ||
        hasActiveChild(item, currentPath)
    );
};

const getActiveChildKey = (item, currentPath) => {
    if (!item?.children?.length) return null;

    const matches = item.children
        .filter((child) => isPathActive(child.path, currentPath))
        .sort(
            (a, b) =>
                normalizePath(b.path).length - normalizePath(a.path).length,
        );

    return matches[0]?.key || null;
};

/* ==========================================================================
   SECTION LABEL
============================================================================ */

function SectionLabel({ label, collapsed, first = false }) {
    if (collapsed) {
        if (first) return null;

        return <div aria-hidden="true" className="h-2" />;
    }

    return (
        <div
            className={`
                px-3 pb-2

                ${first ? 'pt-2' : 'pt-5'}
            `}
        >
            <p
                className="
                    text-[9px] font-semibold!
                    uppercase tracking-[0.16em]
                    text-[#657184]!
                "
            >
                {label}
            </p>
        </div>
    );
}

/* ==========================================================================
   SUBMENU
============================================================================ */

function SubMenu({ item, currentPath, open, collapsed }) {
    if (!item.children?.length || collapsed) {
        return null;
    }

    const activeChildKey = getActiveChildKey(item, currentPath);

    return (
        <div
            aria-hidden={!open}
            className={`
                grid min-w-0
                transition-[grid-template-rows,opacity]
                duration-300
                ease-[cubic-bezier(0.4,0,0.2,1)]

                ${
                    open
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'pointer-events-none grid-rows-[0fr] opacity-0'
                }
            `}
        >
            <div className="min-w-0 overflow-hidden">
                <div
                    className={`
                        relative ml-[21px]
                        mt-1.5 mb-2
                        min-w-0 space-y-0.5
                        pl-5

                        before:absolute
                        before:bottom-1.5
                        before:left-[7px]
                        before:top-1
                        before:w-px
                        before:bg-[#29323E]!

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
                                tabIndex={open ? 0 : -1}
                                aria-current={active ? 'page' : undefined}
                                className={`
                                    group/sub relative
                                    flex min-h-[34px]
                                    min-w-0 items-center
                                    rounded-md px-2.5 py-1.5
                                    text-[11.5px]
                                    transition-colors duration-150

                                    ${
                                        active
                                            ? `
                                                bg-transparent!
                                                font-semibold!
                                                text-[#EEF1F5]!

                                                before:absolute
                                                before:-left-[14px]
                                                before:top-1/2
                                                before:h-4
                                                before:w-[2px]
                                                before:-translate-y-1/2
                                                before:rounded-full
                                                before:bg-[#D8DDE5]!
                                            `
                                            : `
                                                font-medium!
                                                text-[#8792A1]!
                                                hover:bg-[#181F28]!
                                                hover:text-[#DDE2E8]!
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
}

/* ==========================================================================
   NAV ITEM
============================================================================ */

function NavItem({ item, currentPath, collapsed, open, onToggle }) {
    const Icon = item.icon;

    const hasChildren = Boolean(item.children?.length);

    const active = isNavItemActive(item, currentPath);

    const childActive = hasActiveChild(item, currentPath);

    const baseClass = `
        group relative flex
        h-[38px] items-center
        rounded-md
        transition-colors duration-150

        focus-visible:outline-none
        focus-visible:ring-1
        focus-visible:ring-[#64748B]
    `;

    const layoutClass = collapsed
        ? 'mx-auto w-10 justify-center'
        : 'w-full min-w-0 gap-3 px-3';

    /* ======================================================================
       DIRECT LINK
    ====================================================================== */

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={`
                    ${baseClass}
                    ${layoutClass}

                    ${
                        active
                            ? `
                                bg-[#1B222C]!
                                text-[#F3F5F7]!
                            `
                            : `
                                text-[#B8C0CC]!
                                hover:bg-[#181F28]!
                                hover:text-[#F1F3F5]!
                            `
                    }
                `}
            >
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className={`
                            shrink-0
                            transition-colors duration-150

                            ${
                                active
                                    ? 'text-[#E5E9EE]!'
                                    : `
                                        text-[#7F8998]!
                                        group-hover:text-[#CDD3DB]!
                                    `
                            }
                        `}
                    />
                )}

                {!collapsed && (
                    <span
                        className={`
                            min-w-0 flex-1
                            truncate text-[12px]

                            ${active ? 'font-semibold!' : 'font-medium!'}
                        `}
                    >
                        {item.label}
                    </span>
                )}
            </Link>
        );
    }

    if (!hasChildren) return null;

    /* ======================================================================
       EXPANDABLE LINK
    ====================================================================== */

    return (
        <div className="min-w-0">
            <button
                type="button"
                onClick={onToggle}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
                aria-expanded={collapsed ? false : open}
                className={`
                    ${baseClass}
                    ${layoutClass}
                    text-left

                    ${
                        childActive
                            ? `
                                bg-[#1B222C]!
                                text-[#F1F3F5]!
                            `
                            : `
                                text-[#B8C0CC]!
                                hover:bg-[#181F28]!
                                hover:text-[#F1F3F5]!
                            `
                    }
                `}
            >
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className={`
                            shrink-0
                            transition-colors duration-150

                            ${
                                childActive
                                    ? 'text-[#D5DAE1]!'
                                    : `
                                        text-[#7F8998]!
                                        group-hover:text-[#CDD3DB]!
                                    `
                            }
                        `}
                    />
                )}

                {!collapsed && (
                    <>
                        <span
                            className={`
                                min-w-0 flex-1
                                truncate text-[12px]

                                ${
                                    childActive
                                        ? 'font-semibold!'
                                        : 'font-medium!'
                                }
                            `}
                        >
                            {item.label}
                        </span>

                        <ChevronDown
                            size={12.5}
                            strokeWidth={1.8}
                            className={`
                                shrink-0
                                text-[#657184]!
                                transition-transform duration-300
                                ease-[cubic-bezier(0.4,0,0.2,1)]

                                group-hover:text-[#B8C0CC]!

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
            />
        </div>
    );
}

/* ==========================================================================
   DESKTOP SIDEBAR
============================================================================ */

const DashboardSidebar = ({
    role,
    currentPath,
    collapsed = true,
    onCollapsedChange,
}) => {
    const normalizedRole =
        typeof role === 'string' ? role.toLowerCase() : 'individual';

    const navItems = useMemo(
        () => NAV_CONFIG[normalizedRole] || [],
        [normalizedRole],
    );

    const normalizedCurrentPath = normalizePath(currentPath);

    const [menuState, setMenuState] = useState({
        path: null,
        openKey: null,
        manuallyControlled: false,
    });

    /* ======================================================================
       ACTIVE MENU
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

        if (collapsed) {
            onCollapsedChange?.(false);

            setMenuState({
                path: normalizedCurrentPath,
                openKey: item.key,
                manuallyControlled: true,
            });

            return;
        }

        setMenuState({
            path: normalizedCurrentPath,
            openKey: currentlyOpen ? null : item.key,
            manuallyControlled: true,
        });
    };

    /* ======================================================================
       COLLAPSE
    ====================================================================== */

    const handleCollapseToggle = () => {
        onCollapsedChange?.(!collapsed);
    };

    /* ======================================================================
       RENDER
    ====================================================================== */

    return (
        <aside
            aria-label="Dashboard sidebar"
            style={{
                width: collapsed
                    ? SIDEBAR_WIDTH.collapsed
                    : SIDEBAR_WIDTH.expanded,
            }}
            className="
                fixed inset-y-0 left-0 z-40
                hidden min-h-0 flex-col
                overflow-visible
                border-r border-[#252D38]!
                bg-[#0E1219]!
                transition-[width] duration-300
                ease-out
                lg:flex
            "
        >
            {/* =============================================================
                BRAND
            ============================================================= */}

            <div
                className={`
                    flex h-16 shrink-0
                    items-center
                    bg-[#0E1219]!

                    ${collapsed ? 'justify-center px-2' : 'px-4'}
                `}
            >
                <Link
                    to="/"
                    title={collapsed ? 'Stand For People' : undefined}
                    className={`
                        flex min-w-0
                        items-center

                        ${collapsed ? 'justify-center' : 'gap-2.5'}
                    `}
                >
                    <div
                        className="
                            flex h-6 w-6 shrink-0
                            items-center justify-center
                            overflow-hidden
                        "
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="
                                h-full w-full
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
                                    font-semibold!
                                    tracking-[-0.01em]
                                    text-[#EEF1F5]!
                                "
                            >
                                Stand For People
                            </p>

                            <p
                                className="
                                    mt-0.5 truncate
                                    text-[8px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.17em]
                                    text-[#657184]!
                                "
                            >
                                {ROLE_LABELS[normalizedRole] || 'User'}{' '}
                                workspace
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            {/* =============================================================
                NAVIGATION
            ============================================================= */}

            <nav
                aria-label="Dashboard navigation"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                className={`
                    min-h-0 min-w-0 flex-1
                    overflow-x-hidden
                    overflow-y-auto
                    overscroll-contain
                    py-3.5

                    ${collapsed ? 'px-2' : 'px-3'}

                    [scrollbar-width:none]
                    [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                `}
            >
                <div
                    className={
                        collapsed ? 'min-w-0 space-y-0.5' : 'min-w-0 space-y-1'
                    }
                >
                    {navItems.map((item, index) => {
                        if (item.type === 'section') {
                            const firstSection = !navItems
                                .slice(0, index)
                                .some((entry) => entry.type === 'section');

                            return (
                                <SectionLabel
                                    key={item.key}
                                    label={item.label}
                                    collapsed={collapsed}
                                    first={firstSection}
                                />
                            );
                        }

                        return (
                            <NavItem
                                key={item.key}
                                item={item}
                                currentPath={normalizedCurrentPath}
                                collapsed={collapsed}
                                open={isMenuOpen(item)}
                                onToggle={() => toggleMenu(item)}
                            />
                        );
                    })}
                </div>
            </nav>

            {/* =============================================================
                COLLAPSE BUTTON
            ============================================================= */}

            <button
                type="button"
                onClick={handleCollapseToggle}
                aria-label={
                    collapsed
                        ? 'Expand dashboard sidebar'
                        : 'Collapse dashboard sidebar'
                }
                aria-expanded={!collapsed}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="
                    absolute -right-2.5 bottom-12 z-10
                    flex h-6 w-6
                    items-center justify-center
                    rounded-md
                    border border-[#303A47]!
                    bg-[#161C25]!
                    text-[#8792A1]!
                    shadow-[0_3px_10px_rgba(0,0,0,0.32)]
                    transition-colors duration-150

                    hover:border-[#414D5C]!
                    hover:bg-[#1B222C]!
                    hover:text-[#F1F3F5]!

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#64748B]
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
