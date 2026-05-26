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
        <footer className="relative mt-24 bg-[#F6F8F7] border-t border-border overflow-hidden">
            {/* subtle background only */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative container-width pt-18">
                <div className="grid lg:grid-cols-12 gap-14">
                    {/* LEFT */}
                    <div className="lg:col-span-5 space-y-7">
                        <div className="flex items-center gap-4">
                            <img
                                src={logo}
                                alt="CareLink"
                                className="w-13 h-13"
                            />

                            <div>
                                <h3 className="text-2xl font-semibold text-primary">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h3>
                                <p className="text-[11px] tracking-[0.25em] text-text-secondary">
                                    Community Impact Network
                                </p>
                            </div>
                        </div>

                        <p className="text-sm leading-relaxed text-text-secondary max-w-md">
                            A coordinated ecosystem where donors, volunteers,
                            and communities work together to deliver aid
                            efficiently and transparently.
                        </p>

                        <div className="flex gap-2 pt-1">
                            {socialIcons.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="/"
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-border/60 bg-white/70 text-text-secondary hover:text-accent hover:-translate-y-0.5 transition"
                                >
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>

                        <div className="text-sm flex items-center gap-2 text-text-secondary">
                            Need help?
                            <Link
                                to="/support"
                                className="text-primary font-medium hover:text-accent"
                            >
                                Get support →
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-7 lg:border-l lg:border-border/40 lg:pl-10">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
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
                <div className="mt-14 py-12 border-t border-border/60 flex flex-col md:flex-row justify-between text-xs text-text-secondary gap-2">
                    <p>© 2026 CareLink Foundation Management System</p>

                    <p className="text-primary/60 italic">
                        Built for coordination, dignity, and measurable impact
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
