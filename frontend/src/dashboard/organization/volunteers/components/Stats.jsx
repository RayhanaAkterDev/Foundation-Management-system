import React from 'react';

import {
    UsersRound,
    UserRoundCheck,
    Megaphone,
    ClipboardCheck,
    Activity,
} from 'lucide-react';

const SmallMetric = ({ icon: Icon, label, value, description }) => {
    return (
        <div className="group flex min-w-0 flex-col justify-center px-5 py-5 transition-colors hover:bg-[#151C26] sm:px-6">
            <div className="flex items-center gap-2.5">
                <Icon
                    size={15}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8996A6]"
                />

                <span className="text-[12px] font-medium! text-[#AAB5C3]!">
                    {label}
                </span>
            </div>

            <p className="mt-3 text-[29px] font-semibold! leading-none tracking-[-0.04em] text-[#EEF1F5]!">
                {value}
            </p>

            <p className="mt-2 text-[11px] leading-relaxed text-[#788596]">
                {description}
            </p>
        </div>
    );
};

export default function Stats({
    total = 0,
    activeCampaigns = 0,
    activeAssignments = 0,
}) {
    return (
        <section className="min-w-0">
            <div className="mb-5">
                <h2 className="text-[18px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                    Volunteer overview
                </h2>
            </div>

            <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:gap-5">
                <div className="overflow-hidden border border-[#29323E] bg-[#0E1219]">
                    <div className="flex items-center justify-between gap-3 border-b border-[#29323E] bg-[#151C26] px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                            <UsersRound size={15} className="text-[#8996A6]" />

                            <h3 className="text-[13px] font-semibold! text-[#D5DDE7]!">
                                Volunteer network
                            </h3>
                        </div>

                        <span className="text-[11px] text-[#788596]">
                            Organization
                        </span>
                    </div>

                    <div className="relative flex min-h-[205px] flex-col justify-between bg-[#1A222D] px-6 py-6 sm:px-7">
                        <span className="absolute inset-x-0 top-0 h-px bg-[#778698]" />

                        <div className="flex items-center gap-2.5">
                            <UserRoundCheck
                                size={16}
                                className="text-[#9BB9A9]"
                            />

                            <p className="text-[12px] font-medium! text-[#AAB5C3]!">
                                Assigned volunteers
                            </p>
                        </div>

                        <div>
                            <p className="text-[46px] font-semibold! leading-none tracking-[-0.05em] text-[#EEF1F5]! sm:text-[52px]">
                                {total}
                            </p>

                            <p className="mt-4 max-w-sm text-[12px] leading-[1.7] text-[#8996A6]">
                                Volunteers connected to your organization's
                                campaign activities.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex min-w-0 flex-col overflow-hidden border border-[#29323E] bg-[#0E1219]">
                    <div className="flex items-center justify-between gap-3 border-b border-[#29323E] bg-[#151C26] px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                            <Activity size={15} className="text-[#8996A6]" />

                            <h3 className="text-[13px] font-semibold! text-[#D5DDE7]!">
                                Campaign participation
                            </h3>
                        </div>
                    </div>

                    <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-[#29323E] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-1 xl:divide-x-0 xl:divide-y 2xl:grid-cols-2 2xl:divide-x 2xl:divide-y-0">
                        <SmallMetric
                            icon={Megaphone}
                            label="Active campaigns"
                            value={activeCampaigns}
                            description="Campaigns currently involving volunteers."
                        />

                        <SmallMetric
                            icon={ClipboardCheck}
                            label="Active assignments"
                            value={activeAssignments}
                            description="Volunteer assignments currently active."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
