import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    HeartHandshake,
    Megaphone,
    RefreshCw,
    ShieldCheck,
    UserRoundCheck,
    Users,
    Wallet,
    MapPin,
    CalendarDays,
    CircleDot,
    Bell,
    Settings,
    Layers3,
    UserCircle2,
    BarChart3,
    LockKeyhole,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const ROOT = '/admin/dashboard';
const T = {
    base: '#151C25',
    surface: '#1B242E',
    elevated: '#202B37',
    border: '#303A47',
    text: '#EEF1F5',
    muted: '#94A2B2',
    blue: '#88A9D7',
    amber: '#E8A56E',
    teal: '#58AFA2',
    violet: '#A998C8',
};
const number = (value) =>
    new Intl.NumberFormat('en-US').format(Number(value) || 0);
const currency = (value) => `৳ ${number(value)}`;
const unwrap = (response) => response?.data ?? response ?? {};
const arrayOf = (response, keys = []) => {
    const root = unwrap(response);
    if (Array.isArray(root)) return root;
    for (const key of keys) if (Array.isArray(root?.[key])) return root[key];
    if (Array.isArray(root?.data)) return root.data;
    if (Array.isArray(root?.items)) return root.items;
    return [];
};
const totalOf = (response, fallback) => {
    const root = unwrap(response);
    const value =
        root?.total ??
        root?.meta?.total ??
        root?.pagination?.total ??
        root?.data?.total;
    return value == null || !Number.isFinite(Number(value))
        ? fallback
        : Number(value);
};
const firstNumber = (...values) => {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '')
            return Number(value) || 0;
    }
    return 0;
};
const recordId = (record) =>
    record?.id ?? record?._id ?? record?.request_id ?? record?.campaign_id;
const recordLocation = (record) => {
    const value = record?.district || record?.location || record?.address;
    return typeof value === 'string'
        ? value
        : value?.name || 'Location unavailable';
};
const urgency = (record) =>
    String(
        record?.urgency ||
            record?.priority ||
            record?.urgency_level ||
            'normal',
    ).toLowerCase();
const formatDate = (value) => {
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
const initialData = {
    stats: {},
    requests: [],
    verifications: [],
    campaigns: [],
    activity: [],
    individuals: 0,
    users: 0,
    organizations: 0,
    volunteers: 0,
    helpRequests: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    pendingCampaigns: 0,
    donations: 0,
};

function SectionTitle({ kicker, title, description, action }) {
    return (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                {kicker && (
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8294A7]">
                        {kicker}
                    </p>
                )}
                <h2 className="!m-0 !font-poppins !text-[18px] !font-semibold !leading-[1.35] !tracking-[-0.025em] !text-[#EEF1F5]">
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
function TextAction({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group inline-flex items-center gap-2 text-[12px] font-medium text-[#B9CCE3] hover:text-white"
        >
            {children}
            <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </button>
    );
}
function Stat({ icon: Icon, label, value, color, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex min-w-0 items-center gap-3 border-b border-[#303A47] py-4 text-left transition-colors hover:bg-white/[0.025] sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
            <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2A3643]"
                style={{ color }}
            >
                <Icon size={19} strokeWidth={1.7} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] text-[#94A2B2]">
                    {label}
                </span>
                <span className="mt-1 block truncate text-[23px] font-semibold leading-none tabular-nums text-[#EEF1F5]">
                    {value}
                </span>
            </span>
            <ArrowUpRight
                size={15}
                className="shrink-0 text-[#75899E] opacity-0 transition-opacity group-hover:opacity-100"
            />
        </button>
    );
}
function useCalendarDate() {
    const [today, setToday] = useState(() => new Date());
    useEffect(() => {
        let timeout;
        function scheduleNextDay() {
            const now = new Date();
            const next = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
            );
            timeout = setTimeout(
                () => {
                    setToday(new Date());
                    scheduleNextDay();
                },
                next.getTime() - now.getTime() + 100,
            );
        }
        scheduleNextDay();
        return () => clearTimeout(timeout);
    }, []);
    return today;
}
function readAdmin() {
    // The dashboard API may provide the user; otherwise use only existing session data.
    for (const key of ['user', 'auth_user', 'authUser', 'currentUser']) {
        try {
            const raw =
                localStorage.getItem(key) || sessionStorage.getItem(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                const user = parsed?.user || parsed?.data?.user || parsed;
                if (
                    user &&
                    typeof user === 'object' &&
                    (user.name || user.email)
                )
                    return user;
            }
        } catch {
            /* Invalid or unavailable stored profile. */
        }
    }
    return null;
}
function SystemChart({ data, loading }) {
    // A cross-sectional chart: no fictional monthly history or mismatched currency units.
    const values = [
        { label: 'Registered users', value: data.users, color: T.blue },
        { label: 'Organizations', value: data.organizations, color: T.violet },
        { label: 'Volunteers', value: data.volunteers, color: T.teal },
        { label: 'Help requests', value: data.helpRequests, color: T.amber },
        { label: 'Campaigns', value: data.totalCampaigns, color: '#A4B7CC' },
    ];
    const max = Math.max(1, ...values.map((item) => item.value));
    return (
        <div className="rounded-[9px] border border-[#303A47] bg-[#1B242E] px-5 py-6 sm:px-6">
            <div className="mb-6 flex items-center justify-between gap-3">
                <span className="text-[12px] font-medium text-[#DDE6F0]">
                    Network by category
                </span>
                <span className="text-[11px] text-[#94A2B2]">
                    Current totals
                </span>
            </div>
            <div
                className="space-y-5"
                role="img"
                aria-label="Bar chart comparing current counts of users, organizations, volunteers, help requests and campaigns"
            >
                {values.map((item) => (
                    <div key={item.label}>
                        <div className="mb-2 flex justify-between gap-4 text-[12px]">
                            <span className="text-[#B6C3D0]">{item.label}</span>
                            <strong className="tabular-nums text-[#EEF1F5]">
                                {loading ? '—' : number(item.value)}
                            </strong>
                        </div>
                        <div className="h-[9px] overflow-hidden rounded-[3px] bg-[#2B3846]">
                            <div
                                className="h-full rounded-[3px] transition-[width] duration-500"
                                style={{
                                    width: loading
                                        ? '0%'
                                        : `${Math.max(0, (item.value / max) * 100)}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-6 border-t border-[#303A47] pt-4 text-[11px] leading-5 text-[#94A2B2]">
                A snapshot of the platform's current totals, not historical
                growth. Donation amounts are excluded because they use a
                different unit.
            </p>
        </div>
    );
}
function Skeleton({ count = 4 }) {
    return (
        <div className="space-y-3 p-5">
            {Array.from({ length: count }, (_, index) => (
                <div
                    key={index}
                    className="h-[65px] animate-pulse rounded-md bg-[#283543]"
                />
            ))}
        </div>
    );
}
function EmptyQueue({ title, description }) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#273843] text-[#58AFA2]">
                <CheckCircle2 size={24} />
            </span>
            <p className="mt-4 text-[14px] font-semibold text-[#EEF1F5]">
                {title}
            </p>
            <p className="mt-1.5 max-w-[280px] text-[12px] leading-5 text-[#94A2B2]">
                {description}
            </p>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeQueue, setActiveQueue] = useState('campaigns');
    const [reload, setReload] = useState(0);
    const today = useCalendarDate();
    const [sessionAdmin] = useState(readAdmin);
    const go = (path) => navigate(`${ROOT}/${path}`);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchDashboard() {
            setLoading(true);
            setError('');
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');
                const headers = {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                };
                const endpoints = [
                    'dashboard',
                    'users',
                    'organizations',
                    'volunteers',
                    'help-requests',
                    'campaigns',
                ];
                const responses = await Promise.all(
                    endpoints.map((endpoint) =>
                        fetch(`${API}/admin/${endpoint}`, {
                            headers,
                            signal: controller.signal,
                        }),
                    ),
                );
                const failed = responses.findIndex((response) => !response.ok);
                if (failed !== -1)
                    throw new Error(
                        `Unable to load ${endpoints[failed]} (${responses[failed].status}).`,
                    );
                const [
                    dashboardRaw,
                    usersRaw,
                    organizationsRaw,
                    volunteersRaw,
                    requestsRaw,
                    campaignsRaw,
                ] = await Promise.all(
                    responses.map((response) => response.json()),
                );
                const dashboard = unwrap(dashboardRaw);
                const users = arrayOf(usersRaw, ['users']);
                const organizations = arrayOf(organizationsRaw, [
                    'organizations',
                ]);
                const volunteers = arrayOf(volunteersRaw, ['volunteers']);
                const requests = arrayOf(requestsRaw, [
                    'helpRequests',
                    'help_requests',
                    'requests',
                ]);
                const campaigns = arrayOf(campaignsRaw, ['campaigns']);
                const pendingCampaigns = campaigns.filter((campaign) =>
                    ['unverified', 'pending', 'pending_review'].includes(
                        String(campaign?.status).toLowerCase(),
                    ),
                );
                const activeCampaigns = campaigns.filter(
                    (campaign) =>
                        String(campaign?.status).toLowerCase() === 'active',
                );
                const pendingRequests =
                    dashboard?.pendingHelpRequests ??
                    dashboard?.pending_help_requests ??
                    dashboard?.pendingRequests ??
                    [];
                const pendingVerifications =
                    dashboard?.pendingVerifications ??
                    dashboard?.pending_verifications ??
                    [];
                const activity =
                    dashboard?.recentActivity ??
                    dashboard?.recent_activity ??
                    [];
                if (!controller.signal.aborted) {
                    setData({
                        stats: dashboard?.stats || {},
                        admin:
                            dashboard?.admin ||
                            dashboard?.user ||
                            dashboard?.currentUser ||
                            null,
                        requests: Array.isArray(pendingRequests)
                            ? pendingRequests
                            : [],
                        verifications: Array.isArray(pendingVerifications)
                            ? pendingVerifications
                            : [],
                        campaigns: pendingCampaigns,
                        activity: Array.isArray(activity) ? activity : [],
                        users: totalOf(
                            usersRaw,
                            firstNumber(
                                dashboard?.stats?.totalUsers,
                                users.length,
                            ),
                        ),
                        individuals: firstNumber(
                            dashboard?.stats?.totalIndividualUsers,
                            users.filter((user) => user?.role === 'individual')
                                .length,
                        ),
                        organizations: totalOf(
                            organizationsRaw,
                            organizations.length,
                        ),
                        volunteers: totalOf(
                            volunteersRaw,
                            firstNumber(
                                dashboard?.stats?.totalVolunteers,
                                volunteers.length,
                            ),
                        ),
                        helpRequests: totalOf(requestsRaw, requests.length),
                        totalCampaigns: totalOf(campaignsRaw, campaigns.length),
                        activeCampaigns: firstNumber(
                            dashboard?.stats?.activeCampaigns,
                            activeCampaigns.length,
                        ),
                        pendingCampaigns: firstNumber(
                            dashboard?.stats?.pendingCampaigns,
                            pendingCampaigns.length,
                        ),
                        donations: firstNumber(
                            dashboard?.stats?.totalDonations,
                            dashboard?.stats?.totalDonationAmount,
                            dashboard?.stats?.donations,
                        ),
                    });
                }
            } catch (caught) {
                if (!controller.signal.aborted)
                    setError(
                        caught?.message || 'Unable to load dashboard data.',
                    );
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        fetchDashboard();
        return () => controller.abort();
    }, [reload]);

    const counts = useMemo(
        () => ({
            requests: firstNumber(
                data.stats?.pendingRequests,
                data.stats?.pendingHelpRequests,
                data.requests.length,
            ),
            organizations: firstNumber(
                data.stats?.pendingVerifications,
                data.verifications.length,
            ),
            volunteers: firstNumber(
                data.stats?.pendingVolunteers,
                data.stats?.pendingVolunteerApplications,
                data.stats?.volunteerApplicationsPending,
            ),
            campaigns: data.pendingCampaigns,
        }),
        [data],
    );
    const workload =
        counts.requests +
        counts.organizations +
        counts.volunteers +
        counts.campaigns;
    const urgentCount = firstNumber(
        data.stats?.highPriorityRequests,
        data.stats?.urgentHelpRequests,
        data.requests.filter((item) =>
            ['critical', 'urgent', 'high'].includes(urgency(item)),
        ).length,
    );
    const queues = [
        {
            id: 'requests',
            label: 'Help requests',
            count: counts.requests,
            color: T.amber,
            icon: HeartHandshake,
            route: 'help-requests',
        },
        {
            id: 'organizations',
            label: 'Organizations',
            count: counts.organizations,
            color: T.teal,
            icon: Building2,
            route: 'organizations',
        },
        {
            id: 'volunteers',
            label: 'Volunteers',
            count: counts.volunteers,
            color: T.violet,
            icon: UserRoundCheck,
            route: 'volunteers/requests',
        },
        {
            id: 'campaigns',
            label: 'Campaigns',
            count: counts.campaigns,
            color: T.blue,
            icon: Megaphone,
            route: 'campaigns',
        },
    ];
    const currentQueue =
        queues.find((queue) => queue.id === activeQueue) || queues[0];
    const entries =
        activeQueue === 'requests'
            ? data.requests
            : activeQueue === 'organizations'
              ? data.verifications
              : activeQueue === 'campaigns'
                ? data.campaigns
                : [];
    const otherCampaigns = Math.max(
        0,
        data.totalCampaigns - data.activeCampaigns - data.pendingCampaigns,
    );
    const campaignDistribution = [
        { label: 'Active', value: data.activeCampaigns, color: T.teal },
        {
            label: 'Pending review',
            value: data.pendingCampaigns,
            color: T.amber,
        },
        { label: 'Other statuses', value: otherCampaigns, color: '#64748B' },
    ];
    const activePct = data.totalCampaigns
        ? Math.min(100, (data.activeCampaigns / data.totalCampaigns) * 100)
        : 0;
    const pendingPct = data.totalCampaigns
        ? Math.min(
              100 - activePct,
              (data.pendingCampaigns / data.totalCampaigns) * 100,
          )
        : 0;

    return (
        <main className="min-h-screen font-poppins text-[#EEF1F5]">
            <div className="mx-auto max-w-[1550px] space-y-12">
                {/* Open header: the date and statistics are independent of the title. */}
                <header className="flex flex-wrap items-start justify-between gap-6 border-b border-[#303A47] pb-7">
                    <div className="min-w-0 max-w-[720px]">
                        <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A2B2]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#88A9D7]" />
                            Administration / Overview
                        </p>
                        <h1 className="!m-0 !font-fraunces !text-[30px] !font-semibold !leading-[1.2] !tracking-[-0.025em] !text-[#EEF1F5] sm:!text-[38px]">
                            Operations overview
                        </h1>
                        <p className="mt-3 text-[13px] leading-6 text-[#A3B1C0]">
                            Manage incoming requests, review platform activity
                            and keep humanitarian operations moving.
                        </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#D8E3EE]">
                            <CalendarDays
                                size={16}
                                className="text-[#88A9D7]"
                            />
                            <time
                                dateTime={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`}
                            >
                                {today.toLocaleDateString('en-GB', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </time>
                        </div>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => setReload((value) => value + 1)}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-[#3A4857] bg-[#202B37] px-3.5 text-[12px] text-[#DCE5EE] hover:bg-[#304050] disabled:opacity-50"
                        >
                            <RefreshCw
                                size={14}
                                className={loading ? 'animate-spin' : ''}
                            />
                            Refresh data
                        </button>
                    </div>
                </header>

                {/* Standalone metrics, outside the header. */}
                <section aria-label="Platform statistics">
                    <SectionTitle
                        kicker="Network snapshot"
                        title="Platform at a glance"
                        description="Current totals across Stand For People."
                    />
                    <div className="grid grid-cols-1 gap-x-2 border-y border-[#303A47] sm:grid-cols-2 lg:grid-cols-4">
                        <Stat
                            icon={Users}
                            label="Individuals"
                            value={loading ? '—' : number(data.individuals)}
                            color={T.blue}
                            onClick={() => go('users')}
                        />
                        <Stat
                            icon={Building2}
                            label="Organizations"
                            value={loading ? '—' : number(data.organizations)}
                            color={T.violet}
                            onClick={() => go('organizations')}
                        />
                        <Stat
                            icon={UserRoundCheck}
                            label="Volunteers"
                            value={loading ? '—' : number(data.volunteers)}
                            color={T.teal}
                            onClick={() => go('volunteers')}
                        />
                        <Stat
                            icon={Wallet}
                            label="Donations"
                            value={loading ? '—' : currency(data.donations)}
                            color={T.amber}
                            onClick={() => go('donations')}
                        />
                    </div>
                </section>

                {error && (
                    <div
                        role="alert"
                        className="flex flex-wrap items-center gap-3 rounded-md border border-[#80544A] bg-[#38272C] px-4 py-3 text-[13px] text-[#F2BDA2]"
                    >
                        <AlertCircle size={17} />
                        <span className="flex-1">{error}</span>
                        <button
                            type="button"
                            className="underline"
                            onClick={() => setReload((value) => value + 1)}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Review area: one primary workspace, one quiet context rail */}
                <section>
                    <SectionTitle
                        kicker="Priority workspace"
                        title="Needs attention"
                        description="Review submissions waiting for a decision."
                        action={
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#4A433C] bg-[#332D29] px-3 py-1.5 text-[11px] font-semibold text-[#E8B083]">
                                <CircleDot size={12} />
                                {loading ? '—' : number(workload)} pending
                            </span>
                        }
                    />
                    <div className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                        <div className="min-w-0 overflow-hidden rounded-[9px] border border-[#303A47] bg-[#1B242E]">
                            <div className="flex overflow-x-auto border-b border-[#303A47] bg-[#202B37] [scrollbar-width:none]">
                                {queues.map((queue) => (
                                    <button
                                        key={queue.id}
                                        type="button"
                                        onClick={() => setActiveQueue(queue.id)}
                                        className={`flex min-w-[140px] flex-1 items-center justify-center gap-2 border-b-2 px-3 py-[17px] text-[12px] font-medium transition-colors ${activeQueue === queue.id ? 'text-[#EEF1F5]' : 'border-transparent text-[#94A2B2] hover:bg-[#293746] hover:text-white'}`}
                                        style={
                                            activeQueue === queue.id
                                                ? { borderColor: queue.color }
                                                : undefined
                                        }
                                    >
                                        {queue.label}
                                        <span
                                            className="rounded bg-[#32404E] px-1.5 py-0.5 text-[10px] tabular-nums"
                                            style={{ color: queue.color }}
                                        >
                                            {loading ? '—' : queue.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between border-b border-[#303A47] px-5 py-3.5 sm:px-6">
                                <span className="text-[11px] font-medium text-[#9BAABD]">
                                    {currentQueue.label} awaiting review
                                </span>
                                <TextAction
                                    onClick={() => go(currentQueue.route)}
                                >
                                    Open all
                                </TextAction>
                            </div>
                            {loading ? (
                                <Skeleton count={4} />
                            ) : entries.length ? (
                                <div className="divide-y divide-[#303A47]">
                                    {entries.slice(0, 5).map((item, index) => {
                                        const title =
                                            activeQueue === 'requests'
                                                ? item?.title ||
                                                  item?.subject ||
                                                  item?.request_title ||
                                                  'Untitled help request'
                                                : activeQueue ===
                                                    'organizations'
                                                  ? item?.organization_name ||
                                                    item?.name ||
                                                    item?.organizationName ||
                                                    'Organization registration'
                                                  : item?.title ||
                                                    item?.name ||
                                                    item?.campaign_title ||
                                                    'Untitled campaign';
                                        const detail =
                                            activeQueue === 'requests'
                                                ? recordLocation(item)
                                                : activeQueue ===
                                                    'organizations'
                                                  ? item?.email ||
                                                    item?.organization?.email ||
                                                    'Awaiting verification'
                                                  : item?.organization?.name ||
                                                    item?.organization_name ||
                                                    recordLocation(item);
                                        const id = recordId(item);
                                        const destination =
                                            activeQueue === 'requests'
                                                ? `help-requests/${id}`
                                                : activeQueue === 'campaigns'
                                                  ? `campaigns/${id}`
                                                  : `organizations/${id}`;
                                        const priority = urgency(item);
                                        return (
                                            <button
                                                key={id ?? index}
                                                type="button"
                                                onClick={() =>
                                                    go(
                                                        id
                                                            ? destination
                                                            : currentQueue.route,
                                                    )
                                                }
                                                className="group flex w-full items-center gap-3 px-4 py-[17px] text-left transition-colors hover:bg-[#263442] sm:px-6"
                                            >
                                                <span
                                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[7px] bg-[#2A3744]"
                                                    style={{
                                                        color: currentQueue.color,
                                                    }}
                                                >
                                                    <currentQueue.icon
                                                        size={18}
                                                        strokeWidth={1.75}
                                                    />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-[13px] font-semibold text-[#E9EEF5]">
                                                        {title}
                                                    </span>
                                                    <span className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-[#94A2B2]">
                                                        <MapPin
                                                            size={11}
                                                            className="shrink-0"
                                                        />
                                                        <span className="truncate">
                                                            {detail}
                                                        </span>
                                                    </span>
                                                </span>
                                                <span
                                                    className={`hidden rounded-[4px] px-2.5 py-1 text-[10px] font-medium sm:inline-flex ${activeQueue === 'requests' && ['critical', 'urgent', 'high'].includes(priority) ? 'bg-[#49352D] text-[#F2B184]' : 'bg-[#2D3C4B] text-[#AFC7E5]'}`}
                                                >
                                                    {activeQueue === 'requests'
                                                        ? priority
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          priority.slice(1)
                                                        : 'Pending'}
                                                </span>
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#364554] text-[#A4B6C8] group-hover:bg-[#364858] group-hover:text-white">
                                                    <ArrowRight size={15} />
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyQueue
                                    title={
                                        activeQueue === 'volunteers' &&
                                        counts.volunteers
                                            ? 'Volunteer applications pending'
                                            : 'Queue is clear'
                                    }
                                    description={
                                        activeQueue === 'volunteers' &&
                                        counts.volunteers
                                            ? 'Open volunteer requests to review the applications.'
                                            : 'There are no records in this review category.'
                                    }
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => go(currentQueue.route)}
                                className="flex w-full items-center justify-between border-t border-[#303A47] bg-[#202B37]/70 px-5 py-3.5 text-[12px] font-medium text-[#B7CEE7] hover:bg-[#293948] sm:px-6"
                            >
                                View all {currentQueue.label.toLowerCase()}{' '}
                                <ArrowRight size={15} />
                            </button>
                        </div>

                        <aside className="flex min-w-0 flex-col overflow-hidden rounded-[9px] border border-[#303A47] bg-[#1B242E]">
                            <div className="border-b border-[#303A47] px-5 py-5">
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9EAFC0]">
                                    <ShieldCheck
                                        size={15}
                                        className="text-[#E8A56E]"
                                    />{' '}
                                    Priority status
                                </div>
                                <div className="mt-4 flex items-end gap-3">
                                    <span className="text-[40px] font-semibold leading-none tracking-tight tabular-nums text-[#EEF1F5]">
                                        {loading ? '—' : number(urgentCount)}
                                    </span>
                                    <span className="pb-1 text-[11px] leading-4 text-[#94A2B2]">
                                        high-priority
                                        <br />
                                        help requests
                                    </span>
                                </div>
                                <p className="mt-3 text-[11px] leading-5 text-[#94A2B2]">
                                    Critical, urgent, or high-priority cases
                                    requiring review.
                                </p>
                            </div>
                            <div className="flex-1 px-5 py-5">
                                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A8B7C6]">
                                    Pending by team
                                </p>
                                <div className="space-y-4">
                                    {queues.map((queue) => (
                                        <button
                                            key={queue.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveQueue(queue.id)
                                            }
                                            className="flex w-full items-center justify-between gap-3 text-left"
                                        >
                                            <span className="flex items-center gap-2.5 text-[12px] text-[#AFBCCB]">
                                                <span
                                                    className="h-2 w-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            queue.color,
                                                    }}
                                                />
                                                {queue.label}
                                            </span>
                                            <strong className="text-[12px] tabular-nums text-[#EEF1F5]">
                                                {loading
                                                    ? '—'
                                                    : number(queue.count)}
                                            </strong>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => go('help-requests')}
                                className="flex items-center justify-between border-t border-[#303A47] bg-[#202B37] px-5 py-4 text-[12px] font-medium text-[#B7CEE7] hover:bg-[#2A3948]"
                            >
                                Manage help requests <ArrowRight size={15} />
                            </button>
                        </aside>
                    </div>
                </section>

                <section>
                    <SectionTitle
                        kicker="System intelligence"
                        title="Whole-system statistics"
                        description="Compare the scale of core platform activities using live totals."
                        action={
                            <BarChart3 size={19} className="text-[#88A9D7]" />
                        }
                    />
                    <SystemChart data={data} loading={loading} />
                </section>

                {/* Profile and action center use different layouts from the review workspace. */}
                <section>
                    <SectionTitle
                        kicker="Administration"
                        title="Your workspace"
                        description="Account details and direct access to the tools you manage."
                    />
                    <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.5fr)]">
                        <div className="rounded-[9px] border border-[#303A47] bg-[#1B242E] p-5 sm:p-6">
                            {(() => {
                                const admin = data.admin || sessionAdmin;
                                const name =
                                    admin?.name ||
                                    admin?.full_name ||
                                    admin?.fullName ||
                                    'Administrator';
                                const email = admin?.email || '';
                                const photo =
                                    admin?.avatar ||
                                    admin?.photo ||
                                    admin?.profile_photo ||
                                    admin?.profile_image ||
                                    '';
                                const initials = name
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((part) => part[0])
                                    .join('')
                                    .toUpperCase();
                                return (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#3B4A59] bg-[#2C3947] text-[19px] font-semibold text-[#DCE7F2]">
                                                {photo ? (
                                                    <img
                                                        src={photo}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                'none';
                                                        }}
                                                    />
                                                ) : (
                                                    initials
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] uppercase tracking-[0.12em] text-[#94A2B2]">
                                                    Administrator profile
                                                </p>
                                                <h3 className="mt-1 truncate text-[17px] font-semibold text-[#EEF1F5]">
                                                    {name}
                                                </h3>
                                                <p className="mt-0.5 truncate text-[12px] text-[#94A2B2]">
                                                    {email ||
                                                        'Platform administration'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[#303A47] pt-5">
                                            <button
                                                type="button"
                                                onClick={() => go('profile')}
                                                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3A4857] px-3 py-2.5 text-[12px] font-medium text-[#DDE7F0] hover:bg-[#293746]"
                                            >
                                                <UserCircle2 size={15} />
                                                My profile
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => go('security')}
                                                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3A4857] px-3 py-2.5 text-[12px] font-medium text-[#DDE7F0] hover:bg-[#293746]"
                                            >
                                                <LockKeyhole size={15} />
                                                Security
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <div className="overflow-hidden rounded-[9px] border border-[#303A47] bg-[#1B242E]">
                            <div className="flex items-center justify-between border-b border-[#303A47] px-5 py-4 sm:px-6">
                                <div>
                                    <h3 className="text-[15px] font-semibold text-[#EEF1F5]">
                                        Action center
                                    </h3>
                                    <p className="mt-1 text-[12px] text-[#94A2B2]">
                                        Go directly to administrative tools
                                    </p>
                                </div>
                                <Layers3 size={17} className="text-[#88A9D7]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                {[
                                    {
                                        label: 'Users',
                                        note: 'Accounts and permissions',
                                        icon: Users,
                                        path: 'users',
                                        color: T.blue,
                                    },
                                    {
                                        label: 'Organizations',
                                        note: 'Partners and verification',
                                        icon: Building2,
                                        path: 'organizations',
                                        color: T.violet,
                                    },
                                    {
                                        label: 'Volunteers',
                                        note: 'People and applications',
                                        icon: UserRoundCheck,
                                        path: 'volunteers',
                                        color: T.teal,
                                    },
                                    {
                                        label: 'Notifications',
                                        note: 'Platform updates',
                                        icon: Bell,
                                        path: 'notifications',
                                        color: T.amber,
                                    },
                                    {
                                        label: 'Help requests',
                                        note: 'Community support cases',
                                        icon: HeartHandshake,
                                        path: 'help-requests',
                                        color: T.amber,
                                    },
                                    {
                                        label: 'Settings',
                                        note: 'Account preferences',
                                        icon: Settings,
                                        path: 'settings',
                                        color: T.blue,
                                    },
                                ].map((action) => (
                                    <button
                                        key={action.label}
                                        type="button"
                                        onClick={() => go(action.path)}
                                        className="group flex min-w-0 items-center gap-3 border-b border-[#303A47] px-5 py-4 text-left transition-colors hover:bg-[#263442] sm:odd:border-r sm:px-6"
                                    >
                                        <span
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2A3744]"
                                            style={{ color: action.color }}
                                        >
                                            <action.icon size={17} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[12px] font-semibold text-[#EAF0F6]">
                                                {action.label}
                                            </span>
                                            <span className="mt-1 block truncate text-[11px] text-[#94A2B2]">
                                                {action.note}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            size={15}
                                            className="shrink-0 text-[#8195A9] group-hover:text-white"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom row: compact platform health and meaningful timeline */}
                <section className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                    <div className="min-w-0">
                        <SectionTitle
                            kicker="Platform health"
                            title="Campaign overview"
                            description="How campaigns are progressing across the network."
                            action={
                                <TextAction onClick={() => go('campaigns')}>
                                    Manage campaigns
                                </TextAction>
                            }
                        />
                        <div className="rounded-[9px] border border-[#303A47] bg-[#1B242E] px-5 py-6 sm:px-6">
                            <div className="flex flex-wrap items-center gap-7">
                                <div
                                    className="relative flex h-[145px] w-[145px] shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background: data.totalCampaigns
                                            ? `conic-gradient(${T.teal} 0 ${activePct}%, ${T.amber} ${activePct}% ${activePct + pendingPct}%, #64748B ${activePct + pendingPct}% 100%)`
                                            : '#34404D',
                                    }}
                                >
                                    <div className="flex h-[109px] w-[109px] flex-col items-center justify-center rounded-full bg-[#1B242E]">
                                        <strong className="text-[32px] font-semibold leading-none tabular-nums">
                                            {loading
                                                ? '—'
                                                : number(data.totalCampaigns)}
                                        </strong>
                                        <span className="mt-1 text-[10px] text-[#94A2B2]">
                                            Campaigns
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-[160px] flex-1 space-y-4">
                                    {campaignDistribution.map((segment) => (
                                        <div
                                            key={segment.label}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <span className="flex items-center gap-2 text-[12px] text-[#B4C0CE]">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-[2px]"
                                                    style={{
                                                        backgroundColor:
                                                            segment.color,
                                                    }}
                                                />
                                                {segment.label}
                                            </span>
                                            <strong className="text-[13px] tabular-nums">
                                                {loading
                                                    ? '—'
                                                    : number(segment.value)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#303A47] pt-5">
                                <div>
                                    <p className="text-[11px] text-[#94A2B2]">
                                        Total help requests
                                    </p>
                                    <p className="mt-1 text-[20px] font-semibold tabular-nums">
                                        {loading
                                            ? '—'
                                            : number(data.helpRequests)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-[#94A2B2]">
                                        Registered users
                                    </p>
                                    <p className="mt-1 text-[20px] font-semibold tabular-nums">
                                        {loading ? '—' : number(data.users)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <SectionTitle
                            kicker="Audit trail"
                            title="Recent activity"
                            description="Latest recorded administrative actions."
                        />
                        <div className="overflow-hidden rounded-[9px] border border-[#303A47] bg-[#1B242E]">
                            {loading ? (
                                <Skeleton count={4} />
                            ) : data.activity.length ? (
                                <div className="divide-y divide-[#303A47] px-5 sm:px-6">
                                    {data.activity
                                        .slice(0, 5)
                                        .map((item, index) => {
                                            const headline =
                                                item?.title ||
                                                item?.action ||
                                                item?.description ||
                                                'Administrative update';
                                            const description =
                                                item?.title || item?.action
                                                    ? item?.description
                                                    : '';
                                            const date = formatDate(
                                                item?.created_at ||
                                                    item?.createdAt ||
                                                    item?.timestamp ||
                                                    item?.date,
                                            );
                                            return (
                                                <div
                                                    key={item?.id ?? index}
                                                    className="flex items-start gap-3 py-[15px]"
                                                >
                                                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#293746] text-[#9CB6D5]">
                                                        <Activity size={15} />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="line-clamp-1 text-[12px] font-semibold text-[#E7EDF4]">
                                                            {headline}
                                                        </p>
                                                        {description && (
                                                            <p className="mt-0.5 line-clamp-1 text-[11px] text-[#94A2B2]">
                                                                {description}
                                                            </p>
                                                        )}
                                                        <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#7F91A4]">
                                                            <CalendarDays
                                                                size={11}
                                                            />
                                                            {date}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            ) : (
                                <EmptyQueue
                                    title="No recent activity"
                                    description="Administrative actions will appear here when available."
                                />
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
