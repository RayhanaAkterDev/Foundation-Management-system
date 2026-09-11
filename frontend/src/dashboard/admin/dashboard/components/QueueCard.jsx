import React from 'react';

import { ArrowRight } from 'lucide-react';

import { loadingSafeCount } from '../utils/dashboardHelpers';

const QueueCard = ({
    icon: Icon,
    label,
    title,
    description,
    count,
    tone,
    children,
    actionLabel,
    onAction,
}) => {
    const styles = {
        amber: {
            shell: 'border-accent/25 bg-accent/[0.055]',
            icon: 'bg-accent/10 text-accent',
            label: 'text-accent',
            count: 'text-accent',
            divider: 'border-accent/15',
        },

        teal: {
            shell: 'border-primary/20 bg-primary/[0.045]',
            icon: 'bg-primary/10 text-primary',
            label: 'text-primary',
            count: 'text-primary',
            divider: 'border-primary/10',
        },
    };

    const style = styles[tone];

    return (
        <div className={`overflow-hidden border ${style.shell}`}>
            <div className="flex items-start justify-between gap-5 px-6 py-6 sm:px-7">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center ${style.icon}`}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                        </span>

                        <span
                            className={`font-poppins text-[9px] font-semibold uppercase tracking-[0.14em] ${style.label}`}
                        >
                            {label}
                        </span>
                    </div>

                    <h3 className="mt-5 font-fraunces text-[28px] leading-none tracking-tight text-text-primary">
                        {title}
                    </h3>

                    <p className="mt-2 max-w-md font-jost text-sm leading-6 text-text-secondary">
                        {description}
                    </p>
                </div>

                <span
                    className={`shrink-0 font-fraunces text-[46px] leading-none ${style.count}`}
                >
                    {loadingSafeCount(count)}
                </span>
            </div>

            <div className={`border-t px-6 py-5 sm:px-7 ${style.divider}`}>
                {children}

                <button
                    type="button"
                    onClick={onAction}
                    className={`mt-5 inline-flex items-center gap-2 font-poppins text-[9px] font-semibold uppercase tracking-widest ${style.label}`}
                >
                    {actionLabel}

                    <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
};

export default QueueCard;
