import React from 'react';

import { Link } from 'react-router-dom';

import {
    TbArrowRight,
    TbArrowUpRight,
    TbBuildingCommunity,
    TbHeartHandshake,
    TbRoute,
    TbShieldCheck,
    TbTargetArrow,
    TbUsers,
} from 'react-icons/tb';

import aboutHeroImage from '@/assets/about/aboutHero.png';
import aboutIntro from '@/assets/about/aboutIntro.png';
import bePartOfChange from '@/assets/about/bePartOfChange.png';

const pageWidth =
    'mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20';

const principles = [
    {
        number: '01',
        icon: TbShieldCheck,
        title: 'বিশ্বাস ও স্বচ্ছতা',
        description:
            'সহায়তার প্রতিটি উদ্যোগকে যতটা সম্ভব পরিষ্কার, যাচাইযোগ্য এবং দায়িত্বশীলভাবে মানুষের সামনে উপস্থাপন করা।',
    },
    {
        number: '02',
        icon: TbUsers,
        title: 'মানুষ আগে',
        description:
            'প্রযুক্তি বা প্রক্রিয়ার আগে মানুষের বাস্তব প্রয়োজন, মর্যাদা এবং অভিজ্ঞতাকে গুরুত্ব দেওয়া।',
    },
    {
        number: '03',
        icon: TbTargetArrow,
        title: 'অর্থপূর্ণ প্রভাব',
        description:
            'শুধু সহায়তা পৌঁছানো নয়—সঠিক প্রয়োজনের সঙ্গে সঠিক মানুষ ও সক্ষমতাকে যুক্ত করা।',
    },
];

const connectionSteps = [
    {
        number: '01',
        title: 'প্রয়োজন',
        description: 'কোনো মানুষ বা কমিউনিটির বাস্তব প্রয়োজন সামনে আসে।',
    },
    {
        number: '02',
        title: 'সংযোগ',
        description:
            'প্রয়োজনের সঙ্গে স্বেচ্ছাসেবক, সহায়তাকারী বা সংগঠনের সংযোগ তৈরি হয়।',
    },
    {
        number: '03',
        title: 'সহযোগিতা',
        description: 'যে যার সামর্থ্য, সময় বা সম্পদ নিয়ে উদ্যোগের অংশ হয়ে ওঠে।',
    },
    {
        number: '04',
        title: 'পরিবর্তন',
        description:
            'সমন্বিত অংশগ্রহণ বাস্তব জীবনে অর্থপূর্ণ পরিবর্তনের সুযোগ তৈরি করে।',
    },
];

const About = () => {
    return (
        <main
            lang="bn"
            className="overflow-hidden bg-[#f7f6f1] font-bengali text-text-primary"
        >
            {/* =====================================================
                HERO — IDENTITY
            ====================================================== */}

            <section className="relative mt-20 bg-[#f1f3ed]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-12
                            py-14

                            sm:py-18

                            lg:min-h-[690px]
                            lg:grid-cols-[0.88fr_1.12fr]
                            lg:items-center
                            lg:gap-16
                            lg:py-20

                            xl:gap-24
                        "
                    >
                        {/* COPY */}

                        <div className="relative z-10 max-w-[650px]">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-primary

                                    sm:text-[11px]
                                "
                            >
                                <span className="h-2 w-2 rounded-full bg-accent" />

                                <span>STAND FOR PEOPLE / আমাদের কথা</span>
                            </div>

                            <h1
                                className="
                                    mt-7
                                    text-[2.65rem]
                                    font-medium
                                    leading-[1.3]

                                    sm:text-[3.3rem]

                                    lg:text-[3.8rem]

                                    xl:text-[4.2rem]
                                "
                            >
                                মানুষের পাশে দাঁড়ানোর ইচ্ছাকে
                                <span className="block text-primary">
                                    বাস্তব সংযোগে রূপ দেওয়া।
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
                                Stand For People এমন একটি কেন্দ্রীয় মানবিক
                                প্ল্যাটফর্ম, যেখানে মানুষের প্রয়োজন,
                                স্বেচ্ছাসেবী অংশগ্রহণ, সংগঠনের সক্ষমতা এবং
                                সহায়তার ইচ্ছা—একটি দায়িত্বশীল ব্যবস্থার মাধ্যমে
                                একে অপরের সঙ্গে যুক্ত হয়।
                            </p>

                            <div
                                className="
                                    mt-9
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-8
                                    gap-y-4
                                "
                            >
                                <Link
                                    to="/campaigns"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-4
                                        bg-primary
                                        px-6
                                        py-3.5
                                        text-[0.92rem]
                                        font-medium
                                        text-white!
                                        transition-colors

                                        hover:bg-primary-hover
                                    "
                                >
                                    উদ্যোগগুলো দেখুন
                                    <TbArrowRight
                                        size={18}
                                        className="
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />
                                </Link>

                                <Link
                                    to="/how-it-works"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-3
                                        border-b
                                        border-primary/40
                                        pb-2
                                        text-[0.9rem]
                                        font-medium
                                        text-primary
                                    "
                                >
                                    কীভাবে কাজ করে
                                    <TbArrowUpRight
                                        size={17}
                                        className="
                                            transition-transform
                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* IMAGE */}

                        <div
                            className="
                                relative
                                min-h-[410px]

                                sm:min-h-[500px]

                                lg:min-h-[570px]
                            "
                        >
                            <div
                                className="
                                    absolute
                                    inset-y-0
                                    left-[7%]
                                    right-0
                                    overflow-hidden

                                    sm:left-[10%]

                                    lg:left-0
                                "
                            >
                                <img
                                    src={aboutHeroImage}
                                    alt="মানুষের পাশে Stand For People"
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        object-center
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-linear-to-t
                                        from-black/25
                                        via-transparent
                                        to-transparent
                                    "
                                />
                            </div>

                            {/* image caption */}

                            <div
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    z-10
                                    max-w-[250px]
                                    bg-[#f1f3ed]
                                    pb-2
                                    pr-7
                                    pt-5

                                    sm:max-w-[290px]
                                    sm:pr-9
                                "
                            >
                                <span
                                    className="
                                        block
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.14em]
                                        text-primary
                                    "
                                >
                                    মানুষের জন্য, মানুষের সঙ্গে
                                </span>

                                <p
                                    className="
                                        mt-2
                                        text-[13px]
                                        leading-[1.7]
                                        text-text-secondary

                                        sm:text-[14px]
                                    "
                                >
                                    সাহায্যকে বিচ্ছিন্ন ঘটনা নয়, মানুষের মধ্যে
                                    একটি দায়িত্বশীল সংযোগ হিসেবে দেখি।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                WHO WE ARE
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        {/* INTRO STATEMENT */}

                        <div
                            className="
                                grid
                                gap-10

                                lg:grid-cols-[0.58fr_1.42fr]
                                lg:gap-20
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    01 / আমরা কারা
                                </span>
                            </div>

                            <div className="max-w-[900px]">
                                <h2
                                    className="
                                        max-w-[790px]
                                        text-[2.05rem]
                                        font-medium
                                        leading-[1.42]

                                        sm:text-[2.6rem]

                                        lg:text-[3.05rem]
                                    "
                                >
                                    মানবিক সহায়তার সবচেয়ে বড় ঘাটতি সবসময়
                                    <span className="text-primary">
                                        {' '}
                                        সদিচ্ছার নয়—সংযোগের।
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {/* STORY */}

                        <div
                            className="
                                mt-14
                                grid
                                gap-10

                                lg:mt-20
                                lg:grid-cols-[0.92fr_1.08fr]
                                lg:items-end
                                lg:gap-20
                            "
                        >
                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    bg-[#e8ece6]
                                "
                            >
                                <img
                                    src={aboutIntro}
                                    alt="Stand For People-এর মানবিক কার্যক্রম"
                                    className="
                                        aspect-[4/3]
                                        w-full
                                        object-cover

                                        lg:aspect-[5/4]
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        bottom-0
                                        right-0
                                        bg-primary
                                        px-5
                                        py-4
                                        text-white!

                                        sm:px-6
                                    "
                                >
                                    <TbHeartHandshake
                                        size={25}
                                        strokeWidth={1.25}
                                    />
                                </div>
                            </div>

                            <div className="lg:pb-2">
                                <p
                                    className="
                                        max-w-[650px]
                                        text-[1rem]
                                        leading-[2]
                                        text-text-secondary

                                        sm:text-[1.06rem]
                                    "
                                >
                                    অনেক সময় সাহায্য করার মতো মানুষ আছেন, কিন্তু
                                    তাঁরা জানেন না কোথায় তাঁদের সময়, দক্ষতা বা
                                    সহায়তা সবচেয়ে প্রয়োজন। আবার প্রয়োজন আছে এমন
                                    মানুষ ও কমিউনিটিও সঠিক সহায়তার সঙ্গে সহজে
                                    যুক্ত হতে পারেন না।
                                </p>

                                <p
                                    className="
                                        mt-6
                                        max-w-[650px]
                                        text-[1rem]
                                        leading-[2]
                                        text-text-secondary

                                        sm:text-[1.06rem]
                                    "
                                >
                                    Stand For People এই দুই দিকের মাঝখানে একটি
                                    দায়িত্বশীল সেতু তৈরি করতে চায়—যেখানে প্রয়োজন
                                    দৃশ্যমান হবে, অংশগ্রহণ সহজ হবে এবং সহযোগিতার
                                    পথ আরও পরিষ্কার হবে।
                                </p>

                                <div
                                    className="
                                        mt-9
                                        border-l-2
                                        border-accent
                                        pl-5

                                        sm:pl-7
                                    "
                                >
                                    <p
                                        className="
                                            max-w-[580px]
                                            text-[1.05rem]
                                            font-medium
                                            leading-[1.8]
                                            text-text-primary

                                            sm:text-[1.15rem]
                                        "
                                    >
                                        আমরা সাহায্যকে শুধু লেনদেন হিসেবে দেখি
                                        না। আমরা এটিকে মানুষ, প্রয়োজন এবং
                                        সক্ষমতার মধ্যে একটি সম্পর্ক হিসেবে দেখি।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                WHY SP EXISTS
            ====================================================== */}

            <section className="bg-[#173f3b] text-white!">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-12

                                lg:grid-cols-[0.85fr_1.15fr]
                                lg:gap-24
                            "
                        >
                            {/* LEFT */}

                            <div>
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-white!/45
                                    "
                                >
                                    02 / কেন Stand For People
                                </span>

                                <h2
                                    className="
                                        mt-7
                                        max-w-[510px]
                                        text-[2.1rem]
                                        font-medium
                                        leading-[1.42]
                                        text-white!

                                        sm:text-[2.7rem]

                                        lg:text-[3.1rem]
                                    "
                                >
                                    সাহায্য আছে।
                                    <span className="block text-[#eab17e]">
                                        কিন্তু সংযোগ সবসময় নেই।
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-7
                                        max-w-[440px]
                                        text-[0.95rem]
                                        leading-[1.95]
                                        text-white!/60
                                    "
                                >
                                    আমাদের উদ্দেশ্য নতুন করে মানবিকতা তৈরি করা
                                    নয়। মানুষের মধ্যে যে সহমর্মিতা আগে থেকেই
                                    আছে, সেটিকে আরও সংগঠিত ও কার্যকর হওয়ার সুযোগ
                                    দেওয়া।
                                </p>
                            </div>

                            {/* RIGHT */}

                            <div
                                className="
                                    border-t
                                    border-white/15
                                "
                            >
                                <div
                                    className="
                                        grid
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-7

                                        sm:grid-cols-[70px_1fr]
                                        sm:gap-7

                                        lg:py-8
                                    "
                                >
                                    <span
                                        className="
                                            font-display
                                            text-[2rem]
                                            text-[#eab17e]
                                        "
                                    >
                                        01
                                    </span>

                                    <div>
                                        <h3
                                            className="
                                                text-[1.15rem]
                                                font-medium
                                                text-white!
                                            "
                                        >
                                            প্রয়োজনকে দৃশ্যমান করা
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
                                            বাস্তব সহায়তার প্রয়োজন যেন মানুষের
                                            সামনে পরিষ্কার ও দায়িত্বশীলভাবে
                                            পৌঁছাতে পারে।
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        grid
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-7

                                        sm:grid-cols-[70px_1fr]
                                        sm:gap-7

                                        lg:py-8
                                    "
                                >
                                    <span
                                        className="
                                            font-display
                                            text-[2rem]
                                            text-[#eab17e]
                                        "
                                    >
                                        02
                                    </span>

                                    <div>
                                        <h3
                                            className="
                                                text-[1.15rem]
                                                font-medium
                                                text-white!
                                            "
                                        >
                                            অংশগ্রহণের পথ তৈরি করা
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
                                            কেউ সময়, কেউ দক্ষতা, কেউ সম্পদ, কেউ
                                            সাংগঠনিক সক্ষমতা দিয়ে পাশে দাঁড়াতে
                                            পারেন।
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        grid
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-7

                                        sm:grid-cols-[70px_1fr]
                                        sm:gap-7

                                        lg:py-8
                                    "
                                >
                                    <span
                                        className="
                                            font-display
                                            text-[2rem]
                                            text-[#eab17e]
                                        "
                                    >
                                        03
                                    </span>

                                    <div>
                                        <h3
                                            className="
                                                text-[1.15rem]
                                                font-medium
                                                text-white!
                                            "
                                        >
                                            সহযোগিতাকে অর্থপূর্ণ করা
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
                                            বিচ্ছিন্ন উদ্যোগের বদলে প্রয়োজন,
                                            মানুষ ও সক্ষমতার মধ্যে সমন্বিত
                                            সম্পর্ক তৈরি করা।
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                HOW THE CONNECTION HAPPENS
            ====================================================== */}

            <section className="bg-[#f3f0e8]">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        {/* HEADING */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-7

                                lg:flex-row
                                lg:items-end
                                lg:justify-between
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    03 / সংযোগের পথ
                                </span>

                                <h2
                                    className="
                                        mt-6
                                        max-w-[650px]
                                        text-[2rem]
                                        font-medium
                                        leading-[1.42]

                                        sm:text-[2.6rem]

                                        lg:text-[3rem]
                                    "
                                >
                                    একটি প্রয়োজন থেকে
                                    <span className="block text-primary">
                                        সম্মিলিত উদ্যোগ পর্যন্ত।
                                    </span>
                                </h2>
                            </div>

                            <p
                                className="
                                    max-w-[390px]
                                    text-[0.92rem]
                                    leading-[1.85]
                                    text-text-secondary
                                "
                            >
                                SP-এর ভূমিকা সব কাজ নিজে করা নয়; বরং সঠিক মানুষ,
                                প্রয়োজন এবং সক্ষমতার মধ্যে সংযোগ তৈরি করা।
                            </p>
                        </div>

                        {/* PATH */}

                        <div
                            className="
                                relative
                                mt-14

                                lg:mt-20
                            "
                        >
                            {/* desktop line */}

                            <div
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    top-[22px]
                                    hidden
                                    h-px
                                    bg-primary/20

                                    lg:block
                                "
                            />

                            <div
                                className="
                                    grid
                                    gap-0

                                    lg:grid-cols-4
                                "
                            >
                                {connectionSteps.map((item, index) => (
                                    <div
                                        key={item.number}
                                        className={`
                                            relative
                                            border-t
                                            border-black/10
                                            py-7

                                            lg:border-t-0
                                            lg:px-8
                                            lg:pb-0
                                            lg:pt-0

                                            ${
                                                index === 0
                                                    ? 'lg:pl-0'
                                                    : 'lg:border-l lg:border-black/10'
                                            }
                                        `}
                                    >
                                        <div
                                            className="
                                                relative
                                                z-10
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-primary/30
                                                bg-[#f3f0e8]
                                            "
                                        >
                                            <span
                                                className="
                                                    text-[9px]
                                                    font-semibold
                                                    text-primary
                                                "
                                            >
                                                {item.number}
                                            </span>
                                        </div>

                                        <h3
                                            className="
                                                mt-7
                                                text-[1.1rem]
                                                font-semibold
                                            "
                                        >
                                            {item.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-3
                                                max-w-[250px]
                                                text-[0.88rem]
                                                leading-[1.85]
                                                text-text-secondary
                                            "
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PRINCIPLES / WHAT MATTERS
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-12

                                lg:grid-cols-[0.62fr_1.38fr]
                                lg:gap-20
                            "
                        >
                            {/* LEFT */}

                            <div>
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.16em]
                                        text-text-muted
                                    "
                                >
                                    04 / যা আমাদের কাছে গুরুত্বপূর্ণ
                                </span>

                                <h2
                                    className="
                                        mt-6
                                        max-w-[430px]
                                        text-[2rem]
                                        font-medium
                                        leading-[1.45]

                                        sm:text-[2.45rem]
                                    "
                                >
                                    কাজের ধরন বদলাতে পারে।
                                    <span className="block text-primary">
                                        ভিত্তি বদলায় না।
                                    </span>
                                </h2>
                            </div>

                            {/* PRINCIPLES */}

                            <div className="border-t border-black/10">
                                {principles.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <article
                                            key={item.number}
                                            className="
                                                grid
                                                gap-5
                                                border-b
                                                border-black/10
                                                py-7

                                                sm:grid-cols-[50px_1fr_auto]
                                                sm:items-start
                                                sm:gap-7

                                                lg:py-8
                                            "
                                        >
                                            <span
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    text-primary
                                                "
                                            >
                                                <Icon
                                                    size={25}
                                                    strokeWidth={1.25}
                                                />
                                            </span>

                                            <div>
                                                <h3
                                                    className="
                                                        text-[1.1rem]
                                                        font-semibold
                                                    "
                                                >
                                                    {item.title}
                                                </h3>

                                                <p
                                                    className="
                                                        mt-3
                                                        max-w-[560px]
                                                        text-[0.9rem]
                                                        leading-[1.85]
                                                        text-text-secondary
                                                    "
                                                >
                                                    {item.description}
                                                </p>
                                            </div>

                                            <span
                                                className="
                                                    hidden
                                                    text-[9px]
                                                    font-semibold
                                                    tracking-[0.14em]
                                                    text-text-muted

                                                    sm:block
                                                "
                                            >
                                                {item.number}
                                            </span>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                IMPACT PHILOSOPHY
            ====================================================== */}

            <section className="relative overflow-hidden bg-[#e9f0ed]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-12
                            py-20

                            sm:py-24

                            lg:grid-cols-[1.08fr_0.92fr]
                            lg:items-center
                            lg:gap-20
                            lg:py-28
                        "
                    >
                        {/* COPY */}

                        <div className="max-w-[670px]">
                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-primary
                                "
                            >
                                05 / আমাদের কাছে প্রভাব
                            </span>

                            <h2
                                className="
                                    mt-6
                                    text-[2.05rem]
                                    font-medium
                                    leading-[1.45]

                                    sm:text-[2.65rem]

                                    lg:text-[3rem]
                                "
                            >
                                প্রভাব শুধু বড় সংখ্যায়
                                <span className="block text-primary">
                                    মাপা যায় না।
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-7
                                    max-w-[590px]
                                    text-[1rem]
                                    leading-[1.95]
                                    text-text-secondary
                                "
                            >
                                কখনো প্রভাব মানে একটি পরিবারের জরুরি প্রয়োজন
                                পূরণ হওয়া। কখনো একজন শিক্ষার্থীর পড়াশোনা চালিয়ে
                                যাওয়া। কখনো একটি কমিউনিটির সমস্যার পাশে কয়েকজন
                                মানুষের একসঙ্গে দাঁড়ানো।
                            </p>

                            <p
                                className="
                                    mt-5
                                    max-w-[590px]
                                    text-[1rem]
                                    leading-[1.95]
                                    text-text-secondary
                                "
                            >
                                আমাদের কাছে গুরুত্বপূর্ণ হলো—সহায়তা যেন মানুষের
                                বাস্তব প্রয়োজনের সঙ্গে যুক্ত হয় এবং সেই
                                সহযোগিতার মধ্যে মর্যাদা ও দায়িত্ব থাকে।
                            </p>

                            <Link
                                to="/impact"
                                className="
                                    group
                                    mt-9
                                    inline-flex
                                    items-center
                                    gap-3
                                    border-b
                                    border-primary
                                    pb-2
                                    text-[0.92rem]
                                    font-semibold
                                    text-primary
                                "
                            >
                                আমাদের প্রভাব দেখুন
                                <TbArrowUpRight
                                    size={18}
                                    className="
                                        transition-transform
                                        group-hover:-translate-y-0.5
                                        group-hover:translate-x-0.5
                                    "
                                />
                            </Link>
                        </div>

                        {/* HUMAN MARK */}

                        <div
                            className="
                                relative
                                mx-auto
                                flex
                                min-h-[310px]
                                w-full
                                max-w-[470px]
                                items-center
                                justify-center

                                sm:min-h-[380px]

                                lg:mx-0
                            "
                        >
                            <div
                                className="
                                    absolute
                                    h-[280px]
                                    w-[280px]
                                    rounded-full
                                    border
                                    border-primary/15

                                    sm:h-[340px]
                                    sm:w-[340px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    h-[205px]
                                    w-[205px]
                                    rounded-full
                                    border
                                    border-primary/15

                                    sm:h-[250px]
                                    sm:w-[250px]
                                "
                            />

                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    h-[140px]
                                    w-[140px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary
                                    text-white!

                                    sm:h-[165px]
                                    sm:w-[165px]
                                "
                            >
                                <TbBuildingCommunity
                                    size={55}
                                    strokeWidth={1}
                                />
                            </div>

                            <span
                                className="
                                    absolute
                                    right-[9%]
                                    top-[15%]
                                    h-4
                                    w-4
                                    rounded-full
                                    bg-accent
                                "
                            />

                            <div
                                className="
                                    absolute
                                    bottom-[8%]
                                    left-0
                                    max-w-[170px]
                                    bg-[#e9f0ed]
                                    py-3
                                    pr-5
                                "
                            >
                                <span
                                    className="
                                        text-[0.82rem]
                                        font-medium
                                        leading-[1.65]
                                        text-primary
                                    "
                                >
                                    মানুষ → সংযোগ → সহযোগিতা
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PEOPLE / PLATFORM IDENTITY
            ====================================================== */}

            <section className="bg-[#f7f6f1]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-12
                            py-20

                            sm:py-24

                            lg:grid-cols-[0.85fr_1.15fr]
                            lg:items-center
                            lg:gap-20
                            lg:py-28
                        "
                    >
                        <div
                            className="
                                relative
                                overflow-hidden
                                bg-[#dfe5df]
                            "
                        >
                            <img
                                src={bePartOfChange}
                                alt="Stand For People-এর সঙ্গে যুক্ত মানুষ"
                                className="
                                    aspect-[5/4]
                                    w-full
                                    object-cover
                                    object-center
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-linear-to-t
                                    from-black/30
                                    via-transparent
                                    to-transparent
                                "
                            />

                            <div
                                className="
                                    absolute
                                    bottom-5
                                    left-5
                                    right-5
                                    flex
                                    items-center
                                    justify-between
                                    text-white!

                                    sm:bottom-6
                                    sm:left-6
                                    sm:right-6
                                "
                            >
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.14em]
                                    "
                                >
                                    STAND FOR PEOPLE
                                </span>

                                <TbHeartHandshake
                                    size={25}
                                    strokeWidth={1.25}
                                />
                            </div>
                        </div>

                        <div>
                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-text-muted
                                "
                            >
                                06 / প্ল্যাটফর্মের পেছনে
                            </span>

                            <h2
                                className="
                                    mt-6
                                    max-w-[600px]
                                    text-[2.05rem]
                                    font-medium
                                    leading-[1.45]

                                    sm:text-[2.65rem]

                                    lg:text-[3rem]
                                "
                            >
                                শেষ পর্যন্ত এটি
                                <span className="block text-primary">
                                    মানুষেরই একটি প্ল্যাটফর্ম।
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-7
                                    max-w-[590px]
                                    text-[1rem]
                                    leading-[1.95]
                                    text-text-secondary
                                "
                            >
                                প্রযুক্তি আমাদের সংযোগ তৈরি করতে সাহায্য করে,
                                কিন্তু পরিবর্তনের আসল শক্তি আসে সেই মানুষদের কাছ
                                থেকে—যাঁরা প্রয়োজন জানান, স্বেচ্ছাসেবী হিসেবে
                                সময় দেন, সংগঠন নিয়ে পাশে দাঁড়ান বা অন্য কোনোভাবে
                                সহযোগিতা করেন।
                            </p>

                            <Link
                                to="/team"
                                className="
                                    group
                                    mt-9
                                    inline-flex
                                    items-center
                                    gap-3
                                    border-b
                                    border-primary
                                    pb-2
                                    text-[0.92rem]
                                    font-semibold
                                    text-primary
                                "
                            >
                                আমাদের সঙ্গে যাঁরা আছেন
                                <TbArrowUpRight
                                    size={18}
                                    className="
                                        transition-transform
                                        group-hover:-translate-y-0.5
                                        group-hover:translate-x-0.5
                                    "
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CLOSING CTA
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
                                    text-[9px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-white!/55
                                "
                            >
                                <TbRoute size={17} strokeWidth={1.4} />

                                <span>আপনিও এই পথের অংশ হতে পারেন</span>
                            </div>

                            <h2
                                className="
                                    mt-6
                                    max-w-[710px]
                                    text-[2rem]
                                    font-medium
                                    leading-[1.45]
                                    text-white!

                                    sm:text-[2.6rem]

                                    lg:text-[3rem]
                                "
                            >
                                পরিবর্তন শুরু হতে পারে
                                <span className="block text-white!/65">
                                    একজন মানুষের পাশে দাঁড়ানো থেকেই।
                                </span>
                            </h2>
                        </div>

                        <div
                            className="
                                flex
                                flex-col
                                gap-3

                                sm:flex-row
                            "
                        >
                            <Link
                                to="/campaigns"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-3
                                    bg-white
                                    px-5
                                    py-3.5
                                    text-[0.9rem]
                                    font-semibold
                                    text-primary
                                    transition-colors

                                    hover:bg-[#f4f1e9]
                                "
                            >
                                মানুষের পাশে দাঁড়ান
                                <TbArrowRight
                                    size={17}
                                    className="
                                        transition-transform
                                        group-hover:translate-x-1
                                    "
                                />
                            </Link>

                            <Link
                                to="/volunteer"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-3
                                    border
                                    border-white/30
                                    px-5
                                    py-3.5
                                    text-[0.9rem]
                                    font-semibold
                                    text-white!
                                    transition-colors

                                    hover:border-white/60
                                "
                            >
                                স্বেচ্ছাসেবী হোন
                                <TbArrowUpRight
                                    size={17}
                                    className="
                                        transition-transform
                                        group-hover:-translate-y-0.5
                                        group-hover:translate-x-0.5
                                    "
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
