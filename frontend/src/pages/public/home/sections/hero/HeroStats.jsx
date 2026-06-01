import React from 'react';
import { TbCheck } from 'react-icons/tb';

const HeroTrustLine = () => {
    return (
        <div className="mt-6 flex flex-col gap-2 text-text-secondary">
            <div className="flex items-center gap-2">
                <TbCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified requests only</span>
            </div>

            <div className="flex items-center gap-2">
                <TbCheck className="h-4 w-4 text-emerald-500" />
                <span>Transparent delivery tracking</span>
            </div>

            <div className="flex items-center gap-2">
                <TbCheck className="h-4 w-4 text-emerald-500" />
                <span>Community-driven support</span>
            </div>
        </div>
    );
};

export default HeroTrustLine;