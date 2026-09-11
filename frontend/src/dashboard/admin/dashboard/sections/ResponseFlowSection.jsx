import React from 'react';

import { ArrowRight, MapPin, Users } from 'lucide-react';

import SectionAction from '../components/SectionAction';
import SectionHeading from '../components/SectionHeading';

import { formatNumber } from '../utils/dashboardHelpers';

// ========================================================
// CAMPAIGN ROW
// ========================================================

const CampaignRow = ({ campaign, onClick }) => {
    const title = campaign?.title || campaign?.name || 'Untitled campaign';

    const status = campaign?.status?.replace('_', ' ') || 'Needs review';

    const location =
        campaign?.district ||
        campaign?.location ||
        campaign?.address ||
        'Location not specified';

    const organization =
        campaign?.organization?.name ||
        campaign?.organization?.user?.name ||
        'Organization campaign';

    return (
        <button
            type="button"
            onClick={() => onClick?.(campaign)}
            className="
                group
                grid
                w-full
                min-w-0
                grid-cols-1
                gap-3
                border-b
                border-border
                py-5
                text-left
                transition-colors
                last:border-b-0
                hover:bg-background-alt/50
                sm:grid-cols-[minmax(0,1.55fr)_minmax(130px,1fr)_minmax(100px,0.8fr)_auto]
                sm:items-center
                sm:gap-5
            "
        >
            {/* Campaign */}
            <div className="min-w-0">
                <p
                    className="
                        truncate
                        font-jost
                        text-[13px]
                        font-medium
                        leading-5
                        text-text-primary
                        transition-colors
                        group-hover:text-primary
                        sm:text-[14px]
                    "
                >
                    {title}
                </p>

                <p
                    className="
                        mt-1.5
                        truncate
                        font-poppins
                        text-[9px]
                        font-medium
                        capitalize
                        leading-4
                        text-text-secondary
                    "
                >
                    {status}
                </p>
            </div>

            {/* Organization */}
            <div className="min-w-0">
                <p
                    className="
                        mb-1
                        font-poppins
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-text-secondary/55
                        sm:hidden
                    "
                >
                    Organization
                </p>

                <p
                    className="
                        truncate
                        font-jost
                        text-[11px]
                        leading-5
                        text-text-secondary
                        sm:text-[12px]
                    "
                >
                    {organization}
                </p>
            </div>

            {/* Location */}
            <div className="flex min-w-0 items-center gap-2">
                <MapPin
                    size={12}
                    strokeWidth={1.6}
                    className="shrink-0 text-text-secondary/70"
                />

                <div className="min-w-0">
                    <p
                        className="
                            mb-1
                            font-poppins
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-text-secondary/55
                            sm:hidden
                        "
                    >
                        Location
                    </p>

                    <span
                        className="
                            block
                            truncate
                            font-jost
                            text-[11px]
                            leading-5
                            text-text-secondary
                            sm:text-[12px]
                        "
                    >
                        {location}
                    </span>
                </div>
            </div>

            {/* Action */}
            <span
                className="
                    hidden
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-border
                    text-text-secondary
                    transition-all
                    duration-200
                    group-hover:border-primary/25
                    group-hover:bg-primary
                    group-hover:text-white
                    sm:flex
                "
            >
                <ArrowRight
                    size={13}
                    strokeWidth={1.6}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
            </span>
        </button>
    );
};

// ========================================================
// RESPONSE FLOW / CAMPAIGN ACTION DESK
// ========================================================

const ResponseFlowSection = ({
    loading,
    latestCampaigns = [],
    pendingCampaignCount = 0,
    totalCampaigns = 0,
    activeCampaigns = 0,
    onOpenCampaigns,
    onOpenCampaign,
}) => {
    const featuredCampaign = latestCampaigns[0];

    const campaignList = latestCampaigns;

    const featuredTitle =
        featuredCampaign?.title ||
        featuredCampaign?.name ||
        'Campaign desk is clear';

    const featuredDescription =
        featuredCampaign?.description ||
        'Campaigns requiring administrative attention will appear here.';

    const featuredLocation =
        featuredCampaign?.district ||
        featuredCampaign?.location ||
        featuredCampaign?.address ||
        'Location not specified';

    const featuredOrganization =
        featuredCampaign?.organization?.name ||
        featuredCampaign?.organization?.user?.name ||
        'Organization campaign';

    const featuredType =
        featuredCampaign?.type?.replace('_', ' ') || 'Campaign';

    const featuredStatus =
        featuredCampaign?.status?.replace('_', ' ') || 'Needs attention';

    return (
        <section className="mt-14 min-w-0 bg-white pt-6 px-6">
            <SectionHeading
                number="02"
                eyebrow="Campaign operations"
                title="Campaigns Requiring Action"
                description="Review the latest campaign proposals and keep the humanitarian response network moving."
                action={
                    <SectionAction onClick={onOpenCampaigns}>
                        Manage campaigns
                    </SectionAction>
                }
            />

            <div className="mt-7 min-w-0 overflow-hidden">
                {/* =================================================
                    MAIN CAMPAIGN WORKSPACE
                ================================================== */}
                <div
                    className="
                        grid
                        min-w-0
                        overflow-hidden
                        border-y
                        border-border
                        lg:grid-cols-[minmax(340px,0.92fr)_minmax(0,1.8fr)]
                    "
                >
                    {/* =================================================
                        FEATURED CAMPAIGN
                    ================================================== */}
                    <div className="min-w-0 overflow-hidden bg-primary text-white">
                        {loading ? (
                            <div className="px-7 py-8 sm:px-8">
                                <div className="space-y-6">
                                    <div className="h-2.5 w-28 animate-pulse bg-white/20" />

                                    <div className="h-9 w-4/5 animate-pulse bg-white/20" />

                                    <div className="space-y-2.5">
                                        <div className="h-2.5 w-full animate-pulse bg-white/20" />
                                        <div className="h-2.5 w-5/6 animate-pulse bg-white/20" />
                                        <div className="h-2.5 w-3/5 animate-pulse bg-white/20" />
                                    </div>
                                </div>
                            </div>
                        ) : featuredCampaign ? (
                            <div
                                className="
                                    flex
                                    min-h-105
                                    min-w-0
                                    flex-col
                                    px-7
                                    py-8
                                    sm:px-8
                                    sm:py-9
                                "
                            >
                                {/* Top line */}
                                <div className="flex min-w-0 items-center justify-between gap-5">
                                    <p
                                        className="
                                            truncate
                                            font-poppins
                                            text-[8px]
                                            font-semibold
                                            uppercase
                                            tracking-widest
                                            text-white/60
                                        "
                                    >
                                        Latest submission
                                    </p>

                                    <span
                                        className="
                                            shrink-0
                                            font-poppins
                                            text-[9px]
                                            font-medium
                                            capitalize
                                            text-white/70
                                        "
                                    >
                                        {featuredStatus}
                                    </span>
                                </div>

                                {/* Main content */}
                                <div className="mt-9 min-w-0">
                                    <h3
                                        className="
                                            wrap-break-word
                                            font-fraunces
                                            text-[28px]
                                            leading-[1.14]
                                            tracking-tight
                                            text-white
                                            sm:text-[31px]
                                        "
                                    >
                                        {featuredTitle}
                                    </h3>

                                    <p
                                        className="
                                            mt-5
                                            wrap-break-word
                                            font-jost
                                            text-[12px]
                                            leading-7
                                            text-white/72
                                        "
                                    >
                                        {featuredDescription}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="mt-9 min-w-0 border-t border-white/15 pt-6">
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    font-poppins
                                                    text-[8px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-widest
                                                    text-white/45
                                                "
                                            >
                                                Organization
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    truncate
                                                    font-jost
                                                    text-[12px]
                                                    leading-5
                                                    text-white/90
                                                "
                                            >
                                                {featuredOrganization}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    font-poppins
                                                    text-[8px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-widest
                                                    text-white/45
                                                "
                                            >
                                                Location
                                            </p>

                                            <div className="mt-2 flex min-w-0 items-center gap-2">
                                                <MapPin
                                                    size={12}
                                                    strokeWidth={1.5}
                                                    className="shrink-0 text-white/60"
                                                />

                                                <p
                                                    className="
                                                        truncate
                                                        font-jost
                                                        text-[12px]
                                                        leading-5
                                                        text-white/90
                                                    "
                                                >
                                                    {featuredLocation}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    font-poppins
                                                    text-[8px]
                                                    font-semibold
                                                    uppercase
                                                    tracking-widest
                                                    text-white/45
                                                "
                                            >
                                                Campaign type
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    truncate
                                                    font-jost
                                                    text-[12px]
                                                    capitalize
                                                    leading-5
                                                    text-white/90
                                                "
                                            >
                                                {featuredType}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Review action */}
                                <div className="mt-auto pt-9">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onOpenCampaign?.(featuredCampaign)
                                        }
                                        className="
                                            group
                                            inline-flex
                                            items-center
                                            gap-2.5
                                            border-b
                                            border-white/45
                                            pb-1.5
                                            font-poppins
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-widest
                                            text-white
                                            transition-colors
                                            hover:border-white
                                        "
                                    >
                                        Review campaign
                                        <ArrowRight
                                            size={12}
                                            strokeWidth={1.6}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="
                                    flex
                                    min-h-105
                                    flex-col
                                    justify-center
                                    px-7
                                    py-9
                                    sm:px-8
                                "
                            >
                                <p
                                    className="
                                        font-poppins
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-white/55
                                    "
                                >
                                    Review status
                                </p>

                                <h3
                                    className="
                                        mt-5
                                        wrap-break-word
                                        font-fraunces
                                        text-[28px]
                                        leading-[1.15]
                                        tracking-tight
                                        text-white
                                    "
                                >
                                    Campaign desk is clear
                                </h3>

                                <p
                                    className="
                                        mt-4
                                        max-w-90
                                        font-jost
                                        text-[12px]
                                        leading-7
                                        text-white/68
                                    "
                                >
                                    There are currently no unverified campaigns
                                    waiting for administrative review.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        REVIEW QUEUE
                    ================================================== */}
                    <div className="min-w-0 overflow-hidden">
                        {/* Queue header */}
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                justify-between
                                gap-6
                                border-b
                                border-border
                                px-6
                                py-5
                                sm:px-8
                                sm:py-6
                            "
                        >
                            <div className="min-w-0">
                                <p
                                    className="
                                        font-poppins
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-text-primary
                                    "
                                >
                                    Review queue
                                </p>

                                <p
                                    className="
                                        mt-1.5
                                        truncate
                                        font-jost
                                        text-[11px]
                                        leading-5
                                        text-text-secondary
                                        sm:text-[12px]
                                    "
                                >
                                    Other campaigns awaiting verification
                                </p>
                            </div>

                            <div className="flex shrink-0 items-baseline gap-2.5">
                                <span
                                    className="
                                        font-fraunces
                                        text-[26px]
                                        leading-none
                                        text-text-primary
                                        sm:text-[28px]
                                    "
                                >
                                    {loading
                                        ? '—'
                                        : formatNumber(pendingCampaignCount)}
                                </span>

                                <span
                                    className="
                                        hidden
                                        font-poppins
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-text-secondary
                                        sm:inline
                                    "
                                >
                                    pending
                                </span>
                            </div>
                        </div>

                        {/* Column labels */}
                        <div
                            className="
                                hidden
                                min-w-0
                                grid-cols-[minmax(0,1.55fr)_minmax(130px,1fr)_minmax(100px,0.8fr)_auto]
                                gap-5
                                border-b
                                border-border
                                px-6
                                py-3
                                sm:grid
                                sm:px-8
                            "
                        >
                            <span
                                className="
                                    font-poppins
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-text-secondary/55
                                "
                            >
                                Campaign
                            </span>

                            <span
                                className="
                                    font-poppins
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-text-secondary/55
                                "
                            >
                                Organization
                            </span>

                            <span
                                className="
                                    font-poppins
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-text-secondary/55
                                "
                            >
                                Location
                            </span>

                            <span />
                        </div>

                        {/* Queue list */}
                        <div className="min-w-0 px-6 sm:px-8">
                            <div
                                className="
                                    max-h-90
                                    min-w-0
                                    overflow-x-hidden
                                    overflow-y-auto
                                "
                            >
                                {loading ? (
                                    <div className="divide-y divide-border">
                                        {[1, 2, 3, 4].map((item) => (
                                            <div
                                                key={item}
                                                className="
                                                    grid
                                                    min-h-21
                                                    min-w-0
                                                    grid-cols-1
                                                    items-center
                                                    gap-3
                                                    sm:grid-cols-[minmax(0,1.55fr)_minmax(130px,1fr)_minmax(100px,0.8fr)_auto]
                                                    sm:gap-5
                                                "
                                            >
                                                <div className="space-y-2">
                                                    <div className="h-3 w-3/5 animate-pulse bg-background-alt" />
                                                    <div className="h-2.5 w-2/5 animate-pulse bg-background-alt" />
                                                </div>

                                                <div className="h-2.5 w-3/5 animate-pulse bg-background-alt" />

                                                <div className="h-2.5 w-3/5 animate-pulse bg-background-alt" />

                                                <div className="hidden h-7 w-7 animate-pulse bg-background-alt sm:block" />
                                            </div>
                                        ))}
                                    </div>
                                ) : campaignList.length > 0 ? (
                                    campaignList.map((campaign, index) => (
                                        <CampaignRow
                                            key={campaign?.id || index}
                                            campaign={campaign}
                                            onClick={onOpenCampaign}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12">
                                        <p
                                            className="
                                                font-jost
                                                text-[13px]
                                                font-medium
                                                leading-5
                                                text-text-primary
                                            "
                                        >
                                            No campaigns awaiting review.
                                        </p>

                                        <p
                                            className="
                                                mt-2
                                                max-w-105
                                                font-poppins
                                                text-[9px]
                                                leading-5
                                                text-text-secondary
                                            "
                                        >
                                            New unverified campaign proposals
                                            will appear in this queue.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    CAMPAIGN SUMMARY FOOTER
                ================================================== */}
                <div
                    className="
                        grid
                        min-w-0
                        border-b
                        border-border
                        sm:grid-cols-[auto_auto_minmax(0,1fr)]
                    "
                >
                    {/* Total */}
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                            border-b
                            border-border
                            px-1
                            py-5
                            sm:border-b-0
                            sm:border-r
                            sm:pr-8
                        "
                    >
                        <span
                            className="
                                font-fraunces
                                text-[25px]
                                leading-none
                                tracking-tight
                                text-text-primary
                            "
                        >
                            {loading ? '—' : formatNumber(totalCampaigns)}
                        </span>

                        <div className="min-w-0">
                            <p
                                className="
                                    font-poppins
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-text-primary
                                "
                            >
                                Total campaigns
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-jost
                                    text-[10px]
                                    leading-4
                                    text-text-secondary
                                "
                            >
                                Across the platform
                            </p>
                        </div>
                    </div>

                    {/* Active */}
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                            border-b
                            border-border
                            py-5
                            sm:border-b-0
                            sm:px-8
                        "
                    >
                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                border
                                border-primary/20
                                bg-primary/5
                            "
                        >
                            <Users
                                size={13}
                                strokeWidth={1.5}
                                className="text-primary"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-baseline gap-2.5">
                                <span
                                    className="
                                        font-fraunces
                                        text-[23px]
                                        leading-none
                                        text-text-primary
                                    "
                                >
                                    {loading
                                        ? '—'
                                        : formatNumber(activeCampaigns)}
                                </span>

                                <span
                                    className="
                                        font-poppins
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-primary
                                    "
                                >
                                    active
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1.5
                                    font-jost
                                    text-[10px]
                                    leading-4
                                    text-text-secondary
                                "
                            >
                                Currently running
                            </p>
                        </div>
                    </div>

                    {/* Register action */}
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            justify-start
                            py-5
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            onClick={onOpenCampaigns}
                            className="
                                group
                                inline-flex
                                max-w-full
                                items-center
                                gap-2.5
                                font-poppins
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-text-secondary
                                transition-colors
                                hover:text-primary
                            "
                        >
                            <span className="truncate">
                                Open campaign register
                            </span>

                            <ArrowRight
                                size={12}
                                strokeWidth={1.5}
                                className="
                                    shrink-0
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-1
                                "
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponseFlowSection;
