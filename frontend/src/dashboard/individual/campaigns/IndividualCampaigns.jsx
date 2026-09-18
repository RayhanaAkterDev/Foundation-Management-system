import React, { useEffect, useState } from 'react';

import {
    ArrowRight,
    CheckCircle2,
    HandCoins,
    Loader2,
    Megaphone,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { apiRequest } from '@/api/client';
import { initiateDonation } from '@/dashboard/individual/myDonations/api/donationApi';

const formatCurrency = (amount) => {
    return `৳${Number(amount || 0).toLocaleString('en-BD')}`;
};

const formatDate = (date) => {
    if (!date) return 'No deadline';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/* -------------------------------------------------------------------------- */
/* Donation Modal                                                             */
/* -------------------------------------------------------------------------- */

const DonationModal = ({ campaign, onClose }) => {
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const targetAmount = Number(campaign?.target_amount || 0);
    const collectedAmount = Number(campaign?.collected_amount || 0);

    const remainingAmount = Math.max(targetAmount - collectedAmount, 0);

    const quickAmounts = [100, 500, 1000, 5000];

    const handleSubmit = async (event) => {
        event.preventDefault();

        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount < 10) {
            setError('Please enter a donation amount of at least ৳10.');
            return;
        }

        if (!Number.isFinite(numericAmount)) {
            setError('Please enter a valid donation amount.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const response = await initiateDonation({
                campaignId: campaign.id,
                amount: numericAmount,
            });

            console.log('Donation initiation response:', response);

            if (!response?.payment_url) {
                console.error(
                    'Donation initiation returned no payment_url:',
                    response,
                );

                throw new Error(
                    response?.message ||
                        'Payment URL was not returned by the server.',
                );
            }

            window.location.href = response.payment_url;
        } catch (err) {
            console.error('Donation initiation failed:', err);

            setError(
                err?.message ||
                    'Unable to start the payment process. Please try again.',
            );

            setSubmitting(false);
        }
    };
    const handleQuickAmount = (value) => {
        setAmount(String(value));
        setError('');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) {
                    onClose();
                }
            }}
        >
            <div className="relative max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-7">
                    <div className="pr-6">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                            <HandCoins className="h-4 w-4" />
                            Make a donation
                        </div>

                        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                            Support this campaign
                        </h2>

                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                            Your contribution will help support this
                            humanitarian campaign.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close donation modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 px-6 py-6 sm:px-7">
                        {/* Campaign */}
                        <div className="border-b border-slate-200 pb-5">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                Campaign
                            </p>

                            <h3 className="text-base font-semibold leading-6 text-slate-900">
                                {campaign.title}
                            </h3>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                                <span>
                                    Raised{' '}
                                    <strong className="font-semibold text-slate-700">
                                        {formatCurrency(collectedAmount)}
                                    </strong>
                                </span>

                                {remainingAmount > 0 && (
                                    <span>
                                        Remaining{' '}
                                        <strong className="font-semibold text-slate-700">
                                            {formatCurrency(remainingAmount)}
                                        </strong>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label
                                htmlFor="donation-amount"
                                className="mb-2.5 block text-sm font-semibold text-slate-800"
                            >
                                Donation amount
                            </label>

                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                                    ৳
                                </span>

                                <input
                                    id="donation-amount"
                                    type="number"
                                    min="10"
                                    step="1"
                                    value={amount}
                                    onChange={(event) => {
                                        setAmount(event.target.value);
                                        setError('');
                                    }}
                                    placeholder="Enter amount"
                                    disabled={submitting}
                                    autoFocus
                                    className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Minimum donation amount is ৳10.
                            </p>

                            {/* Quick amounts */}
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {quickAmounts.map((value) => {
                                    const selected = Number(amount) === value;

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                handleQuickAmount(value)
                                            }
                                            disabled={submitting}
                                            className={[
                                                'h-10 rounded-lg border text-sm font-semibold transition',
                                                selected
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
                                                'disabled:cursor-not-allowed disabled:opacity-50',
                                            ].join(' ')}
                                        >
                                            ৳{value.toLocaleString('en-BD')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                                <div className="mt-0.5 shrink-0">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">
                                        <X className="h-3.5 w-3.5" />
                                    </div>
                                </div>

                                <p className="text-sm leading-5 text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Account information */}
                        <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Donation from your account
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Your account name and email will be used
                                    automatically for this donation.
                                </p>
                            </div>
                        </div>

                        {/* Payment notice */}
                        <div className="flex gap-3 rounded-xl bg-primary/5 px-4 py-4">
                            <HandCoins className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                            <p className="text-xs leading-5 text-slate-600">
                                After continuing, you will be redirected to the
                                secure SSLCOMMERZ payment page to complete your
                                donation.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Connecting to Payment...
                                </>
                            ) : (
                                <>
                                    Continue to Payment
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* Campaign Card                                                              */
/* -------------------------------------------------------------------------- */

const CampaignCard = ({ campaign, onDonate }) => {
    const targetAmount = Number(campaign.target_amount || 0);
    const collectedAmount = Number(campaign.collected_amount || 0);

    const progress =
        targetAmount > 0
            ? Math.min(Math.round((collectedAmount / targetAmount) * 100), 100)
            : 0;

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50">
            <div className="p-6 sm:p-7">
                {/* Top */}
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Megaphone className="h-4 w-4" />
                            </span>

                            {campaign.category && (
                                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                                    {campaign.category}
                                </span>
                            )}
                        </div>

                        <h2 className="text-lg font-semibold leading-7 text-slate-900">
                            {campaign.title}
                        </h2>

                        {campaign.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                {campaign.description}
                            </p>
                        )}
                    </div>

                    <StatusBadge status={campaign.status} />
                </div>

                {/* Progress */}
                <div className="mt-6">
                    <div className="mb-2.5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
                                Raised
                            </p>

                            <p className="mt-0.5 text-lg font-semibold text-slate-900">
                                {formatCurrency(collectedAmount)}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">
                                Goal
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                                {formatCurrency(targetAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{progress}% funded</span>

                        <span>
                            {campaign.end_date
                                ? `Ends ${formatDate(campaign.end_date)}`
                                : 'No deadline'}
                        </span>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="text-sm text-slate-500">
                        Every contribution helps.
                    </div>

                    <button
                        type="button"
                        onClick={() => onDonate(campaign)}
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                    >
                        Donate
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
};

/* -------------------------------------------------------------------------- */
/* Individual Campaigns                                                       */
/* -------------------------------------------------------------------------- */

const IndividualCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await apiRequest('/campaigns');

                const data = Array.isArray(response?.campaigns)
                    ? response.campaigns
                    : [];

                setCampaigns(data);
            } catch (err) {
                setError(
                    err?.message ||
                        'Unable to load campaigns. Please try again.',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <>
            <div className="min-h-full bg-[#f6f8fb]">
                <PageHeader
                    title="Campaigns"
                    description="Support humanitarian campaigns and help communities in need."
                />

                <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex min-h-[320px] items-center justify-center">
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                Loading campaigns...
                            </div>
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <EmptyState
                            icon={Megaphone}
                            title="No campaigns available"
                            description="There are currently no active campaigns available for donation."
                        />
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {campaigns.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    onDonate={setSelectedCampaign}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedCampaign && (
                <DonationModal
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}
        </>
    );
};

export default IndividualCampaigns;
