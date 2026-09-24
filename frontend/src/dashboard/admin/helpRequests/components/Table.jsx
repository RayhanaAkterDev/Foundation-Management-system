import React from 'react';

import {
    Building2,
    CalendarDays,
    ChevronDown,
    MapPin,
    UserRound,
} from 'lucide-react';

const priorityStyles = {
    critical: {
        label: 'Critical',
        text: 'text-red-700',
        dot: 'bg-red-500',
    },
    urgent: {
        label: 'Urgent',
        text: 'text-orange-700',
        dot: 'bg-orange-700',
    },
    high: {
        label: 'High',
        text: 'text-amber-700',
        dot: 'bg-amber-700',
    },
    normal: {
        label: 'Normal',
        text: 'text-slate-600',
        dot: 'bg-slate-400',
    },
    low: {
        label: 'Low',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
    },
};

const statusStyles = {
    pending: {
        label: 'Pending',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
    verified: {
        label: 'Verified',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },
    rejected: {
        label: 'Rejected',
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
    completed: {
        label: 'Completed',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },
    assigned: {
        label: 'Assigned',
        text: 'text-sky-700',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
    },
    accepted: {
        label: 'Accepted',
        text: 'text-sky-700',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
    },
    in_progress: {
        label: 'In progress',
        text: 'text-indigo-700',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        dot: 'bg-indigo-500',
    },
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
            "
        >
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
                "
            >
                {getSortIcon?.(column.key) || (
                    <ChevronDown className="h-3 w-3" />
                )}
            </span>
        </button>
    );
};

const Table = ({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    onRequesterClick,
    onOrganizationClick,
    onSetPriority,
}) => {
    const requestColumn = columns.find((column) => column.key === 'title');

    const organizationColumn = columns.find(
        (column) => column.key === 'assignedOrganization',
    );

    /*
     * Find the actual action column instead of assuming
     * that actions are always attached to the `id` column.
     *
     * This supports:
     * - key: "actions"
     * - key: "action"
     * - key: "id"
     * - any other column containing a render function
     */
    const actionColumn =
        columns.find(
            (column) =>
                ['actions', 'action', 'id'].includes(column.key) &&
                typeof column.render === 'function',
        ) ||
        columns.find((column) => typeof column.render === 'function');

    const getPriority = (row) => {
        const value = row.priority || row.urgency || 'normal';

        const normalized = String(value).toLowerCase();

        return {
            value,
            style: priorityStyles[normalized] || priorityStyles.normal,
        };
    };

    const getRequester = (row) => {
        const requester = row.user || row.requester;

        return {
            name:
                requester?.name ||
                requester?.full_name ||
                row.requesterName ||
                'Unknown user',

            email: requester?.email || row.requesterEmail || '',

            id: requester?.id || row.requesterId || row.user_id || null,
        };
    };

    const getOrganization = (row) => {
        const organization =
            row.assignedOrganization || row.assigned_organization || null;

        const value = organizationColumn
            ? row[organizationColumn.key]
            : null;

        const name =
            typeof organization === 'string'
                ? organization
                : organization?.name ||
                  row.assignedOrganizationName ||
                  value ||
                  '';

        const id =
            row.assignedOrganizationId ||
            row.assigned_organization_id ||
            (typeof organization === 'object'
                ? organization?.id
                : null);

        return {
            name,
            id,
        };
    };

    const getSubmittedDate = (row) => {
        const value =
            row.submittedDate ||
            row.submitted_date ||
            row.created_at ||
            null;

        if (!value) return null;

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

    const getCategory = (row) =>
        row.category || row.needCategory || 'General need';

    const getLocation = (row) => row.district || row.location || '';

    /*
     * Render actions using the complete row.
     *
     * This is important for Edit/View handlers because they
     * usually need the entire help-request object.
     */
    const renderAction = (row) => {
        if (!actionColumn?.render) return null;

        const value =
            actionColumn.key && actionColumn.key in row
                ? row[actionColumn.key]
                : row.id;

        return actionColumn.render(value, row);
    };

    const getStatus = (row) => {
        const normalized = String(row.status || 'unknown').toLowerCase();

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

    return (
        <div className="w-full overflow-hidden border-y border-border">
            {/* =========================================================
                TABLE HEADER
            ========================================================= */}

            <div className="hidden bg-background-alt lg:block">
                <div className="grid grid-cols-[minmax(0,2.4fr)_minmax(250px,2fr)_minmax(150px,0.8fr)] border-b border-border">
                    {/* NEED */}

                    <div className="px-7 py-3.5 pl-8">
                        {requestColumn && (
                            <SortHeader
                                column={requestColumn}
                                onSort={onSort}
                                getSortIcon={getSortIcon}
                            />
                        )}
                    </div>

                    {/* REQUEST STATUS */}

                    <div className="border-l border-border px-7 py-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                            Request status
                        </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="border-l border-border px-6 py-3.5">
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
                            No help requests found
                        </div>

                        <p className="mt-1.5 text-xs text-text-secondary">
                            Try changing your search or filter options.
                        </p>
                    </div>
                ) : (
                    rows.map((row) => {
                        const requester = getRequester(row);

                        const priority = getPriority(row);

                        const submittedDate = getSubmittedDate(row);

                        const category = getCategory(row);

                        const location = getLocation(row);

                        const organization = getOrganization(row);

                        const status = getStatus(row);

                        return (
                            <article
                                key={row.id}
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
                                "
                            >
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
                                    MAIN 3-COLUMN STRUCTURE
                                ================================================= */}

                                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.4fr)_minmax(250px,2fr)_minmax(150px,0.8fr)]">
                                    {/* =================================================
                                        COLUMN 1 — NEED
                                    ================================================= */}

                                    <section className="min-w-0 px-7 py-5 pl-8">
                                        <div className="min-w-0">
                                            {/* CATEGORY / LOCATION */}

                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.13em] text-primary">
                                                    {category}
                                                </span>

                                                {location && (
                                                    <>
                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                                                        <span className="inline-flex min-w-0 items-center gap-1 text-[10px] font-medium text-slate-500">
                                                            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />

                                                            <span className="truncate">
                                                                {location}
                                                            </span>
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* TITLE */}

                                            <h3 className="mt-2 text-[14px] font-semibold leading-5 text-text-primary transition-colors duration-150 group-hover:text-primary">
                                                {row.title ||
                                                    'Untitled request'}
                                            </h3>

                                            {/* DESCRIPTION */}

                                            {row.description && (
                                                <p className="mt-1.5 max-w-2xl line-clamp-2 text-[11px] leading-[1.65] text-text-secondary">
                                                    {row.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* PRIORITY */}

                                        <div className="mt-4 flex items-center gap-2">
                                            <span
                                                className={`
                                                    h-1.5
                                                    w-1.5
                                                    shrink-0
                                                    rounded-full
                                                    ${priority.style.dot}
                                                `}
                                            />

                                            <span
                                                className={`
                                                    text-[10px]
                                                    font-semibold
                                                    ${priority.style.text}
                                                `}
                                            >
                                                {priority.style.label} priority
                                            </span>

                                            {row.status === 'verified' &&
                                                onSetPriority && (
                                                    <>
                                                        <span className="h-3 w-px bg-slate-200" />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onSetPriority(
                                                                    row,
                                                                )
                                                            }
                                                            className="
                                                                text-[10px]
                                                                font-semibold
                                                                text-primary
                                                                transition-colors
                                                                hover:text-primary-hover
                                                                hover:underline
                                                            "
                                                        >
                                                            {row.priority ||
                                                            row.urgency
                                                                ? 'Change'
                                                                : 'Set'}
                                                        </button>
                                                    </>
                                                )}
                                        </div>
                                    </section>

                                    {/* =================================================
                                        COLUMN 2 — REQUEST STATUS
                                    ================================================= */}

                                    <section className="border-t border-border px-7 py-5 lg:border-l lg:border-t-0">
                                        <div className="grid grid-cols-2 gap-x-7">
                                            {/* REQUESTER */}

                                            <div className="min-w-0">
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <UserRound className="h-3 w-3 text-slate-400" />

                                                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                        Requester
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={!requester.id}
                                                    onClick={() =>
                                                        requester.id &&
                                                        onRequesterClick?.(
                                                            requester.id,
                                                            row,
                                                        )
                                                    }
                                                    className="
                                                        group/requester
                                                        flex
                                                        min-w-0
                                                        max-w-full
                                                        items-center
                                                        gap-1.5
                                                        border-0
                                                        bg-transparent
                                                        p-0
                                                        text-left
                                                        disabled:cursor-default
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            min-w-0
                                                            truncate
                                                            text-[11.5px]
                                                            font-semibold
                                                            leading-5
                                                            text-text-primary
                                                            transition-colors
                                                            duration-150
                                                            group-hover/requester:text-primary
                                                        "
                                                    >
                                                        {requester.name}
                                                    </span>

                                                    {requester.id && (
                                                        <span
                                                            className="
                                                                flex
                                                                h-4
                                                                w-4
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded
                                                                text-slate-300
                                                                opacity-0
                                                                transition-all
                                                                duration-150
                                                                group-hover/requester:translate-x-0.5
                                                                group-hover/requester:text-primary
                                                                group-hover/requester:opacity-100
                                                            "
                                                        >
                                                            <ChevronDown className="h-3 w-3 -rotate-90" />
                                                        </span>
                                                    )}
                                                </button>

                                                {requester.email && (
                                                    <p className="mt-0.5 truncate text-[10px] leading-4 text-text-secondary">
                                                        {requester.email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ORGANIZATION */}

                                            <div className="min-w-0">
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <Building2 className="h-3 w-3 text-slate-400" />

                                                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                        Organization
                                                    </span>
                                                </div>

                                                {organization.name ? (
                                                    organization.id ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onOrganizationClick?.(
                                                                    organization.id,
                                                                    row,
                                                                )
                                                            }
                                                            className="
                                                                group/organization
                                                                flex
                                                                min-w-0
                                                                max-w-full
                                                                items-center
                                                                gap-1.5
                                                                border-0
                                                                bg-transparent
                                                                p-0
                                                                text-left
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                    min-w-0
                                                                    truncate
                                                                    text-[11.5px]
                                                                    font-semibold
                                                                    leading-5
                                                                    text-text-primary
                                                                    transition-colors
                                                                    duration-150
                                                                    group-hover/organization:text-primary
                                                                "
                                                            >
                                                                {
                                                                    organization.name
                                                                }
                                                            </span>

                                                            <span
                                                                className="
                                                                    flex
                                                                    h-4
                                                                    w-4
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded
                                                                    text-slate-300
                                                                    opacity-0
                                                                    transition-all
                                                                    duration-150
                                                                    group-hover/organization:translate-x-0.5
                                                                    group-hover/organization:text-primary
                                                                    group-hover/organization:opacity-100
                                                                "
                                                            >
                                                                <ChevronDown className="h-3 w-3 -rotate-90" />
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span
                                                            className="
                                                                block
                                                                max-w-full
                                                                truncate
                                                                text-[11.5px]
                                                                font-semibold
                                                                leading-5
                                                                text-text-primary
                                                            "
                                                        >
                                                            {
                                                                organization.name
                                                            }
                                                        </span>
                                                    )
                                                ) : (
                                                    <span
                                                        className="
                                                            block
                                                            text-[10.5px]
                                                            font-medium
                                                            leading-5
                                                            text-slate-400
                                                        "
                                                    >
                                                        Not assigned
                                                    </span>
                                                )}
                                            </div>

                                            {/* STATUS */}

                                            <div className="col-span-2 mt-4 flex items-center justify-between border-t border-border pt-3.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`
                                                            h-1.5
                                                            w-1.5
                                                            rounded-full
                                                            ${status.dot}
                                                        `}
                                                    />

                                                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                        Status
                                                    </span>
                                                </div>

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

                                    <section className="border-t border-border px-5 py-5 lg:border-l lg:border-t-0">
                                        <div className="flex h-full items-center">
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
                                                "
                                            >
                                                {renderAction(row)}
                                            </div>
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
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-[9.5px]
                                            font-medium
                                            text-slate-400
                                        "
                                    >
                                        <CalendarDays className="h-3 w-3" />

                                        <span>
                                            {submittedDate
                                                ? `Submitted ${submittedDate}`
                                                : 'Submission date unavailable'}
                                        </span>
                                    </div>

                                    {row.id && (
                                        <span className="font-mono text-[9.5px] font-medium text-slate-400">
                                            #
                                            <span className="text-slate-600">
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