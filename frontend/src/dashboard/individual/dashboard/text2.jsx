import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Bell,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    HandCoins,
    HeartHandshake,
    MapPin,
    Megaphone,
    Plus,
    Settings2,
    ShieldCheck,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
import { getIndividualDashboard } from './api/individualDashboardApi';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

const ROOT = '/individual/dashboard';
const ROUTES = {
    requests: `${ROOT}/help-requests`,
    donations: `${ROOT}/donations`,
    volunteer: `${ROOT}/volunteer`,
    campaigns: `${ROOT}/campaigns`,
    profile: `${ROOT}/profile`,
    notifications: `${ROOT}/notifications`,
    settings: `${ROOT}/settings`,
};
const fmt = (value) => Number(value || 0).toLocaleString('en-BD');
const dateText = (value) => {
    if (!value) return 'Not provided';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? 'Not provided'
        : date.toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });
};
const greeting = () => {
    const hour = new Date().getHours();
    return hour < 12
        ? 'Good morning'
        : hour < 17
          ? 'Good afternoon'
          : 'Good evening';
};
const daysLeft = (value) => {
    if (!value) return null;
    const date = new Date(value).getTime();
    return Number.isNaN(date)
        ? null
        : Math.max(0, Math.ceil((date - Date.now()) / 86400000));
};
const eyebrow =
    'text-[10px] font-semibold uppercase tracking-[0.17em] text-[#A4B2C3]';

function SectionTitle({ kicker, title, action, onAction }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
                <p className={eyebrow}>{kicker}</p>
                <h2 className="mt-2 !font-sans !text-[22px] !font-semibold !leading-tight !tracking-[-0.025em] !text-[#F0F3F7]">
                    {title}
                </h2>
            </div>
            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex items-center gap-1.5 pb-1 text-[12px] font-medium text-[#CCD7E3] transition hover:text-white"
                >
                    {action}
                    <ArrowUpRight size={15} />
                </button>
            )}
        </div>
    );
}
function Metric({ icon: Icon, label, value, detail, color, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group min-w-0 px-5 py-5 text-left transition-colors hover:bg-[#25313F] sm:px-6 sm:py-6"
        >
            <div className="flex items-center gap-2.5">
                <Icon size={17} className={color} />
                <span className="text-[12px] text-[#AEBBCB]">{label}</span>
                <ArrowUpRight
                    size={14}
                    className="ml-auto text-[#75869A] opacity-0 transition group-hover:opacity-100"
                />
            </div>
            <div className="mt-3 text-[29px] font-semibold leading-none tracking-[-0.04em] text-[#F2F5F8]">
                {value}
            </div>
            <p className="mt-2 text-[11px] text-[#9AAABB]">{detail}</p>
        </button>
    );
}
function NavAction({ icon: Icon, title, detail, tint, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-3 rounded-[5px] border border-transparent px-2.5 py-3 text-left transition hover:border-[#435267] hover:bg-[#273647]"
        >
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] ${tint}`}
            >
                <Icon size={18} strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-[#EDF1F5]">
                    {title}
                </span>
                <span className="mt-0.5 block text-[11px] leading-5 text-[#A4B4C4]">
                    {detail}
                </span>
            </span>
            <ChevronRight
                size={16}
                className="text-[#8FA1B4] transition group-hover:translate-x-0.5 group-hover:text-white"
            />
        </button>
    );
}
function RequestTrack({ status }) {
    const value = String(status || '').toLowerCase();
    if (value === 'rejected')
        return (
            <p className="mt-4 border-l-2 border-[#D29BA5] pl-3 text-[12px] text-[#D9ADB5]">
                Request rejected. Open your requests to see the details.
            </p>
        );
    const stage = value === 'completed' ? 2 : value === 'verified' ? 1 : 0;
    return (
        <div className="mt-5 grid grid-cols-3 gap-2">
            {['Submitted', 'Reviewed', 'Updated'].map((name, i) => (
                <div key={name}>
                    <div
                        className={`h-1 ${i <= stage ? 'bg-[#D7B47F]' : 'bg-[#394859]'}`}
                    />
                    <p
                        className={`mt-2 text-[10px] ${i === stage ? 'font-semibold text-[#F1F4F7]' : 'text-[#9DADBF]'}`}
                    >
                        {i < stage ? '✓ ' : ''}
                        {name}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function IndividualDashboard() {
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState({
        loading: true,
        error: '',
        data: null,
    });
    useEffect(() => {
        let mounted = true;
        getIndividualDashboard()
            .then((data) => {
                if (mounted) setResult({ loading: false, error: '', data });
            })
            .catch((error) => {
                if (mounted)
                    setResult({
                        loading: false,
                        error:
                            error?.message || 'Unable to load your dashboard.',
                        data: null,
                    });
            });
        return () => {
            mounted = false;
        };
    }, [attempt]);
    if (result.loading)
        return (
            <LoadingUI
                variant="page"
                title="Loading dashboard..."
                description="Please wait while we retrieve your requests, contributions, and community activity."
            />
        );
    if (result.error)
        return (
            <div className="p-4 sm:p-7">
                <LoadingError
                    title="Unable to load dashboard"
                    message={result.error}
                />
                <button
                    type="button"
                    onClick={() => {
                        setResult({ loading: true, error: '', data: null });
                        setAttempt((n) => n + 1);
                    }}
                    className="mt-4 border border-[#465365] px-5 py-2.5 text-[13px] text-[#F0F3F7] hover:bg-[#263341]"
                >
                    Try again
                </button>
            </div>
        );

    const data = result.data || {};
    const user = data.user || { name: 'User' };
    const donation = data.donationSummary || {};
    const volunteer = data.volunteerSummary || {};
    const requests = Array.isArray(data.helpRequests) ? data.helpRequests : [];
    const campaigns = Array.isArray(data.activeCampaigns)
        ? data.activeCampaigns
        : [];
    const activities = Array.isArray(data.activity) ? data.activity : [];
    const firstName =
        String(user.name || 'User')
            .trim()
            .split(/\s+/)[0] || 'User';
    const latest = requests[0] || null;
    const campaign = campaigns[0] || null;
    const pending = requests.filter(
        (item) => String(item.status || '').toLowerCase() === 'pending',
    ).length;
    const verified = requests.filter(
        (item) => String(item.status || '').toLowerCase() === 'verified',
    ).length;
    const completed = requests.filter(
        (item) => String(item.status || '').toLowerCase() === 'completed',
    ).length;
    const progress = Math.max(
        0,
        Math.min(100, Number(campaign?.progress || 0) || 0),
    );
    const remaining = daysLeft(campaign?.deadline);
    const supportCount =
        Number(donation.donationCount || 0) +
        Number(volunteer.activitiesCount || 0);
    const go = (key) => navigate(ROUTES[key]);

    return (
        <div className="min-h-full text-[#E0E6ED]">
            <div className="mx-auto max-w-[1530px]">
                {/* Restore the original split editorial welcome rather than a KPI card header. */}
                <section className="overflow-hidden border border-[#303A47] bg-[#171E28]">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_350px]">
                        <div className="px-6 py-9 sm:px-9 sm:py-11 lg:px-10 lg:py-12">
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-7 bg-[#D7B47F]" />
                                <p className={eyebrow}>
                                    Your space at Stand For People
                                </p>
                            </div>
                            <h1 className="mt-6 !font-['Fraunces'] !text-[34px] !font-semibold !leading-[1.15] !tracking-[-0.035em] !text-[#F4F5F7] sm:!text-[43px]">
                                {greeting()},{' '}
                                <span className="text-[#D9B98B]">
                                    {firstName}.
                                </span>
                            </h1>
                            <p className="mt-4 max-w-[570px] text-[13px] leading-7 text-[#B1BFCE]">
                                Your community contributions, support requests
                                and the causes you care about—together in one
                                place.
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => go('requests')}
                                    className="inline-flex items-center gap-2 bg-[#D7B47F] px-5 py-3 text-[12px] font-semibold text-[#19212A] transition hover:bg-[#E9C895]"
                                >
                                    <Plus size={15} /> Request support{' '}
                                    <ArrowUpRight size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go('campaigns')}
                                    className="inline-flex items-center gap-2 border border-[#455466] px-5 py-3 text-[12px] font-semibold text-[#E4EAF1] transition hover:bg-[#273443]"
                                >
                                    Explore causes <ArrowUpRight size={15} />
                                </button>
                            </div>
                        </div>
                        <div className="relative flex min-h-[215px] flex-col justify-between overflow-hidden border-t border-[#344353] bg-[#222F3D] px-7 py-7 lg:border-l lg:border-t-0">
                            <div
                                className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-[38px] border-[#34465A]/50"
                                aria-hidden="true"
                            />
                            <div
                                className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full border-[25px] border-[#3B4A59]/35"
                                aria-hidden="true"
                            />
                            <div className="relative flex items-center justify-between gap-3">
                                <p className={eyebrow}>Your membership</p>
                                <ShieldCheck
                                    size={18}
                                    className="text-[#B5C8D9]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => go('profile')}
                                className="group relative my-8 flex w-full items-center gap-4 text-left"
                            >
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#5B7186] bg-[#35495E] text-[22px] font-semibold text-white">
                                    {firstName.charAt(0).toUpperCase()}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[15px] font-semibold text-[#F1F4F7]">
                                        {user.name || 'User'}
                                    </span>
                                    <span className="mt-1 block text-[12px] text-[#B0BFCF]">
                                        Community member
                                    </span>
                                </span>
                                <ArrowUpRight
                                    size={17}
                                    className="text-[#B4C3D3] group-hover:text-white"
                                />
                            </button>
                            <div className="relative flex flex-wrap gap-x-5 gap-y-2 border-t border-[#455567] pt-4 text-[11px] text-[#B4C3D2]">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin size={13} />
                                    {user.district || 'Location not provided'}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={13} />
                                    {dateText(user.memberSince)}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    aria-label="Your contributions"
                    className="mt-5 grid grid-cols-2 divide-x divide-y divide-[#303D4B] border border-[#34404E] bg-[#1B2632] md:grid-cols-4 md:divide-y-0"
                >
                    <Metric
                        icon={Wallet}
                        label="Total donated"
                        value={`৳${fmt(donation.totalDonated)}`}
                        detail={`${fmt(donation.donationCount)} donations made`}
                        color="text-[#AEC8E3]"
                        onClick={() => go('donations')}
                    />
                    <Metric
                        icon={Clock3}
                        label="Volunteer hours"
                        value={fmt(volunteer.totalHours)}
                        detail={`${fmt(volunteer.activitiesCount)} volunteer activities`}
                        color="text-[#9EC6B9]"
                        onClick={() => go('volunteer')}
                    />
                    <Metric
                        icon={HeartHandshake}
                        label="Acts of support"
                        value={fmt(supportCount)}
                        detail="Giving and volunteering"
                        color="text-[#C9B7DD]"
                        onClick={() => go('volunteer')}
                    />
                    <Metric
                        icon={Users}
                        label="Help requests"
                        value={fmt(requests.length)}
                        detail={`${pending} awaiting review`}
                        color="text-[#DBB984]"
                        onClick={() => go('requests')}
                    />
                </section>

                <div className="mt-9 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-9">
                    <main className="min-w-0 space-y-10">
                        <section>
                            <SectionTitle
                                kicker="Discover a cause"
                                title="Featured campaign"
                                action="Browse campaigns"
                                onAction={() => go('campaigns')}
                            />
                            <div className="mt-5 overflow-hidden border border-[#344352] bg-[#202D3B]">
                                <div className="grid lg:grid-cols-[minmax(0,1fr)_205px]">
                                    <div className="flex min-h-[235px] flex-col justify-between px-6 py-7 sm:px-8 sm:py-8">
                                        <div>
                                            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#DCC08D]">
                                                <Megaphone size={15} />
                                                {campaign?.category ||
                                                    'Community initiative'}
                                            </p>
                                            <h3 className="mt-5 !font-['Fraunces'] !text-[24px] !font-semibold !leading-[1.3] !text-[#F4F6F8] sm:!text-[28px]">
                                                {campaign?.title ||
                                                    'Discover a community cause to support'}
                                            </h3>
                                            <p className="mt-3 text-[12px] leading-6 text-[#B0C0D0]">
                                                {campaign
                                                    ? 'Support this initiative and help it reach more people.'
                                                    : 'Explore humanitarian initiatives and choose a cause that matters to you.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => go('campaigns')}
                                            className="mt-6 inline-flex w-fit items-center gap-2 text-[12px] font-semibold text-[#E7C48F] hover:text-white"
                                        >
                                            Explore campaign{' '}
                                            <ArrowRight size={15} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col justify-between border-t border-[#3B4A59] bg-[#29394A] px-6 py-7 lg:border-l lg:border-t-0">
                                        <div>
                                            <p className={eyebrow}>
                                                Funding raised
                                            </p>
                                            <p className="mt-5 text-[27px] font-semibold tracking-[-0.035em] text-[#F3F6F8]">
                                                ৳{fmt(campaign?.raised)}
                                            </p>
                                            <p className="mt-1 text-[12px] text-[#B2C2D1]">
                                                of ৳{fmt(campaign?.goal)} goal
                                            </p>
                                        </div>
                                        <div className="mt-10">
                                            <div className="flex justify-between text-[11px] text-[#B9C8D6]">
                                                <span>Funding progress</span>
                                                <strong className="text-[#F2F5F8]">
                                                    {progress}%
                                                </strong>
                                            </div>
                                            <div className="mt-3 h-1.5 bg-[#46586A]">
                                                <div
                                                    className="h-full bg-[#D8B77F]"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                            {remaining !== null && (
                                                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#B9C8D6]">
                                                    <Clock3 size={12} />
                                                    {remaining === 0
                                                        ? 'Deadline reached'
                                                        : `${remaining} days remaining`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section>
                            <SectionTitle
                                kicker="Your journey"
                                title="Recent activity"
                            />
                            <div className="mt-5 border-t border-[#344352]">
                                {activities.length ? (
                                    activities
                                        .slice(0, 6)
                                        .map((item, index) => (
                                            <div
                                                key={
                                                    item.id ||
                                                    `activity-${index}`
                                                }
                                                className="flex items-start gap-4 border-b border-[#2E3B49] py-5"
                                            >
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#293A4B] text-[#B6CEE4]">
                                                    <Activity size={17} />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[13px] font-semibold leading-6 text-[#EAF0F5]">
                                                        {item.title ||
                                                            item.description ||
                                                            item.action ||
                                                            'Activity update'}
                                                    </p>
                                                    {item.description &&
                                                        item.title &&
                                                        item.description !==
                                                            item.title && (
                                                            <p className="mt-1 text-[12px] leading-5 text-[#A8B8C8]">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        )}
                                                    {item.date && (
                                                        <p className="mt-2 text-[11px] text-[#94A7BA]">
                                                            {dateText(
                                                                item.date,
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                                <Check
                                                    size={15}
                                                    className="mt-2 shrink-0 text-[#9DBEAC]"
                                                />
                                            </div>
                                        ))
                                ) : (
                                    <p className="py-8 text-[13px] text-[#A9B8C8]">
                                        Your recent community activity will
                                        appear here.
                                    </p>
                                )}
                            </div>
                        </section>
                    </main>
                    <aside className="min-w-0 space-y-5">
                        {/* Profile first: useful account content, without duplicating the large welcome hero. */}
                        <section className="overflow-hidden border border-[#354454] bg-[#1C2733]">
                            <div className="flex items-center justify-between border-b border-[#344353] bg-[#233140] px-6 py-5">
                                <div>
                                    <p className={eyebrow}>Account overview</p>
                                    <h3 className="mt-2 !font-sans !text-[19px] !font-semibold !text-[#F0F3F7]">
                                        Your profile
                                    </h3>
                                </div>
                                <UserRound
                                    size={19}
                                    className="text-[#B6CADC]"
                                />
                            </div>
                            <div className="px-6 py-4">
                                <div className="flex justify-between gap-3 border-b border-[#344353] py-3 text-[12px]">
                                    <span className="flex items-center gap-2 text-[#A8B9C9]">
                                        <MapPin size={14} /> District
                                    </span>
                                    <span className="text-right font-medium text-[#E3EAF1]">
                                        {user.district || 'Not provided'}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-3 py-3 text-[12px]">
                                    <span className="flex items-center gap-2 text-[#A8B9C9]">
                                        <CalendarDays size={14} /> Member since
                                    </span>
                                    <span className="text-right font-medium text-[#E3EAF1]">
                                        {dateText(user.memberSince)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => go('profile')}
                                    className="mt-3 flex w-full items-center justify-between border border-[#4A5D70] bg-[#304457] px-4 py-3 text-[12px] font-semibold text-[#F0F4F8] transition hover:bg-[#40586E]"
                                >
                                    <span className="flex items-center gap-2">
                                        <UserRound size={15} /> Manage profile
                                    </span>
                                    <ArrowUpRight size={15} />
                                </button>
                            </div>
                        </section>
                        <section className="border border-[#354454] bg-[#1B2632] px-5 py-5 sm:px-6">
                            <SectionTitle
                                kicker="Your support"
                                title="Help requests"
                                action="View all"
                                onAction={() => go('requests')}
                            />
                            <div className="mt-5 grid grid-cols-3 divide-x divide-[#3A4959] rounded-[4px] bg-[#263545] py-4 text-center">
                                {[
                                    [pending, 'Pending'],
                                    [verified, 'Verified'],
                                    [completed, 'Completed'],
                                ].map(([value, label]) => (
                                    <div key={label}>
                                        <strong className="block text-[21px] font-semibold text-[#F2F5F8]">
                                            {value}
                                        </strong>
                                        <span className="mt-1 block text-[10px] text-[#AEBFD0]">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {latest ? (
                                <div className="mt-5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusBadge status={latest.status} />
                                        {latest.category && (
                                            <span className="text-[11px] text-[#ADBECD]">
                                                {latest.category}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-3 text-[14px] font-semibold leading-6 text-[#EDF2F6]">
                                        {latest.title || 'Help request'}
                                    </h3>
                                    <p className="mt-1 text-[11px] text-[#A3B4C5]">
                                        Submitted{' '}
                                        {dateText(latest.submittedDate)}
                                    </p>
                                    {latest.notes && (
                                        <p className="mt-3 line-clamp-3 text-[12px] leading-5 text-[#A7B7C7]">
                                            {latest.notes}
                                        </p>
                                    )}
                                    <RequestTrack status={latest.status} />
                                    <button
                                        type="button"
                                        onClick={() => go('requests')}
                                        className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold text-[#E7C38E] hover:text-white"
                                    >
                                        View request <ArrowUpRight size={15} />
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-5">
                                    <p className="text-[13px] font-semibold text-[#EDF2F6]">
                                        No requests submitted
                                    </p>
                                    <p className="mt-2 text-[12px] leading-6 text-[#AABACA]">
                                        Need assistance? Create a request and
                                        follow its progress here.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => go('requests')}
                                        className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#E7C38E] hover:text-white"
                                    >
                                        <Plus size={14} /> Create request{' '}
                                        <ArrowUpRight size={14} />
                                    </button>
                                </div>
                            )}
                        </section>
                        <section className="border border-[#354454] bg-[#1D2936] px-4 py-5 sm:px-5">
                            <div className="px-1">
                                <SectionTitle
                                    kicker="Your workspace"
                                    title="Quick access"
                                />
                            </div>
                            <div className="mt-4 space-y-1 border-t border-[#354555] pt-2">
                                <NavAction
                                    icon={HeartHandshake}
                                    title="Help requests"
                                    detail="Manage your support requests"
                                    tint="bg-[#2C445A] text-[#B6D3EA]"
                                    onClick={() => go('requests')}
                                />
                                <NavAction
                                    icon={HandCoins}
                                    title="Donations"
                                    detail="Your giving and contributions"
                                    tint="bg-[#29473F] text-[#A7D4C1]"
                                    onClick={() => go('donations')}
                                />
                                <NavAction
                                    icon={Users}
                                    title="Volunteer activities"
                                    detail="Your time and involvement"
                                    tint="bg-[#42374F] text-[#D1B9E5]"
                                    onClick={() => go('volunteer')}
                                />
                                <NavAction
                                    icon={Megaphone}
                                    title="Campaigns"
                                    detail="Explore humanitarian initiatives"
                                    tint="bg-[#4A3B2C] text-[#E5C18D]"
                                    onClick={() => go('campaigns')}
                                />
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#384959] pt-4">
                                <button
                                    type="button"
                                    onClick={() => go('notifications')}
                                    className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#3C4D5F] px-2 py-3 text-[11px] font-medium text-[#CFD9E4] transition hover:bg-[#2B3B4C]"
                                >
                                    <Bell size={14} /> Notifications
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go('settings')}
                                    className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#3C4D5F] px-2 py-3 text-[11px] font-medium text-[#CFD9E4] transition hover:bg-[#2B3B4C]"
                                >
                                    <Settings2 size={14} /> Settings
                                </button>
                            </div>
                        </section>
                    </aside>
                </div>
                <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-[#303B49] pt-6 text-[11px] text-[#92A3B4]">
                    <span>Stand For People · Individual workspace</span>
                    <span>Community support and coordination</span>
                </footer>
            </div>
        </div>
    );
}
