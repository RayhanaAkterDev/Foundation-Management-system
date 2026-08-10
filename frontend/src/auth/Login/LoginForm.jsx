// src/pages/Auth/Login/LoginForm.jsx

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';

const LoginForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const role = searchParams.get('role');

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoginError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to sign in. Please try again.',
                );
            }

            // Store authentication data
            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem('auth_token', data.token);
            storage.setItem('user', JSON.stringify(data.user));

            // Redirect based on account role
            if (data.user.role === 'individual') {
                navigate('/dashboard/individual');
            } else if (data.user.role === 'organization') {
                navigate('/dashboard/organization');
            } else {
                throw new Error('Unknown account type.');
            }
        } catch (error) {
            setLoginError(
                error.message || 'Something went wrong. Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login Error */}
            {loginError && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                    {loginError}
                </div>
            )}

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-text-primary"
                >
                    Email address
                </label>

                <div className="relative">
                    <Mail
                        size={17}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/70"
                    />

                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="
                            h-13
                            w-full
                            rounded-xl
                            border
                            border-border
                            bg-background
                            pl-11
                            pr-4
                            text-sm
                            text-text-primary
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-text-secondary/50
                            hover:border-border
                            focus:border-primary
                            focus:bg-surface
                            focus:ring-4
                            focus:ring-primary/8
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-text-primary"
                    >
                        Password
                    </label>

                    <Link
                        to="/forgot-password"
                        className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover sm:text-sm"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="relative">
                    <LockKeyhole
                        size={17}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/70"
                    />

                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="
                            h-13
                            w-full
                            rounded-xl
                            border
                            border-border
                            bg-background
                            pl-11
                            pr-12
                            text-sm
                            text-text-primary
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-text-secondary/50
                            focus:border-primary
                            focus:bg-surface
                            focus:ring-4
                            focus:ring-primary/8
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                        }
                        disabled={isSubmitting}
                        className="
                            absolute
                            right-3.5
                            top-1/2
                            flex
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-lg
                            p-1.5
                            text-text-secondary/70
                            transition-colors
                            hover:bg-primary/5
                            hover:text-primary
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isSubmitting}
                        className="
                            h-4
                            w-4
                            cursor-pointer
                            rounded
                            border-border
                            text-primary
                            focus:ring-2
                            focus:ring-primary/20
                        "
                    />

                    <span className="text-sm text-text-secondary">
                        Remember me
                    </span>
                </label>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-primary-hover
                    hover:shadow-md
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    disabled:hover:translate-y-0
                "
            >
                {isSubmitting ? 'Signing in...' : 'Continue'}
            </button>

            {/* Divider */}
            <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>

                <div className="relative flex justify-center">
                    <span className="bg-surface px-4 text-[10px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                        Or
                    </span>
                </div>
            </div>

            {/* Google */}
            <button
                type="button"
                disabled={isSubmitting}
                className="
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    text-sm
                    font-medium
                    text-text-primary
                    transition-all
                    duration-200
                    hover:border-primary/20
                    hover:bg-primary/3
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="h-5 w-5"
                />
                Continue with Google
            </button>
        </form>
    );
};

export default LoginForm;
