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
// Contact Item
// =========================================================

const ContactItem = ({ icon: Icon, label, value }) => {
    if (!value) {
        return null;
    }

    return (
        <div className="flex min-w-0 gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf5f3] text-[#0f766e]">
                <Icon size={15} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {label}
                </p>

                <p className="mt-1.5 break-words text-[12px] font-medium leading-5 text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
};

// =========================================================
// Section Label
// =========================================================

const SectionLabel = ({ children }) => {
    return (
        <div className="mb-5 flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-[#0f766e]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {children}
            </span>
        </div>
    );
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
                className="fixed inset-0 z-40 cursor-default bg-slate-950/35 backdrop-blur-[3px]"
            />

            {/* =====================================================
                DRAWER
            ====================================================== */}

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Organization information"
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col overflow-hidden border-l border-slate-200/80 bg-[#f8faf9] shadow-[-24px_0_70px_rgba(15,23,42,0.16)]"
            >
                {/* =================================================
                    ORGANIZATION HEADER
                ================================================== */}

                <header className="relative shrink-0 overflow-hidden border-b border-[#dceae6] bg-[#e9f4f1]">
                    {/* Decorative background */}

                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[32px] border-[#0f766e]/[0.045]" />

                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full border-[24px] border-[#f59e0b]/[0.045]" />

                    <div className="relative px-6 pb-7 pt-5 sm:px-8">
                        {/* Utility row */}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#0f766e] shadow-sm">
                                    <Building2 size={14} strokeWidth={1.8} />
                                </span>

                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                    Organization profile
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#cfe2dd] bg-white/80 text-slate-400 transition-all hover:border-[#a9cbc2] hover:bg-white hover:text-[#0f766e] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
                            >
                                <X size={16} strokeWidth={1.8} />
                            </button>
                        </div>

                        {/* Identity */}

                        <div className="mt-8 flex items-center gap-4">
                            <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[22px] border border-white bg-white text-[#0f766e] shadow-[0_10px_24px_rgba(15,118,110,0.1)]">
                                <div className="absolute inset-2.5 rounded-[15px] border border-[#0f766e]/10" />

                                <Building2 size={30} strokeWidth={1.5} />
                            </div>

                            <div className="min-w-0">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]/70">
                                    Support organization
                                </p>

                                <h2 className="text-[22px] font-bold leading-[1.15] tracking-[-0.035em] text-slate-900">
                                    {organization.name}
                                </h2>

                                {organization.type && (
                                    <p className="mt-2 text-[12px] font-medium text-slate-500">
                                        {organization.type}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Header metadata */}

                        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-[#cfe2dd] pt-4">
                            {organization.address && (
                                <div className="flex min-w-0 items-center gap-2">
                                    <MapPin
                                        size={13}
                                        className="shrink-0 text-[#0f766e]/70"
                                        strokeWidth={1.8}
                                    />

                                    <span className="truncate text-[10px] font-medium text-slate-500">
                                        {organization.address}
                                    </span>
                                </div>
                            )}

                            {organization.phone && (
                                <div className="flex shrink-0 items-center gap-2">
                                    <Phone
                                        size={12}
                                        className="text-[#0f766e]/70"
                                        strokeWidth={1.8}
                                    />

                                    <span className="text-[10px] font-medium text-slate-500">
                                        Contact available
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* =================================================
                    BODY
                ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="px-6 py-6 sm:px-7">
                        {/* =================================================
                            CURRENT ASSIGNMENT
                        ================================================== */}

                        <section>
                            <SectionLabel>Current assignment</SectionLabel>

                            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${currentStatus.bg} ${currentStatus.text}`}
                                    >
                                        <CurrentStatusIcon
                                            size={16}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-800">
                                            {getAssignmentStatusLabel(
                                                currentAssignment?.status,
                                            )}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1.5">
                                            <CalendarDays
                                                size={10}
                                                className="text-slate-400"
                                                strokeWidth={1.8}
                                            />

                                            <span className="text-[9px] text-slate-400">
                                                {getAssignmentDate(
                                                    currentAssignment,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <span
                                    className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
                                />
                            </div>
                        </section>

                        {/* =================================================
                            ORGANIZATION DETAILS
                        ================================================== */}

                        <section className="mt-7">
                            <SectionLabel>
                                Organization information
                            </SectionLabel>

                            <div className="grid grid-cols-2 gap-x-7 gap-y-6">
                                <ContactItem
                                    icon={Phone}
                                    label="Phone"
                                    value={organization.phone}
                                />

                                <ContactItem
                                    icon={Mail}
                                    label="Email"
                                    value={organization.email}
                                />

                                <div className="col-span-2">
                                    <ContactItem
                                        icon={MapPin}
                                        label="Address"
                                        value={organization.address}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            ASSIGNMENT HISTORY
                        ================================================== */}

                        <section className="mt-8">
                            <SectionLabel>Assignment history</SectionLabel>

                            {sortedAssignments.length > 0 ? (
                                <div className="overflow-hidden border-y border-slate-200">
                                    {sortedAssignments.map(
                                        (assignment, index) => {
                                            const visual = getStatusVisual(
                                                assignment?.status,
                                            );

                                            const StatusIcon = visual.icon;

                                            const withdrawalDate =
                                                getWithdrawalDate(assignment);

                                            return (
                                                <div
                                                    key={
                                                        assignment?.id ?? index
                                                    }
                                                    className={`flex items-center gap-3.5 py-4 ${
                                                        index <
                                                        sortedAssignments.length -
                                                            1
                                                            ? 'border-b border-slate-200'
                                                            : ''
                                                    }`}
                                                >
                                                    {/* Status indicator */}

                                                    <div className="flex w-5 shrink-0 justify-center">
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${visual.dot}`}
                                                        />
                                                    </div>

                                                    {/* Date */}

                                                    <div className="w-[72px] shrink-0">
                                                        <p className="text-[10px] font-semibold text-slate-600">
                                                            {getAssignmentDate(
                                                                assignment,
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Status */}

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <StatusIcon
                                                                size={12}
                                                                className={
                                                                    visual.text
                                                                }
                                                                strokeWidth={
                                                                    1.9
                                                                }
                                                            />

                                                            <span
                                                                className={`text-[11px] font-semibold ${visual.text}`}
                                                            >
                                                                {getAssignmentStatusLabel(
                                                                    assignment?.status,
                                                                )}
                                                            </span>
                                                        </div>

                                                        {withdrawalDate && (
                                                            <p className="mt-1 text-[9px] text-slate-400">
                                                                Withdrawal
                                                                reviewed{' '}
                                                                {withdrawalDate}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            ) : (
                                <div className="border-y border-slate-200 py-5">
                                    <p className="text-[10px] font-medium text-slate-400">
                                        No assignment history available.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <footer className="shrink-0 border-t border-slate-200/80 bg-white px-6 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 w-full rounded-xl bg-[#0f766e] text-[11px] font-bold text-white shadow-[0_4px_12px_rgba(15,118,110,0.15)] transition-all hover:bg-[#115e59] hover:shadow-[0_6px_16px_rgba(15,118,110,0.2)] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/10"
                    >
                        Close
                    </button>
                </footer>
            </aside>
        </>
    );
};

export default OrganizationInfoDrawer;
