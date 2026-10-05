import React from 'react';

import { Check } from 'lucide-react';

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
        <div className="w-full bg-[#0E1219]">
            {/* ============================================================
                ORGANIZATION TYPE
            ============================================================ */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    px-4
                    py-4

                    sm:px-5
                    sm:py-5

                    xl:px-3
                    xl:py-4
                "
            >
                {/* ========================================================
                    SECTION HEADER
                ======================================================== */}

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        justify-between

                        sm:mb-3.5

                        xl:mb-3
                        xl:px-1
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.14em]

                            text-[#697586]

                            xl:text-[9px]
                            xl:tracking-[0.15em]
                        "
                    >
                        Organization type
                    </p>

                    <span
                        className="
                            flex
                            min-w-5
                            items-center
                            justify-center

                            text-[10px]
                            font-medium!
                            tabular-nums

                            text-[#5E6978]

                            xl:text-[9px]
                        "
                    >
                        {organizationTypes.length}
                    </span>
                </div>

                {/* ========================================================
                    OPTIONS
                ======================================================== */}

                <div
                    className="
                        overflow-hidden

                        border
                        border-[#252D38]

                        bg-[#0E1219]
                    "
                >
                    {organizationTypes.map((type, index) => {
                        const active = typeFilter === type.value;

                        return (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => onTypeChange(type.value)}
                                className={`
                                    group

                                    flex
                                    min-h-11
                                    w-full
                                    items-center
                                    gap-3

                                    border-b
                                    border-[#252D38]

                                    px-3
                                    py-2.5

                                    text-left

                                    transition-[background-color,color,border-color]
                                    duration-150
                                    ease-out

                                    last:border-b-0

                                    sm:min-h-12
                                    sm:px-3.5

                                    xl:min-h-10
                                    xl:gap-2.5
                                    xl:px-3
                                    xl:py-2

                                    ${
                                        active
                                            ? 'bg-[#171E28]'
                                            : 'bg-transparent hover:bg-[#151B24]'
                                    }

                                    focus:outline-none
                                    focus:ring-0
                                `}
                            >
                                {/* =================================================
                                    INDEX / SELECTED STATE
                                ================================================= */}

                                <span
                                    className={`
                                        flex
                                        h-6
                                        w-6
                                        shrink-0
                                        items-center
                                        justify-center

                                        border

                                        text-[9px]
                                        font-semibold!
                                        tabular-nums

                                        transition-[background-color,border-color,color]
                                        duration-150

                                        xl:h-5
                                        xl:w-5
                                        xl:text-[8px]

                                        ${
                                            active
                                                ? `
                                                    border-[#465363]
                                                    bg-[#202A36]
                                                    text-[#D7DCE3]
                                                `
                                                : `
                                                    border-[#29323E]
                                                    bg-[#121821]
                                                    text-[#657181]

                                                    group-hover:border-[#394553]
                                                    group-hover:text-[#AEB7C3]
                                                `
                                        }
                                    `}
                                >
                                    {active ? (
                                        <Check
                                            size={11}
                                            strokeWidth={2.2}
                                            className="xl:h-2.5 xl:w-2.5"
                                        />
                                    ) : (
                                        String(index + 1).padStart(2, '0')
                                    )}
                                </span>

                                {/* =================================================
                                    LABEL
                                ================================================= */}

                                <span
                                    className={`
                                        min-w-0
                                        flex-1

                                        text-[12px]
                                        leading-5

                                        transition-colors
                                        duration-150

                                        xl:text-[11px]
                                        xl:leading-4

                                        ${
                                            active
                                                ? `
                                                    font-semibold!
                                                    text-[#EEF1F5]
                                                `
                                                : `
                                                    font-medium!
                                                    text-[#96A0AE]

                                                    group-hover:text-[#C5CBD3]
                                                `
                                        }
                                    `}
                                >
                                    {type.label}
                                </span>

                                {/* MOBILE ACTIVE INDICATOR */}

                                {active && (
                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            shrink-0
                                            rounded-full
                                            bg-[#8795A7]

                                            xl:hidden
                                        "
                                    />
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
