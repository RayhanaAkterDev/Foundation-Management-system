// src/auth/ForgotPassword/ForgotPassword.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowLeft, TbCheck, TbKey, TbMail, TbRefresh } from 'react-icons/tb';

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
                        'পাসওয়ার্ড রিসেটের অনুরোধ সম্পন্ন করা যায়নি।',
                );
            }

            setSuccess(
                data?.message ||
                    'পাসওয়ার্ড রিসেট করার নির্দেশনা প্রস্তুত হয়েছে।',
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
        <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[520px] items-center justify-center">
                <div className="w-full">
                    {/* Back */}
                    <Link
                        to="/login"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#083c36] transition-colors hover:text-[#0f6258]"
                    >
                        <TbArrowLeft className="text-lg" />
                        লগইনে ফিরে যান
                    </Link>

                    {/* Card */}
                    <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(8,60,54,0.08)] sm:p-8">
                        {/* Icon */}
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#083c36] text-white shadow-lg shadow-[#083c36]/15">
                            <TbKey className="text-[27px]" />
                        </div>

                        {/* Heading */}
                        <div className="mb-7">
                            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ed864a]">
                                অ্যাকাউন্ট পুনরুদ্ধার
                            </p>

                            <h1 className="font-bengali text-[30px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#083c36] sm:text-[34px]">
                                পাসওয়ার্ড ভুলে গেছেন?
                            </h1>

                            <p className="mt-3 font-bengali text-[14px] leading-7 text-slate-500">
                                আপনার অ্যাকাউন্টের ইমেইল ঠিকানা দিন। আমরা
                                পাসওয়ার্ড পরিবর্তনের পরবর্তী ধাপে নিয়ে যাব।
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                                        <TbCheck className="text-base" />
                                    </div>

                                    <p>{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="forgot-password-email"
                                    className="mb-2 block text-sm font-semibold text-[#083c36]"
                                >
                                    ইমেইল ঠিকানা
                                </label>

                                <div className="relative">
                                    <TbMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400" />

                                    <input
                                        id="forgot-password-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="আপনার ইমেইল লিখুন"
                                        autoComplete="email"
                                        disabled={loading}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f6258] focus:ring-4 focus:ring-[#0f6258]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#083c36] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(8,60,54,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f6258] hover:shadow-[0_14px_30px_rgba(8,60,54,0.2)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <TbRefresh className="animate-spin text-lg" />
                                        অনুরোধ পাঠানো হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <TbKey className="text-lg" />
                                        পাসওয়ার্ড রিসেট করুন
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo reset link */}
                        {resetUrl && (
                            <div className="mt-6 rounded-2xl border border-[#ed864a]/25 bg-[#fff8f3] p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <TbCheck className="text-lg text-[#ed864a]" />

                                    <p className="font-bengali text-sm font-semibold text-[#083c36]">
                                        রিসেট লিংক প্রস্তুত হয়েছে
                                    </p>
                                </div>

                                <p className="mb-3 font-bengali text-xs leading-5 text-slate-500">
                                    ডেমো অ্যাকাউন্টের জন্য নিচের বাটনে ক্লিক করে
                                    নতুন পাসওয়ার্ড সেট করুন।
                                </p>

                                <a
                                    href={resetUrl}
                                    className="flex h-11 items-center justify-center rounded-xl bg-[#ed864a] px-4 text-sm font-semibold text-white transition hover:bg-[#d96f35]"
                                >
                                    পাসওয়ার্ড পরিবর্তন করুন
                                </a>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                            <p className="text-sm text-slate-500">
                                পাসওয়ার্ড মনে পড়ে গেছে?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-[#0f6258] transition hover:text-[#083c36]"
                                >
                                    লগইন করুন
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
