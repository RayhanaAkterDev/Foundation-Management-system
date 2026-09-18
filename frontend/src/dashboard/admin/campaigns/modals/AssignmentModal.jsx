import React, { useMemo, useState } from 'react';

import {
    X,
    Users,
    ClipboardCheck,
    Check,
    UserRound,
    ArrowRight,
} from 'lucide-react';

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
    | Existing campaign assignments
    |--------------------------------------------------------------------------
    |
    | A campaign can have multiple volunteers assigned to it.
    | Therefore we collect all currently assigned volunteer IDs so they
    | can remain selected when the modal is opened again.
    |
    */

    const existingVolunteerIds = useMemo(() => {
        if (!campaign) {
            return [];
        }

        const ids = [];

        if (Array.isArray(campaign.assignment?.volunteers)) {
            campaign.assignment.volunteers.forEach((volunteer) => {
                const id =
                    volunteer?.user_id ?? volunteer?.id ?? volunteer?.user?.id;

                if (id !== undefined && id !== null) {
                    ids.push(String(id));
                }
            });
        }

        if (Array.isArray(campaign.volunteers)) {
            campaign.volunteers.forEach((volunteer) => {
                const id =
                    volunteer?.user_id ?? volunteer?.id ?? volunteer?.user?.id;

                if (id !== undefined && id !== null) {
                    ids.push(String(id));
                }
            });
        }

        /*
         * Backward compatibility with the previous single-assignment
         * response structure.
         */
        if (campaign.assignment?.volunteer_id) {
            ids.push(String(campaign.assignment.volunteer_id));
        }

        if (campaign.volunteer_id) {
            ids.push(String(campaign.volunteer_id));
        }

        if (campaign.assignment?.volunteer?.id) {
            ids.push(String(campaign.assignment.volunteer.id));
        }

        return [...new Set(ids)];
    }, [campaign]);

    /*
    |--------------------------------------------------------------------------
    | Form state
    |--------------------------------------------------------------------------
    */

    const [selectedVolunteers, setSelectedVolunteers] =
        useState(existingVolunteerIds);

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

    if (!campaign) {
        return null;
    }

    const selectedCount = selectedVolunteers.length;
    const hasSelectedVolunteers = selectedCount > 0;

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

                            {/* Assignment visual */}

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
                            </div>

                            <p className="mt-5 text-[10px] leading-5 text-white/45">
                                Assign one or more approved SP volunteers to
                                support this campaign. Each volunteer can only
                                have one active campaign assignment at a time.
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
                                Select one or more approved and available SP
                                volunteers for this campaign.
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
                                    VOLUNTEERS
                                ================================================= */}

                                <section>
                                    <div className="mb-3 flex items-end justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                SP volunteers
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                Select one or more available
                                                volunteers
                                            </p>
                                        </div>

                                        {hasSelectedVolunteers && (
                                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold text-primary">
                                                {selectedCount}{' '}
                                                {selectedCount === 1
                                                    ? 'selected'
                                                    : 'selected'}
                                            </span>
                                        )}
                                    </div>

                                    {volunteers.length > 0 ? (
                                        <div className="space-y-2">
                                            {volunteers.map((volunteer) => {
                                                const volunteerId = String(
                                                    volunteer.user_id ??
                                                        volunteer.user?.id ??
                                                        volunteer.id,
                                                );

                                                const checked =
                                                    selectedVolunteers.includes(
                                                        volunteerId,
                                                    );

                                                const volunteerName =
                                                    volunteer.name ||
                                                    volunteer.user?.name ||
                                                    'SP Volunteer';

                                                const volunteerEmail =
                                                    volunteer.email ||
                                                    volunteer.user?.email;

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
                                                            value={volunteerId}
                                                            checked={checked}
                                                            onChange={() =>
                                                                handleVolunteerSelect(
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
                                                                {volunteerName}
                                                            </p>

                                                            {volunteerEmail && (
                                                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                    {
                                                                        volunteerEmail
                                                                    }
                                                                </p>
                                                            )}

                                                            {volunteer.district && (
                                                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                    {
                                                                        volunteer.district
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
                                                Only active, verified and
                                                available volunteers without an
                                                active campaign assignment can
                                                be assigned.
                                            </p>
                                        </div>
                                    )}
                                </section>

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
                                            {assignmentNote.length}/1000
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
                                                availability. A volunteer cannot
                                                be assigned to another active
                                                campaign at the same time.
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
