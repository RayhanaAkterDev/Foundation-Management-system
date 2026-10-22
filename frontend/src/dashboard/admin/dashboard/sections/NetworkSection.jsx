import React from 'react';
import {
    Banknote,
    Building2,
    HeartHandshake,
    Megaphone,
    UserCheck,
    UserRound,
    Users,
    ArrowUpRight,
} from 'lucide-react';

import SectionHeading from '../components/SectionHeading';
import { formatCurrency, formatNumber } from '../utils/dashboardHelpers';

/* =========================================================
   COLOR SYSTEM
========================================================= */

const COLORS = {
    background: '#151C25',
    card: '#1B242E',
    featured: '#202C38',
    border: '#34404D',
    iconBg: '#293744',
    text: '#EEF1F5',
    muted: '#9BA8B8',
    teal: '#58AFA2',
    blue: '#88A9D7',
    amber: '#E8A56E',
    purple: '#A998C8',
};

/* =========================================================
   SHARED METRIC CARD
========================================================= */

const MetricCard = ({
    icon: Icon,
    label,
    value,
    description,
    color = COLORS.blue,
    featured = false,
    children,
    className = '',
}) => {
    return (
        <div
            className={`
                group relative flex min-w-0 flex-col
                justify-between overflow-hidden
                rounded-[7px]
                border border-[#34404D]
                transition-colors duration-200
                hover:border-[#485667]
                ${featured ? 'bg-[#202C38]' : 'bg-[#1B242E]'}
                ${className}
            `}
        >
            {/* TOP ACCENT */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{
                    backgroundColor: color,
                    opacity: featured ? 0.9 : 0.55,
                }}
            />

            <div className="flex min-w-0 flex-col gap-5 p-5 sm:p-6">
                {/* LABEL */}
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="
                            flex h-9 w-9 shrink-0 items-center
                            justify-center rounded-[5px]
                            bg-[#293744]
                        "
                        style={{ color }}
                    >
                        <Icon size={17} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold leading-5 text-[#EEF1F5]!">
                            {label}
                        </h3>
                    </div>
                </div>

                {/* VALUE */}
                <div className="min-w-0">
                    <p
                        className={`
                            break-words font-semibold
                            leading-none tracking-[-0.04em]
                            tabular-nums text-[#F0F3F7]
                            ${
                                featured
                                    ? 'text-[43px] sm:text-[48px]'
                                    : 'text-[30px] sm:text-[33px]'
                            }
                        `}
                    >
                        {value}
                    </p>

                    {description && (
                        <p className="mt-2 text-[12px] leading-[1.65] text-[#9BA8B8]">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {children}
        </div>
    );
};

/* =========================================================
   TOTAL NETWORK CARD
========================================================= */

const TotalNetworkCard = ({
    loading,
    totalUsers,
    totalIndividualUsers,
    totalOrganizations,
}) => {
    return (
        <MetricCard
            icon={Users}
            label="Total network"
            value={loading ? '—' : formatNumber(totalUsers)}
            description="Registered members and partner organizations across Stand For People."
            color={COLORS.teal}
            featured
            className="lg:row-span-2"
        >
            {/* NETWORK BREAKDOWN */}
            <div className="mx-5 mb-5 grid grid-cols-2 gap-4 border-t border-[#40505E] pt-4 sm:mx-6 sm:mb-6">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8FA0B2]">
                        Individuals
                    </p>

                    <p className="mt-2 text-[20px] font-semibold leading-none tabular-nums text-[#E9EEF3]">
                        {loading ? '—' : formatNumber(totalIndividualUsers)}
                    </p>
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8FA0B2]">
                        Organizations
                    </p>

                    <p className="mt-2 text-[20px] font-semibold leading-none tabular-nums text-[#E9EEF3]">
                        {loading ? '—' : formatNumber(totalOrganizations)}
                    </p>
                </div>
            </div>
        </MetricCard>
    );
};

/* =========================================================
   SECONDARY METRIC CARD
========================================================= */

const SecondaryMetric = ({ icon: Icon, label, value, description, color }) => {
    return (
        <div
            className="
                group flex min-w-0 items-center
                justify-between gap-4
                rounded-[7px]
                border border-[#34404D]
                bg-[#1B242E]
                px-5 py-5
                transition-colors duration-200
                hover:border-[#485667]
                sm:px-6
            "
        >
            <div className="flex min-w-0 items-center gap-3.5">
                <div
                    className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-[5px] bg-[#293744]
                    "
                    style={{ color }}
                >
                    <Icon size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-[#EEF1F5]!">
                        {label}
                    </h3>

                    <p className="mt-1 text-[12px] leading-5 text-[#9BA8B8]">
                        {description}
                    </p>
                </div>
            </div>

            <p className="shrink-0 text-[28px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[#EEF1F5] sm:text-[31px]">
                {value}
            </p>
        </div>
    );
};

/* =========================================================
   CAMPAIGN CARD
========================================================= */

const CampaignCard = ({ loading, totalCampaigns, activeCampaigns }) => {
    return (
        <div
            className="
                relative flex min-w-0 flex-col
                justify-between gap-5
                rounded-[7px]
                border border-[#34404D]
                bg-[#1B242E]
                p-5 sm:p-6
            "
        >
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#293744] text-[#88A9D7]">
                    <Megaphone size={17} strokeWidth={1.8} />
                </div>

                <h3 className="text-[13px] font-semibold text-[#EEF1F5]!">
                    Campaigns
                </h3>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-[33px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[#F0F3F7]">
                        {loading ? '—' : formatNumber(totalCampaigns)}
                    </p>

                    <p className="mt-2 text-[12px] text-[#9BA8B8]">
                        Total campaigns
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-[20px] font-semibold leading-none tabular-nums text-[#B5C9E4]">
                        {loading ? '—' : formatNumber(activeCampaigns)}
                    </p>

                    <p className="mt-2 text-[12px] text-[#9BA8B8]">
                        Currently active
                    </p>
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   DONATIONS CARD
========================================================= */

const DonationsCard = ({ loading, totalDonations }) => {
    return (
        <div
            className="
                relative flex min-w-0 flex-col
                justify-between gap-5
                rounded-[7px]
                border border-[#34404D]
                bg-[#1B242E]
                p-5 sm:p-6
            "
        >
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#293744] text-[#58AFA2]">
                    <Banknote size={17} strokeWidth={1.8} />
                </div>

                <h3 className="text-[13px] font-semibold text-[#EEF1F5]!">
                    Donations
                </h3>
            </div>

            <div>
                <p className="break-words text-[33px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[#F0F3F7]">
                    {loading ? '—' : formatCurrency(totalDonations)}
                </p>

                <p className="mt-2 text-[12px] text-[#9BA8B8]">
                    Recorded contributions
                </p>
            </div>
        </div>
    );
};

/* =========================================================
   MAIN NETWORK SECTION
========================================================= */

const NetworkSection = ({
    loading = false,
    totalUsers = 0,
    totalIndividualUsers = 0,
    totalOrganizations = 0,
    totalVolunteers = 0,
    totalHelpRequests = 0,
    totalCampaigns = 0,
    activeCampaigns = 0,
    totalDonations = 0,
}) => {
    return (
        <section className="mt-12 min-w-0 sm:mt-14">
            <SectionHeading
                title="Platform overview"
                description="People, organizations, campaigns, and contributions across Stand For People."
            />

            

            {/* PRIMARY NETWORK METRICS */}
            <div
                className="
                    mt-6 grid min-w-0
                    grid-cols-1 gap-4
                    md:grid-cols-2
                    lg:grid-cols-[1.05fr_1fr_1fr]
                "
            >
                {/* TOTAL NETWORK */}
                <TotalNetworkCard
                    loading={loading}
                    totalUsers={totalUsers}
                    totalIndividualUsers={totalIndividualUsers}
                    totalOrganizations={totalOrganizations}
                />

                {/* INDIVIDUAL USERS */}
                <SecondaryMetric
                    icon={UserRound}
                    label="Individual users"
                    value={loading ? '—' : formatNumber(totalIndividualUsers)}
                    description="Registered individuals"
                    color={COLORS.blue}
                />

                {/* ORGANIZATIONS */}
                <SecondaryMetric
                    icon={Building2}
                    label="Organizations"
                    value={loading ? '—' : formatNumber(totalOrganizations)}
                    description="Partner registrations"
                    color={COLORS.purple}
                />

                {/* VOLUNTEERS */}
                <SecondaryMetric
                    icon={UserCheck}
                    label="Volunteers"
                    value={loading ? '—' : formatNumber(totalVolunteers)}
                    description="Active community support"
                    color={COLORS.teal}
                />

                {/* HELP REQUESTS */}
                <SecondaryMetric
                    icon={HeartHandshake}
                    label="Help requests"
                    value={loading ? '—' : formatNumber(totalHelpRequests)}
                    description="Submitted humanitarian needs"
                    color={COLORS.amber}
                />
            </div>

            {/* SECONDARY NETWORK METRICS */}
            <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                <CampaignCard
                    loading={loading}
                    totalCampaigns={totalCampaigns}
                    activeCampaigns={activeCampaigns}
                />

                <DonationsCard
                    loading={loading}
                    totalDonations={totalDonations}
                />
            </div>
        </section>
    );
};

export default NetworkSection;
