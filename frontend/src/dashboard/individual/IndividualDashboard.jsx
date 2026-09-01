import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HandCoins,
    Users,
    HeartHandshake,
    Megaphone,
    ArrowRight,
    Calendar,
    MapPin,
    Clock,
    Sparkles,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
    mockIndividualUser,
    mockDonationSummary,
    mockVolunteerSummary,
    mockHelpRequestSummary,
    mockActiveCampaigns,
    mockIndividualActivity,
    mockHelpRequests,
} from '@/data/mockIndividual';

// ─── Category colour map ──────────────────────────────────────────────────────
const CATEGORY_COLORS = {
    Education: { dot: 'bg-blue-400', pill: 'bg-blue-50 text-blue-700' },
    'Food Assistance': {
        dot: 'bg-amber-400',
        pill: 'bg-amber-50 text-amber-700',
    },
    'Disaster Relief': {
        dot: 'bg-orange-400',
        pill: 'bg-orange-50 text-orange-700',
    },
    Healthcare: {
        dot: 'bg-emerald-400',
        pill: 'bg-emerald-50 text-emerald-700',
    },
    Livelihood: { dot: 'bg-purple-400', pill: 'bg-purple-50 text-purple-700' },
};
const DEFAULT_CAT = {
    dot: 'bg-[#d1d5db]',
    pill: 'bg-[#f3f4f6] text-[#6b7280]',
};

// ─── Progress bar colour by threshold ────────────────────────────────────────
function progressColor(pct) {
    if (pct >= 75) return 'bg-emerald-500';
    if (pct >= 40) return 'bg-[#0f766e]';
    return 'bg-amber-500';
}

// ─── Time-of-day greeting ─────────────────────────────────────────────────────
function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

// ─── Friendly date format ─────────────────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// ─── Shared section-header pattern ───────────────────────────────────────────
function SectionHeader({ title, subtitle, linkLabel, onLink }) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-[#f0f2f4] px-5 py-4">
            <div>
                <h2 className="font-['Fraunces'] text-[15px] font-semibold leading-snug text-[#0f172a]">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-0.5 text-xs text-[#9ca3af]">{subtitle}</p>
                )}
            </div>
            {linkLabel && onLink && (
                <button
                    type="button"
                    onClick={onLink}
                    className="group mt-0.5 flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#0f766e] transition-colors hover:bg-[#0f766e]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/40"
                >
                    {linkLabel}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
const IndividualDashboard = () => {
    const navigate = useNavigate();
    const firstName = mockIndividualUser.name.split(' ')[0];

    const quickActions = [
        {
            label: 'Request Help',
            icon: HeartHandshake,
            onClick: () => navigate('/dashboard/individual/help-requests'),
            variant: 'primary',
            description: 'Submit a new request',
        },
        {
            label: 'Donate',
            icon: HandCoins,
            onClick: () => navigate('/dashboard/individual/donations'),
            description: 'Support a campaign',
        },
        {
            label: 'Volunteer',
            icon: Users,
            onClick: () => navigate('/dashboard/individual/volunteer'),
            description: 'Join an activity',
        },
        {
            label: 'Browse Campaigns',
            icon: Megaphone,
            onClick: () => navigate('/dashboard/individual/campaigns'),
            description: 'Explore active causes',
        },
    ];

    return (
        <div className="mx-auto max-w-[1200px] space-y-5 pb-10">
            {/* ── 1. Welcome banner ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] ring-1 ring-[#e8edf2]">
                {/* Teal wash — top-right corner */}
                <span
                    className="pointer-events-none absolute right-0 top-0 h-48 w-48 -translate-y-1/4 translate-x-1/4 rounded-full bg-[#0f766e]/[0.07] blur-3xl"
                    aria-hidden="true"
                />
                {/* Amber wash — bottom-left corner */}
                <span
                    className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 translate-y-1/3 -translate-x-1/4 rounded-full bg-[#f59e0b]/[0.07] blur-2xl"
                    aria-hidden="true"
                />

                <div className="relative flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                    {/* Left — identity + greeting */}
                    <div className="flex items-start gap-4">
                        {/* Avatar monogram */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f766e]/10 ring-1 ring-[#0f766e]/20">
                            <span className="font-['Fraunces'] text-xl font-semibold text-[#0f766e]">
                                {firstName.charAt(0)}
                            </span>
                        </div>

                        <div>
                            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#0f766e]">
                                <Sparkles
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                />
                                {greeting()}
                            </p>
                            <h1 className="mt-0.5 font-['Fraunces'] text-2xl font-semibold leading-tight text-[#0f172a] md:text-[1.75rem]">
                                {firstName}
                            </h1>
                            <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
                                Here's what's happening with your{' '}
                                <span className="font-semibold text-[#0f172a]">
                                    Stand For People
                                </span>{' '}
                                account.
                            </p>
                        </div>
                    </div>

                    {/* Right — member meta-facts */}
                    <div className="ml-16 flex flex-wrap items-center gap-x-5 gap-y-2 md:ml-0 md:flex-col md:items-end md:gap-y-2">
                        <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" />
                            {mockIndividualUser.district}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-[#0f766e]" />
                            Member since{' '}
                            {fmtDate(mockIndividualUser.memberSince)}
                        </span>
                        {mockVolunteerSummary.nextActivity && (
                            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                                <Clock className="h-3 w-3 shrink-0" />
                                Next: {mockVolunteerSummary.nextActivity}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 2. Stats row ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Donated"
                    value={`₱${mockDonationSummary.totalDonated.toLocaleString()}`}
                    icon={HandCoins}
                    iconBg="bg-emerald-50"
                    iconFg="text-emerald-600"
                    subtext={`${mockDonationSummary.donationCount} donations`}
                    accent="border-l-emerald-400"
                />
                <StatCard
                    label="Volunteer Hours"
                    value={mockVolunteerSummary.totalHours}
                    icon={Users}
                    iconBg="bg-blue-50"
                    iconFg="text-blue-600"
                    subtext={`${mockVolunteerSummary.activitiesCount} activities`}
                    accent="border-l-blue-400"
                />
                <StatCard
                    label="Help Requests"
                    value={mockHelpRequestSummary.total}
                    icon={HeartHandshake}
                    iconBg="bg-[#0f766e]/10"
                    iconFg="text-[#0f766e]"
                    subtext={`${mockHelpRequestSummary.pending} pending`}
                    accent="border-l-[#0f766e]"
                />
                <StatCard
                    label="Active Campaigns"
                    value={mockActiveCampaigns.length}
                    icon={Megaphone}
                    iconBg="bg-amber-50"
                    iconFg="text-amber-600"
                    subtext="you're supporting"
                    accent="border-l-amber-400"
                />
            </div>

            {/* ── 3. Quick Actions ──────────────────────────────────────────────── */}
            <QuickActions
                actions={quickActions}
                title="What would you like to do?"
            />

            {/* ── 4. Help Requests + Activity (two-column) ──────────────────────── */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* My Help Requests */}
                <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] ring-1 ring-[#e8edf2]">
                    <SectionHeader
                        title="My Help Requests"
                        subtitle={`${mockHelpRequestSummary.approved} approved · ${mockHelpRequestSummary.pending} pending`}
                        linkLabel="View all"
                        onLink={() =>
                            navigate('/dashboard/individual/help-requests')
                        }
                    />

                    {mockHelpRequests.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-12">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f6] ring-1 ring-[#e5e7eb]">
                                <HeartHandshake className="h-5 w-5 text-[#c4cdd6]" />
                            </span>
                            <p className="text-sm text-[#9ca3af]">
                                No help requests yet.
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/dashboard/individual/help-requests',
                                    )
                                }
                                className="rounded-lg bg-[#0f766e] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#115e59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/40"
                            >
                                Submit a request
                            </button>
                        </div>
                    ) : (
                        <ul className="flex-1 divide-y divide-[#f0f2f4]">
                            {mockHelpRequests.map((req) => {
                                const cat =
                                    CATEGORY_COLORS[req.category] ||
                                    DEFAULT_CAT;
                                return (
                                    <li
                                        key={req.id}
                                        className="group px-5 py-4 transition-colors hover:bg-[#fafbfc]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                {/* Category tag */}
                                                <span
                                                    className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cat.pill}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${cat.dot}`}
                                                        aria-hidden="true"
                                                    />
                                                    {req.category}
                                                </span>

                                                <p className="truncate text-sm font-semibold text-[#0f172a]">
                                                    {req.title}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-[#9ca3af]">
                                                    Submitted{' '}
                                                    {fmtDate(req.submittedDate)}
                                                </p>

                                                {req.notes && (
                                                    <p className="mt-2 line-clamp-2 rounded-lg border border-[#f0f2f4] bg-[#f9fafb] px-3 py-2 text-xs text-[#6b7280] italic">
                                                        {req.notes}
                                                    </p>
                                                )}
                                            </div>

                                            <StatusBadge status={req.status} />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Activity Feed */}
                <div className="overflow-hidden rounded-2xl shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] ring-1 ring-[#e8edf2]">
                    <ActivityFeed
                        items={mockIndividualActivity}
                        title="Recent Activity"
                    />
                </div>
            </div>

            {/* ── 5. Active Campaigns ───────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06),0_4px_16px_rgba(15,23,42,0.04)] ring-1 ring-[#e8edf2]">
                <SectionHeader
                    title="Active Campaigns"
                    subtitle="Campaigns you're currently following"
                    linkLabel="Browse all"
                    onLink={() => navigate('/dashboard/individual/campaigns')}
                />

                {/* Campaign cards — stacked on mobile, 3-col on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {mockActiveCampaigns.map((c, idx) => {
                        const pct = Math.min(c.progress, 100);
                        const bar = progressColor(pct);
                        const cat = CATEGORY_COLORS[c.category] || DEFAULT_CAT;
                        const daysLeft = Math.max(
                            0,
                            Math.ceil(
                                (new Date(c.deadline) - new Date()) /
                                    (1000 * 60 * 60 * 24),
                            ),
                        );
                        const isLast = idx === mockActiveCampaigns.length - 1;

                        return (
                            <div
                                key={c.id}
                                className={`group flex flex-col gap-4 p-5 transition-colors hover:bg-[#fafbfc] ${
                                    /* mobile: bottom-border except last row; desktop: right-border except last col */
                                    !isLast
                                        ? 'border-b border-[#f0f2f4] md:border-b-0 md:border-r md:border-[#f0f2f4]'
                                        : ''
                                }`}
                            >
                                {/* Category */}
                                <span
                                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cat.pill}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${cat.dot}`}
                                        aria-hidden="true"
                                    />
                                    {c.category}
                                </span>

                                {/* Title */}
                                <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#0f172a]">
                                    {c.title}
                                </p>

                                {/* Progress */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold tabular-nums text-[#0f172a]">
                                            {pct}% funded
                                        </span>
                                        <span
                                            className={`text-[11px] font-medium ${
                                                daysLeft <= 7
                                                    ? 'text-orange-500'
                                                    : 'text-[#9ca3af]'
                                            }`}
                                        >
                                            {daysLeft > 0
                                                ? `${daysLeft}d left`
                                                : 'Ending soon'}
                                        </span>
                                    </div>
                                    {/* Track */}
                                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#eef3f6]">
                                        <div
                                            className={`h-full rounded-full ${bar} transition-[width]`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Raised / Goal */}
                                <div className="flex items-center justify-between text-xs text-[#9ca3af]">
                                    <span>
                                        <span className="font-semibold text-[#0f172a]">
                                            ₱{c.raised.toLocaleString()}
                                        </span>{' '}
                                        raised
                                    </span>
                                    <span>goal ₱{c.goal.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer row */}
                <div className="border-t border-[#f0f2f4] px-5 py-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate('/dashboard/individual/campaigns')
                        }
                        className="group flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-[#0f766e] transition-colors hover:bg-[#0f766e]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/40"
                    >
                        View all campaigns
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndividualDashboard;
