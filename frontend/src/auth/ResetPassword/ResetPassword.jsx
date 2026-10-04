// src/auth/ResetPassword/ResetPassword.jsx

import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    TbArrowLeft,
    TbArrowRight,
    TbCheck,
    TbEye,
    TbEyeOff,
    TbKey,
    TbLock,
    TbRefresh,
} from 'react-icons/tb';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function ResetPassword() {
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
            match:
                passwordConfirmation.length > 0 &&
                password === passwordConfirmation,
        }),
        [password, passwordConfirmation],
    );

    const hasResetParams = Boolean(token && email);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');

        if (!token || !email) {
            setError(
                'রিসেট লিংকটি সঠিক নয় অথবা অসম্পূর্ণ। আবার নতুন রিসেট লিংকের অনুরোধ করুন।',
            );
            return;
        }

        if (password.length < 8) {
            setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('দুটি পাসওয়ার্ড একই নয়।');
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

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        'পাসওয়ার্ড পরিবর্তন করা যায়নি। রিসেট লিংকটি হয়তো মেয়াদ শেষ হয়েছে।',
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

    /*
     * Success State
     */
    if (success) {
        return (
            <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 sm:py-10">
                <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[460px] items-center justify-center">
                    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                        <div className="h-1 bg-[#0f766e]" />

                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4f2] text-[#0f766e]">
                                    <TbCheck size={30} strokeWidth={2.2} />
                                </div>

                                <p className="mb-1 text-sm font-medium! text-[#0f766e]">
                                    পাসওয়ার্ড পরিবর্তন সম্পন্ন
                                </p>

                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে
                                </h1>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                                    আপনার নতুন পাসওয়ার্ড সেট করা হয়েছে। এখন নতুন
                                    পাসওয়ার্ড ব্যবহার করে আপনার অ্যাকাউন্টে লগইন
                                    করতে পারবেন।
                                </p>

                                <Link
                                    to="/login"
                                    className="mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#0c665f] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/15"
                                >
                                    লগইন করুন
                                    <TbArrowRight size={19} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * Reset Password Page
     */
    return (
        <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto w-full max-w-[460px]">
                {/* Back to Login */}
                <Link
                    to="/login"
                    className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium! text-slate-500 transition hover:text-[#0f766e]"
                >
                    <TbArrowLeft size={18} />
                    লগইনে ফিরে যান
                </Link>

                {/* Main Card */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
                    {/* Top Accent */}
                    <div className="h-1 bg-[#0f766e]" />

                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="mb-7">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf4f2] text-[#0f766e]">
                                <TbKey size={23} strokeWidth={2} />
                            </div>

                            <p className="mb-1 text-sm font-medium! text-[#0f766e]">
                                পাসওয়ার্ড রিসেট
                            </p>

                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                নতুন পাসওয়ার্ড সেট করুন
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                আপনার অ্যাকাউন্টের জন্য একটি নতুন নিরাপদ
                                পাসওয়ার্ড তৈরি করুন।
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-5 text-red-700">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-300 text-xs font-bold">
                                    !
                                </span>

                                <p>{error}</p>
                            </div>
                        )}

                        {/* Invalid / Missing Reset Parameters */}
                        {!hasResetParams ? (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <TbKey
                                        size={20}
                                        className="mt-0.5 shrink-0 text-amber-600"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            রিসেট লিংক পাওয়া যায়নি
                                        </p>

                                        <p className="mt-1 text-sm leading-5 text-slate-600">
                                            এই পেজে বৈধ রিসেট তথ্য পাওয়া যায়নি।
                                            নতুন রিসেট লিংকের জন্য আবার অনুরোধ
                                            করুন।
                                        </p>

                                        <Link
                                            to="/forgot-password"
                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f766e] hover:underline"
                                        >
                                            নতুন রিসেট লিংক নিন
                                            <TbArrowRight size={17} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium! text-slate-700"
                                    >
                                        নতুন পাসওয়ার্ড
                                    </label>

                                    <div className="relative">
                                        <TbLock
                                            size={19}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            placeholder="নতুন পাসওয়ার্ড লিখুন"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="h-[52px] w-full rounded-lg border border-slate-200 bg-[#fbfcfc] pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (current) => !current,
                                                )
                                            }
                                            disabled={loading}
                                            aria-label={
                                                showPassword
                                                    ? 'পাসওয়ার্ড লুকান'
                                                    : 'পাসওয়ার্ড দেখুন'
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/10 disabled:opacity-50"
                                        >
                                            {showPassword ? (
                                                <TbEyeOff size={20} />
                                            ) : (
                                                <TbEye size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="mb-2 block text-sm font-medium! text-slate-700"
                                    >
                                        পাসওয়ার্ড নিশ্চিত করুন
                                    </label>

                                    <div className="relative">
                                        <TbLock
                                            size={19}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
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
                                            placeholder="পাসওয়ার্ড আবার লিখুন"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="h-[52px] w-full rounded-lg border border-slate-200 bg-[#fbfcfc] pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0f766e] focus:ring-4 focus:ring-[#0f766e]/10 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswordConfirmation(
                                                    (current) => !current,
                                                )
                                            }
                                            disabled={loading}
                                            aria-label={
                                                showPasswordConfirmation
                                                    ? 'পাসওয়ার্ড লুকান'
                                                    : 'পাসওয়ার্ড দেখুন'
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/10 disabled:opacity-50"
                                        >
                                            {showPasswordConfirmation ? (
                                                <TbEyeOff size={20} />
                                            ) : (
                                                <TbEye size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3.5">
                                    <p className="mb-2.5 text-xs font-semibold text-slate-600">
                                        পাসওয়ার্ডের শর্ত
                                    </p>

                                    <div className="space-y-2">
                                        {/* Length */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                                    passwordChecks.length
                                                        ? 'bg-[#eaf4f2] text-[#0f766e]'
                                                        : 'bg-slate-100 text-slate-300'
                                                }`}
                                            >
                                                <TbCheck size={11} />
                                            </span>

                                            <span
                                                className={`text-xs ${
                                                    passwordChecks.length
                                                        ? 'text-[#0f766e]'
                                                        : 'text-slate-500'
                                                }`}
                                            >
                                                কমপক্ষে ৮ অক্ষর
                                            </span>
                                        </div>

                                        {/* Match */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                                                    passwordChecks.match
                                                        ? 'bg-[#eaf4f2] text-[#0f766e]'
                                                        : 'bg-slate-100 text-slate-300'
                                                }`}
                                            >
                                                <TbCheck size={11} />
                                            </span>

                                            <span
                                                className={`text-xs ${
                                                    passwordChecks.match
                                                        ? 'text-[#0f766e]'
                                                        : 'text-slate-500'
                                                }`}
                                            >
                                                দুইটি পাসওয়ার্ড একই হতে হবে
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#0c665f] focus:outline-none focus:ring-4 focus:ring-[#0f766e]/15 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <TbRefresh
                                                size={19}
                                                className="animate-spin"
                                            />
                                            পাসওয়ার্ড পরিবর্তন হচ্ছে...
                                        </>
                                    ) : (
                                        <>
                                            পাসওয়ার্ড পরিবর্তন করুন
                                            <TbArrowRight size={19} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Recovery Link — not another reset action */}
                        {hasResetParams && (
                            <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                                <p className="text-sm text-slate-500">
                                    রিসেট লিংকটি কাজ না করলে{' '}
                                    <Link
                                        to="/forgot-password"
                                        className="font-semibold text-[#0f766e] transition hover:underline"
                                    >
                                        নতুন লিংকের অনুরোধ করুন
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
