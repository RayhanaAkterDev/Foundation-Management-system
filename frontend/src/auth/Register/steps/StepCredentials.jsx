import React, { useState } from "react";

import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AtSign,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";

const FieldWrapper = ({ label, htmlFor, error, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-text-primary">
      {label} <span className="text-red-500">*</span>
    </label>

    {children}

    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

const InputIcon = ({ icon: Icon }) => (
  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
);

const VERIFICATION_OPTIONS = [
  {
    value: "email",
    label: "Real email",
    description:
      "Currently unavailable. Real email verification is temporarily disabled.",
    icon: AtSign,
    disabled: true,
  },
  {
    value: "demo",
    label: "Demo account",
    description:
      "Use the SP demo verification flow without requiring real email delivery.",
    icon: MonitorCheck,
    disabled: false,
  },
];

const StepCredentials = ({ accountType, formData, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOrganization = accountType === "organization";

  // Real email verification is temporarily disabled.
  // Always use the demo verification method.
  const selectedVerification = "demo";

  const inputBase =
    "h-12 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-text-primary placeholder-[#6b7280] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20";

  const inputError = "border-red-400 focus:border-red-500 focus:ring-red-200";

  return (
    <div className="space-y-6">
      {/* =====================================================
                HEADING
            ====================================================== */}
      <div className="space-y-2">
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
          {isOrganization
            ? "Create your organization account"
            : "Create your account"}
        </h2>

        <p className="text-base text-[#6b7280]">
          {isOrganization
            ? "Enter your organization details and set a secure password."
            : "Enter your details and set a secure password."}
        </p>
      </div>

      {/* =====================================================
                FORM FIELDS
            ====================================================== */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-1.5 md:col-span-2">
          <FieldWrapper
            label={isOrganization ? "Organization Name" : "Full Name"}
            htmlFor={isOrganization ? "orgName" : "fullName"}
            error={errors.name}>
            <div className="relative">
              <InputIcon icon={isOrganization ? Building2 : User} />

              <input
                id={isOrganization ? "orgName" : "fullName"}
                name="name"
                type="text"
                autoComplete={isOrganization ? "organization" : "name"}
                placeholder={
                  isOrganization ? "Organization name" : "Your full name"
                }
                value={formData.name || ""}
                onChange={(e) => onChange("name", e.target.value)}
                className={`${inputBase} ${errors.name ? inputError : ""}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* Email */}
        <div className="space-y-1.5 md:col-span-2">
          <FieldWrapper
            label={isOrganization ? "Organization Email" : "Email Address"}
            htmlFor="email"
            error={errors.email}>
            <div className="relative">
              <InputIcon icon={Mail} />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={
                  isOrganization
                    ? "contact@organization.org"
                    : "you@example.com"
                }
                value={formData.email || ""}
                onChange={(e) => onChange("email", e.target.value)}
                className={`${inputBase} ${errors.email ? inputError : ""}`}
              />
            </div>
          </FieldWrapper>
        </div>

        {/* =================================================
                    VERIFICATION METHOD
                ================================================== */}
        <div className="space-y-2 md:col-span-2">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Verification Method <span className="text-red-500">*</span>
            </p>

            <p className="mt-1 text-xs text-[#64748b]">
              Real email verification is temporarily unavailable. Please use the
              demo verification flow.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {VERIFICATION_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedVerification === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange("verification_method", option.value);
                    }
                  }}
                  className={`group relative flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                    option.disabled
                      ? "cursor-not-allowed border-[#e5e7eb] bg-[#f8fafc] opacity-65"
                      : isSelected
                        ? "border-[#0f766e] bg-[#f0fdfa] ring-1 ring-[#0f766e]/20"
                        : "border-[#e5e7eb] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  }`}>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      option.disabled
                        ? "bg-[#e2e8f0] text-[#94a3b8]"
                        : isSelected
                          ? "bg-[#0f766e] text-white"
                          : "bg-[#f1f5f9] text-[#64748b] group-hover:text-[#0f766e]"
                    }`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={`text-sm font-semibold ${
                          option.disabled
                            ? "text-[#64748b]"
                            : isSelected
                              ? "text-[#0f766e]"
                              : "text-text-primary"
                        }`}>
                        {option.label}
                      </p>

                      {option.disabled ? (
                        <span className="shrink-0 rounded-full bg-[#e2e8f0] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#64748b]">
                          Unavailable
                        </span>
                      ) : (
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected ? "border-[#0f766e]" : "border-[#cbd5e1]"
                          }`}>
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                          )}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-[#64748b]">
                      {option.description}
                    </p>

                    {option.disabled && (
                      <p className="mt-2 text-[11px] font-medium text-[#b45309]">
                        Currently not available for the live demo.
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {errors.verification_method && (
            <p className="text-xs text-red-600">{errors.verification_method}</p>
          )}
        </div>

        {/* =================================================
                    SELECTED METHOD INFORMATION
                ================================================== */}
        <div className="md:col-span-2">
          <div className="flex items-start gap-3 rounded-xl border border-[#dbe7e5] bg-[#f0fdfa] px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0f766e]/10 text-[#0f766e]">
              <MonitorCheck className="h-4 w-4" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0f766e]">
                Demo verification
              </p>

              <p className="mt-1 text-xs leading-5 text-[#64748b]">
                This live demonstration uses the SP demo verification flow. Real
                email verification is currently unavailable and cannot be
                selected.
              </p>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <FieldWrapper
            label="Password"
            htmlFor="password"
            error={errors.password}>
            <div className="relative">
              <InputIcon icon={Lock} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={formData.password || ""}
                onChange={(e) => onChange("password", e.target.value)}
                className={`${inputBase} pr-10 ${
                  errors.password ? inputError : ""
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FieldWrapper>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <FieldWrapper
            label="Confirm Password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword}>
            <div className="relative">
              <InputIcon icon={Lock} />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={formData.confirmPassword || ""}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                className={`${inputBase} pr-10 ${
                  errors.confirmPassword ? inputError : ""
                }`}
              />

              <button
                type="button"
                onClick={() => setShowConfirm((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-text-primary"
                aria-label={showConfirm ? "Hide password" : "Show password"}>
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
};

export default StepCredentials;
