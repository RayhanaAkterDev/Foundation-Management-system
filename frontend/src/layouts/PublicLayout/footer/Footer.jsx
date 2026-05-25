import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../../assets/images/shared/logo.png';
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
        <footer className="relative mt-24 bg-[#F7FAF8] border-t border-border overflow-hidden">
            {/* ambient background */}
            <div className="absolute inset-0 pointer-events-none opacity-50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-60 bg-accent/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative container-width pt-16 sm:pt-20 pb-10">
                {/* intro */}
                <div className="mb-12 sm:mb-14 pb-8 sm:pb-10 border-b border-border/30">
                    <p className="text-[11px] sm:text-xs tracking-[0.28em] text-accent uppercase font-medium">
                        CareLink Foundation Network
                    </p>

                    <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] md:text-[18px] text-primary/75 max-w-2xl leading-relaxed">
                        Transparent coordination connecting donors, volunteers,
                        and communities at impact scale.
                    </p>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    {/* LEFT */}
                    <div className="lg:col-span-5 space-y-7 sm:space-y-8 max-w-xl lg:max-w-none">
                        {/* brand */}
                        <div className="flex items-center gap-4">
                            <img
                                src={logo}
                                alt="CareLink"
                                className="w-11 h-11 sm:w-12 sm:h-12"
                            />

                            <div>
                                <h3 className="text-[20px] sm:text-[22px] font-semibold text-primary leading-tight">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h3>

                                <p className="text-[11px] sm:text-[12px] tracking-[0.22em] text-text-secondary uppercase mt-1">
                                    Foundation Management
                                </p>
                            </div>
                        </div>

                        {/* description */}
                        <p className="text-[14px] sm:text-[15px] text-text-secondary leading-relaxed max-w-md">
                            Empowering accountable aid distribution through
                            structured coordination, volunteer engagement, and
                            transparent impact tracking.
                        </p>

                        {/* trust line */}
                        <div className="flex items-start sm:items-center gap-3 text-[13px] sm:text-[14px] text-primary/75">
                            <TbHeartHandshake
                                className="text-accent mt-0.5 sm:mt-0"
                                size={18}
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
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border
                                               flex items-center justify-center
                                               text-text-secondary
                                               hover:text-accent hover:bg-white
                                               transition-all duration-200"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>

                        {/* support */}
                        <Link
                            to="/support"
                            className="inline-flex items-center text-[13px] sm:text-[14px] font-medium text-primary/75 hover:text-accent transition"
                        >
                            Contact support →
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-7 lg:pl-10 lg:border-l border-border/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-12">
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

                {/* bottom */}
                <div className="mt-14 sm:mt-16 pt-6 sm:pt-7 border-t border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <p className="text-[12px] sm:text-[13px] text-text-secondary">
                        © 2026 CareLink Foundation Management System. All rights
                        reserved.
                    </p>

                    <p className="text-[12px] sm:text-[13px] text-primary/50 font-medium tracking-wide">
                        Accountability • Transparency • Impact • Dignity
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
