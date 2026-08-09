import React, { useState } from 'react';
import { UserCircle, Save } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import { mockIndividualUser } from '@/data/mockIndividual';

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-text-primary">{label}</label>
    {children}
  </div>
);

const inputCls = 'h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-sm text-text-primary placeholder-[#6b7280] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

const IndividualProfile = () => {
  const [form, setForm] = useState({
    name: mockIndividualUser.name,
    email: mockIndividualUser.email,
    phone: mockIndividualUser.phone,
    district: mockIndividualUser.district,
    address: mockIndividualUser.address,
  });

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and account details."
      />

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {form.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-['Fraunces'] text-base font-semibold text-text-primary">{form.name}</p>
            <p className="text-sm text-[#6b7280]">Individual · Member since {mockIndividualUser.memberSince}</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name">
            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email Address">
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone Number">
            <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputCls} />
          </Field>
          <Field label="District">
            <input type="text" value={form.district} onChange={(e) => handleChange('district', e.target.value)} className={inputCls} />
          </Field>
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-text-primary">Address</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm text-text-primary placeholder-[#6b7280] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 border-t border-[#e5e7eb] pt-5">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Preferences summary */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary mb-4">Preferences</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1.5">Participation Types</p>
            <div className="flex flex-wrap gap-2">
              {(mockIndividualUser.preferences.participationTypes || []).map((t) => (
                <span key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1.5">Causes</p>
            <div className="flex flex-wrap gap-2">
              {(mockIndividualUser.preferences.causes || []).map((c) => (
                <span key={c} className="rounded-full bg-[#eef3f6] px-3 py-1 text-xs font-medium text-[#6b7280] capitalize">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProfile;
