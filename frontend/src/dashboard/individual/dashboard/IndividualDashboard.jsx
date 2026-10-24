import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Bell,
    CalendarDays,
    CheckCircle2,
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
    TrendingUp,
} from 'lucide-react';
import { getIndividualDashboard } from './api/individualDashboardApi';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
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
const C = {
    bg: '#0E1219',
    surface: '#151C25',
    raised: '#1A222D',
    border: '#29323E',
    text: '#EEF1F5',
    muted: '#94A2B2',
    amber: '#D9B47B',
    blue: '#8FB9DC',
    green: '#82B9A4',
    purple: '#B8A2D5',
};
const fmt = (n) => Number(n || 0).toLocaleString('en-BD');
const formatDate = (v) => {
    if (!v) return 'Not provided';
    const d = new Date(v);
    return Number.isNaN(d.getTime())
        ? 'Not provided'
        : d.toLocaleDateString('en-BD', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          });
};
const greeting = (currentDate) => {
    const h = currentDate.getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
const today = (currentDate) =>
    currentDate.toLocaleDateString('en-BD', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
const eyebrow =
    'text-[10px] font-semibold! uppercase tracking-[0.17em] text-[#94A2B2]';

function SectionHeading({ kicker, title, description, action, onAction }) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                <p className={eyebrow}>{kicker}</p>
                <h2 className="mt-2 font-sans! text-[21px]! font-semibold! tracking-[-0.035em] text-[#EEF1F5]! sm:text-[23px]!">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1.5 text-[12px] leading-5 text-[#94A2B2]">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <button
                    type="button"
                    onClick={onAction}
                    className="group inline-flex items-center gap-1.5 text-[12px] font-medium! text-[#CBD5E1] hover:text-[#D9B47B]"
                >
                    {action}
                    <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </button>
            )}
        </div>
    );
}

function Stat({ icon: Icon, label, value, note, color, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative flex min-h-37 min-w-0 flex-col overflow-hidden border-b border-[#34404D]/60 p-4 text-left transition-colors duration-200 hover:bg-[#24313D] sm:min-h-42 sm:p-5 xl:border-b-0 xl:border-r xl:last:border-r-0"
            style={{
                backgroundImage: `linear-gradient(145deg, ${color}12, transparent 68%)`,
            }}
        >
            <span
                className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                style={{ backgroundColor: color }}
            />
            <span className="flex w-full items-start justify-between gap-2">
                <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${color}20`, color }}
                >
                    <Icon size={18} strokeWidth={1.8} />
                </span>
                <ArrowUpRight
                    size={15}
                    className="text-[#8394A6] opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
            </span>
            <span className="mt-4 block text-[11px] font-medium! text-[#B2BECC]">
                {label}
            </span>
            <span className="mt-1.5 block break-words text-[26px] font-semibold! leading-none tracking-[-0.04em] text-[#EEF1F5]! sm:text-[29px]">
                {value}
            </span>
            <span className="mt-auto block pt-3 text-[11px] text-[#94A2B2]">
                {note}
            </span>
        </button>
    );
}

function ImpactChart({ donationCount, volunteerCount }) {
    const total = donationCount + volunteerCount;
    const ratio = total ? donationCount / total : 0;
    const circumference = 2 * Math.PI * 62;
    return (
        <div className="flex flex-col items-center gap-5 2xl:flex-row 2xl:gap-5">
            <div className="relative h-43.5 w-43.5 shrink-0">
                <svg
                    viewBox="0 0 180 180"
                    className="h-full w-full"
                    role="img"
                    aria-label={`${donationCount} donations and ${volunteerCount} volunteer activities`}
                >
                    <circle
                        cx="90"
                        cy="90"
                        r="62"
                        fill="none"
                        stroke="#29323E"
                        strokeWidth="13"
                    />
                    {total > 0 && (
                        <>
                            <circle
                                cx="90"
                                cy="90"
                                r="62"
                                fill="none"
                                stroke={C.green}
                                strokeWidth="13"
                                strokeDasharray={`${circumference} 0`}
                                transform="rotate(-90 90 90)"
                            />
                            <circle
                                cx="90"
                                cy="90"
                                r="62"
                                fill="none"
                                stroke={C.amber}
                                strokeWidth="13"
                                strokeDasharray={`${ratio * circumference} ${circumference}`}
                                transform="rotate(-90 90 90)"
                            />
                        </>
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <strong className="text-[36px] leading-none text-[#EEF1F5]!">
                        {fmt(total)}
                    </strong>
                    <span className="mt-2 text-[11px] text-[#94A2B2]">
                        Total activities
                    </span>
                </div>
            </div>
            <div className="w-full flex-1 space-y-5">
                {[
                    {
                        label: 'Donations',
                        count: donationCount,
                        color: C.amber,
                    },
                    {
                        label: 'Volunteering',
                        count: volunteerCount,
                        color: C.green,
                    },
                ].map((item) => {
                    const pct = total
                        ? Math.round((item.count / total) * 100)
                        : 0;
                    return (
                        <div key={item.label}>
                            <div className="flex justify-between gap-3 text-[12px]">
                                <span className="flex items-center gap-2 text-[#C6D0DC]">
                                    <span
                                        className="h-2 w-2"
                                        style={{ background: item.color }}
                                    />
                                    {item.label}
                                </span>
                                <strong className="text-[#EEF1F5]!">
                                    {pct}%
                                </strong>
                            </div>
                            <div className="mt-2 h-1.5 bg-[#2A3542]">
                                <div
                                    className="h-full"
                                    style={{
                                        width: `${pct}%`,
                                        background: item.color,
                                    }}
                                />
                            </div>
                            <p className="mt-1.5 text-[11px] text-[#8797A8]">
                                {fmt(item.count)} recorded{' '}
                                {item.count === 1 ? 'activity' : 'activities'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ImpactOverview({ donation, volunteer, go }) {
    const donationCount = Math.max(0, Number(donation.donationCount) || 0);
    const volunteerCount = Math.max(0, Number(volunteer.activitiesCount) || 0);
    return (
        <section className="border-t border-[#344353] pt-8 min-[1025px]:pt-20">
            <SectionHeading
                kicker="Contribution overview"
                title="Your community impact"
                description="A clear picture of the ways you've contributed."
                action="View donations"
                onAction={() => go('donations')}
            />
            <div className="mt-6 grid overflow-hidden bg-transparent xl:grid-cols-[minmax(0,1.15fr)_minmax(210px,0.85fr)] border border-[#29323E]">
                <div className="bg-[#1B2934] p-6 sm:p-7">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <h3 className="text-[13px] font-semibold! text-[#E8EDF3]!">
                            How you contribute
                        </h3>
                        <span className="border border-[#35404C] px-2.5 py-1 text-[10px] text-[#94A2B2]">
                            All time
                        </span>
                    </div>
                    <ImpactChart
                        donationCount={donationCount}
                        volunteerCount={volunteerCount}
                    />
                </div>
                <div className="grid grid-cols-2 bg-transparent xl:grid-cols-1 xl:border-l xl:border-[#29323E]">
                    <button
                        type="button"
                        onClick={() => go('donations')}
                        className="group flex flex-col justify-between p-5 text-left hover:bg-[#222E3B] sm:p-6"
                    >
                        <span className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center bg-[#3B3329] text-[#D9B47B]">
                                <Wallet size={18} />
                            </span>
                            <ArrowUpRight
                                size={15}
                                className="text-[#8492A3] group-hover:text-white"
                            />
                        </span>
                        <span className="mt-5 block text-[11px] text-[#AAB6C5]">
                            Financial contributions
                        </span>
                        <strong className="mt-1 block text-[25px] tracking-tight text-[#D9B47B]">
                            ৳{fmt(donation.totalDonated)}
                        </strong>
                        <span className="mt-1 text-[11px] text-[#94A2B2]">
                            Across {fmt(donationCount)} donations
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => go('volunteer')}
                        className="group flex flex-col justify-between border-l border-[#29323E] p-5 text-left hover:bg-[#222E3B] sm:p-6 xl:border-l-0 xl:border-t"
                    >
                        <span className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center bg-[#273C37] text-[#82B9A4]">
                                <Clock3 size={18} />
                            </span>
                            <ArrowUpRight
                                size={15}
                                className="text-[#8492A3] group-hover:text-white"
                            />
                        </span>
                        <span className="mt-5 block text-[11px] text-[#AAB6C5]">
                            Time volunteered
                        </span>
                        <strong className="mt-1 block text-[25px] tracking-tight text-[#82B9A4]">
                            {fmt(volunteer.totalHours)}{' '}
                            <span className="text-[13px] font-normal">
                                hours
                            </span>
                        </strong>
                        <span className="mt-1 text-[11px] text-[#94A2B2]">
                            {fmt(volunteerCount)} activities
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}

function SupportOverview({ requests, pending, verified, completed, go }) {
    const latest = requests[0];
    const stages = [
        {
            name: 'Pending review',
            value: pending,
            color: C.amber,
            icon: Clock3,
            detail: 'Awaiting review',
        },
        {
            name: 'Verified',
            value: verified,
            color: C.blue,
            icon: ShieldCheck,
            detail: 'Review completed',
        },
        {
            name: 'Completed',
            value: completed,
            color: C.green,
            icon: CheckCircle2,
            detail: 'Support delivered',
        },
    ];
    return (
        <section>
            <SectionHeading
                kicker="Your support"
                title="Help requests"
                description="Track your requests from submission to resolution."
                action="View all requests"
                onAction={() => go('requests')}
            />
            <div className="mt-6 grid grid-cols-1 border border-[#35404D] bg-transparent sm:grid-cols-3">
                {stages.map(({ name, value, color, icon: Icon, detail }) => (
                    <div
                        key={name}
                        className="relative flex items-center gap-4 border-b border-[#35404D]/60 px-4 py-5 last:border-b-0 sm:block sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-5 sm:py-5"
                    >
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center"
                            style={{ background: `${color}1F`, color }}
                        >
                            <Icon size={19} />
                        </div>
                        <div className="min-w-0 sm:mt-4">
                            <p className="text-[26px] font-semibold! leading-none text-[#EEF1F5]!">
                                {fmt(value)}
                            </p>
                            <p className="mt-2 text-[12px] font-medium! text-[#DCE4EC]">
                                {name}
                            </p>
                            <p className="mt-1 text-[11px] text-[#8F9EAE]">
                                {detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3  flex flex-col gap-4 bg-transparent px-1 py-5 sm:flex-row sm:items-center sm:justify-between">
                {latest ? (
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={eyebrow}>Latest request</span>
                            <StatusBadge status={latest.status} />
                        </div>
                        <h3 className="mt-2 text-[13px] font-semibold! text-[#EEF1F5]!">
                            {latest.title || 'Help request'}
                        </h3>
                        <p className="mt-1 text-[11px] text-[#94A2B2]">
                            {[
                                latest.category,
                                latest.submittedDate &&
                                    `Submitted ${formatDate(latest.submittedDate)}`,
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                        {latest.notes && (
                            <p className="mt-2 text-[12px] text-[#AAB6C5]">
                                {latest.notes}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#263A4C] text-[#8FB9DC]">
                            <HeartHandshake size={19} />
                        </span>
                        <div>
                            <p className="text-[13px] font-medium! text-[#EEF1F5]!">
                                No support requests yet
                            </p>
                            <p className="mt-1 text-[11px] text-[#94A2B2]">
                                Need assistance? You can submit a request.
                            </p>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => go('requests')}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 bg-[#D9B47B] px-4 text-[12px] font-semibold! text-[#151C25] hover:bg-[#E8C994]"
                >
                    {latest ? 'View request' : 'Create request'}{' '}
                    {latest ? <ArrowUpRight size={14} /> : <Plus size={14} />}
                </button>
            </div>
        </section>
    );
}

function RecentActivity({ activities }) {
    return (
        <section>
            <SectionHeading kicker="Your journey" title="Recent activity" />
            <div className="mt-5 bg-transparent">
                {activities.length ? (
                    activities.slice(0, 5).map((item, index) => (
                        <div
                            key={item.id || index}
                            className="flex items-center gap-3 border-b border-[#29323E]/70 py-4"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#223447] text-[#8FB9DC]">
                                <Activity size={16} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-medium! text-[#E8EDF3]!">
                                    {item.title ||
                                        item.description ||
                                        item.action ||
                                        'Activity update'}
                                </p>
                                {item.title &&
                                    item.description &&
                                    item.title !== item.description && (
                                        <p className="mt-1 truncate text-[11px] text-[#94A2B2]">
                                            {item.description}
                                        </p>
                                    )}
                            </div>
                            <span className="hidden shrink-0 text-[10px] text-[#94A2B2] sm:block">
                                {item.date && formatDate(item.date)}
                            </span>
                            <CheckCircle2
                                size={15}
                                className="shrink-0 text-[#82B9A4]"
                            />
                        </div>
                    ))
                ) : (
                    <p className="py-6 text-[12px] text-[#94A2B2]">
                        Your recent activity will appear here.
                    </p>
                )}
            </div>
        </section>
    );
}

function QuickAccess({ go }) {
    const items = [
        {
            label: 'Help requests',
            detail: 'Manage your requests',
            icon: HeartHandshake,
            color: C.blue,
            key: 'requests',
        },
        {
            label: 'Donations',
            detail: 'Your giving history',
            icon: HandCoins,
            color: C.green,
            key: 'donations',
        },
        {
            label: 'Volunteer activities',
            detail: 'Your involvement',
            icon: Users,
            color: C.purple,
            key: 'volunteer',
        },
        {
            label: 'Campaigns',
            detail: 'Discover initiatives',
            icon: Megaphone,
            color: C.amber,
            key: 'campaigns',
        },
    ];
    return (
        <section>
            <SectionHeading kicker="Your workspace" title="Quick access" />
            <div className="mt-5 bg-transparent">
                {items.map(({ label, detail, icon: Icon, color, key }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => go(key)}
                        className="group flex w-full items-center gap-3 border-b border-[#35404D]/60 px-1 py-3.5 text-left transition-colors last:border-b-0 hover:bg-[#263545]"
                    >
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center"
                            style={{ background: `${color}1B`, color }}
                        >
                            <Icon size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-semibold! text-[#EEF1F5]!">
                                {label}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-[#94A2B2]">
                                {detail}
                            </span>
                        </span>
                        <ChevronRight
                            size={16}
                            className="text-[#758496] group-hover:translate-x-0.5 group-hover:text-white"
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}

function RequestSummary({ total, pending, verified, completed, go }) {
    const parts = [
        { name: 'Pending', n: pending, color: C.amber },
        { name: 'Verified', n: verified, color: C.blue },
        { name: 'Completed', n: completed, color: C.green },
    ];
    return (
        <section>
            <p className={eyebrow}>Request overview</p>
            <div className="mt-3 flex items-end justify-between">
                <div>
                    <p className="text-[11px] text-[#94A2B2]">
                        Total submitted
                    </p>
                    <strong className="mt-1 block text-[31px] leading-none text-[#EEF1F5]!">
                        {fmt(total)}
                    </strong>
                </div>
                <span className="text-[11px] text-[#94A2B2]">All time</span>
            </div>
            <div className="mt-5 flex h-2 bg-[#354454]">
                {parts.map((p) => (
                    <span
                        key={p.name}
                        style={{
                            width: `${total ? (p.n / total) * 100 : 0}%`,
                            background: p.color,
                        }}
                    />
                ))}
            </div>
            <div className="mt-4 space-y-3">
                {parts.map((p) => (
                    <div
                        key={p.name}
                        className="flex items-center justify-between text-[12px]"
                    >
                        <span className="flex items-center gap-2 text-[#B0BECD]">
                            <span
                                className="h-2 w-2"
                                style={{ background: p.color }}
                            />
                            {p.name}
                        </span>
                        <strong className="text-[#EEF1F5]!">{fmt(p.n)}</strong>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={() => go('requests')}
                className="mt-5 flex items-center gap-2 text-[12px] font-medium! text-[#D9B47B] hover:text-white"
            >
                Manage requests <ArrowRight size={14} />
            </button>
        </section>
    );
}

function PersonalPulse({
    go,
    donationCount,
    volunteerCount,
    totalDonated,
    activities,
}) {
    const total = donationCount + volunteerCount;
    const recent = activities.length;
    return (
        <section>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className={eyebrow}>Your involvement</p>
                    <h3 className="mt-2 text-[17px] font-semibold! tracking-tight text-[#EEF1F5]!">
                        A record of giving
                    </h3>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D343C] text-[#D9B47B]">
                    <TrendingUp size={17} />
                </span>
            </div>
            <div className="mt-5 py-3">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] text-[#AAB6C5]">
                        Recorded contributions
                    </span>
                    <span className="text-[25px] font-semibold! leading-none text-[#F0F3F7]">
                        {fmt(total)}
                    </span>
                </div>
                <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-[#334353]">
                    {total > 0 && (
                        <>
                            <span
                                className="bg-[#D9B47B]"
                                style={{
                                    width: `${(donationCount / total) * 100}%`,
                                }}
                            />
                            <span
                                className="bg-[#82B9A4]"
                                style={{
                                    width: `${(volunteerCount / total) * 100}%`,
                                }}
                            />
                        </>
                    )}
                </div>
                <div className="mt-3 flex flex-wrap justify-between gap-3 text-[11px] text-[#AAB6C5]">
                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#D9B47B]" />
                        {fmt(donationCount)} donations
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#82B9A4]" />
                        {fmt(volunteerCount)} activities
                    </span>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="pr-3">
                    <p className="text-[10px] text-[#94A2B2]">Total given</p>
                    <p className="mt-1.5 text-[19px] font-semibold! text-[#D9B47B]">
                        ৳{fmt(totalDonated)}
                    </p>
                </div>
                <div className="pl-1">
                    <p className="text-[10px] text-[#94A2B2]">
                        Activity updates
                    </p>
                    <p className="mt-1.5 text-[19px] font-semibold! text-[#E0E6ED]">
                        {fmt(recent)}
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => go('volunteer')}
                className="group mt-5 inline-flex items-center gap-2 text-[12px] font-medium! text-[#C5D4E1] hover:text-[#EEF1F5]!"
            >
                Explore ways to participate{' '}
                <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </button>
        </section>
    );
}

export default function IndividualDashboard() {
    const navigate = useNavigate();
    const [currentDate] = useState(() => new Date());
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
    const retry = () => {
        setResult({ loading: true, error: '', data: null });
        setAttempt((n) => n + 1);
    };
    if (result.loading)
        return (
            <DashboardLoading
                type="individual"
                title="Loading dashboard..."
                description="Retrieving your contributions and community activity."
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
                    onClick={retry}
                    className="mt-4 border border-[#343E4B] bg-[#151C25] px-5 py-3 text-[12px] text-[#EEF1F5]! hover:bg-[#202A36]"
                >
                    Try again <ArrowRight size={14} className="inline" />
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
    const campaign = campaigns[0];
    const firstName =
        String(user.name || 'User')
            .trim()
            .split(/\s+/)[0] || 'User';
    const pending = requests.filter(
        (r) => String(r.status || '').toLowerCase() === 'pending',
    ).length;
    const verified = requests.filter(
        (r) => String(r.status || '').toLowerCase() === 'verified',
    ).length;
    const completed = requests.filter(
        (r) => String(r.status || '').toLowerCase() === 'completed',
    ).length;
    const supportCount =
        Number(donation.donationCount || 0) +
        Number(volunteer.activitiesCount || 0);
    const progress = Math.max(
        0,
        Math.min(100, Number(campaign?.progress) || 0),
    );
    const deadlineTime = campaign?.deadline
        ? new Date(campaign.deadline).getTime()
        : NaN;
    const remaining = Number.isNaN(deadlineTime)
        ? null
        : Math.max(
              0,
              Math.ceil((deadlineTime - currentDate.getTime()) / 86400000),
          );
    const go = (key) => {
        if (ROUTES[key]) navigate(ROUTES[key]);
    };

    return (
        <div className="min-h-full min-w-0 overflow-x-hidden text-[#E0E6ED]">
            <div className="mx-auto w-full max-w-382.5">
                <section className="overflow-hidden border border-[#29323E]">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_330px]">
                        <div className="flex flex-col items-start justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-11">
                            <p className="flex items-center gap-3 text-[10px] font-semibold! uppercase tracking-[0.16em] text-[#9FAFC0]">
                                <span className="h-0.5 w-7 bg-[#D9B47B]" />
                                Your space at Stand For People
                            </p>
                            <h1 className="mt-5 font-['Fraunces']! text-[32px]! font-semibold! leading-[1.17]! tracking-[-0.035em]! text-[#EEF1F5]! sm:text-[41px]!">
                                {greeting(currentDate)},{' '}
                                <span className="text-[#D9B47B]">
                                    {firstName}.
                                </span>
                            </h1>
                            <p className="mt-3 max-w-135 text-[13px] leading-6 text-[#AAB6C5]">
                                Your contributions, support requests and the
                                causes you care about — together in one place.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => go('requests')}
                                    className="inline-flex min-h-10 items-center gap-2 bg-[#D9B47B] px-4 text-[12px] font-semibold! text-[#151C25] hover:bg-[#E8C994]"
                                >
                                    <Plus size={15} />
                                    Request support <ArrowUpRight size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go('campaigns')}
                                    className="inline-flex min-h-10 items-center gap-2 border border-[#3A4654] px-4 text-[12px] font-semibold! text-[#E0E6ED] hover:bg-[#202A36]"
                                >
                                    Explore causes <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="relative flex flex-col justify-between overflow-hidden border-t border-[#354453] bg-[#243646] px-6 py-6 sm:px-7 lg:border-l lg:border-t-0">
                            {/* Header */}
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[10px] font-semibold! uppercase tracking-[0.16em] text-[#9FB6C9]">
                                    Your membership
                                </p>

                                <ShieldCheck
                                    size={17}
                                    className="text-[#A8C1D6]"
                                />
                            </div>

                            {/* Profile */}
                            <button
                                type="button"
                                onClick={() => go('profile')}
                                className="group my-6 flex w-full items-center gap-3.5 text-left"
                            >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#597087] bg-[#354A5F] text-[18px] font-semibold! text-[#EEF1F5]!">
                                    {firstName[0].toUpperCase()}
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[15px] font-semibold! text-[#EEF1F5]!">
                                        {user.name || 'User'}
                                    </span>

                                    <span className="mt-1 block text-[11px] text-[#B2C0CE]">
                                        Community member
                                    </span>
                                </span>

                                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#A9BACB] transition group-hover:translate-x-0.5 group-hover:text-white">
                                    <ArrowUpRight size={17} />
                                </span>
                            </button>

                            {/* Compact membership metadata */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#AFC0D0]">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin
                                        size={13}
                                        className="text-[#8FA8BD]"
                                    />
                                    {user.district || 'Location not provided'}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays
                                        size={13}
                                        className="text-[#8FA8BD]"
                                    />
                                    Joined {formatDate(user.memberSince)}
                                </span>
                            </div>

                            {/* Current date */}
                            <div className="mt-4 flex items-center justify-between gap-3 bg-[#2B4052] px-3.5 py-3">
                                <span className="text-[10px] font-medium! uppercase tracking-[0.1em] text-[#A8BCCD]">
                                    Today
                                </span>

                                <span className="text-right text-[11px] font-semibold! text-[#E8EDF3]!">
                                    {today(currentDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-7 grid min-w-0 grid-cols-1 items-start gap-y-9 sm:mt-9 sm:gap-y-11 min-[1025px]:grid-cols-[minmax(0,1fr)_270px] min-[1025px]:items-stretch min-[1025px]:gap-x-6 min-[1025px]:gap-y-0 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-x-8 2xl:grid-cols-[minmax(0,1fr)_330px]">
                    <main className="contents min-[1025px]:block min-[1025px]:min-w-0 min-[1025px]:space-y-12 xl:space-y-14">
                        <section
                            aria-label="Your contribution statistics"
                            className="order-1 grid min-w-0 grid-cols-2 overflow-hidden border border-[#34404D] bg-[#19232E] [&>button:nth-child(odd)]:border-r [&>button:nth-child(odd)]:border-r-[#34404D]/60 xl:grid-cols-4 xl:[&>button:nth-child(odd)]:border-r-0"
                        >
                            <Stat
                                icon={Wallet}
                                label="Total donated"
                                value={`৳${fmt(donation.totalDonated)}`}
                                note={`${fmt(donation.donationCount)} donations`}
                                color={C.amber}
                                onClick={() => go('donations')}
                            />
                            <Stat
                                icon={Clock3}
                                label="Volunteer hours"
                                value={fmt(volunteer.totalHours)}
                                note={`${fmt(volunteer.activitiesCount)} activities`}
                                color={C.green}
                                onClick={() => go('volunteer')}
                            />
                            <Stat
                                icon={HeartHandshake}
                                label="Acts of support"
                                value={fmt(supportCount)}
                                note="Giving & volunteering"
                                color={C.purple}
                                onClick={() => go('volunteer')}
                            />
                            <Stat
                                icon={Users}
                                label="Help requests"
                                value={fmt(requests.length)}
                                note={`${pending} awaiting review`}
                                color={C.blue}
                                onClick={() => go('requests')}
                            />
                        </section>
                        <section className="order-3 min-w-0">
                            <SectionHeading
                                kicker="Discover a cause"
                                title="Featured campaign"
                                action="Browse campaigns"
                                onAction={() => go('campaigns')}
                            />
                            <div className="mt-6 grid overflow-hidden bg-[#1B2833] lg:grid-cols-[minmax(0,1fr)_175px] xl:grid-cols-[minmax(0,1fr)_215px] 2xl:grid-cols-[minmax(0,1fr)_245px]">
                                <div className="relative flex min-h-65 flex-col justify-between p-6 sm:p-8">
                                    <div>
                                        <p className="flex items-center gap-2 text-[11px] font-semibold! uppercase tracking-[0.12em] text-[#D9B47B]">
                                            <Megaphone size={15} />
                                            {campaign?.category ||
                                                'Community initiative'}
                                        </p>
                                        <h3 className="mt-5 font-['Fraunces']! text-[23px]! font-semibold! leading-[1.35]! text-[#F1F4F8]! sm:text-[27px]!">
                                            {campaign?.title ||
                                                'Discover a community cause to support'}
                                        </h3>
                                        <p className="mt-3 text-[12px] leading-6 text-[#AAB9C8]">
                                            {campaign
                                                ? 'Help this community initiative reach more people with practical support.'
                                                : 'Explore humanitarian initiatives and choose a cause that matters to you.'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => go('campaigns')}
                                        className="mt-7 inline-flex w-fit items-center gap-2 text-[12px] font-semibold! text-[#D9B47B] hover:text-white"
                                    >
                                        Explore campaign{' '}
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                                <div className="flex flex-col justify-between border-t border-[#354353] bg-[#283C4C] p-6 lg:border-l lg:border-t-0 sm:p-7">
                                    <div>
                                        <p className={eyebrow}>
                                            Campaign funding
                                        </p>
                                        <p className="mt-5 text-[29px] font-semibold! tracking-tight text-[#F1F4F8]">
                                            ৳{fmt(campaign?.raised)}
                                        </p>
                                        <p className="mt-1 text-[12px] text-[#AAB9C8]">
                                            of ৳{fmt(campaign?.goal)} goal
                                        </p>
                                    </div>
                                    <div className="mt-10">
                                        <div className="flex justify-between text-[12px] text-[#C0CEDC]">
                                            <span>Funding progress</span>
                                            <strong className="text-[#EEF1F5]!">
                                                {progress}%
                                            </strong>
                                        </div>
                                        <div
                                            className="mt-3 h-1.5 bg-[#47596B]"
                                            role="progressbar"
                                            aria-label="Campaign funding progress"
                                            aria-valuenow={progress}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        >
                                            <div
                                                className="h-full bg-[#D9B47B]"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>
                                        {remaining !== null && (
                                            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#AAB9C8]">
                                                <Clock3 size={13} />
                                                {remaining === 0
                                                    ? 'Deadline reached'
                                                    : `${remaining} days remaining`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="order-4 min-w-0">
                            <SupportOverview
                                requests={requests}
                                pending={pending}
                                verified={verified}
                                completed={completed}
                                go={go}
                            />
                        </div>
                        <div className="order-6 min-w-0">
                            <ImpactOverview
                                donation={donation}
                                volunteer={volunteer}
                                go={go}
                            />
                        </div>
                        <div className="order-8 min-w-0">
                            <RecentActivity activities={activities} />
                        </div>
                    </main>

                    <aside className="contents min-[1025px]:flex min-[1025px]:min-w-0 min-[1025px]:flex-col min-[1025px]:justify-between min-[1025px]:border-l-2 min-[1025px]:border-[#405366] min-[1025px]:bg-[#1B2732]">
                        <section className="contents min-[1025px]:flex min-[1025px]:flex-col min-[1025px]:gap-12">
                            <div className="order-2 min-w-0 bg-[#1B2732] px-5 py-6 sm:px-7 sm:py-7 min-[1025px]:border-b min-[1025px]:border-[#344353]/60 min-[1025px]:px-5 min-[1025px]:py-7">
                                <QuickAccess go={go} />
                            </div>

                            <div className="order-7 min-w-0 bg-[#1B2732] px-5 py-7 sm:px-7 min-[1025px]:border-b min-[1025px]:border-[#344353]/60 min-[1025px]:px-5 min-[1025px]:pb-10">
                                <PersonalPulse
                                    go={go}
                                    volunteerCount={Number(
                                        volunteer.activitiesCount || 0,
                                    )}
                                    donationCount={Number(
                                        donation.donationCount || 0,
                                    )}
                                    totalDonated={donation.totalDonated}
                                    activities={activities}
                                />
                            </div>

                            <div className="order-5 min-w-0 bg-[#1B2732] px-5 py-7 sm:px-7 min-[1025px]:border-b min-[1025px]:border-[#344353]/60 min-[1025px]:px-5 min-[1025px]:pb-10">
                                <RequestSummary
                                    total={requests.length}
                                    pending={pending}
                                    verified={verified}
                                    completed={completed}
                                    go={go}
                                />
                            </div>
                        </section>

                        <section className="order-9 min-w-0 bg-[#1B2732] px-5 py-7 sm:px-7 min-[1025px]:border-t min-[1025px]:border-[#29323E] min-[1025px]:px-5 min-[1025px]:py-8">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div>
                                    <p className={eyebrow}>Your account</p>
                                    <h3 className="mt-2 text-[15px] font-semibold! text-[#EEF1F5]!">
                                        Workspace tools
                                    </h3>
                                </div>

                                <Settings2
                                    size={17}
                                    className="text-[#8FB9DC]"
                                />
                            </div>

                            <div className="flex flex-col">
                                <button
                                    type="button"
                                    onClick={() => go('profile')}
                                    className="group flex w-full items-center gap-3 py-3.5 text-left transition-colors hover:bg-[#243646]"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#293C4D] text-[#8FB9DC]">
                                        <UserRound size={17} />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[12px] font-semibold! text-[#EEF1F5]!">
                                            My profile
                                        </span>
                                        <span className="mt-1 block text-[10px] text-[#94A2B2]">
                                            Personal information
                                        </span>
                                    </span>

                                    <ArrowUpRight
                                        size={15}
                                        className="shrink-0 text-[#8798AA] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </button>

                                <div className="h-px bg-[#29323E]/70" />

                                <button
                                    type="button"
                                    onClick={() => go('notifications')}
                                    className="group flex w-full items-center gap-3 py-3.5 text-left transition-colors hover:bg-[#243646]"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#293C4D] text-[#8FB9DC]">
                                        <Bell size={17} />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[12px] font-semibold! text-[#EEF1F5]!">
                                            Notifications
                                        </span>
                                        <span className="mt-1 block text-[10px] text-[#94A2B2]">
                                            Updates and alerts
                                        </span>
                                    </span>

                                    <ArrowUpRight
                                        size={15}
                                        className="shrink-0 text-[#8798AA] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </button>

                                <div className="h-px bg-[#29323E]/70" />

                                <button
                                    type="button"
                                    onClick={() => go('settings')}
                                    className="group flex w-full items-center gap-3 py-3.5 text-left transition-colors hover:bg-[#243646]"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#293C4D] text-[#8FB9DC]">
                                        <Settings2 size={17} />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[12px] font-semibold! text-[#EEF1F5]!">
                                            Settings
                                        </span>
                                        <span className="mt-1 block text-[10px] text-[#94A2B2]">
                                            Workspace preferences
                                        </span>
                                    </span>

                                    <ArrowUpRight
                                        size={15}
                                        className="shrink-0 text-[#8798AA] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </button>
                            </div>
                        </section>
                    </aside>
                </div>
                <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-[#29323E] py-5 text-[11px] text-[#8792A1]">
                    <span>Stand For People · Individual workspace</span>
                    <span>Community support and coordination</span>
                </footer>
            </div>
        </div>
    );
}
