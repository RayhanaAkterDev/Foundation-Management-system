import React from 'react';

import { ArrowUpRight } from 'lucide-react';

const NetworkMetric = ({
    icon: Icon,
    label,
    value,
    description,
    onClick,
    featured = false,
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`
            group relative overflow-hidden px-6 py-7 text-left
            transition-colors hover:bg-surface
            lg:px-8 lg:py-8
            ${featured ? 'bg-primary/4.5' : 'bg-surface'}
        `}
    >
        {featured && (
            <span className="absolute inset-y-0 left-0 w-1 bg-primary" />
        )}

        <div className="flex items-start justify-between">
            <span
                className={`
                    flex h-10 w-10 items-center justify-center
                    ${
                        featured
                            ? 'bg-primary text-white'
                            : 'bg-background-alt text-text-secondary'
                    }
                `}
            >
                <Icon size={17} strokeWidth={1.8} />
            </span>

            <ArrowUpRight
                size={16}
                className="text-border transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            />
        </div>

        <p className="mt-8 font-poppins text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
            {label}
        </p>

        <p className="mt-1 font-fraunces text-[42px] leading-none tracking-[-0.035em] text-text-primary">
            {value}
        </p>

        <p className="mt-2 max-w-55 font-jost text-xs leading-5 text-text-secondary">
            {description}
        </p>
    </button>
);

export default NetworkMetric;
