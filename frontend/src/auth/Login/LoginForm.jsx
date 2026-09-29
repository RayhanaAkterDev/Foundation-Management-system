// src/pages/Auth/Login/LoginForm.jsx

import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';

import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react';

import { useState } from 'react';

const LoginForm = ({ loginRole = null }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const role = loginRole || searchParams.get('role');

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
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
                }/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                        role,
                    }),
                },
            );

            const data = await response.json();

            /* =========================================================
               Demo verification
            ========================================================= */

            if (
                response.status === 403 &&
                data.verification_method === 'demo' &&
                data.user_id
            ) {
                navigate(
                    `/email-verification?status=demo&user_id=${
                        data.user_id
                    }&email=${encodeURIComponent(email.trim())}`,
                    {
                        state: {
                            from: location.state?.from,
                        },
                    },
                );

                return;
            }

            /* =========================================================
               Email verification
            ========================================================= */

            if (
                response.status === 403 &&
                data.verification_method === 'email' &&
                data.user_id
            ) {
                navigate(
                    `/email-verification?status=email&user_id=${
                        data.user_id
                    }&email=${encodeURIComponent(
                        email.trim(),
                    )}&role=${encodeURIComponent(role || '')}`,
                    {
                        state: {
                            from: location.state?.from,
                        },
                    },
                );

                return;
            }

            /* =========================================================
               Login errors
            ========================================================= */

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        'লগইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।',
                );
            }

            /* =========================================================
               Store authentication
            ========================================================= */

            const storage = rememberMe ? localStorage : sessionStorage;

            const otherStorage = rememberMe ? sessionStorage : localStorage;

            otherStorage.removeItem('auth_token');
            otherStorage.removeItem('user');

            storage.setItem('auth_token', data.token);
            storage.setItem('user', JSON.stringify(data.user));

            window.dispatchEvent(new Event('auth-changed'));

            /* =========================================================
               Redirect
            ========================================================= */

            if (data.user.role === 'admin') {
                navigate('/admin/dashboard', {
                    replace: true,
                });

                return;
            }

            const from = location.state?.from;

            if (typeof from === 'string') {
                navigate(from, {
                    replace: true,
                });

                return;
            }

            if (from?.pathname) {
                navigate(
                    `${from.pathname}${from.search || ''}${from.hash || ''}`,
                    {
                        replace: true,
                    },
                );

                return;
            }

            navigate('/', {
                replace: true,
            });
        } catch (error) {
            setLoginError(
                error.message || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const needsEmailVerification = loginError
        .toLowerCase()
        .includes('verify your email');

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* =====================================================
                EMAIL
            ====================================================== */}

            <div>
                <label
                    htmlFor="email"
                    className="
                        mb-2
                        block
                        font-bengali
                        text-[13px]
                        font-medium
                        text-text-primary
                    "
                >
                    ইমেইল ঠিকানা
                </label>

                <div className="group relative">
                    <Mail
                        size={18}
                        strokeWidth={1.7}
                        className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-[#94a3b8]
                            transition-colors

                            group-focus-within:text-primary
                        "
                    />

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        disabled={isSubmitting}
                        className="
                            h-[52px]
                            w-full
                            border
                            border-[#dce3e0]
                            bg-white
                            pl-11
                            pr-4
                            font-bengali
                            text-[14px]
                            text-text-primary
                            outline-none
                            transition-all
                            duration-200

                            placeholder:font-sans
                            placeholder:text-[#a8b2bd]

                            hover:border-[#c7d2ce]

                            focus:border-primary
                            focus:ring-[3px]
                            focus:ring-primary/[0.08]

                            disabled:cursor-not-allowed
                            disabled:bg-[#f8faf9]
                            disabled:opacity-70
                        "
                    />
                </div>
            </div>

            {/* =====================================================
                PASSWORD
            ====================================================== */}

            <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                        htmlFor="password"
                        className="font-bengali text-[13px] font-medium text-text-primary"
                    >
                        পাসওয়ার্ড
                    </label>

                    <Link
                        to="/account/forgot-password"
                        className="
                            font-bengali
                            text-[12px]
                            font-medium
                            text-primary
                            transition-colors

                            hover:text-primary-hover
                        "
                    >
                        পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                </div>

                <div className="group relative">
                    <LockKeyhole
                        size={18}
                        strokeWidth={1.7}
                        className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-[#94a3b8]
                            transition-colors

                            group-focus-within:text-primary
                        "
                    />

                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="আপনার পাসওয়ার্ড লিখুন"
                        autoComplete="current-password"
                        required
                        disabled={isSubmitting}
                        className="
                            h-[52px]
                            w-full
                            border
                            border-[#dce3e0]
                            bg-white
                            pl-11
                            pr-12
                            font-bengali
                            text-[14px]
                            text-text-primary
                            outline-none
                            transition-all
                            duration-200

                            placeholder:text-[#a8b2bd]

                            hover:border-[#c7d2ce]

                            focus:border-primary
                            focus:ring-[3px]
                            focus:ring-primary/[0.08]

                            disabled:cursor-not-allowed
                            disabled:bg-[#f8faf9]
                            disabled:opacity-70
                        "
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={isSubmitting}
                        aria-label={
                            showPassword
                                ? 'পাসওয়ার্ড লুকান'
                                : 'পাসওয়ার্ড দেখুন'
                        }
                        className="
                            absolute
                            right-2.5
                            top-1/2
                            flex
                            h-9
                            w-9
                            -translate-y-1/2
                            items-center
                            justify-center
                            text-[#8492a3]
                            transition-colors

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

            {/* =====================================================
                ERROR
            ====================================================== */}

            {loginError && (
                <div
                    role="alert"
                    className={`
                        border
                        px-4
                        py-3.5

                        ${
                            needsEmailVerification
                                ? 'border-amber-200 bg-amber-50'
                                : 'border-red-200 bg-red-50'
                        }
                    `}
                >
                    <div className="flex items-start gap-3">
                        {needsEmailVerification && (
                            <Mail
                                size={17}
                                className="mt-0.5 shrink-0 text-amber-700"
                            />
                        )}

                        <p
                            className={`
                                font-bengali
                                text-[12px]
                                leading-6

                                ${
                                    needsEmailVerification
                                        ? 'text-amber-800'
                                        : 'text-red-700'
                                }
                            `}
                        >
                            {loginError}
                        </p>
                    </div>
                </div>
            )}

            {/* =====================================================
                REMEMBER
            ====================================================== */}

            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2.5">
                    <span className="relative flex h-[18px] w-[18px] shrink-0">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isSubmitting}
                            className="
                                peer
                                h-[18px]
                                w-[18px]
                                cursor-pointer
                                appearance-none
                                border
                                border-[#cbd5d1]
                                bg-white
                                transition-all

                                checked:border-primary
                                checked:bg-primary

                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary/15

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        />

                        <svg
                            viewBox="0 0 12 10"
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                left-[4px]
                                top-[5px]
                                hidden
                                h-[7px]
                                w-[10px]
                                fill-none
                                stroke-white
                                stroke-[2]

                                peer-checked:block
                            "
                        >
                            <path d="M1 5L4 8L11 1" />
                        </svg>
                    </span>

                    <span className="font-bengali text-[13px] text-text-secondary">
                        আমাকে মনে রাখুন
                    </span>
                </label>
            </div>

            {/* =====================================================
                SUBMIT
            ====================================================== */}

            <button
                type="submit"
                disabled={isSubmitting}
                className="
                    flex
                    h-[52px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    bg-primary
                    px-5
                    font-bengali
                    text-[14px]
                    font-semibold
                    text-white!
                    transition-all
                    duration-200

                    hover:bg-primary-hover

                    active:translate-y-px

                    disabled:cursor-not-allowed
                    disabled:opacity-65
                "
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={17} className="animate-spin" />
                        লগইন হচ্ছে...
                    </>
                ) : (
                    'লগইন করুন'
                )}
            </button>

            {/* =====================================================
                ALTERNATIVE LOGIN
            ====================================================== */}

            <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-border" />

                <span className="font-bengali text-[11px] text-text-secondary/70">
                    অথবা
                </span>

                <span className="h-px flex-1 bg-border" />
            </div>

            {/* =====================================================
                GOOGLE
            ====================================================== */}

            <button
                type="button"
                disabled={isSubmitting}
                className="
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    border
                    border-[#dce3e0]
                    bg-white
                    px-5
                    font-bengali
                    text-[13px]
                    font-medium
                    text-text-primary
                    transition-all
                    duration-200

                    hover:border-[#bccbc6]
                    hover:bg-[#fafcfb]

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt=""
                    className="h-[18px] w-[18px]"
                />
                Google দিয়ে চালিয়ে যান
            </button>
        </form>
    );
};

export default LoginForm;
