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

            const response = await fetch(
                'https://stand-for-people-api.onrender.com/api/email/verification-notification',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        role,
                    }),
                },
            );

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

    if (isSuccess) {
        return (
            <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2
                        size={32}
                        strokeWidth={1.8}
                        className="text-primary"
                    />
                </div>

                <h1 className="font-jost text-3xl font-semibold tracking-tight text-slate-900">
                    Email verified
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your email address has been verified and your Stand For
                    People account is now active.
                </p>

                <Link
                    to="/account/login"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                    Continue to Sign In
                    <ArrowRight size={17} />
                </Link>
            </div>
        );
    }

    if (isAlreadyVerified) {
        return (
            <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2
                        size={32}
                        strokeWidth={1.8}
                        className="text-primary"
                    />
                </div>

                <h1 className="font-jost text-3xl font-semibold tracking-tight text-slate-900">
                    Email already verified
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Your email address has already been verified. You can sign
                    in to your account.
                </p>

                <Link
                    to="/account/login"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                    Continue to Sign In
                    <ArrowRight size={17} />
                </Link>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="mx-auto w-full max-w-md">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                        <Clock3
                            size={31}
                            strokeWidth={1.8}
                            className="text-amber-600"
                        />
                    </div>

                    <h1 className="font-jost text-3xl font-semibold tracking-tight text-slate-900">
                        Verification link expired
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        This verification link has timed out. Please request a
                        new verification email.
                    </p>
                </div>

                <form
                    onSubmit={handleResend}
                    className="mt-8 border-t border-slate-200 pt-7"
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
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="verification-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your email address"
                                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                                className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                            >
                                <option value="">Select account type</option>
                                <option value="individual">Individual</option>
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
                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                            <CircleAlert
                                size={17}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{resendError}</p>
                        </div>
                    )}

                    {resendMessage && (
                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 px-3.5 py-3 text-sm text-primary">
                            <CheckCircle2
                                size={17}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{resendMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isResending}
                        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isResending ? (
                            <>
                                <Loader2 size={17} className="animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail size={17} />
                                Resend verification email
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        to="/account/login"
                        className="text-sm font-medium text-slate-500 transition hover:text-primary"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
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
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <CircleAlert
                    size={31}
                    strokeWidth={1.8}
                    className="text-red-600"
                />
            </div>

            <h1 className="font-jost text-3xl font-semibold tracking-tight text-slate-900">
                Verification failed
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                Please request a new verification email to verify your account.
            </p>

            <Link
                to="/account/login"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
            >
                Back to Sign In
                <ArrowRight size={17} />
            </Link>
        </div>
    );
};

export default EmailVerification;
