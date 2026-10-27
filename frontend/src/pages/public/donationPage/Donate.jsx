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

    if (loading)
        return (
            <main className="grid min-h-[70vh] place-items-center bg-[#f5f7f6]">
                <div className="text-center font-bengali">
                    <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-[3px] border-[#d9e9e4] border-t-[#08786d]" />
                    <p className="text-sm text-slate-600">
                        অনুদানের তথ্য প্রস্তুত হচ্ছে…
                    </p>
                </div>
            </main>
        );
    if (!campaign)
        return (
            <main className="grid min-h-[65vh] place-items-center bg-[#f5f7f6] px-5 font-bengali">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        ক্যাম্পেইন পাওয়া যায়নি
                    </h1>
                    <p className="mt-3 text-slate-500">
                        {error || 'ক্যাম্পেইনটি এই মুহূর্তে পাওয়া যাচ্ছে না।'}
                    </p>
                    <Link
                        to="/campaigns"
                        className="mt-6 inline-flex bg-[#08786d] px-6 py-3 text-white"
                    >
                        সব ক্যাম্পেইন দেখুন
                    </Link>
                </div>
            </main>
        );

    const presets = [500, 1000, 2000, 5000];
    const raised = Number(campaign.raised || 0);
    const target = Number(campaign.targetAmount || 0);
    const progress =
        target > 0 ? Math.min(100, Math.max(0, (raised / target) * 100)) : 0;
    const bn = (value) => Number(value || 0).toLocaleString('bn-BD');
    const category =
        typeof campaign.category === 'object'
            ? campaign.category?.name
            : campaign.category;
    const fieldClass =
        'mt-2 block h-12 w-full min-w-0 appearance-none border-0 border-b border-[#cbd9d6] bg-transparent px-0 font-bengali text-[15px] text-[#163b36] placeholder:text-[#8b9d99]! outline-none! shadow-none! ring-0! focus:border-[#08786d]! focus:outline-none! focus:ring-0! focus:shadow-none! focus-visible:outline-none! focus-visible:ring-0!';

    return (
        <main
            lang="bn"
            className="min-h-screen bg-[#f7f8f6] pb-16 pt-25 font-bengali text-[#17352f] sm:pb-24 sm:pt-30"
        >
            <div className="mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-9">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dbe5e0] pb-5 text-xs sm:text-sm">
                    <Link
                        to={`/campaign/${campaign.id}`}
                        className="inline-flex items-center gap-2 text-[#536c65] transition hover:text-[#08786d]"
                    >
                        <TbArrowLeft size={18} /> উদ্যোগে ফিরে যান
                    </Link>
                    <span className="inline-flex items-center gap-2 text-[#08786d]">
                        <TbShieldCheck size={18} /> নিরাপদ অনুদান প্রক্রিয়া
                    </span>
                </div>

                {/* Campaign introduction: restrained, editorial layout */}
                <header className="grid min-w-0 gap-7 border-b border-[#dbe5e0] py-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-10 lg:gap-15 lg:py-13">
                    <div className="min-w-0 md:order-2">
                        <div className="mb-5 flex items-center gap-3 text-xs font-semibold text-[#08786d]">
                            <span className="h-px w-8 bg-[#d99b42]" />
                            <span>
                                মানবিক উদ্যোগ {category ? ` / ${category}` : ''}
                            </span>
                        </div>
                        <h1 className="max-w-145 text-[clamp(1.8rem,3.3vw,3.25rem)] font-semibold leading-[1.35] tracking-tight">
                            {campaign.title}
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-8 text-[#61756e] sm:text-[15px]">
                            {campaign.shortDescription ||
                                'আপনার সহায়তা প্রয়োজনের সময়ে মানুষের পাশে দাঁড়াতে সাহায্য করবে।'}
                        </p>
                        <div className="mt-8 border-t border-[#dbe5e0] pt-5">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <p className="text-xs text-[#71877f]">
                                        সংগৃহীত
                                    </p>
                                    <strong className="mt-2 block break-words text-base sm:text-xl">
                                        ৳{bn(raised)}
                                    </strong>
                                </div>
                                <div>
                                    <p className="text-xs text-[#71877f]">
                                        লক্ষ্যমাত্রা
                                    </p>
                                    <strong className="mt-2 block break-words text-base sm:text-xl">
                                        ৳{bn(target)}
                                    </strong>
                                </div>
                                <div>
                                    <p className="text-xs text-[#71877f]">
                                        অগ্রগতি
                                    </p>
                                    <strong className="mt-2 block text-base sm:text-xl">
                                        {bn(Math.round(progress))}%
                                    </strong>
                                </div>
                            </div>
                            <div
                                className="mt-5 h-1 overflow-hidden bg-[#dce7e2]"
                                role="progressbar"
                                aria-valuenow={Math.round(progress)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="অনুদান সংগ্রহের অগ্রগতি"
                            >
                                <div
                                    className="h-full bg-[#08786d]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative min-h-65 overflow-hidden bg-[#dce7e2] sm:min-h-85 md:order-1 md:min-h-95 lg:min-h-105">
                        {campaign.image ? (
                            <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center text-[#08786d]">
                                <TbHeartFilled size={54} />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent px-5 pb-5 pt-14">
                            <span className="text-xs font-medium text-white">
                                মানুষের পাশে দাঁড়ানোর একটি উদ্যোগ
                            </span>
                        </div>
                    </div>
                </header>

                {/* Donation workspace */}
                <div className="grid min-w-0 gap-8 pt-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.5fr)] lg:gap-12 lg:pt-15">
                    <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                        <div className="flex items-center gap-3 text-xs font-semibold text-[#08786d]">
                            <span className="h-px w-8 bg-[#d99b42]" /> অনুদান
                            সম্পন্ন করুন
                        </div>
                        <h2 className="mt-5 max-w-90 text-[clamp(1.7rem,3vw,2.7rem)] font-semibold leading-[1.4]">
                            আপনার ছোট সহায়তায় বড় পরিবর্তনের শুরু।
                        </h2>
                        <p className="mt-4 max-w-90 text-sm leading-8 text-[#687e75]">
                            পরিমাণ ও যোগাযোগের তথ্য দিন। এরপর নিরাপদ পেমেন্ট
                            পৃষ্ঠায় অনুদান সম্পন্ন করুন।
                        </p>
                        <div className="mt-7 hidden border-t border-[#dbe5e0] pt-6 lg:block">
                            <p className="mb-5 text-xs font-semibold text-[#6a8179]">
                                সহজ তিনটি ধাপ
                            </p>
                            {[
                                'অনুদানের পরিমাণ',
                                'আপনার পরিচয়',
                                'পেমেন্ট সম্পন্ন',
                            ].map((step, index) => (
                                <div
                                    key={step}
                                    className="flex items-center gap-4 border-l border-[#d7e2dd] py-3 pl-4 text-sm"
                                >
                                    <span className="text-[#08786d]">
                                        {['০১', '০২', '০৩'][index]}
                                    </span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 hidden items-start gap-3 border-t border-[#dbe5e0] pt-6 text-xs leading-6 text-[#687e75] lg:flex">
                            <TbShieldCheck
                                size={22}
                                className="shrink-0 text-[#08786d]"
                            />
                            <span>
                                পেমেন্টের তথ্য নিরাপদ পেমেন্ট গেটওয়েতে
                                প্রক্রিয়াকৃত হবে।
                            </span>
                        </div>
                    </aside>

                    <form
                        onSubmit={handleDonate}
                        className="min-w-0 bg-white shadow-[0_16px_60px_rgba(23,53,47,0.045)]"
                    >
                        <div className="border-b border-[#e5ece8] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                            <div className="flex items-start gap-4">
                                <span className="pt-0.5 text-2xl font-light text-[#84b3a7]">
                                    ০১
                                </span>
                                <div>
                                    <h3 className="text-xl font-semibold sm:text-2xl">
                                        অনুদানের পরিমাণ
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-[#71857e]">
                                        আপনার সামর্থ্য অনুযায়ী পরিমাণ নির্বাচন
                                        করুন।
                                    </p>
                                </div>
                            </div>
                            <div className="mt-7 grid grid-cols-2 gap-2 min-[560px]:grid-cols-4 sm:gap-3">
                                {presets.map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        aria-pressed={Number(amount) === val}
                                        onClick={() => {
                                            setAmount(val);
                                            setError(null);
                                        }}
                                        className={`relative flex min-h-17 items-center justify-center border px-2 py-3 text-base font-semibold transition-colors sm:text-lg ${Number(amount) === val ? 'border-[#08786d] bg-[#e9f4f0] text-[#08786d]' : 'border-[#e0e8e4] bg-white hover:border-[#08786d]/60'}`}
                                    >
                                        ৳{bn(val)}
                                        {Number(amount) === val && (
                                            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#08786d]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <label
                                htmlFor="donation-amount"
                                className="mt-7 block text-xs font-semibold text-[#4b625a]"
                            >
                                অন্য পরিমাণ লিখুন
                            </label>
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-semibold text-[#08786d]">
                                    ৳
                                </span>
                                <input
                                    id="donation-amount"
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
                                    className={fieldClass + ' text-lg'}
                                    placeholder="পরিমাণ লিখুন"
                                />
                            </div>
                            <p className="mt-2 text-xs text-[#84958e]">
                                সর্বনিম্ন অনুদান ৳১০
                            </p>
                        </div>

                        <div className="border-b border-[#e5ece8] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                            <div className="flex items-start gap-4">
                                <span className="pt-0.5 text-2xl font-light text-[#84b3a7]">
                                    ০২
                                </span>
                                <div>
                                    <h3 className="text-xl font-semibold sm:text-2xl">
                                        আপনার পরিচয়
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-[#71857e]">
                                        {isLoggedIn
                                            ? 'আপনার অ্যাকাউন্টের তথ্য দেওয়া আছে। প্রয়োজনে সংশোধন করুন।'
                                            : 'অনুদানের জন্য প্রয়োজনীয় যোগাযোগের তথ্য দিন।'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-7 grid min-w-0 gap-x-6 gap-y-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="donor-name"
                                        className="text-xs font-semibold"
                                    >
                                        পূর্ণ নাম
                                    </label>
                                    <input
                                        id="donor-name"
                                        autoComplete="name"
                                        value={donor.name}
                                        onChange={(e) =>
                                            handleDonorChange(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        placeholder="আপনার পূর্ণ নাম"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="donor-email"
                                        className="text-xs font-semibold"
                                    >
                                        ইমেইল ঠিকানা
                                    </label>
                                    <input
                                        id="donor-email"
                                        type="email"
                                        autoComplete="email"
                                        value={donor.email}
                                        onChange={(e) =>
                                            handleDonorChange(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        placeholder="ইমেইল লিখুন"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="donor-phone"
                                        className="text-xs font-semibold"
                                    >
                                        ফোন নম্বর
                                    </label>
                                    <input
                                        id="donor-phone"
                                        type="tel"
                                        autoComplete="tel"
                                        maxLength={11}
                                        value={donor.phone}
                                        onChange={(e) =>
                                            handleDonorChange(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                            <div className="flex items-start gap-4">
                                <span className="pt-0.5 text-2xl font-light text-[#84b3a7]">
                                    ০৩
                                </span>
                                <div>
                                    <h3 className="text-xl font-semibold sm:text-2xl">
                                        পেমেন্ট সম্পন্ন করুন
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-[#71857e]">
                                        পরবর্তী ধাপে নিরাপদ পেমেন্ট গেটওয়েতে
                                        মাধ্যম নির্বাচন করতে পারবেন।
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e5ece8] pt-5 text-xs text-[#60786f] sm:text-sm">
                                <span className="inline-flex items-center gap-2">
                                    <TbCreditCard
                                        size={19}
                                        className="text-[#08786d]"
                                    />{' '}
                                    কার্ড পেমেন্ট
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <TbWallet
                                        size={19}
                                        className="text-[#08786d]"
                                    />{' '}
                                    মোবাইল ব্যাংকিং
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#123f39] px-5 py-7 text-white sm:px-8 sm:py-8 lg:px-10">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs text-white/65">
                                        আপনার মোট অনুদান
                                    </p>
                                    <p className="mt-2 break-words text-3xl font-semibold sm:text-4xl">
                                        ৳{bn(amount)}
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex min-h-13 w-full items-center justify-center gap-3 bg-[#e9ad53] px-6 text-sm font-semibold text-[#123f39] transition-colors hover:bg-[#f3bc68] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    <TbHeartFilled size={18} />
                                    {submitting
                                        ? 'পেমেন্ট শুরু হচ্ছে…'
                                        : 'অনুদান নিশ্চিত করুন'}
                                    <span aria-hidden="true">→</span>
                                </button>
                            </div>
                            <p className="mt-5 flex items-center gap-2 text-xs text-white/65">
                                <TbShieldCheck size={16} /> নিরাপদ পেমেন্ট
                                প্রক্রিয়া
                            </p>
                            {error && (
                                <p
                                    role="alert"
                                    className="mt-5 border-l-2 border-[#e9ad53] bg-white/10 px-4 py-3 text-sm leading-7"
                                >
                                    {error}
                                    {error.includes(
                                        'এই ইমেইল দিয়ে একটি অ্যাকাউন্ট রয়েছে',
                                    ) && (
                                        <Link
                                            to="/login"
                                            className="ml-2 underline"
                                        >
                                            লগইন করুন
                                        </Link>
                                    )}
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Donate;
