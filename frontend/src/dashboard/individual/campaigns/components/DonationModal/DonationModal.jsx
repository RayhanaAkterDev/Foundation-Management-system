// DonationModal.jsx

import React, { useState } from 'react';

import {
    ArrowRight,
    CalendarDays,
    Check,
    CircleAlert,
    HeartHandshake,
    ImageOff,
    Loader2,
    LockKeyhole,
    ShieldCheck,
    X,
} from 'lucide-react';

import { initiateDonation } from '@/dashboard/individual/myDonations/api/donationApi';

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

const formatCurrency = (value) =>
    `৳${Number(value || 0).toLocaleString('en-BD')}`;

const formatDate = (value) => {
    if (!value) return 'No deadline';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'No deadline';

    return date.toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const getStoredUser = () => {
    try {
        const storedUser =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
};

const getErrorMessage = (error) => {
    if (!error) {
        return 'Unable to start the payment process. Please try again.';
    }

    if (typeof error === 'string') return error;

    if (error.message) return error.message;

    if (error.errors && typeof error.errors === 'object') {
        const messages = Object.values(error.errors).flat().filter(Boolean);

        if (messages.length) return messages.join(' ');
    }

    if (error.data?.message) return error.data.message;

    if (error.data?.errors && typeof error.data.errors === 'object') {
        const messages = Object.values(error.data.errors)
            .flat()
            .filter(Boolean);

        if (messages.length) return messages.join(' ');
    }

    return 'Unable to start the payment process. Please try again.';
};

const DonationModal = ({ campaign, onClose }) => {
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const goal = Math.max(Number(campaign?.target_amount) || 0, 0);
    const raised = Math.max(Number(campaign?.collected_amount) || 0, 0);

    const remaining = Math.max(goal - raised, 0);

    const percentage =
        goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

    const image =
        campaign?.cover_photo ||
        campaign?.cover_image ||
        campaign?.banner ||
        campaign?.image ||
        campaign?.photo ||
        null;

    const category =
        typeof campaign?.category === 'string'
            ? campaign.category
            : campaign?.category?.name;

    const numericAmount = Number(amount);

    const hasValidAmount =
        amount.trim() !== '' &&
        Number.isFinite(numericAmount) &&
        numericAmount >= 10;

    const handleAmountChange = (value) => {
        setAmount(value);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const donationAmount = Number(amount);

        if (!Number.isFinite(donationAmount)) {
            setError('Please enter a valid donation amount.');
            return;
        }

        if (donationAmount < 10) {
            setError('Please enter a donation amount of at least ৳10.');
            return;
        }

        if (!campaign?.id) {
            setError('Campaign information is missing. Please try again.');
            return;
        }

        const user = getStoredUser();

        const donorPhone = user?.phone || '';
        const donorName = user?.name || '';
        const donorEmail = user?.email || '';

        if (!donorPhone) {
            setError(
                'Your account does not have a valid phone number. Please update your phone number before making a donation.',
            );
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const response = await initiateDonation({
                campaignId: campaign.id,
                amount: donationAmount,
                donorName,
                donorEmail,
                donorPhone,
            });

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

    return (
        <div
            className="fixed inset-0 z-150 flex items-center justify-center overflow-y-auto bg-[#05080D]/85 p-3 backdrop-blur-[5px] sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="donation-modal-title"
                className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[900px] flex-col overflow-hidden rounded-[10px] border border-[#343E4B] bg-[#151C25] shadow-[0_32px_100px_rgba(0,0,0,0.55)] sm:max-h-[calc(100dvh-3rem)]"
            >
                {/* TOP BAR */}
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#303A47] bg-[#10161F] px-5 py-4 sm:px-7">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#293C42]">
                            <HeartHandshake
                                size={18}
                                strokeWidth={1.7}
                                className="text-[#A7CEC6]"
                            />
                        </div>

                        <div>
                            <h2
                                id="donation-modal-title"
                                className="font-sans! text-[17px] font-semibold! text-[#EEF1F5]!"
                            >
                                Make a donation
                            </h2>

                            <p className="font-sans! text-[11px] text-[#94A2B2]!">
                                Support this humanitarian campaign
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Close donation modal"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] text-[#94A2B2] transition-colors hover:bg-[#26313E] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={19} strokeWidth={1.8} />
                    </button>
                </header>

                {/* TWO-COLUMN CONTENT */}
                <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    {/* LEFT: CAMPAIGN */}
                    <aside className="min-w-0 border-b border-[#303A47] bg-[#10161F] md:border-r md:border-b-0">
                        <div className="relative h-[180px] overflow-hidden bg-[#263341] sm:h-[220px] md:h-[235px]">
                            {image ? (
                                <img
                                    src={image}
                                    alt={campaign?.title || 'Campaign cover'}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <ImageOff
                                        size={32}
                                        strokeWidth={1.4}
                                        className="text-[#8191A2]"
                                    />
                                </div>
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#10161F]/80 via-transparent to-transparent" />

                            {category && (
                                <span className="absolute bottom-4 left-5 max-w-[85%] truncate rounded-[4px] bg-[#10161F]/85 px-2.5 py-1.5 font-sans! text-[10px] font-semibold! uppercase tracking-[0.08em] text-[#D6E6E1]! backdrop-blur-sm">
                                    {category}
                                </span>
                            )}
                        </div>

                        <div className="px-5 py-5 sm:px-6 sm:py-6">
                            <h3 className="font-sans! text-[18px] font-semibold! leading-[1.5] tracking-[-0.02em] text-[#EEF1F5]!">
                                {campaign?.title || 'Untitled campaign'}
                            </h3>

                            <div className="mt-5 flex items-end justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-sans! text-[11px] text-[#94A2B2]!">
                                        Raised so far
                                    </p>

                                    <p className="mt-1 font-sans! text-[23px] font-semibold! tracking-tight text-[#EEF1F5]!">
                                        {formatCurrency(raised)}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="font-sans! text-[11px] text-[#94A2B2]!">
                                        Funding goal
                                    </p>

                                    <p className="mt-1 font-sans! text-[14px] font-semibold! text-[#C8D2DC]!">
                                        {formatCurrency(goal)}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#303A47]"
                                role="progressbar"
                                aria-label="Campaign funding progress"
                                aria-valuenow={percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="h-full rounded-full bg-[#85BBAE]"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                                <span className="font-sans! text-[11px] font-semibold! text-[#A9C8BE]!">
                                    {percentage}% funded
                                </span>

                                <span className="font-sans! text-[10px] text-[#8795A5]!">
                                    {goal <= 0
                                        ? 'No funding target'
                                        : remaining > 0
                                          ? `${formatCurrency(remaining)} remaining`
                                          : 'Goal achieved'}
                                </span>
                            </div>

                            <div className="mt-5 flex items-center gap-2 border-t border-[#303A47] pt-4">
                                <CalendarDays
                                    size={14}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#8795A5]"
                                />

                                <span className="font-sans! text-[11px] text-[#AAB7C6]!">
                                    {campaign?.end_date
                                        ? `Ends ${formatDate(campaign.end_date)}`
                                        : 'No campaign deadline'}
                                </span>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT: DONATION FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex min-w-0 flex-col"
                    >
                        <div className="flex-1 px-5 py-6 sm:px-7 sm:py-7">
                            <h3 className="font-sans! text-[21px] font-semibold! tracking-[-0.025em] text-[#EEF1F5]!">
                                Your contribution
                            </h3>

                            <p className="mt-1.5 font-sans! text-[12px] leading-[1.7] text-[#94A2B2]!">
                                Choose an amount that works for you.
                            </p>

                            {/* AMOUNT INPUT */}
                            <div className="mt-7">
                                <label
                                    htmlFor="donation-amount"
                                    className="font-sans! text-[12px] font-medium! text-[#C8D2DC]!"
                                >
                                    Donation amount (BDT)
                                </label>

                                <div
                                    className={[
                                        'mt-2.5 flex h-[78px] items-center rounded-[7px] border bg-[#10161F] px-5',
                                        error
                                            ? 'border-[#A75D68]'
                                            : 'border-[#3A4655]',
                                    ].join(' ')}
                                >
                                    <span className="mr-3 font-sans! text-[28px] font-medium! text-[#A9BAC8]!">
                                        ৳
                                    </span>

                                    <input
                                        id="donation-amount"
                                        type="number"
                                        min="10"
                                        step="1"
                                        value={amount}
                                        onChange={(event) =>
                                            handleAmountChange(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0"
                                        disabled={submitting}
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={
                                            error ? 'donation-error' : undefined
                                        }
                                        className="h-full min-w-0 flex-1 appearance-none bg-transparent font-sans! text-[31px] font-semibold! text-[#EEF1F5]! outline-none! ring-0! shadow-none! focus:outline-none! focus:ring-0! focus:shadow-none! placeholder:text-[#596879]! disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                </div>

                                <p className="mt-2 font-sans! text-[10px] text-[#8795A5]!">
                                    Minimum donation ৳10
                                </p>
                            </div>

                            {/* QUICK AMOUNTS */}
                            <div className="mt-6">
                                <p className="mb-3 font-sans! text-[12px] font-medium! text-[#C8D2DC]!">
                                    Or select an amount
                                </p>

                                <div className="grid grid-cols-2 gap-2.5">
                                    {QUICK_AMOUNTS.map((value) => {
                                        const selected =
                                            amount !== '' &&
                                            Number(amount) === value;

                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    handleAmountChange(
                                                        String(value),
                                                    )
                                                }
                                                disabled={submitting}
                                                aria-pressed={selected}
                                                className={[
                                                    'flex h-[47px] items-center justify-center gap-2 rounded-[6px] border font-sans! text-[13px] font-semibold! transition-colors',
                                                    selected
                                                        ? 'border-[#A2C7B9] bg-[#293F3D] text-[#D5F0E7]!'
                                                        : 'border-[#35404D] bg-[#1B2530] text-[#CBD5DF]! hover:border-[#708698] hover:bg-[#25313E]',
                                                    'disabled:cursor-not-allowed disabled:opacity-50',
                                                ].join(' ')}
                                            >
                                                {selected && (
                                                    <Check
                                                        size={14}
                                                        strokeWidth={2}
                                                    />
                                                )}
                                                {formatCurrency(value)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {error && (
                                <div
                                    id="donation-error"
                                    role="alert"
                                    className="mt-5 flex items-start gap-2.5 rounded-[6px] border border-[#71434B] bg-[#38272C] px-3.5 py-3"
                                >
                                    <CircleAlert
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#FCA5A5]"
                                    />

                                    <p className="font-sans! text-[11px] leading-[1.6] text-[#FCA5A5]!">
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PAYMENT ACTION */}
                        <div className="border-t border-[#303A47] px-5 py-5 sm:px-7">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <span className="font-sans! text-[12px] text-[#94A2B2]!">
                                    Donation total
                                </span>

                                <span className="font-sans! text-[23px] font-semibold! text-[#EEF1F5]!">
                                    {hasValidAmount
                                        ? formatCurrency(numericAmount)
                                        : '৳0'}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="group flex min-h-[50px] w-full items-center justify-between gap-3 rounded-[6px] bg-[#D5E1E8] px-4 py-3 font-sans! text-[12px] font-semibold! text-[#17232F]! transition-colors hover:bg-[#F0F5F8] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <span className="flex w-full items-center justify-center gap-2">
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Connecting to payment...
                                    </span>
                                ) : (
                                    <>
                                        <span className="flex items-center gap-2">
                                            <LockKeyhole size={15} />
                                            Continue to payment
                                        </span>

                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>

                            <div className="mt-3 flex items-center justify-center gap-2">
                                <ShieldCheck
                                    size={14}
                                    className="text-[#91B6AA]"
                                />

                                <span className="font-sans! text-[10px] text-[#94A2B2]!">
                                    Secure payment through SSLCOMMERZ
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default DonationModal;
