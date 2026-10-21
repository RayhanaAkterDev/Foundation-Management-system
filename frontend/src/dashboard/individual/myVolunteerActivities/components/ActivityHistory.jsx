import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import DataTable from '@/components/dashboard/DataTable';
import { formatDate } from '../utils/volunteerHelpers';
import AssignmentStatusBadge from './AssignmentStatusBadge';

export default function ActivityHistory({ rows }) {
    const assignmentColumns = useMemo(
        () => [
            {
                key: 'campaign_title',
                header: 'Campaign',
                sortable: true,

                render: (value, row) => (
                    <div className="min-w-[240px]">
                        <p className="font-semibold text-[#E5EAF0]">
                            {row.campaign_title}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8792A1]">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />

                            <span>{row.location}</span>
                        </div>
                    </div>
                ),
            },

            {
                key: 'status',
                header: 'Status',
                sortable: true,

                render: (value, row) => {
                    return <AssignmentStatusBadge status={row?.status} />;
                },
            },

            {
                key: 'assigned_at',
                header: 'Assigned',
                sortable: true,

                render: (value, row) => (
                    <span className="whitespace-nowrap text-sm text-[#AAB3BF]">
                        {formatDate(row?.assigned_at)}
                    </span>
                ),
            },

            {
                key: 'response_at',
                header: 'Response',
                sortable: false,

                render: (value, row) => {
                    if (row?.status === 'rejected') {
                        return (
                            <div className="min-w-[130px]">
                                <p className="text-sm font-medium! text-[#E7A1A5]">
                                    Declined
                                </p>

                                {row?.rejection_reason && (
                                    <p
                                        className="mt-1 max-w-[220px] truncate text-xs text-[#8792A1]"
                                        title={row.rejection_reason}
                                    >
                                        {row.rejection_reason}
                                    </p>
                                )}
                            </div>
                        );
                    }

                    if (
                        [
                            'accepted',
                            'in_progress',
                            'completed',
                            'withdrawal_requested',
                            'withdrawn',
                        ].includes(row?.status)
                    ) {
                        return (
                            <span className="whitespace-nowrap text-sm font-medium! text-[#9AD1AE]">
                                Accepted
                            </span>
                        );
                    }

                    return (
                        <span className="text-sm text-[#788595]">
                            Awaiting response
                        </span>
                    );
                },
            },

            {
                key: 'completed_at',
                header: 'Completed',
                sortable: true,

                render: (value, row) => (
                    <span className="whitespace-nowrap text-sm text-[#AAB3BF]">
                        {formatDate(row?.completed_at)}
                    </span>
                ),
            },
        ],
        [],
    );

    return (
        <section className="min-w-0 space-y-4">
            <div>
                <h2 className="text-[19px] font-semibold tracking-tight text-[#EEF1F5]">
                    Activity history
                </h2>
                <p className="mt-1 text-[12px] text-[#8792A1]">
                    All campaign assignments and their current status.
                </p>
            </div>
            <div className="min-w-0 overflow-x-auto border border-[#29323E] bg-[#0E1219]">
                <DataTable columns={assignmentColumns} rows={rows} />
            </div>
        </section>
    );
}
