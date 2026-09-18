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
        dot: 'bg-orange-500',
    },
    high: {
        label: 'High',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
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

const Table = ({
    columns,
    rows,
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

    const actionColumn = columns.find((column) => column.key === 'id');

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

        const value = organizationColumn ? row[organizationColumn.key] : null;

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
            (typeof organization === 'object' ? organization?.id : null);

        return {
            name,
            id,
        };
    };

    const getSubmittedDate = (row) => {
        const value =
            row.submittedDate || row.submitted_date || row.created_at || null;

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

    const renderAction = (row) => {
        if (!actionColumn?.render) return null;

        return actionColumn.render(row[actionColumn.key], row);
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
        <div className="w-full bg-background-alt">
            {/* =========================================================
                TABLE HEADER
            ========================================================= */}

            <div className="hidden border-y border-border bg-surface lg:block">
                <div className="grid grid-cols-[35fr_25fr_15fr]">
                    {/* NEED */}

                    <div className="px-7 py-3.5 pl-9">
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
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
                            Request status
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

            {/* =========================================================
                ROWS
            ========================================================= */}

            <div>
                {rows.length === 0 ? (
                    <div className="mx-3 border border-border bg-surface px-6 py-16 text-center">
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
                                        COLUMN 1 — NEED
                                    ================================================= */}

                                    <section className="flex min-w-0 flex-col px-7 py-6 pl-9">
                                        <div className="min-w-0">
                                            {/* CATEGORY + LOCATION */}

                                            <div className="flex items-center gap-2.5">
                                                <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-primary">
                                                    {category}
                                                </span>

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

                                            <h3 className="mt-2.5 text-[15px] font-semibold leading-[1.45] tracking-[-0.01em] text-text-primary transition-colors duration-200 group-hover:text-primary">
                                                {row.title ||
                                                    'Untitled request'}
                                            </h3>

                                            {/* DESCRIPTION */}

                                            {row.description && (
                                                <p className="mt-2.5 max-w-2xl line-clamp-2 text-[11.5px] leading-[1.7] text-text-secondary">
                                                    {row.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* PRIORITY */}

                                        <div className="mt-auto pt-6">
                                            <div className="flex items-center gap-2">
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
                                                        text-[10.5px]
                                                        font-semibold
                                                        ${priority.style.text}
                                                    `}
                                                >
                                                    {priority.style.label}{' '}
                                                    priority
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
                                        </div>
                                    </section>

                                    {/* =================================================
                                        COLUMN 2 — REQUEST STATUS
                                    ================================================= */}

                                    <section className="border-t border-border px-7 py-6 lg:border-l lg:border-t-0">
                                        <div className="flex h-full flex-col justify-center">
                                            {/* REQUESTER */}

                                            <div>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <UserRound className="h-3.5 w-3.5 text-slate-400" />

                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
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
                                                        block
                                                        max-w-full
                                                        text-left
                                                        transition-colors
                                                        disabled:cursor-default
                                                    "
                                                >
                                                    <span
                                                        className="
                                                        block
                                                        truncate
                                                        text-[12.5px]
                                                        font-semibold
                                                        leading-5
                                                        text-text-primary
                                                        transition-colors
                                                        hover:text-primary
                                                    "
                                                    >
                                                        {requester.name}
                                                    </span>

                                                    {requester.email && (
                                                        <span className="mt-0.5 block truncate text-[10.5px] leading-4 text-text-secondary">
                                                            {requester.email}
                                                        </span>
                                                    )}
                                                </button>
                                            </div>

                                            {/* ORGANIZATION */}

                                            <div className="mt-5 border-t border-border pt-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Building2 className="h-3.5 w-3.5 text-slate-400" />

                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                        Assigned organization
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
                                                                block
                                                                max-w-full
                                                                text-left
                                                            "
                                                        >
                                                            <span
                                                                className="
                                                                block
                                                                truncate
                                                                text-[12.5px]
                                                                font-semibold
                                                                leading-5
                                                                text-text-primary
                                                                transition-colors
                                                                hover:text-primary
                                                            "
                                                            >
                                                                {
                                                                    organization.name
                                                                }
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span
                                                            className="
                                                            block
                                                            max-w-full
                                                            truncate
                                                            text-[12.5px]
                                                            font-semibold
                                                            leading-5
                                                            text-text-primary
                                                        "
                                                        >
                                                            {organization.name}
                                                        </span>
                                                    )
                                                ) : (
                                                    <span
                                                        className="
                                                        block
                                                        text-[11.5px]
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
                                            <div
                                                className="
                                                    w-full

                                                    [&>div]:flex!
                                                    [&>div]:w-full!
                                                    [&>div]:flex-col!
                                                    [&>div]:items-stretch!
                                                    [&>div]:gap-1!

                                                    [&>div>button]:flex!
                                                    [&>div>button]:w-full!
                                                    [&>div>button]:items-center!
                                                    [&>div>button]:justify-start!

                                                    [&>div>button]:rounded-md!
                                                    [&>div>button]:px-3!
                                                    [&>div>button]:py-2!

                                                    [&>div>button]:text-left!
                                                    [&>div>button]:text-[11.5px]!
                                                    [&>div>button]:font-medium!

                                                    [&>div>button]:transition-all!
                                                    [&>div>button]:duration-150!

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
                                            {submittedDate
                                                ? `Submitted ${submittedDate}`
                                                : 'Submission date unavailable'}
                                        </span>
                                    </div>

                                    {row.id && (
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
