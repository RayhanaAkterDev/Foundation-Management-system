import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    Heart,
    HeartHandshake,
    HandCoins,
    MapPin,
    Megaphone,
    Sparkles,
    Users,
} from 'lucide-react';

import { getIndividualDashboard } from './individualDashboardApi';
import StatusBadge from '@/components/dashboard/StatusBadge';

const CATEGORY = {
    Education: {
        accent: '#0f766e',
        soft: 'bg-blue-50 text-blue-700',
    },
    'Food Assistance': {
        accent: '#0f766e',
        soft: 'bg-amber-50 text-amber-700',
    },
    'Disaster Relief': {
        accent: '#0f766e',
        soft: 'bg-orange-50 text-orange-700',
    },
    Healthcare: {
        accent: '#0f766e',
        soft: 'bg-emerald-50 text-emerald-700',
    },
    Livelihood: {
        accent: '#0f766e',
        soft: 'bg-purple-50 text-purple-700',
    },
};

const getCategory = (name) =>
    CATEGORY[name] || {
        accent: '#64748b',
        soft: 'bg-slate-100 text-slate-600',
    };

const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-BD', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';

    return 'Good evening';
};

const getDaysLeft = (deadline) => {
    if (!deadline) return 0;

    return Math.max(
        0,
        Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)),
    );
};

const IndividualDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getIndividualDashboard();

                setDashboard(data);
            } catch (err) {
                console.error('Individual dashboard error:', err);

                setError(err.message || 'Unable to load your dashboard.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-full bg-[#f8f8f5] text-[#17211e]">
                <div className="mx-auto max-w-360 px-5 py-10 sm:px-8 lg:px-10">
                    <p className="text-sm text-slate-400">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-full bg-[#f8f8f5] text-[#17211e]">
                <div className="mx-auto max-w-360 px-5 py-10 sm:px-8 lg:px-10">
                    <p className="text-sm font-semibold text-red-600">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    const individualUser = dashboard?.user || {
        name: 'User',
        district: null,
        memberSince: null,
    };

    const donationSummary = dashboard?.donationSummary || {
        totalDonated: 0,
        donationCount: 0,
    };

    const volunteerSummary = dashboard?.volunteerSummary || {
        totalHours: 0,
        activitiesCount: 0,
    };

    const helpRequests = dashboard?.helpRequests || [];
    const activeCampaigns = dashboard?.activeCampaigns || [];
    const individualActivity = dashboard?.activity || [];

    const firstName = individualUser.name?.split(' ')[0] || 'User';

    const currentRequest = helpRequests[0] || null;
    const featuredCampaign = activeCampaigns[0] || null;

    const campaignProgress = featuredCampaign
        ? Math.min(featuredCampaign.progress || 0, 100)
        : 0;

    /*
     * ------------------------------------------------------------
     * TEMPORARY STATIC DATA
     * ------------------------------------------------------------
     * These are intentionally kept static for the UI phase.
     * We will replace these values with actual API data later.
     */

    const helpRequestSummary = {
        total: 3,
        underReview: 1,
        inProgress: 1,
        completed: 1,
    };

    const recentUpdates = [
        {
            id: 1,
            title: 'Your help request was reviewed',
            description: 'Your request has moved to the next stage.',
            date: '2 hours ago',
        },
        {
            id: 2,
            title: 'Donation received successfully',
            description: 'Your recent contribution has been recorded.',
            date: 'Yesterday',
        },
        {
            id: 3,
            title: 'Campaign update available',
            description: 'A campaign you supported has made progress.',
            date: '3 days ago',
        },
    ];

    return (
        <div className="min-h-full bg-[#f8f8f5] text-[#17211e]">
            <div className="mx-auto max-w-360 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                {/* ============================================================
                    HEADER
                ============================================================ */}

                <header className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/individual')}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center bg-primary transition duration-200 group-hover:bg-primary-hover">
                            <Heart className="h-4 w-4 fill-white text-white" />
                        </div>

                        <div className="text-left">
                            <p className="text-xs font-bold tracking-tight text-[#17211e]">
                                Stand For People
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                Individual space
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/dashboard/individual/profile')
                        }
                        className="group flex items-center gap-3"
                    >
                        <div className="hidden text-right sm:block">
                            <p className="text-xs font-semibold text-slate-700">
                                {individualUser.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                Community member
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9dfd9] bg-[#e4f0ec] font-['Fraunces'] text-sm font-semibold text-primary transition duration-200 group-hover:scale-105">
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                    </button>
                </header>

                {/* ============================================================
                    HERO
                ============================================================ */}

                <section className="relative mt-8 border-y border-slate-200">
                    <div className="grid min-h-107.5 lg:grid-cols-[1.08fr_0.92fr]">
                        <div className="flex flex-col justify-center py-12 lg:pr-16 lg:py-16">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-primary" />

                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                                    {getGreeting()}, {firstName}
                                </span>
                            </div>

                            <h1 className="mt-6 max-w-3xl font-['Fraunces'] text-[48px] font-semibold leading-[0.98] tracking-[-0.045em] text-[#17211e] sm:text-[62px] lg:text-[72px]">
                                Show up for
                                <br />
                                <span className="text-primary">
                                    something bigger.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-500">
                                Ask for support when you need it. Give when you
                                can. Find causes worth caring about and become
                                part of a community that looks out for one
                                another.
                            </p>

                            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/help-requests',
                                        )
                                    }
                                    className="group inline-flex items-center gap-2.5 bg-primary px-5 py-3 text-xs font-bold text-white transition duration-200 hover:bg-primary-hover"
                                >
                                    <HeartHandshake className="h-4 w-4" />
                                    Request support
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/campaigns',
                                        )
                                    }
                                    className="group inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition duration-200 hover:text-primary"
                                >
                                    Explore causes
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                            </div>
                        </div>

                        {/* Hero visual */}

                        <div className="relative hidden overflow-hidden border-l border-slate-200 lg:block">
                            <div className="absolute inset-0">
                                <div className="absolute bottom-0 left-[14%] top-0 w-px bg-slate-200/70" />

                                <div className="absolute left-[18%] top-[13%] h-52 w-52 rounded-full border border-primary/20" />

                                <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-primary/8" />

                                <div className="absolute -bottom-22.5 left-[8%] h-72 w-72 rounded-full border-38 border-amber-400/10" />

                                <div className="absolute bottom-[18%] right-[16%] h-24 w-24 rounded-full bg-primary/10" />

                                <div className="absolute left-[48%] top-[41%] h-20 w-20 rounded-full border border-primary/15" />
                            </div>

                            <div className="absolute left-1/2 top-[38%] flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#edf4f1]">
                                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary shadow-[0_20px_60px_rgba(15,118,110,0.15)]">
                                    <Heart className="h-10 w-10 fill-white text-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-10 max-w-77.5">
                                <span className="block h-px w-8 bg-primary" />

                                <p className="mt-4 font-['Fraunces'] text-[29px] font-semibold leading-[1.1] tracking-tight text-[#17211e]">
                                    Communities become stronger when people
                                    choose to care.
                                </p>

                                <p className="mt-3 text-[11px] leading-5 text-slate-400">
                                    Small actions can reach further than we
                                    imagine.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTRIBUTION */}

                <section className="mt-10 border-y border-slate-200 bg-[#f2f5f1]">
                    <div className="grid lg:grid-cols-[0.9fr_2.1fr]">
                        <div className="px-6 py-8 sm:px-8 lg:px-9 lg:py-9">
                            <Eyebrow>Your contribution</Eyebrow>

                            <h2 className="mt-3 font-['Fraunces'] text-[28px] font-semibold leading-tight tracking-tight text-[#17211e]">
                                The ways you've
                                <br className="hidden lg:block" />
                                shown up.
                            </h2>

                            <p className="mt-3 max-w-xs text-xs leading-5 text-slate-400">
                                Every contribution becomes part of a larger
                                story.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-3 items-center">
                            <ImpactStat
                                value={
                                    <>
                                        ৳
                                        {donationSummary.totalDonated.toLocaleString()}
                                    </>
                                }
                                label="Total contributed"
                            />

                            <ImpactStat
                                value={volunteerSummary.totalHours}
                                label="Hours volunteered"
                            />

                            <ImpactStat
                                value={
                                    donationSummary.donationCount +
                                    volunteerSummary.activitiesCount
                                }
                                label="Acts of support"
                            />
                        </div>
                    </div>
                </section>

                {/* ============================================================
                    MAIN CONTENT
                ============================================================ */}

                <div className="mt-20 grid gap-16 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-16">
                    <main className="min-w-0">
                        {/* ====================================================
                            HELP REQUEST SUMMARY
                        ==================================================== */}

                        <section className="border-b border-slate-200 pb-16">
                            <SectionHeader
                                eyebrow="Your support"
                                title="Request overview"
                                action="View all requests"
                                onClick={() =>
                                    navigate(
                                        '/dashboard/individual/help-requests',
                                    )
                                }
                            />

                            <div className="mt-9 grid border-y border-slate-200 sm:grid-cols-4">
                                <HelpRequestStat
                                    value={helpRequestSummary.total}
                                    label="Total requests"
                                />

                                <HelpRequestStat
                                    value={helpRequestSummary.underReview}
                                    label="Under review"
                                />

                                <HelpRequestStat
                                    value={helpRequestSummary.inProgress}
                                    label="In progress"
                                />

                                <HelpRequestStat
                                    value={helpRequestSummary.completed}
                                    label="Completed"
                                />
                            </div>
                        </section>

                        {/* ====================================================
                            CURRENT REQUEST
                        ==================================================== */}

                        <section className="mt-20 border-b border-slate-200 pb-20">
                            <SectionHeader
                                eyebrow="Your support"
                                title="Current request"
                                action="View all requests"
                                onClick={() =>
                                    navigate(
                                        '/dashboard/individual/help-requests',
                                    )
                                }
                            />

                            {currentRequest ? (
                                <div className="relative mt-9">
                                    <div className="absolute bottom-0 left-0 top-0 w-0.75 bg-primary" />

                                    <div className="grid lg:grid-cols-[minmax(0,1fr)_230px]">
                                        {/* Request content */}

                                        <div className="border-y border-r-0 border-slate-200 bg-transparent py-9 pl-7 pr-0 lg:border-r lg:py-10 lg:pr-10">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 text-[10px] font-bold ${
                                                        getCategory(
                                                            currentRequest.category,
                                                        ).soft
                                                    }`}
                                                >
                                                    {currentRequest.category}
                                                </span>

                                                <StatusBadge
                                                    status={
                                                        currentRequest.status
                                                    }
                                                />
                                            </div>

                                            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                                Submitted{' '}
                                                {formatDate(
                                                    currentRequest.submittedDate,
                                                )}
                                            </p>

                                            <h3 className="mt-2.5 max-w-2xl font-['Fraunces'] text-[29px] font-semibold leading-[1.15] tracking-tight text-[#17211e]">
                                                {currentRequest.title}
                                            </h3>

                                            {currentRequest.notes && (
                                                <p className="mt-4 max-w-2xl text-[13px] leading-6 text-slate-500">
                                                    {currentRequest.notes}
                                                </p>
                                            )}

                                            <RequestProgress />
                                        </div>

                                        {/* Request status */}

                                        <div className="flex flex-col justify-between border-y border-slate-200 bg-[#edf4f1] px-7 py-9 lg:border-l-0">
                                            <div>
                                                <Eyebrow muted>
                                                    Request status
                                                </Eyebrow>

                                                <div className="mt-4">
                                                    <StatusBadge
                                                        status={
                                                            currentRequest.status
                                                        }
                                                    />
                                                </div>

                                                <p className="mt-5 max-w-45 text-[11px] leading-5 text-slate-500">
                                                    We'll keep you updated as
                                                    your request moves forward.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        '/dashboard/individual/help-requests',
                                                    )
                                                }
                                                className="group mt-8 inline-flex w-fit items-center gap-2 text-xs font-bold text-primary"
                                            >
                                                View request
                                                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-9 border-l-[3px] border-primary py-4 pl-6">
                                    <h3 className="font-['Fraunces'] text-xl font-semibold text-[#17211e]">
                                        Nothing here yet.
                                    </h3>

                                    <p className="mt-2 max-w-lg text-xs leading-6 text-slate-400">
                                        If you need support, submit a request
                                        and our team will review it with care.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                '/dashboard/individual/help-requests',
                                            )
                                        }
                                        className="group mt-5 inline-flex items-center gap-2 text-xs font-bold text-primary"
                                    >
                                        Submit a request
                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* ====================================================
                            FEATURED CAMPAIGN
                        ==================================================== */}

                        {featuredCampaign && (
                            <section className="mt-20 border-b border-slate-200 pb-20">
                                <SectionHeader
                                    eyebrow="Discover a cause"
                                    title="Worth standing behind"
                                    action="Browse campaigns"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/campaigns',
                                        )
                                    }
                                />

                                <article className="mt-9 grid overflow-hidden lg:grid-cols-[0.82fr_1.18fr]">
                                    {/* Editorial visual */}

                                    <div className="relative min-h-97.5 overflow-hidden bg-[#e8f0ed] p-8 sm:p-10">
                                        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full border-28 border-primary/10" />

                                        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-46 border-amber-400/10" />

                                        <div className="absolute right-[14%] top-[18%] h-20 w-20 rounded-full bg-primary/10" />

                                        <div className="relative flex h-full flex-col justify-between">
                                            <span
                                                className={`w-fit px-3 py-1.5 text-[10px] font-bold ${
                                                    getCategory(
                                                        featuredCampaign.category,
                                                    ).soft
                                                }`}
                                            >
                                                {featuredCampaign.category}
                                            </span>

                                            <div>
                                                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                                    <Clock3 className="h-3.5 w-3.5" />
                                                    {getDaysLeft(
                                                        featuredCampaign.deadline,
                                                    )}{' '}
                                                    days remaining
                                                </div>

                                                <p className="mt-5 max-w-[320px] font-['Fraunces'] text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#17211e]">
                                                    Change begins when someone
                                                    decides to show up.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campaign */}

                                    <div className="flex min-h-97.5 flex-col justify-between bg-[#17211e] px-8 py-9 text-white sm:px-10 sm:py-11">
                                        <div>
                                            <Eyebrow light>
                                                Active campaign
                                            </Eyebrow>

                                            <h3 className="mt-5 max-w-2xl font-['Fraunces'] text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]">
                                                {featuredCampaign.title}
                                            </h3>

                                            <p className="mt-5 max-w-xl text-[13px] leading-6 text-white/50">
                                                Support this campaign and help
                                                bring meaningful assistance
                                                closer to the people who need it
                                                most.
                                            </p>
                                        </div>

                                        <div className="mt-12">
                                            <div className="flex items-end justify-between gap-6">
                                                <div>
                                                    <p className="font-['Fraunces'] text-[38px] font-semibold leading-none tracking-[-0.03em]">
                                                        ৳
                                                        {featuredCampaign.raised.toLocaleString()}
                                                    </p>

                                                    <p className="mt-2 text-[11px] text-white/40">
                                                        of ৳
                                                        {featuredCampaign.goal.toLocaleString()}{' '}
                                                        goal
                                                    </p>
                                                </div>

                                                <p className="text-xl font-bold text-[#79c2b7]">
                                                    {campaignProgress}%
                                                </p>
                                            </div>

                                            <div className="mt-5 h-0.75 overflow-hidden bg-white/10">
                                                <div
                                                    className="h-full bg-[#79c2b7]"
                                                    style={{
                                                        width: `${campaignProgress}%`,
                                                    }}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        '/dashboard/individual/campaigns',
                                                    )
                                                }
                                                className="group mt-7 inline-flex items-center gap-3 border-b border-white/20 pb-2 text-xs font-bold text-white transition hover:border-[#79c2b7] hover:text-[#79c2b7]"
                                            >
                                                Support this cause
                                                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </section>
                        )}

                        {/* ====================================================
                            ACTIVITY
                        ==================================================== */}

                        <section className="mt-20">
                            <SectionHeader
                                eyebrow="Your journey"
                                title="Recent activity"
                            />

                            <div className="mt-9">
                                {individualActivity?.length ? (
                                    individualActivity
                                        .slice(0, 6)
                                        .map((activity, index) => (
                                            <div
                                                key={
                                                    activity.id ||
                                                    `activity-${index}`
                                                }
                                                className="group grid grid-cols-[34px_minmax(0,1fr)_auto] gap-5 border-b border-slate-200 py-5 first:border-t"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf4f1] text-primary">
                                                    <Check className="h-3.5 w-3.5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-semibold leading-5 text-slate-700">
                                                        {activity.title ||
                                                            activity.description ||
                                                            activity.action}
                                                    </p>

                                                    {activity.date && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                                                            <CalendarDays className="h-3.5 w-3.5" />

                                                            {formatDate(
                                                                activity.date,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <ChevronRight className="mt-1 h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                                            </div>
                                        ))
                                ) : (
                                    <p className="border-y border-slate-200 py-8 text-xs text-slate-400">
                                        Your SP activity will appear here.
                                    </p>
                                )}
                            </div>
                        </section>
                    </main>

                    {/* ========================================================
                        SIDEBAR
                    ======================================================== */}

                    <aside className="border-t border-[#d4e2dd] bg-[#E1EBE7] p-8 pt-12">
                        {/* ACTIONS */}

                        <section>
                            <Eyebrow>Take action</Eyebrow>

                            <h2 className="mt-3 font-['Fraunces'] text-[28px] font-semibold tracking-tight text-[#17211e]">
                                What can you do?
                            </h2>

                            <div className="mt-6">
                                <SidebarActionRow
                                    icon={HeartHandshake}
                                    title="Request help"
                                    description="Tell us what support you need"
                                    iconClass="text-primary"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/help-requests',
                                        )
                                    }
                                />

                                <SidebarActionRow
                                    icon={HandCoins}
                                    title="Give support"
                                    description="Support a person or cause"
                                    iconClass="text-primary"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/donations',
                                        )
                                    }
                                />

                                <SidebarActionRow
                                    icon={Users}
                                    title="Give your time"
                                    description="Find volunteer opportunities"
                                    iconClass="text-primary"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/volunteer',
                                        )
                                    }
                                />

                                <SidebarActionRow
                                    icon={Megaphone}
                                    title="Discover causes"
                                    description="See what needs support now"
                                    iconClass="text-[#b77900]"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/campaigns',
                                        )
                                    }
                                />
                            </div>
                        </section>

                        {/* PROFILE */}

                        <section className="mt-12 border-y border-slate-300 py-10">
                            <Eyebrow muted>Your profile</Eyebrow>

                            <div className="mt-5 flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcebe6] font-['Fraunces'] text-lg font-semibold text-primary">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#17211e]">
                                        {individualUser.name}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Community member
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 space-y-5">
                                <SidebarProfileDetail
                                    icon={MapPin}
                                    label="Location"
                                    value={
                                        individualUser.district ||
                                        'Not provided'
                                    }
                                />

                                <SidebarProfileDetail
                                    icon={CalendarDays}
                                    label="Member since"
                                    value={formatDate(
                                        individualUser.memberSince,
                                    )}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/dashboard/individual/profile')
                                }
                                className="group mt-7 inline-flex items-center gap-2 text-xs font-bold text-primary transition hover:text-primary-hover"
                            >
                                View profile
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </section>

                        {/* ====================================================
                            RECENT UPDATES / NOTIFICATIONS
                        ==================================================== */}

                        <section className="mt-12 border-t border-slate-300 pt-10">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <Eyebrow>Stay informed</Eyebrow>

                                    <h2 className="mt-3 font-['Fraunces'] text-[25px] font-semibold tracking-tight text-[#17211e]">
                                        Recent updates
                                    </h2>
                                </div>

                                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4f1] text-primary">
                                    <Sparkles className="h-3.5 w-3.5" />
                                </div>
                            </div>

                            <div className="mt-6">
                                {recentUpdates.map((update) => (
                                    <div
                                        key={update.id}
                                        className="border-b border-slate-300 py-5 first:border-t"
                                    >
                                        <div className="flex gap-3">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                                            <div className="min-w-0">
                                                <p className="text-[12px] font-bold leading-5 text-[#33443f]">
                                                    {update.title}
                                                </p>

                                                <p className="mt-1.5 text-[10px] leading-4 text-slate-500">
                                                    {update.description}
                                                </p>

                                                <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                                                    {update.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="group mt-6 inline-flex items-center gap-2 text-xs font-bold text-primary transition hover:text-primary-hover"
                            >
                                View all updates
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </section>

                        {/* MESSAGE */}

                        <section className="mt-12 border-t border-slate-300 pt-10">
                            <Sparkles className="h-4 w-4 text-[#d89400]" />

                            <p className="mt-4 font-['Fraunces'] text-[24px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#17211e]">
                                A little care can travel further than you think.
                            </p>

                            <p className="mt-3 text-[11px] leading-6 text-slate-500">
                                A donation, an hour of your time, or simply
                                asking for help — every action strengthens the
                                people around us.
                            </p>
                        </section>
                    </aside>
                </div>

                {/* ============================================================
                    FOOTER
                ============================================================ */}

                <footer className="mt-20 border-t border-slate-200 py-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />

                            <span className="text-[10px] font-semibold text-slate-400">
                                Stand For People
                            </span>
                        </div>

                        <p className="text-[10px] text-slate-400">
                            Together, we make support easier to reach.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

/* ================================================================
   COMPONENTS
================================================================ */

const Eyebrow = ({ children, light = false, muted = false }) => (
    <p
        className={`text-[10px] font-bold uppercase tracking-[0.22em] ${
            light ? 'text-[#8fcac1]' : muted ? 'text-slate-400' : 'text-primary'
        }`}
    >
        {children}
    </p>
);

const SectionHeader = ({ eyebrow, title, action, onClick }) => (
    <div className="flex items-end justify-between gap-6">
        <div>
            <Eyebrow>{eyebrow}</Eyebrow>

            <h2 className="mt-3 font-['Fraunces'] text-[30px] font-semibold leading-tight tracking-tight text-[#17211e]">
                {title}
            </h2>
        </div>

        {action && (
            <button
                type="button"
                onClick={onClick}
                className="group hidden items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-primary sm:inline-flex"
            >
                {action}

                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
        )}
    </div>
);

const ImpactStat = ({ value, label }) => (
    <div className="border-l border-slate-200 px-0 py-5 sm:px-7 sm:first:pl-0 flex flex-col items-center justify-center bg-[#F8F8F5] m-4">
        <p className="font-['Fraunces'] text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#17211e]">
            {value}
        </p>

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
        </p>
    </div>
);

const HelpRequestStat = ({ value, label }) => (
    <div className="border-l border-slate-200 px-5 py-6 first:border-l-0 sm:px-6 lg:px-7">
        <p className="font-['Fraunces'] text-[30px] font-semibold leading-none tracking-[-0.03em] text-[#17211e]">
            {value}
        </p>

        <p className="mt-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
        </p>
    </div>
);

const RequestProgress = () => (
    <div className="mt-9 max-w-xl">
        <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-3.5 w-3.5" />
            </div>

            <div className="h-px flex-1 bg-primary" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-3.5 w-3.5" />
            </div>

            <div className="h-px flex-1 bg-slate-300" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-[#f8f8f5] text-slate-300">
                <Clock3 className="h-3.5 w-3.5" />
            </div>
        </div>

        <div className="mt-3 grid grid-cols-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
            <span>Submitted</span>

            <span className="text-center">Reviewed</span>

            <span className="text-right">Update</span>
        </div>
    </div>
);

const SidebarActionRow = ({
    icon: Icon,
    title,
    description,
    iconClass,
    onClick,
}) => (
    <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-4 border-b border-slate-200 py-5 text-left"
    >
        <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center bg-[#edf4f1] ${iconClass}`}
        >
            <Icon className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-[#17211e] transition-colors duration-200 group-hover:text-primary">
                {title}
            </span>

            <span className="mt-1 block text-[10px] leading-4 text-slate-500">
                {description}
            </span>
        </span>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </button>
);

const SidebarProfileDetail = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#edf4f1] text-primary">
            <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="pt-0.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-xs font-semibold text-[#33443f]">
                {value}
            </p>
        </div>
    </div>
);

export default IndividualDashboard;
