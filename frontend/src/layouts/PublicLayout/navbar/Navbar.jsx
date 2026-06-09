import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

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
                    overflow-x-clip
                    transition-all duration-300
                    bg-surface
                    ${scrolled ? 'shadow-md backdrop-blur-md' : ''}
                `}
            >
                <div className="container-width">
                    <div className="flex items-center justify-between h-20">
                        {/* LEFT */}
                        <div className="flex items-center gap-6">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="StandFor People"
                                    className="w-56 xl:w-64 object-contain"
                                />
                            </Link>

                            {/* DESKTOP NAV */}
                            <div className="hidden lg:block">
                                <NavMenu />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="hidden lg:flex items-center gap-5 shrink-0">
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
                                shrink-0
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
                <div className="h-20 px-5 flex items-center justify-between shrink-0">
                    <Link to="/" className="flex items-center">
                        <img
                            src={logo}
                            alt="StandFor People"
                            className="w-40 object-contain"
                        />
                    </Link>
                </div>

                {/* NAV */}
                <div className="px-5 py-6 flex-1 overflow-y-auto">
                    <NavMenu mobile onClose={() => setMobileOpen(false)} />
                </div>

                {/* CTA */}
                <div className="p-5 border-t border-border shrink-0 bg-surface space-y-3">
                    <Link
                        to="/login"
                        className="
                            block text-center
                            text-[15px]
                            font-medium
                            text-text-secondary
                            hover:text-primary
                        "
                    >
                        Login
                    </Link>

                    <Button variant="accent" className="w-full">
                        Donate Now
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
