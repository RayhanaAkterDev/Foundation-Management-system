import React from 'react';

import { TbArrowDown } from 'react-icons/tb';

/*
|--------------------------------------------------------------------------
| IMAGES
|--------------------------------------------------------------------------
| Temporary internet images.
| Replace with final local SP assets later.
|--------------------------------------------------------------------------
*/

const heroImage =
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=85';

const fieldImage =
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=85';

const Mission = () => {
    return (
        <main
            lang="bn"
            className="overflow-hidden bg-surface font-bengali text-text-primary"
        >
            {/* =========================================================
                OPENING
            ========================================================== */}

            <section className="bg-background-warm">
                <div className="container-width mt-16">
                    <div
                        className="
                            relative
                            pb-14
                            pt-16
                            sm:pb-16
                            sm:pt-20
                            md:pb-18
                            md:pt-22
                            lg:pb-20
                            lg:pt-24
                            xl:pb-24
                            xl:pt-28
                        "
                    >
                        {/* Quiet brand line */}

                        <div className="mb-8 flex items-center gap-3 sm:mb-9 lg:mb-11">
                            <span className="h-[2px] w-9 bg-accent sm:w-10" />

                            <p className="text-sm font-medium text-primary">
                                আমাদের লক্ষ্য
                            </p>
                        </div>

                        {/* Main statement */}

                        <div className="max-w-[1080px]">
                            <h1
                                className="
                                    font-bengali
                                    text-[2.35rem]
                                    font-medium
                                    leading-[1.32]
                                    tracking-[-0.012em]
                                    text-text-primary
                                    sm:text-[3rem]
                                    sm:leading-[1.3]
                                    md:text-[3.45rem]
                                    lg:text-[4rem]
                                    lg:leading-[1.28]
                                    xl:text-[4.55rem]
                                    xl:leading-[1.27]
                                "
                            >
                                যে মানুষটির সহায়তা প্রয়োজন,
                                <br className="hidden sm:block" />
                                আর যে মানুষটি পাশে দাঁড়াতে চান—
                                <span className="text-primary">
                                    {' '}
                                    তাদের মধ্যে দূরত্ব কমানোই আমাদের কাজ।
                                </span>
                            </h1>
                        </div>

                        {/* Intro */}

                        <div
                            className="
                                mt-8
                                md:ml-auto
                                md:max-w-[610px]
                                lg:mt-10
                                lg:mr-[5%]
                                xl:mr-[6%]
                            "
                        >
                            <p
                                className="
                                    text-base
                                    leading-[1.9]
                                    text-text-secondary
                                    sm:text-[17px]
                                    sm:leading-[1.9]
                                    lg:text-lg
                                "
                            >
                                Stand For People একটি কেন্দ্রীভূত মানবিক
                                প্ল্যাটফর্ম—যেখানে মানুষের বাস্তব প্রয়োজন,
                                মানবিক উদ্যোগ এবং সহায়তা করতে আগ্রহী মানুষ
                                পরস্পরকে আরও সহজে খুঁজে পেতে পারে।
                            </p>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    DOCUMENTARY IMAGE
                ====================================================== */}

                <div className="container-width">
                    <figure>
                        <div
                            className="
                                relative
                                h-[360px]
                                overflow-hidden
                                sm:h-[470px]
                                md:h-[550px]
                                lg:h-[630px]
                                xl:h-[690px]
                            "
                        >
                            <img
                                src={heroImage}
                                alt="মানবিক সহায়তা কার্যক্রমে কমিউনিটির মানুষ"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    object-center
                                "
                            />
                        </div>

                        <figcaption
                            className="
                                flex
                                flex-col
                                gap-3
                                border-b
                                border-border
                                py-4
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                                sm:gap-6
                            "
                        >
                            <p
                                className="
                                    max-w-xl
                                    text-sm
                                    leading-7
                                    text-text-secondary
                                "
                            >
                                মানবিক সহায়তার শুরু হয় মানুষের বাস্তব
                                প্রয়োজনকে দেখা, বোঝা এবং সঠিকভাবে তুলে ধরার
                                মাধ্যমে।
                            </p>

                            <span className="font-sans text-[11px] text-text-muted">
                                Stand For People
                            </span>
                        </figcaption>
                    </figure>
                </div>

                {/* Scroll hint */}

                <div className="container-width">
                    <div className="flex justify-end py-5 sm:py-6">
                        <a
                            href="#gap"
                            aria-label="পরবর্তী অংশে যান"
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-border-strong
                                text-primary
                                transition-colors
                                duration-200
                                hover:border-primary
                                hover:bg-primary
                                hover:text-white!
                            "
                        >
                            <TbArrowDown size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* =========================================================
                THE HUMANITARIAN GAP
            ========================================================== */}

            <section id="gap" className="bg-surface">
                <div
                    className="
                        container-width
                        py-16
                        sm:py-20
                        md:py-24
                        lg:py-28
                        xl:py-32
                    "
                >
                    <div className="max-w-[920px]">
                        <p className="text-sm font-medium text-primary">
                            সমস্যাটা কোথায়
                        </p>

                        <h2
                            className="
                                mt-4
                                font-bengali
                                text-[2.05rem]
                                font-medium
                                leading-[1.45]
                                tracking-[-0.01em]
                                text-text-primary
                                sm:text-[2.65rem]
                                sm:leading-[1.45]
                                lg:text-[3.2rem]
                                lg:leading-[1.4]
                            "
                        >
                            মানবিক সহায়তার পথে সব সময়
                            <span className="text-primary">
                                {' '}
                                সদিচ্ছার অভাব থাকে না।
                            </span>
                        </h2>

                        <p
                            className="
                                mt-6
                                max-w-[680px]
                                text-base
                                leading-[1.9]
                                text-text-secondary
                                sm:text-[17px]
                            "
                        >
                            অনেক সময় সমস্যা তৈরি হয় তথ্য ছড়িয়ে থাকা,
                            উদ্যোগের খবর মানুষের কাছে না পৌঁছানো এবং সঠিক
                            প্রয়োজনের সঙ্গে সঠিক সহায়তার সংযোগ না হওয়ার
                            কারণে।
                        </p>
                    </div>

                    {/* Asymmetric problem composition */}

                    <div className="mt-12 border-y border-border-strong lg:mt-16">
                        {/* Row 01 */}

                        <div
                            className="
                                grid
                                gap-5
                                border-b
                                border-border
                                py-8
                                md:grid-cols-[0.8fr_1.2fr]
                                md:items-start
                                md:gap-14
                                lg:py-10
                            "
                        >
                            <p
                                className="
                                    max-w-sm
                                    font-bengali
                                    text-[1.45rem]
                                    font-medium
                                    leading-[1.5]
                                    text-text-primary
                                    sm:text-[1.75rem]
                                "
                            >
                                প্রয়োজনের তথ্য
                                <span className="block text-primary">
                                    ছড়িয়ে থাকে।
                                </span>
                            </p>

                            <p
                                className="
                                    max-w-xl
                                    text-[15px]
                                    leading-[1.9]
                                    text-text-secondary
                                    md:ml-auto
                                    sm:text-base
                                "
                            >
                                কার কোথায় কী ধরনের সহায়তা প্রয়োজন—এই তথ্য
                                অনেক সময় বিভিন্ন ব্যক্তি, পোস্ট, সংগঠন এবং
                                প্ল্যাটফর্মে ছড়িয়ে থাকে।
                            </p>
                        </div>

                        {/* Row 02 */}

                        <div
                            className="
                                grid
                                gap-5
                                border-b
                                border-border
                                py-8
                                md:grid-cols-[1.2fr_0.8fr]
                                md:items-start
                                md:gap-14
                                lg:py-10
                            "
                        >
                            <p
                                className="
                                    max-w-xl
                                    text-[15px]
                                    leading-[1.9]
                                    text-text-secondary
                                    sm:text-base
                                "
                            >
                                অসংখ্য ব্যক্তি ও সংগঠন মানুষের পাশে কাজ করেন।
                                কিন্তু তাদের উদ্যোগ সব সময় সেই মানুষগুলোর কাছে
                                দৃশ্যমান হয় না, যারা অংশ নিতে চান।
                            </p>

                            <p
                                className="
                                    max-w-sm
                                    font-bengali
                                    text-[1.45rem]
                                    font-medium
                                    leading-[1.5]
                                    text-text-primary
                                    md:ml-auto
                                    sm:text-[1.75rem]
                                "
                            >
                                উদ্যোগ আছে।
                                <span className="block text-primary">
                                    কিন্তু সবাই জানে না।
                                </span>
                            </p>
                        </div>

                        {/* Row 03 */}

                        <div
                            className="
                                grid
                                gap-5
                                py-8
                                md:grid-cols-[0.8fr_1.2fr]
                                md:items-start
                                md:gap-14
                                lg:py-10
                            "
                        >
                            <p
                                className="
                                    max-w-sm
                                    font-bengali
                                    text-[1.45rem]
                                    font-medium
                                    leading-[1.5]
                                    text-text-primary
                                    sm:text-[1.75rem]
                                "
                            >
                                মানুষ সাহায্য করতে চান।
                                <span className="block text-primary">
                                    পথটি সব সময় স্পষ্ট নয়।
                                </span>
                            </p>

                            <p
                                className="
                                    max-w-xl
                                    text-[15px]
                                    leading-[1.9]
                                    text-text-secondary
                                    md:ml-auto
                                    sm:text-base
                                "
                            >
                                ইচ্ছা থাকা সত্ত্বেও কোথায় সাহায্য সবচেয়ে বেশি
                                প্রয়োজন, কোন উদ্যোগ সম্পর্কে কী জানা দরকার,
                                কিংবা কীভাবে অংশ নেওয়া যায়—তা খুঁজে পাওয়া
                                কঠিন হতে পারে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                THE SP INTERVENTION
            ========================================================== */}

            <section className="bg-background-warm">
                <div className="container-width">
                    <div
                        className="
                            relative
                            py-16
                            sm:py-20
                            md:py-24
                            lg:py-28
                            xl:py-32
                        "
                    >
                        {/* Large editorial statement */}

                        <div
                            className="
                                max-w-[980px]
                                md:ml-[6%]
                                lg:ml-[10%]
                                xl:ml-[12%]
                            "
                        >
                            <span className="block h-[3px] w-14 bg-accent" />

                            <h2
                                className="
                                    mt-7
                                    font-bengali
                                    text-[2.05rem]
                                    font-medium
                                    leading-[1.45]
                                    tracking-[-0.01em]
                                    text-text-primary
                                    sm:text-[2.75rem]
                                    sm:leading-[1.45]
                                    lg:text-[3.4rem]
                                    lg:leading-[1.42]
                                "
                            >
                                Stand For People এই বিচ্ছিন্ন পথগুলোর
                                <span className="text-primary">
                                    {' '}
                                    মাঝে একটি সাধারণ জায়গা তৈরি করতে চায়।
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-7
                                    max-w-[690px]
                                    text-base
                                    leading-[1.9]
                                    text-text-secondary
                                    md:ml-auto
                                    sm:text-[17px]
                                "
                            >
                                এমন একটি জায়গা, যেখানে মানুষ প্রয়োজন দেখতে
                                পারবেন, মানবিক উদ্যোগ খুঁজে পাবেন, কাজ করা সংগঠন
                                সম্পর্কে জানতে পারবেন এবং নিজের সামর্থ্য
                                অনুযায়ী পাশে দাঁড়ানোর পথ বেছে নিতে পারবেন।
                            </p>
                        </div>

                        {/* Four actions — content, not cards */}

                        <div
                            className="
                                mt-14
                                grid
                                border-t
                                border-border-strong
                                sm:grid-cols-2
                                lg:mt-20
                                lg:grid-cols-4
                            "
                        >
                            <div
                                className="
                                    border-b
                                    border-border
                                    py-7
                                    sm:border-r
                                    sm:px-6
                                    lg:border-b-0
                                    lg:px-7
                                    lg:py-9
                                "
                            >
                                <span className="text-xs font-medium text-primary">
                                    দেখুন
                                </span>

                                <p className="mt-3 text-[15px] leading-7 text-text-body">
                                    কোথায়, কার এবং কী ধরনের সহায়তা প্রয়োজন।
                                </p>
                            </div>

                            <div
                                className="
                                    border-b
                                    border-border
                                    py-7
                                    sm:px-6
                                    lg:border-b-0
                                    lg:border-r
                                    lg:px-7
                                    lg:py-9
                                "
                            >
                                <span className="text-xs font-medium text-primary">
                                    খুঁজুন
                                </span>

                                <p className="mt-3 text-[15px] leading-7 text-text-body">
                                    বাস্তব প্রয়োজনকে ঘিরে চলমান মানবিক উদ্যোগ।
                                </p>
                            </div>

                            <div
                                className="
                                    border-b
                                    border-border
                                    py-7
                                    sm:border-b-0
                                    sm:border-r
                                    sm:px-6
                                    lg:px-7
                                    lg:py-9
                                "
                            >
                                <span className="text-xs font-medium text-primary">
                                    বুঝুন
                                </span>

                                <p className="mt-3 text-[15px] leading-7 text-text-body">
                                    উদ্যোগটি কী করছে এবং সহায়তা কোথায় পৌঁছাবে।
                                </p>
                            </div>

                            <div
                                className="
                                    py-7
                                    sm:px-6
                                    lg:px-7
                                    lg:py-9
                                "
                            >
                                <span className="text-xs font-medium text-primary">
                                    যুক্ত হোন
                                </span>

                                <p className="mt-3 text-[15px] leading-7 text-text-body">
                                    সহায়তাকারী, স্বেচ্ছাসেবী বা সংগঠন হিসেবে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                HUMAN FIRST — PHOTO ESSAY
            ========================================================== */}

            <section className="bg-primary-deep">
                <div
                    className="
                        container-width
                        py-14
                        sm:py-16
                        md:py-20
                        lg:py-20
                        xl:py-24
                    "
                >
                    <div
                        className="
                            grid
                            gap-8
                            lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.65fr)]
                            lg:items-end
                            lg:gap-14
                            xl:gap-20
                        "
                    >
                        {/* Image */}

                        <figure>
                            <div
                                className="
                                    h-[380px]
                                    overflow-hidden
                                    sm:h-[480px]
                                    md:h-[530px]
                                    lg:h-[610px]
                                    xl:h-[630px]
                                "
                            >
                                <img
                                    src={fieldImage}
                                    alt="মানুষের সঙ্গে কাজ করছেন মানবিক উদ্যোগের স্বেচ্ছাসেবীরা"
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        object-center
                                    "
                                />
                            </div>

                            <figcaption
                                className="
                                    mt-3
                                    max-w-lg
                                    text-xs
                                    leading-6
                                    text-text-on-dark-muted
                                "
                            >
                                প্রতিটি উদ্যোগ, প্রতিটি প্রয়োজন এবং প্রতিটি
                                সহায়তার পেছনে আছেন বাস্তব মানুষ।
                            </figcaption>
                        </figure>

                        {/* Statement */}

                        <div className="pb-2 lg:pb-10">
                            <span className="block h-[2px] w-10 bg-accent" />

                            <h2
                                className="
                                    mt-6
                                    font-bengali
                                    text-[2rem]
                                    font-medium
                                    leading-[1.48]
                                    tracking-normal
                                    text-white!
                                    sm:text-[2.55rem]
                                    lg:text-[2.9rem]
                                "
                            >
                                আমরা বিশ্বাস করি,
                                <br />
                                সহায়তার গল্পের কেন্দ্রবিন্দু
                                <span className="text-primary-muted">
                                    {' '}
                                    প্ল্যাটফর্ম নয়।
                                </span>
                                <span className="mt-2 block text-accent-soft">
                                    মানুষ।
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-7
                                    max-w-md
                                    text-base
                                    leading-[1.9]
                                    text-text-on-dark-muted
                                "
                            >
                                প্রযুক্তি আমাদের কাজকে সহজ করতে পারে। তথ্যকে
                                সংগঠিত করতে পারে। মানুষকে কাছাকাছি আনতে পারে।
                                কিন্তু মানবিকতার জায়গাটি সব সময় মানুষেরই।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                PRINCIPLES
            ========================================================== */}

            <section className="bg-surface">
                <div
                    className="
                        container-width
                        py-16
                        sm:py-20
                        md:py-24
                        lg:py-28
                        xl:py-32
                    "
                >
                    <div
                        className="
                            grid
                            gap-10
                            lg:grid-cols-[0.6fr_1.4fr]
                            lg:gap-20
                            xl:gap-28
                        "
                    >
                        <div>
                            <p className="text-sm font-medium text-primary">
                                যেভাবে আমরা কাজ করতে চাই
                            </p>

                            <h2
                                className="
                                    mt-4
                                    max-w-sm
                                    font-bengali
                                    text-[1.95rem]
                                    font-medium
                                    leading-[1.48]
                                    tracking-normal
                                    sm:text-[2.35rem]
                                "
                            >
                                তিনটি বিষয় আমাদের
                                <span className="text-primary">
                                    {' '}
                                    সিদ্ধান্তকে পথ দেখায়।
                                </span>
                            </h2>
                        </div>

                        <div className="border-t border-border-strong">
                            {/* Coordination */}

                            <div
                                className="
                                    grid
                                    gap-4
                                    border-b
                                    border-border-strong
                                    py-8
                                    sm:grid-cols-[180px_1fr]
                                    sm:gap-10
                                    lg:py-10
                                "
                            >
                                <h3
                                    className="
                                        font-bengali
                                        text-[1.4rem]
                                        font-medium
                                        tracking-normal
                                        text-text-primary
                                    "
                                >
                                    সমন্বয়
                                </h3>

                                <p className="max-w-xl text-base leading-[1.9] text-text-secondary">
                                    যাতে একই মানবিক প্রয়োজনকে ঘিরে কাজ করা
                                    বিচ্ছিন্ন মানুষ ও উদ্যোগ একে অপরকে খুঁজে
                                    পায় এবং একই উদ্দেশ্যে আরও কার্যকরভাবে কাজ
                                    করতে পারে।
                                </p>
                            </div>

                            {/* Transparency */}

                            <div
                                className="
                                    grid
                                    gap-4
                                    border-b
                                    border-border-strong
                                    py-8
                                    sm:grid-cols-[180px_1fr]
                                    sm:gap-10
                                    lg:py-10
                                "
                            >
                                <h3
                                    className="
                                        font-bengali
                                        text-[1.4rem]
                                        font-medium
                                        tracking-normal
                                        text-text-primary
                                    "
                                >
                                    স্বচ্ছতা
                                </h3>

                                <p className="max-w-xl text-base leading-[1.9] text-text-secondary">
                                    যাতে মানুষ জানতে পারেন কোথায় প্রয়োজন, কী
                                    উদ্যোগ চলছে এবং কীভাবে তারা সচেতনভাবে ও
                                    দায়িত্বশীলভাবে অংশ নিতে পারেন।
                                </p>
                            </div>

                            {/* Dignity */}

                            <div
                                className="
                                    grid
                                    gap-4
                                    border-b
                                    border-border-strong
                                    py-8
                                    sm:grid-cols-[180px_1fr]
                                    sm:gap-10
                                    lg:py-10
                                "
                            >
                                <h3
                                    className="
                                        font-bengali
                                        text-[1.4rem]
                                        font-medium
                                        tracking-normal
                                        text-text-primary
                                    "
                                >
                                    মর্যাদা
                                </h3>

                                <p className="max-w-xl text-base leading-[1.9] text-text-secondary">
                                    কারণ প্রতিটি উদ্যোগ, প্রতিটি সংখ্যা এবং
                                    প্রতিটি সহায়তার অনুরোধের পেছনে একজন বাস্তব
                                    মানুষ আছেন—যার মর্যাদা ও পরিস্থিতি সবার আগে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                FINAL THOUGHT
            ========================================================== */}

            <section className="bg-background-warm">
                <div
                    className="
                        container-width
                        py-16
                        sm:py-20
                        md:py-24
                        lg:py-28
                    "
                >
                    <div className="border-t-[3px] border-primary pt-9 lg:pt-11">
                        <div
                            className="
                                grid
                                gap-8
                                lg:grid-cols-[minmax(0,1fr)_300px]
                                lg:items-end
                                lg:gap-16
                            "
                        >
                            <h2
                                className="
                                    max-w-[850px]
                                    font-bengali
                                    text-[2.05rem]
                                    font-medium
                                    leading-[1.48]
                                    tracking-normal
                                    text-text-primary
                                    sm:text-[2.7rem]
                                    lg:text-[3.2rem]
                                "
                            >
                                প্রযুক্তি সংযোগ তৈরি করতে পারে।
                                <span className="block text-primary">
                                    আস্থা তৈরি করে মানুষ।
                                </span>
                            </h2>

                            <div>
                                <p className="text-sm leading-7 text-text-secondary">
                                    সেই আস্থার ওপর দাঁড়িয়ে মানবিক সহায়তার
                                    একটি আরও সংযুক্ত পথ তৈরি করাই আমাদের
                                    উদ্দেশ্য।
                                </p>

                                <div className="mt-5 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-accent" />

                                    <span className="font-sans text-xs font-medium text-primary">
                                        Stand For People
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Mission;
