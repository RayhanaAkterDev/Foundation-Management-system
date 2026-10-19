import React from 'react';

import {
    UsersRound,
    UserRoundCheck,
    UserRoundMinus,
    Send,
    ClipboardList,
    ArrowUpRight,
} from 'lucide-react';

/* =========================================================
   METRIC
========================================================= */

const Metric = ({ icon: Icon, label, value, description, divider = false }) => {
    return (
        <div
            className={`
                group flex min-w-0 flex-col
                px-4 py-5
                transition-colors duration-200
                hover:bg-[#151C26]
                sm:px-5 sm:py-6
                lg:px-6
                ${
                    divider
                        ? 'border-t border-[#29323E] sm:border-t-0 sm:border-l'
                        : ''
                }
            `}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={16}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#8492A3]"
                    aria-hidden="true"
                />

                <span className="min-w-0 break-words font-sans! text-[12px] font-medium! leading-5 text-[#AAB5C3]!">
                    {label}
                </span>
            </div>

            <div className="mt-4 flex min-w-0 items-end justify-between gap-3 sm:mt-5">
                <p className="min-w-0 break-words font-sans! text-[30px] font-semibold! leading-none tracking-[-0.035em] text-[#E5EAF0]! sm:text-[34px]">
                    {value}
                </p>
            </div>

            <p className="mt-3 max-w-full font-sans! text-[12px] leading-[1.7] text-[#788596]!">
                {description}
            </p>
        </div>
    );
};

/* =========================================================
   MEMBERSHIP STATISTIC
========================================================= */

const MembershipStat = ({
    icon: Icon,
    label,
    value,
    iconClassName = 'text-[#8492A3]',
}) => {
    return (
        <div className="flex min-w-0 items-center px-4 py-5 sm:px-5 sm:py-6">
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                    <Icon
                        size={15}
                        strokeWidth={1.7}
                        className={`shrink-0 ${iconClassName}`}
                        aria-hidden="true"
                    />

                    <p className="min-w-0 break-words font-sans! text-[12px] font-medium! text-[#AAB5C3]!">
                        {label}
                    </p>
                </div>

                <p className="mt-2.5 font-sans! text-[26px] font-semibold! leading-none tracking-[-0.03em] text-[#E5EAF0]! sm:text-[29px]">
                    {value}
                </p>
            </div>
        </div>
    );
};

/* =========================================================
   MAIN STATS
========================================================= */

export default function Stats({
    total = 0,
    active = 0,
    inactive = 0,
    invitations = 0,
    applications = 0,
}) {
    return (
        <section className="min-w-0 w-full">
            {/* SECTION HEADING */}

            <div className="mb-4 flex min-w-0 flex-wrap items-end justify-between gap-3 sm:mb-5">
                <div className="min-w-0">
                    <h2 className="font-sans! text-[19px] font-semibold! tracking-[-0.025em] text-[#EEF1F5]! sm:text-[20px]">
                        Volunteer overview
                    </h2>
                </div>
            </div>

            {/* OVERVIEW */}

            <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-5">
                {/* =================================================
                    MEMBERSHIP
                ================================================= */}

                <div className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
                    {/* PANEL HEADING */}

                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#29323E] bg-[#151C26] px-4 py-3.5 sm:px-6">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <UsersRound
                                size={15}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8996A6]"
                                aria-hidden="true"
                            />

                            <h3 className="font-sans! text-[13px] font-semibold! text-[#D5DDE7]!">
                                Volunteer membership
                            </h3>
                        </div>

                        <span className="font-sans! text-[11px] leading-relaxed text-[#788596]!">
                            Registered members
                        </span>
                    </div>

                    {/* MEMBERSHIP CONTENT */}

                    <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                        {/* CONFIRMED VOLUNTEERS */}

                        <div className="relative min-w-0 border-b border-[#29323E] bg-[#1A222D] px-5 py-6 sm:px-6 sm:py-7 md:border-r md:border-b-0">
                            <span
                                aria-hidden="true"
                                className="absolute inset-x-0 top-0 h-px bg-[#778698]"
                            />

                            <p className="font-sans! text-[12px] font-medium! text-[#AAB5C3]!">
                                Confirmed volunteers
                            </p>

                            <div className="mt-4 flex min-w-0 items-end gap-3">
                                <span className="break-words font-sans! text-[40px] font-semibold! leading-none tracking-[-0.05em] text-[#EEF1F5]! sm:text-[46px]">
                                    {total}
                                </span>
                            </div>

                            <p className="mt-4 max-w-[240px] font-sans! text-[12px] leading-[1.7] text-[#8996A6]!">
                                People officially part of the volunteer network.
                            </p>
                        </div>

                        {/* ACTIVE / INACTIVE */}

                        <div className="grid min-w-0 grid-cols-2 divide-x divide-[#29323E] md:grid-cols-1 md:divide-x-0 md:divide-y md:divide-[#29323E]">
                            <MembershipStat
                                icon={UserRoundCheck}
                                label="Active"
                                value={active}
                                iconClassName="text-[#91A99E]"
                            />

                            <MembershipStat
                                icon={UserRoundMinus}
                                label="Inactive"
                                value={inactive}
                            />
                        </div>
                    </div>
                </div>

                {/* =================================================
                    RECRUITMENT
                ================================================= */}

                <div className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
                    {/* PANEL HEADING */}

                    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-[#29323E] bg-[#151C26] px-4 py-3.5 sm:px-6">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <ClipboardList
                                size={15}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8996A6]"
                                aria-hidden="true"
                            />

                            <h3 className="min-w-0 font-sans! text-[13px] font-semibold! text-[#D5DDE7]!">
                                Volunteer requests
                            </h3>
                        </div>

                        <ArrowUpRight
                            size={15}
                            strokeWidth={1.6}
                            className="shrink-0 text-[#697586]"
                            aria-hidden="true"
                        />
                    </div>

                    {/* RECRUITMENT METRICS */}

                    <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2">
                        <Metric
                            icon={Send}
                            label="Pending invitations"
                            value={invitations}
                            description="Awaiting a response from invited individuals."
                        />

                        <Metric
                            icon={ClipboardList}
                            label="Applications to review"
                            value={applications}
                            description="Applications waiting for administrator approval."
                            divider
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
