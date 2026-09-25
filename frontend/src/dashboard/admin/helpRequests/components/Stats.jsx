import React from "react";

import {
  ClipboardList,
  Clock3,
  BadgeCheck,
  CircleCheck,
  XCircle,
  Activity,
} from "lucide-react";

const Stats = ({
  total,
  verified,
  pending,
  inProgress,
  completed,
  rejected,
}) => {
  const totalValue = Number(total) || 0;

  const statusRows = [
    {
      label: "Pending",
      value: pending,
      description: "Awaiting admin verification",
      icon: Clock3,
      tone: "amber",
    },
    {
      label: "Verified",
      value: verified,
      description: "Verified by admin, awaiting support",
      icon: BadgeCheck,
      tone: "teal",
    },
    {
      label: "In Progress",
      value: inProgress,
      description: "Active support through an approved campaign",
      icon: Activity,
      tone: "blue",
    },
    {
      label: "Completed",
      value: completed,
      description: "Support completed through campaign fulfillment",
      icon: CircleCheck,
      tone: "green",
    },
    {
      label: "Rejected",
      value: rejected,
      description: "Request was rejected by admin",
      icon: XCircle,
      tone: "slate",
    },
  ];

  const toneStyles = {
    amber: {
      icon: "bg-amber-50 text-amber-600",
      dot: "bg-amber-500",
      number: "text-amber-700",
    },

    teal: {
      icon: "bg-primary/[0.08] text-primary",
      dot: "bg-primary",
      number: "text-primary",
    },

    blue: {
      icon: "bg-blue-50 text-blue-600",
      dot: "bg-blue-500",
      number: "text-blue-700",
    },

    green: {
      icon: "bg-emerald-50 text-emerald-600",
      dot: "bg-emerald-500",
      number: "text-emerald-700",
    },

    slate: {
      icon: "bg-slate-100 text-slate-500",
      dot: "bg-slate-400",
      number: "text-slate-700",
    },
  };

  const getPercentage = (value) => {
    const numericValue = Number(value) || 0;

    if (!totalValue) {
      return 0;
    }

    return Math.min((numericValue / totalValue) * 100, 100);
  };

  return (
    <section className="overflow-hidden border border-border bg-white">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="flex min-h-24 items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white">
            <ClipboardList size={17} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h2 className="text-[15px] font-bold tracking-[-0.02em] text-text-primary">
              Help Requests
            </h2>

            <p className="mt-0.5 truncate text-[11px] text-text-secondary">
              Current request activity and workflow overview
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />

          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary/55">
            Overview
          </span>
        </div>
      </header>

      {/* =========================================================
          CONTENT
      ========================================================== */}
      <div className="grid lg:grid-cols-[32%_68%]">
        {/* =====================================================
            TOTAL HELP REQUESTS
        ====================================================== */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-primary px-6 py-7 text-white sm:px-7 sm:py-8 lg:px-8 lg:py-9">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full border border-white/[0.07]" />

          <div className="relative flex min-h-110 flex-col">
            {/* Label */}
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
                Total requests
              </span>
            </div>

            {/* Main metric */}
            <div className="mt-9">
              <div className="flex items-end gap-3">
                <span className="text-[76px] font-bold leading-[0.78] tracking-[-0.085em] sm:text-[84px]">
                  {totalValue}
                </span>

                <span className="mb-1.5 text-[12px] font-medium text-white/60">
                  requests
                </span>
              </div>

              <p className="mt-6 max-w-56.25 text-[12px] leading-[1.7] text-white/65">
                Total help requests currently recorded across the platform.
              </p>
            </div>

            {/* Bottom summary */}
            <div className="mt-auto pt-10">
              <div className="border-t border-white/15 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
                      Request workflow
                    </p>

                    <p className="mt-1.5 text-[11px] text-white/65">
                      {totalValue === 0
                        ? "No requests recorded"
                        : `${totalValue} requests across ${statusRows.length} statuses`}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATUS AREA
        ====================================================== */}
        <div className="min-w-0">
          {/* Status heading */}
          <div className="flex min-h-18 items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 lg:px-7">
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold tracking-[-0.02em] text-text-primary sm:text-[16px]">
                Request status
              </h3>

              <p className="mt-1.5 text-[11px] leading-5 text-text-secondary sm:text-[12px]">
                Current distribution across request workflow
              </p>
            </div>

            <span className="hidden shrink-0 text-[10px] font-semibold text-text-secondary/50 sm:block">
              5 statuses
            </span>
          </div>

          {/* Desktop column labels */}
          <div className="hidden grid-cols-[40px_minmax(145px,1fr)_minmax(170px,1.3fr)_55px] items-center gap-5 border-b border-border px-5 py-3.5 sm:px-6 lg:px-7 md:grid">
            <span />

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary/45">
              Status
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary/45">
              Distribution
            </span>

            <span className="text-right text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary/45">
              Count
            </span>
          </div>

          {/* Status rows */}
          <div className="px-5 sm:px-6 lg:px-7">
            {statusRows.map((stat, index) => {
              const Icon = stat.icon;
              const tone = toneStyles[stat.tone];

              const currentValue = Number(stat.value) || 0;

              const percentage = getPercentage(currentValue);

              return (
                <div
                  key={stat.label}
                  className={`py-5 sm:py-4.5 ${
                    index !== statusRows.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}>
                  {/* =================================================
                      DESKTOP
                  ================================================== */}
                  <div className="hidden grid-cols-[40px_minmax(145px,1fr)_minmax(170px,1.3fr)_55px] items-center gap-5 md:grid">
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}>
                      <Icon size={17} strokeWidth={1.8} />
                    </div>

                    {/* Status */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                        />

                        <span className="truncate text-[13px] font-bold text-text-primary">
                          {stat.label}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] leading-5 text-text-secondary">
                        {stat.description}
                      </p>
                    </div>

                    {/* Distribution */}
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] text-text-secondary">
                          Request share
                        </span>

                        <span className="text-[11px] font-bold text-text-primary">
                          {Math.round(percentage)}%
                        </span>
                      </div>

                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${tone.dot}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Count */}
                    <div className="text-right">
                      <span
                        className={`text-[27px] font-bold leading-none tracking-[-0.055em] ${tone.number}`}>
                        {currentValue}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      MOBILE
                  ================================================== */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-3.5">
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}>
                        <Icon size={17} strokeWidth={1.8} />
                      </div>

                      {/* Status */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                          />

                          <span className="truncate text-[13px] font-bold text-text-primary">
                            {stat.label}
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] leading-5 text-text-secondary">
                          {stat.description}
                        </p>
                      </div>

                      {/* Count */}
                      <span
                        className={`shrink-0 text-[25px] font-bold leading-none tracking-[-0.055em] ${tone.number}`}>
                        {currentValue}
                      </span>
                    </div>

                    {/* Distribution */}
                    <div className="mt-4 pl-13.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-text-secondary">
                          Request share
                        </span>

                        <span className="text-[11px] font-bold text-text-primary">
                          {Math.round(percentage)}%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${tone.dot}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
