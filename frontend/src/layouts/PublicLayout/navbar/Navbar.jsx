import React, { useEffect, useRef, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { LayoutDashboard, LogOut } from 'lucide-react';

import logo from '@/assets/shared/logo.png';

import NavMenu from './NavMenu';
import MegaMenu from './MegaMenu';
import navLinks from './data/navLinks';

/* =========================================================
   AUTH
========================================================= */

const getStoredAuth = () => {
    try {
        const token =
            localStorage.getItem('auth_token') ||
            sessionStorage.getItem('auth_token');

        const storedUser =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        const user = storedUser ? JSON.parse(storedUser) : null;

        return {
            token,
            user,
        };
    } catch {
        return {
            token: null,
            user: null,
        };
    }
};

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [auth, setAuth] = useState(getStoredAuth);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userMenuRef = useRef(null);

    /* =====================================================
       SCROLL STATE
    ===================================================== */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    /* =====================================================
       AUTH SYNC
    ===================================================== */

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

    /* =====================================================
       ACCOUNT MENU OUTSIDE CLICK
    ===================================================== */

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    /* =====================================================
       MOBILE BODY LOCK
    ===================================================== */

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    /* =====================================================
       DERIVED DATA
    ===================================================== */

    const activeItem = navLinks.find((item) => item.id === activeMenu);

    const isLoggedIn = Boolean(auth.token && auth.user);

    const userName = auth.user?.name || auth.user?.full_name || 'অ্যাকাউন্ট';

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

    /* =====================================================
       HELPERS
    ===================================================== */

    const closeNavigation = () => {
        setMobileOpen(false);
        setActiveMenu(null);
        setUserMenuOpen(false);
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

        closeNavigation();

        window.dispatchEvent(new Event('auth-changed'));

        navigate('/');
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            {/* =================================================
                HEADER
            ================================================= */}

            <header
                className={`
                    fixed
                    inset-x-0
                    top-0
                    z-[1100]
                    transition-[background-color,border-color,box-shadow]
                    duration-300

                    ${
                        scrolled
                            ? `
                                border-border
                                bg-surface/95
                                shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)]
                                backdrop-blur-xl
                            `
                            : `
                                border-border/80
                                bg-surface
                            `
                    }
                `}
            >
                <div
                    className="
                        container-width

                        flex
                        items-center

                        h-22
                        lg:h-24
                    "
                >
                    {/* =========================================
                        LOGO
                    ========================================= */}

                    <Link
                        to="/"
                        onClick={closeNavigation}
                        aria-label="Stand For People — হোম"
                        className="
                            relative
                            z-[1200]

                            flex
                            shrink-0
                            items-center
                        "
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="
                                block
                                object-contain
                                h-20
                                lg:h-22
                            "
                        />
                    </Link>

                    {/* =========================================
                        DESKTOP NAVIGATION
                    ========================================= */}

                    <div
                        className="
                            hidden
                            min-w-0
                            flex-1
                            justify-center

                            px-6

                            lg:flex
                            xl:px-10
                        "
                    >
                        <NavMenu
                            activeMenu={activeMenu}
                            setActiveMenu={setActiveMenu}
                        />
                    </div>

                    {/* =========================================
                        DESKTOP ACTIONS
                    ========================================= */}

                    <div
                        className="
                            ml-auto

                            hidden
                            shrink-0
                            items-center
                            gap-3

                            lg:flex
                        "
                    >
                        {/* LOGIN */}

                        {!isLoggedIn && (
                            <Link
                                to="/login"
                                className="
                                    group
                                    relative

                                    inline-flex
                                    h-11
                                    items-center
                                    justify-center

                                    px-3

                                    font-bengali
                                    text-[15px]
                                    font-medium!
                                    leading-none
                                    text-text-body

                                    transition-colors
                                    duration-200

                                    hover:text-primary
                                "
                            >
                                <span>লগইন</span>

                                <span
                                    aria-hidden="true"
                                    className="
                                        absolute
                                        bottom-1.5
                                        left-3
                                        right-3

                                        h-px

                                        origin-left
                                        scale-x-0

                                        bg-primary

                                        transition-transform
                                        duration-200

                                        group-hover:scale-x-100
                                    "
                                />
                            </Link>
                        )}

                        {/* AUTHENTICATED USER */}

                        {isLoggedIn && (
                            <div ref={userMenuRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUserMenuOpen((previous) => !previous)
                                    }
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="menu"
                                    className={`
                                        inline-flex
                                        h-11
                                        items-center
                                        gap-2

                                        px-3

                                        font-bengali
                                        text-[14px]
                                        font-medium!
                                        leading-none

                                        transition-colors
                                        duration-200

                                        ${
                                            userMenuOpen
                                                ? 'text-primary'
                                                : 'text-text-body hover:text-primary'
                                        }
                                    `}
                                >
                                    <span
                                        className="
                                            max-w-[110px]
                                            truncate
                                        "
                                    >
                                        {userName}
                                    </span>

                                    <FiChevronDown
                                        size={13}
                                        className={`
                                            shrink-0

                                            transition-all
                                            duration-200

                                            ${
                                                userMenuOpen
                                                    ? 'rotate-180 text-primary'
                                                    : 'text-text-muted'
                                            }
                                        `}
                                    />
                                </button>

                                {userMenuOpen && (
                                    <div
                                        role="menu"
                                        className="
                                            absolute
                                            right-0
                                            top-[calc(100%+16px)]

                                            w-[240px]

                                            rounded-lg
                                            border
                                            border-border

                                            bg-surface

                                            p-2

                                            shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]
                                        "
                                    >
                                        <div
                                            className="
                                                border-b
                                                border-border

                                                px-3
                                                py-3
                                            "
                                        >
                                            <p
                                                className="
                                                    truncate

                                                    font-bengali
                                                    text-[14px]
                                                    font-medium!
                                                    leading-[1.5]
                                                    text-text-primary
                                                "
                                            >
                                                {userName}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5

                                                    font-bengali
                                                    text-[12px]
                                                    leading-[1.6]
                                                    text-text-muted
                                                "
                                            >
                                                {accountRole}
                                            </p>
                                        </div>

                                        <div className="pt-1">
                                            <Link
                                                to={dashboardPath}
                                                onClick={() =>
                                                    setUserMenuOpen(false)
                                                }
                                                role="menuitem"
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2.5

                                                    rounded-md

                                                    px-3
                                                    py-2.5

                                                    font-bengali
                                                    text-[13px]
                                                    font-medium!
                                                    text-text-body

                                                    transition-colors
                                                    duration-200

                                                    hover:bg-primary-soft
                                                    hover:text-primary-deep
                                                "
                                            >
                                                <LayoutDashboard
                                                    size={16}
                                                    strokeWidth={1.8}
                                                />

                                                <span>ড্যাশবোর্ড</span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                role="menuitem"
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-2.5

                                                    rounded-md

                                                    px-3
                                                    py-2.5

                                                    text-left

                                                    font-bengali
                                                    text-[13px]
                                                    font-medium!
                                                    text-text-secondary

                                                    transition-colors
                                                    duration-200

                                                    hover:bg-surface-soft
                                                    hover:text-error
                                                "
                                            >
                                                <LogOut
                                                    size={16}
                                                    strokeWidth={1.8}
                                                />

                                                <span>লগ আউট</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DONATION CTA */}

                        <Link
                            to="/donate"
                            className="
                                inline-flex
                                h-11
                                items-center
                                justify-center

                                rounded-lg

                                bg-accent

                                px-5

                                font-bengali
                                text-[15px]
                                font-medium!
                                leading-none
                                text-text-primary!

                                shadow-[0_5px_14px_-8px_rgba(181,121,34,0.55)]

                                transition-all
                                duration-200

                                hover:-translate-y-px
                                hover:bg-accent-hover
                                hover:text-white!
                                hover:shadow-[0_8px_18px_-10px_rgba(181,121,34,0.6)]

                                active:translate-y-0

                                focus-visible:ring-2
                                focus-visible:ring-accent
                                focus-visible:ring-offset-2
                            "
                        >
                            দান করুন
                        </Link>
                    </div>

                    {/* =========================================
                        MOBILE MENU BUTTON
                        MOBILE ONLY — REDESIGNED
                    ========================================= */}

                    <button
                        type="button"
                        onClick={() => {
                            setMobileOpen((previous) => !previous);

                            setActiveMenu(null);
                        }}
                        aria-label={
                            mobileOpen ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'
                        }
                        aria-expanded={mobileOpen}
                        className="
                            relative
                            z-[1200]

                            ml-auto

                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            text-text-primary

                            transition-colors
                            duration-200

                            hover:text-primary

                            lg:hidden
                        "
                    >
                        <span
                            className={`
                                absolute
                                h-[2px]
                                w-[22px]
                                rounded-full
                                bg-current
                                transition-all
                                duration-200

                                ${
                                    mobileOpen
                                        ? 'rotate-45'
                                        : '-translate-y-[6px]'
                                }
                            `}
                        />

                        <span
                            className={`
                                absolute
                                h-[2px]
                                w-[22px]
                                rounded-full
                                bg-current
                                transition-all
                                duration-200

                                ${mobileOpen ? 'opacity-0' : 'opacity-100'}
                            `}
                        />

                        <span
                            className={`
                                absolute
                                h-[2px]
                                w-[22px]
                                rounded-full
                                bg-current
                                transition-all
                                duration-200

                                ${
                                    mobileOpen
                                        ? '-rotate-45'
                                        : 'translate-y-[6px]'
                                }
                            `}
                        />
                    </button>
                </div>
            </header>

            {/* =================================================
                DESKTOP MEGA MENU — UNTOUCHED
            ================================================= */}

            {activeItem?.type === 'mega' && (
                <MegaMenu
                    item={activeItem}
                    onClose={() => setActiveMenu(null)}
                />
            )}

            {/* =================================================
                MOBILE NAVIGATION — REDESIGNED
            ================================================= */}

            <div
                className={`
                    fixed
                    inset-x-0
                    bottom-0
                    top-[84px]
                    z-[1050]

                    bg-surface

                    transition-[opacity,visibility]
                    duration-200

                    lg:hidden

                    ${
                        mobileOpen
                            ? `
                                visible
                                opacity-100
                            `
                            : `
                                invisible
                                pointer-events-none
                                opacity-0
                            `
                    }
                `}
            >
                <div
                    className="
                        flex
                        h-full
                        flex-col
                    "
                >
                    {/* SCROLLABLE NAV */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto

                            px-5
                            pb-8
                            pt-2

                            sm:px-7
                        "
                    >
                        <NavMenu
                            mobile
                            onClose={closeNavigation}
                            activeMenu={activeMenu}
                            setActiveMenu={setActiveMenu}
                        />
                    </div>

                    {/* MOBILE ACTION AREA */}

                    <div
                        className="
                            shrink-0

                            border-t
                            border-border

                            bg-surface

                            px-5
                            pb-[max(20px,env(safe-area-inset-bottom))]
                            pt-4

                            sm:px-7
                        "
                    >
                        {isLoggedIn ? (
                            <>
                                {/* USER */}

                                <div
                                    className="
                                        mb-4

                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="
                                                truncate

                                                font-bengali
                                                text-[14px]
                                                font-medium!
                                                leading-[1.5]
                                                text-text-primary
                                            "
                                        >
                                            {userName}
                                        </p>

                                        <p
                                            className="
                                                mt-0.5

                                                font-bengali
                                                text-[11px]
                                                leading-[1.5]
                                                text-text-muted
                                            "
                                        >
                                            {accountRole}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            shrink-0
                                            items-center
                                            gap-4
                                        "
                                    >
                                        <Link
                                            to={dashboardPath}
                                            onClick={closeNavigation}
                                            className="
                                                font-bengali
                                                text-[12px]
                                                font-medium!
                                                text-primary

                                                transition-colors
                                                hover:text-primary-hover
                                            "
                                        >
                                            ড্যাশবোর্ড
                                        </Link>

                                        <span
                                            className="
                                                h-3.5
                                                w-px
                                                bg-border-strong
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="
                                                font-bengali
                                                text-[12px]
                                                font-medium!
                                                text-text-secondary

                                                transition-colors
                                                hover:text-error
                                            "
                                        >
                                            লগ আউট
                                        </button>
                                    </div>
                                </div>

                                <Link
                                    to="/donate"
                                    onClick={closeNavigation}
                                    className="
                                        flex
                                        h-12
                                        w-full
                                        items-center
                                        justify-center

                                        rounded-lg

                                        bg-accent

                                        font-bengali
                                        text-[15px]
                                        font-medium!
                                        text-text-primary!

                                        transition-colors
                                        duration-200

                                        hover:bg-accent-hover
                                        hover:text-white!
                                    "
                                >
                                    দান করুন
                                </Link>
                            </>
                        ) : (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <Link
                                    to="/login"
                                    onClick={closeNavigation}
                                    className="
                                        flex
                                        h-12
                                        flex-1
                                        items-center
                                        justify-center

                                        rounded-lg
                                        border
                                        border-border-strong

                                        bg-surface

                                        font-bengali
                                        text-[14px]
                                        font-medium!
                                        text-text-primary

                                        transition-colors
                                        duration-200

                                        hover:border-primary
                                        hover:text-primary
                                    "
                                >
                                    লগইন
                                </Link>

                                <Link
                                    to="/donate"
                                    onClick={closeNavigation}
                                    className="
                                        flex
                                        h-12
                                        flex-[1.25]
                                        items-center
                                        justify-center

                                        rounded-lg

                                        bg-accent

                                        font-bengali
                                        text-[14px]
                                        font-medium!
                                        text-text-primary!

                                        transition-colors
                                        duration-200

                                        hover:bg-accent-hover
                                        hover:text-white!
                                    "
                                >
                                    দান করুন
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
