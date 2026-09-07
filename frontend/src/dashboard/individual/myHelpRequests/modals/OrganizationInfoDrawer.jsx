import React from 'react';

import { Building2, X } from 'lucide-react';

// =========================================================
// Helpers
// =========================================================

const normalizeAssignmentStatus = (status) => {
    return String(status || '')
        .trim()
        .toLowerCase();
};

const getAssignmentStatusLabel = (status) => {
    switch (normalizeAssignmentStatus(status)) {
        case 'pending':
            return 'Pending';

        case 'assigned':
            return 'Assigned';

        case 'accepted':
            return 'Accepted';

        case 'active':
            return 'Active';

        case 'in_progress':
            return 'In Progress';

        case 'completed':
            return 'Completed';

        case 'rejected':
            return 'Rejected';

        case 'withdrawn':
            return 'Withdrawn';

        default:
            return status || 'Unknown';
    }
};

const getAssignmentDate = (assignment) => {
    const date =
        assignment?.assigned_at ||
        assignment?.created_at ||
        assignment?.updated_at;

    if (!date) {
        return '—';
    }

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const getWithdrawalDate = (assignment) => {
    const date =
        assignment?.withdrawal_reviewed_at ||
        assignment?.withdrawal_requested_at;

    if (!date) {
        return null;
    }

    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// =========================================================
// Component
// =========================================================

const OrganizationInfoDrawer = ({
    isOpen,
    organization,
    currentAssignment,
    assignments = [],
    onClose,
}) => {
    if (!isOpen || !organization) {
        return null;
    }

    const sortedAssignments = [...assignments].sort((a, b) => {
        const first = a?.assigned_at ? new Date(a.assigned_at).getTime() : 0;

        const second = b?.assigned_at ? new Date(b.assigned_at).getTime() : 0;

        return second - first;
    });

    return (
        <>
            {/* Backdrop */}

            <button
                type="button"
                aria-label="Close organization details"
                onClick={onClose}
                className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px]"
            />

            {/* Drawer */}

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Organization information"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-white shadow-2xl"
            >
                {/* Header */}

                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Building2 size={18} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Assigned organization
                                </p>

                                <h2 className="mt-0.5 truncate text-lg font-bold text-text-primary">
                                    {organization.name || 'Organization'}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="ml-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                    >
                        <X size={18} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto">
                    <div className="space-y-6 p-6">
                        {/* Organization information */}

                        <section>
                            <div className="mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Organization
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-text-primary">
                                    Basic information
                                </h3>
                            </div>

                            <div className="divide-y divide-border rounded-xl border border-border bg-background-alt/40">
                                <div className="px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                        Name
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-text-primary">
                                        {organization.name || 'Not specified'}
                                    </p>
                                </div>

                                {organization.organization_type && (
                                    <div className="px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                            Organization type
                                        </p>

                                        <p className="mt-1 text-sm font-medium capitalize text-text-primary">
                                            {organization.organization_type}
                                        </p>
                                    </div>
                                )}

                                {organization.email && (
                                    <div className="px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                            Email
                                        </p>

                                        <p className="mt-1 break-all text-sm font-medium text-text-primary">
                                            {organization.email}
                                        </p>
                                    </div>
                                )}

                                {organization.phone && (
                                    <div className="px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                            Phone
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {organization.phone}
                                        </p>
                                    </div>
                                )}

                                {organization.address && (
                                    <div className="px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                            Address
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {organization.address}
                                        </p>
                                    </div>
                                )}

                                {organization.description && (
                                    <div className="px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                            About
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                                            {organization.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Current assignment */}

                        <section>
                            <div className="mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Current support
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-text-primary">
                                    Assignment status
                                </h3>
                            </div>

                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-800">
                                            {getAssignmentStatusLabel(
                                                currentAssignment?.status,
                                            )}
                                        </p>

                                        <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                                            Assigned on{' '}
                                            {getAssignmentDate(
                                                currentAssignment,
                                            )}
                                        </p>
                                    </div>

                                    {currentAssignment?.withdrawal_status ===
                                        'pending' && (
                                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                                            Withdrawal pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Assignment history */}

                        <section>
                            <div className="mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                                    History
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-text-primary">
                                    Assignment history
                                </h3>
                            </div>

                            {sortedAssignments.length > 0 ? (
                                <div className="space-y-3">
                                    {sortedAssignments.map((assignment) => {
                                        const isCurrent =
                                            assignment?.id ===
                                            currentAssignment?.id;

                                        const withdrawalDate =
                                            getWithdrawalDate(assignment);

                                        return (
                                            <div
                                                key={
                                                    assignment?.id ||
                                                    `${assignment?.organization_id}-${assignment?.assigned_at}`
                                                }
                                                className={`rounded-xl border p-4 ${
                                                    isCurrent
                                                        ? 'border-primary/20 bg-primary/5'
                                                        : 'border-border bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-text-primary">
                                                            {assignment
                                                                ?.organization
                                                                ?.name ||
                                                                'Organization'}
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-text-secondary">
                                                            Assigned{' '}
                                                            {getAssignmentDate(
                                                                assignment,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${
                                                            normalizeAssignmentStatus(
                                                                assignment?.status,
                                                            ) === 'withdrawn'
                                                                ? 'bg-slate-100 text-slate-600'
                                                                : normalizeAssignmentStatus(
                                                                        assignment?.status,
                                                                    ) ===
                                                                    'rejected'
                                                                  ? 'bg-red-50 text-red-700'
                                                                  : isCurrent
                                                                    ? 'bg-primary/10 text-primary'
                                                                    : 'bg-slate-100 text-slate-600'
                                                        }`}
                                                    >
                                                        {getAssignmentStatusLabel(
                                                            assignment?.status,
                                                        )}
                                                    </span>
                                                </div>

                                                {assignment?.withdrawal_status && (
                                                    <div className="mt-3 border-t border-border/70 pt-3">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                                                Withdrawal
                                                            </span>

                                                            <span className="text-[10px] font-bold capitalize text-text-primary">
                                                                {
                                                                    assignment.withdrawal_status
                                                                }
                                                            </span>
                                                        </div>

                                                        {assignment?.withdrawal_reason && (
                                                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                                {
                                                                    assignment.withdrawal_reason
                                                                }
                                                            </p>
                                                        )}

                                                        {withdrawalDate && (
                                                            <p className="mt-2 text-[10px] text-text-secondary">
                                                                {assignment.withdrawal_status ===
                                                                'approved'
                                                                    ? 'Reviewed'
                                                                    : 'Requested'}{' '}
                                                                on{' '}
                                                                {withdrawalDate}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {assignment?.rejection_note && (
                                                    <div className="mt-3 border-t border-border/70 pt-3">
                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                                            Rejection note
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                            {
                                                                assignment.rejection_note
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
                                    <p className="text-xs font-medium text-text-secondary">
                                        No assignment history available.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Additional support */}

                        <section>
                            <div className="mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Additional support
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-text-primary">
                                    Support activity
                                </h3>
                            </div>

                            <div className="rounded-xl border border-dashed border-border bg-background-alt/40 px-4 py-5">
                                <p className="text-xs font-medium leading-5 text-text-secondary">
                                    Additional support activity will appear here
                                    when support is added to this help request.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}

                <div className="border-t border-border bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-background-alt"
                    >
                        Close
                    </button>
                </div>
            </aside>
        </>
    );
};

export default OrganizationInfoDrawer;
