import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

import {
    Activity,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Bell,
    Building2,
    CalendarDays,
    CheckCircle2,
    HeartHandshake,
    ClipboardList,
    LockKeyhole,
    Megaphone,
    Plus,
    RefreshCw,
    Settings,
    ShieldCheck,
    UserCircle2,
    UserRoundCheck,
    Users,
    Wallet,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const ROOT = '/admin/dashboard';
const C = {
    bg: '#151C25',
    panel: '#1B242E',
    raised: '#202B37',
    border: '#303A47',
    text: '#EEF1F5',
    muted: '#94A2B2',
    blue: '#88A9D7',
    amber: '#E8A56E',
    teal: '#58AFA2',
    violet: '#A998C8',
};
const fmt = (v) => new Intl.NumberFormat('en-US').format(Number(v) || 0);
const money = (v) => `৳ ${fmt(v)}`;
const unwrap = (v) => v?.data ?? v ?? {};
const arrayOf = (v, keys = []) => {
    const r = unwrap(v);
    if (Array.isArray(r)) return r;
    for (const k of keys) if (Array.isArray(r?.[k])) return r[k];
    return Array.isArray(r?.data)
        ? r.data
        : Array.isArray(r?.items)
          ? r.items
          : [];
};
const firstNumber = (...values) => {
    for (const v of values)
        if (v !== undefined && v !== null && v !== '') return Number(v) || 0;
    return 0;
};
const totalOf = (v, fallback) => {
    const r = unwrap(v);
    const n =
        r?.total ?? r?.meta?.total ?? r?.pagination?.total ?? r?.data?.total;
    return n == null || !Number.isFinite(Number(n)) ? fallback : Number(n);
};
const recordId = (r) => r?.id ?? r?._id ?? r?.request_id ?? r?.campaign_id;
const urgency = (r) =>
    String(
        r?.urgency || r?.priority || r?.urgency_level || 'normal',
    ).toLowerCase();
const normalizedStatus = (record) =>
    String(
        record?.status ??
            record?.verification_status ??
            record?.application_status ??
            record?.request_status ??
            '',
    )
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');
const countStatuses = (records, statuses) =>
    records.filter((r) => statuses.includes(normalizedStatus(r))).length;
const hasStatusCoverage = (records, total) =>
    records.length >= total && total > 0;
const statNumber = (...values) => {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            value !== '' &&
            Number.isFinite(Number(value))
        )
            return Number(value);
    }
    return null;
};
const recordLocation = (r) => {
    const v = r?.district || r?.location || r?.address;
    return typeof v === 'string' ? v : v?.name || 'Location unavailable';
};
const formatDate = (v) => {
    const d = new Date(v);
    return v && !Number.isNaN(d.getTime())
        ? d.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : 'Date unavailable';
};
const initialData = {
    stats: {},
    requests: [],
    allRequests: [],
    allOrganizations: [],
    allVolunteers: [],
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
    admin: null,
};
function readAdmin() {
    for (const key of ['user', 'auth_user', 'authUser', 'currentUser'])
        try {
            const raw =
                localStorage.getItem(key) || sessionStorage.getItem(key);
            if (raw) {
                const p = JSON.parse(raw);
                const u = p?.user || p?.data?.user || p;
                if (u?.name || u?.email) return u;
            }
        } catch {
            /* Ignore invalid stored session */
        }
    return null;
}
function useCalendarDate() {
    const [today, setToday] = useState(() => new Date());
    useEffect(() => {
        let timer;
        const schedule = () => {
            const now = new Date();
            const next = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
            );
            timer = setTimeout(
                () => {
                    setToday(new Date());
                    schedule();
                },
                next - now + 100,
            );
        };
        schedule();
        return () => clearTimeout(timer);
    }, []);
    return today;
}
function Heading({ eyebrow, title, description, action }) {
    return (
        <div className="mb-5 flex min-w-0 flex-wrap items-center justify-between gap-x-5 gap-y-3">
            <div className="min-w-0">
                <h2 className="!m-0 !font-poppins !text-[19px] !font-semibold !leading-snug !tracking-[-0.025em] !text-[#EEF1F5] sm:!text-[21px]">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-1 text-[12px] leading-5 text-[#94A2B2] sm:text-[13px]">
                        {description}
                    </p>
                ) : eyebrow ? (
                    <p className="mt-1 text-[12px] text-[#94A2B2]">{eyebrow}</p>
                ) : null}
            </div>
            {action}
        </div>
    );
}
function LinkAction({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B9CCE3] transition hover:text-white"
        >
            {children}
            <ArrowUpRight size={15} />
        </button>
    );
}
function Metric({ icon: Icon, label, value, color, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative flex min-w-0 flex-col items-start justify-between overflow-hidden rounded-xl border border-[#34404E] bg-[#1B242E] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#52657A] hover:bg-[#222E3A] sm:min-h-[155px] sm:p-5"
        >
            <span
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-80"
                style={{ backgroundColor: color }}
            />
            <span className="flex w-full items-start justify-between gap-2">
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11"
                    style={{ color, backgroundColor: `${color}1B` }}
                >
                    <Icon size={20} />
                </span>
                <ArrowUpRight
                    size={16}
                    className="text-[#71849A] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
            </span>
            <span className="mt-5 block w-full min-w-0">
                <span className="block text-[12px] font-medium text-[#AAB9C9]">
                    {label}
                </span>
                <strong className="mt-1.5 block break-words text-[clamp(19px,2vw,29px)] font-semibold leading-tight tracking-[-0.035em] tabular-nums text-[#F2F5F8]">
                    {value}
                </strong>
            </span>
        </button>
    );
}
function Empty({
    title = 'All caught up',
    description = 'There are no records awaiting review.',
}) {
    return (
        <div className="flex min-h-[255px] flex-col items-center justify-center px-5 text-center">
            <span className="mb-3 rounded-xl bg-[#58AFA2]/10 p-3 text-[#58AFA2]">
                <CheckCircle2 size={23} />
            </span>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 max-w-[300px] text-[12px] leading-5 text-[#94A2B2]">
                {description}
            </p>
        </div>
    );
}
function Bars({ data, loading }) {
    const items = [
        { name: 'Users', n: data.users, c: C.blue },
        { name: 'Organizations', n: data.organizations, c: C.violet },
        { name: 'Volunteers', n: data.volunteers, c: C.teal },
        { name: 'Help requests', n: data.helpRequests, c: C.amber },
        { name: 'Campaigns', n: data.totalCampaigns, c: '#B5C5D7' },
    ];
    const max = Math.max(1, ...items.map((item) => item.n));
    return (
        <div className="grid h-full min-w-0 content-between gap-6 rounded-xl border border-[#34404E] bg-[#1B242E] p-4 sm:p-6 2xl:grid-cols-[minmax(0,1fr)_190px] 2xl:p-7">
            <div className="min-w-0">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="!m-0 !text-[15px] !font-semibold !text-[#EEF1F5]">
                            Network distribution
                        </h3>
                        <p className="mt-1 text-[12px] text-[#94A2B2]">
                            A comparison of live platform records
                        </p>
                    </div>
                    <span className="rounded-md border border-[#344454] px-2.5 py-1 text-[11px] text-[#AFC0D1]">
                        Current totals
                    </span>
                </div>
                <div className="flex h-[195px] min-w-0 items-end gap-1.5 border-b border-[#3B4755] pb-0 sm:gap-4">
                    {items.map((item) => (
                        <div
                            key={item.name}
                            className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                        >
                            <strong className="text-[13px] font-semibold tabular-nums text-[#EAF0F6]">
                                {loading ? '—' : fmt(item.n)}
                            </strong>
                            <div
                                className="relative w-full max-w-[94px] overflow-hidden rounded-t-md bg-[#283440]"
                                style={{
                                    height: `${loading ? 4 : Math.max(8, (item.n / max) * 100)}%`,
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-90"
                                    style={{ background: item.c }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex min-w-0 gap-1 sm:gap-3">
                    {items.map((item) => (
                        <div
                            key={item.name}
                            className="min-w-0 flex-1 text-center break-words text-[9px] leading-4 text-[#A9B7C6] sm:text-[11px]"
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-[#303A47] pt-6 2xl:border-l 2xl:border-t-0 2xl:pl-6 2xl:pt-0">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A2B2]">
                        Platform reach
                    </p>
                    <strong className="mt-3 block text-[43px] font-semibold leading-none tabular-nums text-[#EEF1F5]">
                        {loading ? '—' : fmt(data.users)}
                    </strong>
                    <p className="mt-2 text-[12px] text-[#94A2B2]">
                        Registered accounts
                    </p>
                </div>
                <div className="space-y-3 border-t border-[#303A47] pt-5">
                    <div className="flex justify-between text-[12px]">
                        <span className="text-[#94A2B2]">Organizations</span>
                        <b className="tabular-nums">
                            {loading ? '—' : fmt(data.organizations)}
                        </b>
                    </div>
                    <div className="flex justify-between text-[12px]">
                        <span className="text-[#94A2B2]">Volunteers</span>
                        <b className="tabular-nums">
                            {loading ? '—' : fmt(data.volunteers)}
                        </b>
                    </div>
                    <div className="flex justify-between text-[12px]">
                        <span className="text-[#94A2B2]">Campaigns</span>
                        <b className="tabular-nums">
                            {loading ? '—' : fmt(data.totalCampaigns)}
                        </b>
                    </div>
                </div>
                <p className="text-[11px] leading-5 text-[#8294A7]">
                    Counts are compared on the same scale; donations are
                    excluded because they use currency.
                </p>
            </div>
        </div>
    );
}
export default function Dashboard() {
    const navigate = useNavigate();
    const go = (path) => navigate(`${ROOT}/${path}`);
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reload, setReload] = useState(0);
    const [activeQueue, setActiveQueue] = useState('campaigns');
    const [sessionAdmin] = useState(readAdmin);
    const today = useCalendarDate();
    useEffect(() => {
        const controller = new AbortController();
        async function load() {
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
                    endpoints.map((e) =>
                        fetch(`${API}/admin/${e}`, {
                            headers,
                            signal: controller.signal,
                        }),
                    ),
                );
                const failed = responses.findIndex((r) => !r.ok);
                if (failed !== -1)
                    throw new Error(
                        `Unable to load ${endpoints[failed]} (${responses[failed].status}).`,
                    );
                const [dr, ur, or, vr, rr, cr] = await Promise.all(
                    responses.map((r) => r.json()),
                );
                const d = unwrap(dr),
                    users = arrayOf(ur, ['users']),
                    orgs = arrayOf(or, ['organizations']),
                    vols = arrayOf(vr, ['volunteers']),
                    requests = arrayOf(rr, [
                        'helpRequests',
                        'help_requests',
                        'requests',
                    ]),
                    campaigns = arrayOf(cr, ['campaigns']);
                const pending = campaigns.filter((c) =>
                    ['unverified', 'pending', 'pending_review'].includes(
                        String(c?.status).toLowerCase(),
                    ),
                );
                const active = campaigns.filter(
                    (c) => String(c?.status).toLowerCase() === 'active',
                );
                if (!controller.signal.aborted)
                    setData({
                        stats: d?.stats || {},
                        admin: d?.admin || d?.user || d?.currentUser || null,
                        requests: Array.isArray(
                            d?.pendingHelpRequests ??
                                d?.pending_help_requests ??
                                d?.pendingRequests,
                        )
                            ? (d?.pendingHelpRequests ??
                              d?.pending_help_requests ??
                              d?.pendingRequests)
                            : [],
                        verifications: Array.isArray(
                            d?.pendingVerifications ?? d?.pending_verifications,
                        )
                            ? (d?.pendingVerifications ??
                              d?.pending_verifications)
                            : [],
                        activity: Array.isArray(
                            d?.recentActivity ?? d?.recent_activity,
                        )
                            ? (d?.recentActivity ?? d?.recent_activity)
                            : [],
                        campaigns: pending,
                        allRequests: requests,
                        allOrganizations: orgs,
                        allVolunteers: vols,
                        users: totalOf(
                            ur,
                            firstNumber(d?.stats?.totalUsers, users.length),
                        ),
                        individuals: firstNumber(
                            d?.stats?.totalIndividualUsers,
                            users.filter((u) => u?.role === 'individual')
                                .length,
                        ),
                        organizations: totalOf(or, orgs.length),
                        volunteers: totalOf(
                            vr,
                            firstNumber(d?.stats?.totalVolunteers, vols.length),
                        ),
                        helpRequests: totalOf(rr, requests.length),
                        totalCampaigns: totalOf(cr, campaigns.length),
                        activeCampaigns: firstNumber(
                            d?.stats?.activeCampaigns,
                            active.length,
                        ),
                        pendingCampaigns: firstNumber(
                            d?.stats?.pendingCampaigns,
                            pending.length,
                        ),
                        donations: firstNumber(
                            d?.stats?.totalDonations,
                            d?.stats?.totalDonationAmount,
                            d?.stats?.donations,
                        ),
                    });
            } catch (e) {
                if (!controller.signal.aborted)
                    setError(e?.message || 'Unable to load dashboard data.');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        load();
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
    const queues = [
        {
            id: 'requests',
            label: 'Help requests',
            count: counts.requests,
            color: C.amber,
            icon: HeartHandshake,
            route: 'help-requests',
        },
        {
            id: 'organizations',
            label: 'Organizations',
            count: counts.organizations,
            color: C.teal,
            icon: Building2,
            route: 'organizations',
        },
        {
            id: 'volunteers',
            label: 'Volunteers',
            count: counts.volunteers,
            color: C.violet,
            icon: UserRoundCheck,
            route: 'volunteers/requests',
        },
        {
            id: 'campaigns',
            label: 'Campaigns',
            count: counts.campaigns,
            color: C.blue,
            icon: Megaphone,
            route: 'campaigns',
        },
    ];
    const current = queues.find((q) => q.id === activeQueue) || queues[0];
    const entries =
        activeQueue === 'requests'
            ? data.requests
            : activeQueue === 'organizations'
              ? data.verifications
              : activeQueue === 'campaigns'
                ? data.campaigns
                : [];
    const workload = Object.values(counts).reduce((a, b) => a + b, 0);
    const urgent = statNumber(
        data.stats?.highPriorityRequests,
        data.stats?.urgentHelpRequests,
        hasStatusCoverage(data.allRequests, data.helpRequests)
            ? data.allRequests.filter((x) =>
                  ['critical', 'urgent', 'high'].includes(urgency(x)),
              ).length
            : null,
    );
    const information = useMemo(() => {
        const s = data.stats || {};
        const complete = (records, total) => hasStatusCoverage(records, total);
        const derive = (records, total, statuses) =>
            complete(records, total) ? countStatuses(records, statuses) : null;
        const helpPending = statNumber(
            s.pendingRequests,
            s.pendingHelpRequests,
            counts.requests,
        );
        const helpDone = statNumber(
            s.completedHelpRequests,
            s.resolvedHelpRequests,
            s.completedRequests,
            derive(data.allRequests, data.helpRequests, [
                'completed',
                'resolved',
                'closed',
                'fulfilled',
            ]),
        );
        const orgVerified = statNumber(
            s.verifiedOrganizations,
            s.approvedOrganizations,
            derive(data.allOrganizations, data.organizations, [
                'verified',
                'approved',
                'active',
            ]),
        );
        const volunteerActive = statNumber(
            s.activeVolunteers,
            derive(data.allVolunteers, data.volunteers, [
                'active',
                'accepted',
                'approved',
            ]),
        );
        const configs = {
            requests: {
                title: 'Help requests',
                total: data.helpRequests,
                totalLabel: 'Total requests',
                rows: [
                    {
                        label: 'Awaiting review',
                        value: helpPending,
                        color: C.amber,
                    },
                    {
                        label: 'Completed / resolved',
                        value: helpDone,
                        color: C.teal,
                    },
                    { label: 'High priority', value: urgent, color: '#E8A56E' },
                ],
                note: 'Current status of community support requests.',
            },
            organizations: {
                title: 'Organizations',
                total: data.organizations,
                totalLabel: 'Total organizations',
                rows: [
                    {
                        label: 'Awaiting verification',
                        value: counts.organizations,
                        color: C.amber,
                    },
                    {
                        label: 'Verified / active',
                        value: orgVerified,
                        color: C.teal,
                    },
                ],
                note: 'Registration and verification overview.',
            },
            volunteers: {
                title: 'Volunteers',
                total: data.volunteers,
                totalLabel: 'Registered volunteers',
                rows: [
                    {
                        label: 'Pending applications',
                        value: counts.volunteers,
                        color: C.amber,
                    },
                    {
                        label: 'Active / accepted',
                        value: volunteerActive,
                        color: C.teal,
                    },
                ],
                note: 'Volunteer enrollment and participation.',
            },
            campaigns: {
                title: 'Campaigns',
                total: data.totalCampaigns,
                totalLabel: 'Total campaigns',
                rows: [
                    {
                        label: 'Active campaigns',
                        value: data.activeCampaigns,
                        color: C.teal,
                    },
                    {
                        label: 'Awaiting review',
                        value: data.pendingCampaigns,
                        color: C.amber,
                    },
                    {
                        label: 'Other statuses',
                        value: Math.max(
                            0,
                            data.totalCampaigns -
                                data.activeCampaigns -
                                data.pendingCampaigns,
                        ),
                        color: C.violet,
                    },
                ],
                note: 'Campaign status across the platform.',
            },
        };
        return configs[activeQueue] || configs.campaigns;
    }, [activeQueue, data, counts, urgent]);
    const admin = data.admin || sessionAdmin;
    const adminName =
        admin?.name || admin?.full_name || admin?.fullName || 'Administrator';
    const adminPhoto =
        admin?.avatar ||
        admin?.photo ||
        admin?.profile_photo ||
        admin?.profile_image ||
        '';
    const initials = adminName
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0])
        .join('')
        .toUpperCase();
    const other = Math.max(
        0,
        data.totalCampaigns - data.activeCampaigns - data.pendingCampaigns,
    );
    const segments = [
        { name: 'Active', n: data.activeCampaigns, c: C.teal },
        { name: 'Pending review', n: data.pendingCampaigns, c: C.amber },
        { name: 'Other statuses', n: other, c: '#64748B' },
    ];
    const pct = data.totalCampaigns
        ? (data.activeCampaigns / data.totalCampaigns) * 100
        : 0;
    const ppct = data.totalCampaigns
        ? (data.pendingCampaigns / data.totalCampaigns) * 100
        : 0;
    const actions = [
        {
            name: 'Users',
            desc: 'Accounts & permissions',
            icon: Users,
            path: 'users',
            c: C.blue,
        },
        {
            name: 'Organizations',
            desc: 'Partners & verification',
            icon: Building2,
            path: 'organizations',
            c: C.violet,
        },
        {
            name: 'Volunteers',
            desc: 'People & applications',
            icon: UserRoundCheck,
            path: 'volunteers',
            c: C.teal,
        },
        {
            name: 'Notifications',
            desc: 'Platform updates',
            icon: Bell,
            path: 'notifications',
            c: C.amber,
        },
        {
            name: 'Help requests',
            desc: 'Community support',
            icon: HeartHandshake,
            path: 'help-requests',
            c: C.amber,
        },
        {
            name: 'Settings',
            desc: 'Account preferences',
            icon: Settings,
            path: 'settings',
            c: C.blue,
        },
    ];
    if (loading && !error) {
        return (
            <DashboardLoading
                type="admin"
                title="Loading dashboard..."
                description="Retrieving your network and platform information."
            />
        );
    }

    return (
        <main className="dashboard-refined min-h-screen min-w-0 w-full overflow-x-clip font-poppins text-[#EEF1F5]">
            <style>{`.dashboard-refined h1,.dashboard-refined h2,.dashboard-refined h3{color:#EEF1F5!important}.dashboard-refined button{cursor:pointer}.dashboard-refined button:focus-visible{outline:2px solid #88A9D7;outline-offset:3px}.dashboard-refined section{min-width:0}.dashboard-refined strong{color:inherit}.dashboard-refined .font-fraunces{font-family:Poppins,sans-serif}`}</style>
            <div className="mx-auto w-full max-w-[1550px] min-w-0 space-y-9 sm:space-y-11 xl:space-y-14">
                <header className="relative overflow-hidden ">
                    <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-96 rounded-full bg-[#6D93C8]/[0.09] blur-[85px]" />
                    <div className="relative flex min-w-0 flex-wrap items-start justify-between gap-5">
                        <div className="min-w-0 max-w-[700px]">
                            <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A3B5C9]">
                                <span className="h-2 w-2 rounded-full bg-[#6AB8AA] shadow-[0_0_12px_#58AFA255]" />
                                ADMINISTRATION
                                <span className="text-[#596B7D]">/</span>{' '}
                                OVERVIEW
                            </p>
                            <h1 className="!m-0 !font-poppins !text-[27px] !font-semibold !leading-[1.15] !tracking-[-0.035em] !text-[#F2F5F8] sm:!text-[37px] xl:!text-[44px]">
                                Operations{' '}
                                <span className="text-[#A7C1E0]">overview</span>
                            </h1>
                            <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#A8B6C5]">
                                A clear view of the people, programs and
                                decisions shaping your humanitarian network.
                                Track operational progress and take action where
                                support is needed.
                            </p>
                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-lg border border-[#344557] bg-[#1D2A37] px-3 py-2 text-[12px] text-[#C6D7E8]">
                                    <Activity
                                        size={15}
                                        className="text-[#58AFA2]"
                                    />{' '}
                                    Live operational overview
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-lg border border-[#344557] bg-[#1D2A37] px-3 py-2 text-[12px] text-[#C6D7E8]">
                                    <ShieldCheck
                                        size={15}
                                        className="text-[#88A9D7]"
                                    />{' '}
                                    Review, coordinate and respond
                                </span>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-start gap-3 sm:items-end">
                            <span className="inline-flex items-center gap-2 text-[12px] font-medium text-[#D8E3EE]">
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
                            </span>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setReload((v) => v + 1)}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#40536A] bg-[#253444] px-4 py-2.5 text-[12px] font-medium text-[#E3EDF7] transition hover:bg-[#314459] disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={14}
                                    className={loading ? 'animate-spin' : ''}
                                />
                                Refresh data
                            </button>
                        </div>
                    </div>
                </header>

                {/* Primary creation shortcuts stay above the navigation center. */}
                <div className="mb-9 flex flex-col gap-5 border-y border-[#303A47] py-5 sm:py-6 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#88A9D7]">
                            <Plus size={14} className="text-[#E8A56E]" />
                            Quick actions
                        </div>
                        <p className="mt-2 text-[13px] text-[#A8B7C6]">
                            Create a new record without opening a management
                            list.
                        </p>
                    </div>
                    <div className="grid w-full gap-2 min-[650px]:grid-cols-3 xl:w-auto xl:min-w-[510px]">
                        {[
                            {
                                label: 'Add user',
                                path: 'users/add',
                                icon: Users,
                                color: '#88A9D7',
                            },
                            {
                                label: 'Add organization',
                                path: 'organizations/add',
                                icon: Building2,
                                color: '#A998C8',
                            },
                            {
                                label: 'Create campaign',
                                path: 'campaigns/add',
                                icon: Megaphone,
                                color: '#E8A56E',
                            },
                        ].map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.path}
                                    type="button"
                                    onClick={() => go(action.path)}
                                    className="group flex min-h-12 items-center justify-between gap-3 rounded-md border border-[#354251] bg-[#202B37] px-4 py-3 text-left transition-colors hover:border-[#61768B] hover:bg-[#293949] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#88A9D7]"
                                >
                                    <span className="flex min-w-0 items-center gap-2.5">
                                        <Icon
                                            size={17}
                                            style={{ color: action.color }}
                                            className="shrink-0"
                                        />
                                        <span className="text-[12px] font-semibold text-[#EEF1F5]">
                                            {action.label}
                                        </span>
                                    </span>
                                    <Plus
                                        size={15}
                                        className="shrink-0 text-[#8294A7] transition-colors group-hover:text-[#EEF1F5]"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <section>
                    <Heading
                        eyebrow="Network snapshot"
                        title="Platform at a glance"
                        description="Current reach and contributions across the platform."
                    />
                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-12 xl:grid-rows-2">
                        <button
                            type="button"
                            onClick={() => go('users')}
                            className="group relative flex min-h-[178px] flex-col justify-between overflow-hidden rounded-xl border border-[#354455] bg-[#223242] p-6 text-left transition hover:bg-[#293C4D] sm:col-span-2 xl:col-span-4 xl:row-span-2"
                        >
                            <div className="flex items-start justify-between">
                                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#88A9D7]/15 text-[#88A9D7]">
                                    <Users size={23} />
                                </span>
                                <ArrowUpRight
                                    size={17}
                                    className="text-[#91A6BC]"
                                />
                            </div>
                            <div className="mt-8">
                                <p className="text-[12px] text-[#B8C9DA]">
                                    People across the network
                                </p>
                                <strong className="mt-2 block text-[clamp(32px,4vw,52px)] font-semibold leading-none tabular-nums text-[#EEF1F5]">
                                    {loading ? '—' : fmt(data.users)}
                                </strong>
                                <p className="mt-3 text-[12px] text-[#94A2B2]">
                                    Registered users
                                </p>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#405163] pt-4">
                                <span className="text-[11px] text-[#AFC1D2]">
                                    Individuals
                                    <strong className="mt-1 block text-[18px] font-semibold text-[#EEF1F5]">
                                        {loading ? '—' : fmt(data.individuals)}
                                    </strong>
                                </span>
                                <span className="text-[11px] text-[#AFC1D2]">
                                    Organizations
                                    <strong className="mt-1 block text-[18px] font-semibold text-[#EEF1F5]">
                                        {loading
                                            ? '—'
                                            : fmt(data.organizations)}
                                    </strong>
                                </span>
                            </div>
                        </button>
                        <div className="grid gap-3 min-[520px]:grid-cols-2 xl:col-span-5">
                            <Metric
                                icon={UserRoundCheck}
                                label="Volunteers"
                                value={loading ? '—' : fmt(data.volunteers)}
                                color={C.teal}
                                onClick={() => go('volunteers')}
                            />
                            <Metric
                                icon={HeartHandshake}
                                label="Help requests"
                                value={loading ? '—' : fmt(data.helpRequests)}
                                color={C.amber}
                                onClick={() => go('help-requests')}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => go('donations')}
                            className="group flex min-h-[155px] flex-col justify-between rounded-xl border border-[#57483D] bg-[#282C30] p-5 text-left transition hover:bg-[#33343A] xl:col-span-3 xl:row-span-2"
                        >
                            <span className="flex items-center justify-between text-[#E8A56E]">
                                <Wallet size={23} />
                                <ArrowUpRight size={16} />
                            </span>
                            <span>
                                <span className="block text-[12px] text-[#D0B9A5]">
                                    Total contributions
                                </span>
                                <strong className="mt-2 block text-[clamp(23px,2.6vw,35px)] font-semibold tabular-nums text-[#F3D5AD]">
                                    {loading ? '—' : money(data.donations)}
                                </strong>
                                <span className="mt-2 block text-[11px] text-[#B8A99A]">
                                    Donations received
                                </span>
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => go('campaigns')}
                            className="group flex min-h-[145px] flex-col justify-between rounded-xl border border-[#34404E] bg-[#1B2732] p-5 text-left transition hover:bg-[#273746] xl:col-span-5"
                        >
                            <span className="flex items-center justify-between text-[#A7B7D0]">
                                <Megaphone size={21} />
                                <ArrowUpRight size={16} />
                            </span>
                            <span className="mt-4 flex items-end justify-between gap-4">
                                <span>
                                    <span className="block text-[12px] text-[#AAB9C9]">
                                        Campaigns
                                    </span>
                                    <strong className="mt-1 block text-[28px] font-semibold tabular-nums">
                                        {loading
                                            ? '—'
                                            : fmt(data.totalCampaigns)}
                                    </strong>
                                </span>
                                <span className="text-right text-[11px] text-[#A5B9CB]">
                                    <strong className="block text-[18px] font-semibold text-[#7BC2B5]">
                                        {loading
                                            ? '—'
                                            : fmt(data.activeCampaigns)}
                                    </strong>
                                    Active
                                </span>
                            </span>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#344452]">
                                <div
                                    className="h-full bg-[#58AFA2]"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, pct))}%`,
                                    }}
                                />
                            </div>
                        </button>
                    </div>
                </section>
                {error && (
                    <div
                        role="alert"
                        className="flex items-center gap-3 rounded-lg border border-[#80544A] bg-[#38272C] p-4 text-[13px] text-[#F2BDA2]"
                    >
                        <AlertCircle size={18} />
                        <span className="flex-1">{error}</span>
                        <button
                            type="button"
                            onClick={() => setReload((v) => v + 1)}
                            className="underline"
                        >
                            Retry
                        </button>
                    </div>
                )}
                <section>
                    <Heading
                        eyebrow="Priority workspace"
                        title="Needs attention"
                        description="Review and act on items waiting for a decision."
                        action={
                            <span className="rounded-full border border-[#5A4537] bg-[#332D29] px-3 py-1.5 text-[12px] font-semibold text-[#E8B083]">
                                {loading ? '—' : fmt(workload)} pending
                            </span>
                        }
                    />
                    <div className="grid min-w-0 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(285px,0.83fr)] 2xl:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="flex min-h-[320px] min-w-0 flex-col overflow-hidden rounded-xl border border-[#34404E] bg-[#1B242E] xl:h-[430px]">
                            <div
                                className="grid min-w-0 grid-cols-2 border-b border-[#303A47] bg-[#202B37] 2xl:grid-cols-4"
                                role="tablist"
                                aria-label="Review categories"
                            >
                                {queues.map((q) => (
                                    <button
                                        key={q.id}
                                        type="button"
                                        onClick={() => setActiveQueue(q.id)}
                                        className={`flex min-w-0 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-[11px] font-medium transition sm:gap-2 sm:px-3 sm:text-[12px] 2xl:py-4 ${activeQueue === q.id ? 'bg-[#293746] text-white' : 'border-transparent text-[#94A2B2] hover:bg-white/5'}`}
                                        role="tab"
                                        aria-selected={activeQueue === q.id}
                                        style={
                                            activeQueue === q.id
                                                ? { borderColor: q.color }
                                                : undefined
                                        }
                                    >
                                        {q.label}
                                        <span
                                            className="rounded bg-[#334252] px-1.5 py-0.5 text-[10px]"
                                            style={{ color: q.color }}
                                        >
                                            {loading ? '—' : q.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[#303A47] px-3 py-3.5 sm:px-5">
                                <span className="text-[12px] font-medium text-[#B8C5D3]">
                                    {current.label} awaiting review
                                </span>
                                <LinkAction onClick={() => go(current.route)}>
                                    Open all
                                </LinkAction>
                            </div>
                            <div className="min-h-[110px] max-h-[360px] flex-1 overflow-y-auto overscroll-contain lg:max-h-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {loading ? (
                                    <div className="space-y-3 p-5">
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <div
                                                key={i}
                                                className="h-[65px] animate-pulse rounded-lg bg-[#283543]"
                                            />
                                        ))}
                                    </div>
                                ) : entries.length ? (
                                    <div className="divide-y divide-[#303A47]">
                                        {entries.map((item, index) => {
                                            const id = recordId(item);
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
                                                        item?.organization
                                                            ?.email ||
                                                        'Awaiting verification'
                                                      : item?.organization
                                                            ?.name ||
                                                        item?.organization_name ||
                                                        recordLocation(item);
                                            const destination =
                                                activeQueue === 'requests'
                                                    ? `help-requests/${id}`
                                                    : activeQueue ===
                                                        'campaigns'
                                                      ? `campaigns/${id}`
                                                      : `organizations/${id}`;
                                            const high =
                                                activeQueue === 'requests' &&
                                                [
                                                    'critical',
                                                    'urgent',
                                                    'high',
                                                ].includes(urgency(item));
                                            const Icon = current.icon;
                                            return (
                                                <button
                                                    key={id ?? index}
                                                    type="button"
                                                    onClick={() =>
                                                        go(
                                                            id
                                                                ? destination
                                                                : current.route,
                                                        )
                                                    }
                                                    className="group flex min-w-0 w-full items-center gap-2.5 px-3 py-3.5 text-left transition hover:bg-[#263442] sm:gap-3 sm:px-5 sm:py-4"
                                                >
                                                    <span
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2A3744]"
                                                        style={{
                                                            color: current.color,
                                                        }}
                                                    >
                                                        <Icon size={18} />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <strong className="block truncate text-[13px] font-semibold">
                                                            {title}
                                                        </strong>
                                                        <span className="mt-1 block truncate text-[11px] text-[#94A2B2]">
                                                            {detail}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={`hidden rounded-md px-2.5 py-1 text-[10px] font-medium sm:inline ${high ? 'bg-[#49352D] text-[#F2B184]' : 'bg-[#2D3C4B] text-[#AFC7E5]'}`}
                                                    >
                                                        {activeQueue ===
                                                        'requests'
                                                            ? urgency(item)
                                                            : 'Pending'}
                                                    </span>
                                                    <ArrowRight
                                                        size={16}
                                                        className="shrink-0 text-[#94A2B2] group-hover:text-white"
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <Empty
                                        title={
                                            activeQueue === 'volunteers' &&
                                            counts.volunteers
                                                ? 'Volunteer applications pending'
                                                : 'Queue is clear'
                                        }
                                        description={
                                            activeQueue === 'volunteers' &&
                                            counts.volunteers
                                                ? 'Open volunteer requests to review applications.'
                                                : 'There are no records in this review category.'
                                        }
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => go(current.route)}
                                className="flex w-full items-center justify-between border-t border-[#303A47] bg-[#202B37]/70 px-5 py-3.5 text-[12px] font-medium text-[#B7CEE7] hover:bg-[#293948]"
                            >
                                View all {current.label.toLowerCase()}
                                <ArrowRight size={15} />
                            </button>
                        </div>
                        <aside className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#34404E] bg-[#1B242E] xl:h-[430px]">
                            <div className="min-w-0 flex-1 p-4 sm:p-6">
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B9C6D5]">
                                    <ClipboardList
                                        size={16}
                                        style={{ color: current.color }}
                                    />
                                    Information desk
                                </div>
                                <p className="mt-3 text-[12px] text-[#94A2B2]">
                                    {information.note}
                                </p>
                                <div className="mt-5 border-b border-[#34404E] pb-5">
                                    <p className="text-[12px] text-[#AFC0D1]">
                                        {information.totalLabel}
                                    </p>
                                    <strong className="mt-1 block text-[37px] font-semibold leading-tight tabular-nums text-[#EEF1F5]">
                                        {loading ? '—' : fmt(information.total)}
                                    </strong>
                                </div>
                                <div className="mt-4 space-y-3.5">
                                    {information.rows.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between gap-3 text-[12px]"
                                        >
                                            <span className="flex min-w-0 items-center gap-2 text-[#B9C6D5]">
                                                <span
                                                    className="h-2 w-2 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                {item.label}
                                            </span>
                                            <strong className="shrink-0 tabular-nums text-[#EEF1F5]">
                                                {loading || item.value === null
                                                    ? '—'
                                                    : fmt(item.value)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                                {!loading &&
                                    information.rows.some(
                                        (item) => item.value === null,
                                    ) && (
                                        <p className="mt-4 text-[11px] leading-4 text-[#8193A6]">
                                            — means this total is not available
                                            from the current API response.
                                        </p>
                                    )}
                            </div>
                            <button
                                type="button"
                                onClick={() => go(current.route)}
                                className="flex w-full items-center justify-between gap-3 border-t border-[#303A47] bg-[#202B37] px-5 py-4 text-left text-[12px] font-medium text-[#B7CEE7] transition hover:bg-[#293948]"
                            >
                                View {information.title.toLowerCase()}{' '}
                                <ArrowRight size={15} />
                            </button>
                        </aside>
                    </div>
                </section>
                <section className="grid min-w-0 items-stretch gap-7 xl:grid-cols-2">
                    <div className="flex min-w-0 flex-col">
                        <Heading
                            eyebrow="Platform health"
                            title="Campaign overview"
                            description="How campaigns are progressing."
                            action={
                                <LinkAction onClick={() => go('campaigns')}>
                                    Manage campaigns
                                </LinkAction>
                            }
                        />
                        <div className="flex min-h-[365px] flex-1 flex-col justify-between rounded-xl border border-[#34404E] bg-[#1B242E] p-5 sm:p-6">
                            <div className="flex flex-wrap items-center justify-center gap-7 sm:justify-start">
                                <div
                                    className="flex h-[150px] w-[150px] shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background: data.totalCampaigns
                                            ? `conic-gradient(${C.teal} 0 ${pct}%, ${C.amber} ${pct}% ${pct + ppct}%, #64748B ${pct + ppct}% 100%)`
                                            : '#34404D',
                                    }}
                                >
                                    <div className="flex h-[114px] w-[114px] flex-col items-center justify-center rounded-full bg-[#1B242E]">
                                        <strong className="text-[32px] font-semibold tabular-nums">
                                            {loading
                                                ? '—'
                                                : fmt(data.totalCampaigns)}
                                        </strong>
                                        <span className="text-[11px] text-[#94A2B2]">
                                            Campaigns
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-0 flex-[1_1_150px] space-y-4">
                                    {segments.map((s) => (
                                        <div
                                            key={s.name}
                                            className="flex justify-between gap-3 text-[12px]"
                                        >
                                            <span className="flex items-center gap-2 text-[#B5C1CF]">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-sm"
                                                    style={{ background: s.c }}
                                                />
                                                {s.name}
                                            </span>
                                            <strong>
                                                {loading ? '—' : fmt(s.n)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-5 border-t border-[#303A47] pt-5">
                                <div>
                                    <p className="text-[11px] text-[#94A2B2]">
                                        Total help requests
                                    </p>
                                    <strong className="mt-1 block text-[20px] font-semibold">
                                        {loading ? '—' : fmt(data.helpRequests)}
                                    </strong>
                                </div>
                                <div>
                                    <p className="text-[11px] text-[#94A2B2]">
                                        Registered users
                                    </p>
                                    <strong className="mt-1 block text-[20px] font-semibold">
                                        {loading ? '—' : fmt(data.users)}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <Heading
                            eyebrow="System intelligence"
                            title="Network distribution"
                            description="Current activity across the platform."
                        />
                        <div className="min-h-[365px] flex-1">
                            <Bars data={data} loading={loading} />
                        </div>
                    </div>
                </section>
                <section>
                    <Heading
                        title="Recent activity"
                        description="Latest recorded administrative actions."
                    />
                    <div className="rounded-xl border border-[#34404E] bg-[#1B242E] px-5 py-2">
                        {loading ? (
                            <div className="space-y-3 py-5">
                                {Array.from({ length: 4 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="h-14 animate-pulse rounded-lg bg-[#283543]"
                                    />
                                ))}
                            </div>
                        ) : data.activity.length ? (
                            <div className="divide-y divide-[#303A47]">
                                {data.activity.slice(0, 5).map((item, i) => {
                                    const headline =
                                        item?.title ||
                                        item?.action ||
                                        item?.description ||
                                        'Administrative update';
                                    const desc =
                                        item?.title || item?.action
                                            ? item?.description
                                            : '';
                                    return (
                                        <div
                                            key={item?.id ?? i}
                                            className="flex items-start gap-3 py-3.5"
                                        >
                                            <span className="mt-0.5 rounded-lg bg-[#293746] p-2.5 text-[#9CB6D5]">
                                                <Activity size={16} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] font-semibold">
                                                    {headline}
                                                </p>
                                                {desc && (
                                                    <p className="mt-1 truncate text-[11px] text-[#94A2B2]">
                                                        {desc}
                                                    </p>
                                                )}
                                                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#8294A7]">
                                                    <CalendarDays size={11} />
                                                    {formatDate(
                                                        item?.created_at ||
                                                            item?.createdAt ||
                                                            item?.timestamp ||
                                                            item?.date,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <Empty
                                title="No recent activity"
                                description="Administrative actions will appear here when available."
                            />
                        )}
                    </div>
                </section>
                <section>
                    <Heading
                        title="Your workspace"
                        description="Administrative tools and account access."
                    />
                    <div className="grid min-w-0 items-stretch gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]">
                        <div className="min-w-0">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="!m-0 !text-[16px] !font-semibold text-[#EEF1F5]">
                                        Action center
                                    </h3>
                                </div>
                                <span className="text-[11px] text-[#94A2B2]">
                                    6 destinations
                                </span>
                            </div>
                            <div className="grid min-w-0 gap-3 min-[520px]:grid-cols-2">
                                {actions.map((a) => {
                                    const Icon = a.icon;
                                    return (
                                        <button
                                            key={a.name}
                                            type="button"
                                            onClick={() => go(a.path)}
                                            className="group flex min-w-0 items-center gap-3 rounded-lg bg-[#1B242E] px-4 py-4 text-left transition hover:bg-[#263442] sm:px-5"
                                        >
                                            <span
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                                                style={{
                                                    backgroundColor: `${a.c}18`,
                                                    color: a.c,
                                                }}
                                            >
                                                <Icon size={19} />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[13px] font-semibold text-[#EEF1F5]">
                                                    {a.name}
                                                </span>
                                                <span className="mt-1 block truncate text-[11px] text-[#94A2B2]">
                                                    {a.desc}
                                                </span>
                                            </span>
                                            <ArrowUpRight
                                                size={15}
                                                className="shrink-0 text-[#75879A] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <aside className="flex min-w-0 flex-col justify-between border-l-2 border-[#40586A] bg-[#1B242E] px-5 py-6 sm:px-7">
                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9EB8D0]">
                                        Signed in as
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[11px] text-[#8CC6BC]">
                                        <ShieldCheck size={14} />
                                        Administrator
                                    </span>
                                </div>
                                <div className="mt-6 flex min-w-0 flex-wrap items-center gap-4">
                                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#354A5F] text-[18px] font-semibold">
                                        {adminPhoto ? (
                                            <img
                                                src={adminPhoto}
                                                alt=""
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        'none';
                                                }}
                                            />
                                        ) : (
                                            initials
                                        )}
                                    </span>
                                    <div className="min-w-0">
                                        <strong className="block truncate text-[16px] font-semibold text-[#EEF1F5]">
                                            {adminName}
                                        </strong>
                                        <span className="mt-1 block truncate text-[11px] text-[#94A2B2]">
                                            {admin?.email ||
                                                'Platform administration'}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-6 text-[12px] leading-5 text-[#A8B7C6]">
                                    Manage your personal information and account
                                    security.
                                </p>
                            </div>
                            <div className="mt-7 space-y-1 border-t border-[#34404E] pt-3">
                                <button
                                    type="button"
                                    onClick={() => go('profile')}
                                    className="group flex w-full items-center gap-3 px-2 py-3 text-left text-[12px] font-medium text-[#DDE7F1] transition hover:bg-[#263442]"
                                >
                                    <UserCircle2
                                        size={17}
                                        className="text-[#88A9D7]"
                                    />
                                    <span className="flex-1">My profile</span>
                                    <ArrowUpRight
                                        size={15}
                                        className="text-[#94A2B2]"
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go('security')}
                                    className="group flex w-full items-center gap-3 px-2 py-3 text-left text-[12px] font-medium text-[#DDE7F1] transition hover:bg-[#263442]"
                                >
                                    <LockKeyhole
                                        size={17}
                                        className="text-[#8CC6BC]"
                                    />
                                    <span className="flex-1">
                                        Password & security
                                    </span>
                                    <ArrowUpRight
                                        size={15}
                                        className="text-[#94A2B2]"
                                    />
                                </button>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>
        </main>
    );
}
