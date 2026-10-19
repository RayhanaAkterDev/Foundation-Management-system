import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, CircleAlert, Pencil, RefreshCw, X } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import EditOrganizationView from './components/EditOrganizationView';
import OrganizationDetailsView from './components/OrganizationDetailsView';

import { fetchOrganization, updateOrganization } from './api/organizationApi';

/* ==========================================================================
   SHARED BUTTON STYLES
============================================================================ */

const BACK_BUTTON_CLASS = `
    group inline-flex h-10 w-full
    items-center justify-center gap-2.5

    border border-[#29323E]
    bg-[#0E1219] px-3.5

    font-sans! text-[12px]
    font-medium! whitespace-nowrap
    text-[#AEB7C3]!

    transition-[background-color,border-color,color]
    duration-150 ease-out

    hover:border-[#394555]
    hover:bg-[#1A222D]
    hover:text-[#EEF1F5]!

    focus:outline-none focus:ring-0

    sm:w-auto
`;

const EDIT_BUTTON_CLASS = `
    group inline-flex h-10 w-full
    items-center justify-center gap-2.5

    border border-[#394555]
    bg-[#1A222D] px-4

    font-sans! text-[12px]
    font-semibold! whitespace-nowrap
    text-[#EEF1F5]!

    transition-[background-color,border-color,color]
    duration-150 ease-out

    hover:border-[#4B5869]
    hover:bg-[#1D2632]

    focus:outline-none focus:ring-0

    sm:w-auto
`;

/* ==========================================================================
   BACK BUTTON
============================================================================ */

const BackButton = ({ onClick, label = 'Back to organizations' }) => (
    <button type="button" onClick={onClick} className={BACK_BUTTON_CLASS}>
        <ArrowLeft
            size={14}
            strokeWidth={1.8}
            className="
                shrink-0 text-[#697586]
                transition-[transform,color]
                duration-150

                group-hover:-translate-x-0.5
                group-hover:text-[#AEB7C3]
            "
        />

        <span>{label}</span>
    </button>
);

/* ==========================================================================
   ERROR MESSAGE
============================================================================ */

const OrganizationError = ({ title, message, onRetry }) => (
    <div
        className="
            flex flex-col gap-4

            border border-[#493038]
            bg-[#281A1F]

            px-5 py-4

            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:gap-5
            sm:px-6 sm:py-5
        "
    >
        <div className="flex min-w-0 items-start gap-3.5">
            <div
                className="
                    flex h-8 w-8 shrink-0
                    items-center justify-center

                    border border-[#493038]
                    bg-[#301F25]
                    text-[#D99A9F]
                "
            >
                <CircleAlert size={15} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 pt-0.5">
                <p
                    className="
                        font-sans! text-[11.5px]
                        font-semibold! text-[#E4B0B4]!
                    "
                >
                    {title}
                </p>

                <p
                    className="
                        mt-1 max-w-xl

                        font-sans! text-[11px]
                        font-normal! leading-5
                        text-[#B98289]!
                    "
                >
                    {message}
                </p>
            </div>
        </div>

        {onRetry && (
            <button
                type="button"
                onClick={onRetry}
                className="
                    group inline-flex h-9 w-full
                    shrink-0 items-center
                    justify-center gap-2

                    border border-[#493038]
                    bg-[#301F25] px-3.5

                    font-sans! text-[11px]
                    font-medium! whitespace-nowrap
                    text-[#D99A9F]!

                    transition-[background-color,border-color]
                    duration-150

                    hover:border-[#6B434C]
                    hover:bg-[#38242B]

                    focus:outline-none focus:ring-0

                    sm:w-auto
                "
            >
                <RefreshCw
                    size={13}
                    strokeWidth={1.8}
                    className="
                        transition-transform duration-300
                        group-hover:rotate-45
                    "
                />
                Retry
            </button>
        )}
    </div>
);

/* ==========================================================================
   LOADING VIEW
============================================================================ */

const OrganizationLoading = ({ isEditing }) => (
    <div
        className="
            flex min-h-130
            items-center justify-center

            border border-[#252D38]
            bg-[#0E1219]

            px-6 py-12
        "
    >
        <div className="text-center">
            <div
                className="
                    mx-auto h-8 w-8
                    animate-spin rounded-full

                    border-2 border-[#29323E]
                    border-t-[#8792A1]
                "
            />

            <p
                className="
                    mt-5 font-sans!
                    text-[12px] font-semibold!
                    text-[#EEF1F5]!
                "
            >
                {isEditing
                    ? 'Loading organization editor'
                    : 'Loading organization details'}
            </p>

            <p
                className="
                    mt-1.5 font-sans!
                    text-[12px] font-medium!
                    leading-5 text-[#697586]!
                "
            >
                {isEditing
                    ? 'Preparing organization information for editing.'
                    : 'Retrieving organization information.'}
            </p>
        </div>
    </div>
);

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

    const [editMode, setEditMode] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    /*
     * IMPORTANT:
     *
     * Read the edit intent directly from router state.
     * This is available on the very first render,
     * before the organization API request finishes.
     *
     * editMode handles editing initiated from the
     * organization details page itself.
     */

    const routeWantsEdit = location.state?.edit === true;

    const isEditing = routeWantsEdit || editMode;

    const pageTitle = isEditing ? 'Edit Organization' : 'Organization Details';

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

                if (cancelled) return;

                setOrganization(data?.organization || data || null);

                setError('');
            } catch (err) {
                if (cancelled) return;

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
       NAVIGATION
    ====================================================================== */

    const handleBack = () => {
        if (saving) return;

        navigate('/admin/dashboard/organizations');
    };

    /*
     * Remove the edit intent from router state when
     * switching back to the details view.
     *
     * Otherwise routeWantsEdit would remain true and
     * cancelling could not close the editor.
     */

    const clearRouteEditIntent = () => {
        if (routeWantsEdit) {
            navigate(`${location.pathname}${location.search}`, {
                replace: true,
                state: {
                    ...location.state,
                    edit: false,
                },
            });
        }
    };

    /* ======================================================================
       START EDITING
    ====================================================================== */

    const handleStartEdit = () => {
        if (!organization || saving) return;

        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');

        setEditMode(true);
    };

    /* ======================================================================
       CANCEL EDITING
    ====================================================================== */

    const handleCancelEdit = () => {
        if (saving) return;

        setSaveError('');
        setFieldErrors({});

        setEditMode(false);
        clearRouteEditIntent();
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
             * Some update endpoints return only a success
             * message or a partial organization object.
             * Fetch the complete record when necessary.
             */

            if (!updatedOrganization?.id) {
                const refreshedData = await fetchOrganization(organization.id);

                updatedOrganization =
                    refreshedData?.organization || refreshedData || null;
            }

            if (updatedOrganization) {
                setOrganization(updatedOrganization);
            }

            setEditMode(false);
            clearRouteEditIntent();

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
            <div className="space-y-6 font-sans! sm:space-y-8">
                <PageHeader
                    title={pageTitle}
                    subtitle="The requested organization could not be loaded."
                    action={<BackButton onClick={handleBack} />}
                />

                <OrganizationError
                    title="Organization unavailable"
                    message="Organization ID is missing."
                />
            </div>
        );
    }

    /* ======================================================================
       LOADING

       FIX:
       Uses pageTitle instead of a hardcoded
       "Organization Details" heading.
    ====================================================================== */

    if (loading) {
        return (
            <div className="space-y-6 font-sans! sm:space-y-8">
                <PageHeader
                    title={pageTitle}
                    subtitle={
                        isEditing
                            ? 'Preparing organization information for editing.'
                            : 'Loading organization information...'
                    }
                />

                <OrganizationLoading isEditing={isEditing} />
            </div>
        );
    }

    /* ======================================================================
       LOAD ERROR
    ====================================================================== */

    if (error || !organization) {
        return (
            <div className="space-y-6 font-sans! sm:space-y-8">
                <PageHeader
                    title={pageTitle}
                    subtitle="The requested organization could not be loaded."
                    action={<BackButton onClick={handleBack} />}
                />

                <OrganizationError
                    title="Unable to load organization"
                    message={
                        error ||
                        'The requested organization could not be found.'
                    }
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    /* ======================================================================
       EDIT VIEW
    ====================================================================== */

    if (isEditing) {
        return (
            <div className="space-y-6 font-sans! sm:space-y-8">
                <PageHeader
                    title="Edit Organization"
                    subtitle={`Update profile information and organization details for ${
                        organization.name || 'this organization'
                    }.`}
                    action={
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className={`
                                ${BACK_BUTTON_CLASS}

                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            `}
                        >
                            <X
                                size={14}
                                strokeWidth={1.8}
                                className="
                                    shrink-0 text-[#697586]

                                    transition-colors duration-150
                                    group-hover:text-[#AEB7C3]
                                "
                            />

                            <span>Cancel editing</span>
                        </button>
                    }
                />

                <EditOrganizationView
                    organization={organization}
                    saving={saving}
                    saveError={saveError}
                    fieldErrors={fieldErrors}
                    onSubmit={handleUpdateOrganization}
                    onCancel={handleCancelEdit}
                />
            </div>
        );
    }

    /* ======================================================================
       DETAILS VIEW
    ====================================================================== */

    return (
        <div className="space-y-6 font-sans! sm:space-y-8">
            {/* SUCCESS DIALOG */}

            <SuccessDialog
                open={Boolean(successMessage)}
                entity="organization"
                action="updated"
                name={organization?.name}
                onClose={() => setSuccessMessage('')}
            />

            {/* PAGE HEADER */}

            <PageHeader
                title="Organization Details"
                subtitle="Review organization identity, profile information and platform access."
                action={
                    <div
                        className="
                            grid w-full grid-cols-2 gap-2.5

                            sm:flex sm:w-auto
                            sm:items-center
                            sm:justify-end
                            sm:gap-3
                        "
                    >
                        <BackButton onClick={handleBack} label="Back" />

                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className={EDIT_BUTTON_CLASS}
                        >
                            <Pencil
                                size={14}
                                strokeWidth={1.8}
                                className="
                                    shrink-0 text-[#AEB7C3]

                                    transition-colors duration-150
                                    group-hover:text-[#EEF1F5]
                                "
                            />

                            <span>Edit Organization</span>
                        </button>
                    </div>
                }
            />

            {/* ORGANIZATION DETAILS */}

            <OrganizationDetailsView organization={organization} />
        </div>
    );
};

export default OrganizationDetails;
