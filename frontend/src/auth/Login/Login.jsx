// src/pages/Auth/Login/Login.jsx

import { Link, useSearchParams } from 'react-router-dom';

import { TbArrowLeft, TbHeartHandshake, TbShieldCheck } from 'react-icons/tb';

import LoginForm from './LoginForm';

import logo from '@/assets/shared/logo.png';

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

    return (
        <main className="min-h-screen bg-white">
            <div className="mx-auto min-h-screen max-w-[1440px] bg-[#fbfcfb]">
                {/* =====================================================
                    HEADER
                ====================================================== */}

                <header className="border-b border-[#e4e9e7]">
                    <div className="flex h-[72px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-14">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="Stand For People"
                                className="h-10 w-10 object-contain"
                            />

                            <div>
                                <p className="text-[15px] font-semibold leading-none text-text-primary">
                                    Stand For People
                                </p>

                                <p className="mt-1 font-bengali text-[11px] text-text-secondary">
                                    মানুষের পাশে, মানুষের জন্য
                                </p>
                            </div>
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 font-bengali text-sm font-medium text-text-secondary transition-colors hover:text-primary"
                        >
                            <TbArrowLeft size={17} />

                            <span className="hidden sm:inline">
                                হোমে ফিরে যান
                            </span>
                        </Link>
                    </div>
                </header>

                {/* =====================================================
                    DESKTOP
                ====================================================== */}

                <div className="hidden min-h-[calc(100vh-72px)] lg:grid lg:grid-cols-[50%_50%]">
                    {/* =================================================
                        LEFT — HUMAN STORY
                    ================================================== */}

                    <aside className="bg-[#f0f4f2] px-10 py-11 xl:px-14 xl:py-12">
                        <div className="flex h-full flex-col">
                            {/* COPY */}

                            <div className="max-w-[480px]">
                                <p className="font-bengali text-sm font-semibold text-primary">
                                    মানুষের পাশে, প্রতিটি প্রয়োজনে
                                </p>

                                <h1 className="mt-3 font-bengali text-[2rem] font-semibold leading-[1.5] text-text-primary xl:text-[2.2rem]">
                                    মানুষের পাশে থাকার
                                    <span className="block">
                                        যাত্রায় আবার স্বাগতম
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-[430px] font-bengali text-[15px] leading-8 text-text-secondary">
                                    আপনার কার্যক্রম পরিচালনা করুন এবং প্রয়োজনের
                                    মুহূর্তে মানুষের কাছে সহায়তা পৌঁছে দেওয়ার
                                    কাজে যুক্ত থাকুন।
                                </p>
                            </div>

                            {/* PHOTO */}

                            <div className="relative mt-8 min-h-[400px] flex-1 overflow-hidden xl:mt-9">
                                <img
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85"
                                    alt="মানুষের পাশে মানবিক সহায়তা"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                {/* Only lower image treatment */}
                                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#082f2b]/90 via-[#082f2b]/50 to-transparent" />

                                {/* PHOTO STORY */}

                                <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8">
                                    <p className="max-w-[430px] font-bengali text-lg font-medium leading-8 text-white! xl:text-xl xl:leading-9">
                                        প্রতিটি সহায়তার পেছনে আছে একজন মানুষের
                                        প্রয়োজন, আর পাশে দাঁড়ানোর একটি
                                        সিদ্ধান্ত।
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/20 pt-4">
                                        <span className="inline-flex items-center gap-2 font-bengali text-xs text-white!/80">
                                            <TbShieldCheck size={17} />
                                            নিরাপদ অ্যাকাউন্ট
                                        </span>

                                        <span className="inline-flex items-center gap-2 font-bengali text-xs text-white!/80">
                                            <TbHeartHandshake size={17} />
                                            যাচাইকৃত উদ্যোগ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        RIGHT — LOGIN
                    ================================================== */}

                    <section className="flex items-center bg-white px-8 py-10 lg:px-12 xl:px-20">
                        <div className="w-full">
                            {/* =========================================
            INTRO
        ========================================== */}

                            <div className="mb-8">
                                <p className="font-bengali text-[13px] font-semibold text-primary">
                                    অ্যাকাউন্টে প্রবেশ
                                </p>

                                <h2
                                    className="
                    mt-2
                    font-bengali
                    text-[2.15rem]
                    font-semibold
                    leading-[1.35]
                    text-text-primary

                    xl:text-[2.35rem]
                "
                                >
                                    আবার স্বাগতম
                                </h2>

                                <p className="mt-2 font-bengali text-[15px] leading-7 text-text-secondary">
                                    আপনার তথ্য দিয়ে অ্যাকাউন্টে প্রবেশ করুন।
                                </p>
                            </div>

                            {/* =========================================
            ACCOUNT TYPE
        ========================================== */}

                            <div className="mb-7">
                                <p className="mb-2.5 font-bengali text-[13px] font-medium text-text-primary">
                                    অ্যাকাউন্টের ধরন
                                </p>

                                <div className="grid grid-cols-2 bg-[#f3f6f5] p-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoleChange('individual')
                                        }
                                        className={`
                        min-h-[48px]
                        px-4
                        font-bengali
                        transition-all
                        duration-200

                        ${
                            role === 'individual'
                                ? 'bg-white text-text-primary shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                                : 'text-text-secondary hover:text-text-primary'
                        }
                    `}
                                    >
                                        <span className="block text-sm font-semibold">
                                            ব্যক্তি
                                        </span>

                                        <span
                                            className={`
                            mt-0.5
                            block
                            text-[10px]

                            ${
                                role === 'individual'
                                    ? 'text-primary'
                                    : 'text-text-secondary/70'
                            }
                        `}
                                        >
                                            ব্যক্তিগত অ্যাকাউন্ট
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRoleChange('organization')
                                        }
                                        className={`
                        min-h-[48px]
                        px-4
                        font-bengali
                        transition-all
                        duration-200

                        ${
                            role === 'organization'
                                ? 'bg-white text-text-primary shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                                : 'text-text-secondary hover:text-text-primary'
                        }
                    `}
                                    >
                                        <span className="block text-sm font-semibold">
                                            প্রতিষ্ঠান
                                        </span>

                                        <span
                                            className={`
                            mt-0.5
                            block
                            text-[10px]

                            ${
                                role === 'organization'
                                    ? 'text-primary'
                                    : 'text-text-secondary/70'
                            }
                        `}
                                        >
                                            প্রাতিষ্ঠানিক অ্যাকাউন্ট
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* LOGIN FORM */}

                            <LoginForm />

                            {/* =========================================
            REGISTER
        ========================================== */}

                            <p className="mt-7 text-center font-bengali text-[13px] text-text-secondary">
                                Stand For People-এ নতুন?{' '}
                                <Link
                                    to="/account/register"
                                    className="font-semibold text-primary transition-colors hover:text-primary-hover"
                                >
                                    অ্যাকাউন্ট তৈরি করুন
                                </Link>
                            </p>

                            {/* =========================================
            LEGAL
        ========================================== */}

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-bengali text-[10px] text-text-secondary/75">
                                <Link
                                    to="/terms"
                                    className="transition-colors hover:text-primary"
                                >
                                    ব্যবহারের শর্তাবলি
                                </Link>

                                <span>•</span>

                                <Link
                                    to="/privacy"
                                    className="transition-colors hover:text-primary"
                                >
                                    গোপনীয়তা নীতি
                                </Link>

                                <span>•</span>

                                <Link
                                    to="/contact"
                                    className="transition-colors hover:text-primary"
                                >
                                    যোগাযোগ
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                {/* =====================================================
                    MOBILE / TABLET
                ====================================================== */}

                <div className="px-5 py-9 sm:px-8 sm:py-12 lg:hidden">
                    <div className="mx-auto max-w-[500px]">
                        {/* SMALL HUMAN CONTEXT */}

                        <div className="mb-9 grid grid-cols-[88px_1fr] items-center gap-4 border-b border-border pb-7 sm:grid-cols-[110px_1fr]">
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80"
                                    alt="মানুষের পাশে মানবিক সহায়তা"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div>
                                <p className="font-bengali text-xs font-semibold text-primary">
                                    মানুষের পাশে, প্রতিটি প্রয়োজনে
                                </p>

                                <p className="mt-1.5 font-bengali text-base font-semibold leading-7 text-text-primary sm:text-lg">
                                    মানুষের পাশে থাকার যাত্রায় আবার স্বাগতম।
                                </p>
                            </div>
                        </div>

                        {/* INTRO */}

                        <div>
                            <p className="font-bengali text-sm font-semibold text-primary">
                                অ্যাকাউন্টে প্রবেশ
                            </p>

                            <h1 className="mt-2 font-bengali text-[2rem] font-semibold leading-[1.35] text-text-primary">
                                আবার স্বাগতম
                            </h1>

                            <p className="mt-2 font-bengali text-sm leading-7 text-text-secondary sm:text-[15px]">
                                আপনার অ্যাকাউন্টের তথ্য দিয়ে লগইন করুন।
                            </p>
                        </div>

                        {/* ROLE */}

                        <div className="mt-7">
                            <p className="mb-3 font-bengali text-sm font-medium text-text-primary">
                                অ্যাকাউন্টের ধরন
                            </p>

                            <div className="grid grid-cols-2 border-b border-border">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRoleChange('individual')
                                    }
                                    className={`
                                        relative
                                        pb-3
                                        text-left
                                        font-bengali

                                        ${
                                            role === 'individual'
                                                ? 'text-primary'
                                                : 'text-text-secondary'
                                        }
                                    `}
                                >
                                    <span className="block text-sm font-semibold">
                                        ব্যক্তি
                                    </span>

                                    <span className="mt-0.5 block text-[10px]">
                                        ব্যক্তিগত অ্যাকাউন্ট
                                    </span>

                                    {role === 'individual' && (
                                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRoleChange('organization')
                                    }
                                    className={`
                                        relative
                                        pl-5
                                        pb-3
                                        text-left
                                        font-bengali

                                        ${
                                            role === 'organization'
                                                ? 'text-primary'
                                                : 'text-text-secondary'
                                        }
                                    `}
                                >
                                    <span className="block text-sm font-semibold">
                                        প্রতিষ্ঠান
                                    </span>

                                    <span className="mt-0.5 block text-[10px]">
                                        প্রাতিষ্ঠানিক অ্যাকাউন্ট
                                    </span>

                                    {role === 'organization' && (
                                        <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-7">
                            <LoginForm />
                        </div>

                        <div className="mt-7 border-t border-border pt-5">
                            <p className="text-center font-bengali text-sm text-text-secondary">
                                এখনো অ্যাকাউন্ট নেই?{' '}
                                <Link
                                    to="/account/register"
                                    className="font-semibold text-primary"
                                >
                                    নতুন অ্যাকাউন্ট তৈরি করুন
                                </Link>
                            </p>

                            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 font-bengali text-[11px] text-text-secondary">
                                <Link to="/terms">ব্যবহারের শর্তাবলি</Link>

                                <span>•</span>

                                <Link to="/privacy">গোপনীয়তা নীতি</Link>

                                <span>•</span>

                                <Link to="/contact">যোগাযোগ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
