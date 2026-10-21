import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    Clock3,
    FileText,
    FolderOpen,
    HandCoins,
    Target,
    Wallet,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import { fetchCampaigns } from './api/campaignsAPI';

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

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatMoney = (value) => {
    const amount = Number(value ?? 0);
    return `৳${(Number.isFinite(amount) ? amount : 0).toLocaleString('en-BD')}`;
};

const formatType = (type) => {
    const labels = {
        local_case: 'Local Case',
        organization_proposed: 'Organization Proposed',
        global_situation: 'Global Situation',
    };

    return labels[type] || type || '—';
};

const getLocation = (campaign) =>
    campaign?.location ||
    campaign?.district ||
    campaign?.address ||
    'Not specified';

const getOrganization = (campaign) =>
    campaign?.organization?.name ||
    campaign?.organization_name ||
    'Not assigned';

const getProgress = (collected, target) => {
    const a = Number(collected);
    const b = Number(target);

    if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) {
        return 0;
    }

    return Math.max(0, Math.min(100, (a / b) * 100));
};

function CampaignStatus({ status }) {
    const config = STATUS_CONFIG[status] || {
        label: status || 'Unknown',
        icon: CircleAlert,
        className: 'border-[#343E4B] bg-[#20252D] text-[#ABB5C1]',
    };

    const Icon = config.icon;

    return (
        <span
            className={`inline-flex h-7 shrink-0 items-center gap-1.5 border px-2.5 text-[12px] font-medium ${config.className}`}
        >
            <Icon size={13} strokeWidth={1.8} />
            {config.label}
        </span>
    );
}

/*
 * Shared heading for all three left-column sections.
 * Identical height, background, border, padding and typography.
 */

function SectionHeader({ title, icon: Icon }) {
    return (
        <div className="flex min-h-[68px] items-center justify-between gap-4 border-b border-[#2B3541] bg-[#151C25] px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                {/* Accent line */}
                <span
                    aria-hidden="true"
                    className="h-7 w-[3px] shrink-0 bg-[#82AEA2]"
                />

                {/* Heading */}
                <h2 className="!m-0 min-w-0 text-[15px] font-semibold leading-6 tracking-[-0.02em] !text-[#DEE5ED] sm:text-[16px]">
                    {title}
                </h2>
            </div>

            {/* Section icon */}
            {Icon && (
                <Icon
                    size={17}
                    strokeWidth={1.65}
                    aria-hidden="true"
                    className="shrink-0 text-[#8292A4]"
                />
            )}
        </div>
    );
}

function RecordRow({ label, value, last = false }) {
    return (
        <div
            className={`grid min-w-0 gap-1 py-3.5 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-start sm:gap-5 ${
                last ? '' : 'border-b border-[#252E39]'
            }`}
        >
            <span className="text-[13px] leading-6 text-[#8997A8]">
                {label}
            </span>

            <div className="min-w-0 break-words text-[14px] font-medium leading-6 !text-[#D5DEE8]">
                {value ?? '—'}
            </div>
        </div>
    );
}

function VerticalTimeline({ campaign }) {
    const events = [
        {
            label: 'Proposal submitted',
            date: campaign.proposal_date,
            icon: FileText,
        },
        {
            label: 'Campaign started',
            date: campaign.start_date,
            icon: CalendarDays,
        },
        {
            label: 'Campaign ends',
            date: campaign.end_date,
            icon: Clock3,
        },
    ];

    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className="absolute bottom-5 left-[16px] top-5 w-px bg-[#34404D]"
            />

            <div className="space-y-5">
                {events.map((event, index) => {
                    const Icon = event.icon;

                    return (
                        <div
                            key={event.label}
                            className="relative flex min-w-0 items-start gap-3.5"
                        >
                            <span
                                className={`relative z-10 flex h-[33px] w-[33px] shrink-0 items-center justify-center border ${
                                    index === 0
                                        ? 'border-[#46685D] bg-[#20362F] text-[#A3C8B4]'
                                        : 'border-[#34404D] bg-[#19222D] text-[#91A0B0]'
                                }`}
                            >
                                <Icon size={15} strokeWidth={1.7} />
                            </span>

                            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-5 gap-y-1 pt-1.5">
                                <span className="text-[13px] leading-5 text-[#B3BFCC]">
                                    {event.label}
                                </span>

                                <span className="text-[13px] font-medium tabular-nums leading-5 !text-[#D8E0E9]">
                                    {formatDate(event.date)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FinanceRow({ icon: Icon, label, value, accent = false }) {
    return (
        <div className="flex min-w-0 items-center justify-between gap-3 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={15}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#8493A5]"
                />

                <span className="text-[13px] text-[#A1AEBC]">{label}</span>
            </div>

            <span
                className={`shrink-0 text-right text-[13px] font-semibold tabular-nums ${
                    accent ? '!text-[#A3C8B4]' : '!text-[#DCE4ED]'
                }`}
            >
                {value}
            </span>
        </div>
    );
}

/*
 * Existing funding design retained.
 * Only responsive width and text-overflow safeguards added.
 */
function FundingOverview({ campaign, progress, remaining }) {
    return (
        <aside className="min-w-0 self-start overflow-hidden border border-[#303A47] bg-[#10161F]">
            {/* COMMON SECTION HEADER */}
            <SectionHeader title="Funding overview" icon={Wallet} />

            <div className="px-5 pb-6 pt-7 sm:px-6">
                <p className="text-[12px] font-medium text-[#94A2B2]">
                    Total funds raised
                </p>

                <p className="!mb-0 !mt-2 break-words text-[30px] font-semibold leading-tight tracking-[-0.045em] tabular-nums !text-[#E4EAF1] sm:text-[34px]">
                    {formatMoney(campaign.collected_amount)}
                </p>

                <p className="mt-2 text-[13px] text-[#94A2B2]">
                    of {formatMoney(campaign.target_amount)} target
                </p>

                <div className="mt-7">
                    <div className="mb-3 flex items-end justify-between gap-4">
                        <span className="text-[13px] text-[#A8B5C2]">
                            Goal completion
                        </span>

                        <span className="text-[21px] font-semibold leading-none tabular-nums tracking-[-0.035em] !text-[#A3C8B4]">
                            {progress.toFixed(1)}%
                        </span>
                    </div>

                    <div
                        className="h-[7px] overflow-hidden bg-[#2A3542]"
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

                    <div className="mt-2.5 flex justify-between text-[11px] tabular-nums text-[#798899]">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="mt-8 border-t border-[#303A47] pt-6">
                    <div className="mb-3 flex items-center gap-2">
                        <HandCoins size={15} className="text-[#91A3B4]" />

                        <h3 className="!m-0 text-[14px] font-semibold !text-[#D5DEE8]">
                            Financial breakdown
                        </h3>
                    </div>

                    <div className="divide-y divide-[#252E39]">
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
                        />
                    </div>
                </div>
            </div>

            {/* <div className="flex items-center justify-between gap-3 border-t border-[#303A47] bg-[#151C25] px-5 py-4 sm:px-6">
                <span className="text-[12px] text-[#93A1B0]">
                    Campaign reference
                </span>

                <span className="font-mono text-[12px] font-medium !text-[#D4DDE6]">
                    #{campaign.id}
                </span>
            </div> */}
        </aside>
    );
}

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
                if (!cancelled) setLoading(false);
            }
        };

        loadCampaign();

        return () => {
            cancelled = true;
        };
    }, [id]);

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
                            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 border border-[#343E4B] bg-[#202833] px-3.5 text-[13px] font-medium !text-[#CED6DF] transition-colors hover:border-[#526071] hover:bg-[#2A3543]"
                        >
                            <ArrowLeft size={15} className="shrink-0" />
                            Back to Volunteer
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate(CAMPAIGNS_ROUTE)}
                        className="inline-flex h-10 min-w-0 items-center justify-center gap-2 border border-[#343E4B] bg-[#151C25] px-3.5 text-[13px] font-medium !text-[#CED6DF] transition-colors hover:border-[#526071] hover:bg-[#202833]"
                    >
                        <FolderOpen size={15} className="shrink-0" />
                        All Campaigns
                        <ArrowUpRight
                            size={14}
                            className="shrink-0 text-[#8392A4]"
                        />
                    </button>
                </div>
            }
        />
    );

    if (loading) {
        return (
            <div className="min-w-0 space-y-7">
                {header}
                <LoadingUI
                    variant="page"
                    title="Loading campaign..."
                    description="Retrieving the campaign record."
                />
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="min-w-0 space-y-7">
                {header}
                <LoadingError
                    title="Unable to load campaign"
                    message={error || 'Campaign not found.'}
                />
            </div>
        );
    }

    return (
        <div className="min-w-0 max-w-full space-y-5 overflow-x-hidden pb-8">
            {header}

            {/* =====================================================
    CAMPAIGN IDENTITY
====================================================== */}
            <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#111821]">
                <div className="px-4 py-5 sm:px-7 sm:py-7">
                    {/* Campaign reference and status */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9BA9B9]">
                            Campaign #{campaign.id}
                        </span>

                        <CampaignStatus status={campaign.status} />
                    </div>

                    {/* Campaign title */}
                    <h1 className="!mb-0 !mt-5 max-w-4xl break-words text-[22px] font-semibold leading-[1.35] tracking-[-0.035em] !text-[#E7ECF2] sm:text-[27px] xl:text-[30px]">
                        {campaign.title || 'Untitled campaign'}
                    </h1>

                    {/* Campaign dates */}
                    {(campaign.start_date ||
                        campaign.end_date ||
                        campaign.proposal_date) && (
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#29323E] pt-5">
                            {/* Campaign duration */}
                            {(campaign.start_date || campaign.end_date) && (
                                <div className="flex min-w-0 items-center gap-2">
                                    <CalendarDays
                                        size={16}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-[#8FA2B2]"
                                    />

                                    <span className="break-words text-[13px] font-medium tabular-nums text-[#B9C5D1]">
                                        {formatDate(campaign.start_date)}
                                        {' – '}
                                        {formatDate(campaign.end_date)}
                                    </span>
                                </div>
                            )}

                            {/* Submitted date */}
                            {campaign.proposal_date && (
                                <div className="flex min-w-0 items-center gap-2">
                                    <FileText
                                        size={15}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-[#8FA2B2]"
                                    />

                                    <span className="text-[13px] text-[#9BA9B9]">
                                        Submitted{' '}
                                        <span className="font-medium tabular-nums text-[#B9C5D1]">
                                            {formatDate(campaign.proposal_date)}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex min-w-0 flex-col gap-5">
                    {/* ABOUT */}
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#111821]">
                        <SectionHeader
                            title="About this campaign"
                            icon={FileText}
                        />

                        <div className="px-4 py-5 sm:px-6 sm:py-6">
                            <p className="max-w-3xl whitespace-pre-wrap break-words text-[14px] leading-[1.9] text-[#B6C1CE] sm:text-[15px]">
                                {campaign.description ||
                                    'No campaign description has been provided.'}
                            </p>
                        </div>
                    </section>

                    {/* INFORMATION */}
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#10161F]">
                        <SectionHeader
                            title="Campaign information"
                            icon={FileText}
                        />

                        <div className="px-4 sm:px-6">
                            <RecordRow
                                label="Campaign type"
                                value={formatType(campaign.type)}
                            />

                            <RecordRow
                                label="Category"
                                value={campaign.category || '—'}
                            />

                            <RecordRow
                                label="Location"
                                value={getLocation(campaign)}
                            />

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
                        </div>
                    </section>
                </div>

                {/* FUNDING */}
                <FundingOverview
                    campaign={campaign}
                    progress={progress}
                    remaining={remaining}
                />
            </div>
        </div>
    );
}
