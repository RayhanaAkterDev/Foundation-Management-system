import React, { useState } from 'react';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
    Users,
    Eye,
    UserRoundCog,
    CheckCircle2,
    CircleAlert,
} from 'lucide-react';

const getName = (row) =>
    row.volunteerName || row.user?.name || row.name || 'Unnamed volunteer';
const getEmail = (row) => row.email || row.user?.email || 'No email address';
const getPhoto = (row) => row.user?.photo || row.photo || null;

const VolunteerAvatar = ({ row, mobile = false }) => {
    const [failed, setFailed] = useState(null);
    const photo = getPhoto(row);
    const name = getName(row);
    return (
        <div
            className={`relative shrink-0 overflow-hidden border border-[#29323E] bg-[#151B24] ${mobile ? 'h-10 w-10' : 'h-8 w-8'}`}
        >
            {photo && failed !== photo ? (
                <img
                    src={photo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(photo)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div
                    className={`flex h-full w-full items-center justify-center font-semibold! uppercase text-[#B8C0CA] ${mobile ? 'text-[12px]' : 'text-[10px]'}`}
                >
                    {name.trim().charAt(0).toUpperCase() || 'V'}
                </div>
            )}
        </div>
    );
};

const Availability = ({ value }) => {
    const normalized = String(value ?? '').toLowerCase();
    const available = normalized === 'available';
    const unknown = normalized === 'unknown';
    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            {available ? (
                <CheckCircle2
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8EC5A3]"
                />
            ) : (
                <CircleAlert
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#8792A1]"
                />
            )}
            <span
                className={`text-[11px] font-medium! ${available ? 'text-[#A2CBB0]' : 'text-[#8792A1]'}`}
            >
                {unknown
                    ? 'Not specified'
                    : available
                      ? 'Available'
                      : 'Unavailable'}
            </span>
        </div>
    );
};

const Actions = ({ row, onView, onEdit, mobile = false }) => (
    <div
        className={`flex items-center ${mobile ? 'gap-2' : 'justify-end gap-0.5'} whitespace-nowrap`}
    >
        {[
            { label: 'View', Icon: Eye, action: onView },
            { label: 'Manage status', Icon: UserRoundCog, action: onEdit },
        ].map(({ label, Icon, action }) => (
            <button
                key={label}
                type="button"
                onClick={() => action?.(row.id)}
                title={
                    label === 'Manage status'
                        ? `Manage status for ${getName(row)}`
                        : `View ${getName(row)}`
                }
                aria-label={`${label} ${getName(row)}`}
                className={
                    mobile
                        ? 'inline-flex h-8 items-center justify-center gap-1.5 border border-[#29323E] bg-[#151B24] px-2.5 text-[11px] font-medium! text-[#AEB7C3] transition-colors hover:border-[#394555] hover:bg-[#1A222D] hover:text-[#EEF1F5] focus:outline-none focus:ring-0'
                        : 'inline-flex h-7 w-7 shrink-0 items-center justify-center border border-transparent bg-transparent text-[#8792A1] transition-colors hover:border-[#303A47] hover:bg-[#1A222D] hover:text-[#EEF1F5] focus:outline-none focus:ring-0'
                }
            >
                <Icon size={mobile ? 13 : 14} strokeWidth={1.8} />
                {mobile && (label === 'Manage status' ? 'Status' : label)}
            </button>
        ))}
    </div>
);

const MobileVolunteerRow = ({ row, onView, onEdit }) => (
    <article className="border-b border-[#202832] bg-[#0E1219] px-4 py-4 transition-colors last:border-b-0 hover:bg-[#111720]">
        <button
            type="button"
            onClick={() => onView?.(row.id)}
            className="flex w-full min-w-0 items-center gap-3 text-left focus:outline-none focus:ring-0"
        >
            <VolunteerAvatar row={row} mobile />
            <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold! leading-5 text-[#F1F3F6]">
                    {getName(row)}
                </p>
                <p className="mt-0.5 truncate text-[12px] leading-[18px] text-[#7F8A99]">
                    {getEmail(row)}
                </p>
            </div>
        </button>
        <div className="mt-3 ml-[52px] flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={row.status || 'inactive'} />
            <span
                aria-hidden="true"
                className="h-1 w-1 shrink-0 rounded-full bg-[#36404C]"
            />
            <Availability value={row.availability} />
        </div>
        <div className="mt-3 ml-[52px] flex items-center border-t border-[#1B232D] pt-3">
            <Actions row={row} onView={onView} onEdit={onEdit} mobile />
        </div>
    </article>
);

const Table = ({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
    onView,
    onEdit,
}) => {
    const enhancedColumns = columns
        .filter(
            (column) =>
                ![
                    'serialNumber',
                    'district',
                    'organization',
                    'joinedDate',
                    'email',
                ].includes(column.key),
        )
        .map((column) => {
            if (column.key === 'volunteerName')
                return {
                    ...column,
                    render: (value, row) => (
                        <div className="flex min-w-0 max-w-70 items-center gap-3">
                            <VolunteerAvatar row={row} />
                            <div className="min-w-0">
                                <button
                                    type="button"
                                    onClick={() => onView?.(row.id)}
                                    title={value || getName(row)}
                                    className="block max-w-full truncate text-left text-[12px] font-semibold! leading-5 text-[#EEF1F5] transition-colors hover:text-white focus:outline-none focus:ring-0"
                                >
                                    {value || getName(row)}
                                </button>
                                <p
                                    title={getEmail(row)}
                                    className="mt-0.5 truncate text-[10px] leading-4 text-[#697586]"
                                >
                                    {getEmail(row)}
                                </p>
                            </div>
                        </div>
                    ),
                };
            if (column.key === 'status')
                return {
                    ...column,
                    render: (value) => (
                        <div className="whitespace-nowrap">
                            <StatusBadge status={value || 'inactive'} />
                        </div>
                    ),
                };
            if (column.key === 'availability')
                return {
                    ...column,
                    render: (value) => <Availability value={value} />,
                };
            if (column.key === 'actions')
                return {
                    ...column,
                    render: (_, row) => (
                        <Actions row={row} onView={onView} onEdit={onEdit} />
                    ),
                };
            return column;
        });
    return (
        <>
            <div className="bg-[#0E1219] lg:hidden">
                {rows.length ? (
                    rows.map((row) => (
                        <MobileVolunteerRow
                            key={row.id}
                            row={row}
                            onView={onView}
                            onEdit={onEdit}
                        />
                    ))
                ) : (
                    <div className="flex min-h-65 flex-col items-center justify-center bg-[#0E1219] px-6 py-10 text-center">
                        <div className="flex h-10 w-10 items-center justify-center border border-[#29323E] bg-[#151B24]">
                            <Users
                                size={17}
                                strokeWidth={1.7}
                                className="text-[#697586]"
                            />
                        </div>
                        <p className="mt-3 text-[13px] font-semibold! text-[#EEF1F5]">
                            No volunteers found
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-[#697586]">
                            Try changing your search or filter options.
                        </p>
                    </div>
                )}
            </div>
            <div className="hidden min-w-0 bg-[#0E1219] lg:block">
                <DataTable
                    columns={enhancedColumns}
                    rows={rows}
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
        </>
    );
};

export default Table;
