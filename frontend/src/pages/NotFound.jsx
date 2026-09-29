import React from 'react';

import { Link } from 'react-router-dom';

import {
    TbArrowLeft,
    TbArrowRight,
    TbHeartHandshake,
    TbHome,
    TbLifebuoy,
} from 'react-icons/tb';

import logo from '@/assets/shared/footerLogo.png';

const NotFound = () => {
    return (
        <main
            lang="bn"
            className="min-h-screen bg-background font-bengali text-text-primary"
        >
            <section className="relative flex min-h-screen overflow-hidden">
                {/* =====================================================
                    LEFT BRAND RAIL
                ====================================================== */}
                <div className="hidden w-[88px] shrink-0 border-r border-white/10 bg-primary-deep lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-8">
                    <Link
                        to="/"
                        aria-label="Stand For People হোম"
                        className="
                            flex h-12 w-12 items-center justify-center
                            rounded-full border border-white/15
                            text-text-on-dark
                            transition-colors duration-200
                            hover:bg-white/10
                        "
                    >
                        <img src={logo} alt="SP" />
                    </Link>

                    <span
                        className="
                            [writing-mode:vertical-rl]
                            rotate-180
                            font-sans
                            text-[11px]
                            font-medium
                            tracking-[0.18em]
                            text-text-on-dark-muted
                        "
                    >
                        STAND FOR PEOPLE
                    </span>

                    <span className="h-2 w-2 rounded-full bg-accent" />
                </div>

                {/* =====================================================
                    MAIN CONTENT
                ====================================================== */}
                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    {/* Top */}
                    <header className="border-b border-border/80">
                        <div className="container-width flex h-[72px] items-center justify-between sm:h-20">
                            {/* Mobile brand */}
                            <Link
                                to="/"
                                aria-label="Stand For People হোম"
                                className="flex items-center gap-3 lg:hidden"
                            >
                                <span
                                    className="
                                        flex h-9 w-9 items-center justify-center
                                        rounded-full bg-primary
                                        text-white!
                                        sm:h-10 sm:w-10
                                    "
                                >
                                    <TbHeartHandshake size={19} />
                                </span>

                                <span className="font-sans text-sm font-semibold text-primary-deep sm:text-[15px]">
                                    Stand For People
                                </span>
                            </Link>

                            {/* Desktop page indicator */}
                            <div className="hidden items-center gap-3 lg:flex">
                                <span className="h-px w-8 bg-primary" />

                                <span className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                                    Page not found
                                </span>
                            </div>

                            <span
                                className="
                                    rounded-full
                                    bg-primary-soft
                                    px-3.5 py-1.5
                                    font-sans
                                    text-xs
                                    font-semibold
                                    text-primary-deep
                                "
                            >
                                404
                            </span>
                        </div>
                    </header>

                    {/* Main */}
                    <div className="container-width flex flex-1 items-center">
                        <div
                            className="
                                grid
                                w-full
                                py-12
                                sm:py-14
                                md:py-16
                                lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.62fr)]
                                lg:items-center
                                lg:gap-16
                                lg:py-16
                                xl:gap-24
                                xl:py-20
                            "
                        >
                            {/* =================================================
                                MESSAGE
                            ================================================== */}
                            <div className="max-w-3xl">
                                <div className="mb-6 flex items-center gap-3 sm:mb-7">
                                    <span
                                        className="
                                            flex h-9 w-9 shrink-0
                                            items-center justify-center
                                            rounded-full
                                            bg-accent-soft
                                            text-accent-hover
                                        "
                                    >
                                        <TbLifebuoy size={18} />
                                    </span>

                                    <p className="text-sm font-medium text-primary">
                                        সঠিক পথটি খুঁজে নিতে আমরা সাহায্য করছি
                                    </p>
                                </div>

                                <h1
                                    className="
                                        max-w-[760px]
                                        text-[2.35rem]
                                        font-medium
                                        leading-[1.28]
                                        tracking-normal
                                        text-text-primary
                                        sm:text-[3rem]
                                        sm:leading-[1.25]
                                        lg:text-[3.35rem]
                                        xl:text-[4rem]
                                    "
                                >
                                    এই ঠিকানায় কোনো{' '}
                                    <span className="text-primary">
                                        পৃষ্ঠা পাওয়া যায়নি।
                                    </span>
                                </h1>

                                <p
                                    className="
                                        mt-5
                                        max-w-[650px]
                                        text-[15px]
                                        leading-[1.9]
                                        text-text-secondary
                                        sm:mt-6
                                        sm:text-base
                                        lg:mt-7
                                        lg:text-[17px]
                                    "
                                >
                                    আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি হয়তো
                                    স্থানান্তরিত হয়েছে, মুছে ফেলা হয়েছে অথবা
                                    লিংকটির ঠিকানা পরিবর্তন হয়েছে। নিচের পথগুলো
                                    থেকে আপনি আবার Stand For People-এর মূল
                                    কার্যক্রমে ফিরে যেতে পারেন।
                                </p>

                                {/* Actions */}
                                <div
                                    className="
                                        mt-7
                                        flex flex-col gap-2.5
                                        sm:mt-9
                                        sm:flex-row
                                        sm:items-center
                                    "
                                >
                                    <Link
                                        to="/"
                                        className="
                                            group
                                            inline-flex
                                            min-h-12
                                            items-center
                                            justify-center
                                            gap-2.5
                                            rounded-lg
                                            bg-primary
                                            px-5.5
                                            text-[15px]
                                            font-medium
                                            text-white!
                                            transition-colors
                                            duration-200
                                            hover:bg-primary-hover
                                            sm:min-h-13
                                            sm:px-6
                                        "
                                    >
                                        <TbHome size={19} />
                                        হোমপেজে ফিরে যান
                                        <TbArrowRight
                                            size={18}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="
                                            group
                                            inline-flex
                                            min-h-12
                                            items-center
                                            justify-center
                                            gap-2.5
                                            px-4
                                            text-[15px]
                                            font-medium
                                            text-text-body
                                            transition-colors
                                            duration-200
                                            hover:text-primary
                                            sm:min-h-13
                                            sm:px-5
                                        "
                                    >
                                        <TbArrowLeft
                                            size={19}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:-translate-x-1
                                            "
                                        />
                                        আগের পৃষ্ঠায় যান
                                    </button>
                                </div>
                            </div>

                            {/* =================================================
                                HUMANITARIAN WAYFINDING
                            ================================================== */}
                            <aside
                                className="
                                    relative
                                    mt-12
                                    border-l-2
                                    border-primary-muted
                                    pl-6
                                    sm:mt-14
                                    sm:pl-8
                                    lg:mt-0
                                    lg:pl-8
                                    xl:pl-9
                                "
                            >
                                {/* Accent marker */}
                                <span
                                    className="
                                        absolute
                                        -left-[5px]
                                        top-0
                                        h-2 w-2
                                        rounded-full
                                        bg-accent
                                    "
                                />

                                <p className="text-sm font-medium text-primary">
                                    কোথায় যেতে চান?
                                </p>

                                <h2
                                    className="
                                        mt-2
                                        text-2xl
                                        font-medium
                                        leading-[1.45]
                                        tracking-normal
                                        text-text-primary
                                        sm:text-[1.65rem]
                                    "
                                >
                                    সহায়তার পথগুলো
                                </h2>

                                <nav
                                    aria-label="সহায়তার গুরুত্বপূর্ণ পৃষ্ঠা"
                                    className="mt-5 sm:mt-6"
                                >
                                    <Link
                                        to="/campaigns"
                                        className="
                                            group
                                            flex items-center justify-between
                                            border-b border-border
                                            py-3.5
                                            text-[15px]
                                            font-medium
                                            text-text-body
                                            transition-colors
                                            duration-200
                                            hover:text-primary
                                            sm:py-4
                                            sm:text-base
                                        "
                                    >
                                        চলমান উদ্যোগ দেখুন
                                        <TbArrowRight
                                            size={19}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </Link>

                                    <Link
                                        to="/categories"
                                        className="
                                            group
                                            flex items-center justify-between
                                            border-b border-border
                                            py-3.5
                                            text-[15px]
                                            font-medium
                                            text-text-body
                                            transition-colors
                                            duration-200
                                            hover:text-primary
                                            sm:py-4
                                            sm:text-base
                                        "
                                    >
                                        সহায়তার ক্ষেত্র খুঁজুন
                                        <TbArrowRight
                                            size={19}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </Link>

                                    <Link
                                        to="/about"
                                        className="
                                            group
                                            flex items-center justify-between
                                            border-b border-border
                                            py-3.5
                                            text-[15px]
                                            font-medium
                                            text-text-body
                                            transition-colors
                                            duration-200
                                            hover:text-primary
                                            sm:py-4
                                            sm:text-base
                                        "
                                    >
                                        আমাদের সম্পর্কে জানুন
                                        <TbArrowRight
                                            size={19}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </Link>
                                </nav>

                                <div className="mt-7 bg-background-warm px-5 py-4.5 sm:mt-8 sm:px-6 sm:py-5">
                                    <p className="text-sm leading-7 text-text-secondary">
                                        জরুরি সহায়তা বা কোনো উদ্যোগ খুঁজছেন?
                                        চলমান উদ্যোগগুলো থেকে প্রয়োজনীয়
                                        সহায়তার ক্ষেত্র বেছে নিতে পারেন।
                                    </p>

                                    <Link
                                        to="/campaigns"
                                        className="
                                            group
                                            mt-2.5
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            text-sm
                                            font-medium
                                            text-primary
                                            transition-colors
                                            hover:text-primary-hover
                                        "
                                    >
                                        উদ্যোগগুলো দেখুন
                                        <TbArrowRight
                                            size={17}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </Link>
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* Bottom */}
                    <footer className="border-t border-border/80">
                        <div
                            className="
                                container-width
                                flex flex-col
                                gap-1.5
                                py-4
                                text-sm
                                text-text-secondary
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                sm:gap-2
                                sm:py-5
                            "
                        >
                            <p>মানুষের প্রয়োজনে, মানুষের পাশে।</p>

                            <p className="font-sans text-xs text-text-muted">
                                Stand For People
                            </p>
                        </div>
                    </footer>
                </div>
            </section>
        </main>
    );
};

export default NotFound;
