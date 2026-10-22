import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    HeartHandshake,
    MapPin,
    Megaphone,
    RefreshCw,
    ShieldCheck,
    UsersRound,
} from 'lucide-react';

import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ROUTES = {
    profile: '/dashboard/organization/profile',
    requests: '/dashboard/organization/requests',
    requestDetails: (id) => `/dashboard/organization/responses/${id}`,
    campaigns: '/dashboard/organization/campaigns',
    campaignDetails: (id) => `/dashboard/organization/campaigns/${id}`,
    volunteers: '/dashboard/organization/volunteers',
};

const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const formatNumber = (value) => Number(value || 0).toLocaleString('en-BD');

const formatLabel = (value) =>
    String(value || 'Unknown')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatRelativeDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    const minutes = Math.floor(
        Math.max(0, Date.now() - date.getTime()) / 60000,
    );

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);

    if (days < 7) return `${days}d ago`;

    return formatDate(value);
};

const normalizeStatus = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

const STATUS_STYLES = {
    active: 'border-[#36516E] bg-[#203247] text-[#A7C8EA]',
    in_progress: 'border-[#36516E] bg-[#203247] text-[#A7C8EA]',
    completed: 'border-[#315849] bg-[#1D332B] text-[#9FD6B5]',
    resolved: 'border-[#315849] bg-[#1D332B] text-[#9FD6B5]',
    verified: 'border-[#315849] bg-[#1D332B] text-[#9FD6B5]',
    pending: 'border-[#655036] bg-[#33291F] text-[#E8C18A]',
    rejected: 'border-[#6A414A] bg-[#34232B] text-[#EBA8B2]',
    cancelled: 'border-[#47515D] bg-[#252D38] text-[#A8B5C5]',
};

const URGENCY_STYLES = {
    critical: 'border-[#70404A] bg-[#35232B] text-[#F1A3AF]',
    urgent: 'border-[#70404A] bg-[#35232B] text-[#F1A3AF]',
    high: 'border-[#685133] bg-[#33291D] text-[#E9BD7D]',
    medium: 'border-[#46536A] bg-[#242E3D] text-[#B5C7DD]',
    normal: 'border-[#46536A] bg-[#242E3D] text-[#B5C7DD]',
    low: 'border-[#315849] bg-[#1D332B] text-[#9FD6B5]',
};

function StatusBadge({ status, urgency = false }) {
    const normalized = normalizeStatus(status);
    const styles = urgency ? URGENCY_STYLES : STATUS_STYLES;

    return (
        <span
            className={`inline-flex shrink-0 items-center border px-2.5 py-1 text-[11px] font-medium ${
                styles[normalized] ||
                'border-[#3B4654] bg-[#222B36] text-[#B4C1D0]'
            }`}
        >
            {formatLabel(status)}
        </span>
    );
}

function SectionHeading({ title, description, action, onAction }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-[17px] font-semibold tracking-tight text-[#EEF1F5] sm:text-[19px]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 text-[12px] leading-5 text-[#94A5B8] sm:text-[13px]">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-[#A9C3DF] transition-colors hover:text-white sm:text-[13px]"
                >
                    {action}
                    <ArrowUpRight size={15} />
                </button>
            )}
        </div>
    );
}

function EmptyMessage({ children }) {
    return (
        <div className="py-10 text-center text-[13px] leading-6 text-[#8B9DB0]">
            {children}
        </div>
    );
}

/* Organization banner */

function HeroBanner({ organization, navigate }) {
    const isVerified =
        normalizeStatus(organization.verification_status) === 'verified';

    const coverPhoto = organization.banner || organization.banner_url || '';

    return (
        <section className="relative isolate min-h-[280px] overflow-hidden border border-[#303A47] bg-[#101720] sm:min-h-[320px]">
            {coverPhoto && (
                <img
                    src={coverPhoto}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={(event) => {
                        event.currentTarget.style.display = 'none';
                    }}
                />
            )}

            <div
                className="absolute inset-0"
                style={{
                    background: coverPhoto
                        ? 'linear-gradient(90deg, rgba(10,17,24,.97) 0%, rgba(10,17,24,.87) 42%, rgba(10,17,24,.48) 100%), linear-gradient(0deg, rgba(10,17,24,.35), transparent)'
                        : 'linear-gradient(115deg, #101720 0%, #172736 55%, #20382F 100%)',
                }}
            />

            <div className="absolute right-0 bottom-0 h-40 w-2/3 bg-gradient-to-t from-[#101720]/35 to-transparent" />

            <div className="relative flex min-h-[280px] flex-col justify-center px-5 py-8 sm:min-h-[320px] sm:px-8 lg:px-10">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C0D0DF]">
                            Organization dashboard
                        </span>

                        {isVerified && (
                            <span className="inline-flex items-center gap-1.5 border border-[#47705D] bg-[#172D25]/90 px-2.5 py-1 text-[11px] font-medium text-[#B7DEC6]">
                                <ShieldCheck size={13} />
                                Verified
                            </span>
                        )}
                    </div>

                    <h1 className="mt-4 max-w-2xl text-2xl leading-tight font-semibold tracking-tight text-[#F4F7FB] sm:text-3xl lg:text-[36px]">
                        {organization.name || 'Your organization'}
                    </h1>

                    <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#D0DAE5] sm:text-sm sm:leading-7">
                        Coordinate community support, manage campaigns, and
                        respond to help requests from one place.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.requests)}
                            className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#D4A05A] px-4 text-[12px] font-semibold text-[#111820] transition-colors hover:bg-[#E5B26F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B26F] sm:text-[13px]"
                        >
                            View help requests
                            <ArrowRight size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.campaigns)}
                            className="inline-flex min-h-10 items-center justify-center gap-2 border border-white/25 bg-[#101720]/45 px-4 text-[12px] font-medium text-[#F0F4F8] backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[13px]"
                        >
                            Manage campaigns
                            <ArrowUpRight size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(ROUTES.profile)}
                            className="inline-flex min-h-10 items-center gap-1.5 px-1 text-[12px] font-medium text-[#D0DAE5] transition-colors hover:text-white sm:ml-1 sm:text-[13px]"
                        >
                            Edit organization profile
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Dashboard metrics */

function ImpactStrip({ overview, volunteers }) {
    const metrics = [
        {
            label: 'Assigned requests',
            value: overview.assigned_requests,
            detail: 'Total assigned',
            icon: HeartHandshake,
            color: '#92B9E1',
        },
        {
            label: 'In progress',
            value: overview.active_requests,
            detail: 'Currently active',
            icon: Activity,
            color: '#E1B77C',
        },
        {
            label: 'Completed',
            value: overview.completed_requests,
            detail: 'Resolved requests',
            icon: CheckCircle2,
            color: '#A5D2B8',
        },
        {
            label: 'Active campaigns',
            value: overview.active_campaigns,
            detail: 'Ongoing initiatives',
            icon: Megaphone,
            color: '#C1AFE2',
        },
        {
            label: 'Volunteers',
            value: volunteers.total,
            detail: `${formatNumber(volunteers.active_assignments)} active assignments`,
            icon: UsersRound,
            color: '#A7C5E8',
        },
    ];

    return (
        <section className="border-y border-[#303A47] py-6 sm:py-7">
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-5">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;

                    return (
                        <div
                            key={metric.label}
                            className={`min-w-0 px-1 sm:px-3 xl:px-5 ${
                                index > 0
                                    ? 'xl:border-l xl:border-[#303A47]'
                                    : ''
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className="mt-0.5 flex size-9 shrink-0 items-center justify-center bg-[#202B39]"
                                    style={{ color: metric.color }}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[11px] leading-4 text-[#A4B3C5] sm:text-[12px]">
                                        {metric.label}
                                    </p>

                                    <p className="mt-1.5 text-[26px] leading-none font-semibold tabular-nums text-[#EEF1F5] sm:text-[29px]">
                                        {formatNumber(metric.value)}
                                    </p>

                                    <p className="mt-2 text-[10px] leading-4 text-[#8496AA] sm:text-[11px]">
                                        {metric.detail}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* Request status chart */

function RequestStatusChart({ overview, requests }) {
    const assigned = Number(overview.assigned_requests || 0);
    const active = Number(overview.active_requests || 0);
    const completed = Number(overview.completed_requests || 0);

    const remaining = Math.max(0, assigned - active - completed);

    const segments = [
        {
            label: 'In progress',
            value: active,
            color: '#6C9FD6',
        },
        {
            label: 'Completed',
            value: completed,
            color: '#78B99A',
        },
        {
            label: 'Other statuses',
            value: remaining,
            color: '#536477',
        },
    ];

    let position = 0;

    const gradient = segments
        .filter((segment) => segment.value > 0)
        .map((segment) => {
            const start = position;
            position += (segment.value / Math.max(assigned, 1)) * 100;

            return `${segment.color} ${start}% ${position}%`;
        })
        .join(', ');

    return (
        <div className="min-w-0">
            <SectionHeading
                title="Response status"
                description="Current progress across assigned requests"
            />

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <div
                    className="relative size-40 shrink-0 rounded-full sm:size-44"
                    style={{
                        background:
                            assigned > 0
                                ? `conic-gradient(${gradient})`
                                : '#293645',
                    }}
                    role="img"
                    aria-label={`${active} in progress, ${completed} completed, ${remaining} other requests`}
                >
                    <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-[#151C25]">
                        <span className="text-[30px] font-semibold leading-none text-[#EEF1F5] sm:text-[33px]">
                            {formatNumber(assigned)}
                        </span>

                        <span className="mt-1 text-[12px] text-[#91A3B8]">
                            Assigned
                        </span>
                    </div>
                </div>

                <div className="w-full min-w-0 flex-1">
                    {segments.map((segment) => (
                        <div
                            key={segment.label}
                            className="flex items-center justify-between gap-4 border-b border-[#2D3845] py-3 last:border-b-0"
                        >
                            <span className="flex min-w-0 items-center gap-2.5 text-[12px] text-[#B5C2D1]">
                                <span
                                    className="size-2.5 shrink-0 rounded-sm"
                                    style={{
                                        backgroundColor: segment.color,
                                    }}
                                />
                                {segment.label}
                            </span>

                            <span className="text-[13px] font-semibold tabular-nums text-[#EAF0F6]">
                                {formatNumber(segment.value)}
                            </span>
                        </div>
                    ))}

                    {assigned > requests.length && (
                        <p className="mt-3 text-[11px] leading-5 text-[#8193A8]">
                            Recent requests are a subset of all assigned
                            requests.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* Recent request locations */

function DistrictDistribution({ requests }) {
    const counts = requests.reduce((result, request) => {
        const district = String(request.district || 'Not specified').trim();

        result[district] = (result[district] || 0) + 1;

        return result;
    }, {});

    const districts = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const maximum = Math.max(1, ...districts.map((district) => district[1]));

    return (
        <div className="min-w-0">
            <SectionHeading
                title="Where help is needed"
                description="Geographic distribution of recent requests"
            />

            {districts.length === 0 ? (
                <EmptyMessage>No location information available.</EmptyMessage>
            ) : (
                <div className="mt-6 space-y-5">
                    {districts.map(([district, count]) => (
                        <div
                            key={district}
                            className="grid grid-cols-[95px_minmax(0,1fr)_25px] items-center gap-3"
                        >
                            <span className="truncate text-[12px] text-[#B9C6D5]">
                                {district}
                            </span>

                            <div className="h-2 overflow-hidden bg-[#283544]">
                                <div
                                    className="h-full bg-[#759BC2] transition-[width]"
                                    style={{
                                        width: `${(count / maximum) * 100}%`,
                                    }}
                                />
                            </div>

                            <span className="text-right text-[12px] font-semibold tabular-nums text-[#E5ECF5]">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <p className="mt-6 text-[11px] leading-5 text-[#8193A8]">
                Based on recent requests returned by the dashboard API.
            </p>
        </div>
    );
}

/* Organization details */

function OrganizationSnapshot({ organization, navigate }) {
    const isVerified =
        normalizeStatus(organization.verification_status) === 'verified';

    const details = [
        {
            label: 'Organization type',
            value: organization.type || 'Not specified',
        },
        {
            label: 'Location',
            value: organization.location || 'Not specified',
        },
        {
            label: 'Verification',
            value: isVerified
                ? 'Verified'
                : formatLabel(organization.verification_status || 'Pending'),
        },
    ];

    const photo = organization.photo || organization.photo_url || '';

    return (
        <aside className="min-w-0">
            <SectionHeading
                title="Organization snapshot"
                description="Your organization at a glance"
                action="View profile"
                onAction={() => navigate(ROUTES.profile)}
            />

            <div className="mt-5">
                <div className="flex items-center gap-3 border-b border-[#303A47] pb-5">
                    {photo ? (
                        <img
                            src={photo}
                            alt=""
                            className="size-12 shrink-0 border border-[#344150] bg-[#1B2632] object-cover"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <span className="flex size-12 shrink-0 items-center justify-center bg-[#21342D] text-[#A3D5B8]">
                            <ShieldCheck size={22} />
                        </span>
                    )}

                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#E9F0F6]">
                            {organization.name || 'Organization'}
                        </p>

                        <p className="mt-1 text-[12px] text-[#91A3B6]">
                            {isVerified
                                ? 'Verified organization'
                                : 'Organization profile'}
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-[#2D3845]">
                    {details.map((detail) => (
                        <div
                            key={detail.label}
                            className="flex items-start justify-between gap-4 py-3.5"
                        >
                            <span className="text-[12px] text-[#8EA0B4]">
                                {detail.label}
                            </span>

                            <span className="max-w-[55%] text-right text-[12px] font-medium text-[#DCE6F0]">
                                {detail.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

/* Recent help requests */

function RecentRequests({ requests, navigate }) {
    const urgencyRank = {
        critical: 0,
        urgent: 1,
        high: 2,
        medium: 3,
        normal: 4,
        low: 5,
    };

    const sortedRequests = [...requests]
        .sort((a, b) => {
            const aRank = urgencyRank[normalizeStatus(a.urgency)] ?? 6;
            const bRank = urgencyRank[normalizeStatus(b.urgency)] ?? 6;

            return aRank - bRank;
        })
        .slice(0, 5);

    return (
        <section className="min-w-0">
            <SectionHeading
                title="Recent help requests"
                description="Assigned cases requiring attention"
                action="View all"
                onAction={() => navigate(ROUTES.requests)}
            />

            <div className="mt-5 border-t border-[#34404E]">
                {sortedRequests.length === 0 ? (
                    <EmptyMessage>
                        No recent help requests available.
                    </EmptyMessage>
                ) : (
                    <div className="divide-y divide-[#2B3643]">
                        {sortedRequests.map((request, index) => (
                            <button
                                key={request.id ?? index}
                                type="button"
                                onClick={() =>
                                    navigate(
                                        ROUTES.requestDetails(
                                            request.help_request_id ||
                                                request.id,
                                        ),
                                    )
                                }
                                className="group flex w-full min-w-0 items-center gap-3 py-3.5 text-left transition-colors hover:bg-[#1A2430]"
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center bg-[#223043] text-[#9CBCE0]">
                                    <HeartHandshake size={17} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-1 text-[13px] font-medium text-[#E8EEF5] group-hover:text-white">
                                        {request.title || 'Untitled request'}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8FA2B7]">
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={12} />
                                            {request.district ||
                                                'Not specified'}
                                        </span>

                                        <span className="inline-flex items-center gap-1">
                                            <Clock3 size={12} />
                                            {formatRelativeDate(
                                                request.updated_at,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden sm:block">
                                    <StatusBadge
                                        status={
                                            request.urgency || request.status
                                        }
                                        urgency={Boolean(request.urgency)}
                                    />
                                </div>

                                <ChevronRight
                                    size={16}
                                    className="shrink-0 text-[#70849A] transition-colors group-hover:text-[#DDE7F2]"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* Campaign list */

function CampaignList({ campaigns, navigate }) {
    const visibleCampaigns = campaigns.slice(0, 5);

    return (
        <section className="min-w-0">
            <SectionHeading
                title="Active campaigns"
                description="Ongoing humanitarian initiatives"
                action="View all"
                onAction={() => navigate(ROUTES.campaigns)}
            />

            <div className="mt-5 border-t border-[#34404E]">
                {visibleCampaigns.length === 0 ? (
                    <EmptyMessage>No recent campaigns available.</EmptyMessage>
                ) : (
                    <div className="divide-y divide-[#2B3643]">
                        {visibleCampaigns.map((campaign, index) => (
                            <button
                                key={campaign.id ?? index}
                                type="button"
                                onClick={() =>
                                    navigate(
                                        ROUTES.campaignDetails(campaign.id),
                                    )
                                }
                                className="group flex w-full min-w-0 items-center gap-3 py-3.5 text-left transition-colors hover:bg-[#1A2430]"
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center bg-[#2A263B] text-[#C1B0E4]">
                                    <Megaphone size={17} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 text-[13px] leading-5 font-medium text-[#E8EEF5] group-hover:text-white">
                                        {campaign.title || 'Untitled campaign'}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8FA2B7]">
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays size={12} />
                                            {formatDate(campaign.start_date)}
                                        </span>

                                        {campaign.end_date && (
                                            <span>
                                                Ends{' '}
                                                {formatDate(campaign.end_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden sm:block">
                                    <StatusBadge status={campaign.status} />
                                </div>

                                <ChevronRight
                                    size={16}
                                    className="shrink-0 text-[#70849A] transition-colors group-hover:text-[#DDE7F2]"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* Volunteer involvement */

function VolunteerInvolvement({ volunteers, navigate }) {
    const total = Number(volunteers.total || 0);
    const assignments = Number(volunteers.active_assignments || 0);

    return (
        <section className="min-w-0">
            <SectionHeading
                title="Volunteer involvement"
                description="People supporting your response"
            />

            <div className="mt-6 flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center bg-[#273044] text-[#B3BDE5]">
                    <UsersRound size={24} />
                </span>

                <div>
                    <p className="text-[30px] font-semibold leading-none text-[#EDF2F7] sm:text-[32px]">
                        {formatNumber(total)}
                    </p>

                    <p className="mt-2 text-[12px] text-[#95A7BB]">
                        Assigned volunteers
                    </p>
                </div>
            </div>

            <div className="mt-6 border-y border-[#303A47] py-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-[#A2B1C2]">
                        Active assignments
                    </span>

                    <span className="text-[14px] font-semibold text-[#EDF2F7]">
                        {formatNumber(assignments)}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => navigate(ROUTES.volunteers)}
                className="mt-5 inline-flex min-h-10 w-full items-center justify-between border border-[#394657] px-4 text-[12px] font-medium text-[#D6E2EE] transition-colors hover:bg-[#222E3C]"
            >
                Manage volunteers
                <ArrowRight size={15} />
            </button>
        </section>
    );
}

/* Main dashboard */

export default function OrgDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const token = getToken();

        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);

            return () => controller.abort();
        }

        axios
            .get(`${API_URL}/organization/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                signal: controller.signal,
            })
            .then((response) => {
                if (controller.signal.aborted) return;

                setDashboard(response.data?.data || null);
                setError('');
            })
            .catch((err) => {
                if (axios.isCancel(err) || controller.signal.aborted) {
                    return;
                }

                console.error('Organization dashboard error:', err);

                setError(
                    err.response?.data?.message ||
                        'Unable to load organization dashboard.',
                );
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    const handleRetry = async () => {
        setLoading(true);
        setError('');

        const token = getToken();

        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/organization/dashboard`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                },
            );

            setDashboard(response.data?.data || null);
            setError('');
        } catch (err) {
            console.error('Organization dashboard error:', err);

            setError(
                err.response?.data?.message ||
                    'Unable to load organization dashboard.',
            );
        } finally {
            setLoading(false);
        }
    };

    // Use the shared loading UI without page-specific wrappers.
    if (loading) {
        return <LoadingUI />;
    }

    if (error || !dashboard) {
        return (
            <div className="px-4 py-8 sm:px-6">
                <LoadingError
                    title="Unable to load dashboard"
                    message={
                        error || 'Dashboard data is currently unavailable.'
                    }
                />

                <div className="mt-5 flex justify-center">
                    <button
                        type="button"
                        onClick={handleRetry}
                        className="inline-flex min-h-10 items-center gap-2 border border-[#394657] bg-[#202B38] px-4 text-[13px] font-medium text-[#D8E3EF] transition-colors hover:bg-[#2A3949]"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const organization = dashboard.organization || {};
    const overview = dashboard.overview || {};
    const volunteers = dashboard.volunteers || {};

    const requests = Array.isArray(dashboard.requests)
        ? dashboard.requests
        : [];

    const campaigns = Array.isArray(dashboard.campaigns)
        ? dashboard.campaigns
        : [];

    return (
        <div className="min-h-screen bg-[#151A22] text-[#EEF1F5]">
            <main className="mx-auto w-full max-w-[1500px] space-y-8 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
                <HeroBanner organization={organization} navigate={navigate} />

                <ImpactStrip overview={overview} volunteers={volunteers} />

                <section className="grid min-w-0 grid-cols-1 gap-8 border-b border-[#303A47] pb-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-10 xl:pb-9">
                    <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-9">
                        <RequestStatusChart
                            overview={overview}
                            requests={requests}
                        />

                        <DistrictDistribution requests={requests} />
                    </div>

                    <div className="border-t border-[#303A47] pt-7 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8">
                        <OrganizationSnapshot
                            organization={organization}
                            navigate={navigate}
                        />
                    </div>
                </section>

                <section className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_290px] xl:gap-8">
                    <RecentRequests requests={requests} navigate={navigate} />

                    <div className="border-t border-[#303A47] pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                        <CampaignList
                            campaigns={campaigns}
                            navigate={navigate}
                        />
                    </div>

                    <div className="border-t border-[#303A47] pt-7 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8">
                        <VolunteerInvolvement
                            volunteers={volunteers}
                            navigate={navigate}
                        />
                    </div>
                </section>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#303A47] pt-5">
                    <p className="text-[12px] text-[#8294A8]">
                        Stand For People · Organization workspace
                    </p>

                    <span className="inline-flex items-center gap-2 text-[12px] text-[#92A4B8]">
                        <ShieldCheck size={14} />
                        Humanitarian coordination
                    </span>
                </footer>
            </main>
        </div>
    );
}
