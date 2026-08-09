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

const AdminSettings = () => {
  const [flags, setFlags] = useState({
    publicRegistration: true,
    emailVerification: true,
    maintenanceMode: false,
    orgAutoVerify: false,
  });
  const set = (k, v) => setFlags((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" subtitle="Configure global platform behavior and admin preferences." />

      {/* Platform flags */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Platform Flags</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb] px-6">
          <SettingRow label="Public Registration" description="Allow new users to register on the platform.">
            <Toggle enabled={flags.publicRegistration} onChange={(v) => set('publicRegistration', v)} />
          </SettingRow>
          <SettingRow label="Email Verification" description="Require email verification for new accounts.">
            <Toggle enabled={flags.emailVerification} onChange={(v) => set('emailVerification', v)} />
          </SettingRow>
          <SettingRow label="Auto-verify Organizations" description="Automatically verify organizations on registration (not recommended).">
            <Toggle enabled={flags.orgAutoVerify} onChange={(v) => set('orgAutoVerify', v)} />
          </SettingRow>
          <SettingRow label="Maintenance Mode" description="Take the platform offline for maintenance.">
            <Toggle enabled={flags.maintenanceMode} onChange={(v) => set('maintenanceMode', v)} />
          </SettingRow>
        </div>
      </div>

      {/* Admin account */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Admin Account</h2>
        </div>
        <div className="divide-y divide-[#e5e7eb] px-6">
          <SettingRow label="Change Password" description="Update the admin account password.">
            <button type="button" className="inline-flex h-9 items-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors">Change</button>
          </SettingRow>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
