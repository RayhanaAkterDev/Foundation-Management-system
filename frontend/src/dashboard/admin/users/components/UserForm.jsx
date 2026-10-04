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
    ShieldCheck,
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
                text-[10.5px]
                leading-5
                text-[#D99A9F]!
            "
        >
            <AlertCircle
                size={13}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
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
            <label
                htmlFor={id}
                className="
                    mb-2.5
                    block

                    font-sans!
                    text-[9.5px]
                    font-semibold!
                    uppercase
                    tracking-[0.11em]

                    text-[#8792A1]!
                "
            >
                {label}

                {required && <span className="ml-1 text-[#697586]!">*</span>}
            </label>

            <div
                className={`
                    relative
                    h-[48px]

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

                                hover:border-[#394555]

                                focus-within:border-[#4B5869]
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
                    className="
                        h-full
                        w-full
                        appearance-none

                        border-0!
                        bg-transparent!

                        px-4
                        pr-12

                        font-sans!
                        text-[12px]
                        font-medium!

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
                    "
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

            <FieldError name={name} fieldErrors={fieldErrors} />
        </div>
    );
};

/* ==========================================================================
   SECTION HEADING
============================================================================ */

const FormSectionHeading = ({ number, title, description }) => {
    return (
        <div
            className="
                flex
                items-start
                gap-3.5
            "
        >
            <div
                className="
                    flex
                    h-[27px]
                    w-[27px]
                    shrink-0
                    items-center
                    justify-center

                    border
                    border-[#303A47]

                    bg-[#171E28]

                    font-sans!
                    text-[9px]
                    font-semibold!
                    tabular-nums

                    text-[#8792A1]!
                "
            >
                {number}
            </div>

            <div className="min-w-0 pt-px">
                <h3
                    className="
                        font-sans!

                        text-[13px]
                        font-semibold!
                        leading-5
                        tracking-[-0.01em]

                        text-[#EEF1F5]!
                    "
                >
                    {title}
                </h3>

                {description && (
                    <p
                        className="
                            mt-1.5
                            max-w-[570px]

                            font-sans!
                            text-[10px]
                            font-normal!
                            leading-[1.65]

                            text-[#697586]!
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

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
        <form onSubmit={handleSubmit} className="w-full font-sans!">
            {/* =============================================================
                GENERAL ERROR
            ============================================================= */}

            {error && (
                <div
                    className="
                        mb-8

                        flex
                        items-start
                        gap-3.5

                        border
                        border-[#493038]

                        bg-[#281A1F]

                        px-4
                        py-3.5
                    "
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            border
                            border-[#493038]

                            bg-[#301F25]

                            text-[#D99A9F]
                        "
                    >
                        <AlertCircle size={14} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 pt-px">
                        <p
                            className="
                                font-sans!
                                text-[11px]
                                font-semibold!
                                text-[#E4B0B4]!
                            "
                        >
                            Account could not be saved
                        </p>

                        <p
                            className="
                                mt-1

                                font-sans!
                                text-[10px]
                                leading-5
                                text-[#B98289]!
                            "
                        >
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* =============================================================
                PERSONAL DETAILS
            ============================================================= */}

            <section
                className="
                    grid
                    gap-7

                    xl:grid-cols-[180px_minmax(0,1fr)]
                    xl:gap-10
                "
            >
                <FormSectionHeading
                    number="01"
                    title="Personal details"
                    description={
                        isEdit
                            ? 'Identity and contact information attached to this account.'
                            : 'Basic information used to identify and contact this user.'
                    }
                />

                <div
                    className="
                        grid
                        min-w-0

                        gap-x-5
                        gap-y-6

                        md:grid-cols-2

                        xl:gap-x-6
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

                    <div className={isEdit ? 'md:col-span-2' : ''}>
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
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center

                                        text-[#697586]!

                                        transition-colors
                                        duration-150

                                        hover:text-[#B8C0CA]!

                                        focus:outline-none
                                        focus:ring-0
                                    "
                                >
                                    {showPassword ? (
                                        <EyeOff size={15} strokeWidth={1.65} />
                                    ) : (
                                        <Eye size={15} strokeWidth={1.65} />
                                    )}
                                </button>
                            }
                        />
                    )}
                </div>
            </section>

            {/* =============================================================
                ACCOUNT TYPE
            ============================================================= */}

            {!isEdit && (
                <section
                    className="
                        mt-10

                        grid
                        gap-7

                        border-t
                        border-[#252D38]

                        pt-8

                        xl:grid-cols-[180px_minmax(0,1fr)]
                        xl:gap-10
                    "
                >
                    <FormSectionHeading
                        number="02"
                        title="Account type"
                        description="Choose the type of account being created."
                    />

                    <div className="min-w-0">
                        <div
                            className="
                                grid
                                gap-3

                                md:grid-cols-3
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
                                            min-h-[92px]
                                            items-start
                                            gap-3.5

                                            border

                                            px-4
                                            py-3.5

                                            text-left

                                            transition-[border-color,background-color]
                                            duration-150
                                            ease-out

                                            ${
                                                selected
                                                    ? `
                                                        border-[#465261]
                                                        bg-[#1D2632]
                                                    `
                                                    : `
                                                        border-[#303A47]
                                                        bg-[#121821]

                                                        hover:border-[#394555]
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

                                                    w-[2px]

                                                    bg-[#8792A1]
                                                "
                                            />
                                        )}

                                        <div
                                            className={`
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center

                                                border

                                                transition-[border-color,background-color,color]
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
                                                            text-[#697586]

                                                            group-hover:border-[#394555]
                                                            group-hover:bg-[#1A222D]
                                                            group-hover:text-[#AEB7C3]
                                                        `
                                                }
                                            `}
                                        >
                                            <Icon
                                                size={15}
                                                strokeWidth={1.65}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                "
                                            >
                                                <p
                                                    className={`
                                                        font-sans!
                                                        text-[11px]
                                                        font-semibold!

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
                                                        h-[17px]
                                                        w-[17px]
                                                        shrink-0
                                                        items-center
                                                        justify-center

                                                        rounded-full
                                                        border

                                                        transition-[border-color,background-color]
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
                                                        size={9}
                                                        strokeWidth={2.6}
                                                    />
                                                </span>
                                            </div>

                                            <p
                                                className="
                                                    mt-1.5

                                                    font-sans!
                                                    text-[9.5px]
                                                    leading-[1.55]

                                                    text-[#697586]!
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

            {/* =============================================================
                ACCOUNT ACCESS
            ============================================================= */}

            <section
                className="
                    mt-10

                    grid
                    gap-7

                    border-t
                    border-[#252D38]

                    pt-8

                    xl:grid-cols-[180px_minmax(0,1fr)]
                    xl:gap-10
                "
            >
                <FormSectionHeading
                    number={isEdit ? '02' : '03'}
                    title="Account access"
                    description={
                        isEdit
                            ? 'Set whether this user can currently sign in and use the platform.'
                            : 'New accounts remain inactive until email verification is complete.'
                    }
                />

                <div className="min-w-0">
                    {isEdit ? (
                        <>
                            {!emailVerified && (
                                <div
                                    className="
                                        mb-4

                                        flex
                                        items-start
                                        gap-3.5

                                        border
                                        border-[#493D2C]

                                        bg-[#201D18]

                                        px-4
                                        py-3.5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center

                                            border
                                            border-[#493D2C]

                                            bg-[#282219]

                                            text-[#C5A06B]
                                        "
                                    >
                                        <Mail size={14} strokeWidth={1.6} />
                                    </div>

                                    <div className="min-w-0 pt-px">
                                        <p
                                            className="
                                                font-sans!
                                                text-[10.5px]
                                                font-semibold!

                                                text-[#D4BB94]!
                                            "
                                        >
                                            Email verification required
                                        </p>

                                        <p
                                            className="
                                                mt-1

                                                font-sans!
                                                text-[9.5px]
                                                leading-[1.6]

                                                text-[#8E816F]!
                                            "
                                        >
                                            Active access is unavailable until
                                            this user's email address has been
                                            verified.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div
                                className="
                                    grid
                                    gap-3

                                    sm:grid-cols-3
                                "
                            >
                                {STATUS_OPTIONS.map((option) => {
                                    const Icon = option.icon;

                                    const selected =
                                        form.status === option.value;

                                    const isActiveOption =
                                        option.value === 'active';

                                    const activeBlocked =
                                        isActiveOption && !emailVerified;

                                    const buttonDisabled =
                                        loading || activeBlocked;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            disabled={buttonDisabled}
                                            onClick={() =>
                                                handleStatusChange(option.value)
                                            }
                                            className={`
                                                group

                                                flex
                                                min-h-[80px]
                                                items-center
                                                gap-3

                                                border

                                                px-3.5
                                                py-3

                                                text-left

                                                transition-[border-color,background-color]
                                                duration-150
                                                ease-out

                                                ${
                                                    activeBlocked
                                                        ? `
                                                            border-[#252D38]
                                                            bg-[#10151C]
                                                            opacity-55
                                                        `
                                                        : selected
                                                          ? `
                                                                border-[#465261]
                                                                bg-[#1D2632]
                                                            `
                                                          : `
                                                                border-[#303A47]
                                                                bg-[#121821]

                                                                hover:border-[#394555]
                                                                hover:bg-[#171E28]
                                                            `
                                                }

                                                disabled:cursor-not-allowed
                                            `}
                                        >
                                            <div
                                                className={`
                                                    flex
                                                    h-8
                                                    w-8
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
                                                                    text-[#697586]

                                                                    group-hover:text-[#AEB7C3]
                                                                `
                                                    }
                                                `}
                                            >
                                                <Icon
                                                    size={14}
                                                    strokeWidth={1.7}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-2
                                                    "
                                                >
                                                    <span
                                                        className={`
                                                            font-sans!
                                                            text-[10.5px]
                                                            font-semibold!

                                                            ${
                                                                activeBlocked
                                                                    ? 'text-[#5E6978]!'
                                                                    : selected
                                                                      ? 'text-[#EEF1F5]!'
                                                                      : 'text-[#AEB7C3]!'
                                                            }
                                                        `}
                                                    >
                                                        {option.label}
                                                    </span>

                                                    <span
                                                        className={`
                                                            h-1.5
                                                            w-1.5
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
                                                        mt-1
                                                        font-sans!
                                                        text-[9px]
                                                        leading-[1.5]

                                                        ${
                                                            activeBlocked
                                                                ? 'text-[#4B5664]!'
                                                                : 'text-[#697586]!'
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
                        </>
                    ) : (
                        <div
                            className="
                                flex
                                flex-col
                                gap-4

                                border
                                border-[#303A47]

                                bg-[#121821]

                                px-4
                                py-3.5

                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                sm:px-5
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-3.5
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
                                        border-[#29323E]

                                        bg-[#171E28]

                                        text-[#8792A1]
                                    "
                                >
                                    <LockKeyhole size={15} strokeWidth={1.65} />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            font-sans!
                                            text-[10.5px]
                                            font-semibold!

                                            text-[#C2C9D2]!
                                        "
                                    >
                                        Email verification required
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            max-w-lg

                                            font-sans!
                                            text-[9.5px]
                                            leading-[1.6]

                                            text-[#697586]!
                                        "
                                    >
                                        The user must verify their email address
                                        before normal account access is enabled.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-2

                                    border-l-0
                                    border-[#29323E]

                                    font-sans!
                                    text-[9.5px]
                                    font-medium!

                                    text-[#C5A06B]!

                                    sm:border-l
                                    sm:pl-5
                                "
                            >
                                <Mail size={13} strokeWidth={1.6} />

                                <span>Email unverified</span>
                            </div>
                        </div>
                    )}

                    <FieldError name="status" fieldErrors={fieldErrors} />
                </div>
            </section>

            {/* =============================================================
                ACTION BAR
            ============================================================= */}

            <footer
                className="
                    mt-10

                    border-t
                    border-[#252D38]

                    pt-6
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex
                            max-w-[430px]
                            items-start
                            gap-2.5
                        "
                    >
                        <ShieldCheck
                            size={14}
                            strokeWidth={1.6}
                            className="
                                mt-0.5
                                shrink-0
                                text-[#697586]
                            "
                        />

                        <p
                            className="
                                font-sans!
                                text-[9.5px]
                                leading-[1.65]
                                text-[#697586]!
                            "
                        >
                            {isEdit
                                ? 'Review the information before saving. Changes will be applied directly to this account.'
                                : 'Review the details above before creating the account.'}
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            w-full
                            items-center
                            gap-2.5

                            sm:w-auto
                        "
                    >
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="
                                h-[42px]
                                flex-1

                                border
                                border-[#303A47]

                                bg-[#0E1219]

                                px-5

                                font-sans!
                                text-[10.5px]
                                font-medium!

                                text-[#AEB7C3]!

                                transition-[border-color,background-color,color]
                                duration-150

                                hover:border-[#3B4655]
                                hover:bg-[#151B24]
                                hover:text-[#EEF1F5]!

                                disabled:cursor-not-allowed
                                disabled:opacity-40

                                focus:outline-none
                                focus:ring-0

                                sm:flex-none
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
                                h-[42px]
                                min-w-[160px]
                                flex-1
                                items-center
                                justify-center
                                gap-2.5

                                border
                                border-[#465261]

                                bg-[#1D2632]

                                px-5

                                font-sans!
                                text-[10.5px]
                                font-semibold!

                                text-[#EEF1F5]!

                                transition-[border-color,background-color]
                                duration-150

                                hover:border-[#5A6878]
                                hover:bg-[#222D3A]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                focus:outline-none
                                focus:ring-0

                                sm:flex-none
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
                                    size={14}
                                    strokeWidth={1.8}
                                    className="
                                        text-[#AEB7C3]

                                        transition-transform
                                        duration-150

                                        group-hover:translate-x-0.5
                                    "
                                />
                            )}

                            {loading && (
                                <span
                                    className="
                                        h-3.5
                                        w-3.5

                                        animate-spin
                                        rounded-full

                                        border
                                        border-[#697586]
                                        border-t-[#EEF1F5]
                                    "
                                />
                            )}
                        </button>
                    </div>
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
