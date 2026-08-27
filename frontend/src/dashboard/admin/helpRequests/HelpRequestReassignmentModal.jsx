import React, { useMemo, useState } from 'react';

import {
    X,
    RefreshCw,
    Building2,
    UserRound,
    CheckCircle2,
    AlertCircle,
    Users,
} from 'lucide-react';

const HelpRequestReassignmentModal = ({
    request,
    open,
    loading = false,
    error = null,
    organizations = [],
    volunteers = [],
    onClose,
    onSubmit,
}) => {
    const [organizationId, setOrganizationId] = useState('');
    const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);
    const [assignmentNote, setAssignmentNote] = useState('');

    const availableOrganizations = useMemo(() => {
        return organizations.filter((organization) => {
            const status = String(
                organization.verification_status ?? organization.status ?? '',
            ).toLowerCase();

            return (
                organization.is_verified === true ||
                status === 'verified' ||
                status === 'approved' ||
                status === 'active'
            );
        });
    }, [organizations]);

    const availableVolunteers = useMemo(() => {
        return volunteers.filter((volunteer) => {
            const availability = String(
                volunteer.availability ?? '',
            ).toLowerCase();

            const status = String(volunteer.status ?? '').toLowerCase();

            return (
                availability === 'available' &&
                ['approved', 'active'].includes(status)
            );
        });
    }, [volunteers]);

    const toggleVolunteer = (volunteerId) => {
        setSelectedVolunteerIds((current) => {
            if (current.includes(volunteerId)) {
                return current.filter((id) => id !== volunteerId);
            }

            return [...current, volunteerId];
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const hasOrganization = Boolean(organizationId);
        const hasVolunteers = selectedVolunteerIds.length > 0;

        if (!hasOrganization && !hasVolunteers) {
            return;
        }

        onSubmit({
            help_request_id: request.id,
            organization_id: organizationId || null,
            volunteer_ids: selectedVolunteerIds,
            assignment_note: assignmentNote.trim() || null,
        });
    };

    if (!open || !request) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-[5px] sm:p-5">
            <div
                className="absolute inset-0"
                onClick={!loading ? onClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.25)]">
                {/* Header */}
                <div className="relative shrink-0 border-b border-border bg-white px-6 py-5 sm:px-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-500 via-primary to-primary/30" />

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-text-secondary transition-all hover:border-border hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="pr-12">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <RefreshCw size={17} strokeWidth={1.9} />
                            </span>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                                    Reassignment
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                    Change the current assistance team
                                </p>
                            </div>
                        </div>

                        <h2 className="mt-4 max-w-xl text-[21px] font-bold leading-7 tracking-tight text-slate-900">
                            Reassign help request
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {request.title || 'Help request'}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto bg-[#f1f6f5]"
                >
                    <div className="space-y-5 px-6 py-6 sm:px-7">
                        {/* Current assignment */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-emerald-600"
                                />

                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                                    Current assignment
                                </p>
                            </div>

                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <CurrentAssignment
                                    icon={Building2}
                                    label="Organization"
                                    value={
                                        request.assigned_organization?.name ||
                                        request.organization?.name ||
                                        getAssignedOrganizationName(request)
                                    }
                                />

                                <CurrentAssignment
                                    icon={Users}
                                    label="Volunteers"
                                    value={getVolunteerNames(request)}
                                />
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                            <AlertCircle
                                size={17}
                                className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <div>
                                <p className="text-sm font-semibold text-amber-800">
                                    Reassignment
                                </p>

                                <p className="mt-1 text-xs leading-5 text-amber-700">
                                    Select a new organization, volunteer(s), or
                                    both. The new assignment will replace the
                                    current assignment.
                                </p>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                                    <Building2 size={15} />
                                </span>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        Organization
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Optional
                                    </p>
                                </div>
                            </div>

                            <select
                                value={organizationId}
                                onChange={(event) =>
                                    setOrganizationId(event.target.value)
                                }
                                disabled={loading}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="">No organization</option>

                                {availableOrganizations.map((organization) => (
                                    <option
                                        key={organization.id}
                                        value={organization.id}
                                    >
                                        {organization.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Volunteers */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                                    <UserRound size={15} />
                                </span>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        SP Volunteers
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Select one or more available volunteers
                                    </p>
                                </div>
                            </div>

                            {availableVolunteers.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
                                    <p className="text-sm font-medium text-slate-500">
                                        No available volunteers
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        There are currently no approved,
                                        available volunteers.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {availableVolunteers.map((volunteer) => {
                                        const volunteerId = String(
                                            volunteer.id ?? volunteer.user_id,
                                        );

                                        const selected =
                                            selectedVolunteerIds.includes(
                                                volunteerId,
                                            );

                                        return (
                                            <label
                                                key={volunteerId}
                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
                                                    selected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() =>
                                                        toggleVolunteer(
                                                            volunteerId,
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-slate-700">
                                                        {getVolunteerName(
                                                            volunteer,
                                                        )}
                                                    </p>

                                                    {volunteer.email && (
                                                        <p className="truncate text-xs text-slate-400">
                                                            {volunteer.email}
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                                                    Available
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {selectedVolunteerIds.length > 0 && (
                                <p className="mt-3 text-xs font-semibold text-primary">
                                    {selectedVolunteerIds.length}{' '}
                                    {selectedVolunteerIds.length === 1
                                        ? 'volunteer'
                                        : 'volunteers'}{' '}
                                    selected
                                </p>
                            )}
                        </div>

                        {/* Note */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-800">
                                    Reassignment note
                                </span>

                                <span className="mt-1 block text-xs text-slate-400">
                                    Optional — explain why this request is being
                                    reassigned.
                                </span>

                                <textarea
                                    value={assignmentNote}
                                    onChange={(event) =>
                                        setAssignmentNote(event.target.value)
                                    }
                                    disabled={loading}
                                    rows={4}
                                    placeholder="Enter a reassignment note..."
                                    className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </label>
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm font-semibold text-red-700">
                                    Reassignment failed
                                </p>

                                <p className="mt-1 text-xs leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-white px-6 py-4 sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                (!organizationId &&
                                    selectedVolunteerIds.length === 0)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Reassigning...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={15} />
                                    Reassign Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CurrentAssignment = ({ icon: Icon, label, value }) => {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-slate-400" />

                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                    {label}
                </p>
            </div>

            <p className="mt-1.5 truncate text-xs font-semibold text-slate-700">
                {value}
            </p>
        </div>
    );
};

const getVolunteerName = (volunteer) => {
    return (
        volunteer?.name ||
        volunteer?.user?.name ||
        [volunteer?.user?.first_name, volunteer?.user?.last_name]
            .filter(Boolean)
            .join(' ') ||
        'Unnamed volunteer'
    );
};

const getAssignedOrganizationName = (request) => {
    const assignment =
        request?.assignments?.find(
            (item) => item?.organization || item?.organization_id,
        ) || null;

    return assignment?.organization?.name || 'Not assigned';
};

const getVolunteerNames = (request) => {
    const volunteers =
        request?.assigned_volunteers ||
        request?.volunteers ||
        request?.assignments
            ?.map((assignment) => assignment.volunteer)
            .filter(Boolean) ||
        [];

    if (!volunteers.length) {
        return 'Not assigned';
    }

    return volunteers.map(getVolunteerName).join(', ');
};

export default HelpRequestReassignmentModal;
