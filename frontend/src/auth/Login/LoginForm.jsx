// src/pages/Auth/Login/LoginForm.jsx

import { Link } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Login Logic
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="mb-2.5 block text-sm font-medium text-text-primary"
                >
                    Email Address
                </label>

                <div className="relative">
                    <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/70"
                    />

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        className="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-text-primary outline-none transition-all duration-200 placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <div className="mb-2.5 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-text-primary"
                    >
                        Password
                    </label>

                    <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="relative">
                    <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/70"
                    />

                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-14 text-text-primary outline-none transition-all duration-200 placeholder:text-text-secondary/60 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/70 transition-colors hover:text-primary"
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />

                    <span className="text-sm text-text-secondary">
                        Remember me
                    </span>
                </label>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover "
            >
                Continue
            </button>

            {/* Divider */}
            <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>

                <div className="relative flex justify-center">
                    <span className="bg-surface px-4 text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
                        Or
                    </span>
                </div>
            </div>

            {/* Google */}
            <button
                type="button"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-border/80 bg-background font-medium text-text-primary transition-all duration-200 hover:border-primary-hover/30 hover:bg-primary/5"
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
