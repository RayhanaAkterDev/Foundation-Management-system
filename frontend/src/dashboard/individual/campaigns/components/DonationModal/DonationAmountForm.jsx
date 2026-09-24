import React from "react";

import { ArrowRight, Loader2 } from "lucide-react";

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
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
            Contribution
          </p>

          <h2 className="mt-1.5 text-[22px] font-semibold tracking-tight text-slate-900">
            Choose your donation amount
          </h2>

          <p className="mt-1.5 text-sm leading-5 text-slate-500">
            Enter the amount you would like to contribute to this campaign.
          </p>
        </div>

        <div className="mt-7">
          <label
            htmlFor="donation-amount"
            className="text-xs font-semibold text-slate-700">
            Donation amount
          </label>

          <div
            className={[
              "mt-2 flex h-20 items-center rounded-xl border-2 bg-white px-5 transition",
              error
                ? "border-red-300 focus-within:border-red-400"
                : "border-slate-200 focus-within:border-primary",
            ].join(" ")}>
            <span className="font-display text-3xl font-semibold text-primary">
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
              className="ml-3 h-full min-w-0 flex-1 bg-transparent font-display text-3xl font-semibold text-slate-900 outline-none placeholder:text-slate-200 disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Minimum donation: ৳10
            </span>

            {amount && Number(amount) >= 10 && (
              <span className="text-[11px] font-semibold text-primary">
                ৳{Number(amount).toLocaleString("en-BD")}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-700">
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
                    "h-10 rounded-lg border text-sm font-semibold transition",
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  ].join(" ")}>
                  ৳{value.toLocaleString("en-BD")}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs font-medium leading-5 text-red-700">
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 px-6 py-5 sm:px-7">
        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70">
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

        <p className="mt-2.5 text-center text-[10px] leading-4 text-slate-400">
          You will be redirected to SSLCOMMERZ to complete your donation.
        </p>
      </div>
    </form>
  );
};

export default DonationAmountForm;
