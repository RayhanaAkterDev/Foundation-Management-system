// Table.jsx

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowUpRight, ClipboardList, Megaphone, Users } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const CAMPAIGN_BASE = '/organization/dashboard/campaigns';

const getCampaignId = (row) =>
    row?.campaign_id ??
    row?.campaignId ??
    row?.campaign?.id ??
    row?.campaign_details?.id ??
    null;

const getCampaignName = (row) => {
    const campaign = row?.campaign;

    if (typeof campaign === 'string' && campaign.trim()) {
        return campaign;
    }

    return (
        row?.campaign_title ||
        row?.campaign_name ||
        campaign?.title ||
        campaign?.name ||
        row?.campaign_details?.title ||
        'Campaign not specified'
    );
};

const getCampaignPath = (row) => {
    const id = getCampaignId(row);

    if (id === null || id === undefined || id === '') {
        return null;
    }

    return `${CAMPAIGN_BASE}/${encodeURIComponent(id)}`;
};

const getVolunteerName = (row) => row?.name || 'Unknown volunteer';

const getVolunteerEmail = (row) => row?.email || 'No email address';

const VolunteerAvatar = ({ row, mobile = false }) => {
    const [failedPhoto, setFailedPhoto] = useState(null);

    const photo = row?.photo;
    const name = getVolunteerName(row);

    return (
        <div
            className={`shrink-0 overflow-hidden rounded-[6px] border border-[#34404D] bg-[#202B38] ${
                mobile ? 'h-11 w-11' : 'h-9 w-9'
            }`}
        >
            {photo && failedPhoto !== photo ? (
                <img
                    src={photo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedPhoto(photo)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div
                    className={`flex h-full w-full items-center justify-center font-sans! font-semibold! uppercase text-[#C3CFDA]! ${
                        mobile ? 'text-[14px]' : 'text-[12px]'
                    }`}
                >
                    {name.trim().charAt(0).toUpperCase() || 'V'}
                </div>
            )}
        </div>
    );
};

const VolunteerIdentity = ({ row }) => (
    <div className="flex min-w-0 max-w-[300px] items-center gap-3">
        <VolunteerAvatar row={row} />

        <div className="min-w-0 flex-1">
            <p
                title={getVolunteerName(row)}
                className="truncate font-sans! text-[12px] font-semibold! leading-5 text-[#EEF1F5]!"
            >
                {getVolunteerName(row)}
            </p>

            <p
                title={getVolunteerEmail(row)}
                className="mt-0.5 truncate font-sans! text-[11px] leading-4 text-[#8792A1]!"
            >
                {getVolunteerEmail(row)}
            </p>
        </div>
    </div>
);

const CampaignCell = ({ row, mobile = false }) => {
    const campaignName = getCampaignName(row);
    const campaignPath = getCampaignPath(row);

    const content = (
        <>
            <Megaphone
                size={mobile ? 15 : 14}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-[#8792A1] transition-colors group-hover/campaign:text-[#AFCBDF]"
            />

            <span
                className={`min-w-0 break-words font-sans! font-medium! leading-[1.6] transition-colors ${
                    mobile
                        ? 'text-[12px] text-[#D7E0E9]!'
                        : 'text-[12px] text-[#C2CBD6]!'
                } group-hover/campaign:text-[#B9D8EC]!`}
            >
                {campaignName}
            </span>

            {campaignPath && (
                <ArrowUpRight
                    size={14}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-[#728598] transition-all duration-200 group-hover/campaign:-translate-y-0.5 group-hover/campaign:translate-x-0.5 group-hover/campaign:text-[#B9D8EC]"
                />
            )}
        </>
    );

    if (!campaignPath) {
        return <div className="flex min-w-0 items-start gap-2">{content}</div>;
    }

    return (
        <Link
            to={campaignPath}
            title={`View ${campaignName}`}
            className="group/campaign inline-flex max-w-full min-w-0 items-start gap-2 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[#9ABCCF]"
        >
            {content}
        </Link>
    );
};

const MobileRow = ({ row, index }) => (
    <article className="min-w-0 border-b border-[#29323E] bg-[#10161F] px-4 py-5 transition-colors last:border-b-0 hover:bg-[#151D27] sm:px-5">
        {/* VOLUNTEER IDENTITY */}
        <div className="flex min-w-0 items-start gap-3">
            <VolunteerAvatar row={row} mobile />

            <div className="min-w-0 flex-1 pt-0.5">
                <p className="break-words font-sans! text-[13px] font-semibold! leading-[1.5] text-[#EEF1F5]! sm:text-[14px]">
                    {getVolunteerName(row)}
                </p>

                <p className="mt-1 break-all font-sans! text-[11px] leading-[1.5] text-[#8792A1]!">
                    {getVolunteerEmail(row)}
                </p>
            </div>

            <span className="hidden shrink-0 font-sans! text-[11px] tabular-nums text-[#697586]! sm:block">
                {String(index + 1).padStart(2, '0')}
            </span>
        </div>

        {/* CAMPAIGN + STATUS */}
        <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 border-t border-[#29323E] pt-4 min-[420px]:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
                <p className="mb-2 font-sans! text-[10px] font-medium! uppercase tracking-[0.08em] text-[#8792A1]!">
                    Assigned campaign
                </p>

                <CampaignCell row={row} mobile />
            </div>

            <div className="min-w-0 min-[420px]:text-right">
                <p className="mb-2 font-sans! text-[10px] font-medium! uppercase tracking-[0.08em] text-[#8792A1]!">
                    Status
                </p>

                <div className="inline-flex max-w-full">
                    <StatusBadge status={row?.status || 'assigned'} />
                </div>
            </div>
        </div>
    </article>
);

export default function Table({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    resultCount = 0,
}) {
    const safeRows = Array.isArray(rows) ? rows : [];

    const enhancedColumns = useMemo(
        () =>
            columns.map((column) => {
                if (column.key === 'name') {
                    return {
                        ...column,
                        render: (_, row) => <VolunteerIdentity row={row} />,
                    };
                }

                if (column.key === 'campaign') {
                    return {
                        ...column,
                        render: (_, row) => <CampaignCell row={row} />,
                    };
                }

                if (column.key === 'status') {
                    return {
                        ...column,
                        render: (value) => (
                            <div className="whitespace-nowrap">
                                <StatusBadge status={value || 'assigned'} />
                            </div>
                        ),
                    };
                }

                return column;
            }),
        [columns],
    );

    return (
        <div className="min-w-0 overflow-hidden bg-[#0E1219]">
            {/* MOBILE AND TABLET VIEW */}
            <div className="min-w-0 lg:hidden">
                {safeRows.length > 0 ? (
                    <>
                        {/* COMPACT TABLE HEADING */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29323E] bg-[#111821] px-4 py-3 sm:px-5">
                            <div className="flex items-center gap-2">
                                <ClipboardList
                                    size={15}
                                    strokeWidth={1.8}
                                    className="text-[#9AABBC]"
                                />

                                <span className="font-sans! text-[11px] font-medium! text-[#C5D0DC]!">
                                    Volunteer assignments
                                </span>
                            </div>

                            <span className="font-sans! text-[11px] tabular-nums text-[#8792A1]!">
                                {resultCount} results
                            </span>
                        </div>

                        {/* RESPONSIVE ASSIGNMENT ROWS */}
                        <div className="min-w-0">
                            {safeRows.map((row, index) => (
                                <MobileRow
                                    key={
                                        row?.id ??
                                        `${row?.email || 'volunteer'}-${index}`
                                    }
                                    row={row}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-10 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[7px] border border-[#303A47] bg-[#19232D]">
                            <Users
                                size={20}
                                strokeWidth={1.7}
                                className="text-[#94A2B2]"
                            />
                        </div>

                        <p className="mt-4 font-sans! text-[13px] font-semibold! text-[#EEF1F5]!">
                            No volunteers found
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
                    columns={enhancedColumns}
                    rows={safeRows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
                    empty={{
                        icon: Users,
                        title: 'No volunteers found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </div>
    );
}
