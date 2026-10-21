
import {
    LayoutDashboard,
    HeartHandshake,
    HandCoins,
    Users,
    Megaphone,
    UserCircle,
    Bell,
    Settings,
    Building2,
    ClipboardList,
    BarChart3,
    Banknote,
    UserCheck,
} from 'lucide-react';

// ============================================================
// DASHBOARD NAVIGATION CONFIGURATION
// Stand For People
// ============================================================

export const NAV_CONFIG = {
    // ========================================================
    // INDIVIDUAL
    // ========================================================
    individual: [
        // Overview
        {
            type: 'section',
            key: 'overview',
            label: 'Overview',
        },
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/individual/dashboard',
        },

        // My Activity
        {
            type: 'section',
            key: 'my-activity',
            label: 'My Activity',
        },
        {
            key: 'help-requests',
            label: 'Help Requests',
            icon: HeartHandshake,
            children: [
                {
                    key: 'help-requests-all',
                    label: 'My Help Requests',
                    path: '/individual/dashboard/help-requests',
                },
            ],
        },
        {
            key: 'donations',
            label: 'Donations',
            icon: HandCoins,
            children: [
                {
                    key: 'donations-all',
                    label: 'My Donations',
                    path: '/individual/dashboard/donations',
                },
            ],
        },
        {
            key: 'volunteer',
            label: 'Volunteer Activities',
            icon: Users,
            children: [
                {
                    key: 'volunteer-all',
                    label: 'My Activities',
                    path: '/individual/dashboard/volunteer',
                },
            ],
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            children: [
                {
                    key: 'campaigns-all',
                    label: 'Browse Campaigns',
                    path: '/individual/dashboard/campaigns',
                },
            ],
        },

        // Account
        {
            type: 'section',
            key: 'account',
            label: 'Account',
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: UserCircle,
            path: '/individual/dashboard/profile',
        },
        {
            key: 'notifications',
            label: 'Notifications',
            icon: Bell,
            path: '/individual/dashboard/notifications',
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/individual/dashboard/settings',
        },
    ],

    // ========================================================
    // ORGANIZATION
    // ========================================================
    organization: [
        // Overview
        {
            type: 'section',
            key: 'overview',
            label: 'Overview',
        },
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/organization/dashboard',
        },

        // Operations
        {
            type: 'section',
            key: 'operations',
            label: 'Operations',
        },
        {
            key: 'help-requests',
            label: 'Help Requests',
            icon: ClipboardList,
            children: [
                {
                    key: 'help-requests-all',
                    label: 'View All Requests',
                    path: '/organization/dashboard/help-requests',
                },
            ],
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            children: [
                {
                    key: 'campaigns-all',
                    label: 'View All Campaigns',
                    path: '/organization/dashboard/campaigns',
                },
            ],
        },
        {
            key: 'volunteers',
            label: 'Volunteers',
            icon: Users,
            children: [
                {
                    key: 'volunteers-all',
                    label: 'View Volunteers',
                    path: '/organization/dashboard/volunteers',
                },
            ],
        },

        // Insights
        {
            type: 'section',
            key: 'insights',
            label: 'Insights',
        },
        {
            key: 'reports',
            label: 'Impact & Reports',
            icon: BarChart3,
            path: '/organization/dashboard/reports',
        },

        // Account
        {
            type: 'section',
            key: 'account',
            label: 'Account',
        },
        {
            key: 'profile',
            label: 'Organization Profile',
            icon: Building2,
            path: '/organization/dashboard/profile',
        },
        {
            key: 'notifications',
            label: 'Notifications',
            icon: Bell,
            path: '/organization/dashboard/notifications',
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/organization/dashboard/settings',
        },
    ],

    // ========================================================
    // ADMIN
    // ========================================================
    admin: [
        // Overview
        {
            type: 'section',
            key: 'overview',
            label: 'Overview',
        },
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
        },

        // People & Network
        {
            type: 'section',
            key: 'people-network',
            label: 'People & Network',
        },
        {
            key: 'users',
            label: 'Users',
            icon: Users,
            children: [
                {
                    key: 'users-all',
                    label: 'All Users',
                    path: '/admin/dashboard/users',
                },
                {
                    key: 'users-add',
                    label: 'Add User',
                    path: '/admin/dashboard/users/add',
                },
            ],
        },
        {
            key: 'organizations',
            label: 'Organizations',
            icon: Building2,
            children: [
                {
                    key: 'organizations-all',
                    label: 'All Organizations',
                    path: '/admin/dashboard/organizations',
                },
                {
                    key: 'organizations-add',
                    label: 'Add Organization',
                    path: '/admin/dashboard/organizations/add',
                },
            ],
        },
        {
            key: 'volunteers',
            label: 'Volunteers',
            icon: UserCheck,
            children: [
                {
                    key: 'volunteers-all',
                    label: 'All Volunteers',
                    path: '/admin/dashboard/volunteers',
                },
                {
                    key: 'volunteers-requests',
                    label: 'Volunteer Requests',
                    path: '/admin/dashboard/volunteers/requests',
                },
            ],
        },

        // Operations
        {
            type: 'section',
            key: 'operations',
            label: 'Operations',
        },
        {
            key: 'help-requests',
            label: 'Help Requests',
            icon: ClipboardList,
            children: [
                {
                    key: 'help-requests-all',
                    label: 'All Help Requests',
                    path: '/admin/dashboard/help-requests',
                },
            ],
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            children: [
                {
                    key: 'campaigns-all',
                    label: 'View All Campaigns',
                    path: '/admin/dashboard/campaigns',
                },
            ],
        },

        // Finance
        {
            type: 'section',
            key: 'finance',
            label: 'Finance',
        },
        {
            key: 'donations',
            label: 'Donations',
            icon: Banknote,
            children: [
                {
                    key: 'donations-all',
                    label: 'View Donations',
                    path: '/admin/dashboard/donations',
                },
            ],
        },

        // System
        {
            type: 'section',
            key: 'system',
            label: 'System',
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: UserCircle,
            path: '/admin/dashboard/profile',
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/admin/dashboard/settings',
        },
    ],
};

// ============================================================
// ROLE LABELS
// ============================================================

export const ROLE_LABELS = {
    individual: 'Individual',
    organization: 'Organization',
    admin: 'Administrator',
};

// ============================================================
// ROLE COLORS
// Kept unchanged for compatibility with existing components.
// ============================================================

export const ROLE_COLORS = {
    individual: 'bg-[#0f766e]/10 text-[#0f766e]',
    organization: 'bg-[#f59e0b]/10 text-[#b45309]',
    admin: 'bg-[#0f172a]/10 text-[#0f172a]',
};
