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

    /* =====================================================
       LOGOUT TRANSITION STATE
    ====================================================== */

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    /*
     * Store the URL that failed instead of resetting state
     * inside an effect. This avoids react-hooks/set-state-in-effect.
     */

    const [failedPhotoUrl, setFailedPhotoUrl] = useState(null);

    const userMenuRef = useRef(null);

    /* =====================================================
       SCROLL STATE
    ====================================================== */

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
    ====================================================== */

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
    ====================================================== */

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
    ====================================================== */

    useEffect(() => {
        document.body.style.overflow =
            mobileOpen || isLoggingOut ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen, isLoggingOut]);

    /* =====================================================
       DERIVED DATA
    ====================================================== */

    const activeItem = navLinks.find((item) => item.id === activeMenu);

    const isLoggedIn = Boolean(auth.token && auth.user);

    const userName = auth.user?.name || auth.user?.full_name || 'অ্যাকাউন্ট';

    const userPhoto = auth.user?.photo || null;

    /*
     * If ImageKit returns a broken image, only that specific
     * URL is considered failed. A new photo URL can still load.
     */

    const showUserPhoto = Boolean(userPhoto) && failedPhotoUrl !== userPhoto;

    const userInitial = userName?.trim()?.charAt(0)?.toUpperCase() || 'U';

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
    ====================================================== */

    const closeNavigation = () => {
        setMobileOpen(false);
        setActiveMenu(null);
        setUserMenuOpen(false);
    };

    /* =====================================================
       LOGOUT
    ====================================================== */

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        /*
         * Do NOT close the dropdown/mobile navigation here.
         * The entire existing page remains underneath the
         * glass overlay while logout is processing.
         */

        setIsLoggingOut(true);

        /*
         * Intentional visual transition.
         * Keep this synchronized with logoutProgress below.
         */

        await new Promise((resolve) => {
            setTimeout(resolve, 2300);
        });

        /* ---------------------------------------------
           CLEAR AUTH
        ---------------------------------------------- */

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        setAuth({
            token: null,
            user: null,
        });

        setFailedPhotoUrl(null);

        window.dispatchEvent(new Event('auth-changed'));

        /* ---------------------------------------------
           NAVIGATE HOME
        ---------------------------------------------- */

        navigate('/', {
            replace: true,
        });

        setMobileOpen(false);
        setActiveMenu(null);
        setUserMenuOpen(false);

        /*
         * Keep the overlay for a fraction longer so the
         * underlying page can switch before revealing it.
         */

        setTimeout(() => {
            setIsLoggingOut(false);
        }, 250);
    };

    /* =====================================================
       USER AVATAR FALLBACK
    ====================================================== */

    const avatarFallback = (size = 'desktop') => {
        const isMobile = size === 'mobile';

        const dimension = isMobile ? 'h-9 w-9' : 'h-8 w-8';

        const textSize = isMobile ? 'text-[13px]' : 'text-[12px]';

        return (
            <span
                aria-hidden="true"
                className={`
                    flex
                    ${dimension}
                    shrink-0
                    items-center
                    justify-center

                    rounded-full

                    bg-primary-soft

                    font-bengali
                    ${textSize}
                    font-semibold!

                    text-primary
                `}
            >
                {userInitial}
            </span>
        );
    };

    /* =====================================================
       RENDER
    ====================================================== */

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
                    z-1100

                    transition-[background-color,border-color,box-shadow]
                    duration-300

                    ${
                        scrolled
                            ? `
                                bg-surface/95

                                shadow-[0_10px_30px_-24px_rgba(15,23,42,0.28)]

                                backdrop-blur-xl
                            `
                            : `
                                bg-surface
                            `
                    }
                `}
            >
                <div
                    className="
                        container-width

                        flex
                        h-20
                        items-center

                        lg:h-22
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
                            z-1200

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
                                h-16
                                w-auto
                                object-contain

                                lg:h-18
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
                            items-center
                            justify-center

                            px-5

                            lg:flex
                            xl:px-8
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
                            gap-2

                            lg:flex
                        "
                    >
                        {/* DONATION CTA */}

                        <Link
                            to="/donate"
                            className="
                                ml-1

                                inline-flex
                                h-10
                                items-center
                                justify-center

                                rounded-lg

                                bg-accent

                                px-4

                                font-bengali
                                text-[14px]
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

                        {/* LOGIN */}

                        {!isLoggedIn && (
                            <Link
                                to="/login?role=individual"
                                className="
                                    group
                                    relative

                                    inline-flex
                                    h-10
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
                                        h-10
                                        items-center
                                        gap-2

                                        rounded-lg

                                        px-2.5

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
                                    {showUserPhoto ? (
                                        <img
                                            src={userPhoto}
                                            alt=""
                                            aria-hidden="true"
                                            onError={() =>
                                                setFailedPhotoUrl(userPhoto)
                                            }
                                            className="
                                                h-8
                                                w-8
                                                shrink-0

                                                rounded-full

                                                object-cover

                                                ring-1
                                                ring-border
                                            "
                                        />
                                    ) : (
                                        avatarFallback()
                                    )}

                                    <span className="max-w-25 truncate">
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

                                {/* USER DROPDOWN */}

                                {userMenuOpen && (
                                    <div
                                        role="menu"
                                        className="
                                            absolute
                                            right-0
                                            top-[calc(100%+12px)]

                                            w-62.5

                                            overflow-hidden

                                            rounded-xl

                                            border
                                            border-border

                                            bg-surface

                                            p-2

                                            shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]
                                        "
                                    >
                                        {/* USER INFO */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3

                                                rounded-lg

                                                border-b
                                                border-border

                                                px-3
                                                py-3
                                            "
                                        >
                                            {showUserPhoto ? (
                                                <img
                                                    src={userPhoto}
                                                    alt=""
                                                    aria-hidden="true"
                                                    onError={() =>
                                                        setFailedPhotoUrl(
                                                            userPhoto,
                                                        )
                                                    }
                                                    className="
                                                        h-10
                                                        w-10
                                                        shrink-0

                                                        rounded-full

                                                        object-cover

                                                        ring-1
                                                        ring-border
                                                    "
                                                />
                                            ) : (
                                                avatarFallback('mobile')
                                            )}

                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        truncate

                                                        font-bengali
                                                        text-[14px]
                                                        font-medium!
                                                        leading-normal

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
                                        </div>

                                        <div className="pt-1">
                                            {/* DASHBOARD */}

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

                                            {/* LOGOUT */}

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
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

                                                    disabled:pointer-events-none
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
                    </div>

                    {/* =========================================
                        MOBILE MENU BUTTON
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
                            z-1200

                            ml-auto

                            flex
                            h-10
                            w-10
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

                                h-0.5
                                w-5.25

                                rounded-full

                                bg-current

                                transition-all
                                duration-200

                                ${mobileOpen ? 'rotate-45' : '-translate-y-1.5'}
                            `}
                        />

                        <span
                            className={`
                                absolute

                                h-0.5
                                w-5.25

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

                                h-0.5
                                w-5.25

                                rounded-full

                                bg-current

                                transition-all
                                duration-200

                                ${mobileOpen ? '-rotate-45' : 'translate-y-1.5'}
                            `}
                        />
                    </button>
                </div>
            </header>

            {/* =================================================
                DESKTOP MEGA MENU
            ================================================= */}

            {activeItem?.type === 'mega' && (
                <MegaMenu
                    item={activeItem}
                    onClose={() => setActiveMenu(null)}
                />
            )}

            {/* =================================================
                MOBILE NAVIGATION
            ================================================= */}

            <div
                className={`
                    fixed
                    inset-x-0
                    bottom-0
                    top-20

                    z-1050

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
                <div className="flex h-full flex-col">
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
                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-3
                                        "
                                    >
                                        {showUserPhoto ? (
                                            <img
                                                src={userPhoto}
                                                alt=""
                                                aria-hidden="true"
                                                onError={() =>
                                                    setFailedPhotoUrl(userPhoto)
                                                }
                                                className="
                                                    h-9
                                                    w-9
                                                    shrink-0

                                                    rounded-full

                                                    object-cover

                                                    ring-1
                                                    ring-border
                                                "
                                            />
                                        ) : (
                                            avatarFallback('mobile')
                                        )}

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    truncate

                                                    font-bengali
                                                    text-[14px]
                                                    font-medium!
                                                    leading-normal

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
                                                    leading-normal

                                                    text-text-muted
                                                "
                                            >
                                                {accountRole}
                                            </p>
                                        </div>
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
                                            disabled={isLoggingOut}
                                            className="
                                                font-bengali
                                                text-[12px]
                                                font-medium!

                                                text-text-secondary

                                                transition-colors

                                                hover:text-error

                                                disabled:pointer-events-none
                                            "
                                        >
                                            লগ আউট
                                        </button>
                                    </div>
                                </div>

                                {/* DONATE */}

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
                                    to="/login?role=individual"
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

            {/* =================================================
                FULL PAGE LOGOUT TRANSITION
            ================================================= */}

            {isLoggingOut && (
                <div
                    role="status"
                    aria-live="polite"
                    aria-label="লগ আউট হচ্ছে"
                    className="
                        fixed
                        inset-0
                        z-[9999]

                        flex
                        items-center
                        justify-center

                        overflow-hidden

                        bg-white/52

                        px-5

                        backdrop-blur-[14px]

                        animate-[logoutOverlayIn_300ms_ease-out_both]
                    "
                >
                    {/* -----------------------------------------
                        BACKGROUND ATMOSPHERE
                    ------------------------------------------ */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none

                            absolute
                            top-1/2
                            left-1/2

                            h-[300px]
                            w-[300px]

                            -translate-x-1/2
                            -translate-y-1/2

                            rounded-full

                            bg-primary-soft/70

                            blur-[90px]

                            sm:h-[430px]
                            sm:w-[430px]
                        "
                    />

                    {/* -----------------------------------------
                        CENTER CONTENT
                    ------------------------------------------ */}

                    <div
                        className="
                            relative
                            z-10

                            flex
                            flex-col
                            items-center

                            text-center

                            animate-[logoutContentIn_450ms_cubic-bezier(0.22,1,0.36,1)_both]
                        "
                    >
                        {/* LOADER */}

                        <div
                            className="
                                relative

                                flex
                                size-[82px]
                                items-center
                                justify-center
                            "
                        >
                            {/* OUTER RING */}

                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    inset-0

                                    rounded-full

                                    border-[1.5px]
                                    border-primary/10
                                    border-r-primary/30
                                    border-t-primary

                                    animate-[spin_1.1s_linear_infinite]
                                "
                            />

                            {/* QUIET INNER RING */}

                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    inset-[8px]

                                    rounded-full

                                    border
                                    border-primary/10
                                "
                            />

                            {/* LOGO */}

                            <span
                                className="
                                    relative

                                    flex
                                    size-[58px]
                                    items-center
                                    justify-center

                                    rounded-full

                                    bg-white/90

                                    shadow-[0_8px_28px_rgba(15,118,110,0.10)]
                                "
                            >
                                <img
                                    src={logo}
                                    alt=""
                                    aria-hidden="true"
                                    className="
                                        h-[35px]
                                        w-auto
                                        object-contain
                                    "
                                />
                            </span>
                        </div>

                        {/* TEXT */}

                        <h2
                            className="
                                mt-6

                                font-bengali

                                text-[20px]
                                font-medium!
                                leading-normal

                                text-text-primary

                                sm:text-[22px]
                            "
                        >
                            লগ আউট হচ্ছে
                            <span
                                aria-hidden="true"
                                className="
                                    logout-dots

                                    inline-block
                                    w-[26px]

                                    text-left
                                    text-primary
                                "
                            >
                                ...
                            </span>
                        </h2>

                        <p
                            className="
                                mt-1.5

                                max-w-[290px]

                                font-bengali
                                text-[12px]
                                leading-6

                                text-text-secondary

                                sm:text-[13px]
                            "
                        >
                            আপনার সেশন নিরাপদভাবে শেষ করা হচ্ছে
                        </p>

                        {/* PROGRESS */}

                        <div
                            className="
                                mt-6

                                h-[2px]
                                w-[160px]

                                overflow-hidden
                                rounded-full

                                bg-primary/10

                                sm:w-[180px]
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    block
                                    h-full
                                    w-full

                                    origin-left

                                    bg-primary

                                    animate-[logoutProgress_2.3s_cubic-bezier(0.2,0.7,0.2,1)_forwards]
                                "
                            />
                        </div>

                        {/* SECURITY NOTE */}

                        <div
                            className="
                                mt-4

                                flex
                                items-center
                                gap-1.5

                                font-bengali
                                text-[10.5px]

                                text-text-muted
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    size-1.5

                                    rounded-full

                                    bg-primary/50
                                "
                            />
                            নিরাপদ সেশন সমাপ্তি
                        </div>
                    </div>

                    {/* -----------------------------------------
                        ANIMATION
                    ------------------------------------------ */}

                    <style>{`
                        @keyframes logoutOverlayIn {
                            from {
                                opacity: 0;
                                backdrop-filter: blur(0px);
                            }

                            to {
                                opacity: 1;
                                backdrop-filter: blur(14px);
                            }
                        }

                        @keyframes logoutContentIn {
                            from {
                                opacity: 0;
                                transform:
                                    translateY(12px)
                                    scale(0.97);
                            }

                            to {
                                opacity: 1;
                                transform:
                                    translateY(0)
                                    scale(1);
                            }
                        }

                        @keyframes logoutProgress {
                            from {
                                transform: scaleX(0);
                            }

                            to {
                                transform: scaleX(1);
                            }
                        }

                        @keyframes logoutDots {
                            0%,
                            20% {
                                clip-path:
                                    inset(0 100% 0 0);
                            }

                            40% {
                                clip-path:
                                    inset(0 66% 0 0);
                            }

                            60% {
                                clip-path:
                                    inset(0 33% 0 0);
                            }

                            80%,
                            100% {
                                clip-path:
                                    inset(0 0 0 0);
                            }
                        }

                        .logout-dots {
                            animation:
                                logoutDots
                                1.2s
                                steps(1)
                                infinite;
                        }

                        @media (prefers-reduced-motion: reduce) {
                            .logout-dots {
                                animation: none;
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default Navbar;
