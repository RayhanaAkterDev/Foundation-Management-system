import React, { useMemo, useState } from 'react';
import { X, Building2, Users, ClipboardCheck } from 'lucide-react';

const HelpRequestAssignmentModal = ({
    request,
    organizations = [],
    volunteers = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    /*
    |--------------------------------------------------------------------------
    | Existing assignment values
    |--------------------------------------------------------------------------
    */

    const existingOrganizationId = useMemo(() => {
        return (
            request?.assignment?.organization_id ||
            request?.organization_id ||
            ''
        );
    }, [request]);

    const existingVolunteerIds = useMemo(() => {
        if (!request) {
            return [];
        }

        if (Array.isArray(request.assignment?.volunteer_ids)) {
            return request.assignment.volunteer_ids.map(String);
        }

        if (Array.isArray(request.volunteer_ids)) {
            return request.volunteer_ids.map(String);
        }

        if (request.assignment?.volunteer_id) {
            return [String(request.assignment.volunteer_id)];
        }

        if (request.volunteer_id) {
            return [String(request.volunteer_id)];
        }

        return [];
    }, [request]);

    /*
    |--------------------------------------------------------------------------
    | Verified organizations only
    |--------------------------------------------------------------------------
    */

    const availableOrganizations = useMemo(() => {
        return organizations.filter((organization) => {
            const verificationStatus =
                organization.verification_status ||
                organization.status ||
                organization.verificationStatus;

            /*
             * If verification information exists, only allow verified ones.
             *
             * If the API already guarantees verified organizations and does
             * not provide a verification field, keep the organization.
             */
            if (!verificationStatus) {
                return true;
            }

            return verificationStatus === 'verified';
        });
    }, [organizations]);

    /*
    |--------------------------------------------------------------------------
    | Form state
    |--------------------------------------------------------------------------
    */

    const [selectedOrganization, setSelectedOrganization] = useState(
        String(existingOrganizationId || ''),
    );

    const [selectedVolunteers, setSelectedVolunteers] =
        useState(existingVolunteerIds);

    const [assignmentNote, setAssignmentNote] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Volunteer selection
    |--------------------------------------------------------------------------
    */

    const handleVolunteerToggle = (volunteerId) => {
        const id = String(volunteerId);

        setSelectedVolunteers((current) => {
            if (current.includes(id)) {
                return current.filter((item) => item !== id);
            }

            return [...current, id];
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {
        event.preventDefault();

        /*
         * Workflow:
         *
         * 1. Organization only
         * 2. Volunteer(s) only
         * 3. Organization + volunteer(s)
         *
         * At least one target is required.
         */

        if (!selectedOrganization && selectedVolunteers.length === 0) {
            return;
        }

        onConfirm({
            organization_id: selectedOrganization
                ? Number(selectedOrganization)
                : null,

            /*
             * Empty array is valid for organization-only assignment.
             */
            volunteer_ids: selectedVolunteers.map(Number),

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

    const hasAssignmentTarget =
        Boolean(selectedOrganization) || selectedVolunteers.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl">
                {/* =========================================================
                    Header
                ========================================================= */}

                <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Help request
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            Assign assistance
                        </h2>

                        <p className="mt-1 max-w-xl text-xs leading-5 text-text-secondary">
                            Assign this verified help request to an
                            organization, one or more SP volunteers, or both.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* =========================================================
                    Request summary
                ========================================================= */}

                <div className="shrink-0 border-b border-border bg-background px-6 py-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <ClipboardCheck size={18} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                Request
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-text-primary">
                                {request.title || 'Help request'}
                            </p>

                            {request.category && (
                                <p className="mt-0.5 text-xs text-text-secondary">
                                    {request.category}
                                </p>
                            )}

                            {(request.urgency || request.priority) && (
                                <p className="mt-1 text-xs font-semibold text-primary">
                                    Priority:{' '}
                                    {request.priority || request.urgency}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    Scrollable form content
                ========================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-6">
                            {/* Error */}

                            {error && (
                                <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* =================================================
                                Organization
                            ================================================= */}

                            <div>
                                <div className="mb-2">
                                    <label
                                        htmlFor="help-request-organization"
                                        className="block text-xs font-semibold text-text-primary"
                                    >
                                        Organization
                                    </label>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        Optional — choose an SP-verified
                                        organization if needed.
                                    </p>
                                </div>

                                <div className="relative">
                                    <Building2
                                        size={17}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                                    />

                                    <select
                                        id="help-request-organization"
                                        value={selectedOrganization}
                                        onChange={(event) =>
                                            setSelectedOrganization(
                                                event.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        className="h-11 w-full appearance-none rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                    >
                                        <option value="">
                                            No organization
                                        </option>

                                        {availableOrganizations.map(
                                            (organization) => (
                                                <option
                                                    key={organization.id}
                                                    value={organization.id}
                                                >
                                                    {organization.name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                {availableOrganizations.length === 0 && (
                                    <p className="mt-2 text-xs text-text-secondary">
                                        No verified organizations are currently
                                        available.
                                    </p>
                                )}
                            </div>

                            {/* =================================================
                                Volunteers
                            ================================================= */}

                            <div>
                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-text-primary">
                                        SP Registered Volunteers
                                    </label>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        Optional — select one or more approved
                                        and available SP volunteers.
                                    </p>
                                </div>

                                {volunteers.length > 0 ? (
                                    <div className="space-y-2">
                                        {volunteers.map((volunteer) => {
                                            const volunteerId = String(
                                                volunteer.user_id ??
                                                    volunteer.user?.id,
                                            );

                                            const checked =
                                                selectedVolunteers.includes(
                                                    volunteerId,
                                                );

                                            return (
                                                <label
                                                    key={volunteerId}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                                                        checked
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border bg-white hover:bg-background-alt'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleVolunteerToggle(
                                                                volunteerId,
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                                    />

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Users size={17} />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-text-primary">
                                                            {volunteer.name ||
                                                                volunteer.user
                                                                    ?.name ||
                                                                'SP Volunteer'}
                                                        </p>

                                                        {(volunteer.email ||
                                                            volunteer.user
                                                                ?.email) && (
                                                            <p className="mt-0.5 text-xs text-text-secondary">
                                                                {volunteer.email ||
                                                                    volunteer
                                                                        .user
                                                                        ?.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-border bg-background px-4 py-5 text-center">
                                        <Users
                                            size={20}
                                            className="mx-auto text-text-secondary"
                                        />

                                        <p className="mt-2 text-xs font-medium text-text-primary">
                                            No available SP volunteers found.
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            Only approved and available
                                            volunteers can be assigned.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* =================================================
                                Assignment summary
                            ================================================= */}

                            <div className="rounded-lg border border-border bg-background px-4 py-3">
                                <p className="text-xs font-semibold text-text-primary">
                                    Assignment target
                                </p>

                                <p className="mt-1 text-xs text-text-secondary">
                                    {selectedOrganization &&
                                    selectedVolunteers.length > 0
                                        ? 'Organization + volunteer(s) selected'
                                        : selectedOrganization
                                          ? 'Organization selected'
                                          : selectedVolunteers.length > 0
                                            ? `${selectedVolunteers.length} volunteer(s) selected`
                                            : 'Select at least one organization or volunteer'}
                                </p>
                            </div>

                            {/* =================================================
                                Assignment note
                            ================================================= */}

                            <div>
                                <label
                                    htmlFor="assignment-note"
                                    className="mb-2 block text-xs font-semibold text-text-primary"
                                >
                                    Assignment note
                                    <span className="ml-1 font-normal text-text-secondary">
                                        (optional)
                                    </span>
                                </label>

                                <textarea
                                    id="assignment-note"
                                    value={assignmentNote}
                                    onChange={(event) =>
                                        setAssignmentNote(event.target.value)
                                    }
                                    disabled={loading}
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Add any relevant instructions or context..."
                                    className="w-full resize-none rounded-lg border border-border bg-white px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                />

                                <p className="mt-1 text-right text-[11px] text-text-secondary">
                                    {assignmentNote.length}/1000
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        Footer
                    ===================================================== */}

                    <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border bg-surface-soft px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !hasAssignmentTarget}
                            className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}

                            {loading ? 'Assigning...' : 'Confirm assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestAssignmentModal;
