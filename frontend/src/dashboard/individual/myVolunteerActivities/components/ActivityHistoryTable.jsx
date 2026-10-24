// ActivityHistoryTable.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowUpRight,
    CalendarDays,
    ClipboardList,
    MapPin,
} from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import { formatDate } from '../utils/volunteerHelpers';
import AssignmentStatusBadge from './AssignmentStatusBadge';

const CAMPAIGN_BASE = '/individual/dashboard/campaigns';

const getCampaignId = (row) =>
    row?.campaign_id ?? row?.campaign?.id ?? row?.campaignId ?? null;

const getCampaignPath = (row) => {
    const id = getCampaignId(row);

    if (id === null || id === undefined || id === '') {
        return null;
    }

    return `${CAMPAIGN_BASE}/${encodeURIComponent(id)}`;
};

const getCampaignTitle = (row) =>
    row?.campaign_title || row?.campaign?.title || 'Untitled campaign';

const getLocation = (row) =>
    row?.location ||
    row?.campaign?.location ||
    row?.campaign?.district ||
    'Location not specified';

function CampaignLink({ row, mobile = false }) {
    const path = getCampaignPath(row);
    const title = getCampaignTitle(row);

    const titleClass = mobile
        ? 'font-sans! text-[13px] font-semibold! leading-[1.65] text-[#EEF1F5]! sm:text-[14px]'
        : 'font-sans! text-[12px] font-semibold! leading-[1.6] text-[#EEF1F5]!';

    if (!path) {
        return (
            <span className={`block min-w-0 break-words ${titleClass}`}>
                {title}
            </span>
        );
    }

    return (
        <Link
            to={path}
            title={title}
            className="group/link inline-flex max-w-full min-w-0 items-start gap-1.5 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[#8EA9C0]"
        >
            <span
                className={`min-w-0 break-words transition-colors duration-200 group-hover/link:text-[#AFCBDF]! ${titleClass}`}
            >
                {title}
            </span>

            <ArrowUpRight
                size={mobile ? 15 : 14}
                strokeWidth={1.8}
                className="mt-1 shrink-0 text-[#718397] transition-all duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-[#AFCBDF]"
            />
        </Link>
    );
}

function Response({ row }) {
    const status = String(row?.status || '').toLowerCase();

    if (status === 'rejected') {
        return (
            <div className="min-w-0">
                <p className="font-sans! text-[11px] font-medium! text-[#E7A1A5]!">
                    Declined
                </p>

                {row?.rejection_reason && (
                    <p
                        title={row.rejection_reason}
                        className="mt-1 max-w-[220px] break-words font-sans! text-[11px] leading-[1.6] text-[#8792A1]!"
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
        ].includes(status)
    ) {
        return (
            <span className="font-sans! text-[11px] font-medium! text-[#9AD1AE]!">
                Accepted
            </span>
        );
    }

    return (
        <span className="font-sans! text-[11px] text-[#8792A1]!">
            Awaiting response
        </span>
    );
}

function MobileDetail({ label, children }) {
    return (
        <div className="min-w-0">
            <p className="font-sans! text-[10px] font-medium! text-[#8792A1]! sm:text-[11px]">
                {label}
            </p>

            <div className="mt-1.5 min-w-0 font-sans! text-[12px] font-medium! leading-[1.6] text-[#C8D2DD]!">
                {children}
            </div>
        </div>
    );
}

function MobileAssignment({ row, index }) {
    return (
        <article className="min-w-0 border-b border-[#29323E] bg-[#10161F] px-4 py-5 last:border-b-0 sm:px-5 sm:py-5">
            {/* CAMPAIGN INFORMATION */}
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#344150] bg-[#1C2834] text-[#9CACBE]">
                        <span className="font-sans! text-[11px] font-semibold! tabular-nums text-[#B9C9D8]!">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <CampaignLink row={row} mobile />

                        <div className="mt-2 flex min-w-0 items-start gap-1.5">
                            <MapPin
                                size={13}
                                strokeWidth={1.8}
                                className="mt-0.5 shrink-0 text-[#8792A1]"
                            />

                            <span className="min-w-0 break-words font-sans! text-[11px] leading-[1.6] text-[#94A2B2]!">
                                {getLocation(row)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="self-start pl-12 sm:shrink-0 sm:pl-0">
                    <AssignmentStatusBadge status={row?.status} />
                </div>
            </div>

            {/* ACTIVITY INFORMATION */}
            <div className="mt-4 grid min-w-0 grid-cols-2 gap-x-4 gap-y-4 border-t border-[#29323E] pt-4 sm:grid-cols-3 sm:gap-5">
                <MobileDetail label="Assigned on">
                    {formatDate(row?.assigned_at)}
                </MobileDetail>

                <MobileDetail label="Completed on">
                    {formatDate(row?.completed_at)}
                </MobileDetail>

                <div className="col-span-2 min-w-0 sm:col-span-1">
                    <MobileDetail label="Your response">
                        <Response row={row} />
                    </MobileDetail>
                </div>
            </div>
        </article>
    );
}

const columns = [
    {
        key: 'campaign_title',
        header: 'Campaign',
        sortable: true,
        width: 'minmax(230px, 2fr)',
        render: (_, row) => (
            <div className="min-w-0 max-w-[360px] py-0.5">
                <CampaignLink row={row} />

                <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
                    <MapPin
                        size={12}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#788899]"
                    />

                    <span className="truncate font-sans! text-[11px] text-[#8792A1]!">
                        {getLocation(row)}
                    </span>
                </div>
            </div>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        sortable: true,
        width: 'minmax(135px, 1fr)',
        render: (_, row) => <AssignmentStatusBadge status={row?.status} />,
    },
    {
        key: 'assigned_at',
        header: 'Assigned',
        sortable: true,
        width: 'minmax(115px, 1fr)',
        render: (_, row) => (
            <span className="whitespace-nowrap font-sans! text-[11px] text-[#AAB3BF]!">
                {formatDate(row?.assigned_at)}
            </span>
        ),
    },
    {
        key: 'response_at',
        header: 'Response',
        sortable: false,
        width: 'minmax(125px, 1fr)',
        render: (_, row) => <Response row={row} />,
    },
    {
        key: 'completed_at',
        header: 'Completed',
        sortable: true,
        width: 'minmax(115px, 1fr)',
        render: (_, row) => (
            <span className="whitespace-nowrap font-sans! text-[11px] text-[#AAB3BF]!">
                {formatDate(row?.completed_at)}
            </span>
        ),
    },
];

export default function ActivityHistoryTable({
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
}) {
    const safeRows = Array.isArray(rows) ? rows : [];

    return (
        <div className="min-w-0 overflow-hidden bg-[#0E1219]">
            {/* MOBILE & TABLET */}
            <div className="min-w-0 lg:hidden">
                {safeRows.length > 0 ? (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29323E] bg-[#111821] px-4 py-3 sm:px-5">
                            <div className="flex items-center gap-2">
                                <ClipboardList
                                    size={15}
                                    strokeWidth={1.8}
                                    className="text-[#9AABBC]"
                                />

                                <span className="font-sans! text-[11px] font-medium! text-[#C5D0DC]!">
                                    Assignment history
                                </span>
                            </div>

                            <span className="font-sans! text-[11px] tabular-nums text-[#8792A1]!">
                                {resultCount ?? safeRows.length} results
                            </span>
                        </div>

                        <div className="min-w-0">
                            {safeRows.map((row, index) => (
                                <MobileAssignment
                                    key={
                                        row?.id ??
                                        `${row?.campaign_id ?? getCampaignTitle(row)}-${index}`
                                    }
                                    row={row}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-[230px] flex-col items-center justify-center px-5 py-10 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#303A47] bg-[#19232D]">
                            <ClipboardList
                                size={20}
                                strokeWidth={1.6}
                                className="text-[#94A2B2]"
                            />
                        </div>

                        <p className="mt-4 font-sans! text-[13px] font-semibold! text-[#EEF1F5]!">
                            No assignments found
                        </p>

                        <p className="mt-1.5 max-w-[260px] font-sans! text-[11px] leading-[1.7] text-[#8792A1]!">
                            Try changing your search or filter options.
                        </p>
                    </div>
                )}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden min-w-0 lg:block">
                <DataTable
                    columns={columns}
                    rows={safeRows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
                    empty={{
                        icon: CalendarDays,
                        title: 'No assignments found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </div>
    );
}
