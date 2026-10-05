// src/dashboard/admin/organizations/OrganizationDetails.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, CircleAlert, Pencil, RefreshCw, X } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import EditOrganizationView from './components/EditOrganizationView';
import OrganizationDetailsView from './components/OrganizationDetailsView';
import SuccessToast from './components/SuccessToast';

import { fetchOrganization, updateOrganization } from './api/organizationApi';

/* ==========================================================================
   ORGANIZATION DETAILS
============================================================================ */

const OrganizationDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { organizationId } = useParams();

    /* ======================================================================
       DATA STATE
    ====================================================================== */

    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /* ======================================================================
       EDIT STATE
    ====================================================================== */

    const [isEditing, setIsEditing] = useState(
        () => location.state?.edit === true,
    );

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    /* ======================================================================
       LOAD ORGANIZATION
    ====================================================================== */

    useEffect(() => {
        if (!organizationId) {
            return undefined;
        }

        let cancelled = false;

        const loadOrganization = async () => {
            try {
                const data = await fetchOrganization(organizationId);

                if (cancelled) {
                    return;
                }

                setOrganization(data?.organization || data || null);

                setError('');
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setOrganization(null);

                setError(err.message || 'Unable to load organization.');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadOrganization();

        return () => {
            cancelled = true;
        };
    }, [organizationId]);

    /* ======================================================================
       SUCCESS TOAST TIMER
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
        if (saving) {
            return;
        }

        navigate('/admin/dashboard/organizations');
    };

    /* ======================================================================
       START EDITING
    ====================================================================== */

    const handleStartEdit = () => {
        if (!organization || saving) {
            return;
        }

        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');
        setIsEditing(true);
    };

    /* ======================================================================
       CANCEL EDITING
    ====================================================================== */

    const handleCancelEdit = () => {
        if (saving) {
            return;
        }

        setSaveError('');
        setFieldErrors({});
        setIsEditing(false);
    };

    /* ======================================================================
       UPDATE ORGANIZATION
    ====================================================================== */

    const handleUpdateOrganization = async (formData) => {
        if (!organization?.id || saving) {
            return;
        }

        setSaving(true);
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');

        try {
            const data = await updateOrganization(organization.id, formData);

            let updatedOrganization = data?.organization || null;

            /*
             * If the update endpoint does not return the full
             * organization object, fetch the latest record again.
             */
            if (!updatedOrganization?.id) {
                const refreshedData = await fetchOrganization(organization.id);

                updatedOrganization =
                    refreshedData?.organization || refreshedData || null;
            }

            if (updatedOrganization) {
                setOrganization(updatedOrganization);
            }

            setIsEditing(false);

            setSuccessMessage(
                `${
                    updatedOrganization?.name ||
                    formData.name ||
                    organization.name ||
                    'Organization'
                } was updated successfully.`,
            );
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setFieldErrors(err.errors);
            }

            setSaveError(err.message || 'Unable to update organization.');
        } finally {
            setSaving(false);
        }
    };

    /* ======================================================================
       RETRY
    ====================================================================== */

    const handleRetry = () => {
        window.location.reload();
    };

    /* ======================================================================
       MISSING ORGANIZATION ID
    ====================================================================== */

    if (!organizationId) {
        return (
            <div
                className="
                    flex
                    min-h-105
                    items-center
                    justify-center

                    bg-[#0A0E14]

                    px-5

                    font-sans!
                "
            >
                <div className="text-center">
                    <div
                        className="
                            mx-auto
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            border
                            border-[#493038]

                            bg-[#281A1F]

                            text-[#D99A9F]
                        "
                    >
                        <CircleAlert size={18} strokeWidth={1.8} />
                    </div>

                    <h2
                        className="
                            mt-4

                            font-sans!
                            text-[14px]
                            font-semibold!

                            text-[#EEF1F5]!
                        "
                    >
                        Organization unavailable
                    </h2>

                    <p
                        className="
                            mt-2

                            font-sans!
                            text-[11px]
                            font-normal!

                            text-[#8792A1]!
                        "
                    >
                        Organization ID is missing.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="
                            mt-5

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

                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <ArrowLeft size={14} strokeWidth={1.8} />
                        Back to organizations
                    </button>
                </div>
            </div>
        );
    }

    /* ======================================================================
       LOADING
    ====================================================================== */

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-105
                    items-center
                    justify-center

                    bg-[#0A0E14]

                    px-5

                    font-sans!
                "
            >
                <div className="text-center">
                    <div
                        className="
                            mx-auto
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            border
                            border-[#303A47]

                            bg-[#0E1219]

                            text-[#8792A1]
                        "
                    >
                        <RefreshCw
                            size={17}
                            strokeWidth={1.7}
                            className="animate-spin"
                        />
                    </div>

                    <p
                        className="
                            mt-4

                            font-sans!
                            text-[11px]
                            font-medium!

                            text-[#8792A1]!
                        "
                    >
                        Loading organization...
                    </p>
                </div>
            </div>
        );
    }

    /* ======================================================================
       LOAD ERROR
    ====================================================================== */

    if (error || !organization) {
        return (
            <div
                className="
                    min-h-full
                    min-w-0

                    bg-[#0A0E14]

                    font-sans!
                "
            >
                <PageHeader
                    eyebrow="Organization management"
                    title="Organization details"
                    description="Review organization profile information."
                    actions={
                        <button
                            type="button"
                            onClick={handleBack}
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

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <ArrowLeft size={14} strokeWidth={1.8} />

                            <span>Back to organizations</span>
                        </button>
                    }
                />

                <section
                    className="
                        px-4
                        pb-10
                        pt-6

                        sm:px-5

                        md:px-6

                        lg:px-7

                        xl:px-8

                        2xl:px-10
                    "
                >
                    <div
                        className="
                            mx-auto
                            max-w-375

                            border
                            border-[#493038]

                            bg-[#181216]

                            px-5
                            py-7

                            sm:px-7
                            sm:py-8
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-5

                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center

                                        border
                                        border-[#5B3840]

                                        bg-[#281A1F]

                                        text-[#D99A9F]
                                    "
                                >
                                    <CircleAlert size={17} strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        className="
                                            font-sans!
                                            text-[14px]
                                            font-semibold!

                                            text-[#EEF1F5]!
                                        "
                                    >
                                        Unable to load organization
                                    </h2>

                                    <p
                                        className="
                                            mt-1.5
                                            max-w-xl

                                            font-sans!
                                            text-[11px]
                                            font-normal!
                                            leading-[1.7]

                                            text-[#B77F85]!
                                        "
                                    >
                                        {error ||
                                            'The requested organization could not be found.'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleRetry}
                                className="
                                    inline-flex
                                    h-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-2

                                    border
                                    border-[#493038]

                                    bg-[#281A1F]

                                    px-3.5

                                    font-sans!
                                    text-[10.5px]
                                    font-medium!

                                    text-[#D99A9F]!

                                    transition-[background-color,border-color]
                                    duration-150

                                    hover:border-[#6B434C]
                                    hover:bg-[#302026]

                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                <RefreshCw size={13} strokeWidth={1.8} />
                                Retry
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    /* ======================================================================
       PAGE
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
                title={isEditing ? 'Edit organization' : 'Organization details'}
                description={
                    isEditing
                        ? `Update profile information for ${
                              organization.name || 'this organization'
                          }.`
                        : 'Review organization identity, contact information, purpose and operational details.'
                }
                actions={
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        {/* BACK */}

                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={saving}
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

                            <span className="hidden sm:inline">
                                Back to organizations
                            </span>

                            <span className="sm:hidden">Back</span>
                        </button>

                        {/* EDIT / CANCEL */}

                        {isEditing ? (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={saving}
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    justify-center
                                    gap-2

                                    border
                                    border-[#303A47]

                                    bg-transparent

                                    px-3.5

                                    font-sans!
                                    text-[10.5px]
                                    font-medium!

                                    text-[#AEB7C3]!

                                    transition-[background-color,border-color,color]
                                    duration-150

                                    hover:border-[#394555]
                                    hover:bg-[#151B24]
                                    hover:text-[#EEF1F5]!

                                    disabled:cursor-not-allowed
                                    disabled:opacity-40

                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                <X size={14} strokeWidth={1.8} />
                                Cancel editing
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleStartEdit}
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    justify-center
                                    gap-2

                                    border
                                    border-[#465261]

                                    bg-[#DCE1E7]

                                    px-3.5

                                    font-sans!
                                    text-[10.5px]
                                    font-semibold!

                                    text-[#0A0E14]!

                                    transition-[background-color,border-color]
                                    duration-150

                                    hover:border-[#EEF1F5]
                                    hover:bg-[#EEF1F5]

                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                <Pencil size={13} strokeWidth={1.8} />
                                Edit organization
                            </button>
                        )}
                    </div>
                }
            />

            {/* =============================================================
                CONTENT
            ============================================================== */}

            <section
                className="
                    min-w-0

                    px-4
                    pb-10
                    pt-5

                    sm:px-5
                    sm:pb-12
                    sm:pt-6

                    md:px-6

                    lg:px-7
                    lg:pb-14

                    xl:px-8

                    2xl:px-10
                "
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-375
                        min-w-0
                    "
                >
                    {isEditing ? (
                        <EditOrganizationView
                            organization={organization}
                            saving={saving}
                            saveError={saveError}
                            fieldErrors={fieldErrors}
                            onSubmit={handleUpdateOrganization}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <OrganizationDetailsView organization={organization} />
                    )}
                </div>
            </section>
        </div>
    );
};

export default OrganizationDetails;
