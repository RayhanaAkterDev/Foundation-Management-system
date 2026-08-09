import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HeartHandshake, X, LogOut } from 'lucide-react';
import { NAV_CONFIG, ROLE_LABELS, ROLE_COLORS } from '@/routes/dashboardNav';

const MOCK_USERS = {
  individual: { name: 'Maria Santos' },
  organization: { name: 'Bayanihan Foundation' },
  admin: { name: 'SP Admin' },
};

const DashboardMobileNav = ({ role, currentPath, open, onClose }) => {
  const navigate = useNavigate();
  const navItems = NAV_CONFIG[role] || [];
  const user = MOCK_USERS[role];
  const roleLabel = ROLE_LABELS[role];
  const roleColor = ROLE_COLORS[role];

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [currentPath]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSignOut = () => {
    onClose();
    navigate('/');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 flex w-72 max-w-[calc(100%-3rem)] flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#e5e7eb] px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <span className="font-['Fraunces'] text-[15px] font-semibold text-text-primary">
              Stand For People
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#6b7280] hover:bg-[#eef3f6]"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
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
            const Icon = item.icon;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                end={
                  item.path === '/dashboard/individual' ||
                  item.path === '/dashboard/organization' ||
                  item.path === '/dashboard/admin'
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-[#6b7280] hover:bg-[#eef3f6] hover:text-text-primary'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
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
      </div>
    </div>
  );
};

export default DashboardMobileNav;
