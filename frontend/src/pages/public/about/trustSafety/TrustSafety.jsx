import React from 'react';

import { Link } from 'react-router-dom';
import {
    TbAlertTriangle,
    TbArrowRight,
    TbArrowUpRight,
    TbCircleCheck,
    TbHeartHandshake,
    TbLock,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

/* =========================================================
   DATA
========================================================= */

const safetyPrinciples = [
    {
        number: '01',
        icon: TbShieldCheck,
        title: 'যাচাইকে গুরুত্ব দেওয়া',
        description:
            'যেখানে পরিচয়, ভূমিকা বা অংশগ্রহণ যাচাই করার ব্যবস্থা রয়েছে, সেখানে যাচাই করা তথ্যকে অগ্রাধিকার দেওয়া হয়।',
    },
    {
        number: '02',
        icon: TbUsers,
        title: 'দায়িত্বশীল অংশগ্রহণ',
        description:
            'স্বেচ্ছাসেবক, সংগঠন এবং সহায়তা প্রত্যাশী—প্রত্যেকের জন্য নিজের ভূমিকা ও দায়িত্ব সম্পর্কে পরিষ্কার থাকা গুরুত্বপূর্ণ।',
    },
    {
        number: '03',
        icon: TbLock,
        title: 'প্রয়োজনীয় তথ্যের ব্যবহার',
        description:
            'মানুষের সঙ্গে সম্পর্কিত তথ্য দায়িত্বশীলভাবে পরিচালনা করা এবং অপ্রয়োজনীয় তথ্য প্রকাশ না করাই আমাদের নীতির অংশ।',
    },
];

const participationAreas = [
    {
        number: '01',
        title: 'সহায়তার অনুরোধ',
        description:
            'কোনো সহায়তার প্রয়োজন জানালে তথ্য সঠিকভাবে দেওয়া এবং প্রয়োজন অনুযায়ী যোগাযোগের জন্য প্রস্তুত থাকা গুরুত্বপূর্ণ।',
    },
    {
        number: '02',
        title: 'স্বেচ্ছাসেবক',
        description:
            'স্বেচ্ছাসেবী হিসেবে যুক্ত হওয়ার আগে নিজের দক্ষতা, সময় এবং দায়িত্বের সীমা সম্পর্কে বাস্তবসম্মত থাকা প্রয়োজন।',
    },
    {
        number: '03',
        title: 'সংগঠন',
        description:
            'কোনো সংগঠন প্ল্যাটফর্মে যুক্ত হলে তার পরিচয়, সক্ষমতা এবং ভূমিকা সম্পর্কে যথাযথ তথ্য প্রদান করা গুরুত্বপূর্ণ।',
    },
];

const safetyChecklist = [
    'পরিচয় ও প্রাসঙ্গিক তথ্য যাচাই করুন',
    'অপ্রয়োজনীয় ব্যক্তিগত তথ্য শেয়ার করবেন না',
    'সন্দেহজনক আচরণ হলে সতর্ক থাকুন',
    'গুরুত্বপূর্ণ সিদ্ধান্তে প্রয়োজনীয় যাচাই করুন',
];

const pageWidth =
    'mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20';

/* =========================================================
   TRUST & SAFETY
========================================================= */

const TrustSafety = () => {
    return (
        <main
            lang="bn"
            className="overflow-hidden bg-background font-bengali text-text-primary"
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="relative mt-20 bg-[#edf3f0]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-12
                            py-16

                            sm:py-20

                            lg:min-h-[650px]
                            lg:grid-cols-[1.05fr_0.95fr]
                            lg:items-center
                            lg:gap-20
                            lg:py-24

                            xl:gap-28
                        "
                    >
                        {/* COPY */}

                        <div className="max-w-[680px]">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-accent" />

                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-primary
                                    "
                                >
                                    Trust &amp; Safety
                                </span>
                            </div>

                            <h1
                                className="
                                    mt-7
                                    max-w-[650px]
                                    text-[2.65rem]
                                    font-medium!
                                    leading-[1.28]

                                    sm:text-[3.3rem]

                                    lg:text-[3.8rem]

                                    xl:text-[4.15rem]
                                "
                            >
                                মানুষের পাশে থাকা মানে
                                <span className="block text-primary">
                                    দায়িত্ব নিয়েও পাশে থাকা।
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-7
                                    max-w-[590px]
                                    text-[1rem]
                                    leading-[1.95]
                                    text-text-secondary

                                    sm:text-[1.06rem]
                                "
                            >
                                Stand For People-এ মানুষের প্রয়োজন ও অংশগ্রহণকে
                                দায়িত্বশীলভাবে পরিচালনা করার জন্য কিছু মৌলিক
                                নীতি অনুসরণ করা হয়। এই পেজে সেগুলো সহজভাবে তুলে
                                ধরা হয়েছে।
                            </p>

                            <div
                                className="
                                    mt-9
                                    flex
                                    flex-wrap
                                    gap-x-7
                                    gap-y-3
                                    border-t
                                    border-primary/15
                                    pt-5
                                "
                            >
                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[0.8rem]
                                        text-text-secondary
                                    "
                                >
                                    <TbCircleCheck
                                        size={16}
                                        className="text-primary"
                                    />
                                    যাচাই
                                </span>

                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[0.8rem]
                                        text-text-secondary
                                    "
                                >
                                    <TbCircleCheck
                                        size={16}
                                        className="text-primary"
                                    />
                                    দায়িত্ব
                                </span>

                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[0.8rem]
                                        text-text-secondary
                                    "
                                >
                                    <TbCircleCheck
                                        size={16}
                                        className="text-primary"
                                    />
                                    তথ্যের সুরক্ষা
                                </span>
                            </div>
                        </div>

                        {/* SAFETY VISUAL */}

                        <div
                            className="
                                relative
                                mx-auto
                                flex
                                min-h-[360px]
                                w-full
                                max-w-[510px]
                                items-center
                                justify-center

                                sm:min-h-[420px]

                                lg:mx-0
                                lg:min-h-[470px]
                            "
                        >
                            {/* large outline */}

                            <div
                                className="
                                    absolute
                                    h-[300px]
                                    w-[300px]
                                    rounded-full
                                    border
                                    border-primary/15

                                    sm:h-[360px]
                                    sm:w-[360px]

                                    lg:h-[400px]
                                    lg:w-[400px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    h-[235px]
                                    w-[235px]
                                    rounded-full
                                    border
                                    border-primary/10

                                    sm:h-[285px]
                                    sm:w-[285px]

                                    lg:h-[315px]
                                    lg:w-[315px]
                                "
                            />

                            {/* center */}

                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    h-[160px]
                                    w-[160px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary
                                    text-white!

                                    sm:h-[190px]
                                    sm:w-[190px]
                                "
                            >
                                <TbShieldCheck size={72} strokeWidth={1} />
                            </div>

                            {/* labels */}

                            <div
                                className="
                                    absolute
                                    left-0
                                    top-[22%]
                                    bg-[#edf3f0]
                                    py-2
                                    pr-4
                                "
                            >
                                <span
                                    className="
                                        block
                                        font-nav
                                        text-[9px]
                                        tracking-[0.14em]
                                        text-text-muted
                                    "
                                >
                                    01
                                </span>

                                <span
                                    className="
                                        mt-1
                                        block
                                        text-[0.83rem]
                                        font-medium!
                                        text-primary
                                    "
                                >
                                    যাচাই
                                </span>
                            </div>

                            <div
                                className="
                                    absolute
                                    bottom-[16%]
                                    right-0
                                    bg-[#edf3f0]
                                    py-2
                                    pl-4
                                    text-right
                                "
                            >
                                <span
                                    className="
                                        block
                                        font-nav
                                        text-[9px]
                                        tracking-[0.14em]
                                        text-text-muted
                                    "
                                >
                                    02
                                </span>

                                <span
                                    className="
                                        mt-1
                                        block
                                        text-[0.83rem]
                                        font-medium!
                                        text-primary
                                    "
                                >
                                    দায়িত্ব
                                </span>
                            </div>

                            <span
                                className="
                                    absolute
                                    right-[12%]
                                    top-[12%]
                                    h-4
                                    w-4
                                    rounded-full
                                    bg-accent
                                "
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CORE IDEA
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-12

                                lg:grid-cols-[1.1fr_0.9fr]
                                lg:gap-20

                                xl:gap-28
                            "
                        >
                            {/* STATEMENT */}

                            <div>
                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-primary
                                    "
                                >
                                    01 / আমাদের দৃষ্টিভঙ্গি
                                </span>

                                <h2
                                    className="
                                        mt-7
                                        max-w-[650px]
                                        text-[2.1rem]
                                        font-medium!
                                        leading-[1.42]

                                        sm:text-[2.65rem]

                                        lg:text-[3rem]
                                    "
                                >
                                    বিশ্বাস তৈরি হয়
                                    <span className="text-primary">
                                        {' '}
                                        পরিষ্কার আচরণ ও তথ্য থেকে।
                                    </span>
                                </h2>
                            </div>

                            {/* COPY */}

                            <div
                                className="
                                    border-t
                                    border-border
                                    pt-7

                                    lg:mt-10
                                "
                            >
                                <p
                                    className="
                                        text-[0.98rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    একটি মানবিক প্ল্যাটফর্মে বিভিন্ন ধরনের মানুষ
                                    একসঙ্গে যুক্ত হন। কেউ সাহায্য চান, কেউ সময়
                                    দেন, আবার কোনো সংগঠন নিজের সক্ষমতা নিয়ে পাশে
                                    দাঁড়ায়। এই অংশগ্রহণ যেন দায়িত্বশীলভাবে হয়,
                                    সেটিই Trust & Safety-এর মূল উদ্দেশ্য।
                                </p>

                                <p
                                    className="
                                        mt-6
                                        text-[0.98rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    একই সঙ্গে মনে রাখা জরুরি—কোনো অনলাইন
                                    প্ল্যাটফর্মই প্রতিটি পরিস্থিতির ঝুঁকি
                                    সম্পূর্ণভাবে দূর করতে পারে না। তাই যাচাই,
                                    সতর্কতা এবং দায়িত্বশীল ব্যবহার—তিনটিই
                                    গুরুত্বপূর্ণ।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PRINCIPLES
            ====================================================== */}

            <section className="bg-[#f7f6f1]">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-28">
                        {/* heading */}

                        <div
                            className="
                                grid
                                gap-7

                                lg:grid-cols-[0.7fr_1.3fr]
                                lg:items-end
                                lg:gap-20
                            "
                        >
                            <div>
                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    02 / মূল নীতি
                                </span>
                            </div>

                            <h2
                                className="
                                    max-w-[700px]
                                    text-[2rem]
                                    font-medium!
                                    leading-[1.4]

                                    sm:text-[2.5rem]

                                    lg:text-[2.85rem]
                                "
                            >
                                নিরাপদ অংশগ্রহণের ভিত্তি
                                <span className="text-primary">
                                    {' '}
                                    তিনটি সাধারণ নীতি।
                                </span>
                            </h2>
                        </div>

                        {/* staggered principles */}

                        <div
                            className="
                                mt-14
                                grid
                                gap-0
                                border-t
                                border-black/10

                                lg:mt-16
                                lg:grid-cols-3
                            "
                        >
                            {safetyPrinciples.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={item.number}
                                        className={`
                                            relative
                                            border-b
                                            border-black/10
                                            py-9

                                            lg:min-h-[350px]
                                            lg:border-b-0
                                            lg:px-9
                                            lg:py-10

                                            ${
                                                index > 0
                                                    ? 'lg:border-l lg:border-black/10'
                                                    : ''
                                            }

                                            ${
                                                index === 0
                                                    ? 'lg:pl-0 lg:pr-10'
                                                    : ''
                                            }

                                            ${index === 1 ? 'lg:pt-20' : ''}

                                            ${index === 2 ? 'lg:pt-32' : ''}
                                        `}
                                    >
                                        <div className="flex items-start justify-between">
                                            <Icon
                                                size={28}
                                                strokeWidth={1.25}
                                                className="text-primary"
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

                                        <h3
                                            className="
                                                mt-10
                                                text-[1.15rem]
                                                font-semibold
                                                leading-[1.5]
                                            "
                                        >
                                            {item.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-4
                                                max-w-[310px]
                                                text-[0.9rem]
                                                leading-[1.9]
                                                text-text-secondary
                                            "
                                        >
                                            {item.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PARTICIPATION
            ====================================================== */}

            <section className="bg-primary-deep text-white!">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-14

                                lg:grid-cols-[0.85fr_1.15fr]
                                lg:gap-24
                            "
                        >
                            {/* LEFT */}

                            <div>
                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-white!/45
                                    "
                                >
                                    03 / অংশগ্রহণের আগে
                                </span>

                                <h2
                                    className="
                                        mt-7
                                        max-w-[500px]
                                        text-[2.15rem]
                                        font-medium!
                                        leading-[1.4]
                                        text-white!

                                        sm:text-[2.7rem]

                                        lg:text-[3.05rem]
                                    "
                                >
                                    যে ভূমিকাতেই আসুন,
                                    <span className="block text-[#edb07f]">
                                        দায়িত্বটা সবার।
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-7
                                        max-w-[420px]
                                        text-[0.92rem]
                                        leading-[1.9]
                                        text-white!/55
                                    "
                                >
                                    প্রত্যেক ধরনের অংশগ্রহণের দায়িত্ব আলাদা।
                                    নিজের ভূমিকা সম্পর্কে পরিষ্কার থাকা নিরাপদ ও
                                    কার্যকর সহযোগিতার প্রথম ধাপ।
                                </p>
                            </div>

                            {/* ROLE STEPS */}

                            <div className="relative">
                                <div
                                    className="
                                        absolute
                                        bottom-0
                                        left-[17px]
                                        top-0
                                        w-px
                                        bg-white/15

                                        sm:left-[21px]
                                    "
                                />

                                <div className="space-y-10">
                                    {participationAreas.map((item) => (
                                        <div
                                            key={item.number}
                                            className="
                                                relative
                                                grid
                                                grid-cols-[36px_1fr]
                                                gap-5

                                                sm:grid-cols-[44px_1fr]
                                                sm:gap-7
                                            "
                                        >
                                            <div
                                                className="
                                                    relative
                                                    z-10
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border
                                                    border-white/25
                                                    bg-primary-deep

                                                    sm:h-11
                                                    sm:w-11
                                                "
                                            >
                                                <span
                                                    className="
                                                        font-nav
                                                        text-[8px]
                                                        tracking-[0.1em]
                                                        text-white!/55
                                                    "
                                                >
                                                    {item.number}
                                                </span>
                                            </div>

                                            <div
                                                className="
                                                    border-b
                                                    border-white/15
                                                    pb-10
                                                "
                                            >
                                                <h3
                                                    className="
                                                        text-[1.1rem]
                                                        font-medium!
                                                        text-white!

                                                        sm:text-[1.25rem]
                                                    "
                                                >
                                                    {item.title}
                                                </h3>

                                                <p
                                                    className="
                                                        mt-3
                                                        max-w-[520px]
                                                        text-[0.88rem]
                                                        leading-[1.85]
                                                        text-white!/55
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
                </div>
            </section>

            {/* =====================================================
                SAFETY CHECK
            ====================================================== */}

            <section className="bg-[#f2eee5]">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-12

                                lg:grid-cols-[1.05fr_0.95fr]
                                lg:items-start
                                lg:gap-24
                            "
                        >
                            {/* LEFT */}

                            <div className="max-w-[650px]">
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#e58a52]
                                        text-white!
                                    "
                                >
                                    <TbAlertTriangle
                                        size={23}
                                        strokeWidth={1.4}
                                    />
                                </div>

                                <span
                                    className="
                                        mt-8
                                        block
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    04 / সতর্ক থাকুন
                                </span>

                                <h2
                                    className="
                                        mt-5
                                        text-[2.05rem]
                                        font-medium!
                                        leading-[1.4]

                                        sm:text-[2.6rem]

                                        lg:text-[2.95rem]
                                    "
                                >
                                    অনলাইনে তথ্য দেখলেই
                                    <span className="block text-primary">
                                        সবকিছু যাচাই হয়ে যায় না।
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-7
                                        max-w-[600px]
                                        text-[0.98rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    কোনো ব্যক্তি, সংগঠন বা সহায়তার পরিস্থিতি
                                    সম্পর্কে গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার আগে
                                    প্রয়োজনীয় তথ্য নিজে যাচাই করুন। সংবেদনশীল
                                    ব্যক্তিগত তথ্য, অর্থনৈতিক তথ্য বা অন্য
                                    গুরুত্বপূর্ণ তথ্য অপ্রয়োজনে প্রকাশ করবেন না।
                                </p>
                            </div>

                            {/* CHECKLIST */}

                            <div
                                className="
                                    border-t
                                    border-black/10

                                    lg:mt-10
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        py-5
                                    "
                                >
                                    <span
                                        className="
                                            font-nav
                                            text-[9px]
                                            tracking-[0.15em]
                                            text-text-muted
                                        "
                                    >
                                        BEFORE YOU CONTINUE
                                    </span>

                                    <TbShieldCheck
                                        size={20}
                                        className="text-primary"
                                    />
                                </div>

                                {safetyChecklist.map((item, index) => (
                                    <div
                                        key={item}
                                        className="
                                            grid
                                            grid-cols-[34px_1fr]
                                            items-start
                                            gap-4
                                            border-t
                                            border-black/10
                                            py-5
                                        "
                                    >
                                        <span
                                            className="
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-white/70
                                                text-primary
                                            "
                                        >
                                            <TbCircleCheck
                                                size={16}
                                                strokeWidth={1.6}
                                            />
                                        </span>

                                        <div>
                                            <span
                                                className="
                                                    block
                                                    text-[0.92rem]
                                                    leading-[1.7]
                                                    text-text-primary
                                                "
                                            >
                                                {item}
                                            </span>

                                            <span
                                                className="
                                                    mt-1
                                                    block
                                                    font-nav
                                                    text-[8px]
                                                    tracking-[0.12em]
                                                    text-text-muted
                                                "
                                            >
                                                CHECK{' '}
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                LIMITATIONS
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                relative
                                mx-auto
                                max-w-[1100px]
                                border-y
                                border-border
                                py-12

                                sm:py-16

                                lg:py-20
                            "
                        >
                            <div
                                className="
                                    grid
                                    gap-10

                                    lg:grid-cols-[0.8fr_1.2fr]
                                    lg:gap-20
                                "
                            >
                                {/* TITLE */}

                                <div>
                                    <span
                                        className="
                                            font-nav
                                            text-[10px]
                                            font-semibold
                                            tracking-[0.16em]
                                            text-text-muted
                                        "
                                    >
                                        05 / গুরুত্বপূর্ণ সীমাবদ্ধতা
                                    </span>

                                    <h2
                                        className="
                                            mt-6
                                            max-w-[430px]
                                            text-[2rem]
                                            font-medium!
                                            leading-[1.42]

                                            sm:text-[2.5rem]

                                            lg:text-[2.8rem]
                                        "
                                    >
                                        কোনো প্রযুক্তি
                                        <span className="block text-primary">
                                            ঝুঁকির বিকল্প নয়।
                                        </span>
                                    </h2>
                                </div>

                                {/* COPY */}

                                <div>
                                    <p
                                        className="
                                            max-w-[650px]
                                            text-[0.98rem]
                                            leading-[1.95]
                                            text-text-secondary
                                        "
                                    >
                                        SP-এর verification বা platform-level
                                        safeguards কোনো ব্যক্তি, সংগঠন বা
                                        পরিস্থিতি সম্পর্কে সম্পূর্ণ নিশ্চয়তা
                                        প্রদান করে না। বাস্তব জগতের পরিস্থিতিতে
                                        প্রয়োজনীয় সতর্কতা ও নিজস্ব যাচাই সবসময়
                                        গুরুত্বপূর্ণ।
                                    </p>

                                    <div
                                        className="
                                            mt-8
                                            border-l-2
                                            border-accent
                                            pl-5

                                            sm:pl-7
                                        "
                                    >
                                        <p
                                            className="
                                                max-w-[620px]
                                                text-[0.9rem]
                                                leading-[1.9]
                                                text-text-secondary
                                            "
                                        >
                                            বিশেষ করে অর্থ, ব্যক্তিগত নিরাপত্তা,
                                            চিকিৎসা বা অন্য কোনো গুরুতর বিষয়ে
                                            সিদ্ধান্ত নেওয়ার আগে যথাযথ স্থানীয়
                                            কর্তৃপক্ষ বা উপযুক্ত পেশাদার উৎসের
                                            সহায়তা নেওয়া প্রয়োজন হতে পারে।
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CLOSING
            ====================================================== */}

            <section className="bg-primary">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-10
                            py-16

                            sm:py-20

                            lg:grid-cols-[1fr_auto]
                            lg:items-end
                            lg:py-24
                        "
                    >
                        <div>
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    font-nav
                                    text-[9px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-white!/55
                                "
                            >
                                <TbHeartHandshake size={17} strokeWidth={1.4} />

                                <span>STAND FOR PEOPLE</span>
                            </div>

                            <h2
                                className="
                                    mt-6
                                    max-w-[690px]
                                    text-[2rem]
                                    font-medium!
                                    leading-[1.42]
                                    text-white!

                                    sm:text-[2.6rem]

                                    lg:text-[3rem]
                                "
                            >
                                পাশে থাকা মানে
                                <span className="block text-white!/65">
                                    দায়িত্ব নিয়েও পাশে থাকা।
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
                                text-[0.94rem]
                                font-medium!
                                text-white!
                            "
                        >
                            কীভাবে কাজ করে দেখুন
                            <span
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/30
                                    transition-all

                                    group-hover:bg-white
                                    group-hover:text-primary
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

export default TrustSafety;
