import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    CheckCircle2,
    CircleAlert,
    Clock3,
    ArrowRight,
    Mail,
    ChevronDown,
    Loader2,
} from 'lucide-react';

const API_URL =
    'https://stand-for-people-api.onrender.com/api/email/verification-notification';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();

    const status = searchParams.get('status');

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [resendError, setResendError] = useState('');

    const isSuccess = status === 'success';
    const isAlreadyVerified = status === 'already-verified';
    const isExpired = status === 'expired';

    const handleResend = async (event) => {
        event.preventDefault();

        setResendMessage('');
        setResendError('');

        if (!email.trim() || !role) {
            setResendError(
                'Please enter your email address and select your account type.',
            );
            return;
        }

        try {
            setIsResending(true);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to resend the verification email.',
                );
            }

            setResendMessage(
                data.message ||
                    'A new verification email has been sent to your email address.',
            );
        } catch (error) {
            setResendError(
                error.message || 'Unable to resend the verification email.',
            );
        } finally {
            setIsResending(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Email verified successfully
    |--------------------------------------------------------------------------
    */

    if (isSuccess) {
        return (
            <main className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
                <section className="w-full text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:mb-6 sm:h-16 sm:w-16">
                        <CheckCircle2
                            size={30}
                            strokeWidth={1.8}
                            className="text-primary sm:h-8 sm:w-8"
                        />
                    </div>

                    <h1 className="font-jost text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Email verified
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
                        Your email address has been verified and your Stand For
                        People account is now active.
                    </p>

                    <Link
                        to="/account"
                        className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 sm:mt-8"
                    >
                        Continue to Sign In
                        <ArrowRight size={17} strokeWidth={1.8} />
                    </Link>
                </section>
            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Already verified
    |--------------------------------------------------------------------------
    */

    if (isAlreadyVerified) {
        return (
            <main className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
                <section className="w-full text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:mb-6 sm:h-16 sm:w-16">
                        <CheckCircle2
                            size={30}
                            strokeWidth={1.8}
                            className="text-primary sm:h-8 sm:w-8"
                        />
                    </div>

                    <h1 className="font-jost text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Email already verified
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
                        Your email address has already been verified. You can
                        sign in to your account.
                    </p>

                    <Link
                        to="/account"
                        className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 sm:mt-8"
                    >
                        Continue to Sign In
                        <ArrowRight size={17} strokeWidth={1.8} />
                    </Link>
                </section>
            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Expired verification link
    |--------------------------------------------------------------------------
    */

    if (isExpired) {
        return (
            <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
                <section>
                    <div className="text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 sm:mb-6 sm:h-16 sm:w-16">
                            <Clock3
                                size={29}
                                strokeWidth={1.8}
                                className="text-amber-600 sm:h-8 sm:w-8"
                            />
                        </div>

                        <h1 className="font-jost text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                            Verification link expired
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
                            This verification link has timed out. Please request
                            a new verification email.
                        </p>
                    </div>

                    <form
                        onSubmit={handleResend}
                        className="mt-7 border-t border-slate-200 pt-6 sm:mt-8 sm:pt-7"
                    >
                        <div>
                            <label
                                htmlFor="verification-email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="verification-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label
                                htmlFor="verification-role"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Account type
                            </label>

                            <div className="relative">
                                <select
                                    id="verification-role"
                                    value={role}
                                    onChange={(event) =>
                                        setRole(event.target.value)
                                    }
                                    className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:h-12"
                                >
                                    <option value="">
                                        Select account type
                                    </option>

                                    <option value="individual">
                                        Individual
                                    </option>

                                    <option value="organization">
                                        Organization
                                    </option>

                                    <option value="admin">Admin</option>
                                </select>

                                <ChevronDown
                                    size={18}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>

                        {resendError && (
                            <div
                                role="alert"
                                className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700"
                            >
                                <CircleAlert
                                    size={17}
                                    strokeWidth={1.8}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{resendError}</p>
                            </div>
                        )}

                        {resendMessage && (
                            <div
                                role="status"
                                className="mt-4 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 px-3.5 py-3 text-sm leading-5 text-primary"
                            >
                                <CheckCircle2
                                    size={17}
                                    strokeWidth={1.8}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{resendMessage}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isResending}
                            className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-12"
                        >
                            {isResending ? (
                                <>
                                    <Loader2
                                        size={17}
                                        strokeWidth={1.8}
                                        className="animate-spin"
                                    />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail size={17} strokeWidth={1.8} />
                                    Resend verification email
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 text-center sm:mt-6">
                        <Link
                            to="/account"
                            className="inline-flex min-h-10 items-center text-sm font-medium text-slate-500 transition hover:text-primary"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Invalid verification link
    |--------------------------------------------------------------------------
    */

    const message =
        searchParams.get('message') || 'This verification link is invalid.';

    return (
        <main className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
            <section className="w-full text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 sm:mb-6 sm:h-16 sm:w-16">
                    <CircleAlert
                        size={29}
                        strokeWidth={1.8}
                        className="text-red-600 sm:h-8 sm:w-8"
                    />
                </div>

                <h1 className="font-jost text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Verification failed
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
                    {message}
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
                    Please request a new verification email to verify your
                    account.
                </p>

                <Link
                    to="/account"
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 sm:mt-8"
                >
                    Back to Sign In
                    <ArrowRight size={17} strokeWidth={1.8} />
                </Link>
            </section>
        </main>
    );
};

export default EmailVerification;
