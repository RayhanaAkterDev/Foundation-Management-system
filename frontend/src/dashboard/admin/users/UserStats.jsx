import React from 'react';
import { Users, UserRound, Building2, ShieldCheck } from 'lucide-react';

const UserStats = ({ total, individuals, organizations, administrators }) => {
    const items = [
        {
            label: 'Total users',
            value: total,
            icon: Users,
            emphasis: true,
        },
        {
            label: 'Individuals',
            value: individuals,
            icon: UserRound,
        },
        {
            label: 'Organizations',
            value: organizations,
            icon: Building2,
        },
        {
            label: 'Administrators',
            value: administrators,
            icon: ShieldCheck,
        },
    ];

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className={`group relative px-5 py-5 transition-colors hover:bg-background-alt/30 ${
                                item.emphasis ? 'sm:bg-primary/2.5' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                                        {item.label}
                                    </p>

                                    <p
                                        className={`mt-2 font-bold tracking-tight ${
                                            item.emphasis
                                                ? 'text-3xl text-text-primary'
                                                : 'text-2xl text-text-primary'
                                        }`}
                                    >
                                        {item.value}
                                    </p>
                                </div>

                                <Icon
                                    size={18}
                                    strokeWidth={1.7}
                                    className="mt-0.5 text-primary/50 transition-colors group-hover:text-primary"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default UserStats;
