import React, { useState } from 'react';
import { User, Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const FieldWrapper = ({ label, htmlFor, error, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[#0f172a]">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const InputIcon = ({ icon: Icon }) => (
  <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280] pointer-events-none" />
);

const StepCredentials = ({ accountType, formData, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOrganization = accountType === 'organization';
  const inputBase =
    'h-12 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#0f172a] placeholder-[#6b7280] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20';
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-200';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-[#0f172a] md:text-3xl">
          {isOrganization ? 'Create your organization account' : 'Create your account'}
        </h2>
        <p className="text-base text-[#6b7280]">
          {isOrganization
            ? 'Enter your organization details and set a secure password.'
            : 'Enter your details and set a secure password.'}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Name field */}
        <div className="space-y-1.5 md:col-span-2">
          <FieldWrapper
            label={isOrganization ? 'Organization Name' : 'Full Name'}
            htmlFor={isOrganization ? 'orgName' : 'fullName'}
            error={errors.name}
          >
            <div className="relative">
              <InputIcon icon={isOrganization ? Building2 : User} />
              <input
                id={isOrganization ? 'orgName' : 'fullName'}
                type="text"
                autoComplete={isOrganization ? 'organization' : 'name'}
                placeholder={isOrganization ? 'Organization name' : 'Your full name'}
                value={formData.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className={`${inputBase} ${errors.name ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Email field */}
        <div className="space-y-1.5 md:col-span-2">
          <FieldWrapper
            label={isOrganization ? 'Organization Email' : 'Email Address'}
            htmlFor="email"
            error={errors.email}
          >
            <div className="relative">
              <InputIcon icon={Mail} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={isOrganization ? 'contact@organization.org' : 'you@example.com'}
                value={formData.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                className={`${inputBase} ${errors.email ? inputError : ''}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <FieldWrapper label="Password" htmlFor="password" error={errors.password}>
            <div className="relative">
              <InputIcon icon={Lock} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password || ''}
                onChange={(e) => onChange('password', e.target.value)}
                className={`${inputBase} pr-10 ${errors.password ? inputError : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0f172a]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FieldWrapper>
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <FieldWrapper label="Confirm Password" htmlFor="confirmPassword" error={errors.confirmPassword}>
            <div className="relative">
              <InputIcon icon={Lock} />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword || ''}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                className={`${inputBase} pr-10 ${errors.confirmPassword ? inputError : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0f172a]"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
};

export default StepCredentials;
