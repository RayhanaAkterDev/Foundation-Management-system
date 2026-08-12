import React from 'react';
import { Building2 } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const VerificationBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
        verified:
            'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
        rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
    };

    const labels = {
        pending: 'Pending',
        verified: 'Verified',
        rejected: 'Rejected',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                styles[status] || 'bg-background-alt text-text-secondary'
            }`}
        >
            {labels[status] || status || 'Unknown'}
        </span>
    );
};

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
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-bold text-primary">
                                {initials}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-text-primary">
                                    {value || '—'}
                                </p>

                                {row.contactEmail && (
                                    <p className="mt-0.5 max-w-64 truncate text-xs text-text-secondary">
                                        {row.contactEmail}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                },
            };
        }

        if (column.key === 'type') {
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
                    <span className="text-text-secondary">{value || '—'}</span>
                ),
            };
        }

        if (column.key === 'registeredDate') {
            return {
                ...column,
                render: (value) => (
                    <span className="text-text-secondary">{value || '—'}</span>
                ),
            };
        }

        if (column.key === 'verificationStatus') {
            return {
                ...column,
                render: (value) => <VerificationBadge status={value} />,
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
