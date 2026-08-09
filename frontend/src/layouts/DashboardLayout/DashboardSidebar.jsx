import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HeartHandshake, LogOut } from 'lucide-react';
import { NAV_CONFIG, ROLE_LABELS, ROLE_COLORS } from '@/routes/dashboardNav';

// Mock current user — replace with real auth context later
const MOCK_USERS = {
  individual: { name: 'Maria Santos', avatar: null },
  organization: { name: 'Bayanihan Foundation', avatar: null },
  admin: { name: 'SP Admin', avatar: null },
};

const SidebarLink = ({ item, currentPath }) => {
  const Icon = item.icon;
  const isActive =
    item.path === currentPath ||
    (item.path !== '/dashboard/individual' &&
      item.path !== '/dashboard/organization' &&
      item.path !== '/dashboard/admin' &&
      currentPath.startsWith(item.path));

  return (
    <NavLink
      to={item.path}
      end={
        item.path === '/dashboard/individual' ||
        item.path === '/dashboard/organization' ||
        item.path === '/dashboard/admin'
      }
      className={({ isActive: navActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          navActive || isActive
            ? 'bg-primary/10 text-primary'
            : 'text-[#6b7280] hover:bg-[#eef3f6] hover:text-text-primary'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
};

const DashboardSidebar = ({ role, currentPath }) => {
  const navigate = useNavigate();
  const navItems = NAV_CONFIG[role] || [];
  const user = MOCK_USERS[role];
  const roleLabel = ROLE_LABELS[role];
  const roleColor = ROLE_COLORS[role];

  const handleSignOut = () => {
    // Replace with real sign-out logic when auth is ready
    navigate('/');
  };

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[#e5e7eb] bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[#e5e7eb] px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <HeartHandshake className="h-4 w-4" />
        </span>
        <span className="font-['Fraunces'] text-[15px] font-semibold text-text-primary leading-tight">
          Stand For People
        </span>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${roleColor}`}>
          {roleLabel}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navItems.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key={`div-${idx}`} className="my-2 border-t border-[#e5e7eb]" />;
          }
          return <SidebarLink key={item.key} item={item} currentPath={currentPath} />;
        })}
      </nav>

      {/* User profile footer */}
      <div className="border-t border-[#e5e7eb] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            <p className="truncate text-xs text-[#6b7280]">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="shrink-0 rounded-lg p-1.5 text-[#6b7280] hover:bg-[#eef3f6] hover:text-text-primary transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
