import React from 'react';

import { Link } from 'react-router-dom';

import {
    TbClock,
    TbHeartHandshake,
    TbLockCheck,
    TbShare,
    TbShieldCheckFilled,
    TbUsers,
} from 'react-icons/tb';

import Button from '@/components/Button';

const toBengaliNumber = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

const formatAmount = (amount) => Number(amount || 0).toLocaleString('en-BD');

const DonationSidebar = ({ campaign, organizer }) => {
    const percent = Math.min(100, Math.max(0, Number(campaign?.progress || 0)));

    const raised = campaign?.raised || 0;
    const target = campaign?.targetAmount || 0;
    const supporters = campaign?.supporters || 0;
    const daysLeft = campaign?.daysLeft || 0;

    return (
        <aside className="lg:sticky lg:top-28">
            {/* =====================================================
                FUNDING HEADER
            ====================================================== */}

            <div className="border-t-2 border-primary">
                <div className="flex items-center justify-between border-b border-border py-3.5 sm:py-4 lg:py-4.5">
                    <span
                        className="
                            font-bengali
                            text-[12px]
                            font-semibold
                            text-primary
                            sm:text-[13px]
                            lg:text-[14px]
                        "
                    >
                        সহায়তার অগ্রগতি
                    </span>

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            text-text-muted
                            sm:text-[12px]
                            lg:text-[13px]
                        "
                    >
                        {toBengaliNumber(percent)}%
                    </span>
                </div>

                {/* =================================================
                    AMOUNT
                ================================================== */}

                <div className="py-7 sm:py-8 lg:py-9">
                    <span
                        className="
                            block
                            font-bengali
                            text-[12px]
                            font-medium
                            text-text-muted
                            sm:text-[13px]
                            lg:text-[14px]
                        "
                    >
                        সংগ্রহ হয়েছে
                    </span>

                    <div
                        className="
                            mt-2.5
                            text-[38px]
                            font-semibold
                            leading-none
                            tracking-[-0.045em]
                            text-text-primary
                            sm:text-[42px]
                            lg:mt-3
                            lg:text-[48px]
                            xl:text-[52px]
                        "
                    >
                        ৳{formatAmount(raised)}
                    </div>

                    <p
                        className="
                            mt-3
                            font-bengali
                            text-[12px]
                            leading-[1.7]
                            text-text-secondary
                            sm:text-[13px]
                            lg:mt-4
                            lg:text-[14px]
                        "
                    >
                        লক্ষ্যমাত্রা{' '}
                        <span className="font-semibold text-text-primary">
                            ৳{formatAmount(target)}
                        </span>
                    </p>

                    {/* PROGRESS */}

                    <div className="mt-6 sm:mt-7 lg:mt-8">
                        <div className="h-[3px] overflow-hidden bg-border sm:h-[4px]">
                            <div
                                className="
                                    h-full
                                    bg-primary
                                    transition-all
                                    duration-700
                                "
                                style={{
                                    width: `${percent}%`,
                                }}
                            />
                        </div>

                        <div className="mt-2.5 flex items-center justify-between sm:mt-3">
                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    text-text-muted
                                    sm:text-[12px]
                                    lg:text-[13px]
                                "
                            >
                                সংগ্রহ
                            </span>

                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    text-text-muted
                                    sm:text-[12px]
                                    lg:text-[13px]
                                "
                            >
                                লক্ষ্য
                            </span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    STATS
                ================================================== */}

                <div className="grid grid-cols-2 border-y border-border">
                    <div className="border-r border-border py-4.5 pr-4 sm:py-5 sm:pr-5 lg:py-6">
                        <TbUsers
                            size={18}
                            className="text-primary sm:size-[19px] lg:size-[20px]"
                        />

                        <strong
                            className="
                                mt-2
                                block
                                text-[20px]
                                font-semibold
                                leading-none
                                text-text-primary
                                sm:text-[22px]
                                lg:mt-2.5
                                lg:text-[24px]
                            "
                        >
                            {toBengaliNumber(supporters)}
                        </strong>

                        <span
                            className="
                                mt-1.5
                                block
                                font-bengali
                                text-[11px]
                                text-text-muted
                                sm:text-[12px]
                                lg:text-[13px]
                            "
                        >
                            সহায়তাকারী
                        </span>
                    </div>

                    <div className="py-4.5 pl-4 sm:py-5 sm:pl-5 lg:py-6">
                        <TbClock
                            size={18}
                            className="text-accent sm:size-[19px] lg:size-[20px]"
                        />

                        <strong
                            className="
                                mt-2
                                block
                                text-[20px]
                                font-semibold
                                leading-none
                                text-text-primary
                                sm:text-[22px]
                                lg:mt-2.5
                                lg:text-[24px]
                            "
                        >
                            {toBengaliNumber(daysLeft)}
                        </strong>

                        <span
                            className="
                                mt-1.5
                                block
                                font-bengali
                                text-[11px]
                                text-text-muted
                                sm:text-[12px]
                                lg:text-[13px]
                            "
                        >
                            দিন বাকি
                        </span>
                    </div>
                </div>

                {/* =================================================
                    DONATION CTA
                ================================================== */}

                <div className="py-6 sm:py-7 lg:py-8">
                    <p
                        className="
                            font-bengali
                            text-[12px]
                            leading-[1.9]
                            text-text-secondary
                            sm:text-[13px]
                            sm:leading-[1.95]
                            lg:text-[14px]
                            lg:leading-[2]
                        "
                    >
                        আপনার সহায়তা এই উদ্যোগের প্রয়োজনীয় কাজগুলো এগিয়ে
                        নিতে সাহায্য করবে।
                    </p>

                    <Link to={`/donate/${campaign.id}`} className="block">
                        <Button
                            variant="primary"
                            size="lg"
                            className="
                                mt-5
                                h-13
                                w-full
                                font-bengali
                                text-[13px]
                                font-semibold
                                sm:text-[14px]
                                lg:mt-6
                                lg:text-[15px]
                            "
                        >
                            এখনই সহায়তা করুন
                        </Button>
                    </Link>

                    <div className="mt-3.5 flex items-center justify-center gap-2 sm:mt-4">
                        <TbLockCheck
                            size={15}
                            className="shrink-0 text-primary sm:size-[16px]"
                        />

                        <span
                            className="
                                font-bengali
                                text-[10px]
                                text-text-muted
                                sm:text-[11px]
                                lg:text-[12px]
                            "
                        >
                            নিরাপদ ও সুরক্ষিত পেমেন্ট
                        </span>
                    </div>

                    <button
                        type="button"
                        className="
                            mx-auto
                            mt-5
                            flex
                            items-center
                            gap-2
                            font-bengali
                            text-[11px]
                            font-medium
                            text-text-secondary
                            transition-colors
                            hover:text-primary
                            sm:text-[12px]
                            lg:mt-6
                            lg:text-[13px]
                        "
                    >
                        <TbShare size={15} className="sm:size-[16px]" />
                        উদ্যোগটি শেয়ার করুন
                    </button>
                </div>

                {/* =================================================
                    TRUST
                ================================================== */}

                <div className="border-t border-border py-6 sm:py-7 lg:py-8">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-7 bg-accent sm:w-8 lg:w-9" />

                        <h3
                            className="
                                font-bengali
                                text-[12px]
                                font-semibold
                                text-text-primary
                                sm:text-[13px]
                                lg:text-[14px]
                            "
                        >
                            স্বচ্ছতা ও নিরাপত্তা
                        </h3>
                    </div>

                    <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5 lg:mt-7">
                        <div className="flex items-start gap-3">
                            <TbShieldCheckFilled
                                size={18}
                                className="mt-0.5 shrink-0 text-primary sm:size-[19px] lg:size-[20px]"
                            />

                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    leading-[1.8]
                                    text-text-secondary
                                    sm:text-[12px]
                                    sm:leading-[1.85]
                                    lg:text-[13px]
                                    lg:leading-[1.9]
                                "
                            >
                                যাচাই করা মানবিক উদ্যোগ
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <TbLockCheck
                                size={18}
                                className="mt-0.5 shrink-0 text-primary sm:size-[19px] lg:size-[20px]"
                            />

                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    leading-[1.8]
                                    text-text-secondary
                                    sm:text-[12px]
                                    sm:leading-[1.85]
                                    lg:text-[13px]
                                    lg:leading-[1.9]
                                "
                            >
                                নিরাপদ ও এনক্রিপ্টেড পেমেন্ট
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <TbHeartHandshake
                                size={18}
                                className="mt-0.5 shrink-0 text-primary sm:size-[19px] lg:size-[20px]"
                            />

                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    leading-[1.8]
                                    text-text-secondary
                                    sm:text-[12px]
                                    sm:leading-[1.85]
                                    lg:text-[13px]
                                    lg:leading-[1.9]
                                "
                            >
                                সহায়তার অর্থ সংশ্লিষ্ট উদ্যোগে ব্যবহৃত হয়
                            </span>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    ORGANIZER
                ================================================== */}

                <div className="border-y border-border py-4.5 sm:py-5 lg:py-6">
                    <span
                        className="
                            block
                            font-bengali
                            text-[10px]
                            text-text-muted
                            sm:text-[11px]
                            lg:text-[12px]
                        "
                    >
                        উদ্যোগ পরিচালনায়
                    </span>

                    <div className="mt-1.5 flex items-center gap-2">
                        <span
                            className="
                                font-bengali
                                text-[12px]
                                font-semibold
                                text-text-primary
                                sm:text-[13px]
                                lg:text-[14px]
                            "
                        >
                            {organizer?.name || 'Stand For People'}
                        </span>

                        {organizer?.verified && (
                            <TbShieldCheckFilled
                                size={15}
                                className="text-primary sm:size-[16px] lg:size-[17px]"
                            />
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DonationSidebar;
