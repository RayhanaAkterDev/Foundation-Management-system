import React from 'react';

import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Mail,
    MapPin,
    Phone,
    X,
    XCircle,
} from 'lucide-react';

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

const getStatusVisual = (status) => {
    const normalized = normalizeAssignmentStatus(status);

    switch (normalized) {
        case 'accepted':
        case 'active':
        case 'in_progress':
        case 'completed':
            return {
                icon: CheckCircle2,
                dot: 'bg-emerald-500',
                text: 'text-emerald-700',
                bg: 'bg-emerald-50',
            };

        case 'rejected':
            return {
                icon: XCircle,
                dot: 'bg-red-500',
                text: 'text-red-700',
                bg: 'bg-red-50',
            };

        case 'pending':
            return {
                icon: Clock3,
                dot: 'bg-amber-500',
                text: 'text-amber-700',
                bg: 'bg-amber-50',
            };

        default:
            return {
                icon: Clock3,
                dot: 'bg-slate-400',
                text: 'text-slate-600',
                bg: 'bg-slate-100',
            };
    }
};

// =========================================================
// Small Components
// =========================================================

const ContactRow = ({ icon: Icon, label, value }) => {
    if (!value) {
        return null;
    }

    return (
        <div className="group flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-slate-200/80 bg-slate-50 text-slate-500 transition-all duration-200 group-hover:border-primary/15 group-hover:bg-primary/[0.06] group-hover:text-primary">
                <Icon size={14} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 pt-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-[11px] font-semibold leading-5 text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
};

const SectionLabel = ({ eyebrow, title }) => (
    <div className="mb-5">
        <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
            </p>
        </div>

        <h3 className="mt-1.5 text-[16px] font-bold tracking-[-0.025em] text-slate-900">
            {title}
        </h3>
    </div>
);

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

    const currentStatus = getStatusVisual(currentAssignment?.status);
    const CurrentStatusIcon = currentStatus.icon;

    return (
        <>
            {/* =====================================================
                BACKDROP
            ====================================================== */}

            <button
                type="button"
                aria-label="Close organization details"
                onClick={onClose}
                className="fixed inset-0 z-40 cursor-default bg-slate-950/45 backdrop-blur-[3px]"
            />

            {/* =====================================================
                DRAWER
            ====================================================== */}

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Organization information"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col overflow-hidden border-l border-slate-200/70 bg-[#f4f7f6] shadow-[-24px_0_80px_rgba(15,23,42,0.18)]"
            >
                {/* =================================================
                    HEADER
                ================================================== */}

                <header className="shrink-0 border-b border-slate-200/80 bg-white">
                    <div className="h-[3px] bg-primary" />

                    <div className="px-6 pb-6 pt-5 sm:px-7">
                        {/* Top bar */}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                                    <Building2 size={14} strokeWidth={1.8} />
                                </span>

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Organization
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10"
                            >
                                <X size={16} strokeWidth={1.8} />
                            </button>
                        </div>

                        {/* Organization identity */}

                        <div className="mt-7 flex items-center gap-4">
                            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[17px] bg-primary/[0.09] text-primary ring-1 ring-primary/[0.08]">
                                <Building2 size={27} strokeWidth={1.55} />
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-[23px] font-bold tracking-[-0.035em] text-slate-950">
                                    {organization.name || 'Organization'}
                                </h2>

                                {organization.organization_type && (
                                    <p className="mt-1.5 text-[10px] font-medium capitalize text-slate-400">
                                        {organization.organization_type}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Current assignment status */}

                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
                                />

                                <span
                                    className={`text-[10px] font-bold uppercase tracking-[0.1em] ${currentStatus.text}`}
                                >
                                    {getAssignmentStatusLabel(
                                        currentAssignment?.status,
                                    )}
                                </span>
                            </div>

                            <span className="text-[9px] font-medium text-slate-400">
                                Current assignment
                            </span>
                        </div>
                    </div>
                </header>

                {/* =================================================
                    BODY
                ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="px-6 py-7 sm:px-7">
                        {/* =================================================
                            ABOUT ORGANIZATION
                        ================================================== */}

                        <section>
                            <SectionLabel
                                eyebrow="About"
                                title="Organization details"
                            />

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <ContactRow
                                    icon={Mail}
                                    label="Email"
                                    value={organization.email}
                                />

                                <ContactRow
                                    icon={Phone}
                                    label="Phone"
                                    value={organization.phone}
                                />

                                <ContactRow
                                    icon={MapPin}
                                    label="Address"
                                    value={organization.address}
                                />
                            </div>

                            {organization.description && (
                                <div className="mt-7 border-t border-slate-200/80 pt-6">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        About the organization
                                    </p>

                                    <p className="mt-2.5 max-w-[450px] text-[12px] leading-6 text-slate-500">
                                        {organization.description}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* =================================================
                            CURRENT ASSIGNMENT
                        ================================================== */}

                        <section className="mt-10">
                            <SectionLabel
                                eyebrow="Current support"
                                title="Assignment"
                            />

                            <div className="relative overflow-hidden rounded-[18px] border border-slate-200/80 bg-white">
                                {/* Status rail */}

                                <div
                                    className={`absolute inset-y-0 left-0 w-[3px] ${currentStatus.dot}`}
                                />

                                <div className="px-5 py-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${currentStatus.bg}`}
                                            >
                                                <CurrentStatusIcon
                                                    size={17}
                                                    strokeWidth={1.8}
                                                    className={
                                                        currentStatus.text
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-bold text-slate-800">
                                                    {getAssignmentStatusLabel(
                                                        currentAssignment?.status,
                                                    )}
                                                </p>

                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <CalendarDays
                                                        size={11}
                                                        className="text-slate-400"
                                                    />

                                                    <p className="text-[9px] text-slate-400">
                                                        Assigned{' '}
                                                        {getAssignmentDate(
                                                            currentAssignment,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {currentAssignment?.withdrawal_status ===
                                            'pending' && (
                                            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-amber-700">
                                                Withdrawal pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            ASSIGNMENT HISTORY
                        ================================================== */}

                        <section className="mt-10">
                            <SectionLabel
                                eyebrow="Timeline"
                                title="Assignment history"
                            />

                            {sortedAssignments.length > 0 ? (
                                <div className="relative">
                                    {/* Timeline line */}

                                    <div className="absolute bottom-4 left-[6px] top-3 w-px bg-slate-200" />

                                    <div className="space-y-6">
                                        {sortedAssignments.map((assignment) => {
                                            const isCurrent =
                                                assignment?.id ===
                                                currentAssignment?.id;

                                            const normalizedStatus =
                                                normalizeAssignmentStatus(
                                                    assignment?.status,
                                                );

                                            const statusVisual =
                                                getStatusVisual(
                                                    assignment?.status,
                                                );

                                            const StatusIcon =
                                                statusVisual.icon;

                                            const withdrawalDate =
                                                getWithdrawalDate(assignment);

                                            return (
                                                <div
                                                    key={
                                                        assignment?.id ||
                                                        `${assignment?.organization_id}-${assignment?.assigned_at}`
                                                    }
                                                    className="relative pl-7"
                                                >
                                                    {/* Timeline node */}

                                                    <div
                                                        className={`absolute left-0 top-1.5 flex h-[13px] w-[13px] items-center justify-center rounded-full border-[3px] border-[#f4f7f6] ${statusVisual.dot}`}
                                                    />

                                                    <div
                                                        className={`rounded-[17px] border ${
                                                            isCurrent
                                                                ? 'border-primary/[0.16] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.045)]'
                                                                : 'border-slate-200/70 bg-white/55'
                                                        }`}
                                                    >
                                                        <div className="px-4 py-4">
                                                            {/* Assignment heading */}

                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="truncate text-[11px] font-bold text-slate-800">
                                                                            {assignment
                                                                                ?.organization
                                                                                ?.name ||
                                                                                'Organization'}
                                                                        </p>

                                                                        {isCurrent && (
                                                                            <span className="shrink-0 rounded-full bg-primary/[0.08] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-primary">
                                                                                Current
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <p className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-400">
                                                                        <CalendarDays
                                                                            size={
                                                                                10
                                                                            }
                                                                        />

                                                                        {getAssignmentDate(
                                                                            assignment,
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <span
                                                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold ${
                                                                        normalizedStatus ===
                                                                        'withdrawn'
                                                                            ? 'bg-slate-100 text-slate-600'
                                                                            : normalizedStatus ===
                                                                                'rejected'
                                                                              ? 'bg-red-50 text-red-700'
                                                                              : isCurrent
                                                                                ? 'bg-primary/[0.09] text-primary'
                                                                                : 'bg-slate-100 text-slate-600'
                                                                    }`}
                                                                >
                                                                    {getAssignmentStatusLabel(
                                                                        assignment?.status,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {/* Withdrawal */}

                                                            {assignment?.withdrawal_status && (
                                                                <div className="mt-4 border-t border-slate-100 pt-3">
                                                                    <div className="flex items-center justify-between gap-3">
                                                                        <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                                                            Withdrawal
                                                                        </span>

                                                                        <span className="text-[9px] font-semibold capitalize text-slate-600">
                                                                            {
                                                                                assignment.withdrawal_status
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    {assignment?.withdrawal_reason && (
                                                                        <p className="mt-2 text-[10px] leading-5 text-slate-500">
                                                                            {
                                                                                assignment.withdrawal_reason
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    {withdrawalDate && (
                                                                        <p className="mt-2 flex items-center gap-1.5 text-[8px] text-slate-400">
                                                                            <CalendarDays
                                                                                size={
                                                                                    10
                                                                                }
                                                                            />
                                                                            {assignment.withdrawal_status ===
                                                                            'approved'
                                                                                ? 'Reviewed'
                                                                                : 'Requested'}{' '}
                                                                            on{' '}
                                                                            {
                                                                                withdrawalDate
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Rejection */}

                                                            {assignment?.rejection_note && (
                                                                <div className="mt-4 border-t border-red-100/80 pt-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <XCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                            className="text-red-500"
                                                                        />

                                                                        <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-red-600">
                                                                            Rejection
                                                                        </span>
                                                                    </div>

                                                                    <p className="mt-2 text-[10px] leading-5 text-slate-500">
                                                                        {
                                                                            assignment.rejection_note
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-slate-200/80 py-8 text-center">
                                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                        <Clock3
                                            size={16}
                                            className="text-slate-400"
                                        />
                                    </div>

                                    <p className="mt-3 text-[10px] font-medium text-slate-500">
                                        No assignment history available.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* =================================================
                            ADDITIONAL SUPPORT
                        ================================================== */}

                        <section className="mt-10">
                            <SectionLabel
                                eyebrow="Support"
                                title="Additional activity"
                            />

                            <div className="flex items-start gap-3.5 border-t border-slate-200/80 pt-5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/[0.08] text-primary">
                                    <Building2 size={15} strokeWidth={1.7} />
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold text-slate-700">
                                        Support activity
                                    </p>

                                    <p className="mt-1.5 max-w-[390px] text-[10px] leading-5 text-slate-400">
                                        Additional support activity will appear
                                        here when support is added to this help
                                        request.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <footer className="shrink-0 border-t border-slate-200/80 bg-white px-6 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 w-full rounded-xl bg-slate-900 text-[11px] font-bold text-white transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                    >
                        Close
                    </button>
                </footer>
            </aside>
        </>
    );
};

export default OrganizationInfoDrawer;
