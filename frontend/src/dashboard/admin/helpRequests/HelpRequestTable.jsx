import React from 'react';
import { SlidersHorizontal, UserRound } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const HelpRequestTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onRequesterClick,
    onSetPriority,
}) => {
    const enhancedColumns = columns.map((column) => {
        // --------------------------------
        // Help Request
        // --------------------------------

        if (column.key === 'title') {
            return {
                ...column,

                render: (value, row) => (
                    <div className="min-w-0 max-w-80">
                        <p className="truncate font-semibold text-text-primary">
                            {value || 'Untitled request'}
                        </p>

                        {row.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                                {row.description}
                            </p>
                        )}
                    </div>
                ),
            };
        }

        // --------------------------------
        // Requester
        // --------------------------------

        if (column.key === 'requester' || column.key === 'requesterName') {
            return {
                ...column,

                render: (value, row) => {
                    const requester = row.user || row.requester;

                    if (!requester && !row.requesterId) {
                        return <span className="text-text-secondary">—</span>;
                    }

                    const name =
                        requester?.name ||
                        requester?.full_name ||
                        value ||
                        'Unknown user';

                    const email = requester?.email || row.requesterEmail;

                    const requesterId =
                        requester?.id || row.requesterId || row.user_id;

                    if (!requesterId) {
                        return (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-text-primary">
                                    {name}
                                </p>

                                {email && (
                                    <p className="mt-0.5 max-w-52 truncate text-xs text-text-secondary">
                                        {email}
                                    </p>
                                )}
                            </div>
                        );
                    }

                    return (
                        <button
                            type="button"
                            onClick={() => onRequesterClick?.(requesterId, row)}
                            className="group flex min-w-0 items-center gap-2.5 text-left"
                            title="View requester details"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <UserRound size={15} strokeWidth={1.8} />
                            </span>

                            <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-primary transition-colors group-hover:text-primary-hover group-hover:underline">
                                    {name}
                                </span>

                                {email && (
                                    <span className="mt-0.5 block max-w-52 truncate text-xs text-text-secondary">
                                        {email}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                },
            };
        }

        // --------------------------------
        // Category
        // --------------------------------

        if (column.key === 'category') {
            return {
                ...column,

                render: (value) => (
                    <span className="inline-flex items-center rounded-full bg-background-alt px-2.5 py-1 text-[11px] font-semibold capitalize text-text-secondary">
                        {value || 'Not specified'}
                    </span>
                ),
            };
        }

        // --------------------------------
        // Priority
        // --------------------------------

        if (column.key === 'priority' || column.key === 'urgency') {
            return {
                ...column,

                render: (value, row) => {
                    const priority =
                        value || row.priority || row.urgency || null;

                    const normalizedPriority = priority?.toLowerCase();

                    /*
                     * The backend/database uses "normal"
                     * as the default urgency value.
                     *
                     * In the admin workflow, "normal" means
                     * the admin has not explicitly set a
                     * priority yet.
                     */
                    const priorityNotSet =
                        !priority || normalizedPriority === 'normal';

                    const priorityStyles = {
                        critical: 'bg-red-50 text-red-600',

                        urgent: 'bg-red-50 text-red-600',

                        high: 'bg-orange-50 text-orange-600',

                        normal: 'bg-background-alt text-text-secondary',

                        low: 'bg-blue-50 text-blue-600',
                    };

                    return (
                        <div className="flex flex-col items-start gap-1.5">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                    priorityStyles[normalizedPriority] ||
                                    'bg-background-alt text-text-secondary'
                                }`}
                            >
                                {priorityNotSet ? 'Not set' : priority}
                            </span>

                            {/*
                                Priority can only be set or changed
                                after admin verification.
                            */}

                            {row.status === 'verified' && onSetPriority && (
                                <button
                                    type="button"
                                    onClick={() => onSetPriority(row)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                                >
                                    <SlidersHorizontal size={12} />

                                    {priorityNotSet
                                        ? 'Set priority'
                                        : 'Change priority'}
                                </button>
                            )}
                        </div>
                    );
                },
            };
        }

        // --------------------------------
        // Status
        // --------------------------------

        if (column.key === 'status') {
            return {
                ...column,

                render: (value) => <StatusBadge status={value} />,
            };
        }

        // --------------------------------
        // Submitted date
        // --------------------------------

        if (column.key === 'submittedDate') {
            return {
                ...column,

                render: (value) => (
                    <span className="whitespace-nowrap text-text-secondary">
                        {value || '—'}
                    </span>
                ),
            };
        }

        return column;
    });

    return (
        <DataTable
            columns={enhancedColumns}
            rows={rows}
            onSort={onSort}
            getSortIcon={getSortIcon}
            resultCount={resultCount}
            empty={{
                title: 'No help requests found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default HelpRequestTable;
