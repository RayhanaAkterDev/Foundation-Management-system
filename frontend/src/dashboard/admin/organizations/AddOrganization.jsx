// src/dashboard/admin/organizations/AddOrganization.jsx

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    Building2,
    Check,
    FileText,
    Globe,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import OrganizationForm from './components/OrganizationForm';
import SuccessToast from './components/SuccessToast';

import { createOrganization } from './api/organizationApi';

import { formatType } from './utils/organizationDetailsUtils';

/* ==========================================================================
   EMPTY PREVIEW
============================================================================ */

const EMPTY_PREVIEW = {
    name: '',
    email: '',
    organization_type: '',
    registration_number: '',
    phone: '',
    website: '',
    address: '',
};

/* ==========================================================================
   PREVIEW DETAIL
============================================================================ */

const DetailRow = ({
    icon: Icon,
    label,
    value,
    muted = false,
    breakWords = false,
}) => {
    return (
        <div
            className="
                group
                flex
                min-w-0
                items-start
                gap-4
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

                    bg-[#151B24]

                    text-[#697586]

                    transition-[background-color,border-color,color]
                    duration-150

                    group-hover:border-[#394555]
                    group-hover:bg-[#1A222D]
                    group-hover:text-[#AEB7C3]
                "
            >
                <Icon size={14} strokeWidth={1.65} />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
                <p
                    className="
                        font-sans!

                        text-[9px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]

                        text-[#697586]
                    "
                >
                    {label}
                </p>

                <p
                    className={`
                        mt-1.5

                        font-sans!
                        text-[11px]
                        font-medium!
                        leading-5

                        ${breakWords ? 'wrap-break-word' : 'truncate'}

                        ${muted ? 'text-[#5E6978]!' : 'text-[#B8C0CA]!'}
                    `}
                >
                    {value}
                </p>
            </div>
        </div>
    );
};

/* ==========================================================================
   ADD ORGANIZATION
============================================================================ */

const AddOrganization = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formResetKey, setFormResetKey] = useState(0);

    const [formPreview, setFormPreview] = useState({
        ...EMPTY_PREVIEW,
    });

    /* ======================================================================
       SUCCESS MESSAGE
    ====================================================================== */

    useEffect(() => {
        if (!successMessage) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            setSuccessMessage('');
        }, 4000);

        return () => window.clearTimeout(timer);
    }, [successMessage]);

    /* ======================================================================
       BACK
    ====================================================================== */

    const handleBack = () => {
        if (loading) {
            return;
        }

        navigate('/admin/dashboard/organizations');
    };

    /* ======================================================================
       LIVE PREVIEW
    ====================================================================== */

    const handleFormChange = useCallback((formData) => {
        setFormPreview(formData);
    }, []);

    /* ======================================================================
       CREATE ORGANIZATION
    ====================================================================== */

    const handleAddOrganization = async (formData) => {
        setLoading(true);
        setError('');
        setFieldErrors({});
        setSuccessMessage('');

        try {
            await createOrganization(formData);

            setSuccessMessage(
                `${formData.name || 'Organization'} was created successfully.`,
            );

            setFormPreview({
                ...EMPTY_PREVIEW,
            });

            setFormResetKey((previous) => previous + 1);
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setFieldErrors(err.errors);
            }

            setError(err.message || 'Unable to create organization.');
        } finally {
            setLoading(false);
        }
    };

    /* ======================================================================
       PREVIEW DATA
    ====================================================================== */

    const name = formPreview.name?.trim();

    const displayName = name || 'New organization';

    const initial = name ? name.charAt(0).toUpperCase() : null;

    const organizationType = formPreview.organization_type
        ? formatType(formPreview.organization_type)
        : 'No organization type selected';

    const email = formPreview.email?.trim() || 'Not entered yet';

    const registrationNumber =
        formPreview.registration_number?.trim() || 'Not entered yet';

    const phone = formPreview.phone?.trim() || 'Not entered yet';

    const website = formPreview.website?.trim() || 'Not entered yet';

    const address = formPreview.address?.trim() || 'Not entered yet';

    const completedFields = [
        formPreview.name,
        formPreview.email,
        formPreview.organization_type,
        formPreview.registration_number,
        formPreview.phone,
        formPreview.website,
        formPreview.address,
    ].filter((value) => value?.trim?.() || value).length;

    const totalPreviewFields = 7;

    const completionPercentage = (completedFields / totalPreviewFields) * 100;

    /* ======================================================================
       UI
    ====================================================================== */

    return (
        <div
            className="
                space-y-10
                font-sans!

                lg:space-y-12
            "
        >
            {/* =============================================================
                PAGE HEADER
            ============================================================== */}

            <PageHeader
                title="Add Organization"
                subtitle="Create and configure a new organization profile for the Stand For People platform."
                action={
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="
                            group

                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2.5

                            border
                            border-[#29323E]

                            bg-[#0E1219]

                            px-3.5

                            font-sans!
                            text-[11px]
                            font-medium!
                            whitespace-nowrap

                            text-[#AEB7C3]!

                            transition-[background-color,border-color,color]
                            duration-150
                            ease-out

                            hover:border-[#394555]
                            hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]!

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.8}
                            className="
                                shrink-0
                                text-[#697586]

                                transition-[transform,color]
                                duration-150

                                group-hover:-translate-x-0.5
                                group-hover:text-[#AEB7C3]
                            "
                        />

                        <span>Back to organizations</span>
                    </button>
                }
            />

            {/* =============================================================
                SUCCESS
            ============================================================== */}

            <SuccessToast
                show={Boolean(successMessage)}
                message={successMessage}
            />

            {/* =============================================================
                WORKSPACE
            ============================================================== */}

            <section
                className="
                    overflow-hidden

                    border
                    border-[#252D38]

                    bg-[#0E1219]
                "
            >
                {/* =========================================================
                    WORKSPACE HEADER
                ========================================================== */}

                <header
                    className="
                        relative

                        border-b
                        border-[#252D38]

                        bg-[#1A222D]

                        px-6
                        py-7

                        sm:px-7
                        sm:py-8

                        lg:px-8
                        lg:py-8

                        xl:px-10
                        xl:py-9
                    "
                >
                    <span
                        aria-hidden="true"
                        className="
                            absolute
                            bottom-0
                            left-0
                            top-0

                            w-[2px]

                            bg-[#697586]
                        "
                    />

                    <div
                        className="
                            flex
                            flex-col
                            gap-7

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:gap-10

                            lg:gap-12
                        "
                    >
                        {/* LEFT */}

                        <div className="min-w-0 flex-1">
                            <div
                                className="
                                    flex
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
                                        border-[#303A47]

                                        bg-[#151B24]

                                        text-[#8792A1]
                                    "
                                >
                                    <Building2 size={15} strokeWidth={1.8} />
                                </div>

                                <div
                                    className="
                                        flex
                                        min-w-0
                                        flex-wrap
                                        items-center
                                        gap-x-2.5
                                        gap-y-1
                                    "
                                >
                                    <span
                                        className="
                                            font-sans!

                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#8792A1]
                                        "
                                    >
                                        Organization directory
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="
                                            h-1
                                            w-1
                                            shrink-0
                                            rounded-full

                                            bg-[#4B5869]
                                        "
                                    />

                                    <span
                                        className="
                                            font-sans!

                                            text-[9px]
                                            font-medium!
                                            uppercase
                                            tracking-[0.12em]

                                            text-[#697586]
                                        "
                                    >
                                        New profile
                                    </span>
                                </div>
                            </div>

                            <h2
                                className="
                                    mt-5

                                    font-sans!

                                    text-[18px]
                                    font-semibold!
                                    leading-[1.3]
                                    tracking-[-0.02em]

                                    text-[#EEF1F5]!

                                    sm:text-[19px]
                                "
                            >
                                Create a new organization
                            </h2>

                            <p
                                className="
                                    mt-2.5
                                    max-w-[650px]

                                    font-sans!

                                    text-[11px]
                                    font-normal!
                                    leading-[1.75]

                                    text-[#8792A1]!

                                    sm:text-[11.5px]
                                "
                            >
                                Enter the organization&apos;s identity,
                                registration and contact information before
                                adding it to the organization directory.
                            </p>
                        </div>

                        {/* RIGHT */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-3.5

                                border-t
                                border-[#303A47]

                                pt-5

                                sm:border-l
                                sm:border-t-0
                                sm:pl-7
                                sm:pt-0

                                lg:pl-8
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
                                    border-[#303A47]

                                    bg-[#151B24]

                                    text-[#8792A1]
                                "
                            >
                                <Check size={14} strokeWidth={2} />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        font-sans!

                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.13em]

                                        text-[#697586]
                                    "
                                >
                                    Form guide
                                </p>

                                <p
                                    className="
                                        mt-1.5

                                        font-sans!

                                        text-[10px]
                                        font-normal!

                                        text-[#8792A1]
                                    "
                                >
                                    Required fields are marked *
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =========================================================
                    BODY
                ========================================================== */}

                <div
                    className="
                        grid
                        min-w-0

                        lg:grid-cols-[310px_minmax(0,1fr)]
                        xl:grid-cols-[330px_minmax(0,1fr)]
                    "
                >
                    {/* =====================================================
                        LIVE PREVIEW
                    ====================================================== */}

                    <aside
                        className="
                            hidden

                            border-[#252D38]

                            bg-[#0E1219]

                            lg:block
                            lg:border-r
                        "
                    >
                        <div
                            className="
                                flex
                                h-full
                                min-h-[760px]
                                flex-col

                                px-7
                                py-9

                                xl:px-8
                                xl:py-10
                            "
                        >
                            {/* =============================================
                                PREVIEW LABEL
                            ============================================== */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        aria-hidden="true"
                                        className="
                                            h-[2px]
                                            w-4
                                            shrink-0

                                            bg-[#697586]
                                        "
                                    />

                                    <p
                                        className="
                                            truncate

                                            font-sans!

                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#8792A1]
                                        "
                                    >
                                        Organization preview
                                    </p>
                                </div>

                                <span
                                    className="
                                        shrink-0

                                        font-sans!

                                        text-[9px]
                                        font-medium!
                                        tabular-nums

                                        text-[#697586]
                                    "
                                >
                                    {completedFields}/{totalPreviewFields}
                                </span>
                            </div>

                            {/* =============================================
                                IDENTITY
                            ============================================== */}

                            <div className="mt-10">
                                <div
                                    className={`
                                        relative

                                        flex
                                        h-[68px]
                                        w-[68px]
                                        items-center
                                        justify-center

                                        border

                                        font-sans!
                                        text-[20px]
                                        font-semibold!

                                        transition-[background-color,border-color,color]
                                        duration-200

                                        ${
                                            name
                                                ? `
                                                    border-[#394555]
                                                    bg-[#1A222D]
                                                    text-[#EEF1F5]
                                                `
                                                : `
                                                    border-[#29323E]
                                                    bg-[#151B24]
                                                    text-[#697586]
                                                `
                                        }
                                    `}
                                >
                                    {initial || (
                                        <Building2
                                            size={22}
                                            strokeWidth={1.5}
                                        />
                                    )}

                                    {name && (
                                        <span
                                            className="
                                                absolute
                                                -bottom-1
                                                -right-1

                                                flex
                                                h-5
                                                w-5
                                                items-center
                                                justify-center

                                                border-2
                                                border-[#0E1219]

                                                bg-[#303A47]

                                                text-[#DCE1E7]
                                            "
                                        >
                                            <Check
                                                size={10}
                                                strokeWidth={2.4}
                                            />
                                        </span>
                                    )}
                                </div>

                                <h2
                                    className={`
                                        mt-6
                                        truncate

                                        font-sans!

                                        text-[18px]
                                        font-semibold!
                                        leading-[1.3]
                                        tracking-[-0.02em]

                                        ${
                                            name
                                                ? 'text-[#EEF1F5]!'
                                                : 'text-[#697586]!'
                                        }
                                    `}
                                    title={displayName}
                                >
                                    {displayName}
                                </h2>

                                <div
                                    className="
                                        mt-3.5

                                        flex
                                        min-w-0
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <Building2
                                        size={14}
                                        strokeWidth={1.7}
                                        className={
                                            formPreview.organization_type
                                                ? 'shrink-0 text-[#A6AFBB]'
                                                : 'shrink-0 text-[#5E6978]'
                                        }
                                    />

                                    <span
                                        className={`
                                            truncate

                                            font-sans!

                                            text-[11px]
                                            font-medium!

                                            ${
                                                formPreview.organization_type
                                                    ? 'text-[#AEB7C3]'
                                                    : 'text-[#5E6978]'
                                            }
                                        `}
                                    >
                                        {organizationType}
                                    </span>
                                </div>
                            </div>

                            {/* =============================================
                                ORGANIZATION DETAILS
                            ============================================== */}

                            <div
                                className="
                                    mt-10
                                    space-y-6

                                    border-t
                                    border-[#252D38]

                                    pt-8
                                "
                            >
                                <DetailRow
                                    icon={Mail}
                                    label="Email"
                                    value={email}
                                    muted={!formPreview.email?.trim()}
                                />

                                <DetailRow
                                    icon={FileText}
                                    label="Registration"
                                    value={registrationNumber}
                                    muted={
                                        !formPreview.registration_number?.trim()
                                    }
                                />

                                <DetailRow
                                    icon={Phone}
                                    label="Phone"
                                    value={phone}
                                    muted={!formPreview.phone?.trim()}
                                />

                                <DetailRow
                                    icon={Globe}
                                    label="Website"
                                    value={website}
                                    muted={!formPreview.website?.trim()}
                                />

                                <DetailRow
                                    icon={MapPin}
                                    label="Address"
                                    value={address}
                                    muted={!formPreview.address?.trim()}
                                    breakWords
                                />
                            </div>

                            {/* =============================================
                                COMPLETION
                            ============================================== */}

                            <div
                                className="
                                    mt-10

                                    border-t
                                    border-[#252D38]

                                    pt-8
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <span
                                        className="
                                            font-sans!

                                            text-[10px]
                                            font-normal!

                                            text-[#697586]
                                        "
                                    >
                                        Details completed
                                    </span>

                                    <span
                                        className="
                                            font-sans!

                                            text-[10px]
                                            font-semibold!
                                            tabular-nums

                                            text-[#AEB7C3]
                                        "
                                    >
                                        {completedFields}/{totalPreviewFields}
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-3.5
                                        h-[3px]

                                        overflow-hidden

                                        bg-[#202832]
                                    "
                                >
                                    <div
                                        className="
                                            h-full

                                            bg-[#697586]

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

                            {/* =============================================
                                FOOTER NOTE
                            ============================================== */}

                            <div
                                className="
                                    mt-auto
                                    pt-12
                                "
                            >
                                <div
                                    className="
                                        border-t
                                        border-[#252D38]

                                        pt-7
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3.5
                                        "
                                    >
                                        <ShieldCheck
                                            size={15}
                                            strokeWidth={1.6}
                                            className="
                                                mt-0.5
                                                shrink-0

                                                text-[#697586]
                                            "
                                        />

                                        <p
                                            className="
                                                max-w-[225px]

                                                font-sans!

                                                text-[10px]
                                                font-normal!
                                                leading-[1.75]

                                                text-[#697586]
                                            "
                                        >
                                            Verification can be reviewed after
                                            this organization has been created.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =====================================================
                        FORM
                    ====================================================== */}

                    <main
                        className="
                            min-w-0
                            bg-[#0E1219]
                        "
                    >
                        <div
                            className="
                                min-w-0

                                px-6
                                py-9

                                sm:px-7
                                sm:py-10

                                lg:px-9
                                lg:py-11

                                xl:px-11
                                xl:py-12

                                2xl:px-12
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    w-full
                                "
                            >
                                <OrganizationForm
                                    key={formResetKey}
                                    mode="add"
                                    loading={loading}
                                    error={error}
                                    fieldErrors={fieldErrors}
                                    onSubmit={handleAddOrganization}
                                    onCancel={handleBack}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </div>
    );
};

export default AddOrganization;
