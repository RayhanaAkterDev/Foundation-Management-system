import React, { useState } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';

const SettingRow = ({ label, description, children }) => (
  <div className="flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between">
    <div className="min-w-0">
      <p className="text-sm font-medium text-text-primary">{label}</p>
      {description && <p className="mt-0.5 text-xs text-[#6b7280]">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${enabled ? 'bg-primary' : 'bg-[#d1d5db]'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

const IndividualSettings = () => {
  const [notifications, setNotifications] = useState({ email: true, browser: false, campaigns: true });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account preferences and notifications." />

      {/* Notifications */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb] px-6">
          <SettingRow label="Email notifications" description="Receive updates via email about your activities.">
            <Toggle enabled={notifications.email} onChange={(v) => setNotifications((n) => ({ ...n, email: v }))} />
          </SettingRow>
          <SettingRow label="Browser notifications" description="Receive real-time browser push notifications.">
            <Toggle enabled={notifications.browser} onChange={(v) => setNotifications((n) => ({ ...n, browser: v }))} />
          </SettingRow>
          <SettingRow label="Campaign updates" description="Get notified when campaigns you support are updated.">
            <Toggle enabled={notifications.campaigns} onChange={(v) => setNotifications((n) => ({ ...n, campaigns: v }))} />
          </SettingRow>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Account</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb] px-6">
          <SettingRow label="Change Password" description="Update your account password.">
            <button type="button" className="inline-flex h-9 items-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors">
              Change
            </button>
          </SettingRow>
          <SettingRow label="Delete Account" description="Permanently remove your account and data.">
            <button type="button" className="inline-flex h-9 items-center rounded-xl border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              Delete
            </button>
          </SettingRow>
        </div>
      </div>
    </div>
  );
};

export default IndividualSettings;
