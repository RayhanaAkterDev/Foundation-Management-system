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
    HeartHandshake,
    ImageOff,
    MapPin,
    Megaphone,
    RefreshCw,
    ShieldCheck,
    UsersRound,
    TrendingUp,
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
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? 'Date unavailable'
        : date.toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });
};
const urgencyRank = {
    critical: 0,
    urgent: 1,
    high: 2,
    medium: 3,
    normal: 4,
    low: 5,
};
const imageValue = (...values) => {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) return value;
        if (value && typeof value === 'object') {
            const url = value.url || value.path || value.src;
            if (typeof url === 'string' && url.trim()) return url;
        }
    }
    return '';
};
const getOrgCover = (org) =>
    imageValue(
        org.cover_photo,
        org.cover_image,
        org.cover_photo_url,
        org.cover_image_url,
        org.cover,
        org.banner,
        org.banner_image,
        org.banner_url,
        org.background_image,
        org.profile_cover,
        org.photo,
        org.image,
    );
const getCampaignCover = (campaign) =>
    imageValue(
        campaign.cover_photo,
        campaign.cover_image,
        campaign.cover_photo_url,
        campaign.cover_image_url,
        campaign.banner,
        campaign.image,
        campaign.photo,
    );
const LABEL =
    'text-[10px] font-semibold! uppercase tracking-[0.17em] text-[#92A4B6]';

function LinkAction({ children, onClick, light = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group inline-flex min-h-9 items-center gap-1.5 text-[12px] font-medium! transition ${light ? 'text-[#F0C28D] hover:text-white' : 'text-[#A9BED2] hover:text-[#EEF1F5]'}`}
        >
            {children}
            <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
        </button>
    );
}
function Heading({ eyebrow, title, subtitle, action }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
            <div className="min-w-0">
                <p className={LABEL}>{eyebrow}</p>
                <h2 className="mt-2 font-sans! text-[22px]! font-semibold! tracking-[-0.035em] text-[#EEF1F5]! sm:text-[25px]!">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1.5 text-[12px] leading-5 text-[#94A2B2]">
                        {subtitle}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}
function Tag({ value }) {
    const key = norm(value);
    const color = ['critical', 'urgent'].includes(key)
        ? 'bg-[#492D35] text-[#F1ABB5] border-[#70434B]'
        : ['high', 'unverified'].includes(key)
          ? 'bg-[#433126] text-[#EBC099] border-[#66503E]'
          : ['verified', 'resolved', 'completed'].includes(key)
            ? 'bg-[#253C35] text-[#9ED5B8] border-[#385B4D]'
            : ['active', 'in_progress'].includes(key)
              ? 'bg-[#283B4D] text-[#A6CBE8] border-[#3B5269]'
              : 'bg-[#33322A] text-[#E4D09B] border-[#55503B]';
    return (
        <span
            className={`inline-flex w-fit items-center border px-2 py-1 text-[10px] font-medium! ${color}`}
        >
            {titleCase(value)}
        </span>
    );
}
function Photo({ src, alt, className = '', icon: Icon = ImageOff }) {
    const [broken, setBroken] = useState(false);
    return (
        <div className={`relative overflow-hidden bg-[#273745] ${className}`}>
            {src && !broken ? (
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    onError={() => setBroken(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#293F50,#182530_60%,#31443D)]">
                    <Icon
                        size={34}
                        strokeWidth={1.3}
                        className="text-[#8CA8BC]"
                    />
                </div>
            )}
        </div>
    );
}
function Hero({ organization, overview, navigate }) {
    const cover = getOrgCover(organization);
    const verified = norm(organization.verification_status) === 'verified';
    return (
        <section className="overflow-hidden border border-[#2B3542] bg-[#17212B]">
            <div className="relative min-h-56 sm:min-h-70 lg:min-h-78">
                <Photo
                    src={cover}
                    alt={`${organization.name || 'Organization'} cover`}
                    icon={Building2}
                    className="absolute inset-0 h-full w-full [&>img]:object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(12,19,27,.96)_0%,rgba(12,19,27,.79)_48%,rgba(12,19,27,.25)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(12,19,27,.6),transparent_65%)]" />
                <div className="relative flex min-h-56 flex-col justify-between gap-8 px-5 py-6 sm:min-h-70 sm:px-9 sm:py-8 lg:min-h-78 lg:px-11">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-[10px] font-semibold! uppercase tracking-[0.17em] text-[#C1D0DD]">
                            <span className="h-px w-6 bg-[#E8B083]" />{' '}
                            Organization workspace
                        </span>
                        <span
                            className={`inline-flex items-center gap-1.5 border border-white/15 bg-[#15222D]/80 px-3 py-1.5 text-[11px] ${verified ? 'text-[#A8D9BF]' : 'text-[#E8BF95]'}`}
                        >
                            {verified ? (
                                <ShieldCheck size={14} />
                            ) : (
                                <CircleAlert size={14} />
                            )}
                            {titleCase(
                                organization.verification_status || 'Pending',
                            )}
                        </span>
                    </div>
                    <div className="max-w-170">
                        <p className="text-[11px] font-medium! tracking-[0.06em] text-[#D5B38B]">
                            Welcome to your organization dashboard
                        </p>
                        <h1 className="mt-3 break-words font-['Fraunces']! text-[30px]! font-semibold! leading-[1.15]! tracking-[-0.035em] text-white! sm:text-[42px]! lg:text-[47px]!">
                            {organization.name || 'Your organization'}
                        </h1>
                        <p className="mt-3 max-w-130 text-[12px] leading-6 text-[#C0CCD7] sm:text-[13px]">
                            Coordinate your people, respond to community needs,
                            and move meaningful initiatives forward.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#C4CFDA]">
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
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#33404D] bg-[#1B2935] px-5 py-4 sm:px-9 lg:px-11">
                <div className="flex items-center gap-3 text-[11px] text-[#B5C3D0]">
                    <span className="flex size-8 items-center justify-center bg-[#304251] text-[#9CC4DC]">
                        <HeartHandshake size={16} />
                    </span>
                    <span>
                        <strong className="text-[#EEF1F5]!">
                            {fmt(overview.assigned_requests)}
                        </strong>{' '}
                        requests assigned to your team
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.profile)}
                        className="inline-flex min-h-10 items-center gap-2 border border-[#465565] px-3.5 text-[11px] font-semibold! text-[#D9E3EC] hover:bg-[#293949]"
                    >
                        Edit profile <ArrowUpRight size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.requests)}
                        className="inline-flex min-h-10 items-center gap-2 bg-[#E4B487] px-4 text-[11px] font-semibold! text-[#17202A] hover:bg-[#F0C69C]"
                    >
                        Review requests <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </section>
    );
}
function Metrics({ overview, volunteers, navigate }) {
    const metrics = [
        {
            label: 'Assigned requests',
            value: overview.assigned_requests,
            note: 'Your total caseload',
            icon: HeartHandshake,
            color: '#91B9DC',
            route: ROUTES.requests,
        },
        {
            label: 'In progress',
            value: overview.active_requests,
            note: 'Currently being handled',
            icon: Activity,
            color: '#E7B78D',
            route: ROUTES.requests,
        },
        {
            label: 'Resolved',
            value: overview.completed_requests,
            note: 'Support completed',
            icon: CheckCircle2,
            color: '#8AC7AD',
            route: ROUTES.requests,
        },
        {
            label: 'Campaigns',
            value: overview.active_campaigns,
            note: 'Community initiatives',
            icon: Megaphone,
            color: '#C1A8DB',
            route: ROUTES.campaigns,
        },
    ];
    return (
        <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className={LABEL}>Your operations today</p>
                <LinkAction onClick={() => navigate(ROUTES.volunteers)}>
                    {fmt(volunteers.total)} volunteers in your network
                </LinkAction>
            </div>
            <div className="grid grid-cols-2 overflow-hidden border border-[#2D3946] bg-[#1A2530] md:grid-cols-4">
                {metrics.map(
                    (
                        { label, value, note, icon: Icon, color, route },
                        index,
                    ) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => navigate(route)}
                            className={`group relative min-w-0 p-4 text-left transition-colors hover:bg-[#243340] sm:p-5 lg:p-6 ${index % 2 ? 'border-l border-[#354351]' : ''} ${index > 1 ? 'border-t border-[#354351] md:border-t-0' : ''} ${index === 2 ? 'md:border-l md:border-[#354351]' : ''}`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className="flex size-9 items-center justify-center"
                                    style={{
                                        color,
                                        backgroundColor: `${color}1C`,
                                    }}
                                >
                                    <Icon size={18} />
                                </span>
                                <ArrowUpRight
                                    size={15}
                                    className="text-[#70869A] transition group-hover:text-white"
                                />
                            </div>
                            <p className="mt-5 text-[11px] text-[#B1BECA]">
                                {label}
                            </p>
                            <p className="mt-1.5 text-[32px] font-semibold! leading-none tracking-[-0.04em] text-[#EEF1F5]! sm:text-[38px]">
                                {fmt(value)}
                            </p>
                            <p className="mt-3 text-[10px] text-[#899BAD]">
                                {note}
                            </p>
                            <span
                                className="absolute inset-x-0 bottom-0 h-[2px] opacity-70"
                                style={{ backgroundColor: color }}
                            />
                        </button>
                    ),
                )}
            </div>
        </section>
    );
}
function RequestQueue({ requests, navigate }) {
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
    const urgentCount = requests.filter((r) =>
        ['critical', 'urgent'].includes(norm(r.urgency)),
    ).length;
    const visible = sorted
        .filter((r) =>
            filter === 'urgent'
                ? ['critical', 'urgent'].includes(norm(r.urgency))
                : filter === 'active'
                  ? ['active', 'in_progress', 'pending'].includes(
                        norm(r.status),
                    )
                  : true,
        )
        .slice(0, 6);
    const tabs = [
        { id: 'all', name: 'All requests' },
        { id: 'urgent', name: 'Urgent', count: urgentCount },
        { id: 'active', name: 'Active' },
    ];
    return (
        <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className={LABEL}>01 / Response queue</p>
                    <h3 className="mt-2 font-sans! text-[20px]! font-semibold! text-[#EEF1F5]!">
                        Requests needing attention
                    </h3>
                    <p className="mt-1 text-[12px] text-[#94A2B2]">
                        Prioritized by urgency to help your team act faster.
                    </p>
                </div>
                <LinkAction onClick={() => navigate(ROUTES.requests)}>
                    View all
                </LinkAction>
            </div>
            <div className="mt-5 flex items-center gap-5 border-b border-[#34414F]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={`relative min-h-11 text-[11px] font-medium! ${filter === tab.id ? 'text-[#EEF1F5]' : 'text-[#8798A8] hover:text-white'}`}
                    >
                        {tab.name}
                        {tab.count > 0 && (
                            <span className="ml-1.5 rounded bg-[#483039] px-1.5 py-0.5 text-[9px] text-[#F0A7B2]">
                                {tab.count}
                            </span>
                        )}
                        {filter === tab.id && (
                            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#E4B487]" />
                        )}
                    </button>
                ))}
            </div>
            <div className="min-h-44">
                {visible.length ? (
                    visible.map((item, index) => {
                        const id = item.help_request_id || item.id;
                        const urgency = norm(item.urgency);
                        const accent = ['critical', 'urgent'].includes(urgency)
                            ? '#DE8794'
                            : urgency === 'high'
                              ? '#E5B083'
                              : '#7D9AB1';
                        return (
                            <button
                                key={item.id ?? id ?? index}
                                type="button"
                                onClick={() =>
                                    navigate(
                                        id
                                            ? ROUTES.requestDetails(id)
                                            : ROUTES.requests,
                                    )
                                }
                                className="group flex w-full min-w-0 items-center gap-3 border-b border-[#2D3946] py-4 text-left transition hover:bg-[#1D2A35] sm:gap-4"
                            >
                                <span
                                    className="h-11 w-[3px] shrink-0"
                                    style={{ backgroundColor: accent }}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block break-words text-[12px] font-semibold! leading-5 text-[#E8EDF3]! sm:text-[13px]">
                                        {item.title || 'Untitled request'}
                                    </span>
                                    <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#8FA0B1]">
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={11} />
                                            {item.district ||
                                                'Location unavailable'}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <CalendarDays size={11} />
                                            {formatDate(
                                                item.updated_at ||
                                                    item.created_at,
                                            )}
                                        </span>
                                    </span>
                                </span>
                                <span className="flex shrink-0 flex-col items-end gap-1.5">
                                    <span
                                        className="text-[10px] font-semibold!"
                                        style={{ color: accent }}
                                    >
                                        {titleCase(item.urgency || 'Normal')}
                                    </span>
                                    <span className="text-[10px] text-[#8B9CAD]">
                                        {titleCase(item.status || 'Pending')}
                                    </span>
                                </span>
                                <ChevronRight
                                    size={15}
                                    className="hidden shrink-0 text-[#74889B] group-hover:text-white sm:block"
                                />
                            </button>
                        );
                    })
                ) : (
                    <div className="flex min-h-40 flex-col items-center justify-center text-center">
                        <CheckCircle2 size={24} className="text-[#82B9A4]" />
                        <p className="mt-3 text-[12px] text-[#94A2B2]">
                            No requests match this view.
                        </p>
                    </div>
                )}
            </div>
            <button
                type="button"
                onClick={() => navigate(ROUTES.requests)}
                className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold! text-[#D9B47B] hover:text-white"
            >
                Open request management <ArrowRight size={15} />
            </button>
        </section>
    );
}
function ResponsePanel({ overview, requests }) {
    const total = Math.max(0, Number(overview.assigned_requests) || 0);
    const active = Math.max(0, Number(overview.active_requests) || 0);
    const resolved = Math.max(0, Number(overview.completed_requests) || 0);
    const other = Math.max(0, total - active - resolved);
    const rate = total
        ? Math.min(100, Math.round((resolved / total) * 100))
        : 0;
    const districts = useMemo(
        () =>
            Object.entries(
                requests.reduce((acc, item) => {
                    const district = String(
                        item.district || 'Not specified',
                    ).trim();
                    acc[district] = (acc[district] || 0) + 1;
                    return acc;
                }, {}),
            )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4),
        [requests],
    );
    const max = Math.max(1, ...districts.map(([, count]) => count));
    return (
        <section className="min-w-0 bg-[#1D2C38] p-5 sm:p-6 lg:p-7">
            <div className="flex items-center justify-between">
                <p className={LABEL}>02 / Delivery insight</p>
                <TrendingUp size={18} className="text-[#91B9DC]" />
            </div>
            <h3 className="mt-2 text-[18px] font-semibold! text-[#EEF1F5]!">
                Response performance
            </h3>
            <div className="mt-6 flex items-center justify-between gap-3 border-b border-[#394A58] pb-6">
                <div>
                    <p className="text-[11px] text-[#A7B7C5]">
                        Requests resolved
                    </p>
                    <p className="mt-2 text-[44px] font-semibold! leading-none tracking-[-0.055em] text-[#EEF1F5]!">
                        {rate}%
                    </p>
                    <p className="mt-2 text-[11px] text-[#A7B7C5]">
                        {fmt(resolved)} of {fmt(total)} assigned
                    </p>
                </div>
                <div
                    className="flex size-23 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: `conic-gradient(#83C0A7 ${rate * 3.6}deg, #364858 0)`,
                    }}
                >
                    <div className="flex size-18 items-center justify-center rounded-full bg-[#1D2C38]">
                        <CheckCircle2 size={25} className="text-[#83C0A7]" />
                    </div>
                </div>
            </div>
            <div className="mt-5 space-y-3">
                {[
                    { name: 'In progress', value: active, color: '#91B9DC' },
                    { name: 'Completed', value: resolved, color: '#83C0A7' },
                    { name: 'Other', value: other, color: '#7C8DA0' },
                ].map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between text-[12px]"
                    >
                        <span className="flex items-center gap-2 text-[#B5C4D0]">
                            <span
                                className="size-2"
                                style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                        </span>
                        <strong className="text-[#EEF1F5]!">
                            {fmt(item.value)}
                        </strong>
                    </div>
                ))}
            </div>
            <div className="mt-7 border-t border-[#394A58] pt-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-[13px] font-semibold! text-[#EEF1F5]!">
                        Communities reached
                    </h4>
                    <MapPin size={16} className="text-[#BDA7D9]" />
                </div>
                <p className="mt-1 text-[11px] text-[#9BAEBE]">
                    Requests by district
                </p>
                {districts.length ? (
                    <div className="mt-5 space-y-4">
                        {districts.map(([name, count]) => (
                            <div key={name}>
                                <div className="mb-1.5 flex justify-between gap-3 text-[11px]">
                                    <span className="truncate text-[#B8C6D2]">
                                        {name}
                                    </span>
                                    <span className="text-[#EEF1F5]">
                                        {fmt(count)}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-[#344655]">
                                    <div
                                        className="h-full bg-[#B5A1D1]"
                                        style={{
                                            width: `${(count / max) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-5 text-[11px] text-[#9BAEBE]">
                        Location insights will appear when requests are
                        available.
                    </p>
                )}
            </div>
        </section>
    );
}
function Campaigns({ campaigns, navigate }) {
    const featured = campaigns[0];
    const rest = campaigns.slice(1, 4);
    return (
        <section>
            <Heading
                eyebrow="Community initiatives"
                title="Campaigns in motion"
                subtitle="The causes your organization is currently supporting."
                action={
                    <LinkAction onClick={() => navigate(ROUTES.campaigns)}>
                        All campaigns
                    </LinkAction>
                }
            />
            {featured ? (
                <div className="mt-6 grid min-w-0 overflow-hidden border border-[#2E3B49] bg-[#1A2732] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                    <Photo
                        src={getCampaignCover(featured)}
                        alt={featured.title || 'Featured campaign'}
                        icon={Megaphone}
                        className="h-54 sm:h-64 md:h-full md:min-h-70"
                    />
                    <div className="flex min-w-0 flex-col justify-between gap-8 p-5 sm:p-7">
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className={LABEL}>Featured initiative</p>
                                <Tag value={featured.status || 'Active'} />
                            </div>
                            <h3 className="mt-5 break-words font-['Fraunces']! text-[22px]! font-semibold! leading-snug text-[#EEF1F5]! sm:text-[26px]!">
                                {featured.title || 'Untitled campaign'}
                            </h3>
                            <p className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#94A2B2]">
                                <CalendarDays size={13} />
                                Started {formatDate(featured.start_date)}
                                {featured.end_date && (
                                    <span>
                                        {' '}
                                        · Ends {formatDate(featured.end_date)}
                                    </span>
                                )}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    featured.id
                                        ? ROUTES.campaignDetails(featured.id)
                                        : ROUTES.campaigns,
                                )
                            }
                            className="inline-flex w-fit items-center gap-2 text-[12px] font-semibold! text-[#E8B083] hover:text-white"
                        >
                            Explore campaign <ArrowUpRight size={15} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-6 border-y border-[#303A47] py-10 text-center text-[12px] text-[#94A2B2]">
                    Your organization's campaigns will appear here when
                    available.
                </div>
            )}
            {rest.length > 0 && (
                <div className="mt-2 divide-y divide-[#303A47]">
                    {rest.map((item, index) => (
                        <button
                            key={item.id ?? index}
                            type="button"
                            onClick={() =>
                                navigate(
                                    item.id
                                        ? ROUTES.campaignDetails(item.id)
                                        : ROUTES.campaigns,
                                )
                            }
                            className="group flex w-full min-w-0 items-center gap-4 py-4 text-left hover:bg-[#1C2833]"
                        >
                            <Photo
                                src={getCampaignCover(item)}
                                alt=""
                                icon={Megaphone}
                                className="h-15 w-20 shrink-0 sm:h-18 sm:w-25"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block break-words text-[12px] font-semibold! text-[#E7EDF3]! sm:text-[13px]">
                                    {item.title || 'Untitled campaign'}
                                </span>
                                <span className="mt-1.5 block text-[10px] text-[#91A0B0]">
                                    {formatDate(item.start_date)}
                                </span>
                            </span>
                            <span className="hidden sm:block">
                                <Tag value={item.status || 'Active'} />
                            </span>
                            <ChevronRight
                                size={16}
                                className="shrink-0 text-[#8093A6] group-hover:text-white"
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
function TeamWorkspace({ organization, volunteers, navigate }) {
    const verified = norm(organization.verification_status) === 'verified';
    return (
        <section>
            <Heading
                eyebrow="People & administration"
                title="Your workspace"
                subtitle="Keep your team and organization information up to date."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.volunteers)}
                    className="group flex min-h-39 flex-col justify-between bg-[#20332F] p-5 text-left transition hover:bg-[#294038] sm:p-6"
                >
                    <div className="flex items-start justify-between">
                        <span className="flex size-10 items-center justify-center bg-[#335047] text-[#A3D5BC]">
                            <UsersRound size={20} />
                        </span>
                        <ArrowUpRight size={17} className="text-[#A3D5BC]" />
                    </div>
                    <div>
                        <p className="text-[21px] font-semibold! text-[#EEF1F5]!">
                            {fmt(volunteers.total)}{' '}
                            <span className="text-[13px] font-medium! text-[#B8D0C4]">
                                volunteers
                            </span>
                        </p>
                        <p className="mt-1 text-[11px] text-[#A6BDB2]">
                            View people and assignments
                        </p>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.profile)}
                    className="group flex min-h-39 flex-col justify-between bg-[#243244] p-5 text-left transition hover:bg-[#2C4056] sm:p-6"
                >
                    <div className="flex items-start justify-between">
                        <span className="flex size-10 items-center justify-center bg-[#354B61] text-[#AFCCE5]">
                            <Building2 size={20} />
                        </span>
                        <ArrowUpRight size={17} className="text-[#AFCCE5]" />
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold! text-[#EEF1F5]!">
                            Organization profile
                        </p>
                        <p className="mt-1 text-[11px] text-[#A9BDCF]">
                            {verified
                                ? 'Verified organization'
                                : 'Verification pending'}{' '}
                            · Manage details
                        </p>
                    </div>
                </button>
            </div>
        </section>
    );
}
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
                if (!response.data?.data)
                    throw new Error('Dashboard data is currently unavailable.');
                setResult({
                    data: response.data.data,
                    error: '',
                    version: reload,
                });
            } catch (error) {
                if (controller.signal.aborted || axios.isCancel(error)) return;
                console.error('Organization dashboard error:', error);
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
    if (result.version !== reload)
        return (
            <DashboardLoading
                type="organization"
                title="Loading dashboard..."
                description="Retrieving your organization's information."
            />
        );
    if (result.error || !result.data)
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
                    onClick={() => setReload((n) => n + 1)}
                    className="inline-flex min-h-10 items-center gap-2 border border-[#394657] bg-[#202B38] px-4 text-[12px] text-[#EEF1F5] hover:bg-[#2A3949]"
                >
                    <RefreshCw size={15} />
                    Try again
                </button>
            </div>
        );
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
        <main className="org-dashboard-redesign min-w-0 w-full pb-7 font-sans! text-[#EEF1F5]">
            <style>{`.org-dashboard-redesign{color-scheme:dark}.org-dashboard-redesign button{cursor:pointer}.org-dashboard-redesign button:focus-visible{outline:2px solid #91B9DC;outline-offset:3px}.org-dashboard-redesign section{min-width:0}@media(prefers-reduced-motion:reduce){.org-dashboard-redesign *{transition-duration:.01ms!important}}`}</style>
            <div className="mx-auto flex w-full max-w-400 min-w-0 flex-col gap-9 sm:gap-11">
                <Hero
                    organization={organization}
                    overview={overview}
                    navigate={navigate}
                />
                <Metrics
                    overview={overview}
                    volunteers={volunteers}
                    navigate={navigate}
                />
                <section>
                    <Heading
                        eyebrow="Daily operations"
                        title="Humanitarian response"
                        subtitle="A focused view of the requests and communities relying on your team."
                    />
                    <div className="mt-6 grid min-w-0 items-start gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] xl:gap-9">
                        <RequestQueue requests={requests} navigate={navigate} />
                        <ResponsePanel
                            overview={overview}
                            requests={requests}
                        />
                    </div>
                </section>
                <Campaigns campaigns={campaigns} navigate={navigate} />
                <TeamWorkspace
                    organization={organization}
                    volunteers={volunteers}
                    navigate={navigate}
                />
                <footer className="flex flex-wrap justify-between gap-3 border-t border-[#303A47] pt-5 text-[10px] text-[#8495A8]">
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
