import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';

import Button from '../../../components/common/Button';
import logo from '../../../assets/images/shared/logo.png';
import navLinks from './data/navLinks';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
                scrolled
                    ? 'h-22 bg-[#EDF4F7]/80 backdrop-blur border-b border-primary/20 shadow-sm'
                    : 'h-28 bg-[#FAFAFB]'
            }`}
        >
            <div className="container-width flex h-full items-center justify-between">

                {/* LOGO */}
                <Link to="/" aria-label="CareLink Home">
                    <img
                        src={logo}
                        alt="CareLink logo"
                        className={`transition-all duration-300 ${
                            scrolled ? 'h-16' : 'h-18'
                        }`}
                    />
                </Link>

                {/* DESKTOP NAV */}
                <ul className="hidden lg:flex items-center gap-6">
                    {navLinks.map(link => (
                        <li key={link.id} className="relative group">

                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-300 hover:bg-primary/10 hover:text-primary-hover ${
                                        isActive
                                            ? 'text-primary font-semibold'
                                            : 'text-text-primary'
                                    }`
                                }
                            >
                                {link.name}

                                {link.children && (
                                    <IoChevronDown className="text-sm transition-transform group-hover:rotate-180" />
                                )}
                            </NavLink>

                            {/* DROPDOWN */}
                            {link.children && (
                                <div
                                    className={`
                                        absolute left-1/2 top-full mt-3 w-60 -translate-x-1/2
                                        rounded-xl border border-border bg-[#FAFAFB]
                                        p-4 shadow-xl

                                        opacity-0 invisible translate-y-2
                                        transition-all duration-200 ease-out

                                        group-hover:opacity-100
                                        group-hover:visible
                                        group-hover:translate-y-0
                                    `}
                                >
                                    <ul className="space-y-1">
                                        {link.children.map(child => (
                                            <li key={child.id}>
                                                <NavLink
                                                    to={child.path}
                                                    className={({ isActive }) =>
                                                        `block rounded-md px-3 py-2 transition-all hover:bg-primary/10 hover:text-primary-hover ${
                                                            isActive
                                                                ? 'text-primary font-semibold'
                                                                : 'text-text-primary'
                                                        }`
                                                    }
                                                >
                                                    {child.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* CTA + MOBILE BUTTON */}
                <div className="flex items-center gap-3">

                    {/* DESKTOP CTA */}
                    <div className="hidden lg:flex gap-2">
                        <Button>Donate Now</Button>
                        <Button variant="outline">Login</Button>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="lg:hidden text-2xl"
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <HiX /> : <HiMenu />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileOpen && (
                <div className="lg:hidden px-4 pb-6">
                    <ul className="flex flex-col gap-2 mt-4">

                        {navLinks.map(link => (
                            <li key={link.id}>

                                <NavLink
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-3 py-2 rounded-md ${
                                            isActive
                                                ? 'text-primary font-semibold'
                                                : 'text-text-primary'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>

                                {/* MOBILE DROPDOWN (simple nested list) */}
                                {link.children && (
                                    <ul className="ml-4 mt-1 border-l border-border pl-3 flex flex-col gap-1">
                                        {link.children.map(child => (
                                            <li key={child.id}>
                                                <NavLink
                                                    to={child.path}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={({ isActive }) =>
                                                        `block px-2 py-1 text-sm ${
                                                            isActive
                                                                ? 'text-primary font-semibold'
                                                                : 'text-text-primary'
                                                        }`
                                                    }
                                                >
                                                    {child.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* MOBILE CTA */}
                    <div className="mt-6 flex flex-col gap-3">
                        <Button className="w-full">Donate Now</Button>
                        <Button variant="outline" className="w-full">
                            Login
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;