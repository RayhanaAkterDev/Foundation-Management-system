import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import DashboardMobileNav from './DashboardMobileNav';

import { NAV_CONFIG } from '@/routes/dashboardNav';

// ============================================================
// ROLE
// ============================================================

function getRoleFromPath(pathname) {
    if (pathname.startsWith('/dashboard/organization')) {
        return 'organization';
    }

    if (pathname.startsWith('/dashboard/admin')) {
        return 'admin';
    }

    return 'individual';
}

// ============================================================
// PAGE TITLE
// ============================================================

function getPageTitle(pathname, role) {
    const nav = NAV_CONFIG[role] || [];

    const segments = pathname.split('/').filter(Boolean);

    const lastSegment = segments[segments.length - 1];

    if (lastSegment === role || lastSegment === 'dashboard') {
        return 'Dashboard';
    }

    const match = nav.find((item) => {
        if (!item.path) return false;

        const itemSegments = item.path.split('/').filter(Boolean);

        return itemSegments[itemSegments.length - 1] === lastSegment;
    });

    if (match) {
        return match.label;
    }

    return lastSegment
        ? lastSegment
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
        : 'Dashboard';
}

// ============================================================
// LAYOUT
// ============================================================

const DashboardLayout = () => {
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const role = getRoleFromPath(location.pathname);

    const pageTitle = getPageTitle(location.pathname, role);

    return (
        <div
            className="
                min-h-screen
                w-full
                text-text-primary
            "
        >
            {/* ==================================================
                DESKTOP SIDEBAR
            ================================================== */}

            <DashboardSidebar role={role} currentPath={location.pathname} />

            {/* ==================================================
                MOBILE NAV
            ================================================== */}

            <DashboardMobileNav
                role={role}
                currentPath={location.pathname}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* ==================================================
                MAIN SHELL
            ================================================== */}

            <div
                className="
                    flex
                    min-h-screen
                    min-w-0
                    flex-col
                    md:pl-66
                "
            >
                {/* TOPBAR */}

                <DashboardTopbar
                    pageTitle={pageTitle}
                    role={role}
                    onMenuOpen={() => setSidebarOpen(true)}
                />

                {/* ==================================================
                    MAIN CANVAS
                ================================================== */}

                <main
                    className="
                        min-w-0
                        flex-1
                        overflow-y-auto
                        bg-background-alt
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-400
                            px-4
                            py-5
                            sm:px-6
                            sm:py-6
                            lg:px-8
                            lg:py-8
                            xl:px-10
                        "
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
