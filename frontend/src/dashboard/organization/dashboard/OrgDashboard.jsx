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
    Building2,
    ClipboardList,
} from 'lucide-react';

import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ROUTES = {
    profile: '/organization/dashboard/profile/edit',
    requests: '/organization/dashboard/help-requests',
    requestDetails: (id) => `/organization/dashboard/responses/${id}`,
    campaigns: '/organization/dashboard/campaigns',
    campaignDetails: (id) => `/organization/dashboard/campaigns/${id}`,
    volunteers: '/organization/dashboard/volunteers',
};

const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const count = (value) => Number(value || 0).toLocaleString('en-BD');

const normalize = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

const label = (value) =>
    String(value || 'Unknown')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const dateText = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });
};

const relativeDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    const minutes = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 60000),
    );

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    if (minutes < 10080) return `${Math.floor(minutes / 1440)}d ago`;

    return dateText(value);
};

const statusStyles = {
    critical: 'bg-[#35232A] text-[#F0A6AF]',
    urgent: 'bg-[#35232A] text-[#F0A6AF]',
    high: 'bg-[#332A20] text-[#E6BF86]',
    low: 'bg-[#1E332B] text-[#A4D9BB]',
    active: 'bg-[#203247] text-[#B1D0EE]',
    in_progress: 'bg-[#203247] text-[#B1D0EE]',
    completed: 'bg-[#1E332B] text-[#A4D9BB]',
    resolved: 'bg-[#1E332B] text-[#A4D9BB]',
    verified: 'bg-[#1E332B] text-[#A4D9BB]',
};

function Badge({ value }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center px-2 py-1 text-[11px] font-medium ${
                statusStyles[normalize(value)] || 'bg-[#26313E] text-[#B5C2D0]'
            }`}
        >
            {label(value)}
        </span>
    );
}

function SectionTitle({ title, subtitle, action, onAction }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#2C3541] pb-4">
            <div className="min-w-0">
                <h2 className="font-sans! text-[16px] font-semibold! tracking-[-.02em] text-[#F0F3F7]!">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-1 text-[12px] leading-5 text-[#94A1B2]">
                        {subtitle}
                    </p>
                )}
            </div>

            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex shrink-0 items-center gap-1.5 pt-1 text-[12px] font-medium text-[#B9CBE0] transition hover:text-white"
                >
                    {action}
                    <ArrowUpRight size={15} />
                </button>
            )}
        </div>
    );
}

/* Existing Organization profile section, redesigned as a sidebar. */
function Snapshot({ organization, navigate }) {
    const verified = normalize(organization.verification_status) === 'verified';

    const photo = organization.photo || organization.photo_url;

    const details = [
        {
            label: 'Organization type',
            value: organization.type || 'Not specified',
        },
        {
            label: 'Location',
            value:
                organization.location ||
                organization.address ||
                'Not specified',
        },
        {
            label: 'Verification',
            value: verified
                ? 'Verified'
                : label(organization.verification_status || 'Pending'),
        },
    ];

    return (
        <aside className="min-w-0 border border-[#303A47] bg-[#19212B] lg:sticky lg:top-5">
            <div className="p-5 sm:p-6">
                <SectionTitle
                    title="Organization profile"
                    subtitle="Account and verification details"
                    action="Edit"
                    onAction={() => navigate(ROUTES.profile)}
                />

                <div className="mt-5 flex min-w-0 items-center gap-3">
                    {photo ? (
                        <img
                            src={photo}
                            alt=""
                            className="size-12 shrink-0 border border-[#394554] bg-[#253D32] object-cover"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <span className="flex size-12 shrink-0 items-center justify-center bg-[#253D32] text-[#A6D5B9]">
                            <Building2 size={21} strokeWidth={1.7} />
                        </span>
                    )}

                    <div className="min-w-0">
                        <h3 className="break-words text-[14px] font-semibold leading-5 text-[#EFF3F8]">
                            {organization.name || 'Organization'}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#A0B1C2]">
                            {verified && (
                                <ShieldCheck
                                    size={13}
                                    className="shrink-0 text-[#9BD5B5]"
                                />
                            )}
                            {verified
                                ? 'Verified organization'
                                : label(
                                      organization.verification_status ||
                                          'Pending verification',
                                  )}
                        </p>
                    </div>
                </div>

                <div className="mt-5 divide-y divide-[#303A47] border-t border-[#303A47]">
                    {details.map((item) => (
                        <div key={item.label} className="py-4">
                            <p className="text-[11px] text-[#91A1B3]">
                                {item.label}
                            </p>

                            <p className="mt-1.5 break-words text-[13px] leading-5 text-[#E4EAF1]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => navigate(ROUTES.profile)}
                    className="mt-2 flex min-h-10 w-full items-center justify-between border border-[#405063] px-3.5 text-[12px] font-medium text-[#DFE8F2] transition hover:bg-[#283646]"
                >
                    View full profile
                    <ArrowRight size={15} />
                </button>
            </div>
        </aside>
    );
}

function Hero({ organization, navigate }) {
    const banner = organization.banner || organization.banner_url || '';
    const verified = normalize(organization.verification_status) === 'verified';

    return (
        <section className="relative isolate overflow-hidden border border-[#303A47] bg-[#101720]">
            {banner && (
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 size-full object-cover object-center"
                    onError={(event) => {
                        event.currentTarget.style.display = 'none';
                    }}
                />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,26,.99)_0%,rgba(12,18,26,.94)_48%,rgba(12,18,26,.55)_100%)]" />

            <div className="relative flex min-h-[220px] flex-col justify-center px-5 py-7 sm:px-7 lg:min-h-[240px]">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#B4C4D4]">
                        Organization workspace
                    </span>

                    {verified && (
                        <span className="inline-flex items-center gap-1.5 bg-[#193027] px-2.5 py-1 text-[11px] text-[#B5DFC5]">
                            <ShieldCheck size={13} />
                            Verified
                        </span>
                    )}
                </div>

                <h1 className="mt-3 max-w-[600px] break-words font-sans! text-[26px] font-semibold! leading-tight tracking-[-.035em] text-[#F7F9FC]! sm:text-[32px]">
                    {organization.name || 'Organization dashboard'}
                </h1>

                <p className="mt-3 max-w-[480px] text-[13px] leading-6 text-[#C1CEDB]">
                    Manage requests, coordinate campaigns, and keep your
                    humanitarian response moving.
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.requests)}
                        className="inline-flex min-h-10 items-center gap-2 bg-[#D4A05A] px-4 text-[12px] font-semibold text-[#111820] transition hover:bg-[#E5B675]"
                    >
                        Review help requests
                        <ArrowRight size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.campaigns)}
                        className="inline-flex min-h-10 items-center gap-2 border border-[#647184] bg-[#121B26]/70 px-4 text-[12px] font-medium text-[#F0F3F7] transition hover:bg-[#263242]"
                    >
                        Campaigns
                        <ArrowUpRight size={15} />
                    </button>
                </div>
            </div>
        </section>
    );
}

function Metrics({ overview, volunteers }) {
    const items = [
        {
            label: 'Assigned requests',
            value: overview.assigned_requests,
            icon: ClipboardList,
            tone: 'text-[#A9C9E8]',
        },
        {
            label: 'In progress',
            value: overview.active_requests,
            icon: Activity,
            tone: 'text-[#E4BE88]',
        },
        {
            label: 'Completed',
            value: overview.completed_requests,
            icon: CheckCircle2,
            tone: 'text-[#9BD5B5]',
        },
        {
            label: 'Active campaigns',
            value: overview.active_campaigns,
            icon: Megaphone,
            tone: 'text-[#C3B4E2]',
        },
        {
            label: 'Volunteers',
            value: volunteers.total,
            icon: UsersRound,
            tone: 'text-[#AFC4E6]',
        },
    ];

    return (
        <section
            aria-label="Organization performance"
            className="grid grid-cols-2 gap-px overflow-hidden border border-[#303A47] bg-[#303A47] sm:grid-cols-3 2xl:grid-cols-5"
        >
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.label}
                        className="min-w-0 bg-[#19212B] px-4 py-5"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] leading-5 text-[#B1BECD]">
                                {item.label}
                            </span>

                            <Icon
                                size={17}
                                strokeWidth={1.8}
                                className={`shrink-0 ${item.tone}`}
                            />
                        </div>

                        <p className="mt-4 text-[28px] font-semibold leading-none tracking-tight text-[#F2F5F9] tabular-nums">
                            {count(item.value)}
                        </p>
                    </div>
                );
            })}
        </section>
    );
}

function RequestStatus({ overview }) {
    const total = Number(overview.assigned_requests || 0);
    const active = Number(overview.active_requests || 0);
    const completed = Number(overview.completed_requests || 0);
    const other = Math.max(0, total - active - completed);

    const segments = [
        { name: 'In progress', value: active, color: '#75A4D8' },
        { name: 'Completed', value: completed, color: '#78B99A' },
        { name: 'Other statuses', value: other, color: '#536477' },
    ];

    let offset = 0;

    const gradient = segments
        .filter((item) => item.value > 0)
        .map((item) => {
            const start = offset;
            offset += (item.value / Math.max(total, 1)) * 100;
            return `${item.color} ${start}% ${offset}%`;
        })
        .join(', ');

    return (
        <section className="min-w-0 bg-[#19212B] p-5 sm:p-6">
            <SectionTitle
                title="Request progress"
                subtitle="Status of all assigned cases"
            />

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                <div
                    role="img"
                    aria-label={`${active} in progress, ${completed} completed, ${other} other`}
                    className="relative size-32 shrink-0 rounded-full"
                    style={{
                        background: total
                            ? `conic-gradient(${gradient})`
                            : '#34404D',
                    }}
                >
                    <div className="absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-[#19212B]">
                        <strong className="text-[28px] leading-none text-[#F3F6F9]">
                            {count(total)}
                        </strong>
                        <span className="mt-1 text-[11px] text-[#9DAEBF]">
                            Assigned
                        </span>
                    </div>
                </div>

                <div className="w-full min-w-0 flex-1 divide-y divide-[#303A47]">
                    {segments.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between gap-3 py-3 text-[12px]"
                        >
                            <span className="flex items-center gap-2.5 text-[#B9C6D4]">
                                <span
                                    className="size-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                {item.name}
                            </span>
                            <strong className="text-[#F0F3F7] tabular-nums">
                                {count(item.value)}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Distribution({ requests }) {
    const counts = requests.reduce((acc, item) => {
        const district = String(item.district || 'Not specified').trim();
        acc[district] = (acc[district] || 0) + 1;
        return acc;
    }, {});

    const entries = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const max = Math.max(1, ...entries.map((entry) => entry[1]));

    return (
        <section className="min-w-0 bg-[#19212B] p-5 sm:p-6">
            <SectionTitle
                title="Where support is needed"
                subtitle="Districts represented in recent requests"
            />

            <div className="mt-6 space-y-5">
                {entries.length ? (
                    entries.map(([district, value]) => (
                        <div
                            key={district}
                            className="grid grid-cols-[85px_minmax(0,1fr)_24px] items-center gap-3 sm:grid-cols-[105px_minmax(0,1fr)_24px]"
                        >
                            <span className="truncate text-[12px] text-[#B9C6D4]">
                                {district}
                            </span>

                            <div className="h-2 bg-[#303D4C]">
                                <div
                                    className="h-full bg-[#7CA7D2]"
                                    style={{
                                        width: `${(value / max) * 100}%`,
                                    }}
                                />
                            </div>

                            <span className="text-right text-[12px] font-semibold text-[#EEF2F7] tabular-nums">
                                {value}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="py-6 text-[13px] text-[#9AAABD]">
                        No location information available.
                    </p>
                )}
            </div>
        </section>
    );
}

function Requests({ requests, navigate }) {
    const rank = {
        critical: 0,
        urgent: 1,
        high: 2,
        medium: 3,
        normal: 4,
        low: 5,
    };

    const sorted = [...requests]
        .sort(
            (a, b) =>
                (rank[normalize(a.urgency)] ?? 6) -
                (rank[normalize(b.urgency)] ?? 6),
        )
        .slice(0, 5);

    return (
        <section className="min-w-0 bg-[#19212B] p-5 sm:p-6">
            <SectionTitle
                title="Requests requiring attention"
                subtitle="Prioritized by urgency"
                action="All requests"
                onAction={() => navigate(ROUTES.requests)}
            />

            <div className="divide-y divide-[#303A47]">
                {sorted.length ? (
                    sorted.map((item, index) => (
                        <button
                            key={item.id ?? index}
                            type="button"
                            onClick={() =>
                                navigate(
                                    ROUTES.requestDetails(
                                        item.help_request_id || item.id,
                                    ),
                                )
                            }
                            className="group flex w-full min-w-0 items-center gap-3 py-4 text-left transition hover:bg-[#222C38]/60"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center bg-[#25354A] text-[#A8C8E9]">
                                <HeartHandshake size={17} />
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-medium text-[#EEF2F7]">
                                    {item.title || 'Untitled request'}
                                </span>

                                <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#93A6BA]">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin size={12} />
                                        {item.district || 'Not specified'}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock3 size={12} />
                                        {relativeDate(item.updated_at)}
                                    </span>
                                </span>
                            </span>

                            <span className="hidden sm:inline-flex">
                                <Badge value={item.urgency || item.status} />
                            </span>

                            <ChevronRight
                                size={16}
                                className="shrink-0 text-[#8294A8] group-hover:text-white"
                            />
                        </button>
                    ))
                ) : (
                    <p className="py-10 text-center text-[13px] text-[#99AABC]">
                        No recent help requests available.
                    </p>
                )}
            </div>
        </section>
    );
}

function Campaigns({ campaigns, navigate }) {
    return (
        <section className="min-w-0 bg-[#19212B] p-5 sm:p-6">
            <SectionTitle
                title="Campaign activity"
                subtitle="Recent humanitarian initiatives"
                action="All campaigns"
                onAction={() => navigate(ROUTES.campaigns)}
            />

            <div className="divide-y divide-[#303A47]">
                {campaigns.length ? (
                    campaigns.slice(0, 5).map((item, index) => (
                        <button
                            key={item.id ?? index}
                            type="button"
                            onClick={() =>
                                navigate(ROUTES.campaignDetails(item.id))
                            }
                            className="group flex w-full min-w-0 items-center gap-3 py-4 text-left transition hover:bg-[#222C38]/60"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center bg-[#312C42] text-[#C8B8E8]">
                                <Megaphone size={17} />
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-medium text-[#EEF2F7]">
                                    {item.title || 'Untitled campaign'}
                                </span>

                                <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#93A6BA]">
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays size={12} />
                                        {dateText(item.start_date)}
                                    </span>

                                    {item.end_date && (
                                        <span>
                                            Ends {dateText(item.end_date)}
                                        </span>
                                    )}
                                </span>
                            </span>

                            <span className="hidden sm:inline-flex">
                                <Badge value={item.status} />
                            </span>

                            <ChevronRight
                                size={16}
                                className="shrink-0 text-[#8294A8] group-hover:text-white"
                            />
                        </button>
                    ))
                ) : (
                    <p className="py-10 text-center text-[13px] text-[#99AABC]">
                        No recent campaigns available.
                    </p>
                )}
            </div>
        </section>
    );
}

function VolunteerPanel({ volunteers, navigate }) {
    return (
        <section className="min-w-0 bg-[#19212B] p-5 sm:p-6">
            <SectionTitle
                title="Volunteer coordination"
                subtitle="People supporting your response"
            />

            <div className="mt-6 flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center bg-[#29354A] text-[#B4C7E9]">
                    <UsersRound size={23} />
                </span>

                <div>
                    <p className="text-[29px] font-semibold leading-none text-[#F3F6FA]">
                        {count(volunteers.total)}
                    </p>
                    <p className="mt-2 text-[12px] text-[#9AAABC]">
                        Assigned volunteers
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-between gap-3 border-y border-[#303A47] py-4 text-[12px]">
                <span className="text-[#A7B5C5]">Active assignments</span>
                <strong className="text-[#EEF2F7]">
                    {count(volunteers.active_assignments)}
                </strong>
            </div>

            <button
                type="button"
                onClick={() => navigate(ROUTES.volunteers)}
                className="mt-5 flex min-h-10 w-full items-center justify-between border border-[#405063] px-4 text-[12px] font-medium text-[#DFE8F2] transition hover:bg-[#283646]"
            >
                Manage volunteers
                <ArrowRight size={15} />
            </button>
        </section>
    );
}

export default function OrgDashboard() {
    const navigate = useNavigate();
    const [requestVersion, setRequestVersion] = useState(0);

    const [result, setResult] = useState({
        data: null,
        error: '',
        version: -1,
    });

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            const token = getToken();

            if (!token) {
                setResult({
                    data: null,
                    error: 'Authentication token not found.',
                    version: requestVersion,
                });
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
                        signal: controller.signal,
                    },
                );

                if (controller.signal.aborted) return;

                if (!response.data?.data) {
                    throw new Error('Dashboard data is currently unavailable.');
                }

                setResult({
                    data: response.data.data,
                    error: '',
                    version: requestVersion,
                });
            } catch (error) {
                if (controller.signal.aborted || axios.isCancel(error)) {
                    return;
                }

                console.error('Organization dashboard error:', error);

                setResult({
                    data: null,
                    error:
                        error.response?.data?.message ||
                        error.message ||
                        'Unable to load organization dashboard.',
                    version: requestVersion,
                });
            }
        };

        void load();

        return () => controller.abort();
    }, [requestVersion]);

    if (result.version !== requestVersion) {
        return (
            <LoadingUI
                variant="page"
                title="Loading dashboard..."
                description="Please wait while we retrieve your organization's dashboard information."
            />
        );
    }

    if (result.error || !result.data) {
        return (
            <div className="space-y-4">
                <LoadingError
                    title="Unable to load dashboard"
                    message={
                        result.error ||
                        'Dashboard data is currently unavailable.'
                    }
                />

                <button
                    type="button"
                    onClick={() => setRequestVersion((value) => value + 1)}
                    className="inline-flex min-h-10 items-center gap-2 border border-[#394657] bg-[#202B38] px-4 text-[13px] font-medium text-[#E0E8F1] hover:bg-[#2A3949]"
                >
                    <RefreshCw size={15} />
                    Try again
                </button>
            </div>
        );
    }

    const dashboard = result.data;
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
        <main className="w-full min-w-0 pb-8 text-[#EEF1F5]">
            <Hero organization={organization} navigate={navigate} />

            <div className="mt-5 grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_285px] 2xl:grid-cols-[minmax(0,1fr)_310px]">
                {/* Main dashboard content */}
                <div className="min-w-0 space-y-5">
                    <Metrics overview={overview} volunteers={volunteers} />

                    <div className="grid min-w-0 grid-cols-1 gap-px overflow-hidden border border-[#303A47] bg-[#303A47] lg:grid-cols-2">
                        <RequestStatus overview={overview} />
                        <Distribution requests={requests} />
                    </div>

                    <div className="grid min-w-0 grid-cols-1 items-start gap-5 2xl:grid-cols-2">
                        <Requests requests={requests} navigate={navigate} />

                        <Campaigns campaigns={campaigns} navigate={navigate} />
                    </div>

                    <VolunteerPanel
                        volunteers={volunteers}
                        navigate={navigate}
                    />
                </div>

                {/* The original Organization profile section is now the sidebar */}
                <Snapshot organization={organization} navigate={navigate} />
            </div>

            <footer className="mt-6 flex flex-wrap justify-between gap-3 border-t border-[#303A47] pt-5 text-[11px] text-[#8FA1B5]">
                <span>Stand For People · Organization workspace</span>
                <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={14} />
                    Humanitarian coordination
                </span>
            </footer>
        </main>
    );
}
