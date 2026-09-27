import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
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
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="min-w-0"
            >
                <section className="overflow-hidden rounded-2xl bg-surface">
                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    <div
                        className="
                            relative
                            h-[20rem]
                            overflow-hidden
                            sm:h-[24rem]
                            md:h-[26rem]
                            lg:h-[25rem]
                            xl:h-[31rem]
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

                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/80
                                via-black/25
                                to-black/5
                            "
                        />

                        <div
                            className="
                                absolute
                                left-5
                                top-5
                                flex
                                items-center
                                gap-2
                                sm:left-6
                                sm:top-6
                                lg:left-6
                                lg:top-6
                                xl:left-7
                                xl:top-7
                            "
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    font-medium
                                    leading-[1.8]
                                    text-white/85
                                "
                            >
                                সহায়তার একটি ক্ষেত্র
                            </span>
                        </div>

                        <div
                            className="
                                absolute
                                inset-x-0
                                bottom-0
                                p-5
                                sm:p-6
                                lg:p-6
                                xl:p-8
                            "
                        >
                            <div className="max-w-2xl">
                                <h2
                                    className="
                                        font-bengali!
                                        text-[1.65rem]!
                                        font-medium!
                                        leading-[1.45]!
                                        tracking-normal
                                        text-white!
                                        sm:text-[1.9rem]!
                                        md:text-[2.1rem]!
                                        lg:text-[2rem]!
                                        xl:text-[2.65rem]!
                                    "
                                >
                                    {current.name}
                                </h2>

                                {current.description && (
                                    <p
                                        className="
                                            mt-2.5
                                            max-w-xl
                                            font-bengali
                                            text-[12px]
                                            font-normal
                                            leading-[1.95]
                                            text-white/78
                                            sm:text-[13px]
                                            lg:text-[13px]
                                            xl:text-[15px]
                                        "
                                    >
                                        {current.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        META
                    ================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            divide-y
                            divide-border
                            sm:grid-cols-2
                            sm:divide-x
                            sm:divide-y-0
                        "
                    >
                        <div className="px-5 py-4.5 sm:px-6 sm:py-5 lg:px-6 xl:px-7">
                            <div className="flex items-center gap-2">
                                <MapPin
                                    size={15}
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
                                    কোথায় প্রয়োজন
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1
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

                        <div className="px-5 py-4.5 sm:px-6 sm:py-5 lg:px-6 xl:px-7">
                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    font-medium
                                    leading-[1.8]
                                    text-text-secondary
                                "
                            >
                                বর্তমানে সক্রিয়
                            </span>

                            <p
                                className="
                                    mt-1
                                    font-bengali
                                    text-sm
                                    font-medium
                                    leading-[1.8]
                                    text-text-primary
                                "
                            >
                                {activeCampaigns.length}টি উদ্যোগ
                            </p>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="mt-10 sm:mt-12 lg:mt-12 xl:mt-16">
                    {current.about && (
                        <section
                            className="
                                max-w-3xl
                                border-l-2
                                border-primary/15
                                pl-4
                                sm:pl-5
                                lg:pl-5
                                xl:pl-6
                            "
                        >
                            <p
                                className="
                                    font-bengali
                                    text-[14px]
                                    font-medium
                                    leading-[1.9]
                                    text-primary
                                    sm:text-[15px]
                                "
                            >
                                কেন এই সহায়তা গুরুত্বপূর্ণ
                            </p>

                            <p
                                className="
                                    mt-3
                                    font-bengali
                                    text-[15px]
                                    font-normal
                                    leading-[2.05]
                                    text-text-body
                                    sm:text-[16px]
                                    sm:leading-[2.1]
                                    xl:text-[17px]
                                "
                            >
                                {current.about}
                            </p>
                        </section>
                    )}

                    {supportTypes.length > 0 && (
                        <section className="mt-12 sm:mt-14 lg:mt-14 xl:mt-18">
                            <div className="max-w-3xl">
                                <p
                                    className="
                                        font-bengali
                                        text-[14px]
                                        font-semibold
                                        leading-[1.8]
                                        text-text-primary
                                        sm:text-[15px]
                                    "
                                >
                                    কীভাবে পাশে থাকবেন
                                </p>

                                <p
                                    className="
                                        mt-1.5
                                        max-w-xl
                                        font-bengali
                                        text-[12px]
                                        leading-[1.9]
                                        text-text-secondary
                                        sm:text-[13px]
                                        sm:leading-[2]
                                    "
                                >
                                    আপনার সামর্থ্য ও সময় অনুযায়ী সহায়তার
                                    বিভিন্ন পথ রয়েছে।
                                </p>

                               <div
    className="
        max-w-3xl
        pt-6
    "
>
    <div
        className="
            flex
            flex-wrap
            items-baseline
            gap-x-2
            gap-y-1
        "
    >
        {supportTypes.map((type, index) => (
            <React.Fragment key={`${type}-${index}`}>
                <span
                    className="
                        font-bengali
                        text-[15px]
                        font-medium
                        leading-[2]
                        tracking-[-0.01em]
                        text-text-primary
                        sm:text-[16px]
                    "
                >
                    {type}
                </span>

                {index < supportTypes.length - 1 && (
                    <span
                        aria-hidden="true"
                        className="
                            mx-1
                            inline-block
                            h-1
                            w-1
                            shrink-0
                            rounded-full
                            bg-accent
                            align-middle
                        "
                    />
                )}
            </React.Fragment>
        ))}
    </div>
</div>
                            </div>
                        </section>
                    )}

                    <div className="mt-9 sm:mt-10 lg:mt-10 xl:mt-12">
                        <Link
                            to={`/campaigns/category/${current.slug}`}
                            className="
                                group
                                inline-flex
                                items-center
                                gap-3
                                border-b
                                border-primary/30
                                pb-2
                                font-bengali
                                text-[13px]
                                font-medium
                                leading-[1.8]
                                text-primary
                                transition-colors
                                duration-200
                                hover:border-primary
                                hover:text-primary-hover
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary/25
                                focus-visible:ring-offset-4
                                sm:text-[14px]
                            "
                        >
                            <span>এই ক্ষেত্রের উদ্যোগগুলো দেখুন</span>

                            <ArrowRight
                                size={16}
                                strokeWidth={1.9}
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-1
                                "
                            />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LeftPanel;
