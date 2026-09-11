import React from 'react';

import {
    Banknote,
    Building2,
    HeartHandshake,
    Megaphone,
    UserCheck,
    UserRound,
    Users,
} from 'lucide-react';

import SectionHeading from '../components/SectionHeading';

import { formatCurrency, formatNumber } from '../utils/dashboardHelpers';

// ========================================================
// NETWORK ITEM
// ========================================================

const NetworkItem = ({
    icon: Icon,
    label,
    value,
    description,
    className = '',
}) => {
    return (
        <div
            className={`
                group relative flex min-h-40 flex-col
                justify-between overflow-hidden
                px-6 py-6
                text-left
                transition-colors duration-300
                hover:bg-background
                ${className}
            `}
        >
            {/* TOP */}
            <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            border border-border
                            bg-background-alt
                            text-text-secondary
                            transition-all duration-300
                            group-hover:border-primary
                            group-hover:bg-primary
                            group-hover:text-white
                        "
                    >
                        <Icon
                            size={17}
                            strokeWidth={1.7}
                            className="
                                transition-transform duration-300
                                group-hover:scale-105
                            "
                        />
                    </div>

                    <span
                        className="
                            font-poppins text-[10px]
                            font-semibold uppercase
                            tracking-[0.11em]
                            text-text-secondary
                            transition-colors duration-300
                            group-hover:text-text-primary
                        "
                    >
                        {label}
                    </span>
                </div>

                <span
                    className="
                        font-poppins text-[9px]
                        font-semibold
                        tracking-[0.12em]
                        text-border
                        transition-colors duration-300
                        group-hover:text-primary
                    "
                >
                    SP
                </span>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 mt-7">
                <p
                    className="
                        font-fraunces text-[38px]
                        leading-none
                        tracking-[-0.035em]
                        text-text-primary
                        transition-transform duration-300
                        group-hover:-translate-y-0.5
                    "
                >
                    {value}
                </p>

                <p
                    className="
                        mt-2 font-jost text-[14px]
                        font-semibold
                        text-text-primary
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-1.5 max-w-67.5
                        font-jost text-[12px]
                        leading-[1.55]
                        text-text-secondary
                    "
                >
                    {description}
                </p>
            </div>

            {/* BOTTOM ACCENT */}
            <span
                className="
                    absolute bottom-0 left-0
                    h-0.75 w-0
                    bg-primary
                    transition-all duration-500
                    group-hover:w-full
                "
            />
        </div>
    );
};

// ========================================================
// NETWORK SECTION
// ========================================================

const NetworkSection = ({
    loading,
    totalUsers,
    totalIndividualUsers,
    totalOrganizations,
    totalVolunteers,
    totalHelpRequests,
    totalCampaigns,
    activeCampaigns,
    totalDonations,
}) => {
    return (
        <section className="mt-24">
            <SectionHeading
                number="03"
                eyebrow="Platform Overview"
                title="The network behind the response"
                description="A live view of the people, organizations, requests, campaigns, and donations powering Stand For People."
            />

            <div className="mt-8 overflow-hidden border border-border bg-surface">
                {/* ==================================================
                    NETWORK OVERVIEW
                ================================================== */}

                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                    {/* ==================================================
                        TOTAL NETWORK
                    ================================================== */}

                    <div
                        className="
                            relative overflow-hidden
                            border-b border-border
                            px-7 py-8
                            lg:border-b-0 lg:border-r
                            lg:px-9
                        "
                    >
                        <Users
                            size={150}
                            strokeWidth={0.7}
                            className="
                                pointer-events-none
                                absolute -right-8 -top-8
                                text-primary opacity-[0.045]
                            "
                        />

                        <div className="relative flex h-full flex-col">
                            {/* HEADER */}

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            flex h-10 w-10
                                            items-center justify-center
                                            bg-primary text-white
                                        "
                                    >
                                        <Users size={18} strokeWidth={1.6} />
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                font-poppins text-[10px]
                                                font-semibold uppercase
                                                tracking-[0.12em]
                                                text-text-primary
                                            "
                                        >
                                            Total network
                                        </p>

                                        <p
                                            className="
                                                mt-1 font-jost text-[11px]
                                                text-text-secondary
                                            "
                                        >
                                            Everyone connected to SP
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className="
                                        font-poppins text-[9px]
                                        font-semibold
                                        tracking-[0.12em]
                                        text-border
                                    "
                                >
                                    01
                                </span>
                            </div>

                            {/* VALUE */}

                            <div className="mt-10">
                                <p
                                    className="
                                        font-fraunces text-[60px]
                                        leading-none
                                        tracking-[-0.045em]
                                        text-text-primary
                                    "
                                >
                                    {loading ? '—' : formatNumber(totalUsers)}
                                </p>

                                <p
                                    className="
                                        mt-4 max-w-[320px]
                                        font-jost text-[13px]
                                        leading-[1.6]
                                        text-text-secondary
                                    "
                                >
                                    People and organizations forming the
                                    connected community around humanitarian
                                    needs, support and action.
                                </p>
                            </div>

                            {/* NETWORK ROLES */}

                            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3">
                                <div>
                                    <p
                                        className="
                                            font-poppins text-[9px]
                                            font-semibold uppercase
                                            tracking-widest
                                            text-text-secondary
                                        "
                                    >
                                        People
                                    </p>

                                    <p
                                        className="
                                            mt-1 font-jost text-[12px]
                                            text-text-primary
                                        "
                                    >
                                        Individuals & volunteers
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className="
                                            font-poppins text-[9px]
                                            font-semibold uppercase
                                            tracking-widest
                                            text-text-secondary
                                        "
                                    >
                                        Partners
                                    </p>

                                    <p
                                        className="
                                            mt-1 font-jost text-[12px]
                                            text-text-primary
                                        "
                                    >
                                        Organizations & campaigns
                                    </p>
                                </div>
                            </div>

                            {/* BOTTOM DETAIL */}

                            <div className="mt-auto pt-8">
                                <div className="flex items-center gap-3">
                                    <span className="h-0.5 w-8 bg-primary" />

                                    <span
                                        className="
                                            font-poppins text-[9px]
                                            font-semibold uppercase
                                            tracking-[0.11em]
                                            text-text-secondary
                                        "
                                    >
                                        Network overview
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
                        PEOPLE BREAKDOWN
                    ================================================== */}

                    <div className="grid sm:grid-cols-2">
                        <NetworkItem
                            icon={UserRound}
                            label="Individual users"
                            value={
                                loading
                                    ? '—'
                                    : formatNumber(totalIndividualUsers)
                            }
                            description="People who use SP independently to seek help, contribute, volunteer or take part in community action."
                            className="border-b border-border sm:border-r"
                        />

                        <NetworkItem
                            icon={Building2}
                            label="Organizations"
                            value={
                                loading ? '—' : formatNumber(totalOrganizations)
                            }
                            description="Community organizations and partners helping coordinate needs, resources, campaigns and support."
                            className="border-b border-border"
                        />

                        <NetworkItem
                            icon={UserCheck}
                            label="Volunteers"
                            value={
                                loading ? '—' : formatNumber(totalVolunteers)
                            }
                            description="People contributing time and skills to help move verified humanitarian needs toward action."
                            className="sm:border-r border-border"
                        />

                        <NetworkItem
                            icon={HeartHandshake}
                            label="Help requests"
                            value={
                                loading ? '—' : formatNumber(totalHelpRequests)
                            }
                            description="Humanitarian needs submitted through SP and brought into the platform's coordination process."
                        />
                    </div>
                </div>

                {/* ==================================================
                    RESOURCES
                ================================================== */}

                <div
                    className="
                        grid border-t border-border
                        lg:grid-cols-[0.85fr_0.85fr_1.3fr]
                    "
                >
                    <NetworkItem
                        icon={Megaphone}
                        label="Campaigns"
                        value={loading ? '—' : formatNumber(totalCampaigns)}
                        description={
                            loading
                                ? 'Campaigns currently on the platform.'
                                : `${formatNumber(
                                      activeCampaigns,
                                  )} of these campaigns are currently active and available for participation.`
                        }
                        className="
                            border-b border-border
                            lg:border-b-0 lg:border-r
                        "
                    />

                    <NetworkItem
                        icon={Banknote}
                        label="Donations"
                        value={loading ? '—' : formatCurrency(totalDonations)}
                        description="Recorded contributions helping direct financial support toward campaigns and humanitarian needs."
                        className="
                            border-b border-border
                            lg:border-b-0 lg:border-r
                        "
                    />

                    {/* ==================================================
                        CLOSING STATEMENT
                    ================================================== */}

                    <div
                        className="
                            relative flex min-h-40 items-center
                            overflow-hidden
                            bg-primary px-7 py-7
                            lg:px-9
                        "
                    >
                        {/* Decorative rings */}

                        <div
                            className="
                                pointer-events-none absolute
                                -bottom-12 -right-12
                                h-40 w-40
                                border border-white/10
                            "
                        />

                        <div
                            className="
                                pointer-events-none absolute
                                -bottom-5 right-5
                                h-24 w-24
                                border border-white/8
                            "
                        />

                        <div className="relative max-w-97.5">
                            <div className="mb-4 flex items-center gap-2.5">
                                <span
                                    className="
                                        h-1.5 w-1.5 rounded-full
                                        bg-accent
                                    "
                                />

                                <span
                                    className="
                                        font-poppins text-[10px]
                                        font-semibold uppercase
                                        tracking-[0.12em]
                                        text-white/60
                                    "
                                >
                                    Connected action
                                </span>
                            </div>

                            <p
                                className="
                                    font-fraunces text-[24px]
                                    leading-[1.2]
                                    tracking-[-0.02em]
                                    text-white
                                "
                            >
                                Every participant strengthens the path from
                                human need to meaningful action.
                            </p>

                            <p
                                className="
                                    mt-3 max-w-85
                                    font-jost text-[12px]
                                    leading-[1.55]
                                    text-white/60
                                "
                            >
                                People bring the need. Organizations bring
                                capacity. Volunteers bring action. Donations
                                bring resources.
                            </p>

                            <div className="mt-5 h-px w-9 bg-accent/70" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NetworkSection;
