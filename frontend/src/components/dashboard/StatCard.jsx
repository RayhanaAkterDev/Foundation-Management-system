import React from 'react';

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

/* ==========================================================================
   TREND
============================================================================ */

const Trend = ({ value, label }) => {
    if (value === null || value === undefined) {
        return null;
    }

    const positive = value > 0;
    const negative = value < 0;

    const Icon = positive ? ArrowUpRight : negative ? ArrowDownRight : Minus;

    const tone = positive
        ? {
              text: 'text-[#8EC5A3]!',
              bg: 'bg-[#16251F]',
              border: 'border-[#294437]',
          }
        : negative
          ? {
                text: 'text-[#D99A9F]!',
                bg: 'bg-[#281A1F]',
                border: 'border-[#493038]',
            }
          : {
                text: 'text-[#8792A1]!',
                bg: 'bg-[#151B24]',
                border: 'border-[#29323E]',
            };

    return (
        <div
            className="
                flex
                min-w-0
                flex-wrap
                items-center
                gap-2
            "
        >
            <span
                className={`
                    inline-flex
                    h-6
                    items-center
                    gap-1

                    rounded-md

                    border

                    px-1.5

                    text-[10px]
                    font-semibold!

                    ${tone.text}
                    ${tone.bg}
                    ${tone.border}
                `}
            >
                <Icon size={12} strokeWidth={1.9} />

                <span>
                    {positive ? '+' : ''}
                    {value}%
                </span>
            </span>

            {label && (
                <span
                    className="
                        truncate

                        text-[10.5px]

                        text-[#697586]!
                    "
                >
                    {label}
                </span>
            )}
        </div>
    );
};

/* ==========================================================================
   STAT CARD
============================================================================ */

const StatCard = ({
    label,
    value,
    icon: Icon,
    iconColor,
    trend,
    trendLabel,
    subtext,
}) => {
    return (
        <article
            className="
                group

                relative

                min-w-0
                overflow-hidden

                border
                border-[#252D38]

                bg-[#0E1219]

                transition-[background-color,border-color]
                duration-150
                ease-out

                hover:border-[#303A47]
                hover:bg-[#121821]
            "
        >
            <div
                className="
                    flex
                    min-h-[138px]
                    flex-col

                    p-4

                    sm:min-h-[148px]
                    sm:p-5
                "
            >
                {/* =========================================================
                    TOP
                ========================================================= */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    <p
                        className="
                            min-w-0
                            truncate

                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.11em]

                            text-[#8792A1]!
                        "
                    >
                        {label}
                    </p>

                    {Icon && (
                        <span
                            className={`
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center

                                rounded-md

                                border
                                border-[#29323E]

                                bg-[#151B24]

                                transition-[background-color,border-color,color]
                                duration-150

                                group-hover:border-[#35404E]
                                group-hover:bg-[#171E28]

                                ${iconColor ? iconColor : 'text-[#A6AFBB]!'}
                            `}
                        >
                            <Icon size={16} strokeWidth={1.7} />
                        </span>
                    )}
                </div>

                {/* =========================================================
                    VALUE
                ========================================================= */}

                <p
                    className="
                        mt-4

                        font-sans!

                        text-[27px]
                        font-semibold!
                        leading-none
                        tracking-[-0.035em]

                        text-[#EEF1F5]!

                        tabular-nums

                        sm:text-[30px]
                    "
                >
                    {value}
                </p>

                {/* =========================================================
                    FOOTER
                ========================================================= */}

                {(subtext || (trend !== null && trend !== undefined)) && (
                    <div
                        className="
                            mt-auto

                            flex
                            min-w-0
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-2

                            pt-4
                        "
                    >
                        <Trend value={trend} label={trendLabel} />

                        {subtext && (
                            <span
                                className="
                                    min-w-0
                                    truncate

                                    text-[10.5px]

                                    text-[#697586]!
                                "
                            >
                                {subtext}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default StatCard;
