// src/pages/Auth/Login/LoginForm.jsx

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    TbArrowRight,
    TbEye,
    TbEyeOff,
    TbKey,
    TbLock,
    TbMail,
} from 'react-icons/tb';

const LoginForm = ({ loginRole }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    /*
     * AdminLogin passes loginRole="admin".
     * Public login continues to get its role from the URL.
     */
    const role = loginRole || searchParams.get('role') || 'individual';

    const isAdmin = role === 'admin';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* =========================================================
        CONTENT
    ========================================================== */
    const content = isAdmin
        ? {
              emailLabel: 'Email address',
              emailPlaceholder: 'Enter your email address',

              passwordLabel: 'Password',
              passwordPlaceholder: 'Enter your password',

              forgotPassword: 'Forgot password?',
              rememberMe: 'Remember me',
              secureAccess: 'Secure access',

              submit: 'Sign in to administration',
              submitting: 'Signing in...',

              showPassword: 'Show password',
              hidePassword: 'Hide password',

              defaultError: 'Unable to sign in.',
              credentialsError: 'The email address or password is incorrect.',
              incompleteResponse:
                  'Sign in completed, but the required account information was not returned.',
              serverError:
                  'Unable to connect to the server. Please try again shortly.',
          }
        : {
              emailLabel: 'ইমেইল ঠিকানা',
              emailPlaceholder: 'আপনার ইমেইল লিখুন',

              passwordLabel: 'পাসওয়ার্ড',
              passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',

              forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
              rememberMe: 'আমাকে মনে রাখুন',
              secureAccess: 'নিরাপদ প্রবেশ',

              submit: 'অ্যাকাউন্টে প্রবেশ করুন',
              submitting: 'প্রবেশ করা হচ্ছে...',

              showPassword: 'পাসওয়ার্ড দেখুন',
              hidePassword: 'পাসওয়ার্ড লুকান',

              defaultError: 'লগইন করা সম্ভব হয়নি।',
              credentialsError: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।',
              incompleteResponse:
                  'লগইন সম্পন্ন হয়েছে, কিন্তু প্রয়োজনীয় তথ্য পাওয়া যায়নি।',
              serverError:
                  'সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।',
          };

    /* =========================================================
        CHANGE
    ========================================================== */
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError('');
        }
    };

    /* =========================================================
        SUBMIT
    ========================================================== */
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const apiUrl =
                import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data?.errors) {
                    const firstError = Object.values(data.errors)
                        .flat()
                        .find(Boolean);

                    setError(
                        firstError || data?.message || content.defaultError,
                    );
                } else {
                    setError(data?.message || content.credentialsError);
                }

                return;
            }

            if (!data?.token || !data?.user) {
                setError(content.incompleteResponse);

                return;
            }

            const storage = rememberMe ? localStorage : sessionStorage;

            const otherStorage = rememberMe ? sessionStorage : localStorage;

            otherStorage.removeItem('auth_token');
            otherStorage.removeItem('user');

            storage.setItem('auth_token', data.token);
            storage.setItem('user', JSON.stringify(data.user));

            const userRole = data.user?.role || role;

            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (requestError) {
            console.error('Login error:', requestError);

            setError(content.serverError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* =================================================
                ERROR
            ================================================== */}
            {error && (
                <div
                    role="alert"
                    className="
                        mb-4
                        flex
                        items-start
                        gap-2.5
                        rounded-[10px]
                        border
                        border-[#efd4cc]
                        bg-[#fff7f4]
                        px-3.5
                        py-3

                        sm:mb-5
                        sm:gap-3
                        sm:px-4
                    "
                >
                    <span
                        className="
                            mt-[7px]
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-[#c65f45]
                        "
                    />

                    <p
                        className={`
                            text-[10.5px]
                            leading-[1.7]
                            text-[#a84d38]

                            sm:text-[12px]

                            ${isAdmin ? 'font-sans' : 'font-bengali'}
                        `}
                    >
                        {error}
                    </p>
                </div>
            )}

            {/* =================================================
                EMAIL
            ================================================== */}
            <div>
                <label
                    htmlFor="email"
                    className={`
                        mb-2
                        block
                        text-[10.5px]
                        font-semibold
                        text-[#3f5852]

                        sm:text-[11.5px]

                        ${isAdmin ? 'font-sans' : 'font-bengali'}
                    `}
                >
                    {content.emailLabel}
                </label>

                <div
                    className="
                        group
                        flex
                        h-[50px]
                        w-full
                        items-center
                        overflow-hidden
                        rounded-[10px]
                        border
                        border-[#d9e3e0]
                        bg-[#f8faf9]
                        transition-all
                        duration-200

                        focus-within:border-[#0f766e]
                        focus-within:bg-white
                        focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.08)]

                        sm:h-[52px]
                    "
                >
                    <div
                        className="
                            flex
                            h-full
                            w-[44px]
                            shrink-0
                            items-center
                            justify-center
                            text-[#879a94]
                            transition-colors

                            group-focus-within:text-[#0f766e]

                            sm:w-[50px]
                        "
                    >
                        <TbMail size={18} />
                    </div>

                    <span
                        className="
                            h-5
                            w-px
                            shrink-0
                            bg-[#dfe7e4]
                        "
                    />

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        placeholder={content.emailPlaceholder}
                        required
                        className={`
                            h-full
                            min-w-0
                            flex-1
                            border-0!
                            bg-transparent
                            px-3
                            font-sans
                            text-[12px]
                            text-[#25433d]

                            outline-none!

                            focus:border-0!
                            focus:outline-none!
                            focus:ring-0!
                            focus:ring-offset-0!
                            focus:shadow-none!

                            placeholder:text-[10.5px]
                            placeholder:text-[#9caaa6]

                            sm:px-4
                            sm:text-[13px]
                            sm:placeholder:text-[11.5px]

                            ${
                                isAdmin
                                    ? 'placeholder:font-sans'
                                    : 'placeholder:font-bengali'
                            }
                        `}
                    />
                </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}
            <div className="mt-4 sm:mt-5">
                <div
                    className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-3

                        sm:gap-4
                    "
                >
                    <label
                        htmlFor="password"
                        className={`
                            shrink-0
                            text-[10.5px]
                            font-semibold
                            text-[#3f5852]

                            sm:text-[11.5px]

                            ${isAdmin ? 'font-sans' : 'font-bengali'}
                        `}
                    >
                        {content.passwordLabel}
                    </label>

                    <Link
                        to="/forgot-password"
                        className={`
                            min-w-0
                            text-right
                            text-[9.5px]
                            font-medium
                            text-[#0f766e]
                            transition-colors

                            hover:text-[#115e59]
                            hover:underline
                            hover:underline-offset-4

                            focus-visible:outline-none

                            sm:text-[10.5px]

                            ${isAdmin ? 'font-sans' : 'font-bengali'}
                        `}
                    >
                        {content.forgotPassword}
                    </Link>
                </div>

                <div
                    className="
                        group
                        flex
                        h-[50px]
                        w-full
                        items-center
                        overflow-hidden
                        rounded-[10px]
                        border
                        border-[#d9e3e0]
                        bg-[#f8faf9]
                        transition-all
                        duration-200

                        focus-within:border-[#0f766e]
                        focus-within:bg-white
                        focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.08)]

                        sm:h-[52px]
                    "
                >
                    <div
                        className="
                            flex
                            h-full
                            w-[44px]
                            shrink-0
                            items-center
                            justify-center
                            text-[#879a94]
                            transition-colors

                            group-focus-within:text-[#0f766e]

                            sm:w-[50px]
                        "
                    >
                        <TbLock size={18} />
                    </div>

                    <span
                        className="
                            h-5
                            w-px
                            shrink-0
                            bg-[#dfe7e4]
                        "
                    />

                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder={content.passwordPlaceholder}
                        required
                        className={`
                            h-full
                            min-w-0
                            flex-1
                            border-0!
                            bg-transparent
                            px-3
                            font-sans
                            text-[12px]
                            text-[#25433d]

                            outline-none!

                            focus:border-0!
                            focus:outline-none!
                            focus:ring-0!
                            focus:ring-offset-0!
                            focus:shadow-none!

                            placeholder:text-[10.5px]
                            placeholder:text-[#9caaa6]

                            sm:px-4
                            sm:text-[13px]
                            sm:placeholder:text-[11.5px]

                            ${
                                isAdmin
                                    ? 'placeholder:font-sans'
                                    : 'placeholder:font-bengali'
                            }
                        `}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        aria-label={
                            showPassword
                                ? content.hidePassword
                                : content.showPassword
                        }
                        className="
                            flex
                            h-full
                            w-[44px]
                            shrink-0
                            items-center
                            justify-center
                            text-[#879a94]
                            transition-colors

                            hover:text-[#0f766e]
                            focus-visible:outline-none

                            sm:w-[48px]
                        "
                    >
                        {showPassword ? (
                            <TbEyeOff size={18} />
                        ) : (
                            <TbEye size={18} />
                        )}
                    </button>
                </div>
            </div>

            {/* =================================================
                OPTIONS
            ================================================== */}
            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3

                    sm:gap-4
                "
            >
                <label
                    htmlFor="rememberMe"
                    className="
                        inline-flex
                        min-w-0
                        cursor-pointer
                        items-center
                        gap-2

                        sm:gap-2.5
                    "
                >
                    <input
                        id="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) =>
                            setRememberMe(event.target.checked)
                        }
                        className="
                            h-3.5
                            w-3.5
                            shrink-0
                            cursor-pointer
                            accent-[#0f766e]
                        "
                    />

                    <span
                        className={`
                            text-[9.5px]
                            text-[#70817c]

                            sm:text-[10.5px]

                            ${isAdmin ? 'font-sans' : 'font-bengali'}
                        `}
                    >
                        {content.rememberMe}
                    </span>
                </label>

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                        text-[#8b9c97]

                        sm:gap-1.5
                    "
                >
                    <TbKey size={13} />

                    <span
                        className={`
                            text-[8.5px]

                            sm:text-[9.5px]

                            ${isAdmin ? 'font-sans' : 'font-bengali'}
                        `}
                    >
                        {content.secureAccess}
                    </span>
                </div>
            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}
            <button
                type="submit"
                disabled={loading}
                className={`
                    group
                    mt-5
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-between
                    rounded-[10px]
                    bg-[#0f766e]
                    px-4
                    text-[11px]
                    font-semibold
                    text-white
                    shadow-[0_8px_20px_rgba(15,118,110,0.16)]
                    transition-all
                    duration-200

                    hover:bg-[#115e59]
                    hover:shadow-[0_10px_24px_rgba(15,118,110,0.21)]

                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#0f766e]
                    focus-visible:ring-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    sm:mt-6
                    sm:h-[52px]
                    sm:px-5
                    sm:text-[12px]

                    ${isAdmin ? 'font-sans' : 'font-bengali'}
                `}
            >
                <span>{loading ? content.submitting : content.submit}</span>

                {loading ? (
                    <span
                        className="
                            h-4
                            w-4
                            shrink-0
                            animate-spin
                            rounded-full
                            border-2
                            border-white/30
                            border-t-white
                        "
                    />
                ) : (
                    <span
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-[8px]
                            bg-white/10
                            transition-transform
                            duration-200

                            group-hover:translate-x-1
                        "
                    >
                        <TbArrowRight size={17} />
                    </span>
                )}
            </button>
        </form>
    );
};

export default LoginForm;
