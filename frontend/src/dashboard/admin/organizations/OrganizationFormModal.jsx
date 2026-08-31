import React, { useState } from 'react';

import {
    X,
    Building2,
    Phone,
    Globe,
    MapPin,
    FileText,
    Mail,
    ArrowRight,
    Plus,
    PencilLine,
    ChevronDown,
} from 'lucide-react';
import { ORGANIZATION_TYPES } from './organizationTypes';

const getInitialForm = (mode, organization) => {
    if (mode === 'edit' && organization) {
        return {
            name: organization.name || '',
            email: organization.user?.email || organization.email || '',
            organization_type: organization.organization_type || '',
            registration_number: organization.registration_number || '',
            phone: organization.phone || '',
            website: organization.website || '',
            address: organization.address || '',
        };
    }

    return {
        name: '',
        email: '',
        organization_type: '',
        registration_number: '',
        phone: '',
        website: '',
        address: '',
    };
};

const FormField = ({
    label,
    name,
    placeholder,
    icon: Icon,
    required = false,
    type = 'text',
    value,
    onChange,
    disabled,
    error,
}) => {
    const hasError = Boolean(error);

    return (
        <div className="group">
            {/* Label */}
            <label
                htmlFor={name}
                className="
                    mb-2 flex items-center gap-1.5
                    text-[12px]
                    font-semibold
                    tracking-[-0.005em]
                    text-slate-700
                "
            >
                {label}

                {required && <span className="text-primary">*</span>}
            </label>

            {/* Input */}
            <div
                className={`
                    relative flex h-13 items-center
                    overflow-hidden
                    rounded-xl
                    border
                    bg-white
                    transition-all duration-200

                    ${
                        hasError
                            ? `
                                border-red-300
                                bg-red-50/25
                                focus-within:border-red-400
                                focus-within:ring-4
                                focus-within:ring-red-500/8
                            `
                            : `
                                border-slate-200
                                hover:border-slate-300
                                focus-within:border-primary
                                focus-within:ring-4
                                focus-within:ring-primary/8
                            `
                    }

                    ${disabled ? 'cursor-not-allowed bg-slate-50' : ''}
                `}
            >
                {/* Icon */}
                <div
                    className={`
                        flex h-full w-11.5 shrink-0
                        items-center justify-center
                        border-r
                        transition-colors duration-200

                        ${
                            hasError
                                ? 'border-red-100 text-red-400'
                                : `
                                    border-slate-100
                                    text-slate-400
                                    group-focus-within:border-primary/10
                                    group-focus-within:text-primary
                                `
                        }
                    `}
                >
                    <Icon size={18} strokeWidth={1.7} />
                </div>

                {/* Input */}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="
                        h-full
                        min-w-0
                        flex-1
                        bg-transparent
                        px-4
                        text-[14px]
                        font-medium
                        tracking-[-0.005em]
                        text-slate-800
                        outline-none

                        placeholder:text-slate-400
                        placeholder:font-normal

                        disabled:cursor-not-allowed
                        disabled:text-slate-400
                    "
                />
            </div>

            {/* Error */}
            {error && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-600">
                    <span className="h-1 w-1 rounded-full bg-red-500" />
                    {error}
                </p>
            )}
        </div>
    );
};

const OrganizationFormModal = ({
    mode = 'add',
    open,
    loading,
    fieldErrors = {},
    organization = null,
    onClose,
    onSubmit,
}) => {
    const [form, setForm] = useState(() => getInitialForm(mode, organization));

    if (!open) {
        return null;
    }

    const isEdit = mode === 'edit';

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            name: form.name,
            email: form.email,
            organization_type: form.organization_type,
            registration_number: form.registration_number,
            phone: form.phone,
            website: form.website,
            address: form.address,
        });
    };

    const getFieldError = (field) => {
        const value = fieldErrors?.[field];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value || '';
    };

    const fieldShell = (field) => `
        relative flex h-13 items-center
        overflow-hidden
        rounded-xl
        border
        bg-white
        transition-all duration-200

        ${
            getFieldError(field)
                ? `
                    border-red-300
                    bg-red-50/[0.25]
                    focus-within:border-red-400
                    focus-within:ring-4
                    focus-within:ring-red-500/[0.08]
                `
                : `
                    border-slate-200
                    hover:border-slate-300
                    focus-within:border-primary
                    focus-within:ring-4
                    focus-within:ring-primary/[0.08]
                `
        }

        ${loading ? 'cursor-not-allowed bg-slate-50' : ''}
    `;

    const fieldIcon = (field) => `
        flex h-full w-11.5 shrink-0
        items-center justify-center
        border-r
        transition-colors duration-200

        ${
            getFieldError(field)
                ? `
                    border-red-100
                    text-red-400
                `
                : `
                    border-slate-100
                    text-slate-400
                    group-focus-within:border-primary/10
                    group-focus-within:text-primary
                `
        }
    `;

    const inputClass = `
        h-full
        min-w-0
        flex-1
        bg-transparent
        px-4
        text-[14px]
        font-medium
        tracking-[-0.005em]
        text-slate-800
        outline-none

        placeholder:text-slate-400
        placeholder:font-normal

        disabled:cursor-not-allowed
        disabled:text-slate-400
    `;

    const labelClass = `
        mb-2 flex items-center gap-1.5
        text-[12px]
        font-semibold
        tracking-[-0.005em]
        text-slate-700
    `;

    const errorMessage = (field) => {
        const error = getFieldError(field);

        if (!error) {
            return null;
        }

        return (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-600">
                <span className="h-1 w-1 rounded-full bg-red-500" />
                {error}
            </p>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
            <div
                className={`
                    relative flex max-h-[94vh] w-full overflow-hidden
                    rounded-2xl bg-white
                    shadow-[0_30px_100px_-25px_rgba(15,23,42,0.45)]
                    ring-1 ring-black/6
                    ${isEdit ? 'max-w-225' : 'max-w-270'}
                `}
            >
                {/* =====================================================
                    ADD — LEFT INTRODUCTION
                ====================================================== */}

                {!isEdit && (
                    <aside className="relative hidden w-82.5 shrink-0 overflow-hidden bg-primary lg:flex">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -right-36 -top-36 h-115 w-115 rounded-full border-65 border-white/4.5" />

                            <div className="absolute -bottom-44 -left-44 h-125 w-125 rounded-full border-70 border-white/[0.035]" />

                            <div className="absolute left-12 top-[42%] h-24 w-24 rounded-full border border-white/6" />
                        </div>

                        <div className="relative flex h-full flex-col px-10 py-10 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                                    <Building2 size={22} strokeWidth={1.6} />
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                                        Management
                                    </p>

                                    <p className="mt-0.5 text-[13px] font-semibold text-white/85">
                                        Organizations
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="h-px w-7 bg-white/20" />

                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                                        New organization
                                    </span>
                                </div>

                                <h2 className="max-w-61.25 text-[36px] font-semibold leading-[1.04] tracking-[-0.045em]">
                                    Create a place for their work.
                                </h2>

                                <p className="mt-6 max-w-62.5 text-[14px] leading-7 text-white/50">
                                    Add the organization’s core information. You
                                    can build out the rest of its profile later.
                                </p>

                                <div className="mt-10 flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/4">
                                        <ArrowRight
                                            size={14}
                                            strokeWidth={1.7}
                                        />
                                    </span>

                                    <span className="text-[12px] font-medium text-white/45">
                                        Basic information first
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* =====================================================
                    MAIN
                ====================================================== */}

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* HEADER */}

                    <header
                        className={`
                            relative shrink-0
                            ${
                                isEdit
                                    ? 'px-8 pb-8 pt-9 sm:px-11 sm:pb-9 sm:pt-10'
                                    : 'px-7 pb-8 pt-8 lg:px-10'
                            }
                        `}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                absolute right-5 top-5
                                flex h-9 w-9 items-center justify-center
                                rounded-lg
                                text-text-secondary/60
                                transition-all duration-200
                                hover:bg-background-alt
                                hover:text-text-primary
                                disabled:opacity-50
                            "
                            aria-label="Close"
                        >
                            <X size={19} strokeWidth={1.8} />
                        </button>

                        <div className="pr-12">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                    {isEdit
                                        ? 'Organization profile'
                                        : 'Organization management'}
                                </span>

                                {isEdit && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-border" />

                                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                                            Edit
                                        </span>
                                    </>
                                )}
                            </div>

                            <h2 className="mt-2.5 text-[28px] font-semibold tracking-[-0.045em] text-text-primary">
                                {isEdit
                                    ? 'Update organization'
                                    : 'Add organization'}
                            </h2>

                            <p className="mt-2 max-w-155 text-[14px] leading-6 text-text-secondary">
                                {isEdit
                                    ? 'Update the information below to keep this organization’s profile accurate.'
                                    : 'Enter the organization’s essential information to create its profile.'}
                            </p>
                        </div>
                    </header>

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <div
                                className={`
                                    ${
                                        isEdit
                                            ? 'px-8 pb-10 sm:px-11'
                                            : 'px-7 pb-10 lg:px-10'
                                    }
                                `}
                            >
                                {/* =================================================
                                    BASIC INFORMATION
                                ================================================== */}

                                <section>
                                    <div className="mb-7 flex items-center gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
                                            {isEdit ? (
                                                <PencilLine
                                                    size={19}
                                                    strokeWidth={1.7}
                                                />
                                            ) : (
                                                <Plus
                                                    size={20}
                                                    strokeWidth={1.8}
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold tracking-[0.08em] text-primary">
                                                    01
                                                </span>

                                                <span className="h-px w-5 bg-primary/20" />
                                            </div>

                                            <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-text-primary">
                                                Basic information
                                            </h3>

                                            <p className="mt-0.5 text-[12px] text-text-secondary">
                                                The essential identity of this
                                                organization.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                                        {/* NAME */}

                                        <div className="group">
                                            <label
                                                htmlFor="name"
                                                className={labelClass}
                                            >
                                                Organization name
                                                {!isEdit && (
                                                    <span className="text-primary">
                                                        *
                                                    </span>
                                                )}
                                            </label>

                                            <div className={fieldShell('name')}>
                                                <div
                                                    className={fieldIcon(
                                                        'name',
                                                    )}
                                                >
                                                    <Building2
                                                        size={18}
                                                        strokeWidth={1.7}
                                                    />
                                                </div>

                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter organization name"
                                                    disabled={loading}
                                                    className={inputClass}
                                                />
                                            </div>

                                            {errorMessage('name')}
                                        </div>

                                        {/* EMAIL */}

                                        <FormField
                                            label="Email address"
                                            name="email"
                                            type="email"
                                            placeholder="organization@example.org"
                                            icon={Mail}
                                            required={!isEdit}
                                            value={form.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                            error={getFieldError('email')}
                                        />

                                        {/* TYPE */}

                                        <div className="group">
                                            <label
                                                htmlFor="organization_type"
                                                className={labelClass}
                                            >
                                                Organization type
                                            </label>

                                            <div
                                                className={fieldShell(
                                                    'organization_type',
                                                )}
                                            >
                                                <div
                                                    className={fieldIcon(
                                                        'organization_type',
                                                    )}
                                                >
                                                    <Building2
                                                        size={18}
                                                        strokeWidth={1.7}
                                                    />
                                                </div>

                                                <select
                                                    id="organization_type"
                                                    name="organization_type"
                                                    value={
                                                        form.organization_type
                                                    }
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                    className="
                                                        h-full
                                                        min-w-0
                                                        flex-1
                                                        appearance-none
                                                        bg-transparent
                                                        px-4
                                                        pr-10
                                                        text-[14px]
                                                        font-medium
                                                        tracking-[-0.005em]
                                                        text-slate-800
                                                        outline-none
                                                        disabled:cursor-not-allowed
                                                        disabled:text-slate-400
                                                    "
                                                >
                                                    <option value="">
                                                        Select organization type
                                                    </option>

                                                    {ORGANIZATION_TYPES.map(
                                                        (type) => (
                                                            <option
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                <ChevronDown
                                                    size={17}
                                                    strokeWidth={1.7}
                                                    className="
                                                        pointer-events-none
                                                        absolute right-4
                                                        text-slate-400
                                                        transition-colors
                                                        duration-200
                                                        group-focus-within:text-primary
                                                    "
                                                />
                                            </div>

                                            {errorMessage('organization_type')}
                                        </div>

                                        {/* REGISTRATION */}

                                        <FormField
                                            label="Registration number"
                                            name="registration_number"
                                            placeholder="Registration number"
                                            icon={FileText}
                                            value={form.registration_number}
                                            onChange={handleChange}
                                            disabled={loading}
                                            error={getFieldError(
                                                'registration_number',
                                            )}
                                        />
                                    </div>
                                </section>

                                {/* =================================================
                                    CONTACT
                                ================================================== */}

                                <section className="mt-12 border-t border-border pt-9">
                                    <div className="mb-7 flex items-center gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <Mail size={19} strokeWidth={1.7} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold tracking-[0.08em] text-text-secondary">
                                                    02
                                                </span>

                                                <span className="h-px w-5 bg-border" />
                                            </div>

                                            <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-text-primary">
                                                Contact details
                                            </h3>

                                            <p className="mt-0.5 text-[12px] text-text-secondary">
                                                Ways to reach the organization.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                                        {/* PHONE */}

                                        <FormField
                                            label="Phone number"
                                            name="phone"
                                            type="tel"
                                            placeholder="Phone number"
                                            icon={Phone}
                                            value={form.phone}
                                            onChange={handleChange}
                                            disabled={loading}
                                            error={getFieldError('phone')}
                                        />

                                        {/* WEBSITE */}

                                        <FormField
                                            label="Website"
                                            name="website"
                                            type="url"
                                            placeholder="https://example.org"
                                            icon={Globe}
                                            value={form.website}
                                            onChange={handleChange}
                                            disabled={loading}
                                            error={getFieldError('website')}
                                        />

                                        {/* ADDRESS */}

                                        <div className="group sm:col-span-2">
                                            <label
                                                htmlFor="address"
                                                className={labelClass}
                                            >
                                                Address
                                            </label>

                                            <div
                                                className={`
                                                    relative flex items-start
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    bg-white
                                                    transition-all duration-200

                                                    ${
                                                        getFieldError('address')
                                                            ? `
                                                                border-red-300
                                                                bg-red-50/25
                                                                focus-within:border-red-400
                                                                focus-within:ring-4
                                                                focus-within:ring-red-500/8
                                                            `
                                                            : `
                                                                border-slate-200
                                                                hover:border-slate-300
                                                                focus-within:border-primary
                                                                focus-within:ring-4
                                                                focus-within:ring-primary/8
                                                            `
                                                    }

                                                    ${
                                                        loading
                                                            ? 'cursor-not-allowed bg-slate-50'
                                                            : ''
                                                    }
                                                `}
                                            >
                                                <div
                                                    className={`
                                                        flex w-11.5
                                                        shrink-0
                                                        items-start
                                                        justify-center
                                                        border-r
                                                        pt-4
                                                        transition-colors
                                                        duration-200

                                                        ${
                                                            getFieldError(
                                                                'address',
                                                            )
                                                                ? `
                                                                    border-red-100
                                                                    text-red-400
                                                                `
                                                                : `
                                                                    border-slate-100
                                                                    text-slate-400
                                                                    group-focus-within:border-primary/10
                                                                    group-focus-within:text-primary
                                                                `
                                                        }
                                                    `}
                                                >
                                                    <MapPin
                                                        size={18}
                                                        strokeWidth={1.7}
                                                    />
                                                </div>

                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    placeholder="Enter organization address"
                                                    disabled={loading}
                                                    rows={4}
                                                    className="
                                                        min-h-29
                                                        min-w-0
                                                        flex-1
                                                        resize-none
                                                        bg-transparent
                                                        px-4
                                                        py-3.5
                                                        text-[14px]
                                                        font-medium
                                                        leading-6
                                                        tracking-[-0.005em]
                                                        text-slate-800
                                                        outline-none

                                                        placeholder:text-slate-400
                                                        placeholder:font-normal

                                                        disabled:cursor-not-allowed
                                                        disabled:text-slate-400
                                                    "
                                                />
                                            </div>

                                            {errorMessage('address')}
                                        </div>
                                    </div>
                                </section>

                                {/* =================================================
                                    ADD NOTE
                                ================================================== */}

                                {!isEdit && (
                                    <section className="mt-10 border-t border-border pt-8">
                                        <div className="flex items-start gap-4 rounded-xl border border-amber-200/70 bg-amber-50/50 px-4 py-4">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                                <FileText
                                                    size={17}
                                                    strokeWidth={1.7}
                                                />
                                            </div>

                                            <div className="max-w-155">
                                                <p className="text-[12px] font-semibold text-text-primary">
                                                    Verification will remain
                                                    pending
                                                </p>

                                                <p className="mt-1.5 text-[12px] leading-5 text-text-secondary">
                                                    The organization must
                                                    complete its additional
                                                    profile information before
                                                    an administrator can verify
                                                    it.
                                                </p>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>

                        {/* =====================================================
                            FOOTER
                        ====================================================== */}

                        <footer className="flex shrink-0 items-center justify-between border-t border-border bg-white px-7 py-5 sm:px-10">
                            <p className="hidden text-[12px] leading-5 text-text-secondary sm:block">
                                {isEdit
                                    ? 'Changes will be reflected on the organization profile.'
                                    : 'You can complete the remaining profile information later.'}
                            </p>

                            <div className="ml-auto flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="
                                        rounded-lg px-4 py-2.5
                                        text-[13px] font-semibold
                                        text-text-secondary
                                        transition-all duration-200
                                        hover:bg-background-alt
                                        hover:text-text-primary
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        inline-flex min-w-37.5
                                        items-center justify-center
                                        gap-2
                                        rounded-lg
                                        bg-primary
                                        px-6 py-3
                                        text-[13px]
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition-all duration-200
                                        hover:bg-primary-hover
                                        hover:shadow-md
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {loading
                                        ? isEdit
                                            ? 'Saving...'
                                            : 'Adding...'
                                        : isEdit
                                          ? 'Save changes'
                                          : 'Add organization'}
                                </button>
                            </div>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrganizationFormModal;
