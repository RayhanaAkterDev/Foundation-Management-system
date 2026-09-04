import React, { useEffect, useMemo, useState } from 'react';

import {
    Activity,
    CheckCircle2,
    HeartHandshake,
    RefreshCcw,
    RotateCcw,
    X,
    XCircle,
} from 'lucide-react';

import {
    acceptAssignment,
    fetchAssignments,
    rejectAssignment,
} from './helpRequests/helpRequestApi';

import {
    formatCurrency,
    normalizeAssignment,
} from './helpRequests/helpRequestUtils';

import PriorityQueue from './helpRequests/PriorityQueue';
import CaseRegister from './helpRequests/CaseRegister';
import CaseReviewDrawer from './helpRequests/CaseReviewDrawer';
import RejectionModal from './helpRequests/RejectionModal';

const STATUS_CONFIG = {
    pending: {
        label: 'Needs response',
        short: 'Needs response',
        icon: Activity,
    },

    assigned: {
        label: 'Assigned',
        short: 'Assigned',
        icon: CheckCircle2,
    },

    active: {
        label: 'In progress',
        short: 'In progress',
        icon: Activity,
    },

    completed: {
        label: 'Completed',
        short: 'Completed',
        icon: CheckCircle2,
    },

    rejected: {
        label: 'Declined',
        short: 'Declined',
        icon: XCircle,
    },

    withdrawal: {
        label: 'Withdrawal requested',
        short: 'Withdrawal',
        icon: RotateCcw,
    },
};

const FILTERS = [
    {
        key: 'all',
        label: 'All cases',
    },

    {
        key: 'pending',
        label: 'Needs response',
    },

    {
        key: 'assigned',
        label: 'Assigned',
    },

    {
        key: 'active',
        label: 'In progress',
    },

    {
        key: 'completed',
        label: 'Completed',
    },

    {
        key: 'withdrawal',
        label: 'Withdrawal',
    },

    {
        key: 'rejected',
        label: 'Declined',
    },
];

const CommandMetric = ({
    value,
    label,
    active = false,
    last = false,
}) => (
    <div
        className={`relative px-6 py-5.5 sm:px-7 ${
            !last ? 'border-r border-white/10' : ''
        } ${active ? 'bg-white/5.5' : ''}`}
    >
        {active && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(245,158,11,0.22)]" />
        )}

        <div className="flex items-baseline gap-2">
            <span
                className={`text-7.5 font-semibold leading-none tracking-[-0.055em] ${
                    active ? 'text-[#ffd477]' : 'text-white'
                }`}
            >
                {value}
            </span>

            <span className="text-[8px] font-medium uppercase tracking-[0.08em] text-white/25">
                cases
            </span>
        </div>

        <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.15em] text-white/38">
            {label}
        </p>
    </div>
);

const OrgHelpRequests = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [actionLoading, setActionLoading] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);

    const [rejectionRequest, setRejectionRequest] = useState(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [rejectionError, setRejectionError] = useState('');
    const [rejectionLoading, setRejectionLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const loadAssignments = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchAssignments();

            const rawAssignments = Array.isArray(data?.assignments)
                ? data.assignments
                : [];

            const normalized = rawAssignments.map(normalizeAssignment);

            setAssignments(normalized);
        } catch (err) {
            setError(
                err.message || 'Unable to load assigned help requests.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadInitialAssignments = async () => {
            try {
                const data = await fetchAssignments();

                if (cancelled) {
                    return;
                }

                const rawAssignments = Array.isArray(data?.assignments)
                    ? data.assignments
                    : [];

                setAssignments(rawAssignments.map(normalizeAssignment));
                setError('');
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                            'Unable to load assigned help requests.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialAssignments();

        return () => {
            cancelled = true;
        };
    }, []);

    const counts = useMemo(
        () => ({
            all: assignments.length,

            pending: assignments.filter(
                (request) => request.status === 'pending',
            ).length,

            assigned: assignments.filter(
                (request) => request.status === 'assigned',
            ).length,

            active: assignments.filter(
                (request) => request.status === 'active',
            ).length,

            completed: assignments.filter(
                (request) => request.status === 'completed',
            ).length,

            rejected: assignments.filter(
                (request) => request.status === 'rejected',
            ).length,

            withdrawal: assignments.filter(
                (request) => request.status === 'withdrawal',
            ).length,
        }),
        [assignments],
    );

    const filteredRequests = useMemo(() => {
        const query = search.trim().toLowerCase();

        return assignments.filter((request) => {
            const filterMatch =
                activeFilter === 'all' ||
                request.status === activeFilter;

            const searchMatch =
                !query ||
                [
                    request.title,
                    request.description,
                    request.category,
                    request.district,
                    request.individual,
                    request.location,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            return filterMatch && searchMatch;
        });
    }, [activeFilter, search, assignments]);

    const pending = useMemo(
        () =>
            assignments.find(
                (request) => request.status === 'pending',
            ),
        [assignments],
    );

    const clearFilters = () => {
        setActiveFilter('all');
        setSearch('');
    };

    const handleAssignmentAction = async (request, action) => {
        if (!request?.assignmentId || actionLoading) {
            return;
        }

        if (action === 'reject') {
            setRejectionRequest(request);
            setRejectionNote('');
            setRejectionError('');

            return;
        }

        try {
            setActionLoading(true);
            setError('');

            await acceptAssignment(request.assignmentId);

            const data = await fetchAssignments();

            const rawAssignments = Array.isArray(data?.assignments)
                ? data.assignments
                : [];

            const normalized = rawAssignments.map(normalizeAssignment);

            setAssignments(normalized);

            const updated = normalized.find(
                (item) =>
                    item.assignmentId === request.assignmentId,
            );

            setSelectedRequest(updated || null);
        } catch (err) {
            setError(
                err.message || 'Unable to accept this assignment.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitRejection = async () => {
        if (!rejectionRequest?.assignmentId || rejectionLoading) {
            return;
        }

        const note = rejectionNote.trim();

        if (!note) {
            setRejectionError(
                'Please provide a reason for rejecting this assignment.',
            );

            return;
        }

        try {
            setRejectionLoading(true);
            setRejectionError('');
            setError('');

            await rejectAssignment(
                rejectionRequest.assignmentId,
                note,
            );

            setRejectionRequest(null);
            setRejectionNote('');

            const data = await fetchAssignments();

            const rawAssignments = Array.isArray(data?.assignments)
                ? data.assignments
                : [];

            const normalized = rawAssignments.map(normalizeAssignment);

            setAssignments(normalized);

            const updated = normalized.find(
                (item) =>
                    item.assignmentId ===
                    rejectionRequest.assignmentId,
            );

            setSelectedRequest(updated || null);
        } catch (err) {
            setRejectionError(
                err.message || 'Unable to reject this assignment.',
            );
        } finally {
            setRejectionLoading(false);
        }
    };

    return (
        <div className="min-h-full bg-[#eef3f6] text-text-primary">
            <div className="mx-auto max-w-375">
                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="relative overflow-hidden bg-primary shadow-[0_24px_65px_rgba(15,118,110,0.14)]">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -right-37.5 -top-52.5 h-130 w-130 rounded-full border-78 border-white/[0.035]" />

                        <div className="absolute right-[10%] top-[18%] h-75 w-75 rounded-full border border-white/4.5" />

                        <div className="absolute -bottom-47.5 left-[35%] h-90 w-90 rounded-full border border-white/[0.035]" />

                        <div className="absolute left-0 top-0 h-full w-[34%] bg-linear-to-r from-black/5 to-transparent" />

                        <div className="absolute bottom-0 left-0 h-px w-[55%] bg-white/13" />
                    </div>

                    <div className="relative">
                        <div className="px-6 pb-12 pt-9 sm:px-9 lg:px-11 lg:pb-14 lg:pt-11">
                            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-end">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-10 w-10 items-center justify-center border border-white/15 bg-white/8 shadow-[0_8px_25px_rgba(0,0,0,0.06)]">
                                            <HeartHandshake
                                                className="h-4.5 w-4.5 text-white/65"
                                                strokeWidth={1.6}
                                            />

                                            <span className="absolute bottom-0 right-0 h-1.5 w-1.5 bg-accent" />
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.21em] text-white/55">
                                                StandFor People
                                            </span>

                                            <span className="h-1 w-1 rounded-full bg-accent" />

                                            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                                                Organization
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-11">
                                        <div className="flex items-center gap-3">
                                            <span className="h-0.5 w-9 bg-accent" />

                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                                                Assistance management
                                            </span>
                                        </div>

                                        <h1 className="mt-4 max-w-190 text-[39px] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[48px] lg:text-[56px]">
                                            Your assigned cases.
                                        </h1>

                                        <p className="mt-5 max-w-170 text-[12px] leading-7 text-white/48 sm:text-[13px]">
                                            Review requests assigned to your
                                            organization, respond to pending
                                            assignments, and manage active
                                            support cases.
                                        </p>
                                    </div>
                                </div>

                                <div className="border border-white/10 bg-black/8">
                                    <div className="border-b border-white/10 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-white/38">
                                                Case command
                                            </span>

                                            <span className="flex items-center gap-2 text-[8px] font-semibold text-white/35">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute h-full w-full animate-ping rounded-full bg-[#73b7ad]/35" />

                                                    <span className="relative h-2 w-2 rounded-full bg-[#73b7ad]" />
                                                </span>

                                                Live
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2">
                                        <CommandMetric
                                            value={counts.all}
                                            label="Total cases"
                                        />

                                        <CommandMetric
                                            value={counts.pending}
                                            label="Needs response"
                                            active={counts.pending > 0}
                                        />

                                        <CommandMetric
                                            value={counts.active}
                                            label="In progress"
                                        />

                                        <CommandMetric
                                            value={counts.completed}
                                            label="Completed"
                                            last
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (
                    <div className="border-b border-red-200 bg-red-50 px-6 py-4 sm:px-9 lg:px-11">
                        <div className="flex items-start justify-between gap-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-700">
                                    Unable to complete request
                                </p>

                                <p className="mt-1 text-[11px] leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={loadAssignments}
                                disabled={loading}
                                className="inline-flex shrink-0 items-center gap-2 border border-red-200 bg-white px-3 py-2 text-[9px] font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCcw
                                    className={`h-3.5 w-3.5 ${
                                        loading
                                            ? 'animate-spin'
                                            : ''
                                    }`}
                                />
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                <main className="px-6 py-10 sm:px-9 lg:px-11 lg:py-14">
                    <PriorityQueue
                        pending={pending}
                        counts={counts}
                        formatCurrency={formatCurrency}
                        onViewCase={() =>
                            pending && setSelectedRequest(pending)
                        }
                        onRespond={() =>
                            pending && setSelectedRequest(pending)
                        }
                    />

                    <CaseRegister
                        assignments={assignments}
                        filteredRequests={filteredRequests}
                        loading={loading}
                        search={search}
                        setSearch={setSearch}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        filters={FILTERS}
                        counts={counts}
                        onClearFilters={clearFilters}
                        onOpenCase={setSelectedRequest}
                        statusConfig={STATUS_CONFIG}
                    />
                </main>

                {/* =====================================================
                    REVIEW DRAWER
                ===================================================== */}

                <CaseReviewDrawer
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onAction={handleAssignmentAction}
                    actionLoading={actionLoading}
                    statusConfig={STATUS_CONFIG}
                />

                {/* =====================================================
                    REJECTION MODAL
                ===================================================== */}

                <RejectionModal
                    request={rejectionRequest}
                    note={rejectionNote}
                    setNote={setRejectionNote}
                    error={rejectionError}
                    setError={setRejectionError}
                    loading={rejectionLoading}
                    onClose={() => {
                        if (rejectionLoading) {
                            return;
                        }

                        setRejectionRequest(null);
                        setRejectionNote('');
                        setRejectionError('');
                    }}
                    onSubmit={handleSubmitRejection}
                />
            </div>
        </div>
    );
};

export default OrgHelpRequests;