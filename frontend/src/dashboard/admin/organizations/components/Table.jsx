import React from 'react';

import DataTable from '@/components/dashboard/DataTable';

import StatusBadge from '@/components/dashboard/StatusBadge';

import { Building2, Eye, Pencil, Trash2, ShieldCheck } from 'lucide-react';

const Table = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onView,
    onReview,
    onEdit,
    onDelete,
}) => {
    const enhancedColumns = columns.map((column) => {
        if (column.key === 'name') {
            return {
                ...column,
                render: (value, row) => (
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-text-primary">
                            {value || '—'}
                        </p>

                        {row.contactEmail && (
                            <p className="mt-0.5 max-w-60 truncate text-xs text-text-secondary">
                                {row.contactEmail}
                            </p>
                        )}
                    </div>
                ),
            };
        }

        if (column.key === 'registration_number') {
            return {
                ...column,
                render: (value) => (
                    <span className="font-medium text-text-secondary">
                        {value || '—'}
                    </span>
                ),
            };
        }

        if (column.key === 'organization_type') {
            return {
                ...column,
                render: (value) => (
                    <span className="inline-flex items-center rounded-md bg-background-alt px-2.5 py-1 text-[11px] font-semibold capitalize text-text-secondary">
                        {value || 'Not specified'}
                    </span>
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
                    <span className="text-text-secondary">{value || '—'}</span>
                ),
            };
        }

        if (column.key === 'actions') {
            return {
                ...column,
                render: (_, row) => (
                    <div className="flex items-center justify-end gap-1">
                        {row.verification_status === 'pending' && (
                            <button
                                type="button"
                                onClick={() => onReview(row)}
                                title="Review organization"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-alt hover:text-primary"
                            >
                                <ShieldCheck size={16} strokeWidth={1.8} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onView(row.id)}
                            title="View organization"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-alt hover:text-primary"
                        >
                            <Eye size={16} strokeWidth={1.8} />
                        </button>

                        {row.verification_status !== 'rejected' && (
                            <button
                                type="button"
                                onClick={() => onEdit(row.id)}
                                title="Edit organization"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-alt hover:text-primary"
                            >
                                <Pencil size={16} strokeWidth={1.8} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onDelete(row)}
                            title="Delete organization"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 size={16} strokeWidth={1.8} />
                        </button>
                    </div>
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

export default Table;
