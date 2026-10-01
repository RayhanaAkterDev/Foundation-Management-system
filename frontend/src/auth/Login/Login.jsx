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
            {/* =========================================================
                DESKTOP
            ========================================================== */}
            <div className="hidden min-h-screen lg:block">
                <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col">
                    {/* =================================================
                        HEADER
                    ================================================== */}
                    <header
                        className="
                            flex
                            h-[78px]
                            shrink-0
                            items-center
                            justify-between
                            px-7
                            xl:h-[86px]
                            xl:px-12
                            2xl:h-[92px]
                            2xl:px-20
                        "
                    >
                        <Link
                            to="/"
                            className="group flex items-center gap-3 xl:gap-4"
                        >
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="
                                    h-9
                                    w-auto
                                    object-contain
                                    transition-opacity
                                    duration-200
                                    group-hover:opacity-85
                                    xl:h-10
                                    2xl:h-11
                                "
                            />

                            <span className="h-6 w-px bg-[#d9e2df] xl:h-7" />

                            <p
                                className="
                                    font-bengali
                                    text-[10px]
                                    font-medium
                                    text-[#73857f]
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
                                items-center
                                gap-2
                                font-bengali
                                text-[10.5px]
                                font-medium
                                text-[#60736d]
                                transition-colors
                                duration-200
                                hover:text-[#0f766e]
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#0f766e]
                                focus-visible:ring-offset-4
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

                    {/* =================================================
                        MAIN
                    ================================================== */}
                    <div
                        className="
                            grid
                            flex-1
                            grid-cols-[minmax(0,1fr)_520px]
                            overflow-hidden
                            xl:grid-cols-[minmax(0,1fr)_560px]
                            2xl:grid-cols-[minmax(50%_50%)]
                        "
                    >
                        {/* =================================================
                            LEFT — EDITORIAL SIDE
                        ================================================== */}
                        <section
                            className="
                                relative
                                min-h-[650px]
                                overflow-hidden
                                border-t
                                border-[#dce4e1]
                                bg-[#f7f8f5]
                                px-7
                                xl:min-h-[680px]
                                xl:px-12
                                2xl:px-20
                            "
                        >
                            {/* INTRO */}
                            <div
                                className="
                                    relative
                                    z-20
                                    max-w-[600px]
                                    pt-9
                                    xl:pt-12
                                    2xl:pt-14
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-[2px] w-8 bg-[#f59e0b]" />

                                    <span
                                        className="
                                            font-sans
                                            text-[10px]
                                            font-semibold
                                            tracking-[0.07em]
                                            text-[#0f766e]
                                            xl:text-[11px]
                                        "
                                    >
                                        STAND FOR PEOPLE
                                    </span>
                                </div>

                                <h1
                                    className="
                                        mt-5
                                        max-w-[600px]
                                        font-bengali
                                        text-[34px]
                                        font-semibold
                                        leading-[1.45]
                                        tracking-[-0.03em]
                                        text-[#163c37]
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
                                        mt-4
                                        max-w-[500px]
                                        font-bengali
                                        text-[12px]
                                        leading-[1.9]
                                        text-[#71827d]
                                        xl:text-[14px]
                                        2xl:text-[15px]
                                    "
                                >
                                    আপনার সহায়তা, স্বেচ্ছাসেবা এবং মানবিক
                                    উদ্যোগের সঙ্গে তৈরি হওয়া সংযোগগুলো এক জায়গা
                                    থেকে পরিচালনা করুন।
                                </p>
                            </div>

                            {/* IMAGE AREA */}
                            <div
                                className="
                                    absolute
                                    inset-x-7
                                    bottom-0
                                    top-[285px]
                                    xl:inset-x-12
                                    xl:top-[330px]
                                    2xl:inset-x-20
                                    2xl:top-[350px]
                                "
                            >
                                <div
                                    className="
                                        absolute
                                        inset-y-0
                                        left-0
                                        w-[72%]
                                        overflow-hidden
                                        bg-[#dfe9e6]
                                        xl:w-[70%]
                                        2xl:w-[68%]
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
                                        bottom-0
                                        left-[30%]
                                        z-10
                                        w-[48%]
                                        bg-black/40
                                        px-5
                                        py-5
                                        xl:left-[30%]
                                        xl:w-[44%]
                                        xl:px-6
                                        xl:py-6
                                        2xl:left-[36%]
                                        2xl:w-[42%]
                                        2xl:px-8
                                        2xl:py-8
                                    "
                                >
                                    <span className="block h-[2px] w-8 bg-[#f59e0b]" />

                                    <p
                                        className="
                                            mt-4
                                            font-bengali
                                            text-[12px]
                                            font-medium
                                            leading-[1.8]
                                            text-white
                                            xl:text-[14px]
                                            2xl:text-[15px]
                                        "
                                    >
                                        একটি উদ্যোগ তখনই অর্থবহ হয়, যখন সেটি
                                        প্রয়োজনের মানুষটির কাছে পৌঁছায়।
                                    </p>

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-center
                                            gap-2
                                            border-t
                                            border-white/15
                                            pt-3
                                        "
                                    >
                                        <TbShieldCheck
                                            size={15}
                                            className="text-[#b9ddd7]"
                                        />

                                        <span className="font-bengali text-[9px] text-white/75">
                                            নিরাপদ ও সমন্বিত মানবিক প্ল্যাটফর্ম
                                        </span>
                                    </div>
                                </div>


                                <div
                                    className="
                                        absolute
                                        bottom-0
                                        right-0
                                        top-0
                                        flex
                                        w-[10%]
                                        items-center
                                        justify-center
                                        border-l
                                        border-[#dce4e1]
                                        2xl:w-[13%]
                                    "
                                >
                                    <p
                                        className="
                                            rotate-180
                                            font-bengali
                                            text-[9px]
                                            font-medium
                                            tracking-[0.1em]
                                            text-[#9aa8a4]
                                            [writing-mode:vertical-rl]
                                        "
                                    >
                                        মর্যাদা · সংহতি · মানবিক উদ্যোগ
                                    </p>
                                </div>

                            </div>
                        </section>

                        {/* =================================================
                            RIGHT — LOGIN ENVIRONMENT
                        ================================================== */}
                        <section
                            className="
                                relative
                                flex
                                min-h-[650px]
                                items-center
                                overflow-hidden
                                bg-[#0f6258]
                                px-7
                                py-9
                                xl:min-h-[680px]
                                xl:px-10
                                xl:py-10
                                2xl:px-14
                            "
                        >
                            {/* DECORATIVE CIRCLES */}
                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-32
                                    -top-32
                                    h-[420px]
                                    w-[420px]
                                    rounded-full
                                    border
                                    border-white/[0.07]
                                    2xl:h-[500px]
                                    2xl:w-[500px]
                                "
                            />

                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -bottom-40
                                    -left-40
                                    h-[460px]
                                    w-[460px]
                                    rounded-full
                                    border
                                    border-[#f59e0b]/[0.08]
                                "
                            />

                            {/* LOGIN CONTENT */}
                            <div
                                className="
                                    relative
                                    z-10
                                    mx-auto
                                    w-full
                                    max-w-[430px]
                                    xl:max-w-[450px]
                                    2xl:max-w-[470px]
                                "
                            >
                                {/* TOP MARKER */}
                                <div className="mb-6 flex items-center justify-between xl:mb-7">
                                    <div className="flex items-center gap-3">
                                        <span className="h-[2px] w-8 bg-[#f59e0b]" />

                                        <span
                                            className="
                                                font-sans
                                                text-[9px]
                                                font-semibold
                                                tracking-[0.12em]
                                                text-white/55
                                                xl:text-[10px]
                                            "
                                        >
                                            ACCOUNT ACCESS
                                        </span>
                                    </div>

                                    <TbShieldCheck
                                        size={20}
                                        className="text-white/40"
                                    />
                                </div>

                                {/* HEADING */}
                                <div>
                                    <p
                                        className="
                                            font-bengali
                                            text-[11px]
                                            font-medium
                                            text-[#f6c27d]
                                        "
                                    >
                                        অ্যাকাউন্টে প্রবেশ
                                    </p>

                                    <h2
                                        className="
                                            mt-1
                                            font-bengali
                                            text-[31px]
                                            font-semibold
                                            leading-[1.4]
                                            tracking-[-0.025em]
                                            text-white
                                            xl:text-[35px]
                                            2xl:text-[39px]
                                        "
                                    >
                                        আবার স্বাগতম
                                    </h2>

                                    <p
                                        className="
                                            mt-1.5
                                            max-w-[380px]
                                            font-bengali
                                            text-[11px]
                                            leading-[1.85]
                                            text-white/55
                                            xl:text-[12px]
                                            2xl:text-[13px]
                                        "
                                    >
                                        আপনার পরিচয় নির্বাচন করে অ্যাকাউন্টে
                                        প্রবেশ করুন।
                                    </p>
                                </div>

                                {/* ROLE SWITCHER */}
                                <div className="mt-6 xl:mt-7">
                                    <p
                                        className="
                                            mb-2.5
                                            font-bengali
                                            text-[10px]
                                            font-medium
                                            text-white/50
                                        "
                                    >
                                        প্রবেশের পরিচয়
                                    </p>

                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            overflow-hidden
                                            border
                                            border-white/15
                                            bg-white/[0.05]
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
                                                h-[61px]
                                                items-center
                                                gap-3
                                                px-4
                                                text-left
                                                transition-all
                                                duration-200
                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-inset
                                                focus-visible:ring-[#f59e0b]
                                                ${
                                                    isIndividual
                                                        ? 'bg-[#f7f8f5] text-[#0f6258]'
                                                        : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                                                }
                                            `}
                                        >
                                            {isIndividual && (
                                                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#f59e0b]" />
                                            )}

                                            <TbUser size={19} />

                                            <span className="font-bengali text-[11px] font-semibold">
                                                ব্যক্তি
                                            </span>
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
                                                h-[61px]
                                                items-center
                                                gap-3
                                                border-l
                                                border-white/15
                                                px-4
                                                text-left
                                                transition-all
                                                duration-200
                                                focus-visible:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-inset
                                                focus-visible:ring-[#f59e0b]
                                                ${
                                                    isOrganization
                                                        ? 'bg-[#f7f8f5] text-[#0f6258]'
                                                        : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                                                }
                                            `}
                                        >
                                            {isOrganization && (
                                                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#f59e0b]" />
                                            )}

                                            <TbBuildingCommunity size={19} />

                                            <span className="font-bengali text-[11px] font-semibold">
                                                প্রতিষ্ঠান
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* LOGIN FORM */}
                                <div className="mt-6 xl:mt-7">
                                    <LoginForm />
                                </div>

                                {/* REGISTER */}
                                <div
                                    className="
                                        mt-6
                                        border-t
                                        border-white/10
                                        pt-5
                                    "
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-bengali text-[10px] text-white/45">
                                            এখনো অ্যাকাউন্ট নেই?
                                        </p>

                                        <Link
                                            to="/register"
                                            className="
                                                group
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                whitespace-nowrap
                                                font-bengali
                                                text-[10.5px]
                                                font-semibold
                                                text-white
                                                transition-colors
                                                hover:text-[#f6c27d]
                                            "
                                        >
                                            অ্যাকাউন্ট তৈরি করুন
                                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* FOOTER */}
                    <footer
                        className="
                            flex
                            h-[48px]
                            shrink-0
                            items-center
                            justify-between
                            border-t
                            border-[#e1e7e5]
                            px-7
                            xl:h-[50px]
                            xl:px-12
                            2xl:h-[54px]
                            2xl:px-20
                        "
                    >
                        <p
                            className="
                                font-sans
                                text-[8px]
                                uppercase
                                tracking-[0.18em]
                                text-[#a0aba8]
                                2xl:text-[9px]
                            "
                        >
                            Stand For People
                        </p>

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                                font-bengali
                                text-[9px]
                                text-[#899793]
                                2xl:text-[10px]
                            "
                        >
                            <Link
                                to="/terms"
                                className="transition-colors hover:text-[#0f766e]"
                            >
                                ব্যবহারের শর্তাবলি
                            </Link>

                            <Link
                                to="/privacy"
                                className="transition-colors hover:text-[#0f766e]"
                            >
                                গোপনীয়তা নীতি
                            </Link>

                            <Link
                                to="/contact"
                                className="transition-colors hover:text-[#0f766e]"
                            >
                                যোগাযোগ
                            </Link>
                        </div>
                    </footer>
                </div>
            </div>

            {/* =========================================================
                MOBILE / TABLET
            ========================================================== */}
            <div className="min-h-screen lg:hidden">
                {/* HEADER */}
                <header className="border-b border-[#dfe6e4] bg-[#f7f8f5]">
                    <div className="mx-auto flex h-[70px] max-w-[600px] items-center justify-between px-5 sm:px-7">
                        <Link to="/" aria-label="হোম পেজ">
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        <Link
                            to="/"
                            aria-label="হোমে ফিরে যান"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                border
                                border-[#d4dfdc]
                                text-[#60736d]
                                transition-colors
                                hover:border-[#0f766e]
                                hover:bg-[#eaf4f2]
                                hover:text-[#0f766e]
                            "
                        >
                            <TbArrowLeft size={17} />
                        </Link>
                    </div>
                </header>

                {/* INTRO */}
                <section className="bg-[#eaf4f2] px-5 py-7 sm:px-7 sm:py-9">
                    <div className="mx-auto max-w-[560px]">
                        <div className="flex items-center gap-2.5">
                            <span className="h-[2px] w-7 bg-[#f59e0b]" />

                            <p className="font-sans text-[10px] font-semibold tracking-[0.06em] text-[#0f766e]">
                                STAND FOR PEOPLE
                            </p>
                        </div>

                        <h1
                            className="
                                mt-4
                                max-w-[430px]
                                font-bengali
                                text-[27px]
                                font-semibold
                                leading-[1.5]
                                tracking-[-0.02em]
                                text-[#163c37]
                                sm:text-[31px]
                            "
                        >
                            মানুষের পাশে থাকার কাজে
                            <span className="block text-[#0f766e]">
                                আবার স্বাগতম।
                            </span>
                        </h1>

                        <p className="mt-3 max-w-[420px] font-bengali text-[12px] leading-[1.9] text-[#71827d]">
                            আপনার মানবিক উদ্যোগ ও সহায়তার সংযোগগুলো এখান থেকেই
                            এগিয়ে নিন।
                        </p>
                    </div>
                </section>

                {/* MOBILE AUTH */}
                <section className="bg-[#0f6258] px-4 py-7 sm:px-7 sm:py-10">
                    <div className="mx-auto max-w-[560px]">
                        <div
                            className="
                                relative
                                overflow-hidden
                                border
                                border-white/10
                                bg-[#0f6258]
                            "
                        >
                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-24
                                    -top-24
                                    h-64
                                    w-64
                                    rounded-full
                                    border
                                    border-white/[0.06]
                                "
                            />

                            <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-8">
                                {/* MARKER */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="h-[2px] w-7 bg-[#f59e0b]" />

                                        <span className="font-sans text-[9px] font-semibold tracking-[0.1em] text-white/55">
                                            ACCOUNT ACCESS
                                        </span>
                                    </div>

                                    <TbShieldCheck
                                        size={19}
                                        className="text-white/40"
                                    />
                                </div>

                                {/* HEADING */}
                                <p className="font-bengali text-[11px] font-medium text-[#f6c27d]">
                                    অ্যাকাউন্টে প্রবেশ
                                </p>

                                <h2 className="mt-1 font-bengali text-[27px] font-semibold leading-[1.45] text-white">
                                    আবার স্বাগতম
                                </h2>

                                <p className="mt-1.5 font-bengali text-[11px] leading-6 text-white/55">
                                    আপনার পরিচয় নির্বাচন করে অ্যাকাউন্টে প্রবেশ
                                    করুন।
                                </p>

                                {/* ROLE */}
                                <div className="mt-6">
                                    <p className="mb-2.5 font-bengali text-[10px] font-medium text-white/50">
                                        প্রবেশের পরিচয়
                                    </p>

                                    <div className="grid grid-cols-2 overflow-hidden border border-white/15">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange('individual')
                                            }
                                            aria-pressed={isIndividual}
                                            className={`
                                                relative
                                                flex
                                                h-[58px]
                                                items-center
                                                justify-center
                                                gap-2.5
                                                font-bengali
                                                text-[11px]
                                                font-semibold
                                                transition-all
                                                ${
                                                    isIndividual
                                                        ? 'bg-[#f7f8f5] text-[#0f6258]'
                                                        : 'bg-white/[0.04] text-white/65'
                                                }
                                            `}
                                        >
                                            {isIndividual && (
                                                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#f59e0b]" />
                                            )}
                                            <TbUser size={18} />
                                            ব্যক্তি
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
                                                h-[58px]
                                                items-center
                                                justify-center
                                                gap-2.5
                                                border-l
                                                border-white/15
                                                font-bengali
                                                text-[11px]
                                                font-semibold
                                                transition-all
                                                ${
                                                    isOrganization
                                                        ? 'bg-[#f7f8f5] text-[#0f6258]'
                                                        : 'bg-white/[0.04] text-white/65'
                                                }
                                            `}
                                        >
                                            {isOrganization && (
                                                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#f59e0b]" />
                                            )}
                                            <TbBuildingCommunity size={18} />
                                            প্রতিষ্ঠান
                                        </button>
                                    </div>
                                </div>

                                {/* FORM */}
                                <div className="mt-6 border-t border-white/10 pt-6">
                                    <LoginForm />
                                </div>

                                {/* REGISTER */}
                                <div className="mt-6 border-t border-white/10 pt-5 text-center">
                                    <p className="font-bengali text-[10.5px] text-white/45">
                                        এখনো অ্যাকাউন্ট নেই?{' '}
                                        <Link
                                            to="/register"
                                            className="font-semibold text-white transition-colors hover:text-[#f6c27d]"
                                        >
                                            নতুন অ্যাকাউন্ট তৈরি করুন
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER LINKS */}
                        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 font-bengali text-[9.5px] text-white/45">
                            <Link
                                to="/terms"
                                className="transition-colors hover:text-white"
                            >
                                ব্যবহারের শর্তাবলি
                            </Link>

                            <span>•</span>

                            <Link
                                to="/privacy"
                                className="transition-colors hover:text-white"
                            >
                                গোপনীয়তা নীতি
                            </Link>

                            <span>•</span>

                            <Link
                                to="/contact"
                                className="transition-colors hover:text-white"
                            >
                                যোগাযোগ
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Login;
