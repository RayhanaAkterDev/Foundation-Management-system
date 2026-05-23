import React from 'react';
import FooterBottom from '../../components/footer/FooterBottom';
import FooterLinks from '../../components/footer/FooterLinks';

import logo from '../../assets/images/shared/footerLogo.png';

import footerExploreData from '../../components/footer/data/footerExploreData';
import footerResourceData from '../../components/footer/data/footerResourceData';
import footerPlatformData from '../../components/footer/data/footerPlatformData';

import {
    TbBrandFacebook,
    TbBrandTwitter,
    TbBrandInstagram,
    TbBrandLinkedin,
    TbBrandYoutube,
    TbMail,
    TbShieldCheck,
    TbShieldCheckFilled,
} from 'react-icons/tb';
import FooterCard from '../../components/footer/footerCard';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-border">
            <div className="container-width">
                <div className="flex justify-between items-center gap-12 py-20">
                    {/* BRAND */}
                    <div className="w-4/12 flex flex-col gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="CareLink" className="w-16" />
                            <div>
                                <h4 className="text-2xl font-bold text-primary tracking-wide">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h4>
                                <p className="text-xs text-text-secondary">
                                    Foundation Management System
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-text-secondary leading-7 text-sm">
                            CareLink helps organizations streamline operations,
                            manage donations, and engage volunteers to create
                            meaningful community impact.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            {[
                                TbBrandFacebook,
                                TbBrandTwitter,
                                TbBrandInstagram,
                                TbBrandLinkedin,
                                TbBrandYoutube,
                            ].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-primary/5 text-primary transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:shadow-sm"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* LINKS */}
                    <div className="w-7/12 flex gap-12">
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

                    {/* NEWSLETTER */}
                    <div className="w-4/12">
                        <div className="p-6 rounded-2xl border border-primary/10 bg-primary/5 flex flex-col gap-5">
                            {/* header */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface border border-primary/20 text-primary">
                                    <TbMail size={20} />
                                </div>
                                <h4 className="text-base font-semibold text-primary">
                                    Stay Updated
                                </h4>
                            </div>

                            <p className="text-sm text-text-secondary leading-6">
                                Get insights, updates, and practical resources
                                for foundation management.
                            </p>

                            {/* input */}
                            <div className="flex overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary transition">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 text-sm bg-transparent outline-none"
                                />
                                <button className="px-4 bg-primary text-white hover:bg-primary-hover transition">
                                    Subscribe
                                </button>
                            </div>

                            {/* privacy */}
                            <p className="text-xs text-primary/80 flex items-center gap-2">
                                <TbShieldCheckFilled /> We respect your privacy.
                                Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <FooterCard />
            <FooterBottom />
        </footer>
    );
};

export default Footer;

// ========================

import React from 'react';
import FooterLinks from '../../components/footer/FooterLinks';

import logo from '../../assets/images/shared/footerLogo.png';
import FooterBottom from '../../components/footer/FooterBottom';
import FooterCard from '../../components/footer/FooterCard';

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

const Footer = () => {
    return (
        <footer className="border-t border-border bg-surface">
            <div className="container-width">
                <div className="flex flex-col items-start justify-between gap-14 py-20 lg:flex-row lg:items-center">
                    {/* BRAND */}
                    <div className="w-full lg:w-4/12 flex flex-col gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="CareLink"
                                width={64}
                                height={64}
                                className="h-auto"
                            />

                            <div>
                                <h4 className="text-2xl font-bold tracking-wide text-primary">
                                    Care
                                    <span className="text-accent">Link</span>
                                </h4>

                                <p className="text-xs text-text-secondary">
                                    Foundation Management System
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-7 text-text-secondary">
                            CareLink helps organizations streamline operations,
                            manage donations, and engage volunteers to create
                            meaningful community impact.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            {[
                                TbBrandFacebook,
                                TbBrandTwitter,
                                TbBrandInstagram,
                                TbBrandLinkedin,
                                TbBrandYoutube,
                            ].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-primary/5 text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:shadow-sm"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* LINKS */}
                    <div className="w-full lg:w-8/12 flex flex-wrap justify-start gap-12 md:gap-20 lg:justify-center">
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

                <FooterCard />
                <FooterBottom />
            </div>
        </footer>
    );
};

export default Footer;
