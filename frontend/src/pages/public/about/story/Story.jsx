import React from 'react';

import { Link } from 'react-router-dom';
import { TbArrowDown, TbArrowUpRight } from 'react-icons/tb';

/*
|--------------------------------------------------------------------------
| TEMPORARY INTERNET IMAGES
|--------------------------------------------------------------------------
| Keep these for now. Replace with final local SP assets later.
|--------------------------------------------------------------------------
*/

const heroImage =
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=85';

const originImage =
    'https://images.unsplash.com/photo-1494386346843-e12284507169?auto=format&fit=crop&w=1400&q=85';

const peopleImage =
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85';

const Story = () => {
    return (
        <main
            lang="bn"
            className="overflow-hidden bg-surface font-bengali text-text-primary"
        >
            {/* =========================================================
                OPENING
            ========================================================== */}

            <section className="bg-surface">
                <div className="container-width mt-20">
                    <div
                        className="
                            pb-10
                            pt-14
                            sm:pb-12
                            sm:pt-16
                            md:pb-14
                            md:pt-20
                            lg:pb-16
                            lg:pt-24
                            xl:pt-28
                        "
                    >
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-9 bg-accent" />

                            <p className="text-sm font-medium text-primary">
                                আমাদের গল্প
                            </p>
                        </div>

                        <div
                            className="
                                mt-7
                                grid
                                gap-7
                                lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.5fr)]
                                lg:items-end
                                lg:gap-16
                                xl:gap-24
                            "
                        >
                            <h1
                                className="
                                    max-w-[920px]
                                    font-bengali
                                    text-[2.45rem]
                                    font-medium
                                    leading-[1.34]
                                    tracking-normal
                                    sm:text-[3.1rem]
                                    md:text-[3.5rem]
                                    lg:text-[4rem]
                                    lg:leading-[1.3]
                                    xl:text-[4.45rem]
                                "
                            >
                                একটি প্রশ্ন থেকে শুরু হয়ে
                                <span className="text-primary">
                                    {' '}
                                    একটি পথ তৈরি হলো।
                                </span>
                            </h1>

                            <div className="border-t border-border-strong pt-5">
                                <p
                                    className="
                                        text-base
                                        leading-[1.9]
                                        text-text-secondary
                                        sm:text-[17px]
                                    "
                                >
                                    Stand For People-এর গল্প কোনো সম্পূর্ণ হয়ে
                                    যাওয়া গল্প নয়। মানুষের প্রয়োজন, সাহায্য
                                    করার ইচ্ছা এবং সেই দুটির মধ্যে সংযোগ তৈরি
                                    করার চেষ্টা থেকেই এই পথচলার শুরু।
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* HERO PHOTO */}

                    <figure>
                        <div
                            className="
                                h-[340px]
                                overflow-hidden
                                sm:h-[450px]
                                md:h-[530px]
                                lg:h-[610px]
                                xl:h-[680px]
                            "
                        >
                            <img
                                src={heroImage}
                                alt="মানুষ একসঙ্গে মানবিক উদ্যোগে কাজ করছেন"
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        <figcaption
                            className="
                                grid
                                gap-3
                                border-b
                                border-border
                                py-4
                                sm:grid-cols-[1fr_auto]
                                sm:items-start
                                sm:gap-8
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
                                মানুষের পাশে দাঁড়ানোর ইচ্ছা অনেকেরই আছে। প্রশ্ন
                                ছিল—সেই ইচ্ছাকে সঠিক প্রয়োজনের কাছে পৌঁছানো
                                যায় কীভাবে?
                            </p>

                            <span className="text-xs text-text-muted">
                                Stand For People
                            </span>
                        </figcaption>
                    </figure>

                    <div className="flex justify-end py-5 sm:py-6">
                        <a
                            href="#story"
                            aria-label="গল্পের পরবর্তী অংশে যান"
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
                STORY JOURNEY
            ========================================================== */}

            <section id="story" className="bg-surface">
                <div
                    className="
                        container-width
                        pb-20
                        pt-12
                        sm:pb-24
                        sm:pt-16
                        lg:pb-28
                        lg:pt-20
                        xl:pb-32
                    "
                >
                    <div className="relative mx-auto max-w-[1180px]">
                        {/* DESKTOP STORY SPINE */}

                        <div
                            className="
                                absolute
                                bottom-0
                                left-1/2
                                top-0
                                hidden
                                w-px
                                -translate-x-1/2
                                bg-border-strong
                                lg:block
                            "
                        />

                        {/* =================================================
                            MOMENT 01 — BEGINNING
                        ================================================== */}

                        <article
                            className="
                                relative
                                grid
                                gap-8
                                pb-16
                                pt-5
                                lg:grid-cols-2
                                lg:gap-0
                                lg:pb-20
                                lg:pt-10
                            "
                        >
                            <div className="lg:pr-20 xl:pr-24">
                                <p className="text-sm font-medium text-primary">
                                    শুরু
                                </p>

                                <h2
                                    className="
                                        mt-4
                                        max-w-[600px]
                                        font-bengali
                                        text-[2rem]
                                        font-medium
                                        leading-[1.5]
                                        sm:text-[2.5rem]
                                        lg:text-[2.8rem]
                                    "
                                >
                                    আমরা একটি প্রযুক্তি বানানোর কথা দিয়ে শুরু
                                    করিনি।
                                </h2>

                                <p
                                    className="
                                        mt-5
                                        max-w-xl
                                        text-base
                                        leading-[1.95]
                                        text-text-secondary
                                        sm:text-[17px]
                                    "
                                >
                                    শুরু হয়েছিল একটি সমস্যাকে বোঝার চেষ্টা
                                    দিয়ে। মানুষের প্রয়োজনে পাশে দাঁড়াতে
                                    চাওয়া মানুষ এবং বাস্তবে সহায়তার প্রয়োজন
                                    থাকা মানুষের মধ্যে সংযোগটি অনেক সময় সহজ
                                    নয়।
                                </p>
                            </div>

                            <div className="hidden lg:block" />

                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-[58px]
                                    hidden
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    bg-accent
                                    ring-[7px]
                                    ring-surface
                                    lg:block
                                "
                            />
                        </article>

                        {/* =================================================
                            ORIGIN IMAGE
                        ================================================== */}

                        <article
                            className="
                                relative
                                grid
                                gap-8
                                pb-20
                                lg:grid-cols-2
                                lg:gap-0
                                lg:pb-24
                            "
                        >
                            <div className="hidden lg:block" />

                            <figure className="lg:pl-20 xl:pl-24">
                                <div
                                    className="
                                        h-[360px]
                                        overflow-hidden
                                        sm:h-[450px]
                                        md:h-[500px]
                                        lg:h-[520px]
                                    "
                                >
                                    <img
                                        src={originImage}
                                        alt="মানবিক সহায়তার সঙ্গে যুক্ত একজন মানুষ"
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
                                        max-w-sm
                                        text-xs
                                        leading-6
                                        text-text-muted
                                    "
                                >
                                    কোথায় সাহায্য দরকার, কে পাশে দাঁড়াচ্ছেন
                                    এবং কীভাবে যুক্ত হওয়া যায়—এই সাধারণ
                                    প্রশ্নগুলোর উত্তর সব সময় সহজে পাওয়া যায়
                                    না।
                                </figcaption>
                            </figure>
                        </article>

                        {/* =================================================
                            MOMENT 02 — REALIZATION
                        ================================================== */}

                        <article
                            className="
                                relative
                                py-14
                                sm:py-16
                                lg:py-20
                            "
                        >
                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-0
                                    hidden
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    bg-primary
                                    ring-[7px]
                                    ring-surface
                                    lg:block
                                "
                            />

                            <div
                                className="
                                    relative
                                    z-10
                                    mx-auto
                                    max-w-[820px]
                                    bg-surface
                                    lg:px-12
                                    xl:px-16
                                "
                            >
                                <div className="text-center">
                                    <p className="text-sm font-medium text-primary">
                                        প্রথম উপলব্ধি
                                    </p>

                                    <h2
                                        className="
                                            mx-auto
                                            mt-4
                                            max-w-[760px]
                                            font-bengali
                                            text-[2.15rem]
                                            font-medium
                                            leading-[1.5]
                                            sm:text-[2.7rem]
                                            lg:text-[3.15rem]
                                        "
                                    >
                                        সমস্যাটি শুধু
                                        <span className="text-primary">
                                            {' '}
                                            সাহায্যের অভাব নয়।
                                        </span>
                                    </h2>

                                    <p
                                        className="
                                            mx-auto
                                            mt-5
                                            max-w-[610px]
                                            text-base
                                            leading-[1.95]
                                            text-text-secondary
                                            sm:text-[17px]
                                        "
                                    >
                                        অনেক সময় প্রয়োজন এবং সহায়তার মধ্যে
                                        সংযোগ তৈরি করার মতো একটি পরিষ্কার,
                                        বোধগম্য এবং নির্ভরযোগ্য পথই অনুপস্থিত
                                        থাকে।
                                    </p>
                                </div>

                                <blockquote
                                    className="
                                        mx-auto
                                        mt-8
                                        max-w-[680px]
                                        border-y
                                        border-border-strong
                                        py-6
                                        text-center
                                        sm:py-7
                                    "
                                >
                                    <p
                                        className="
                                            font-bengali
                                            text-[1.35rem]
                                            font-medium
                                            leading-[1.7]
                                            text-text-primary
                                            sm:text-[1.6rem]
                                        "
                                    >
                                        “প্রয়োজন আর সহায়তার মাঝে একটি পরিষ্কার
                                        পথ দরকার।”
                                    </p>
                                </blockquote>
                            </div>
                        </article>

                        {/* =================================================
                            MOMENT 03 — IDEA
                        ================================================== */}

                        <article
                            className="
                                relative
                                grid
                                gap-8
                                py-14
                                sm:py-16
                                lg:grid-cols-2
                                lg:gap-0
                                lg:py-20
                            "
                        >
                            <div className="hidden lg:block" />

                            <div className="lg:pl-20 xl:pl-24">
                                <p className="text-sm font-medium text-primary">
                                    ভাবনা
                                </p>

                                <h3
                                    className="
                                        mt-4
                                        font-bengali
                                        text-[1.8rem]
                                        font-medium
                                        leading-[1.55]
                                        sm:text-[2.15rem]
                                    "
                                >
                                    সমস্যাটিকে নতুনভাবে দেখা
                                </h3>

                                <p
                                    className="
                                        mt-5
                                        max-w-md
                                        text-base
                                        leading-[1.9]
                                        text-text-secondary
                                    "
                                >
                                    প্রয়োজন, মানবিক উদ্যোগ এবং মানুষের
                                    অংশগ্রহণকে আলাদা আলাদা বিষয় হিসেবে না দেখে
                                    একটি সংযুক্ত অভিজ্ঞতা হিসেবে ভাবার শুরু হয়।
                                </p>
                            </div>

                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-[88px]
                                    hidden
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    bg-primary
                                    ring-[7px]
                                    ring-surface
                                    lg:block
                                "
                            />
                        </article>

                        {/* =================================================
                            MOMENT 04 — BUILD
                        ================================================== */}

                        <article
                            className="
                                relative
                                grid
                                gap-8
                                py-14
                                sm:py-16
                                lg:grid-cols-2
                                lg:gap-0
                                lg:py-20
                            "
                        >
                            <div className="lg:pr-20 lg:text-right xl:pr-24">
                                <p className="text-sm font-medium text-primary">
                                    নির্মাণ
                                </p>

                                <h3
                                    className="
                                        mt-4
                                        font-bengali
                                        text-[1.8rem]
                                        font-medium
                                        leading-[1.55]
                                        sm:text-[2.15rem]
                                    "
                                >
                                    ধারণাকে বাস্তব রূপ দেওয়া
                                </h3>

                                <p
                                    className="
                                        mt-5
                                        max-w-md
                                        text-base
                                        leading-[1.9]
                                        text-text-secondary
                                        lg:ml-auto
                                    "
                                >
                                    প্রয়োজন দেখা, উদ্যোগ খোঁজা, সংগঠন সম্পর্কে
                                    জানা এবং নিজের সামর্থ্য অনুযায়ী পাশে
                                    দাঁড়ানোর পথগুলোকে একই অভিজ্ঞতার মধ্যে আনার
                                    কাজ শুরু হয়।
                                </p>
                            </div>

                            <div className="hidden lg:block" />

                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-[88px]
                                    hidden
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    bg-accent
                                    ring-[7px]
                                    ring-surface
                                    lg:block
                                "
                            />
                        </article>

                        {/* =================================================
                            MOMENT 05 — LEARNING
                        ================================================== */}

                        <article
                            className="
                                relative
                                grid
                                gap-8
                                py-14
                                sm:py-16
                                lg:grid-cols-2
                                lg:gap-0
                                lg:py-20
                            "
                        >
                            <div className="hidden lg:block" />

                            <div className="lg:pl-20 xl:pl-24">
                                <p className="text-sm font-medium text-primary">
                                    শেখা
                                </p>

                                <h3
                                    className="
                                        mt-4
                                        font-bengali
                                        text-[1.8rem]
                                        font-medium
                                        leading-[1.55]
                                        sm:text-[2.15rem]
                                    "
                                >
                                    বাস্তব অভিজ্ঞতা থেকে শেখা
                                </h3>

                                <p
                                    className="
                                        mt-5
                                        max-w-md
                                        text-base
                                        leading-[1.9]
                                        text-text-secondary
                                    "
                                >
                                    একটি মানবিক প্ল্যাটফর্ম শুধু প্রযুক্তি দিয়ে
                                    তৈরি হয় না। মানুষের বাস্তব অভিজ্ঞতা,
                                    প্রয়োজন এবং অংশগ্রহণ থেকে কীভাবে আরও ভালো
                                    করা যায়—সেই শেখার প্রক্রিয়াটিও এর অংশ।
                                </p>
                            </div>

                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-[88px]
                                    hidden
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    bg-primary
                                    ring-[7px]
                                    ring-surface
                                    lg:block
                                "
                            />
                        </article>

                        {/* =================================================
                            MOMENT 06 — TODAY
                        ================================================== */}

                        <article
                            className="
                                relative
                                grid
                                gap-8
                                pb-8
                                pt-14
                                sm:pt-16
                                lg:grid-cols-2
                                lg:gap-0
                                lg:pb-10
                                lg:pt-20
                            "
                        >
                            <div className="lg:pr-20 lg:text-right xl:pr-24">
                                <p className="text-sm font-medium text-primary">
                                    আজ
                                </p>

                                <h3
                                    className="
                                        mt-4
                                        font-bengali
                                        text-[1.8rem]
                                        font-medium
                                        leading-[1.55]
                                        sm:text-[2.15rem]
                                    "
                                >
                                    আরও অর্থপূর্ণ সংযোগের দিকে
                                </h3>

                                <p
                                    className="
                                        mt-5
                                        max-w-md
                                        text-base
                                        leading-[1.9]
                                        text-text-secondary
                                        lg:ml-auto
                                    "
                                >
                                    Stand For People এখন মানুষের প্রয়োজন,
                                    মানবিক উদ্যোগ এবং অংশগ্রহণের পথগুলোকে আরও
                                    পরিষ্কার ও সহজভাবে একই অভিজ্ঞতায় যুক্ত করার
                                    দিকে এগিয়ে যাচ্ছে।
                                </p>
                            </div>

                            <div className="hidden lg:block" />

                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-[88px]
                                    hidden
                                    h-3
                                    w-3
                                    -translate-x-1/2
                                    rounded-full
                                    bg-accent
                                    ring-[7px]
                                    ring-surface
                                    lg:block
                                "
                            />
                        </article>
                    </div>
                </div>
            </section>

            {/* =========================================================
                WHAT THE JOURNEY TAUGHT US
            ========================================================== */}

            <section className="bg-background-warm">
                <div
                    className="
                        container-width
                        py-16
                        sm:py-20
                        lg:py-24
                        xl:py-28
                    "
                >
                    <div
                        className="
                            grid
                            gap-8
                            lg:grid-cols-[240px_minmax(0,1fr)]
                            lg:gap-16
                            xl:grid-cols-[260px_minmax(0,1fr)]
                            xl:gap-24
                        "
                    >
                        <div>
                            <p className="text-sm font-medium text-primary">
                                যা পথটি শিখিয়েছে
                            </p>

                            <p
                                className="
                                    mt-4
                                    max-w-[220px]
                                    text-sm
                                    leading-7
                                    text-text-secondary
                                "
                            >
                                তৈরি করতে করতে কিছু বিষয় আমাদের কাজের ভিত্তির
                                অংশ হয়ে উঠেছে।
                            </p>
                        </div>

                        <div className="border-t border-text-primary">
                            {/* 01 */}

                            <div
                                className="
                                    flex
                                    items-baseline
                                    justify-between
                                    gap-8
                                    border-b
                                    border-border-strong
                                    py-6
                                    sm:py-7
                                    lg:py-8
                                "
                            >
                                <h2
                                    className="
                                        font-bengali
                                        text-[1.55rem]
                                        font-medium
                                        leading-[1.5]
                                        sm:text-[1.9rem]
                                        lg:text-[2.2rem]
                                    "
                                >
                                    মানুষের প্রয়োজন আগে
                                </h2>

                                <span className="shrink-0 text-xs text-text-muted">
                                    ০১
                                </span>
                            </div>

                            {/* 02 */}

                            <div
                                className="
                                    flex
                                    items-baseline
                                    justify-between
                                    gap-8
                                    border-b
                                    border-border-strong
                                    py-6
                                    sm:ml-[7%]
                                    sm:py-7
                                    lg:py-8
                                "
                            >
                                <h2
                                    className="
                                        font-bengali
                                        text-[1.55rem]
                                        font-medium
                                        leading-[1.5]
                                        sm:text-[1.9rem]
                                        lg:text-[2.2rem]
                                    "
                                >
                                    পরিষ্কার তথ্য গুরুত্বপূর্ণ
                                </h2>

                                <span className="shrink-0 text-xs text-text-muted">
                                    ০২
                                </span>
                            </div>

                            {/* 03 */}

                            <div
                                className="
                                    flex
                                    items-baseline
                                    justify-between
                                    gap-8
                                    border-b
                                    border-border-strong
                                    py-6
                                    sm:ml-[14%]
                                    sm:py-7
                                    lg:py-8
                                "
                            >
                                <h2
                                    className="
                                        font-bengali
                                        text-[1.55rem]
                                        font-medium
                                        leading-[1.5]
                                        sm:text-[1.9rem]
                                        lg:text-[2.2rem]
                                    "
                                >
                                    আস্থা সময় নিয়ে তৈরি হয়
                                </h2>

                                <span className="shrink-0 text-xs text-text-muted">
                                    ০৩
                                </span>
                            </div>

                            {/* 04 */}

                            <div
                                className="
                                    flex
                                    items-baseline
                                    justify-between
                                    gap-8
                                    border-b
                                    border-border-strong
                                    py-6
                                    sm:ml-[21%]
                                    sm:py-7
                                    lg:py-8
                                "
                            >
                                <h2
                                    className="
                                        font-bengali
                                        text-[1.55rem]
                                        font-medium
                                        leading-[1.5]
                                        sm:text-[1.9rem]
                                        lg:text-[2.2rem]
                                    "
                                >
                                    শেখা কখনো শেষ নয়
                                </h2>

                                <span className="shrink-0 text-xs text-text-muted">
                                    ০৪
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                FINAL DOCUMENTARY MOMENT
            ========================================================== */}

            <section className="bg-surface">
                <div
                    className="
                        container-width
                        pb-16
                        pt-14
                        sm:pb-20
                        sm:pt-16
                        lg:pb-24
                        lg:pt-20
                        xl:pb-28
                        xl:pt-24
                    "
                >
                    <figure>
                        <div
                            className="
                                h-[380px]
                                overflow-hidden
                                sm:h-[500px]
                                md:h-[580px]
                                lg:h-[650px]
                                xl:h-[700px]
                            "
                        >
                            <img
                                src={peopleImage}
                                alt="মানুষ একসঙ্গে কাজ করছেন এবং একে অপরের পাশে দাঁড়াচ্ছেন"
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
                                text-xs
                                leading-6
                                text-text-muted
                            "
                        >
                            প্রযুক্তি পথ তৈরি করতে পারে। পথটিকে অর্থপূর্ণ করে
                            মানুষের অংশগ্রহণ।
                        </figcaption>
                    </figure>

                    {/* ENDING */}

                    <div
                        className="
                            mt-9
                            grid
                            gap-7
                            border-t
                            border-border-strong
                            pt-8
                            lg:mt-11
                            lg:grid-cols-[minmax(0,1fr)_320px]
                            lg:items-end
                            lg:gap-16
                            lg:pt-10
                        "
                    >
                        <div>
                            <p className="text-sm font-medium text-primary">
                                আজও
                            </p>

                            <h2
                                className="
                                    mt-3
                                    max-w-[820px]
                                    font-bengali
                                    text-[2.1rem]
                                    font-medium
                                    leading-[1.5]
                                    sm:text-[2.7rem]
                                    lg:text-[3.25rem]
                                "
                            >
                                গল্পটি এখনও
                                <span className="text-primary">
                                    {' '}
                                    লেখা হচ্ছে।
                                </span>
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm leading-7 text-text-secondary">
                                মানুষের পাশে দাঁড়ানোর আরও ভালো পথ খোঁজা, বাস্তব
                                অভিজ্ঞতা থেকে শেখা এবং আরও অর্থপূর্ণ সংযোগ তৈরি
                                করার কাজও তাই চলছে।
                            </p>

                            <Link
                                to="/campaigns"
                                className="
                                    group
                                    mt-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    border-b
                                    border-primary
                                    pb-1
                                    text-sm
                                    font-medium
                                    text-primary
                                "
                            >
                                বর্তমান উদ্যোগগুলো দেখুন
                                <TbArrowUpRight
                                    size={17}
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
            </section>
        </main>
    );
};

export default Story;
