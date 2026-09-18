import React from 'react';

import { Building2, CalendarDays, Mail, MapPin, UserRound } from 'lucide-react';

const statusStyles = {
    active: {
        label: 'Active',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
    },

    pending: {
        label: 'Pending',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },

    inactive: {
        label: 'Inactive',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
    },

    rejected: {
        label: 'Rejected',
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },

    suspended: {
        label: 'Suspended',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
    },

    removed: {
        label: 'Removed',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
    },
};

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const getStatus = (value) => {
    const status = typeof value === 'string' ? value.toLowerCase() : 'inactive';

    return (
        statusStyles[status] || {
            label: status.charAt(0).toUpperCase() + status.slice(1),
            text: 'text-slate-600',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            dot: 'bg-slate-400',
        }
    );
};

const Table = ({ columns = [], rows = [], resultCount = 0 }) => {
    const renderCell = (row, column) => {
        switch (column.key) {
            case 'serialNumber':
                return (
                    <span className="text-xs font-semibold text-text-secondary">
                        {row.serialNumber}
                    </span>
                );

            case 'volunteerName':
                return (
                    <div className="flex min-w-0 items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-background-alt text-text-secondary">
                            <UserRound size={18} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-text-primary">
                                {row.volunteerName ||
                                    row.user?.name ||
                                    'Unnamed volunteer'}
                            </p>

                            {row.organization && (
                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-text-secondary">
                                    <Building2
                                        size={11}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                    />

                                    <span className="truncate">
                                        {row.organization}
                                    </span>
                                </div>
                            )}

                            {row.status === 'pending' && (
                                <p className="mt-1 text-[10px] font-medium text-amber-700">
                                    Volunteer invitation sent
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="flex min-w-0 items-center gap-2">
                        <Mail
                            size={14}
                            strokeWidth={1.7}
                            className="shrink-0 text-text-secondary"
                        />

                        <span className="truncate text-xs font-medium text-text-primary">
                            {row.email ||
                                row.user?.email ||
                                'No email available'}
                        </span>
                    </div>
                );

            case 'district':
                return (
                    <div className="flex min-w-0 items-center gap-2">
                        <MapPin
                            size={14}
                            strokeWidth={1.7}
                            className="shrink-0 text-text-secondary"
                        />

                        <span className="truncate text-xs font-medium text-text-primary">
                            {row.district ||
                                row.user?.district ||
                                'Not provided'}
                        </span>
                    </div>
                );

            case 'organization':
                return row.organization ? (
                    <div className="flex min-w-0 items-center gap-2">
                        <Building2
                            size={14}
                            strokeWidth={1.7}
                            className="shrink-0 text-text-secondary"
                        />

                        <span className="truncate text-xs font-medium text-text-primary">
                            {row.organization}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-text-secondary">
                        Independent
                    </span>
                );

            case 'status': {
                const status = getStatus(row.status);

                return (
                    <div className="flex flex-col items-start gap-1.5">
                        <span
                            className={`
                                inline-flex items-center gap-2
                                border px-2.5 py-1.5
                                text-[10px] font-bold uppercase tracking-[0.08em]
                                ${status.bg}
                                ${status.border}
                                ${status.text}
                            `}
                        >
                            <span
                                className={`
                                    h-1.5 w-1.5 rounded-full
                                    ${status.dot}
                                `}
                            />

                            {status.label}
                        </span>

                        {row.status === 'pending' && (
                            <span className="text-[10px] font-medium text-text-secondary">
                                Awaiting response
                            </span>
                        )}
                    </div>
                );
            }

            case 'joinedDate':
                return (
                    <div className="flex items-center gap-2">
                        <CalendarDays
                            size={14}
                            strokeWidth={1.7}
                            className="shrink-0 text-text-secondary"
                        />

                        <span className="text-xs font-medium text-text-primary">
                            {formatDate(row.joinedDate || row.created_at)}
                        </span>
                    </div>
                );

            default:
                return (
                    <span className="text-xs text-text-primary">
                        {row[column.key] ?? '—'}
                    </span>
                );
        }
    };

    return (
        <div className="min-w-270">
            {/* Table header */}

            <div
                className="
                    grid
                    grid-cols-[minmax(280px,1.5fr)_minmax(220px,1.15fr)_minmax(150px,.8fr)_minmax(170px,.9fr)_130px_minmax(150px,.8fr)]
                    border-b border-border
                    bg-background-alt/70
                    px-5 py-3
                "
            >
                {columns.map((column) => (
                    <div
                        key={column.key}
                        className={`
                            text-[10px] font-bold uppercase
                            tracking-[0.14em] text-text-secondary
                            ${column.align === 'center' ? 'text-center' : ''}
                        `}
                    >
                        {column.header}
                    </div>
                ))}
            </div>

            {/* Table body */}

            {rows.length > 0 ? (
                <div className="divide-y divide-border">
                    {rows.map((row, index) => (
                        <div
                            key={
                                row.id ||
                                row.userId ||
                                row.volunteerId ||
                                row.requestId ||
                                `${row.email}-${index}`
                            }
                            className="
                                grid
                                grid-cols-[minmax(60px,.3fr)_minmax(280px,1.5fr)_minmax(220px,1.15fr)_minmax(150px,.8fr)_minmax(170px,.9fr)_130px_minmax(150px,.8fr)]
                                items-center
                                px-5 py-4
                                transition-colors
                                hover:bg-background
                            "
                        >
                            {columns.map((column) => (
                                <div
                                    key={column.key}
                                    className={
                                        column.align === 'center'
                                            ? 'text-center'
                                            : ''
                                    }
                                >
                                    {renderCell(row, column)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex min-h-72 items-center justify-center px-6">
                    <div className="max-w-sm text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center bg-background-alt text-text-secondary">
                            <UserRound size={19} strokeWidth={1.7} />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-text-primary">
                            No volunteers found
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                            {resultCount === 0
                                ? 'No volunteer records or pending invitations match the current search and filter settings.'
                                : 'No volunteers are available on this page.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
