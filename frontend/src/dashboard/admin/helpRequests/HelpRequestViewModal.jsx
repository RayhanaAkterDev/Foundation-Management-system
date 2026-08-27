import React from 'react';

import {
    X,
    MapPin,
    Tag,
    Clock3,
    FileText,
    Hash,
    ShieldCheck,
    RefreshCw,
    CalendarDays,
    Building2,
    UserRound,
    Users,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const HelpRequestViewModal = ({ request, loading, error, onClose }) => {
    if (!request && !loading && !error) {
        return null;
    }

    /* ============================================================
       HELPERS
       ============================================================ */

    const formatDate = (date, includeTime = false) => {
        if (!date) {
            return 'Not provided';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Not provided';
        }

        return parsedDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            ...(includeTime && {
                hour: 'numeric',
                minute: '2-digit',
            }),
        });
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'Not provided';
        }

        return String(value)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getUrgencyStyle = (urgency) => {
        if (!urgency) {
            return {
                wrapper: 'bg-slate-50 border-slate-200',
                icon: 'bg-white text-slate-400',
                text: 'text-slate-600',
            };
        }

        const normalized = String(urgency).toLowerCase();

        if (
            normalized.includes('critical') ||
            normalized.includes('emergency')
        ) {
            return {
                wrapper: 'bg-red-50 border-red-200',
                icon: 'bg-red-100 text-red-600',
                text: 'text-red-700',
            };
        }

        if (normalized.includes('high')) {
            return {
                wrapper: 'bg-orange-50 border-orange-200',
                icon: 'bg-orange-100 text-orange-600',
                text: 'text-orange-700',
            };
        }

        if (normalized.includes('medium')) {
            return {
                wrapper: 'bg-amber-50 border-amber-200',
                icon: 'bg-amber-100 text-amber-600',
                text: 'text-amber-700',
            };
        }

        if (normalized.includes('low')) {
            return {
                wrapper: 'bg-emerald-50 border-emerald-200',
                icon: 'bg-emerald-100 text-emerald-600',
                text: 'text-emerald-700',
            };
        }

        return {
            wrapper: 'bg-slate-50 border-slate-200',
            icon: 'bg-white text-slate-400',
            text: 'text-slate-600',
        };
    };

    /* ============================================================
       ASSIGNMENT HELPERS
       ============================================================ */

    const getAssignments = (helpRequest) => {
        if (!helpRequest) {
            return [];
        }

        if (Array.isArray(helpRequest.assignments)) {
            return helpRequest.assignments;
        }

        if (Array.isArray(helpRequest.help_request_assignments)) {
            return helpRequest.help_request_assignments;
        }

        if (helpRequest.assignment) {
            return [helpRequest.assignment];
        }

        return [];
    };

    const assignments = getAssignments(request);

    const activeAssignments = assignments.filter((assignment) => {
        const assignmentStatus = String(assignment?.status || '')
            .trim()
            .toLowerCase();

        return ['assigned', 'accepted', 'in_progress'].includes(
            assignmentStatus,
        );
    });

    const hasAssignment = activeAssignments.length > 0;

    /* ============================================================
       ASSIGNED ORGANIZATIONS
       ============================================================ */

    const organizationNames = [
        ...new Set(
            activeAssignments
                .filter((assignment) => assignment?.organization)
                .map((assignment) => {
                    return (
                        assignment.organization.name ||
                        assignment.organization.organization_name ||
                        assignment.organization.title
                    );
                })
                .filter(Boolean),
        ),
    ];

    const directOrganizationNames = [
        ...new Set(
            activeAssignments
                .map(
                    (assignment) =>
                        assignment?.organization_name ||
                        assignment?.organizationName,
                )
                .filter(Boolean),
        ),
    ];

    const allOrganizationNames = [
        ...new Set([...organizationNames, ...directOrganizationNames]),
    ];

    /* ============================================================
       ASSIGNED VOLUNTEERS
       ============================================================ */

    const volunteerNames = [
        ...new Set(
            activeAssignments
                .map((assignment) => {
                    if (assignment?.volunteer?.name) {
                        return assignment.volunteer.name;
                    }

                    if (assignment?.volunteer?.user?.name) {
                        return assignment.volunteer.user.name;
                    }

                    if (assignment?.volunteer_name) {
                        return assignment.volunteer_name;
                    }

                    if (assignment?.volunteerName) {
                        return assignment.volunteerName;
                    }

                    return null;
                })
                .filter(Boolean),
        ),
    ];

    const directVolunteerNames = [
        ...new Set(
            activeAssignments
                .map((assignment) => {
                    if (assignment?.volunteer_user?.name) {
                        return assignment.volunteer_user.name;
                    }

                    if (assignment?.user?.name) {
                        return assignment.user.name;
                    }

                    return null;
                })
                .filter(Boolean),
        ),
    ];

    const allVolunteerNames = [
        ...new Set([...volunteerNames, ...directVolunteerNames]),
    ];

    const urgencyStyle = getUrgencyStyle(request?.urgency);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md sm:p-6">
            {/* Backdrop */}

            <div
                className="absolute inset-0"
                onClick={!loading ? onClose : undefined}
            />

            {/* Modal */}

            <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)]">
                {/* ==================================================
                    HEADER
                    ================================================== */}

                <header className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-white">
                    {/* Accent line */}

                    <div className="absolute inset-x-0 top-0 h-0.75 bg-primary" />

                    <div className="px-6 pb-6 pt-7 sm:px-8">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close"
                        >
                            <X size={18} strokeWidth={1.8} />
                        </button>

                        <div className="max-w-3xl pr-10">
                            {/* Eyebrow */}

                            <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText size={15} strokeWidth={1.9} />
                                </span>

                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                    Help request
                                </span>

                                {request?.id && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                                        <span className="font-mono text-[10px] font-medium text-slate-400">
                                            #{request.id}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Title */}

                            <h2 className="mt-4 text-[23px] font-bold leading-tight tracking-tight text-slate-900 sm:text-[26px]">
                                {request?.title || 'Request details'}
                            </h2>

                            {/* Status row */}

                            {request && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    {request.status && (
                                        <StatusBadge status={request.status} />
                                    )}

                                    {request.verification_status && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                            <ShieldCheck size={13} />

                                            {formatValue(
                                                request.verification_status,
                                            )}
                                        </span>
                                    )}

                                    {hasAssignment && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-inset ring-primary/20">
                                            <Users size={13} />
                                            Assigned
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ==================================================
                    CONTENT
                    ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f8f7]">
                    {/* Loading */}

                    {loading && (
                        <div className="flex min-h-105 flex-col items-center justify-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                            </div>

                            <p className="mt-4 text-sm font-semibold text-slate-800">
                                Loading request
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Please wait a moment.
                            </p>
                        </div>
                    )}

                    {/* Error */}

                    {!loading && error && (
                        <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
                            <div className="border-l-4 border-red-500 bg-white px-5 py-5 shadow-sm ring-1 ring-red-100">
                                <p className="text-sm font-bold text-red-700">
                                    Unable to load this request
                                </p>

                                <p className="mt-1.5 text-sm leading-6 text-red-600">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Request */}

                    {!loading && !error && request && (
                        <div className="mx-auto max-w-5xl">
                            {/* ==================================================
                                QUICK INFORMATION
                                ================================================== */}

                            <section className="border-b border-slate-200 bg-white">
                                <div className="grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
                                    <InfoCell
                                        icon={Tag}
                                        label="Category"
                                        value={formatValue(request.category)}
                                        accent="teal"
                                    />

                                    <InfoCell
                                        icon={Clock3}
                                        label="Urgency"
                                        value={formatValue(request.urgency)}
                                        accent="urgency"
                                        urgencyStyle={urgencyStyle}
                                    />

                                    <InfoCell
                                        icon={MapPin}
                                        label="Location"
                                        value={
                                            request.location ||
                                            request.address ||
                                            'Not provided'
                                        }
                                        accent="blue"
                                    />

                                    <InfoCell
                                        icon={Hash}
                                        label="Request ID"
                                        value={
                                            request.id
                                                ? `#${request.id}`
                                                : 'Not provided'
                                        }
                                        accent="slate"
                                    />
                                </div>
                            </section>

                            {/* ==================================================
                                ASSIGNMENT
                                ================================================== */}

                            <section className="border-b border-slate-200 bg-white px-6 py-7 sm:px-8">
                                <SectionHeading
                                    icon={Users}
                                    eyebrow="Coordination"
                                    title="Assignment"
                                />

                                {!hasAssignment ? (
                                    <div className="mt-5 flex items-center gap-4 border border-dashed border-slate-300 bg-slate-50 px-5 py-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
                                            <Users size={17} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">
                                                Not assigned
                                            </p>

                                            <p className="mt-0.5 text-xs leading-5 text-slate-500">
                                                No active organization or
                                                volunteer assignment has been
                                                made for this request.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-5 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                        <AssignmentRow
                                            icon={Building2}
                                            label="Assigned organization"
                                            names={allOrganizationNames}
                                            emptyText="No organization assigned"
                                        />

                                        <AssignmentRow
                                            icon={UserRound}
                                            label="Assigned volunteer(s)"
                                            names={allVolunteerNames}
                                            emptyText="No volunteer assigned"
                                        />
                                    </div>
                                )}

                                {hasAssignment &&
                                    allOrganizationNames.length === 0 &&
                                    allVolunteerNames.length === 0 && (
                                        <div className="mt-4 border-l-2 border-slate-300 bg-slate-50 px-4 py-3">
                                            <p className="text-xs font-medium leading-5 text-slate-500">
                                                Assignment exists, but detailed
                                                organization/volunteer
                                                information was not included in
                                                the response.
                                            </p>
                                        </div>
                                    )}
                            </section>

                            {/* ==================================================
                                DETAILS + SIDEBAR
                                ================================================== */}

                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_270px]">
                                {/* Main */}

                                <main className="bg-white px-6 py-8 sm:px-8 lg:border-r lg:border-slate-200">
                                    <div className="max-w-2xl">
                                        <div className="flex items-center justify-between">
                                            <SectionHeading
                                                icon={FileText}
                                                eyebrow="Request details"
                                                title="Description"
                                            />

                                            <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                                                Full description
                                            </span>
                                        </div>

                                        <div className="relative mt-6 overflow-hidden border border-slate-200 bg-slate-50/70 px-6 py-6">
                                            <div className="absolute bottom-0 left-0 top-0 w-0.75 bg-primary" />

                                            <p className="whitespace-pre-line text-[15px] leading-8 text-slate-700">
                                                {request.description ||
                                                    request.details ||
                                                    'No description provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </main>

                                {/* ==================================================
                                    SIDEBAR
                                    ================================================== */}

                                <aside className="border-t border-slate-200 bg-[#f8faf9] px-6 py-7 lg:border-t-0 lg:px-6">
                                    {/* Current State */}

                                    {(request.status ||
                                        request.verification_status) && (
                                        <div className="pb-7">
                                            <SideHeading
                                                title="Current state"
                                                icon={ShieldCheck}
                                            />

                                            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                                                {request.status && (
                                                    <SideStatus
                                                        icon={RefreshCw}
                                                        label="Status"
                                                        value={
                                                            <StatusBadge
                                                                status={
                                                                    request.status
                                                                }
                                                            />
                                                        }
                                                    />
                                                )}

                                                {request.verification_status && (
                                                    <SideStatus
                                                        icon={ShieldCheck}
                                                        label="Verification"
                                                        value={
                                                            <StatusBadge
                                                                status={
                                                                    request.verification_status
                                                                }
                                                            />
                                                        }
                                                        success
                                                    />
                                                )}

                                                <SideStatus
                                                    icon={Users}
                                                    label="Assignment"
                                                    value={
                                                        hasAssignment ? (
                                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-inset ring-primary/20">
                                                                Assigned
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-inset ring-slate-200">
                                                                Not assigned
                                                            </span>
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline */}

                                    <div className="border-t border-slate-200 pt-7">
                                        <SideHeading
                                            title="Timeline"
                                            icon={CalendarDays}
                                        />

                                        <div className="relative mt-5 pl-5">
                                            <div className="absolute bottom-3 left-1.25 top-2 w-px bg-slate-200" />

                                            <TimelineItem
                                                label="Submitted"
                                                value={formatDate(
                                                    request.created_at,
                                                    true,
                                                )}
                                                active
                                            />

                                            <TimelineItem
                                                label="Last updated"
                                                value={formatDate(
                                                    request.updated_at,
                                                    true,
                                                )}
                                            />

                                            {request.verified_at && (
                                                <TimelineItem
                                                    label="Verified"
                                                    value={formatDate(
                                                        request.verified_at,
                                                        true,
                                                    )}
                                                    last
                                                    active
                                                />
                                            )}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    )}
                </div>

                {/* ==================================================
                    FOOTER
                    ================================================== */}

                <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4 sm:px-7">
                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                        <p className="text-[11px] font-medium text-slate-400">
                            Help request details
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="ml-auto rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Done
                    </button>
                </footer>
            </div>
        </div>
    );
};

/* ================================================================
   INFO CELL
   ================================================================ */

const InfoCell = ({ icon: Icon, label, value, accent, urgencyStyle }) => {
    const styles = {
        teal: {
            icon: 'bg-primary/10 text-primary',
            label: 'text-primary',
        },

        blue: {
            icon: 'bg-sky-50 text-sky-600',
            label: 'text-sky-600',
        },

        slate: {
            icon: 'bg-slate-100 text-slate-500',
            label: 'text-slate-500',
        },

        urgency: {
            icon: urgencyStyle?.icon || 'bg-slate-100 text-slate-500',
            label: urgencyStyle?.text || 'text-slate-500',
        },
    };

    const style = styles[accent] || styles.slate;

    return (
        <div className="min-w-0 px-4 py-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
                >
                    <Icon size={14} strokeWidth={1.9} />
                </span>

                <div className="min-w-0">
                    <p
                        className={`text-[9px] font-bold uppercase tracking-[0.12em] ${style.label}`}
                    >
                        {label}
                    </p>

                    <p
                        className="mt-1 truncate text-xs font-bold text-slate-800"
                        title={String(value)}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   SECTION HEADING
   ================================================================ */

const SectionHeading = ({ icon: Icon, eyebrow, title }) => {
    return (
        <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={14} strokeWidth={1.9} />
            </span>

            <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                    {eyebrow}
                </p>

                <h3 className="mt-0.5 text-sm font-bold text-slate-800">
                    {title}
                </h3>
            </div>
        </div>
    );
};

/* ================================================================
   ASSIGNMENT ROW
   ================================================================ */

const AssignmentRow = ({ icon: Icon, label, names, emptyText }) => {
    return (
        <div className="px-1 py-4 sm:px-5 sm:py-5">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={16} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        {label}
                    </p>

                    {names.length > 0 ? (
                        <div className="mt-2 space-y-1.5">
                            {names.map((name, index) => (
                                <div
                                    key={`${name}-${index}`}
                                    className="flex min-w-0 items-center gap-2"
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                                    <p
                                        className="min-w-0 truncate text-sm font-semibold text-slate-700"
                                        title={name}
                                    >
                                        {name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-2 text-xs font-medium text-slate-400">
                            {emptyText}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   SIDE HEADING
   ================================================================ */

const SideHeading = ({ title, icon: Icon }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={13} strokeWidth={1.9} />
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {title}
            </p>
        </div>
    );
};

/* ================================================================
   SIDE STATUS
   ================================================================ */

const SideStatus = ({ icon: Icon, label, value, success = false }) => {
    return (
        <div className="py-3">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        success
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-white text-slate-400 ring-1 ring-slate-200'
                    }`}
                >
                    <Icon size={14} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                        {label}
                    </p>

                    <div className="mt-1.5">{value}</div>
                </div>
            </div>
        </div>
    );
};

/* ================================================================
   TIMELINE ITEM
   ================================================================ */

const TimelineItem = ({ label, value, last = false, active = false }) => {
    return (
        <div className={`relative ${last ? '' : 'pb-6'}`}>
            <span
                className={`absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                    active
                        ? 'border-primary bg-primary shadow-[0_0_0_3px_rgba(15,118,110,0.10)]'
                        : 'border-slate-300 bg-[#f8faf9]'
                }`}
            />

            <p
                className={`text-[9px] font-bold uppercase tracking-[0.08em] ${
                    active ? 'text-primary' : 'text-slate-400'
                }`}
            >
                {label}
            </p>

            <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                {value}
            </p>
        </div>
    );
};

export default HelpRequestViewModal;
