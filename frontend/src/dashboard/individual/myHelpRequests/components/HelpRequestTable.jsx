import React from 'react';
import {
    ClipboardList,
    Eye,
    Pencil,
    Trash2,
    Building2,
    CalendarDays,
} from 'lucide-react';
import DataTable from '@/components/dashboard/DataTable';

const STATUS = {
    pending: 'border-[#443723] bg-[#241E15] text-[#D0AA70]',
    verified: 'border-[#294438] bg-[#14231D] text-[#8EC5A3]',
    completed: 'border-[#294438] bg-[#14231D] text-[#8EC5A3]',
    rejected: 'border-[#493038] bg-[#281A1F] text-[#D1959B]',
};
const PRIORITY = {
    normal: 'text-[#AEB7C3]',
    high: 'text-[#D0AA70]',
    critical: 'text-[#E19A9F]',
};
const format = (v) =>
    String(v || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
const organization = (row) =>
    row.assignmentInfo?.currentAssignment?.organization?.name ||
    row.assignmentInfo?.currentAssignment?.organization?.user?.name ||
    row.assigned_organization?.name ||
    'Not assigned';
function Actions({ row, onView, onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1">
            <button
                type="button"
                title="View request"
                aria-label="View request"
                onClick={() => onView?.(row)}
                className="flex h-8 w-8 items-center justify-center text-[#8792A1] hover:bg-[#1A222D] hover:text-[#EEF1F5]"
            >
                <Eye size={15} />
            </button>
            {row.status === 'pending' && (
                <>
                    <button
                        type="button"
                        title="Edit request"
                        aria-label="Edit request"
                        onClick={() => onEdit?.(row)}
                        className="flex h-8 w-8 items-center justify-center text-[#8792A1] hover:bg-[#1A222D] hover:text-[#EEF1F5]"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        type="button"
                        title="Delete request"
                        aria-label="Delete request"
                        onClick={() => onDelete?.(row)}
                        className="flex h-8 w-8 items-center justify-center text-[#8792A1] hover:bg-[#281A1F] hover:text-[#D1959B]"
                    >
                        <Trash2 size={15} />
                    </button>
                </>
            )}
        </div>
    );
}
function Status({ value }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] ${STATUS[value] || 'border-[#343E4B] bg-[#1A222D] text-[#AEB7C3]'}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {format(value || 'Unknown')}
        </span>
    );
}
export default function HelpRequestTable({
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
    onView,
    onEdit,
    onDelete,
}) {
    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            width: '55px',
            align: 'center',
            render: (value) => (
                <span className="text-[11px] text-[#697586]">
                    {String(value).padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',
            width: 'minmax(220px,2fr)',
            render: (_, row) => (
                <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-[#EEF1F5]">
                        {row.title || 'Untitled request'}
                    </p>
                    <p className="mt-1 flex items-center gap-2 truncate text-[11px] text-[#697586]">
                        {format(row.category || 'General')}{' '}
                        <CalendarDays size={11} />
                        {row.formattedCreatedDate}
                    </p>
                </div>
            ),
        },
        {
            key: 'locationName',
            header: 'Location',
            width: 'minmax(120px,1fr)',
            render: (value) => (
                <span className="text-[12px] text-[#B8C0CA]">
                    {value || '—'}
                </span>
            ),
        },
        {
            key: 'assignmentInfo',
            header: 'Assigned Organization',
            width: 'minmax(170px,1.25fr)',
            render: (_, row) => (
                <span className="flex min-w-0 items-center gap-2 text-[12px] text-[#B8C0CA]">
                    <Building2 size={15} className="shrink-0 text-[#8792A1]" />
                    <span className="truncate">{organization(row)}</span>
                </span>
            ),
        },
        {
            key: 'urgency',
            header: 'Urgency',
            sortable: true,
            sortKey: 'urgency',
            width: '105px',
            render: (value) => (
                <span
                    className={`text-[12px] ${PRIORITY[value] || PRIORITY.normal}`}
                >
                    {format(value || 'Normal')}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: '120px',
            render: (value) => <Status value={value} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '120px',
            render: (_, row) => (
                <Actions
                    row={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];
    return (
        <>
            <div className="lg:hidden">
                {rows.length === 0 ? (
                    <Empty />
                ) : (
                    rows.map((row) => (
                        <article
                            key={row.id}
                            className="border-b border-[#29323E] px-4 py-4 last:border-b-0"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-[#EEF1F5]">
                                        {row.title}
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#697586]">
                                        {format(row.category)} ·{' '}
                                        {row.formattedCreatedDate}
                                    </p>
                                </div>
                                <Actions
                                    row={row}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <Status value={row.status} />
                                <span className="text-[11px] text-[#8792A1]">
                                    {format(row.urgency)}
                                </span>
                            </div>
                            <p className="mt-2 truncate text-[11px] text-[#8792A1]">
                                {organization(row)} · {row.locationName}
                            </p>
                        </article>
                    ))
                )}
            </div>
            <div className="hidden lg:block">
                <DataTable
                    columns={columns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
                    empty={{
                        icon: ClipboardList,
                        title: 'No help requests found',
                        message: 'Try changing your search or filters.',
                    }}
                />
            </div>
        </>
    );
}
function Empty() {
    return (
        <div className="flex min-h-52 flex-col items-center justify-center gap-2 px-4 text-center">
            <ClipboardList size={23} className="text-[#697586]" />
            <p className="text-[13px] text-[#EEF1F5]">No help requests found</p>
            <p className="text-[11px] text-[#697586]">
                Try changing your search or filters.
            </p>
        </div>
    );
}
