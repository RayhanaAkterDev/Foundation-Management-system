import React, { useMemo, useState } from 'react';

import {
    Building2,
    CheckCircle2,
    FileText,
    Globe,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    AlertTriangle,
    LockKeyhole,
} from 'lucide-react';

import { ORGANIZATION_TYPES } from '../data/organizationTypes';

/* ==========================================================================
   Constants
   ========================================================================== */

const EMPTY_FORM = {
    name: '',
    email: '',
    organization_type: '',
    registration_number: '',
    phone: '',
    website: '',
    address: '',
};

const VERIFIED_STATUS = 'verified';

/* ==========================================================================
   Helpers
   ========================================================================== */

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
        ...EMPTY_FORM,
    };
};

/* ==========================================================================
   Form Field
   ========================================================================== */

const FormField = ({
    id,
    name,
    label,
    value,
    placeholder,
    type = 'text',
    required = false,
    disabled = false,
    icon: Icon,
    fieldErrors,
    onChange,
}) => {
    const error = fieldErrors?.[name];

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="flex items-center gap-2 text-sm font-semibold text-[#083c36]"
            >
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={2}
                        className="text-[#0f6258]"
                    />
                )}

                <span>{label}</span>

                {required && <span className="text-[#ed864a]">*</span>}
            </label>

            <input
                id={id}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                onChange={onChange}
                className={[
                    'w-full rounded-xl border bg-white px-4 py-3',
                    'text-sm text-[#083c36] outline-none transition',
                    'placeholder:text-slate-400',
                    'focus:border-[#0f6258] focus:ring-2 focus:ring-[#0f6258]/10',
                    disabled
                        ? 'cursor-not-allowed bg-slate-50 text-slate-500'
                        : '',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200',
                ].join(' ')}
            />

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    );
};

/* ==========================================================================
   Select Field
   ========================================================================== */

const SelectField = ({
    id,
    name,
    label,
    value,
    required = false,
    disabled = false,
    options = [],
    fieldErrors,
    onChange,
}) => {
    const error = fieldErrors?.[name];

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="flex items-center gap-2 text-sm font-semibold text-[#083c36]"
            >
                <Building2
                    size={16}
                    strokeWidth={2}
                    className="text-[#0f6258]"
                />

                <span>{label}</span>

                {required && <span className="text-[#ed864a]">*</span>}
            </label>

            <select
                id={id}
                name={name}
                value={value}
                required={required}
                disabled={disabled}
                onChange={onChange}
                className={[
                    'w-full rounded-xl border bg-white px-4 py-3',
                    'text-sm text-[#083c36] outline-none transition',
                    'focus:border-[#0f6258] focus:ring-2 focus:ring-[#0f6258]/10',
                    disabled
                        ? 'cursor-not-allowed bg-slate-50 text-slate-500'
                        : '',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-slate-200',
                ].join(' ')}
            >
                <option value="">Select organization type</option>

                {options.map((option) => {
                    const value =
                        typeof option === 'string' ? option : option.value;

                    const label =
                        typeof option === 'string' ? option : option.label;

                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    );
};

/* ==========================================================================
   Organization Form
   ========================================================================== */

const OrganizationForm = ({
    mode = 'create',
    organization = null,
    loading = false,
    error = '',
    fieldErrors = {},
    onSubmit,
    onCancel,
}) => {
    const initialForm = useMemo(
        () => getInitialForm(mode, organization),
        [mode, organization],
    );

    const [form, setForm] = useState(initialForm);

    const [allowTypeChange, setAllowTypeChange] = useState(false);

    const isEditMode = mode === 'edit';

    const verificationStatus = organization?.verification_status || '';

    const isVerified = isEditMode && verificationStatus === VERIFIED_STATUS;

    const organizationTypeLocked = loading || (isVerified && !allowTypeChange);

    const registrationNumber = form.registration_number?.trim() || '';

    /* ----------------------------------------------------------------------
       Change Handler
       ---------------------------------------------------------------------- */

    const handleChange = (event) => {
        const { name, value } = event.target;

        let nextValue = value;

        if (name === 'phone') {
            nextValue = value.replace(/\D/g, '');
        }

        setForm((current) => ({
            ...current,
            [name]: nextValue,
        }));
    };

    /* ----------------------------------------------------------------------
       Enable Type Change
       ---------------------------------------------------------------------- */

    const handleEnableTypeChange = () => {
        if (!isVerified || loading) {
            return;
        }

        setAllowTypeChange(true);
    };

    /* ----------------------------------------------------------------------
       Submit
       ---------------------------------------------------------------------- */

    const handleSubmit = (event) => {
        event.preventDefault();

        /*
         * Registration number is deliberately NOT included in the
         * update payload.
         *
         * It is generated exclusively by the backend verification
         * process.
         */
        onSubmit?.({
            name: form.name.trim(),
            email: form.email.trim(),
            organization_type: form.organization_type,
            phone: form.phone.trim(),
            website: form.website.trim(),
            address: form.address.trim(),
        });
    };

    /* ----------------------------------------------------------------------
       Render
       ---------------------------------------------------------------------- */

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* ==================================================================
                Error
            ================================================================== */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertTriangle
                        size={18}
                        className="mt-0.5 shrink-0 text-red-600"
                    />

                    <p className="text-sm font-medium leading-6 text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* ==================================================================
                Organization Identity
            ================================================================== */}

            <section className="space-y-5">
                <div>
                    <h3 className="text-base font-bold text-[#083c36]">
                        Organization information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Basic information used to identify and manage this
                        organization.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <FormField
                        id="organization-name"
                        name="name"
                        label="Organization name"
                        value={form.name}
                        placeholder="Enter organization name"
                        required
                        disabled={loading}
                        icon={Building2}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <FormField
                        id="organization-email"
                        name="email"
                        label="Email address"
                        value={form.email}
                        placeholder="Enter organization email"
                        type="email"
                        required
                        disabled={loading}
                        icon={Mail}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />
                </div>
            </section>

            {/* ==================================================================
                Organization Type + Registration
            ================================================================== */}

            <section className="space-y-5">
                <div>
                    <h3 className="text-base font-bold text-[#083c36]">
                        Organization classification
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Organization type determines the type segment used when
                        an SP registration number is issued.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="space-y-3">
                        <SelectField
                            id="organization-type"
                            name="organization_type"
                            label="Organization type"
                            value={form.organization_type}
                            required
                            disabled={organizationTypeLocked}
                            options={ORGANIZATION_TYPES}
                            fieldErrors={fieldErrors}
                            onChange={handleChange}
                        />

                        {isVerified && !allowTypeChange && (
                            <button
                                type="button"
                                onClick={handleEnableTypeChange}
                                disabled={loading}
                                className={[
                                    'inline-flex items-center gap-2',
                                    'text-sm font-semibold',
                                    'text-[#0f6258]',
                                    'transition hover:text-[#083c36]',
                                    'disabled:cursor-not-allowed',
                                    'disabled:opacity-50',
                                ].join(' ')}
                            >
                                <LockKeyhole size={15} />
                                Change organization type
                            </button>
                        )}

                        {isVerified && allowTypeChange && (
                            <div className="flex items-start gap-3 rounded-xl border border-[#ed864a]/30 bg-[#ed864a]/5 px-4 py-3">
                                <AlertTriangle
                                    size={17}
                                    className="mt-0.5 shrink-0 text-[#ed864a]"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#083c36]">
                                        Re-verification required
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Changing the organization type will move
                                        this verified organization to pending
                                        status. Its current registration number
                                        will be retired and a new number will be
                                        issued after re-verification.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ==========================================================
                        Registration Number
                    ========================================================== */}

                    <div className="space-y-2">
                        <label
                            htmlFor="organization-registration-number"
                            className="flex items-center gap-2 text-sm font-semibold text-[#083c36]"
                        >
                            <FileText
                                size={16}
                                strokeWidth={2}
                                className="text-[#0f6258]"
                            />

                            <span>Registration number</span>
                        </label>

                        <div className="relative">
                            <input
                                id="organization-registration-number"
                                name="registration_number"
                                value={registrationNumber}
                                placeholder={
                                    isEditMode
                                        ? 'Not issued yet'
                                        : 'Generated after verification'
                                }
                                disabled
                                readOnly
                                className={[
                                    'w-full rounded-xl border',
                                    'bg-slate-50 px-4 py-3 pr-11',
                                    'text-sm font-medium',
                                    registrationNumber
                                        ? 'text-[#083c36]'
                                        : 'text-slate-400',
                                    'border-slate-200',
                                    'cursor-not-allowed',
                                ].join(' ')}
                            />

                            <LockKeyhole
                                size={16}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>

                        <p className="text-xs leading-5 text-slate-500">
                            {registrationNumber
                                ? 'Issued automatically by SP after successful verification. It cannot be edited manually.'
                                : 'This number will be generated automatically after the organization is successfully verified.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* ==================================================================
                Contact Information
            ================================================================== */}

            <section className="space-y-5">
                <div>
                    <h3 className="text-base font-bold text-[#083c36]">
                        Contact information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Contact details used for organization communication.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <FormField
                        id="organization-phone"
                        name="phone"
                        label="Phone number"
                        value={form.phone}
                        placeholder="Enter phone number"
                        type="tel"
                        disabled={loading}
                        icon={Phone}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <FormField
                        id="organization-website"
                        name="website"
                        label="Website"
                        value={form.website}
                        placeholder="https://example.org"
                        type="url"
                        disabled={loading}
                        icon={Globe}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />
                </div>

                <FormField
                    id="organization-address"
                    name="address"
                    label="Address"
                    value={form.address}
                    placeholder="Enter organization address"
                    disabled={loading}
                    icon={MapPin}
                    fieldErrors={fieldErrors}
                    onChange={handleChange}
                />
            </section>

            {/* ==================================================================
                Verification Information
            ================================================================== */}

            {isEditMode && (
                <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f6258]/10">
                            <ShieldCheck size={18} className="text-[#0f6258]" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-bold text-[#083c36]">
                                Verification status
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span
                                    className={[
                                        'inline-flex items-center gap-1.5',
                                        'rounded-full px-3 py-1.5',
                                        'text-xs font-semibold',
                                        verificationStatus === 'verified'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : verificationStatus === 'rejected'
                                              ? 'bg-red-50 text-red-700'
                                              : 'bg-amber-50 text-amber-700',
                                    ].join(' ')}
                                >
                                    {verificationStatus === 'verified' && (
                                        <CheckCircle2 size={14} />
                                    )}

                                    {verificationStatus === 'verified'
                                        ? 'Verified'
                                        : verificationStatus === 'rejected'
                                          ? 'Rejected'
                                          : 'Pending'}
                                </span>
                            </div>

                            {isVerified && (
                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    This organization already has an issued SP
                                    registration number. General profile
                                    information can be edited normally. Changing
                                    the organization type requires
                                    re-verification and issuance of a new
                                    registration number.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ==================================================================
                Actions
            ================================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className={[
                            'rounded-xl border border-slate-200',
                            'bg-white px-5 py-3',
                            'text-sm font-semibold text-slate-700',
                            'transition hover:bg-slate-50',
                            'disabled:cursor-not-allowed',
                            'disabled:opacity-50',
                        ].join(' ')}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={[
                        'inline-flex items-center justify-center gap-2',
                        'rounded-xl bg-[#0f6258] px-6 py-3',
                        'text-sm font-semibold text-white',
                        'shadow-sm transition',
                        'hover:bg-[#083c36]',
                        'disabled:cursor-not-allowed',
                        'disabled:opacity-60',
                    ].join(' ')}
                >
                    {loading ? (
                        <>
                            <span
                                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                aria-hidden="true"
                            />
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={17} />

                            {isEditMode
                                ? 'Save changes'
                                : 'Create organization'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default OrganizationForm;
