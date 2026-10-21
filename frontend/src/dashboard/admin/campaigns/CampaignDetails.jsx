import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    FileText,
    FolderOpen,
    HandCoins,
    MapPin,
    Target,
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

const PANEL = 'min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]';

// ============================================================
// HELPERS
// ============================================================

function formatDate(value) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatMoney(value) {
    const amount = Number(value ?? 0);

    return `৳${(Number.isFinite(amount) ? amount : 0).toLocaleString('en-BD')}`;
}

function formatType(type) {
    const labels = {
        local_case: 'Local Case',
        organization_proposed: 'Organization Proposed',
        global_situation: 'Global Situation',
    };

    return labels[type] || type || '—';
}

function getLocation(campaign) {
    const value = campaign?.location || campaign?.district || campaign?.address;

    if (!value) return 'Not specified';

    if (typeof value === 'object') {
        return value.name || value.district || value.address || 'Not specified';
    }

    return String(value);
}

function getOrganization(campaign) {
    return (
        campaign?.organization?.name ||
        campaign?.organization_name ||
        'Not assigned'
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

// ============================================================
// STATUS
// ============================================================

function CampaignStatus({ status }) {
    const config = STATUS_CONFIG[status] || {
        label: status || 'Unknown',
        icon: CircleAlert,
        className: 'border-[#343E4B] bg-[#20252D] text-[#ABB5C1]',
    };

    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex min-h-7 shrink-0
                items-center gap-1.5
                border px-2.5
                text-[11px] font-medium
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
// Matches Donation Details
// ============================================================

function SectionHeading({ icon: Icon, title, action }) {
    return (
        <div
            className="
                flex min-h-15 min-w-0
                flex-wrap items-center
                justify-between
                gap-x-4 gap-y-2
                border-b border-[#29323E]
                bg-[#171E28]
                px-5 py-3.5
                sm:px-6
            "
        >
            <div className="flex min-w-0 items-center gap-3">
                <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#92AAA9]"
                />

                <h2
                    className="
                        !m-0 min-w-0
                        !font-sans
                        !text-[15px]
                        !font-semibold
                        !tracking-[-0.015em]
                        !text-[#EEF1F5]
                    "
                >
                    {title}
                </h2>
            </div>

            {action}
        </div>
    );
}

// ============================================================
// INFORMATION ROW
// ============================================================

function RecordRow({ label, value, last = false }) {
    return (
        <div
            className={`
                grid min-w-0
                gap-1.5 py-3.5
                sm:grid-cols-[minmax(135px,0.8fr)_minmax(0,1.2fr)]
                sm:items-center sm:gap-5
                ${last ? '' : 'border-b border-[#252D38]'}
            `}
        >
            <dt
                className="
                    text-[12px]
                    leading-5
                    !text-[#8792A1]
                "
            >
                {label}
            </dt>

            <dd
                className="
                    !m-0 min-w-0
                    wrap-break-word
                    text-[13px] font-medium
                    leading-5
                    !text-[#DCE4ED]
                "
            >
                {value ?? '—'}
            </dd>
        </div>
    );
}

// ============================================================
// CAMPAIGN IDENTITY
// Open summary matching Donation Details
// ============================================================

function CampaignIdentity({ campaign }) {
    const hasDates =
        campaign.start_date || campaign.end_date || campaign.proposal_date;

    return (
        <section
            className="
                min-w-0
                pb-5 sm:pb-6
            "
        >
            <div className="flex min-w-0 flex-col gap-4">
                {/* CAMPAIGN REFERENCE */}
                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className="
                            text-[11px] font-semibold
                            uppercase
                            tracking-[0.12em]
                            !text-[#8792A1]
                        "
                    >
                        Campaign #{campaign.id}
                    </span>

                    <CampaignStatus status={campaign.status} />
                </div>

                {/* TITLE */}
                <h1
                    className="
                        !m-0 max-w-4xl
                        wrap-break-word
                        !font-sans
                        !text-[23px]
                        !font-semibold
                        !leading-[1.35]
                        !tracking-[-0.035em]
                        !text-[#EEF1F5]
                        sm:!text-[27px]
                        xl:!text-[30px]
                    "
                >
                    {campaign.title || 'Untitled campaign'}
                </h1>

                {/* DATES */}
                {hasDates && (
                    <div
                        className="
                            flex min-w-0 flex-wrap
                            items-center
                            gap-x-7 gap-y-3
                            pt-1
                        "
                    >
                        {(campaign.start_date || campaign.end_date) && (
                            <div
                                className="
                                    flex min-w-0
                                    items-center gap-2
                                "
                            >
                                <CalendarDays
                                    size={15}
                                    strokeWidth={1.7}
                                    className="
                                        shrink-0
                                        text-[#8EA7A6]
                                    "
                                />

                                <span
                                    className="
                                        text-[12px]
                                        font-medium
                                        tabular-nums
                                        !text-[#B8C5D2]
                                    "
                                >
                                    {formatDate(campaign.start_date)}
                                    {' – '}
                                    {formatDate(campaign.end_date)}
                                </span>
                            </div>
                        )}

                        {campaign.proposal_date && (
                            <div
                                className="
                                    flex min-w-0
                                    items-center gap-2
                                "
                            >
                                <FileText
                                    size={15}
                                    strokeWidth={1.7}
                                    className="
                                        shrink-0
                                        text-[#8EA7A6]
                                    "
                                />

                                <span
                                    className="
                                        text-[12px]
                                        !text-[#8792A1]
                                    "
                                >
                                    Submitted{' '}
                                    <span className="font-medium !text-[#B8C5D2]">
                                        {formatDate(campaign.proposal_date)}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
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
        <section className={PANEL}>
            <SectionHeading icon={FileText} title="About this campaign" />

            <div className="px-5 py-5 sm:px-6 sm:py-6">
                <p
                    className="
                        !m-0 max-w-3xl
                        whitespace-pre-wrap
                        wrap-break-word
                        text-[14px]
                        leading-[1.85]
                        !text-[#B8C5D2]
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
// CAMPAIGN INFORMATION
// ============================================================

function CampaignInformation({ campaign }) {
    return (
        <section className={PANEL}>
            <SectionHeading icon={MapPin} title="Campaign information" />

            <dl className="px-5 sm:px-6">
                <RecordRow
                    label="Campaign type"
                    value={formatType(campaign.type)}
                />

                <RecordRow label="Category" value={campaign.category || '—'} />

                <RecordRow label="Location" value={getLocation(campaign)} />

                <RecordRow
                    label="Connected organization"
                    value={getOrganization(campaign)}
                />

                <RecordRow
                    label="Organization ID"
                    value={
                        campaign.organization_id != null
                            ? `#${campaign.organization_id}`
                            : '—'
                    }
                    last
                />
            </dl>
        </section>
    );
}

// ============================================================
// FUNDING ROW
// ============================================================

function FinanceRow({
    icon: Icon,
    label,
    value,
    accent = false,
    last = false,
}) {
    return (
        <div
            className={`
                flex min-w-0 flex-wrap
                items-center justify-between
                gap-x-4 gap-y-1
                py-3.5
                ${last ? '' : 'border-b border-[#252D38]'}
            `}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={15}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#8792A1]"
                />

                <span className="text-[12px] !text-[#9DAAB9]">{label}</span>
            </div>

            <span
                className={`
                    min-w-0 text-right
                    text-[13px] font-semibold
                    tabular-nums
                    ${accent ? '!text-[#A3C8B4]' : '!text-[#DCE4ED]'}
                `}
            >
                {value}
            </span>
        </div>
    );
}

// ============================================================
// FUNDING OVERVIEW
// Existing layout retained
// ============================================================

function FundingOverview({ campaign, progress, remaining }) {
    return (
        <aside className={`${PANEL} self-start`}>
            <SectionHeading icon={Wallet} title="Funding overview" />

            <div className="px-5 pb-6 pt-6 sm:px-6">
                {/* RAISED AMOUNT */}
                <div>
                    <p className="!m-0 text-[12px] font-medium !text-[#94A3B4]">
                        Total funds raised
                    </p>

                    <p
                        className="
                            !mb-0 !mt-2
                            wrap-break-word
                            !font-sans
                            !text-[30px]
                            !font-semibold
                            !leading-tight
                            !tracking-[-0.045em]
                            tabular-nums
                            !text-[#EEF1F5]
                            sm:!text-[34px]
                        "
                    >
                        {formatMoney(campaign.collected_amount)}
                    </p>

                    <p className="mt-2 text-[12px] !text-[#8792A1]">
                        of {formatMoney(campaign.target_amount)} target
                    </p>
                </div>

                {/* PROGRESS */}
                <div className="mt-7">
                    <div className="mb-3 flex items-end justify-between gap-4">
                        <span className="text-[12px] !text-[#A8B5C2]">
                            Goal completion
                        </span>

                        <span
                            className="
                                text-[21px]
                                font-semibold
                                leading-none
                                tabular-nums
                                tracking-[-0.035em]
                                !text-[#A3C8B4]
                            "
                        >
                            {progress.toFixed(1)}%
                        </span>
                    </div>

                    <div
                        className="
                            h-1.75 overflow-hidden
                            bg-[#2A3542]
                        "
                        role="progressbar"
                        aria-label="Funding progress"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                    >
                        <div
                            className="
                                h-full
                                bg-[#82AEA2]
                                transition-[width]
                                duration-500
                            "
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <div
                        className="
                            mt-2.5 flex justify-between
                            text-[11px]
                            tabular-nums
                            text-[#798899]
                        "
                    >
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* FINANCIAL BREAKDOWN */}
                <div
                    className="
                        mt-7 border-t
                        border-[#29323E]
                        pt-5
                    "
                >
                    <div className="mb-2 flex items-center gap-2">
                        <HandCoins
                            size={15}
                            strokeWidth={1.7}
                            className="text-[#92AAA9]"
                        />

                        <h3
                            className="
                                !m-0 !font-sans
                                !text-[13px]
                                !font-semibold
                                !text-[#DCE4ED]
                            "
                        >
                            Financial breakdown
                        </h3>
                    </div>

                    <div>
                        <FinanceRow
                            icon={Target}
                            label="Target amount"
                            value={formatMoney(campaign.target_amount)}
                        />

                        <FinanceRow
                            icon={HandCoins}
                            label="Collected"
                            value={formatMoney(campaign.collected_amount)}
                            accent
                        />

                        <FinanceRow
                            icon={Wallet}
                            label="Remaining"
                            value={formatMoney(remaining)}
                            last
                        />
                    </div>
                </div>
            </div>
        </aside>
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

    // --------------------------------------------------------
    // VOLUNTEER NAVIGATION CONTEXT
    // --------------------------------------------------------

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
    // FINANCIAL CALCULATIONS
    // --------------------------------------------------------

    const progress = useMemo(
        () => getProgress(campaign?.collected_amount, campaign?.target_amount),
        [campaign?.collected_amount, campaign?.target_amount],
    );

    const target = Number(campaign?.target_amount ?? 0);
    const collected = Number(campaign?.collected_amount ?? 0);

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
                                inline-flex min-h-10
                                min-w-0 items-center
                                justify-center gap-2
                                border border-[#343E4B]
                                bg-[#202833]
                                px-3.5
                                text-[12px] font-medium
                                !text-[#CED6DF]
                                transition-colors
                                hover:border-[#526071]
                                hover:bg-[#2A3543]
                            "
                        >
                            <ArrowLeft size={15} className="shrink-0" />
                            Back to Volunteer
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate(CAMPAIGNS_ROUTE)}
                        className="
                            inline-flex min-h-10
                            min-w-0 items-center
                            justify-center gap-2
                            border border-[#343E4B]
                            bg-transparent
                            px-3.5
                            text-[12px] font-medium
                            !text-[#C3CDD8]
                            transition-colors
                            hover:border-[#506071]
                            hover:bg-[#202A35]
                            hover:!text-white
                        "
                    >
                        <FolderOpen size={15} className="shrink-0" />
                        All Campaigns
                        <ArrowUpRight
                            size={14}
                            className="shrink-0 text-[#8792A1]"
                        />
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
        <main
            className="
                min-w-0 max-w-full
                space-y-6
                overflow-x-hidden
                pb-10 font-sans
            "
        >
            {header}

            {/* CAMPAIGN IDENTITY */}
            <CampaignIdentity campaign={campaign} />

            {/* MAIN LAYOUT — UNCHANGED */}
            <div
                className="
                    grid min-w-0
                    grid-cols-1
                    items-start gap-5
                    xl:grid-cols-[minmax(0,1fr)_340px]
                    2xl:grid-cols-[minmax(0,1fr)_360px]
                "
            >
                {/* LEFT COLUMN */}
                <div className="flex min-w-0 flex-col gap-5">
                    <AboutCampaign campaign={campaign} />

                    <CampaignInformation campaign={campaign} />
                </div>

                {/* RIGHT COLUMN */}
                <FundingOverview
                    campaign={campaign}
                    progress={progress}
                    remaining={remaining}
                />
            </div>
        </main>
    );
}
