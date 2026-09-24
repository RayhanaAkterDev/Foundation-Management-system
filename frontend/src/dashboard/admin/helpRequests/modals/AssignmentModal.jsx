import React, { useMemo, useState } from 'react';

import {
    X,
    Building2,
    ClipboardCheck,
    Check,
    ChevronDown,
    ShieldCheck,
    MapPin,
    AlertCircle,
} from 'lucide-react';

const AssignmentModal = ({
    request,
    organizations = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const existingOrganizationId = useMemo(() => {
        return (
            request?.assignment?.organization_id ??
            request?.organization_id ??
            ''
        );
    }, [request]);

    const availableOrganizations = useMemo(() => {
        const requestAssignments = Array.isArray(request?.assignments)
            ? request.assignments
            : request?.assignment
              ? [request.assignment]
              : [];

        const rejectedOrganizationIds = new Set(
            requestAssignments
                .filter(
                    (assignment) =>
                        String(assignment?.status || '')
                            .trim()
                            .toLowerCase() === 'rejected' &&
                        assignment?.organization_id,
                )
                .map((assignment) => String(assignment.organization_id)),
        );

        return organizations.filter((organization) => {
            const organizationId = String(
                organization?.id ?? organization?.organization_id ?? '',
            );

            if (
                organizationId &&
                rejectedOrganizationIds.has(organizationId)
            ) {
                return false;
            }

            const verificationStatus =
                organization.verification_status ??
                organization.verificationStatus ??
                organization.status;

            if (!verificationStatus) {
                return true;
            }

            return String(verificationStatus).toLowerCase() === 'verified';
        });
    }, [organizations, request]);

    const initialOrganization = String(existingOrganizationId || '');

    return (
        <AssignmentForm
            key={request?.id ?? 'new-request'}
            request={request}
            availableOrganizations={availableOrganizations}
            initialOrganization={initialOrganization}
            loading={loading}
            error={error}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
};

const AssignmentForm = ({
    request,
    availableOrganizations,
    initialOrganization,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    const [selectedOrganization, setSelectedOrganization] =
        useState(initialOrganization);

    // Kept so the existing submission payload remains unchanged.
    const [assignmentNote] = useState('');

    if (!request) {
        return null;
    }

    const hasAssignmentTarget = Boolean(selectedOrganization);

    const selectedOrganizationData = availableOrganizations.find(
        (organization) =>
            String(
                organization?.id ?? organization?.organization_id ?? '',
            ) === String(selectedOrganization),
    );

    const selectedOrganizationName = selectedOrganizationData
        ? selectedOrganizationData.name ||
          selectedOrganizationData.organization_name ||
          `Organization #${selectedOrganizationData.id}`
        : '';

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedOrganization) {
            return;
        }

        onConfirm({
            organization_id: Number(selectedOrganization),
            assignment_note: assignmentNote.trim() || null,
        });
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose();
    };

    const requestCategory =
        request.category?.replace(/[_-]/g, ' ') || 'General assistance';

    const requestUrgency =
        request.priority || request.urgency || 'Normal';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[3px] sm:p-6">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close assignment modal"
                onClick={!loading ? handleClose : undefined}
                className="absolute inset-0 cursor-default"
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-225 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
                {/* =====================================================
                    LEFT — REQUEST SUMMARY
                ====================================================== */}
                <aside className="hidden w-72 shrink-0 flex-col bg-primary text-white lg:flex">
                    {/* Brand / modal context */}
                    <div className="border-b border-white/10 px-7 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                                <ClipboardCheck
                                    size={19}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <p className="text-[14px] font-semibold tracking-tight">
                                    Assistance assignment
                                </p>

                                <p className="mt-0.5 text-[11px] text-white/50">
                                    Coordination workflow
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Request information */}
                    <div className="flex flex-1 flex-col px-7 py-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                Help request
                            </p>

                            <h2 className="mt-3 line-clamp-4 text-[23px] font-semibold leading-[1.25] tracking-tight text-white">
                                {request.title || 'Help request'}
                            </h2>
                        </div>

                        <div className="mt-9">
                            <div className="border-t border-white/10">
                                <InfoRow
                                    label="Category"
                                    value={requestCategory}
                                />

                                <InfoRow
                                    label="Urgency"
                                    value={requestUrgency}
                                    indicator
                                />

                                {request.district && (
                                    <InfoRow
                                        label="Location"
                                        value={request.district}
                                        icon
                                    />
                                )}
                            </div>
                        </div>

                        {/* Bottom trust message */}
                        <div className="mt-auto pt-8">
                            <div className="border-t border-white/10 pt-6">
                                <div className="flex gap-3">
                                    <ShieldCheck
                                        size={17}
                                        strokeWidth={1.7}
                                        className="mt-0.5 shrink-0 text-white/55"
                                    />

                                    <p className="text-[11px] leading-[1.65] text-white/50">
                                        Assignment requests are sent only to
                                        verified organizations eligible to
                                        coordinate this request.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* =====================================================
                    RIGHT — MAIN WORKSPACE
                ====================================================== */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Header */}
                    <header className="relative shrink-0 border-b border-slate-200 px-6 py-6 sm:px-8">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:right-6"
                            aria-label="Close"
                        >
                            <X size={18} strokeWidth={1.8} />
                        </button>

                        <div className="pr-12">
                            <div className="mb-2 flex items-center gap-2 lg:hidden">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ClipboardCheck
                                        size={15}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                                    Assignment
                                </span>
                            </div>

                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Choose an organization
                            </h1>

                            <p className="mt-1.5 max-w-xl text-[13px] leading-5 text-slate-500">
                                Select a verified organization to coordinate
                                support for this request.
                            </p>
                        </div>
                    </header>

                    <form
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        {/* =================================================
                            BODY
                        ================================================== */}
                        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8 sm:py-8">
                            {/* Error */}
                            {error && (
                                <div className="mb-7 flex gap-3 border border-red-200 bg-red-50 px-4 py-3.5">
                                    <AlertCircle
                                        size={17}
                                        strokeWidth={1.8}
                                        className="mt-0.5 shrink-0 text-red-600"
                                    />

                                    <div>
                                        <p className="text-[13px] font-semibold text-red-700">
                                            Assignment failed
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-600">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Organization section */}
                            <section>
                                <div className="mb-5 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                            Organization
                                        </p>

                                        <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight text-slate-900">
                                            Assign coordination
                                        </h3>
                                    </div>

                                    <span className="shrink-0 text-xs text-slate-400">
                                        {availableOrganizations.length}{' '}
                                        available
                                    </span>
                                </div>

                                {/* Selection field */}
                                <div
                                    className={`group border transition-all ${
                                        hasAssignmentTarget
                                            ? 'border-primary/40 bg-primary/[0.025]'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 px-5 py-5">
                                        {/* Icon */}
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                                hasAssignmentTarget
                                                    ? 'bg-primary text-white'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {hasAssignmentTarget ? (
                                                <Check
                                                    size={19}
                                                    strokeWidth={2.1}
                                                />
                                            ) : (
                                                <Building2
                                                    size={20}
                                                    strokeWidth={1.7}
                                                />
                                            )}
                                        </div>

                                        {/* Select */}
                                        <div className="min-w-0 flex-1">
                                            <label
                                                htmlFor="help-request-organization"
                                                className="mb-1.5 block text-[11px] font-medium text-slate-400"
                                            >
                                                Organization
                                            </label>

                                            <div className="relative">
                                                <select
                                                    id="help-request-organization"
                                                    value={
                                                        selectedOrganization
                                                    }
                                                    onChange={(event) =>
                                                        setSelectedOrganization(
                                                            event.target.value,
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className="w-full appearance-none bg-transparent pr-8 text-[14px] font-semibold text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <option value="">
                                                        Select an organization
                                                    </option>

                                                    {availableOrganizations.map(
                                                        (organization) => {
                                                            const organizationId =
                                                                organization?.id ??
                                                                organization?.organization_id;

                                                            return (
                                                                <option
                                                                    key={
                                                                        organizationId
                                                                    }
                                                                    value={
                                                                        organizationId
                                                                    }
                                                                >
                                                                    {organization.name ||
                                                                        organization.organization_name ||
                                                                        `Organization #${organizationId}`}
                                                                </option>
                                                            );
                                                        },
                                                    )}
                                                </select>

                                                <ChevronDown
                                                    size={17}
                                                    strokeWidth={1.8}
                                                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected state */}
                                    {hasAssignmentTarget && (
                                        <div className="flex items-center justify-between border-t border-primary/10 px-5 py-3.5">
                                            <div className="min-w-0">
                                                <p className="truncate text-[12px] font-medium text-slate-500">
                                                    Selected
                                                </p>

                                                <p className="mt-0.5 truncate text-[13px] font-semibold text-slate-900">
                                                    {selectedOrganizationName}
                                                </p>
                                            </div>

                                            <div className="ml-4 flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-primary">
                                                <Check
                                                    size={14}
                                                    strokeWidth={2.2}
                                                />
                                                Verified
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Empty state */}
                                {!availableOrganizations.length && (
                                    <div className="mt-3 border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-200">
                                                <Building2
                                                    size={17}
                                                    strokeWidth={1.7}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[13px] font-semibold text-slate-800">
                                                    No organizations available
                                                </p>

                                                <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                                                    There are currently no
                                                    verified organizations
                                                    eligible for this request.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Small workflow hint */}
                            {availableOrganizations.length > 0 &&
                                !hasAssignmentTarget && (
                                    <div className="mt-7 flex items-start gap-3 border-t border-slate-100 pt-5">
                                        <ShieldCheck
                                            size={16}
                                            strokeWidth={1.7}
                                            className="mt-0.5 shrink-0 text-slate-400"
                                        />

                                        <p className="text-xs leading-5 text-slate-500">
                                            Choose an organization above to
                                            send an assignment request. The
                                            organization can then respond to
                                            the request.
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================== */}
                        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
                            <div className="hidden text-xs text-slate-400 sm:block">
                                {hasAssignmentTarget
                                    ? 'Ready to send assignment request'
                                    : 'Select an organization to continue'}
                            </div>

                            <div className="ml-auto flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="h-10 rounded-lg px-4 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading || !hasAssignmentTarget
                                    }
                                    className="inline-flex h-10 min-w-42.5 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    )}

                                    {loading
                                        ? 'Sending...'
                                        : 'Send assignment request'}
                                </button>
                            </div>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, indicator = false, icon = false }) => {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
            <span className="text-[11px] font-medium text-white/40">
                {label}
            </span>

            <span className="flex min-w-0 items-center gap-2 text-right text-[12px] font-semibold capitalize text-white/90">
                {icon && (
                    <MapPin
                        size={12}
                        strokeWidth={1.8}
                        className="shrink-0 text-white/40"
                    />
                )}

                {indicator && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                )}

                <span className="truncate">{value}</span>
            </span>
        </div>
    );
};

export default AssignmentModal;