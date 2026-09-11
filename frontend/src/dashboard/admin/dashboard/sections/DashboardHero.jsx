import React from 'react';

import { ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

import { formatNumber } from '../utils/dashboardHelpers';

/* =================================================
   ATTENTION ITEM
================================================== */

const AttentionItem = ({
    label,
    count,
    suffix,
    description,
    footer,
    highlight = false,
    borderRight = false,
}) => (
    <article
        className={`
            group relative overflow-hidden
            min-h-60
            bg-surface
            px-5 py-5
            sm:px-6
            lg:px-7 lg:py-6
            ${borderRight ? 'xl:border-r xl:border-border' : ''}
            ${highlight ? 'bg-accent/2.5' : ''}
            transition-colors duration-200
            hover:bg-surface-soft
        `}
    >
        {/* Decorative corner marker */}

        <div className="absolute right-5 top-5">
            <ArrowUpRight
                size={15}
                strokeWidth={1.6}
                className="
                    text-text-secondary/50
                    transition-all duration-200
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-primary
                "
            />
        </div>

        {/* Label */}

        <div className="flex items-center gap-3 pr-12">
            <span
                className={`
                    relative flex h-8 w-8 shrink-0 items-center
                    ${highlight ? 'text-accent' : 'text-primary'}
                `}
            >
                <span className="h-full w-px bg-current opacity-20" />

                <span
                    className={`
                        ml-2 h-5 w-0.75
                        ${highlight ? 'bg-accent' : 'bg-primary'}
                    `}
                />

                <span
                    className="
                        ml-1 h-2 w-px
                        bg-current
                        opacity-35
                    "
                />
            </span>

            <span
                className="
                    font-poppins
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-text-primary
                    sm:text-[10px]
                "
            >
                {label}
            </span>
        </div>

        {/* Metric */}

        <div className="mt-7 flex items-end gap-3">
            <span
                className={`
                    font-fraunces
                    text-[48px]
                    leading-[0.82]
                    tracking-[-0.055em]
                    sm:text-[52px]
                    lg:text-[56px]
                    ${highlight ? 'text-accent' : 'text-text-primary'}
                `}
            >
                {count}
            </span>

            <span
                className="
                    mb-0.5
                    max-w-33.75
                    font-jost
                    text-[10px]
                    leading-[1.35]
                    text-text-secondary
                    sm:text-[11px]
                "
            >
                {suffix}
            </span>
        </div>

        {/* Description */}

        <p
            className="
                mt-4
                max-w-72.5
                font-jost
                text-[10px]
                leading-[1.55]
                text-text-secondary
                sm:text-[11px]
                lg:text-[12px]
            "
        >
            {description}
        </p>

        {/* Bottom information rail */}

        <div
            className="
                absolute
                bottom-0
                left-0
                right-0
                flex
                items-center
                justify-between
                gap-4
                border-t
                border-border
                px-5
                py-3
                sm:px-6
                lg:px-7
            "
        >
            <div className="flex items-center gap-2">
                <span
                    className={`
                        h-0.75 w-6
                        ${highlight ? 'bg-accent' : 'bg-primary/40'}
                    `}
                />

                <span
                    className="
                        font-poppins
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-text-secondary
                    "
                >
                    {footer}
                </span>
            </div>
        </div>

        {/* Highlight wash */}

        {highlight && (
            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-32
                    w-32
                    rounded-full
                    bg-accent/4.5
                    blur-2xl
                "
            />
        )}
    </article>
);

/* =================================================
   DASHBOARD HERO
================================================== */

const DashboardHero = ({
    loading,
    urgentRequestCount,
    pendingVerificationCount = 0,
    pendingCampaignCount = 0,
    pendingVolunteerCount = 0,
}) => {
    const urgentCount = loading ? '—' : formatNumber(urgentRequestCount);

    const organizationCount = loading
        ? '—'
        : formatNumber(pendingVerificationCount);

    const volunteerCount = loading ? '—' : formatNumber(pendingVolunteerCount);

    const campaignCount = loading ? '—' : formatNumber(pendingCampaignCount);

    const hasUrgentRequests = !loading && Number(urgentRequestCount) > 0;

    const attentionCards = [
        {
            label: 'Organizations',
            count: organizationCount,
            suffix: 'awaiting verification',
            description: 'Registrations waiting for administrative review.',
            footer: 'Organization verification',
        },

        {
            label: 'Volunteers',
            count: volunteerCount,
            suffix: 'to review',
            description: 'Applications waiting for administrative review.',
            footer: 'Volunteer applications',
        },

        {
            label: 'Campaigns',
            count: campaignCount,
            suffix: 'need review',
            description:
                'Campaign proposals waiting for administrative verification.',
            footer: 'Campaign review',
        },
    ];

    return (
        <header className="space-y-6 sm:space-y-7">
            {/* =================================================
                PRIMARY HERO
            ================================================== */}

            <section className="border border-border bg-surface">
                {/* System bar */}

                <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-primary sm:h-8 sm:w-8">
                            <span className="font-fraunces text-[10px] text-white sm:text-[11px]">
                                SP
                            </span>
                        </div>

                        <span
                            className="
                                truncate
                                font-poppins
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.17em]
                                text-text-primary
                                sm:text-[9px]
                                lg:text-[10px]
                            "
                        >
                            Stand For People
                        </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-primary" />

                        <span
                            className="
                                font-poppins
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-primary
                                sm:text-[8px]
                                lg:text-[9px]
                            "
                        >
                            System operational
                        </span>
                    </div>
                </div>

                {/* Hero body */}

                <div className="grid lg:grid-cols-[minmax(0,1fr)_285px]">
                    {/* Main */}

                    <div
                        className="
                            border-b
                            border-border
                            px-5
                            py-8
                            sm:px-8
                            sm:py-9
                            lg:border-b-0
                            lg:border-r
                            lg:px-9
                            lg:py-11
                        "
                    >
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

                            <span
                                className="
                                    font-poppins
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-primary
                                    sm:text-[8px]
                                    lg:text-[9px]
                                "
                            >
                                Admin dashboard
                            </span>

                            <span className="h-px w-7 bg-border" />

                            <span
                                className="
                                    font-jost
                                    text-[9px]
                                    text-text-secondary
                                    sm:text-[10px]
                                    lg:text-[11px]
                                "
                            >
                                Operational overview
                            </span>
                        </div>

                        <h1
                            className="
                                mt-6
                                max-w-150
                                font-fraunces
                                text-[36px]
                                leading-[0.98]
                                tracking-tighter
                                text-text-primary
                                sm:text-[43px]
                                lg:text-[47px]
                                xl:text-[50px]
                            "
                        >
                            Here's what needs
                            <span className="block text-primary">
                                your attention.
                            </span>
                        </h1>

                        <div className="mt-6 flex max-w-137.5 gap-3">
                            <span className="h-9 w-0.5 shrink-0 bg-accent" />

                            <p
                                className="
                                    font-jost
                                    text-[11px]
                                    leading-[1.65]
                                    text-text-secondary
                                    sm:text-[12px]
                                    lg:text-[13px]
                                "
                            >
                                Review pending decisions, active responses, and
                                the latest activity across Stand For People.
                            </p>
                        </div>

                        <div className="mt-7 flex items-center gap-3">
                            <span className="h-px w-8 bg-border" />

                            <span
                                className="
                                    font-poppins
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.15em]
                                    text-text-secondary
                                    sm:text-[8px]
                                    lg:text-[9px]
                                "
                            >
                                Coordination starts here
                            </span>
                        </div>
                    </div>

                    {/* Priority */}

                    <aside
                        className={`
                            flex flex-col justify-between
                            px-5 py-6
                            sm:px-6
                            lg:px-7
                            ${
                                hasUrgentRequests
                                    ? 'bg-accent/3.5'
                                    : 'bg-background'
                            }
                        `}
                    >
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span
                                        className={`
                                            flex h-6 w-6 shrink-0
                                            items-center justify-center
                                            sm:h-7 sm:w-7
                                            ${
                                                hasUrgentRequests
                                                    ? 'bg-accent/8'
                                                    : 'bg-primary/6'
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                h-1.5 w-1.5
                                                ${
                                                    hasUrgentRequests
                                                        ? 'bg-accent'
                                                        : 'bg-primary'
                                                }
                                            `}
                                        />
                                    </span>

                                    <span
                                        className="
                                            truncate
                                            font-poppins
                                            text-[7px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.15em]
                                            text-text-secondary
                                            sm:text-[8px]
                                            lg:text-[9px]
                                        "
                                    >
                                        Admin focus
                                    </span>
                                </div>

                                <ShieldCheck
                                    size={15}
                                    strokeWidth={1.6}
                                    className={
                                        hasUrgentRequests
                                            ? 'shrink-0 text-accent'
                                            : 'shrink-0 text-primary'
                                    }
                                />
                            </div>

                            <div className="mt-8">
                                <p
                                    className="
                                        font-poppins
                                        text-[7px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-text-secondary
                                        sm:text-[8px]
                                        lg:text-[9px]
                                    "
                                >
                                    Priority help requests
                                </p>

                                <div className="mt-3 flex items-end gap-3">
                                    <span
                                        className={`
                                            font-fraunces
                                            text-[52px]
                                            leading-[0.82]
                                            tracking-[-0.06em]
                                            sm:text-[56px]
                                            lg:text-[60px]
                                            ${
                                                hasUrgentRequests
                                                    ? 'text-accent'
                                                    : 'text-text-primary'
                                            }
                                        `}
                                    >
                                        {urgentCount}
                                    </span>

                                    <span
                                        className="
                                            mb-0.5
                                            max-w-25
                                            font-jost
                                            text-[9px]
                                            leading-[1.4]
                                            text-text-secondary
                                            sm:text-[10px]
                                            lg:max-w-28.75
                                            lg:text-[11px]
                                        "
                                    >
                                        requiring administrative attention
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 border-t border-border pt-4">
                            <div className="flex items-center justify-between gap-4">
                                <span
                                    className="
                                        font-poppins
                                        text-[7px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.13em]
                                        text-text-secondary
                                        sm:text-[8px]
                                        lg:text-[9px]
                                    "
                                >
                                    Queue status
                                </span>

                                <span
                                    className={`
                                        flex items-center gap-1.5
                                        font-poppins
                                        text-[7px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.11em]
                                        sm:text-[8px]
                                        ${
                                            hasUrgentRequests
                                                ? 'text-accent'
                                                : 'text-primary'
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            h-1.5 w-1.5
                                            ${
                                                hasUrgentRequests
                                                    ? 'bg-accent'
                                                    : 'bg-primary'
                                            }
                                        `}
                                    />

                                    {hasUrgentRequests
                                        ? 'Action required'
                                        : 'Clear'}
                                </span>
                            </div>

                            <p
                                className="
                                    mt-2
                                    font-jost
                                    text-[9px]
                                    leading-normal
                                    text-text-secondary
                                    sm:text-[10px]
                                    lg:text-[11px]
                                "
                            >
                                {hasUrgentRequests
                                    ? 'Priority requests are waiting for administrative action.'
                                    : 'No priority requests currently require immediate action.'}
                            </p>
                        </div>
                    </aside>
                </div>
            </section>

            {/* =================================================
    ADMINISTRATIVE QUEUE
================================================== */}
<section className="border border-border bg-primary">
    {/* Queue heading */}
    <div className="border-b border-white/20 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/10 sm:h-8 sm:w-8">
                    <CheckCircle2
                        size={14}
                        strokeWidth={1.7}
                        className="text-white sm:size-3.75"
                    />
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                        <h2
                            className="
                                truncate
                                font-fraunces
                                text-[20px]
                                leading-none
                                tracking-[-0.035em]
                                text-white
                                sm:text-[21px]
                                lg:text-[23px]
                            "
                        >
                            Operational Snapshot
                        </h2>

                        <span className="hidden h-1 w-1 shrink-0 bg-white/70 sm:block" />

                        <span
                            className="
                                hidden
                                shrink-0
                                font-poppins
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.13em]
                                text-white/50
                                sm:block
                                lg:text-[8px]
                            "
                        >
                            03 areas
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <span className="h-1.5 w-1.5 bg-amber-300" />

                <span
                    className="
                        hidden
                        font-poppins
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.13em]
                        text-white/75
                        sm:block
                        lg:text-[8px]
                    "
                >
                    Live queue
                </span>
            </div>
        </div>
    </div>

    {/* Queue grid */}
    <div className="grid bg-primary md:grid-cols-2 xl:grid-cols-3">
        {attentionCards.map((card, index) => (
            <AttentionItem
                key={card.label}
                {...card}
                borderRight={index < attentionCards.length - 1}
            />
        ))}
    </div>
</section>
        </header>
    );
};

export default DashboardHero;
