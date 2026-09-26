import React from 'react';

import { TbCheck } from 'react-icons/tb';

const HeroTrustLine = () => {
    return (
        <div
            className="
                mt-6
                hidden
                flex-col
                items-center
                gap-2.5
                text-text-secondary
                xl:flex
                xl:items-start
            "
        >
            <div className="flex items-center gap-2">
                <TbCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[13px]">যাচাই করা সহায়তার আবেদন</span>
            </div>

            <div className="flex items-center gap-2">
                <TbCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[13px]">
                    সহায়তার অগ্রগতি ও তথ্যের স্বচ্ছতা
                </span>
            </div>

            <div className="flex items-center gap-2">
                <TbCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[13px]">
                    স্বেচ্ছাসেবী, দাতা ও সংগঠনের সম্মিলিত উদ্যোগ
                </span>
            </div>
        </div>
    );
};

export default HeroTrustLine;
