import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

import logo from '@/assets/shared/logo.png';
import Button from '@/components/Button';
import NavMenu from './NavMenu';
import MegaMenu from './MegaMenu';
import navLinks from './data/navLinks';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activeItem = navLinks.find((item) => item.id === activeMenu);

    return (
        <>
            {/* HEADER */}
            <header
                className={`fixed top-0 left-0 w-full z-50 bg-surface ${
                    scrolled ? 'shadow-md' : ''
                }`}
            >
                <div className="container-width">
                    <div className="h-24 flex items-center justify-between">
                        <Link to="/">
                            <img
                                src={logo}
                                alt="StandFor People"
                                className="w-52"
                            />
                        </Link>

                        {/* DESKTOP */}
                        <div className="hidden lg:flex items-center gap-10">
                            <NavMenu
                                activeMenu={activeMenu}
                                setActiveMenu={setActiveMenu}
                            />
                            <Button to="/donate" variant="accent" size="lg">
                                Donate Now
                            </Button>
                        </div>

                        {/* MOBILE */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden w-11 h-11 flex items-center justify-center border border-border rounded-lg"
                        >
                            <FiMenu />
                        </button>
                    </div>
                </div>
            </header>

            {/* MEGA MENU */}
            <MegaMenu item={activeItem} onClose={() => setActiveMenu(null)} />

            {/* OVERLAY */}
            <div
                onClick={() => setMobileOpen(false)}
                className={`fixed inset-0 z-60 bg-black/40 transition ${
                    mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            />

            {/* MOBILE DRAWER */}
            <aside
                className={`fixed top-0 min-h-screen right-0 z-70 h-[calc(100vh-6rem)] w-[85%] max-w-sm bg-surface shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ${
                    mobileOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* TOP BAR */}
                <div className="flex items-center justify-end p-4">
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-background transition"
                    >
                        <FiX className="text-2xl text-text-primary" />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 pt-0">
                    <NavMenu mobile onClose={() => setMobileOpen(false)} />
                </div>

                <div className="p-5 shrink-0">
                    <Button
                        size="lg"
                        to="/donate"
                        variant="accent"
                        className="w-full"
                    >
                        Donate Now
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
