import React, { useMemo, useState } from 'react';

import {
    AlertTriangle,
    Building2,
    Check,
    ChevronDown,
    Users,
    X,
} from 'lucide-react';

const getAssignedOrganizationId = (request) => {
    if (!request) {
        return null;
    }

    if (request.assigned_organization?.id) {
        return request.assigned_organization.id;
    }

    if (request.assigned_organization_id) {
        return request.assigned_organization_id;
    }

    if (request.assignment?.organization_id) {
        return request.assignment.organization_id;
    }

    if (request.assignment?.organization?.id) {
        return request.assignment.organization.id;
    }

    if (Array.isArray(request.assignments)) {
        const organizationAssignment = request.assignments.find(
            (assignment) =>
                assignment?.organization ||
                assignment?.organization_id,
        );

        if (organizationAssignment?.organization?.id) {
            return organizationAssignment.organization.id;
        }

        if (organizationAssignment?.organization_id) {
            return organizationAssignment.organization_id;
        }
    }

    return null;
};

const getAssignedOrganizationName = (request) => {
    if (!request) {
        return 'Not assigned';
    }

    if (request.assigned_organization?.name) {
        return request.assigned_organization.name;
    }

    if (typeof request.assigned_organization === 'string') {
        return request.assigned_organization;
    }

    if (request.assignment?.organization?.name) {
        return request.assignment.organization.name;
    }

    if (Array.isArray(request.assignments)) {
        const organizationAssignment = request.assignments.find(
            (assignment) =>
                assignment?.organization ||
                assignment?.organization_id,
        );

        if (organizationAssignment?.organization?.name) {
            return organizationAssignment.organization.name;
        }

        if (organizationAssignment?.organization?.user?.name) {
            return organizationAssignment.organization.user.name;
        }
    }

    return 'Not assigned';
};

const getAssignedVolunteers = (request) => {
    if (!request) {
        return [];
    }

    if (Array.isArray(request.assigned_volunteers)) {
        return request.assigned_volunteers;
    }

    if (Array.isArray(request.volunteers)) {
        return request.volunteers;
    }

    if (Array.isArray(request.assignments)) {
        return request.assignments
            .filter((assignment) => assignment?.volunteer)
            .map((assignment) => assignment.volunteer);
    }

    return [];
};

const ReassignmentForm = ({
    request,
    organizations,
    volunteers,
    loading,
    error,
    onClose,
    onSubmit,
    onOrganizationClick,
}) => {
    const currentOrganizationId = getAssignedOrganizationId(request);
    const currentOrganizationName = getAssignedOrganizationName(request);
    const currentVolunteers = getAssignedVolunteers(request);

    const [organizationId, setOrganizationId] = useState('');
    const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);
    const [assignmentNote, setAssignmentNote] = useState('');

    const eligibleOrganizations = useMemo(() => {
        return (organizations || []).filter(
            (organization) =>
                organization?.verification_status === 'verified' &&
                String(organization.id) !== String(currentOrganizationId),
        );
    }, [organizations, currentOrganizationId]);

    const eligibleVolunteers = useMemo(() => {
        return (volunteers || []).filter((volunteer) => {
            const status = volunteer?.status?.toLowerCase();
            const availability = volunteer?.availability?.toLowerCase();

            return (
                status === 'active' &&
                volunteer?.volunteer_profile?.status === 'approved' &&
                availability === 'available'
            );
        });
    }, [volunteers]);

    const toggleVolunteer = (volunteerId) => {
        setSelectedVolunteerIds((current) => {
            const id = String(volunteerId);

            if (current.includes(id)) {
                return current.filter((item) => item !== id);
            }

            return [...current, id];
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!organizationId && selectedVolunteerIds.length === 0) {
            return;
        }

        onSubmit({
            help_request_id: request.id,
            organization_id: organizationId
                ? Number(organizationId)
                : null,
            volunteer_ids: selectedVolunteerIds.map(Number),
            assignment_note: assignmentNote.trim() || null,
        });
    };

    if (!request) {
        return null;
    }

    const canSubmit =
        !loading &&
        (Boolean(organizationId) || selectedVolunteerIds.length > 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">
                            Reassign Help Request
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Replace the current organization with a new
                            responsible organization or support team.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto"
                >
                    <div className="space-y-6 p-6">
                        {/* Current assignment */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle
                                    size={18}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-amber-900">
                                        Current Assignment
                                    </p>

                                    <div className="mt-3 space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-amber-800">
                                                Organization
                                            </p>

                                            {currentOrganizationId ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onOrganizationClick?.(
                                                            currentOrganizationId,
                                                            request,
                                                        )
                                                    }
                                                    className="group mt-1 inline-flex items-center gap-2 text-left"
                                                >
                                                    <Building2
                                                        size={15}
                                                        className="text-amber-700"
                                                    />

                                                    <span className="text-sm font-semibold text-amber-900 group-hover:underline">
                                                        {
                                                            currentOrganizationName
                                                        }
                                                    </span>
                                                </button>
                                            ) : (
                                                <p className="mt-1 text-sm text-amber-900">
                                                    Not assigned
                                                </p>
                                            )}
                                        </div>

                                        {currentVolunteers.length > 0 && (
                                            <div>
                                                <p className="text-xs font-medium text-amber-800">
                                                    Current Volunteers
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {currentVolunteers.map(
                                                        (volunteer) => (
                                                            <span
                                                                key={
                                                                    volunteer.id
                                                                }
                                                                className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-900"
                                                            >
                                                                <Users
                                                                    size={12}
                                                                />
                                                                {volunteer.name ||
                                                                    volunteer.user
                                                                        ?.name ||
                                                                    'Volunteer'}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Replacement organization */}
                        <div>
                            <label
                                htmlFor="reassignment-organization"
                                className="mb-2 block text-sm font-semibold text-text-primary"
                            >
                                Replacement Organization
                            </label>

                            <div className="relative">
                                <select
                                    id="reassignment-organization"
                                    value={organizationId}
                                    onChange={(event) =>
                                        setOrganizationId(
                                            event.target.value,
                                        )
                                    }
                                    disabled={loading}
                                    className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-3 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                >
                                    <option value="">
                                        Select an organization
                                    </option>

                                    {eligibleOrganizations.map(
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

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                                />
                            </div>

                            {eligibleOrganizations.length === 0 && (
                                <p className="mt-2 text-xs text-text-secondary">
                                    No other verified organizations are
                                    currently available.
                                </p>
                            )}
                        </div>

                        {/* Volunteers */}
                        <div>
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-text-primary">
                                    SP Volunteers
                                </p>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Optional. Select one or more available
                                    volunteers to support the replacement.
                                </p>
                            </div>

                            {eligibleVolunteers.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
                                    <Users
                                        size={22}
                                        className="mx-auto text-text-secondary"
                                    />

                                    <p className="mt-2 text-sm font-medium text-text-primary">
                                        No available volunteers
                                    </p>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        You can continue with an organization
                                        only.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {eligibleVolunteers.map((volunteer) => {
                                        const volunteerId = String(
                                            volunteer.id,
                                        );

                                        const selected =
                                            selectedVolunteerIds.includes(
                                                volunteerId,
                                            );

                                        return (
                                            <button
                                                key={volunteer.id}
                                                type="button"
                                                onClick={() =>
                                                    toggleVolunteer(
                                                        volunteer.id,
                                                    )
                                                }
                                                disabled={loading}
                                                className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                                                    selected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/40 hover:bg-background-alt'
                                                }`}
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                        <Users size={15} />
                                                    </span>

                                                    <span className="min-w-0">
                                                        <span className="block truncate text-sm font-semibold text-text-primary">
                                                            {volunteer.name ||
                                                                volunteer.user
                                                                    ?.name ||
                                                                'Volunteer'}
                                                        </span>

                                                        {volunteer.email && (
                                                            <span className="mt-0.5 block truncate text-xs text-text-secondary">
                                                                {
                                                                    volunteer.email
                                                                }
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>

                                                <span
                                                    className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                        selected
                                                            ? 'border-primary bg-primary text-white'
                                                            : 'border-border'
                                                    }`}
                                                >
                                                    {selected && (
                                                        <Check size={12} />
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Note */}
                        <div>
                            <label
                                htmlFor="reassignment-note"
                                className="mb-2 block text-sm font-semibold text-text-primary"
                            >
                                Reassignment Note
                            </label>

                            <textarea
                                id="reassignment-note"
                                value={assignmentNote}
                                onChange={(event) =>
                                    setAssignmentNote(event.target.value)
                                }
                                disabled={loading}
                                rows={4}
                                placeholder="Explain why this request is being reassigned..."
                                className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Reassigning...' : 'Reassign Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const HelpRequestReassignmentModal = ({
    request,
    open,
    loading = false,
    error = null,
    organizations = [],
    volunteers = [],
    onClose,
    onSubmit,
    onOrganizationClick,
}) => {
    if (!open || !request) {
        return null;
    }

    return (
        <ReassignmentForm
            key={request.id}
            request={request}
            organizations={organizations}
            volunteers={volunteers}
            loading={loading}
            error={error}
            onClose={onClose}
            onSubmit={onSubmit}
            onOrganizationClick={onOrganizationClick}
        />
    );
};

export default HelpRequestReassignmentModal;