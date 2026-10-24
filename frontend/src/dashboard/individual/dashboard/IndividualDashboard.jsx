import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Bell,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    HandCoins,
    HeartHandshake,
    MapPin,
    Megaphone,
    Plus,
    Settings2,
    ShieldCheck,
    UserRound,
    Users,
    Wallet,
    ClipboardList,
    CircleDot,
} from 'lucide-react';

import { getIndividualDashboard } from './api/individualDashboardApi';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

const ROOT = '/individual/dashboard';

const ROUTES = {
    requests: `${ROOT}/help-requests`,
    donations: `${ROOT}/donations`,
    volunteer: `${ROOT}/volunteer`,
    campaigns: `${ROOT}/campaigns`,
    profile: `${ROOT}/profile`,
    notifications: `${ROOT}/notifications`,
    settings: `${ROOT}/settings`,
};

const THEME = {
    bg: '#0E1219',
    surface: '#151C25',
    raised: '#1A222D',
    border: '#29323E',
    text: '#EEF1F5',
    muted: '#94A2B2',
    amber: '#D9B47B',
    blue: '#8FB9DC',
    green: '#82B9A4',
    purple: '#B8A2D5',
};

function Heading({ eyebrow, title, action, onClick }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
                <p className={overline}>{eyebrow}</p>
                <h2 className="mt-2 font-sans! text-[22px] font-semibold! tracking-[-0.035em] text-[#F1F4F8]! sm:text-[25px]">
                    {title}
                </h2>
            </div>
            {action && (
                <button
                    type="button"
                    onClick={onClick}
                    className="inline-flex items-center gap-1.5 pb-1 text-[12px] font-semibold text-[#C9D6E4] hover:text-white"
                >
                    {action}
                    <ArrowUpRight size={15} />
                </button>
            )}
        </div>
    );
}

const overline =
    'text-[10px] font-semibold uppercase tracking-[0.19em] text-[#A4B2C3]';

const fmt = (value) => Number(value || 0).toLocaleString('en-BD');

const dateText = (value) => {
    if (!value) return 'Not provided';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? 'Not provided'
        : date.toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });
};

const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';

    return 'Good evening';
};

const daysLeft = (value) => {
    if (!value) return null;

    const time = new Date(value).getTime();

    if (Number.isNaN(time)) return null;

    return Math.max(0, Math.ceil((time - Date.now()) / 86400000));
};

const eyebrow =
    'text-[10px] font-semibold uppercase tracking-widest text-[#94A2B2]';

/* =========================================================
   SHARED SECTION HEADING
========================================================= */

function SectionTitle({ kicker, title, description, action, onAction }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                {kicker && <p className={eyebrow}>{kicker}</p>}

                <h2 className="mt-1.5 font-sans! text-[20px]! font-semibold! leading-tight! tracking-tight! text-[#EEF1F5]!">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2 text-[12px] leading-5 text-[#94A2B2]">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="group inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-[#B8C5D3] transition hover:text-[#D9B47B]"
                >
                    {action}
                    <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </button>
            )}
        </div>
    );
}

/* =========================================================
   TOP STATISTICS
========================================================= */

function Metric({ icon: Icon, label, value, detail, color, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative min-w-0 p-4 text-left transition-colors hover:bg-[#202A36] sm:p-5"
        >
            <div className="flex items-center gap-2">
                <Icon size={16} style={{ color }} className="shrink-0" />

                <span className="min-w-0 truncate text-[11px] text-[#AAB6C5]">
                    {label}
                </span>
            </div>

            <p className="mt-3 text-[27px] font-semibold leading-none tracking-tight text-[#EEF1F5]">
                {value}
            </p>

            <p className="mt-2 text-[11px] text-[#94A2B2]">{detail}</p>

            <ArrowUpRight
                size={14}
                className="absolute right-4 top-4 text-[#64748B] opacity-0 transition group-hover:opacity-100"
            />
        </button>
    );
}

/* =========================================================
   ANALYTICS — ACTIVITY DISTRIBUTION

   Compares activity counts only.
   Monetary totals and volunteer hours remain separate.
========================================================= */

function ActivityDonut({ donations, volunteering }) {
    const total = donations + volunteering;

    const donationShare = total ? (donations / total) * 100 : 0;

    const volunteerShare = total ? (volunteering / total) * 100 : 0;

    const radius = 65;
    const circumference = 2 * Math.PI * radius;

    const donationLength = (donationShare / 100) * circumference;

    const volunteerLength = (volunteerShare / 100) * circumference;

    return (
        <div className="relative mx-auto h-[188px] w-[188px] shrink-0">
            <svg
                viewBox="0 0 188 188"
                className="h-full w-full"
                role="img"
                aria-label={`${donations} donations and ${volunteering} volunteer activities`}
            >
                <circle
                    cx="94"
                    cy="94"
                    r={radius}
                    fill="none"
                    stroke="#29323E"
                    strokeWidth="13"
                />

                {total > 0 && (
                    <>
                        <circle
                            cx="94"
                            cy="94"
                            r={radius}
                            fill="none"
                            stroke={THEME.amber}
                            strokeWidth="13"
                            strokeDasharray={`${donationLength} ${circumference - donationLength}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 94 94)"
                        />

                        <circle
                            cx="94"
                            cy="94"
                            r={radius}
                            fill="none"
                            stroke={THEME.green}
                            strokeWidth="13"
                            strokeDasharray={`${volunteerLength} ${circumference - volunteerLength}`}
                            strokeDashoffset={-donationLength}
                            transform="rotate(-90 94 94)"
                        />
                    </>
                )}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[37px] font-semibold leading-none tracking-tighter text-[#EEF1F5]">
                    {fmt(total)}
                </span>

                <span className="mt-2 text-[11px] text-[#94A2B2]">
                    Acts of support
                </span>
            </div>
        </div>
    );
}

/* =========================================================
   CONTRIBUTION OVERVIEW — REDESIGNED
========================================================= */

function ContributionOverview({ donation, volunteer, onNavigate }) {
    const donationCount = Math.max(0, Number(donation.donationCount) || 0);

    const volunteerCount = Math.max(0, Number(volunteer.activitiesCount) || 0);

    const totalActs = donationCount + volunteerCount;

    const breakdown = [
        {
            label: 'Donations',
            value: donationCount,
            color: THEME.amber,
            route: 'donations',
        },
        {
            label: 'Volunteering',
            value: volunteerCount,
            color: THEME.green,
            route: 'volunteer',
        },
    ];

    return (
        <section>
            <SectionTitle
                kicker="Contribution overview"
                title="Your community impact"
                description="A closer look at the ways you've contributed."
            />

            <div className="mt-5 overflow-hidden border border-[#29323E] bg-[#151C25]">
                <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                    {/* MAIN ANALYTICS */}

                    <div className="p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-[13px] font-semibold text-[#EEF1F5]">
                                    Participation overview
                                </p>

                                <p className="mt-1 text-[11px] text-[#94A2B2]">
                                    Breakdown of recorded activities
                                </p>
                            </div>

                            <span className="border border-[#34404E] px-2.5 py-1 text-[10px] text-[#AAB6C5]">
                                All time
                            </span>
                        </div>

                        <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                            <ActivityDonut
                                donations={donationCount}
                                volunteering={volunteerCount}
                            />

                            <div className="w-full min-w-0 flex-1 space-y-4">
                                {breakdown.map((item) => {
                                    const percentage = totalActs
                                        ? Math.round(
                                              (item.value / totalActs) * 100,
                                          )
                                        : 0;

                                    return (
                                        <button
                                            key={item.label}
                                            type="button"
                                            onClick={() =>
                                                onNavigate(item.route)
                                            }
                                            className="group block w-full text-left"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-2 text-[12px] text-[#B8C5D3]">
                                                    <span
                                                        className="h-2.5 w-2.5 shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    />

                                                    {item.label}
                                                </span>

                                                <span className="text-[13px] font-semibold text-[#EEF1F5]">
                                                    {percentage}%
                                                </span>
                                            </div>

                                            <div className="mt-2 h-1.5 bg-[#29323E]">
                                                <div
                                                    className="h-full"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                            </div>

                                            <p className="mt-1.5 text-[10px] text-[#94A2B2]">
                                                {fmt(item.value)} recorded
                                                {item.value === 1
                                                    ? ' activity'
                                                    : ' activities'}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* FINANCIAL / TIME SUMMARY */}

                    <div className="grid grid-cols-2 border-t border-[#29323E] bg-[#1A222D] lg:grid-cols-1 lg:border-l lg:border-t-0">
                        <button
                            type="button"
                            onClick={() => onNavigate('donations')}
                            className="group min-w-0 p-5 text-left transition hover:bg-[#202B37] sm:p-6"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-9 w-9 items-center justify-center bg-[#3C3328] text-[#D9B47B]">
                                    <Wallet size={18} />
                                </span>

                                <ArrowUpRight
                                    size={15}
                                    className="text-[#8792A1] group-hover:text-[#D9B47B]"
                                />
                            </div>

                            <p className="mt-4 text-[11px] text-[#AAB6C5]">
                                Total contributed
                            </p>

                            <p className="mt-1 text-[25px] font-semibold tracking-tight text-[#D9B47B]">
                                ৳{fmt(donation.totalDonated)}
                            </p>

                            <p className="mt-1 text-[11px] text-[#94A2B2]">
                                Across {fmt(donationCount)} donations
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => onNavigate('volunteer')}
                            className="group min-w-0 border-l border-[#29323E] p-5 text-left transition hover:bg-[#202B37] sm:p-6 lg:border-l-0 lg:border-t"
                        >
                            <div className="flex items-center justify-between">
                                <span className="flex h-9 w-9 items-center justify-center bg-[#273C37] text-[#82B9A4]">
                                    <Clock3 size={18} />
                                </span>

                                <ArrowUpRight
                                    size={15}
                                    className="text-[#8792A1] group-hover:text-[#82B9A4]"
                                />
                            </div>

                            <p className="mt-4 text-[11px] text-[#AAB6C5]">
                                Time volunteered
                            </p>

                            <p className="mt-1 text-[25px] font-semibold tracking-tight text-[#82B9A4]">
                                {fmt(volunteer.totalHours)}
                                <span className="ml-1 text-[13px] font-normal">
                                    hours
                                </span>
                            </p>

                            <p className="mt-1 text-[11px] text-[#94A2B2]">
                                {fmt(volunteerCount)} volunteer activities
                            </p>
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#29323E] px-5 py-3 sm:px-7">
                    <span className="flex items-center gap-2 text-[11px] text-[#94A2B2]">
                        <CircleDot size={13} className="text-[#82B9A4]" />
                        Based on your recorded contributions
                    </span>

                    <button
                        type="button"
                        onClick={() => onNavigate('donations')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#D9B47B] hover:text-white"
                    >
                        View contributions
                        <ArrowRight size={13} />
                    </button>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   HELP REQUEST STATUS JOURNEY
========================================================= */

function SupportJourney({ pending, verified, completed }) {
    const stages = [
        {
            label: 'Pending review',
            value: pending,
            color: THEME.amber,
            icon: Clock3,
            description: 'Awaiting review',
        },
        {
            label: 'Verified',
            value: verified,
            color: THEME.blue,
            icon: ShieldCheck,
            description: 'Review completed',
        },
        {
            label: 'Completed',
            value: completed,
            color: THEME.green,
            icon: CheckCircle2,
            description: 'Support delivered',
        },
    ];

    return (
        <div className="relative grid grid-cols-3 gap-2 sm:gap-5">
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-5 h-px bg-[#34404E]" />

            {stages.map((stage) => {
                const Icon = stage.icon;

                return (
                    <div key={stage.label} className="relative min-w-0">
                        <div
                            className="relative z-10 flex h-10 w-10 items-center justify-center border border-[#34404E] bg-[#1A222D]"
                            style={{ color: stage.color }}
                        >
                            <Icon size={18} />
                        </div>

                        <p className="mt-4 text-[25px] font-semibold leading-none text-[#EEF1F5]">
                            {fmt(stage.value)}
                        </p>

                        <p className="mt-2 text-[12px] font-medium text-[#E0E6ED]">
                            {stage.label}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#94A2B2]">
                            {stage.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

/* =========================================================
   REQUEST TRACK
========================================================= */

function RequestTrack({ status }) {
    const value = String(status || '').toLowerCase();

    if (value === 'rejected') {
        return (
            <p className="mt-4 border-l-2 border-[#D29BA5] pl-3 text-[11px] text-[#D9ADB5]">
                Request rejected. View your request for details.
            </p>
        );
    }

    const stage =
        value === 'completed'
            ? 2
            : ['verified', 'approved', 'in_progress', 'in progress'].includes(
                    value,
                )
              ? 1
              : 0;

    return (
        <div className="mt-4 grid grid-cols-3 gap-2">
            {['Submitted', 'Reviewed', 'Completed'].map((label, index) => (
                <div key={label}>
                    <div
                        className={`h-1 ${
                            index <= stage ? 'bg-[#82B9A4]' : 'bg-[#34404E]'
                        }`}
                    />

                    <p
                        className={`mt-1.5 text-[10px] ${
                            index === stage
                                ? 'font-semibold text-[#EEF1F5]'
                                : 'text-[#94A2B2]'
                        }`}
                    >
                        {index < stage ? '✓ ' : ''}
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
}

/* =========================================================
   YOUR SUPPORT — REDESIGNED
========================================================= */

function SupportOverview({ pending, verified, completed, latest, onNavigate }) {
    return (
        <section>
            <SectionTitle
                kicker="Your support"
                title="Help requests"
                description="Follow your requests from submission to resolution."
                action="View all"
                onAction={() => onNavigate('requests')}
            />

            <div className="mt-5 border-t border-[#29323E] pt-6">
                <SupportJourney
                    pending={pending}
                    verified={verified}
                    completed={completed}
                />
            </div>

            <div className="mt-6 border-t border-[#29323E] pt-5">
                {latest ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className={eyebrow}>Latest request</p>

                                <StatusBadge status={latest.status} />
                            </div>

                            <h3 className="mt-2 text-[15px] font-semibold text-[#EEF1F5]">
                                {latest.title || 'Help request'}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#94A2B2]">
                                {latest.category && (
                                    <span>{latest.category}</span>
                                )}

                                {latest.submittedDate && (
                                    <span>
                                        Submitted{' '}
                                        {dateText(latest.submittedDate)}
                                    </span>
                                )}
                            </div>

                            {latest.notes && (
                                <p className="mt-3 text-[12px] leading-5 text-[#AAB6C5]">
                                    {latest.notes}
                                </p>
                            )}

                            <RequestTrack status={latest.status} />
                        </div>

                        <button
                            type="button"
                            onClick={() => onNavigate('requests')}
                            className="inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold text-[#D9B47B] hover:text-white"
                        >
                            View request
                            <ArrowUpRight size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#223447] text-[#8FB9DC]">
                                <HeartHandshake size={20} />
                            </div>

                            <div>
                                <h3 className="text-[13px] font-semibold text-[#EEF1F5]">
                                    No support requests yet
                                </h3>

                                <p className="mt-1 text-[12px] leading-5 text-[#94A2B2]">
                                    When you need assistance, you can submit a
                                    request here.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onNavigate('requests')}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 bg-[#D9B47B] px-4 text-[12px] font-semibold text-[#151C25] transition hover:bg-[#E8C994]"
                        >
                            <Plus size={15} />
                            Create request
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

/* =========================================================
   QUICK ACCESS
========================================================= */

function NavAction({ icon: Icon, title, detail, tint, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-3 border-b border-[#29323E] py-3 text-left transition-colors last:border-b-0 hover:bg-[#202A36]"
        >
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center ${tint}`}
            >
                <Icon size={17} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-semibold text-[#EEF1F5]">
                    {title}
                </span>

                <span className="mt-0.5 block text-[10px] leading-4 text-[#94A2B2]">
                    {detail}
                </span>
            </span>

            <ChevronRight
                size={15}
                className="shrink-0 text-[#8792A1] transition group-hover:translate-x-0.5 group-hover:text-white"
            />
        </button>
    );
}

/* =========================================================
   RECENT ACTIVITY
========================================================= */

function RecentActivity({ activities }) {
    return (
        <section>
            <SectionTitle kicker="Your journey" title="Recent activity" />

            <div className="mt-4 border-t border-[#29323E]">
                {activities.length ? (
                    activities.slice(0, 5).map((item, index) => (
                        <div
                            key={item.id || `activity-${index}`}
                            className="flex items-center gap-3 border-b border-[#29323E] py-3.5 transition hover:bg-[#1A222D] sm:px-2"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#223447] text-[#8FB9DC]">
                                <Activity size={16} />
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-medium text-[#EEF1F5]">
                                    {item.title ||
                                        item.description ||
                                        item.action ||
                                        'Activity update'}
                                </p>

                                {item.description &&
                                    item.title &&
                                    item.description !== item.title && (
                                        <p className="mt-1 truncate text-[11px] text-[#94A2B2]">
                                            {item.description}
                                        </p>
                                    )}
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {item.date && (
                                    <span className="hidden text-[10px] text-[#8792A1] sm:inline">
                                        {dateText(item.date)}
                                    </span>
                                )}

                                <Check size={14} className="text-[#82B9A4]" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-6">
                        <p className="text-[12px] text-[#94A2B2]">
                            Your recent activity will appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

/* =========================================================
   SIDEBAR REQUEST SUMMARY
========================================================= */

function RequestSummary({ total, pending, verified, completed, onNavigate }) {
    const items = [
        {
            label: 'Pending',
            value: pending,
            color: THEME.amber,
        },
        {
            label: 'Verified',
            value: verified,
            color: THEME.blue,
        },
        {
            label: 'Completed',
            value: completed,
            color: THEME.green,
        },
    ];

    return (
        <section className="border-t border-[#29323E] pt-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className={eyebrow}>Request overview</p>

                    <h3 className="mt-1.5 text-[16px] font-semibold text-[#EEF1F5]">
                        Request summary
                    </h3>
                </div>

                <ClipboardList size={19} className="text-[#8FB9DC]" />
            </div>

            <div className="mt-5 flex items-end justify-between">
                <div>
                    <p className="text-[11px] text-[#94A2B2]">
                        Total submitted
                    </p>

                    <p className="mt-1 text-[28px] font-semibold leading-none text-[#EEF1F5]">
                        {fmt(total)}
                    </p>
                </div>

                <span className="text-[11px] text-[#94A2B2]">All time</span>
            </div>

            <div className="mt-5 flex h-2 overflow-hidden bg-[#29323E]">
                {items.map((item) => (
                    <div
                        key={item.label}
                        style={{
                            width: `${total ? (item.value / total) * 100 : 0}%`,
                            backgroundColor: item.color,
                        }}
                    />
                ))}
            </div>

            <div className="mt-4 space-y-3">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center justify-between text-[11px]"
                    >
                        <span className="flex items-center gap-2 text-[#AAB6C5]">
                            <span
                                className="h-2 w-2"
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />
                            {item.label}
                        </span>

                        <span className="font-semibold text-[#EEF1F5]">
                            {fmt(item.value)}
                        </span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => onNavigate('requests')}
                className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold text-[#D9B47B] hover:text-white"
            >
                Manage requests
                <ArrowRight size={14} />
            </button>
        </section>
    );
}

/* =========================================================
   INDIVIDUAL DASHBOARD
========================================================= */

export default function IndividualDashboard() {
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(0);

    const [result, setResult] = useState({
        loading: true,
        error: '',
        data: null,
    });

    useEffect(() => {
        let mounted = true;

        getIndividualDashboard()
            .then((data) => {
                if (mounted) {
                    setResult({
                        loading: false,
                        error: '',
                        data,
                    });
                }
            })
            .catch((error) => {
                if (mounted) {
                    setResult({
                        loading: false,
                        error:
                            error?.message || 'Unable to load your dashboard.',
                        data: null,
                    });
                }
            });

        return () => {
            mounted = false;
        };
    }, [attempt]);

    const retry = () => {
        setResult({
            loading: true,
            error: '',
            data: null,
        });

        setAttempt((number) => number + 1);
    };

    if (result.loading) {
        return (
            <LoadingUI
                variant="page"
                title="Loading dashboard..."
                description="Retrieving your contributions and community activity."
            />
        );
    }

    if (result.error) {
        return (
            <div className="p-4 sm:p-7">
                <LoadingError
                    title="Unable to load dashboard"
                    message={result.error}
                />

                <button
                    type="button"
                    onClick={retry}
                    className="mt-4 inline-flex min-h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-5 text-[13px] font-medium text-[#EEF1F5] hover:bg-[#202A36]"
                >
                    Try again
                    <ArrowRight size={15} />
                </button>
            </div>
        );
    }

    const data = result.data || {};

    const user = data.user || { name: 'User' };
    const donation = data.donationSummary || {};
    const volunteer = data.volunteerSummary || {};

    const requests = Array.isArray(data.helpRequests) ? data.helpRequests : [];

    const campaigns = Array.isArray(data.activeCampaigns)
        ? data.activeCampaigns
        : [];

    const activities = Array.isArray(data.activity) ? data.activity : [];

    const firstName =
        String(user.name || 'User')
            .trim()
            .split(/\s+/)[0] || 'User';

    const latest = requests[0] || null;
    const campaign = campaigns[0] || null;

    const pending = requests.filter(
        (item) => String(item.status || '').toLowerCase() === 'pending',
    ).length;

    const verified = requests.filter(
        (item) => String(item.status || '').toLowerCase() === 'verified',
    ).length;

    const completed = requests.filter(
        (item) => String(item.status || '').toLowerCase() === 'completed',
    ).length;

    const progress = Math.max(
        0,
        Math.min(100, Number(campaign?.progress) || 0),
    );

    const remaining = daysLeft(campaign?.deadline);

    const supportCount =
        Number(donation.donationCount || 0) +
        Number(volunteer.activitiesCount || 0);

    const go = (key) => navigate(ROUTES[key]);

    return (
        <div className="min-h-full text-[#E0E6ED]">
            <div className="mx-auto max-w-382.5">
                {/* =====================================
                    WELCOME HEADER
                ===================================== */}

                <section className="overflow-hidden border border-[#29323E] bg-[#151C25]">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px]">
                        <div className="flex flex-col items-start px-6 py-7 sm:px-9 sm:py-9 lg:px-10 lg:py-10">
                            <div className="flex items-center gap-3">
                                <span className="h-0.5 w-7 bg-[#D9B47B]" />

                                <p className={eyebrow}>
                                    Your space at Stand For People
                                </p>
                            </div>

                            <h1 className="mt-5 font-['Fraunces']! text-[33px]! font-semibold! leading-[1.15]! tracking-[-0.035em]! text-[#EEF1F5]! sm:text-[42px]!">
                                {greeting()},{' '}
                                <span className="text-[#D9B47B]">
                                    {firstName}.
                                </span>
                            </h1>

                            <p className="mt-3 max-w-140 text-[13px] leading-6 text-[#AAB6C5]">
                                Your contributions, support requests and the
                                causes you care about — together in one place.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => go('requests')}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#D9B47B] px-4 py-2.5 text-[12px] font-semibold text-[#151C25] transition hover:bg-[#E8C994]"
                                >
                                    <Plus size={15} />
                                    Request support
                                    <ArrowUpRight size={14} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => go('campaigns')}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#343E4B] px-4 py-2.5 text-[12px] font-semibold text-[#E0E6ED] transition hover:bg-[#202A36]"
                                >
                                    Explore causes
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* HERO MEMBERSHIP */}

                        {/* <div className="flex flex-col justify-between border-t border-[#29323E] bg-[#1B2938] px-6 py-6 sm:px-7 lg:border-l lg:border-t-0">
                            <div className="flex items-center justify-between">
                                <p className={eyebrow}>Your membership</p>

                                <ShieldCheck
                                    size={18}
                                    className="text-[#8FB9DC]"
                                />
                            </div>

                            <div className="my-6">
                                <p className="text-[36px] font-semibold leading-none tracking-tight text-[#EEF1F5]">
                                    {fmt(supportCount)}
                                </p>

                                <p className="mt-2 text-[13px] font-medium text-[#E0E6ED]">
                                    Acts of support
                                </p>

                                <p className="mt-2 text-[12px] leading-5 text-[#94A2B2]">
                                    Donations and volunteer activities in your
                                    community.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => go('volunteer')}
                                className="inline-flex items-center gap-2 border-t border-[#344353] pt-3 text-[12px] font-medium text-[#D9B47B] hover:text-white"
                            >
                                <HeartHandshake size={15} />
                                Explore your involvement
                                <ArrowUpRight size={14} />
                            </button>
                        </div> */}

                        <div className="relative flex min-h-[200px] flex-col justify-between overflow-hidden border-t border-[#344353] bg-[#222F3D] px-7 py-7 lg:min-h-0 lg:border-l lg:border-t-0">
                            <div
                                className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-[40px] border-[#34465A]/60"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full border-[28px] border-[#3B4A59]/40"
                                aria-hidden="true"
                            />
                            <div className="relative flex items-center justify-between gap-3">
                                <p className={overline}>Your membership</p>
                                <ShieldCheck
                                    size={18}
                                    className="text-[#B5C8D9]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => go(ROUTES.profile)}
                                className="group relative mt-8 flex items-center gap-4 text-left"
                            >
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#5B7186] bg-[#35495E] text-[22px] font-semibold text-[#F4F6F8]">
                                    {firstName.charAt(0).toUpperCase()}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[15px] font-semibold text-[#F1F4F7]">
                                        {user.name || 'User'}
                                    </span>
                                    <span className="mt-1 block text-[12px] text-[#B0BFCF]">
                                        Community member
                                    </span>
                                </span>
                                <ArrowUpRight
                                    size={17}
                                    className="text-[#B4C3D3] group-hover:text-white"
                                />
                            </button>
                            <div className="relative mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#455567] pt-4 text-[11px] text-[#B4C3D2]">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin size={13} />
                                    {user.district || 'Location not provided'}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={13} />
                                    {dateText(user.memberSince)}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================
                    MAIN GRID
                ===================================== */}

                <div className="mt-6 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_350px] xl:gap-8">
                    <main className="min-w-0 space-y-10">
                        {/* TOP STATISTICS */}

                        <section
                            aria-label="Your contribution statistics"
                            className="grid grid-cols-2 divide-x divide-y divide-[#29323E] border border-[#29323E] bg-[#1A222D] md:grid-cols-4 md:divide-y-0"
                        >
                            <Metric
                                icon={Wallet}
                                label="Total donated"
                                value={`৳${fmt(donation.totalDonated)}`}
                                detail={`${fmt(donation.donationCount)} donations`}
                                color={THEME.amber}
                                onClick={() => go('donations')}
                            />

                            <Metric
                                icon={Clock3}
                                label="Volunteer hours"
                                value={fmt(volunteer.totalHours)}
                                detail={`${fmt(volunteer.activitiesCount)} activities`}
                                color={THEME.green}
                                onClick={() => go('volunteer')}
                            />

                            <Metric
                                icon={HeartHandshake}
                                label="Acts of support"
                                value={fmt(supportCount)}
                                detail="Giving and volunteering"
                                color={THEME.purple}
                                onClick={() => go('volunteer')}
                            />

                            <Metric
                                icon={Users}
                                label="Help requests"
                                value={fmt(requests.length)}
                                detail={`${pending} awaiting review`}
                                color={THEME.blue}
                                onClick={() => go('requests')}
                            />
                        </section>

                        {/* FEATURED CAMPAIGN */}

                        <section>
                            <Heading
                                eyebrow="Discover a cause"
                                title="Featured campaign"
                                action="Browse campaigns"
                                onClick={() => go(ROUTES.campaigns)}
                            />
                            <div className="mt-5 overflow-hidden border border-[#344150] bg-[#1D2935]">
                                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_385px]">
                                    <div className="flex min-h-[250px] flex-col justify-between px-6 py-7 sm:px-8 sm:py-9">
                                        <div>
                                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D7B783]">
                                                <Megaphone size={15} />
                                                {campaign?.category ||
                                                    'Community initiative'}
                                            </span>
                                            <h3 className="mt-5 max-w-2xl font-['Fraunces'] text-[25px] font-semibold leading-[1.28] tracking-[-0.025em] text-[#F3F5F7]! sm:text-[30px]">
                                                {campaign?.title ||
                                                    'Help build stronger communities.'}
                                            </h3>
                                            <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#ADBDCD]">
                                                {campaign
                                                    ? 'Help this community initiative reach more people with practical support.'
                                                    : 'Discover active campaigns and find a cause you would like to support.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => go(ROUTES.campaigns)}
                                            className="mt-7 inline-flex w-fit items-center gap-2 text-[12px] font-semibold text-[#E7C38F] hover:text-[#FFE0B2]"
                                        >
                                            Explore campaign{' '}
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col justify-between border-t border-[#344353] bg-[#263544] px-6 py-7 lg:border-l lg:border-t-0">
                                        <div>
                                            <p className={overline}>
                                                Campaign funding
                                            </p>
                                            <p className="mt-5 text-[28px] font-semibold tracking-[-0.045em] text-[#F5F6F8]">
                                                ৳{fmt(campaign?.raised)}
                                            </p>
                                            <p className="mt-1 text-[12px] text-[#B2C0CF]">
                                                of ৳{fmt(campaign?.goal)} goal
                                            </p>
                                        </div>
                                        <div className="mt-10">
                                            <div className="flex items-center justify-between gap-3 text-[12px] text-[#C4D0DC]">
                                                <span>Progress</span>
                                                <strong className="text-[#F0F3F7]">
                                                    {progress}%
                                                </strong>
                                            </div>
                                            <div className="mt-3 h-1.5 bg-[#465667]">
                                                <div
                                                    className="h-full bg-[#D9B783]"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                            {remaining !== null && (
                                                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#AFC0D0]">
                                                    <Clock3 size={13} />
                                                    {remaining === 0
                                                        ? 'Deadline reached'
                                                        : `${remaining} days remaining`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* <section>
                            <SectionTitle
                                kicker="Discover a cause"
                                title="Featured campaign"
                                action="Browse campaigns"
                                onAction={() => go('campaigns')}
                            />

                            <div className="mt-4 overflow-hidden border border-[#29323E] bg-[#1A222D]">
                                <div className="grid sm:grid-cols-[minmax(0,1fr)_205px]">
                                    <div className="flex min-w-0 flex-col items-start justify-between p-5 sm:p-6">
                                        <div className="min-w-0">
                                            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#D9B47B]">
                                                <Megaphone size={14} />
                                                {campaign?.category ||
                                                    'Community initiative'}
                                            </p>

                                            <h3 className="mt-4 font-['Fraunces']! text-[22px]! font-semibold! leading-[1.3]! text-[#EEF1F5]!">
                                                {campaign?.title ||
                                                    'Discover a community cause to support'}
                                            </h3>

                                            <p className="mt-2 text-[12px] leading-5 text-[#AAB6C5]">
                                                {campaign
                                                    ? 'Help this initiative reach its funding goal and support people in need.'
                                                    : 'Explore humanitarian initiatives and choose a cause that matters to you.'}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => go('campaigns')}
                                            className="group mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-[#D9B47B] hover:text-white"
                                        >
                                            Explore campaign
                                            <ArrowRight
                                                size={14}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </button>
                                    </div>

                                    <div className="flex flex-col justify-between border-t border-[#34404E] bg-[#202F3E] p-5 sm:border-l sm:border-t-0">
                                        <div>
                                            <p className={eyebrow}>
                                                Funding raised
                                            </p>

                                            <p className="mt-4 text-[25px] font-semibold tracking-tight text-[#EEF1F5]">
                                                ৳{fmt(campaign?.raised)}
                                            </p>

                                            <p className="mt-1 text-[11px] text-[#AAB6C5]">
                                                of ৳{fmt(campaign?.goal)}
                                            </p>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-[#AAB6C5]">
                                                    Progress
                                                </span>

                                                <span className="font-semibold text-[#EEF1F5]">
                                                    {progress}%
                                                </span>
                                            </div>

                                            <div
                                                className="mt-2 h-1.5 bg-[#344353]"
                                                role="progressbar"
                                                aria-label="Campaign funding progress"
                                                aria-valuenow={progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className="h-full bg-[#D9B47B]"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>

                                            {remaining !== null && (
                                                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#AAB6C5]">
                                                    <Clock3 size={12} />

                                                    {remaining === 0
                                                        ? 'Deadline reached'
                                                        : `${remaining} days remaining`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section> */}

                        {/* YOUR SUPPORT */}

                        <SupportOverview
                            pending={pending}
                            verified={verified}
                            completed={completed}
                            latest={latest}
                            onNavigate={go}
                        />

                        {/* CONTRIBUTION OVERVIEW */}

                        <ContributionOverview
                            donation={donation}
                            volunteer={volunteer}
                            onNavigate={go}
                        />

                        {/* RECENT ACTIVITY */}

                        <RecentActivity activities={activities} />
                    </main>

                    {/* =====================================
                        RIGHT SIDEBAR
                    ===================================== */}

                    <aside className="min-w-0 space-y-7">
                        {/* QUICK ACCESS */}

                        <section>
                            <SectionTitle
                                kicker="Your workspace"
                                title="Quick access"
                            />

                            <div className="mt-4 border-t border-[#29323E]">
                                <NavAction
                                    icon={HeartHandshake}
                                    title="Help requests"
                                    detail="Manage support requests"
                                    tint="bg-[#253C50] text-[#8FB9DC]"
                                    onClick={() => go('requests')}
                                />

                                <NavAction
                                    icon={HandCoins}
                                    title="Donations"
                                    detail="Your giving and contributions"
                                    tint="bg-[#273C37] text-[#82B9A4]"
                                    onClick={() => go('donations')}
                                />

                                <NavAction
                                    icon={Users}
                                    title="Volunteer activities"
                                    detail="Your time and involvement"
                                    tint="bg-[#393047] text-[#B8A2D5]"
                                    onClick={() => go('volunteer')}
                                />

                                <NavAction
                                    icon={Megaphone}
                                    title="Campaigns"
                                    detail="Explore humanitarian initiatives"
                                    tint="bg-[#403526] text-[#D9B47B]"
                                    onClick={() => go('campaigns')}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => go('notifications')}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#29323E] text-[11px] text-[#B8C5D3] hover:bg-[#1A222D]"
                                >
                                    <Bell size={14} />
                                    Notifications
                                </button>

                                <button
                                    type="button"
                                    onClick={() => go('settings')}
                                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#29323E] text-[11px] text-[#B8C5D3] hover:bg-[#1A222D]"
                                >
                                    <Settings2 size={14} />
                                    Settings
                                </button>
                            </div>
                        </section>

                        {/* REQUEST SUMMARY */}

                        <RequestSummary
                            total={requests.length}
                            pending={pending}
                            verified={verified}
                            completed={completed}
                            onNavigate={go}
                        />

                        {/* PROFILE */}

                        <section className="overflow-hidden border border-[#29323E] bg-[#151C25]">
                            <div className="bg-[#202F3E] p-5">
                                <div className="flex items-center justify-between">
                                    <p className={eyebrow}>Your membership</p>

                                    <ShieldCheck
                                        size={17}
                                        className="text-[#8FB9DC]"
                                    />
                                </div>

                                <div className="mt-4 flex items-center gap-3">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#40556B] bg-[#344A60] text-[17px] font-semibold text-[#EEF1F5]">
                                        {firstName.charAt(0).toUpperCase()}
                                    </span>

                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-semibold text-[#EEF1F5]">
                                            {user.name || 'User'}
                                        </p>

                                        <p className="mt-1 text-[11px] text-[#AAB6C5]">
                                            Community member
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center justify-between gap-3 border-b border-[#29323E] py-3 text-[11px]">
                                    <span className="flex items-center gap-2 text-[#94A2B2]">
                                        <MapPin size={13} />
                                        District
                                    </span>

                                    <span className="text-right font-medium text-[#EEF1F5]">
                                        {user.district || 'Not provided'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 py-3 text-[11px]">
                                    <span className="flex items-center gap-2 text-[#94A2B2]">
                                        <CalendarDays size={13} />
                                        Member since
                                    </span>

                                    <span className="text-right font-medium text-[#EEF1F5]">
                                        {dateText(user.memberSince)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => go('profile')}
                                    className="mt-2 flex min-h-10 w-full items-center justify-between border border-[#344353] bg-[#263747] px-3.5 text-[11px] font-semibold text-[#EEF1F5] transition hover:bg-[#30475B]"
                                >
                                    <span className="flex items-center gap-2">
                                        <UserRound size={14} />
                                        View your profile
                                    </span>

                                    <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </section>

                        <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-[#303B49] pt-6 text-[11px] text-[#8F9FAF]">
                            <span>Stand For People · Individual workspace</span>
                            <span>Community support and coordination</span>
                        </footer>
                    </aside>
                </div>

                {/* FOOTER */}

                <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#29323E] pt-5 text-[10px] text-[#8792A1]">
                    <span>Stand For People · Individual workspace</span>

                    <span>Community support and coordination</span>
                </footer>
            </div>
        </div>
    );
}
