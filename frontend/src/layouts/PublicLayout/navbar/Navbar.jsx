import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { FiMenu, FiX } from 'react-icons/fi';
import { UserRound, LogOut, LayoutDashboard } from 'lucide-react';

import logo from '@/assets/shared/logo.png';

import Button from '@/components/Button';

import NavMenu from './NavMenu';
import MegaMenu from './MegaMenu';
import navLinks from './data/navLinks';

const getStoredAuth = () => {
    const token =
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token');

    const storedUser =
        localStorage.getItem('user') || sessionStorage.getItem('user');

    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    return {
        token,
        user,
    };
};

const Navbar = () => {
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const [auth, setAuth] = useState(() => getStoredAuth());

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const syncAuth = () => {
            setAuth(getStoredAuth());
        };

        window.addEventListener('auth-changed', syncAuth);
        window.addEventListener('storage', syncAuth);

        return () => {
            window.removeEventListener('auth-changed', syncAuth);
            window.removeEventListener('storage', syncAuth);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const activeItem = navLinks.find((item) => item.id === activeMenu);

    const isLoggedIn = Boolean(auth.token && auth.user);

    const userName = auth.user?.name || 'অ্যাকাউন্ট';

    const dashboardPath =
        auth.user?.role === 'organization'
            ? '/organization/dashboard'
            : auth.user?.role === 'admin'
              ? '/admin/dashboard'
              : '/individual/dashboard';

    const accountRole =
        auth.user?.role === 'organization'
            ? 'প্রতিষ্ঠান'
            : auth.user?.role === 'admin'
              ? 'অ্যাডমিন'
              : 'ব্যক্তিগত অ্যাকাউন্ট';

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        setAuth({
            token: null,
            user: null,
        });

        setMobileOpen(false);

        window.dispatchEvent(new Event('auth-changed'));

        navigate('/');
    };

    return (
        <>
            {/* =========================================================
                DESKTOP / MAIN NAVBAR
            ========================================================= */}
            <header
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    w-full
                    transition-all
                    duration-300
                    ${
                        scrolled
                            ? `
                                border-b
                                border-border/80
                                bg-surface/95
                                shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                                backdrop-blur-xl
                            `
                            : `
                                border-b
                                border-transparent
                                bg-surface/80
                                backdrop-blur-md
                            `
                    }
                `}
            >
                <div className="container-width">
                    <div
                        className={`
                            flex
                            items-center
                            gap-3
                            transition-all
                            duration-300
                            ${
                                scrolled
                                    ? 'h-[68px] xl:h-[76px]'
                                    : 'h-[76px] xl:h-[84px]'
                            }
                        `}
                    >
                        {/* =================================================
                            LOGO
                        ================================================= */}
                        <Link
                            to="/"
                            className="
                                group
                                flex
                                w-[145px]
                                shrink-0
                                items-center
                                rounded-md
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary
                                focus-visible:ring-offset-4
                                xl:w-[185px]
                            "
                            aria-label="Stand For People-এর হোমপেজ"
                        >
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="
                                    h-auto
                                    w-[136px]
                                    object-contain
                                    transition-transform
                                    duration-300
                                    group-hover:scale-[1.015]
                                    xl:w-[176px]
                                "
                            />
                        </Link>

                        {/* =================================================
                            DESKTOP NAVIGATION
                        ================================================= */}
                        <div
                            className="
                                hidden
                                min-w-0
                                flex-1
                                items-center
                                justify-center
                                overflow-visible
                                lg:flex
                            "
                        >
                            <div
                                className="
                                    flex
                                    min-w-0
                                    shrink-0
                                    items-center
                                    whitespace-nowrap
                                "
                            >
                                <NavMenu
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                />
                            </div>
                        </div>

                        {/* =================================================
                            DESKTOP ACTIONS
                        ================================================= */}
                        <div
                            className="
                                hidden
                                shrink-0
                                items-center
                                gap-1
                                lg:flex
                                xl:gap-2
                            "
                        >
                            {/* Donation CTA */}
                            <Button
                                to="/donate"
                                variant="accent"
                                size="lg"
                                className="
                                    !min-h-10
                                    !rounded-md
                                    !px-4
                                    !py-2
                                    !font-bengali
                                    !text-[12px]
                                    !font-semibold
                                    lg:!min-h-10
                                    lg:!px-4
                                    xl:!min-h-11
                                    xl:!px-6
                                    xl:!text-[14px]
                                "
                            >
                                দান করুন
                            </Button>

                            {/* =================================================
                                LOGGED-IN ACCOUNT
                            ================================================= */}
                            {isLoggedIn ? (
                                <div
                                    className="
                                        ml-1
                                        flex
                                        items-center
                                        border-l
                                        border-border
                                        pl-2
                                        xl:ml-2
                                        xl:pl-3
                                    "
                                >
                                    <Link
                                        to={dashboardPath}
                                        className="
                                            group
                                            flex
                                            max-w-[135px]
                                            shrink-0
                                            items-center
                                            gap-2
                                            rounded-md
                                            px-1.5
                                            py-1.5
                                            font-bengali
                                            text-[12px]
                                            font-medium
                                            text-text-primary
                                            transition-colors
                                            hover:text-primary
                                            xl:max-w-[170px]
                                            xl:px-2
                                            xl:text-[13px]
                                        "
                                    >
                                        <span
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-background-teal
                                                text-primary
                                                transition-colors
                                                group-hover:bg-primary
                                                group-hover:text-white!
                                            "
                                        >
                                            <UserRound
                                                size={15}
                                                strokeWidth={1.8}
                                            />
                                        </span>

                                        <span className="truncate">
                                            {userName}
                                        </span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-text-muted
                                            transition-colors
                                            hover:bg-background-teal
                                            hover:text-primary
                                            focus:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-primary
                                        "
                                        aria-label="লগআউট করুন"
                                    >
                                        <LogOut size={15} strokeWidth={1.7} />
                                    </button>
                                </div>
                            ) : (
                                /* =================================================
                                    LOGGED-OUT LOGIN
                                ================================================= */
                                <Link
                                    to="/login"
                                    className="
                                        ml-1
                                        flex
                                        h-9
                                        shrink-0
                                        items-center
                                        gap-1.5
                                        border-l
                                        border-border
                                        pl-3
                                        font-bengali
                                        text-[12px]
                                        font-semibold
                                        text-text-primary
                                        transition-colors
                                        hover:text-primary
                                        xl:ml-2
                                        xl:h-10
                                        xl:gap-2
                                        xl:pl-4
                                        xl:text-[13px]
                                    "
                                >
                                    <UserRound size={16} strokeWidth={1.8} />
                                    লগইন
                                </Link>
                            )}
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
                                ml-auto
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-text-primary
                                transition-all
                                duration-200
                                hover:bg-background-teal
                                hover:text-primary
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary
                                focus-visible:ring-offset-2
                                lg:hidden
                            "
                        >
                            <FiMenu className="text-[23px]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* =============================================================
                MEGA MENU
            ============================================================= */}
            <MegaMenu item={activeItem} onClose={() => setActiveMenu(null)} />

            {/* =============================================================
                MOBILE OVERLAY
            ============================================================= */}
            <div
                aria-hidden={!mobileOpen}
                onClick={closeMobileMenu}
                className={`
                    fixed
                    inset-0
                    z-[60]
                    bg-slate-950/25
                    backdrop-blur-[3px]
                    transition-all
                    duration-300
                    ${
                        mobileOpen
                            ? 'visible opacity-100'
                            : 'invisible opacity-0'
                    }
                `}
            />

            {/* =============================================================
                MOBILE DRAWER
            ============================================================= */}
            <aside
                aria-label="মোবাইল নেভিগেশন"
                className={`
                    fixed
                    right-0
                    top-0
                    z-[70]
                    flex
                    h-screen
                    w-[90%]
                    max-w-[420px]
                    flex-col
                    overflow-hidden
                    border-l
                    border-border
                    bg-surface
                    shadow-[-24px_0_70px_rgba(15,23,42,0.14)]
                    transition-transform
                    duration-300
                    ease-[cubic-bezier(.16,1,.3,1)]
                    ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* =========================================================
                    MOBILE DRAWER HEADER
                ========================================================= */}
                <div
                    className="
                        flex
                        h-[82px]
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-5
                        sm:h-[88px]
                        sm:px-7
                    "
                >
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
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
                                w-36
                                object-contain
                                sm:w-40
                            "
                        />
                    </Link>

                    <button
                        type="button"
                        aria-label="মেনু বন্ধ করুন"
                        onClick={closeMobileMenu}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            text-text-secondary
                            transition-all
                            duration-200
                            hover:bg-background-teal
                            hover:text-primary
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                        "
                    >
                        <FiX className="text-[22px]" />
                    </button>
                </div>

                {/* =========================================================
                    MOBILE ACCOUNT AREA
                ========================================================= */}
                {isLoggedIn && (
                    <div
                        className="
                            border-b
                            border-border
                            bg-background
                            px-5
                            py-5
                            sm:px-7
                            sm:py-6
                        "
                    >
                        <div className="flex items-center gap-3.5">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-background-teal
                                    text-primary
                                    sm:h-12
                                    sm:w-12
                                "
                            >
                                <UserRound size={19} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className="
                                        truncate
                                        font-bengali
                                        text-[14px]
                                        font-semibold
                                        text-text-primary
                                        sm:text-[15px]
                                    "
                                >
                                    {userName}
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        font-bengali
                                        text-[11px]
                                        text-text-secondary
                                        sm:text-[12px]
                                    "
                                >
                                    {accountRole}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2.5">
                            <Link
                                to={dashboardPath}
                                onClick={closeMobileMenu}
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-md
                                    border
                                    border-border
                                    bg-surface
                                    font-bengali
                                    text-[12px]
                                    font-semibold
                                    text-text-primary
                                    transition-colors
                                    hover:border-primary
                                    hover:text-primary
                                    sm:text-[13px]
                                "
                            >
                                <LayoutDashboard size={15} />
                                ড্যাশবোর্ড
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-md
                                    border
                                    border-border
                                    bg-surface
                                    font-bengali
                                    text-[12px]
                                    font-semibold
                                    text-text-secondary
                                    transition-colors
                                    hover:border-primary
                                    hover:text-primary
                                    sm:text-[13px]
                                "
                            >
                                <LogOut size={15} />
                                বের হন
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================================================
                    MOBILE NAVIGATION
                ========================================================= */}
                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-5
                        py-6
                        sm:px-7
                        sm:py-7
                    "
                >
                    <NavMenu mobile onClose={closeMobileMenu} />
                </div>

                {/* =========================================================
                    MOBILE FOOTER ACTIONS
                ========================================================= */}
                <div
                    className="
                        shrink-0
                        border-t
                        border-border
                        bg-background
                        px-5
                        py-5
                        sm:px-7
                        sm:py-6
                    "
                >
                    {!isLoggedIn && (
                        <Link
                            to="/login"
                            onClick={closeMobileMenu}
                            className="
                                mb-3
                                flex
                                min-h-11
                                w-full
                                items-center
                                justify-center
                                rounded-md
                                border
                                border-border
                                bg-surface
                                font-bengali
                                text-[13px]
                                font-semibold
                                text-text-primary
                                transition-colors
                                hover:border-primary
                                hover:text-primary
                            "
                        >
                            লগইন
                        </Link>
                    )}

                    <Button
                        size="lg"
                        to="/donate"
                        variant="accent"
                        className="
                            !min-h-12
                            !w-full
                            !rounded-md
                            !py-3
                            !font-bengali
                            !text-[14px]
                            !font-semibold
                        "
                        onClick={closeMobileMenu}
                    >
                        দান করুন
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
