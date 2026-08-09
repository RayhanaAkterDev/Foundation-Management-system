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
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/individual' },
    { key: 'help-requests', label: 'My Help Requests', icon: HeartHandshake, path: '/dashboard/individual/help-requests' },
    { key: 'donations', label: 'My Donations', icon: HandCoins, path: '/dashboard/individual/donations' },
    { key: 'volunteer', label: 'Volunteer Activities', icon: Users, path: '/dashboard/individual/volunteer' },
    { key: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/dashboard/individual/campaigns' },
    { type: 'divider' },
    { key: 'profile', label: 'Profile', icon: UserCircle, path: '/dashboard/individual/profile' },
    { key: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/individual/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/individual/settings' },
  ],

  organization: [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/organization' },
    { key: 'profile', label: 'Organization Profile', icon: Building2, path: '/dashboard/organization/profile' },
    { key: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/dashboard/organization/campaigns' },
    { key: 'responses', label: 'Assistance & Responses', icon: HeartHandshake, path: '/dashboard/organization/responses' },
    { key: 'volunteers', label: 'Volunteers', icon: Users, path: '/dashboard/organization/volunteers' },
    { key: 'reports', label: 'Reports & Impact', icon: BarChart3, path: '/dashboard/organization/reports' },
    { type: 'divider' },
    { key: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/organization/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/organization/settings' },
  ],

  admin: [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { key: 'users', label: 'Users', icon: Users, path: '/dashboard/admin/users' },
    { key: 'organizations', label: 'Organizations', icon: Building2, path: '/dashboard/admin/organizations' },
    { key: 'help-requests', label: 'Help Requests', icon: ClipboardList, path: '/dashboard/admin/help-requests' },
    { key: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/dashboard/admin/campaigns' },
    { key: 'donations', label: 'Donations', icon: Banknote, path: '/dashboard/admin/donations' },
    { key: 'volunteers', label: 'Volunteers', icon: UserCheck, path: '/dashboard/admin/volunteers' },
    { key: 'verification', label: 'Verification', icon: ShieldCheck, path: '/dashboard/admin/verification' },
    { key: 'reports', label: 'Reports', icon: BarChart3, path: '/dashboard/admin/reports' },
    { type: 'divider' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/admin/settings' },
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
