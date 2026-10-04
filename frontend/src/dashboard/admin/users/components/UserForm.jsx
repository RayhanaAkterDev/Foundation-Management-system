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

/* ============================================================
   CONSTANTS
============================================================ */

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

/* ============================================================
   INITIAL FORM
============================================================ */

const getInitialForm = (mode, user) => {
    if (mode === 'edit' && user) {
        return {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            role: user.role || '',
            verification_method: 'demo',
            status: user.status || 'active',
        };
    }

    return { ...EMPTY_FORM };
};

/* ============================================================
   FIELD ERROR
============================================================ */

const FieldError = ({ name, fieldErrors }) => {
    const error = fieldErrors?.[name];

    if (!error?.length) return null;

    return (
        <div className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-[#E6A0A7]">
            <AlertCircle
                size={13}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
            />

            <span>{error[0]}</span>
        </div>
    );
};

/* ============================================================
   EDITOR FIELD
============================================================ */

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
                    mb-2
                    block

                    text-[10px]
                    font-semibold!
                    uppercase
                    tracking-[0.1em]

                    text-[#858F99]
                "
            >
                {label}

                {required && (
                    <span className="ml-1 text-[#66717A]">*</span>
                )}
            </label>

            <div
                className={`
                    relative

                    h-[48px]

                    border

                    transition-all
                    duration-150

                    ${
                        hasError
                            ? `
                                border-[#7D4B53]
                                bg-[#211A1D]
                            `
                            : `
                                border-[#3A4048]
                                bg-[#1A1E22]

                                hover:border-[#4A525B]

                                focus-within:border-[#59756E]
                                focus-within:bg-[#1C2124]
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

                        text-[13px]
                        font-medium!
                        text-[#E9ECEE]!

                        shadow-none!
                        outline-none!
                        ring-0!

                        placeholder:font-normal!
                        placeholder:text-[#525C66]

                        focus:border-0!
                        focus:bg-transparent!
                        focus:outline-none!
                        focus:ring-0!

                        disabled:cursor-not-allowed
                        disabled:opacity-50

                        [&:-webkit-autofill]:[-webkit-text-fill-color:#E9ECEE]
                        [&:-webkit-autofill]:[transition:background-color_999999s_ease-in-out_0s]
                        [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#1A1E22_inset]
                        [&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#1A1E22_inset]
                        [&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#1C2124_inset]
                    "
                />

                {trailing && (
                    <div className="absolute top-1/2 right-2 -translate-y-1/2">
                        {trailing}
                    </div>
                )}
            </div>

            <FieldError
                name={name}
                fieldErrors={fieldErrors}
            />
        </div>
    );
};

/* ============================================================
   SECTION HEADING
============================================================ */

const FormSectionHeading = ({
    number,
    title,
    description,
}) => {
    return (
        <div
            className="
                flex
                items-start
                gap-3
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
                    border-[#3A424A]

                    bg-[#1B1F23]

                    text-[9px]
                    font-semibold!
                    text-[#78838C]
                "
            >
                {number}
            </div>

            <div className="min-w-0">
                <h3
                    className="
                        text-[13px]
                        font-semibold!
                        tracking-[-0.01em]

                        text-[#E0E3E5]!
                    "
                >
                    {title}
                </h3>

                {description && (
                    <p
                        className="
                            mt-1

                            max-w-[560px]

                            text-[10px]
                            leading-[1.65]

                            text-[#68727C]
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ============================================================
   USER FORM
============================================================ */

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

    const [form, setForm] = useState(() =>
        getInitialForm(mode, user),
    );

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (onFormChange) {
            onFormChange(form);
        }
    }, [form, onFormChange]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePhoneChange = (event) => {
        const digitsOnly = event.target.value
            .replace(/\D/g, '')
            .slice(0, 11);

        setForm((previous) => ({
            ...previous,
            phone: digitsOnly,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEdit) {
            onSubmit({
                name: form.name,
                email: form.email,
                phone: form.phone,
                status: form.status,
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
            className="w-full"
        >
            {/* =====================================================
                GENERAL ERROR
            ====================================================== */}

            {error && (
                <div
                    className="
                        mb-7

                        flex
                        items-start
                        gap-3

                        border
                        border-[#51383D]

                        bg-[#241C1F]

                        px-4
                        py-3.5
                    "
                >
                    <AlertCircle
                        size={16}
                        strokeWidth={1.8}
                        className="mt-0.5 shrink-0 text-[#E6A0A7]"
                    />

                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold! text-[#EDB5BA]">
                            Account could not be saved
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-[#C7979D]">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {/* =====================================================
                PERSONAL DETAILS

                IMPORTANT:
                lg = heading ABOVE fields
                xl = heading LEFT of fields
            ====================================================== */}

            <section
                className="
                    grid
                    gap-6

                    xl:grid-cols-[180px_minmax(0,1fr)]
                    xl:gap-8
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
                        gap-x-4
                        gap-y-5

                        md:grid-cols-2
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

                    {/* EDIT MODE:
                        Phone uses the full width of both columns.
                        ADD MODE:
                        Phone remains beside temporary password.
                    */}

                    <div
                        className={
                            isEdit
                                ? 'md:col-span-2'
                                : ''
                        }
                    >
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
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
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
                                        setShowPassword(
                                            (previous) => !previous,
                                        )
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

                                        text-[#66717A]

                                        transition-colors

                                        hover:text-[#C9CED2]

                                        focus:outline-none
                                        focus:ring-0
                                    "
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={15}
                                            strokeWidth={1.6}
                                        />
                                    ) : (
                                        <Eye
                                            size={15}
                                            strokeWidth={1.6}
                                        />
                                    )}
                                </button>
                            }
                        />
                    )}
                </div>
            </section>

            {/* =====================================================
                ACCOUNT TYPE
            ====================================================== */}

            {!isEdit && (
                <section
                    className="
                        mt-9

                        grid
                        gap-6

                        border-t
                        border-[#343A41]

                        pt-8

                        xl:grid-cols-[180px_minmax(0,1fr)]
                        xl:gap-8
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
                                gap-2.5

                                md:grid-cols-3
                            "
                        >
                            {ROLE_OPTIONS.map((option) => {
                                const Icon = option.icon;

                                const selected =
                                    form.role === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            setForm(
                                                (previous) => ({
                                                    ...previous,
                                                    role: option.value,
                                                }),
                                            )
                                        }
                                        className={`
                                            group
                                            relative

                                            flex
                                            min-h-[92px]
                                            items-start
                                            gap-3

                                            border

                                            px-4
                                            py-4

                                            text-left

                                            transition-all
                                            duration-150

                                            ${
                                                selected
                                                    ? `
                                                        border-[#526B65]
                                                        bg-[#252C2B]
                                                    `
                                                    : `
                                                        border-[#363C44]
                                                        bg-[#1A1E22]

                                                        hover:border-[#48515A]
                                                        hover:bg-[#1D2226]
                                                    `
                                            }

                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        `}
                                    >
                                        {selected && (
                                            <span
                                                className="
                                                    absolute
                                                    top-0
                                                    left-0

                                                    h-full
                                                    w-[2px]

                                                    bg-[#6B958B]
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

                                                ${
                                                    selected
                                                        ? `
                                                            border-[#536761]
                                                            bg-[#303937]
                                                            text-[#C7D5D1]
                                                        `
                                                        : `
                                                            border-[#373E46]
                                                            bg-[#22272C]
                                                            text-[#69737D]

                                                            group-hover:text-[#A1AAB2]
                                                        `
                                                }
                                            `}
                                        >
                                            <Icon
                                                size={16}
                                                strokeWidth={1.6}
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
                                                        text-[12px]
                                                        font-semibold!

                                                        ${
                                                            selected
                                                                ? 'text-[#ECEFEE]'
                                                                : 'text-[#BEC4C9]'
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

                                                        ${
                                                            selected
                                                                ? `
                                                                    border-[#C5D0CD]
                                                                    bg-[#D7DEDC]
                                                                    text-[#202624]
                                                                `
                                                                : `
                                                                    border-[#424A52]
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

                                                    text-[10px]
                                                    leading-[1.55]

                                                    text-[#66717A]
                                                "
                                            >
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <FieldError
                            name="role"
                            fieldErrors={fieldErrors}
                        />
                    </div>
                </section>
            )}

            {/* =====================================================
                ACCOUNT ACCESS

                lg = title ABOVE controls
                xl = title LEFT of controls
            ====================================================== */}

            <section
                className="
                    mt-9

                    grid
                    gap-6

                    border-t
                    border-[#343A41]

                    pt-8

                    xl:grid-cols-[180px_minmax(0,1fr)]
                    xl:gap-8
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
                        <div
                            className="
                                grid
                                gap-2

                                sm:grid-cols-3
                            "
                        >
                            {STATUS_OPTIONS.map((option) => {
                                const Icon = option.icon;

                                const selected =
                                    form.status === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        disabled={loading}
                                        onClick={() =>
                                            setForm(
                                                (previous) => ({
                                                    ...previous,
                                                    status: option.value,
                                                }),
                                            )
                                        }
                                        className={`
                                            group

                                            flex
                                            min-h-[76px]
                                            items-center
                                            gap-3

                                            border

                                            px-3.5
                                            py-3

                                            text-left

                                            transition-all
                                            duration-150

                                            ${
                                                selected
                                                    ? `
                                                        border-[#586C67]
                                                        bg-[#272D2C]
                                                    `
                                                    : `
                                                        border-[#373D45]
                                                        bg-[#1A1E22]

                                                        hover:border-[#4A525B]
                                                        hover:bg-[#1E2227]
                                                    `
                                            }

                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
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
                                                    selected
                                                        ? `
                                                            border-[#566A64]
                                                            bg-[#313A38]
                                                            text-[#C9D7D3]
                                                        `
                                                        : `
                                                            border-[#373E46]
                                                            bg-[#22272C]
                                                            text-[#69737D]
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
                                                        text-[11px]
                                                        font-semibold!

                                                        ${
                                                            selected
                                                                ? 'text-[#E8EBEA]'
                                                                : 'text-[#AAB1B8]'
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
                                                            selected
                                                                ? 'bg-[#89A79F]'
                                                                : 'bg-[#4D565F]'
                                                        }
                                                    `}
                                                />
                                            </div>

                                            <p
                                                className="
                                                    mt-1

                                                    text-[9px]
                                                    leading-[1.5]

                                                    text-[#626C75]
                                                "
                                            >
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            className="
                                flex
                                flex-col
                                gap-4

                                border
                                border-[#363C44]

                                bg-[#1A1E22]

                                px-4
                                py-4

                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-3
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
                                        border-[#394048]

                                        bg-[#23282D]

                                        text-[#78838D]
                                    "
                                >
                                    <LockKeyhole
                                        size={15}
                                        strokeWidth={1.6}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            text-[11px]
                                            font-semibold!
                                            text-[#C9CED2]
                                        "
                                    >
                                        Email verification required
                                    </p>

                                    <p
                                        className="
                                            mt-1

                                            max-w-lg

                                            text-[10px]
                                            leading-[1.6]

                                            text-[#626C75]
                                        "
                                    >
                                        The user must verify their
                                        email address before normal
                                        account access is enabled.
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-2

                                    text-[10px]
                                    font-medium!
                                    text-[#C29C6B]
                                "
                            >
                                <Mail
                                    size={13}
                                    strokeWidth={1.6}
                                />

                                Email unverified
                            </div>
                        </div>
                    )}

                    <FieldError
                        name="status"
                        fieldErrors={fieldErrors}
                    />
                </div>
            </section>

            {/* =====================================================
                ACTION BAR
            ====================================================== */}

            <footer
                className="
                    mt-9

                    border-t
                    border-[#343A41]

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
                            max-w-[410px]
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
                                text-[#687B76]
                            "
                        />

                        <p
                            className="
                                text-[10px]
                                leading-[1.65]

                                text-[#626C75]
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
                                border-[#3A4149]

                                bg-transparent

                                px-5

                                text-[11px]
                                font-semibold!
                                text-[#858F98]

                                transition-colors

                                hover:border-[#505962]
                                hover:bg-[#272B30]
                                hover:text-[#E0E3E5]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                sm:flex-none

                                focus:outline-none
                                focus:ring-0
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
                                min-w-[158px]
                                flex-1
                                items-center
                                justify-center
                                gap-2.5

                                bg-[#DDE2E3]

                                px-5

                                text-[11px]
                                font-semibold!
                                text-[#202427]!

                                transition-all

                                hover:bg-[#F0F2F2]

                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                sm:flex-none

                                focus:outline-none
                                focus:ring-0
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
                                        transition-transform
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
                                        border-[#858D94]
                                        border-t-[#202427]
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