import React from 'react';
import { Building2, CalendarDays, Users } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const CampaignTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onOrganizationClick,
    onAssignVolunteer,
}) => {
    const enhancedColumns = columns.map((column) => {
        // --------------------------------
        // Campaign
        // --------------------------------

        if (column.key === 'title') {
            return {
                ...column,

                render: (value, row) => (
                    <div className="min-w-0 max-w-80">
                        <p className="truncate font-semibold text-text-primary">
                            {value || 'Untitled campaign'}
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
        // Organization
        // --------------------------------

        if (
            column.key === 'organization' ||
            column.key === 'organizationName'
        ) {
            return {
                ...column,

                render: (value, row) => {
                    const organization =
                        row.organization || row.organizationData;

                    const organizationId =
                        organization?.id ||
                        row.organization_id ||
                        row.organizationId;

                    const name =
                        organization?.name || value || 'Unknown organization';

                    if (!organizationId) {
                        return (
                            <div className="min-w-0">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Building2
                                            size={15}
                                            strokeWidth={1.8}
                                        />
                                    </span>

                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-text-primary">
                                            {name}
                                        </span>
                                    </span>
                                </div>
                            </div>
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

                            <span className="min-w-0">
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
        // Campaign type
        // --------------------------------

        if (column.key === 'type') {
            return {
                ...column,

                render: (value) => {
                    const typeLabels = {
                        local_case: 'Local case',
                        organization_proposed: 'Organization proposed',
                        global_situation: 'Global situation',
                    };

                    return (
                        <span className="inline-flex items-center rounded-full bg-background-alt px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                            {typeLabels[value] || value || 'Not specified'}
                        </span>
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
        // Target amount
        // --------------------------------

        if (column.key === 'targetAmount' || column.key === 'target_amount') {
            return {
                ...column,

                render: (value) => (
                    <span className="whitespace-nowrap font-semibold text-text-primary">
                        {value !== null && value !== undefined && value !== ''
                            ? `৳${Number(value).toLocaleString()}`
                            : '—'}
                    </span>
                ),
            };
        }

        // --------------------------------
        // Collected amount
        // --------------------------------

        if (
            column.key === 'collectedAmount' ||
            column.key === 'collected_amount'
        ) {
            return {
                ...column,

                render: (value) => (
                    <span className="whitespace-nowrap font-semibold text-text-primary">
                        {value !== null && value !== undefined && value !== ''
                            ? `৳${Number(value).toLocaleString()}`
                            : '৳0'}
                    </span>
                ),
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
        // Start date
        // --------------------------------

        if (column.key === 'startDate' || column.key === 'start_date') {
            return {
                ...column,

                render: (value) => (
                    <div className="flex items-center gap-2 whitespace-nowrap text-text-secondary">
                        <CalendarDays
                            size={14}
                            strokeWidth={1.8}
                            className="shrink-0 text-text-secondary"
                        />

                        <span>{value || '—'}</span>
                    </div>
                ),
            };
        }

        // --------------------------------
        // End date
        // --------------------------------

        if (column.key === 'endDate' || column.key === 'end_date') {
            return {
                ...column,

                render: (value) => (
                    <div className="flex items-center gap-2 whitespace-nowrap text-text-secondary">
                        <CalendarDays
                            size={14}
                            strokeWidth={1.8}
                            className="shrink-0 text-text-secondary"
                        />

                        <span>{value || '—'}</span>
                    </div>
                ),
            };
        }

        // --------------------------------
        // Proposal date
        // --------------------------------

        if (column.key === 'proposalDate' || column.key === 'proposal_date') {
            return {
                ...column,

                render: (value) => (
                    <span className="whitespace-nowrap text-text-secondary">
                        {value || '—'}
                    </span>
                ),
            };
        }

        // --------------------------------
        // Volunteer assignment
        // --------------------------------

        if (
            column.key === 'volunteerAssignment' ||
            column.key === 'assignment'
        ) {
            return {
                ...column,

                render: (value, row) => {
                    const assignments =
                        row.volunteerAssignments ||
                        row.volunteer_assignments ||
                        [];

                    const activeAssignments = assignments.filter((assignment) =>
                        ['assigned', 'accepted', 'in_progress'].includes(
                            assignment.status,
                        ),
                    );

                    const assignmentCount = activeAssignments.length;

                    /*
                     * Backend only allows campaign volunteer
                     * assignment when campaign status is
                     * active or in_progress.
                     */

                    const canAssign =
                        ['active', 'in_progress'].includes(row.status) &&
                        onAssignVolunteer;

                    return (
                        <div className="flex flex-col items-start gap-1.5">
                            <div className="flex items-center gap-1.5">
                                <Users
                                    size={14}
                                    strokeWidth={1.8}
                                    className="text-text-secondary"
                                />

                                <span className="text-xs font-semibold text-text-primary">
                                    {assignmentCount > 0
                                        ? `${assignmentCount} assigned`
                                        : 'Not assigned'}
                                </span>
                            </div>

                            {canAssign && (
                                <button
                                    type="button"
                                    onClick={() => onAssignVolunteer(row)}
                                    className="text-[11px] font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                                >
                                    {assignmentCount > 0
                                        ? 'Assign another'
                                        : 'Assign volunteer'}
                                </button>
                            )}
                        </div>
                    );
                },
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
                title: 'No campaigns found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default CampaignTable;
