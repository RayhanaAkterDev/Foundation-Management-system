import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import logo from '@/assets/shared/logo.png';
import { NAV_CONFIG, ROLE_LABELS } from '@/routes/dashboardNav';

// ============================================================
// CONFIGURATION
// ============================================================

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 272;

const DASHBOARD_ROOTS = [
    '/admin/dashboard',
    '/individual/dashboard',
    '/organization/dashboard',
];

// ============================================================
// HELPERS
// ============================================================

function normalizePath(path = '') {
    if (!path) return '/';
    return path.replace(/\/+$/, '') || '/';
}

function isPathActive(itemPath, currentPath) {
    if (!itemPath) return false;

    const target = normalizePath(itemPath);
    const current = normalizePath(currentPath);

    if (DASHBOARD_ROOTS.includes(target)) {
        return target === current;
    }

    return current === target || current.startsWith(`${target}/`);
}

function hasActiveChild(item, currentPath) {
    if (!item?.children?.length) return false;

    return item.children.some(
        (child) =>
            isPathActive(child.path, currentPath) ||
            hasActiveChild(child, currentPath),
    );
}

function isNavItemActive(item, currentPath) {
    if (!item) return false;

    return (
        isPathActive(item.path, currentPath) ||
        hasActiveChild(item, currentPath)
    );
}

function getActiveChildKey(item, currentPath) {
    if (!item?.children?.length) return null;

    const matches = item.children
        .filter((child) => isPathActive(child.path, currentPath))
        .sort(
            (a, b) =>
                normalizePath(b.path).length - normalizePath(a.path).length,
        );

    return matches[0]?.key || null;
}

// ============================================================
// SECTION LABEL — EXPANDED MENU (UNCHANGED)
// ============================================================

function SectionLabel({ label, first }) {
    return (
        <div
            className={`
                px-3 pb-2
                ${first ? 'pt-4' : 'pt-7'}
            `}
        >
            <p
                className="
                    !m-0
                    text-[10px]
                    !font-semibold
                    uppercase
                    tracking-[0.12em]
                    !text-[#657184]
                "
            >
                {label}
            </p>
        </div>
    );
}

// ============================================================
// COMPRESSED COLLAPSED RAIL GROUP
// ============================================================

function RailGroup({ items, currentPath, onExpand, first }) {
    if (!items.length) return null;

    return (
        <div
            className={`
                flex w-full flex-col items-center
                gap-0.5
                ${first ? '' : 'mt-2.5'}
            `}
        >
            {/*
                A small spacing break distinguishes groups
                without adding divider lines or extra icons.
            */}

            {items.map((item) => (
                <RailItem
                    key={item.key}
                    item={item}
                    currentPath={currentPath}
                    onExpand={onExpand}
                />
            ))}
        </div>
    );
}

// ============================================================
// COMPRESSED COLLAPSED RAIL ITEM
// ============================================================

function RailItem({ item, currentPath, onExpand }) {
    const Icon = item.icon;
    const active = isNavItemActive(item, currentPath);
    const hasChildren = Boolean(item.children?.length);

    const className = `
        group relative
        flex h-9 w-9
        shrink-0 items-center justify-center
        rounded-md
        transition-colors duration-150

        focus-visible:outline-none
        focus-visible:ring-1
        focus-visible:ring-[#64748B]

        ${
            active
                ? `
                    bg-[#1C2530]
                    !text-[#E9EDF2]
                `
                : `
                    bg-transparent
                    !text-[#818D9D]
                    hover:bg-[#19212B]
                    hover:!text-[#E3E8EF]
                `
        }
    `;

    const content = (
        <>
            {active && (
                <span
                    aria-hidden="true"
                    className="
                        absolute -left-[7px] top-1/2
                        h-4 w-0.5
                        -translate-y-1/2
                        rounded-full bg-[#D8DDE5]
                    "
                />
            )}

            {Icon && <Icon size={16} strokeWidth={1.7} className="shrink-0" />}
        </>
    );

    if (hasChildren) {
        return (
            <button
                type="button"
                onClick={() => onExpand(item.key)}
                title={item.label}
                aria-label={`Open ${item.label} menu`}
                className={className}
            >
                {content}
            </button>
        );
    }

    if (item.path) {
        return (
            <Link
                to={item.path}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className={className}
            >
                {content}
            </Link>
        );
    }

    return null;
}

// ============================================================
// EXPANDED SUBMENU — UNCHANGED
// ============================================================

function SubMenu({ item, currentPath, open }) {
    if (!item.children?.length) return null;

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
                        relative
                        ml-[21px]
                        mt-1.5 mb-2
                        min-w-0
                        space-y-0.5
                        pl-5

                        before:absolute
                        before:bottom-1.5
                        before:left-[7px]
                        before:top-1
                        before:w-px
                        before:bg-[#29323E]

                        transition-transform
                        duration-300

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
                                    rounded-md
                                    px-2.5 py-1.5
                                    text-[12px]
                                    transition-colors
                                    duration-150

                                    ${
                                        active
                                            ? `
                                                !font-semibold
                                                !text-[#EEF1F5]

                                                before:absolute
                                                before:-left-[14px]
                                                before:top-1/2
                                                before:h-4
                                                before:w-[2px]
                                                before:-translate-y-1/2
                                                before:rounded-full
                                                before:bg-[#D8DDE5]
                                            `
                                            : `
                                                !font-medium
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
}

// ============================================================
// EXPANDED NAVIGATION ITEM — UNCHANGED
// ============================================================

function ExpandedNavItem({ item, currentPath, open, onToggle }) {
    const Icon = item.icon;
    const hasChildren = Boolean(item.children?.length);
    const active = isNavItemActive(item, currentPath);
    const childActive = hasActiveChild(item, currentPath);

    const baseClass = `
        group relative
        flex min-h-[42px]
        w-full min-w-0
        items-center gap-3
        rounded-md px-3
        text-left
        transition-colors duration-150

        focus-visible:outline-none
        focus-visible:ring-1
        focus-visible:ring-[#64748B]
    `;

    const icon = Icon ? (
        <Icon
            size={17}
            strokeWidth={1.7}
            className={`
                shrink-0
                transition-colors duration-150

                ${
                    active
                        ? '!text-[#DCE3EB]'
                        : `
                            !text-[#818D9D]
                            group-hover:!text-[#CDD5DE]
                        `
                }
            `}
        />
    ) : null;

    if (!hasChildren && item.path) {
        return (
            <Link
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`
                    ${baseClass}

                    ${
                        active
                            ? `
                                bg-[#1B222C]
                                !text-[#F1F3F5]
                            `
                            : `
                                !text-[#B8C0CC]
                                hover:bg-[#181F28]
                                hover:!text-[#F1F3F5]
                            `
                    }
                `}
            >
                {icon}

                <span
                    className={`
                        min-w-0 flex-1
                        truncate text-[12.5px]

                        ${active ? '!font-semibold' : '!font-medium'}
                    `}
                >
                    {item.label}
                </span>
            </Link>
        );
    }

    if (!hasChildren) return null;

    return (
        <div className="min-w-0">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className={`
                    ${baseClass}

                    ${
                        childActive
                            ? `
                                bg-[#1B222C]
                                !text-[#F1F3F5]
                            `
                            : `
                                !text-[#B8C0CC]
                                hover:bg-[#181F28]
                                hover:!text-[#F1F3F5]
                            `
                    }
                `}
            >
                {icon}

                <span
                    className={`
                        min-w-0 flex-1
                        truncate text-[12.5px]

                        ${childActive ? '!font-semibold' : '!font-medium'}
                    `}
                >
                    {item.label}
                </span>

                <ChevronDown
                    size={14}
                    strokeWidth={1.8}
                    className={`
                        shrink-0
                        !text-[#657184]
                        transition-transform duration-300
                        ${open ? 'rotate-180' : ''}
                    `}
                />
            </button>

            <SubMenu item={item} currentPath={currentPath} open={open} />
        </div>
    );
}

// ============================================================
// DASHBOARD SIDEBAR
// ============================================================

export default function DashboardSidebar({
    role,
    currentPath,
    collapsed = true,
    onCollapsedChange,
}) {
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
        setMenuState({
            path: normalizedCurrentPath,
            openKey: isMenuOpen(item) ? null : item.key,
            manuallyControlled: true,
        });
    };

    const expandFromRail = (key) => {
        setMenuState({
            path: normalizedCurrentPath,
            openKey: key,
            manuallyControlled: true,
        });

        onCollapsedChange?.(false);
    };

    const railGroups = useMemo(() => {
        const groups = [];
        let currentGroup = [];

        navItems.forEach((item) => {
            if (item.type === 'section') {
                if (currentGroup.length) {
                    groups.push(currentGroup);
                    currentGroup = [];
                }

                return;
            }

            currentGroup.push(item);
        });

        if (currentGroup.length) {
            groups.push(currentGroup);
        }

        return groups;
    }, [navItems]);

    return (
        <aside
            aria-label="Dashboard sidebar"
            style={{
                width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
            }}
            className="
                fixed inset-y-0 left-0 z-40
                hidden min-h-0 flex-col
                overflow-visible
                border-r border-[#252D38]
                bg-[#0E1219]
                transition-[width]
                duration-300 ease-out
                lg:flex
            "
        >
            {/* BRAND */}
            <div
                className={`
                    flex h-[72px] shrink-0
                    items-center
                    bg-[#0E1219]

                    ${collapsed ? 'justify-center px-2' : 'px-5'}
                `}
            >
                <Link
                    to="/"
                    title={collapsed ? 'Stand For People' : undefined}
                    className={`
                        flex min-w-0 items-center
                        ${collapsed ? 'justify-center' : 'gap-3'}
                    `}
                >
                    <div
                        className="
                            flex h-8 w-8 shrink-0
                            items-center justify-center
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
                                    !m-0 truncate
                                    text-[13.5px]
                                    !font-semibold
                                    tracking-[-0.02em]
                                    !text-[#EEF1F5]
                                "
                            >
                                Stand For People
                            </p>

                            <p
                                className="
                                    !m-0 mt-1 truncate
                                    text-[10px]
                                    !font-medium
                                    tracking-[0.025em]
                                    !text-[#657184]
                                "
                            >
                                {ROLE_LABELS[normalizedRole] || 'User'}{' '}
                                workspace
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            {collapsed ? (
                // ============================================
                // COMPRESSED RAIL
                // ============================================
                <nav
                    aria-label="Dashboard navigation"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    className="
                        min-h-0 flex-1
                        overflow-x-hidden
                        overflow-y-auto
                        overscroll-contain
                        px-1.5 py-2

                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                >
                    <div className="flex flex-col items-center">
                        {railGroups.map((group, index) => (
                            <RailGroup
                                key={group[0]?.key ?? index}
                                items={group}
                                first={index === 0}
                                currentPath={normalizedCurrentPath}
                                onExpand={expandFromRail}
                            />
                        ))}
                    </div>
                </nav>
            ) : (
                // ============================================
                // EXPANDED NAVIGATION — UNCHANGED
                // ============================================
                <nav
                    aria-label="Dashboard navigation"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    className="
                        min-h-0 min-w-0 flex-1
                        overflow-x-hidden
                        overflow-y-auto
                        overscroll-contain
                        px-3 py-3

                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                >
                    <div className="min-w-0 space-y-1">
                        {navItems.map((item, index) => {
                            if (item.type === 'section') {
                                const firstSection = !navItems
                                    .slice(0, index)
                                    .some((entry) => entry.type === 'section');

                                return (
                                    <SectionLabel
                                        key={item.key}
                                        label={item.label}
                                        first={firstSection}
                                    />
                                );
                            }

                            return (
                                <ExpandedNavItem
                                    key={item.key}
                                    item={item}
                                    currentPath={normalizedCurrentPath}
                                    open={isMenuOpen(item)}
                                    onToggle={() => toggleMenu(item)}
                                />
                            );
                        })}
                    </div>
                </nav>
            )}

            {/* COLLAPSE / EXPAND CONTROL */}
            <div
                className={`
                    flex shrink-0
                    items-center
                    bg-[#0E1219]
                    pb-5 pt-3

                    ${collapsed ? 'justify-center px-2' : 'justify-end px-4'}
                `}
            >
                <button
                    type="button"
                    onClick={() => onCollapsedChange?.(!collapsed)}
                    aria-label={
                        collapsed
                            ? 'Expand dashboard sidebar'
                            : 'Collapse dashboard sidebar'
                    }
                    aria-expanded={!collapsed}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className="
                        flex h-8 w-9 shrink-0
                        items-center justify-center
                        rounded-md
                        border border-[#303A47]
                        bg-[#161C25]
                        !text-[#8792A1]
                        transition-colors duration-150

                        hover:border-[#414D5C]
                        hover:bg-[#1B222C]
                        hover:!text-[#F1F3F5]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#64748B]
                    "
                >
                    {collapsed ? (
                        <ChevronRight size={15} strokeWidth={1.8} />
                    ) : (
                        <ChevronLeft size={15} strokeWidth={1.8} />
                    )}
                </button>
            </div>
        </aside>
    );
}
