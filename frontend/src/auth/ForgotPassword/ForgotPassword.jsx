import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    Mail,
    ShieldAlert,
    UserRoundPlus,
} from 'lucide-react';

import { API_URL } from '@/api/client';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [resetUrl, setResetUrl] = useState('');
    const [emailExists, setEmailExists] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL.replace(/\/+$/, '')}/forgot-password`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                },
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 422) {
                    const validationMessage = data.errors
                        ? Object.values(data.errors).flat()[0]
                        : data.message;

                    setError(
                        validationMessage ||
                            'অনুগ্রহ করে সঠিক ইমেইল ঠিকানা লিখুন।',
                    );
                    return;
                }

                setError(
                    data.message ||
                        'এই মুহূর্তে অনুরোধটি সম্পন্ন করা যাচ্ছে না। আবার চেষ্টা করুন।',
                );
                return;
            }

            const generatedResetUrl =
                typeof data.reset_url === 'string' ? data.reset_url : '';

            setSubmittedEmail(email.trim());
            setResetUrl(generatedResetUrl);
            setEmailExists(Boolean(generatedResetUrl));
            setSubmitted(true);
        } catch {
            setError(
                'সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleTryAgain = () => {
        setSubmitted(false);
        setEmail('');
        setError('');
        setResetUrl('');
        setEmailExists(false);
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
                <Link
                    to="/login"
                    className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#0f6258]"
                >
                    <ArrowLeft size={17} />
                    লগইনে ফিরে যান
                </Link>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {!submitted ? (
                        <>
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f3f0] text-[#0f6258]">
                                <KeyRound size={24} />
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                পাসওয়ার্ড ভুলে গেছেন?
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                আপনার অ্যাকাউন্টে ব্যবহৃত ইমেইল ঠিকানাটি লিখুন।
                                আমরা আপনার অ্যাকাউন্ট খুঁজে পাসওয়ার্ড রিসেট করার
                                পরবর্তী ধাপ দেখাব।
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-7 space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-800"
                                    >
                                        ইমেইল ঠিকানা
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                                if (error) setError('');
                                            }}
                                            placeholder="আপনার ইমেইল লিখুন"
                                            required
                                            disabled={loading}
                                            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0f6258] focus:ring-2 focus:ring-[#0f6258]/10 disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                                    >
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email.trim()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f6258] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5048] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                            যাচাই করা হচ্ছে...
                                        </>
                                    ) : (
                                        <>
                                            অ্যাকাউন্ট যাচাই করুন
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-gray-600">
                                অ্যাকাউন্ট নেই?{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-[#0f6258] hover:underline"
                                >
                                    রেজিস্ট্রেশন করুন
                                </Link>
                            </p>
                        </>
                    ) : emailExists ? (
                        <>
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                <CheckCircle2 size={26} />
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                অ্যাকাউন্ট পাওয়া গেছে
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                এই ইমেইল ঠিকানায় একটি অ্যাকাউন্ট রয়েছে। নিচের
                                বাটনে ক্লিক করে নতুন পাসওয়ার্ড সেট করুন।
                            </p>

                            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs font-medium text-gray-500">
                                    আপনার ইমেইল ঠিকানা
                                </p>
                                <p className="mt-1 break-all text-sm font-semibold text-gray-900">
                                    {submittedEmail}
                                </p>
                            </div>

                            {resetUrl && (
                                <a
                                    href={resetUrl}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f6258] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5048]"
                                >
                                    পাসওয়ার্ড রিসেট করুন
                                    <ArrowRight size={18} />
                                </a>
                            )}

                            <Link
                                to="/login"
                                className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                লগইনে ফিরে যান
                            </Link>

                            <button
                                type="button"
                                onClick={handleTryAgain}
                                className="mt-4 w-full text-center text-sm font-medium text-gray-500 transition hover:text-[#0f6258]"
                            >
                                অন্য ইমেইল ব্যবহার করুন
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                <ShieldAlert size={26} />
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                এই ইমেইলে অ্যাকাউন্ট নেই
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                <span className="font-semibold text-gray-900">
                                    {submittedEmail}
                                </span>{' '}
                                এই ইমেইল ঠিকানায় কোনো অ্যাকাউন্ট পাওয়া যায়নি।
                            </p>

                            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-semibold text-amber-900">
                                    এখন কী করবেন?
                                </p>

                                <ul className="mt-2 space-y-2 text-sm leading-6 text-amber-900">
                                    <li>
                                        • ইমেইল ঠিকানাটি সঠিকভাবে লিখেছেন কি না
                                        যাচাই করুন।
                                    </li>
                                    <li>
                                        • আগে অ্যাকাউন্ট তৈরি না করে থাকলে
                                        রেজিস্ট্রেশন করুন।
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                onClick={handleTryAgain}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f6258] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5048]"
                            >
                                <Mail size={18} />
                                সঠিক ইমেইল দিয়ে আবার চেষ্টা করুন
                            </button>

                            <Link
                                to="/register"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                <UserRoundPlus size={18} />
                                নতুন অ্যাকাউন্ট তৈরি করুন
                            </Link>

                            <Link
                                to="/login"
                                className="mt-4 flex w-full items-center justify-center text-sm font-medium text-gray-500 transition hover:text-[#0f6258]"
                            >
                                লগইনে ফিরে যান
                            </Link>
                        </>
                    )}
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-gray-400">
                    Stand For People · আপনার অ্যাকাউন্টের নিরাপত্তা আমাদের কাছে
                    গুরুত্বপূর্ণ।
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
