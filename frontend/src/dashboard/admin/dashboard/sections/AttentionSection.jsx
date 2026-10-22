import React from 'react';
import {
    AlertTriangle,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    ClipboardList,
    Megaphone,
    ShieldCheck,
} from 'lucide-react';

import SectionAction from '../components/SectionAction';
import { formatNumber } from '../utils/dashboardHelpers';

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
    requests: '#E8A56E',
    organizations: '#58AFA2',
    campaigns: '#88A9D7',
};

/* =========================================================
   HELPERS
========================================================= */

const safeCount = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const getRequestTitle = (request) =>
    request?.title ||
    request?.subject ||
    request?.request_title ||
    'Untitled help request';

const getRequestLocation = (request) => {
    const location = request?.district || request?.location || request?.address;

    return typeof location === 'string'
        ? location
        : location?.name || 'Location not specified';
};

const getOrganizationName = (organization) =>
    organization?.organization_name ||
    organization?.name ||
    organization?.organizationName ||
    'Unnamed organization';

const getCampaignTitle = (campaign) =>
    campaign?.title ||
    campaign?.name ||
    campaign?.campaign_title ||
    'Untitled campaign';

const getCampaignOrganization = (campaign) => {
    const organization =
        campaign?.organization?.name ||
        campaign?.organization_name ||
        campaign?.organizationName ||
        campaign?.organization;

    return typeof organization === 'string'
        ? organization
        : 'Campaign proposal';
};

/* =========================================================
   SECTION HEADING
========================================================= */

const AttentionHeading = () => (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
            <h2 className="text-[22px] font-semibold! leading-tight tracking-[-0.025em] font-sans text-[#EEF1F5]! sm:text-[25px]">
                Needs Attention
            </h2>

            <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#9AA6B6]">
                Review pending help requests, organization registrations, and
                campaign proposals.
            </p>
        </div>
    </div>
);

/* =========================================================
   BALANCED ACTION CARD
========================================================= */

const ActionCard = ({
    icon: Icon,
    title,
    subtitle,
    count,
    color,
    actionLabel,
    onAction,
    children,
    empty = false,
}) => (
    <article
        className="
            group relative flex min-w-0 flex-col overflow-hidden
            rounded-[7px] border border-[#34404D]
            bg-[#1B242E]
            transition-colors duration-200
            hover:border-[#485667]
        "
    >
        {/* ACCENT */}
        <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{
                backgroundColor: color,
                opacity: empty ? 0.45 : 0.8,
            }}
        />

        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 px-4 pb-3.5 pt-4 sm:px-5">
            <div className="flex min-w-0 items-start gap-3">
                <div
                    className="
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-[5px] bg-[#283440]
                    "
                    style={{ color }}
                >
                    <Icon size={17} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold! leading-5 text-[#EEF1F5]!">
                        {title}
                    </h3>

                    <p className="mt-1 text-[12px] leading-5 text-[#9BA8B8]">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="shrink-0 text-right">
                <span className="block text-[26px] font-semibold! leading-none tracking-[-0.035em] tabular-nums text-[#EEF1F5]">
                    {count}
                </span>

                <span className="mt-1.5 block text-[10px] font-medium! text-[#8792A1]">
                    {empty ? 'Clear' : 'Pending'}
                </span>
            </div>
        </div>

        {/* RECORD AREA */}
        <div className="mx-3 flex min-w-0 flex-1 flex-col rounded-[4px] bg-[#161E27] px-3 pb-2 pt-3 sm:mx-4">
            {children}
        </div>

        {/* FOOTER */}
        <div className="px-4 pb-3 pt-3 sm:px-5">
            <button
                type="button"
                onClick={onAction}
                disabled={!onAction}
                className="
                    flex min-h-8 w-full items-center justify-between gap-3
                    text-left text-[12px] font-semibold!
                    transition-opacity hover:opacity-75
                    disabled:cursor-default disabled:opacity-45
                "
            >
                <span style={{ color }}>{actionLabel}</span>

                <ArrowUpRight
                    size={15}
                    strokeWidth={1.8}
                    className="text-[#8291A3] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </button>
        </div>
    </article>
);

/* =========================================================
   RECORD ROW
========================================================= */

const RecordRow = ({ icon: Icon, title, subtitle, status, color, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className="
            group/row flex w-full min-w-0 items-center gap-3
            border-b border-[#2A3541] py-2.5 text-left
            transition-colors last:border-b-0
            hover:bg-[#202B37]
            disabled:cursor-default
        "
    >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#26323F] text-[#A6B3C2]">
            <Icon size={15} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold! leading-5 text-[#EDF1F5]!">
                {title}
            </p>

            <p className="mt-0.5 truncate text-[11px] leading-4 text-[#95A3B4]">
                {subtitle}
            </p>
        </div>

        {status && (
            <span
                className="hidden shrink-0 text-[10px] font-semibold! uppercase tracking-[0.05em] sm:inline"
                style={{ color }}
            >
                {status}
            </span>
        )}

        <ArrowUpRight
            size={14}
            strokeWidth={1.8}
            className="shrink-0 text-[#74869A] transition-colors group-hover/row:text-[#DCE4EC]"
        />
    </button>
);

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyQueue = ({ message }) => (
    <div className="flex min-h-[70px] items-center gap-3 py-3">
        <CheckCircle2
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-[#58AFA2]"
        />

        <p className="text-[12px] leading-5 text-[#A5B1BF]">{message}</p>
    </div>
);

/* =========================================================
   LOADING
========================================================= */

const LoadingRows = () => (
    <div className="space-y-3 py-3" aria-label="Loading records">
        {[1, 2].map((item) => (
            <div key={item} className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 animate-pulse bg-[#293745]" />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-2.5 w-3/5 animate-pulse rounded bg-[#293745]" />
                    <div className="h-2 w-2/5 animate-pulse rounded bg-[#293745]" />
                </div>
            </div>
        ))}
    </div>
);

/* =========================================================
   MAIN SECTION
========================================================= */

const AttentionSection = ({
    loading = false,

    pendingHelpRequests = [],
    pendingVerifications = [],
    latestCampaigns = [],

    pendingRequestCount = 0,
    pendingVerificationCount = 0,
    pendingCampaignCount = 0,
    urgentRequestCount = 0,

    onOpenRequests,
    onOpenVerification,
    onOpenCampaigns,
    onOpenCampaign,
}) => {
    const requestCount = safeCount(pendingRequestCount);
    const verificationCount = safeCount(pendingVerificationCount);
    const campaignCount = safeCount(pendingCampaignCount);
    const urgentCount = safeCount(urgentRequestCount);

    const pendingCampaigns = Array.isArray(latestCampaigns)
        ? latestCampaigns.filter((campaign) =>
              [
                  'pending',
                  'pending_review',
                  'under_review',
                  'submitted',
                  'unverified',
              ].includes(String(campaign?.status || '').toLowerCase()),
          )
        : [];

    return (
        <section className="mt-10 min-w-0 sm:mt-12">
            <AttentionHeading onOpenRequests={onOpenRequests} />

            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* HELP REQUESTS */}
                <ActionCard
                    icon={ClipboardList}
                    title="Help requests"
                    subtitle="Requests awaiting review"
                    count={loading ? '—' : formatNumber(requestCount)}
                    color={COLORS.requests}
                    actionLabel="Review all requests"
                    onAction={onOpenRequests}
                    empty={!loading && requestCount === 0}
                >
                    <div className="flex items-center justify-between gap-3 pb-1">
                        <span className="text-[10px] font-semibold! uppercase tracking-[0.11em] text-[#98A7B8]">
                            Latest requests
                        </span>

                        {!loading && urgentCount > 0 && (
                            <span className="flex items-center gap-1 text-[11px] font-medium! text-[#E8A56E]">
                                <AlertTriangle size={12} />
                                {formatNumber(urgentCount)} priority
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <LoadingRows />
                    ) : pendingHelpRequests.length > 0 ? (
                        pendingHelpRequests
                            .slice(0, 2)
                            .map((request, index) => (
                                <RecordRow
                                    key={request?.id || index}
                                    icon={ClipboardList}
                                    title={getRequestTitle(request)}
                                    subtitle={getRequestLocation(request)}
                                    status={
                                        String(
                                            request?.urgency ||
                                                request?.priority ||
                                                '',
                                        ).toLowerCase() === 'high'
                                            ? 'High'
                                            : null
                                    }
                                    color={COLORS.requests}
                                    onClick={onOpenRequests}
                                />
                            ))
                    ) : (
                        <EmptyQueue message="No help requests awaiting review." />
                    )}
                </ActionCard>

                {/* ORGANIZATIONS */}
                <ActionCard
                    icon={ShieldCheck}
                    title="Organization verification"
                    subtitle="Registrations awaiting approval"
                    count={loading ? '—' : formatNumber(verificationCount)}
                    color={COLORS.organizations}
                    actionLabel="Review organizations"
                    onAction={onOpenVerification}
                    empty={!loading && verificationCount === 0}
                >
                    <div className="pb-1">
                        <span className="text-[10px] font-semibold! uppercase tracking-[0.11em] text-[#98A7B8]">
                            Latest submissions
                        </span>
                    </div>

                    {loading ? (
                        <LoadingRows />
                    ) : pendingVerifications.length > 0 ? (
                        pendingVerifications
                            .slice(0, 2)
                            .map((organization, index) => (
                                <RecordRow
                                    key={organization?.id || index}
                                    icon={Building2}
                                    title={getOrganizationName(organization)}
                                    subtitle="Organization verification"
                                    status="Pending"
                                    color={COLORS.organizations}
                                    onClick={onOpenVerification}
                                />
                            ))
                    ) : (
                        <EmptyQueue message="No organizations awaiting verification." />
                    )}
                </ActionCard>

                {/* CAMPAIGNS */}
                <ActionCard
                    icon={Megaphone}
                    title="Campaign reviews"
                    subtitle="Proposals awaiting verification"
                    count={loading ? '—' : formatNumber(campaignCount)}
                    color={COLORS.campaigns}
                    actionLabel="Manage campaigns"
                    onAction={onOpenCampaigns}
                    empty={!loading && campaignCount === 0}
                >
                    <div className="pb-1">
                        <span className="text-[10px] font-semibold! uppercase tracking-[0.11em] text-[#98A7B8]">
                            Pending proposals
                        </span>
                    </div>

                    {loading ? (
                        <LoadingRows />
                    ) : pendingCampaigns.length > 0 ? (
                        pendingCampaigns
                            .slice(0, 2)
                            .map((campaign, index) => (
                                <RecordRow
                                    key={campaign?.id || index}
                                    icon={Megaphone}
                                    title={getCampaignTitle(campaign)}
                                    subtitle={getCampaignOrganization(campaign)}
                                    status="Pending"
                                    color={COLORS.campaigns}
                                    onClick={() =>
                                        onOpenCampaign
                                            ? onOpenCampaign(campaign)
                                            : onOpenCampaigns?.()
                                    }
                                />
                            ))
                    ) : (
                        <EmptyQueue
                            message={
                                campaignCount > 0
                                    ? 'Open campaign reviews to see pending proposals.'
                                    : 'No campaigns awaiting review.'
                            }
                        />
                    )}
                </ActionCard>
            </div>
        </section>
    );
};

export default AttentionSection;
