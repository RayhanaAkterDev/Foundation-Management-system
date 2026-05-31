import React from 'react';
import { TbHeartPlus } from 'react-icons/tb';

const LiveImpactCard = () => {
    return (
        <div className="w-56 border border-border bg-surface p-4 rounded-2xl flex justify-between absolute right-15 bottom-42">
            <div className="flex flex-col">
                <p className="text-text-secondary font-medium pb-1 text-sm">
                    Help Delivered
                </p>
                <h3 className="text-xl font-semibold leading-8 py-1">
                    8,764+
                </h3>
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
