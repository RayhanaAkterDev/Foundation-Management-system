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
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const OrgSettings = () => {
  const [notifs, setNotifs] = useState({ email: true, helpRequests: true, volunteers: false });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your organization account preferences." />

      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Notifications</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb] px-6">
          <SettingRow label="Email notifications" description="Receive email updates for campaigns and responses.">
            <Toggle enabled={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} />
          </SettingRow>
          <SettingRow label="Help request alerts" description="Get notified when a new help request is assigned.">
            <Toggle enabled={notifs.helpRequests} onChange={(v) => setNotifs((n) => ({ ...n, helpRequests: v }))} />
          </SettingRow>
          <SettingRow label="Volunteer updates" description="Notifications about volunteer joins and activity.">
            <Toggle enabled={notifs.volunteers} onChange={(v) => setNotifs((n) => ({ ...n, volunteers: v }))} />
          </SettingRow>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Account</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb] px-6">
          <SettingRow label="Change Password" description="Update the account password.">
            <button type="button" className="inline-flex h-9 items-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors">Change</button>
          </SettingRow>
          <SettingRow label="Deactivate Organization" description="Temporarily disable this organization account.">
            <button type="button" className="inline-flex h-9 items-center rounded-xl border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Deactivate</button>
          </SettingRow>
        </div>
      </div>
    </div>
  );
};

export default OrgSettings;
