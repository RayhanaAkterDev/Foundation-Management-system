import React from 'react';
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

import {
    mockIndividualUser,
    mockDonationSummary,
    mockVolunteerSummary,
    mockActiveCampaigns,
    mockIndividualActivity,
    mockHelpRequests,
} from '@/data/mockIndividual';

import StatusBadge from '@/components/dashboard/StatusBadge';

const CATEGORY = {
    Education: {
        accent: '#3b82f6',
        soft: 'bg-blue-50 text-blue-700',
    },
    'Food Assistance': {
        accent: '#f59e0b',
        soft: 'bg-amber-50 text-amber-700',
    },
    'Disaster Relief': {
        accent: '#f97316',
        soft: 'bg-orange-50 text-orange-700',
    },
    Healthcare: {
        accent: '#10b981',
        soft: 'bg-emerald-50 text-emerald-700',
    },
    Livelihood: {
        accent: '#8b5cf6',
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

    const firstName = mockIndividualUser.name.split(' ')[0];
    const currentRequest = mockHelpRequests?.[0];
    const featuredCampaign = mockActiveCampaigns?.[0];

    const campaignProgress = featuredCampaign
        ? Math.min(featuredCampaign.progress || 0, 100)
        : 0;

    return (
        <div className="min-h-full bg-[#f8f8f5] text-[#17211e]">
            <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
                {/* ============================================================
                    HEADER
                ============================================================ */}

                <header className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/individual')}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center bg-[#0f766e] transition duration-200 group-hover:bg-[#115e59]">
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
                                {mockIndividualUser.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                Community member
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9dfd9] bg-[#e4f0ec] font-['Fraunces'] text-sm font-semibold text-[#0f766e] transition duration-200 group-hover:scale-105">
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                    </button>
                </header>

                {/* ============================================================
                    HERO
                ============================================================ */}

                <section className="relative mt-8 border-y border-slate-200">
                    <div className="grid min-h-[430px] lg:grid-cols-[1.08fr_0.92fr]">
                        {/* Hero content */}

                        <div className="flex flex-col justify-center py-12 lg:pr-16 lg:py-16">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-[#0f766e]" />

                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0f766e]">
                                    {getGreeting()}, {firstName}
                                </span>
                            </div>

                            <h1 className="mt-6 max-w-3xl font-['Fraunces'] text-[48px] font-semibold leading-[0.98] tracking-[-0.045em] text-[#17211e] sm:text-[62px] lg:text-[72px]">
                                Show up for
                                <br />
                                <span className="text-[#0f766e]">
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
                                    className="group inline-flex items-center gap-2.5 bg-[#0f766e] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#115e59]"
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
                                    className="group inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition hover:text-[#0f766e]"
                                >
                                    Explore causes
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                            </div>
                        </div>

                        {/* Hero visual */}

                        <div className="relative hidden overflow-hidden border-l border-slate-200 lg:block">
                            <div className="absolute inset-0">
                                <div className="absolute left-[18%] top-[13%] h-52 w-52 rounded-full border border-[#0f766e]/20" />

                                <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-[#0f766e]/8" />

                                <div className="absolute bottom-[-90px] left-[8%] h-72 w-72 rounded-full border-[38px] border-amber-400/10" />

                                <div className="absolute bottom-[18%] right-[16%] h-24 w-24 rounded-full bg-[#0f766e]/10" />

                                <div className="absolute left-[48%] top-[41%] h-20 w-20 rounded-full border border-[#0f766e]/15" />

                                <div className="absolute bottom-0 left-[14%] top-0 w-px bg-slate-200/70" />
                            </div>

                            <div className="absolute left-1/2 top-[38%] flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#0f766e]/10 bg-[#edf4f1]">
                                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#0f766e] shadow-[0_20px_60px_rgba(15,118,110,0.15)]">
                                    <Heart className="h-10 w-10 fill-white text-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-10 max-w-[300px]">
                                <span className="block h-px w-8 bg-[#0f766e]" />

                                <p className="mt-4 font-['Fraunces'] text-[29px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#17211e]">
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

                {/* ============================================================
                    IMPACT STRIP
                ============================================================ */}

                <section className="grid border-b border-slate-200 py-10 lg:grid-cols-[0.9fr_2.1fr] lg:py-11">
                    <div className="lg:pr-14">
                        <Eyebrow>Your contribution</Eyebrow>

                        <h2 className="mt-3 font-['Fraunces'] text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#17211e]">
                            The ways you've
                            <br className="hidden lg:block" /> shown up.
                        </h2>

                        <p className="mt-3 max-w-xs text-xs leading-5 text-slate-400">
                            Every contribution becomes part of a larger story.
                        </p>
                    </div>

                    <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 lg:mt-0">
                        <ImpactStat
                            value={
                                <>
                                    ৳
                                    {mockDonationSummary.totalDonated.toLocaleString()}
                                </>
                            }
                            label="Total contributed"
                        />

                        <ImpactStat
                            value={mockVolunteerSummary.totalHours}
                            label="Hours volunteered"
                        />

                        <ImpactStat
                            value={
                                mockDonationSummary.donationCount +
                                mockVolunteerSummary.activitiesCount
                            }
                            label="Acts of support"
                        />
                    </div>
                </section>

                {/* ============================================================
                    MAIN CONTENT
                ============================================================ */}

                <div className="grid gap-14 py-12 xl:grid-cols-[minmax(0,1fr)_330px] xl:gap-16">
                    <main className="min-w-0">
                        {/* ====================================================
                            CURRENT REQUEST
                        ==================================================== */}

                        <section className="border-b border-slate-200 pb-12">
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
                                <div className="mt-7">
                                    <div className="grid border-y border-[#d6e5df] lg:grid-cols-[minmax(0,1fr)_220px]">
                                        {/* Main request */}

                                        <div className="relative py-7 lg:pr-10">
                                            <span
                                                className="absolute bottom-0 left-0 top-0 w-[3px]"
                                                style={{
                                                    backgroundColor:
                                                        getCategory(
                                                            currentRequest.category,
                                                        ).accent,
                                                }}
                                            />

                                            <div className="pl-6">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <span
                                                        className={`inline-flex px-2.5 py-1 text-[10px] font-bold ${getCategory(currentRequest.category).soft}`}
                                                    >
                                                        {
                                                            currentRequest.category
                                                        }
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

                                                <h3 className="mt-2.5 max-w-2xl font-['Fraunces'] text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-[#17211e]">
                                                    {currentRequest.title}
                                                </h3>

                                                {currentRequest.notes && (
                                                    <p className="mt-4 max-w-2xl text-[13px] leading-6 text-slate-500">
                                                        {currentRequest.notes}
                                                    </p>
                                                )}

                                                <RequestProgress />
                                            </div>
                                        </div>

                                        {/* Request side */}

                                        <div className="flex flex-col justify-between border-t border-[#d6e5df] bg-[#f1f6f3] px-6 py-7 lg:border-l lg:border-t-0">
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

                                                <p className="mt-5 text-[11px] leading-5 text-slate-400">
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
                                                className="group mt-8 inline-flex w-fit items-center gap-2 text-xs font-bold text-[#0f766e]"
                                            >
                                                View request
                                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-7 border-l-2 border-[#0f766e] py-2 pl-6">
                                    <h3 className="font-['Fraunces'] text-xl font-semibold">
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
                                        className="group mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0f766e]"
                                    >
                                        Submit a request
                                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* ====================================================
                            FEATURED CAMPAIGN
                        ==================================================== */}

                        {featuredCampaign && (
                            <section className="border-b border-slate-200 py-12">
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

                                <article className="mt-7 grid lg:grid-cols-[0.82fr_1.18fr]">
                                    {/* Editorial visual */}

                                    <div className="relative min-h-[390px] overflow-hidden bg-[#e8f0ed] p-8 sm:p-10">
                                        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full border-[28px] border-[#0f766e]/10" />

                                        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[46px] border-amber-400/10" />

                                        <div className="absolute right-[14%] top-[18%] h-20 w-20 rounded-full bg-[#0f766e]/10" />

                                        <div className="relative flex h-full flex-col justify-between">
                                            <span
                                                className={`w-fit px-3 py-1.5 text-[10px] font-bold ${getCategory(featuredCampaign.category).soft}`}
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

                                    <div className="flex min-h-[390px] flex-col justify-between bg-[#17211e] px-8 py-9 text-white sm:px-10 sm:py-11">
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

                                            <div className="mt-5 h-[3px] overflow-hidden bg-white/10">
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
                                                className="group mt-7 inline-flex items-center gap-3 border-b border-[#79c2b7] pb-2 text-xs font-bold text-white transition hover:text-[#79c2b7]"
                                            >
                                                Support this cause
                                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </section>
                        )}

                        {/* ====================================================
                            ACTIVITY
                        ==================================================== */}

                        <section className="pt-12">
                            <SectionHeader
                                eyebrow="Your journey"
                                title="Recent activity"
                            />

                            <div className="mt-7">
                                {mockIndividualActivity?.length ? (
                                    mockIndividualActivity
                                        .slice(0, 6)
                                        .map((activity, index) => (
                                            <div
                                                key={
                                                    activity.id ||
                                                    `activity-${index}`
                                                }
                                                className="group grid grid-cols-[34px_minmax(0,1fr)_auto] gap-5 border-b border-slate-200 py-5 first:border-t"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf4f1] text-[#0f766e]">
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

                                                <ChevronRight className="mt-1 h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#0f766e]" />
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

                    <aside className="xl:border-l xl:border-slate-200 xl:pl-10">
                        {/* ACTIONS */}

                        <section>
                            <Eyebrow>Take action</Eyebrow>

                            <h2 className="mt-3 font-['Fraunces'] text-[28px] font-semibold tracking-[-0.025em] text-[#17211e]">
                                What can you do?
                            </h2>

                            <div className="mt-6 border-t border-slate-200">
                                <ActionRow
                                    icon={HeartHandshake}
                                    title="Request help"
                                    description="Tell us what support you need"
                                    iconClass="bg-[#e3f0ec] text-[#0f766e]"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/help-requests',
                                        )
                                    }
                                />

                                <ActionRow
                                    icon={HandCoins}
                                    title="Give support"
                                    description="Support a person or cause"
                                    iconClass="bg-emerald-50 text-emerald-600"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/donations',
                                        )
                                    }
                                />

                                <ActionRow
                                    icon={Users}
                                    title="Give your time"
                                    description="Find volunteer opportunities"
                                    iconClass="bg-blue-50 text-blue-600"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/volunteer',
                                        )
                                    }
                                />

                                <ActionRow
                                    icon={Megaphone}
                                    title="Discover causes"
                                    description="See what needs support now"
                                    iconClass="bg-amber-50 text-amber-600"
                                    onClick={() =>
                                        navigate(
                                            '/dashboard/individual/campaigns',
                                        )
                                    }
                                />
                            </div>
                        </section>

                        {/* PROFILE */}

                        <section className="mt-12 border-t border-slate-200 pt-8">
                            <Eyebrow muted>Your profile</Eyebrow>

                            <div className="mt-5 flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0f766e] font-['Fraunces'] text-lg font-semibold text-white">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        {mockIndividualUser.name}
                                    </p>

                                    <p className="mt-1 text-[10px] text-slate-400">
                                        Community member
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 space-y-5">
                                <ProfileDetail
                                    icon={MapPin}
                                    label="Location"
                                    value={mockIndividualUser.district}
                                />

                                <ProfileDetail
                                    icon={CalendarDays}
                                    label="Member since"
                                    value={formatDate(
                                        mockIndividualUser.memberSince,
                                    )}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/dashboard/individual/profile')
                                }
                                className="group mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#0f766e]"
                            >
                                View profile
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </section>

                        {/* MESSAGE */}

                        <section className="mt-12 border-t border-slate-200 pt-8">
                            <Sparkles className="h-4 w-4 text-amber-500" />

                            <p className="mt-4 font-['Fraunces'] text-[24px] font-semibold leading-[1.18] tracking-[-0.02em] text-[#17211e]">
                                A little care can travel further than you think.
                            </p>

                            <p className="mt-3 text-[11px] leading-6 text-slate-400">
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

                <footer className="mt-2 border-t border-slate-200 py-7">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="h-3.5 w-3.5 fill-[#0f766e] text-[#0f766e]" />

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
            light
                ? 'text-[#79c2b7]'
                : muted
                  ? 'text-slate-400'
                  : 'text-[#0f766e]'
        }`}
    >
        {children}
    </p>
);

const SectionHeader = ({ eyebrow, title, action, onClick }) => (
    <div className="flex items-end justify-between gap-6">
        <div>
            <Eyebrow>{eyebrow}</Eyebrow>

            <h2 className="mt-3 font-['Fraunces'] text-[30px] font-semibold leading-tight tracking-[-0.025em] text-[#17211e]">
                {title}
            </h2>
        </div>

        {action && (
            <button
                type="button"
                onClick={onClick}
                className="group hidden items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-[#0f766e] sm:inline-flex"
            >
                {action}

                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
        )}
    </div>
);

const ImpactStat = ({ value, label }) => (
    <div className="border-b border-slate-200 py-6 sm:border-b-0 sm:border-l sm:border-t-0 sm:px-7 sm:py-2 first:sm:border-l-0 lg:px-9">
        <p className="font-['Fraunces'] text-[38px] font-semibold leading-none tracking-[-0.035em] text-[#17211e]">
            {value}
        </p>

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
        </p>
    </div>
);

const RequestProgress = () => (
    <div className="mt-9 max-w-xl">
        <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f766e] text-white">
                <Check className="h-3.5 w-3.5" />
            </div>

            <div className="h-px flex-1 bg-[#0f766e]" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f766e] text-white">
                <Check className="h-3.5 w-3.5" />
            </div>

            <div className="h-px flex-1 bg-slate-300" />

            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-300">
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

const ActionRow = ({ icon: Icon, title, description, iconClass, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-4 border-b border-slate-200 py-5 text-left transition"
    >
        <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center ${iconClass}`}
        >
            <Icon className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold text-slate-700 transition-colors group-hover:text-[#0f766e]">
                {title}
            </span>

            <span className="mt-1 block text-[10px] leading-4 text-slate-400">
                {description}
            </span>
        </span>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f766e]" />
    </button>
);

const ProfileDetail = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#edf4f1] text-[#0f766e]">
            <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="pt-0.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-xs font-semibold text-slate-700">
                {value}
            </p>
        </div>
    </div>
);

export default IndividualDashboard;
