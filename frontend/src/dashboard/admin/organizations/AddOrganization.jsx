
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    Building2,
    Check,
    ShieldCheck,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import OrganizationForm from './components/OrganizationForm';
import { createOrganization } from './api/organizationApi';
import { formatType } from './utils/organizationDetailsUtils';

/* ==========================================================================
   CONSTANTS
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

const DetailRow = ({ label, value, muted = false }) => (
    <div className="group flex min-w-0 items-start gap-4">
        <div className="min-w-0 pt-0.5">
            <p
                className="
                    font-sans!
                    text-[10px]
                    font-semibold!
                    uppercase
                    tracking-[0.14em]
                    text-[#697586]
                "
            >
                {label}
            </p>

            <p
                title={value}
                className={`
                    mt-1.5 truncate
                    font-sans!
                    text-[12px]
                    font-medium!
                    ${
                        muted
                            ? 'text-[#5E6978]!'
                            : 'text-[#B8C0CA]!'
                    }
                `}
            >
                {value}
            </p>
        </div>
    </div>
);

/* ==========================================================================
   ADD ORGANIZATION
============================================================================ */

const AddOrganization = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [success, setSuccess] = useState({
        open: false,
        name: '',
    });

    const [formResetKey, setFormResetKey] = useState(0);

    const [formPreview, setFormPreview] = useState({
        ...EMPTY_PREVIEW,
    });

    /* ======================================================================
       BACK
    ====================================================================== */

    const handleBack = () => {
        if (loading) return;

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
        setSuccess({ open: false, name: '' });

        try {
            await createOrganization(formData);

            setSuccess({
                open: true,
                name: formData.name?.trim() || 'Organization',
            });

            setFormPreview({ ...EMPTY_PREVIEW });

            setFormResetKey((previous) => previous + 1);
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setFieldErrors(err.errors);
            }

            setError(
                err.message || 'Unable to create organization.',
            );
        } finally {
            setLoading(false);
        }
    };

    /* ======================================================================
       PREVIEW DATA
    ====================================================================== */

    const name = formPreview.name?.trim();

    const displayName = name || 'New organization';

    const initial = name
        ? name.charAt(0).toUpperCase()
        : null;

    const hasType = Boolean(formPreview.organization_type);

    const type = hasType
        ? formatType(formPreview.organization_type)
        : 'No organization type selected';

    /* ======================================================================
       UI
    ====================================================================== */

    return (
        <div className="space-y-5 font-sans! lg:space-y-6">
            {/* PAGE HEADER */}

            <PageHeader
                title="Add Organization"
                subtitle="Create and configure a new organization profile for the Stand For People platform."
                action={
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="
                            group inline-flex h-10
                            items-center justify-center gap-2

                            border border-[#343e4b]
                            bg-transparent px-3.5

                            font-sans!
                            text-[12px]
                            font-medium!
                            whitespace-nowrap
                            text-[#b8c2cf]

                            transition-colors duration-150

                            hover:border-[#4b596a]
                            hover:bg-[#1c232d]
                            hover:text-[#f1f5f9]

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#8792A1]
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-[#171c24]

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <ArrowLeft
                            size={15}
                            strokeWidth={1.8}
                            className="
                                shrink-0 text-[#8492a3]
                                transition-colors duration-150
                                group-hover:text-[#e2e8f0]
                            "
                        />

                        <span>Back to organizations</span>
                    </button>
                }
            />

            {/* SUCCESS DIALOG */}

            <SuccessDialog
                open={success.open}
                action="created"
                entity="organization"
                name={success.name}
                onClose={() =>
                    setSuccess({ open: false, name: '' })
                }
            />

            {/* WORKSPACE */}

            <section
                className="
                    @container
                    min-w-0 overflow-hidden
                    border border-[#303A47]
                    bg-[#0E1219]
                "
            >
                <div
                    className="
                        grid min-w-0
                        @6xl:grid-cols-[290px_minmax(0,1fr)]
                        @7xl:grid-cols-[310px_minmax(0,1fr)]
                    "
                >
                    {/* COMPACT PREVIEW HEADER */}

                    <div
                        className="
                            min-w-0
                            border-b border-[#252D38]
                            bg-[#141B24]
                            px-4 py-4
                            sm:px-6
                            @6xl:hidden
                        "
                    >
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div
                                className="
                                    flex h-11 w-11 shrink-0
                                    items-center justify-center
                                    overflow-hidden

                                    border border-[#303A47]
                                    bg-[#1A222D]

                                    text-[15px]
                                    font-semibold
                                    text-[#DCE2EA]
                                "
                            >
                                {initial || (
                                    <Building2
                                        size={19}
                                        strokeWidth={1.6}
                                    />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    title={displayName}
                                    className="
                                        truncate
                                        text-[14px]
                                        font-semibold
                                        text-[#DCE2EA]
                                    "
                                >
                                    {displayName}
                                </p>

                                <div
                                    className="
                                        mt-1 flex min-w-0
                                        items-center gap-1.5

                                        text-[11px]
                                        text-[#8792A1]
                                    "
                                >
                                    <Building2
                                        size={12}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                    />

                                    <span className="truncate">
                                        {type}
                                    </span>
                                </div>
                            </div>

                            <span
                                title={formPreview.email || ''}
                                className="
                                    hidden max-w-[35%]
                                    truncate text-right

                                    text-[11px]
                                    text-[#8792A1]

                                    sm:block
                                "
                            >
                                {formPreview.email || 'No email'}
                            </span>
                        </div>
                    </div>

                    {/* LIVE PREVIEW SIDEBAR */}

                    <aside
                        className="
                            hidden
                            border-[#252D38]
                            bg-[#141B24]

                            @6xl:block
                            @6xl:border-r
                        "
                    >
                        <div
                            className="
                                flex h-full min-h-[520px]
                                flex-col

                                px-6 py-7
                                xl:px-7 xl:py-8
                            "
                        >
                            {/* PREVIEW LABEL */}

                            <div className="flex items-center gap-3">
                                <span
                                    aria-hidden="true"
                                    className="
                                        h-[2px] w-4 shrink-0
                                        bg-[#697586]
                                    "
                                />

                                <p
                                    className="
                                        truncate
                                        font-sans!
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#8792A1]
                                    "
                                >
                                    Organization preview
                                </p>
                            </div>

                            {/* ORGANIZATION IDENTITY */}

                            <div className="mt-10">
                                <div
                                    className={`
                                        relative flex
                                        h-[68px] w-[68px]
                                        items-center justify-center

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
                                                absolute -bottom-1 -right-1
                                                flex h-5 w-5
                                                items-center justify-center

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
                                    title={displayName}
                                    className={`
                                        mt-6 truncate

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
                                >
                                    {displayName}
                                </h2>

                                <div
                                    className="
                                        mt-3.5 flex min-w-0
                                        items-center gap-2.5
                                    "
                                >
                                    <Building2
                                        size={14}
                                        strokeWidth={1.7}
                                        className={
                                            hasType
                                                ? 'shrink-0 text-[#A6AFBB]'
                                                : 'shrink-0 text-[#5E6978]'
                                        }
                                    />

                                    <span
                                        className={`
                                            truncate
                                            font-sans!
                                            text-[12px]
                                            font-medium!

                                            ${
                                                hasType
                                                    ? 'text-[#AEB7C3]'
                                                    : 'text-[#5E6978]'
                                            }
                                        `}
                                    >
                                        {type}
                                    </span>
                                </div>
                            </div>

                            {/* CONTACT DETAILS */}

                            <div className="mt-6 space-y-6 py-8">
                                <DetailRow
                                    label="Email"
                                    value={
                                        formPreview.email ||
                                        'Not entered yet'
                                    }
                                    muted={!formPreview.email}
                                />

                                <DetailRow
                                    label="Phone"
                                    value={
                                        formPreview.phone ||
                                        'Not entered yet'
                                    }
                                    muted={!formPreview.phone}
                                />

                                <DetailRow
                                    label="Website"
                                    value={
                                        formPreview.website ||
                                        'Not entered yet'
                                    }
                                    muted={!formPreview.website}
                                />

                                <DetailRow
                                    label="Address"
                                    value={
                                        formPreview.address ||
                                        'Not entered yet'
                                    }
                                    muted={!formPreview.address}
                                />
                            </div>

                            {/* PREVIEW FOOTER */}

                            <div
                                className="
                                    mt-auto
                                    border-t border-[#252D38]
                                "
                            >
                                <div className="pt-7">
                                    <div className="flex items-start gap-3.5">
                                        <ShieldCheck
                                            size={15}
                                            strokeWidth={1.6}
                                            className="
                                                mt-0.5 shrink-0
                                                text-[#697586]
                                            "
                                        />

                                        <p
                                            className="
                                                max-w-[225px]
                                                font-sans!
                                                text-[11px]
                                                font-medium!
                                                leading-[1.75]
                                                text-[#697586]
                                            "
                                        >
                                            Confirm the details before creating.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ORGANIZATION FORM */}

                    <main
                        className="
                            min-w-0
                            bg-[#0E1219]
                        "
                    >
                        <div
                            className="
                                min-w-0
                                px-4 py-7
                                sm:px-8 sm:py-9
                                lg:px-9 lg:py-10
                                xl:px-10
                            "
                        >
                            <div className="mx-auto w-full">
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
