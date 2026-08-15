import React, { useMemo, useState } from 'react';
import {
    X,
    Building2,
    Users,
    ClipboardCheck,
    Check,
    UserRound,
    ChevronDown,
    ArrowRight,
} from 'lucide-react';

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
    |--------------------------------------------------------------------------|
    | Existing assignment values
    |--------------------------------------------------------------------------|
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
    |--------------------------------------------------------------------------|
    | Verified organizations only
    |--------------------------------------------------------------------------|
    */

    const availableOrganizations = useMemo(() => {
        return organizations.filter((organization) => {
            const verificationStatus =
                organization.verification_status ||
                organization.status ||
                organization.verificationStatus;

            if (!verificationStatus) {
                return true;
            }

            return verificationStatus === 'verified';
        });
    }, [organizations]);

    /*
    |--------------------------------------------------------------------------|
    | Form state
    |--------------------------------------------------------------------------|
    */

    const [selectedOrganization, setSelectedOrganization] = useState(
        String(existingOrganizationId || ''),
    );

    const [selectedVolunteers, setSelectedVolunteers] =
        useState(existingVolunteerIds);

    const [assignmentNote, setAssignmentNote] = useState('');

    /*
    |--------------------------------------------------------------------------|
    | Volunteer selection
    |--------------------------------------------------------------------------|
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
    |--------------------------------------------------------------------------|
    | Submit
    |--------------------------------------------------------------------------|
    */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedOrganization && selectedVolunteers.length === 0) {
            return;
        }

        onConfirm({
            organization_id: selectedOrganization
                ? Number(selectedOrganization)
                : null,

            volunteer_ids: selectedVolunteers.map(Number),

            assignment_note: assignmentNote.trim() || null,
        });
    };

    /*
    |--------------------------------------------------------------------------|
    | Close
    |--------------------------------------------------------------------------|
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-md sm:p-6">
            <div
                className="absolute inset-0"
                onClick={!loading ? handleClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-[900px] overflow-hidden rounded-[28px] bg-white shadow-[0_35px_120px_rgba(15,23,42,0.28)]">
                {/* =========================================================
                    LEFT CONTEXT PANEL
                ========================================================= */}

                <aside className="relative hidden w-[290px] shrink-0 overflow-hidden bg-[#0f766e] text-white lg:flex lg:flex-col">
                    {/* Decorative shapes */}

                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.07]" />

                    <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-black/[0.07]" />

                    <div className="relative flex h-full flex-col p-7">
                        {/* Top */}

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

                                <h2 className="mt-2 text-[22px] font-bold leading-[1.25] tracking-tight text-white">
                                    {request.title || 'Help request'}
                                </h2>

                                {request.category && (
                                    <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold capitalize text-white/85 ring-1 ring-white/10">
                                        {request.category}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Middle information */}

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

                            {/* Assignment visual */}

                            <div className="rounded-2xl bg-black/[0.12] p-4 ring-1 ring-white/[0.08]">
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                    Assignment
                                </p>

                                <div className="mt-3 space-y-2.5">
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

                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                                            <Users size={13} />
                                        </div>

                                        <span className="text-[11px] text-white/80">
                                            Volunteers
                                        </span>

                                        {selectedVolunteers.length > 0 && (
                                            <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold">
                                                {selectedVolunteers.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-[10px] leading-5 text-white/45">
                                Assigning a request connects the verified
                                assistance need with the people responsible for
                                coordination.
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
                                Choose who should take responsibility for this
                                request.
                            </p>
                        </div>
                    </div>

                    {/* =====================================================
                        FORM
                    ===================================================== */}

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
                                                Optional coordination partner
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
                                                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
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
                                                            No organization
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
                                                                    {
                                                                        organization.name
                                                                    }
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
                                            <div className="border-t border-slate-200/70 px-4 py-2.5">
                                                <p className="text-[10px] text-slate-400">
                                                    No verified organizations
                                                    are currently available.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* =================================================
                                    VOLUNTEERS
                                ================================================= */}

                                <section>
                                    <div className="mb-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                SP volunteers
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Select one or more volunteers
                                            </p>
                                        </div>

                                        {selectedVolunteers.length > 0 && (
                                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold text-primary">
                                                {selectedVolunteers.length}{' '}
                                                selected
                                            </span>
                                        )}
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
                                                        className={`group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 transition-all ${
                                                            checked
                                                                ? 'border-primary/30 bg-primary/[0.035]'
                                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                        } ${
                                                            loading
                                                                ? 'cursor-not-allowed opacity-60'
                                                                : ''
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
                                                            className="sr-only"
                                                        />

                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                                                                checked
                                                                    ? 'bg-primary text-white'
                                                                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            <UserRound
                                                                size={17}
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-xs font-bold text-slate-900">
                                                                {volunteer.name ||
                                                                    volunteer
                                                                        .user
                                                                        ?.name ||
                                                                    'SP Volunteer'}
                                                            </p>

                                                            {(volunteer.email ||
                                                                volunteer.user
                                                                    ?.email) && (
                                                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                    {volunteer.email ||
                                                                        volunteer
                                                                            .user
                                                                            ?.email}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div
                                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                                                                checked
                                                                    ? 'border-primary bg-primary text-white'
                                                                    : 'border-slate-200 bg-white text-transparent'
                                                            }`}
                                                        >
                                                            <Check
                                                                size={12}
                                                                strokeWidth={3}
                                                            />
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                                                <Users size={19} />
                                            </div>

                                            <p className="mt-3 text-xs font-bold text-slate-700">
                                                No available SP volunteers
                                            </p>

                                            <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-slate-400">
                                                Only approved and available
                                                volunteers can be assigned.
                                            </p>
                                        </div>
                                    )}
                                </section>

                                {/* =================================================
                                    LIVE ASSIGNMENT BAR
                                ================================================= */}

                                <div
                                    className={`relative overflow-hidden rounded-2xl p-4 transition-all ${
                                        hasAssignmentTarget
                                            ? 'bg-[#0f766e] text-white'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {hasAssignmentTarget && (
                                        <div className="absolute -right-10 -top-16 h-32 w-32 rounded-full bg-white/[0.08]" />
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
                                                Assignment target
                                            </p>

                                            <p
                                                className={`mt-1 text-xs font-bold ${
                                                    hasAssignmentTarget
                                                        ? 'text-white'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                {selectedOrganization &&
                                                selectedVolunteers.length > 0
                                                    ? 'Organization + volunteers'
                                                    : selectedOrganization
                                                      ? 'Organization only'
                                                      : selectedVolunteers.length >
                                                          0
                                                        ? `${selectedVolunteers.length} volunteer${selectedVolunteers.length > 1 ? 's' : ''} selected`
                                                        : 'Nothing selected yet'}
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
                                                Optional instructions or context
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
                                        placeholder="Add anything the assigned team should know..."
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </section>
                            </div>
                        </div>

                        {/* =====================================================
                            FOOTER
                        ===================================================== */}

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
                                className="inline-flex h-10 min-w-[155px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {loading && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                )}

                                {loading
                                    ? 'Assigning...'
                                    : 'Confirm assignment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestAssignmentModal;
