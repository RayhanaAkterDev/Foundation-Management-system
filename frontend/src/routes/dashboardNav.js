// Role-based dashboard navigation configuration
// Add or remove nav items here — no need to touch layout components

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
    ShieldCheck,
    Banknote,
    UserCheck,
} from 'lucide-react';

export const NAV_CONFIG = {
    individual: [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/individual/dashboard',
        },
        {
            key: 'help-requests',
            label: 'My Help Requests',
            icon: HeartHandshake,
            path: '/individual/dashboard/help-requests',
        },
        {
            key: 'donations',
            label: 'My Donations',
            icon: HandCoins,
            path: '/individual/dashboard/donations',
        },
        {
            key: 'volunteer',
            label: 'Volunteer Activities',
            icon: Users,
            path: '/individual/dashboard/volunteer',
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            path: '/individual/dashboard/campaigns',
        },
        { type: 'divider' },
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

    organization: [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/organization/dashboard',
        },
        {
            key: 'help-requests',
            label: 'Help Requests',
            icon: ClipboardList,
            path: '/organization/dashboard/help-requests',
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            path: '/organization/dashboard/campaigns',
        },
        {
            key: 'volunteers',
            label: 'Volunteers',
            icon: Users,
            path: '/organization/dashboard/volunteers',
        },
        {
            key: 'reports',
            label: 'Impact & Reports',
            icon: BarChart3,
            path: '/organization/dashboard/reports',
        },
        { type: 'divider' },
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

    admin: [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
        },
        {
            key: 'users',
            label: 'Users',
            icon: Users,
            path: '/admin/dashboard/users',
        },
        {
            key: 'organizations',
            label: 'Organizations',
            icon: Building2,
            path: '/admin/dashboard/organizations',
        },
        {
            key: 'help-requests',
            label: 'Help Requests',
            icon: ClipboardList,
            path: '/admin/dashboard/help-requests',
        },
        {
            key: 'campaigns',
            label: 'Campaigns',
            icon: Megaphone,
            path: '/admin/dashboard/campaigns',
        },
        {
            key: 'donations',
            label: 'Donations',
            icon: Banknote,
            path: '/admin/dashboard/donations',
        },
        {
            key: 'volunteers',
            label: 'Volunteers',
            icon: UserCheck,
            path: '/admin/dashboard/volunteers',
        },
        { type: 'divider' },
        {
            key: 'verification',
            label: 'Verification',
            icon: ShieldCheck,
            path: '/admin/dashboard/verification',
        },
        {
            key: 'reports',
            label: 'Reports',
            icon: BarChart3,
            path: '/admin/dashboard/reports',
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/admin/dashboard/settings',
        },
    ],
};

export const ROLE_LABELS = {
    individual: 'Individual',
    organization: 'Organization',
    admin: 'Administrator',
};

export const ROLE_COLORS = {
    individual: 'bg-[#0f766e]/10 text-[#0f766e]',
    organization: 'bg-[#f59e0b]/10 text-[#b45309]',
    admin: 'bg-[#0f172a]/10 text-[#0f172a]',
};
