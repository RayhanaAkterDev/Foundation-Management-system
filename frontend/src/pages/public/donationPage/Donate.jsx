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
    const inputStyle =
        'w-full rounded-none border-0 border-b border-[#cbd9d6] bg-transparent px-0 py-3 text-[15px] text-[#122a2a] outline-none placeholder:text-slate-400 focus:border-[#08786d] focus:ring-0';

    return (
        <main
            lang="bn"
            className="min-h-screen bg-[#f5f7f6] pb-14 pt-5 font-bengali sm:pb-20 sm:pt-8 text-[#142e30] sm:pt-24 mt-20"
        >
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-9">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce6e3] pb-4 text-xs sm:text-sm">
                    <Link
                        to={`/campaign/${campaign.id}`}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-[#08786d]"
                    >
                        <TbArrowLeft size={17} /> ক্যাম্পেইনে ফিরে যান
                    </Link>
                    <span className="inline-flex items-center gap-2 text-[#08786d]">
                        <TbShieldCheck size={17} /> সুরক্ষিত অনুদান
                    </span>
                </div>
                <header className="grid min-w-0 gap-6 border-b border-[#dce6e3] py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:items-center md:gap-8 lg:gap-12 lg:py-10">
                    <div className="relative order-2 mt-0 min-h-[240px] overflow-hidden bg-[#dce9e5] sm:min-h-[320px] md:order-1 md:min-h-[360px] lg:min-h-[400px]">
                        {campaign.image ? (
                            <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center text-[#08786d]">
                                <TbHeartFilled size={52} />
                            </div>
                        )}
                        <span className="absolute bottom-0 left-0 bg-[#f5f7f6] px-4 py-3 text-xs text-[#08786d]">
                            মানুষের পাশে দাঁড়ানোর উদ্যোগ
                        </span>
                    </div>
                    <div className="order-1 flex min-w-0 flex-col justify-center md:order-2">
                        <span className="mb-5 inline-flex w-fit items-center gap-2 border-l-[3px] border-[#e9a34a] pl-3 text-xs font-semibold text-[#08786d]">
                            অনুদান কার্যক্রম {category ? `• ${category}` : ''}
                        </span>
                        <h1 className="max-w-[600px] text-[clamp(1.75rem,3.15vw,3.1rem)] font-semibold leading-[1.4] tracking-tight">
                            {campaign.title}
                        </h1>
                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
                            {campaign.shortDescription ||
                                'আপনার সহায়তা প্রয়োজনের সময় মানুষের পাশে দাঁড়াতে সাহায্য করবে।'}
                        </p>
                        <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#dce6e3] pt-6 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-slate-500">
                                    সংগৃহীত
                                </p>
                                <strong className="mt-1 block break-words text-base sm:text-lg lg:text-xl">
                                    ৳{bn(raised)}
                                </strong>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    লক্ষ্যমাত্রা
                                </p>
                                <strong className="mt-1 block break-words text-base sm:text-lg lg:text-xl">
                                    ৳{bn(target)}
                                </strong>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">
                                    অগ্রগতি
                                </p>
                                <strong className="mt-1 block break-words text-base sm:text-lg lg:text-xl">
                                    {bn(Math.round(progress))}%
                                </strong>
                            </div>
                        </div>
                        <div className="mt-5 h-1.5 bg-[#dce6e3]">
                            <div
                                className="h-full bg-[#08786d]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </header>
                <div className="grid min-w-0 gap-7 py-9 md:grid-cols-[minmax(0,190px)_minmax(0,1fr)] md:gap-7 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-10 lg:py-14">
                    <aside className="md:sticky md:top-24 md:self-start">
                        <p className="text-xs font-semibold tracking-wide text-[#08786d]">
                            অনুদান সম্পন্ন করুন
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
                            আপনার সহায়তা,
                            <br />
                            কারও নতুন সম্ভাবনা।
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-slate-500">
                            তিনটি সহজ ধাপে অনুদানের তথ্য পূরণ করুন।
                        </p>
                        <div className="mt-7 hidden space-y-5 border-l border-[#cbd9d6] pl-4 text-xs md:block lg:text-sm">
                            <p className="font-semibold text-[#08786d]">
                                ০১ — অনুদানের পরিমাণ
                            </p>
                            <p className="text-slate-500">
                                ০২ — যোগাযোগের তথ্য
                            </p>
                            <p className="text-slate-500">০৩ — পেমেন্ট</p>
                        </div>
                    </aside>
                    <form
                        onSubmit={handleDonate}
                        className="min-w-0 overflow-hidden bg-white shadow-[0_12px_45px_rgba(19,54,50,0.045)]"
                    >
                        <section className="border-b border-[#e5eeeb] px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-light text-[#9bbdb5]">
                                    ০১
                                </span>
                                <h3 className="text-xl font-semibold sm:text-2xl">
                                    অনুদানের পরিমাণ
                                </h3>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">
                                যে পরিমাণ সহায়তা করতে চান, সেটি নির্বাচন করুন।
                            </p>
                            <div className="mt-7 grid grid-cols-2 gap-2 min-[560px]:grid-cols-4 sm:gap-3">
                                {presets.map((val) => (
                                    <button
                                        type="button"
                                        key={val}
                                        aria-pressed={Number(amount) === val}
                                        onClick={() => {
                                            setAmount(val);
                                            setError(null);
                                        }}
                                        className={`min-h-[70px] min-w-0 border px-2 py-3 text-center text-base sm:text-lg font-semibold transition ${Number(amount) === val ? 'border-[#08786d] bg-[#e6f3ef] text-[#086f65]' : 'border-[#dce6e3] bg-white hover:border-[#08786d]'}`}
                                    >
                                        ৳{bn(val)}
                                        {Number(amount) === val && (
                                            <span className="mt-1 block text-[10px] font-normal">
                                                নির্বাচিত
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <label
                                htmlFor="donation-amount"
                                className="mt-7 block text-xs font-semibold text-slate-600"
                            >
                                নিজের পরিমাণ লিখুন
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl text-[#08786d]">
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
                                    className={inputStyle + ' text-xl'}
                                    placeholder="অনুদানের পরিমাণ"
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                                সর্বনিম্ন অনুদান ৳১০
                            </p>
                        </section>
                        <section className="border-b border-[#e5eeeb] px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-light text-[#9bbdb5]">
                                    ০২
                                </span>
                                <h3 className="text-xl font-semibold sm:text-2xl">
                                    আপনার পরিচয়
                                </h3>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">
                                {isLoggedIn
                                    ? 'অ্যাকাউন্টের তথ্য পূরণ করা হয়েছে।'
                                    : 'অনুদানের জন্য প্রয়োজনীয় যোগাযোগের তথ্য দিন।'}
                            </p>
                            <div className="mt-7 grid min-w-0 gap-x-5 gap-y-6 lg:grid-cols-2">
                                <div className="lg:col-span-2">
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
                                        className={inputStyle}
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
                                        className={inputStyle}
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
                                        className={inputStyle}
                                        placeholder="০১XXXXXXXXX"
                                    />
                                </div>
                            </div>
                        </section>
                        <section className="px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-light text-[#9bbdb5]">
                                    ০৩
                                </span>
                                <h3 className="text-xl font-semibold sm:text-2xl">
                                    পেমেন্টের মাধ্যম
                                </h3>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">
                                নিরাপদ পেমেন্ট গেটওয়েতে আপনার পছন্দের মাধ্যম
                                নির্বাচন করতে পারবেন।
                            </p>
                            <div className="mt-6 grid gap-3 min-[560px]:grid-cols-2">
                                <label className="flex min-w-0 min-h-[64px] cursor-pointer items-center gap-3 border border-[#dce6e3] px-4 text-sm">
                                    <input
                                        type="radio"
                                        name="pay"
                                        defaultChecked
                                        className="accent-[#08786d]"
                                    />
                                    <TbCreditCard
                                        size={21}
                                        className="text-[#08786d]"
                                    />{' '}
                                    কার্ডের মাধ্যমে
                                </label>
                                <label className="flex min-w-0 min-h-[64px] cursor-pointer items-center gap-3 border border-[#dce6e3] px-4 text-sm">
                                    <input
                                        type="radio"
                                        name="pay"
                                        className="accent-[#08786d]"
                                    />
                                    <TbWallet
                                        size={21}
                                        className="text-[#08786d]"
                                    />{' '}
                                    মোবাইল ব্যাংকিং
                                </label>
                            </div>
                        </section>
                        <div className="bg-[#123f39] px-5 py-7 text-white sm:px-9">
                            <div className="flex min-w-0 flex-wrap items-end justify-between gap-5">
                                <div>
                                    <p className="text-xs text-white/60">
                                        আপনার মোট অনুদান
                                    </p>
                                    <p className="mt-1 break-words text-3xl font-semibold sm:text-4xl">
                                        ৳{bn(amount)}
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 bg-[#e9a34a] px-6 text-sm font-semibold text-[#123f39] transition hover:bg-[#f4b85f] disabled:opacity-60 min-[560px]:w-auto"
                                >
                                    <TbHeartFilled size={17} />
                                    {submitting
                                        ? 'পেমেন্ট শুরু হচ্ছে…'
                                        : 'অনুদান নিশ্চিত করুন'}{' '}
                                    <span aria-hidden="true">→</span>
                                </button>
                            </div>
                            <p className="mt-5 flex items-center gap-2 text-xs text-white/65">
                                <TbShieldCheck size={16} /> সুরক্ষিত পেমেন্ট
                                প্রক্রিয়া
                            </p>
                            {error && (
                                <p
                                    role="alert"
                                    className="mt-4 border-l-2 border-[#e9a34a] bg-white/10 px-3 py-3 text-sm"
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
