import React from 'react';

import { Building2, CalendarDays, Mail, MapPin, UserRound } from 'lucide-react';

const statusStyles = {
    active: {
        label: 'Active',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        rail: 'bg-emerald-500',
    },

    pending: {
        label: 'Pending',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        rail: 'bg-amber-500',
    },

    inactive: {
        label: 'Inactive',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        rail: 'bg-slate-400',
    },

    rejected: {
        label: 'Rejected',
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
        rail: 'bg-red-500',
    },

    suspended: {
        label: 'Suspended',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
        rail: 'bg-orange-500',
    },

    removed: {
        label: 'Removed',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        rail: 'bg-slate-400',
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
            rail: 'bg-slate-400',
        }
    );
};

const Table = ({ columns = [], rows = [], resultCount = 0 }) => {
    const renderCell = (row, column) => {
        switch (column.key) {
            case 'serialNumber':
                return (
                    <span className="font-jost text-[12px] font-semibold text-slate-400">
                        {String(row.serialNumber).padStart(2, '0')}
                    </span>
                );

            case 'volunteerName':
                return (
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-slate-500">
                            <UserRound size={18} strokeWidth={1.7} />

                            <span className="absolute bottom-0 right-0 h-2 w-2 border-2 border-white bg-primary" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-slate-900">
                                {row.volunteerName ||
                                    row.user?.name ||
                                    'Unnamed volunteer'}
                            </p>

                            {row.organization ? (
                                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                                    <Building2
                                        size={11}
                                        strokeWidth={1.8}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <span className="truncate text-[10px] font-medium text-slate-500">
                                        {row.organization}
                                    </span>
                                </div>
                            ) : (
                                <p className="mt-1 text-[10px] font-medium text-slate-400">
                                    Independent volunteer
                                </p>
                            )}

                            {row.status === 'pending' && (
                                <p className="mt-1 text-[10px] font-semibold text-amber-600">
                                    Invitation sent
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-400">
                                <Mail size={13} strokeWidth={1.7} />
                            </div>

                            <span className="truncate text-[12px] font-medium text-slate-700">
                                {row.email ||
                                    row.user?.email ||
                                    'No email available'}
                            </span>
                        </div>
                    </div>
                );

            case 'district':
                return (
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-400">
                            <MapPin size={13} strokeWidth={1.7} />
                        </div>

                        <span className="truncate text-[12px] font-medium text-slate-700">
                            {row.district ||
                                row.user?.district ||
                                'Not provided'}
                        </span>
                    </div>
                );

            case 'organization':
                return row.organization ? (
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-400">
                            <Building2 size={13} strokeWidth={1.7} />
                        </div>

                        <span className="truncate text-[12px] font-medium text-slate-700">
                            {row.organization}
                        </span>
                    </div>
                ) : (
                    <span className="inline-flex items-center border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500">
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
                                className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {status.label}
                        </span>

                        {row.status === 'pending' && (
                            <span className="text-[10px] font-medium text-slate-400">
                                Awaiting response
                            </span>
                        )}
                    </div>
                );
            }

            case 'joinedDate':
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-400">
                            <CalendarDays size={13} strokeWidth={1.7} />
                        </div>

                        <span className="text-[12px] font-medium text-slate-700">
                            {formatDate(row.joinedDate || row.created_at)}
                        </span>
                    </div>
                );

            default:
                return (
                    <span className="text-xs text-slate-700">
                        {row[column.key] ?? '—'}
                    </span>
                );
        }
    };

    return (
        <div className="min-w-270 overflow-hidden bg-white">
            {/* =========================================================
                TABLE HEADER
            ========================================================== */}
            <div className="border-b border-slate-200 bg-slate-50/90">
                <div
                    className="
                        grid
                        grid-cols-[60px_minmax(280px,1.5fr)_minmax(220px,1.15fr)_minmax(150px,.8fr)_minmax(170px,.9fr)_130px_minmax(150px,.8fr)]
                        items-center
                        px-5
                    "
                >
                    {columns.map((column, index) => (
                        <div
                            key={column.key}
                            className={`
                                flex h-11 items-center
                                ${column.align === 'center' ? 'justify-center' : ''}
                                ${index === 0 ? 'pl-1' : ''}
                            `}
                        >
                            <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                                {column.header}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* =========================================================
                TABLE BODY
            ========================================================== */}
            {rows.length > 0 ? (
                <div>
                    {rows.map((row, index) => {
                        const status = getStatus(row.status);

                        return (
                            <div
                                key={
                                    row.id ||
                                    row.userId ||
                                    row.volunteerId ||
                                    row.requestId ||
                                    `${row.email}-${index}`
                                }
                                className="
                                    group relative
                                    border-b border-slate-100
                                    bg-white
                                    transition-colors
                                    hover:bg-slate-50/70
                                "
                            >
                                {/* Status rail */}
                                <span
                                    className={`
                                        absolute left-0 top-0 h-full w-0.5
                                        opacity-0 transition-opacity
                                        group-hover:opacity-100
                                        ${status.rail}
                                    `}
                                />

                                <div
                                    className="
                                        grid
                                        grid-cols-[60px_minmax(280px,1.5fr)_minmax(220px,1.15fr)_minmax(150px,.8fr)_minmax(170px,.9fr)_130px_minmax(150px,.8fr)]
                                        min-h-20
                                        items-center
                                        px-5
                                    "
                                >
                                    {columns.map((column) => (
                                        <div
                                            key={column.key}
                                            className={`
                                                min-w-0
                                                ${column.align === 'center' ? 'text-center' : ''}
                                            `}
                                        >
                                            {renderCell(row, column)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex min-h-80 items-center justify-center border-b border-slate-100 px-6">
                    <div className="max-w-sm text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
                            <UserRound size={21} strokeWidth={1.6} />
                        </div>

                        <p className="mt-5 text-sm font-bold text-slate-900">
                            No volunteers found
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
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
