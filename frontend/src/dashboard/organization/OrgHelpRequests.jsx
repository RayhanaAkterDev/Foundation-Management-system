import React, { useEffect, useMemo, useState } from 'react';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    FileText,
    HeartHandshake,
    MapPin,
    MessageSquareText,
    RefreshCcw,
    RotateCcw,
    Search,
    ShieldCheck,
    UserRound,
    Users,
    X,
    XCircle,
} from 'lucide-react';

/* =========================================================
   API / DATA NORMALIZATION
========================================================= */

const API_ROOT = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8000/api'
).replace(/\/$/, '');

const API_BASE_URL = API_ROOT.endsWith('/api') ? API_ROOT : `${API_ROOT}/api`;

const getAuthToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const apiRequest = async (path, options = {}) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.body
                ? {
                      'Content-Type': 'application/json',
                  }
                : {}),
            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
            ...(options.headers || {}),
        },
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
                data?.error ||
                `Request failed with status ${response.status}.`,
        );
    }

    return data;
};

/* =========================================================
   DATA FORMATTERS
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString('en-BD', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatTime = (value) => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleTimeString('en-BD', {
        hour: 'numeric',
        minute: '2-digit',
    });
};

const formatAge = (value) => {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    const diffMs = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) {
        return 'just now';
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days === 1 ? '' : 's'} ago`;
};

const formatUrgency = (urgency) => {
    const value = String(urgency || '').toLowerCase();

    if (value === 'critical') {
        return 'Critical';
    }

    if (value === 'high') {
        return 'High';
    }

    if (value === 'normal' || value === 'medium') {
        return 'Medium';
    }

    if (value === 'low') {
        return 'Low';
    }

    return 'Normal';
};

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
        return 'Not provided';
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount)) {
        return String(amount);
    }

    return `৳${numericAmount.toLocaleString('en-BD')}`;
};

/* =========================================================
   ASSIGNMENT STATUS
========================================================= */

const mapAssignmentStatus = (status) => {
    switch (String(status || '').toLowerCase()) {
        case 'pending':
            return 'pending';

        case 'accepted':
            return 'assigned';

        case 'in_progress':
        case 'in-progress':
            return 'active';

        case 'completed':
            return 'completed';

        case 'rejected':
            return 'rejected';

        /*
         * Keep support for the legacy volunteer-style
         * assignment status if it ever appears here.
         */
        case 'assigned':
            return 'assigned';

        default:
            return 'pending';
    }
};

/* =========================================================
   BACKEND ASSIGNMENT -> UI REQUEST
========================================================= */

const normalizeAssignment = (assignment) => {
    /*
     * Laravel serializes the HelpRequest relationship as
     * "help_request" because the relationship method is
     * called helpRequest().
     *
     * Support both names to make this component resilient.
     */
    const helpRequest =
        assignment?.help_request || assignment?.helpRequest || {};

    const requester =
        helpRequest?.user ||
        helpRequest?.requester ||
        assignment?.requester ||
        null;

    const createdAt = helpRequest?.created_at || helpRequest?.createdAt;

    const assignedAt = assignment?.assigned_at || assignment?.assignedAt;

    const status = mapAssignmentStatus(assignment?.status);

    /*
     * OrganizationController currently loads:
     *
     * 'helpRequest'
     *
     * but does NOT currently load:
     *
     * 'helpRequest.user'
     *
     * Therefore, for now we use user_id as a truthful
     * fallback instead of showing fake requester data.
     */
    const requesterName =
        requester?.name ||
        (helpRequest?.user_id
            ? `Requester #${helpRequest.user_id}`
            : 'Requester unavailable');

    const location =
        helpRequest?.address || helpRequest?.district || 'Location unavailable';

    return {
        /*
         * Assignment ID is the ID that must be sent to
         * /organization/assignments/{id}/accept|reject
         */
        id: assignment?.id,
        assignmentId: assignment?.id,

        /*
         * Actual Help Request ID
         */
        helpRequestId: helpRequest?.id || assignment?.help_request_id,

        /*
         * Help Request data
         */
        title: helpRequest?.title || 'No title provided',

        description: helpRequest?.description || 'No description provided.',

        category: helpRequest?.category || 'Not specified',

        district: helpRequest?.district || 'Not specified',

        /*
         * These fields are not currently present in the
         * HelpRequest model, so they remain null instead
         * of using mock values.
         */
        peopleAffected:
            helpRequest?.people_affected ?? helpRequest?.peopleAffected ?? null,

        amountNeeded:
            helpRequest?.amount_needed ?? helpRequest?.amountNeeded ?? null,

        urgency: formatUrgency(helpRequest?.urgency),

        /*
         * Assignment status is mapped to the original UI's
         * status names.
         */
        status,

        /*
         * Dates
         */
        submitted: formatDate(createdAt),

        submittedTime: formatTime(createdAt),

        assignmentAge: formatAge(assignedAt),

        /*
         * Requester
         */
        individual: requesterName,

        requesterId: helpRequest?.user_id || requester?.id || null,

        /*
         * Location
         */
        location,

        address: helpRequest?.address || null,

        /*
         * Assignment information
         */
        assignmentNote:
            assignment?.assignment_note ||
            assignment?.assignmentNote ||
            'No assignment note was provided.',

        /*
         * The current backend does not have a dedicated
         * support_type field, so category is the truthful
         * fallback.
         */
        supportType:
            helpRequest?.support_type ||
            helpRequest?.supportType ||
            helpRequest?.category ||
            'Not specified',

        /*
         * There is currently no progress field in the
         * HelpRequest model, so don't invent progress.
         */
        progress: helpRequest?.progress ?? assignment?.progress ?? null,

        lastUpdate: assignment?.updated_at
            ? `Assignment updated · ${formatDate(assignment.updated_at)}`
            : null,

        /*
         * Keep the original backend objects available
         * for future actions/debugging.
         */
        rawAssignment: assignment,
        rawHelpRequest: helpRequest,
    };
};

/* =========================================================
   API ACTIONS
========================================================= */

const fetchAssignments = () => apiRequest('/organization/assignments');

const acceptAssignment = (id) =>
    apiRequest(`/organization/assignments/${id}/accept`, {
        method: 'PATCH',
    });

const rejectAssignment = (id) =>
    apiRequest(`/organization/assignments/${id}/reject`, {
        method: 'PATCH',
    });

/* =========================================================
   CONFIG
========================================================= */

const STATUS_CONFIG = {
    pending: {
        label: 'Needs response',
        short: 'Needs response',
        icon: Clock3,
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

/* =========================================================
   MAIN
========================================================= */

const OrgHelpRequests = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const [search, setSearch] = useState('');

    const [selectedRequest, setSelectedRequest] = useState(null);

    const [assignments, setAssignments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [actionLoading, setActionLoading] = useState(false);

    /*
     * Load real organization assignments.
     *
     * IMPORTANT:
     * We intentionally do not call a state-updating
     * function directly from useEffect.
     *
     * This avoids the React warning:
     *
     * "Calling setState synchronously within an effect..."
     */
    useEffect(() => {
        let cancelled = false;

        fetchAssignments()
            .then((data) => {
                if (cancelled) {
                    return;
                }

                const rawAssignments = Array.isArray(data?.assignments)
                    ? data.assignments
                    : [];

                setAssignments(rawAssignments.map(normalizeAssignment));

                setError('');
            })
            .catch((err) => {
                if (cancelled) {
                    return;
                }

                setAssignments([]);

                setError(
                    err.message ||
                        'Something went wrong while loading your help requests.',
                );
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    /* =====================================================
       COUNTS
    ===================================================== */

    const counts = useMemo(
        () => ({
            all: assignments.length,

            pending: assignments.filter((r) => r.status === 'pending').length,

            assigned: assignments.filter((r) => r.status === 'assigned').length,

            active: assignments.filter((r) => r.status === 'active').length,

            completed: assignments.filter((r) => r.status === 'completed')
                .length,

            rejected: assignments.filter((r) => r.status === 'rejected').length,

            withdrawal: assignments.filter((r) => r.status === 'withdrawal')
                .length,
        }),
        [assignments],
    );

    /* =====================================================
       FILTERING
    ===================================================== */

    const filteredRequests = useMemo(() => {
        const q = search.trim().toLowerCase();

        return assignments.filter((request) => {
            const filterMatch =
                activeFilter === 'all' || request.status === activeFilter;

            const searchMatch =
                !q ||
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
                    .includes(q);

            return filterMatch && searchMatch;
        });
    }, [activeFilter, search, assignments]);

    /* =====================================================
       PRIORITY REQUEST
    ===================================================== */

    const pending = assignments.find((request) => request.status === 'pending');

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {
        setActiveFilter('all');
        setSearch('');
    };

    /* =====================================================
       ACCEPT / DECLINE
    ===================================================== */

    const handleAssignmentAction = async (request, action) => {
        if (!request?.assignmentId || actionLoading) {
            return;
        }

        try {
            setActionLoading(true);
            setError('');

            if (action === 'accept') {
                await acceptAssignment(request.assignmentId);
            } else {
                await rejectAssignment(request.assignmentId);
            }

            /*
             * Reload actual backend data after the action.
             */
            const data = await fetchAssignments();

            const rawAssignments = Array.isArray(data?.assignments)
                ? data.assignments
                : [];

            const normalized = rawAssignments.map(normalizeAssignment);

            setAssignments(normalized);

            /*
             * Keep the drawer open if the assignment
             * still exists.
             *
             * After accept:
             * pending -> assigned
             *
             * After reject:
             * pending -> rejected
             */
            const updated = normalized.find(
                (item) => item.assignmentId === request.assignmentId,
            );

            setSelectedRequest(updated || null);
        } catch (err) {
            setError(
                err.message ||
                    `Unable to ${
                        action === 'accept' ? 'accept' : 'decline'
                    } this assignment.`,
            );
        } finally {
            setActionLoading(false);
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
                                {/* LEFT */}

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

                                        <h1 className="mt-4 text-[45px] font-semibold leading-[0.9] tracking-[-0.065em] text-white sm:text-[58px]">
                                            Help requests
                                        </h1>

                                        <p className="mt-7 max-w-155 text-[12px] leading-7 text-white/55">
                                            Review assigned cases, respond to
                                            requests, and keep assistance moving
                                            to the people who need it.
                                        </p>
                                    </div>
                                </div>

                                {/* ATTENTION PANEL */}

                                <div className="relative">
                                    <div className="border-l border-white/13 pl-7">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />

                                                    <span className="relative h-2 w-2 rounded-full bg-accent" />
                                                </span>

                                                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/50">
                                                    Needs your attention
                                                </span>
                                            </div>

                                            <span className="text-[9px] font-medium text-white/30">
                                                Live queue
                                            </span>
                                        </div>

                                        <div className="mt-7 flex items-end gap-6">
                                            <span className="text-[78px] font-semibold leading-[0.72] tracking-[-0.09em] text-[#ffd477]">
                                                {counts.pending}
                                            </span>

                                            <div className="pb-1">
                                                <p className="text-[14px] font-semibold leading-5 text-white/90">
                                                    {counts.pending === 1
                                                        ? 'case is waiting'
                                                        : 'cases are waiting'}
                                                    <br />
                                                    for your decision
                                                </p>

                                                <p className="mt-3 text-[9px] leading-5 text-white/35">
                                                    Review promptly to avoid
                                                    unnecessary delays.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-9 flex items-center gap-3">
                                            <div className="h-1 flex-1 overflow-hidden bg-white/9">
                                                <div
                                                    className="h-full bg-accent shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(
                                                                18,
                                                                counts.pending *
                                                                    32,
                                                            ),
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/25">
                                                priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* METRIC STRIP */}

                        <div className="grid border-t border-white/10 sm:grid-cols-4">
                            <CommandMetric
                                value={counts.all}
                                label="Total cases"
                            />

                            <CommandMetric
                                value={counts.pending}
                                label="Needs response"
                                active
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
                </header>

                {/* =====================================================
                    PRIORITY QUEUE
                ===================================================== */}

                {pending && (
                    <section className="mt-16 sm:mt-20">
                        <div className="mb-7 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <span className="h-1.25 w-1.25 bg-accent" />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7f8c91]">
                                        Priority queue
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                    <h2 className="text-[27px] font-semibold tracking-tighter text-[#182c33]">
                                        Requires attention
                                    </h2>

                                    <span className="text-[10px] font-medium text-[#9ba5a9]">
                                        {counts.pending + counts.withdrawal}{' '}
                                        open actions
                                    </span>
                                </div>
                            </div>

                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute h-full w-full animate-ping rounded-full bg-[#70b3a9]/35" />

                                    <span className="relative h-2 w-2 rounded-full bg-[#70b3a9]" />
                                </span>

                                <span className="text-[9px] font-semibold text-[#87959a]">
                                    Live queue
                                </span>
                            </div>
                        </div>

                        <div className="grid overflow-hidden border border-[#d0dde0] bg-white shadow-[0_20px_55px_rgba(24,53,61,0.06)] xl:grid-cols-[minmax(0,1fr)_315px]">
                            {/* PRIMARY CASE */}

                            <article className="relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-0.75 bg-accent" />

                                <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent" />

                                <div className="absolute right-0 top-0 h-full w-[25%] bg-linear-to-l from-[#fffaf0] to-transparent opacity-70" />

                                <div className="relative px-7 py-9 sm:px-10 sm:py-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3.5">
                                            <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#b18a39]">
                                                QUEUE 01
                                            </span>

                                            <span className="h-px w-9 bg-[#e7d7aa]" />

                                            <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#9a875f]">
                                                Immediate response
                                            </span>
                                        </div>

                                        <span className="hidden text-[9px] font-semibold text-[#a0aaae] sm:block">
                                            Waiting {pending.assignmentAge}
                                        </span>
                                    </div>

                                    <div className="mt-9 max-w-200">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <UrgencyBadge
                                                urgency={pending.urgency}
                                            />

                                            <span className="text-[9px] font-medium text-[#9ba5a9]">
                                                {pending.category}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 max-w-190 text-[31px] font-semibold leading-[1.08] tracking-[-0.052em] text-[#182d34] sm:text-[37px]">
                                            {pending.title}
                                        </h3>

                                        <p className="mt-5 max-w-172.5 text-[12px] leading-7 text-[#718087]">
                                            {pending.description}
                                        </p>
                                    </div>

                                    <div className="mt-10 grid border-y border-[#e4eaec] sm:grid-cols-4">
                                        <PriorityDetail
                                            label="Requester"
                                            value={pending.individual}
                                        />

                                        <PriorityDetail
                                            label="Location"
                                            value={pending.location}
                                            icon={MapPin}
                                        />

                                        <PriorityDetail
                                            label="Support needed"
                                            value={pending.supportType}
                                        />

                                        <PriorityDetail
                                            label="Amount needed"
                                            value={formatCurrency(
                                                pending.amountNeeded,
                                            )}
                                            accent
                                        />
                                    </div>

                                    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[#fff3d5] text-[#aa7204]">
                                                <Clock3 className="h-4 w-4" />

                                                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold text-[#52646a]">
                                                    Decision required
                                                </p>

                                                <p className="mt-1 text-[9px] leading-5 text-[#98a3a7]">
                                                    Accepting this case starts
                                                    your organization's support.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedRequest(pending)
                                                }
                                                className="border border-[#d5dfe1] bg-white px-5 py-3.5 text-[10px] font-bold text-[#64747a] transition-all duration-200 hover:border-[#b9cdca] hover:bg-[#f8fbfa] hover:text-primary"
                                            >
                                                View case
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedRequest(pending)
                                                }
                                                className="group flex items-center gap-6 bg-primary px-6 py-3.5 text-white shadow-[0_9px_22px_rgba(15,118,110,0.16)] transition-all duration-200 hover:-translate-y-px hover:bg-primary-hover"
                                            >
                                                <span className="text-left">
                                                    <span className="block text-[11px] font-bold">
                                                        Respond to case
                                                    </span>

                                                    <span className="mt-1 block text-[8px] text-white/45">
                                                        Accept or decline
                                                    </span>
                                                </span>

                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* WORK QUEUE */}

                            <aside className="border-t border-[#dce5e8] bg-[#f7fafb] xl:border-l xl:border-t-0">
                                <div className="border-b border-[#dce5e8] px-6 py-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#96a1a5]">
                                                Organization queue
                                            </p>

                                            <h3 className="mt-2 text-4.5 font-semibold tracking-[-0.03em] text-[#263a41]">
                                                What needs action
                                            </h3>
                                        </div>

                                        <div className="flex h-9 w-9 items-center justify-center bg-white text-[#74868b] shadow-[0_3px_10px_rgba(25,52,60,0.04)]">
                                            <Activity
                                                className="h-4 w-4"
                                                strokeWidth={1.6}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <PriorityQueueItem
                                        number={counts.pending}
                                        label="New decision"
                                        description="Cases waiting for your response"
                                        tone="amber"
                                    />

                                    <PriorityQueueItem
                                        number={counts.active}
                                        label="Active support"
                                        description="Cases currently receiving assistance"
                                        tone="teal"
                                    />

                                    <PriorityQueueItem
                                        number={counts.withdrawal}
                                        label="Admin review"
                                        description="Withdrawal requests needing attention"
                                        tone="red"
                                    />
                                </div>

                                <div className="border-t border-[#dce5e8] px-6 py-6">
                                    <div className="flex gap-3.5">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[#78918d]">
                                            <ShieldCheck
                                                className="h-3.5 w-3.5"
                                                strokeWidth={1.6}
                                            />
                                        </div>

                                        <p className="text-[9px] leading-5 text-[#8a979c]">
                                            Priority is determined by urgency,
                                            waiting time, and assistance need.
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </section>
                )}

                {/* =====================================================
                    CASE REGISTER
                ===================================================== */}

                <section className="mt-20 pb-16 sm:mt-24 lg:mt-28">
                    <div className="flex flex-col gap-7 border-b border-[#c9d5d8] pb-7 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="h-1.25 w-1.25 rounded-full bg-primary" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#7d8b90]">
                                    Case register
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                <h2 className="text-[31px] font-semibold tracking-[-0.055em] text-[#10232a]">
                                    Your cases
                                </h2>

                                <span className="text-[10px] font-medium text-[#9aa5a9]">
                                    {filteredRequests.length} of{' '}
                                    {assignments.length}
                                </span>
                            </div>
                        </div>

                        <div className="relative w-full lg:w-100">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#849399]" />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search cases, people, locations..."
                                className="h-12 w-full border border-[#cbd8db] bg-white pl-11 pr-10 text-[11px] font-medium text-[#33464d] shadow-[0_4px_14px_rgba(25,52,60,0.025)] outline-none transition-all duration-200 placeholder:text-[#9ba6aa] focus:border-primary focus:ring-4 focus:ring-primary/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c989c] transition hover:text-[#31444a]"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-9 grid gap-9 xl:grid-cols-[215px_minmax(0,1fr)]">
                        {/* FILTER */}

                        <nav className="self-start xl:sticky xl:top-6">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#879398]">
                                    Case status
                                </p>

                                <span className="text-[9px] font-semibold text-[#a0aaae]">
                                    {assignments.length}
                                </span>
                            </div>

                            <div className="overflow-hidden border-y border-[#d2dee1]">
                                {FILTERS.map((filter) => {
                                    const selected =
                                        activeFilter === filter.key;

                                    return (
                                        <button
                                            key={filter.key}
                                            type="button"
                                            onClick={() =>
                                                setActiveFilter(filter.key)
                                            }
                                            className={`group relative flex w-full items-center justify-between border-b border-[#e0e7e9] py-4 text-left transition-all duration-200 last:border-b-0 ${
                                                selected
                                                    ? 'bg-white px-3.5 text-[#1c3037] shadow-[0_3px_12px_rgba(20,48,56,0.035)]'
                                                    : 'px-1 text-[#738187] hover:bg-white/60 hover:px-2 hover:text-primary'
                                            }`}
                                        >
                                            {selected && (
                                                <span className="absolute bottom-0 left-0 top-0 w-0.75 bg-primary" />
                                            )}

                                            <span className="text-[11px] font-semibold">
                                                {filter.label}
                                            </span>

                                            <span
                                                className={`min-w-6 text-right text-[11px] font-bold ${
                                                    selected
                                                        ? 'text-primary'
                                                        : 'text-[#a0aaae]'
                                                }`}
                                            >
                                                {counts[filter.key]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {(search || activeFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-6 flex items-center gap-2 text-[10px] font-bold text-primary transition hover:text-primary-hover"
                                >
                                    <RefreshCcw className="h-3.5 w-3.5" />
                                    Reset filters
                                </button>
                            )}
                        </nav>

                        {/* CASE LIST */}

                        <main className="min-w-0">
                            {loading ? (
                                <div className="flex min-h-115 flex-col items-center justify-center border border-[#d8e3e6] bg-white px-6 text-center shadow-[0_10px_30px_rgba(24,53,61,0.035)]">
                                    <div className="relative flex h-14 w-14 items-center justify-center bg-[#edf4f3] text-primary">
                                        <RefreshCcw
                                            className="h-5 w-5 animate-spin"
                                            strokeWidth={1.5}
                                        />

                                        <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
                                    </div>

                                    <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-[#263940]">
                                        Loading cases
                                    </h3>

                                    <p className="mt-3 max-w-sm text-[12px] leading-6 text-[#89969b]">
                                        Retrieving your assigned help requests
                                        from the server.
                                    </p>
                                </div>
                            ) : filteredRequests.length > 0 ? (
                                <div className="overflow-hidden border border-[#d1dfe2] bg-white shadow-[0_14px_38px_rgba(24,53,61,0.045)]">
                                    <div className="hidden border-b border-[#d8e3e5] bg-[#f7f9fa] px-6 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_145px_145px_145px] lg:gap-7">
                                        <ListHeader>Case</ListHeader>

                                        <ListHeader>Requester</ListHeader>

                                        <ListHeader>Activity</ListHeader>

                                        <ListHeader align="right">
                                            Status
                                        </ListHeader>
                                    </div>

                                    {filteredRequests.map((request) => (
                                        <CaseRow
                                            key={request.assignmentId}
                                            request={request}
                                            onOpen={() =>
                                                setSelectedRequest(request)
                                            }
                                        />
                                    ))}

                                    <div className="flex items-center justify-between border-t border-[#d9e3e6] bg-[#fafbfb] px-6 py-4">
                                        <p className="text-[10px] font-medium text-[#8c989d]">
                                            Showing {filteredRequests.length}{' '}
                                            cases
                                        </p>

                                        <span className="flex items-center gap-2 text-[9px] font-semibold text-[#9da7ab]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#76b3aa]" />
                                            Data updated today
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState
                                    onClear={clearFilters}
                                    hasData={assignments.length > 0}
                                />
                            )}
                        </main>
                    </div>
                </section>
            </div>

            {/* =====================================================
                REVIEW DRAWER
            ===================================================== */}

            {selectedRequest && (
                <CaseReview
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onAction={handleAssignmentAction}
                    actionLoading={actionLoading}
                />
            )}
        </div>
    );
};

/* =========================================================
   HEADER METRIC
========================================================= */

const CommandMetric = ({ value, label, active = false, last = false }) => (
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

/* =========================================================
   PRIORITY DETAIL
========================================================= */

const PriorityDetail = ({ label, value, icon: Icon, accent = false }) => (
    <div className="border-r border-[#e4eaec] py-5 pr-4 last:border-r-0 sm:px-4 sm:first:pl-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#9aa5a9]">
            {label}
        </p>

        <div className="mt-2 flex min-w-0 items-center gap-1.5">
            {Icon && (
                <Icon
                    className="h-3 w-3 shrink-0 text-[#89979b]"
                    strokeWidth={1.7}
                />
            )}

            <p
                className={`truncate text-[11px] font-semibold ${
                    accent ? 'text-primary' : 'text-[#45575e]'
                }`}
            >
                {value}
            </p>
        </div>
    </div>
);

/* =========================================================
   PRIORITY QUEUE ITEM
========================================================= */

const PriorityQueueItem = ({ number, label, description, tone }) => {
    const config = {
        amber: {
            number: 'text-[#a97008]',
            dot: 'bg-[#e6b63d]',
            rail: 'bg-[#f0cf83]',
            hover: 'hover:bg-[#fffdf8]',
        },

        teal: {
            number: 'text-primary',
            dot: 'bg-[#65aaa0]',
            rail: 'bg-[#9bcac4]',
            hover: 'hover:bg-[#f7fbfa]',
        },

        red: {
            number: 'text-[#ae5d52]',
            dot: 'bg-[#cb8278]',
            rail: 'bg-[#e3b0a9]',
            hover: 'hover:bg-[#fffafa]',
        },
    }[tone];

    return (
        <div
            className={`group relative overflow-hidden border-b border-[#dfe7e9] px-6 py-6.5 transition-all duration-200 ${config.hover}`}
        >
            <span
                className={`absolute bottom-0 left-0 top-0 w-0.5 opacity-70 ${config.rail}`}
            />

            <div className="flex items-start gap-4.5">
                <div className="min-w-7.5 pt-0.5">
                    <span
                        className={`text-[29px] font-semibold leading-none tracking-[-0.06em] ${config.number}`}
                    >
                        {number}
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />

                        <p className="text-[11px] font-bold text-[#41535a]">
                            {label}
                        </p>
                    </div>

                    <p className="mt-2 text-[9px] leading-5 text-[#8b989d]">
                        {description}
                    </p>
                </div>

                <ChevronRight
                    className="mt-1 h-3.5 w-3.5 text-[#a6b0b4] transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    strokeWidth={1.7}
                />
            </div>
        </div>
    );
};

/* =========================================================
   LIST HEADER
========================================================= */

const ListHeader = ({ children, align = 'left' }) => (
    <div
        className={`text-[8px] font-bold uppercase tracking-[0.14em] text-[#89969b] ${
            align === 'right' ? 'text-right' : ''
        }`}
    >
        {children}
    </div>
);

/* =========================================================
   CASE ROW
========================================================= */

const CaseRow = ({ request, onOpen }) => {
    const config = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;

    const StatusIcon = config.icon;

    const styles = {
        pending: {
            text: 'text-[#9e6b08]',
            bg: 'bg-[#fff2d1]',
            dot: 'bg-[#e6b63e]',
        },

        assigned: {
            text: 'text-[#60788b]',
            bg: 'bg-[#edf2f5]',
            dot: 'bg-[#8299aa]',
        },

        active: {
            text: 'text-primary',
            bg: 'bg-[#e5f3f0]',
            dot: 'bg-[#63a99f]',
        },

        completed: {
            text: 'text-[#66767b]',
            bg: 'bg-[#eef1f1]',
            dot: 'bg-[#9aa5a8]',
        },

        rejected: {
            text: 'text-[#a9574e]',
            bg: 'bg-[#f9ecea]',
            dot: 'bg-[#c98178]',
        },

        withdrawal: {
            text: 'text-[#a56545]',
            bg: 'bg-[#f7eee9]',
            dot: 'bg-[#ce8968]',
        },
    };

    const status = styles[request.status] || styles.pending;

    const priority =
        request.status === 'pending' || request.status === 'withdrawal';

    return (
        <article
            className={`group relative border-b border-[#e1e8ea] px-6 py-7 transition-all duration-200 last:border-b-0 ${
                priority ? 'bg-[#fffdfa]' : 'bg-white'
            } hover:bg-[#fbfcfc]`}
        >
            {request.status === 'pending' && (
                <span className="absolute bottom-0 left-0 top-0 w-0.75 bg-accent" />
            )}

            {request.status === 'withdrawal' && (
                <span className="absolute bottom-0 left-0 top-0 w-0.75 bg-[#c97d59]" />
            )}

            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_145px_145px_145px] lg:items-center lg:gap-7">
                {/* CASE */}

                <div className="min-w-0">
                    <div className="flex items-start gap-4">
                        <div
                            className={`hidden h-11 w-11 shrink-0 items-center justify-center border border-transparent transition-all duration-200 sm:flex ${
                                priority
                                    ? 'bg-[#fff2d3] text-[#ae770b]'
                                    : 'bg-[#f1f5f6] text-[#728188] group-hover:border-[#d7e6e3] group-hover:bg-[#e8f3f1] group-hover:text-primary'
                            }`}
                        >
                            <FileText
                                className="h-4.25 w-4.25"
                                strokeWidth={1.6}
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={onOpen}
                                    className="text-left text-[14px] font-bold leading-5 tracking-[-0.018em] text-[#23373e] transition-colors hover:text-primary"
                                >
                                    {request.title}
                                </button>

                                {request.status === 'pending' && (
                                    <span className="bg-[#fff0c7] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#956500]">
                                        Action needed
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 max-w-2xl text-[11px] leading-6 text-[#7c898e]">
                                {request.description}
                            </p>

                            <div className="mt-3.5 flex flex-wrap items-center gap-x-4.5 gap-y-2 text-[10px] text-[#89969b]">
                                <span className="font-semibold text-[#52646a]">
                                    {formatCurrency(request.amountNeeded)}
                                </span>

                                <span>{request.category}</span>

                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />

                                    {request.district}
                                </span>

                                <span>
                                    {request.peopleAffected ?? '—'}{' '}
                                    {request.peopleAffected === 1
                                        ? 'person'
                                        : request.peopleAffected
                                          ? 'people'
                                          : ''}
                                </span>
                            </div>

                            {request.status === 'active' &&
                                request.progress !== null && (
                                    <div className="mt-5 max-w-md">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#919da1]">
                                                Assistance progress
                                            </span>

                                            <span className="text-[9px] font-bold text-primary">
                                                {request.progress}%
                                            </span>
                                        </div>

                                        <div className="mt-2 h-1.25 overflow-hidden bg-[#e2eaec]">
                                            <div
                                                className="h-full bg-primary"
                                                style={{
                                                    width: `${request.progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* REQUESTER */}

                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0aaae] lg:hidden">
                        Requester
                    </p>

                    <p className="mt-1.5 text-[11px] font-semibold text-[#42545b] lg:mt-0">
                        {request.individual}
                    </p>

                    <p className="mt-1.5 text-[10px] leading-4 text-[#919da2]">
                        {request.location}
                    </p>
                </div>

                {/* ACTIVITY */}

                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0aaae] lg:hidden">
                        Activity
                    </p>

                    <p className="mt-1.5 text-[11px] font-semibold leading-4 text-[#42545b] lg:mt-0">
                        {request.status === 'active'
                            ? request.lastUpdate || 'In progress'
                            : request.submitted}
                    </p>

                    <p className="mt-1.5 text-[10px] text-[#919da2]">
                        {request.status === 'active'
                            ? ''
                            : request.submittedTime}
                    </p>
                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between gap-4 lg:justify-end">
                    <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 ${status.bg} ${status.text}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                        />

                        <StatusIcon className="h-3 w-3" strokeWidth={1.8} />

                        <span className="text-[9px] font-bold">
                            {config.short}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="flex h-8 w-8 items-center justify-center text-[#9aa5a9] transition-all hover:bg-[#edf3f4] hover:text-primary lg:opacity-0 lg:group-hover:opacity-100"
                        aria-label={`Open ${request.title}`}
                    >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />
                    </button>
                </div>
            </div>
        </article>
    );
};

/* =========================================================
   EMPTY
========================================================= */

const EmptyState = ({ onClear, hasData = false }) => (
    <div className="flex min-h-115 flex-col items-center justify-center border border-[#d8e3e6] bg-white px-6 text-center shadow-[0_10px_30px_rgba(24,53,61,0.035)]">
        <div className="relative flex h-14 w-14 items-center justify-center bg-[#edf4f3] text-primary">
            <Search className="h-5 w-5" strokeWidth={1.5} />

            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
        </div>

        <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-[#263940]">
            {hasData ? 'No matching cases' : 'No assigned cases'}
        </h3>

        <p className="mt-3 max-w-sm text-[12px] leading-6 text-[#89969b]">
            {hasData
                ? 'Nothing matches your current search or status filter.'
                : 'There are no help request assignments for your organization yet.'}
        </p>

        <button
            type="button"
            onClick={onClear}
            className="mt-6 inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold text-white shadow-[0_6px_15px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover"
        >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset view
        </button>
    </div>
);

/* =========================================================
   CASE REVIEW
========================================================= */

const CaseReview = ({ request, onClose, onAction, actionLoading }) => {
    const config = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;

    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close case review"
                onClick={onClose}
                className="absolute inset-0 bg-text-primary/55 backdrop-blur-0.75"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-175 flex-col bg-[#eef3f6] shadow-[-30px_0_85px_rgba(15,23,42,0.21)]">
                {/* DRAWER HEADER */}

                <header className="relative shrink-0 overflow-hidden bg-primary px-6 py-7 text-white sm:px-9 sm:py-8">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full border-42 border-white/4.5" />

                        <div className="absolute bottom-0 right-[28%] h-px w-45 bg-white/10" />
                    </div>

                    <div className="relative flex items-start justify-between gap-6">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                <span>
                                    CASE HR-
                                    {String(
                                        request.helpRequestId || request.id,
                                    ).padStart(4, '0')}
                                </span>

                                <span className="h-1 w-1 rounded-full bg-white/30" />

                                <span className="text-white/80">
                                    {config.label}
                                </span>
                            </div>

                            <h2 className="mt-4 max-w-xl text-[27px] font-semibold leading-[1.13] tracking-[-0.045em] sm:text-[32px]">
                                {request.title}
                            </h2>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <UrgencyBadge urgency={request.urgency} dark />

                                <span className="text-[10px] text-white/45">
                                    Submitted{' '}
                                    <span className="text-white/75">
                                        {request.submitted}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.14] bg-white/3 text-white/60 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                {/* CONTENT */}

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-9 sm:px-8 sm:py-10">
                    {request.status === 'pending' && (
                        <section className="mb-11 border border-[#ead08b] bg-[#fffaf0]">
                            <div className="flex items-start gap-5 border-l-4 border-accent px-6 py-6">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fff0c7] text-[#ad7508]">
                                    <Clock3 className="h-4 w-4" />
                                </div>

                                <div>
                                    <h3 className="text-[14px] font-bold text-[#513e19]">
                                        Your decision is required
                                    </h3>

                                    <p className="mt-2 text-[11px] leading-6 text-[#7e6e50]">
                                        Accepting this assignment makes your
                                        organization responsible for providing
                                        the requested support.
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2.5">
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                onAction(request, 'accept')
                                            }
                                            className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Check className="h-3.5 w-3.5" />

                                            {actionLoading
                                                ? 'Processing...'
                                                : 'Accept assignment'}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                onAction(request, 'reject')
                                            }
                                            className="inline-flex items-center gap-2 border border-[#e4d7b9] bg-white px-4 py-2.5 text-[10px] font-bold text-[#705e36] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {request.status === 'active' && (
                        <section className="mb-11 border border-[#cce4df] bg-white">
                            <div className="flex items-start gap-5 border-l-4 border-primary px-6 py-6">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#e5f3f0] text-primary">
                                    <Activity className="h-4 w-4" />
                                </div>

                                <div>
                                    <h3 className="text-[14px] font-bold text-[#155b55]">
                                        Assistance is in progress
                                    </h3>

                                    <p className="mt-2 text-[11px] leading-6 text-[#5f7e78]">
                                        Continue recording meaningful updates
                                        until support has been completed.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    <DrawerSection
                        eyebrow="Case overview"
                        title="Key information"
                        icon={FileText}
                    >
                        <div className="grid overflow-hidden border border-[#dce5e8] bg-white shadow-[0_5px_18px_rgba(25,52,60,0.025)] sm:grid-cols-2">
                            <DrawerValue
                                label="Amount needed"
                                value={formatCurrency(request.amountNeeded)}
                                accent
                            />

                            <DrawerValue
                                label="People affected"
                                value={request.peopleAffected ?? 'Not provided'}
                            />

                            <DrawerValue
                                label="Category"
                                value={request.category}
                            />

                            <DrawerValue
                                label="Support"
                                value={request.supportType}
                            />

                            <DrawerValue
                                label="District"
                                value={request.district}
                            />

                            <DrawerValue
                                label="Received"
                                value={request.assignmentAge}
                            />
                        </div>
                    </DrawerSection>

                    <DrawerSection
                        eyebrow="Request"
                        title="Why support is needed"
                        icon={MessageSquareText}
                    >
                        <div className="border border-[#dce5e8] border-l-4 border-l-primary bg-white px-6 py-6 shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                            <p className="text-[12px] leading-7 text-[#52636a]">
                                {request.description}
                            </p>
                        </div>
                    </DrawerSection>

                    <DrawerSection
                        eyebrow="Requester"
                        title="Person receiving support"
                        icon={UserRound}
                    >
                        <div className="flex items-center gap-5 border border-[#dce5e8] bg-white px-6 py-6 shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                            <div className="relative flex h-13 w-13 shrink-0 items-center justify-center bg-[#e5f3f0] text-primary">
                                <UserRound className="h-5 w-5" />

                                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-[#75bdb2]" />
                            </div>

                            <div>
                                <p className="text-[13px] font-bold text-[#33464c]">
                                    {request.individual}
                                </p>

                                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#89969b]">
                                    <MapPin className="h-3.5 w-3.5" />

                                    {request.location}
                                </p>
                            </div>
                        </div>
                    </DrawerSection>

                    <DrawerSection
                        eyebrow="Administration"
                        title="Assignment context"
                        icon={BriefcaseBusiness}
                    >
                        <div className="border border-[#cfe1dd] bg-[#f5faf9] px-6 py-6">
                            <div className="flex items-start gap-3.5">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6d9189]" />

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#71857f]">
                                        Assignment note
                                    </p>

                                    <p className="mt-2.5 text-[12px] leading-7 text-[#4d635c]">
                                        {request.assignmentNote}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DrawerSection>

                    {['active', 'assigned', 'completed', 'withdrawal'].includes(
                        request.status,
                    ) && (
                        <DrawerSection
                            eyebrow="Progress"
                            title="Assistance journey"
                            icon={Activity}
                        >
                            <div className="border border-[#dce5e8] bg-white px-6 py-6 shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                                <div className="flex items-end justify-between gap-5">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8c989d]">
                                            Completion
                                        </p>

                                        <p className="mt-2 text-[39px] font-semibold tracking-[-0.055em] text-[#203d39]">
                                            {request.progress ?? 0}

                                            <span className="ml-1 text-4 text-[#91a19f]">
                                                %
                                            </span>
                                        </p>
                                    </div>

                                    <p className="max-w-52.5 text-right text-[10px] leading-5 text-[#8c989d]">
                                        {request.lastUpdate}
                                    </p>
                                </div>

                                <div className="mt-6 h-2 overflow-hidden bg-[#e3eaec]">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${request.progress ?? 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </DrawerSection>
                    )}

                    {request.status === 'active' && (
                        <DrawerSection
                            eyebrow="Case management"
                            title="Manage this case"
                            icon={ShieldCheck}
                        >
                            <div className="divide-y divide-[#dce5e8] border border-[#dce5e8] bg-white shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                                <ManagementAction
                                    icon={Users}
                                    title="Request additional support"
                                    description="Ask administration for volunteers or additional resources."
                                />

                                <ManagementAction
                                    icon={RotateCcw}
                                    title="Request withdrawal"
                                    description="Use when your organization can no longer continue this case."
                                    danger
                                />
                            </div>
                        </DrawerSection>
                    )}
                </div>

                {/* FOOTER */}

                <footer className="shrink-0 border-t border-[#d8e2e5] bg-white px-5 py-5 shadow-[0_-5px_18px_rgba(25,52,60,0.025)] sm:px-8">
                    <DrawerFooter
                        request={request}
                        onClose={onClose}
                        onAction={onAction}
                        actionLoading={actionLoading}
                    />
                </footer>
            </aside>
        </div>
    );
};

/* =========================================================
   DRAWER SECTION
========================================================= */

const DrawerSection = ({ eyebrow, title, icon: Icon, children }) => (
    <section className="mb-11">
        <div className="mb-5 flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center bg-[#e5f3f0] text-primary">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
            </div>

            <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8d999e]">
                    {eyebrow}
                </p>

                <h3 className="mt-1 text-[14px] font-bold tracking-[-0.015em] text-[#3a4c52]">
                    {title}
                </h3>
            </div>
        </div>

        {children}
    </section>
);

/* =========================================================
   DRAWER VALUE
========================================================= */

const DrawerValue = ({ label, value, accent = false }) => (
    <div className="border-b border-r border-[#e3e9eb] px-6 py-5 transition hover:bg-[#fbfcfc]">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#929da2]">
            {label}
        </p>

        <p
            className={`mt-2 text-[13px] font-semibold ${
                accent ? 'text-primary' : 'text-[#46585e]'
            }`}
        >
            {value}
        </p>
    </div>
);

/* =========================================================
   MANAGEMENT ACTION
========================================================= */

const ManagementAction = ({
    icon: Icon,
    title,
    description,
    danger = false,
}) => (
    <button
        type="button"
        className="group flex w-full items-center gap-5 px-6 py-5 text-left transition hover:bg-[#f8fafb]"
    >
        <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center ${
                danger
                    ? 'bg-[#f9ecea] text-[#ad554b]'
                    : 'bg-[#e5f3f0] text-primary'
            }`}
        >
            <Icon className="h-4 w-4" strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
            <p
                className={`text-[12px] font-bold ${
                    danger ? 'text-[#955149]' : 'text-[#40535a]'
                }`}
            >
                {title}
            </p>

            <p className="mt-1.5 text-[10px] leading-5 text-[#8a969b]">
                {description}
            </p>
        </div>

        <ChevronRight
            className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                danger ? 'text-[#c49b94]' : 'text-[#a0aaae]'
            }`}
        />
    </button>
);

/* =========================================================
   DRAWER FOOTER
========================================================= */

const DrawerFooter = ({ request, onClose, onAction, actionLoading }) => {
    if (request.status === 'pending') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] font-bold text-[#7d898e] transition hover:text-[#31444a]"
                >
                    Close
                </button>

                <div className="flex gap-2.5">
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => onAction(request, 'reject')}
                        className="border border-[#d8e1e4] bg-white px-4 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Decline
                    </button>

                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => onAction(request, 'accept')}
                        className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {actionLoading ? 'Processing...' : 'Accept assignment'}

                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    if (request.status === 'assigned') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] font-bold text-[#7d898e] transition hover:text-[#31444a]"
                >
                    Close
                </button>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover"
                >
                    Start assistance
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        );
    }

    if (request.status === 'active') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] font-bold text-[#7d898e] transition hover:text-[#31444a]"
                >
                    Close
                </button>

                <div className="flex gap-2.5">
                    <button
                        type="button"
                        className="border border-[#d8e1e4] bg-white px-4 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb]"
                    >
                        Add update
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover"
                    >
                        Complete case
                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="border border-[#d8e1e4] bg-white px-5 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb]"
            >
                Close review
            </button>
        </div>
    );
};

/* =========================================================
   URGENCY
========================================================= */

const UrgencyBadge = ({ urgency, dark = false }) => {
    const lightStyles = {
        High: 'bg-[#fff0ed] text-[#ad5145]',
        Medium: 'bg-[#fff3d4] text-[#9a6908]',
        Low: 'bg-[#edf1f1] text-[#637379]',
        Critical: 'bg-[#fff0ed] text-[#ad5145]',
        Normal: 'bg-[#fff3d4] text-[#9a6908]',
    };

    const darkStyles = {
        High: 'bg-[#ffffff]/10 text-[#ffd3c9]',
        Medium: 'bg-[#ffffff]/10 text-[#ffe0a0]',
        Low: 'bg-[#ffffff]/10 text-white/65',
        Critical: 'bg-[#ffffff]/10 text-[#ffd3c9]',
        Normal: 'bg-[#ffffff]/10 text-[#ffe0a0]',
    };

    return (
        <span
            className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-[9px] font-bold ${
                dark
                    ? darkStyles[urgency] || darkStyles.Normal
                    : lightStyles[urgency] || lightStyles.Normal
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {urgency} priority
        </span>
    );
};

export default OrgHelpRequests;
