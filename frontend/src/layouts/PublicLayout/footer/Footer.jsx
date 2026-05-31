import React from 'react';
import { Link } from 'react-router-dom';

import logo from '@/assets/shared/logo.png';
import FooterLinks from './FooterLinks';

import footerPlatformData from './data/footerPlatformData';
import footerExploreData from './data/footerExploreData';
import footerResourceData from './data/footerResourceData';

import {
    TbBrandFacebook,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandTwitter,
    TbBrandYoutube,
    TbHeartHandshake,
} from 'react-icons/tb';

const socialIcons = [
    TbBrandFacebook,
    TbBrandTwitter,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandYoutube,
];

const Footer = () => {
    return (
        <footer className="relative bg-[#F7FAF8] border-t border-border overflow-hidden">
            {/* ambient */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[240px] bg-accent/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative container-width pt-20 sm:pt-24 pb-12">
                {/* INTRO */}
                <div className="mb-14 sm:mb-16 pb-10 sm:pb-12 border-b border-border/30">
                    <p className="text-[11px] sm:text-xs tracking-[0.3em] text-accent uppercase font-medium">
                        CareLink Foundation Network
                    </p>

                    <p
                        className="mt-5 sm:mt-6 text-[16px] sm:text-[18px] md:text-[20px]
                                  text-primary/75 leading-[1.7] max-w-2xl"
                    >
                        Transparent coordination connecting donors, volunteers,
                        and communities at impact scale.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* LEFT */}
                    <div className="lg:col-span-5 space-y-9">
                        {/* brand */}
                        <div className="flex items-center gap-4">
                            <img
                                src={logo}
                                alt="CareLink"
                                className="w-12 h-12 sm:w-14 sm:h-14"
                            />

                            <div>
                                <h3 className="text-[22px] sm:text-[24px] font-semibold text-primary leading-tight">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h3>

                                <p
                                    className="text-[12px] sm:text-[13px] tracking-[0.25em]
                                              text-text-secondary uppercase mt-1"
                                >
                                    Foundation Management
                                </p>
                            </div>
                        </div>

                        {/* description */}
                        <p
                            className="text-[15px] sm:text-[16px] text-text-secondary
                                      leading-[1.75] max-w-md"
                        >
                            Empowering accountable aid distribution through
                            structured coordination, volunteer engagement, and
                            transparent impact tracking.
                        </p>

                        {/* trust line */}
                        <div className="flex items-start gap-3 text-[14px] sm:text-[15px] text-primary/80 leading-relaxed">
                            <TbHeartHandshake
                                className="text-accent mt-1"
                                size={19}
                            />
                            <span>
                                Trusted humanitarian coordination platform
                            </span>
                        </div>

                        {/* socials */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {socialIcons.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-border
                                               flex items-center justify-center
                                               text-text-secondary
                                               hover:text-accent hover:bg-white
                                               transition-all duration-200"
                                >
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>

                        {/* support */}
                        <Link
                            to="/support"
                            className="inline-flex items-center text-[14px] sm:text-[15px]
                                       font-medium text-primary/75 hover:text-accent transition"
                        >
                            Contact support →
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-7 lg:pl-10 lg:border-l border-border/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                            <FooterLinks
                                title="Platform"
                                links={footerPlatformData}
                            />
                            <FooterLinks
                                title="Explore"
                                links={footerExploreData}
                            />
                            <FooterLinks
                                title="Resources"
                                links={footerResourceData}
                            />
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div
                    className="mt-16 sm:mt-20 pt-8 border-t border-border/30
                                flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <p className="text-[12px] sm:text-[13px] text-text-secondary leading-relaxed">
                        © 2026 CareLink Foundation Management System. All rights
                        reserved.
                    </p>

                    <p className="text-[12px] sm:text-[13px] text-primary/50 font-medium tracking-wide leading-relaxed">
                        Accountability • Transparency • Impact • Dignity
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
