import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import logo from '@/assets/shared/logo.png';
import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

/* ==========================================================================
   HELPERS
============================================================================ */

const normalizePath = (path = '') => {
    if (!path) return '/';

    const normalized = path.replace(/\/+$/, '');

    return normalized || '/';
};

const isPathActive = (itemPath, currentPath) => {
    if (!itemPath) return false;

    const target = normalizePath(itemPath);
    const current = normalizePath(currentPath);

    const isDashboardRoot =
        target === '/individual/dashboard' ||
        target === '/organization/dashboard' ||
        target === '/admin/dashboard';

    if (isDashboardRoot) {
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

const SectionLabel = ({ label, collapsed }) => {
    if (collapsed) {
        return (
            <div
                className="flex h-8 items-center justify-center"
                aria-hidden="true"
            >
                <span className="h-px w-4 bg-[#29323E]" />
            </div>
        );
    }

    return (
        <div className="mb-2.5 mt-7 px-3">
            <p
                className="
                    text-[9px]
                    font-semibold!
                    uppercase
                    tracking-[0.18em]
                    !text-[#657184]
                "
            >
                {label}
            </p>
        </div>
    );
};

/* ==========================================================================
   SUB MENU
============================================================================ */

const SubMenu = ({ item, currentPath, open, collapsed, onNavigate }) => {
    if (!item.children?.length || collapsed) {
        return null;
    }

    const activeChildKey = getActiveChildKey(item, currentPath);

    return (
        <div
            aria-hidden={!open}
            className={`
                grid
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
            <div className="overflow-hidden">
                <div
                    className={`
                        relative
                        ml-[21px]
                        mt-1.5
                        space-y-0.5
                        pb-2.5
                        pl-5

                        before:absolute
                        before:bottom-2.5
                        before:left-[7px]
                        before:top-1
                        before:w-px
                        before:bg-[#29323E]

                        transition-transform
                        duration-300
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
                                className={`
                                    group/sub
                                    relative
                                    flex
                                    min-h-8
                                    items-center
                                    gap-2.5
                                    rounded-md
                                    px-2.5
                                    text-[11.5px]
                                    font-medium!!
                                    transition-colors
                                    duration-150

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
   NAV ITEM
============================================================================ */

const NavItem = ({
    item,
    currentPath,
    collapsed,
    open,
    onToggle,
    onNavigate,
}) => {
    const Icon = item.icon;
    const hasChildren = Boolean(item.children?.length);
    const active = isNavItemActive(item, currentPath);
    const childActive = hasActiveChild(item, currentPath);

    /* ======================================================================
       DIRECT ITEM
    ====================================================================== */

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={`
                    group
                    relative
                    flex
                    min-h-[40px]
                    items-center
                    rounded-md
                    transition-colors
                    duration-150

                    ${
                        collapsed
                            ? 'mx-auto w-10 justify-center'
                            : 'w-full gap-3 px-3'
                    }

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
                        className="
                            absolute
                            bottom-2.5
                            left-0
                            top-2.5
                            w-0.5
                            rounded-r-full
                            bg-transparent
                        "
                    />
                )}

                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className={`
                            shrink-0
                            transition-colors
                            duration-150
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

                {!collapsed && (
                    <span
                        className={`
                            min-w-0
                            flex-1
                            truncate
                            text-[12.5px]
                            ${active ? 'font-semibold!' : 'font-medium!!'}
                        `}
                    >
                        {item.label}
                    </span>
                )}
            </Link>
        );
    }

    /* ======================================================================
       EXPANDABLE ITEM
    ====================================================================== */

    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                title={collapsed ? item.label : undefined}
                aria-expanded={open}
                className={`
                    group
                    flex
                    min-h-[40px]
                    items-center
                    rounded-lg
                    text-left
                    transition-colors
                    duration-150

                    ${
                        collapsed
                            ? 'mx-auto w-10 justify-center'
                            : 'w-full gap-3 px-3'
                    }

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
                            shrink-0
                            transition-colors
                            duration-150
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

                {!collapsed && (
                    <>
                        <span
                            className={`
                                min-w-0
                                flex-1
                                truncate
                                text-[12.5px]
                                ${
                                    childActive
                                        ? 'font-semibold!'
                                        : 'font-medium!!'
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
                                !text-[#657184]
                                transition-transform
                                duration-300
                                ease-[cubic-bezier(0.4,0,0.2,1)]
                                group-hover:!text-[#B8C0CC]
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
                onNavigate={onNavigate}
            />
        </div>
    );
};

/* ==========================================================================
   SIDEBAR
============================================================================ */

const DashboardSidebar = ({
    role,
    currentPath,
    collapsed = true,
    onCollapsedChange,
}) => {
    const navItems = useMemo(() => NAV_CONFIG[role] || [], [role]);

    const normalizedCurrentPath = normalizePath(currentPath);

    const [menuState, setMenuState] = useState({
        path: null,
        openKey: null,
        manuallyControlled: false,
    });

    /* ======================================================================
       MENUS
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
            className={`
                fixed
                inset-y-0
                left-0
                z-40
                hidden
                flex-col
                border-r
                border-[#252D38]
                bg-[#0E1219]
                lg:flex

                ${collapsed ? 'w-[64px]' : 'w-[272px]'}

                transition-[width]
                duration-300
                ease-out
            `}
        >
            {/* =============================================================
                BRAND
            ============================================================= */}

            <div
                className={`
                    flex
                    h-16
                    shrink-0
                    items-center
                    bg-[#0E1219]
                    ${collapsed ? 'justify-center px-2' : 'px-4'}
                `}
            >
                <Link
                    to="/"
                    title={collapsed ? 'Stand For People' : undefined}
                    className={`
                        flex
                        min-w-0
                        items-center
                        ${collapsed ? 'justify-center' : 'gap-2.5'}
                    `}
                >
                    <div
                        className="
                            flex
                            h-6
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                        "
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="h-full w-full object-contain"
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
                                    !text-[#EEF1F5]
                                "
                            >
                                Stand For People
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate
                                    text-[8px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.17em]
                                    !text-[#657184]
                                "
                            >
                                {ROLE_LABELS[role]} workspace
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            {/* =============================================================
                NAVIGATION
            ============================================================= */}

            <nav
                className={`
        min-h-0
        flex-1
        overflow-x-hidden
        overflow-y-auto
        py-3.5
        ${collapsed ? 'px-2' : 'px-3'}

        [scrollbar-width:none]
        [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden
    `}
            >
                <div className="space-y-0.5">
                    {navItems.map((item) => {
                        if (item.type === 'section') {
                            return (
                                <SectionLabel
                                    key={item.key}
                                    label={item.label}
                                    collapsed={collapsed}
                                />
                            );
                        }

                        return (
                            <NavItem
                                key={item.key}
                                item={item}
                                currentPath={currentPath}
                                collapsed={collapsed}
                                open={isMenuOpen(item)}
                                onToggle={() => toggleMenu(item)}
                                onNavigate={() => {}}
                            />
                        );
                    })}
                </div>
            </nav>

            {/* =============================================================
                COLLAPSE
            ============================================================= */}

            <button
                type="button"
                onClick={handleCollapseToggle}
                aria-label={
                    collapsed
                        ? 'Expand dashboard sidebar'
                        : 'Collapse dashboard sidebar'
                }
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="
                    absolute
                    -right-2.5
                    bottom-12
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-[#303A47]
                    bg-[#161C25]
                    !text-[#8792A1]
                    shadow-[0_3px_10px_rgba(0,0,0,0.32)]
                    transition-colors
                    duration-150
                    hover:border-[#414D5C]
                    hover:bg-[#1B222C]
                    hover:!text-[#F1F3F5]
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
