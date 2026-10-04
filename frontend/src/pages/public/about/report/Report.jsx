import React from 'react';

import { Link } from 'react-router-dom';
import {
    TbArrowRight,
    TbArrowUpRight,
    TbFileText,
    TbHeartHandshake,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

/* =========================================================
   DATA
========================================================= */

const reportPrinciples = [
    {
        number: '01',
        title: 'কাজের নথি',
        description:
            'কোনো কার্যক্রম বা উদ্যোগ প্রকাশযোগ্য পর্যায়ে এলে তার প্রয়োজনীয় তথ্য সংরক্ষণ করা হবে।',
        icon: TbFileText,
    },
    {
        number: '02',
        title: 'মানুষের অংশগ্রহণ',
        description:
            'স্বেচ্ছাসেবক, সংগঠন এবং সহায়তাপ্রাপ্ত মানুষের সঙ্গে যুক্ত কার্যক্রমের প্রাসঙ্গিক তথ্য নথিভুক্ত করা হবে।',
        icon: TbUsers,
    },
    {
        number: '03',
        title: 'জবাবদিহিতা',
        description:
            'প্রকাশযোগ্য তথ্য এমনভাবে উপস্থাপন করা হবে, যাতে প্ল্যাটফর্মের কাজ সম্পর্কে একটি পরিষ্কার ধারণা পাওয়া যায়।',
        icon: TbShieldCheck,
    },
];

const reportAreas = [
    {
        number: '01',
        title: 'কার্যক্রম ও অগ্রগতি',
        description:
            'কোনো উদ্যোগ কোথায় দাঁড়িয়েছে, কী কাজ হয়েছে এবং প্রকাশযোগ্য পর্যায়ে কী তথ্য পাওয়া যায়—তার নথি।',
    },
    {
        number: '02',
        title: 'সহায়তা ও অংশগ্রহণ',
        description:
            'মানুষ, স্বেচ্ছাসেবক ও সংগঠন কীভাবে একটি উদ্যোগের সঙ্গে যুক্ত হয়েছে—তার প্রাসঙ্গিক তথ্য।',
    },
    {
        number: '03',
        title: 'গুরুত্বপূর্ণ আপডেট',
        description:
            'Stand For People-এর কার্যক্রম বা জনসেবামূলক ব্যবস্থায় গুরুত্বপূর্ণ পরিবর্তন ও প্রকাশযোগ্য আপডেট।',
    },
    {
        number: '04',
        title: 'প্রকাশযোগ্য নথি',
        description:
            'যেসব ডকুমেন্ট বা তথ্য জনসাধারণের জন্য প্রকাশ করা উপযুক্ত, সেগুলোর সংরক্ষিত সংস্করণ।',
    },
];

const pageWidth =
    'mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20';

const Report = () => {
    return (
        <main
            lang="bn"
            className="overflow-hidden bg-background font-bengali text-text-primary"
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="relative mt-20 overflow-hidden bg-[#f4f1e9]">
                <div className={pageWidth}>
                    <div
                        className="
                            relative
                            grid
                            gap-14
                            py-16

                            sm:py-20

                            lg:min-h-[650px]
                            lg:grid-cols-[minmax(0,1fr)_390px]
                            lg:items-center
                            lg:gap-20
                            lg:py-24

                            xl:grid-cols-[minmax(0,1fr)_430px]
                        "
                    >
                        {/* LEFT */}

                        <div className="relative z-10">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.17em]
                                    text-primary

                                    sm:text-[11px]
                                "
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e58a52]" />

                                <span>REPORTS &amp; TRANSPARENCY</span>
                            </div>

                            <h1
                                className="
                                    mt-8
                                    max-w-[850px]
                                    text-[2.7rem]
                                    font-medium!
                                    leading-[1.18]

                                    sm:text-[3.5rem]

                                    lg:text-[4.1rem]

                                    xl:text-[4.55rem]
                                "
                            >
                                কাজের শুধু গল্প নয়,
                                <span className="block text-primary">
                                    তার নথিও থাকে।
                                </span>
                            </h1>

                            <div
                                className="
                                    mt-9
                                    grid
                                    max-w-[780px]
                                    gap-6
                                    border-t
                                    border-black/10
                                    pt-7

                                    sm:grid-cols-[1fr_auto]
                                    sm:items-start
                                    sm:gap-10
                                "
                            >
                                <p
                                    className="
                                        max-w-[590px]
                                        text-[15px]
                                        leading-[1.95]
                                        text-text-secondary

                                        sm:text-[17px]
                                    "
                                >
                                    Stand For People-এর কাজ, মানুষের অংশগ্রহণ
                                    এবং প্রকাশযোগ্য কার্যক্রম সম্পর্কে
                                    গুরুত্বপূর্ণ তথ্য সময়ের সঙ্গে এখানে সংরক্ষিত
                                    হবে।
                                </p>

                                <span
                                    className="
                                        whitespace-nowrap
                                        font-nav
                                        text-[9px]
                                        tracking-[0.15em]
                                        text-text-muted
                                    "
                                >
                                    PUBLIC RECORD / 2026
                                </span>
                            </div>
                        </div>

                        {/* RIGHT — DOCUMENT COMPOSITION */}

                        <div
                            className="
                                relative
                                mx-auto
                                h-[340px]
                                w-full
                                max-w-[350px]

                                sm:h-[390px]

                                lg:mx-0
                                lg:h-[430px]
                                lg:max-w-none
                            "
                        >
                            {/* rear sheet */}

                            <div
                                className="
                                    absolute
                                    right-[4%]
                                    top-[5%]
                                    h-[82%]
                                    w-[72%]
                                    rotate-[5deg]
                                    border
                                    border-primary/10
                                    bg-[#e8ebe4]
                                "
                            />

                            {/* main document */}

                            <div
                                className="
                                    absolute
                                    left-[4%]
                                    top-[2%]
                                    h-[88%]
                                    w-[74%]
                                    -rotate-[3deg]
                                    border
                                    border-black/10
                                    bg-[#fffefb]
                                    p-6
                                    shadow-[0_24px_60px_rgba(15,50,46,0.08)]

                                    sm:p-7
                                "
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span
                                            className="
                                                block
                                                font-nav
                                                text-[8px]
                                                tracking-[0.16em]
                                                text-text-muted
                                            "
                                        >
                                            STAND FOR PEOPLE
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                font-nav
                                                text-[7px]
                                                tracking-[0.12em]
                                                text-text-muted/70
                                            "
                                        >
                                            PUBLIC RECORD
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            font-display
                                            text-[1.1rem]
                                            text-primary/40
                                        "
                                    >
                                        00
                                    </span>
                                </div>

                                <div className="mt-8 h-1.5 w-12 bg-[#e58a52]" />

                                <div className="mt-9">
                                    <span className="block h-2 w-[82%] bg-primary/12" />
                                    <span className="mt-3 block h-2 w-full bg-primary/8" />
                                    <span className="mt-3 block h-2 w-[72%] bg-primary/8" />
                                </div>

                                <div
                                    className="
                                        absolute
                                        bottom-6
                                        left-6
                                        right-6
                                        border-t
                                        border-black/[0.08]
                                        pt-5
                                    "
                                >
                                    <div className="flex items-end justify-between">
                                        <TbFileText
                                            size={34}
                                            strokeWidth={1}
                                            className="text-primary/55"
                                        />

                                        <span
                                            className="
                                                font-nav
                                                text-[7px]
                                                tracking-[0.14em]
                                                text-text-muted
                                            "
                                        >
                                            ARCHIVE / 2026
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* small reference mark */}

                            <div
                                className="
                                    absolute
                                    bottom-[2%]
                                    right-0
                                    w-[125px]
                                    border-t
                                    border-primary/20
                                    pt-4
                                "
                            >
                                <span
                                    className="
                                        font-nav
                                        text-[8px]
                                        tracking-[0.14em]
                                        text-primary/60
                                    "
                                >
                                    RECORD
                                </span>

                                <p
                                    className="
                                        mt-2
                                        text-[12px]
                                        leading-[1.6]
                                        text-text-secondary
                                    "
                                >
                                    কাজের তথ্য,
                                    <br />
                                    সময়ের সঙ্গে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-1.5 w-24 bg-[#e58a52] sm:w-32" />
            </section>

            {/* =====================================================
                WHY REPORT
            ====================================================== */}

            <section className="bg-background">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        {/* small label */}

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                text-[10px]
                                font-semibold
                                tracking-[0.16em]
                                text-text-muted

                                sm:text-[11px]
                            "
                        >
                            <span>০১</span>
                            <span className="h-px w-8 bg-border" />
                            <span>কেন প্রতিবেদন</span>
                        </div>

                        {/* statement */}

                        <div
                            className="
                                mt-12
                                grid
                                gap-10

                                lg:grid-cols-[0.85fr_1.15fr]
                                lg:gap-20

                                xl:gap-28
                            "
                        >
                            <h2
                                className="
                                    max-w-[620px]
                                    text-[2.1rem]
                                    font-medium!
                                    leading-[1.38]

                                    sm:text-[2.7rem]

                                    lg:text-[3.1rem]
                                "
                            >
                                একটি মানবিক প্ল্যাটফর্মের কাজ শুধু
                                <span className="text-primary"> করা নয়—</span>
                                <span className="block">বোঝানোও।</span>
                            </h2>

                            <div
                                className="
                                    max-w-[650px]
                                    border-l
                                    border-border
                                    pl-6

                                    sm:pl-8

                                    lg:mt-3
                                "
                            >
                                <p
                                    className="
                                        text-[15px]
                                        leading-[1.95]
                                        text-text-secondary

                                        sm:text-[17px]
                                    "
                                >
                                    Stand For People এমন একটি জায়গা তৈরি করতে
                                    চায়, যেখানে মানুষের প্রয়োজন, সহায়তার উদ্যোগ
                                    এবং অংশগ্রহণ একে অপরের সঙ্গে যুক্ত থাকে। সেই
                                    কাজের একটি গুরুত্বপূর্ণ অংশ হলো—যে তথ্য
                                    প্রকাশ করা যায়, তা পরিষ্কারভাবে নথিভুক্ত
                                    করা।
                                </p>

                                <p
                                    className="
                                        mt-6
                                        text-[15px]
                                        leading-[1.95]
                                        text-text-secondary

                                        sm:text-[17px]
                                    "
                                >
                                    তাই এই পেজটি শুধু একটি রিপোর্টের তালিকা নয়।
                                    এটি SP-এর প্রকাশযোগ্য কাজ ও তথ্যের জন্য একটি
                                    উন্মুক্ত রেকর্ড রাখার জায়গা।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PRINCIPLES
            ====================================================== */}

            <section className="border-y border-black/[0.07] bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-28">
                        {/* heading */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-7
                                border-b
                                border-black/10
                                pb-10

                                md:flex-row
                                md:items-end
                                md:justify-between

                                lg:pb-12
                            "
                        >
                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    <span>০২</span>
                                    <span className="h-px w-8 bg-border" />
                                    <span>আমাদের নীতি</span>
                                </div>

                                <h2
                                    className="
                                        mt-6
                                        max-w-[610px]
                                        text-[2rem]
                                        font-medium!
                                        leading-[1.4]

                                        sm:text-[2.5rem]

                                        lg:text-[2.85rem]
                                    "
                                >
                                    তথ্য রাখা হবে
                                    <span className="text-primary">
                                        {' '}
                                        কাজকে পরিষ্কার রাখার জন্য।
                                    </span>
                                </h2>
                            </div>

                            <p
                                className="
                                    max-w-[360px]
                                    text-[14px]
                                    leading-[1.85]
                                    text-text-secondary

                                    sm:text-[15px]
                                "
                            >
                                প্রকাশযোগ্য তথ্য কীভাবে সংরক্ষণ ও উপস্থাপন করা
                                হবে—তার ভিত্তি এই তিনটি বিষয়।
                            </p>
                        </div>

                        {/* principles */}

                        <div className="grid lg:grid-cols-3">
                            {reportPrinciples.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={item.number}
                                        className={`
                                            relative
                                            py-10

                                            lg:min-h-[320px]
                                            lg:px-9
                                            lg:py-11

                                            ${
                                                index > 0
                                                    ? 'border-t border-black/10 lg:border-l lg:border-t-0'
                                                    : ''
                                            }

                                            ${
                                                index === 0
                                                    ? 'lg:pl-0 lg:pr-10'
                                                    : ''
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between">
                                            <Icon
                                                size={28}
                                                strokeWidth={1.25}
                                                className="text-primary"
                                                aria-hidden="true"
                                            />

                                            <span
                                                className="
                                                    font-nav
                                                    text-[9px]
                                                    tracking-[0.15em]
                                                    text-text-muted
                                                "
                                            >
                                                {item.number}
                                            </span>
                                        </div>

                                        <div className="mt-14 lg:mt-20">
                                            <h3
                                                className="
                                                    text-[19px]
                                                    font-semibold
                                                "
                                            >
                                                {item.title}
                                            </h3>

                                            <p
                                                className="
                                                    mt-4
                                                    max-w-[310px]
                                                    text-[14px]
                                                    leading-[1.9]
                                                    text-text-secondary
                                                "
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                WHAT WILL BE DOCUMENTED
            ====================================================== */}

            <section className="bg-[#164f49] text-white!">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-12

                                lg:grid-cols-[0.8fr_1.2fr]
                                lg:gap-20

                                xl:gap-28
                            "
                        >
                            {/* statement */}

                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-white!/45
                                    "
                                >
                                    <span>০৩</span>
                                    <span className="h-px w-8 bg-white/20" />
                                    <span>কী ধরনের তথ্য</span>
                                </div>

                                <h2
                                    className="
                                        mt-8
                                        max-w-[520px]
                                        text-[2.15rem]
                                        font-medium!
                                        leading-[1.4]
                                        text-white!

                                        sm:text-[2.75rem]

                                        lg:text-[3.1rem]
                                    "
                                >
                                    কাজের বিভিন্ন দিকের
                                    <span className="block text-[#edb07f]">
                                        একটি পরিষ্কার রেকর্ড।
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-7
                                        max-w-[440px]
                                        text-[14px]
                                        leading-[1.9]
                                        text-white!/55

                                        sm:text-[15px]
                                    "
                                >
                                    প্রতিটি কার্যক্রমের সব তথ্য নয়—মানুষের জন্য
                                    প্রাসঙ্গিক এবং প্রকাশযোগ্য তথ্যগুলো একটি
                                    ধারাবাহিক নথির অংশ হবে।
                                </p>
                            </div>

                            {/* index */}

                            <div className="border-t border-white/20">
                                {reportAreas.map((item) => (
                                    <div
                                        key={item.number}
                                        className="
                                            group
                                            grid
                                            gap-4
                                            border-b
                                            border-white/15
                                            py-7

                                            sm:grid-cols-[52px_1fr]
                                            sm:gap-6

                                            lg:py-8
                                        "
                                    >
                                        <span
                                            className="
                                                pt-1
                                                font-nav
                                                text-[9px]
                                                tracking-[0.16em]
                                                text-white!/35
                                            "
                                        >
                                            {item.number}
                                        </span>

                                        <div
                                            className="
                                                grid
                                                gap-3

                                                md:grid-cols-[0.8fr_1.2fr]
                                                md:gap-8
                                            "
                                        >
                                            <h3
                                                className="
                                                    text-[17px]
                                                    font-medium!
                                                    text-white!

                                                    sm:text-[18px]
                                                "
                                            >
                                                {item.title}
                                            </h3>

                                            <p
                                                className="
                                                    max-w-[390px]
                                                    text-[13px]
                                                    leading-[1.85]
                                                    text-white!/55

                                                    sm:text-[14px]
                                                "
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ARCHIVE
            ====================================================== */}

            <section className="bg-[#f4f1e9]">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        {/* archive heading */}

                        <div
                            className="
                                grid
                                gap-8

                                lg:grid-cols-[0.65fr_1.35fr]
                                lg:gap-20
                            "
                        >
                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    <span>০৪</span>
                                    <span className="h-px w-8 bg-border" />
                                    <span>বর্তমান আর্কাইভ</span>
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    items-end
                                    justify-between
                                    gap-8
                                    border-b
                                    border-black/10
                                    pb-8
                                "
                            >
                                <div>
                                    <span
                                        className="
                                            font-nav
                                            text-[9px]
                                            tracking-[0.16em]
                                            text-[#a66e32]
                                        "
                                    >
                                        PUBLIC REPORT ARCHIVE
                                    </span>

                                    <h2
                                        className="
                                            mt-4
                                            text-[2.2rem]
                                            font-medium!

                                            sm:text-[2.8rem]

                                            lg:text-[3.1rem]
                                        "
                                    >
                                        প্রতিবেদন
                                    </h2>
                                </div>

                                <span
                                    className="
                                        hidden
                                        font-nav
                                        text-[9px]
                                        tracking-[0.15em]
                                        text-text-muted

                                        sm:block
                                    "
                                >
                                    00 DOCUMENTS
                                </span>
                            </div>
                        </div>

                        {/* archive body */}

                        <div
                            className="
                                mt-12
                                grid
                                gap-14

                                lg:grid-cols-[1fr_0.9fr]
                                lg:items-center
                                lg:gap-24
                                lg:pl-[calc(32.5%+1rem)]
                            "
                        >
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[#e58a52]" />

                                    <span
                                        className="
                                            font-nav
                                            text-[9px]
                                            tracking-[0.14em]
                                            text-text-muted
                                        "
                                    >
                                        ARCHIVE / EMPTY
                                    </span>
                                </div>

                                <h3
                                    className="
                                        mt-6
                                        max-w-[560px]
                                        text-[1.85rem]
                                        font-medium!
                                        leading-[1.45]

                                        sm:text-[2.3rem]
                                    "
                                >
                                    প্রথম প্রকাশিত প্রতিবেদনটি
                                    <span className="block text-primary">
                                        এখানেই যুক্ত হবে।
                                    </span>
                                </h3>

                                <p
                                    className="
                                        mt-6
                                        max-w-[550px]
                                        text-[15px]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    বর্তমানে এই আর্কাইভে কোনো প্রকাশিত প্রতিবেদন
                                    নেই। নতুন কোনো প্রতিবেদন প্রকাশের উপযোগী হলে
                                    তার বিষয়, সময়কাল এবং প্রয়োজনীয় নথি এখানে
                                    সংরক্ষিত হবে।
                                </p>
                            </div>

                            {/* document stack */}

                            <div
                                className="
                                    relative
                                    mx-auto
                                    h-[300px]
                                    w-full
                                    max-w-[340px]

                                    sm:h-[340px]

                                    lg:mx-0
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        right-5
                                        top-4
                                        h-[260px]
                                        w-[195px]
                                        rotate-[7deg]
                                        border
                                        border-primary/15
                                        bg-[#e5e9e1]

                                        sm:h-[290px]
                                        sm:w-[215px]
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        left-5
                                        top-0
                                        h-[270px]
                                        w-[205px]
                                        -rotate-[5deg]
                                        border
                                        border-black/10
                                        bg-white
                                        p-6
                                        shadow-[0_22px_50px_rgba(8,60,54,0.07)]

                                        sm:h-[300px]
                                        sm:w-[225px]
                                    "
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="
                                                font-nav
                                                text-[8px]
                                                tracking-[0.14em]
                                                text-text-muted
                                            "
                                        >
                                            SP
                                        </span>

                                        <span
                                            className="
                                                font-nav
                                                text-[8px]
                                                text-text-muted
                                            "
                                        >
                                            00
                                        </span>
                                    </div>

                                    <div className="mt-9 h-1.5 w-11 bg-[#e58a52]" />

                                    <div className="mt-8 space-y-3">
                                        <span className="block h-1.5 w-full bg-primary/10" />
                                        <span className="block h-1.5 w-[82%] bg-primary/10" />
                                        <span className="block h-1.5 w-[61%] bg-primary/10" />
                                    </div>

                                    <div
                                        className="
                                            absolute
                                            bottom-6
                                            left-6
                                            right-6
                                            flex
                                            items-end
                                            justify-between
                                            border-t
                                            border-black/[0.07]
                                            pt-5
                                        "
                                    >
                                        <TbFileText
                                            size={30}
                                            strokeWidth={1}
                                            className="text-primary/55"
                                        />

                                        <span
                                            className="
                                                font-nav
                                                text-[7px]
                                                tracking-[0.12em]
                                                text-text-muted
                                            "
                                        >
                                            REPORT
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="
                                        absolute
                                        bottom-0
                                        right-0
                                        border-t
                                        border-primary/20
                                        pt-4
                                    "
                                >
                                    <span
                                        className="
                                            font-display
                                            text-[2.7rem]
                                            leading-none
                                            text-primary
                                        "
                                    >
                                        00
                                    </span>

                                    <span
                                        className="
                                            ml-2
                                            font-nav
                                            text-[8px]
                                            tracking-[0.13em]
                                            text-text-muted
                                        "
                                    >
                                        RECORDS
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                mt-14
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-4
                                border-t
                                border-black/10
                                pt-5
                            "
                        >
                            <span className="font-nav text-[9px] tracking-[0.14em] text-text-muted">
                                STAND FOR PEOPLE
                            </span>

                            <span className="font-nav text-[9px] tracking-[0.14em] text-text-muted">
                                PUBLIC / DOCUMENTATION
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                HUMAN CONTEXT
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-12

                                lg:grid-cols-[0.65fr_1.35fr]
                                lg:gap-20
                            "
                        >
                            {/* left */}

                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    <span>০৫</span>
                                    <span className="h-px w-8 bg-border" />
                                    <span>মানুষের অংশগ্রহণ</span>
                                </div>

                                <div
                                    className="
                                        mt-12
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        border
                                        border-primary/20
                                        text-primary
                                    "
                                >
                                    <TbHeartHandshake
                                        size={27}
                                        strokeWidth={1.2}
                                    />
                                </div>
                            </div>

                            {/* content */}

                            <div className="max-w-[820px]">
                                <h2
                                    className="
                                        text-[2.1rem]
                                        font-medium!
                                        leading-[1.4]

                                        sm:text-[2.7rem]

                                        lg:text-[3.05rem]
                                    "
                                >
                                    একটি রিপোর্ট শুধু
                                    <span className="text-primary">
                                        {' '}
                                        সংখ্যার নথি নয়।
                                    </span>
                                </h2>

                                <div
                                    className="
                                        mt-8
                                        grid
                                        gap-7
                                        border-t
                                        border-border
                                        pt-8

                                        md:grid-cols-[1fr_auto]
                                        md:items-end
                                        md:gap-12
                                    "
                                >
                                    <p
                                        className="
                                            max-w-[640px]
                                            text-[15px]
                                            leading-[1.95]
                                            text-text-secondary

                                            sm:text-[17px]
                                        "
                                    >
                                        এর পেছনে থাকে মানুষের প্রয়োজন, কোনো
                                        স্বেচ্ছাসেবকের সময়, কোনো সংগঠনের সক্ষমতা
                                        এবং একটি সমস্যার সমাধানের দিকে এগিয়ে
                                        যাওয়ার চেষ্টা। তাই প্রকাশযোগ্য তথ্যকে
                                        তার মানবিক প্রেক্ষাপটের সঙ্গে দেখা
                                        গুরুত্বপূর্ণ।
                                    </p>

                                    <Link
                                        to="/team"
                                        className="
                                            group
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-3
                                            whitespace-nowrap
                                            border-b
                                            border-primary
                                            pb-2
                                            text-sm
                                            font-semibold
                                            text-primary
                                        "
                                    >
                                        <span>যাঁরা সঙ্গে আছেন</span>

                                        <TbArrowUpRight
                                            size={18}
                                            strokeWidth={1.8}
                                            className="
                                                transition-transform
                                                duration-200

                                                group-hover:-translate-y-0.5
                                                group-hover:translate-x-0.5
                                            "
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CLOSING CTA
            ====================================================== */}

            <section className="bg-[#fbf7ef]">
                <div className={pageWidth}>
                    <div
                        className="
                            flex
                            flex-col
                            gap-10
                            border-t
                            border-black/[0.07]
                            py-16

                            sm:py-20

                            lg:flex-row
                            lg:items-end
                            lg:justify-between
                            lg:py-24
                        "
                    >
                        <div>
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-text-muted
                                "
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e58a52]" />

                                <span>STAND FOR PEOPLE</span>
                            </div>

                            <h2
                                className="
                                    mt-6
                                    max-w-[680px]
                                    text-[2rem]
                                    font-medium!
                                    leading-[1.4]

                                    sm:text-[2.5rem]

                                    lg:text-[2.9rem]
                                "
                            >
                                কাজ কীভাবে এগোয়,
                                <span className="text-primary">
                                    {' '}
                                    সেটিও জানুন।
                                </span>
                            </h2>
                        </div>

                        <Link
                            to="/how-it-works"
                            className="
                                group
                                inline-flex
                                w-fit
                                items-center
                                gap-4
                                text-sm
                                font-semibold
                                text-primary
                            "
                        >
                            <span>কীভাবে কাজ করে দেখুন</span>

                            <span
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    border
                                    border-primary/30
                                    transition-all
                                    duration-200

                                    group-hover:bg-primary
                                    group-hover:text-white!
                                "
                            >
                                <TbArrowRight size={18} />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Report;
