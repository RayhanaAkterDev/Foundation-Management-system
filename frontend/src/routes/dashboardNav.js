// ============================================================================
// DASHBOARD NAVIGATION
// Stand For People
//
// Navigation hierarchy:
// Section label
//   └── Main navigation item
//         └── Optional submenu items
//
// IMPORTANT:
// Existing application routes are preserved.
// New submenu routes/actions should only be added when the corresponding
// page/action actually exists.
// ============================================================================

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
    Activity,
} from 'lucide-react';

/* ==========================================================================
   NAVIGATION CONFIG
============================================================================ */

export const NAV_CONFIG = {
    /* ======================================================================
       INDIVIDUAL
    ====================================================================== */

    individual: [
        /* ------------------------------------------------------------------
           OVERVIEW
        ------------------------------------------------------------------ */

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

        /* ------------------------------------------------------------------
           MY ACTIVITY
        ------------------------------------------------------------------ */

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

                // Future:
                // Create Request
                // Request History
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

                // Future:
                // Donation History
                // Saved Campaigns
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

                // Future:
                // Find Opportunities
                // Activity History
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

                // Future:
                // Saved Campaigns
                // Supported Campaigns
            ],
        },

        /* ------------------------------------------------------------------
           ACCOUNT
        ------------------------------------------------------------------ */

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

    /* ======================================================================
       ORGANIZATION
    ====================================================================== */

    organization: [
        /* ------------------------------------------------------------------
           OVERVIEW
        ------------------------------------------------------------------ */

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

        /* ------------------------------------------------------------------
           OPERATIONS
        ------------------------------------------------------------------ */

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

                // Future:
                // Create Request
                // Assigned Requests
                // Request History
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

                // Future:
                // Create Campaign
                // Draft Campaigns
                // Completed Campaigns
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

                // Future:
                // Volunteer Applications
                // Assignments
            ],
        },

        /* ------------------------------------------------------------------
           INSIGHTS
        ------------------------------------------------------------------ */

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

        /* ------------------------------------------------------------------
           ACCOUNT
        ------------------------------------------------------------------ */

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

    /* ======================================================================
       ADMIN
    ====================================================================== */

    admin: [
        /* ------------------------------------------------------------------
           OVERVIEW
        ------------------------------------------------------------------ */

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

        /* ------------------------------------------------------------------
           PEOPLE & NETWORK
        ------------------------------------------------------------------ */

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
        }
    ],
},

        {
            key: 'organizations',
            label: 'Organizations',
            icon: Building2,

            children: [
                {
                    key: 'organizations-all',
                    label: 'View All Organizations',
                    path: '/admin/dashboard/organizations',
                },
                {
                    key: 'organizations-add',
                    label: 'Add Organization',
                    path: '/admin/dashboard/organizations/add',
                }

                // Future:
                // Pending Verification
                // Verified Organizations
            ],
        },

        {
            key: 'volunteers',
            label: 'Volunteers',
            icon: UserCheck,

            children: [
                {
                    key: 'volunteers-all',
                    label: 'View All Volunteers',
                    path: '/admin/dashboard/volunteers',
                },

                // Future:
                // Volunteer Verification
                // Volunteer Activity
            ],
        },

        /* ------------------------------------------------------------------
           OPERATIONS
        ------------------------------------------------------------------ */

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
                    path: '/admin/dashboard/help-requests',
                },

                // Future:
                // Pending Review
                // Assigned Requests
                // Resolved Requests
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

                // Future:
                // Pending Review
                // Active Campaigns
                // Completed Campaigns
            ],
        },

        /* ------------------------------------------------------------------
           FINANCE
        ------------------------------------------------------------------ */

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
                    label: 'View All Donations',
                    path: '/admin/dashboard/donations',
                },

                // Future:
                // Transactions
                // Donation Activity
            ],
        },

        /* ------------------------------------------------------------------
           SYSTEM
        ------------------------------------------------------------------ */

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

/* ==========================================================================
   ROLE LABELS
============================================================================ */

export const ROLE_LABELS = {
    individual: 'Individual',
    organization: 'Organization',
    admin: 'Administrator',
};

/* ==========================================================================
   ROLE COLORS

   Kept for compatibility with existing components.
   Dashboard dark-theme styling will be handled separately.
============================================================================ */

export const ROLE_COLORS = {
    individual: 'bg-[#0f766e]/10 text-[#0f766e]',
    organization: 'bg-[#f59e0b]/10 text-[#b45309]',
    admin: 'bg-[#0f172a]/10 text-[#0f172a]',
};