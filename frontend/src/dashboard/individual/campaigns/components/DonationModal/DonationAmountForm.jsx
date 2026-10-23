import React from 'react';

import { ArrowRight, Loader2 } from 'lucide-react';

const DonationAmountForm = ({
    amount,
    setAmount,
    onSubmit,
    submitting,
    error,
}) => {
    const quickAmounts = [100, 500, 1000, 5000];

    const handleQuickAmount = (value) => {
        setAmount(String(value));
    };

    return (
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 px-6 py-7 sm:px-7">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5EEAD4]">
                        Contribution
                    </p>

                    <h2 className="mt-1.5 text-[22px] font-semibold tracking-tight text-[#EEF1F5]">
                        Choose your donation amount
                    </h2>

                    <p className="mt-1.5 text-sm leading-5 text-[#8792A1]">
                        Enter the amount you would like to contribute to this
                        campaign.
                    </p>
                </div>

                <div className="mt-7">
                    <label
                        htmlFor="donation-amount"
                        className="text-xs font-semibold text-[#B8C2CF]"
                    >
                        Donation amount
                    </label>

                    <div
                        className={[
                            'mt-2 flex h-20 items-center rounded-xl border-2 bg-[#0A0E14] px-5 transition',
                            error
                                ? 'border-[#B45A65] focus-within:border-[#C76A74]'
                                : 'border-[#252D38] focus-within:border-[#0F766E]',
                        ].join(' ')}
                    >
                        <span className="font-display text-3xl font-semibold text-[#5EEAD4]">
                            ৳
                        </span>

                        <input
                            id="donation-amount"
                            type="number"
                            min="10"
                            step="1"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="0"
                            disabled={submitting}
                            autoFocus
                            className="ml-3 h-full min-w-0 flex-1 bg-transparent font-display text-3xl font-semibold text-[#EEF1F5] outline-none placeholder:text-[#5E6978] disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-[#8792A1]">
                            Minimum donation: ৳10
                        </span>

                        {amount && Number(amount) >= 10 && (
                            <span className="text-[11px] font-semibold text-[#5EEAD4]">
                                ৳{Number(amount).toLocaleString('en-BD')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-xs font-semibold text-[#B8C2CF]">
                        Or choose an amount
                    </p>

                    <div className="mt-2.5 grid grid-cols-4 gap-2">
                        {quickAmounts.map((value) => {
                            const selected = Number(amount) === value;

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleQuickAmount(value)}
                                    disabled={submitting}
                                    className={[
                                        'h-10 rounded-lg border text-sm font-semibold transition',
                                        selected
                                            ? 'border-[#0F766E] bg-[#0F766E] text-white!'
                                            : 'border-[#252D38] bg-[#0E1219] text-[#AAB3BF] hover:border-[#0F766E]/40 hover:bg-[#0F766E]/10 hover:text-[#5EEAD4]',
                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                    ].join(' ')}
                                >
                                    ৳{value.toLocaleString('en-BD')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && (
                    <div className="mt-5 rounded-lg border border-[#71434B] bg-[#38272C] px-4 py-3">
                        <p className="text-xs font-medium! leading-5 text-[#FCA5A5]">
                            {error}
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t border-[#252D38] px-6 py-5 sm:px-7">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] text-sm font-semibold text-white! shadow-sm transition hover:bg-[#0F766E]-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting to payment...
                        </>
                    ) : (
                        <>
                            Continue to secure payment
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </button>

                <p className="mt-2.5 text-center text-[10px] leading-4 text-[#8792A1]">
                    You will be redirected to SSLCOMMERZ to complete your
                    donation.
                </p>
            </div>
        </form>
    );
};

export default DonationAmountForm;
