import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowUpRight,
    Check,
    ChevronRight,
    Clock3,
    HeartHandshake,
    MapPin,
    Megaphone,
    ShieldCheck,
    Users,
    TrendingUp,
    CircleAlert,
} from 'lucide-react';

const organization = {
    name: 'Hope Foundation Bangladesh',
    type: 'Community organization',
    location: 'Dhaka',
    verificationStatus: 'verified',
};

const overview = {
    assignedRequests: 18,
    activeRequests: 6,
    completedRequests: 11,
    activeCampaigns: 3,
    peopleHelped: 1248,
    fundsRaised: 452500,
};

const workQueue = [
    {
        id: 1,
        title: 'Education Support for Rahim',
        category: 'Education',
        urgency: 'High',
        status: 'Awaiting response',
        assigned: 'Sep 1, 2026',
        description:
            'A student needs financial support to continue his education after his family lost their primary source of income.',
    },
    {
        id: 2,
        title: 'Emergency Food Assistance',
        category: 'Food Assistance',
        urgency: 'Medium',
        status: 'In progress',
        assigned: 'Aug 30, 2026',
        description:
            'A family requires immediate food assistance and basic household supplies.',
    },
    {
        id: 3,
        title: 'Flood Relief Support',
        category: 'Disaster Relief',
        urgency: 'High',
        status: 'In progress',
        assigned: 'Aug 27, 2026',
        description:
            'Relief support is being coordinated for families affected by recent flooding.',
    },
];

const campaigns = [
    {
        id: 1,
        title: 'Winter Relief 2026',
        category: 'Disaster Relief',
        raised: 72500,
        goal: 100000,
        deadline: 'Oct 5, 2026',
        status: 'Active',
    },
    {
        id: 2,
        title: 'Education Support Drive',
        category: 'Education',
        raised: 48000,
        goal: 75000,
        deadline: 'Sep 28, 2026',
        status: 'Active',
    },
];

const team = [
    {
        id: 1,
        name: 'Volunteers',
        value: 14,
        detail: '8 currently available',
        icon: Users,
    },
    {
        id: 2,
        name: 'Active requests',
        value: 6,
        detail: 'currently being handled',
        icon: HeartHandshake,
    },
    {
        id: 3,
        name: 'Campaigns',
        value: 3,
        detail: 'currently active',
        icon: Megaphone,
    },
];

const activity = [
    {
        id: 1,
        text: 'Education Support Drive was approved by SP.',
        date: 'Aug 29, 2026',
    },
    {
        id: 2,
        text: 'Two volunteers accepted their assignments.',
        date: 'Aug 28, 2026',
    },
    {
        id: 3,
        text: 'Emergency Food Assistance moved to in progress.',
        date: 'Aug 27, 2026',
    },
    {
        id: 4,
        text: 'Winter Relief 2026 received ৳5,000.',
        date: 'Aug 26, 2026',
    },
];

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
    })
        .format(amount)
        .replace('.00', '');

const getInitials = (name) =>
    name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

/* ================================================================
   SMALL UI HELPERS
================================================================ */

const Eyebrow = ({ children, className = '' }) => (
    <span
        className={`font-poppins text-[8px] font-bold uppercase tracking-[0.18em] text-primary ${className}`}
    >
        {children}
    </span>
);

const SectionHeading = ({
    eyebrow,
    title,
    description,
    action,
    onAction,
    muted = false,
}) => (
    <div className="flex flex-col gap-5 border-b border-[#cfdad7] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <Eyebrow className={muted ? 'text-[#6f8b86]' : ''}>
                {eyebrow}
            </Eyebrow>

            <h2 className="mt-2.5 font-fraunces text-[34px] leading-[0.95] tracking-[-0.045em] text-[#163c37] sm:text-[38px]">
                {title}
            </h2>

            {description && (
                <p className="mt-3 max-w-[560px] font-poppins text-[9px] leading-5 text-[#6b7f7c]">
                    {description}
                </p>
            )}
        </div>

        {action && (
            <button
                type="button"
                onClick={onAction}
                className="group inline-flex shrink-0 items-center gap-2 self-start pb-1 font-poppins text-[8px] font-bold uppercase tracking-[0.1em] text-[#617672] transition hover:text-primary sm:self-auto"
            >
                {action}
                <ArrowUpRight
                    size={12}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
            </button>
        )}
    </div>
);

/* ================================================================
   PRIORITY REQUEST
================================================================ */

const PriorityRequest = ({ request, index, onClick }) => {
    const isHigh = request.urgency === 'High';
    const isWaiting = request.status === 'Awaiting response';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative w-full text-left transition ${
                isWaiting
                    ? 'bg-[#fffaf1] hover:bg-[#fff5e4]'
                    : 'bg-[#fbfcfb] hover:bg-[#f1f7f5]'
            }`}
        >
            {isWaiting && (
                <div className="absolute inset-y-0 left-0 w-[4px] bg-[#f59e0b]" />
            )}

            <div className="grid lg:grid-cols-[68px_minmax(0,1fr)_175px_48px]">
                {/* INDEX */}
                <div
                    className={`flex min-h-[176px] items-start justify-center border-b border-[#d7e1de] border-r border-[#d7e1de] pt-7 font-fraunces text-[18px] lg:border-b-0 ${
                        isWaiting ? 'text-[#c48a30]' : 'text-[#a5b4b0]'
                    }`}
                >
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* MAIN REQUEST */}
                <div className="min-w-0 border-b border-[#d7e1de] px-6 py-7 sm:px-8 lg:border-b-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-poppins text-[7px] font-bold uppercase tracking-[0.13em] text-[#82928e]">
                            {request.category}
                        </span>

                        <span className="h-[3px] w-[3px] rounded-full bg-[#c5d1ce]" />

                        <span
                            className={`inline-flex items-center gap-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.09em] ${
                                isHigh ? 'text-[#aa6734]' : 'text-[#9a7b2d]'
                            }`}
                        >
                            <span
                                className={`h-[5px] w-[5px] rounded-full ${
                                    isHigh ? 'bg-[#d4773b]' : 'bg-[#c39d3e]'
                                }`}
                            />
                            {request.urgency} priority
                        </span>
                    </div>

                    <h3
                        className={`mt-3 font-jost text-[20px] font-semibold leading-[1.1] tracking-[-0.025em] transition-colors ${
                            isWaiting
                                ? 'text-[#40362d] group-hover:text-[#a75c24]'
                                : 'text-[#23413d] group-hover:text-primary'
                        }`}
                    >
                        {request.title}
                    </h3>

                    <p className="mt-3 max-w-[650px] font-poppins text-[9px] leading-5 text-[#71817d]">
                        {request.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 font-poppins text-[7px] font-medium uppercase tracking-[0.06em] text-[#99a7a3]">
                        <Clock3 size={10} />
                        Assigned {request.assigned}
                    </div>
                </div>

                {/* STATUS */}
                <div
                    className={`flex min-h-[80px] items-center border-b border-[#d7e1de] px-6 py-5 lg:min-h-[176px] lg:border-b-0 lg:border-l ${
                        isWaiting
                            ? 'bg-[#fff7e9] lg:border-l-[#eadbc2]'
                            : 'bg-[#f4f8f7] lg:border-l-[#d7e1de]'
                    }`}
                >
                    <div>
                        <div className="font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#94a29f]">
                            Status
                        </div>

                        <div
                            className={`mt-2 font-jost text-[14px] font-semibold ${
                                isWaiting ? 'text-[#a75c24]' : 'text-primary'
                            }`}
                        >
                            {request.status}
                        </div>
                    </div>
                </div>

                {/* ARROW */}
                <div className="flex items-center justify-end px-5 lg:justify-center lg:border-l lg:border-[#d7e1de] lg:px-0">
                    <ChevronRight
                        size={18}
                        strokeWidth={1.5}
                        className={`text-[#a6b4b0] transition-all group-hover:translate-x-1 ${
                            isWaiting
                                ? 'group-hover:text-[#b16a32]'
                                : 'group-hover:text-primary'
                        }`}
                    />
                </div>
            </div>
        </button>
    );
};

/* ================================================================
   CAMPAIGN
================================================================ */

const CampaignItem = ({ campaign, onClick, featured = false }) => {
    const percentage = Math.min(
        Math.round((campaign.raised / campaign.goal) * 100),
        100,
    );

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group w-full text-left transition ${
                featured
                    ? 'bg-[#e8f2ef] hover:bg-[#e2eeeb]'
                    : 'bg-[#f8faf9] hover:bg-[#f0f6f4]'
            }`}
        >
            <div className="grid md:grid-cols-[minmax(230px,0.9fr)_1.25fr_150px] md:items-center">
                {/* TITLE */}
                <div className="px-6 py-7 sm:px-8 md:py-8">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-[6px] w-[6px] rounded-full ${
                                featured ? 'bg-primary' : 'bg-[#8baaa4]'
                            }`}
                        />

                        <span className="font-poppins text-[7px] font-bold uppercase tracking-[0.13em] text-[#81918d]">
                            {campaign.category}
                        </span>
                    </div>

                    <h3 className="mt-3 font-jost text-[19px] font-semibold tracking-[-0.025em] text-[#294540] transition-colors group-hover:text-primary">
                        {campaign.title}
                    </h3>

                    <span className="mt-3 inline-flex items-center gap-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.08em] text-primary">
                        {campaign.status}
                        <span className="h-[4px] w-[4px] rounded-full bg-primary" />
                    </span>
                </div>

                {/* PROGRESS */}
                <div className="px-6 pb-7 sm:px-8 md:py-8">
                    <div className="flex items-end justify-between">
                        <div className="font-poppins text-[8px] text-[#71817d]">
                            <span className="font-bold text-[#334c47]">
                                {formatCurrency(campaign.raised)}
                            </span>{' '}
                            of {formatCurrency(campaign.goal)}
                        </div>

                        <span className="font-fraunces text-[27px] leading-none text-primary">
                            {percentage}%
                        </span>
                    </div>

                    <div className="mt-3 h-[7px] bg-[#d5e1de]">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* DEADLINE */}
                <div className="flex items-center justify-between border-t border-[#d4dfdc] px-6 py-5 sm:px-8 md:border-l md:border-t-0 md:px-7">
                    <div>
                        <div className="font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#92a09c]">
                            Deadline
                        </div>

                        <div className="mt-1.5 font-jost text-[13px] font-semibold text-[#465d58]">
                            {campaign.deadline}
                        </div>
                    </div>

                    <ChevronRight
                        size={15}
                        className="text-[#a7b4b1] transition-all group-hover:translate-x-1 group-hover:text-primary md:hidden"
                    />
                </div>
            </div>
        </button>
    );
};

/* ================================================================
   DASHBOARD
================================================================ */

const OrgDashboard = () => {
    const navigate = useNavigate();

    const completionRate = Math.round(
        (overview.completedRequests / overview.assignedRequests) * 100,
    );

    const awaitingRequests = workQueue.filter(
        (request) => request.status === 'Awaiting response',
    ).length;

    return (
        <div className="min-h-screen bg-[#f4f7f5] text-[#163c37]">
            {/* =====================================================
                HEADER
            ====================================================== */}
            <header className="sticky top-0 z-50 border-b border-[#d6e0dd] bg-[#f4f7f5]/95 backdrop-blur-xl">
                <div className="mx-auto flex h-[70px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-10">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/organization')}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center bg-primary text-white transition group-hover:bg-[#115e59]">
                            <HeartHandshake size={17} strokeWidth={1.7} />
                        </div>

                        <div className="hidden sm:block">
                            <div className="font-jost text-[14px] font-bold tracking-[-0.015em] text-[#163c37]">
                                Stand For People
                            </div>

                            <div className="mt-0.5 font-poppins text-[7px] font-bold uppercase tracking-[0.15em] text-[#879894]">
                                Organization workspace
                            </div>
                        </div>
                    </button>

                    <nav className="hidden items-center gap-8 lg:flex">
                        {[
                            ['Overview', '/dashboard/organization', true],
                            [
                                'Requests',
                                '/dashboard/organization/responses',
                                false,
                            ],
                            [
                                'Campaigns',
                                '/dashboard/organization/campaigns',
                                false,
                            ],
                            [
                                'Volunteers',
                                '/dashboard/organization/volunteers',
                                false,
                            ],
                            [
                                'Profile',
                                '/dashboard/organization/profile',
                                false,
                            ],
                        ].map(([label, path, active]) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => navigate(path)}
                                className={`relative py-2 font-poppins text-[8px] font-bold uppercase tracking-[0.09em] transition ${
                                    active
                                        ? 'text-primary'
                                        : 'text-[#70817d] hover:text-primary'
                                }`}
                            >
                                {label}

                                {active && (
                                    <span className="absolute -bottom-[25px] left-0 right-0 h-[2px] bg-primary" />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-2 border-r border-[#d6e0dd] pr-5 sm:flex">
                            <ShieldCheck
                                size={13}
                                strokeWidth={1.7}
                                className="text-primary"
                            />

                            <span className="font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#71827e]">
                                Verified
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/dashboard/organization/profile')
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c8d6d2] bg-white font-jost text-[9px] font-bold text-primary transition hover:border-primary"
                        >
                            {getInitials(organization.name)}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
                {/* =================================================
                    HERO
                ================================================== */}
                <section className="py-8 sm:py-10 lg:py-12">
                    <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_390px]">
                        {/* LEFT HERO */}
                        <div className="relative min-h-[410px] bg-[#dfeeea] px-7 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-12">
                            <div className="absolute right-[-110px] top-[-140px] h-[420px] w-[420px] rounded-full border-[55px] border-[#d2e7e2]" />

                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center gap-2 font-poppins text-[8px] font-bold uppercase tracking-[0.14em] text-primary">
                                        <span className="h-[6px] w-[6px] rounded-full bg-primary" />
                                        Verified organization
                                    </span>

                                    <span className="h-[3px] w-[3px] rounded-full bg-[#9db7b1]" />

                                    <span className="flex items-center gap-1.5 font-poppins text-[8px] uppercase tracking-[0.1em] text-[#718984]">
                                        <MapPin size={10} />
                                        {organization.location}
                                    </span>
                                </div>

                                <h1 className="mt-8 max-w-[800px] font-fraunces text-[49px] leading-[0.91] tracking-[-0.055em] text-[#143a35] sm:text-[62px] lg:text-[70px]">
                                    {organization.name}
                                </h1>

                                <p className="mt-6 max-w-[560px] font-poppins text-[10px] leading-6 text-[#5f7772]">
                                    Track the people you're helping, requests
                                    requiring attention, and campaigns moving
                                    your organization forward.
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                '/dashboard/organization/responses',
                                            )
                                        }
                                        className="inline-flex h-11 items-center gap-3 bg-primary px-6 font-poppins text-[8px] font-bold uppercase tracking-[0.11em] text-white transition hover:bg-[#115e59]"
                                    >
                                        Review requests
                                        <ArrowUpRight size={13} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                '/dashboard/organization/profile',
                                            )
                                        }
                                        className="group inline-flex items-center gap-2 font-poppins text-[8px] font-bold uppercase tracking-[0.1em] text-[#536b66] transition hover:text-primary"
                                    >
                                        View organization profile
                                        <ArrowUpRight
                                            size={12}
                                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="absolute bottom-5 right-7 hidden font-poppins text-[7px] font-bold uppercase tracking-[0.16em] text-[#91aaa4] lg:block">
                                Organization overview
                            </div>
                        </div>

                        {/* RIGHT IMPACT */}
                        <div className="relative flex min-h-[410px] flex-col justify-between bg-primary px-7 py-8 text-white sm:px-10 sm:py-10 lg:px-10 lg:py-11">
                            <div className="absolute bottom-0 right-0 h-[190px] w-[190px] rounded-tl-full bg-[#115e59]" />

                            <div className="relative z-10 flex items-center justify-between">
                                <span className="font-poppins text-[8px] font-bold uppercase tracking-[0.17em] text-[#b8d8d3]">
                                    Impact to date
                                </span>

                                <TrendingUp
                                    size={19}
                                    strokeWidth={1.5}
                                    className="text-[#d1e6e2]"
                                />
                            </div>

                            <div className="relative z-10 mt-12 lg:mt-16">
                                <div className="font-fraunces text-[78px] leading-[0.78] tracking-[-0.065em] text-white sm:text-[88px]">
                                    {overview.peopleHelped.toLocaleString(
                                        'en-BD',
                                    )}
                                </div>

                                <div className="mt-5 font-jost text-[18px] font-semibold text-[#e3efed]">
                                    people helped
                                </div>

                                <div className="mt-3 font-poppins text-[8px] leading-4 text-[#b8d8d3]">
                                    Community impact across your organization
                                </div>
                            </div>

                            <div className="relative z-10 mt-10 grid grid-cols-2 border-t border-white/20 pt-6">
                                <div>
                                    <div className="font-fraunces text-[27px] leading-none text-white">
                                        {formatCurrency(overview.fundsRaised)}
                                    </div>

                                    <div className="mt-2 font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#b9d8d4]">
                                        Funds raised
                                    </div>
                                </div>

                                <div className="border-l border-white/20 pl-5">
                                    <div className="font-fraunces text-[27px] leading-none text-white">
                                        {overview.completedRequests}
                                    </div>

                                    <div className="mt-2 font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#b9d8d4]">
                                        Resolved
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    ATTENTION / KEY NUMBERS
                ================================================== */}
                <section className="border-y border-[#d2deda] bg-[#edf3f1]">
                    <div className="grid lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
                        {/* ATTENTION */}
                        <div className="relative overflow-hidden border-b border-[#d5dfdc] bg-[#fff8ed] px-7 py-7 sm:px-9 lg:border-b-0">
                            <div className="absolute right-[-35px] top-[-55px] h-[160px] w-[160px] rounded-full border-[35px] border-[#f7ead3]" />

                            <div className="relative z-10 flex items-center gap-2">
                                <span className="h-[6px] w-[6px] rounded-full bg-[#f59e0b]" />

                                <span className="font-poppins text-[7px] font-bold uppercase tracking-[0.13em] text-[#9a6e21]">
                                    Needs attention
                                </span>
                            </div>

                            <div className="relative z-10 mt-3 flex items-end gap-4">
                                <span className="font-fraunces text-[52px] leading-none tracking-[-0.04em] text-[#a75c24]">
                                    {awaitingRequests}
                                </span>

                                <span className="mb-1.5 max-w-[125px] font-poppins text-[8px] font-semibold uppercase leading-4 tracking-[0.05em] text-[#7c756b]">
                                    request waiting for response
                                </span>
                            </div>
                        </div>

                        {/* ACTIVE REQUESTS */}
                        <div className="border-b border-[#d5dfdc] px-7 py-7 sm:px-9 lg:border-b-0 lg:border-l">
                            <div className="font-fraunces text-[38px] leading-none text-[#294640]">
                                {overview.activeRequests}
                            </div>

                            <div className="mt-2.5 font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#667b76]">
                                Active requests
                            </div>

                            <div className="mt-1 font-poppins text-[7px] text-[#98a7a3]">
                                Currently moving
                            </div>
                        </div>

                        {/* ACTIVE CAMPAIGNS */}
                        <div className="border-b border-[#d5dfdc] px-7 py-7 sm:px-9 lg:border-b-0 lg:border-l">
                            <div className="font-fraunces text-[38px] leading-none text-[#294640]">
                                {overview.activeCampaigns}
                            </div>

                            <div className="mt-2.5 font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#667b76]">
                                Active campaigns
                            </div>

                            <div className="mt-1 font-poppins text-[7px] text-[#98a7a3]">
                                Currently running
                            </div>
                        </div>

                        {/* COMPLETION */}
                        <div className="px-7 py-7 sm:px-9 lg:border-l">
                            <div className="font-fraunces text-[38px] leading-none text-primary">
                                {completionRate}%
                            </div>

                            <div className="mt-2.5 font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#667b76]">
                                Completion rate
                            </div>

                            <div className="mt-1 font-poppins text-[7px] text-[#98a7a3]">
                                Requests resolved
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    PRIMARY WORK AREA
                ================================================== */}
                <section className="py-14 lg:py-16">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-14">
                        {/* REQUESTS */}
                        <div>
                            <SectionHeading
                                eyebrow="Priority work"
                                title="Needs your attention"
                                description="The most important requests currently moving through your organization."
                                action="All requests"
                                onAction={() =>
                                    navigate(
                                        '/dashboard/organization/responses',
                                    )
                                }
                            />

                            <div className="mt-6 overflow-hidden border border-[#d1ddda]">
                                {workQueue.map((request, index) => (
                                    <PriorityRequest
                                        key={request.id}
                                        request={request}
                                        index={index}
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/organization/responses/${request.id}`,
                                            )
                                        }
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/dashboard/organization/responses',
                                    )
                                }
                                className="mt-5 flex items-center gap-2 font-poppins text-[8px] font-bold uppercase tracking-[0.1em] text-[#647873] transition hover:text-primary sm:hidden"
                            >
                                View all requests
                                <ArrowUpRight size={12} />
                            </button>
                        </div>

                        {/* RIGHT RAIL */}
                        <aside className="mt-12 lg:mt-0">
                            {/* ACTION REQUIRED */}
                            <div className="relative overflow-hidden bg-primary px-7 py-8 text-white">
                                <div className="absolute bottom-[-55px] right-[-45px] h-[160px] w-[160px] rounded-full border-[35px] border-[#115e59]" />

                                <div className="relative z-10 flex items-center justify-between">
                                    <span className="font-poppins text-[8px] font-bold uppercase tracking-[0.16em] text-[#b8d8d3]">
                                        Action required
                                    </span>

                                    <CircleAlert
                                        size={18}
                                        strokeWidth={1.6}
                                        className="text-[#d7ebe7]"
                                    />
                                </div>

                                <div className="relative z-10 mt-9 font-fraunces text-[72px] leading-[0.75] tracking-[-0.06em] text-white">
                                    {awaitingRequests}
                                </div>

                                <div className="relative z-10 mt-5 font-jost text-[19px] font-semibold leading-tight text-white">
                                    request waiting
                                    <br />
                                    for your response
                                </div>

                                <p className="relative z-10 mt-4 font-poppins text-[9px] leading-5 text-[#b9d8d4]">
                                    One request currently needs an action from
                                    your organization before it can move
                                    forward.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/organization/responses',
                                        )
                                    }
                                    className="relative z-10 mt-7 inline-flex h-9 items-center gap-2 bg-[#f59e0b] px-4 font-poppins text-[7px] font-bold uppercase tracking-[0.11em] text-[#51320f] transition hover:bg-[#f7a914]"
                                >
                                    Review request
                                    <ArrowUpRight size={12} />
                                </button>
                            </div>

                            {/* PULSE */}
                            <div className="mt-9 border-t border-[#ccd9d5] pt-7">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <Eyebrow className="text-[#81948f]">
                                            Organization pulse
                                        </Eyebrow>

                                        <div className="mt-2 font-jost text-[16px] font-semibold text-[#38514c]">
                                            Completion
                                        </div>
                                    </div>

                                    <span className="font-fraunces text-[31px] leading-none text-primary">
                                        {completionRate}%
                                    </span>
                                </div>

                                <div className="mt-4 h-[6px] bg-[#dbe5e2]">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${completionRate}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-6 grid grid-cols-2">
                                    <div>
                                        <div className="font-fraunces text-[24px] leading-none text-[#294640]">
                                            8
                                        </div>

                                        <div className="mt-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.07em] text-[#8c9b97]">
                                            Available volunteers
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-fraunces text-[24px] leading-none text-[#294640]">
                                            {overview.activeCampaigns}
                                        </div>

                                        <div className="mt-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.07em] text-[#8c9b97]">
                                            Active campaigns
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* =================================================
                    IMPACT SNAPSHOT
                ================================================== */}
                <section className="mb-14 overflow-hidden bg-[#dfe9e6] lg:mb-16">
                    <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                        <div className="relative overflow-hidden px-7 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-12">
                            <div className="absolute bottom-[-80px] left-[-70px] h-[210px] w-[210px] rounded-full border-[45px] border-[#d3e2de]" />

                            <div className="relative z-10">
                                <Eyebrow>Impact snapshot</Eyebrow>

                                <h2 className="mt-3 max-w-[400px] font-fraunces text-[38px] leading-[0.96] tracking-[-0.045em] text-[#163c37] sm:text-[44px]">
                                    The work behind the numbers.
                                </h2>

                                <p className="mt-5 max-w-[370px] font-poppins text-[9px] leading-5 text-[#667d78]">
                                    Every completed request contributes to a
                                    larger picture of community impact.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 bg-[#f8faf9] sm:grid-cols-4">
                            <div className="border-t border-[#d3dfdb] px-6 py-8 sm:border-l sm:border-t-0 sm:px-7">
                                <div className="font-fraunces text-[40px] leading-none text-primary">
                                    {overview.peopleHelped.toLocaleString(
                                        'en-BD',
                                    )}
                                </div>

                                <div className="mt-3 font-poppins text-[7px] font-bold uppercase tracking-[0.08em] text-[#647873]">
                                    People reached
                                </div>
                            </div>

                            <div className="border-l border-t border-[#d3dfdb] px-6 py-8 sm:border-t-0 sm:px-7">
                                <div className="font-fraunces text-[40px] leading-none text-[#294640]">
                                    {overview.completedRequests}
                                </div>

                                <div className="mt-3 font-poppins text-[7px] font-bold uppercase tracking-[0.08em] text-[#647873]">
                                    Resolved
                                </div>
                            </div>

                            <div className="border-l border-t border-[#d3dfdb] px-6 py-8 sm:border-t-0 sm:px-7">
                                <div className="font-fraunces text-[40px] leading-none text-[#294640]">
                                    {overview.activeRequests}
                                </div>

                                <div className="mt-3 font-poppins text-[7px] font-bold uppercase tracking-[0.08em] text-[#647873]">
                                    In progress
                                </div>
                            </div>

                            <div className="border-l border-t border-[#d3dfdb] px-6 py-8 sm:border-t-0 sm:px-7">
                                <div className="font-fraunces text-[40px] leading-none text-[#294640]">
                                    {overview.assignedRequests}
                                </div>

                                <div className="mt-3 font-poppins text-[7px] font-bold uppercase tracking-[0.08em] text-[#647873]">
                                    Assigned
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    CAMPAIGNS
                ================================================== */}
                <section className="pb-14 lg:pb-16">
                    <SectionHeading
                        eyebrow="Fundraising"
                        title="Campaigns in motion"
                        description="Fundraising efforts currently making progress."
                        action="Manage campaigns"
                        onAction={() =>
                            navigate('/dashboard/organization/campaigns')
                        }
                    />

                    <div className="mt-6 overflow-hidden border border-[#d1ddda]">
                        {campaigns.map((campaign, index) => (
                            <CampaignItem
                                key={campaign.id}
                                campaign={campaign}
                                featured={index === 0}
                                onClick={() =>
                                    navigate(
                                        `/dashboard/organization/campaigns/${campaign.id}`,
                                    )
                                }
                            />
                        ))}
                    </div>
                </section>

                {/* =================================================
                    TEAM + ACTIVITY
                ================================================== */}
                <section className="grid border-t border-[#d2deda] lg:grid-cols-[0.9fr_1.1fr]">
                    {/* TEAM */}
                    <div className="py-14 lg:py-16 lg:pr-14">
                        <SectionHeading
                            eyebrow="People"
                            title="Your team"
                            description="The people helping move your work forward."
                            muted
                        />

                        <div className="mt-6">
                            {team.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                item.name === 'Volunteers'
                                                    ? '/dashboard/organization/volunteers'
                                                    : '/dashboard/organization/responses',
                                            )
                                        }
                                        className="group grid w-full grid-cols-[42px_minmax(0,1fr)_55px_20px] items-center gap-3 border-b border-[#d6e0dd] py-5 text-left transition hover:bg-[#edf4f1]"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center bg-[#dfece8] text-primary">
                                            <Icon size={15} strokeWidth={1.6} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="font-jost text-[14px] font-semibold text-[#38514c] transition-colors group-hover:text-primary">
                                                {item.name}
                                            </div>

                                            <div className="mt-1 font-poppins text-[7px] text-[#929f9b]">
                                                {item.detail}
                                            </div>
                                        </div>

                                        <div className="text-right font-fraunces text-[28px] leading-none text-[#294640]">
                                            {item.value}
                                        </div>

                                        <ChevronRight
                                            size={14}
                                            className="text-[#a5b3af] transition-all group-hover:translate-x-1 group-hover:text-primary"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ACTIVITY */}
                    <div className="border-t border-[#d2deda] py-14 lg:border-l lg:border-t-0 lg:py-16 lg:pl-14">
                        <SectionHeading
                            eyebrow="Timeline"
                            title="Recent activity"
                            description="The latest changes across your organization."
                            muted
                        />

                        <div className="mt-6">
                            {activity.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[26px_minmax(0,1fr)] gap-4 border-b border-[#d6e0dd] py-5"
                                >
                                    <div className="relative flex justify-center">
                                        <div className="relative z-10 mt-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#c8d8d3] bg-[#f4f7f5]">
                                            <Check
                                                size={10}
                                                strokeWidth={2.2}
                                                className="text-primary"
                                            />
                                        </div>

                                        {index !== activity.length - 1 && (
                                            <span className="absolute left-1/2 top-[23px] h-[calc(100%+1px)] w-px -translate-x-1/2 bg-[#d4dfdc]" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-jost text-[13px] leading-5 text-[#506761]">
                                            {item.text}
                                        </p>

                                        <p className="mt-1.5 font-poppins text-[7px] font-bold uppercase tracking-[0.08em] text-[#98a5a1]">
                                            {item.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* =====================================================
                FOOTER
            ====================================================== */}
            <footer className="border-t border-[#d1dcd9] bg-[#e7efec]">
                <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-5 py-7 font-poppins text-[7px] font-bold uppercase tracking-[0.1em] text-[#899995] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                    <span>
                        {organization.name} · {organization.location}
                    </span>

                    <span>Stand For People · Organization workspace</span>
                </div>
            </footer>
        </div>
    );
};

export default OrgDashboard;
