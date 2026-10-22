import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
    ArrowLeft,
    ArrowUpRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    ClipboardList,
    Clock3,
    FileText,
    FolderOpen,
    Globe2,
    HandCoins,
    Info,
    Layers3,
    Link2,
    MapPin,
    Tag,
    UserRound,
    Wallet,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import { fetchCampaigns } from './api/campaignsAPI';

// ============================================================
// CONFIGURATION
// ============================================================

const CAMPAIGNS_ROUTE = '/admin/dashboard/campaigns';

const STATUS_CONFIG = {
    active: {
        label: 'Active',
        icon: CheckCircle2,
        className: 'border-[#345044] bg-[#1B3029] text-[#A3C8B4]',
    },
    unverified: {
        label: 'Unverified',
        icon: CircleAlert,
        className: 'border-[#5A472D] bg-[#30271C] text-[#D8B37C]',
    },
    completed: {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'border-[#394A60] bg-[#202D40] text-[#B1C3DD]',
    },
    rejected: {
        label: 'Rejected',
        icon: CircleAlert,
        className: 'border-[#593A41] bg-[#342126] text-[#DEA7AE]',
    },
    cancelled: {
        label: 'Cancelled',
        icon: CircleAlert,
        className: 'border-[#343E4B] bg-[#20252D] text-[#ABB5C1]',
    },
};

// ============================================================
// HELPERS
// ============================================================

function formatDate(value, includeTime = false) {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not provided';
    }

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(includeTime
            ? {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
              }
            : {}),
    });
}

function formatMoney(value) {
    const amount = Number(value ?? 0);

    return `৳${(Number.isFinite(amount) ? amount : 0).toLocaleString('en-BD')}`;
}

function formatText(value, fallback = 'Not provided') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    if (typeof value === 'object') {
        return (
            value.name ||
            value.title ||
            value.label ||
            value.address ||
            fallback
        );
    }

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatType(type) {
    const labels = {
        local_case: 'Local Case',
        local_help_request: 'Local Help Request',
        organization_proposed: 'Organization Proposed',
        global_situation: 'Global Situation',
        state_campaign: 'State Campaign',
    };

    return labels[type] || formatText(type);
}

function getLocation(campaign) {
    return formatText(
        campaign?.location || campaign?.address || campaign?.district,
        'Not specified',
    );
}

function getOrganizer(campaign) {
    return (
        campaign?.organization?.name ||
        campaign?.organization?.organization_name ||
        campaign?.organization_name ||
        (campaign?.type === 'global_situation'
            ? 'Stand For People'
            : 'Not assigned')
    );
}

function getProgress(collected, target) {
    const raised = Number(collected);
    const goal = Number(target);

    if (!Number.isFinite(raised) || !Number.isFinite(goal) || goal <= 0) {
        return 0;
    }

    return Math.max(0, Math.min(100, (raised / goal) * 100));
}

function formatReference(value, fallback = 'Not assigned') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    return `#${value}`;
}

// ============================================================
// STATUS
// ============================================================

function CampaignStatus({ status }) {
    const config = STATUS_CONFIG[status] || {
        label: formatText(status, 'Unknown'),
        icon: CircleAlert,
        className: 'border-[#343E4B] bg-[#20252D] text-[#ABB5C1]',
    };

    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex min-h-7 items-center gap-1.5
                border px-2.5 text-[11px] font-medium
                ${config.className}
            `}
        >
            <Icon size={13} strokeWidth={1.8} />
            {config.label}
        </span>
    );
}

// ============================================================
// SHARED SECTION HEADING
// ============================================================

function SectionHeading({ icon: Icon, title, detail }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#34404D] bg-[#202A35]">
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className="text-[#A2B8B6]"
                    />
                </span>

                <h2 className="!m-0 !font-sans !text-[16px] !font-semibold !tracking-[-0.02em] !text-[#EEF1F5]">
                    {title}
                </h2>
            </div>

            {detail && (
                <span className="text-[11px] text-[#8792A1]">{detail}</span>
            )}
        </div>
    );
}

function SidebarHeading({ icon: Icon, title }) {
    return (
        <div className="flex min-h-[54px] items-center gap-3 border-b border-[#303A47] bg-[#1C242E] px-5 sm:px-6">
            <Icon
                size={16}
                strokeWidth={1.7}
                className="shrink-0 text-[#9DAFAF]"
            />

            <h2 className="!m-0 !font-sans !text-[13px] !font-semibold !text-[#EEF1F5]">
                {title}
            </h2>
        </div>
    );
}

// ============================================================
// CAMPAIGN IDENTITY
// ============================================================

function IdentityMeta({ icon: Icon, children }) {
    return (
        <div className="flex min-w-0 items-center gap-2">
            <Icon
                size={14}
                strokeWidth={1.7}
                className="shrink-0 text-[#92AAA9]"
            />

            <span className="min-w-0 break-words text-[12px] leading-5 text-[#B8C5D2]">
                {children}
            </span>
        </div>
    );
}

function CampaignIdentity({ campaign }) {
    return (
        <section className="min-w-0 border-b border-[#303A47] pb-6 sm:pb-7">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#91A0AF]">
                    Campaign #{campaign.id}
                </span>

                <span className="h-3 w-px bg-[#3B4653]" />

                <CampaignStatus status={campaign.status} />
            </div>

            <h1
                className="
                    !mb-0 !mt-4 max-w-5xl break-words
                    !font-sans !text-[26px] !font-semibold
                    !leading-[1.3] !tracking-[-0.035em]
                    !text-[#EEF1F5]
                    sm:!text-[31px] xl:!text-[34px]
                "
            >
                {campaign.title || 'Untitled campaign'}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <IdentityMeta icon={Layers3}>
                    {formatType(campaign.type)}
                </IdentityMeta>

                {campaign.category && (
                    <IdentityMeta icon={Tag}>
                        {formatText(campaign.category)}
                    </IdentityMeta>
                )}
            </div>
        </section>
    );
}

// ============================================================
// ABOUT CAMPAIGN
// ============================================================

function AboutCampaign({ campaign }) {
    return (
        <section className="min-w-0 px-5 py-6 sm:px-7 sm:py-7">
            <SectionHeading icon={FileText} title="About campaign" />

            <div className="mt-4 sm:pl-11">
                <p
                    className="
                        !m-0 max-w-4xl whitespace-pre-wrap break-words
                        text-[14px] leading-[1.9] !text-[#BAC5D1]
                        sm:text-[15px]
                    "
                >
                    {campaign.description ||
                        'No campaign description has been provided.'}
                </p>
            </div>
        </section>
    );
}

// ============================================================
// KEY INFORMATION
// ============================================================

function InformationRow({ icon: Icon, label, value, last = false }) {
    return (
        <div
            className={`
                grid min-w-0 grid-cols-1 gap-1.5 py-3.5
                sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1.2fr)]
                sm:items-start sm:gap-4
                ${last ? '' : 'border-b border-[#303A47]'}
            `}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={14}
                    strokeWidth={1.65}
                    className="shrink-0 text-[#879AAA]"
                />

                <span className="text-[12px] leading-5 text-[#94A3B4]">
                    {label}
                </span>
            </div>

            <span className="min-w-0 break-words text-[13px] font-medium leading-[1.7] text-[#E1E8F0]">
                {value}
            </span>
        </div>
    );
}

function KeyInformation({ campaign }) {
    const leftRows = [
        {
            label: 'Location',
            value: getLocation(campaign),
            icon: MapPin,
        },
        {
            label: 'District',
            value: formatText(campaign.district, 'Not specified'),
            icon: Building2,
        },
        {
            label: 'Affected areas',
            value: formatText(campaign.affected_areas),
            icon: Globe2,
        },
    ];

    const rightRows = [
        {
            label: 'Organizer',
            value: getOrganizer(campaign),
            icon: UserRound,
        },
        {
            label: 'Organization ID',
            value: formatReference(campaign.organization_id),
            icon: ClipboardList,
        },
        {
            label: 'Help request',
            value: formatReference(
                campaign.help_request_id ?? campaign.help_request?.id,
                'Not linked',
            ),
            icon: Link2,
        },
    ];

    return (
        <section className="min-w-0 px-5 py-6 sm:px-7 sm:py-7">
            <SectionHeading icon={Info} title="Key information" />

            <div className="mt-4 grid min-w-0 grid-cols-1 gap-x-8 lg:grid-cols-2">
                <div className="min-w-0">
                    {leftRows.map((row, index) => (
                        <InformationRow
                            key={row.label}
                            {...row}
                            last={index === leftRows.length - 1}
                        />
                    ))}
                </div>

                <div className="min-w-0 border-t border-[#303A47] lg:border-l lg:border-t-0 lg:pl-8">
                    {rightRows.map((row, index) => (
                        <InformationRow
                            key={row.label}
                            {...row}
                            last={index === rightRows.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// MAIN CAMPAIGN INFORMATION PANEL
// ============================================================

function CampaignInformation({ campaign }) {
    return (
        <div className="min-w-0 overflow-hidden border border-[#343E4B] bg-[#1B222C]">
            <AboutCampaign campaign={campaign} />

            <div className="mx-5 border-t border-[#343E4B] sm:mx-7" />

            <KeyInformation campaign={campaign} />
        </div>
    );
}

// ============================================================
// CAMPAIGN TIMELINE
// ============================================================

function CampaignTimeline({ campaign }) {
    const events = [
        {
            key: 'proposal',
            date: campaign.proposal_date,
            title: 'Proposal submitted',
            description: 'Campaign proposal',
        },
        {
            key: 'started',
            date: campaign.start_date,
            title: 'Campaign starts',
            description: 'Scheduled start',
        },
        {
            key: 'ended',
            date: campaign.end_date,
            title: 'Campaign ends',
            description: 'Scheduled end',
        },
    ]
        .filter(
            (event) =>
                event.date && !Number.isNaN(new Date(event.date).getTime()),
        )
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

    return (
        <section className="min-w-0 overflow-hidden border border-[#343E4B] bg-[#1B222C]">
            <div className="border-b border-[#343E4B] px-5 py-4 sm:px-7">
                <SectionHeading
                    icon={CalendarDays}
                    title="Campaign timeline"
                    detail={
                        events.length
                            ? `${events.length} milestone${events.length === 1 ? '' : 's'}`
                            : undefined
                    }
                />
            </div>

            <div className="px-5 py-6 sm:px-7">
                {events.length > 0 ? (
                    <>
                        {/* DESKTOP TIMELINE */}
                        <ol className="relative !m-0 hidden min-w-0 !list-none grid-cols-3 !p-0 md:grid">
                            {events.map((event, index) => (
                                <li
                                    key={event.key}
                                    className="relative min-w-0 px-3 first:pl-0 last:pr-0"
                                >
                                    {index < events.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-3 right-0 top-[7px] h-px bg-[#52645F]"
                                        />
                                    )}

                                    <span className="relative z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-[#82AEA2] bg-[#1B222C]">
                                        <span className="h-[5px] w-[5px] rounded-full bg-[#82AEA2]" />
                                    </span>

                                    <div className="mt-4 min-w-0 pr-3">
                                        <p className="!m-0 text-[11px] font-medium leading-5 text-[#92AAA9]">
                                            {event.description}
                                        </p>

                                        <h3 className="!mb-0 !mt-1.5 break-words text-[13px] font-semibold leading-5 text-[#E8EDF3]">
                                            {event.title}
                                        </h3>

                                        <p className="!mb-0 !mt-2 break-words text-[12px] leading-5 text-[#AAB7C5]">
                                            {formatDate(event.date)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        {/* MOBILE TIMELINE */}
                        <ol className="!m-0 !list-none !p-0 md:hidden">
                            {events.map((event, index) => (
                                <li
                                    key={event.key}
                                    className="relative flex min-w-0 gap-4"
                                >
                                    <div className="relative flex w-4 shrink-0 justify-center">
                                        <span className="relative z-10 mt-1 h-[13px] w-[13px] rounded-full border-2 border-[#82AEA2] bg-[#1B222C]" />

                                        {index < events.length - 1 && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute bottom-0 left-1/2 top-4 w-px -translate-x-1/2 bg-[#52645F]"
                                            />
                                        )}
                                    </div>

                                    <div
                                        className={`
                                            min-w-0 flex-1
                                            ${index < events.length - 1 ? 'pb-6' : ''}
                                        `}
                                    >
                                        <p className="!m-0 text-[11px] font-medium text-[#92AAA9]">
                                            {event.description}
                                        </p>

                                        <h3 className="!mb-0 !mt-1.5 break-words text-[13px] font-semibold leading-5 text-[#E8EDF3]">
                                            {event.title}
                                        </h3>

                                        <p className="!mb-0 !mt-1.5 break-words text-[12px] leading-5 text-[#AAB7C5]">
                                            {formatDate(event.date)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </>
                ) : (
                    <div className="flex items-start gap-3 py-1">
                        <CalendarDays
                            size={17}
                            className="mt-0.5 shrink-0 text-[#8792A1]"
                        />

                        <p className="!m-0 text-[12px] leading-6 text-[#8792A1]">
                            No campaign dates have been provided.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

// ============================================================
// FUNDING OVERVIEW
// ============================================================

function FinanceRow({ icon: Icon, label, value, last = false }) {
    return (
        <div
            className={`
                flex min-w-0 items-center justify-between gap-3 py-3.5
                ${last ? '' : 'border-b border-[#303A47]'}
            `}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={14}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#8792A1]"
                />

                <span className="text-[12px] text-[#9DAAB9]">{label}</span>
            </div>

            <span className="min-w-0 text-right text-[12px] font-semibold tabular-nums text-[#DCE4ED]">
                {value}
            </span>
        </div>
    );
}

function FundingOverview({ campaign, progress, remaining }) {
    const collected = campaign.collected_amount ?? campaign.raised_amount ?? 0;

    return (
        <section className="min-w-0 overflow-hidden border border-[#343E4B] bg-[#1B222C]">
            <SidebarHeading icon={Wallet} title="Funding overview" />

            <div className="px-5 pb-5 pt-6 sm:px-6">
                <div>
                    <p className="!m-0 text-[12px] font-medium text-[#9EACBB]">
                        Total funds raised
                    </p>

                    <p
                        className="
                            !mb-0 !mt-2 break-words !font-sans
                            !text-[30px] !font-semibold !leading-tight
                            !tracking-[-0.045em] tabular-nums !text-[#EEF1F5]
                            sm:!text-[34px]
                        "
                    >
                        {formatMoney(collected)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[12px] text-[#8792A1]">
                            Target amount
                        </span>

                        <span className="text-[13px] font-semibold tabular-nums text-[#CED8E2]">
                            {formatMoney(campaign.target_amount)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 border-t border-[#343E4B] pt-5">
                    <div className="flex items-end justify-between gap-3">
                        <span className="text-[12px] font-medium text-[#B0BCC8]">
                            Goal completion
                        </span>

                        <span className="text-[21px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[#A3C8B4]">
                            {progress.toFixed(1)}%
                        </span>
                    </div>

                    <div
                        className="mt-4 h-[7px] overflow-hidden bg-[#303C49]"
                        role="progressbar"
                        aria-label="Funding progress"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                    >
                        <div
                            className="h-full bg-[#82AEA2] transition-[width] duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-2 flex justify-between text-[11px] tabular-nums text-[#8792A1]">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="mt-5 border-t border-[#343E4B]">
                    <FinanceRow
                        icon={HandCoins}
                        label="Collected"
                        value={formatMoney(collected)}
                    />

                    <FinanceRow
                        icon={Wallet}
                        label="Remaining"
                        value={formatMoney(remaining)}
                        last
                    />
                </div>
            </div>
        </section>
    );
}

// ============================================================
// RECORD HISTORY
// ============================================================

function RecordHistory({ campaign }) {
    return (
        <section className="min-w-0 overflow-hidden border border-[#343E4B] bg-[#1B222C]">
            <SidebarHeading icon={Clock3} title="Record history" />

            <dl className="!m-0 px-5 py-1 sm:px-6">
                <div className="flex items-start justify-between gap-3 border-b border-[#303A47] py-4">
                    <dt className="text-[12px] text-[#94A3B4]">Created</dt>

                    <dd className="!m-0 max-w-[65%] text-right text-[12px] font-medium tabular-nums text-[#DCE4ED]">
                        {formatDate(campaign.created_at, true)}
                    </dd>
                </div>

                <div className="flex items-start justify-between gap-3 py-4">
                    <dt className="text-[12px] text-[#94A3B4]">Last updated</dt>

                    <dd className="!m-0 max-w-[65%] text-right text-[12px] font-medium tabular-nums text-[#DCE4ED]">
                        {formatDate(campaign.updated_at, true)}
                    </dd>
                </div>
            </dl>
        </section>
    );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function CampaignDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const volunteerContext = location.state?.fromVolunteer;

    const volunteerPath =
        typeof volunteerContext?.path === 'string' &&
        /^\/admin\/dashboard\/volunteers\/[^/?#]+\/?$/.test(
            volunteerContext.path,
        )
            ? volunteerContext.path
            : null;

    // --------------------------------------------------------
    // FETCH CAMPAIGN
    // --------------------------------------------------------

    useEffect(() => {
        let cancelled = false;

        const loadCampaign = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetchCampaigns();

                if (cancelled) return;

                const campaigns =
                    response?.campaigns ||
                    response?.data?.campaigns ||
                    response?.data ||
                    [];

                if (!Array.isArray(campaigns)) {
                    throw new Error(
                        'Invalid campaign data received from the server.',
                    );
                }

                const found = campaigns.find(
                    (item) => String(item?.id) === String(id),
                );

                if (!found) {
                    setCampaign(null);
                    setError('Campaign record could not be found.');
                    return;
                }

                setCampaign(found);
            } catch (err) {
                if (!cancelled) {
                    setCampaign(null);
                    setError(
                        err?.message || 'Unable to load campaign details.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCampaign();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // --------------------------------------------------------
    // FINANCIAL VALUES
    // --------------------------------------------------------

    const collected = Number(
        campaign?.collected_amount ?? campaign?.raised_amount ?? 0,
    );

    const target = Number(campaign?.target_amount ?? 0);

    const progress = useMemo(
        () =>
            getProgress(
                campaign?.collected_amount ?? campaign?.raised_amount,
                campaign?.target_amount,
            ),
        [
            campaign?.collected_amount,
            campaign?.raised_amount,
            campaign?.target_amount,
        ],
    );

    const remaining = Math.max(
        0,
        (Number.isFinite(target) ? target : 0) -
            (Number.isFinite(collected) ? collected : 0),
    );

    // --------------------------------------------------------
    // PAGE HEADER
    // --------------------------------------------------------

    const header = (
        <PageHeader
            title="Campaign Details"
            subtitle="Campaign information, funding, and organizational records."
            action={
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                    {volunteerPath && (
                        <button
                            type="button"
                            onClick={() => navigate(volunteerPath)}
                            className="
                                inline-flex min-h-10 items-center gap-2
                                border border-[#343E4B] bg-[#202833]
                                px-3.5 text-[12px] font-medium
                                !text-[#CED6DF] transition-colors
                                hover:bg-[#2A3543]
                            "
                        >
                            <ArrowLeft size={15} />
                            Back to Volunteer
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate(CAMPAIGNS_ROUTE)}
                        className="
                            inline-flex min-h-10 items-center gap-2
                            border border-[#343E4B] bg-transparent
                            px-3.5 text-[12px] font-medium
                            !text-[#C3CDD8] transition-colors
                            hover:border-[#506071] hover:bg-[#202A35]
                        "
                    >
                        <FolderOpen size={15} />
                        All Campaigns
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            }
        />
    );

    // --------------------------------------------------------
    // LOADING
    // --------------------------------------------------------

    if (loading) {
        return (
            <div className="min-w-0 space-y-6">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading campaign..."
                    description="Retrieving the campaign record."
                />
            </div>
        );
    }

    // --------------------------------------------------------
    // ERROR
    // --------------------------------------------------------

    if (error || !campaign) {
        return (
            <div className="min-w-0 space-y-6">
                {header}

                <LoadingError
                    title="Unable to load campaign"
                    message={error || 'Campaign not found.'}
                />
            </div>
        );
    }

    // --------------------------------------------------------
    // CONTENT
    // --------------------------------------------------------

    return (
        <main className="min-w-0 max-w-full space-y-6 overflow-x-hidden pb-12 font-sans sm:space-y-7">
            {header}

            <CampaignIdentity campaign={campaign} />

            <div
                className="
                    grid min-w-0 grid-cols-1 items-start gap-5
                    xl:grid-cols-[minmax(0,1fr)_320px]
                    xl:gap-6
                    2xl:grid-cols-[minmax(0,1fr)_350px]
                "
            >
                {/* MAIN CONTENT */}
                <div className="flex min-w-0 flex-col gap-5">
                    <CampaignInformation campaign={campaign} />

                    <CampaignTimeline campaign={campaign} />
                </div>

                {/* RIGHT SIDEBAR */}
                <aside className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-5">
                    <FundingOverview
                        campaign={campaign}
                        progress={progress}
                        remaining={remaining}
                    />

                    <RecordHistory campaign={campaign} />
                </aside>
            </div>
        </main>
    );
}
