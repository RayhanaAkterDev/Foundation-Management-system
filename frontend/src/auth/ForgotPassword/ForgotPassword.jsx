// src/auth/ForgotPassword/ForgotPassword.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    TbArrowLeft,
    TbArrowRight,
    TbCheck,
    TbKey,
    TbMail,
    TbRefresh,
    TbShieldCheck,
} from 'react-icons/tb';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resetUrl, setResetUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');
        setResetUrl('');

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError('আপনার ইমেইল ঠিকানা লিখুন।');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        'পাসওয়ার্ড রিসেট অনুরোধ সম্পন্ন করা যায়নি।',
                );
            }

            setSuccess(
                data?.message ||
                    'আপনার ইমেইলে পাসওয়ার্ড পরিবর্তনের নির্দেশনা পাঠানো হয়েছে।',
            );

            if (data?.reset_url) {
                setResetUrl(data.reset_url);
            }
        } catch (err) {
            setError(err?.message || 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f8fb]">
            <div className="mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="w-full max-w-[440px]">
                    {/* Back */}
                    <Link
                        to="/login"
                        className="
                            group
                            mb-6
                            inline-flex
                            items-center
                            gap-2
                            font-bengali
                            text-[14px]
                            font-medium!!
                            text-slate-500
                            transition-colors
                            duration-200
                            hover:text-[#0f766e]
                        "
                    >
                        <TbArrowLeft
                            size={18}
                            className="
                                transition-transform
                                duration-200
                                group-hover:-translate-x-0.5
                            "
                        />
                        লগইনে ফিরে যান
                    </Link>

                    {/* Main Card */}
                    <section
                        className="
                            rounded-[18px]
                            border
                            border-slate-200/90
                            bg-white
                            p-6
                            shadow-[0_20px_55px_rgba(15,23,42,0.055)]

                            sm:p-8
                        "
                    >
                        {/* Header */}
                        <header className="mb-7">
                            <div
                                className="
                                    mb-5
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-[10px]
                                    bg-[#eaf4f2]
                                    text-[#0f766e]
                                "
                            >
                                <TbKey size={22} strokeWidth={2} />
                            </div>

                            <h1
                                className="
                                    font-bengali
                                    text-[27px]
                                    font-semibold!
                                    leading-[1.35]
                                    text-[#0f172a]

                                    sm:text-[29px]
                                "
                            >
                                পাসওয়ার্ড ভুলে গেছেন?
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-[370px]
                                    font-bengali
                                    text-[14px]
                                    leading-7
                                    text-slate-500
                                "
                            >
                                আপনার অ্যাকাউন্টে ব্যবহৃত ইমেইল ঠিকানা দিন। আমরা
                                পাসওয়ার্ড পরিবর্তনের জন্য একটি রিসেট লিংক পাঠাব।
                            </p>
                        </header>

                        {/* Error */}
                        {error && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-start
                                    gap-3
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                "
                            >
                                <span
                                    className="
                                        mt-[2px]
                                        flex
                                        h-5
                                        w-5
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-100
                                        text-[12px]
                                        font-bold
                                        text-red-600
                                    "
                                >
                                    !
                                </span>

                                <p className="font-bengali text-[13px] leading-6 text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-start
                                    gap-3
                                    rounded-lg
                                    border
                                    border-[#cce5e1]
                                    bg-[#f1f8f6]
                                    px-4
                                    py-3
                                "
                            >
                                <span
                                    className="
                                        mt-[2px]
                                        flex
                                        h-5
                                        w-5
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#0f766e]
                                        text-white!
                                    "
                                >
                                    <TbCheck size={13} strokeWidth={2.5} />
                                </span>

                                <p className="font-bengali text-[13px] leading-6 text-[#134e4a]">
                                    {success}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="forgot-email"
                                    className="
                                        mb-2
                                        block
                                        font-bengali
                                        text-[14px]
                                        font-semibold!
                                        text-[#334155]
                                    "
                                >
                                    ইমেইল ঠিকানা
                                </label>

                                <div className="group relative">
                                    <TbMail
                                        size={19}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                            transition-colors
                                            duration-200

                                            group-focus-within:text-[#0f766e]
                                        "
                                    />

                                    <input
                                        id="forgot-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                        disabled={loading}
                                        placeholder="name@example.com"
                                        className="
                                            h-[52px]
                                            w-full
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-white
                                            pl-11
                                            pr-4
                                            text-[14px]
                                            text-slate-800
                                            outline-none
                                            transition-all
                                            duration-200

                                            placeholder:text-slate-400

                                            hover:border-slate-300

                                            focus:border-[#0f766e]!
                                            focus:outline-none!
                                            focus:ring-[3px]!
                                            focus:ring-[#0f766e]/10!

                                            disabled:cursor-not-allowed
                                            disabled:bg-slate-50
                                            disabled:text-slate-400
                                        "
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="
                                    group
                                    flex
                                    h-[52px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    bg-[#0f766e]
                                    px-5
                                    font-bengali
                                    text-[14px]
                                    font-semibold!
                                    text-white!
                                    transition-all
                                    duration-200

                                    hover:bg-[#115e59]

                                    focus:outline-none!
                                    focus:ring-4!
                                    focus:ring-[#0f766e]/15!

                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading ? (
                                    <>
                                        <TbRefresh
                                            size={19}
                                            className="animate-spin"
                                        />
                                        অনুরোধ পাঠানো হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        রিসেট লিংক পাঠান
                                        <TbArrowRight
                                            size={18}
                                            className="
                                                transition-transform
                                                duration-200
                                                group-hover:translate-x-0.5
                                            "
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Security Note */}
                        {!resetUrl && (
                            <div
                                className="
                                    mt-5
                                    flex
                                    items-start
                                    gap-2.5
                                    border-t
                                    border-slate-100
                                    pt-5
                                "
                            >
                                <TbShieldCheck
                                    size={18}
                                    className="
                                        mt-[2px]
                                        shrink-0
                                        text-slate-400
                                    "
                                />

                                <p
                                    className="
                                        font-bengali
                                        text-[12px]
                                        leading-[1.7]
                                        text-slate-400
                                    "
                                >
                                    নিরাপত্তার জন্য রিসেট লিংকটি শুধুমাত্র আপনার
                                    অ্যাকাউন্টের সাথে যুক্ত ইমেইলে পাঠানো হবে।
                                </p>
                            </div>
                        )}

                        {/* Development Reset URL */}
                        {resetUrl && (
                            <div
                                className="
                                    mt-5
                                    rounded-lg
                                    border
                                    border-[#fde3a7]
                                    bg-[#fffaf0]
                                    p-4
                                "
                            >
                                <div className="flex items-start gap-3">
                                    <TbShieldCheck
                                        size={20}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-[#d97706]
                                        "
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="
                                                font-bengali
                                                text-[13px]
                                                font-semibold!
                                                text-[#0f172a]
                                            "
                                        >
                                            ডেভেলপমেন্ট রিসেট লিংক
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-bengali
                                                text-[12px]
                                                leading-5
                                                text-slate-500
                                            "
                                        >
                                            নিচের লিংক ব্যবহার করে নতুন
                                            পাসওয়ার্ড সেট করুন।
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href={resetUrl}
                                    className="
                                        group
                                        mt-3
                                        flex
                                        h-10
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-[#f59e0b]
                                        bg-white
                                        px-4
                                        font-bengali
                                        text-[13px]
                                        font-semibold!
                                        text-[#b45309]
                                        transition-colors
                                        duration-200

                                        hover:bg-[#fff7e6]
                                    "
                                >
                                    নতুন পাসওয়ার্ড সেট করুন
                                    <TbArrowRight
                                        size={17}
                                        className="
                                            transition-transform
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </a>
                            </div>
                        )}

                        {/* Login */}
                        <div
                            className="
                                mt-6
                                border-t
                                border-slate-100
                                pt-5
                                text-center
                            "
                        >
                            <p className="font-bengali text-[13px] text-slate-500">
                                পাসওয়ার্ড মনে পড়ে গেছে?{' '}
                                <Link
                                    to="/login"
                                    className="
                                        font-semibold!
                                        text-[#0f766e]
                                        transition-colors
                                        hover:text-[#134e4a]
                                    "
                                >
                                    লগইন করুন
                                </Link>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
