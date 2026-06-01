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
        <footer>
            <div className="container-width py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
                    {/* LEFT */}
                    <div className="lg:col-span-5 space-y-10">
                        {/* brand */}
                        <div className="flex items-center gap-4">
                            <img
                                src={logo}
                                alt="CareLink"
                                className="w-14 h-14 sm:w-16 sm:h-16"
                            />

                            <div>
                                <h3 className="text-[26px] sm:text-[28px] font-semibold text-primary leading-tight">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h3>

                                <p className="text-[13px] sm:text-[14px] tracking-[0.25em] text-text-secondary uppercase mt-1">
                                    Foundation Management
                                </p>
                            </div>
                        </div>

                        {/* description */}
                        <p className="text-[16px] sm:text-[17px] text-text-secondary leading-[1.85] max-w-md">
                            Empowering accountable aid distribution through
                            structured coordination, volunteer engagement, and
                            transparent impact tracking.
                        </p>

                        {/* socials */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {socialIcons.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-12 h-12 rounded-xl border border-border
                                               flex items-center justify-center
                                               text-text-secondary
                                               hover:text-accent hover:bg-white
                                               transition"
                                >
                                    <Icon size={19} />
                                </a>
                            ))}
                        </div>

                        {/* support */}
                        <Link
                            to="/support"
                            className="inline-flex items-center text-[15px] sm:text-[16px]
                                       font-medium text-primary hover:text-accent transition"
                        >
                            Contact support →
                        </Link>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-7 lg:pl-10 lg:border-l border-border/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
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
            </div>

            {/* bottom */}
            <div className="bg-surface border-t border-border">
                <div className="container-width py-10 lg:py-12 flex flex-col md:flex-row justify-between gap-5">
                    <p className="text-[13px] sm:text-[14px] text-text-secondary">
                        © 2026 CareLink Foundation Management System. All rights
                        reserved.
                    </p>

                    <p className="text-[13px] sm:text-[14px] font-medium text-primary tracking-wide">
                        Accountability • Transparency • Impact • Dignity
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
