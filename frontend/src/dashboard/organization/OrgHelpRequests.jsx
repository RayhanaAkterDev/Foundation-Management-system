import React, { useMemo, useState } from 'react';

import {
    Activity,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    FileText,
    HeartHandshake,
    MapPin,
    MessageSquareText,
    MoreHorizontal,
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
   DATA
========================================================= */

const REQUESTS = [
    {
        id: 1,
        title: 'Medical treatment support for Rahim',
        description:
            'Rahim needs financial assistance for urgent medical treatment.',
        category: 'Medical',
        district: 'Dhaka',
        peopleAffected: 1,
        amountNeeded: 25000,
        urgency: 'High',
        status: 'pending',
        submitted: 'Sep 2, 2026',
        submittedTime: '10:42 AM',
        assignmentAge: '2 hours ago',
        individual: 'Rahim Uddin',
        location: 'Mirpur, Dhaka',
        assignmentNote:
            'Please review the case and confirm whether your organization can provide the required medical support.',
        supportType: 'Medical treatment',
        progress: null,
        lastUpdate: null,
    },
    {
        id: 2,
        title: 'Education support for Ayesha',
        description:
            'Support is needed to continue Ayesha’s education and school expenses.',
        category: 'Education',
        district: 'Chattogram',
        peopleAffected: 1,
        amountNeeded: 18000,
        urgency: 'Medium',
        status: 'assigned',
        submitted: 'Sep 1, 2026',
        submittedTime: '3:15 PM',
        assignmentAge: '1 day ago',
        individual: 'Ayesha Rahman',
        location: 'Pahartali, Chattogram',
        assignmentNote:
            'The organization has accepted responsibility for supporting Ayesha’s education expenses.',
        supportType: 'Education expenses',
        progress: 15,
        lastUpdate: 'Accepted assignment yesterday',
    },
    {
        id: 3,
        title: 'Emergency food assistance for a family',
        description:
            'A family affected by recent flooding needs immediate food assistance.',
        category: 'Food',
        district: 'Sylhet',
        peopleAffected: 5,
        amountNeeded: 12000,
        urgency: 'High',
        status: 'active',
        submitted: 'Aug 30, 2026',
        submittedTime: '11:20 AM',
        assignmentAge: '4 days ago',
        individual: 'Jamal Ahmed',
        location: 'Companiganj, Sylhet',
        assignmentNote:
            'Immediate food support was requested following the recent flooding.',
        supportType: 'Emergency food',
        progress: 62,
        lastUpdate: 'Food package delivered · Sep 2',
    },
    {
        id: 4,
        title: 'Housing support after fire incident',
        description:
            'Temporary housing and essential household support are needed.',
        category: 'Housing',
        district: 'Narayanganj',
        peopleAffected: 4,
        amountNeeded: 40000,
        urgency: 'High',
        status: 'completed',
        submitted: 'Aug 24, 2026',
        submittedTime: '9:05 AM',
        assignmentAge: '10 days ago',
        individual: 'Hasan Ali',
        location: 'Fatullah, Narayanganj',
        assignmentNote:
            'Temporary housing and essential household items were required after the incident.',
        supportType: 'Housing support',
        progress: 100,
        lastUpdate: 'Assistance completed · Aug 31',
    },
    {
        id: 5,
        title: 'Mobility support for elderly person',
        description:
            'Assistance is needed to arrange mobility equipment and related care.',
        category: 'Disability Support',
        district: 'Gazipur',
        peopleAffected: 1,
        amountNeeded: 15000,
        urgency: 'Medium',
        status: 'rejected',
        submitted: 'Aug 22, 2026',
        submittedTime: '2:40 PM',
        assignmentAge: '12 days ago',
        individual: 'Abdul Karim',
        location: 'Tongi, Gazipur',
        assignmentNote:
            'The organization declined the assignment because the required support falls outside its current capacity.',
        supportType: 'Mobility equipment',
        progress: null,
        lastUpdate: 'Assignment declined · Aug 23',
    },
    {
        id: 6,
        title: 'Emergency shelter assistance',
        description:
            'The assigned organization requested withdrawal from this case.',
        category: 'Emergency',
        district: 'Kurigram',
        peopleAffected: 3,
        amountNeeded: 22000,
        urgency: 'High',
        status: 'withdrawal',
        submitted: 'Aug 20, 2026',
        submittedTime: '8:50 AM',
        assignmentAge: '14 days ago',
        individual: 'Mina Begum',
        location: 'Ulipur, Kurigram',
        assignmentNote:
            'The organization requested withdrawal because it can no longer provide the required assistance.',
        supportType: 'Emergency shelter',
        progress: 35,
        lastUpdate: 'Withdrawal requested · Sep 2',
    },
];

/* =========================================================
   CONFIG
========================================================= */

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        description: 'Awaiting your response',
        icon: Clock3,
        tone: 'amber',
    },
    assigned: {
        label: 'Assigned',
        description: 'Ready to start',
        icon: CheckCircle2,
        tone: 'blue',
    },
    active: {
        label: 'Active',
        description: 'Assistance in progress',
        icon: Activity,
        tone: 'teal',
    },
    completed: {
        label: 'Completed',
        description: 'Assistance finished',
        icon: CheckCircle2,
        tone: 'slate',
    },
    rejected: {
        label: 'Rejected',
        description: 'Assignment declined',
        icon: XCircle,
        tone: 'red',
    },
    withdrawal: {
        label: 'Withdrawal',
        description: 'Admin review required',
        icon: RotateCcw,
        tone: 'orange',
    },
};

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'withdrawal', label: 'Withdrawal' },
];

/* =========================================================
   MAIN
========================================================= */

const OrgHelpRequests = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const counts = useMemo(
        () => ({
            all: REQUESTS.length,
            pending: REQUESTS.filter((r) => r.status === 'pending').length,
            assigned: REQUESTS.filter((r) => r.status === 'assigned').length,
            active: REQUESTS.filter((r) => r.status === 'active').length,
            completed: REQUESTS.filter((r) => r.status === 'completed').length,
            rejected: REQUESTS.filter((r) => r.status === 'rejected').length,
            withdrawal: REQUESTS.filter((r) => r.status === 'withdrawal')
                .length,
        }),
        [],
    );

    const filteredRequests = useMemo(() => {
        const query = search.trim().toLowerCase();

        return REQUESTS.filter((request) => {
            const matchesFilter =
                activeFilter === 'all' || request.status === activeFilter;

            const matchesSearch =
                !query ||
                request.title.toLowerCase().includes(query) ||
                request.category.toLowerCase().includes(query) ||
                request.district.toLowerCase().includes(query) ||
                request.individual.toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, search]);

    const pendingRequests = REQUESTS.filter(
        (request) => request.status === 'pending',
    );

    const activeRequests = REQUESTS.filter(
        (request) => request.status === 'active',
    );

    const clearFilters = () => {
        setSearch('');
        setActiveFilter('all');
    };

    return (
        <div className="min-h-full bg-[#f7f9f8] text-slate-900">
            <div className="mx-auto max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                {/* =====================================================
                    HERO
                ===================================================== */}

                <header className="relative mb-6 overflow-hidden rounded-[28px] border border-[#dce8e3] bg-[#edf5f1]">
                    <div className="absolute -right-24 -top-32 h-[360px] w-[360px] rounded-full bg-[#d7eae3] blur-3xl" />

                    <div className="absolute -bottom-32 left-[40%] h-[260px] w-[260px] rounded-full bg-white/70 blur-3xl" />

                    <div className="relative grid lg:grid-cols-[1fr_360px]">
                        <div className="px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d3e4de] bg-white/70 px-2.5 py-1.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f766e] text-white">
                                    <HeartHandshake
                                        className="h-3 w-3"
                                        strokeWidth={1.8}
                                    />
                                </span>

                                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#52736b]">
                                    Organization · Case Management
                                </span>
                            </div>

                            <h1 className="font-fraunces text-[32px] font-semibold tracking-[-0.045em] text-[#17332e] sm:text-[40px]">
                                Help Requests
                            </h1>

                            <p className="mt-2 max-w-[590px] text-[11px] leading-6 text-[#62766f]">
                                Manage assigned cases, respond to new requests,
                                and keep every assistance journey moving
                                forward.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <HeroStat
                                    dot="bg-amber-500"
                                    value={counts.pending}
                                    label="Awaiting response"
                                />

                                <HeroStat
                                    dot="bg-[#0f766e]"
                                    value={counts.active}
                                    label="Active case"
                                />

                                <HeroStat
                                    dot="bg-slate-400"
                                    value={counts.completed}
                                    label="Completed"
                                />
                            </div>
                        </div>

                        {/* HERO WORKLOAD */}
                        <div className="hidden items-center justify-center p-7 lg:flex">
                            <div className="w-full rounded-[22px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_50px_rgba(26,67,57,0.08)] backdrop-blur-md">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-slate-400">
                                            Organization workload
                                        </p>

                                        <div className="mt-1 flex items-end gap-2">
                                            <span className="text-[28px] font-semibold tracking-[-0.05em] text-[#17332e]">
                                                {counts.assigned +
                                                    counts.active}
                                            </span>

                                            <span className="pb-1 text-[9px] font-medium text-slate-400">
                                                active responsibilities
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f2ed] text-[#0f766e]">
                                        <BriefcaseBusiness
                                            className="h-4 w-4"
                                            strokeWidth={1.8}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e6eeeb]">
                                    <div
                                        className="h-full rounded-full bg-[#0f766e] transition-all"
                                        style={{
                                            width: `${Math.max(
                                                10,
                                                ((counts.assigned +
                                                    counts.active) /
                                                    counts.all) *
                                                    100,
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-2 flex justify-between text-[8px] font-medium text-slate-400">
                                    <span>Assigned + active</span>
                                    <span>{counts.all} total cases</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =====================================================
                    PRIORITY ALERT
                ===================================================== */}

                {pendingRequests.length > 0 && (
                    <section className="mb-6 rounded-[20px] border border-[#eadfc9] bg-[#fffaf1] shadow-[0_6px_25px_rgba(120,80,20,0.025)]">
                        <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9ecd0] text-[#a16207]">
                                    <AlertCircle
                                        className="h-[17px] w-[17px]"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-[11px] font-bold text-[#713f12]">
                                            {pendingRequests.length} assignment
                                            {pendingRequests.length !== 1
                                                ? 's'
                                                : ''}{' '}
                                            need your attention
                                        </p>

                                        <span className="rounded-full bg-[#f8e8c7] px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide text-[#93610b]">
                                            Action required
                                        </span>
                                    </div>

                                    <p className="mt-1 text-[9px] leading-5 text-[#92734b]">
                                        Review the assigned case before
                                        accepting or declining responsibility.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveFilter('pending')}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8a5b16] px-4 py-2.5 text-[9px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#70490f]"
                            >
                                Review pending
                                <ArrowRight
                                    className="h-3 w-3"
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    </section>
                )}

                {/* =====================================================
                    TOOLBAR
                ===================================================== */}

                <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />

                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                Case queue
                            </p>
                        </div>

                        <p className="mt-1 text-[10px] text-slate-400">
                            {filteredRequests.length} request
                            {filteredRequests.length !== 1 ? 's' : ''} shown
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-[310px]">
                            <Search
                                className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                strokeWidth={1.8}
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search cases, people, locations..."
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-[10px] font-medium text-slate-700 shadow-[0_4px_18px_rgba(15,23,42,0.025)] outline-none transition placeholder:text-slate-400 focus:border-[#0f766e]/30 focus:ring-4 focus:ring-[#0f766e]/5"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[9px] font-bold text-slate-600 shadow-sm xl:hidden"
                        >
                            Filters
                            <ChevronDown
                                className={`h-3 w-3 transition-transform ${
                                    showFilters ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                    </div>
                </section>

                {/* =====================================================
                    FILTERS
                ===================================================== */}

                <div
                    className={`mb-5 overflow-x-auto ${
                        showFilters ? 'block' : ''
                    }`}
                >
                    <div className="inline-flex min-w-max rounded-xl border border-slate-200 bg-white p-1 shadow-[0_4px_18px_rgba(15,23,42,0.025)]">
                        {FILTERS.map((filter) => {
                            const isActive = activeFilter === filter.key;

                            return (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.key)}
                                    className={`group relative rounded-lg px-3.5 py-2 text-[9px] font-bold transition ${
                                        isActive
                                            ? 'bg-[#173f38] text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    {filter.label}

                                    <span
                                        className={`ml-1.5 ${
                                            isActive
                                                ? 'text-white/60'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {counts[filter.key]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
                    {/* REQUEST TABLE */}
                    <section className="min-w-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.035)]">
                        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-[13px] font-bold tracking-[-0.01em] text-slate-800">
                                        Help request queue
                                    </h2>

                                    <p className="mt-1 text-[9px] text-slate-400">
                                        Review and manage cases assigned to your
                                        organization.
                                    </p>
                                </div>

                                <div className="hidden items-center gap-2 rounded-full bg-[#f3f7f5] px-3 py-1.5 sm:flex">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0f766e]" />

                                    <span className="text-[8px] font-bold text-[#52736b]">
                                        Live status
                                    </span>
                                </div>
                            </div>
                        </div>

                        {filteredRequests.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {filteredRequests.map((request) => (
                                    <RequestRow
                                        key={request.id}
                                        request={request}
                                        onReview={() =>
                                            setSelectedRequest(request)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState onClear={clearFilters} />
                        )}

                        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-[8px] font-medium text-slate-400">
                                Showing {filteredRequests.length} of{' '}
                                {REQUESTS.length} requests
                            </p>

                            {(search || activeFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-[8px] font-bold text-[#0f766e] hover:underline"
                                >
                                    Clear search & filters
                                </button>
                            )}
                        </div>
                    </section>

                    {/* SIDEBAR */}
                    <aside className="space-y-4">
                        <WorkloadPanel
                            counts={counts}
                            activeRequests={activeRequests}
                        />

                        <WorkflowPanel />

                        <div className="rounded-[20px] border border-[#dce7e3] bg-gradient-to-br from-[#edf6f2] to-[#f7faf8] p-4">
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0f766e] shadow-sm">
                                    <ShieldCheck
                                        className="h-4 w-4"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-[#23443d]">
                                        Responsible case management
                                    </p>

                                    <p className="mt-1 text-[8px] leading-5 text-[#668079]">
                                        Accept assignments only when your
                                        organization has the capacity to provide
                                        the required support.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* =====================================================
                REVIEW DRAWER
            ===================================================== */}

            {selectedRequest && (
                <CaseReview
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </div>
    );
};

/* =========================================================
   HERO STAT
========================================================= */

const HeroStat = ({ dot, value, label }) => (
    <div className="flex items-center gap-2 rounded-full border border-[#d6e4df] bg-white/75 px-3 py-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />

        <span className="text-[9px] font-bold text-[#46645d]">
            {value} {label}
        </span>
    </div>
);

/* =========================================================
   REQUEST ROW
========================================================= */

const RequestRow = ({ request, onReview }) => {
    const statusConfig = STATUS_CONFIG[request.status];

    const colors = {
        amber: {
            badge: 'bg-[#fff7e6] text-[#9a6700] ring-[#eed9a8]',
            icon: 'bg-[#fff4dc] text-[#a16207]',
        },
        blue: {
            badge: 'bg-[#eef5ff] text-[#3567a8] ring-[#cbdcf2]',
            icon: 'bg-[#edf4fc] text-[#3970b4]',
        },
        teal: {
            badge: 'bg-[#eaf7f3] text-[#0f766e] ring-[#c6e4dc]',
            icon: 'bg-[#e6f3ef] text-[#0f766e]',
        },
        slate: {
            badge: 'bg-[#f2f4f5] text-[#59636b] ring-[#dce1e4]',
            icon: 'bg-[#eef1f2] text-[#59636b]',
        },
        red: {
            badge: 'bg-[#fff0f0] text-[#b33a3a] ring-[#efcccc]',
            icon: 'bg-[#fff0f0] text-[#b33a3a]',
        },
        orange: {
            badge: 'bg-[#fff3e9] text-[#a95d20] ring-[#efd2b9]',
            icon: 'bg-[#fff1e6] text-[#a95d20]',
        },
    }[statusConfig.tone];

    return (
        <article
            className={`group relative px-5 py-5 transition-all duration-200 hover:bg-[#fbfdfc] sm:px-6 ${
                request.status === 'pending' ? 'bg-[#fffdf8]/60' : ''
            }`}
        >
            {request.status === 'pending' && (
                <div className="absolute left-0 top-0 h-full w-[3px] bg-[#d59b2b]" />
            )}

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                {/* CASE */}
                <div className="min-w-0 flex-1">
                    <div className="flex gap-3.5">
                        <div
                            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
                        >
                            <FileText
                                className="h-[17px] w-[17px]"
                                strokeWidth={1.7}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-[12px] font-bold tracking-[-0.01em] text-slate-800 sm:text-[13px]">
                                    {request.title}
                                </h3>

                                {request.status === 'pending' &&
                                    request.urgency === 'High' && (
                                        <span className="rounded-full bg-[#fff0e6] px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide text-[#b45c20]">
                                            Needs response
                                        </span>
                                    )}
                            </div>

                            <p className="mt-1 line-clamp-1 max-w-[680px] text-[9px] leading-5 text-slate-400">
                                {request.description}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[8px] text-slate-400">
                                <span className="font-bold text-slate-500">
                                    {request.category}
                                </span>

                                <span className="text-slate-300">•</span>

                                <span className="inline-flex items-center gap-1">
                                    <MapPin
                                        className="h-2.5 w-2.5"
                                        strokeWidth={1.7}
                                    />
                                    {request.district}
                                </span>

                                <span className="text-slate-300">•</span>

                                <span>
                                    {request.peopleAffected}{' '}
                                    {request.peopleAffected === 1
                                        ? 'person'
                                        : 'people'}{' '}
                                    affected
                                </span>

                                <span className="text-slate-300">•</span>

                                <span className="font-bold text-slate-500">
                                    {formatCurrency(request.amountNeeded)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBMITTED */}
                <div className="hidden w-[100px] shrink-0 xl:block">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Submitted
                    </p>

                    <p className="mt-1.5 text-[9px] font-bold text-slate-600">
                        {request.submitted}
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                        {request.submittedTime}
                    </p>
                </div>

                {/* URGENCY */}
                <div className="w-[70px] shrink-0">
                    <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 xl:hidden">
                        Urgency
                    </p>

                    <UrgencyBadge urgency={request.urgency} />
                </div>

                {/* STATUS */}
                <div className="w-[96px] shrink-0">
                    <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 xl:hidden">
                        Status
                    </p>

                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[7px] font-bold ring-1 ring-inset ${colors.badge}`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        {statusConfig.label}
                    </span>
                </div>

                {/* ACTION */}
                <div className="shrink-0">
                    <RequestActions request={request} onReview={onReview} />
                </div>
            </div>
        </article>
    );
};

/* =========================================================
   ACTIONS
========================================================= */

const RequestActions = ({ request, onReview }) => {
    if (request.status === 'pending') {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={onReview}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8e2df] bg-white px-3 py-2 text-[8px] font-bold text-[#31564e] shadow-sm transition hover:border-[#9ebcb4] hover:bg-[#f4f9f7]"
                >
                    Review
                    <ArrowUpRight className="h-3 w-3" />
                </button>

                <button
                    type="button"
                    onClick={onReview}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f766e] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#115e59]"
                    title="Accept assignment"
                >
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                </button>

                <button
                    type="button"
                    onClick={onReview}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Reject assignment"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
        );
    }

    if (request.status === 'assigned') {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={onReview}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[8px] font-bold text-slate-600 shadow-sm transition hover:border-[#b8d0ca] hover:bg-[#f4f9f7] hover:text-[#0f766e]"
                >
                    View
                </button>

                <button
                    type="button"
                    onClick={onReview}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-3 py-2 text-[8px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#115e59]"
                >
                    Start
                    <ArrowRight className="h-3 w-3" />
                </button>
            </div>
        );
    }

    if (request.status === 'active') {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={onReview}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-3 py-2 text-[8px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#115e59]"
                >
                    Continue
                    <ArrowUpRight className="h-3 w-3" />
                </button>

                <button
                    type="button"
                    onClick={onReview}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#b8d0ca] hover:bg-[#f4f9f7] hover:text-[#0f766e]"
                    title="More case actions"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onReview}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[8px] font-bold text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
        >
            View
            <ArrowUpRight className="h-3 w-3" />
        </button>
    );
};

/* =========================================================
   WORKLOAD PANEL
========================================================= */

const WorkloadPanel = ({ counts, activeRequests }) => {
    const averageProgress = activeRequests.length
        ? Math.round(
              activeRequests.reduce(
                  (sum, request) => sum + (request.progress || 0),
                  0,
              ) / activeRequests.length,
          )
        : 0;

    return (
        <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.03)]">
            <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                            My workload
                        </p>

                        <h2 className="mt-1 text-[13px] font-bold text-slate-800">
                            Current cases
                        </h2>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5f2] text-[#0f766e]">
                        <Users className="h-4 w-4" strokeWidth={1.7} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-100">
                <Metric label="Assigned" value={counts.assigned} tone="blue" />

                <Metric label="Active" value={counts.active} tone="teal" />
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
                <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[8px] font-bold text-slate-500">
                        Active progress
                    </span>

                    <span className="text-[8px] font-bold text-[#0f766e]">
                        {averageProgress}%
                    </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-[#0f766e] transition-all"
                        style={{
                            width: `${averageProgress}%`,
                        }}
                    />
                </div>

                {activeRequests.length > 0 && (
                    <div className="mt-4 space-y-2.5">
                        {activeRequests.slice(0, 2).map((request) => (
                            <div
                                key={request.id}
                                className="flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-[8px] font-bold text-slate-600">
                                        {request.title}
                                    </p>

                                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-[#9bc9bd]"
                                            style={{
                                                width: `${request.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <span className="shrink-0 text-[8px] font-bold text-slate-400">
                                    {request.progress}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

/* =========================================================
   WORKFLOW PANEL
========================================================= */

const WorkflowPanel = () => {
    const steps = [
        {
            label: 'Pending',
            text: 'Review assignment',
            active: true,
        },
        {
            label: 'Assigned',
            text: 'Accept & prepare',
        },
        {
            label: 'Active',
            text: 'Provide assistance',
        },
        {
            label: 'Completed',
            text: 'Close the case',
        },
    ];

    return (
        <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.02)]">
            <div className="mb-5">
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Case lifecycle
                </p>

                <h2 className="mt-1 text-[12px] font-bold text-slate-800">
                    How an assignment moves
                </h2>
            </div>

            <div className="space-y-4">
                {steps.map((step, index) => (
                    <div
                        key={step.label}
                        className="relative flex items-start gap-3"
                    >
                        {index !== steps.length - 1 && (
                            <span className="absolute left-[9px] top-[21px] h-[27px] w-px bg-slate-200" />
                        )}

                        <span
                            className={`relative z-10 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full text-[7px] font-bold ${
                                step.active
                                    ? 'bg-[#0f766e] text-white shadow-[0_0_0_4px_#eaf5f1]'
                                    : 'bg-slate-100 text-slate-400'
                            }`}
                        >
                            {index + 1}
                        </span>

                        <div>
                            <p
                                className={`text-[8px] font-bold ${
                                    step.active
                                        ? 'text-[#0f766e]'
                                        : 'text-slate-600'
                                }`}
                            >
                                {step.label}
                            </p>

                            <p className="mt-0.5 text-[7px] text-slate-400">
                                {step.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 bg-[#f7f9f8] px-3 py-2.5">
                <p className="text-[7px] leading-4 text-slate-400">
                    Withdrawal and additional support can be requested from an
                    active case when genuinely needed.
                </p>
            </div>
        </section>
    );
};

/* =========================================================
   METRIC
========================================================= */

const Metric = ({ label, value, tone }) => {
    const styles = {
        blue: 'text-[#3970b4]',
        teal: 'text-[#0f766e]',
    };

    return (
        <div className="px-5 py-4">
            <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1.5 text-[24px] font-semibold tracking-[-0.04em] ${styles[tone]}`}
            >
                {value}
            </p>
        </div>
    );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ onClear }) => (
    <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3f1] text-[#719089]">
            <Search className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <h3 className="text-[13px] font-bold text-slate-700">
            No matching requests
        </h3>

        <p className="mt-1.5 max-w-sm text-[9px] leading-5 text-slate-400">
            No cases match your current search or status filter.
        </p>

        <button
            type="button"
            onClick={onClear}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#edf5f2] px-3 py-2 text-[8px] font-bold text-[#0f766e] transition hover:bg-[#e3efeb]"
        >
            <RefreshCcw className="h-3 w-3" strokeWidth={1.8} />
            Reset view
        </button>
    </div>
);

/* =========================================================
   CASE REVIEW DRAWER
========================================================= */

const CaseReview = ({ request, onClose }) => {
    const statusConfig = STATUS_CONFIG[request.status];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <button
                type="button"
                aria-label="Close case review"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-slate-950/25 backdrop-blur-[3px]"
            />

            <aside className="relative z-10 flex h-full w-full max-w-[650px] flex-col bg-[#f8faf9] shadow-[-24px_0_70px_rgba(15,23,42,0.16)]">
                {/* DRAWER HEADER */}

                <div className="shrink-0 border-b border-[#dfe7e4] bg-white px-6 py-5 sm:px-7">
                    <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                            <div className="mb-3 flex items-center gap-2">
                                <span className="rounded-full bg-[#f1f4f3] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.17em] text-slate-400">
                                    Case review
                                </span>

                                <span className="text-slate-300">/</span>

                                <span className="text-[8px] font-bold text-[#0f766e]">
                                    HR-
                                    {String(request.id).padStart(4, '0')}
                                </span>
                            </div>

                            <h2 className="font-fraunces text-[23px] font-semibold leading-tight tracking-[-0.035em] text-[#18352f]">
                                {request.title}
                            </h2>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5f2] px-2.5 py-1.5 text-[7px] font-bold text-[#0f766e]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {statusConfig.label}
                                </span>

                                <UrgencyBadge urgency={request.urgency} />

                                <span className="text-[8px] text-slate-400">
                                    Submitted {request.submitted}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7">
                    <CaseActionPanel request={request} />

                    <ReviewSection
                        eyebrow="Request"
                        title="Case information"
                        icon={FileText}
                    >
                        <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
                            <InfoCell
                                label="Category"
                                value={request.category}
                            />

                            <InfoCell
                                label="People affected"
                                value={`${request.peopleAffected} ${
                                    request.peopleAffected === 1
                                        ? 'person'
                                        : 'people'
                                }`}
                            />

                            <InfoCell
                                label="Amount needed"
                                value={formatCurrency(request.amountNeeded)}
                                emphasis
                            />

                            <InfoCell
                                label="Support needed"
                                value={request.supportType}
                            />

                            <InfoCell
                                label="Location"
                                value={request.location}
                            />

                            <InfoCell
                                label="District"
                                value={request.district}
                            />
                        </div>

                        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Description
                            </p>

                            <p className="mt-2 text-[9px] leading-5 text-slate-600">
                                {request.description}
                            </p>
                        </div>
                    </ReviewSection>

                    <ReviewSection
                        eyebrow="Requester"
                        title="Individual information"
                        icon={UserRound}
                    >
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf3f0] text-[#0f766e]">
                                <UserRound
                                    className="h-4 w-4"
                                    strokeWidth={1.7}
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-700">
                                    {request.individual}
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-[8px] text-slate-400">
                                    <MapPin className="h-3 w-3" />
                                    {request.location}
                                </div>
                            </div>
                        </div>
                    </ReviewSection>

                    <ReviewSection
                        eyebrow="Assignment"
                        title="Admin's assignment"
                        icon={BriefcaseBusiness}
                    >
                        <div className="rounded-xl border border-[#d9e6e2] bg-[#f2f7f5] p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0f766e] shadow-sm">
                                    <MessageSquareText
                                        className="h-4 w-4"
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <div>
                                    <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[#668078]">
                                        Assignment note
                                    </p>

                                    <p className="mt-2 text-[9px] leading-5 text-[#46625b]">
                                        {request.assignmentNote}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <SmallInfo
                                label="Received"
                                value={request.assignmentAge}
                            />

                            <SmallInfo
                                label="Current responsibility"
                                value={
                                    request.status === 'pending'
                                        ? 'Awaiting decision'
                                        : 'Organization'
                                }
                            />
                        </div>
                    </ReviewSection>

                    {(request.status === 'active' ||
                        request.status === 'assigned' ||
                        request.status === 'completed' ||
                        request.status === 'withdrawal') && (
                        <ReviewSection
                            eyebrow="Assistance"
                            title="Case progress"
                            icon={Activity}
                        >
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[8px] font-bold text-slate-500">
                                            Assistance progress
                                        </p>

                                        <p className="mt-1 text-[22px] font-semibold tracking-tight text-[#173d36]">
                                            {request.progress || 0}%
                                        </p>
                                    </div>

                                    <span className="text-right text-[7px] leading-4 text-slate-400">
                                        {request.lastUpdate ||
                                            'No progress update yet'}
                                    </span>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-[#0f766e] transition-all"
                                        style={{
                                            width: `${request.progress || 0}%`,
                                        }}
                                    />
                                </div>

                                {request.status === 'active' && (
                                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#f6f8f7] px-3 py-2.5">
                                        <Activity className="h-3.5 w-3.5 text-[#0f766e]" />

                                        <p className="text-[7px] leading-4 text-slate-500">
                                            Continue recording meaningful
                                            assistance updates as the case
                                            progresses.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ReviewSection>
                    )}

                    {request.status === 'active' && (
                        <ReviewSection
                            eyebrow="Case options"
                            title="Need administrative help?"
                            icon={ShieldCheck}
                        >
                            <div className="grid gap-3 sm:grid-cols-2">
                                <CaseOption
                                    icon={Users}
                                    title="Request additional support"
                                    description="Ask Admin for volunteers, resources, or organizational support."
                                />

                                <CaseOption
                                    icon={RotateCcw}
                                    title="Request withdrawal"
                                    description="Use only when your organization can no longer continue the case."
                                    danger
                                />
                            </div>
                        </ReviewSection>
                    )}
                </div>

                {/* FOOTER */}

                <div className="shrink-0 border-t border-[#dfe7e4] bg-white px-6 py-4 sm:px-7">
                    <DrawerFooter request={request} onClose={onClose} />
                </div>
            </aside>
        </div>
    );
};

/* =========================================================
   CASE OPTION
========================================================= */

const CaseOption = ({ icon: Icon, title, description, danger = false }) => (
    <button
        type="button"
        className={`group rounded-xl border bg-white p-4 text-left transition ${
            danger
                ? 'border-slate-200 hover:border-[#e7caca] hover:bg-[#fffafa]'
                : 'border-slate-200 hover:border-[#bfd7d0] hover:bg-[#f6faf8]'
        }`}
    >
        <div className="flex items-center justify-between">
            <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    danger
                        ? 'bg-[#fff0f0] text-[#b33a3a]'
                        : 'bg-[#edf5f2] text-[#0f766e]'
                }`}
            >
                <Icon className="h-4 w-4" strokeWidth={1.7} />
            </div>

            <ArrowUpRight
                className={`h-3.5 w-3.5 text-slate-300 transition ${
                    danger
                        ? 'group-hover:text-[#b33a3a]'
                        : 'group-hover:text-[#0f766e]'
                }`}
            />
        </div>

        <p className="mt-3 text-[9px] font-bold text-slate-700">{title}</p>

        <p className="mt-1 text-[7px] leading-4 text-slate-400">
            {description}
        </p>
    </button>
);

/* =========================================================
   CASE ACTION PANEL
========================================================= */

const CaseActionPanel = ({ request }) => {
    if (request.status === 'pending') {
        return (
            <div className="mb-7 overflow-hidden rounded-2xl border border-[#eadfc9] bg-[#fffaf0]">
                <div className="h-1 bg-[#d59b2b]" />

                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f9ecd0] text-[#9a6700]">
                            <Clock3 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-[#713f12]">
                                Assignment awaiting your decision
                            </p>

                            <p className="mt-1 text-[8px] leading-5 text-[#92734b]">
                                Review the request carefully. Accepting will
                                make your organization officially responsible
                                for this case.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-3.5 py-2 text-[8px] font-bold text-white shadow-sm transition hover:bg-[#115e59]"
                                >
                                    <Check className="h-3 w-3" />
                                    Accept assignment
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6d6ba] bg-white px-3.5 py-2 text-[8px] font-bold text-[#8a5b16] hover:bg-[#fffdf8]"
                                >
                                    <X className="h-3 w-3" />
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (request.status === 'assigned') {
        return (
            <div className="mb-7 rounded-2xl border border-[#d6e2ef] bg-[#f3f7fc] p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#3970b4] shadow-sm">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-[#315a8e]">
                            You are officially assigned
                        </p>

                        <p className="mt-1 text-[8px] leading-5 text-[#66809f]">
                            Start assistance when your organization is ready to
                            begin handling the case.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (request.status === 'active') {
        return (
            <div className="mb-7 rounded-2xl border border-[#cfe3dd] bg-[#edf7f4] p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0f766e] shadow-sm">
                        <Activity className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-[#0f625b]">
                            Assistance is in progress
                        </p>

                        <p className="mt-1 text-[8px] leading-5 text-[#62827b]">
                            Keep the case updated and record the assistance
                            provided before completing it.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

/* =========================================================
   DRAWER FOOTER
========================================================= */

const DrawerFooter = ({ request, onClose }) => {
    if (request.status === 'assigned') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[8px] font-bold text-slate-500 hover:text-slate-800"
                >
                    Close
                </button>

                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-4 py-2.5 text-[8px] font-bold text-white shadow-sm hover:bg-[#115e59]"
                >
                    Start assistance
                    <ArrowRight className="h-3 w-3" />
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
                    className="text-[8px] font-bold text-slate-500 hover:text-slate-800"
                >
                    Close
                </button>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[8px] font-bold text-slate-600 hover:bg-slate-50"
                    >
                        Add update
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-4 py-2.5 text-[8px] font-bold text-white hover:bg-[#115e59]"
                    >
                        Complete case
                        <Check className="h-3 w-3" />
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[8px] font-bold text-slate-600 hover:bg-slate-50"
            >
                Close review
            </button>
        </div>
    );
};

/* =========================================================
   REVIEW SECTION
========================================================= */

const ReviewSection = ({ eyebrow, title, icon: Icon, children }) => (
    <section className="mb-7">
        <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf4f1] text-[#0f766e]">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
            </div>

            <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    {eyebrow}
                </p>

                <h3 className="mt-0.5 text-[10px] font-bold text-slate-700">
                    {title}
                </h3>
            </div>
        </div>

        {children}
    </section>
);

/* =========================================================
   INFO CELL
========================================================= */

const InfoCell = ({ label, value, emphasis = false }) => (
    <div className="bg-white px-4 py-3.5">
        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {label}
        </p>

        <p
            className={`mt-1.5 text-[9px] ${
                emphasis
                    ? 'font-bold text-[#0f766e]'
                    : 'font-semibold text-slate-600'
            }`}
        >
            {value}
        </p>
    </div>
);

/* =========================================================
   SMALL INFO
========================================================= */

const SmallInfo = ({ label, value }) => (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3">
        <p className="text-[7px] font-bold uppercase tracking-[0.11em] text-slate-400">
            {label}
        </p>

        <p className="mt-1.5 text-[8px] font-bold text-slate-600">{value}</p>
    </div>
);

/* =========================================================
   URGENCY BADGE
========================================================= */

const UrgencyBadge = ({ urgency }) => {
    const config = {
        High: 'bg-[#fff0ed] text-[#b54b38] ring-[#efccc5]',
        Medium: 'bg-[#fff7e7] text-[#9a6700] ring-[#ecd7a8]',
        Low: 'bg-[#f1f3f4] text-[#687178] ring-[#dce0e2]',
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1.5 text-[7px] font-bold ring-1 ring-inset ${
                config[urgency] || config.Low
            }`}
        >
            {urgency}
        </span>
    );
};

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (amount) => `৳${amount.toLocaleString('en-BD')}`;

export default OrgHelpRequests;
