import React from "react";

import { ArrowRight, Megaphone } from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";

const formatCurrency = (amount) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const CampaignCard = ({ campaign, onDonate }) => {
  const targetAmount = Number(campaign.target_amount || 0);
  const collectedAmount = Number(campaign.collected_amount || 0);

  const progress =
    targetAmount > 0
      ? Math.min(Math.round((collectedAmount / targetAmount) * 100), 100)
      : 0;

  const remainingAmount = Math.max(targetAmount - collectedAmount, 0);

  const formatDate = (date) => {
    if (!date) return "No deadline";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_3px_14px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.10)]">
      <div className="relative overflow-hidden bg-primary px-6 pb-7 pt-6 sm:px-7">
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
              <Megaphone className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              {campaign.category && (
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                  {campaign.category}
                </p>
              )}

              <h2 className="text-[18px] font-semibold leading-6 tracking-tight text-white">
                {campaign.title}
              </h2>
            </div>
          </div>

          <div className="shrink-0 [&_span]:border-white/20! [&_span]:bg-white/10! [&_span]:text-white!">
            <StatusBadge status={campaign.status} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6 sm:px-7">
        {campaign.description && (
          <p className="line-clamp-3 text-sm leading-6 text-slate-500">
            {campaign.description}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-end justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Raised
              </p>

              <p className="mt-1 font-display text-[28px] font-semibold leading-none tracking-tight text-slate-900">
                {formatCurrency(collectedAmount)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Goal
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formatCurrency(targetAmount)}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-primary">
                {progress}% funded
              </span>

              <span className="text-[11px] font-medium text-slate-400">
                {remainingAmount > 0
                  ? `${formatCurrency(remainingAmount)} needed`
                  : "Goal reached"}
              </span>
            </div>

            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
              Campaign deadline
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatDate(campaign.end_date)}
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {progress >= 100 ? "Fully funded" : "Open for support"}
          </span>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-7">
        <button
          type="button"
          onClick={() => onDonate(campaign)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover hover:shadow-md">
          Support this campaign
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
};

export default CampaignCard;
