import React from 'react';

import { Link } from 'react-router-dom';

import {
    TbArrowUpRight,
    TbBrandFacebook,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandTwitter,
} from 'react-icons/tb';

import { footerLinks, legalLinks } from './data/data.js';

const socials = [
    {
        label: 'Facebook',
        icon: TbBrandFacebook,
        href: '/',
    },
    {
        label: 'Instagram',
        icon: TbBrandInstagram,
        href: '/',
    },
    {
        label: 'LinkedIn',
        icon: TbBrandLinkedin,
        href: '/',
    },
    {
        label: 'Twitter',
        icon: TbBrandTwitter,
        href: '/',
    },
];

const Footer = () => {
    return (
        <footer className="relative overflow-hidden bg-primary-deep text-white!">
            {/* =========================================================
                SUBTLE BACKGROUND DETAIL
            ========================================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-28
                    top-16
                    h-72
                    w-72
                    rounded-full
                    bg-accent/[0.035]
                    blur-3xl
                "
            />

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    left-1/2
                    h-[30rem]
                    w-[30rem]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/[0.018]
                    blur-3xl
                "
            />

            <div className="container-width relative z-10">
                {/* =====================================================
                    INTRO
                ====================================================== */}

                <div
                    className="
                        grid
                        gap-10
                        py-12
                        sm:py-14
                        lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.55fr)]
                        lg:items-end
                        lg:gap-20
                        lg:py-16
                        xl:py-20
                    "
                >
                    {/* =================================================
                        BRAND / MESSAGE
                    ================================================== */}

                    <div>
                        <Link
                            to="/"
                            aria-label="Stand For People-এর হোমপেজ"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-3
                                rounded-sm
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-accent
                                focus-visible:ring-offset-4
                                focus-visible:ring-offset-primary-deep
                            "
                        >
                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-accent
                                    transition-transform
                                    duration-300
                                    group-hover:scale-125
                                "
                            />

                            <span
                                className="
                                    text-[12px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-white!
                                "
                            >
                                Stand For People
                            </span>
                        </Link>

                        <h2
                            className="
                                mt-6
                                max-w-[680px]
                                font-bengali
                                text-[1.75rem]
                                font-semibold
                                leading-[1.5]
                                tracking-[-0.025em]
                                text-white!
                                sm:text-[2rem]
                                lg:mt-7
                                lg:text-[2.45rem]
                                lg:leading-[1.48]
                                xl:text-[2.7rem]
                            "
                        >
                            একজন মানুষের প্রয়োজন
                            <span className="text-white/45">
                                {' '}
                                আরেকজন মানুষের কাছে পৌঁছে দেওয়ার
                            </span>{' '}
                            একটি বিশ্বাসযোগ্য জায়গা।
                        </h2>

                        {/* =================================================
                            SOCIAL ICONS
                            DESKTOP/LG POSITION LEFT EXACTLY AS ORIGINAL
                        ================================================== */}

                        <div
                            className="
                                mt-12
                                flex
                                flex-col
                                items-start
                                sm:mt-14
                                sm:col-span-2
                                lg:mt-20
                                lg:col-span-1
                                lg:items-end
                            "
                        >
                            <span
                                className="
                                    mb-4
                                    font-bengali
                                    text-[13px]
                                    font-medium
                                    leading-none
                                    text-white/45
                                    sm:mb-5
                                "
                            >
                                আমাদের সাথে থাকুন
                            </span>

                            <div className="flex items-center gap-2.5 mb-4 lg:mb-0">
                                {socials.map((social) => {
                                    const Icon = social.icon;

                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="
                                                group
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-white/10
                                                text-white/45
                                                transition-all
                                                duration-200
                                                hover:border-accent/40
                                                hover:bg-accent/10
                                                hover:text-white!
                                                focus:outline-none
                                                focus-visible:border-accent
                                                focus-visible:text-accent
                                            "
                                        >
                                            <Icon
                                                size={16}
                                                strokeWidth={1.8}
                                                className="
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-accent
                                                "
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        SUPPORTING MESSAGE
                    ================================================== */}

                    <div
                        className="
                            border-l
                            border-white/10
                            pl-5
                            sm:pl-6
                            lg:mb-1
                            lg:max-w-[310px]
                        "
                    >
                        <p
                            className="
                                font-bengali
                                text-[14px]
                                font-medium
                                leading-[1.9]
                                text-white!
                                sm:text-[15px]
                            "
                        >
                            সহায়তা যেখানে শুধু লেনদেন নয়—
                            <br />
                            মানুষের সাথে মানুষের সংযোগ।
                        </p>

                        <Link
                            to="/how-it-works"
                            className="
                                group
                                mt-5
                                inline-flex
                                items-center
                                gap-2
                                text-[12px]
                                font-medium
                                text-white/55
                                transition-colors
                                duration-200
                                hover:text-white!
                                focus:outline-none
                                focus-visible:text-accent
                            "
                        >
                            <span>কীভাবে কাজ করে</span>

                            <TbArrowUpRight
                                size={15}
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-0.5
                                    group-hover:-translate-y-0.5
                                "
                            />
                        </Link>
                    </div>
                </div>

                {/* =====================================================
                    DIVIDER
                ====================================================== */}

                <div className="h-px bg-white/10" />

                {/* =====================================================
                    NAVIGATION
                ====================================================== */}

                <div
                    className="
                        grid
                        gap-8
                        py-10
                        sm:grid-cols-2
                        sm:gap-x-10
                        sm:gap-y-10
                        sm:py-12
                        lg:grid-cols-3
                        lg:gap-12
                        lg:py-14
                    "
                >
                    {footerLinks.map((group, groupIndex) => (
                        <div key={groupIndex} className="min-w-0">
                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-3
                                    sm:mb-5
                                "
                            >
                                <span
                                    className="
                                        h-px
                                        w-6
                                        shrink-0
                                        bg-accent
                                    "
                                />

                                <h3
                                    className="
                                        font-bengali
                                        text-[13px]
                                        font-semibold
                                        text-white!
                                        sm:text-[15px]
                                    "
                                >
                                    {group.title}
                                </h3>
                            </div>

                            <nav
                                className="
                                    flex
                                    flex-col
                                    items-start
                                    gap-2.5
                                    sm:gap-3
                                "
                            >
                                {group.links.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.to}
                                        className="
                                            group
                                            inline-flex
                                            items-center
                                            font-bengali
                                            text-[12px]
                                            leading-[1.8]
                                            text-white/55
                                            transition-all
                                            duration-200
                                            hover:translate-x-1
                                            hover:text-white!
                                            focus:outline-none
                                            focus-visible:text-accent
                                            sm:text-[14px]
                                        "
                                    >
                                        <span
                                            className="
                                                mr-2
                                                h-1
                                                w-1
                                                shrink-0
                                                scale-0
                                                rounded-full
                                                bg-accent
                                                transition-transform
                                                duration-200
                                                group-hover:scale-100
                                            "
                                        />

                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>
            </div>

            {/* =========================================================
                DEEPER BOTTOM BAR
            ========================================================== */}

            <div
                className="
                    relative
                    border-t
                    border-white/[0.06]
                    bg-black/15
                "
            >
                <div className="container-width">
                    <div
                        className="
                            flex
                            min-h-[58px]
                            flex-col
                            gap-3
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:gap-6
                            sm:py-0
                        "
                    >
                        {/* Brand + copyright */}

                        <p
                            className="
                                shrink-0
                                text-[11px]
                                font-medium
                                text-white/35
                                sm:text-[12px]
                            "
                        >
                            Stand For People
                            <span className="mx-2 text-white/15">•</span>© 2026
                        </p>

                        {/* Legal links */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-x-4
                                gap-y-2
                                sm:justify-end
                                sm:gap-x-5
                            "
                        >
                            {legalLinks.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="
                                        whitespace-nowrap
                                        font-bengali
                                        text-[11px]
                                        text-white/35
                                        transition-colors
                                        duration-200
                                        hover:text-white!
                                        focus:outline-none
                                        focus-visible:text-accent
                                        sm:text-[12px]
                                    "
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
