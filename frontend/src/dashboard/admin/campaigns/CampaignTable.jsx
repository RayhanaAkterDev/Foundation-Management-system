import React from 'react';
import { Building2, MapPin } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const CampaignTable = ({ columns, rows, onSort, getSortIcon, resultCount }) => {
    const enhancedColumns = columns.map((column) => {
        // --------------------------------
        // Campaign
        // --------------------------------

        if (column.key === 'title') {
            return {
                ...column,

                render: (value, row) => (
                    <div className="min-w-0 max-w-80">
                        {/* Campaign title */}

                        <p className="truncate font-semibold text-text-primary">
                            {value || 'Untitled campaign'}
                        </p>

                        {/* Description */}

                        {row.description && (
                            <p className="mt-1 line-clamp-1 text-xs leading-5 text-text-secondary">
                                {row.description}
                            </p>
                        )}

                        {/* Category + Location */}

                        {(row.category || row.location) && (
                            <div className="mt-1.5 flex min-w-0 items-center gap-2 text-[10px] text-text-secondary">
                                {row.category && (
                                    <span className="truncate font-semibold capitalize">
                                        {row.category}
                                    </span>
                                )}

                                {row.category && row.location && (
                                    <span className="text-border">•</span>
                                )}

                                {row.location && (
                                    <span className="flex min-w-0 items-center gap-1 truncate">
                                        <MapPin
                                            size={11}
                                            strokeWidth={1.8}
                                            className="shrink-0"
                                        />

                                        <span className="truncate">
                                            {row.location}
                                        </span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ),
            };
        }

        // --------------------------------
        // Type
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
                            {typeLabels[value] || value || '—'}
                        </span>
                    );
                },
            };
        }

        // --------------------------------
        // Organization
        // --------------------------------

        if (column.key === 'organization') {
            return {
                ...column,

                render: (value, row) => {
                    const organization = row.organization || value;

                    const organizationName =
                        typeof organization === 'object'
                            ? organization?.name
                            : organization;

                    if (!organizationName) {
                        return <span className="text-text-secondary">—</span>;
                    }

                    return (
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Building2 size={14} strokeWidth={1.8} />
                            </span>

                            <span className="min-w-0 truncate text-sm font-semibold text-text-primary">
                                {organizationName}
                            </span>
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
        // Target Amount
        // --------------------------------

        if (column.key === 'target_amount') {
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
        // Collected Amount
        // --------------------------------

        if (column.key === 'collected_amount') {
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
