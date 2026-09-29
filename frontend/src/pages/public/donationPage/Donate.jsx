// src/pages/Donate/Donate.jsx

import React, { useEffect, useState } from 'react';

import { useParams, Link } from 'react-router-dom';

import { fetchPublicCampaignById } from '@/api/publicCampaignsApi';

import { initiateDonation } from '@/dashboard/individual/myDonations/api/donationApi';

import Badge from '@/components/Badge';

import {
    TbArrowLeft,
    TbHeartFilled,
    TbCreditCard,
    TbShieldCheck,
    TbUser,
    TbWallet,
} from 'react-icons/tb';

/* =========================================================
   AUTH HELPERS
========================================================= */

const getStoredUser = () => {
    try {
        const storedUser =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!storedUser) {
            return null;
        }

        return JSON.parse(storedUser);
    } catch {
        return null;
    }
};

const getStoredToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {
    if (!error) {
        return 'পেমেন্ট প্রক্রিয়া শুরু করা সম্ভব হয়নি। আবার চেষ্টা করুন।';
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error.message) {
        return error.message;
    }

    if (error.errors && typeof error.errors === 'object') {
        const messages = Object.values(error.errors).flat().filter(Boolean);

        if (messages.length > 0) {
            return messages.join(' ');
        }
    }

    if (error.data?.message) {
        return error.data.message;
    }

    if (error.data?.errors && typeof error.data.errors === 'object') {
        const messages = Object.values(error.data.errors)
            .flat()
            .filter(Boolean);

        if (messages.length > 0) {
            return messages.join(' ');
        }
    }

    return 'পেমেন্ট প্রক্রিয়া শুরু করা সম্ভব হয়নি। আবার চেষ্টা করুন।';
};

const Donate = () => {
    const { id } = useParams();

    const [campaign, setCampaign] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [amount, setAmount] = useState(1000);

    const [submitting, setSubmitting] = useState(false);

    /* =========================================================
       AUTH STATE
    ========================================================= */

    const [auth, setAuth] = useState(() => ({
        user: getStoredUser(),
        token: getStoredToken(),
    }));

    const isLoggedIn = Boolean(auth.token && auth.user);

    /* =========================================================
       DONOR INFORMATION
    ========================================================= */

    const [donor, setDonor] = useState(() => {
        const user = getStoredUser();
        const token = getStoredToken();

        if (!token || !user) {
            return {
                name: '',
                email: '',
                phone: '',
            };
        }

        return {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        };
    });

    /* =========================================================
       SYNC AUTH STATE

       This allows the public donation page to recognize
       login/logout changes made in the same browser.
    ========================================================= */

    useEffect(() => {
        const syncAuth = () => {
            const user = getStoredUser();
            const token = getStoredToken();

            setAuth({
                user,
                token,
            });

            if (user && token) {
                setDonor({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                });
            } else {
                setDonor({
                    name: '',
                    email: '',
                    phone: '',
                });
            }
        };

        window.addEventListener('auth-changed', syncAuth);
        window.addEventListener('storage', syncAuth);

        return () => {
            window.removeEventListener('auth-changed', syncAuth);
            window.removeEventListener('storage', syncAuth);
        };
    }, []);

    /* =========================================================
       LOAD CAMPAIGN
    ========================================================= */

    useEffect(() => {
        if (!id) {
            return;
        }

        let cancelled = false;

        const loadCampaign = async () => {
            try {
                const data = await fetchPublicCampaignById(id);

                if (cancelled) {
                    return;
                }

                setCampaign(data);
            } catch (err) {
                console.error('Failed to load campaign:', err);

                if (!cancelled) {
                    setCampaign(null);
                    setError('এই ক্যাম্পেইনটি এখন লোড করা সম্ভব হচ্ছে না।');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCampaign();

        return () => {
            cancelled = true;
        };
    }, [id]);

    /* =========================================================
       DONOR FIELD CHANGE
    ========================================================= */

    const handleDonorChange = (field, value) => {
        setDonor((current) => ({
            ...current,
            [field]: value,
        }));

        setError(null);
    };

    /* =========================================================
       DONATION
    ========================================================= */

    const handleDonate = async (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 10) {
            setError('অনুগ্রহ করে কমপক্ষে ৳১০ অনুদানের পরিমাণ লিখুন।');
            return;
        }

        if (!campaign?.id) {
            setError('ক্যাম্পেইনের তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।');
            return;
        }

        const donorName = donor.name.trim();
        const donorEmail = donor.email.trim();
        const donorPhone = donor.phone.trim();

        if (!donorName) {
            setError('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
            return;
        }

        if (!donorEmail) {
            setError('অনুগ্রহ করে আপনার ইমেইল ঠিকানা লিখুন।');
            return;
        }

        if (!donorPhone) {
            setError('অনুগ্রহ করে আপনার ফোন নম্বর লিখুন।');
            return;
        }

        if (!/^01\d{9}$/.test(donorPhone)) {
            setError(
                'অনুগ্রহ করে একটি সঠিক বাংলাদেশি ফোন নম্বর লিখুন। উদাহরণ: 01XXXXXXXXX',
            );
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            /*
             * IMPORTANT:
             *
             * initiateDonation() uses apiRequest().
             * apiRequest() automatically reads auth_token from
             * localStorage/sessionStorage and sends:
             *
             * Authorization: Bearer <token>
             *
             * Therefore:
             *
             * Guest       → no token → guest donation
             * Logged user → token   → donation linked to user
             */

            console.log('Starting donation:', {
                campaignId: campaign.id,
                amount: numericAmount,
                donorName,
                donorEmail,
                donorPhone,
                authenticated: isLoggedIn,
                userId: auth.user?.id || null,
            });

            const response = await initiateDonation({
                campaignId: campaign.id,
                amount: numericAmount,
                donorName,
                donorEmail,
                donorPhone,
            });

            console.log('Donation API response:', response);

            if (!response) {
                throw new Error('সার্ভার থেকে কোনো উত্তর পাওয়া যায়নি।');
            }

            if (!response.payment_url) {
                throw new Error(
                    response.message ||
                        response.error ||
                        'সার্ভার থেকে পেমেন্টের লিংক পাওয়া যায়নি।',
                );
            }

            window.location.href = response.payment_url;
        } catch (err) {
            console.error('Donation initiation failed:', err);

            setError(getErrorMessage(err));

            setSubmitting(false);
        }
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="font-bengali text-sm text-text-secondary">
                    অনুদানের পেজ লোড হচ্ছে...
                </p>
            </div>
        );
    }

    /* =========================================================
       CAMPAIGN NOT FOUND
    ========================================================= */

    if (!campaign) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="text-center">
                    <h2 className="font-bengali text-xl font-semibold text-text-primary">
                        ক্যাম্পেইন পাওয়া যায়নি
                    </h2>

                    <p className="mt-2 font-bengali text-sm text-text-secondary">
                        {error ||
                            'আপনি যে ক্যাম্পেইনটি খুঁজছেন সেটি বিদ্যমান নেই অথবা সরিয়ে নেওয়া হয়েছে।'}
                    </p>

                    <Link
                        to="/campaigns"
                        className="mt-4 inline-block font-bengali text-primary"
                    >
                        ক্যাম্পেইনগুলো দেখুন
                    </Link>
                </div>
            </div>
        );
    }

    const presets = [500, 1000, 2000, 5000];

    return (
        <div className="mt-20 min-h-screen bg-background py-10">
            <div className="container-width max-w-5xl">
                {/* Back */}
                <Link
                    to={`/campaign/${campaign.id}`}
                    className="
                        mb-6
                        inline-flex
                        items-center
                        gap-2
                        font-bengali
                        text-sm
                        text-text-secondary
                        transition
                        hover:text-primary
                    "
                >
                    <TbArrowLeft />
                    ক্যাম্পেইনে ফিরে যান
                </Link>

                <form
                    onSubmit={handleDonate}
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        lg:grid-cols-2
                        lg:gap-10
                    "
                >
                    {/* =================================================
                        LEFT COLUMN
                    ================================================= */}
                    <div className="order-2 space-y-6 lg:order-1">
                        {/* Campaign Introduction */}
                        <div>
                            <Badge variant="primary" tone="soft">
                                {campaign.category?.name ||
                                    campaign.category ||
                                    'ক্যাম্পেইন'}
                            </Badge>

                            <h1
                                className="
                                    mt-3
                                    font-bengali
                                    text-3xl
                                    font-semibold
                                    leading-tight
                                    tracking-[-0.025em]
                                    text-text-primary
                                "
                            >
                                {campaign.title}-এ অনুদান দিন
                            </h1>

                            <p
                                className="
                                    mt-2
                                    font-bengali
                                    leading-relaxed
                                    text-text-secondary
                                "
                            >
                                আপনার অনুদান জরুরি প্রয়োজনে থাকা মানুষের কাছে
                                দ্রুত সহায়তা পৌঁছে দিতে সাহায্য করবে।
                            </p>

                            {campaign.supporters !== undefined && (
                                <div className="mt-3 font-bengali text-sm text-text-secondary">
                                    <p className="font-medium">
                                        {campaign.supporters} জন এই ক্যাম্পেইন
                                        থেকে সহায়তা পেয়েছেন।
                                    </p>

                                    <p>
                                        বেশিরভাগ অনুদানের পরিমাণ{' '}
                                        <span className="font-medium text-primary">
                                            ৳১০০০–২০০০
                                        </span>
                                        ।
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Donor Information */}
                        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bengali font-semibold text-text-primary">
                                        দাতার তথ্য
                                    </h3>

                                    <p className="mt-1 font-bengali text-xs text-text-secondary">
                                        {isLoggedIn
                                            ? 'আপনার অ্যাকাউন্টের তথ্য স্বয়ংক্রিয়ভাবে পূরণ করা হয়েছে।'
                                            : 'অনুদান চালিয়ে যেতে আপনার তথ্য লিখুন।'}
                                    </p>
                                </div>

                                {isLoggedIn && (
                                    <span
                                        className="
                                            shrink-0
                                            rounded-full
                                            bg-primary/10
                                            px-2.5
                                            py-1
                                            font-bengali
                                            text-xs
                                            font-medium
                                            text-primary
                                        "
                                    >
                                        লগইন করা আছে
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 space-y-4">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="donor-name"
                                        className="
                                            mb-1.5
                                            block
                                            font-bengali
                                            text-sm
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        পূর্ণ নাম
                                    </label>

                                    <input
                                        id="donor-name"
                                        type="text"
                                        value={donor.name}
                                        onChange={(e) =>
                                            handleDonorChange(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="আপনার পূর্ণ নাম লিখুন"
                                        autoComplete="name"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-border
                                            bg-surface-soft
                                            px-3.5
                                            py-3
                                            text-sm
                                            text-text-primary
                                            outline-none
                                            transition
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/10
                                        "
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="donor-email"
                                        className="
                                            mb-1.5
                                            block
                                            font-bengali
                                            text-sm
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        ইমেইল ঠিকানা
                                    </label>

                                    <input
                                        id="donor-email"
                                        type="email"
                                        value={donor.email}
                                        onChange={(e) =>
                                            handleDonorChange(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-border
                                            bg-surface-soft
                                            px-3.5
                                            py-3
                                            text-sm
                                            text-text-primary
                                            outline-none
                                            transition
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/10
                                        "
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="donor-phone"
                                        className="
                                            mb-1.5
                                            block
                                            font-bengali
                                            text-sm
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        ফোন নম্বর
                                    </label>

                                    <input
                                        id="donor-phone"
                                        type="tel"
                                        value={donor.phone}
                                        onChange={(e) =>
                                            handleDonorChange(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="01XXXXXXXXX"
                                        maxLength={11}
                                        autoComplete="tel"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-border
                                            bg-surface-soft
                                            px-3.5
                                            py-3
                                            text-sm
                                            text-text-primary
                                            outline-none
                                            transition
                                            focus:border-primary
                                            focus:ring-2
                                            focus:ring-primary/10
                                        "
                                    />

                                    <p className="mt-1.5 font-bengali text-[11px] text-text-secondary">
                                        পেমেন্টের জন্য একটি সঠিক বাংলাদেশি ফোন
                                        নম্বর প্রয়োজন।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Choose Amount */}
                        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <h3 className="mb-2 font-bengali font-semibold text-text-primary">
                                অনুদানের পরিমাণ নির্বাচন করুন
                            </h3>

                            <p className="mb-4 font-bengali text-xs text-text-secondary">
                                সাম্প্রতিক অনুদানের ভিত্তিতে প্রস্তাবিত পরিমাণ
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {presets.map((val) => {
                                    const isSuggested = val === 1000;

                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setAmount(val)}
                                            className={`
                                                relative
                                                rounded-xl
                                                border
                                                py-3
                                                text-sm
                                                font-medium
                                                transition-all
                                                ${
                                                    amount === val
                                                        ? 'border-primary bg-primary text-white! shadow-sm'
                                                        : isSuggested
                                                          ? 'border-primary bg-primary/5 text-primary'
                                                          : 'border-border bg-surface-soft hover:border-primary/40'
                                                }
                                            `}
                                        >
                                            ৳{val}
                                            {isSuggested && (
                                                <span
                                                    className="
                                                        absolute
                                                        -right-1
                                                        -top-2
                                                        rounded-full
                                                        bg-primary
                                                        px-2
                                                        py-0.5
                                                        font-bengali
                                                        text-[10px]
                                                        text-white!
                                                    "
                                                >
                                                    জনপ্রিয়
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <input
                                type="number"
                                min="10"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(
                                        e.target.value === ''
                                            ? ''
                                            : Number(e.target.value),
                                    );

                                    setError(null);
                                }}
                                className="
                                    mt-4
                                    w-full
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface-soft
                                    p-3
                                    outline-none
                                    transition
                                    focus:border-primary
                                "
                                placeholder="নিজের পরিমাণ লিখুন"
                            />

                            <div className="mt-4 font-bengali text-sm text-text-secondary">
                                <span className="font-medium text-primary">
                                    ৳{Number(amount || 0).toLocaleString()}
                                </span>{' '}
                                দিয়ে ক্ষতিগ্রস্ত পরিবারগুলোর জন্য প্রয়োজনীয়
                                সহায়তা পৌঁছে দিতে সাহায্য করতে পারেন।
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <h3 className="flex items-center gap-2 font-bengali font-semibold text-text-primary">
                                <TbCreditCard />
                                পেমেন্ট পদ্ধতি
                            </h3>

                            <label
                                className="
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-border
                                    p-3
                                    transition
                                    hover:border-primary/40
                                "
                            >
                                <input type="radio" name="pay" defaultChecked />

                                <TbCreditCard className="text-primary" />

                                <span className="font-bengali text-sm text-text-primary">
                                    ক্রেডিট / ডেবিট কার্ড
                                </span>
                            </label>

                            <label
                                className="
                                    flex
                                    cursor-pointer
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-border
                                    p-3
                                    transition
                                    hover:border-primary/40
                                "
                            >
                                <input type="radio" name="pay" />

                                <TbWallet className="text-accent" />

                                <span className="font-bengali text-sm text-text-primary">
                                    মোবাইল ব্যাংকিং (বিকাশ / নগদ)
                                </span>
                            </label>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-bengali text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Donate Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-primary
                                py-3
                                font-bengali
                                text-lg
                                font-semibold
                                text-white!
                                transition
                                hover:bg-primary-dark
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            <TbHeartFilled />

                            {submitting
                                ? 'পেমেন্ট শুরু হচ্ছে...'
                                : `৳${Number(
                                      amount || 0,
                                  ).toLocaleString()} অনুদান দিন`}
                        </button>

                        <p className="flex items-center gap-2 font-bengali text-xs text-text-secondary">
                            <TbShieldCheck className="text-primary" />
                            নিরাপদ অনুদান • কোনো গোপন চার্জ নেই • তাৎক্ষণিক
                            নিশ্চিতকরণ
                        </p>
                    </div>

                    {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}
                    <div className="order-1 space-y-6 lg:order-2">
                        {/* Campaign Summary */}
                        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <h3 className="mb-4 font-bengali font-semibold text-text-primary">
                                ক্যাম্পেইনের সংক্ষিপ্ত তথ্য
                            </h3>

                            {campaign.image && (
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="h-52 w-full rounded-xl object-cover"
                                />
                            )}

                            {campaign.shortDescription && (
                                <p className="mt-4 font-bengali text-sm leading-relaxed text-text-secondary">
                                    {campaign.shortDescription}
                                </p>
                            )}

                            <div className="mt-5 space-y-2 font-bengali text-sm">
                                {campaign.raised !== undefined && (
                                    <div className="flex justify-between text-text-secondary">
                                        <span>সংগৃহীত</span>

                                        <span className="font-medium text-text-primary">
                                            ৳
                                            {Number(
                                                campaign.raised,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {campaign.targetAmount !== undefined && (
                                    <div className="flex justify-between text-text-secondary">
                                        <span>লক্ষ্য</span>

                                        <span className="font-medium text-text-primary">
                                            ৳
                                            {Number(
                                                campaign.targetAmount,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {campaign.supporters !== undefined && (
                                    <div className="flex justify-between text-text-secondary">
                                        <span>সহায়তাকারী</span>

                                        <span className="font-medium text-text-primary">
                                            {campaign.supporters}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Impact */}
                        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5 sm:p-6">
                            <h3 className="flex items-center gap-2 font-bengali font-semibold text-primary">
                                <TbUser />
                                আপনার অবদান
                            </h3>

                            <p className="mt-2 font-bengali text-sm leading-relaxed text-text-secondary">
                                আপনার ছোট একটি অনুদানও ক্ষতিগ্রস্ত পরিবারগুলোর
                                জন্য খাবার, চিকিৎসা এবং জরুরি সহায়তা পৌঁছে দিতে
                                সাহায্য করতে পারে।
                            </p>

                            <div className="mt-4 font-bengali text-sm font-medium text-primary">
                                প্রতিটি অবদান গুরুত্বপূর্ণ ❤️
                            </div>
                        </div>

                        {/* Transparency */}
                        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <h3 className="flex items-center gap-2 font-bengali font-semibold text-text-primary">
                                <TbWallet />
                                স্বচ্ছতা
                            </h3>

                            <ul className="mt-3 space-y-2 font-bengali text-sm text-text-secondary">
                                <li>• ১০০% যাচাইকৃত ক্যাম্পেইন</li>
                                <li>• রিয়েল-টাইম আপডেট</li>
                                <li>• জনসাধারণের জন্য তহবিলের তথ্য</li>
                                <li>• এনজিও যাচাই ব্যবস্থা</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Donate;
