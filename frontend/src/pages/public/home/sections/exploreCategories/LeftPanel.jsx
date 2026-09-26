import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';

import { Link } from 'react-router-dom';

const LeftPanel = ({ current, campaigns = [] }) => {
    if (!current) {
        return null;
    }

    const activeCampaigns = campaigns.filter(
        (campaign) =>
            campaign?.status === 'active' &&
            campaign?.category?.name === current.name,
    );

    const supportTypes = Array.isArray(current.support_types)
        ? current.support_types
        : [];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="min-w-0"
            >
                {/* =====================================================
                    HERO
                ====================================================== */}
                <section className="overflow-hidden rounded-2xl bg-background-alt">
                    {/* =================================================
                        HERO META
                    ================================================== */}
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            border-b
                            border-border
                            p-5
                            pb-4

                            sm:flex-row
                            sm:flex-wrap
                            sm:items-start
                            sm:justify-between
                            sm:gap-x-8
                            sm:gap-y-4
                            sm:p-6
                            sm:pb-4

                            lg:gap-x-8
                            lg:p-6
                            lg:pb-4

                            xl:gap-x-12
                            xl:p-7
                            xl:pb-5
                        "
                    >
                        {/* LOCATION */}
                        <div className="min-w-0 sm:min-w-[170px]">
                            <div className="flex items-center gap-1.5">
                                <MapPin
                                    size={14}
                                    strokeWidth={1.8}
                                    className="shrink-0 text-primary"
                                />

                                <span
                                    className="
                                        font-bengali
                                        text-[11px]
                                        font-medium
                                        leading-[1.8]
                                        text-text-secondary
                                    "
                                >
                                    সহায়তার এলাকা
                                </span>
                            </div>

                            <p
                                className="
                                    mt-0.5
                                    font-bengali
                                    text-sm
                                    font-medium
                                    leading-[1.8]
                                    text-text-primary
                                "
                            >
                                {current.location ||
                                    'বিভিন্ন প্রয়োজনীয় এলাকায়'}
                            </p>
                        </div>

                        {/* ACTIVE CAMPAIGNS */}
                        <div className="sm:text-right">
                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    font-medium
                                    leading-[1.8]
                                    text-text-secondary
                                "
                            >
                                চলমান উদ্যোগ
                            </span>

                            <p
                                className="
                                    mt-0.5
                                    font-bengali
                                    text-sm
                                    font-medium
                                    leading-[1.8]
                                    text-text-primary
                                "
                            >
                                {activeCampaigns.length}টি সক্রিয় উদ্যোগ
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        HERO IMAGE
                    ================================================== */}
                    <div
                        className="
                            relative
                            h-[20rem]

                            sm:h-[24rem]

                            lg:h-[26rem]

                            xl:h-[29rem]
                        "
                    >
                        <img
                            src={current.image}
                            alt={current.name}
                            className="
                                absolute
                                inset-0
                                h-full
                                w-full
                                object-cover
                            "
                        />

                        {/* Neutral photographic overlay */}
                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/75
                                to-black/25
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-br
                                from-white/[0.06]
                                via-transparent
                                to-transparent
                            "
                        />

                        {/* =================================================
                            OVERLAY CONTENT
                        ================================================== */}
                        <div
                            className="
                                absolute
                                inset-0
                                flex
                                flex-col
                                justify-between
                                p-5

                                sm:p-6

                                lg:p-7

                                xl:p-8
                            "
                        >
                            {/* TOP — SUPPORT AREA */}
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                                <span
                                    className="
                                        font-bengali
                                        text-[12px]
                                        font-medium
                                        leading-[1.8]
                                        text-white/80
                                    "
                                >
                                    সহায়তার ক্ষেত্র
                                </span>
                            </div>

                            {/* BOTTOM — TITLE + DESCRIPTION */}
                            <div
                                className="
                                    max-w-xl

                                    lg:max-w-2xl

                                    xl:max-w-3xl
                                "
                            >
                                <h2
                                    className="
                                        font-bengali!
                                        text-[1.7rem]
                                        font-medium!
                                        leading-[1.45]!
                                        tracking-normal
                                        text-white!

                                        sm:text-[2rem]

                                        lg:text-[2.15rem]

                                        xl:text-[2.4rem]
                                    "
                                >
                                    {current.name}
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        max-w-lg
                                        font-bengali
                                        text-[13px]
                                        font-normal
                                        leading-[1.9]
                                        text-white/75

                                        sm:max-w-xl
                                        sm:text-[14px]

                                        lg:max-w-2xl
                                        lg:text-[14px]

                                        xl:text-[15px]
                                    "
                                >
                                    {current.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
    CONTENT
====================================================== */}
<div
    className="
        mt-10
        sm:mt-12
        lg:mt-14
        xl:mt-16
    "
>
    {/* =================================================
        ABOUT
    ================================================== */}
    {current.about && (
        <section
            className="
                max-w-3xl
                lg:max-w-2xl
                xl:max-w-3xl
            "
        >
            <div className="flex items-center gap-3">
                <span
                    className="
                        h-1
                        w-8
                        shrink-0
                        rounded-full
                        bg-accent!
                    "
                />

                <h3
                    className="
                        font-bengali!
                        text-[15px]!
                        font-semibold!
                        leading-[1.8]!
                        text-primary!
                        sm:text-base!
                    "
                >
                    কেন এটি গুরুত্বপূর্ণ
                </h3>
            </div>

            <p
                className="
                    mt-5
                    font-bengali!
                    text-[16px]!
                    font-normal!
                    leading-[2.05]!
                    text-text-body!
                    sm:text-[17px]!
                    sm:leading-[2.1]!
                    lg:text-[16px]!
                    xl:text-[17px]!
                "
            >
                {current.about}
            </p>
        </section>
    )}

    {/* =================================================
        SUPPORT
    ================================================== */}
    {supportTypes.length > 0 && (
        <section
            className="
                mt-14
                sm:mt-16
                lg:mt-18
                xl:mt-20
            "
        >
            <div
                className="
                    max-w-3xl
                    lg:max-w-2xl
                    xl:max-w-3xl
                "
            >
                <div className="flex items-center gap-3">
                    <span
                        className="
                            h-1
                            w-8
                            shrink-0
                            rounded-full
                            bg-primary!
                        "
                    />

                    <h3
                        className="
                            font-bengali!
                            text-[15px]!
                            font-semibold!
                            leading-[1.8]!
                            text-primary!
                            sm:text-base!
                        "
                    >
                        পাশে থাকার সুযোগ
                    </h3>
                </div>

                <p
                    className="
                        mt-5
                        max-w-2xl
                        font-bengali!
                        text-[14px]!
                        font-normal!
                        leading-[2]!
                        text-text-body!
                        sm:text-[15px]!
                        sm:leading-[2.05]!
                    "
                >
                    আপনার সামর্থ্য ও সময় অনুযায়ী এই উদ্যোগে
                    বিভিন্নভাবে অবদান রাখা সম্ভব।
                </p>

                <div
                    className="
                        mt-6
                        grid
                        gap-x-10
                        gap-y-3
                        sm:grid-cols-2
                        lg:grid-cols-1
                        xl:grid-cols-2
                        xl:gap-y-4
                    "
                >
                    {supportTypes.map((type, index) => (
                        <div
                            key={`${type}-${index}`}
                            className="
                                flex
                                items-start
                                gap-3
                                py-1
                            "
                        >
                            <span
                                className="
                                    mt-[0.7rem]
                                    h-1.5
                                    w-1.5
                                    shrink-0
                                    rounded-full
                                    bg-accent!
                                "
                            />

                            <p
                                className="
                                    font-bengali!
                                    text-[14px]!
                                    font-medium!
                                    leading-[1.9]!
                                    text-text-primary!
                                    sm:text-[15px]!
                                "
                            >
                                {type}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )}

    {/* =================================================
        CTA
    ================================================== */}
    <div
        className="
            mt-10
            sm:mt-11
            lg:mt-12
            xl:mt-14
        "
    >
        <Link
            to={`/campaigns/category/${current.slug}`}
            className="
                group
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-3
                rounded-lg
                bg-primary!
                px-5
                py-2.5
                font-bengali!
                text-[14px]!
                font-medium!
                leading-[1.8]!
                text-white!
                shadow-sm
                transition-all
                duration-200
                hover:bg-primary-hover!
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/30
                focus-visible:ring-offset-2
                sm:px-5
            "
        >
            <span>এই বিভাগের উদ্যোগগুলো দেখুন</span>

            <span
                className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    transition-colors
                    duration-200
                    group-hover:bg-white/15
                "
            >
                <ArrowRight
                    size={15}
                    strokeWidth={1.9}
                    className="
                        transition-transform
                        duration-200
                        group-hover:translate-x-0.5
                    "
                />
            </span>
        </Link>
    </div>
</div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LeftPanel;
