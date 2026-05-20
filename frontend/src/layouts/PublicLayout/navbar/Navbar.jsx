import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

import Button from '../../../components/common/Button';
import logo from '../../../assets/images/shared/logo.png';

import NavMenu from './NavMenu';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* NAVBAR */}
            <nav
                aria-label="Main Navigation"
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'h-24 bg-[#EDF4F7]/80 backdrop-blur border-b border-primary/20 shadow-sm'
                        : 'h-28 bg-[#FAFAFB]'
                }`}
            >
                <div className="container-width flex h-full items-center justify-between">
                    {/* LOGO */}
                    <Link to="/" className="shrink-0">
                        <img
                            src={logo}
                            alt="CareLink logo"
                            className="object-contain h-16"
                        />
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden lg:flex items-center gap-10">
                        <NavMenu scrolled={scrolled} />

                        <div className="flex items-center gap-4">
                            <Button>Donate Now</Button>

                            <Button variant="outline">Login</Button>
                        </div>
                    </div>

                    {/* MOBILE / TABLET HAMBURGER */}
                    <button
                        aria-label="Open Menu"
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden flex items-center justify-center text-3xl text-primary"
                    >
                        <FiMenu />
                    </button>
                </div>
            </nav>

            {/* OVERLAY */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${
                    mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            />

            {/* DRAWER */}
            <aside
                className={`fixed top-0 right-0 z-70 h-screen w-[85%] max-w-85 bg-[#FAFAFB] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
                    mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* DRAWER HEADER */}
                <div className="flex items-center justify-between border-b border-border px-5 py-5">
                    <Link to="/" onClick={() => setMobileOpen(false)}>
                        <img
                            src={logo}
                            alt="CareLink logo"
                            className="h-14 object-contain"
                        />
                    </Link>

                    <button
                        aria-label="Close Menu"
                        onClick={() => setMobileOpen(false)}
                        className="text-3xl text-primary"
                    >
                        <FiX />
                    </button>
                </div>

                {/* MOBILE NAV */}
                <div className="flex-1 overflow-y-auto px-5 py-6">
                    <NavMenu
                        mobile
                        scrolled={scrolled}
                        onItemClick={() => setMobileOpen(false)}
                    />
                </div>

                {/* MOBILE CTA */}
                <div className="border-t border-border p-5 space-y-3">
                    <Button className="w-full">Donate Now</Button>

                    <Button variant="outline" className="w-full">
                        Login
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
