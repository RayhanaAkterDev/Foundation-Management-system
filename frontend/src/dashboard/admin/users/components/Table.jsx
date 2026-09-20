import React from 'react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

import {
    Users,
    Eye,
    Pencil,
    Trash2,
    CheckCircle2,
    CircleAlert,
    ShieldCheck,
} from 'lucide-react';

const Table = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onView,
    onEdit,
    onDelete,
}) => {
    const enhancedColumns = columns
        .filter((column) => column.key !== 'email')
        .map((column) => {
            if (column.key === 'name') {
                return {
                    ...column,
                    render: (value, row) => (
                        <div className="min-w-0 max-w-[260px]">
                            <p className="truncate text-[13px] font-semibold leading-5 text-text-primary">
                                {value || 'Unnamed user'}
                            </p>

                            {row.email && (
                                <p className="mt-0.5 truncate text-[11px] leading-4 text-text-secondary">
                                    {row.email}
                                </p>
                            )}
                        </div>
                    ),
                };
            }

            if (column.key === 'role') {
                return {
                    ...column,
                    render: (value) => (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <ShieldCheck
                                size={15}
                                strokeWidth={1.8}
                                className="shrink-0 text-text-secondary"
                            />

                            <span className="text-[12px] font-medium capitalize text-text-primary">
                                {value === 'admin'
                                    ? 'Administrator'
                                    : value || '—'}
                            </span>
                        </div>
                    ),
                };
            }

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

            if (column.key === 'joinedDate') {
                return {
                    ...column,
                    render: (value) => (
                        <div className="whitespace-nowrap">
                            <p className="text-[12px] font-medium leading-5 text-text-primary">
                                {value || '—'}
                            </p>

                            {value && (
                                <p className="text-[10px] leading-4 text-text-secondary">
                                    Joined
                                </p>
                            )}
                        </div>
                    ),
                };
            }

            if (
                column.key === 'emailVerification' ||
                column.key === 'email_verified_at' ||
                column.key === 'emailVerified'
            ) {
                return {
                    ...column,
                    render: (_, row) => {
                        const verifiedAt =
                            row.email_verified_at ??
                            row.emailVerifiedAt ??
                            null;

                        const verifiedValue =
                            row.email_verified ?? row.emailVerified ?? null;

                        const isVerified =
                            Boolean(verifiedAt) ||
                            verifiedValue === true ||
                            verifiedValue === 1 ||
                            verifiedValue === '1' ||
                            verifiedValue === 'verified';

                        const method =
                            row.verification_method ??
                            row.verificationMethod ??
                            null;

                        const methodLabel = method
                            ? String(method)
                                  .replace(/_/g, ' ')
                                  .replace(/\b\w/g, (char) =>
                                      char.toUpperCase(),
                                  )
                            : null;

                        return (
                            <div className="flex min-w-[125px] items-center gap-2">
                                {isVerified ? (
                                    <CheckCircle2
                                        size={16}
                                        strokeWidth={2}
                                        className="shrink-0 text-emerald-600"
                                    />
                                ) : (
                                    <CircleAlert
                                        size={16}
                                        strokeWidth={2}
                                        className="shrink-0 text-amber-500"
                                    />
                                )}

                                <div className="min-w-0">
                                    <p
                                        className={`
                                            truncate
                                            text-[12px]
                                            font-semibold
                                            leading-4
                                            ${
                                                isVerified
                                                    ? 'text-emerald-700'
                                                    : 'text-amber-700'
                                            }
                                        `}
                                    >
                                        {isVerified ? 'Verified' : 'Unverified'}
                                    </p>

                                    <p className="mt-0.5 truncate text-[10px] leading-4 text-text-secondary">
                                        {isVerified
                                            ? methodLabel || 'Email'
                                            : methodLabel ||
                                              'Verification pending'}
                                    </p>
                                </div>
                            </div>
                        );
                    },
                };
            }

            if (column.key === 'actions') {
                return {
                    ...column,

                    render: (_, row) => (
                        <div className="flex items-center justify-end gap-0.5">
                            <button
                                type="button"
                                onClick={() => onView(row.id)}
                                title="View"
                                aria-label="View"
                                className="
                                    flex h-8 w-8 shrink-0 items-center
                                    justify-center rounded-md
                                    text-text-secondary
                                    transition-colors
                                    hover:bg-primary/8
                                    hover:text-primary
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            >
                                <Eye size={16} strokeWidth={1.8} />
                            </button>

                            <button
                                type="button"
                                onClick={() => onEdit(row.id)}
                                title="Edit"
                                aria-label="Edit"
                                className="
                                    flex h-8 w-8 shrink-0 items-center
                                    justify-center rounded-md
                                    text-text-secondary
                                    transition-colors
                                    hover:bg-primary/8
                                    hover:text-primary
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-primary/20
                                "
                            >
                                <Pencil size={15} strokeWidth={1.8} />
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(row)}
                                title="Delete"
                                aria-label="Delete"
                                className="
                                    flex h-8 w-8 shrink-0 items-center
                                    justify-center rounded-md
                                    text-text-secondary
                                    transition-colors
                                    hover:bg-red-50
                                    hover:text-red-600
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-red-200
                                "
                            >
                                <Trash2 size={15} strokeWidth={1.8} />
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
                icon: Users,
                title: 'No users found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default Table;
