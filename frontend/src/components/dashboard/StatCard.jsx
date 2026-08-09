import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
const StatCard = ({ label, value, icon: Icon, iconColor, trend, trendLabel, subtext }) => {
  const hasTrend = trend !== null && trend !== undefined;

  const trendEl = hasTrend ? (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        trend > 0
          ? 'text-emerald-600'
          : trend < 0
            ? 'text-red-500'
            : 'text-[#6b7280]'
      }`}
    >
      {trend > 0 ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : trend < 0 ? (
        <TrendingDown className="h-3.5 w-3.5" />
      ) : (
        <Minus className="h-3.5 w-3.5" />
      )}
      {trend > 0 ? `+${trend}%` : `${trend}%`}
      {trendLabel && <span className="text-[#6b7280] font-normal">{trendLabel}</span>}
    </span>
  ) : null;

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#6b7280] truncate">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-[#0f172a] tabular-nums">{value}</p>
          {(subtext || hasTrend) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              {trendEl}
              {subtext && <span className="text-xs text-[#6b7280]">{subtext}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              iconColor || 'bg-[#0f766e]/10'
            }`}
          >
            <Icon className={`h-5 w-5 ${iconColor ? '' : 'text-[#0f766e]'}`} />
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
