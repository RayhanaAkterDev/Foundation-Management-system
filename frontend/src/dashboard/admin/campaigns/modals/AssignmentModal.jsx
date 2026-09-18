import React, { useMemo, useState } from 'react';

import {
    X,
    Users,
    ClipboardCheck,
    Check,
    UserRound,
    ArrowRight,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

const ACTIVE_ASSIGNMENT_STATUSES = [
    'assigned',
    'accepted',
    'in_progress',
    'withdrawal_requested',
];

const AssignmentModal = ({
    campaign,
    volunteers = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    /*
    |--------------------------------------------------------------------------
    | Campaign assignment history
    |--------------------------------------------------------------------------
    |
    | We need the complete assignment history for THIS campaign.
    |
    | Anyone who already has an assignment record for this campaign must
    | never appear in the new volunteer selection again.
    |
    | That includes:
    |
    | assigned
    | accepted
    | in_progress
    | withdrawal_requested
    | completed
    | rejected
    | withdrawn
    |
    */

    const existingAssignments = useMemo(() => {
        if (!campaign) {
            return [];
        }

        const records = [];

        /*
         * Preferred API structure:
         *
         * campaign.assignment.assignments
         */
        if (Array.isArray(campaign.assignment?.assignments)) {
            records.push(...campaign.assignment.assignments);
        }

        /*
         * Alternative structure:
         *
         * campaign.assignment.volunteers
         *
         * Only use this if those records actually represent
         * campaign assignment records.
         */
        if (Array.isArray(campaign.assignment?.volunteers)) {
            records.push(...campaign.assignment.volunteers);
        }

        /*
         * Another possible API structure:
         *
         * campaign.assignments
         */
        if (Array.isArray(campaign.assignments)) {
            records.push(...campaign.assignments);
        }

        /*
         * Backward compatibility with a direct campaign.volunteers
         * response.
         */
        if (Array.isArray(campaign.volunteers)) {
            records.push(...campaign.volunteers);
        }

        /*
         * Deduplicate records.
         *
         * Prefer assignment ID when available.
         * Otherwise use volunteer ID.
         */
        const uniqueRecords = new Map();

        records.forEach((record) => {
            if (!record) {
                return;
            }

            const volunteerId =
                record?.volunteer_id ??
                record?.user_id ??
                record?.volunteer?.user_id ??
                record?.volunteer?.id ??
                record?.user?.id;

            if (volunteerId === undefined || volunteerId === null) {
                return;
            }

            const assignmentId =
                record?.assignment_id ?? record?.assignment?.id ?? record?.id;

            const key = assignmentId
                ? `assignment-${assignmentId}`
                : `volunteer-${volunteerId}`;

            if (!uniqueRecords.has(key)) {
                uniqueRecords.set(key, {
                    ...record,
                    _volunteerId: String(volunteerId),
                });
            }
        });

        return Array.from(uniqueRecords.values());
    }, [campaign]);

    /*
    |--------------------------------------------------------------------------
    | Volunteers already connected to THIS campaign
    |--------------------------------------------------------------------------
    |
    | This is the most important list for the selection logic.
    |
    | Rejected volunteers are included here too.
    |
    */

    const campaignAssignmentVolunteerIds = useMemo(() => {
        return new Set(
            existingAssignments
                .map((assignment) => assignment?._volunteerId)
                .filter(Boolean),
        );
    }, [existingAssignments]);

    /*
    |--------------------------------------------------------------------------
    | Currently connected / accepted volunteers
    |--------------------------------------------------------------------------
    |
    | "assigned" means the request is still waiting for the volunteer.
    | "accepted", "in_progress", and "withdrawal_requested" are also
    | active connections to the campaign.
    |
    */

    const connectedVolunteers = useMemo(() => {
        return existingAssignments.filter((assignment) =>
            ACTIVE_ASSIGNMENT_STATUSES.includes(assignment?.status),
        );
    }, [existingAssignments]);

    /*
    |--------------------------------------------------------------------------
    | Rejected volunteers
    |--------------------------------------------------------------------------
    */

    const rejectedVolunteers = useMemo(() => {
        return existingAssignments.filter(
            (assignment) => assignment?.status === 'rejected',
        );
    }, [existingAssignments]);

    /*
    |--------------------------------------------------------------------------
    | Completed / withdrawn history
    |--------------------------------------------------------------------------
    |
    | These volunteers are also excluded from selection because they
    | already participated in this campaign.
    |
    | We keep them in a separate history section only when present.
    |
    */

    const completedVolunteers = useMemo(() => {
        return existingAssignments.filter((assignment) =>
            ['completed', 'withdrawn'].includes(assignment?.status),
        );
    }, [existingAssignments]);

    /*
    |--------------------------------------------------------------------------
    | New volunteer selection
    |--------------------------------------------------------------------------
    |
    | `volunteers` comes from the admin candidate endpoint.
    |
    | That endpoint already removes volunteers who currently have an
    | active assignment on ANY campaign.
    |
    | Here we additionally remove anyone who has EVER received an
    | assignment for THIS campaign.
    |
    */

    const selectableVolunteers = useMemo(() => {
        return volunteers.filter((volunteer) => {
            const volunteerId = String(
                volunteer?.user_id ??
                    volunteer?.user?.id ??
                    volunteer?.id ??
                    '',
            );

            if (!volunteerId) {
                return false;
            }

            return !campaignAssignmentVolunteerIds.has(volunteerId);
        });
    }, [volunteers, campaignAssignmentVolunteerIds]);

    /*
    |--------------------------------------------------------------------------
    | Form state
    |--------------------------------------------------------------------------
    */

    const [selectedVolunteers, setSelectedVolunteers] = useState([]);

    const [assignmentNote, setAssignmentNote] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Volunteer selection
    |--------------------------------------------------------------------------
    */

    const handleVolunteerSelect = (volunteerId) => {
        if (loading) {
            return;
        }

        const id = String(volunteerId);

        setSelectedVolunteers((current) => {
            if (current.includes(id)) {
                return current.filter((selectedId) => selectedId !== id);
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

        if (selectedVolunteers.length === 0 || loading) {
            return;
        }

        onConfirm({
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

    /*
    |--------------------------------------------------------------------------
    | Display helpers
    |--------------------------------------------------------------------------
    */

    const getVolunteerName = (volunteer) => {
        return (
            volunteer?.name ||
            volunteer?.user?.name ||
            volunteer?.volunteer?.name ||
            'SP Volunteer'
        );
    };

    const getVolunteerEmail = (volunteer) => {
        return (
            volunteer?.email ||
            volunteer?.user?.email ||
            volunteer?.volunteer?.email ||
            null
        );
    };

    const getVolunteerDistrict = (volunteer) => {
        return volunteer?.district || volunteer?.volunteer?.district || null;
    };

    const getVolunteerId = (volunteer) => {
        return String(
            volunteer?.user_id ??
                volunteer?.user?.id ??
                volunteer?.volunteer_id ??
                volunteer?.volunteer?.id ??
                volunteer?.id ??
                '',
        );
    };

    const getAssignmentVolunteer = (assignment) => {
        return assignment?.volunteer || assignment?.user || assignment;
    };

    const getAssignmentStatusLabel = (status) => {
        switch (status) {
            case 'assigned':
                return 'Awaiting response';

            case 'accepted':
                return 'Accepted';

            case 'in_progress':
                return 'In progress';

            case 'withdrawal_requested':
                return 'Withdrawal pending';

            case 'completed':
                return 'Completed';

            case 'withdrawn':
                return 'Withdrawn';

            case 'rejected':
                return 'Rejected';

            default:
                return status ? status.replace(/_/g, ' ') : 'Assigned';
        }
    };

    const selectedCount = selectedVolunteers.length;
    const hasSelectedVolunteers = selectedCount > 0;

    if (!campaign) {
        return null;
    }

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
                                        Campaign assignment
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
                                    Current campaign
                                </p>

                                <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-tight text-white">
                                    {campaign.title || 'Campaign'}
                                </h2>

                                {campaign.category && (
                                    <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold capitalize text-white/85 ring-1 ring-white/10">
                                        {campaign.category}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto">
                            {campaign.status && (
                                <div className="mb-6 border-t border-white/10 pt-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                        Campaign status
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-300" />

                                        <span className="text-sm font-semibold capitalize text-white">
                                            {campaign.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl bg-black/12 p-4 ring-1 ring-white/8">
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                    Assignment
                                </p>

                                <div className="mt-3 flex items-center gap-2.5">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                                        <Users size={13} />
                                    </div>

                                    <span className="text-[11px] text-white/80">
                                        SP volunteers
                                    </span>

                                    {hasSelectedVolunteers && (
                                        <span className="ml-auto text-[10px] font-bold text-emerald-200">
                                            {selectedCount} selected
                                        </span>
                                    )}
                                </div>

                                {connectedVolunteers.length > 0 && (
                                    <div className="mt-3 border-t border-white/10 pt-3">
                                        <p className="text-[9px] text-white/45">
                                            Connected
                                        </p>

                                        <p className="mt-0.5 text-xs font-semibold text-white">
                                            {connectedVolunteers.length}{' '}
                                            volunteer
                                            {connectedVolunteers.length !== 1
                                                ? 's'
                                                : ''}
                                        </p>
                                    </div>
                                )}

                                {rejectedVolunteers.length > 0 && (
                                    <div className="mt-3 border-t border-white/10 pt-3">
                                        <p className="text-[9px] text-white/45">
                                            Rejected
                                        </p>

                                        <p className="mt-0.5 text-xs font-semibold text-white">
                                            {rejectedVolunteers.length}{' '}
                                            volunteer
                                            {rejectedVolunteers.length !== 1
                                                ? 's'
                                                : ''}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <p className="mt-5 text-[10px] leading-5 text-white/45">
                                Assign one or more approved SP volunteers to
                                support this campaign. Volunteers who already
                                received an assignment for this campaign cannot
                                be selected again.
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
                                Assign volunteers
                            </h1>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Select approved and available volunteers who
                                have not already been connected to this
                                campaign.
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
                                    AVAILABLE VOLUNTEERS
                                ================================================= */}

                                <section>
                                    <div className="mb-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                Available volunteers
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Select volunteers who are
                                                available for a new campaign
                                                assignment
                                            </p>
                                        </div>

                                        {hasSelectedVolunteers && (
                                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold text-primary">
                                                {selectedCount} selected
                                            </span>
                                        )}
                                    </div>

                                    {selectableVolunteers.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectableVolunteers.map(
                                                (volunteer) => {
                                                    const volunteerId =
                                                        getVolunteerId(
                                                            volunteer,
                                                        );

                                                    const checked =
                                                        selectedVolunteers.includes(
                                                            volunteerId,
                                                        );

                                                    const volunteerName =
                                                        getVolunteerName(
                                                            volunteer,
                                                        );

                                                    const volunteerEmail =
                                                        getVolunteerEmail(
                                                            volunteer,
                                                        );

                                                    const district =
                                                        getVolunteerDistrict(
                                                            volunteer,
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
                                                                name="campaign-volunteers"
                                                                value={
                                                                    volunteerId
                                                                }
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={() =>
                                                                    handleVolunteerSelect(
                                                                        volunteerId,
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
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
                                                                    {
                                                                        volunteerName
                                                                    }
                                                                </p>

                                                                {volunteerEmail && (
                                                                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                        {
                                                                            volunteerEmail
                                                                        }
                                                                    </p>
                                                                )}

                                                                {district && (
                                                                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                        {
                                                                            district
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div
                                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                                                    checked
                                                                        ? 'border-primary bg-primary text-white'
                                                                        : 'border-slate-200 bg-white text-transparent'
                                                                }`}
                                                            >
                                                                <Check
                                                                    size={12}
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                />
                                                            </div>
                                                        </label>
                                                    );
                                                },
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
                                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                                                <Users size={19} />
                                            </div>

                                            <p className="mt-3 text-xs font-bold text-slate-700">
                                                No volunteers available
                                            </p>

                                            <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-slate-400">
                                                There are currently no eligible
                                                volunteers available for a new
                                                assignment. Volunteers already
                                                connected to this campaign are
                                                also excluded.
                                            </p>
                                        </div>
                                    )}
                                </section>

                                {/* =================================================
                                    CONNECTED VOLUNTEERS
                                ================================================= */}

                                {connectedVolunteers.length > 0 && (
                                    <section>
                                        <div className="mb-3 flex items-end justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Connected volunteers
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Volunteers currently
                                                    connected to this campaign
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                                                {connectedVolunteers.length}{' '}
                                                connected
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {connectedVolunteers.map(
                                                (assignment, index) => {
                                                    const volunteer =
                                                        getAssignmentVolunteer(
                                                            assignment,
                                                        );

                                                    const name =
                                                        getVolunteerName(
                                                            volunteer,
                                                        );

                                                    const email =
                                                        getVolunteerEmail(
                                                            volunteer,
                                                        );

                                                    const status =
                                                        assignment?.status;

                                                    return (
                                                        <div
                                                            key={
                                                                assignment?.id ??
                                                                `connected-${index}`
                                                            }
                                                            className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/45 px-3.5 py-3"
                                                        >
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-100">
                                                                <CheckCircle2
                                                                    size={17}
                                                                />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-xs font-bold text-slate-900">
                                                                    {name}
                                                                </p>

                                                                {email && (
                                                                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                        {email}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[9px] font-bold capitalize text-emerald-700 ring-1 ring-emerald-100">
                                                                {getAssignmentStatusLabel(
                                                                    status,
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* =================================================
                                    REJECTED VOLUNTEERS
                                ================================================= */}

                                {rejectedVolunteers.length > 0 && (
                                    <section>
                                        <div className="mb-3 flex items-end justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Rejected volunteers
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Volunteers who declined this
                                                    campaign assignment
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-700">
                                                {rejectedVolunteers.length}{' '}
                                                rejected
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {rejectedVolunteers.map(
                                                (assignment, index) => {
                                                    const volunteer =
                                                        getAssignmentVolunteer(
                                                            assignment,
                                                        );

                                                    const name =
                                                        getVolunteerName(
                                                            volunteer,
                                                        );

                                                    const email =
                                                        getVolunteerEmail(
                                                            volunteer,
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                assignment?.id ??
                                                                `rejected-${index}`
                                                            }
                                                            className="rounded-2xl border border-red-100 bg-red-50/40 px-3.5 py-3"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 ring-1 ring-red-100">
                                                                    <XCircle
                                                                        size={
                                                                            17
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-xs font-bold text-slate-900">
                                                                        {name}
                                                                    </p>

                                                                    {email && (
                                                                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                            {
                                                                                email
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <span className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[9px] font-bold text-red-700 ring-1 ring-red-100">
                                                                    Rejected
                                                                </span>
                                                            </div>

                                                            {assignment?.rejection_reason && (
                                                                <div className="mt-3 border-t border-red-100 pt-2.5">
                                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">
                                                                        Reason
                                                                    </p>

                                                                    <p className="mt-1 text-[10px] leading-5 text-red-600">
                                                                        {
                                                                            assignment.rejection_reason
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* =================================================
                                    COMPLETED / WITHDRAWN HISTORY
                                ================================================= */}

                                {completedVolunteers.length > 0 && (
                                    <section>
                                        <div className="mb-3">
                                            <p className="text-sm font-bold text-slate-900">
                                                Previous campaign volunteers
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Volunteers who previously
                                                completed or withdrew from this
                                                campaign
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            {completedVolunteers.map(
                                                (assignment, index) => {
                                                    const volunteer =
                                                        getAssignmentVolunteer(
                                                            assignment,
                                                        );

                                                    const name =
                                                        getVolunteerName(
                                                            volunteer,
                                                        );

                                                    const email =
                                                        getVolunteerEmail(
                                                            volunteer,
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                assignment?.id ??
                                                                `previous-${index}`
                                                            }
                                                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3"
                                                        >
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
                                                                <UserRound
                                                                    size={17}
                                                                />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-xs font-bold text-slate-900">
                                                                    {name}
                                                                </p>

                                                                {email && (
                                                                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                        {email}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[9px] font-bold capitalize text-slate-500 ring-1 ring-slate-200">
                                                                {getAssignmentStatusLabel(
                                                                    assignment?.status,
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </section>
                                )}

                                {/* =================================================
                                    LIVE ASSIGNMENT BAR
                                ================================================= */}

                                <div
                                    className={`relative overflow-hidden rounded-2xl p-4 transition-all ${
                                        hasSelectedVolunteers
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {hasSelectedVolunteers && (
                                        <div className="absolute -right-10 -top-16 h-32 w-32 rounded-full bg-white/8" />
                                    )}

                                    <div className="relative flex items-center gap-3">
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                hasSelectedVolunteers
                                                    ? 'bg-white/15 text-white'
                                                    : 'bg-white text-slate-400'
                                            }`}
                                        >
                                            <ArrowRight size={17} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-[9px] font-bold uppercase tracking-[0.13em] ${
                                                    hasSelectedVolunteers
                                                        ? 'text-white/55'
                                                        : 'text-slate-400'
                                                }`}
                                            >
                                                Assignment target
                                            </p>

                                            <p
                                                className={`mt-1 truncate text-xs font-bold ${
                                                    hasSelectedVolunteers
                                                        ? 'text-white'
                                                        : 'text-slate-600'
                                                }`}
                                            >
                                                {hasSelectedVolunteers
                                                    ? `${selectedCount} ${
                                                          selectedCount === 1
                                                              ? 'SP volunteer'
                                                              : 'SP volunteers'
                                                      } selected`
                                                    : 'No volunteer selected'}
                                            </p>
                                        </div>

                                        {hasSelectedVolunteers && (
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
                                                htmlFor="campaign-assignment-note"
                                                className="text-sm font-bold text-slate-900"
                                            >
                                                Assignment note
                                            </label>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Optional instructions or context
                                            </p>
                                        </div>

                                        <span className="text-[10px] text-slate-400">
                                            {assignmentNote.length}
                                            /1000
                                        </span>
                                    </div>

                                    <textarea
                                        id="campaign-assignment-note"
                                        value={assignmentNote}
                                        onChange={(event) =>
                                            setAssignmentNote(
                                                event.target.value,
                                            )
                                        }
                                        disabled={loading}
                                        rows={3}
                                        maxLength={1000}
                                        placeholder="Add anything the volunteers should know about this campaign..."
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </section>

                                {/* =================================================
                                    BACKEND RULES
                                ================================================= */}

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-slate-200">
                                            <ClipboardCheck
                                                size={14}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                Assignment requirements
                                            </p>

                                            <p className="mt-1 text-[10px] leading-5 text-slate-400">
                                                Each volunteer must be an active
                                                individual user with a verified
                                                email, an active SP volunteer
                                                profile, and current
                                                availability. A volunteer
                                                already connected to this
                                                campaign cannot be assigned
                                                again.
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
                                disabled={loading || !hasSelectedVolunteers}
                                className="inline-flex h-10 min-w-38.75 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                {loading && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                )}

                                {loading
                                    ? 'Assigning...'
                                    : `Assign ${
                                          selectedCount > 1
                                              ? `${selectedCount} volunteers`
                                              : 'volunteer'
                                      }`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignmentModal;
