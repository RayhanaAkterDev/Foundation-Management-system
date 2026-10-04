import { Link } from 'react-router-dom';
import {
    TbArrowLeft,
    TbLockAccess,
    TbSettings,
    TbShieldCheck,
} from 'react-icons/tb';

import LoginForm from '../Login/LoginForm';
import logo from '@/assets/shared/logo.png';
import login from '@/assets/auth/login.png';

const AdminLogin = () => {
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
                                font-sans
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
                            For people, with people
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
                            font-sans
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
                        Back to home
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
                        LEFT
                    ====================================================== */}
                    <section
                        className="
                            relative
                            w-full
                            overflow-hidden

                            lg:w-1/2
                        "
                    >
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
                                        tracking-[0.12em]
                                        text-[#0f766e]

                                        sm:text-[9.5px]
                                        lg:text-[10px]
                                        xl:text-[11px]
                                    "
                                >
                                    SP ADMINISTRATION
                                </span>
                            </div>

                            <h1
                                className="
                                    mt-4
                                    max-w-[610px]
                                    font-fraunces
                                    text-[32px]
                                    font-medium!
                                    leading-[1.15]
                                    tracking-[-0.025em]
                                    text-[#163c37]

                                    sm:mt-5
                                    sm:text-[38px]

                                    lg:text-[38px]

                                    xl:mt-6
                                    xl:text-[48px]

                                    2xl:text-[54px]
                                "
                            >
                                Coordinate the work
                                <span className="block text-[#0f766e]">
                                    that moves people forward.
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-6
                                    max-w-[590px]
                                    font-sans
                                    text-[12px]
                                    leading-[1.8]
                                    text-[#71827d]

                                    sm:text-[13px]
                                    lg:text-[12.5px]
                                    xl:text-[14px]
                                    2xl:text-[15px]
                                "
                            >
                                Manage people, organizations, campaigns,
                                donations, volunteers and platform activity from
                                one coordinated administration workspace.
                            </p>
                        </div>

                        {/* IMAGE */}
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
                            <div className="absolute inset-0 bg-[#dfe9e6]">
                                <img
                                    src={login}
                                    alt="Stand For People humanitarian coordination"
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
                                        font-sans
                                        text-[8px]
                                        font-medium!
                                        tracking-[0.16em]
                                        text-white/70
                                        [writing-mode:vertical-rl]

                                        sm:text-[9px]
                                        lg:text-[10px]
                                    "
                                >
                                    COORDINATION · TRUST · ACCOUNTABILITY
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        RIGHT — ADMIN LOGIN
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
                                CARD TOP
                            ============================================== */}
                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    bg-[#0f6b61]
                                    px-5
                                    pt-5
                                    pb-6

                                    sm:px-7
                                    sm:pt-7
                                    sm:pb-7

                                    lg:px-6
                                    lg:pt-6
                                    lg:pb-6

                                    xl:px-9
                                    xl:pt-8
                                    xl:pb-8
                                "
                            >
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
                                                tracking-[0.15em]
                                                text-white/55

                                                sm:text-[9px]
                                                xl:text-[10px]
                                            "
                                        >
                                            ADMIN ACCESS
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
                                        <TbLockAccess size={18} />
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
                                    <h2
                                        className="
                                            mt-2
                                            font-fraunces
                                            text-[27px]
                                            font-medium!
                                            leading-[1.15]
                                            tracking-[-0.02em]
                                            text-white!

                                            sm:text-[31px]
                                            lg:text-[29px]
                                            xl:text-[36px]
                                            2xl:text-[39px]
                                        "
                                    >
                                        Administration Portal
                                    </h2>

                                    <p
                                        className="
                                            mt-3
                                            max-w-[430px]
                                            font-sans
                                            text-[10.5px]
                                            leading-[1.75]
                                            text-white/55

                                            sm:text-[11.5px]
                                            lg:text-[11px]
                                            xl:text-[12.5px]
                                        "
                                    >
                                        Sign in with your authorized
                                        administrator account to access the
                                        platform management workspace.
                                    </p>
                                </div>

                                {/* ADMIN IDENTITY */}
                                <div
                                    className="
                                        relative
                                        z-10
                                        mt-5
                                        flex
                                        items-center
                                        gap-3
                                        rounded-[10px]
                                        border
                                        border-white/10
                                        bg-white/[0.06]
                                        px-3.5
                                        py-3

                                        sm:mt-6
                                        sm:px-4
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-[8px]
                                            bg-white/[0.08]
                                            text-white/70
                                        "
                                    >
                                        <TbSettings size={16} />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                font-sans
                                                text-[10.5px]
                                                font-semibold!
                                                text-white/85

                                                sm:text-[11px]
                                            "
                                        >
                                            Administrator account
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                font-sans
                                                text-[8.5px]
                                                leading-[1.6]
                                                text-white/45

                                                sm:text-[9px]
                                            "
                                        >
                                            Restricted access for authorized
                                            Stand For People administrators.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =============================================
                                SHARED LOGIN FORM — ADMIN MODE
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
                                <LoginForm loginRole="admin" />
                            </div>

                            {/* =============================================
                                FOOTER
                            ============================================== */}
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-2.5
                                    border-t
                                    border-[#e5ece9]
                                    bg-[#f7faf8]
                                    px-5
                                    py-4
                                    text-[#81918c]

                                    sm:items-center
                                    sm:px-7

                                    lg:px-6

                                    xl:px-9
                                "
                            >
                                <TbShieldCheck
                                    size={14}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-[#0f766e]/60

                                        sm:mt-0
                                    "
                                />

                                <p
                                    className="
                                        font-sans
                                        text-[8.5px]
                                        leading-[1.7]

                                        sm:text-[9.5px]
                                    "
                                >
                                    Administrator access is restricted and
                                    platform activity may be logged for security
                                    and accountability.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
