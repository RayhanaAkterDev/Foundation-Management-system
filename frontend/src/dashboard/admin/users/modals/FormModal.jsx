import React, { useState } from 'react';

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
} from 'lucide-react';

// ============================================================
// CONSTANTS
// ============================================================

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    status: 'active',
};

const ROLE_OPTIONS = [
    {
        value: 'individual',
        label: 'Individual',
        description: 'Personal account',
        icon: UserRound,
    },
    {
        value: 'organization',
        label: 'Organization',
        description: 'NGO or community',
        icon: Building2,
    },
    {
        value: 'admin',
        label: 'Administrator',
        description: 'Platform administration',
        icon: UserCog,
    },
];

const STATUS_OPTIONS = [
    {
        value: 'active',
        label: 'Active',
        description: 'Platform access enabled',
        icon: CircleCheck,
    },
    {
        value: 'inactive',
        label: 'Inactive',
        description: 'Access temporarily disabled',
        icon: CircleOff,
    },
    {
        value: 'suspended',
        label: 'Suspended',
        description: 'Access currently restricted',
        icon: ShieldCheck,
    },
];

// ============================================================
// HELPERS
// ============================================================

const getInitialForm = (mode, user) => {
    if (mode === 'edit' && user) {
        return {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            role: user.role || '',
            status: user.status || 'active',
        };
    }

    return { ...EMPTY_FORM };
};

const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) {
        return 'U';
    }

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
        0,
    )}`.toUpperCase();
};

const getRoleLabel = (role) => {
    const option = ROLE_OPTIONS.find((item) => item.value === role);

    return option?.label || 'Not selected';
};

const getStatusLabel = (status) => {
    const option = STATUS_OPTIONS.find((item) => item.value === status);

    return option?.label || 'Not selected';
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
        <p className="mt-2 wrap-break-words font-jost text-xs font-medium leading-5 text-red-600">
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
            className="font-jost text-[12px] font-semibold tracking-[-0.01em] text-text-primary"
        >
            {children}

            {required && <span className="ml-1 text-primary">*</span>}
        </label>

        {hint && (
            <span className="shrink-0 font-jost text-[11px] font-medium text-text-secondary">
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
    type = 'text',
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
                    group relative flex h-13.5 min-w-0 items-center
                    border bg-surface
                    transition-all duration-200
                    ${
                        hasError
                            ? 'border-red-300 bg-red-50/20'
                            : 'border-border hover:border-slate-300 focus-within:border-primary'
                    }
                `}
            >
                <span
                    className={`
                        absolute left-0 top-0 h-full w-0.75
                        transition-opacity duration-200
                        ${
                            hasError
                                ? 'bg-red-500 opacity-100'
                                : 'bg-primary opacity-0 group-focus-within:opacity-100'
                        }
                    `}
                />

                <div
                    className={`
                        flex h-full w-11 shrink-0 items-center justify-center
                        transition-colors duration-200
                        sm:w-12
                        ${
                            hasError
                                ? 'text-red-500'
                                : 'text-text-secondary group-focus-within:text-primary'
                        }
                    `}
                >
                    <Icon size={18} strokeWidth={1.7} />
                </div>

                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onPhoneChange || onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    maxLength={name === 'phone' ? 11 : undefined}
                    inputMode={name === 'phone' ? 'numeric' : undefined}
                    className="
                        h-full
                        min-w-0
                        w-full
                        bg-transparent
                        pr-3
                        font-jost
                        text-[14px]
                        font-medium
                        tracking-[-0.01em]
                        text-text-primary
                        outline-none
                        placeholder:text-slate-400
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:pr-4
                    "
                />
            </div>

            {name === 'phone' && !hasError && (
                <p className="mt-2 font-jost text-[11px] leading-4 text-text-secondary">
                    11 digits · starts with 01
                </p>
            )}

            <FieldError name={name} fieldErrors={fieldErrors} />
        </div>
    );
};

// ============================================================
// SECTION HEADER
// ============================================================

const SectionHeader = ({ number, title, description }) => (
    <div className="mb-7">
        <div className="mb-2.5 flex items-center gap-2.5">
            <span className="font-jost text-[10px] font-bold tracking-[0.16em] text-primary">
                {number}
            </span>

            <span className="h-px w-8 bg-border" />

            <span className="font-jost text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Account
            </span>
        </div>

        <h3 className="font-fraunces text-[22px] font-medium leading-tight tracking-[-0.03em] text-text-primary sm:text-[23px]">
            {title}
        </h3>

        <p className="mt-2 max-w-135 font-jost text-[12px] leading-[1.65] text-text-secondary">
            {description}
        </p>
    </div>
);

// ============================================================
// ROLE SELECTOR
// ============================================================

const RoleSelector = ({ value, onChange, disabled, fieldErrors }) => {
    const hasError = Boolean(fieldErrors?.role?.length);

    return (
        <div className="min-w-0">
            <div className="mb-2.5 flex items-center justify-between gap-3">
                <label className="font-jost text-[12px] font-semibold text-text-primary">
                    Account role
                    <span className="ml-1 text-primary">*</span>
                </label>

                <span className="shrink-0 font-jost text-[11px] text-text-secondary">
                    Select one
                </span>
            </div>

            <div
                className={`
                    divide-y border
                    ${
                        hasError
                            ? 'border-red-200 divide-red-100'
                            : 'border-border divide-border'
                    }
                `}
            >
                {ROLE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const selected = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(option.value)}
                            className={`
                                group relative flex min-w-0 w-full
                                items-center gap-3
                                px-3 py-3
                                text-left
                                transition-colors duration-150
                                sm:gap-3.5 sm:px-4 sm:py-3.5
                                ${
                                    selected
                                        ? 'bg-primary/4.5'
                                        : 'bg-surface hover:bg-background-alt'
                                }
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            `}
                        >
                            {selected && (
                                <span className="absolute left-0 top-0 h-full w-0.75 bg-primary" />
                            )}

                            <span
                                className={`
                                    flex h-9 w-9 shrink-0 items-center justify-center
                                    transition-colors
                                    ${
                                        selected
                                            ? 'bg-primary text-white'
                                            : 'bg-background-alt text-text-secondary group-hover:text-primary'
                                    }
                                `}
                            >
                                <Icon size={17} strokeWidth={1.7} />
                            </span>

                            <span className="min-w-0 flex-1">
                                <span
                                    className={`
                                        block truncate font-jost text-[13px] font-semibold
                                        ${
                                            selected
                                                ? 'text-primary'
                                                : 'text-text-primary'
                                        }
                                    `}
                                >
                                    {option.label}
                                </span>

                                <span className="mt-0.5 block truncate font-jost text-[11px] leading-4 text-text-secondary">
                                    {option.description}
                                </span>
                            </span>

                            <span
                                className={`
                                    flex h-4.5 w-4.5 shrink-0
                                    items-center justify-center border
                                    ${
                                        selected
                                            ? 'border-primary bg-primary'
                                            : 'border-slate-300 bg-white'
                                    }
                                `}
                            >
                                {selected && (
                                    <span className="h-1.5 w-1.5 bg-white" />
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>

            <FieldError name="role" fieldErrors={fieldErrors} />
        </div>
    );
};

// ============================================================
// STATUS SELECTOR
// ============================================================

const StatusSelector = ({ value, onChange, disabled, fieldErrors }) => {
    const hasError = Boolean(fieldErrors?.status?.length);

    return (
        <div className="min-w-0">
            <div className="mb-2.5 flex items-center justify-between gap-3">
                <label className="font-jost text-[12px] font-semibold text-text-primary">
                    Account status
                </label>

                <span className="shrink-0 font-jost text-[11px] text-text-secondary">
                    Current access
                </span>
            </div>

            <div
                className={`
                    grid grid-cols-3 border
                    ${hasError ? 'border-red-300' : 'border-border'}
                `}
            >
                {STATUS_OPTIONS.map((option, index) => {
                    const Icon = option.icon;
                    const selected = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(option.value)}
                            className={`
                                relative flex min-w-0
                                min-h-21.5
                                flex-col items-center justify-center
                                gap-1 px-1 py-3 text-center
                                transition-colors duration-150
                                ${index > 0 ? 'border-l border-border' : ''}
                                ${
                                    selected
                                        ? 'bg-primary/4.5 text-primary'
                                        : 'bg-surface text-text-secondary hover:bg-background-alt'
                                }
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                sm:min-h-19.5
                                sm:gap-1.5
                                sm:px-2
                                sm:py-4
                            `}
                        >
                            {selected && (
                                <span className="absolute left-0 top-0 h-0.75 w-full bg-primary" />
                            )}

                            <Icon size={17} strokeWidth={1.7} />

                            <span className="font-jost text-[11px] font-semibold sm:text-[12px]">
                                {option.label}
                            </span>

                            <span className="max-w-full truncate px-0.5 font-jost text-[9px] leading-4 text-text-secondary sm:text-[10px]">
                                {option.description}
                            </span>
                        </button>
                    );
                })}
            </div>

            <FieldError name="status" fieldErrors={fieldErrors} />
        </div>
    );
};

// ============================================================
// FORM MODAL
// ============================================================

const FormModal = ({
    mode = 'add',
    open,
    loading,
    error,
    fieldErrors,
    onClose,
    onSubmit,
    user = null,
}) => {
    const isEdit = mode === 'edit';

    const formKey = `${open ? 'open' : 'closed'}-${mode}-${user?.id ?? 'new'}`;

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

    const initials = getInitials(form.name);

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
        const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 11);

        setForm((previous) => ({
            ...previous,
            phone: digitsOnly,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(form);
    };

    const title = isEdit ? 'Edit user account' : 'Create user account';

    const description = isEdit
        ? 'Update the account details and access settings for this user.'
        : 'Add a new person or organization to Stand For People.';

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-slate-950/55
                p-2
                backdrop-blur-xs
                sm:p-4
                lg:p-6
            "
        >
            <div
                className="
                    flex
                    h-full
                    max-h-[calc(100vh-1rem)]
                    w-full
                    max-w-260
                    flex-col
                    overflow-hidden
                    bg-surface
                    shadow-[0_30px_90px_rgba(15,23,42,0.22)]
                    sm:h-auto
                    sm:max-h-[calc(100vh-2rem)]
                    lg:max-h-[calc(100vh-3rem)]
                "
            >
                {/* =================================================
                    HEADER
                ================================================== */}

                <header className="relative shrink-0 bg-primary">
                    <div className="px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
                        <div className="max-w-190 pr-8 sm:pr-10">
                            <div className="mb-3 flex min-w-0 items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 bg-accent" />

                                <span className="truncate font-jost text-[9px] font-bold uppercase tracking-[0.14em] text-white/70 sm:text-[10px] sm:tracking-[0.16em]">
                                    User administration
                                </span>

                                <span className="h-px w-5 shrink-0 bg-white/20 sm:w-7" />

                                <span className="shrink-0 font-jost text-[9px] font-medium uppercase tracking-widest text-white/40 sm:text-[10px] sm:tracking-[0.12em]">
                                    {isEdit ? 'Edit account' : 'New account'}
                                </span>
                            </div>

                            <h2 className="font-fraunces text-[27px] font-medium leading-[1.08] tracking-[-0.035em] text-white sm:text-[31px] lg:text-[35px]">
                                {title}
                            </h2>

                            <p className="mt-2 max-w-150 font-jost text-[11px] leading-[1.65] text-white/60 sm:text-[12px] lg:text-[13px]">
                                {description}
                            </p>
                        </div>

                        <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/10 pt-3.5 sm:mt-6 sm:pt-4">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/10">
                                    <span className="font-fraunces text-[12px] text-white">
                                        {initials}
                                    </span>
                                </span>

                                <div className="min-w-0 max-w-45 sm:max-w-65">
                                    <p className="truncate font-jost text-[11px] font-semibold text-white">
                                        {form.name || 'New account'}
                                    </p>

                                    <p className="truncate font-jost text-[10px] text-white/40">
                                        {getRoleLabel(form.role)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <span
                                    className={`
                                        h-1.5 w-1.5
                                        ${
                                            form.status === 'active'
                                                ? 'bg-emerald-300'
                                                : form.status === 'suspended'
                                                  ? 'bg-amber-300'
                                                  : 'bg-slate-300'
                                        }
                                    `}
                                />

                                <span className="font-jost text-[9px] font-semibold uppercase tracking-[0.07em] text-white/55 sm:text-[10px] sm:tracking-[0.08em]">
                                    {getStatusLabel(form.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="
                            absolute right-3 top-3
                            flex h-8 w-8 items-center justify-center
                            border border-white/15
                            text-white/60
                            transition-colors
                            hover:border-white/30
                            hover:bg-white/10
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                            sm:right-5 sm:top-5
                            sm:h-9 sm:w-9
                        "
                    >
                        <X size={17} strokeWidth={1.7} />
                    </button>
                </header>

                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overscroll-contain
                            scrollbar-thin
                        "
                    >
                        {/* General error */}

                        {error && (
                            <div className="border-b border-red-100 bg-red-50 px-5 py-3.5 sm:px-7 lg:px-9">
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-red-500" />

                                    <p className="min-w-0 wrap-break-words font-jost text-xs font-medium leading-5 text-red-600">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-[1.3fr_0.9fr]">
                            {/* =================================================
                                PERSONAL INFORMATION
                            ================================================== */}

                            <section className="px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
                                <SectionHeader
                                    number="01"
                                    title="Personal information"
                                    description="Basic details used to identify and contact this account."
                                />

                                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
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
                                            required
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
                                            placeholder={
                                                isEdit
                                                    ? 'Leave blank to keep current password'
                                                    : 'Enter a secure password'
                                            }
                                            disabled={loading}
                                            autoComplete="new-password"
                                            fieldErrors={fieldErrors}
                                            hint={
                                                isEdit ? 'Optional' : 'Required'
                                            }
                                            required={!isEdit}
                                        />
                                    </div>
                                </div>

                                {/* Security note */}

                                <div className="mt-7 border-t border-border pt-5 sm:mt-8">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-background-alt text-text-secondary">
                                            <LockKeyhole
                                                size={15}
                                                strokeWidth={1.7}
                                            />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="font-jost text-[12px] font-semibold text-text-primary">
                                                Password protection
                                            </p>

                                            <p className="mt-1 max-w-lg font-jost text-[11px] leading-[1.6] text-text-secondary">
                                                {isEdit
                                                    ? 'Leave this field empty to keep the current password.'
                                                    : 'Use a strong password to protect this account.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* =================================================
                                ACCOUNT ACCESS
                            ================================================== */}

                            <section className="border-t border-border bg-background-alt/30 px-5 py-7 sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:px-9 lg:py-9">
                                <SectionHeader
                                    number="02"
                                    title="Account access"
                                    description="Choose the account role and determine its current platform access."
                                />

                                <div className="space-y-6 sm:space-y-7">
                                    <RoleSelector
                                        value={form.role}
                                        onChange={(role) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                role,
                                            }))
                                        }
                                        disabled={loading}
                                        fieldErrors={fieldErrors}
                                    />

                                    <div className="border-t border-border pt-6 sm:pt-7">
                                        <StatusSelector
                                            value={form.status}
                                            onChange={(status) =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    status,
                                                }))
                                            }
                                            disabled={loading}
                                            fieldErrors={fieldErrors}
                                        />
                                    </div>
                                </div>

                                {/* Access summary */}

                                <div className="mt-6 border-t border-border pt-5 sm:mt-7 sm:pt-6">
                                    <div className="flex min-w-0 items-center justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <ShieldCheck
                                                size={16}
                                                strokeWidth={1.7}
                                                className="shrink-0 text-primary"
                                            />

                                            <span className="font-jost text-[11px] font-semibold text-text-primary">
                                                Access level
                                            </span>
                                        </div>

                                        <span className="truncate font-jost text-[11px] font-semibold text-primary">
                                            {getRoleLabel(form.role)}
                                        </span>
                                    </div>

                                    <div className="mt-3 h-px bg-border" />

                                    <div className="mt-3 flex min-w-0 items-center justify-between gap-4">
                                        <span className="font-jost text-[11px] text-text-secondary">
                                            Account status
                                        </span>

                                        <span className="truncate font-jost text-[11px] font-semibold text-text-primary">
                                            {getStatusLabel(form.status)}
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        className="
                            flex shrink-0
                            flex-col gap-3
                            border-t border-border
                            bg-surface
                            px-5 py-3.5
                            sm:flex-row sm:items-center sm:justify-between
                            sm:gap-4 sm:px-7 sm:py-4
                            lg:px-9
                        "
                    >
                        <div className="hidden min-w-0 items-center gap-2 sm:flex">
                            <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

                            <p className="truncate font-jost text-[11px] font-medium text-text-secondary">
                                {isEdit
                                    ? 'Review the changes before saving.'
                                    : 'Review the details before creating this account.'}
                            </p>
                        </div>

                        <div className="flex w-full items-center gap-2.5 sm:ml-auto sm:w-auto sm:gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="
                                    h-11
                                    flex-1
                                    border border-border
                                    bg-surface
                                    px-4
                                    font-jost
                                    text-[12px]
                                    font-semibold
                                    text-text-primary
                                    transition-colors
                                    hover:border-slate-300
                                    hover:bg-background-alt
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:flex-none
                                    sm:px-5
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    inline-flex
                                    h-11
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-primary
                                    px-4
                                    font-jost
                                    text-[12px]
                                    font-bold
                                    text-white
                                    transition-colors
                                    hover:bg-primary-hover
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    sm:min-w-37.5
                                    sm:flex-none
                                    sm:px-5
                                "
                            >
                                {loading ? (
                                    <span>
                                        {isEdit ? 'Saving...' : 'Creating...'}
                                    </span>
                                ) : (
                                    <>
                                        {isEdit ? (
                                            <CircleCheck
                                                size={16}
                                                strokeWidth={1.9}
                                            />
                                        ) : (
                                            <UserPlus
                                                size={16}
                                                strokeWidth={1.9}
                                            />
                                        )}

                                        <span>
                                            {isEdit
                                                ? 'Save changes'
                                                : 'Create user'}
                                        </span>
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
