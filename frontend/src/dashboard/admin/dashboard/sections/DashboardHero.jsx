import React from "react";

import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { formatNumber } from "../utils/dashboardHelpers";

/* =================================================
   ATTENTION ITEM
================================================== */

const AttentionItem = ({
  label,
  count,
  suffix,
  description,
  footer,
  highlight = false,
  borderRight = false,
}) => (
  <article
    className={`
            group relative flex min-h-52 flex-col
            bg-white
            px-5 py-5
            sm:px-6
            lg:px-7 lg:py-6
            ${borderRight ? "xl:border-r xl:border-slate-200" : ""}
            transition-colors duration-200
            hover:bg-slate-50
        `}>
    {/* Header */}
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span
          className={`
                        h-2 w-2 rounded-full
                        ${highlight ? "bg-accent" : "bg-primary"}
                    `}
        />

        <span
          className="
                        font-poppins
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-slate-600
                    ">
          {label}
        </span>
      </div>

      <ArrowUpRight
        size={16}
        strokeWidth={1.8}
        className="
                    text-slate-300
                    transition-all duration-200
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-primary
                "
      />
    </div>

    {/* Number */}
    <div className="mt-8 flex items-end gap-3">
      <span
        className={`
                    font-fraunces
                    text-[50px]
                    leading-[0.8]
                    tracking-[-0.055em]
                    sm:text-[54px]
                    lg:text-[58px]
                    ${highlight ? "text-accent" : "text-slate-900"}
                `}>
        {count}
      </span>

      <span
        className="
                    mb-0.5
                    max-w-32
                    font-jost
                    text-[11px]
                    leading-[1.4]
                    text-slate-500
                ">
        {suffix}
      </span>
    </div>

    {/* Description */}
    <p
      className="
                mt-4
                max-w-72
                font-jost
                text-[11px]
                leading-[1.55]
                text-slate-500
                sm:text-[12px]
            ">
      {description}
    </p>

    {/* Footer */}
    <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
      <span
        className={`
                    h-1.5 w-5
                    ${highlight ? "bg-accent" : "bg-primary/35"}
                `}
      />

      <span
        className="
                    font-poppins
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.11em]
                    text-slate-400
                ">
        {footer}
      </span>
    </div>
  </article>
);

/* =================================================
   DASHBOARD HERO
================================================== */

const DashboardHero = ({
  loading,
  urgentRequestCount,
  pendingVerificationCount = 0,
  pendingCampaignCount = 0,
  pendingVolunteerCount = 0,
}) => {
  const urgentCount = loading ? "—" : formatNumber(urgentRequestCount);

  const organizationCount = loading
    ? "—"
    : formatNumber(pendingVerificationCount);

  const volunteerCount = loading ? "—" : formatNumber(pendingVolunteerCount);

  const campaignCount = loading ? "—" : formatNumber(pendingCampaignCount);

  const hasUrgentRequests = !loading && Number(urgentRequestCount) > 0;

  const attentionCards = [
    {
      label: "Organizations",
      count: organizationCount,
      suffix: "awaiting verification",
      description: "Registrations waiting for administrative review.",
      footer: "Organization verification",
    },

    {
      label: "Volunteers",
      count: volunteerCount,
      suffix: "to review",
      description: "Applications waiting for administrative review.",
      footer: "Volunteer applications",
    },

    {
      label: "Campaigns",
      count: campaignCount,
      suffix: "need review",
      description:
        "Campaign proposals waiting for administrative verification.",
      footer: "Campaign review",
    },
  ];

  return (
    <header className="space-y-6">
      {/* =================================================
                TEAL HERO
            ================================================== */}

      <section className="overflow-hidden bg-primary">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main hero */}
          <div
            className="
                            relative
                            px-6
                            py-9
                            sm:px-8
                            sm:py-10
                            lg:px-10
                            lg:py-11
                        ">
            {/* Subtle vertical accent */}
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent" />

            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/80" />

                <span
                  className="
                                        font-poppins
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-white/75
                                    ">
                  Admin Dashboard
                </span>
              </div>

              <h1
                className="
                                    mt-5
                                    font-fraunces
                                    text-[38px]
                                    leading-[0.98]
                                    tracking-[-0.045em]
                                    text-white
                                    sm:text-[46px]
                                    lg:text-[52px]
                                ">
                Here's what needs
                <span className="block text-white/80">your attention.</span>
              </h1>

              <p
                className="
                                    mt-5
                                    max-w-xl
                                    font-jost
                                    text-[12px]
                                    leading-[1.65]
                                    text-white/70
                                    sm:text-[13px]
                                ">
                Review pending decisions and priority requests across Stand For
                People.
              </p>
            </div>
          </div>

          {/* Priority */}
          <aside
            className={`
                            relative
                            border-t
                            border-white/10
                            px-6
                            py-7
                            sm:px-8
                            lg:border-l
                            lg:border-t-0
                            lg:px-8
                            lg:py-8
                            ${
                              hasUrgentRequests
                                ? "bg-primary-hover"
                                : "bg-primary-hover/70"
                            }
                        `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`
                                        flex h-8 w-8 items-center justify-center
                                        ${
                                          hasUrgentRequests
                                            ? "bg-accent"
                                            : "bg-white/10"
                                        }
                                    `}>
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.8}
                    className={hasUrgentRequests ? "text-white" : "text-white"}
                  />
                </div>

                <span className="font-poppins text-[9px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Priority Queue
                </span>
              </div>

              <span
                className={`
                                    h-2 w-2 rounded-full
                                    ${
                                      hasUrgentRequests
                                        ? "bg-accent"
                                        : "bg-white/50"
                                    }
                                `}
              />
            </div>

            <div className="mt-9">
              <p className="font-jost text-[11px] text-white/60">
                Priority help requests
              </p>

              <div className="mt-3 flex items-end gap-3">
                <span
                  className={`
                                        font-fraunces
                                        text-[58px]
                                        leading-[0.8]
                                        tracking-[-0.06em]
                                        ${
                                          hasUrgentRequests
                                            ? "text-accent"
                                            : "text-white"
                                        }
                                    `}>
                  {urgentCount}
                </span>

                <span className="mb-0.5 max-w-28 font-jost text-[10px] leading-[1.4] text-white/60">
                  requiring administrative attention
                </span>
              </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={14}
                  strokeWidth={1.8}
                  className={
                    hasUrgentRequests ? "text-accent" : "text-white/60"
                  }
                />

                <span className="font-jost text-[10px] text-white/65">
                  {hasUrgentRequests
                    ? "Priority requests are waiting for action."
                    : "No priority requests require immediate action."}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =================================================
                OPERATIONAL SNAPSHOT
            ================================================== */}
      <section className="overflow-hidden border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 lg:px-8">
          <div>
            <h2 className="font-fraunces text-[25px] leading-none tracking-[-0.03em] text-slate-900">
              Operational Snapshot
            </h2>

            <p className="mt-2 font-jost text-[12px] text-slate-500">
              Current administrative workload
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center bg-primary/10">
            <CheckCircle2
              size={18}
              strokeWidth={1.8}
              className="text-primary"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Workload visual */}
          <div className="flex items-center justify-center border-b border-slate-200 px-6 py-9 lg:border-b-0 lg:border-r">
            <div className="relative flex h-[168px] w-[168px] items-center justify-center">
              {/* Progress ring */}
              <svg
                viewBox="0 0 168 168"
                className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="84"
                  cy="84"
                  r="72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100"
                />

                <circle
                  cx="84"
                  cy="84"
                  r="72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="452"
                  strokeDashoffset={
                    loading
                      ? 452
                      : Math.max(
                          0,
                          452 -
                            Math.min(
                              452,
                              (Number(pendingVerificationCount || 0) +
                                Number(pendingVolunteerCount || 0) +
                                Number(pendingCampaignCount || 0)) *
                                18,
                            ),
                        )
                  }
                  className="text-primary"
                />
              </svg>

              <div className="relative text-center">
                <div className="font-fraunces text-[46px] leading-none tracking-[-0.05em] text-slate-900">
                  {loading
                    ? "—"
                    : formatNumber(
                        Number(pendingVerificationCount || 0) +
                          Number(pendingVolunteerCount || 0) +
                          Number(pendingCampaignCount || 0),
                      )}
                </div>

                <div className="mt-2 font-jost text-[10px] font-semibold text-slate-400">
                  NEEDS ATTENTION
                </div>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="px-6 py-7 lg:px-8 lg:py-8">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-slate-200" />

              {attentionCards.map((item, index) => {
                const progressColor =
                  index === 0
                    ? "bg-primary"
                    : index === 1
                      ? "bg-amber-500"
                      : "bg-blue-500";

                const count = Number(item.count) || 0;

                return (
                  <div
                    key={item.label}
                    className={`relative flex gap-5 ${
                      index !== attentionCards.length - 1 ? "pb-8" : ""
                    }`}>
                    {/* Timeline point */}
                    <div className="relative z-10 mt-1.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center bg-white">
                      <span
                        className={`h-[7px] w-[7px] rounded-full ${progressColor}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-jost text-[14px] font-semibold text-slate-900">
                            {item.label}
                          </h3>

                          <p className="mt-1.5 max-w-lg font-jost text-[11px] leading-5 text-slate-500">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-baseline gap-2 sm:pl-6">
                          <span className="font-fraunces text-[32px] leading-none tracking-[-0.04em] text-slate-900">
                            {item.count}
                          </span>

                          <span className="font-jost text-[10px] font-medium text-slate-400">
                            {item.suffix}
                          </span>
                        </div>
                      </div>

                      {/* Workload indicator */}
                      <div className="mt-4 h-1 w-full overflow-hidden bg-slate-100">
                        <div
                          className={`h-full ${progressColor} transition-all`}
                          style={{
                            width: loading
                              ? "0%"
                              : count === 0
                                ? "0%"
                                : `${Math.min(100, Math.max(8, count * 8))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </header>
  );
};

export default DashboardHero;
