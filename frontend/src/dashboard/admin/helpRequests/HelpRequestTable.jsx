import React from 'react';
import { UserRound } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const HelpRequestTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onRequesterClick,
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
                            onClick={() => onRequesterClick(requesterId, row)}
                            className="group flex min-w-0 items-center gap-2.5 text-left"
                            title="View requester details"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <UserRound size={15} strokeWidth={1.8} />
                            </span>

                            <span className="min-w-0">
                                <span className="flex items-center gap-1.5">
                                    <span className="truncate text-sm font-semibold text-primary transition-colors group-hover:text-primary-hover group-hover:underline">
                                        {name}
                                    </span>
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
        // Urgency / Priority
        // --------------------------------

        if (column.key === 'urgency' || column.key === 'priority') {
            return {
                ...column,

                render: (value, row) => {
                    const urgency = value || row.urgency || row.priority;

                    const urgencyStyles = {
                        urgent: 'bg-red-50 text-red-600',
                        high: 'bg-orange-50 text-orange-600',
                        normal: 'bg-background-alt text-text-secondary',
                        low: 'bg-background-alt text-text-secondary',
                    };

                    return (
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                urgencyStyles[urgency] ||
                                'bg-background-alt text-text-secondary'
                            }`}
                        >
                            {urgency || 'Normal'}
                        </span>
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
