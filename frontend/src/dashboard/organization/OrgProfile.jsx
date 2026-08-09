import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Save } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import { mockOrganization } from '@/data/mockOrganization';

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-text-primary">{label}</label>
    {children}
  </div>
);

const inputCls = 'h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-sm text-text-primary placeholder-[#6b7280] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

const OrgProfile = () => {
  const [form, setForm] = useState({
    name: mockOrganization.name,
    email: mockOrganization.email,
    phone: mockOrganization.phone,
    website: mockOrganization.website,
    address: mockOrganization.address,
    mission: mockOrganization.mission,
  });
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <PageHeader title="Organization Profile" subtitle="Manage your organization's public information and details." />

      {/* Verification status */}
      {mockOrganization.verificationStatus === 'verified' ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800">This organization is verified by Stand For People.</p>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">Verification is pending. Some features may be limited until verified.</p>
        </div>
      )}

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-2xl font-semibold text-primary">
            {form.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-['Fraunces'] text-base font-semibold text-text-primary">{form.name}</p>
            <p className="text-sm text-[#6b7280]">{mockOrganization.type} · Reg. {mockOrganization.registrationNumber}</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Organization Name">
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Website">
            <input type="url" value={form.website} onChange={(e) => set('website', e.target.value)} className={inputCls} />
          </Field>
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-text-primary">Address</label>
            <textarea rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-text-primary">Mission</label>
            <textarea rows={4} value={form.mission} onChange={(e) => set('mission', e.target.value)} className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
        </div>

        <div className="mt-6 border-t border-[#e5e7eb] pt-5">
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Focus areas & communities */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary mb-4">Focus & Communities</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-2">Areas of Focus</p>
            <div className="flex flex-wrap gap-2">
              {mockOrganization.focusAreas.map((a) => (
                <span key={a} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{a}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-2">Communities Served</p>
            <div className="flex flex-wrap gap-2">
              {mockOrganization.communitiesServed.map((c) => (
                <span key={c} className="rounded-full bg-[#eef3f6] px-3 py-1 text-xs font-medium text-[#6b7280]">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgProfile;
