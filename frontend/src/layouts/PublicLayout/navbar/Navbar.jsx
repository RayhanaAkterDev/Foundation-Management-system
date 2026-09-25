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
        const handleScroll = () => {
            setScrolled(window.scrollY > 8);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const activeItem = navLinks.find((item) => item.id === activeMenu);

    return (
        <>
            {/* =====================================================
                PUBLIC NAVBAR
            ===================================================== */}

            <header
                className={`
                    fixed
                    top-0
                    left-0
                    z-50
                    w-full
                    bg-surface/95
                    backdrop-blur-md
                    border-b
                    transition-all
                    duration-300
                    ${
                        scrolled
                            ? 'border-border shadow-[0_4px_20px_rgba(15,23,42,0.06)]'
                            : 'border-transparent'
                    }
                `}
            >
                <div className="container-width">
                    <div
                        className={`
                            flex
                            items-center
                            justify-between
                            transition-all
                            duration-300
                            ${scrolled ? 'h-[76px]' : 'h-[84px]'}
                        `}
                    >
                        {/* =================================================
                            LOGO
                        ================================================= */}

                        <Link
                            to="/"
                            className="
                                flex
                                shrink-0
                                items-center
                                rounded-md
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary
                                focus-visible:ring-offset-4
                            "
                            aria-label="Stand For People-এর হোমপেজ"
                        >
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="
                                    w-44
                                    sm:w-48
                                    lg:w-52
                                    h-auto
                                    object-contain
                                "
                            />
                        </Link>

                        {/* =================================================
                            DESKTOP NAVIGATION
                        ================================================= */}

                        <div className="hidden items-center gap-8 lg:flex xl:gap-10">
                            <NavMenu
                                activeMenu={activeMenu}
                                setActiveMenu={setActiveMenu}
                            />

                            <div className="border-l border-border pl-2">
                                <Button
                                    to="/donate"
                                    variant="accent"
                                    size="lg"
                                    className="
                                        !rounded-lg
                                        !px-5
                                        !py-2.5
                                        !text-sm
                                    "
                                >
                                    দান করুন
                                </Button>
                            </div>
                        </div>

                        {/* =================================================
                            MOBILE MENU BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            aria-label="মেনু খুলুন"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen(true)}
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-border
                                bg-surface
                                text-text-primary
                                transition-colors
                                duration-200
                                hover:border-primary
                                hover:text-primary
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary
                                focus-visible:ring-offset-2
                                lg:hidden
                            "
                        >
                            <FiMenu className="text-[22px]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* =====================================================
                DESKTOP MEGA MENU
            ===================================================== */}

            <MegaMenu item={activeItem} onClose={() => setActiveMenu(null)} />

            {/* =====================================================
                MOBILE OVERLAY
            ===================================================== */}

            <div
                aria-hidden={!mobileOpen}
                onClick={() => setMobileOpen(false)}
                className={`
                    fixed
                    inset-0
                    z-[60]
                    bg-slate-950/30
                    backdrop-blur-[2px]
                    transition-all
                    duration-300
                    ${
                        mobileOpen
                            ? 'visible opacity-100'
                            : 'invisible opacity-0'
                    }
                `}
            />

            {/* =====================================================
                MOBILE DRAWER
            ===================================================== */}

            <aside
                aria-label="মোবাইল নেভিগেশন"
                className={`
                    fixed
                    top-0
                    right-0
                    z-[70]
                    flex
                    h-screen
                    w-[88%]
                    max-w-[390px]
                    flex-col
                    overflow-hidden
                    border-l
                    border-border
                    bg-surface
                    shadow-[-20px_0_60px_rgba(15,23,42,0.12)]
                    transition-transform
                    duration-300
                    ease-out
                    ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* =================================================
                    MOBILE DRAWER HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        h-[84px]
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-5
                    "
                >
                    <Link
                        to="/"
                        onClick={() => setMobileOpen(false)}
                        className="
                            rounded-md
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                        "
                        aria-label="Stand For People-এর হোমপেজ"
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="
                                h-auto
                                w-40
                                object-contain
                            "
                        />
                    </Link>

                    <button
                        type="button"
                        aria-label="মেনু বন্ধ করুন"
                        onClick={() => setMobileOpen(false)}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            text-text-primary
                            transition-colors
                            duration-200
                            hover:border-primary
                            hover:bg-background-teal
                            hover:text-primary
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                        "
                    >
                        <FiX className="text-[21px]" />
                    </button>
                </div>

                {/* =================================================
                    MOBILE NAVIGATION
                ================================================= */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-4
                        py-5
                    "
                >
                    <NavMenu mobile onClose={() => setMobileOpen(false)} />
                </div>

                {/* =================================================
                    MOBILE CTA
                ================================================= */}

                <div
                    className="
                        shrink-0
                        border-t
                        border-border
                        bg-background
                        p-5
                    "
                >
                    <Button
                        size="lg"
                        to="/donate"
                        variant="accent"
                        className="
                            !w-full
                            !rounded-lg
                            !py-3
                        "
                        onClick={() => setMobileOpen(false)}
                    >
                        দান করুন
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
