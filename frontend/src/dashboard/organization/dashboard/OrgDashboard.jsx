import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    ClipboardList,
    Clock3,
    HeartHandshake,
    ImageOff,
    MapPin,
    Megaphone,
    RefreshCw,
    ShieldCheck,
    UsersRound,
    TrendingUp,
    BarChart3,
    Layers3,
} from 'lucide-react';

import DashboardLoading from '@/components/dashboard/DashboardLoading';
import LoadingError from '@/components/dashboard/LoadingError';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ROOT = '/organization/dashboard';

const ROUTES = {
    profile: `${ROOT}/profile/edit`,
    requests: `${ROOT}/help-requests`,
    requestDetails: (id) => `${ROOT}/responses/${id}`,
    campaigns: `${ROOT}/campaigns`,
    campaignDetails: (id) => `${ROOT}/campaigns/${id}`,
    volunteers: `${ROOT}/volunteers`,
};

const token = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const fmt = (value) => Number(value || 0).toLocaleString('en-BD');

const norm = (value) =>
    String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

const titleCase = (value) =>
    String(value || 'Unknown')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (s) => s.toUpperCase());

const formatDate = (value) => {
    if (!value) return 'Not specified';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? 'Not specified'
        : date.toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });
};

const imageValue = (...values) => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) return value;

        if (value && typeof value === 'object') {
            const image = value.url || value.path || value.src;
            if (typeof image === 'string' && image.trim()) return image;
        }
    }

    return '';
};

const orgCover = (org) =>
    imageValue(
        org.cover_photo,
        org.cover_image,
        org.cover_photo_url,
        org.cover_image_url,
        org.banner,
        org.banner_image,
        org.banner_url,
        org.cover,
        org.background_image,
        org.profile_cover,
        org.photo,
        org.image,
    );

const campaignCover = (campaign) =>
    imageValue(
        campaign.cover_photo,
        campaign.cover_image,
        campaign.cover_photo_url,
        campaign.cover_image_url,
        campaign.banner,
        campaign.image,
        campaign.photo,
    );

const urgencyRank = {
    critical: 0,
    urgent: 1,
    high: 2,
    medium: 3,
    normal: 4,
    low: 5,
};

const isUrgent = (value) => ['critical', 'urgent'].includes(norm(value));

const isActive = (value) =>
    ['active', 'in_progress', 'pending', 'verified'].includes(norm(value));

const EYEBROW =
    'text-[10px] font-semibold! uppercase tracking-[0.16em] text-[#91A1B2]';

/* =========================================================
   SHARED
========================================================= */

function Photo({ src, alt, className = '', icon: Icon = ImageOff }) {
    const [failedSrc, setFailedSrc] = useState('');

    const valid = Boolean(src) && failedSrc !== src;

    return (
        <div className={`relative overflow-hidden bg-[#243442] ${className}`}>
            {valid ? (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setFailedSrc(src)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#293D4B,#1B2935)]">
                    <Icon
                        size={26}
                        strokeWidth={1.3}
                        className="text-[#829AAD]"
                    />
                </div>
            )}
        </div>
    );
}

function TextLink({ children, onClick, accent = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group inline-flex shrink-0 items-center gap-2 text-[12px] font-semibold! transition ${
                accent
                    ? 'text-[#E8BA90] hover:text-[#F3D0AF]'
                    : 'text-[#B7C6D3] hover:text-white'
            }`}
        >
            {children}
            <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
        </button>
    );
}

function SectionHeading({ number, eyebrow, title, description, action }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    {number && (
                        <span className="text-[11px] font-semibold! text-[#7690A3]">
                            {number}
                        </span>
                    )}

                    <span className={EYEBROW}>{eyebrow}</span>
                </div>

                <h2 className="mt-2 font-['Fraunces']! text-[24px]! font-semibold! leading-tight tracking-[-0.035em] text-[#EEF1F5]! sm:text-[28px]!">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[#94A6B6]">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}

function Status({ value }) {
    const normalized = norm(value);

    const style = ['resolved', 'completed', 'verified', 'active'].includes(
        normalized,
    )
        ? 'text-[#9CD4B5] bg-[#2B453C]'
        : ['critical', 'urgent', 'rejected'].includes(normalized)
          ? 'text-[#EFA5AF] bg-[#48313A]'
          : 'text-[#E7B78F] bg-[#483A30]';

    return (
        <span
            className={`inline-flex rounded-[4px] px-2 py-1 text-[10px] font-semibold! ${style}`}
        >
            {titleCase(value)}
        </span>
    );
}

/* =========================================================
   NEW BORDERLESS ORGANIZATION HEADER
========================================================= */

function OrganizationHeader({ organization, navigate }) {
    const verified = norm(organization.verification_status) === 'verified';

    return (
        <header className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                <div>
                    <p className={EYEBROW}>Organization headquarters</p>
                    <p className="mt-1 text-[12px] text-[#A6B6C4]">
                        Your community operations, in one place.
                    </p>
                </div>

                <span className="inline-flex items-center gap-2 text-[11px] text-[#A6B7C5]">
                    <CalendarDays size={14} />
                    {new Date().toLocaleDateString('en-BD', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
            </div>

            {/* Full-width cover without card border or radius */}
            <div className="relative h-[150px] overflow-hidden sm:h-[195px] lg:h-[225px] xl:h-[245px]">
                <Photo
                    src={orgCover(organization)}
                    alt={`${organization.name || 'Organization'} cover`}
                    icon={Building2}
                    className="absolute inset-0 h-full w-full"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#101923]/15 to-transparent" />

                <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
                    <span className="inline-flex items-center gap-2 bg-[#111B25]/90 px-3 py-2 text-[10px] text-[#B6DCC6] backdrop-blur-sm">
                        {verified ? (
                            <ShieldCheck size={13} />
                        ) : (
                            <CircleAlert size={13} />
                        )}
                        {verified
                            ? 'Verified organization'
                            : 'Verification pending'}
                    </span>
                </div>
            </div>

            {/* Editorial identity strip */}
            <div className="flex flex-col gap-5 border-b border-[#303A47] py-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold! uppercase tracking-[0.17em] text-[#E5B58D]">
                        Community organization
                    </p>

                    <h1 className="mt-2 break-words font-['Fraunces']! text-[29px]! font-semibold! leading-tight tracking-[-0.04em] text-[#F0F3F6]! sm:text-[36px]!">
                        {organization.name || 'Your organization'}
                    </h1>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#9FB1C1]">
                        <span className="inline-flex items-center gap-1.5">
                            <Building2 size={13} />
                            {organization.type || 'Organization'}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} />
                            {organization.location ||
                                organization.address ||
                                'Location not specified'}
                        </span>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.profile)}
                        className="inline-flex min-h-10 items-center gap-2 border border-[#40505F] px-4 text-[12px] font-semibold! text-[#E2EAF0] transition hover:bg-[#263440]"
                    >
                        Organization profile
                        <ArrowUpRight size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.requests)}
                        className="inline-flex min-h-10 items-center gap-2 bg-[#E6B68D] px-4 text-[12px] font-semibold! text-[#19232C] transition hover:bg-[#F0C7A1]"
                    >
                        Open workspace
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </header>
    );
}

/* =========================================================
   IMPACT METRICS — LESS CARD HEAVY
========================================================= */

function OperationsOverview({ overview, volunteers, navigate }) {
    const items = [
        {
            label: 'Assigned requests',
            value: overview.assigned_requests,
            icon: ClipboardList,
            color: '#A8CBE5',
            route: ROUTES.requests,
        },
        {
            label: 'In progress',
            value: overview.active_requests,
            icon: Activity,
            color: '#E6BA91',
            route: ROUTES.requests,
        },
        {
            label: 'Resolved',
            value: overview.completed_requests,
            icon: CheckCircle2,
            color: '#9ED3B6',
            route: ROUTES.requests,
        },
        {
            label: 'Campaigns',
            value: overview.active_campaigns,
            icon: Megaphone,
            color: '#BDAADD',
            route: ROUTES.campaigns,
        },
    ];

    return (
        <section className="min-w-0">
            <SectionHeading
                eyebrow="Organization performance"
                title="Your impact at a glance"
                description="Current responsibilities and community activities."
                action={
                    <TextLink onClick={() => navigate(ROUTES.volunteers)}>
                        {fmt(volunteers.total)} volunteers
                    </TextLink>
                }
            />

            <div className="mt-5 grid grid-cols-2 border-y border-[#34404C] md:grid-cols-4">
                {items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => navigate(item.route)}
                            className={`group flex min-w-0 flex-col items-start px-4 py-5 text-left transition hover:bg-[#1D2934] sm:px-5 ${
                                index % 2 === 0
                                    ? 'border-r border-[#34404C]'
                                    : ''
                            } ${
                                index < 2
                                    ? 'border-b border-[#34404C] md:border-b-0'
                                    : ''
                            } ${
                                index === 1
                                    ? 'md:border-r md:border-[#34404C]'
                                    : ''
                            }`}
                        >
                            <div className="flex w-full items-center justify-between">
                                <Icon size={18} style={{ color: item.color }} />
                                <ArrowUpRight
                                    size={14}
                                    className="text-[#72889B] group-hover:text-white"
                                />
                            </div>

                            <p className="mt-5 text-[34px] font-semibold! leading-none tracking-[-0.05em] text-[#EEF1F5]!">
                                {fmt(item.value)}
                            </p>

                            <p className="mt-2 text-[12px] font-semibold! text-[#DCE5ED]!">
                                {item.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

/* =========================================================
   RESPONSE OPERATIONS
========================================================= */

function RequestQueue({ requests, overview, navigate }) {
    const [filter, setFilter] = useState('all');

    const sorted = useMemo(
        () =>
            [...requests].sort(
                (a, b) =>
                    (urgencyRank[norm(a.urgency)] ?? 6) -
                    (urgencyRank[norm(b.urgency)] ?? 6),
            ),
        [requests],
    );

    const urgent = requests.filter((r) => isUrgent(r.urgency));
    const active = requests.filter((r) => isActive(r.status));

    const filtered = sorted.filter((r) => {
        if (filter === 'urgent') return isUrgent(r.urgency);
        if (filter === 'active') return isActive(r.status);
        return true;
    });

    const assigned = Number(overview.assigned_requests || 0);
    const resolved = Number(overview.completed_requests || 0);
    const progress = assigned
        ? Math.min(100, Math.round((resolved / assigned) * 100))
        : 0;

    return (
        <section className="min-w-0">
            <SectionHeading
                number="01"
                eyebrow="Response operations"
                title="The response desk"
                description="Your working queue, immediate priorities, and delivery progress."
                action={
                    <TextLink onClick={() => navigate(ROUTES.requests)}>
                        Full request management
                    </TextLink>
                }
            />

            <div className="mt-5 grid min-w-0 overflow-hidden border border-[#34414D] bg-[#1C2833] lg:h-[460px] lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
                <div className="flex min-h-0 min-w-0 flex-col">
                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#34414D] px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-[12px] font-semibold! text-[#E8EEF4]">
                            <span className="size-2 rounded-full bg-[#E6B88E]" />
                            Assigned response queue
                        </span>

                        <span className="text-[10px] text-[#8EA1B1]">
                            Prioritized by urgency
                        </span>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-1 border-b border-[#34414D] px-3">
                        {[
                            ['all', 'All requests', requests.length],
                            ['urgent', 'Urgent', urgent.length],
                            ['active', 'Active', active.length],
                        ].map(([id, label, count]) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setFilter(id)}
                                className={`min-h-11 border-b-2 px-3 text-[11px] font-semibold! ${
                                    filter === id
                                        ? 'border-[#E6B88E] text-[#EEF1F5]'
                                        : 'border-transparent text-[#93A6B6]'
                                }`}
                            >
                                {label}
                                <span className="ml-2 rounded-sm bg-[#2B3B49] px-1.5 py-0.5 text-[9px]">
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="org-hidden-scroll min-h-0 flex-1 overflow-y-auto">
                        {filtered.length ? (
                            filtered.slice(0, 15).map((request, index) => {
                                const id =
                                    request.help_request_id || request.id;

                                return (
                                    <button
                                        key={id ?? index}
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                id
                                                    ? ROUTES.requestDetails(id)
                                                    : ROUTES.requests,
                                            )
                                        }
                                        className="group grid w-full min-w-0 grid-cols-[25px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#30404D] px-4 py-4 text-left transition hover:bg-[#263745] sm:grid-cols-[30px_minmax(0,1fr)_100px_16px] sm:px-5"
                                    >
                                        <span className="text-[10px] text-[#7690A3]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <div className="min-w-0">
                                            <p className="break-words text-[12px] font-semibold! text-[#E9EFF4]!">
                                                {request.title ||
                                                    'Untitled request'}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#93A6B6]">
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin size={11} />
                                                    {request.district ||
                                                        'Unknown'}
                                                </span>

                                                <span className="inline-flex items-center gap-1">
                                                    <Clock3 size={11} />
                                                    {formatDate(
                                                        request.updated_at ||
                                                            request.created_at,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span
                                                className={`text-[10px] font-semibold! ${
                                                    isUrgent(request.urgency)
                                                        ? 'text-[#EFA3AF]'
                                                        : 'text-[#E7BA93]'
                                                }`}
                                            >
                                                {titleCase(request.urgency)}
                                            </span>

                                            <span className="text-[10px] text-[#9BACBA]">
                                                {titleCase(request.status)}
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={14}
                                            className="hidden text-[#8095A6] sm:block"
                                        />
                                    </button>
                                );
                            })
                        ) : (
                            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                                <CheckCircle2
                                    size={25}
                                    className="text-[#9CD0B4]"
                                />
                                <p className="mt-3 text-[12px] text-[#A8BAC8]">
                                    No requests in this category.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.requests)}
                        className="flex min-h-[49px] shrink-0 items-center justify-between bg-[#283B49] px-5 text-[11px] font-semibold! text-[#E8BD97] transition hover:bg-[#324A5B]"
                    >
                        Continue managing requests
                        <ArrowRight size={15} />
                    </button>
                </div>

                <aside className="flex min-h-0 flex-col border-t border-[#34414D] bg-[#22323E] lg:border-l lg:border-t-0">
                    <div className="org-hidden-scroll min-h-0 flex-1 overflow-y-auto">
                        <div className="border-b border-[#3A4C59] p-6">
                            <p className={EYEBROW}>Delivery status</p>

                            <div className="mt-5 flex items-end justify-between">
                                <div>
                                    <p className="text-[45px] font-semibold! leading-none tracking-[-0.06em] text-[#F0F4F7]!">
                                        {progress}%
                                    </p>
                                    <p className="mt-2 text-[11px] text-[#B0C0CD]">
                                        Requests resolved
                                    </p>
                                </div>

                                <CheckCircle2
                                    size={22}
                                    className="text-[#98D2B4]"
                                />
                            </div>

                            <div className="mt-5 h-[6px] bg-[#425564]">
                                <div
                                    className="h-full bg-[#9CD2B6]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="mt-3 text-[10px] text-[#A9B9C7]">
                                {fmt(resolved)} of {fmt(assigned)} assigned
                                requests completed
                            </p>
                        </div>

                        <div className="grid grid-cols-2 border-b border-[#3A4C59]">
                            <div className="border-r border-[#3A4C59] p-5">
                                <p className="text-[26px] font-semibold! text-[#F0F4F7]!">
                                    {fmt(urgent.length)}
                                </p>
                                <p className="mt-1 text-[10px] text-[#E4A7AE]">
                                    Urgent priorities
                                </p>
                            </div>

                            <div className="p-5">
                                <p className="text-[26px] font-semibold! text-[#F0F4F7]!">
                                    {fmt(overview.active_requests)}
                                </p>
                                <p className="mt-1 text-[10px] text-[#A9CBE1]">
                                    In progress
                                </p>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center bg-[#354D5D] text-[#E6B98F]">
                                    <HeartHandshake size={19} />
                                </span>

                                <div>
                                    <p className="text-[12px] font-semibold! text-[#EDF1F5]!">
                                        Community responsibility
                                    </p>

                                    <p className="mt-2 text-[11px] leading-[1.7] text-[#ABBDCA]">
                                        Review outstanding needs and coordinate
                                        support through your response workspace.
                                    </p>
                                </div>
                            </div>

                            <TextLink
                                accent
                                onClick={() => navigate(ROUTES.requests)}
                            >
                                Open response workspace
                            </TextLink>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}

/* =========================================================
   CAMPAIGN PORTFOLIO — NEW EDITORIAL LAYOUT
========================================================= */

function CampaignPortfolio({ campaigns, volunteers, navigate }) {
    const featured = campaigns[0];
    const remaining = campaigns.slice(1, 5);

    const openCampaign = (campaign) =>
        navigate(
            campaign?.id
                ? ROUTES.campaignDetails(campaign.id)
                : ROUTES.campaigns,
        );

    return (
        <section className="min-w-0">
            <SectionHeading
                number="02"
                eyebrow="People and programs"
                title="Coordination & initiatives"
                description="Your volunteer capacity and the community programs you support."
            />

            {/* Original section layout — unchanged */}
            <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)]">
                {/* Volunteer network */}
                <div className="relative flex min-h-[300px] min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-[#385248] bg-[#20352F] p-6">
                    <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full border border-[#365348]" />
                    <div className="pointer-events-none absolute -right-7 -top-7 size-28 rounded-full border border-[#365348]" />

                    <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-semibold! uppercase tracking-[0.15em] text-[#A5CAB4]">
                                People & coordination
                            </p>
                            <UsersRound size={20} className="text-[#9ED3B6]" />
                        </div>

                        <h3 className="mt-7 font-['Fraunces']! text-[23px]! font-semibold! text-[#EEF4F0]!">
                            Your volunteer network
                        </h3>

                        <p className="mt-3 max-w-[290px] text-[12px] leading-[1.8] text-[#B3CABE]">
                            The people helping your organization turn community
                            needs into meaningful action.
                        </p>

                        <div className="mt-8 flex items-end gap-2">
                            <span className="text-[57px] font-semibold! leading-none tracking-[-0.06em] text-[#F0F5F1]!">
                                {fmt(volunteers.total)}
                            </span>
                            <span className="mb-2 text-[11px] text-[#B7D1C2]">
                                Volunteers
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.volunteers)}
                        className="relative mt-7 flex w-full items-center justify-between border-t border-[#456458] pt-4 text-[11px] font-semibold! text-[#D4E8DA] transition hover:text-white"
                    >
                        Manage volunteer network
                        <ArrowUpRight size={15} />
                    </button>
                </div>

                {/* Featured campaign */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#34414D] bg-[#1D2B36]">
                    <div className="flex items-center justify-between gap-3 border-b border-[#34414D] px-5 py-5">
                        <div>
                            <p className={EYEBROW}>Community initiatives</p>
                            <p className="mt-2 text-[12px] font-semibold! text-[#E6EDF3]!">
                                Campaign portfolio
                            </p>
                        </div>

                        <TextLink onClick={() => navigate(ROUTES.campaigns)}>
                            All campaigns
                        </TextLink>
                    </div>

                    {featured ? (
                        <button
                            type="button"
                            onClick={() => openCampaign(featured)}
                            className="group grid min-h-[230px] flex-1 min-w-0 text-left sm:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]"
                        >
                            <Photo
                                src={campaignCover(featured)}
                                alt={featured.title || 'Featured campaign'}
                                icon={Megaphone}
                                className="h-[190px] sm:h-full"
                            />

                            <div className="flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-6">
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className={EYEBROW}>
                                            Current spotlight
                                        </span>
                                        <Status
                                            value={featured.status || 'Active'}
                                        />
                                    </div>

                                    <h3 className="mt-6 break-words font-['Fraunces']! text-[22px]! font-semibold! leading-snug text-[#F0F3F6]! sm:text-[25px]!">
                                        {featured.title || 'Untitled campaign'}
                                    </h3>

                                    <p className="mt-4 inline-flex flex-wrap items-center gap-2 text-[10px] text-[#A5B7C6]">
                                        <CalendarDays size={12} />
                                        {formatDate(featured.start_date)}
                                        {featured.end_date &&
                                            ` — ${formatDate(featured.end_date)}`}
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-2 text-[11px] font-semibold! text-[#E6B78E]">
                                    View initiative
                                    <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </button>
                    ) : (
                        <div className="flex min-h-[230px] flex-1 flex-col items-center justify-center text-center">
                            <Megaphone size={26} className="text-[#829AAC]" />
                            <p className="mt-3 text-[12px] text-[#A4B5C3]">
                                No campaigns available.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Redesigned ONLY: Other initiatives subsection */}
            {remaining.length > 0 && (
                <div className="mt-5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-l-[3px] border-[#B9A8D8] pl-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-[12px] font-semibold! text-[#EAF0F5]!">
                                Other initiatives
                            </h3>
                            <span className="text-[10px] text-[#90A6B8]">
                                {remaining.length} campaigns
                            </span>
                        </div>

                        <TextLink onClick={() => navigate(ROUTES.campaigns)}>
                            Explore all
                        </TextLink>
                    </div>

                    <div className="mt-3 grid min-w-0 gap-x-5 md:grid-cols-2">
                        {remaining.map((campaign, index) => (
                            <button
                                key={campaign.id ?? index}
                                type="button"
                                onClick={() => openCampaign(campaign)}
                                className="group flex min-w-0 items-center gap-3 border-b border-[#34414D] py-3 text-left transition hover:bg-[#1D2934]"
                            >
                                <Photo
                                    src={campaignCover(campaign)}
                                    alt={campaign.title || 'Campaign'}
                                    icon={Megaphone}
                                    className="h-[66px] w-[70px] shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 text-[12px] font-semibold! leading-relaxed text-[#E6EDF3]!">
                                        {campaign.title || 'Untitled campaign'}
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span className="text-[10px] text-[#91A5B5]">
                                            {formatDate(campaign.start_date)}
                                        </span>

                                        <span
                                            className={`text-[10px] font-medium! ${
                                                ['active', 'verified'].includes(
                                                    norm(campaign.status),
                                                )
                                                    ? 'text-[#9CD4B5]'
                                                    : 'text-[#E7B78F]'
                                            }`}
                                        >
                                            {titleCase(campaign.status)}
                                        </span>
                                    </div>
                                </div>

                                <ArrowUpRight
                                    size={14}
                                    className="shrink-0 text-[#8498A9] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

/* =========================================================
   NEW SYSTEM ACTIVITY CHART
   Derived from available request/campaign data
========================================================= */

function ActivityChart({ requests, campaigns }) {
    const [mode, setMode] = useState('requests');

    const data = useMemo(() => {
        const source = mode === 'requests' ? requests : campaigns;

        const now = new Date();
        const months = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

            months.push({
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: date.toLocaleDateString('en-BD', {
                    month: 'short',
                }),
                value: 0,
            });
        }

        source.forEach((item) => {
            const rawDate = item.created_at || item.start_date || item.date;

            if (!rawDate) return;

            const date = new Date(rawDate);
            if (Number.isNaN(date.getTime())) return;

            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const month = months.find((entry) => entry.key === key);

            if (month) month.value += 1;
        });

        return months;
    }, [requests, campaigns, mode]);

    const maximum = Math.max(1, ...data.map((item) => item.value));
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <section className="min-w-0">
            <SectionHeading
                number="03"
                eyebrow="Organization analytics"
                title="Activity over time"
                description="A six-month view of recorded community operations."
            />

            <div className="mt-5 min-w-0 border border-[#34414D] bg-[#1C2833] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className={EYEBROW}>Operational activity</p>

                        <div className="mt-3 flex items-end gap-3">
                            <p className="text-[34px] font-semibold! leading-none text-[#F0F3F6]!">
                                {fmt(total)}
                            </p>

                            <span className="mb-1 text-[11px] text-[#9DAFBE]">
                                {mode === 'requests'
                                    ? 'Recorded requests'
                                    : 'Campaigns started'}
                            </span>
                        </div>
                    </div>

                    <div className="flex border border-[#3C4C5B] p-1">
                        {[
                            ['requests', 'Requests'],
                            ['campaigns', 'Campaigns'],
                        ].map(([id, label]) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setMode(id)}
                                className={`px-3 py-2 text-[11px] font-semibold! transition ${
                                    mode === id
                                        ? 'bg-[#344A5B] text-[#F0F4F7]'
                                        : 'text-[#91A5B5] hover:text-white'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <div className="relative h-[220px] border-b border-[#465463]">
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3, 4].map((line) => (
                                <div
                                    key={line}
                                    className="border-t border-dashed border-[#354452]"
                                />
                            ))}
                        </div>

                        <div className="relative grid h-full grid-cols-6 items-end gap-3 px-2 sm:gap-6 sm:px-5">
                            {data.map((item) => (
                                <div
                                    key={item.key}
                                    className="group flex h-full min-w-0 flex-col items-center justify-end"
                                >
                                    <span className="mb-2 text-[10px] font-semibold! text-[#B5C8D7]">
                                        {item.value}
                                    </span>

                                    <div
                                        className={`w-full max-w-[70px] transition-colors ${
                                            mode === 'requests'
                                                ? 'bg-[#85AFCB] group-hover:bg-[#AACCE1]'
                                                : 'bg-[#B7A4D6] group-hover:bg-[#D0BDE9]'
                                        }`}
                                        style={{
                                            height:
                                                item.value > 0
                                                    ? `${Math.max(8, (item.value / maximum) * 85)}%`
                                                    : '3px',
                                            opacity: item.value > 0 ? 1 : 0.35,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-3 px-2 pt-3 sm:gap-6 sm:px-5">
                        {data.map((item) => (
                            <span
                                key={item.key}
                                className="text-center text-[10px] text-[#9AABBA]"
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="mt-6 text-[10px] leading-relaxed text-[#8499AA]">
                    Activity is calculated from the dated records available in
                    your dashboard response. Records without usable dates are
                    excluded from the monthly chart.
                </p>
            </div>
        </section>
    );
}

/* =========================================================
   DELIVERY AND GEOGRAPHIC COVERAGE
========================================================= */

function DeliveryReport({ overview, requests }) {
    const assigned = Number(overview.assigned_requests || 0);
    const resolved = Number(overview.completed_requests || 0);
    const inProgress = Number(overview.active_requests || 0);
    const other = Math.max(0, assigned - resolved - inProgress);

    const progress = assigned
        ? Math.min(100, Math.round((resolved / assigned) * 100))
        : 0;

    const districts = useMemo(() => {
        const counts = {};

        requests.forEach((request) => {
            const name = request.district || 'Not specified';
            counts[name] = (counts[name] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
    }, [requests]);

    const maximum = Math.max(1, ...districts.map(([, value]) => value));

    const metrics = [
        {
            label: 'In progress',
            value: inProgress,
            color: '#93BBD6',
        },
        {
            label: 'Resolved',
            value: resolved,
            color: '#98D0B1',
        },
        {
            label: 'Other',
            value: other,
            color: '#A7B2C0',
        },
    ];

    return (
        <section className="flex h-full min-w-0 flex-col">
            <SectionHeading
                number="04"
                eyebrow="Impact and delivery"
                title="Response performance"
                description="How your organization is progressing across assigned community needs."
            />

            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#34414D] bg-[#1D2934]">
                {/* Performance overview */}
                <div className="border-b border-[#34414D] p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <p className={EYEBROW}>Resolution performance</p>

                        <TrendingUp size={18} className="text-[#9CD0B5]" />
                    </div>

                    <div className="mt-6 flex flex-wrap items-end gap-3">
                        <p className="text-[52px] font-semibold! leading-none tracking-[-0.065em] text-[#EEF1F5]! sm:text-[60px]!">
                            {progress}%
                        </p>

                        <div className="pb-1">
                            <p className="text-[12px] font-semibold! text-[#D9E4EB]!">
                                Resolution rate
                            </p>

                            <p className="mt-1 text-[11px] text-[#91A6B7]">
                                {fmt(resolved)} of {fmt(assigned)} requests
                                completed
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex h-[8px] overflow-hidden rounded-full bg-[#40515F]">
                        {metrics.map((item) => (
                            <div
                                key={item.label}
                                className="h-full"
                                style={{
                                    width: assigned
                                        ? `${(item.value / assigned) * 100}%`
                                        : '0%',
                                    backgroundColor: item.color,
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-7 grid grid-cols-3 divide-x divide-[#344653]">
                        {metrics.map((item, index) => (
                            <div
                                key={item.label}
                                className={
                                    index === 0 ? 'pr-3' : 'px-3 sm:px-5'
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-1.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />

                                    <p className="text-[10px] text-[#A1B3C1]">
                                        {item.label}
                                    </p>
                                </div>

                                <p className="mt-3 text-[24px] font-semibold! leading-none text-[#EEF1F5]!">
                                    {fmt(item.value)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geographic reach */}
                <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className={EYEBROW}>Geographic reach</p>

                            <h3 className="mt-2 text-[15px] font-semibold! text-[#E8EEF4]!">
                                Where your support is needed
                            </h3>

                            <p className="mt-1 text-[11px] text-[#93A7B7]">
                                Assigned requests by district
                            </p>
                        </div>

                        <MapPin size={19} className="shrink-0 text-[#B9A8D8]" />
                    </div>

                    {districts.length > 0 ? (
                        <div className="mt-7 flex flex-1 flex-col justify-evenly gap-5">
                            {districts.map(([name, value], index) => (
                                <div
                                    key={name}
                                    className="grid grid-cols-[24px_minmax(0,1fr)] items-center gap-3"
                                >
                                    <span className="text-[10px] text-[#708A9F]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <div className="min-w-0">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="truncate text-[11px] font-medium! text-[#DCE6ED]">
                                                {name}
                                            </span>

                                            <span className="text-[11px] font-semibold! text-[#E8EEF4]">
                                                {fmt(value)}
                                            </span>
                                        </div>

                                        <div className="h-[6px] overflow-hidden rounded-full bg-[#374957]">
                                            <div
                                                className="h-full rounded-full bg-[#B8A6D7]"
                                                style={{
                                                    width: `${(value / maximum) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-1 items-center justify-center py-10">
                            <p className="text-[12px] text-[#94A7B7]">
                                District information is not available yet.
                            </p>
                        </div>
                    )}

                    <div className="mt-7 flex items-center justify-between border-t border-[#344653] pt-4">
                        <span className="text-[11px] text-[#91A6B7]">
                            Districts reached
                        </span>

                        <span className="text-[15px] font-semibold! text-[#E8EEF4]">
                            {districts.length}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   REDESIGNED ORGANIZATION SIDEBAR
========================================================= */

function OrganizationSidebar({ organization, navigate }) {
    const verified = norm(organization.verification_status) === 'verified';

    const links = [
        {
            label: 'Help requests',
            description: 'Community response management',
            icon: HeartHandshake,
            route: ROUTES.requests,
            color: '#9BBFDD',
        },
        {
            label: 'Campaigns',
            description: 'Programs and initiatives',
            icon: Megaphone,
            route: ROUTES.campaigns,
            color: '#E6B88E',
        },
        {
            label: 'Volunteers',
            description: 'People and coordination',
            icon: UsersRound,
            route: ROUTES.volunteers,
            color: '#9ACDB2',
        },
        {
            label: 'Organization profile',
            description: 'Identity and verification',
            icon: Building2,
            route: ROUTES.profile,
            color: '#B9A8DA',
        },
    ];

    return (
        <aside className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#34414D] bg-[#1D2934]">
            {/* Organization identity */}
            <div className="border-b border-[#34414D]">
                <div className="relative h-[130px] overflow-hidden sm:h-[155px] xl:h-[145px]">
                    <Photo
                        src={orgCover(organization)}
                        alt={`${organization.name || 'Organization'} cover`}
                        icon={Building2}
                        className="absolute inset-0 h-full w-full"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D2934] via-[#1D2934]/10 to-transparent" />
                </div>

                <div className="relative px-5 pb-6">
                    <div className="-mt-7 flex size-14 items-center justify-center rounded-lg border-[4px] border-[#1D2934] bg-[#344A59] text-[#DCE9F1]">
                        <Building2 size={23} />
                    </div>

                    <p className={`mt-4 ${EYEBROW}`}>Organization identity</p>

                    <h3 className="mt-2 break-words font-['Fraunces']! text-[22px]! font-semibold! leading-snug text-[#EEF1F5]!">
                        {organization.name || 'Your organization'}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <ShieldCheck
                            size={14}
                            className={
                                verified ? 'text-[#9CD3B5]' : 'text-[#E4B78F]'
                            }
                        />

                        <span className="text-[11px] text-[#A9BBC9]">
                            {verified
                                ? 'Verified organization'
                                : 'Verification pending'}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.profile)}
                        className="mt-5 flex w-full items-center justify-between border-t border-[#3A4A58] pt-4 text-[11px] font-semibold! text-[#DCE7EE] transition hover:text-white"
                    >
                        Manage organization profile
                        <ArrowUpRight size={15} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex min-h-0 flex-1 flex-col px-5 py-6">
                <div>
                    <p className={EYEBROW}>Organization workspace</p>

                    <h3 className="mt-2 font-['Fraunces']! text-[23px]! font-semibold! text-[#EEF1F5]!">
                        Quick access
                    </h3>

                    <p className="mt-1 text-[11px] text-[#94A8B8]">
                        Navigate your daily operations.
                    </p>
                </div>

                <div className="mt-5 flex flex-1 flex-col justify-evenly border-t border-[#344653]">
                    {links.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => navigate(item.route)}
                                className="group flex min-w-0 items-center gap-3 border-b border-[#344653] py-4 text-left transition hover:bg-[#243441]"
                            >
                                <span
                                    className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#2B3E4C]"
                                    style={{ color: item.color }}
                                >
                                    <Icon size={18} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[12px] font-semibold! text-[#E8EEF4]!">
                                        {item.label}
                                    </p>

                                    <p className="mt-1 text-[10px] leading-relaxed text-[#94A8B8]">
                                        {item.description}
                                    </p>
                                </div>

                                <ChevronRight
                                    size={15}
                                    className="shrink-0 text-[#8398A9] transition group-hover:translate-x-0.5 group-hover:text-white"
                                />
                            </button>
                        );
                    })}
                </div>

                {/* Minimal verification footer */}
                <div className="mt-6 flex items-center gap-3 rounded-md bg-[#263A39] px-4 py-3">
                    <ShieldCheck
                        size={18}
                        className={
                            verified ? 'text-[#9CD3B5]' : 'text-[#E4B78F]'
                        }
                    />

                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold! text-[#DCEBE2]!">
                            {verified
                                ? 'Verified & trusted'
                                : 'Verification pending'}
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#A5BFB3]">
                            {verified
                                ? 'Organization identity confirmed'
                                : 'Review your verification status'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

/* =========================================================
   MAIN
========================================================= */

export default function OrgDashboard() {
    const navigate = useNavigate();

    const [reload, setReload] = useState(0);

    const [result, setResult] = useState({
        data: null,
        error: '',
        version: -1,
    });

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            const authToken = token();

            if (!authToken) {
                setResult({
                    data: null,
                    error: 'Authentication token not found.',
                    version: reload,
                });
                return;
            }

            try {
                const response = await axios.get(
                    `${API_URL}/organization/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            Accept: 'application/json',
                        },
                        signal: controller.signal,
                    },
                );

                if (controller.signal.aborted) return;

                if (!response.data?.data) {
                    throw new Error('Dashboard data is unavailable.');
                }

                setResult({
                    data: response.data.data,
                    error: '',
                    version: reload,
                });
            } catch (error) {
                if (controller.signal.aborted || axios.isCancel(error)) return;

                setResult({
                    data: null,
                    error:
                        error.response?.data?.message ||
                        error.message ||
                        'Unable to load organization dashboard.',
                    version: reload,
                });
            }
        };

        void load();

        return () => controller.abort();
    }, [reload]);

    if (result.version !== reload) {
        return (
            <DashboardLoading
                type="organization"
                title="Loading dashboard..."
                description="Retrieving your organization's information."
            />
        );
    }

    if (result.error || !result.data) {
        return (
            <div className="space-y-4">
                <LoadingError
                    title="Unable to load dashboard"
                    message={result.error || 'Dashboard data is unavailable.'}
                />

                <button
                    type="button"
                    onClick={() => setReload((value) => value + 1)}
                    className="inline-flex items-center gap-2 bg-[#253543] px-4 py-2.5 text-[12px] text-[#EEF1F5]"
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
        <main className="org-dashboard-v3 w-full min-w-0 pb-8 font-sans! text-[#EEF1F5]">
            <style>{`
        .org-dashboard-v3 {
          color-scheme: dark;
        }

        .org-dashboard-v3 button {
          cursor: pointer;
        }

        .org-dashboard-v3 button:focus-visible {
          outline: 2px solid #9BBFDD;
          outline-offset: 3px;
        }

        .org-dashboard-v3 section,
        .org-dashboard-v3 aside,
        .org-dashboard-v3 div {
          min-width: 0;
        }

        .org-hidden-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .org-hidden-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .org-dashboard-v3 * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-10 sm:gap-12">
                <OrganizationHeader
                    organization={organization}
                    navigate={navigate}
                />

                <OperationsOverview
                    overview={overview}
                    volunteers={volunteers}
                    navigate={navigate}
                />

                <RequestQueue
                    requests={requests}
                    overview={overview}
                    navigate={navigate}
                />

                <CampaignPortfolio
                    campaigns={campaigns}
                    volunteers={volunteers}
                    navigate={navigate}
                />

                <ActivityChart requests={requests} campaigns={campaigns} />

                <div className="grid min-w-0 items-start gap-7 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
                    <DeliveryReport overview={overview} requests={requests} />

                    <OrganizationSidebar
                        organization={organization}
                        navigate={navigate}
                    />
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#303A47] pt-5 text-[10px] text-[#8193A4]">
                    <span>Stand For People · Organization workspace</span>

                    <span className="inline-flex items-center gap-2">
                        <ShieldCheck size={13} />
                        Humanitarian coordination
                    </span>
                </footer>
            </div>
        </main>
    );
}
