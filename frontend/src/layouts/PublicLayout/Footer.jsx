import React from 'react';
import FooterLinks from '../../components/footer/FooterLinks';

import logo from '../../assets/images/shared/footerLogo.png';
import FooterBottom from '../../components/footer/FooterBottom';
import FooterCTA from '../../components/footer/FooterCTA';

import footerExploreData from '../../components/footer/data/footerExploreData';
import footerResourceData from '../../components/footer/data/footerResourceData';
import footerPlatformData from '../../components/footer/data/footerPlatformData';

import {
    TbBrandFacebook,
    TbBrandTwitter,
    TbBrandInstagram,
    TbBrandLinkedin,
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
        <footer className="relative bg-[#F3F6F5] border-t border-border overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container-width relative py-2">
                {/* MAIN */}
                <div className="flex flex-col gap-16 py-20 lg:grid lg:grid-cols-[380px_1fr] lg:gap-14">

                    {/* LEFT */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="CareLink" width={56} />

                            <div>
                                <h4 className="text-3xl font-semibold text-primary tracking-tight">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h4>
                                <p className="text-[12px] tracking-widest text-text-secondary/70">
                                    FOUNDATION MANAGEMENT SYSTEM
                                </p>
                            </div>
                        </div>

                        <p className="text-[15px] leading-7 text-text-secondary">
                            CareLink helps organizations streamline donations,
                            coordinate volunteers, and create measurable
                            community impact through structured management and
                            clarity.
                        </p>

                        {/* SOCIALS */}
                        <div className="flex items-center gap-2">
                            {socialIcons.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="group flex h-11 w-11 items-center justify-center rounded-full
                                               text-primary/70 transition hover:text-primary hover:bg-primary/5"
                                >
                                    <Icon
                                        size={18}
                                        className="transition group-hover:scale-110"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT LINKS */}
                    <div className="grid grid-cols-2 gap-x-10 gap-y-14 sm:grid-cols-3 lg:pl-6">
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

                {/* CTA */}
                <div className="mb-10 rounded-2xl border border-border/60 bg-white/70 backdrop-blur px-8 py-12 shadow-sm">
                    <FooterCTA />
                </div>

                {/* BOTTOM */}
                <FooterBottom />
            </div>
        </footer>
    );
};

export default Footer;