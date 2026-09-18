import React from 'react';

import { CalendarDays, ChevronDown, MapPin, Target } from 'lucide-react';

const statusStyles = {
    unverified: {
        label: 'Unverified',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },

    active: {
        label: 'Active',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },

    completed: {
        label: 'Completed',
        text: 'text-sky-700',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
    },

    rejected: {
        label: 'Rejected',
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },

    cancelled: {
        label: 'Cancelled',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
    },
};

const campaignTypeLabels = {
    local_case: 'Local Case',
    organization_proposed: 'Organization Proposed',
    global_situation: 'Global Situation',
};

const SortHeader = ({ column, onSort, getSortIcon }) => {
    if (!column) {
        return null;
    }

    const sortable = column.sortable !== false;

    const getColumnLabel = (value) =>
        value?.label || value?.header || value?.title || value?.key;

    if (!sortable) {
        return (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
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
                font-semibold
                uppercase
                tracking-widest
                text-text-secondary
                transition-colors
                hover:text-text-primary
            "
        >
            <span>{getColumnLabel(column)}</span>

            <span
                className="
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    text-slate-400
                    transition-colors
                    group-hover/header:text-primary
                "
            >
                {getSortIcon?.(column.key) || (
                    <ChevronDown className="h-3 w-3" />
                )}
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

    const campaignColumn = columns.find((column) => column.key === 'title');

    const typeColumn = columns.find(
        (column) =>
            column.key === 'campaignType' ||
            column.key === 'campaign_type' ||
            column.key === 'type',
    );

    /*
     * IMPORTANT:
     *
     * Do NOT simply search for the first column with a render
     * function. Campaign type / status / other columns may also
     * have render functions.
     *
     * Prefer an explicitly named actions column.
     */
    const actionColumn =
        columns.find((column) => {
            const key = String(column?.key || '').toLowerCase();

            return key === 'actions' || key === 'action';
        }) || columns.find((column) => column?.isActionColumn === true);

    /*
     * ---------------------------------------------------------
     * HELPERS
     * ---------------------------------------------------------
     */

    const getCampaignType = (row) => {
        const value =
            row?.campaignType || row?.campaign_type || row?.type || '';

        return campaignTypeLabels[value] || value || 'Campaign';
    };

    const getCategory = (row) => row?.category || 'General campaign';

    const getLocation = (row) =>
        row?.locationName ||
        row?.location_name ||
        row?.location ||
        row?.district ||
        '';

    const getOrganization = (row) => {
        const organization =
            row?.organization ||
            row?.assignedOrganization ||
            row?.assigned_organization;

        if (typeof organization === 'string') {
            return organization;
        }

        return (
            organization?.name ||
            row?.organizationName ||
            row?.organization_name ||
            ''
        );
    };

    const getStatus = (row) => {
        const normalized = String(row?.status || 'unknown').toLowerCase();

        return (
            statusStyles[normalized] || {
                label: normalized.replace(/_/g, ' '),
                text: 'text-slate-600',
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                dot: 'bg-slate-400',
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
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStartDate = (row) =>
        getDate(row, ['start_date', 'startDate', 'campaign_start_date']);

    const getEndDate = (row) =>
        getDate(row, ['end_date', 'endDate', 'campaign_end_date']);

    const getCreatedDate = (row) => getDate(row, ['created_at', 'createdAt']);

    const getTarget = (row) => {
        const value = row?.target ?? row?.target_amount ?? row?.targetAmount;

        if (value === null || value === undefined || value === '') {
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

        if (value === null || value === undefined || value === '') {
            return null;
        }

        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
            return String(value);
        }

        return `৳${numericValue.toLocaleString()}`;
    };

    const renderAction = (row) => {
        if (!actionColumn || typeof actionColumn.render !== 'function') {
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
        <div className="w-full bg-background-alt">
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="hidden border-y border-border bg-surface lg:block">
                <div className="grid grid-cols-[35fr_25fr_15fr]">
                    {/* CAMPAIGN */}

                    <div className="px-7 py-3.5 pl-9">
                        {campaignColumn ? (
                            <SortHeader
                                column={campaignColumn}
                                onSort={onSort}
                                getSortIcon={getSortIcon}
                            />
                        ) : (
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                                Campaign
                            </span>
                        )}
                    </div>

                    {/* STATUS */}

                    <div className="border-l border-border px-7 py-3.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                            Campaign status
                        </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="border-l border-border px-6 py-3.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                            Actions
                        </span>
                    </div>
                </div>
            </div>

            {/* =================================================
                ROWS
            ================================================= */}

            <div>
                {rows.length === 0 ? (
                    <div className="mx-3 border border-border bg-surface px-6 py-16 text-center">
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
                                    bg-surface
                                    transition-all
                                    duration-200
                                    ease-out
                                    hover:bg-white
                                    hover:shadow-[0_10px_28px_-20px_rgba(15,23,42,0.55)]
                                "
                            >
                                {/* LEFT HOVER ACCENT */}

                                <span
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        left-0
                                        z-20
                                        w-0.75
                                        origin-center
                                        scale-y-0
                                        bg-primary
                                        opacity-0
                                        transition-all
                                        duration-200
                                        ease-out
                                        group-hover:scale-y-100
                                        group-hover:opacity-100
                                    "
                                />

                                {/* =================================================
                                    MAIN 3-COLUMN STRUCTURE
                                ================================================= */}

                                <div className="grid grid-cols-1 lg:grid-cols-[35fr_25fr_15fr]">
                                    {/* =================================================
                                        COLUMN 1 — CAMPAIGN
                                    ================================================= */}

                                    <section className="flex min-w-0 flex-col px-7 py-6 pl-9">
                                        <div className="min-w-0">
                                            {/* TYPE / CATEGORY / LOCATION */}

                                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                                                <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-primary">
                                                    {campaignType}
                                                </span>

                                                {category && (
                                                    <>
                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                                                        <span className="text-[10px] font-medium text-text-secondary">
                                                            {category}
                                                        </span>
                                                    </>
                                                )}

                                                {location && (
                                                    <>
                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                                                        <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-text-secondary">
                                                            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />

                                                            <span className="truncate">
                                                                {location}
                                                            </span>
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* TITLE */}

                                            <h3
                                                className="
                                                    mt-2.5
                                                    text-[15px]
                                                    font-semibold
                                                    leading-[1.45]
                                                    tracking-[-0.01em]
                                                    text-text-primary
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-primary
                                                "
                                            >
                                                {row?.title ||
                                                    'Untitled campaign'}
                                            </h3>

                                            {/* DESCRIPTION */}

                                            {row?.description && (
                                                <p
                                                    className="
                                                        mt-2.5
                                                        max-w-2xl
                                                        line-clamp-2
                                                        text-[11.5px]
                                                        leading-[1.7]
                                                        text-text-secondary
                                                    "
                                                >
                                                    {row.description}
                                                </p>
                                            )}

                                            {/* ORGANIZATION */}

                                            {organization && (
                                                <div className="mt-4">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                        Organization
                                                    </span>

                                                    <p className="mt-1 text-[11.5px] font-medium text-text-primary">
                                                        {organization}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* FINANCIAL SUMMARY */}

                                        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                                            {target && (
                                                <div className="inline-flex items-center gap-2">
                                                    <Target className="h-3.5 w-3.5 text-slate-400" />

                                                    <div>
                                                        <span className="mr-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
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
                                                        <span className="mr-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
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
                                        COLUMN 2 — STATUS
                                    ================================================= */}

                                    <section className="border-t border-border px-7 py-6 lg:border-l lg:border-t-0">
                                        <div className="flex h-full flex-col justify-center">
                                            {/* CAMPAIGN TYPE */}

                                            <div>
                                                <div className="mb-2">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                        Campaign type
                                                    </span>
                                                </div>

                                                <span className="text-[12.5px] font-semibold leading-5 text-text-primary">
                                                    {typeColumn
                                                        ? row?.[
                                                              typeColumn.key
                                                          ] || campaignType
                                                        : campaignType}
                                                </span>
                                            </div>

                                            {/* PERIOD */}

                                            <div className="mt-5 border-t border-border pt-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                        Campaign period
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-medium text-text-primary">
                                                    <span>
                                                        {startDate ||
                                                            'Start date unavailable'}
                                                    </span>

                                                    {endDate && (
                                                        <>
                                                            <span className="text-slate-300">
                                                                →
                                                            </span>

                                                            <span>
                                                                {endDate}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* STATUS */}

                                            <div className="mt-5 border-t border-border pt-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span
                                                        className={`
                                                            h-2
                                                            w-2
                                                            rounded-full
                                                            ${status.dot}
                                                        `}
                                                    />

                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                        Current status
                                                    </span>
                                                </div>

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-md
                                                        border
                                                        px-2.5
                                                        py-1.5
                                                        text-[11px]
                                                        font-semibold
                                                        ${status.bg}
                                                        ${status.border}
                                                        ${status.text}
                                                    `}
                                                >
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
                                    </section>

                                    {/* =================================================
                                        COLUMN 3 — ACTIONS
                                    ================================================= */}

                                    <section className="border-t border-border px-6 py-5 lg:border-l lg:border-t-0">
                                        <div className="flex h-full items-center">
                                            {actionColumn ? (
                                                <div
                                                    className="
                                                        w-full
                                                        [&>div]:flex
                                                        [&>div]:w-full
                                                        [&>div]:flex-col
                                                        [&>div]:items-stretch
                                                        [&>div]:gap-1
                                                        [&>div>button]:flex
                                                        [&>div>button]:w-full
                                                        [&>div>button]:items-center
                                                        [&>div>button]:justify-start
                                                        [&>div>button]:rounded-md
                                                        [&>div>button]:px-3
                                                        [&>div>button]:py-2
                                                        [&>div>button]:text-left
                                                        [&>div>button]:text-[11.5px]
                                                        [&>div>button]:font-medium
                                                        [&>div>button]:transition-all
                                                        [&>div>button]:duration-150
                                                        [&>div>button]:hover:bg-slate-50
                                                        [&>div>button]:hover:text-primary
                                                        [&>div>button]:focus-visible:outline-none
                                                        [&>div>button]:focus-visible:ring-2
                                                        [&>div>button]:focus-visible:ring-primary/20
                                                    "
                                                >
                                                    {renderAction(row)}
                                                </div>
                                            ) : (
                                                <div className="w-full py-2 text-[11px] text-slate-400">
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
                                        h-9
                                        items-center
                                        justify-between
                                        border-t
                                        border-border
                                        bg-slate-50/40
                                        px-5
                                        pl-9
                                        transition-colors
                                        duration-200
                                        group-hover:bg-primary/2.5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-[10px]
                                            font-medium
                                            text-slate-400
                                        "
                                    >
                                        <CalendarDays className="h-3 w-3" />

                                        <span>
                                            {createdDate
                                                ? `Created ${createdDate}`
                                                : 'Creation date unavailable'}
                                        </span>
                                    </div>

                                    {row?.id && (
                                        <span className="text-[10px] font-medium text-slate-400">
                                            #
                                            <span className="font-semibold text-slate-600">
                                                {row.id}
                                            </span>
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
