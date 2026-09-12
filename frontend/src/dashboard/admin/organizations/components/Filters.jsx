import React from 'react';

import { ORGANIZATION_TYPES } from '../data/organizationTypes';

const Filters = ({ typeFilter, onTypeChange }) => {
    const organizationTypes = [
        {
            value: 'all',
            label: 'All organization types',
        },
        ...ORGANIZATION_TYPES.map((type) => ({
            value: type,
            label: type,
        })),
    ];

    return (
        <div className="space-y-6">
            {/* Organization Type */}
            <div>
                <div className="mb-2.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                        Organization type
                    </p>
                </div>

                <div className="overflow-hidden border border-white/10 bg-white/4.5">
                    {organizationTypes.map((type) => {
                        const active = typeFilter === type.value;

                        return (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => onTypeChange(type.value)}
                                className={`
                                    relative flex w-full items-center
                                    justify-between border-b border-white/[0.07]
                                    px-3.5 py-3 text-left
                                    transition-colors last:border-b-0
                                    ${
                                        active
                                            ? 'bg-white text-primary'
                                            : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        min-w-0 truncate pr-3 text-[12px]
                                        ${
                                            active
                                                ? 'font-semibold'
                                                : 'font-medium'
                                        }
                                    `}
                                >
                                    {type.label}
                                </span>

                                {active && (
                                    <span className="h-1.5 w-1.5 shrink-0 bg-accent" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Filters;
