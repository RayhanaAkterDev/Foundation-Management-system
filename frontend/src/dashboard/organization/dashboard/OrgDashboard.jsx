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

function Cover({ src, alt, className = '' }) {
    const [failed, setFailed] = useState(false);
    return (
        <div className={`relative overflow-hidden bg-[#243544] ${className}`}>
            {src && !failed ? (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(125deg,#283D4D,#17242E)]">
                    <ImageOff size={26} className="text-[#7690A5]" />
                </div>
            )}
        </div>
    );
}
function SectionTitle({ overline, title, description, action }) {
    return (
        <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                <p className="text-[10px] font-semibold! uppercase tracking-[.17em] text-[#8496A9]">
                    {overline}
                </p>
                <h2 className="mt-1.5 text-[21px]! font-semibold! tracking-[-.035em] text-[#EEF1F5]! sm:text-[24px]!">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-[12px] leading-5 text-[#94A2B2]">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}
function Action({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 text-[11px] font-semibold! text-[#B5C9DA] hover:text-white"
        >
            {children}
            <ArrowUpRight size={14} />
        </button>
    );
}
function StatePill({ value }) {
    const status = norm(value);
    const style = ['critical', 'urgent', 'rejected'].includes(status)
        ? 'bg-[#493038] text-[#F0B1B8]'
        : ['pending', 'unverified', 'high'].includes(status)
          ? 'bg-[#45382C] text-[#EBC398]'
          : ['completed', 'verified', 'resolved'].includes(status)
            ? 'bg-[#273D36] text-[#A2D5BB]'
            : 'bg-[#293E4F] text-[#B1D0E9]';
    return (
        <span
            className={`inline-flex max-w-full items-center px-2 py-1 text-[10px] font-medium! ${style}`}
        >
            {titleCase(value || 'Active')}
        </span>
    );
}
function Welcome({ org, overview, navigate }) {
    const verified = norm(org.verification_status) === 'verified';
    return (
        <section className="grid min-w-0 overflow-hidden border border-[#303B47] bg-[#1B2630] lg:grid-cols-[minmax(0,1fr)_minmax(0,.86fr)]">
            <div className="order-2 flex min-w-0 flex-col justify-between gap-7 px-5 py-6 sm:px-8 sm:py-8 lg:order-1 lg:py-10">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="h-px w-6 bg-[#DDB581]" />
                        <span className="text-[10px] font-semibold! uppercase tracking-[.17em] text-[#B8C5D0]">
                            Organization command center
                        </span>
                    </div>
                    <p className="mt-6 text-[12px] text-[#D6B48B]">
                        Welcome back
                    </p>
                    <h1 className="mt-1 max-w-xl break-words font-['Fraunces']! text-[29px]! font-semibold! leading-[1.2]! tracking-[-.035em] text-[#F2F4F7]! sm:text-[37px]!">
                        {org.name || 'Your organization'}
                    </h1>
                    <p className="mt-4 max-w-[440px] text-[12px] leading-[1.8] text-[#AAB9C7]">
                        Manage incoming requests, coordinate volunteers and keep
                        your community initiatives moving.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#9AAABB]">
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} />
                            {org.location ||
                                org.address ||
                                'Location not specified'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <ShieldCheck size={13} />
                            {verified
                                ? 'Verified organization'
                                : 'Verification pending'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.requests)}
                        className="inline-flex min-h-10 items-center gap-2 bg-[#E2B67F] px-4 text-[12px] font-semibold! text-[#18232E] hover:bg-[#F0C999]"
                    >
                        Review requests <ArrowRight size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.profile)}
                        className="inline-flex min-h-10 items-center gap-2 border border-[#40505F] px-4 text-[12px] text-[#E0E7ED] hover:bg-[#293847]"
                    >
                        Organization profile <ArrowUpRight size={14} />
                    </button>
                </div>
            </div>
            <div className="relative order-1 h-44 min-w-0 sm:h-58 lg:order-2 lg:h-auto lg:min-h-[310px]">
                <Cover
                    src={getOrgCover(org)}
                    alt={`${org.name || 'Organization'} cover`}
                    className="absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(16,24,33,.32),transparent_55%)] lg:bg-[linear-gradient(90deg,rgba(27,38,48,.16),transparent_45%)]" />
                <span className="absolute bottom-3 right-3 bg-[#101923]/80 px-3 py-1.5 text-[10px] font-medium! text-[#DCE7EE] backdrop-blur-sm">
                    {fmt(overview.assigned_requests)} assigned requests
                </span>
            </div>
        </section>
    );
}
function Overview({ overview, volunteers, navigate }) {
    const values = [
        {
            label: 'Requests assigned',
            value: overview.assigned_requests,
            icon: HeartHandshake,
            color: '#90B7D9',
            note: 'Total received',
            route: ROUTES.requests,
        },
        {
            label: 'Being handled',
            value: overview.active_requests,
            icon: Activity,
            color: '#E0B382',
            note: 'In progress',
            route: ROUTES.requests,
        },
        {
            label: 'Requests resolved',
            value: overview.completed_requests,
            icon: CheckCircle2,
            color: '#91C5AB',
            note: 'Support completed',
            route: ROUTES.requests,
        },
        {
            label: 'Campaigns',
            value: overview.active_campaigns,
            icon: Megaphone,
            color: '#B7A7D7',
            note: 'Initiatives',
            route: ROUTES.campaigns,
        },
    ];
    return (
        <section>
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold! uppercase tracking-[.17em] text-[#91A3B5]">
                    Your organization in numbers
                </p>
                <Action onClick={() => navigate(ROUTES.volunteers)}>
                    {fmt(volunteers.total)} volunteers
                </Action>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
                {values.map(
                    ({ label, value, icon: Icon, color, note, route }) => (
                        <button
                            type="button"
                            key={label}
                            onClick={() => navigate(route)}
                            className="group min-w-0 border border-[#303B47] bg-[#1B2530] p-4 text-left transition-colors hover:bg-[#243341] sm:p-5"
                        >
                            <div className="flex items-center justify-between">
                                <Icon size={18} style={{ color }} />
                                <ArrowUpRight
                                    size={14}
                                    className="text-[#8294A5]"
                                />
                            </div>
                            <p className="mt-5 text-[11px] text-[#ABB9C6]">
                                {label}
                            </p>
                            <p className="mt-1 text-[30px] font-semibold! leading-none text-[#EEF1F5]!">
                                {fmt(value)}
                            </p>
                            <p className="mt-2 text-[10px] text-[#8496A9]">
                                {note}
                            </p>
                        </button>
                    ),
                )}
            </div>
        </section>
    );
}
function Needs({ requests, navigate }) {
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
    const count = sorted.filter((r) =>
        ['critical', 'urgent'].includes(norm(r.urgency)),
    ).length;
    const filtered = sorted
        .filter((r) =>
            filter === 'urgent'
                ? ['critical', 'urgent'].includes(norm(r.urgency))
                : filter === 'active'
                  ? ['active', 'in_progress', 'pending'].includes(
                        norm(r.status),
                    )
                  : true,
        )
        .slice(0, 5);
    return (
        <section className="min-w-0">
            <SectionTitle
                overline="Priority desk"
                title="Requests needing attention"
                description="The next cases for your team to review."
                action={
                    <Action onClick={() => navigate(ROUTES.requests)}>
                        View all requests
                    </Action>
                }
            />
            <div className="mt-5 overflow-hidden border border-[#303B47] bg-[#1A2530]">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-[#34424F] px-4 sm:px-5">
                    {[
                        ['all', 'All requests'],
                        ['urgent', `Urgent (${count})`],
                        ['active', 'Active'],
                    ].map(([id, label]) => (
                        <button
                            type="button"
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`relative min-h-11 text-[11px] font-medium! ${filter === id ? 'text-[#F0F4F8]' : 'text-[#8C9DAD] hover:text-white'}`}
                        >
                            {label}
                            {filter === id && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E3B784]" />
                            )}
                        </button>
                    ))}
                </div>
                <div className="divide-y divide-[#2D3A47]">
                    {filtered.length ? (
                        filtered.map((r, i) => {
                            const id = r.help_request_id || r.id;
                            const urgent = ['critical', 'urgent'].includes(
                                norm(r.urgency),
                            );
                            return (
                                <button
                                    type="button"
                                    key={r.id ?? i}
                                    onClick={() =>
                                        navigate(
                                            id
                                                ? ROUTES.requestDetails(id)
                                                : ROUTES.requests,
                                        )
                                    }
                                    className="group flex w-full min-w-0 items-center gap-3 px-4 py-4 text-left hover:bg-[#243443] sm:px-5"
                                >
                                    <span
                                        className={`h-9 w-0.5 shrink-0 ${urgent ? 'bg-[#DA8D96]' : 'bg-[#CBA47D]'}`}
                                    />
                                    <span className="min-w-0 flex-1">
                                        <span className="block break-words text-[12px] font-semibold! leading-5 text-[#EDF1F5]!">
                                            {r.title || 'Untitled request'}
                                        </span>
                                        <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#91A3B4]">
                                            <span className="inline-flex items-center gap-1">
                                                <MapPin size={11} />
                                                {r.district ||
                                                    'Location unavailable'}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <CalendarDays size={11} />
                                                {formatDate(
                                                    r.updated_at ||
                                                        r.created_at,
                                                )}
                                            </span>
                                        </span>
                                    </span>
                                    <span className="hidden shrink-0 sm:block">
                                        <StatePill
                                            value={r.urgency || 'Normal'}
                                        />
                                    </span>
                                    <ChevronRight
                                        size={15}
                                        className="shrink-0 text-[#8195A8]"
                                    />
                                </button>
                            );
                        })
                    ) : (
                        <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-[12px] text-[#9BAABB]">
                            <CheckCircle2
                                size={24}
                                className="text-[#8DC1A7]"
                            />
                            No requests in this view
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.requests)}
                    className="flex w-full items-center justify-between border-t border-[#34424F] bg-[#202D39] px-5 py-3.5 text-[11px] font-medium! text-[#C6D6E3] hover:bg-[#2A3947]"
                >
                    Open request management <ArrowRight size={15} />
                </button>
            </div>
        </section>
    );
}
function Delivery({ overview, requests }) {
    const total = Math.max(0, Number(overview.assigned_requests) || 0);
    const resolved = Math.max(0, Number(overview.completed_requests) || 0);
    const active = Math.max(0, Number(overview.active_requests) || 0);
    const pct = total ? Math.min(100, Math.round((resolved / total) * 100)) : 0;
    const districts = Object.entries(
        requests.reduce((acc, r) => {
            const k = String(r.district || 'Not specified');
            acc[k] = (acc[k] || 0) + 1;
            return acc;
        }, {}),
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);
    const max = Math.max(1, ...districts.map((x) => x[1]));
    return (
        <section className="min-w-0 border border-[#303B47] bg-[#1C2A35] p-5 sm:p-6">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold! uppercase tracking-[.15em] text-[#99ACBE]">
                    Delivery overview
                </p>
                <Activity size={16} className="text-[#9ABADA]" />
            </div>
            <h3 className="mt-2 text-[18px] font-semibold! text-[#EEF1F5]!">
                Team performance
            </h3>
            <div className="mt-6 flex items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] text-[#A6B5C3]">
                        Requests resolved
                    </p>
                    <p className="mt-2 text-[43px] font-semibold! leading-none tracking-[-.05em] text-[#EEF1F5]!">
                        {pct}%
                    </p>
                </div>
                <span className="text-right text-[11px] text-[#A6B5C3]">
                    {fmt(resolved)} of {fmt(total)}
                    <br />
                    requests
                </span>
            </div>
            <div className="mt-5 h-1.5 bg-[#394957]">
                <div
                    className="h-full bg-[#92C6AA]"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-b border-[#364653] pb-5">
                {[
                    ['In progress', active, '#90B5D5'],
                    ['Resolved', resolved, '#92C6AA'],
                    [
                        'Other',
                        Math.max(0, total - active - resolved),
                        '#A9A1BE',
                    ],
                ].map(([label, value, color]) => (
                    <div key={label}>
                        <p className="text-[10px] text-[#A0B0BF]">
                            <span
                                className="mr-1.5 inline-block size-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            {label}
                        </p>
                        <p className="mt-2 text-[18px] font-semibold! text-[#EEF1F5]!">
                            {fmt(value)}
                        </p>
                    </div>
                ))}
            </div>
            <h4 className="mt-5 text-[12px] font-semibold! text-[#E6EDF3]!">
                Where support is needed
            </h4>
            {districts.length ? (
                <div className="mt-4 space-y-3">
                    {districts.map(([name, n]) => (
                        <div key={name}>
                            <div className="mb-1.5 flex justify-between gap-2 text-[11px] text-[#B8C7D3]">
                                <span className="truncate">{name}</span>
                                <span>{fmt(n)}</span>
                            </div>
                            <div className="h-1 bg-[#3B4B58]">
                                <div
                                    className="h-full bg-[#B2A3D2]"
                                    style={{ width: `${(n / max) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-[11px] text-[#94A2B2]">
                    District information is not available yet.
                </p>
            )}
        </section>
    );
}
function Initiatives({ campaigns, navigate }) {
    const items = campaigns.slice(0, 4);
    return (
        <section>
            <SectionTitle
                overline="Your initiatives"
                title="Campaigns in progress"
                description="Follow the work your organization is leading."
                action={
                    <Action onClick={() => navigate(ROUTES.campaigns)}>
                        All campaigns
                    </Action>
                }
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
                {items.length ? (
                    items.map((c, i) => (
                        <button
                            type="button"
                            key={c.id ?? i}
                            onClick={() =>
                                navigate(
                                    c.id
                                        ? ROUTES.campaignDetails(c.id)
                                        : ROUTES.campaigns,
                                )
                            }
                            className="group flex min-w-0 flex-col overflow-hidden border border-[#303B47] bg-[#1B2732] text-left transition-colors hover:bg-[#243341] sm:flex-row"
                        >
                            <Cover
                                src={getCampaignCover(c)}
                                alt={c.title || 'Campaign cover'}
                                className="h-36 w-full shrink-0 sm:h-auto sm:w-32"
                            />
                            <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-4">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] uppercase tracking-[.1em] text-[#9CAEBF]">
                                            Campaign{' '}
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <StatePill
                                            value={c.status || 'Active'}
                                        />
                                    </div>
                                    <h3 className="mt-3 break-words text-[13px] font-semibold! leading-5 text-[#EDF1F5]!">
                                        {c.title || 'Untitled campaign'}
                                    </h3>
                                    <p className="mt-2 text-[10px] text-[#92A4B6]">
                                        {formatDate(c.start_date)}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold! text-[#D9B78B]">
                                    View details <ArrowUpRight size={14} />
                                </span>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full border border-[#303B47] px-5 py-10 text-center text-[12px] text-[#94A2B2]">
                        No campaigns to show yet.
                    </div>
                )}
            </div>
        </section>
    );
}
function Tools({ org, volunteers, navigate }) {
    const entries = [
        {
            label: 'Volunteers',
            detail: `${fmt(volunteers.total)} people in your network`,
            icon: UsersRound,
            route: ROUTES.volunteers,
            color: '#91C5AA',
        },
        {
            label: 'Organization profile',
            detail:
                norm(org.verification_status) === 'verified'
                    ? 'Verified organization'
                    : 'Manage organization details',
            icon: Building2,
            route: ROUTES.profile,
            color: '#9AB8D9',
        },
        {
            label: 'Manage campaigns',
            detail: 'Create and review initiatives',
            icon: Megaphone,
            route: ROUTES.campaigns,
            color: '#E0B382',
        },
        {
            label: 'Help requests',
            detail: 'Coordinate community support',
            icon: HeartHandshake,
            route: ROUTES.requests,
            color: '#B3A5D5',
        },
    ];
    return (
        <section className="border-t border-[#303B47] pt-7">
            <SectionTitle
                overline="Management"
                title="Your workspace"
                description="Everything your team needs, in one place."
            />
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {entries.map(({ label, detail, icon: Icon, route, color }) => (
                    <button
                        type="button"
                        key={label}
                        onClick={() => navigate(route)}
                        className="group flex min-w-0 items-center gap-3 border border-[#303B47] bg-[#1B2631] p-4 text-left hover:bg-[#263544]"
                    >
                        <span
                            className="flex size-9 shrink-0 items-center justify-center bg-[#2A3947]"
                            style={{ color }}
                        >
                            <Icon size={17} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-semibold! text-[#EEF1F5]!">
                                {label}
                            </span>
                            <span className="mt-1 block text-[10px] leading-4 text-[#94A2B2]">
                                {detail}
                            </span>
                        </span>
                        <ArrowUpRight
                            size={14}
                            className="shrink-0 text-[#8294A6]"
                        />
                    </button>
                ))}
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
        <main className="min-w-0 w-full pb-8 font-sans! text-[#EEF1F5]">
            <div className="mx-auto flex w-full max-w-400 min-w-0 flex-col gap-8 sm:gap-10">
                <Welcome
                    org={organization}
                    overview={overview}
                    navigate={navigate}
                />
                <Overview
                    overview={overview}
                    volunteers={volunteers}
                    navigate={navigate}
                />
                <div className="grid min-w-0 items-start gap-7 xl:grid-cols-[minmax(0,1.5fr)_minmax(310px,.82fr)] xl:gap-6">
                    <Needs requests={requests} navigate={navigate} />
                    <Delivery overview={overview} requests={requests} />
                </div>
                <Initiatives campaigns={campaigns} navigate={navigate} />
                <Tools
                    org={organization}
                    volunteers={volunteers}
                    navigate={navigate}
                />
                <footer className="flex flex-wrap justify-between gap-3 border-t border-[#303B47] pt-4 text-[10px] text-[#8798AA]">
                    <span>Stand For People · Organization workspace</span>
                    <span>Humanitarian coordination</span>
                </footer>
            </div>
        </main>
    );
}
