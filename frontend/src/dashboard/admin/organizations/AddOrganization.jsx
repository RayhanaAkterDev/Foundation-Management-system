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

            <div className="min-w-0 pt-0.5">
                <p
                    className="
                        font-sans!

                        text-[9px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]

                        text-[#697586]!
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

        return () => {
            window.clearTimeout(timer);
        };
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

            /*
             * Remount OrganizationForm after successful creation.
             * This resets its internal form state without calling
             * setState synchronously inside an effect.
             */
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
       PREVIEW VALUES
    ====================================================================== */

    const name = formPreview.name?.trim();

    const displayName = name || 'New organization';

    const initial = name ? name.charAt(0).toUpperCase() : 'O';

    const organizationType = formPreview.organization_type
        ? formatType(formPreview.organization_type)
        : 'Not selected';

    const email = formPreview.email?.trim() || 'Not provided';

    const registrationNumber =
        formPreview.registration_number?.trim() || 'Not provided';

    const phone = formPreview.phone?.trim() || 'Not provided';

    const website = formPreview.website?.trim() || 'Not provided';

    const address = formPreview.address?.trim() || 'Not provided';

    /* ======================================================================
       UI
    ====================================================================== */

    return (
        <div
            className="
                min-h-full
                min-w-0

                bg-[#0A0E14]

                font-sans!
                text-[#EEF1F5]
            "
        >
            {/* =============================================================
                SUCCESS TOAST
            ============================================================== */}

            <SuccessToast
                show={Boolean(successMessage)}
                message={successMessage}
            />

            {/* =============================================================
                PAGE HEADER
            ============================================================== */}

            <PageHeader
                eyebrow="Organization management"
                title="Add organization"
                description="Create a new organization profile and add its essential account, registration and contact information."
                actions={
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            gap-2

                            border
                            border-[#303A47]

                            bg-[#151B24]

                            px-3.5

                            font-sans!
                            text-[10.5px]
                            font-medium!

                            text-[#AEB7C3]!

                            transition-[background-color,border-color,color]
                            duration-150

                            hover:border-[#394555]
                            hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]!

                            disabled:cursor-not-allowed
                            disabled:opacity-40

                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />

                        <span>Back to organizations</span>
                    </button>
                }
            />

            {/* =============================================================
                CONTENT
            ============================================================== */}

            <section
                className="
                    min-w-0

                    px-4
                    pb-8
                    pt-5

                    sm:px-5
                    sm:pb-10
                    sm:pt-6

                    md:px-6

                    lg:px-7
                    lg:pb-12

                    xl:px-8

                    2xl:px-10
                "
            >
                <div
                    className="
                        mx-auto
                        grid
                        w-full
                        max-w-[1500px]
                        min-w-0
                        gap-5

                        lg:grid-cols-[270px_minmax(0,1fr)]
                        lg:items-start
                        lg:gap-6

                        xl:grid-cols-[290px_minmax(0,1fr)]
                        xl:gap-7
                    "
                >
                    {/* =====================================================
                        LEFT — PREVIEW / CONTEXT
                    ====================================================== */}

                    <aside
                        className="
                            min-w-0

                            border
                            border-[#252D38]

                            bg-[#0E1219]

                            lg:sticky
                            lg:top-6
                        "
                    >
                        {/* PROFILE */}

                        <div
                            className="
                                border-b
                                border-[#252D38]

                                px-5
                                py-6

                                sm:px-6

                                lg:px-5
                                lg:py-7

                                xl:px-6
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-4

                                    lg:block
                                "
                            >
                                <div
                                    className="
                                        relative
                                        shrink-0
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center

                                            border
                                            border-[#303A47]

                                            bg-[#151B24]

                                            font-sans!
                                            text-[18px]
                                            font-semibold!

                                            text-[#DCE1E7]!

                                            lg:h-16
                                            lg:w-16
                                            lg:text-[20px]
                                        "
                                    >
                                        {initial}
                                    </div>

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
                                            <Check size={10} strokeWidth={2} />
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="
                                        min-w-0
                                        flex-1

                                        lg:mt-5
                                    "
                                >
                                    <p
                                        className="
                                            font-sans!
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#697586]!
                                        "
                                    >
                                        Organization preview
                                    </p>

                                    <h2
                                        className="
                                            mt-2
                                            truncate

                                            font-sans!
                                            text-[16px]
                                            font-semibold!
                                            leading-6
                                            tracking-[-0.015em]

                                            text-[#EEF1F5]!

                                            sm:text-[17px]
                                        "
                                        title={displayName}
                                    >
                                        {displayName}
                                    </h2>

                                    <div
                                        className="
                                            mt-2.5
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <Building2
                                            size={12}
                                            strokeWidth={1.7}
                                            className="
                                                shrink-0
                                                text-[#697586]
                                            "
                                        />

                                        <span
                                            className={`
                                                truncate

                                                font-sans!
                                                text-[10.5px]
                                                font-medium!

                                                ${
                                                    formPreview.organization_type
                                                        ? 'text-[#AEB7C3]!'
                                                        : 'text-[#5E6978]!'
                                                }
                                            `}
                                        >
                                            {organizationType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DETAILS */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5

                                px-5
                                py-6

                                sm:grid-cols-2
                                sm:px-6

                                md:grid-cols-3

                                lg:grid-cols-1
                                lg:px-5
                                lg:py-7

                                xl:px-6
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
                                muted={!formPreview.registration_number?.trim()}
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

                        {/* STATUS */}

                        <div
                            className="
                                border-t
                                border-[#252D38]

                                bg-[#121821]

                                px-5
                                py-5

                                sm:px-6

                                lg:px-5

                                xl:px-6
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >
                                <ShieldCheck
                                    size={15}
                                    strokeWidth={1.7}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-[#697586]
                                    "
                                />

                                <div className="min-w-0">
                                    <p
                                        className="
                                            font-sans!
                                            text-[10.5px]
                                            font-semibold!

                                            text-[#B8C0CA]!
                                        "
                                    >
                                        New organization
                                    </p>

                                    <p
                                        className="
                                            mt-1

                                            font-sans!
                                            text-[10.5px]
                                            font-normal!
                                            leading-[1.65]

                                            text-[#697586]!
                                        "
                                    >
                                        Verification can be reviewed from the
                                        organization management area after
                                        creation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =====================================================
                        RIGHT — FORM
                    ====================================================== */}

                    <main
                        className="
                            min-w-0

                            border
                            border-[#252D38]

                            bg-[#0E1219]
                        "
                    >
                        {/* FORM HEADER */}

                        <div
                            className="
                                border-b
                                border-[#252D38]

                                px-5
                                py-6

                                sm:px-7
                                sm:py-7

                                lg:px-9
                                lg:py-8

                                xl:px-11
                            "
                        >
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
                                    <Building2 size={16} strokeWidth={1.7} />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="
                                            font-sans!
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#697586]!
                                        "
                                    >
                                        Profile setup
                                    </p>

                                    <h2
                                        className="
                                            mt-1.5

                                            font-sans!
                                            text-[16px]
                                            font-semibold!
                                            leading-6
                                            tracking-[-0.015em]

                                            text-[#EEF1F5]!

                                            sm:text-[17px]
                                        "
                                    >
                                        Organization information
                                    </h2>

                                    <p
                                        className="
                                            mt-1.5
                                            max-w-2xl

                                            font-sans!
                                            text-[11px]
                                            font-normal!
                                            leading-[1.7]

                                            text-[#697586]!
                                        "
                                    >
                                        Enter the organization&apos;s identity,
                                        registration and contact information.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}

                        <div
                            className="
                                min-w-0

                                px-5
                                py-7

                                sm:px-7
                                sm:py-8

                                lg:px-9
                                lg:py-9

                                xl:px-11
                                xl:py-10
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
