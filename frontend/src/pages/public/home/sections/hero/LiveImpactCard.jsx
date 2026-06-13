import React from 'react';
import { TbHeartPlus } from 'react-icons/tb';
import Badge from '@/components/Badge';

const LiveImpactCard = () => {
    return (
        <div
            className="
                flex items-center justify-between
                w-full
                p-3
                border border-border
                bg-white/50
                backdrop-blur
                rounded-2xl
                shadow-lg
            "
        >
            <div className="flex flex-col min-w-0">
                <Badge
                    className="
                        border-none
                        bg-transparent
                        pl-0
                        text-[10px]
                        lg:text-[9px]
                        xl:text-[10px]
                    "
                    variant="primary"
                    pulse
                    dot
                >
                    Help Delivered
                </Badge>

                <h3
                    className="
                        text-lg
                        md:text-xl
                        lg:text-base
                        xl:text-xl
                        font-semibold
                        leading-tight
                        py-1
                    "
                >
                    8,764+
                </h3>

                <p
                    className="
                        text-text-secondary
                        text-[9px]
                        md:text-[10px]
                        lg:text-[8px]
                        xl:text-xs
                        tracking-wider
                        uppercase
                    "
                >
                    Live Impacted
                </p>
            </div>

            <div
                className="
                    flex
                    items-center
                    justify-center
                    shrink-0

                    w-8 h-8
                    md:w-10 md:h-10
                    lg:w-8 lg:h-8
                    xl:w-12 xl:h-12

                    rounded-full
                    bg-primary/10
                    text-primary
                "
            >
                <TbHeartPlus
                    className="
                        text-base
                        lg:text-sm
                        xl:text-xl
                    "
                />
            </div>
        </div>
    );
};

export default LiveImpactCard;
