import React from "react";

import {
  X,
  FileText,
  ShieldCheck,
  CalendarDays,
  CircleAlert,
  Target,
  Wallet,
  MapPin,
  Globe2,
  Layers3,
} from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";

// ============================================================
// HEADER META
// ============================================================

const HeaderMeta = ({
  label,
  value,
  mono = false,
  truncate = false,
  valueClassName = "text-white",
}) => (
  <div className="min-w-0">
    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
      {label}
    </p>

    <p
      className={`mt-1 max-w-full text-[12px] font-semibold leading-5 tracking-[-0.01em] ${valueClassName} ${
        mono ? "font-mono" : ""
      } ${truncate ? "truncate" : ""}`}
      title={truncate ? value : undefined}>
      {value}
    </p>
  </div>
);

// ============================================================
// SECTION HEADING
// ============================================================

const SectionHeading = ({ icon: Icon, eyebrow, title }) => (
  <div className="mb-7 flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon size={17} strokeWidth={2} />
    </div>

    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {eyebrow}
      </p>

      <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
        {title}
      </h3>
    </div>
  </div>
);

// ============================================================
// SIDE HEADING
// ============================================================

const SideHeading = ({ icon: Icon, children }) => (
  <div className="mb-5 flex items-center gap-2.5">
    <Icon size={16} className="text-primary" strokeWidth={2} />

    <h3 className="text-[13px] font-semibold uppercase tracking-widest text-slate-700">
      {children}
    </h3>
  </div>
);

// ============================================================
// TIMELINE ITEM
// ============================================================

const TimelineItem = ({ date, title, description, last = false }) => (
  <div className="relative flex gap-3.5">
    <div className="relative flex w-3 shrink-0 justify-center">
      <span className="mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-white" />

      {!last && (
        <span className="absolute left-1/2 top-4 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-slate-200" />
      )}
    </div>

    <div className="pb-7">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
        {date}
      </p>

      <p className="text-[13px] font-semibold text-slate-800">{title}</p>

      {description && (
        <p className="mt-1.5 text-[12px] leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  </div>
);

// ============================================================
// VIEW MODAL
// ============================================================

const ViewModal = ({ campaign, loading, error, onClose }) => {
  const formatDate = (date, includeTime = false) => {
    if (!date) return "Not provided";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Not provided";

    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(includeTime && {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }

    const number = Number(value);

    if (Number.isNaN(number)) return "Not provided";

    return `৳${number.toLocaleString("en-BD")}`;
  };

  const getCampaignTypeLabel = (type) => {
    const labels = {
      local_help_request: "Local Help Request",
      state_campaign: "State Campaign",
      global_situation: "Global Situation",
    };

    return labels[type] || formatValue(type);
  };

  const getOrganizerName = () => {
    return (
      campaign?.organization?.name ||
      campaign?.organization?.organization_name ||
      campaign?.organization_name ||
      (campaign?.type === "global_situation"
        ? "Stand For People"
        : "Not assigned")
    );
  };

  const getProgressPercentage = () => {
    const target = Number(campaign?.target_amount || 0);

    const collected = Number(
      campaign?.collected_amount ||
        campaign?.raised_amount ||
        campaign?.current_amount ||
        0,
    );

    if (!target || target <= 0) return 0;

    return Math.min((collected / target) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();

  const statusValue = campaign?.status || "unknown";
  const campaignType = getCampaignTypeLabel(campaign?.type);
  const organizerName = getOrganizerName();

  const locationValue =
    campaign?.location ||
    campaign?.address ||
    campaign?.district ||
    "Not provided";

  const collectedAmount =
    campaign?.collected_amount ??
    campaign?.raised_amount ??
    campaign?.current_amount ??
    0;

  const targetAmount = Number(campaign?.target_amount || 0);
  const collectedNumber = Number(collectedAmount || 0);
  const remainingAmount = Math.max(targetAmount - collectedNumber, 0);

  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5">
      <div
        className="absolute inset-0"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        {/* =========================================================
            HEADER — EXACT REQUESTED VERSION
        ========================================================== */}

        <header className="shrink-0 border-b border-primary-hover bg-primary text-white">
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/70 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close">
              <X size={18} strokeWidth={1.8} />
            </button>

            {campaign && (
              <div className="flex flex-col gap-7 pr-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                      Campaign
                    </span>

                    {campaign?.id && (
                      <>
                        <span className="text-white/25">•</span>

                        <span className="font-mono text-[10px] text-white/45">
                          #{campaign.id}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-3">
                    <h2 className="max-w-3xl text-[24px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
                      {campaign?.title || "Campaign details"}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {campaign.status && (
                        <span className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm">
                          {statusValue}
                        </span>
                      )}

                      {campaign.type && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-white/90">
                          <Globe2 size={13} />

                          {campaignType}
                        </span>
                      )}

                      {campaign.category && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-white/90">
                          <Layers3 size={13} />

                          {formatValue(campaign.category)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full shrink-0 border-t border-white/10 pt-5 lg:w-50 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <HeaderMeta
                      label="Organizer"
                      value={organizerName}
                      truncate
                    />

                    <HeaderMeta
                      label="Location"
                      value={locationValue}
                      truncate
                    />

                    <HeaderMeta
                      label="Target"
                      value={formatMoney(campaign.target_amount)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* =========================================================
            BODY — EXACT REQUESTED VERSION
        ========================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-105 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />

                <p className="text-sm text-slate-500">Loading campaign...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-105 items-center justify-center p-6">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <CircleAlert size={20} />
                </div>

                <p className="text-sm font-medium text-slate-800">
                  Unable to load campaign
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
              {/* =====================================================
                  MAIN CONTENT
              ====================================================== */}

              <main className="min-w-0 px-6 py-7 sm:px-8">
                {/* DESCRIPTION */}

                <section className="border-b border-slate-200 pb-8">
                  <SectionHeading
                    icon={FileText}
                    eyebrow="Campaign overview"
                    title="Description"
                  />

                  <p className="max-w-3xl whitespace-pre-line text-[13px] leading-7 text-slate-600">
                    {campaign.description || "No description provided."}
                  </p>
                </section>

                {/* =================================================
                    LOCATION & IMPACT
                ================================================== */}

                <section className="border-b border-slate-200 py-8">
                  <SectionHeading
                    icon={MapPin}
                    eyebrow="Campaign details"
                    title="Location & impact"
                  />

                  <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* PRIMARY LOCATION */}

                    <div className="min-w-0">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Where support is needed
                      </p>

                      <div className="flex items-start gap-3">
                        <MapPin
                          size={21}
                          strokeWidth={1.8}
                          className="mt-0.5 shrink-0 text-primary"
                        />

                        <div className="min-w-0">
                          <p className="wrap-break-word text-[20px] font-semibold leading-7 tracking-[-0.02em] text-slate-900">
                            {locationValue}
                          </p>

                          {campaign?.district &&
                            campaign.district !== locationValue && (
                              <p className="mt-1.5 text-[12px] text-slate-500">
                                {campaign.district}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="mt-7 flex items-center gap-2 text-[11px] text-slate-500">
                        <Globe2 size={14} className="shrink-0 text-slate-400" />

                        <span>
                          Scope:{" "}
                          <span className="font-medium text-slate-700">
                            {formatValue(campaign.scope)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* COVERAGE */}

                    <div className="lg:border-l lg:border-slate-200 lg:pl-8">
                      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Coverage & impact
                      </p>

                      <div>
                        <div className="flex items-start justify-between gap-5 border-b border-slate-100 py-3 first:pt-0">
                          <div className="flex items-center gap-2.5">
                            <Layers3
                              size={14}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="text-[12px] text-slate-500">
                              District
                            </span>
                          </div>

                          <span className="max-w-[55%] text-right text-[12px] font-medium text-slate-800">
                            {formatValue(campaign.district)}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-5 border-b border-slate-100 py-3">
                          <div className="flex items-center gap-2.5">
                            <MapPin
                              size={14}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="text-[12px] text-slate-500">
                              Location
                            </span>
                          </div>

                          <span className="max-w-[55%] text-right text-[12px] font-medium text-slate-800">
                            {formatValue(locationValue)}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <CircleAlert
                              size={14}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="text-[12px] text-slate-500">
                              Affected areas
                            </span>
                          </div>

                          <span className="max-w-[55%] text-right text-[12px] font-medium leading-5 text-slate-800">
                            {formatValue(campaign.affected_areas)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {campaign?.verification_note && (
                    <div className="mt-7 border-l-2 border-primary/50 pl-4">
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck
                          size={15}
                          className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Verification note
                          </p>

                          <p className="mt-1 text-[12px] leading-5 text-slate-600">
                            {campaign.verification_note}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* =================================================
                    CAMPAIGN FUNDING
                ================================================== */}

                <section className="py-8">
                  <SectionHeading
                    icon={Wallet}
                    eyebrow="Fundraising"
                    title="Campaign funding"
                  />

                  <div className="space-y-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Raised so far
                        </p>

                        <p className="text-[30px] font-semibold tracking-[-0.03em] text-slate-900">
                          {formatMoney(collectedAmount)}
                        </p>
                      </div>

                      <div className="flex items-end gap-8 sm:text-right">
                        <div>
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Target
                          </p>

                          <p className="text-[14px] font-semibold text-slate-800">
                            {formatMoney(campaign.target_amount)}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Remaining
                          </p>

                          <p className="text-[14px] font-semibold text-slate-800">
                            {formatMoney(remainingAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500">
                          Funding progress
                        </span>

                        <span className="text-[12px] font-semibold text-primary">
                          {progressPercentage.toFixed(0)}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>৳0</span>

                        <span>
                          Target {formatMoney(campaign.target_amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5">
                        <Target size={15} className="shrink-0 text-slate-400" />

                        <span className="text-[11px] text-slate-500">
                          Current campaign funding status
                        </span>
                      </div>

                      <span className="text-[11px] font-medium text-slate-700">
                        {progressPercentage >= 100
                          ? "Funding target reached"
                          : `${formatMoney(remainingAmount)} still needed`}
                      </span>
                    </div>
                  </div>
                </section>
              </main>

              {/* =====================================================
                  TIMELINE SIDEBAR
              ====================================================== */}

              <aside className="border-t border-slate-200 bg-slate-50/70 px-6 py-7 lg:border-l lg:border-t-0">
                <SideHeading icon={CalendarDays}>Campaign timeline</SideHeading>

                <div>
                  {campaign?.created_at && (
                    <TimelineItem
                      date={formatDate(campaign.created_at)}
                      title="Campaign created"
                      description="Campaign information was submitted to the platform."
                    />
                  )}

                  {campaign?.start_date && (
                    <TimelineItem
                      date={formatDate(campaign.start_date)}
                      title="Campaign starts"
                      description="The campaign becomes active from this date."
                    />
                  )}

                  {campaign?.end_date && (
                    <TimelineItem
                      date={formatDate(campaign.end_date)}
                      title="Campaign ends"
                      description="Scheduled end date for this campaign."
                      last
                    />
                  )}
                </div>

                {!campaign?.created_at &&
                  !campaign?.start_date &&
                  !campaign?.end_date && (
                    <p className="text-[12px] leading-5 text-slate-500">
                      No timeline information is available.
                    </p>
                  )}

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Record information
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] text-slate-500">
                        Created
                      </span>

                      <span className="text-right text-[11px] font-medium text-slate-700">
                        {formatDate(campaign.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] text-slate-500">
                        Updated
                      </span>

                      <span className="text-right text-[11px] font-medium text-slate-700">
                        {formatDate(campaign.updated_at)}
                      </span>
                    </div>

                    {campaign?.id && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] text-slate-500">
                          Campaign ID
                        </span>

                        <span className="max-w-32.5 truncate text-right font-mono text-[10px] font-medium text-slate-700">
                          #{campaign.id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
