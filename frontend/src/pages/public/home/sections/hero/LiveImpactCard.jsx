import React from 'react';
import { TbHeartPlus } from 'react-icons/tb';
import Badge from '@/components/Badge';

const LiveImpactCard = () => {
    return (
        <div
            className="
                hidden lg:flex
                w-56
                border border-border
                bg-surface
                p-4
                rounded-2xl
                justify-between
                lg:absolute right-105 top-35
            "
        >
            <div className="flex flex-col">
                <Badge
                    className="border-none bg-transparent pl-0"
                    variant="primary"
                    pulse
                    dot
                >
                    Help Delivered
                </Badge>

                <p className="text-text-secondary font-medium pb-1 text-sm"></p>

                <h3 className="text-xl font-semibold leading-8 py-1">8,764+</h3>

                <p className="text-text-secondary text-xs tracking-wider uppercase">
                    Live Impacted
                </p>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <TbHeartPlus size={24} />
            </div>
        </div>
    );
};

export default LiveImpactCard;
