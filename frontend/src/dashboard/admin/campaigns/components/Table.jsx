import React from "react";

import { CalendarDays, ChevronDown, MapPin, Target } from "lucide-react";

const statusStyles = {
  unverified: {
    label: "Unverified",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },

  active: {
    label: "Active",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },

  completed: {
    label: "Completed",
    text: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },

  rejected: {
    label: "Rejected",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },

  cancelled: {
    label: "Cancelled",
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const campaignTypeLabels = {
  local_case: "Local Case",
  organization_proposed: "Organization Proposed",
  global_situation: "Global Situation",
};

const SortHeader = ({ column, onSort, getSortIcon }) => {
  if (!column) return null;

  const sortable = column.sortable !== false;

  const getColumnLabel = (value) =>
    value?.label || value?.header || value?.title || value?.key;

  if (!sortable) {
    return (
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
        {getColumnLabel(column)}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSort?.(column.key)}
      className="
        group/header
        inline-flex
        items-center
        gap-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-text-secondary
        transition-colors
        hover:text-text-primary
      ">
      <span>{getColumnLabel(column)}</span>

      <span
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded
          text-slate-400
          transition-colors
          group-hover/header:bg-slate-100
          group-hover/header:text-primary
        ">
        {getSortIcon?.(column.key) || <ChevronDown className="h-3 w-3" />}
      </span>
    </button>
  );
};

const Table = ({ columns = [], rows = [], onSort, getSortIcon }) => {
  /*
   * ---------------------------------------------------------
   * COLUMN LOOKUPS
   * ---------------------------------------------------------
   */

  const campaignColumn = columns.find((column) => column.key === "title");

  const typeColumn = columns.find(
    (column) =>
      column.key === "campaignType" ||
      column.key === "campaign_type" ||
      column.key === "type",
  );

  const actionColumn =
    columns.find((column) => {
      const key = String(column?.key || "").toLowerCase();

      return key === "actions" || key === "action";
    }) || columns.find((column) => column?.isActionColumn === true);

  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  /*
   * IMPORTANT:
   *
   * Campaigns.jsx adds:
   *
   * campaignType: getCampaignTypeLabel(campaign.type)
   *
   * Therefore row.campaignType contains "Local Case",
   * not "local_case".
   *
   * We must check the raw API type FIRST.
   */

  const getCampaignTypeValue = (row) => {
    return row?.type || row?.campaign_type || row?.campaignType || "";
  };

  const getCampaignType = (row) => {
    const value = getCampaignTypeValue(row);

    return campaignTypeLabels[value] || value || "Not specified";
  };

  /*
   * ---------------------------------------------------------
   * HELP REQUEST ID
   * ---------------------------------------------------------
   *
   * Local-case campaigns are connected to a Help Request.
   *
   * API response contains:
   *
   * "help_request_id": 16
   *
   * and also:
   *
   * "help_request": {
   *   "id": 16
   * }
   *
   */

  const getHelpRequestId = (row) => {
    /*
     * Use the RAW campaign type.
     *
     * Do NOT use row.campaignType here because that value
     * is the display label "Local Case".
     */

    if (row?.type !== "local_case") {
      return null;
    }

    return (
      row?.help_request_id ??
      row?.help_request?.id ??
      row?.helpRequest?.id ??
      null
    );
  };

  const getCategory = (row) => row?.category || "General campaign";

  const getLocation = (row) =>
    row?.locationName ||
    row?.location_name ||
    row?.location ||
    row?.district ||
    "";

  const getOrganization = (row) => {
    const organization =
      row?.organization ||
      row?.assignedOrganization ||
      row?.assigned_organization;

    if (typeof organization === "string") {
      return organization;
    }

    return (
      organization?.name ||
      row?.organizationName ||
      row?.organization_name ||
      ""
    );
  };

  const getStatus = (row) => {
    const normalized = String(row?.status || "unknown").toLowerCase();

    return (
      statusStyles[normalized] || {
        label: normalized.replace(/_/g, " "),
        text: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-200",
        dot: "bg-slate-400",
      }
    );
  };

  const getDate = (row, keys) => {
    const value = keys.map((key) => row?.[key]).find(Boolean);

    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStartDate = (row) =>
    getDate(row, ["start_date", "startDate", "campaign_start_date"]);

  const getEndDate = (row) =>
    getDate(row, ["end_date", "endDate", "campaign_end_date"]);

  const getCreatedDate = (row) => getDate(row, ["created_at", "createdAt"]);

  const getTarget = (row) => {
    const value = row?.target ?? row?.target_amount ?? row?.targetAmount;

    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `৳${numericValue.toLocaleString()}`;
  };

  const getCollected = (row) => {
    const value =
      row?.collected ?? row?.collected_amount ?? row?.collectedAmount;

    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `৳${numericValue.toLocaleString()}`;
  };

  const renderAction = (row) => {
    if (!actionColumn || typeof actionColumn.render !== "function") {
      return null;
    }

    return actionColumn.render(row?.[actionColumn.key], row);
  };

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="w-full overflow-hidden border-y border-border">
      {/* =========================================================
          TABLE HEADER
      ========================================================= */}

      <div
        className="
          sticky
          top-0
          z-30
          hidden
          bg-background-alt
          shadow-[0_1px_0_rgba(226,232,240,1)]
          lg:block
        ">
        <div
          className="
            grid
            grid-cols-[minmax(0,2.35fr)_minmax(180px,1.1fr)_minmax(230px,1.45fr)_minmax(150px,0.75fr)]
            border-b
            border-border
          ">
          {/* CAMPAIGN */}

          <div className="px-7 py-3.5 pl-8">
            {campaignColumn ? (
              <SortHeader
                column={campaignColumn}
                onSort={onSort}
                getSortIcon={getSortIcon}
              />
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                Campaign
              </span>
            )}
          </div>

          {/* CAMPAIGN SOURCE */}

          <div className="border-l border-border px-6 py-3.5">
            {typeColumn ? (
              <SortHeader
                column={{
                  ...typeColumn,
                  label: "Campaign source",
                }}
                onSort={onSort}
                getSortIcon={getSortIcon}
              />
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                Campaign source
              </span>
            )}
          </div>

          {/* CAMPAIGN STATUS */}

          <div className="border-l border-border px-6 py-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Campaign status
            </span>
          </div>

          {/* ACTIONS */}

          <div className="border-l border-border px-5 py-3.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Actions
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROWS
      ========================================================= */}

      <div>
        {!Array.isArray(rows) || rows.length === 0 ? (
          <div className="m-4 border border-dashed border-border bg-background px-6 py-16 text-center">
            <div className="text-sm font-semibold text-text-primary">
              No campaigns found
            </div>

            <p className="mt-1.5 text-xs text-text-secondary">
              Try changing your search or filter options.
            </p>
          </div>
        ) : (
          rows.map((row) => {
            const campaignType = getCampaignType(row);

            /*
             * This now correctly gets:
             *
             * Campaign #2 → HR #16
             * Campaign #4 → HR #13
             * Campaign #6 → HR #14
             * Campaign #7 → HR #17
             */

            const helpRequestId = getHelpRequestId(row);

            const category = getCategory(row);
            const location = getLocation(row);
            const organization = getOrganization(row);

            const status = getStatus(row);

            const startDate = getStartDate(row);
            const endDate = getEndDate(row);
            const createdDate = getCreatedDate(row);

            const target = getTarget(row);
            const collected = getCollected(row);

            return (
              <article
                key={row?.id}
                className="
                  group
                  relative
                  border-b
                  border-border
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
                {/* ACTIVE ROW ACCENT */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    z-20
                    w-0.5
                    bg-primary
                    opacity-0
                    transition-opacity
                    duration-150
                    group-hover:opacity-100
                  "
                />

                {/* =================================================
                    MAIN 4-COLUMN STRUCTURE
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[minmax(0,2.35fr)_minmax(180px,1.1fr)_minmax(230px,1.45fr)_minmax(150px,0.75fr)]
                  ">
                  {/* =================================================
                      COLUMN 1 — CAMPAIGN
                  ================================================= */}

                  <section className="min-w-0 px-7 py-5 pl-8">
                    <div className="min-w-0">
                      {/* CATEGORY / LOCATION */}

                      <div className="flex min-w-0 items-center gap-2">
                        {category && (
                          <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.13em] text-primary">
                            {category}
                          </span>
                        )}

                        {location && (
                          <>
                            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                            <span className="inline-flex min-w-0 items-center gap-1 text-[10px] font-medium text-slate-500">
                              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />

                              <span className="truncate">{location}</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* TITLE */}

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
                        {row?.title || "Untitled campaign"}
                      </h3>

                      {/* DESCRIPTION */}

                      {row?.description && (
                        <p
                          className="
                            mt-1.5
                            max-w-2xl
                            line-clamp-2
                            text-[11px]
                            leading-[1.65]
                            text-text-secondary
                          ">
                          {row.description}
                        </p>
                      )}
                    </div>

                    {/* FINANCIAL SUMMARY */}

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {target && (
                        <div className="inline-flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-slate-400" />

                          <div>
                            <span className="mr-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Target
                            </span>

                            <span className="text-[11px] font-semibold text-text-primary">
                              {target}
                            </span>
                          </div>
                        </div>
                      )}

                      {collected && (
                        <div className="inline-flex items-center gap-2">
                          <span className="h-3 w-px bg-slate-200" />

                          <div>
                            <span className="mr-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Collected
                            </span>

                            <span className="text-[11px] font-semibold text-text-primary">
                              {collected}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* =================================================
                      COLUMN 2 — CAMPAIGN SOURCE
                  ================================================= */}

                  <section
                    className="
                      border-t
                      border-border
                      px-6
                      py-5
                      lg:border-l
                      lg:border-t-0
                    ">
                    <div className="flex h-full flex-col justify-center">
                      {/* TYPE */}

                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Type 😎🥸
                        </span>

                        <p className="mt-1.5 text-[11.5px] font-semibold leading-5 text-text-primary">
                          {campaignType}
                        </p>

                        {/* =================================================
                            HR ID — LOCAL CASE ONLY
                        ================================================= */}

                        {row?.type === "local_case" && helpRequestId && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 border border-primary/10 bg-primary/[0.04] px-2 py-1">
                            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              HR ID
                            </span>

                            <span className="font-mono text-[10.5px] font-semibold text-primary">
                              #{helpRequestId}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ORGANIZATION */}

                      {organization && (
                        <div className="mt-4 border-t border-border pt-3">
                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Organization
                          </span>

                          <p
                            className="
                              mt-1.5
                              truncate
                              text-[11px]
                              font-medium
                              leading-5
                              text-primary
                            "
                            title={organization}>
                            {organization}
                          </p>
                        </div>
                      )}

                      {!organization && (
                        <div className="mt-4 border-t border-border pt-3">
                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Organization
                          </span>

                          <p className="mt-1.5 text-[11px] font-medium leading-5 text-slate-400">
                            Not assigned
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* =================================================
                      COLUMN 3 — CAMPAIGN STATUS
                  ================================================= */}

                  <section
                    className="
                      border-t
                      border-border
                      px-6
                      py-5
                      lg:border-l
                      lg:border-t-0
                    ">
                    <div className="flex h-full flex-col justify-center">
                      {/* CAMPAIGN PERIOD */}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3 w-3 text-slate-400" />

                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Campaign period
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10.5px] font-medium leading-5 text-text-primary">
                          <span>{startDate || "Start unavailable"}</span>

                          {endDate && (
                            <>
                              <span className="text-slate-300">→</span>

                              <span>{endDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* DIVIDER */}

                      <div className="my-4 h-px w-full bg-border" />

                      {/* STATUS */}

                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Status
                        </div>

                        <div className="mt-2">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[10px]
                              font-semibold
                              ${status.bg}
                              ${status.border}
                              ${status.text}
                            `}>
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${status.dot}
                              `}
                            />

                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* =================================================
                      COLUMN 4 — ACTIONS
                  ================================================= */}

                  <section
                    className="
                      border-t
                      border-border
                      px-5
                      py-5
                      lg:border-l
                      lg:border-t-0
                    ">
                    <div className="flex h-full items-center">
                      {actionColumn ? (
                        <div
                          className="
                            w-full

                            [&>div]:flex!
                            [&>div]:w-full!
                            [&>div]:flex-col!
                            [&>div]:items-stretch!
                            [&>div]:gap-0.5!

                            [&>div>button]:flex!
                            [&>div>button]:w-full!
                            [&>div>button]:items-center!
                            [&>div>button]:justify-start!

                            [&>div>button]:rounded-md!
                            [&>div>button]:border!
                            [&>div>button]:border-transparent!
                            [&>div>button]:px-2.5!
                            [&>div>button]:py-1.5!

                            [&>div>button]:text-left!
                            [&>div>button]:text-[10.5px]!
                            [&>div>button]:font-medium!
                            [&>div>button]:text-slate-600!

                            [&>div>button]:transition-all!
                            [&>div>button]:duration-150!

                            [&>div>button]:hover:border-border!
                            [&>div>button]:hover:bg-slate-50!
                            [&>div>button]:hover:text-primary!

                            [&>div>button]:focus-visible:outline-none!
                            [&>div>button]:focus-visible:ring-2!
                            [&>div>button]:focus-visible:ring-primary/20!
                          ">
                          {renderAction(row)}
                        </div>
                      ) : (
                        <div className="w-full py-2 text-[10.5px] font-medium text-slate-400">
                          No actions available
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer
                  className="
                    flex
                    h-8.5
                    items-center
                    justify-between
                    border-t
                    border-border
                    bg-background
                    px-5
                    pl-8
                    transition-colors
                    duration-150
                    group-hover:bg-surface
                  ">
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-[9.5px]
                      font-medium
                      text-slate-400
                    ">
                    <CalendarDays className="h-3 w-3" />

                    <span>
                      {createdDate
                        ? `Created ${createdDate}`
                        : "Creation date unavailable"}
                    </span>
                  </div>

                  {row?.id && (
                    <span className="font-mono text-[9.5px] font-medium text-slate-400">
                      #<span className="text-slate-600">{row.id}</span>
                    </span>
                  )}
                </footer>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Table;
