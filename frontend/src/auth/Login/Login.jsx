import { Link, useSearchParams } from 'react-router-dom';
import {
    TbArrowLeft,
    TbBuildingCommunity,
    TbShieldCheck,
    TbUser,
} from 'react-icons/tb';

import LoginForm from './LoginForm';
import logo from '@/assets/shared/logo.png';
import login from '@/assets/auth/login.png';

const Login = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const role = searchParams.get('role') || 'individual';

    const handleRoleChange = (selectedRole) => {
        setSearchParams(
            {
                role: selectedRole,
            },
            {
                replace: true,
            },
        );
    };

    const isIndividual = role === 'individual';
    const isOrganization = role === 'organization';

    return (
        <main className="min-h-screen bg-[#f7f8f5]">
            <div className="container-width">
                {/* =========================================================
                    HEADER
                ========================================================== */}
                <header
                    className="
                        flex
                        h-[72px]
                        items-center
                        justify-between

                        sm:h-[78px]
                        lg:h-20
                        xl:h-22
                    "
                >
                    <Link
                        to="/"
                        className="
                            group
                            flex
                            min-w-0
                            items-center
                            gap-2.5

                            sm:gap-3
                            xl:gap-4
                        "
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="
                                h-13
                                w-auto
                                shrink-0
                                object-contain
                                transition-opacity
                                duration-200

                                group-hover:opacity-85

                                sm:h-15
                                lg:h-18
                            "
                        />

                        <span
                            className="
                                hidden
                                h-6
                                w-px
                                shrink-0
                                bg-[#d9e2df]

                                sm:block
                                xl:h-7
                            "
                        />

                        <p
                            className="
                                hidden
                                font-bengali
                                text-[9px]
                                font-medium!
                                text-[#73857f]

                                sm:block
                                sm:text-[9.5px]

                                lg:text-[10px]
                                xl:text-[11px]
                                2xl:text-[11.5px]
                            "
                        >
                            মানুষের পাশে, মানুষের জন্য
                        </p>
                    </Link>

                    <Link
                        to="/"
                        className="
                            group
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            font-bengali
                            text-[9.5px]
                            font-medium!
                            text-[#60736d]
                            transition-colors
                            duration-200

                            hover:text-[#0f766e]

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#0f766e]
                            focus-visible:ring-offset-4

                            sm:gap-2
                            sm:text-[10px]

                            lg:text-[10.5px]
                            xl:gap-2.5
                            xl:text-[11.5px]
                            2xl:text-[12px]
                        "
                    >
                        <TbArrowLeft
                            size={16}
                            className="
                                transition-transform
                                duration-200
                                group-hover:-translate-x-1
                            "
                        />
                        হোমে ফিরে যান
                    </Link>
                </header>

                {/* =========================================================
                    MAIN
                ========================================================== */}
                <div
                    className="
                        flex
                        min-h-[calc(100vh-72px)]
                        flex-col
                        gap-0

                        sm:min-h-[calc(100vh-78px)]

                        lg:min-h-[calc(100vh-80px)]
                        lg:flex-row
                        lg:gap-8

                        xl:min-h-[calc(100vh-88px)]
                        xl:gap-12

                        2xl:gap-16
                    "
                >
                    {/* =====================================================
                        LEFT — EDITORIAL SIDE
                    ====================================================== */}
                    <section
                        className="
                            relative
                            w-full
                            overflow-hidden

                            lg:w-1/2
                        "
                    >
                        {/* INTRO */}
                        <div
                            className="
                                relative
                                z-20
                                pt-6
                                pb-8

                                sm:pt-8
                                sm:pb-10

                                lg:pt-9
                                lg:pb-0

                                xl:pt-12
                                2xl:pt-14
                            "
                        >
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-8 bg-[#f59e0b]" />

                                <span
                                    className="
                                        font-sans
                                        text-[9px]
                                        font-semibold
                                        tracking-[0.07em]
                                        text-[#0f766e]

                                        sm:text-[9.5px]
                                        lg:text-[10px]
                                        xl:text-[11px]
                                    "
                                >
                                    STAND FOR PEOPLE
                                </span>
                            </div>

                            <h1
                                className="
                                    mt-4
                                    max-w-[580px]
                                    font-bengali
                                    text-[29px]
                                    font-semibold
                                    leading-[1.45]
                                    tracking-[-0.03em]
                                    text-[#163c37]

                                    sm:mt-5
                                    sm:text-[34px]

                                    lg:text-[34px]

                                    xl:mt-6
                                    xl:text-[42px]

                                    2xl:text-[48px]
                                "
                            >
                                মানুষের পাশে থাকার
                                <span className="block text-[#0f766e]">
                                    কাজটি আবার শুরু করুন।
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-3
                                    max-w-[620px]
                                    font-bengali
                                    text-[11.5px]
                                    leading-[1.9]
                                    text-[#71827d]

                                    sm:mt-4
                                    sm:text-[12.5px]

                                    lg:text-[12px]
                                    xl:text-[14px]
                                    2xl:text-[15px]
                                "
                            >
                                আপনার সহায়তা, স্বেচ্ছাসেবা এবং মানবিক উদ্যোগের
                                সঙ্গে তৈরি হওয়া সংযোগগুলো এক জায়গা থেকে পরিচালনা
                                করুন।
                            </p>
                        </div>

                        {/* IMAGE AREA */}
                        <div
                            className="
                                relative hidden lg:block
                                mb-7
                                h-[280px]
                                w-full
                                overflow-hidden

                                sm:mb-10
                                sm:h-[360px]

                                md:h-[420px]

                                lg:absolute
                                lg:top-70
                                xl:top-84
                                2xl:top-100
                                lg:bottom-10
                                lg:mb-0
                                lg:h-auto

                                rounded-2xl
                            "
                        >
                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-[#dfe9e6]
                                "
                            >
                                <img
                                    src={login}
                                    alt="মানুষের পাশে স্বেচ্ছাসেবকেরা"
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        object-center
                                    "
                                />
                            </div>


                            <div
                                className="
                                    absolute
                                    top-0
                                    right-0
                                    bottom-0
                                    flex
                                    w-[11%]
                                    items-center
                                    justify-center
                                    bg-black/30

                                    sm:w-[10%]
                                    2xl:w-[13%]
                                "
                            >
                                <p
                                    className="
                                        rotate-180
                                        font-bengali
                                        text-[9px]
                                        font-medium!
                                        tracking-[0.1em]
                                        text-white/70
                                        [writing-mode:vertical-rl]

                                        sm:text-[10px]
                                        lg:text-[12px]
                                    "
                                >
                                    মর্যাদা · সংহতি · মানবিক উদ্যোগ
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        RIGHT — LOGIN ENVIRONMENT
                    ====================================================== */}
                    <section
                        className="
                            relative
                            flex
                            w-full
                            items-center
                            px-0
                            pt-2
                            pb-8

                            sm:pt-3
                            sm:pb-10

                            lg:w-1/2
                            lg:p-4

                            xl:p-6
                            2xl:p-10
                        "
                    >
                        {/* =================================================
                            COMPLETE AUTH CARD
                        ================================================== */}
                        <div
                            className="
                                relative
                                mx-auto
                                w-full
                                overflow-hidden
                                rounded-xl
                                border
                                border-[#d8e4e0]
                                bg-white
                                shadow-[0_18px_50px_rgba(17,62,55,0.10)]

                                sm:max-w-[680px]

                                lg:max-w-none
                                lg:shadow-[0_24px_70px_rgba(17,62,55,0.13)]
                            "
                        >
                            {/* =============================================
                                CARD TOP / IDENTITY
                            ============================================== */}
                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    bg-[#0f6b61]
                                    px-5
                                    pt-5
                                    pb-5

                                    sm:px-7
                                    sm:pt-7
                                    sm:pb-6

                                    lg:px-6
                                    lg:pt-6
                                    lg:pb-5

                                    xl:px-9
                                    xl:pt-8
                                    xl:pb-7
                                "
                            >
                                {/* subtle visual detail */}
                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        -top-20
                                        -right-16
                                        h-56
                                        w-56
                                        rounded-full
                                        border
                                        border-white/[0.06]
                                    "
                                />

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        -top-5
                                        -right-2
                                        h-32
                                        w-32
                                        rounded-full
                                        border
                                        border-white/[0.06]
                                    "
                                />

                                {/* TOP MARKER */}
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <span
                                            className="
                                                h-[2px]
                                                w-6
                                                bg-[#f59e0b]

                                                sm:w-8
                                            "
                                        />

                                        <span
                                            className="
                                                font-sans
                                                text-[8px]
                                                font-semibold
                                                tracking-[0.13em]
                                                text-white/55

                                                sm:text-[9px]
                                                xl:text-[10px]
                                            "
                                        >
                                            ACCOUNT ACCESS
                                        </span>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-[9px]
                                            border
                                            border-white/10
                                            bg-white/[0.06]
                                            text-white/60

                                            sm:h-9
                                            sm:w-9
                                            sm:rounded-[10px]
                                        "
                                    >
                                        <TbShieldCheck size={18} />
                                    </div>
                                </div>

                                {/* HEADING */}
                                <div
                                    className="
                                        relative
                                        z-10
                                        mt-5

                                        sm:mt-6
                                    "
                                >
                                    <p
                                        className="
                                            font-bengali
                                            text-[10px]
                                            font-medium!
                                            text-[#f6c27d]

                                            sm:text-[11px]
                                            xl:text-[12px]
                                        "
                                    >
                                        অ্যাকাউন্টে প্রবেশ
                                    </p>

                                    <h2
                                        className="
                                            mt-1.5
                                            font-bengali
                                            text-[25px]
                                            font-semibold
                                            leading-[1.4]
                                            tracking-[-0.025em]
                                            text-white!

                                            sm:text-[29px]

                                            lg:text-[27px]

                                            xl:text-[33px]
                                            2xl:text-[36px]
                                        "
                                    >
                                        আবার স্বাগতম
                                    </h2>

                                    <p
                                        className="
                                            mt-2
                                            max-w-[390px]
                                            font-bengali
                                            text-[10.5px]
                                            leading-[1.85]
                                            text-white/55

                                            sm:text-[11.5px]

                                            lg:text-[11px]

                                            xl:text-[12.5px]
                                        "
                                    >
                                        আপনার পরিচয় নির্বাচন করে অ্যাকাউন্টে
                                        প্রবেশ করুন।
                                    </p>
                                </div>

                                {/* =========================================
                                    ROLE SWITCHER
                                ========================================== */}
                                <div
                                    className="
                                        relative
                                        z-10
                                        mt-5

                                        sm:mt-6
                                    "
                                >
                                    <p
                                        className="
                                            mb-2
                                            font-bengali
                                            text-[9px]
                                            font-medium!
                                            text-white/50

                                            sm:mb-2.5
                                            sm:text-[10px]
                                        "
                                    >
                                        প্রবেশের পরিচয়
                                    </p>

                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            overflow-hidden
                                            rounded-[12px]
                                            border
                                            border-white/15
                                            bg-white/[0.06]
                                            p-1
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange('individual')
                                            }
                                            aria-pressed={isIndividual}
                                            className={`
                                                relative
                                                flex
                                                h-[48px]
                                                min-w-0
                                                items-center
                                                gap-2
                                                rounded-[9px]
                                                px-3
                                                text-left
                                                transition-all
                                                duration-200

                                                sm:h-[52px]
                                                sm:gap-3
                                                sm:px-4

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-[#f59e0b]

                                                ${
                                                    isIndividual
                                                        ? `
                                                            bg-white
                                                            text-[#0f6258]
                                                            shadow-[0_4px_14px_rgba(0,0,0,0.08)]
                                                          `
                                                        : `
                                                            text-white/60
                                                            hover:bg-white/[0.06]
                                                            hover:text-white!
                                                          `
                                                }
                                            `}
                                        >
                                            <TbUser
                                                size={19}
                                                className="shrink-0"
                                            />

                                            <span
                                                className="
                                                    truncate
                                                    font-bengali
                                                    text-[10.5px]
                                                    font-semibold

                                                    sm:text-[11.5px]
                                                "
                                            >
                                                ব্যক্তি
                                            </span>

                                            {isIndividual && (
                                                <span
                                                    className="
                                                        absolute
                                                        right-2.5
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        bg-[#f59e0b]

                                                        sm:right-3
                                                    "
                                                />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange('organization')
                                            }
                                            aria-pressed={isOrganization}
                                            className={`
                                                relative
                                                flex
                                                h-[48px]
                                                min-w-0
                                                items-center
                                                gap-2
                                                rounded-[9px]
                                                px-3
                                                text-left
                                                transition-all
                                                duration-200

                                                sm:h-[52px]
                                                sm:gap-3
                                                sm:px-4

                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-[#f59e0b]

                                                ${
                                                    isOrganization
                                                        ? `
                                                            bg-white
                                                            text-[#0f6258]
                                                            shadow-[0_4px_14px_rgba(0,0,0,0.08)]
                                                          `
                                                        : `
                                                            text-white/60
                                                            hover:bg-white/[0.06]
                                                            hover:text-white!
                                                          `
                                                }
                                            `}
                                        >
                                            <TbBuildingCommunity
                                                size={19}
                                                className="shrink-0"
                                            />

                                            <span
                                                className="
                                                    truncate
                                                    font-bengali
                                                    text-[10.5px]
                                                    font-semibold

                                                    sm:text-[11.5px]
                                                "
                                            >
                                                প্রতিষ্ঠান
                                            </span>

                                            {isOrganization && (
                                                <span
                                                    className="
                                                        absolute
                                                        right-2.5
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        bg-[#f59e0b]

                                                        sm:right-3
                                                    "
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* =============================================
                                LOGIN FORM AREA
                            ============================================== */}
                            <div
                                className="
                                    bg-white
                                    px-5
                                    py-6

                                    sm:px-7
                                    sm:py-7

                                    lg:px-6
                                    lg:py-6

                                    xl:px-9
                                    xl:py-8
                                "
                            >
                                <LoginForm />
                            </div>

                            {/* =============================================
                                BOTTOM AREA
                            ============================================== */}
                            <div
                                className="
                                    border-t
                                    border-[#e5ece9]
                                    bg-[#f7faf8]
                                    px-5
                                    py-4

                                    sm:px-7
                                    sm:py-5

                                    lg:px-6

                                    xl:px-9
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4

                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                        sm:gap-5

                                        lg:flex-col
                                        lg:items-start

                                        xl:flex-row
                                        xl:items-center
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-x-4
                                            gap-y-2
                                            font-bengali
                                            text-[8.5px]
                                            text-[#81918c]

                                            sm:text-[9px]
                                            2xl:text-[10px]
                                        "
                                    >
                                        <Link
                                            to="/terms"
                                            className="
                                                transition-colors
                                                hover:text-[#0f766e]
                                            "
                                        >
                                            ব্যবহারের শর্তাবলি
                                        </Link>

                                        <Link
                                            to="/privacy"
                                            className="
                                                transition-colors
                                                hover:text-[#0f766e]
                                            "
                                        >
                                            গোপনীয়তা নীতি
                                        </Link>

                                        <Link
                                            to="/contact"
                                            className="
                                                transition-colors
                                                hover:text-[#0f766e]
                                            "
                                        >
                                            যোগাযোগ
                                        </Link>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            gap-3

                                            sm:w-auto
                                            sm:justify-start
                                        "
                                    >
                                        <p
                                            className="
                                                font-bengali
                                                text-[9.5px]
                                                text-[#84938e]

                                                sm:text-[10px]
                                            "
                                        >
                                            এখনো অ্যাকাউন্ট নেই?
                                        </p>

                                        <Link
                                            to="/register"
                                            className="
                                                group
                                                inline-flex
                                                shrink-0
                                                items-center
                                                gap-1.5
                                                whitespace-nowrap
                                                font-bengali
                                                text-[10px]
                                                font-semibold
                                                text-[#0f766e]
                                                transition-colors

                                                hover:text-[#115e59]

                                                sm:text-[10.5px]
                                            "
                                        >
                                            অ্যাকাউন্ট তৈরি করুন
                                            <span
                                                className="
                                                    transition-transform
                                                    duration-200
                                                    group-hover:translate-x-1
                                                "
                                            >
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Login;
