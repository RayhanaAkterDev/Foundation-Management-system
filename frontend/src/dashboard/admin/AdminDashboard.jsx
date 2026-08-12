import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Building2,
    CheckCircle2,
    ChevronRight,
    Clock3,
    HandCoins,
    HeartHandshake,
    Megaphone,
    ShieldCheck,
    UserCheck,
    Users,
    AlertCircle,
} from 'lucide-react';

import ActivityFeed from '@/components/dashboard/ActivityFeed';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/dashboard',
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to load admin dashboard.',
                    );
                }

                setDashboardData(data);
            } catch (err) {
                setError(
                    err.message ||
                        'Something went wrong while loading the dashboard.',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const stats = dashboardData?.stats || {};
    const pendingRequests = dashboardData?.pendingHelpRequests || [];
    const pendingVerifications = dashboardData?.pendingVerifications || [];
    const recentActivity = dashboardData?.recentActivity || [];

    const totalPending = pendingRequests.length + pendingVerifications.length;

    const urgentCount = pendingRequests.filter(
        (request) =>
            String(request.priority || request.urgency || '').toLowerCase() ===
            'urgent',
    ).length;

    const platformStats = [
        {
            label: 'Users',
            value: Number(stats.totalUsers || 0).toLocaleString(),
            icon: Users,
        },
        {
            label: 'Organizations',
            value: Number(stats.totalOrganizations || 0).toLocaleString(),
            icon: Building2,
        },
        {
            label: 'Campaigns',
            value: Number(stats.activeCampaigns || 0).toLocaleString(),
            icon: Megaphone,
        },
        {
            label: 'Donations',
            value: `৳${Number(stats.totalDonations || 0).toLocaleString()}`,
            icon: HandCoins,
        },
        {
            label: 'Volunteers',
            value: Number(stats.totalVolunteers || 0).toLocaleString(),
            icon: UserCheck,
        },
        {
            label: 'Help requests',
            value: Number(stats.totalHelpRequests || 0).toLocaleString(),
            icon: HeartHandshake,
        },
    ];

    const managementActions = [
        {
            title: 'Help requests',
            description: 'Review and manage incoming assistance requests.',
            count: pendingRequests.length,
            icon: HeartHandshake,
            accent: 'amber',
            path: '/dashboard/admin/help-requests',
        },
        {
            title: 'Organization verification',
            description: 'Review organizations waiting for approval.',
            count: pendingVerifications.length,
            icon: ShieldCheck,
            accent: 'teal',
            path: '/dashboard/admin/verification',
        },
        {
            title: 'Campaigns',
            description: 'Monitor campaigns and organizational activity.',
            icon: Megaphone,
            accent: 'violet',
            path: '/dashboard/admin/campaigns',
        },
        {
            title: 'Users',
            description: 'Manage individuals and organizations.',
            icon: Users,
            accent: 'blue',
            path: '/dashboard/admin/users',
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-120 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    Loading admin dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl border border-red-200 bg-red-50 px-6 py-5">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <div>
                        <h2 className="text-sm font-semibold text-red-700">
                            Unable to load dashboard
                        </h2>

                        <p className="mt-1 text-sm text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* =========================================================
                COMMAND HEADER
            ========================================================== */}

            <section className="relative overflow-hidden border border-primary/10 bg-surface">
                <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-primary/[0.035] lg:block" />

                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-32 border-primary/[0.035]" />

                <div className="relative grid lg:grid-cols-[1fr_auto]">
                    <div className="px-6 py-8 sm:px-8 sm:py-9 lg:px-10">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary">
                                Administration
                            </span>
                        </div>

                        <h1 className="mt-3 max-w-2xl font-fraunces text-[32px] font-semibold tracking-[-0.045em] text-text-primary sm:text-[40px]">
                            Good to see you.
                            <br />
                            <span className="text-primary">
                                Here is what needs attention.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-[12px] leading-6 text-text-secondary sm:text-[13px]">
                            Monitor the platform, review pending work, and keep
                            Stand For People moving forward.
                        </p>
                    </div>

                    <div className="relative flex min-w-57.5 flex-col justify-between border-t border-border px-6 py-6 sm:px-8 lg:border-l lg:border-t-0 lg:px-8">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                                System
                            </span>

                            <Activity className="h-4 w-4 text-primary" />
                        </div>

                        <div className="mt-7">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>

                                <span className="text-[13px] font-semibold text-text-primary">
                                    Operational
                                </span>
                            </div>

                            <p className="mt-1.5 text-[9.5px] text-text-secondary">
                                All core platform services are running.
                            </p>
                        </div>

                        <div className="mt-7 border-t border-border pt-4">
                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary">
                                Pending workload
                            </p>

                            <p className="mt-1 font-fraunces text-[30px] font-semibold tracking-tight text-text-primary">
                                {totalPending}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                ATTENTION BAR
            ========================================================== */}

            <section className="border-y border-border">
                <div className="flex flex-col gap-5 px-1 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center bg-amber-50 text-amber-600">
                            <Clock3 className="h-4.5 w-4.5" />
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-700">
                                Requires attention
                            </p>

                            <p className="mt-1 text-[12px] font-semibold text-text-primary">
                                {totalPending > 0
                                    ? `${totalPending} items are waiting for review`
                                    : 'Everything is currently up to date'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 text-[10px]">
                        <div>
                            <span className="font-semibold text-text-primary">
                                {pendingRequests.length}
                            </span>{' '}
                            <span className="text-text-secondary">
                                help requests
                            </span>
                        </div>

                        <div className="h-4 w-px bg-border" />

                        <div>
                            <span className="font-semibold text-text-primary">
                                {pendingVerifications.length}
                            </span>{' '}
                            <span className="text-text-secondary">
                                verifications
                            </span>
                        </div>

                        {urgentCount > 0 && (
                            <>
                                <div className="h-4 w-px bg-border" />

                                <div className="font-semibold text-red-600">
                                    {urgentCount} urgent
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* =========================================================
                WORK QUEUES
            ========================================================== */}

            <section>
                <SectionHeading
                    eyebrow="Work queues"
                    title="Review what is waiting"
                    description="The most important actions currently requiring administrative review."
                />

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    {/* Help Requests */}
                    <QueuePanel
                        title="Help requests"
                        description="People waiting for assistance requests to be reviewed."
                        count={pendingRequests.length}
                        icon={HeartHandshake}
                        accent="amber"
                        path="/dashboard/admin/help-requests"
                        navigate={navigate}
                    >
                        {pendingRequests.length === 0 ? (
                            <EmptyQueue
                                icon={CheckCircle2}
                                message="No help requests are waiting."
                            />
                        ) : (
                            <div>
                                {pendingRequests.slice(0, 4).map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center gap-4 border-t border-border px-5 py-4 sm:px-6"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-amber-50 text-amber-600">
                                            <HeartHandshake className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[11px] font-semibold text-text-primary">
                                                {request.title}
                                            </p>

                                            <p className="mt-1 truncate text-[9px] text-text-secondary">
                                                {request.category ||
                                                    'General assistance'}

                                                {request.district
                                                    ? ` · ${request.district}`
                                                    : ''}
                                            </p>
                                        </div>

                                        <StatusBadge status={request.status} />
                                    </div>
                                ))}

                                {pendingRequests.length > 4 && (
                                    <div className="border-t border-border px-5 py-3.5 sm:px-6">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    '/dashboard/admin/help-requests',
                                                )
                                            }
                                            className="text-[10px] font-bold text-amber-700 transition-colors hover:text-amber-800"
                                        >
                                            +{pendingRequests.length - 4} more
                                            requests
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </QueuePanel>

                    {/* Organization Verification */}
                    <QueuePanel
                        title="Organization verification"
                        description="Organizations waiting to be reviewed and approved."
                        count={pendingVerifications.length}
                        icon={ShieldCheck}
                        accent="teal"
                        path="/dashboard/admin/verification"
                        navigate={navigate}
                    >
                        {pendingVerifications.length === 0 ? (
                            <EmptyQueue
                                icon={CheckCircle2}
                                message="Verification queue is clear."
                            />
                        ) : (
                            <div>
                                {pendingVerifications
                                    .slice(0, 4)
                                    .map((organization) => (
                                        <div
                                            key={organization.id}
                                            className="flex items-center gap-4 border-t border-border px-5 py-4 sm:px-6"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/10 text-primary">
                                                <Building2 className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[11px] font-semibold text-text-primary">
                                                    {organization.name}
                                                </p>

                                                <p className="mt-1 truncate text-[9px] text-text-secondary">
                                                    {organization.organization_type ||
                                                        'Organization'}
                                                </p>
                                            </div>

                                            <StatusBadge
                                                status={
                                                    organization.verification_status
                                                }
                                            />
                                        </div>
                                    ))}

                                {pendingVerifications.length > 4 && (
                                    <div className="border-t border-border px-5 py-3.5 sm:px-6">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    '/dashboard/admin/verification',
                                                )
                                            }
                                            className="text-[10px] font-bold text-primary transition-colors hover:text-primary-hover"
                                        >
                                            +{pendingVerifications.length - 4}{' '}
                                            more organizations
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </QueuePanel>
                </div>
            </section>

            {/* =========================================================
                PLATFORM OVERVIEW
            ========================================================== */}

            <section>
                <SectionHeading
                    eyebrow="Platform overview"
                    title="A snapshot of the platform"
                    description="Current totals across the Stand For People ecosystem."
                />

                <div className="mt-6 overflow-hidden border border-border bg-surface">
                    {/* Overview header strip */}
                    <div className="flex items-center justify-between border-b border-border bg-surface-soft px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-3.5 w-3.5 text-primary" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                Current platform totals
                            </span>
                        </div>

                        <span className="hidden text-[9px] text-text-secondary sm:block">
                            Live data
                        </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                        {platformStats.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className={`
                                        group
                                        relative
                                        px-5
                                        py-6
                                        transition-colors
                                        hover:bg-surface-soft
                                        sm:px-6

                                        ${
                                            index < platformStats.length - 1
                                                ? 'border-b border-border sm:border-r'
                                                : ''
                                        }

                                        ${
                                            index === 1
                                                ? 'sm:border-r-0 lg:border-r'
                                                : ''
                                        }

                                        ${
                                            index === 2
                                                ? 'sm:border-r-0 lg:border-r'
                                                : ''
                                        }

                                        ${index === 3 ? 'lg:border-r' : ''}

                                        ${index === 4 ? 'sm:border-r' : ''}
                                    `}
                                >
                                    <span className="absolute left-0 top-0 h-0.5 w-8 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />

                                    <div className="flex items-center justify-between">
                                        <div className="flex h-8 w-8 items-center justify-center bg-primary/[0.07] text-primary">
                                            <Icon className="h-3.75 w-3.75" />
                                        </div>

                                        <ArrowUpRight className="h-3.5 w-3.5 text-transparent transition-colors group-hover:text-primary" />
                                    </div>

                                    <p className="mt-5 font-fraunces text-[25px] font-semibold tracking-[-0.035em] text-text-primary">
                                        {item.value}
                                    </p>

                                    <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.13em] text-text-secondary">
                                        {item.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
                ADMINISTRATION + ACTIVITY
            ========================================================== */}

            <section className="border-t-[3px] border-primary/10 pt-9">
                <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
                    {/* Administration */}
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <SectionHeading
                                eyebrow="Administration"
                                title="Manage the platform"
                                description="Jump directly into the areas that keep the platform running."
                            />

                            <div className="hidden h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary sm:flex">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-6 overflow-hidden border border-border bg-surface">
                            {/* Management header */}
                            <div className="border-b border-border bg-surface-soft px-5 py-3.5 sm:px-6">
                                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                    Management areas
                                </span>
                            </div>

                            {/* Management actions */}
                            <div className="divide-y divide-border">
                                {managementActions.map((action) => {
                                    const Icon = action.icon;

                                    return (
                                        <button
                                            key={action.title}
                                            type="button"
                                            onClick={() =>
                                                navigate(action.path)
                                            }
                                            className="group relative flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-soft sm:px-6"
                                        >
                                            <span className="absolute bottom-0 left-0 top-0 w-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />

                                            <div
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    transition-transform
                                                    duration-200
                                                    group-hover:scale-105
                                                    ${
                                                        action.accent ===
                                                        'amber'
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : action.accent ===
                                                                'teal'
                                                              ? 'bg-primary/10 text-primary'
                                                              : action.accent ===
                                                                  'violet'
                                                                ? 'bg-violet-50 text-violet-600'
                                                                : 'bg-blue-50 text-blue-600'
                                                    }
                                                `}
                                            >
                                                <Icon className="h-4.25 w-4.25" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-[11.5px] font-semibold text-text-primary">
                                                        {action.title}
                                                    </h3>

                                                    {typeof action.count ===
                                                        'number' &&
                                                        action.count > 0 && (
                                                            <span
                                                                className={`
                                                                    min-w-5
                                                                    rounded-full
                                                                    px-1.5
                                                                    py-0.5
                                                                    text-center
                                                                    text-[8px]
                                                                    font-bold
                                                                    ${
                                                                        action.accent ===
                                                                        'amber'
                                                                            ? 'bg-amber-100 text-amber-700'
                                                                            : 'bg-primary/10 text-primary'
                                                                    }
                                                                `}
                                                            >
                                                                {action.count}
                                                            </span>
                                                        )}
                                                </div>

                                                <p className="mt-1 truncate text-[9px] text-text-secondary">
                                                    {action.description}
                                                </p>
                                            </div>

                                            <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <div className="flex items-end justify-between border-b border-border pb-5">
                            <SectionHeading
                                eyebrow="Live record"
                                title="Recent activity"
                                description="Latest actions and events across the platform."
                            />

                            <button
                                type="button"
                                className="hidden items-center gap-1 text-[9px] font-bold text-primary transition-colors hover:text-primary-hover sm:flex"
                            >
                                View all
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="pt-5">
                            <ActivityFeed
                                items={recentActivity}
                                title="Platform Activity"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

/* =============================================================
   SECTION HEADING
============================================================= */

const SectionHeading = ({ eyebrow, title, description }) => {
    return (
        <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
            </span>

            <h2 className="mt-1.5 font-fraunces text-[21px] font-semibold tracking-[-0.02em] text-text-primary">
                {title}
            </h2>

            {description && (
                <p className="mt-1.5 max-w-xl text-[10px] leading-5 text-text-secondary">
                    {description}
                </p>
            )}
        </div>
    );
};

/* =============================================================
   QUEUE PANEL
============================================================= */

const QueuePanel = ({
    title,
    description,
    count,
    icon: Icon,
    accent,
    path,
    navigate,
    children,
}) => {
    const isAmber = accent === 'amber';

    return (
        <div className="overflow-hidden border border-border bg-surface">
            <div className="flex items-start justify-between gap-5 px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                    <div
                        className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            ${
                                isAmber
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'bg-primary/10 text-primary'
                            }
                        `}
                    >
                        <Icon className="h-4.25 w-4.25" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-text-primary">
                            {title}
                        </h3>

                        <p className="mt-1 text-[9.5px] leading-5 text-text-secondary">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <p
                        className={`
                            font-fraunces
                            text-[26px]
                            font-semibold
                            tracking-tight
                            ${isAmber ? 'text-amber-700' : 'text-primary'}
                        `}
                    >
                        {count}
                    </p>

                    <p className="text-[7.5px] font-bold uppercase tracking-[0.14em] text-text-secondary/60">
                        pending
                    </p>
                </div>
            </div>

            {children}

            <div className="border-t border-border px-5 py-3.5 sm:px-6">
                <button
                    type="button"
                    onClick={() => navigate(path)}
                    className={`
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        text-[9.5px]
                        font-bold
                        ${isAmber ? 'text-amber-700' : 'text-primary'}
                    `}
                >
                    <span>Open queue</span>

                    <span className="flex items-center gap-1">
                        View all
                        <ArrowUpRight
                            className="
                                h-3.5
                                w-3.5
                                transition-transform
                                group-hover:-translate-y-0.5
                                group-hover:translate-x-0.5
                            "
                        />
                    </span>
                </button>
            </div>
        </div>
    );
};

/* =============================================================
   EMPTY QUEUE
============================================================= */

const EmptyQueue = ({ icon: Icon, message }) => {
    return (
        <div className="flex items-center gap-3 border-t border-border px-5 py-5 sm:px-6">
            <Icon className="h-4 w-4 text-emerald-500" />

            <p className="text-[10px] font-medium text-text-secondary">
                {message}
            </p>
        </div>
    );
};

export default AdminDashboard;
