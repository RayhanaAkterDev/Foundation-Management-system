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
        <footer className="border-t border-border bg-linear-to-b from-surface to-background">
            <div className="container-width py-16">
                {/* TOP SECTION (unchanged structure, safer spacing) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* BRAND BLOCK */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold text-primary">
                            Stand For People
                        </h2>

                        <p className="text-sm leading-7 text-text-secondary/80 max-w-md">
                            AI-enhanced donation and volunteer coordination
                            platform helping people get support faster, smarter,
                            and more transparently.
                        </p>

                        {/* SOCIAL */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {Object.entries(iconMap).map(
                                ([key, IconComponent]) => {
                                    const Icon = IconComponent;

                                    return (
                                        <a
                                            key={key}
                                            href="/"
                                            aria-label={key}
                                            className="
                                            w-10 h-10
                                            flex items-center justify-center
                                            rounded-xl
                                            border border-border
                                            bg-surface
                                            text-text-secondary
                                            hover:text-primary
                                            hover:border-primary/40
                                            hover:bg-primary/5
                                            transition-all duration-300
                                            shrink-0
                                        "
                                        >
                                            <Icon size={18} />
                                        </a>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>

                {/* LINK GROUPS (FIXED RESPONSIVE LAYOUT) */}
                <div
                    className="
                    mt-16
                    grid grid-cols-1
                    md:grid-cols-4
                    gap-10
                "
                >
                    {footerLinks.map((group, i) => (
                        <div key={i} className="space-y-5 min-w-0">
                            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary/60">
                                {group.title}
                            </h4>

                            <div className="space-y-3">
                                {group.links.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        to={item.to}
                                        className="
                                            block text-sm
                                            text-text-secondary/80
                                            hover:text-primary
                                            hover:translate-x-0.5
                                            transition-all duration-200
                                            wrap-break-word
                                        "
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* DIVIDER */}
                <div className="my-10 h-px bg-border/70" />

                {/* BOTTOM (FIXED MOBILE STACKING) */}
                <div
                    className="
                    flex flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-6
                "
                >
                    {/* LEGAL */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {legalLinks.map((item, i) => (
                            <Link
                                key={i}
                                to={item.to}
                                className="
                                    text-xs
                                    text-text-secondary/70
                                    hover:text-primary
                                    transition-colors
                                "
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* COPYRIGHT */}
                    <p className="text-xs text-text-secondary/60 leading-relaxed">
                        © 2026 Stand For People · Built with purpose and clarity
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
