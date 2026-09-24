import React from "react";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

/**
 * StatCard — displays a single metric with label, value, optional icon, and optional trend.
 *
 * Props:
 *   label      {string}   — metric label
 *   value      {string|number} — main value to display
 *   icon       {Component} — lucide-react icon component
 *   iconColor  {string}   — tailwind bg class for icon background (defaults to teal)
 *   trend      {number}   — percentage change; positive=up, negative=down, 0/null=neutral
 *   trendLabel {string}   — context string shown next to trend (e.g. "vs last month")
 *   subtext    {string}   — small supplementary text below value
 */
const StatCard = ({
  label,
  value,
  icon: Icon,
  iconColor,
  trend,
  trendLabel,
  subtext,
}) => {
  const hasTrend = trend !== null && trend !== undefined;

  const trendEl = hasTrend ? (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
        trend > 0
          ? "text-emerald-600"
          : trend < 0
            ? "text-red-500"
            : "text-slate-500"
      }`}>
      <span
        className={`flex h-5 w-5 items-center justify-center ${
          trend > 0 ? "bg-emerald-50" : trend < 0 ? "bg-red-50" : "bg-slate-100"
        }`}>
        {trend > 0 ? (
          <TrendingUp className="h-3 w-3" strokeWidth={2.2} />
        ) : trend < 0 ? (
          <TrendingDown className="h-3 w-3" strokeWidth={2.2} />
        ) : (
          <Minus className="h-3 w-3" strokeWidth={2.2} />
        )}
      </span>

      {trend > 0 ? `+${trend}%` : `${trend}%`}

      {trendLabel && (
        <span className="font-normal text-slate-400">{trendLabel}</span>
      )}
    </span>
  ) : null;

  return (
    <div className="group relative overflow-hidden border border-slate-200 bg-white transition-colors duration-200 hover:border-slate-300">
      {/* Top content */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

              <p className="truncate text-xs font-semibold tracking-wide text-slate-500">
                {label}
              </p>
            </div>

            <p className="mt-4 font-jost text-3xl font-semibold leading-none tracking-[-0.035em] text-slate-900 tabular-nums sm:text-[32px]">
              {value}
            </p>
          </div>

          {Icon && (
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center ${
                iconColor || "bg-primary/10"
              }`}>
              <Icon
                className={`h-[19px] w-[19px] ${
                  iconColor ? "" : "text-primary"
                }`}
                strokeWidth={1.8}
              />
            </span>
          )}
        </div>

        {/* Supporting information */}
        {(subtext || hasTrend) && (
          <div className="mt-5 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3.5">
            {trendEl}

            {subtext && (
              <span className="text-xs text-slate-400">{subtext}</span>
            )}
          </div>
        )}
      </div>

      {/* Subtle bottom indicator */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-100">
        <div className="h-full w-0 bg-primary transition-all duration-300 group-hover:w-full" />
      </div>
    </div>
  );
};

export default StatCard;
