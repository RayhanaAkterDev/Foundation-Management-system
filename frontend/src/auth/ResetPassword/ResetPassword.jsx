// src/auth/ResetPassword/ResetPassword.jsx

import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    TbArrowLeft,
    TbCheck,
    TbEye,
    TbEyeOff,
    TbKey,
    TbLock,
} from 'react-icons/tb';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const passwordChecks = useMemo(
        () => ({
            length: password.length >= 8,
            match: password.length > 0 && password === passwordConfirmation,
        }),
        [password, passwordConfirmation],
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        if (!token || !email) {
            setError(
                'পাসওয়ার্ড রিসেট লিংকটি অসম্পূর্ণ বা অবৈধ। নতুন একটি রিসেট লিংক তৈরি করুন।',
            );
            return;
        }

        if (password.length < 8) {
            setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        'পাসওয়ার্ড পরিবর্তন করা যায়নি। আবার চেষ্টা করুন।',
                );
            }

            setSuccess(true);
            setPassword('');
            setPasswordConfirmation('');
        } catch (err) {
            setError(err?.message || 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[520px] items-center justify-center">
                    <div className="w-full">
                        <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 text-center shadow-[0_20px_60px_rgba(8,60,54,0.08)] sm:p-8">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <TbCheck className="text-[32px]" />
                            </div>

                            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ed864a]">
                                পাসওয়ার্ড আপডেট হয়েছে
                            </p>

                            <h1 className="font-bengali text-[30px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#083c36]">
                                পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে
                            </h1>

                            <p className="mt-3 font-bengali text-[14px] leading-7 text-slate-500">
                                আপনার নতুন পাসওয়ার্ড এখন থেকে ব্যবহার করতে
                                পারবেন। নতুন পাসওয়ার্ড দিয়ে আপনার অ্যাকাউন্টে
                                লগইন করুন।
                            </p>

                            <Link
                                to="/login"
                                className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#083c36] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(8,60,54,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f6258]"
                            >
                                লগইনে ফিরে যান
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[520px] items-center justify-center">
                <div className="w-full">
                    <Link
                        to="/login"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#083c36] transition-colors hover:text-[#0f6258]"
                    >
                        <TbArrowLeft className="text-lg" />
                        লগইনে ফিরে যান
                    </Link>

                    <div className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(8,60,54,0.08)] sm:p-8">
                        {/* Header */}
                        <div className="mb-7">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#083c36] text-white shadow-lg shadow-[#083c36]/15">
                                <TbKey className="text-[27px]" />
                            </div>

                            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ed864a]">
                                নতুন পাসওয়ার্ড
                            </p>

                            <h1 className="font-bengali text-[30px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#083c36] sm:text-[34px]">
                                নতুন পাসওয়ার্ড সেট করুন
                            </h1>

                            <p className="mt-3 font-bengali text-[14px] leading-7 text-slate-500">
                                আপনার অ্যাকাউন্টের জন্য একটি নতুন নিরাপদ
                                পাসওয়ার্ড তৈরি করুন।
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-bengali text-sm leading-6 text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New password */}
                            <div>
                                <label
                                    htmlFor="reset-password"
                                    className="mb-2 block text-sm font-semibold text-[#083c36]"
                                >
                                    নতুন পাসওয়ার্ড
                                </label>

                                <div className="relative">
                                    <TbLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400" />

                                    <input
                                        id="reset-password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="কমপক্ষে ৮ অক্ষর"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f6258] focus:ring-4 focus:ring-[#0f6258]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#083c36]"
                                        aria-label={
                                            showPassword
                                                ? 'পাসওয়ার্ড লুকান'
                                                : 'পাসওয়ার্ড দেখুন'
                                        }
                                    >
                                        {showPassword ? (
                                            <TbEyeOff className="text-xl" />
                                        ) : (
                                            <TbEye className="text-xl" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="reset-password-confirmation"
                                    className="mb-2 block text-sm font-semibold text-[#083c36]"
                                >
                                    পাসওয়ার্ড নিশ্চিত করুন
                                </label>

                                <div className="relative">
                                    <TbLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-400" />

                                    <input
                                        id="reset-password-confirmation"
                                        type={
                                            showPasswordConfirmation
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={passwordConfirmation}
                                        onChange={(event) =>
                                            setPasswordConfirmation(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="পাসওয়ার্ডটি আবার লিখুন"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f6258] focus:ring-4 focus:ring-[#0f6258]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswordConfirmation(
                                                (value) => !value,
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#083c36]"
                                        aria-label={
                                            showPasswordConfirmation
                                                ? 'পাসওয়ার্ড লুকান'
                                                : 'পাসওয়ার্ড দেখুন'
                                        }
                                    >
                                        {showPasswordConfirmation ? (
                                            <TbEyeOff className="text-xl" />
                                        ) : (
                                            <TbEye className="text-xl" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password requirements */}
                            <div className="rounded-2xl bg-[#f7faf9] px-4 py-3">
                                <p className="mb-2 text-xs font-semibold text-[#083c36]">
                                    পাসওয়ার্ডের শর্ত
                                </p>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-xs">
                                        <TbCheck
                                            className={
                                                passwordChecks.length
                                                    ? 'text-emerald-600'
                                                    : 'text-slate-300'
                                            }
                                        />
                                        <span
                                            className={
                                                passwordChecks.length
                                                    ? 'text-emerald-700'
                                                    : 'text-slate-500'
                                            }
                                        >
                                            কমপক্ষে ৮ অক্ষর
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs">
                                        <TbCheck
                                            className={
                                                passwordChecks.match
                                                    ? 'text-emerald-600'
                                                    : 'text-slate-300'
                                            }
                                        />
                                        <span
                                            className={
                                                passwordChecks.match
                                                    ? 'text-emerald-700'
                                                    : 'text-slate-500'
                                            }
                                        >
                                            দুইটি পাসওয়ার্ড একই হতে হবে
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#083c36] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(8,60,54,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f6258] hover:shadow-[0_14px_30px_rgba(8,60,54,0.2)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                            >
                                <TbKey className="text-lg" />

                                {loading
                                    ? 'পাসওয়ার্ড পরিবর্তন হচ্ছে...'
                                    : 'নতুন পাসওয়ার্ড সেট করুন'}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                            <p className="text-sm text-slate-500">
                                রিসেট লিংকটি কাজ করছে না?{' '}
                                <Link
                                    to="/account/forgot-password"
                                    className="font-semibold text-[#0f6258] transition hover:text-[#083c36]"
                                >
                                    নতুন লিংক তৈরি করুন
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
