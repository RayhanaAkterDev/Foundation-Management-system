import React, { useEffect, useState } from 'react';

import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    ChevronDown,
} from 'lucide-react';

import DashboardInput from '@/components/dashboard/DashboardInput';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import { ORGANIZATION_TYPES } from '../data/organizationTypes';

/* ==========================================================================
   CONSTANTS
============================================================================ */

const EMPTY_FORM = {
    name: '',
    email: '',
    organization_type: '',
    phone: '',
    website: '',
    address: '',
};

const VERIFIED_STATUS = 'verified';

/* ==========================================================================
   INITIAL FORM
============================================================================ */

const getInitialForm = (mode, organization) => {
    if (mode === 'edit' && organization) {
        return {
            name: organization.name || '',
            email: organization.user?.email || organization.email || '',
            organization_type: organization.organization_type || '',
            phone: organization.phone || '',
            website: organization.website || '',
            address: organization.address || '',
        };
    }

    return { ...EMPTY_FORM };
};

/* ==========================================================================
   FIELD ERROR
============================================================================ */

const FieldError = ({ name, fieldErrors }) => {
    const error = fieldErrors?.[name];

    if (!error) return null;

    const message = Array.isArray(error) ? error[0] : error;

    if (!message) return null;

    return (
        <div
            className="
                mt-2
                flex items-start gap-2
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

            <span>{message}</span>
        </div>
    );
};

/* ==========================================================================
   EDITOR FIELD — SAME AS USER FORM
============================================================================ */

const EditorField = ({
    id,
    name,
    label,
    value,
    type = 'text',
    placeholder,
    disabled = false,
    required = false,
    showRequiredMark = true,
    autoComplete,
    fieldErrors,
    onChange,
    onPhoneChange,
}) => {
    const error = fieldErrors?.[name];
    const hasError = Boolean(Array.isArray(error) ? error.length : error);

    return (
        <div className="min-w-0">
            <DashboardInput
                id={id}
                name={name}
                label={label}
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                requiredMark={required && showRequiredMark}
                autoComplete={autoComplete}
                invalid={hasError}
                onChange={onPhoneChange || onChange}
                maxLength={name === 'phone' ? 11 : undefined}
                inputMode={name === 'phone' ? 'numeric' : undefined}
                aria-describedby={hasError ? `${id}-error` : undefined}
            />

            {hasError && (
                <div id={`${id}-error`}>
                    <FieldError name={name} fieldErrors={fieldErrors} />
                </div>
            )}
        </div>
    );
};

/* ==========================================================================
   EDITOR SELECT — MATCHED TO DASHBOARD INPUT
============================================================================ */

const EditorSelect = ({
    id,
    name,
    label,
    value,
    options = [],
    placeholder,
    disabled = false,
    required = false,
    showRequiredMark = true,
    fieldErrors,
    onChange,
}) => {
    const error = fieldErrors?.[name];
    const hasError = Boolean(Array.isArray(error) ? error.length : error);

    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className={`
                    mb-[7px] block
                    font-sans!
                    text-[13px]
                    font-medium!
                    leading-5
                    ${hasError ? 'text-[#C99AA2]!' : 'text-[#9BA7B6]!'}
                `}
            >
                {label}

                {required && showRequiredMark && (
                    <span aria-hidden="true" className="ml-1 text-[#8793A2]!">
                        *
                    </span>
                )}
            </label>

            <div
                className={`
                    relative flex w-full min-w-0
                    items-center overflow-hidden
                    rounded-[4px] border

                    transition-[background-color,border-color,box-shadow]
                    duration-150

                    ${
                        hasError
                            ? 'border-[#86545E] bg-[#211E25]'
                            : `
                                border-[#29313D]
                                bg-[#151B23]
                                shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]

                                hover:border-[#3C4654]
                                hover:bg-[#171E27]

                                focus-within:border-[#637489]
                                focus-within:bg-[#1A222D]
                                focus-within:shadow-[inset_0_1px_3px_rgba(0,0,0,0.12)]
                            `
                    }

                    ${disabled ? 'opacity-50' : ''}
                `}
            >
                <select
                    id={id}
                    name={name}
                    value={value}
                    required={required}
                    disabled={disabled}
                    onChange={onChange}
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                    className={`
                        block h-11 w-full min-w-0
                        appearance-none rounded-none

                        border-0! bg-transparent!
                        shadow-none! outline-none! ring-0!

                        pl-3.5 pr-11

                        font-sans!
                        text-[14px]
                        font-normal!
                        tracking-normal

                        ${value ? 'text-[#D8DEE7]!' : 'text-[#778393]!'}

                        focus:border-0!
                        focus:outline-none!
                        focus:ring-0!

                        disabled:cursor-not-allowed
                    `}
                >
                    <option value="" className="bg-[#151B23] text-[#778393]">
                        {placeholder}
                    </option>

                    {options.map((option) => {
                        const optionValue =
                            typeof option === 'string' ? option : option.value;

                        const optionLabel =
                            typeof option === 'string' ? option : option.label;

                        return (
                            <option
                                key={optionValue}
                                value={optionValue}
                                className="
                                    bg-[#151B23]
                                    text-[#D8DEE7]
                                "
                            >
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>

                <ChevronDown
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute right-3.5 top-1/2
                        -translate-y-1/2
                        text-[#8290A1]
                    "
                />
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
   SECTION HEADING — SAME AS USER FORM
============================================================================ */

const FormSectionHeading = ({ number, title, description }) => (
    <div className="flex items-start gap-3.5">
        <div
            aria-hidden="true"
            className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                border border-[#35404E]
                bg-[#171E28]

                font-sans!
                text-[12px]
                font-semibold!
                tabular-nums
                text-[#AEB7C3]!
            "
        >
            {number}
        </div>

        <div className="min-w-0 pt-0.5">
            <h3
                className="
                    font-sans!
                    text-[15px]
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
                        mt-1 max-w-[570px]
                        font-sans!
                        text-[13px]
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
   ORGANIZATION FORM
============================================================================ */

const OrganizationForm = ({
    mode = 'add',
    organization = null,
    loading = false,
    error = '',
    fieldErrors = {},
    onSubmit,
    onCancel,
    onChange,
}) => {
    const isEditMode = mode === 'edit';

    const [form, setForm] = useState(() => getInitialForm(mode, organization));

    const verificationStatus = organization?.verification_status || '';

    const isVerified = isEditMode && verificationStatus === VERIFIED_STATUS;

    const originalOrganizationType = organization?.organization_type || '';

    const organizationTypeChanged =
        isEditMode &&
        originalOrganizationType.trim() !== form.organization_type.trim();

    /* ======================================================================
       LIVE PREVIEW
    ====================================================================== */

    useEffect(() => {
        if (onChange) {
            onChange(form);
        }
    }, [form, onChange]);

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
       SUBMIT
    ====================================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit?.({
            name: form.name.trim(),
            email: form.email.trim(),
            organization_type: form.organization_type,
            phone: form.phone.trim(),
            website: form.website.trim(),
            address: form.address.trim(),
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="@container w-full min-w-0 font-sans!"
        >
            {/* GENERAL ERROR */}

            {error && (
                <LoadingError
                    className="mb-7"
                    title="Organization could not be saved"
                    message={error}
                />
            )}

            {/* ==========================================================
                01 — ORGANIZATION DETAILS
            ========================================================== */}

            <section className="grid gap-6 sm:gap-7">
                <FormSectionHeading number="01" title="Organization details" />

                <div
                    className="
                        grid min-w-0
                        gap-x-5 gap-y-6
                        @[620px]:grid-cols-2
                        @[950px]:gap-x-6
                    "
                >
                    <EditorField
                        id="organization-name"
                        name="name"
                        label="Organization name"
                        value={form.name}
                        placeholder="Enter organization name"
                        disabled={loading}
                        autoComplete="organization"
                        required
                        showRequiredMark={!isEditMode}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <EditorField
                        id="organization-email"
                        name="email"
                        label="Email address"
                        type="email"
                        value={form.email}
                        placeholder="name@organization.org"
                        disabled={loading}
                        autoComplete="email"
                        required
                        showRequiredMark={!isEditMode}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <div className="min-w-0 @[620px]:col-span-2">
                        <EditorSelect
                            id="organization-type"
                            name="organization_type"
                            label="Organization type"
                            value={form.organization_type}
                            placeholder="Select organization type"
                            disabled={loading}
                            required
                            showRequiredMark={!isEditMode}
                            options={ORGANIZATION_TYPES}
                            fieldErrors={fieldErrors}
                            onChange={handleChange}
                        />

                        {isVerified && organizationTypeChanged && (
                            <div
                                role="status"
                                className="
                                        mt-4 flex items-start gap-3.5
                                        border border-[#493D2C]
                                        bg-[#201D18]
                                        px-4 py-4
                                    "
                            >
                                <div
                                    className="
                                            flex h-9 w-9 shrink-0
                                            items-center justify-center
                                            border border-[#493D2C]
                                            bg-[#282219]
                                            text-[#C5A06B]
                                        "
                                >
                                    <AlertTriangle
                                        size={16}
                                        strokeWidth={1.7}
                                    />
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
                                        Re-verification required
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
                                        Changing the organization type will move
                                        this verified organization back to
                                        pending verification. Its existing
                                        registration number will be retired and
                                        a new one will be issued after
                                        successful verification.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ==========================================================
                02 — CONTACT INFORMATION
            ========================================================== */}

            <section
                className="
                    mt-8 grid gap-6
                    border-t border-[#303A47]
                    pt-7
                    sm:mt-9 sm:gap-7 sm:pt-8
                "
            >
                <FormSectionHeading number="02" title="Contact information" />

                <div
                    className="
                        grid min-w-0
                        gap-x-5 gap-y-6
                        @[620px]:grid-cols-2
                        @[950px]:gap-x-6
                    "
                >
                    <EditorField
                        id="organization-phone"
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

                    <EditorField
                        id="organization-website"
                        name="website"
                        label="Website"
                        type="url"
                        value={form.website}
                        placeholder="https://example.org"
                        disabled={loading}
                        autoComplete="url"
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <div className="min-w-0 @[620px]:col-span-2">
                        <EditorField
                            id="organization-address"
                            name="address"
                            label="Address"
                            value={form.address}
                            placeholder="Enter organization address"
                            disabled={loading}
                            autoComplete="street-address"
                            fieldErrors={fieldErrors}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </section>

            {/* ==========================================================
                ACTION BAR — SAME AS USER FORM
            ========================================================== */}

            <footer
                className="
                    mt-11
                    border-t border-[#303A47]
                    pt-7
                    sm:mt-12 sm:pt-8
                "
            >
                <div
                    className="
                        flex flex-col-reverse gap-3
                        @[620px]:flex-row
                        @[620px]:items-center
                        @[620px]:justify-end
                    "
                >
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="
                                h-11 w-full
                                border border-[#303A47]
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

                                focus-visible:outline-2
                                focus-visible:outline-offset-2
                                focus-visible:outline-[#8792A1]

                                @[620px]:w-auto
                            "
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            group flex h-11 w-full
                            min-w-[170px]
                            items-center justify-center
                            gap-2.5

                            border border-[#586678]
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

                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-[#AEB7C3]

                            @[620px]:w-auto
                        "
                    >
                        {loading ? (
                            <LoadingUI
                                variant="button"
                                title={isEditMode ? 'Saving...' : 'Creating...'}
                            />
                        ) : (
                            <>
                                <span>
                                    {isEditMode
                                        ? 'Save changes'
                                        : 'Create organization'}
                                </span>

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
                            </>
                        )}
                    </button>
                </div>
            </footer>
        </form>
    );
};

export default OrganizationForm;
