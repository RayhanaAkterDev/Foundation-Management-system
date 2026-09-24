import React from "react";

import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

const formatAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "—";
  }

  return `৳${value.toLocaleString("en-BD")}`;
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDisplayStatus = (request) => {
  if (request?.withdrawalStatus === "pending") {
    return "withdrawal";
  }

  const assignmentStatus = String(
    request?.rawAssignment?.status || request?.assignmentStatus || "",
  ).toLowerCase();

  const helpRequestStatus = String(
    request?.rawHelpRequest?.status || request?.helpRequestStatus || "",
  ).toLowerCase();

  if (assignmentStatus === "pending") {
    return "pending";
  }

  if (assignmentStatus === "accepted") {
    if (
      helpRequestStatus === "in_progress" ||
      helpRequestStatus === "in-progress"
    ) {
      return "active";
    }

    if (helpRequestStatus === "completed") {
      return "completed";
    }

    return "assigned";
  }

  if (assignmentStatus === "rejected") {
    return "rejected";
  }

  if (
    helpRequestStatus === "in_progress" ||
    helpRequestStatus === "in-progress"
  ) {
    return "active";
  }

  if (helpRequestStatus === "completed") {
    return "completed";
  }

  const normalized = String(request?.status || "").toLowerCase();

  switch (normalized) {
    case "pending":
      return "pending";

    case "accepted":
      return "assigned";

    case "assigned":
      return "assigned";

    case "active":
    case "in_progress":
    case "in-progress":
      return "active";

    case "completed":
      return "completed";

    case "rejected":
      return "rejected";

    default:
      return normalized || "pending";
  }
};

const getStatusLabel = (request, statusConfig) => {
  const status = getDisplayStatus(request);

  if (status === "withdrawal") {
    return "Withdrawal requested";
  }

  const config = statusConfig?.[status];

  if (config?.label) {
    return config.label;
  }

  switch (status) {
    case "pending":
      return "Needs response";

    case "assigned":
      return "Assigned";

    case "active":
      return "In progress";

    case "completed":
      return "Completed";

    case "rejected":
      return "Declined";

    default:
      return "Unknown";
  }
};

const getStatusClasses = (request) => {
  const status = getDisplayStatus(request);

  switch (status) {
    case "withdrawal":
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };

    case "pending":
      return {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };

    case "assigned":
      return {
        text: "text-sky-700",
        bg: "bg-sky-50",
        border: "border-sky-200",
        dot: "bg-sky-500",
      };

    case "active":
      return {
        text: "text-primary",
        bg: "bg-primary/5",
        border: "border-primary/20",
        dot: "bg-primary",
      };

    case "completed":
      return {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
      };

    case "rejected":
      return {
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500",
      };

    default:
      return {
        text: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-200",
        dot: "bg-slate-400",
      };
  }
};

const getPriorityStyles = (urgency) => {
  switch (String(urgency || "normal").toLowerCase()) {
    case "critical":
      return {
        label: "Critical",
        text: "text-red-700",
        dot: "bg-red-500",
      };

    case "urgent":
      return {
        label: "Urgent",
        text: "text-orange-700",
        dot: "bg-orange-700",
      };

    case "high":
      return {
        label: "High",
        text: "text-amber-700",
        dot: "bg-amber-700",
      };

    case "low":
      return {
        label: "Low",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      };

    case "normal":
    default:
      return {
        label: "Normal",
        text: "text-slate-600",
        dot: "bg-slate-400",
      };
  }
};

const getProgress = (request) => {
  const status = getDisplayStatus(request);

  switch (status) {
    case "completed":
      return 100;

    case "active":
      return 65;

    case "assigned":
      return 35;

    case "pending":
      return 0;

    default:
      return 0;
  }
};

const EmptyState = ({ search, onClearFilters }) => {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center border border-border bg-background-alt text-text-secondary">
        <Clock3 size={18} strokeWidth={1.7} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-text-primary">
        No cases found
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-text-secondary">
        {search
          ? "No help requests match your current search."
          : "There are no help requests matching the selected filters."}
      </p>

      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 text-xs font-semibold text-primary underline-offset-4 hover:underline">
          Clear filters
        </button>
      )}
    </div>
  );
};

const CaseRow = ({ request, statusConfig, onOpenCase }) => {
  const progress = getProgress(request);
  const statusLabel = getStatusLabel(request, statusConfig);
  const status = getStatusClasses(request);
  const priority = getPriorityStyles(request?.urgency);

  return (
    <article
      className="
        group
        relative
        w-full
        border-b border-border
        bg-background
        transition-all
        duration-200
        last:border-b-0
        hover:z-10
        hover:border-primary/35
        hover:bg-[#f0fdfa]
        hover:shadow-[0_4px_16px_rgba(15,118,110,0.10)]
        hover:ring-1
        hover:ring-primary/20
      ">
      <span
        className="
          pointer-events-none
          absolute inset-y-0 left-0 z-20
          w-0.5
          bg-primary
          opacity-0
          transition-opacity duration-150
          group-hover:opacity-100
        "
      />

      <div
        className="
          grid
          w-full
          grid-cols-1
          items-start
          lg:grid-cols-[minmax(0,2.4fr)_minmax(250px,2fr)_minmax(150px,0.8fr)]
        ">
        <section className="min-w-0 self-start px-5 py-5 sm:px-7 sm:pl-8">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              {request?.category && (
                <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.13em] text-primary">
                  {request.category}
                </span>
              )}

              {request?.category && request?.district && (
                <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
              )}

              {request?.district && (
                <span className="inline-flex min-w-0 items-center gap-1 text-[10px] font-medium text-slate-500">
                  <MapPin
                    className="h-3 w-3 shrink-0 text-slate-400"
                    strokeWidth={1.7}
                  />
                  <span className="truncate">{request.district}</span>
                </span>
              )}
            </div>

            <h3
              className="
                mt-2
                text-[14px]
                font-semibold
                leading-5
                text-text-primary
                transition-colors
                duration-150
                group-hover:text-primary
              ">
              {request?.title || "Help request"}
            </h3>

            <p
              className="
                mt-1.5
                max-w-2xl
                line-clamp-2
                text-[11px]
                leading-[1.65]
                text-text-secondary
              ">
              {request?.description || "No description provided."}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${priority.dot}`}
              />
              <span className={`text-[10px] font-semibold ${priority.text}`}>
                {priority.label} priority
              </span>
            </div>

            {request?.peopleAffected != null && (
              <>
                <span className="h-3 w-px bg-slate-200" />
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                  <Users className="h-3 w-3 text-slate-400" strokeWidth={1.7} />
                  {request.peopleAffected} affected
                </span>
              </>
            )}
          </div>
        </section>

        <section
          className="
            self-start
            border-t border-border
            px-5 py-5 sm:px-7
            lg:border-l lg:border-t-0
          ">
          <div className="grid grid-cols-2 gap-x-7">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-1.5">
                <CalendarDays
                  className="h-3 w-3 text-slate-400"
                  strokeWidth={1.7}
                />
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Submitted
                </span>
              </div>

              <p className="text-[11.5px] font-semibold leading-5 text-text-primary">
                {formatDate(
                  request?.createdAt ||
                    request?.created_at ||
                    request?.rawHelpRequest?.created_at,
                )}
              </p>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Support
                </span>
              </div>

              <p className="text-[11.5px] font-semibold leading-5 text-text-primary">
                {request?.amountNeeded != null
                  ? formatAmount(request.amountNeeded)
                  : "—"}
              </p>

              {progress > 0 && (
                <div className="mt-2 h-1 w-full max-w-[110px] bg-background-alt">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {request?.individual && (
              <div className="col-span-2 mt-4 border-t border-border pt-3.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Requester
                  </span>

                  <span className="max-w-[65%] truncate text-right text-[11.5px] font-semibold text-text-primary">
                    {request.individual}
                  </span>
                </div>
              </div>
            )}

            {request?.location && (
              <div className="col-span-2 mt-3 flex items-center justify-between gap-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Location
                </span>

                <span className="max-w-[65%] truncate text-right text-[11.5px] font-semibold text-text-primary">
                  {request.location}
                </span>
              </div>
            )}

            {request?.activity && (
              <div className="col-span-2 mt-3 flex items-center justify-between gap-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Activity
                </span>

                <span className="max-w-[65%] truncate text-right text-[11.5px] font-semibold text-text-primary">
                  {request.activity}
                </span>
              </div>
            )}

            <div className="col-span-2 mt-4 flex items-center justify-between border-t border-border pt-3.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />

                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </span>
              </div>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-1.5
                  border
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold
                  ${status.bg}
                  ${status.border}
                  ${status.text}
                `}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {statusLabel}
              </span>
            </div>
          </div>
        </section>

        <section
          className="
            self-start
            border-t border-border
            px-5 py-5
            lg:border-l lg:border-t-0
          ">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                Actions
              </p>

              <p className="mt-1.5 text-[11px] leading-5 text-text-secondary">
                Open the assigned case to review details and available actions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenCase?.(request)}
              aria-label={`Open ${request?.title || "help request"}`}
              className="
                flex
                w-full
                items-center
                justify-between
                gap-3
                border
                border-border
                bg-surface
                px-3
                py-2.5
                text-left
                text-[10.5px]
                font-semibold
                text-text-secondary
                transition-all
                duration-150
                hover:border-primary
                hover:bg-primary
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/20
              ">
              <span>View case</span>
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </button>
          </div>
        </section>
      </div>

      <footer
        className="
          flex
          min-h-[34px]
          items-center
          justify-between
          gap-4
          border-t
          border-border
          bg-background
          px-5
          sm:px-8
          transition-colors
          duration-150
          group-hover:bg-surface
        ">
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
            text-[9.5px]
            font-medium
            text-slate-400
          ">
          <CalendarDays className="h-3 w-3 shrink-0" />

          <span className="truncate">
            Submitted{" "}
            {formatDate(
              request?.createdAt ||
                request?.created_at ||
                request?.rawHelpRequest?.created_at,
            )}
          </span>
        </div>

        {request?.assignmentId || request?.id ? (
          <span className="shrink-0 font-mono text-[9.5px] font-medium text-slate-400">
            #
            <span className="text-slate-600">
              {request.assignmentId || request.id}
            </span>
          </span>
        ) : null}
      </footer>
    </article>
  );
};

const HelpRequestTable = ({
  requests = [],
  filteredRequests,
  loading = false,
  statusConfig = {},
  onOpenCase,
  onClearFilters,
  search = "",
}) => {
  const rows = Array.isArray(filteredRequests)
    ? filteredRequests
    : Array.isArray(requests)
      ? requests
      : [];

  return (
    <div className="w-full shrink-0 overflow-hidden border-y border-border">
      {/* TABLE HEADER — NATURAL HEIGHT ONLY */}
      <div className="hidden h-auto shrink-0 bg-background-alt lg:block">
        <div
          className="
            grid
            h-auto
            shrink-0
            grid-cols-[minmax(0,2.4fr)_minmax(250px,2fr)_minmax(150px,0.8fr)]
            items-start
            border-b
            border-border
          ">
          <div className="h-auto self-start px-7 py-3.5 pl-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Help Request Details
            </span>
          </div>

          <div className="h-auto self-start border-l border-border px-7 py-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Request Status
            </span>
          </div>

          <div className="h-auto self-start border-l border-border px-6 py-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Actions
            </span>
          </div>
        </div>
      </div>

      {/* TABLE BODY — NATURAL HEIGHT ONLY */}
      <div className="h-auto shrink-0">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-xs font-medium text-text-secondary">
              <span className="h-4 w-4 animate-spin border-2 border-border border-t-primary" />
              Loading cases...
            </div>
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            search={Boolean(search)}
            onClearFilters={onClearFilters}
          />
        ) : (
          rows.map((request) => (
            <CaseRow
              key={request.assignmentId || request.id}
              request={request}
              statusConfig={statusConfig}
              onOpenCase={onOpenCase}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HelpRequestTable;