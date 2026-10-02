import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import DashboardMobileNav from './DashboardMobileNav';

import { NAV_CONFIG } from '@/routes/dashboardNav';

/* ==========================================================================
   ROLE
============================================================================ */

function getRoleFromPath(pathname) {
    if (pathname.startsWith('/admin/dashboard')) {
        return 'admin';
    }

    if (pathname.startsWith('/organization/dashboard')) {
        return 'organization';
    }

    if (pathname.startsWith('/individual/dashboard')) {
        return 'individual';
    }

    return 'individual';
}

/* ==========================================================================
   PAGE TITLE
============================================================================ */

function findBestNavMatch(items, pathname) {
    let bestMatch = null;

    const walk = (navItems) => {
        navItems.forEach((item) => {
            if (item.path) {
                const target = item.path.replace(/\/+$/, '');
                const current = pathname.replace(/\/+$/, '');

                const matches =
                    current === target || current.startsWith(`${target}/`);

                if (
                    matches &&
                    (!bestMatch || target.length > bestMatch.path.length)
                ) {
                    bestMatch = {
                        ...item,
                        path: target,
                    };
                }
            }

            if (item.children?.length) {
                walk(item.children);
            }
        });
    };

    walk(items);

    return bestMatch;
}

function getPageTitle(pathname, role) {
    const nav = NAV_CONFIG[role] || [];
    const dashboardRoot = `/${role}/dashboard`;
    const normalizedPath = pathname.replace(/\/+$/, '');

    if (normalizedPath === dashboardRoot) {
        return 'Dashboard';
    }

    const match = findBestNavMatch(nav, normalizedPath);

    if (match?.label) {
        return match.label;
    }

    const segments = normalizedPath.split('/').filter(Boolean);

    const lastSegment = segments[segments.length - 1];

    return lastSegment
        ? lastSegment
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
        : 'Dashboard';
}

/* ==========================================================================
   DASHBOARD LAYOUT
============================================================================ */

const DashboardLayout = () => {
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    const role = getRoleFromPath(location.pathname);

    const pageTitle = getPageTitle(location.pathname, role);

    return (
        <div
            className="
                min-h-screen
                w-full
                bg-[#181A20]
                !text-[#F1F2F4]
            "
        >
            <DashboardSidebar
                role={role}
                currentPath={location.pathname}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
            />

            <DashboardMobileNav
                role={role}
                currentPath={location.pathname}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div
                className={`
                    flex
                    min-h-screen
                    min-w-0
                    flex-col

                    bg-[#181A20]

                    transition-[padding-left]
                    duration-300
                    ease-out

                    ${sidebarCollapsed ? 'lg:pl-[60px]' : 'lg:pl-[264px]'}
                `}
            >
                <DashboardTopbar
                    pageTitle={pageTitle}
                    role={role}
                    onMenuOpen={() => setSidebarOpen(true)}
                />

                <main
                    className="
                        min-w-0
                        flex-1
                        overflow-y-auto
                        bg-[#181A20]
                        !text-[#F1F2F4]
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1600px]

                            p-4
                            sm:p-5
                            lg:p-6
                            xl:p-7
                        "
                    >
                        <Outlet />
                        {/* <h1 className="text-5xl font-bold text-white! text-center">
                            Dashboard
                        </h1> */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
