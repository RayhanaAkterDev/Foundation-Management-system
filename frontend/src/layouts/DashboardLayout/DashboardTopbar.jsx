import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, LogOut, UserCircle, Settings } from 'lucide-react';
import { ROLE_LABELS } from '@/routes/dashboardNav';

const MOCK_USERS = {
  individual: { name: 'Maria Santos' },
  organization: { name: 'Bayanihan Foundation' },
  admin: { name: 'SP Admin' },
};

const DashboardTopbar = ({ pageTitle, role, onMenuOpen }) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = MOCK_USERS[role];
  const roleLabel = ROLE_LABELS[role];

  const handleSignOut = () => {
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-[#e5e7eb] bg-white px-4 md:px-6">
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={onMenuOpen}
        className="mr-3 rounded-lg p-2 text-[#6b7280] hover:bg-[#eef3f6] hover:text-text-primary transition-colors md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="flex-1 min-w-0 truncate font-['Fraunces'] text-lg font-semibold text-text-primary">
        {pageTitle}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-[#6b7280] hover:bg-[#eef3f6] hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot — replace count with real data */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors"
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden truncate max-w-30 md:block">{user.name}</span>
            <ChevronDown className="h-4 w-4 text-[#6b7280]" />
          </button>

          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              {/* Dropdown */}
              <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-[#e5e7eb] bg-white py-1 shadow-lg">
                <div className="border-b border-[#e5e7eb] px-3 py-2">
                  <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="text-xs text-[#6b7280]">{roleLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen(false); navigate(`/dashboard/${role}/profile`); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-[#eef3f6]"
                >
                  <UserCircle className="h-4 w-4 text-[#6b7280]" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen(false); navigate(`/dashboard/${role}/settings`); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-[#eef3f6]"
                >
                  <Settings className="h-4 w-4 text-[#6b7280]" />
                  Settings
                </button>
                <div className="border-t border-[#e5e7eb] my-1" />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
