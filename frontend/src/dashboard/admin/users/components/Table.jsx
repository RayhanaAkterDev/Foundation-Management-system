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
                                {/* Avatar */}
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-primary/10
                                        text-[11px]
                                        font-bold
                                        text-primary
                                    "
                                >
                                    {initials}
                                </div>

                                {/* User identity */}
                                <div className="min-w-0">
                                    <p
                                        className="
                                            truncate
                                            font-semibold
                                            text-text-primary
                                        "
                                    >
                                        {value || '—'}
                                    </p>

                                    {row.email && (
                                        <p
                                            className="
                                                mt-0.5
                                                max-w-60
                                                truncate
                                                text-xs
                                                text-text-secondary
                                            "
                                        >
                                            {row.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    },
                };
            }

            if (column.key === 'role') {
                return {
                    ...column,

                    render: (value) => (
                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-md
                                bg-background-alt
                                px-2.5
                                py-1
                                text-[11px]
                                font-semibold
                                capitalize
                                text-text-secondary
                            "
                        >
                            {value === 'admin'
                                ? 'Administrator'
                                : value || '—'}
                        </span>
                    ),
                };
            }

            if (column.key === 'status') {
                return {
                    ...column,

                    render: (value) => <StatusBadge status={value} />,
                };
            }

            if (column.key === 'joinedDate') {
                return {
                    ...column,

                    render: (value) => (
                        <span className="text-text-secondary">
                            {value || '—'}
                        </span>
                    ),
                };
            }

            /*
             * Email verification
             *
             * Supports:
             * - email_verified_at
             * - emailVerifiedAt
             * - email_verified
             * - emailVerified
             *
             * Verification method is read from:
             * - verification_method
             * - verificationMethod
             */
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
                            row.email_verified ??
                            row.emailVerified ??
                            null;

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
                            <div className="flex items-center gap-2.5">
                                {isVerified ? (
                                    <CheckCircle2
                                        size={17}
                                        strokeWidth={2}
                                        className="shrink-0 text-emerald-600"
                                    />
                                ) : (
                                    <CircleAlert
                                        size={17}
                                        strokeWidth={2}
                                        className="shrink-0 text-amber-500"
                                    />
                                )}

                                <div className="min-w-0">
                                    <p
                                        className={`
                                            text-sm
                                            font-semibold
                                            ${
                                                isVerified
                                                    ? 'text-emerald-700'
                                                    : 'text-amber-700'
                                            }
                                        `}
                                    >
                                        {isVerified
                                            ? 'Verified'
                                            : 'Unverified'}
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[11px]
                                            text-text-secondary
                                        "
                                    >
                                        {isVerified
                                            ? methodLabel || 'Email'
                                            : methodLabel || 'Not verified'}
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
                        <div className="flex items-center justify-end gap-1">
                            {/* View */}
                            <button
                                type="button"
                                onClick={() => onView(row.id)}
                                title="View user"
                                className="
                                    inline-flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-md
                                    text-text-secondary
                                    transition-colors
                                    hover:bg-background-alt
                                    hover:text-primary
                                "
                            >
                                <Eye size={16} strokeWidth={1.8} />
                            </button>

                            {/* Edit */}
                            <button
                                type="button"
                                onClick={() => onEdit(row.id)}
                                title="Edit user"
                                className="
                                    inline-flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-md
                                    text-text-secondary
                                    transition-colors
                                    hover:bg-background-alt
                                    hover:text-primary
                                "
                            >
                                <Pencil size={16} strokeWidth={1.8} />
                            </button>

                            {/* Delete */}
                            <button
                                type="button"
                                onClick={() => onDelete(row)}
                                title="Delete user"
                                className="
                                    inline-flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-md
                                    text-text-secondary
                                    transition-colors
                                    hover:bg-red-50
                                    hover:text-red-600
                                "
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
                icon: Users,
                title: 'No users found',
                message: 'Try changing your search or filter options.',
            }}
        />
    );
};

export default Table;