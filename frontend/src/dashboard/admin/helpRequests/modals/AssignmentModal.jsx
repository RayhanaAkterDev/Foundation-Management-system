import React, { useMemo, useState } from 'react';

import {
    X,
    Building2,
    ClipboardCheck,
    Check,
    ChevronDown,
    ArrowRight,
} from 'lucide-react';

const AssignmentModal = ({
    request,
    organizations = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    /*
    |--------------------------------------------------------------------------
    | Existing organization assignment
    |--------------------------------------------------------------------------
    */

    const existingOrganizationId = useMemo(() => {
        return (
            request?.assignment?.organization_id ??
            request?.organization_id ??
            ''
        );
    }, [request]);

    /*
    |--------------------------------------------------------------------------
    | Verified organizations
    |
    | Organizations are allowed to receive multiple help-request assignments.
    | We only exclude an organization that has already rejected this request.
    |--------------------------------------------------------------------------
    */

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

            if (organizationId && rejectedOrganizationIds.has(organizationId)) {
                return false;
            }

            const verificationStatus =
                organization.verification_status ??
                organization.verificationStatus ??
                organization.status;

            /*
             * If the API does not provide a verification field,
             * keep the organization visible.
             */
            if (!verificationStatus) {
                return true;
            }

            return String(verificationStatus).toLowerCase() === 'verified';
        });
    }, [organizations, request]);

    /*
    |--------------------------------------------------------------------------
    | Initial form value
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Internal form component
|--------------------------------------------------------------------------
*/

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

    const [assignmentNote, setAssignmentNote] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose();
    };

    if (!request) {
        return null;
    }

    const hasAssignmentTarget = Boolean(selectedOrganization);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-md sm:p-6">
            <div
                className="absolute inset-0"
                onClick={!loading ? handleClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-225 overflow-hidden rounded-[28px] bg-white shadow-[0_35px_120px_rgba(15,23,42,0.28)]">
                {/* =========================================================
                    LEFT CONTEXT PANEL
                ========================================================= */}

                <aside className="relative hidden w-72.5 shrink-0 overflow-hidden bg-primary text-white lg:flex lg:flex-col">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.07]" />
                    <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-black/[0.07]" />

                    <div className="relative flex h-full flex-col p-7">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                                    <ClipboardCheck
                                        size={19}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                                        Coordination
                                    </p>

                                    <p className="mt-0.5 text-xs font-semibold text-white">
                                        Assistance assignment
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
                                    Current request
                                </p>

                                <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-tight text-white">
                                    {request.title || 'Help request'}
                                </h2>

                                {request.category && (
                                    <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold capitalize text-white/85 ring-1 ring-white/10">
                                        {request.category}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto">
                            {(request.priority || request.urgency) && (
                                <div className="mb-6 border-t border-white/10 pt-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                        Priority
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-amber-300" />

                                        <span className="text-sm font-semibold capitalize text-white">
                                            {request.priority ||
                                                request.urgency}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl bg-black/12 p-4 ring-1 ring-white/8">
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                    Assignment
                                </p>

                                <div className="mt-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                                            <Building2 size={13} />
                                        </div>

                                        <span className="text-[11px] text-white/80">
                                            Organization
                                        </span>

                                        {selectedOrganization && (
                                            <Check
                                                size={13}
                                                className="ml-auto text-emerald-200"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-[10px] leading-5 text-white/45">
                                Organizations receive the assignment as a
                                coordination request. They can accept or reject
                                it after reviewing the case.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* =========================================================
                    RIGHT WORKSPACE
                ========================================================= */}

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Header */}

                    <div className="relative shrink-0 border-b border-slate-100 px-5 py-5 sm:px-7">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:right-6"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        <div className="pr-12">
                            <div className="flex items-center gap-2 text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.16em]">
                                    Assignment workspace
                                </span>
                            </div>

                            <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                                Assign assistance
                            </h1>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Send this help request to a verified
                                organization for coordination.
                            </p>
                        </div>
                    </div>

                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                            <div className="space-y-6">
                                {/* Error */}

                                {error && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                                        <p className="text-xs font-bold text-red-700">
                                            Assignment failed
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-red-600">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {/* =================================================
                                    ORGANIZATION
                                ================================================= */}

                                <section>
                                    <div className="mb-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                Organization
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Send an assignment request to a
                                                verified organization
                                            </p>
                                        </div>

                                        {selectedOrganization && (
                                            <span className="text-[10px] font-semibold text-primary">
                                                Selected
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className={`relative overflow-hidden rounded-2xl border transition-all ${
                                            selectedOrganization
                                                ? 'border-primary/30 bg-primary/[0.035]'
                                                : 'border-slate-200 bg-slate-50/70'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 p-3.5">
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                                    selectedOrganization
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white text-slate-400 ring-1 ring-slate-200'
                                                }`}
                                            >
                                                <Building2 size={19} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                    Assign to
                                                </p>

                                                <div className="relative mt-0.5">
                                                    <select
                                                        id="help-request-organization"
                                                        value={
                                                            selectedOrganization
                                                        }
                                                        onChange={(event) =>
                                                            setSelectedOrganization(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className="w-full appearance-none bg-transparent pr-7 text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed"
                                                    >
                                                        <option value="">
                                                            Select an
                                                            organization
                                                        </option>

                                                        {availableOrganizations.map(
                                                            (organization) => (
                                                                <option
                                                                    key={
                                                                        organization.id
                                                                    }
                                                                    value={
                                                                        organization.id
                                                                    }
                                                                >
                                                                    {organization.name ||
                                                                        organization.organization_name ||
                                                                        `Organization #${organization.id}`}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    <ChevronDown
                                                        size={15}
                                                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {availableOrganizations.length ===
                                            0 && (
                                            <div className="border-t border-slate-200/70 px-4 py-3">
                                                <p className="text-[10px] text-slate-500">
                                                    No verified organizations
                                                    were returned by the server.
                                                </p>

                                                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                                                    The organization list should
                                                    contain every verified
                                                    organization.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* =================================================
                                    LIVE ASSIGNMENT BAR
                                ================================================= */}

                                <div
                                    className={`relative overflow-hidden rounded-2xl p-4 transition-all ${
                                        hasAssignmentTarget
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {hasAssignmentTarget && (
                                        <div className="absolute -right-10 -top-16 h-32 w-32 rounded-full bg-white/8" />
                                    )}

                                    <div className="relative flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                hasAssignmentTarget
                                                    ? 'bg-white/15 text-white'
                                                    : 'bg-white text-slate-400'
                                            }`}
                                        >
                                            <ArrowRight size={17} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-[9px] font-bold uppercase tracking-[0.13em] ${
                                                    hasAssignmentTarget
                                                        ? 'text-white/55'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                Assignment request
                                            </p>

                                            <p
                                                className={`mt-1 text-xs font-bold ${
                                                    hasAssignmentTarget
                                                        ? 'text-white'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                {selectedOrganization
                                                    ? 'Organization selected'
                                                    : 'Select an organization'}
                                            </p>
                                        </div>

                                        {hasAssignmentTarget && (
                                            <Check
                                                size={18}
                                                className="shrink-0 text-emerald-200"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* =================================================
                                    NOTE
                                ================================================= */}

                                <section>
                                    <div className="mb-2.5 flex items-end justify-between">
                                        <div>
                                            <label
                                                htmlFor="assignment-note"
                                                className="text-sm font-bold text-slate-900"
                                            >
                                                Assignment note
                                            </label>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Optional instructions or case
                                                context
                                            </p>
                                        </div>

                                        <span className="text-[10px] text-slate-400">
                                            {assignmentNote.length}/1000
                                        </span>
                                    </div>

                                    <textarea
                                        id="assignment-note"
                                        value={assignmentNote}
                                        onChange={(event) =>
                                            setAssignmentNote(
                                                event.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        rows={3}
                                        maxLength={1000}
                                        placeholder="Add anything the assigned organization should know..."
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </section>
                            </div>
                        </div>

                        {/* Footer */}

                        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading || !hasAssignmentTarget}
                                className="inline-flex h-10 min-w-38.75 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {loading && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                )}

                                {loading
                                    ? 'Sending...'
                                    : 'Send assignment request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignmentModal;
