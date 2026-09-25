import React from "react";

import {
  ArrowUpRight,
  CalendarDays,
  DollarSign,
  HeartHandshake,
} from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";

import CampaignIdentity from "./CampaignIdentity";

const formatCurrency = (value) => {
  const amount = Number(value ?? 0);

  return `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProgress = (collected, target) => {
  const total = Number(target ?? 0);
  const current = Number(collected ?? 0);

  if (!total || total <= 0) return 0;

  return Math.min(Math.max(Math.round((current / total) * 100), 0), 100);
};

const CampaignCard = ({ campaign, onOpen }) => {
  /*
   * Campaign API fields
   */
  const targetAmount = campaign?.target_amount ?? campaign?.targetAmount ?? 0;

  const collectedAmount =
    campaign?.collected_amount ?? campaign?.collectedAmount ?? 0;

  const startDate = campaign?.start_date ?? campaign?.startDate;

  const endDate = campaign?.end_date ?? campaign?.endDate;

  const progress = getProgress(collectedAmount, targetAmount);

  const helpRequestTitle =
    campaign?.helpRequestTitle ||
    campaign?.help_request?.title ||
    campaign?.help_request_title;

  return (
    <article className="group flex min-h-[330px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      {/* Main content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Campaign header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CampaignIdentity campaign={campaign} />
          </div>

          <div className="shrink-0 pt-0.5">
            <StatusBadge status={campaign?.status} />
          </div>
        </div>

        {/* Linked help request */}
        {helpRequestTitle && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/[0.035] px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HeartHandshake className="h-4 w-4" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                Linked help request
              </p>

              <p className="mt-1 truncate text-[12px] font-semibold leading-5 text-text-primary">
                {helpRequestTitle}
              </p>
            </div>
          </div>
        )}

        {/* Funding section */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-text-secondary shadow-sm">
                  <DollarSign className="h-3.5 w-3.5" strokeWidth={1.8} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                  Campaign funding
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[18px] font-bold tracking-[-0.02em] text-text-primary">
                  {formatCurrency(collectedAmount)}
                </span>

                <span className="text-[11px] text-text-secondary">raised</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[16px] font-bold tracking-[-0.01em] text-primary">
                {progress}%
              </span>

              <p className="mt-0.5 text-[10px] text-text-secondary">funded</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <span className="text-[10px] font-medium text-text-secondary">
                Raised
              </span>

              <span className="text-[10px] font-semibold text-text-primary">
                Target {formatCurrency(targetAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Campaign dates */}
        <div className="mt-6 grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-200 pt-5">
          <div className="pr-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />

              <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                Starts
              </span>
            </div>

            <p className="mt-2 text-[12px] font-semibold text-text-primary">
              {formatDate(startDate)}
            </p>
          </div>

          <div className="pl-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />

              <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                Ends
              </span>
            </div>

            <p className="mt-2 text-[12px] font-semibold text-text-primary">
              {formatDate(endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
        <span className="text-[10px] text-text-secondary">
          Campaign details
        </span>

        <button
          type="button"
          onClick={() => onOpen(campaign)}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-[10px] font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md">
          View campaign
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </button>
      </div>
    </article>
  );
};

export default CampaignCard;
