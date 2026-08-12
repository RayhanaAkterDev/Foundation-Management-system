import React from 'react';
import { Building2 } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const OrganizationTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
}) => {
    const enhancedColumns = columns.map((column) => {
        if (column.key === 'name') {
            return {
                ...column,
                render: (value, row) => {
                    const initials = value
                        ? value
                              .split(' ')
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()
                        : '?';

                    return (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                                {initials}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-text-primary">
                                    {value || '—'}
                                </p>

                                {row.registration_number && (
                                    <p className="mt-0.5 max-w-60 truncate text-xs text-text-secondary">
                                        Reg. {row.registration_number}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                },
            };
        }

        if (column.key === 'organization_type') {
            return {
                ...column,
                render: (value) => (
                    <span className="inline-flex items-center rounded-full bg-background-alt px-2.5 py-1 text-[11px] font-semibold capitalize text-text-secondary">
                        {value || 'Not specified'}
                    </span>
                ),
            };
        }

        if (column.key === 'contactEmail') {
            return {
                ...column,
                render: (value) => (
                    <span className="text-text-secondary">{value}</span>
                ),
            };
        }

        if (column.key === 'verification_status') {
            return {
                ...column,
                render: (value) => <StatusBadge status={value} />,
            };
        }

        if (column.key === 'registeredDate') {
            return {
                ...column,
                render: (value) => (
                    <span className="text-text-secondary">{value}</span>
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
                icon: Building2,
                title: 'No organizations found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default OrganizationTable;
