import React from 'react';
import { Link } from 'react-router-dom';
import {
    TbBrandFacebook,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandTwitter,
} from 'react-icons/tb';

import { footerLinks, legalLinks } from './data/data.js';

const iconMap = {
    facebook: TbBrandFacebook,
    twitter: TbBrandTwitter,
    instagram: TbBrandInstagram,
    linkedin: TbBrandLinkedin,
};

const Footer = () => {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container-width">
                {/* ================================
                    MAIN FOOTER
                ================================= */}
                <div className="grid grid-cols-1 gap-12 xl:gap-24 py-14 md:grid-cols-12 md:gap-10 lg:py-16">
                    {/* BRAND */}
                    <div className="md:col-span-5">
                        <Link
                            to="/"
                            className="
                                inline-block
                                rounded-sm
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary
                                focus-visible:ring-offset-4
                            "
                            aria-label="Stand For People-এর হোমপেজ"
                        >
                            <span
                                className="
                                    text-[24px]
                                    font-bold
                                    tracking-[-0.02em]
                                    text-primary
                                "
                            >
                                Stand For People
                            </span>
                        </Link>

                        <p
                            className="
                                mt-5
                                max-w-md
                                text-[14px]
                                leading-[1.9]
                                text-text-secondary
                            "
                        >
                            প্রয়োজনের সময় মানুষের পাশে দাঁড়ানো, সহায়তা পৌঁছে
                            দেওয়া এবং দাতা, স্বেচ্ছাসেবী ও সংগঠনকে একসাথে কাজ
                            করার সুযোগ তৈরি করাই আমাদের লক্ষ্য।
                        </p>

                        {/* SOCIAL */}
                        <div className="mt-6 flex items-center gap-2.5">
                            {Object.entries(iconMap).map(
                                ([key, IconComponent]) => {
                                    const Icon = IconComponent;

                                    return (
                                        <a
                                            key={key}
                                            href="/"
                                            aria-label={key}
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-border
                                                bg-surface
                                                text-text-muted
                                                transition-all
                                                duration-200
                                                hover:border-primary/40
                                                hover:bg-background-teal
                                                hover:text-primary
                                                focus:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-primary
                                                focus-visible:ring-offset-2
                                            "
                                        >
                                            <Icon size={17} />
                                        </a>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* LINK GROUPS */}
                    <div
                        className="
                            md:col-span-7
                            grid
                            grid-cols-2
                            gap-x-8
                            gap-y-10
                            sm:grid-cols-3
                        "
                    >
                        {footerLinks.map((group, i) => (
                            <div key={i} className="min-w-0">
                                <h4
                                    className="
                                        mb-4
                                        text-[12px]
                                        font-semibold
                                        tracking-[0.04em]
                                        text-text-primary
                                    "
                                >
                                    {group.title}
                                </h4>

                                <div className="space-y-2.5">
                                    {group.links.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            to={item.to}
                                            className="
                                                block
                                                w-fit
                                                max-w-full
                                                text-[13px]
                                                font-normal
                                                leading-[1.7]
                                                text-text-muted
                                                transition-colors
                                                duration-200
                                                hover:text-primary
                                                focus:outline-none
                                                focus-visible:text-primary
                                            "
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================================
                    SUPPORT STRIP
                ================================= */}
                <div
                    className="
                        mb-10
                        flex
                        flex-col
                        gap-4
                        rounded-xl
                        border
                        border-primary/10
                        bg-background-teal
                        px-5
                        py-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-6
                    "
                >
                    <div>
                        <p
                            className="
                                text-[14px]
                                font-semibold
                                text-text-primary
                            "
                        >
                            মানুষের পাশে দাঁড়াতে চান?
                        </p>

                        <p
                            className="
                                mt-1
                                text-[12px]
                                leading-[1.7]
                                text-text-secondary
                            "
                        >
                            আপনার ছোট একটি উদ্যোগও কারও জীবনে বড় পরিবর্তন আনতে
                            পারে।
                        </p>
                    </div>

                    <Link
                        to="/donate"
                        className="
                            inline-flex
                            w-fit
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-primary
                            px-4
                            py-2.5
                            text-[13px]
                            font-semibold
                            text-white
                            transition-colors
                            duration-200
                            hover:bg-primary-hover
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            focus-visible:ring-offset-2
                        "
                    >
                        দান করুন
                    </Link>
                </div>

                {/* ================================
                    BOTTOM
                ================================= */}
                <div
                    className="
                        border-t
                        border-border
                        py-6
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >
                        {/* LEGAL */}
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {legalLinks.map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.to}
                                    className="
                                        text-[11px]
                                        font-normal
                                        text-text-muted
                                        transition-colors
                                        duration-200
                                        hover:text-primary
                                        focus:outline-none
                                        focus-visible:text-primary
                                    "
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* COPYRIGHT */}
                        <p
                            className="
                                text-[11px]
                                leading-relaxed
                                text-text-muted
                            "
                        >
                            © 2026 Stand For People
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
