import React from 'react';
import { Building2, SlidersHorizontal, UserRound } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const HelpRequestTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onRequesterClick,
    onOrganizationClick,
    onSetPriority,
}) => {
    const enhancedColumns = columns.map((column) => {
        // --------------------------------
        // Help Request Details
        // --------------------------------
        if (column.key === 'title') {
            return {
                ...column,
                render: (value, row) => {
                    const requester = row.user || row.requester;

                    const requesterName =
                        requester?.name ||
                        requester?.full_name ||
                        row.requesterName ||
                        'Unknown user';

                    const requesterEmail =
                        requester?.email || row.requesterEmail || '';

                    const requesterId =
                        requester?.id || row.requesterId || row.user_id || null;

                    return (
                        <div className="w-105 min-w-95 max-w-105">
                            {/* Title */}
                            <p className="truncate text-sm font-semibold text-text-primary">
                                {value || 'Untitled request'}
                            </p>

                            {/* Description */}
                            {row.description && (
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                                    {row.description}
                                </p>
                            )}

                            {/* Category + District */}
                            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-text-secondary">
                                <span>
                                    <span className="font-semibold text-text-primary">
                                        Category:
                                    </span>{' '}
                                    {row.category || 'Not specified'}
                                </span>

                                <span className="text-border">•</span>

                                <span>
                                    <span className="font-semibold text-text-primary">
                                        District:
                                    </span>{' '}
                                    {row.district || 'Not specified'}
                                </span>
                            </div>

                            {/* Requester */}
                            <div className="mt-2">
                                {!requesterId ? (
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <UserRound
                                                size={13}
                                                strokeWidth={1.8}
                                            />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-text-primary">
                                                {requesterName}
                                            </p>

                                            {requesterEmail && (
                                                <p className="truncate text-[11px] text-text-secondary">
                                                    {requesterEmail}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRequesterClick?.(requesterId, row)
                                        }
                                        className="group flex min-w-0 items-center gap-2 text-left"
                                        title="View requester details"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                            <UserRound
                                                size={13}
                                                strokeWidth={1.8}
                                            />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block truncate text-xs font-semibold text-primary transition-colors group-hover:text-primary-hover group-hover:underline">
                                                {requesterName}
                                            </span>

                                            {requesterEmail && (
                                                <span className="block truncate text-[11px] text-text-secondary">
                                                    {requesterEmail}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                },
            };
        }

        // --------------------------------
        // Assigned Organization
        // --------------------------------
        if (column.key === 'assignedOrganization') {
            return {
                ...column,
                render: (value, row) => {
                    const organization =
                        row.assignedOrganization ||
                        row.assigned_organization ||
                        null;

                    const name =
                        typeof organization === 'string'
                            ? organization
                            : organization?.name || value;

                    const organizationId =
                        row.assignedOrganizationId ||
                        row.assigned_organization_id ||
                        (typeof organization === 'object'
                            ? organization?.id
                            : null);

                    if (!name || name === 'Not assigned') {
                        return (
                            <span className="whitespace-nowrap text-xs text-text-secondary">
                                Not assigned
                            </span>
                        );
                    }

                    if (!organizationId) {
                        return (
                            <span className="block min-w-42.5 max-w-55 truncate text-sm font-semibold text-text-primary">
                                {name}
                            </span>
                        );
                    }

                    return (
                        <button
                            type="button"
                            onClick={() =>
                                onOrganizationClick?.(organizationId, row)
                            }
                            className="group flex min-w-0 items-center gap-2.5 text-left"
                            title="View organization details"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <Building2 size={15} strokeWidth={1.8} />
                            </span>

                            <span className="min-w-0 max-w-47.5">
                                <span className="block truncate text-sm font-semibold text-primary transition-colors group-hover:text-primary-hover group-hover:underline">
                                    {name}
                                </span>
                            </span>
                        </button>
                    );
                },
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
                        <div className="flex min-w-25 flex-col items-start gap-1.5">
                            <span
                                className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                    priorityStyles[normalizedPriority] ||
                                    'bg-background-alt text-text-secondary'
                                }`}
                            >
                                {priorityNotSet ? 'Not set' : priority}
                            </span>

                            {row.status === 'verified' && onSetPriority && (
                                <button
                                    type="button"
                                    onClick={() => onSetPriority(row)}
                                    className="inline-flex whitespace-nowrap items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
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
                render: (value) => (
                    <div className="whitespace-nowrap">
                        <StatusBadge status={value} />
                    </div>
                ),
            };
        }

        // --------------------------------
        // Submitted Date
        // --------------------------------
        if (column.key === 'submittedDate') {
            return {
                ...column,
                render: (value) => (
                    <span className="whitespace-nowrap text-xs text-text-secondary">
                        {value || '—'}
                    </span>
                ),
            };
        }

        // --------------------------------
        // Actions
        // --------------------------------
        if (column.key === 'id') {
            return {
                ...column,
                render: (value, row) =>
                    column.render ? column.render(value, row) : null,
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
