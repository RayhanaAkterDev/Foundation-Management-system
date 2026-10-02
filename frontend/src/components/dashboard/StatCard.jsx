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
              bg: 'bg-[#22362D]',
              border: 'border-[#315140]',
          }
        : negative
          ? {
                text: 'text-[#D99A9F]!',
                bg: 'bg-[#38272C]',
                border: 'border-[#54353C]',
            }
          : {
                text: 'text-[#9299A6]!',
                bg: 'bg-[#2C303A]',
                border: 'border-[#404754]',
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
                    font-semibold

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

                        text-[#6F7785]!
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
                border-[#343944]

                bg-[#22252D]

                transition-colors
                duration-150

                hover:border-[#404754]
                hover:bg-[#242830]
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
                            font-semibold
                            uppercase
                            tracking-[0.11em]

                            text-[#9299A6]!
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
                                border-[#3A404B]

                                bg-[#2C303A]

                                ${iconColor ? iconColor : 'text-[#A8AFBB]!'}
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
                        font-semibold
                        leading-none
                        tracking-[-0.035em]

                        text-[#F1F2F4]!

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

                                    text-[#6F7785]!
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
