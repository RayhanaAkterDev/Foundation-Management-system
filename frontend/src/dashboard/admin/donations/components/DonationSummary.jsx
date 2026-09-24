import React from "react";
import { CircleDollarSign, HandCoins, TrendingUp } from "lucide-react";

const formatAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "৳0";
  }

  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const DonationSummary = ({ summary }) => {
  return (
    <section className="overflow-hidden border border-border bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr]">
        {/* Total Donation Amount */}
        <div className="relative border-b border-border bg-primary px-7 py-7 text-white lg:border-b-0 lg:border-r lg:px-8">
          <div className="absolute right-7 top-7 opacity-15">
            <CircleDollarSign size={72} strokeWidth={1} />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={16} strokeWidth={1.8} />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                Total donation amount
              </p>
            </div>

            <p className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-[42px]">
              {formatAmount(summary.totalAmount)}
            </p>

            <p className="mt-3 max-w-[300px] text-xs leading-5 text-white/65">
              Total funds recorded through donations on the platform.
            </p>
          </div>
        </div>

        {/* Total Donations */}
        <div className="border-b border-border px-7 py-7 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Total donations
              </p>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-text">
                {Number(summary.totalDonations || 0).toLocaleString("en-BD")}
              </p>

              <p className="mt-3 text-xs leading-5 text-text-secondary">
                Individual donation records received.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center border border-border bg-bg text-primary">
              <HandCoins size={18} strokeWidth={1.7} />
            </div>
          </div>
        </div>

        {/* Average Donation */}
        <div className="px-7 py-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
                Average donation
              </p>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-text">
                {formatAmount(summary.averageDonation)}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary">
                <TrendingUp
                  size={13}
                  strokeWidth={1.8}
                  className="text-primary"
                />

                <span>Per donation record</span>
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center border border-border bg-bg text-primary">
              <TrendingUp size={18} strokeWidth={1.7} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSummary;
