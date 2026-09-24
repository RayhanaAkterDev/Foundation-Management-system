import React from "react";

import { CalendarDays, Megaphone, Target } from "lucide-react";

const formatCurrency = (amount) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date) => {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DonationCampaignSummary = ({ campaign }) => {
  const targetAmount = Number(campaign?.target_amount || 0);
  const collectedAmount = Number(campaign?.collected_amount || 0);

  const remainingAmount = Math.max(targetAmount - collectedAmount, 0);

  const progress =
    targetAmount > 0
      ? Math.min(Math.round((collectedAmount / targetAmount) * 100), 100)
      : 0;

  return (
    <section className="border-b border-slate-200 bg-slate-50/80 px-6 py-6 sm:px-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Megaphone className="h-5 w-5" strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          {campaign?.category && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {campaign.category}
            </p>
          )}

          <h3 className="text-[17px] font-semibold leading-6 text-slate-900">
            {campaign?.title}
          </h3>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Raised so far
            </p>

            <p className="mt-1 font-display text-[25px] font-semibold tracking-tight text-slate-900">
              {formatCurrency(collectedAmount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Goal
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatCurrency(targetAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-primary">
            {progress}% funded
          </span>

          <span className="text-[11px] font-medium text-slate-400">
            {remainingAmount > 0
              ? `${formatCurrency(remainingAmount)} still needed`
              : "Goal reached"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

        <span>
          {campaign?.end_date
            ? `Campaign ends ${formatDate(campaign.end_date)}`
            : "No campaign deadline"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Target className="h-3.5 w-3.5 text-slate-400" />

        <span>Your contribution will support this campaign's goal.</span>
      </div>
    </section>
  );
};

export default DonationCampaignSummary;
