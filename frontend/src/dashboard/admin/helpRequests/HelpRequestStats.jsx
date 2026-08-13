import React from 'react';
import { ClipboardList, CircleCheck, Clock3, CircleX } from 'lucide-react';

const HelpRequestStats = ({ total, verified, pending, rejected }) => {
    const stats = [
        {
            label: 'Total Requests',
            value: total,
            icon: ClipboardList,
        },
        {
            label: 'Verified',
            value: verified,
            icon: CircleCheck,
        },
        {
            label: 'Pending',
            value: pending,
            icon: Clock3,
        },
        {
            label: 'Rejected',
            value: rejected,
            icon: CircleX,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div key={stat.label} className="bg-white px-5 py-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-text-secondary">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                                    {stat.value}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-alt text-primary">
                                <Icon size={17} strokeWidth={1.8} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HelpRequestStats;
