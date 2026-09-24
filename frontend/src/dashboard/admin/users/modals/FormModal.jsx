import React, { useState } from "react";

import {
  X,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  ShieldCheck,
  CircleCheck,
  CircleOff,
  UserPlus,
  Building2,
  UserCog,
  AtSign,
  MonitorCheck,
} from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  verification_method: "demo",
  status: "inactive",
};

const ROLE_OPTIONS = [
  {
    value: "individual",
    label: "Individual",
    icon: UserRound,
  },
  {
    value: "organization",
    label: "Organization",
    icon: Building2,
  },
  {
    value: "admin",
    label: "Administrator",
    icon: UserCog,
  },
];

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    icon: CircleCheck,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: CircleOff,
  },
  {
    value: "suspended",
    label: "Suspended",
    icon: ShieldCheck,
  },
];

const VERIFICATION_OPTIONS = [
  {
    value: "email",
    label: "Real email",
    icon: AtSign,
  },
  {
    value: "demo",
    label: "Demo account",
    icon: MonitorCheck,
  },
];

// ============================================================
// HELPERS
// ============================================================

const getInitialForm = (mode, user) => {
  if (mode === "edit" && user) {
    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "",
      // Real email verification is disabled for the live demo.
      verification_method: "demo",
      status: user.status || "active",
    };
  }

  return { ...EMPTY_FORM };
};

const getRoleLabel = (role) => {
  const option = ROLE_OPTIONS.find((item) => item.value === role);
  return option?.label || "User";
};

// ============================================================
// FIELD ERROR
// ============================================================

const FieldError = ({ name, fieldErrors }) => {
  const error = fieldErrors?.[name];

  if (!error?.length) {
    return null;
  }

  return (
    <p className="mt-1.5 break-words font-jost text-[11px] font-medium leading-4 text-red-600">
      {error[0]}
    </p>
  );
};

// ============================================================
// FIELD LABEL
// ============================================================

const FieldLabel = ({ htmlFor, children, hint, required = false }) => (
  <div className="mb-2.5 flex min-w-0 items-center justify-between gap-3">
    <label
      htmlFor={htmlFor}
      className="font-jost text-[11px] font-bold uppercase tracking-[0.055em] text-text-primary">
      {children}
      {required && <span className="ml-1 text-primary">*</span>}
    </label>

    {hint && (
      <span className="shrink-0 font-jost text-[10px] font-medium text-text-secondary">
        {hint}
      </span>
    )}
  </div>
);

// ============================================================
// TEXT FIELD
// ============================================================

const TextField = ({
  id,
  name,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  onPhoneChange,
  placeholder,
  disabled,
  autoComplete,
  fieldErrors,
  hint,
  required = false,
}) => {
  const hasError = Boolean(fieldErrors?.[name]?.length);

  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id} hint={hint} required={required}>
        {label}
      </FieldLabel>

      <div
        className={`
                    group relative flex h-[50px] min-w-0 items-center
                    overflow-hidden border bg-surface
                    transition-all duration-150
                    ${
                      hasError
                        ? "border-red-300 bg-red-50/20"
                        : "border-border hover:border-slate-300 focus-within:border-primary"
                    }
                `}>
        <span
          className={`
                        absolute inset-y-0 left-0 w-[2px]
                        transition-opacity duration-150
                        ${
                          hasError
                            ? "bg-red-500 opacity-100"
                            : "bg-primary opacity-0 group-focus-within:opacity-100"
                        }
                    `}
        />

        <span
          className={`
                        flex h-full w-11 shrink-0 items-center justify-center
                        border-r border-border/70
                        transition-colors duration-150
                        ${
                          hasError
                            ? "text-red-500"
                            : "text-slate-400 group-focus-within:border-primary/10 group-focus-within:text-primary"
                        }
                    `}>
          <Icon size={16} strokeWidth={1.7} />
        </span>

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onPhoneChange || onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={name === "phone" ? 11 : undefined}
          inputMode={name === "phone" ? "numeric" : undefined}
          className="
                        h-full
                        min-w-0
                        w-full
                        bg-transparent
                        px-3.5
                        font-jost
                        text-[13px]
                        font-medium
                        text-text-primary
                        outline-none
                        placeholder:text-slate-400
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
        />
      </div>

      {name === "phone" && !hasError && (
        <p className="mt-1.5 font-jost text-[10px] leading-4 text-text-secondary">
          11 digits · starts with 01
        </p>
      )}

      <FieldError name={name} fieldErrors={fieldErrors} />
    </div>
  );
};

// ============================================================
// SECTION TITLE
// ============================================================

const SectionTitle = ({ number, title }) => (
  <div className="mb-6 flex items-center gap-3">
    <span className="flex h-6 min-w-6 items-center justify-center bg-primary/10 px-1.5 font-jost text-[9px] font-bold tracking-[0.08em] text-primary">
      {number}
    </span>

    <div>
      <h3 className="font-jost text-[11px] font-bold uppercase tracking-[0.09em] text-text-primary">
        {title}
      </h3>
    </div>

    <span className="h-px flex-1 bg-border" />
  </div>
);

// ============================================================
// ACCOUNT OPTION LIST
// ============================================================

const AccountOptionList = ({
  options,
  value,
  onChange,
  disabled = false,
  fieldErrorName,
  fieldErrors,
  disabledValues = [],
}) => {
  const hasError = Boolean(fieldErrors?.[fieldErrorName]?.length);

  return (
    <>
      <div
        className={`
                    overflow-hidden border bg-surface
                    ${hasError ? "border-red-300" : "border-border"}
                `}>
        {options.map((option, index) => {
          const Icon = option.icon;
          const selected = value === option.value;

          const optionDisabled =
            disabled || disabledValues.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              disabled={optionDisabled}
              onClick={() => {
                if (!optionDisabled) {
                  onChange(option.value);
                }
              }}
              className={`
                                group relative flex min-h-[56px]
                                w-full items-center justify-between
                                gap-3 px-3.5
                                text-left
                                transition-all duration-150
                                ${index !== 0 ? "border-t border-border" : ""}
                                ${
                                  selected ? "bg-primary/[0.045]" : "bg-surface"
                                }
                                ${
                                  optionDisabled
                                    ? "cursor-not-allowed opacity-55"
                                    : "hover:bg-background-alt/60"
                                }
                            `}>
              <span
                className={`
                                    absolute inset-y-0 left-0 w-[2px]
                                    transition-opacity
                                    ${
                                      selected
                                        ? "bg-primary opacity-100"
                                        : "opacity-0"
                                    }
                                `}
              />

              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`
                                        flex h-8 w-8 shrink-0
                                        items-center justify-center
                                        border
                                        transition-all duration-150
                                        ${
                                          selected
                                            ? "border-primary/20 bg-primary/10 text-primary"
                                            : "border-border bg-background-alt text-text-secondary"
                                        }
                                    `}>
                  <Icon size={15} strokeWidth={1.7} />
                </span>

                <div className="min-w-0">
                  <span
                    className={`
                                            block truncate
                                            font-jost text-[12px]
                                            font-semibold
                                            ${
                                              selected
                                                ? "text-primary"
                                                : "text-text-primary"
                                            }
                                        `}>
                    {option.label}
                  </span>

                  {option.value === "email" && (
                    <span className="mt-0.5 block font-jost text-[9px] font-medium text-text-secondary">
                      Currently unavailable
                    </span>
                  )}

                  {option.value === "demo" && (
                    <span className="mt-0.5 block font-jost text-[9px] font-medium text-text-secondary">
                      No email delivery required
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`
                                    flex h-[17px] w-[17px] shrink-0
                                    items-center justify-center
                                    rounded-full border
                                    transition-all
                                    ${
                                      selected
                                        ? "border-primary bg-primary"
                                        : "border-slate-300 bg-white"
                                    }
                                `}>
                {selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <FieldError name={fieldErrorName} fieldErrors={fieldErrors} />
    </>
  );
};

// ============================================================
// FORM MODAL
// ============================================================

const FormModal = ({
  mode = "add",
  open,
  loading,
  error,
  fieldErrors,
  onClose,
  onSubmit,
  user = null,
}) => {
  const isEdit = mode === "edit";

  const formKey = `${open ? "open" : "closed"}-${mode}-${user?.id ?? "new"}`;

  if (!open) {
    return null;
  }

  return (
    <FormModalContent
      key={formKey}
      mode={mode}
      isEdit={isEdit}
      loading={loading}
      error={error}
      fieldErrors={fieldErrors}
      onClose={onClose}
      onSubmit={onSubmit}
      user={user}
    />
  );
};

// ============================================================
// FORM MODAL CONTENT
// ============================================================

const FormModalContent = ({
  mode,
  isEdit,
  loading,
  error,
  fieldErrors,
  onClose,
  onSubmit,
  user,
}) => {
  const [form, setForm] = useState(() => getInitialForm(mode, user));

  // ========================================================
  // HANDLERS
  // ========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 11);

    setForm((previous) => ({
      ...previous,
      phone: digitsOnly,
    }));
  };

  const handleVerificationChange = (verification_method) => {
    // Real email verification is disabled for the live demo.
    if (verification_method === "email") {
      return;
    }

    setForm((previous) => ({
      ...previous,
      verification_method,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEdit) {
      const editPayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        status: form.status,

        // Always use demo verification.
        verification_method: "demo",
      };

      onSubmit(editPayload);
      return;
    }

    onSubmit({
      ...form,

      // Always use demo verification.
      verification_method: "demo",

      status: "inactive",
    });
  };

  const title = isEdit ? "Edit user account" : "Create user account";

  const roleLabel = getRoleLabel(form.role);

  const RoleIcon =
    ROLE_OPTIONS.find((item) => item.value === form.role)?.icon || UserRound;

  return (
    <div
      className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-slate-950/55
                p-3
                backdrop-blur-[2px]
                sm:p-5
                lg:p-6
            ">
      <div
        className="
                    flex
                    h-full
                    max-h-[calc(100vh-1.5rem)]
                    w-full
                    max-w-[900px]
                    flex-col
                    overflow-hidden
                    bg-surface
                    shadow-[0_30px_90px_rgba(15,23,42,0.24)]
                    sm:h-auto
                    sm:max-h-[calc(100vh-2.5rem)]
                    lg:max-h-[calc(100vh-3rem)]
                ">
        {/* ==================================================
                    HEADER
                ================================================== */}

        <header className="relative shrink-0 bg-primary">
          <div className="px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
            <div className="flex items-start gap-4 pr-10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-white/10 text-white">
                {isEdit ? (
                  <UserRound size={20} strokeWidth={1.6} />
                ) : (
                  <UserPlus size={20} strokeWidth={1.6} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <p className="font-jost text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
                    User administration
                  </p>

                  <span className="h-1 w-1 rounded-full bg-white/30" />

                  <span className="font-jost text-[9px] font-bold uppercase tracking-[0.1em] text-white/65">
                    {isEdit ? "Account update" : "New account"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-fraunces text-[24px] font-medium leading-tight tracking-[-0.03em] text-white sm:text-[27px]">
                    {title}
                  </h2>
                </div>

                <p className="mt-1.5 max-w-[560px] font-jost text-[10px] leading-4 text-white/55">
                  {isEdit
                    ? "Update the account information and access settings."
                    : "Add a new user to the Stand For People platform."}
                </p>

                {/* ==================================================
                                    HEADER INFORMATION
                                ================================================== */}

                <div className="mt-5 flex flex-wrap gap-2">
                  {isEdit ? (
                    <div className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.08] px-3 py-2">
                      <RoleIcon
                        size={13}
                        strokeWidth={1.7}
                        className="text-white/65"
                      />

                      <span className="font-jost text-[9px] font-semibold uppercase tracking-[0.08em] text-white/50">
                        Role
                      </span>

                      <span className="h-3 w-px bg-white/15" />

                      <span className="font-jost text-[10px] font-bold text-white">
                        {roleLabel}
                      </span>

                      <span className="font-jost text-[9px] font-medium text-white/40">
                        · Read only
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.08] px-3 py-2">
                      <CircleOff
                        size={13}
                        strokeWidth={1.7}
                        className="text-white/65"
                      />

                      <span className="font-jost text-[9px] font-semibold uppercase tracking-[0.08em] text-white/50">
                        Initial status
                      </span>

                      <span className="h-3 w-px bg-white/15" />

                      <span className="font-jost text-[10px] font-bold text-white">
                        Inactive
                      </span>

                      <span className="font-jost text-[9px] font-medium text-white/40">
                        · Set automatically
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="
                            absolute
                            right-3
                            top-3
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            border
                            border-white/15
                            text-white/60
                            transition-colors
                            hover:border-white/30
                            hover:bg-white/10
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                            sm:right-5
                            sm:top-5
                        ">
            <X size={17} strokeWidth={1.7} />
          </button>
        </header>

        {/* ==================================================
                    FORM
                ================================================== */}

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div
            className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overscroll-contain
                            scrollbar-thin
                        ">
            {error && (
              <div className="border-b border-red-100 bg-red-50 px-5 py-3 sm:px-7 lg:px-8">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                  <p className="break-words font-jost text-[11px] font-medium leading-4 text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* ==================================================
                            EDIT MODAL
                            Role = HEADER INFORMATION
                            Status = EDITABLE
                        ================================================== */}

            {isEdit ? (
              <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
                {/* PERSONAL INFORMATION */}

                <section className="px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
                  <SectionTitle number="01" title="Personal information" />

                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <TextField
                      id="user-form-name"
                      name="name"
                      label="Full name"
                      icon={UserRound}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      disabled={loading}
                      autoComplete="name"
                      fieldErrors={fieldErrors}
                      required
                    />

                    <TextField
                      id="user-form-email"
                      name="email"
                      label="Email address"
                      icon={Mail}
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled={loading}
                      autoComplete="email"
                      fieldErrors={fieldErrors}
                      required
                    />

                    <div className="sm:col-span-2">
                      <TextField
                        id="user-form-phone"
                        name="phone"
                        label="Phone number"
                        icon={Phone}
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        onPhoneChange={handlePhoneChange}
                        placeholder="01XXXXXXXXX"
                        disabled={loading}
                        autoComplete="tel"
                        fieldErrors={fieldErrors}
                      />
                    </div>
                  </div>
                </section>

                {/* ACCOUNT ACCESS */}

                <section
                  className="
                                        border-t
                                        border-border
                                        bg-background-alt/35
                                        px-5
                                        py-7
                                        sm:px-7
                                        sm:py-8
                                        lg:border-l
                                        lg:border-t-0
                                        lg:px-7
                                        lg:py-8
                                    ">
                  <SectionTitle number="02" title="Account access" />

                  <div className="space-y-6">
                    {/* VERIFICATION METHOD */}

                    <div>
                      <FieldLabel required>Verification method</FieldLabel>

                      <p className="mb-2.5 font-jost text-[10px] leading-4 text-text-secondary">
                        Real email verification is currently unavailable for the
                        live demo. Use Demo account verification instead.
                      </p>

                      <AccountOptionList
                        options={VERIFICATION_OPTIONS}
                        value="demo"
                        onChange={handleVerificationChange}
                        disabled={loading}
                        disabledValues={["email"]}
                        fieldErrorName="verification_method"
                        fieldErrors={fieldErrors}
                      />
                    </div>

                    {/* STATUS */}

                    <div className="border-t border-border pt-6">
                      <div className="mb-2.5 flex min-w-0 items-center justify-between gap-3">
                        <label className="font-jost text-[11px] font-bold uppercase tracking-[0.055em] text-text-primary">
                          Account status
                        </label>

                        <span className="font-jost text-[10px] font-medium text-primary">
                          Editable
                        </span>
                      </div>

                      <AccountOptionList
                        options={STATUS_OPTIONS}
                        value={form.status}
                        onChange={(status) =>
                          setForm((previous) => ({
                            ...previous,
                            status,
                          }))
                        }
                        disabled={loading}
                        fieldErrorName="status"
                        fieldErrors={fieldErrors}
                      />
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              /* ==================================================
                                CREATE MODAL
                                Status = HEADER INFORMATION
                            ================================================== */

              <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
                {/* PERSONAL INFORMATION */}

                <section className="px-5 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
                  <SectionTitle number="01" title="Personal information" />

                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <TextField
                      id="user-form-name"
                      name="name"
                      label="Full name"
                      icon={UserRound}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      disabled={loading}
                      autoComplete="name"
                      fieldErrors={fieldErrors}
                      required
                    />

                    <TextField
                      id="user-form-email"
                      name="email"
                      label="Email address"
                      icon={Mail}
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled={loading}
                      autoComplete="email"
                      fieldErrors={fieldErrors}
                      required
                    />

                    <div className="sm:col-span-2">
                      <TextField
                        id="user-form-phone"
                        name="phone"
                        label="Phone number"
                        icon={Phone}
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        onPhoneChange={handlePhoneChange}
                        placeholder="01XXXXXXXXX"
                        disabled={loading}
                        autoComplete="tel"
                        fieldErrors={fieldErrors}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <TextField
                        id="user-form-password"
                        name="password"
                        label="Password"
                        icon={LockKeyhole}
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter a secure password"
                        disabled={loading}
                        autoComplete="new-password"
                        fieldErrors={fieldErrors}
                        hint="Required"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* ACCOUNT ACCESS */}

                <section
                  className="
                                        border-t
                                        border-border
                                        bg-background-alt/35
                                        px-5
                                        py-7
                                        sm:px-7
                                        sm:py-8
                                        lg:border-l
                                        lg:border-t-0
                                        lg:px-7
                                        lg:py-8
                                    ">
                  <SectionTitle number="02" title="Account access" />

                  <div className="space-y-6">
                    {/* ACCOUNT ROLE */}

                    <div>
                      <FieldLabel required>Account role</FieldLabel>

                      <AccountOptionList
                        options={ROLE_OPTIONS}
                        value={form.role}
                        onChange={(role) =>
                          setForm((previous) => ({
                            ...previous,
                            role,
                          }))
                        }
                        disabled={loading}
                        fieldErrorName="role"
                        fieldErrors={fieldErrors}
                      />
                    </div>

                    {/* VERIFICATION METHOD */}

                    <div className="border-t border-border pt-6">
                      <FieldLabel required>Verification method</FieldLabel>

                      <p className="mb-2.5 font-jost text-[10px] leading-4 text-text-secondary">
                        Real email verification is currently unavailable for the
                        live demo. Use Demo account verification instead.
                      </p>

                      <AccountOptionList
                        options={VERIFICATION_OPTIONS}
                        value="demo"
                        onChange={handleVerificationChange}
                        disabled={loading}
                        disabledValues={["email"]}
                        fieldErrorName="verification_method"
                        fieldErrors={fieldErrors}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* ==================================================
                        FOOTER
                    ================================================== */}

          <footer
            className="
                            flex
                            shrink-0
                            items-center
                            justify-between
                            gap-3
                            border-t
                            border-border
                            bg-surface
                            px-5
                            py-3.5
                            sm:px-7
                            lg:px-8
                        ">
            <div className="hidden sm:block">
              <p className="font-jost text-[10px] font-medium text-text-secondary">
                {isEdit
                  ? "Changes will update this account."
                  : "Review the information before creating the account."}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                                    h-10
                                    border
                                    border-border
                                    bg-surface
                                    px-4
                                    font-jost
                                    text-[11px]
                                    font-semibold
                                    text-text-primary
                                    transition-all
                                    hover:border-slate-300
                                    hover:bg-background-alt
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                ">
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                                    inline-flex
                                    h-10
                                    min-w-32
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-primary
                                    px-4
                                    font-jost
                                    text-[11px]
                                    font-bold
                                    text-white
                                    shadow-sm
                                    transition-all
                                    hover:bg-primary-hover
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                ">
                {loading ? (
                  <span>{isEdit ? "Saving..." : "Creating..."}</span>
                ) : (
                  <>
                    {isEdit ? (
                      <CircleCheck size={15} strokeWidth={1.9} />
                    ) : (
                      <UserPlus size={15} strokeWidth={1.9} />
                    )}

                    <span>{isEdit ? "Save changes" : "Create user"}</span>
                  </>
                )}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
