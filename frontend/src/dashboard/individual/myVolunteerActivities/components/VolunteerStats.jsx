import React from 'react';
import { Layers3, Clock3, Activity, CheckCircle2 } from 'lucide-react';

const items = [
    {
        key: 'total',
        label: 'Total Assignments',
        description: 'All campaigns',
        icon: Layers3,
        featured: true,
    },
    {
        key: 'pending',
        label: 'Pending Response',
        description: 'Awaiting your decision',
        icon: Clock3,
    },
    {
        key: 'active',
        label: 'Active Activities',
        description: 'Currently involved',
        icon: Activity,
    },
    {
        key: 'completed',
        label: 'Completed',
        description: 'Finished campaigns',
        icon: CheckCircle2,
    },
];

const StatItem = ({
    icon: Icon,
    label,
    value,
    description,
    featured = false,
}) => {
    return (
        <div
            className={`
                group relative min-w-0 px-5 py-6
                transition-colors duration-200 ease-out
                sm:px-7 sm:py-7
                ${
                    featured
                        ? 'bg-[#19232E] hover:bg-[#1D2A37]'
                        : 'bg-[#111821] hover:bg-[#18222D]'
                }
            `}
        >
            {featured && (
                <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-[2px] bg-[#8EA5BD]"
                />
            )}

            <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                    <Icon
                        size={15}
                        strokeWidth={1.7}
                        className="
                            shrink-0 text-[#7F8A99]
                            transition-colors duration-200
                            group-hover:text-[#A5AFBB]
                        "
                    />

                    <p
                        className="
                            min-w-0 font-sans! text-[10px]
                            font-semibold! uppercase
                            tracking-[0.13em] text-[#8792A1]
                            transition-colors duration-200
                            group-hover:text-[#AAB3BF]
                            sm:text-[11px]
                        "
                    >
                        {label}
                    </p>
                </div>

                <div className="mt-6">
                    <span
                        className="
                            font-sans! text-[28px]
                            font-semibold! leading-none
                            tracking-[-0.035em]
                            tabular-nums text-[#EEF1F5]
                            sm:text-[31px] lg:text-[34px]
                        "
                    >
                        {value}
                    </span>
                </div>

                <p
                    className="
                        mt-2.5 max-w-[230px]
                        font-sans! text-[11px]
                        leading-[1.65] text-[#8A95A4]
                        sm:text-[12px]
                    "
                >
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function VolunteerStats({ stats }) {
    return (
        <section
            aria-labelledby="volunteer-overview-heading"
            className="min-w-0 pt-6"
        >
            <div className="mb-5 flex items-end justify-between gap-6 sm:mb-6">
                <h2
                    id="volunteer-overview-heading"
                    className="
                        font-sans! text-[18px]
                        font-semibold! leading-tight
                        tracking-[-0.02em]
                        text-[#EEF1F5]!
                    "
                >
                    Activity overview
                </h2>
            </div>

            <div
                className="
                    grid grid-cols-2 overflow-hidden
                    border border-[#303A47]
                    bg-[#111821] lg:grid-cols-4
                "
            >
                {items.map((item, index) => (
                    <div
                        key={item.key}
                        className={`
                            min-w-0
                            ${
                                index % 2 !== 0
                                    ? 'border-l border-[#252D38]'
                                    : ''
                            }
                            ${index >= 2 ? 'border-t border-[#252D38]' : ''}
                            lg:border-t-0
                            ${
                                index > 0
                                    ? 'lg:border-l lg:border-[#252D38]'
                                    : 'lg:border-l-0'
                            }
                        `}
                    >
                        <StatItem
                            icon={item.icon}
                            label={item.label}
                            value={stats[item.key]}
                            description={item.description}
                            featured={item.featured}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
