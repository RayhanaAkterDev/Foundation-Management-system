// src/pages/Admin/Users/components/UserForm.jsx

import React, { useEffect, useState } from 'react';

import {
    AlertCircle,
    ArrowRight,
    Building2,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldAlert,
    UserCog,
    UserRound,
} from 'lucide-react';

/* ==========================================================================
   CONSTANTS
============================================================================ */

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    verification_method: 'demo',
    status: 'inactive',
};

const ROLE_OPTIONS = [
    {
        value: 'individual',
        label: 'Individual',
        description: 'Personal platform account',
        icon: UserRound,
    },
    {
        value: 'organization',
        label: 'Organization',
        description: 'Organization or NGO account',
        icon: Building2,
    },
    {
        value: 'admin',
        label: 'Administrator',
        description: 'Platform management access',
        icon: UserCog,
    },
];

const STATUS_OPTIONS = [
    {
        value: 'active',
        label: 'Active',
        description: 'Normal platform access',
        icon: CheckCircle2,
    },
    {
        value: 'inactive',
        label: 'Inactive',
        description: 'Account access disabled',
        icon: LockKeyhole,
    },
    {
        value: 'suspended',
        label: 'Suspended',
        description: 'Access temporarily restricted',
        icon: ShieldAlert,
    },
];

/* ==========================================================================
   INITIAL FORM
============================================================================ */

const getInitialForm = (mode, user) => {
    if (mode === 'edit' && user) {
        const emailVerified = Boolean(user.email_verified_at);

        return {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            role: user.role || '',
            verification_method: 'demo',
            status:
                emailVerified && user.status === 'active'
                    ? 'active'
                    : user.status === 'suspended'
                      ? 'suspended'
                      : 'inactive',
        };
    }

    return { ...EMPTY_FORM };
};

/* ==========================================================================
   SHARED STYLES
============================================================================ */

const fieldLabelClass = `
    mb-2
    block
    font-sans!
    text-[13px]
    font-medium!
    tracking-normal
    text-[#8792A1]!
`;

const fieldInputClass = `
    h-full
    w-full
    appearance-none
    border-0!
    bg-transparent!
    px-4
    pr-12
    font-sans!
    text-[15px]
    font-normal!
    text-[#EEF1F5]!
    shadow-none!
    outline-none!
    ring-0!
    placeholder:font-normal!
    placeholder:text-[#657181]!
    focus:border-0!
    focus:bg-transparent!
    focus:outline-none!
    focus:ring-0!
    disabled:cursor-not-allowed
    disabled:opacity-45
    [&:-webkit-autofill]:[-webkit-text-fill-color:#EEF1F5]
    [&:-webkit-autofill]:[transition:background-color_999999s_ease-in-out_0s]
    [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#151B24_inset]
    [&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#151B24_inset]
    [&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#171E28_inset]
`;

/* ==========================================================================
   FIELD ERROR
============================================================================ */

const FieldError = ({ name, fieldErrors }) => {
    const error = fieldErrors?.[name];

    if (!error?.length) return null;

    return (
        <div
            className="
                mt-2
                flex
                items-start
                gap-2
                font-sans!
                text-[13px]
                leading-5
                text-[#D99A9F]!
            "
        >
            <AlertCircle
                size={15}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
            />

            <span>{error[0]}</span>
        </div>
    );
};

/* ==========================================================================
   EDITOR FIELD
============================================================================ */

const EditorField = ({
    id,
    name,
    label,
    value,
    type = 'text',
    placeholder,
    disabled,
    autoComplete,
    required = false,
    fieldErrors,
    onChange,
    onPhoneChange,
    trailing,
}) => {
    const hasError = Boolean(fieldErrors?.[name]?.length);

    return (
        <div className="min-w-0">
            <label htmlFor={id} className={fieldLabelClass}>
                {label}

                {required && <span className="ml-1 text-[#697586]!">*</span>}
            </label>

            <div
                className={`
                    relative
                    h-[52px]
                    border
                    transition-[border-color,background-color]
                    duration-150
                    ease-out
                    ${
                        hasError
                            ? `
                                border-[#5B3840]
                                bg-[#281A1F]
                            `
                            : `
                                border-[#303A47]
                                bg-[#151B24]
                                hover:border-[#465261]
                                focus-within:border-[#68788B]
                                focus-within:bg-[#171E28]
                            `
                    }
                `}
            >
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
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                    className={fieldInputClass}
                />

                {trailing && (
                    <div
                        className="
                            absolute
                            right-2
                            top-1/2
                            -translate-y-1/2
                        "
                    >
                        {trailing}
                    </div>
                )}
            </div>

            {hasError && (
                <div id={`${id}-error`}>
                    <FieldError name={name} fieldErrors={fieldErrors} />
                </div>
            )}
        </div>
    );
};

/* ==========================================================================
   SECTION HEADING
============================================================================ */

const FormSectionHeading = ({ number, title, description }) => (
    <div className="flex items-start gap-3.5">
        <div
            className="
                flex
                h-[30px]
                w-[30px]
                shrink-0
                items-center
                justify-center
                border
                border-[#35404E]
                bg-[#171E28]
                font-sans!
                text-[12px]
                font-semibold!
                tabular-nums
                text-[#AEB7C3]!
            "
            aria-hidden="true"
        >
            {number}
        </div>

        <div className="min-w-0 pt-0.5">
            <h3
                className="
                    font-sans!
                    text-[17px]
                    font-semibold!
                    leading-6
                    tracking-[-0.015em]
                    text-[#EEF1F5]!
                "
            >
                {title}
            </h3>

            {description && (
                <p
                    className="
                        mt-1
                        max-w-[570px]
                        font-sans!
                        text-[13px]
                        font-normal!
                        leading-[1.65]
                        text-[#8792A1]!
                    "
                >
                    {description}
                </p>
            )}
        </div>
    </div>
);

/* ==========================================================================
   USER FORM
============================================================================ */

const UserForm = ({
    mode = 'add',
    user = null,
    loading = false,
    error = '',
    fieldErrors = {},
    onSubmit,
    onCancel,
    onFormChange,
    completedFields = 0,
    completionPercentage = 0,
}) => {
    const isEdit = mode === 'edit';

    const [form, setForm] = useState(() => getInitialForm(mode, user));
    const [showPassword, setShowPassword] = useState(false);

    const emailVerified = isEdit && Boolean(user?.email_verified_at);

    /* ======================================================================
       FORM CHANGE CALLBACK
    ====================================================================== */

    useEffect(() => {
        if (onFormChange) {
            onFormChange(form);
        }
    }, [form, onFormChange]);

    /* ======================================================================
       CHANGE HANDLERS
    ====================================================================== */

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

    /* ======================================================================
       STATUS CHANGE
    ====================================================================== */

    const handleStatusChange = (status) => {
        if (status === 'active' && !emailVerified) {
            return;
        }

        setForm((previous) => ({
            ...previous,
            status,
        }));
    };

    /* ======================================================================
       SUBMIT
    ====================================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEdit) {
            const safeStatus =
                form.status === 'active' && !emailVerified
                    ? 'inactive'
                    : form.status;

            onSubmit({
                name: form.name,
                email: form.email,
                phone: form.phone,
                status: safeStatus,
                verification_method: 'demo',
            });

            return;
        }

        onSubmit({
            ...form,
            verification_method: 'demo',
            status: 'inactive',
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="@container w-full min-w-0 font-sans!"
        >
            {/* GENERAL ERROR */}

            {error && (
                <div
                    role="alert"
                    className="
                        mb-7
                        flex
                        items-start
                        gap-3.5
                        border
                        border-[#493038]
                        bg-[#281A1F]
                        px-4
                        py-4
                    "
                >
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-[#493038]
                            bg-[#301F25]
                            text-[#D99A9F]
                        "
                    >
                        <AlertCircle size={16} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 pt-0.5">
                        <p
                            className="
                                font-sans!
                                text-[14px]
                                font-semibold!
                                text-[#E4B0B4]!
                            "
                        >
                            Account could not be saved
                        </p>

                        <p
                            className="
                                mt-1.5
                                font-sans!
                                text-[13px]
                                leading-[1.65]
                                text-[#B98289]!
                            "
                        >
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* INITIAL ACCESS + COMPLETION */}

            {!isEdit && (
                <div className="mb-8 border-b border-[#252D38] pb-7">
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            @[620px]:flex-row
                            @[620px]:items-center
                            @[620px]:justify-between
                        "
                    >
                        <p
                            className="
                                font-sans!
                                text-[12px]
                                font-semibold!
                                uppercase
                                tracking-[0.1em]
                                text-[#8792A1]!
                            "
                        >
                            Initial access
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    font-sans!
                                    text-[13px]
                                    font-medium!
                                    text-[#AEB7C3]!
                                "
                            >
                                <span className="h-2 w-2 shrink-0 rounded-full bg-[#697586]" />
                                Inactive
                            </span>

                            <span className="text-[#465261]">/</span>

                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    font-sans!
                                    text-[13px]
                                    font-medium!
                                    text-[#D8B278]!
                                "
                            >
                                <Mail size={15} strokeWidth={1.7} />
                                Email unverified
                            </span>
                        </div>
                    </div>

                    <div className="mt-7">
                        <div className="flex items-center justify-between gap-4">
                            <span
                                className="
                                    font-sans!
                                    text-[13px]
                                    font-medium!
                                    text-[#8792A1]!
                                "
                            >
                                Details completed
                            </span>

                            <span
                                className="
                                    shrink-0
                                    font-sans!
                                    text-[13px]
                                    font-semibold!
                                    tabular-nums
                                    text-[#B8C0CA]!
                                "
                            >
                                {completedFields}/5
                            </span>
                        </div>

                        <div
                            className="mt-3 h-1 w-full overflow-hidden bg-[#202832]"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={completionPercentage}
                            aria-label="Form completion"
                        >
                            <div
                                className="
                                    h-full
                                    bg-[#8792A1]
                                    transition-[width]
                                    duration-300
                                    ease-out
                                "
                                style={{
                                    width: `${completionPercentage}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* PERSONAL DETAILS */}

            <section className="grid gap-6">
                <FormSectionHeading number="01" title="Personal details" />

                <div
                    className="
                        grid
                        min-w-0
                        gap-x-5
                        gap-y-6
                        @[620px]:grid-cols-2
                        @[950px]:gap-x-6
                    "
                >
                    <EditorField
                        id="user-form-name"
                        name="name"
                        label="Full name"
                        value={form.name}
                        placeholder="Enter full name"
                        disabled={loading}
                        autoComplete="name"
                        required
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <EditorField
                        id="user-form-email"
                        name="email"
                        label="Email address"
                        type="email"
                        value={form.email}
                        placeholder="name@example.com"
                        disabled={loading}
                        autoComplete="email"
                        required
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <div className={isEdit ? '@[620px]:col-span-2' : ''}>
                        <EditorField
                            id="user-form-phone"
                            name="phone"
                            label="Phone number"
                            type="tel"
                            value={form.phone}
                            placeholder="01XXXXXXXXX"
                            disabled={loading}
                            autoComplete="tel"
                            fieldErrors={fieldErrors}
                            onChange={handleChange}
                            onPhoneChange={handlePhoneChange}
                        />
                    </div>

                    {!isEdit && (
                        <EditorField
                            id="user-form-password"
                            name="password"
                            label="Temporary password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            placeholder="Set initial password"
                            disabled={loading}
                            autoComplete="new-password"
                            required
                            fieldErrors={fieldErrors}
                            onChange={handleChange}
                            trailing={
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    aria-pressed={showPassword}
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        text-[#8792A1]!
                                        transition-colors
                                        duration-150
                                        hover:text-[#EEF1F5]!
                                        focus-visible:outline
                                        focus-visible:outline-2
                                        focus-visible:outline-offset-[-3px]
                                        focus-visible:outline-[#8792A1]
                                    "
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} strokeWidth={1.7} />
                                    ) : (
                                        <Eye size={16} strokeWidth={1.7} />
                                    )}
                                </button>
                            }
                        />
                    )}
                </div>
            </section>

            {/* ACCOUNT TYPE */}

            {!isEdit && (
                <section className="mt-11 grid gap-6 border-t border-[#252D38] pt-8">
                    <FormSectionHeading number="02" title="Account type" />

                    <div className="min-w-0">
                        <div
                            className="
                                grid
                                gap-3
                                @[550px]:grid-cols-2
                                @[820px]:grid-cols-3
                            "
                        >
                            {ROLE_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const selected = form.role === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={loading}
                                        aria-pressed={selected}
                                        onClick={() =>
                                            setForm((previous) => ({
                                                ...previous,
                                                role: option.value,
                                            }))
                                        }
                                        className={`
                                            group
                                            relative
                                            flex
                                            min-h-[100px]
                                            min-w-0
                                            items-start
                                            gap-3.5
                                            border
                                            px-4
                                            py-4
                                            text-left
                                            transition-[border-color,background-color]
                                            duration-150
                                            ease-out
                                            focus-visible:outline
                                            focus-visible:outline-2
                                            focus-visible:outline-offset-2
                                            focus-visible:outline-[#8792A1]
                                            ${
                                                selected
                                                    ? `
                                                        border-[#586678]
                                                        bg-[#1D2632]
                                                    `
                                                    : `
                                                        border-[#303A47]
                                                        bg-[#121821]
                                                        hover:border-[#465261]
                                                        hover:bg-[#171E28]
                                                    `
                                            }
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        `}
                                    >
                                        {selected && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    top-0
                                                    w-[3px]
                                                    bg-[#AEB7C3]
                                                "
                                            />
                                        )}

                                        <div
                                            className={`
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                border
                                                transition-colors
                                                duration-150
                                                ${
                                                    selected
                                                        ? `
                                                            border-[#4B5869]
                                                            bg-[#222D3A]
                                                            text-[#C9D0D9]
                                                        `
                                                        : `
                                                            border-[#29323E]
                                                            bg-[#171E28]
                                                            text-[#8792A1]
                                                            group-hover:text-[#B8C0CA]
                                                        `
                                                }
                                            `}
                                        >
                                            <Icon size={17} strokeWidth={1.7} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className={`
                                                        font-sans!
                                                        text-[14px]
                                                        font-semibold!
                                                        leading-5
                                                        ${
                                                            selected
                                                                ? 'text-[#EEF1F5]!'
                                                                : 'text-[#B8C0CA]!'
                                                        }
                                                    `}
                                                >
                                                    {option.label}
                                                </p>

                                                <span
                                                    className={`
                                                        flex
                                                        h-[18px]
                                                        w-[18px]
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border
                                                        transition-colors
                                                        duration-150
                                                        ${
                                                            selected
                                                                ? `
                                                                    border-[#AEB7C3]
                                                                    bg-[#AEB7C3]
                                                                    text-[#121821]
                                                                `
                                                                : `
                                                                    border-[#465261]
                                                                    bg-transparent
                                                                    text-transparent
                                                                `
                                                        }
                                                    `}
                                                >
                                                    <Check
                                                        size={10}
                                                        strokeWidth={2.6}
                                                    />
                                                </span>
                                            </div>

                                            <p
                                                className="
                                                    mt-2
                                                    font-sans!
                                                    text-[12px]
                                                    leading-[1.6]
                                                    text-[#8792A1]!
                                                "
                                            >
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <FieldError name="role" fieldErrors={fieldErrors} />
                    </div>
                </section>
            )}

            {/* ACCOUNT ACCESS — EDIT ONLY */}

            {isEdit && (
                <section className="mt-10 grid gap-6 border-t border-[#252D38] pt-8">
                    <FormSectionHeading
                        number="02"
                        title="Account access"
                        description="Set whether this user can currently sign in and use the platform."
                    />

                    <div className="min-w-0">
                        {!emailVerified && (
                            <div
                                role="status"
                                className="
                                    mb-4
                                    flex
                                    items-start
                                    gap-3.5
                                    border
                                    border-[#493D2C]
                                    bg-[#201D18]
                                    px-4
                                    py-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        border
                                        border-[#493D2C]
                                        bg-[#282219]
                                        text-[#C5A06B]
                                    "
                                >
                                    <Mail size={16} strokeWidth={1.7} />
                                </div>

                                <div className="min-w-0 pt-0.5">
                                    <p
                                        className="
                                            font-sans!
                                            text-[14px]
                                            font-semibold!
                                            text-[#D4BB94]!
                                        "
                                    >
                                        Email verification required
                                    </p>

                                    <p
                                        className="
                                            mt-1.5
                                            font-sans!
                                            text-[13px]
                                            leading-[1.65]
                                            text-[#A39480]!
                                        "
                                    >
                                        Active access is unavailable until this
                                        user's email address has been verified.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div
                            className="
                                grid
                                gap-3
                                @[550px]:grid-cols-2
                                @[820px]:grid-cols-3
                            "
                        >
                            {STATUS_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const selected = form.status === option.value;
                                const isActiveOption =
                                    option.value === 'active';
                                const activeBlocked =
                                    isActiveOption && !emailVerified;
                                const buttonDisabled = loading || activeBlocked;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={buttonDisabled}
                                        aria-pressed={selected}
                                        onClick={() =>
                                            handleStatusChange(option.value)
                                        }
                                        className={`
                                            group
                                            flex
                                            min-h-[88px]
                                            items-center
                                            gap-3
                                            border
                                            px-3.5
                                            py-3.5
                                            text-left
                                            transition-[border-color,background-color]
                                            duration-150
                                            ease-out
                                            focus-visible:outline
                                            focus-visible:outline-2
                                            focus-visible:outline-offset-2
                                            focus-visible:outline-[#8792A1]
                                            ${
                                                activeBlocked
                                                    ? `
                                                        border-[#252D38]
                                                        bg-[#10151C]
                                                        opacity-55
                                                    `
                                                    : selected
                                                      ? `
                                                            border-[#586678]
                                                            bg-[#1D2632]
                                                        `
                                                      : `
                                                            border-[#303A47]
                                                            bg-[#121821]
                                                            hover:border-[#465261]
                                                            hover:bg-[#171E28]
                                                        `
                                            }
                                            disabled:cursor-not-allowed
                                        `}
                                    >
                                        <div
                                            className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                border
                                                ${
                                                    activeBlocked
                                                        ? `
                                                            border-[#252D38]
                                                            bg-[#151B24]
                                                            text-[#4B5664]
                                                        `
                                                        : selected
                                                          ? `
                                                                border-[#4B5869]
                                                                bg-[#222D3A]
                                                                text-[#C9D0D9]
                                                            `
                                                          : `
                                                                border-[#29323E]
                                                                bg-[#171E28]
                                                                text-[#8792A1]
                                                                group-hover:text-[#B8C0CA]
                                                            `
                                                }
                                            `}
                                        >
                                            <Icon size={16} strokeWidth={1.7} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span
                                                    className={`
                                                        font-sans!
                                                        text-[13px]
                                                        font-semibold!
                                                        ${
                                                            activeBlocked
                                                                ? 'text-[#5E6978]!'
                                                                : selected
                                                                  ? 'text-[#EEF1F5]!'
                                                                  : 'text-[#B8C0CA]!'
                                                        }
                                                    `}
                                                >
                                                    {option.label}
                                                </span>

                                                <span
                                                    className={`
                                                        h-2
                                                        w-2
                                                        shrink-0
                                                        rounded-full
                                                        ${
                                                            activeBlocked
                                                                ? 'bg-[#394555]'
                                                                : selected
                                                                  ? 'bg-[#AEB7C3]'
                                                                  : 'bg-[#465261]'
                                                        }
                                                    `}
                                                />
                                            </div>

                                            <p
                                                className={`
                                                    mt-1.5
                                                    font-sans!
                                                    text-[12px]
                                                    leading-[1.55]
                                                    ${
                                                        activeBlocked
                                                            ? 'text-[#4B5664]!'
                                                            : 'text-[#8792A1]!'
                                                    }
                                                `}
                                            >
                                                {activeBlocked
                                                    ? 'Unavailable until the email address is verified.'
                                                    : option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <FieldError name="status" fieldErrors={fieldErrors} />
                    </div>
                </section>
            )}

            {/* ACTION BAR */}

            <footer className="mt-10 border-t border-[#252D38] pt-7">
                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-3
                        @[620px]:flex-row
                        @[620px]:items-center
                        @[620px]:justify-end
                    "
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            h-[44px]
                            w-full
                            border
                            border-[#303A47]
                            bg-[#0E1219]
                            px-5
                            font-sans!
                            text-[13px]
                            font-medium!
                            text-[#AEB7C3]!
                            transition-[border-color,background-color,color]
                            duration-150
                            hover:border-[#465261]
                            hover:bg-[#151B24]
                            hover:text-[#EEF1F5]!
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#8792A1]
                            @[620px]:w-auto
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            group
                            flex
                            h-[44px]
                            w-full
                            min-w-[170px]
                            items-center
                            justify-center
                            gap-2.5
                            border
                            border-[#586678]
                            bg-[#273342]
                            px-5
                            font-sans!
                            text-[13px]
                            font-semibold!
                            text-[#EEF1F5]!
                            transition-[border-color,background-color]
                            duration-150
                            hover:border-[#5A6878]
                            hover:bg-[#303D4E]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            focus-visible:outline
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#AEB7C3]
                            @[620px]:w-auto
                        "
                    >
                        <span>
                            {loading
                                ? isEdit
                                    ? 'Saving...'
                                    : 'Creating...'
                                : isEdit
                                  ? 'Save changes'
                                  : 'Create account'}
                        </span>

                        {!loading && (
                            <ArrowRight
                                size={15}
                                strokeWidth={1.9}
                                className="
                                    text-[#B8C0CA]
                                    transition-transform
                                    duration-150
                                    group-hover:translate-x-0.5
                                "
                            />
                        )}

                        {loading && (
                            <span
                                className="
                                    h-4
                                    w-4
                                    animate-spin
                                    rounded-full
                                    border
                                    border-[#697586]
                                    border-t-[#EEF1F5]
                                "
                                aria-hidden="true"
                            />
                        )}
                    </button>
                </div>
            </footer>

            <input
                type="hidden"
                name="verification_method"
                value="demo"
                readOnly
            />
        </form>
    );
};

export default UserForm;
