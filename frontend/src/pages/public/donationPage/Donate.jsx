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

const getErrorMessage = (error) => {
    if (!error) {
        return 'Unable to start the payment process. Please try again.';
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

    return 'Unable to start the payment process. Please try again.';
};

const Donate = () => {
    const { id } = useParams();

    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    const isLoggedIn = Boolean(storedToken && storedUser);

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [amount, setAmount] = useState(1000);

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

    const [submitting, setSubmitting] = useState(false);

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
                    setError('Unable to load this campaign right now.');
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

    const handleDonorChange = (field, value) => {
        setDonor((current) => ({
            ...current,
            [field]: value,
        }));

        setError(null);
    };

    const handleDonate = async (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 10) {
            setError('Please enter a donation amount of at least ৳10.');
            return;
        }

        if (!campaign?.id) {
            setError('Campaign information is missing. Please try again.');
            return;
        }

        const donorName = donor.name.trim();
        const donorEmail = donor.email.trim();
        const donorPhone = donor.phone.trim();

        if (!donorName) {
            setError('Please enter your full name.');
            return;
        }

        if (!donorEmail) {
            setError('Please enter your email address.');
            return;
        }

        if (!donorPhone) {
            setError('Please enter your phone number.');
            return;
        }

        if (!/^01\d{9}$/.test(donorPhone)) {
            setError(
                'Please enter a valid Bangladeshi phone number, for example 01XXXXXXXXX.',
            );
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            console.log('Starting donation:', {
                campaignId: campaign.id,
                amount: numericAmount,
                donorName,
                donorEmail,
                donorPhone,
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
                throw new Error('The server returned an empty response.');
            }

            if (!response.payment_url) {
                throw new Error(
                    response.message ||
                        response.error ||
                        'Payment URL was not returned by the server.',
                );
            }

            window.location.href = response.payment_url;
        } catch (err) {
            console.error('Donation initiation failed:', err);

            setError(getErrorMessage(err));
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-text-secondary">Loading donation page...</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Campaign not found
                    </h2>

                    <p className="mt-2 text-sm text-text-secondary">
                        {error ||
                            'The campaign you are looking for does not exist or may have been removed.'}
                    </p>

                    <Link
                        to="/campaigns"
                        className="text-primary mt-4 inline-block"
                    >
                        Back to campaigns
                    </Link>
                </div>
            </div>
        );
    }

    const presets = [500, 1000, 2000, 5000];

    return (
        <div className="min-h-screen bg-background py-10 mt-20">
            <div className="container-width max-w-5xl">
                <Link
                    to={`/campaign/${campaign.id}`}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-text-secondary
                        hover:text-primary
                        mb-6
                        transition
                    "
                >
                    <TbArrowLeft />
                    Back to campaign
                </Link>

                <form
                    onSubmit={handleDonate}
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-8
                        lg:gap-10
                    "
                >
                    {/* LEFT COLUMN */}
                    <div className="space-y-6 order-2 lg:order-1">
                        {/* Campaign Introduction */}
                        <div>
                            <Badge variant="primary" tone="soft">
                                {campaign.category?.name ||
                                    campaign.category ||
                                    'Campaign'}
                            </Badge>

                            <h1 className="text-3xl font-bold mt-3 text-text-primary leading-tight">
                                Donate to {campaign.title}
                            </h1>

                            <p className="text-text-secondary mt-2 leading-relaxed">
                                Your contribution helps provide immediate
                                support to people in urgent need.
                            </p>

                            {campaign.supporters !== undefined && (
                                <div className="mt-3 text-sm text-text-secondary">
                                    <p className="font-medium">
                                        {campaign.supporters} people supported
                                        this campaign
                                    </p>

                                    <p>
                                        Most donations are around{' '}
                                        <span className="text-primary font-medium">
                                            ৳1000–2000
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Donor Information */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-text-primary">
                                        Donor Information
                                    </h3>

                                    <p className="text-xs text-text-secondary mt-1">
                                        {isLoggedIn
                                            ? 'Your account information has been filled in automatically.'
                                            : 'Enter your information to continue with the donation.'}
                                    </p>
                                </div>

                                {isLoggedIn && (
                                    <span className="shrink-0 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                                        Logged in
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 space-y-4">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="donor-name"
                                        className="
                                            block
                                            text-sm
                                            font-medium
                                            text-text-primary
                                            mb-1.5
                                        "
                                    >
                                        Full Name
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
                                        placeholder="Enter your full name"
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
                                            block
                                            text-sm
                                            font-medium
                                            text-text-primary
                                            mb-1.5
                                        "
                                    >
                                        Email Address
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
                                            block
                                            text-sm
                                            font-medium
                                            text-text-primary
                                            mb-1.5
                                        "
                                    >
                                        Phone Number
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

                                    <p className="mt-1.5 text-[11px] text-text-secondary">
                                        A valid Bangladeshi phone number is
                                        required for payment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Choose Amount */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <h3 className="font-semibold mb-2 text-text-primary">
                                Choose Amount
                            </h3>

                            <p className="text-xs text-text-secondary mb-4">
                                Suggested based on recent donations
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {presets.map((val) => {
                                    const isSuggested = val === 1000;

                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setAmount(val)}
                                            className={`
                                                relative
                                                py-3
                                                rounded-xl
                                                border
                                                text-sm
                                                font-medium
                                                transition-all
                                                ${
                                                    amount === val
                                                        ? 'bg-primary text-white border-primary shadow-sm'
                                                        : isSuggested
                                                          ? 'bg-primary/5 border-primary text-primary'
                                                          : 'bg-surface-soft border-border hover:border-primary/40'
                                                }
                                            `}
                                        >
                                            ৳{val}
                                            {isSuggested && (
                                                <span className="absolute -top-2 right-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">
                                                    Popular
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
                                    p-3
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface-soft
                                    outline-none
                                    focus:border-primary
                                    transition
                                "
                                placeholder="Custom amount"
                            />

                            <div className="mt-4 text-sm text-text-secondary">
                                <span className="text-primary font-medium">
                                    ৳{Number(amount || 0).toLocaleString()}
                                </span>{' '}
                                can help provide essential support to affected
                                families
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-text-primary">
                                <TbCreditCard />
                                Payment Method
                            </h3>

                            <label className="flex items-center gap-3 border border-border rounded-xl p-3 hover:border-primary/40 transition cursor-pointer">
                                <input type="radio" name="pay" defaultChecked />

                                <TbCreditCard className="text-primary" />

                                <span className="text-sm text-text-primary">
                                    Credit / Debit Card
                                </span>
                            </label>

                            <label className="flex items-center gap-3 border border-border rounded-xl p-3 hover:border-primary/40 transition cursor-pointer">
                                <input type="radio" name="pay" />

                                <TbWallet className="text-accent" />

                                <span className="text-sm text-text-primary">
                                    Mobile Banking (bKash / Nagad)
                                </span>
                            </label>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Donate Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                w-full
                                text-lg
                                py-3
                                rounded-xl
                                bg-primary
                                text-white
                                flex
                                items-center
                                justify-center
                                gap-2
                                hover:bg-primary-dark
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            <TbHeartFilled />

                            {submitting
                                ? 'Starting payment...'
                                : `Donate ৳${Number(
                                      amount || 0,
                                  ).toLocaleString()}`}
                        </button>

                        <p className="text-xs text-text-secondary flex items-center gap-2">
                            <TbShieldCheck className="text-primary" />
                            Secure donation • No hidden fees • Instant
                            confirmation
                        </p>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6 order-1 lg:order-2">
                        {/* Campaign Summary */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <h3 className="font-semibold mb-4 text-text-primary">
                                Campaign Summary
                            </h3>

                            {campaign.image && (
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="w-full h-52 object-cover rounded-xl"
                                />
                            )}

                            {campaign.shortDescription && (
                                <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                                    {campaign.shortDescription}
                                </p>
                            )}

                            <div className="mt-5 text-sm space-y-2">
                                {campaign.raised !== undefined && (
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Raised</span>

                                        <span className="text-text-primary font-medium">
                                            ৳
                                            {Number(
                                                campaign.raised,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {campaign.targetAmount !== undefined && (
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Goal</span>

                                        <span className="text-text-primary font-medium">
                                            ৳
                                            {Number(
                                                campaign.targetAmount,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {campaign.supporters !== undefined && (
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Supporters</span>

                                        <span className="text-text-primary font-medium">
                                            {campaign.supporters}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Impact */}
                        <div className="bg-primary/5 rounded-2xl p-5 sm:p-6 border border-primary/10">
                            <h3 className="font-semibold flex items-center gap-2 text-primary">
                                <TbUser />
                                Your Impact
                            </h3>

                            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                                Even a small donation helps provide food,
                                medicine, and emergency relief to affected
                                families.
                            </p>

                            <div className="mt-4 text-sm font-medium text-primary">
                                Every contribution matters ❤️
                            </div>
                        </div>

                        {/* Transparency */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <h3 className="font-semibold flex items-center gap-2 text-text-primary">
                                <TbWallet />
                                Transparency
                            </h3>

                            <ul className="text-sm text-text-secondary mt-3 space-y-2">
                                <li>• 100% verified campaigns</li>
                                <li>• Real-time updates</li>
                                <li>• Public fund tracking</li>
                                <li>• NGO verification system</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Donate;
