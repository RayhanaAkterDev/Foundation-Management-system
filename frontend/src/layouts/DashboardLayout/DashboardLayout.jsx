import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopbar from './DashboardTopbar';
import DashboardMobileNav from './DashboardMobileNav';
import { NAV_CONFIG } from '@/routes/dashboardNav';

// Derive active role from current path
function getRoleFromPath(pathname) {
    if (pathname.startsWith('/dashboard/organization')) return 'organization';
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    return 'individual';
}

// Derive page title from current path
function getPageTitle(pathname, role) {
    const nav = NAV_CONFIG[role] || [];
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Dashboard home
    if (lastSegment === role || lastSegment === 'dashboard') return 'Dashboard';

    const match = nav.find((item) => {
        if (!item.path) return false;
        const itemSegments = item.path.split('/').filter(Boolean);
        return itemSegments[itemSegments.length - 1] === lastSegment;
    });
    if (match) return match.label;

    // Fallback: capitalise kebab-case segment
    return lastSegment
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

const DashboardLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const role = getRoleFromPath(location.pathname);
    const pageTitle = getPageTitle(location.pathname, role);

    return (
        <div className="flex min-h-screen w-full bg-[#eef3f6]">
            {/* Desktop sidebar */}
            <DashboardSidebar role={role} currentPath={location.pathname} />

            {/* Mobile nav drawer */}
            <DashboardMobileNav
                role={role}
                currentPath={location.pathname}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main column */}
            <div className="flex flex-1 min-w-0 flex-col">
                <DashboardTopbar
                    pageTitle={pageTitle}
                    role={role}
                    onMenuOpen={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
