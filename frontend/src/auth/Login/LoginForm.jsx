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
    TbShieldCheck,
} from 'react-icons/tb';

const LoginForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const role = searchParams.get('role') || 'individual';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                        firstError || data?.message || 'লগইন করা সম্ভব হয়নি।',
                    );
                } else {
                    setError(data?.message || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
                }

                return;
            }

            if (!data?.token || !data?.user) {
                setError(
                    'লগইন সম্পন্ন হয়েছে, কিন্তু প্রয়োজনীয় তথ্য পাওয়া যায়নি।',
                );

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
            } else if (userRole === 'organization') {
                navigate('/organization/dashboard');
            } else {
                navigate('/individual/dashboard');
            }
        } catch (requestError) {
            console.error('Login error:', requestError);

            setError(
                'সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* =====================================================
                CARD
            ====================================================== */}
            <div
                className="
                    overflow-hidden
                    border
                    border-[#d7e1de]
                    bg-[#fbfcf9]
                    shadow-[0_24px_65px_rgba(4,45,40,0.16)]
                "
            >
                {/* =================================================
                    CARD HEADER
                ================================================== */}
                <div
                    className="
                        border-b
                        border-[#e0e7e4]
                        px-6
                        py-5
                        sm:px-7
                        sm:py-6
                    "
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <span className="h-[3px] w-7 bg-[#f59e0b]" />

                            <span
                                className="
                                    font-sans
                                    text-[9px]
                                    font-semibold
                                    tracking-[0.1em]
                                    text-[#0f766e]
                                "
                            >
                                SECURE LOGIN
                            </span>
                        </div>

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                bg-[#eaf4f2]
                                text-[#0f766e]
                            "
                        >
                            <TbShieldCheck size={17} />
                        </div>
                    </div>

                    <h2
                        className="
                            mt-4
                            font-bengali
                            text-[24px]
                            font-semibold
                            leading-[1.45]
                            tracking-[-0.02em]
                            text-[#163c37]
                            sm:text-[27px]
                        "
                    >
                        আপনার অ্যাকাউন্টে প্রবেশ করুন
                    </h2>

                    <p
                        className="
                            mt-1.5
                            max-w-[390px]
                            font-bengali
                            text-[10.5px]
                            leading-[1.8]
                            text-[#7b8b86]
                            sm:text-[11px]
                        "
                    >
                        আপনার অ্যাকাউন্টের তথ্য ব্যবহার করে নিরাপদে Stand For
                        People-এ প্রবেশ করুন।
                    </p>
                </div>

                {/* =================================================
                    FORM BODY
                ================================================== */}
                <form
                    onSubmit={handleSubmit}
                    className="
                        px-6
                        py-6
                        sm:px-7
                        sm:py-7
                    "
                >
                    {/* ERROR */}
                    {error && (
                        <div
                            role="alert"
                            className="
                                mb-5
                                flex
                                gap-3
                                border
                                border-[#efc9bf]
                                bg-[#fff6f2]
                                px-4
                                py-3
                            "
                        >
                            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c65f45]" />

                            <p
                                className="
                                    font-bengali
                                    text-[10px]
                                    leading-[1.7]
                                    text-[#a84d38]
                                "
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
                            className="
                                mb-2
                                block
                                font-bengali
                                text-[10.5px]
                                font-semibold
                                text-[#445c56]
                            "
                        >
                            ইমেইল ঠিকানা
                        </label>

                        <div
                            className="
                                group
                                flex
                                h-[50px]
                                items-center
                                border
                                border-[#d5e0dd]
                                bg-white
                                transition-all
                                duration-200
                                focus-within:border-[#0f766e]
                                focus-within:ring-2
                                focus-within:ring-[#0f766e]/10
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-full
                                    w-[46px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    border-r
                                    border-[#e3e9e7]
                                    text-[#8ca09a]
                                    transition-colors
                                    group-focus-within:text-[#0f766e]
                                "
                            >
                                <TbMail size={18} />
                            </div>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                placeholder="আপনার ইমেইল লিখুন"
                                required
                                className="
                                    h-full
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    px-4
                                    font-sans
                                    text-[12px]
                                    text-[#25433d]
                                    outline-none
                                    placeholder:text-[#a4b0ad]
                                "
                            />
                        </div>
                    </div>

                    {/* =================================================
                        PASSWORD
                    ================================================== */}
                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="password"
                                className="
                                    font-bengali
                                    text-[10.5px]
                                    font-semibold
                                    text-[#445c56]
                                "
                            >
                                পাসওয়ার্ড
                            </label>

                            <Link
                                to="/account/forgot-password"
                                className="
                                    font-bengali
                                    text-[9.5px]
                                    font-medium
                                    text-[#0f766e]
                                    transition-colors
                                    hover:text-[#115e59]
                                    focus-visible:outline-none
                                    focus-visible:underline
                                "
                            >
                                পাসওয়ার্ড ভুলে গেছেন?
                            </Link>
                        </div>

                        <div
                            className="
                                group
                                flex
                                h-[50px]
                                items-center
                                border
                                border-[#d5e0dd]
                                bg-white
                                transition-all
                                duration-200
                                focus-within:border-[#0f766e]
                                focus-within:ring-2
                                focus-within:ring-[#0f766e]/10
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-full
                                    w-[46px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    border-r
                                    border-[#e3e9e7]
                                    text-[#8ca09a]
                                    transition-colors
                                    group-focus-within:text-[#0f766e]
                                "
                            >
                                <TbLock size={18} />
                            </div>

                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                placeholder="আপনার পাসওয়ার্ড লিখুন"
                                required
                                className="
                                    h-full
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    px-4
                                    font-sans
                                    text-[12px]
                                    text-[#25433d]
                                    outline-none
                                    placeholder:text-[#a4b0ad]
                                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? 'পাসওয়ার্ড লুকান'
                                        : 'পাসওয়ার্ড দেখুন'
                                }
                                className="
                                    flex
                                    h-full
                                    w-[46px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    text-[#8ca09a]
                                    transition-colors
                                    hover:text-[#0f766e]
                                    focus-visible:outline-none
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
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <label
                            htmlFor="rememberMe"
                            className="
                                inline-flex
                                cursor-pointer
                                items-center
                                gap-2
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
                                    cursor-pointer
                                    accent-[#0f766e]
                                "
                            />

                            <span
                                className="
                                    font-bengali
                                    text-[9.5px]
                                    text-[#7e8d89]
                                "
                            >
                                আমাকে মনে রাখুন
                            </span>
                        </label>

                        <div className="flex items-center gap-1.5">
                            <TbKey size={12} className="text-[#a1afab]" />

                            <span
                                className="
                                    font-bengali
                                    text-[8.5px]
                                    text-[#9aa7a3]
                                "
                            >
                                নিরাপদ প্রবেশ
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        SUBMIT
                    ================================================== */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            group
                            relative
                            mt-6
                            flex
                            h-[52px]
                            w-full
                            items-center
                            justify-between
                            overflow-hidden
                            bg-[#0f766e]
                            px-5
                            font-bengali
                            text-[11.5px]
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:bg-[#115e59]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#0f766e]
                            focus-visible:ring-offset-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        <span>
                            {loading
                                ? 'প্রবেশ করা হচ্ছে...'
                                : 'অ্যাকাউন্টে প্রবেশ করুন'}
                        </span>

                        {!loading && (
                            <span
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    bg-white/10
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-1
                                "
                            >
                                <TbArrowRight size={17} />
                            </span>
                        )}

                        {loading && (
                            <span
                                className="
                                    h-4
                                    w-4
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-white/25
                                    border-t-white
                                "
                            />
                        )}
                    </button>
                </form>

                {/* =================================================
                    CARD FOOTER
                ================================================== */}
                <div
                    className="
                        border-t
                        border-[#e0e7e4]
                        bg-[#f5f8f6]
                        px-6
                        py-4
                        sm:px-7
                    "
                >
                    <div className="flex items-center justify-between gap-4">
                        <p
                            className="
                                font-bengali
                                text-[9.5px]
                                text-[#87958f]
                            "
                        >
                            নতুন ব্যবহারকারী?
                        </p>

                        <Link
                            to="/register"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-1.5
                                font-bengali
                                text-[10px]
                                font-semibold
                                text-[#0f766e]
                                transition-colors
                                hover:text-[#115e59]
                            "
                        >
                            অ্যাকাউন্ট তৈরি করুন
                            <span
                                className="
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-1
                                "
                            >
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
