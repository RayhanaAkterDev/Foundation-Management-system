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
        <footer className="relative overflow-hidden border-t border-border bg-[#F4F7F6]">

            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent" />

            <div className="container-width relative py-2">

                <div className="flex flex-col gap-16 py-20 lg:grid lg:grid-cols-[400px_1fr] lg:gap-20">

                    {/* LEFT */}
                    <div className="space-y-8">

                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="CareLink"
                                width={58}
                            />

                            <div>
                                <h4 className="text-[2rem] font-semibold tracking-tight text-primary">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h4>

                                <p className="text-[11px] uppercase tracking-[0.22em] text-text-secondary/60">
                                    Community Impact Platform
                                </p>
                            </div>
                        </div>

                        <p className="max-w-md text-[15.5px] leading-[1.8] text-text-secondary">
                            CareLink helps organizations coordinate donations,
                            volunteers, and measurable community impact through
                            transparent collaboration and structured management.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            {socialIcons.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="
                                        group flex h-11 w-11 items-center justify-center
                                        rounded-2xl border border-border/50
                                        bg-white text-primary/75 shadow-sm
                                        transition-all duration-300
                                        hover:-translate-y-0.5
                                        hover:border-accent/20
                                        hover:bg-accent/5
                                        hover:text-accent
                                    "
                                >
                                    <Icon
                                        size={18}
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />
                                </a>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="grid grid-cols-2 gap-x-14 gap-y-14 sm:grid-cols-3 lg:pl-6">
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
                <div
                    className="
                        mb-10 rounded-[28px]
                        border border-accent/10
                        bg-white/85 px-8 py-12
                        backdrop-blur-md
                        shadow-[0_14px_50px_rgba(0,0,0,0.04)]
                    "
                >
                    <FooterCTA />
                </div>

                <FooterBottom />

            </div>
        </footer>
    );
};

export default Footer;