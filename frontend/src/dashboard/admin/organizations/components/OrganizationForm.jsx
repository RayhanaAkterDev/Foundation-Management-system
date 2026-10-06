import React, { useEffect, useMemo, useState } from 'react';

import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Building2,
    CheckCircle2,
    ShieldCheck,
} from 'lucide-react';

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

    if (!error) {
        return null;
    }

    const message = Array.isArray(error) ? error[0] : error;

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

            <span>{message}</span>
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
    disabled = false,
    required = false,
    autoComplete,
    fieldErrors,
    onChange,
    onPhoneChange,
}) => {
    const hasError = Boolean(fieldErrors?.[name]);

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
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    onChange={onPhoneChange || onChange}
                    maxLength={name === 'phone' ? 11 : undefined}
                    inputMode={name === 'phone' ? 'numeric' : undefined}
                    className="
                        h-full
                        w-full
                        appearance-none

                        border-0!
                        bg-transparent!

                        px-4

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
            </div>

            <FieldError name={name} fieldErrors={fieldErrors} />
        </div>
    );
};

/* ==========================================================================
   SELECT FIELD
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
    fieldErrors,
    onChange,
}) => {
    const hasError = Boolean(fieldErrors?.[name]);

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
                <select
                    id={id}
                    name={name}
                    value={value}
                    required={required}
                    disabled={disabled}
                    onChange={onChange}
                    className="
                        h-full
                        w-full
                        appearance-none

                        border-0!
                        bg-transparent!

                        px-4
                        pr-11

                        font-sans!
                        text-[12px]
                        font-medium!

                        text-[#EEF1F5]!

                        shadow-none!
                        outline-none!
                        ring-0!

                        focus:border-0!
                        focus:bg-transparent!
                        focus:outline-none!
                        focus:ring-0!

                        disabled:cursor-not-allowed
                        disabled:opacity-45
                    "
                >
                    <option value="" className="bg-[#151B24] text-[#697586]">
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
                                className="bg-[#151B24] text-[#EEF1F5]"
                            >
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>

                <span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2

                        h-0
                        w-0
                        -translate-y-1/2

                        border-l-[4px]
                        border-r-[4px]
                        border-t-[5px]

                        border-l-transparent
                        border-r-transparent
                        border-t-[#697586]
                    "
                />
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
    const initialForm = useMemo(
        () => getInitialForm(mode, organization),
        [mode, organization],
    );

    const [form, setForm] = useState(initialForm);

    const isEditMode = mode === 'edit';

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
       CHANGE
    ====================================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handlePhoneChange = (event) => {
        const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 11);

        setForm((current) => ({
            ...current,
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
        <form onSubmit={handleSubmit} className="w-full font-sans!">
            {/* =============================================================
                GENERAL ERROR
            ============================================================== */}

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
                            Organization could not be saved
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
                01 — ORGANIZATION DETAILS
            ============================================================== */}

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
                    title="Organization details"
                    description={
                        isEditMode
                            ? 'Identity and classification information attached to this organization.'
                            : 'Basic information used to identify and classify this organization.'
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
                        id="organization-name"
                        name="name"
                        label="Organization name"
                        value={form.name}
                        placeholder="Enter organization name"
                        disabled={loading}
                        autoComplete="organization"
                        required
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
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                        <EditorSelect
                            id="organization-type"
                            name="organization_type"
                            label="Organization type"
                            value={form.organization_type}
                            placeholder="Select organization type"
                            disabled={loading}
                            required
                            options={ORGANIZATION_TYPES}
                            fieldErrors={fieldErrors}
                            onChange={handleChange}
                        />

                        {isVerified && organizationTypeChanged && (
                            <div
                                className="
                                        mt-4

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
                                    <AlertTriangle
                                        size={14}
                                        strokeWidth={1.7}
                                    />
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
                                        Re-verification required
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

            {/* =============================================================
                02 — CONTACT INFORMATION
            ============================================================== */}

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
                    title="Contact information"
                    description="Contact and location details used for organization communication."
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

                    <div className="md:col-span-2">
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

            {/* =============================================================
                VERIFICATION INFO — EDIT MODE ONLY
            ============================================================== */}

            {isEditMode && (
                <div
                    className="
                        mt-8

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
                            {isVerified ? (
                                <CheckCircle2 size={15} strokeWidth={1.7} />
                            ) : (
                                <ShieldCheck size={15} strokeWidth={1.65} />
                            )}
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
                                Verification status
                            </p>

                            <p
                                className="
                                    mt-1

                                    font-sans!
                                    text-[9.5px]
                                    leading-[1.6]

                                    text-[#697586]!
                                "
                            >
                                {isVerified
                                    ? 'This organization has completed verification.'
                                    : verificationStatus === 'rejected'
                                      ? 'This organization is currently rejected.'
                                      : 'This organization is waiting for verification.'}
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2

                            font-sans!
                            text-[9.5px]
                            font-medium!

                            sm:border-l
                            sm:border-[#29323E]
                            sm:pl-5
                        "
                    >
                        <span
                            className={`
                                h-1.5
                                w-1.5
                                rounded-full

                                ${
                                    verificationStatus === 'verified'
                                        ? 'bg-[#8FAE9B]'
                                        : verificationStatus === 'rejected'
                                          ? 'bg-[#C47D84]'
                                          : 'bg-[#D39A4A]'
                                }
                            `}
                        />

                        <span
                            className={`
                                ${
                                    verificationStatus === 'verified'
                                        ? 'text-[#A9C2B2]!'
                                        : verificationStatus === 'rejected'
                                          ? 'text-[#D99A9F]!'
                                          : 'text-[#C5A06B]!'
                                }
                            `}
                        >
                            {verificationStatus === 'verified'
                                ? 'Verified'
                                : verificationStatus === 'rejected'
                                  ? 'Rejected'
                                  : 'Pending'}
                        </span>
                    </div>
                </div>
            )}

            {/* =============================================================
                ACTION BAR
            ============================================================== */}

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
                            {isEditMode
                                ? 'Review the information before saving. Changes will be applied directly to this organization.'
                                : 'Review the organization details above before creating the profile.'}
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
                        {onCancel && (
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
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                group

                                flex
                                h-[42px]
                                min-w-[170px]
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
                                    ? isEditMode
                                        ? 'Saving...'
                                        : 'Creating...'
                                    : isEditMode
                                      ? 'Save changes'
                                      : 'Create organization'}
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
        </form>
    );
};

export default OrganizationForm;
