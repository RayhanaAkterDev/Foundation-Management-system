import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

import logo from '@/assets/shared/logo.png';
import Button from '@/components/Button';
import NavMenu from './NavMenu';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={`
    fixed top-0 left-0 w-full z-50
    transition-all duration-300

    ${
        scrolled
            ? `
            bg-surface
            backdrop-blur-md
            shadow-md
            `
            : `
            bg-surface
            `
    }
`}
            >
                <div className="container-width">
                    <div className="h-20 flex items-center justify-between">
                        {/* LEFT */}
                        <div className="flex items-center gap-12">
                            {/* BRAND */}
                            <Link
                                to="/"
                                className="flex items-center gap-3 shrink-0"
                            >
                                <img
                                    src={logo}
                                    alt="CareLink"
                                    className="w-12 object-contain"
                                />

                                <div className="leading-none">
                                    <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] text-primary">
                                        Care
                                        <span className="text-accent">
                                            Link
                                        </span>
                                    </h2>

                                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary font-medium">
                                        Help • Humanity • Hope
                                    </p>
                                </div>
                            </Link>

                            {/* DESKTOP NAV */}
                            <div className="hidden lg:block">
                                <NavMenu />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="hidden lg:flex items-center gap-6">
                            {/* LOGIN (normal link, NOT button) */}
                            <Link
                                to="/login"
                                className="
            text-[15px]
            font-medium
            text-text-secondary
            hover:text-primary
            transition-colors
        "
                            >
                                Login
                            </Link>

                            {/* DONATE CTA (button stays important) */}
                            <Button variant="accent">Donate Now</Button>
                        </div>

                        {/* MOBILE BUTTON */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="
                                lg:hidden
                                w-11 h-11
                                flex items-center justify-center
                                rounded-md
                                border border-border
                                text-text-primary
                            "
                        >
                            <FiMenu className="text-[1.4rem]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* OVERLAY */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`
                    fixed inset-0 z-40 bg-black/40 transition-all duration-300
                    ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                `}
            />

            {/* MOBILE DRAWER */}
            <aside
                className={`
        fixed top-0 right-0 z-50
        h-full w-[88%] max-w-95
        bg-surface

        flex flex-col
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
    `}
            >
                {/* TOP */}
                <div className="h-24 px-5  flex items-center justify-between shrink-0">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="CareLink" className="w-10" />

                        <div className="leading-none">
                            <h3 className="text-xl font-semibold text-primary">
                                Care
                                <span className="text-accent">Link</span>
                            </h3>
                        </div>
                    </Link>

                    <button
                        onClick={() => setMobileOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-md border border-border text-text-primary"
                    >
                        <FiX className="text-[1.3rem]" />
                    </button>
                </div>

                {/* NAV */}
                <div className="px-5 py-6 flex-1 overflow-y-auto">
                    <NavMenu mobile onClose={() => setMobileOpen(false)} />
                </div>

                {/* CTA */}
                <div className="p-5 border-t border-border shrink-0 bg-surface space-y-3">
                    {/* LOGIN as LINK */}
                    <Link
                        to="/login"
                        className="
            block text-center
            text-[15px]
            font-medium
            text-text-secondary
            hover:text-primary
            transition-colors
        "
                    >
                        Login
                    </Link>

                    {/* DONATE as BUTTON */}
                    <Button variant="accent" className="w-full">
                        Donate Now
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
