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
        <footer className="border-t border-border bg-surface">
            <div className="container-width pt-16 pb-10 lg:pt-24 lg:pb-16 space-y-8 lg:space-y-12">
                {/* ================= TOP LINKS ================= */}
                <div className="flex flex-col lg:flex-row justify-between gap-10">
                    {footerLinks.map((group, i) => (
                        <div key={i}>
                            <h4 className="text-xs lg:text-sm uppercase tracking-[0.14em] font-semibold text-primary/50 mb-6">
                                {group.title}
                            </h4>

                            <div className="space-y-3">
                                {group.links.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        to={item.to}
                                        className="block text-[15px] lg:text-base text-text-secondary/75 hover:text-primary transition-colors font-normal leading-7"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ================= DIVIDER ================= */}
                <div className="border-t border-border/40" />

                {/* ================= BOTTOM ================= */}
                <div className="space-y-10">
                    {/* ================= BRAND + LEGAL ================= */}
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight text-primary mb-4">
                            Care<span className="text-accent">Link</span>
                        </h3>

                        <div className="flex flex-wrap gap-4">
                            {legalLinks.map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.to}
                                    className="text-[15px] lg:text-base text-text-secondary/75 hover:text-primary transition-colors font-normal"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <p className="mt-4 text-[15px] lg:text-base leading-7 lg:leading-8 text-text-secondary/80 max-w-md font-light">
                            © 2026 CareLink. AI-powered verification.
                            Transparent community support.
                        </p>
                    </div>

                    {/* ================= SOCIAL ================= */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.14em] font-semibold text-primary/40 mb-4">
                            Find us on
                        </h4>

                        <div className="flex gap-5">
                            {Object.keys(iconMap).map((key) => {
                                const Icon = iconMap[key];

                                return (
                                    <a
                                        key={key}
                                        href="/"
                                        className="text-text-secondary/60 hover:text-primary transition-colors"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
