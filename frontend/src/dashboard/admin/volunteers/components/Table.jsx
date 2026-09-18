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

const getStatus = (volunteer) => {
    const status =
        volunteer?.status || volunteer?.volunteer_status || 'inactive';

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

const Table = ({ volunteers = [] }) => {
    return (
        <div className="min-w-215">
            {/* table header */}
            <div className="grid grid-cols-[minmax(280px,1.7fr)_minmax(190px,1fr)_minmax(150px,.8fr)_120px] border-b border-border bg-background-alt/70 px-5 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                    Volunteer
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                    Location
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                    Joined
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                    Status
                </div>
            </div>

            {/* table body */}
            {volunteers.length > 0 ? (
                <div className="divide-y divide-border">
                    {volunteers.map((volunteer) => {
                        const status = getStatus(volunteer);

                        const name =
                            volunteer?.user?.name ||
                            volunteer?.name ||
                            'Unnamed volunteer';

                        const email =
                            volunteer?.user?.email ||
                            volunteer?.email ||
                            'No email available';

                        const district =
                            volunteer?.district ||
                            volunteer?.user?.district ||
                            'Not provided';

                        const organization =
                            volunteer?.organization?.name ||
                            volunteer?.organization_name ||
                            null;

                        const joinedDate =
                            volunteer?.created_at || volunteer?.joined_at;

                        return (
                            <div
                                key={volunteer.id || volunteer.user_id || email}
                                className="grid grid-cols-[minmax(280px,1.7fr)_minmax(190px,1fr)_minmax(150px,.8fr)_120px] items-center px-5 py-4 transition-colors hover:bg-background"
                            >
                                {/* volunteer */}
                                <div className="flex min-w-0 items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-background-alt text-text-secondary">
                                        <UserRound
                                            size={18}
                                            strokeWidth={1.7}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] font-semibold text-text-primary">
                                            {name}
                                        </p>

                                        <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-text-secondary">
                                            <Mail
                                                size={12}
                                                strokeWidth={1.7}
                                                className="shrink-0"
                                            />

                                            <span className="truncate">
                                                {email}
                                            </span>
                                        </div>

                                        {organization && (
                                            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-text-secondary">
                                                <Building2
                                                    size={11}
                                                    strokeWidth={1.7}
                                                    className="shrink-0"
                                                />

                                                <span className="truncate">
                                                    {organization}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* location */}
                                <div className="min-w-0 pr-5">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={14}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-text-secondary"
                                        />

                                        <span className="truncate text-xs font-medium text-text-primary">
                                            {district}
                                        </span>
                                    </div>
                                </div>

                                {/* joined */}
                                <div className="flex items-center gap-2">
                                    <CalendarDays
                                        size={14}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-text-secondary"
                                    />

                                    <span className="text-xs font-medium text-text-primary">
                                        {formatDate(joinedDate)}
                                    </span>
                                </div>

                                {/* status */}
                                <div>
                                    <span
                                        className={`
                                            inline-flex items-center gap-2 border px-2.5 py-1.5
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
                                </div>
                            </div>
                        );
                    })}
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
                            No volunteer records match the current search and
                            filter settings.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
