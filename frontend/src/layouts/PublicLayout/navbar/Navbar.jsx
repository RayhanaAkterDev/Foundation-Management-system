import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../../components/common/Button';
import logo from '../../../assets/images/shared/logo.png';

import NavMenu from './NavMenu';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                aria-label="Main Navigation"
                className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
                    scrolled
                        ? 'h-22 bg-[#EDF4F7]/80 backdrop-blur border-b border-primary/20 shadow-sm'
                        : 'h-28 bg-[#FAFAFB] border-transparent'
                }`}
            >
                <div className="container-width flex h-full items-center justify-between">
                    {/* Hamburger */}
                    <button
                        className="lg:hidden text-2xl"
                        onClick={() => setMobileOpen(true)}
                    >
                        <FiMenu />
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden lg:block">
                        <NavMenu scrolled={scrolled} />
                    </div>

                    {/* Logo */}
                    <Link to="/">
                        <img
                            src={logo}
                            alt="CareLink logo"
                            className={`transition-all duration-300 ${
                                scrolled ? 'h-16' : 'h-18'
                            }`}
                        />
                    </Link>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex gap-4">
                        <Button>Donate Now</Button>
                        <Button variant="outline">Login</Button>
                    </div>
                </div>
            </nav>

            {/* OVERLAY */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-50"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* DRAWER */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-[#FAFAFB] z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
                    mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Close button */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold">Menu</h2>
                    <button onClick={() => setMobileOpen(false)}>
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Nav */}
                <div className="p-4">
                    <NavMenu mobile onItemClick={() => setMobileOpen(false)} />
                </div>

                {/* CTA */}
                <div className="p-4 flex flex-col gap-3 border-t mt-auto">
                    <Button>Donate Now</Button>
                    <Button variant="outline">Login</Button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
