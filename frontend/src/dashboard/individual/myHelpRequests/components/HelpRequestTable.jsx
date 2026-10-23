import React from 'react';
import {
    Building2,
    CalendarDays,
    ClipboardList,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';
import DataTable from '@/components/dashboard/DataTable';

const STATUS = {
    pending: 'border-[#443723] bg-[#241E15] text-[#D0AA70]',
    verified: 'border-[#294438] bg-[#14231D] text-[#8EC5A3]',
    in_progress: 'border-[#3D3A57] bg-[#222136] text-[#B4ADD9]',
    completed: 'border-[#294438] bg-[#14231D] text-[#8EC5A3]',
    rejected: 'border-[#493038] bg-[#281A1F] text-[#D1959B]',
};
const PRIORITY = {
    normal: 'text-[#AEB7C3]',
    low: 'text-[#8EC5A3]',
    high: 'text-[#D0AA70]',
    urgent: 'text-[#E3A06E]',
    critical: 'text-[#E19A9F]',
};
const titleCase = (value) =>
    String(value || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

function RequestIdentity({ row }) {
    return (
        <div className="min-w-0">
            <p
                title={row.title || ''}
                className="truncate text-[12px] font-semibold! leading-5 text-[#EEF1F5]"
            >
                {row.title || 'Untitled request'}
            </p>
            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-2 text-[10px] text-[#697586]">
                <span className="truncate">
                    {titleCase(row.category || 'General')}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1">
                    <CalendarDays size={11} />
                    {row.formattedCreatedDate || '—'}
                </span>
            </div>
        </div>
    );
}
function OrganizationCell({ row, onViewOrganization }) {
    const info = row.assignmentInfo;
    const org = info?.currentAssignment?.organization;
    const name =
        org?.name ||
        org?.user?.name ||
        row.assigned_organization?.name ||
        'Not assigned';
    const email = org?.email || org?.user?.email || '';
    return (
        <button
            type="button"
            disabled={!org || !onViewOrganization}
            onClick={() => onViewOrganization(info, row)}
            className="flex min-w-0 max-w-full items-center gap-2.5 text-left disabled:cursor-default"
        >
            <span className="flex size-8 shrink-0 items-center justify-center border border-[#29323E] bg-[#151B24] text-[#8792A1]">
                <Building2 size={15} />
            </span>
            <span className="min-w-0">
                <span
                    className={`block truncate text-[12px] font-semibold! ${org ? 'text-[#EEF1F5]' : 'text-[#697586]'}`}
                >
                    {name}
                </span>
                {email && (
                    <span className="mt-0.5 block truncate text-[10px] text-[#697586]">
                        {email}
                    </span>
                )}
            </span>
        </button>
    );
}
function Status({ row }) {
    const status = String(row.status || '').toLowerCase();
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 text-[10px] font-medium ${STATUS[status] || 'border-[#343E4B] bg-[#1A222D] text-[#AEB7C3]'}`}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {row.statusLabel || titleCase(status || 'Unknown')}
        </span>
    );
}
function Priority({ row }) {
    const urgency = String(
        row.urgency || row.priority || 'normal',
    ).toLowerCase();
    return (
        <span
            className={`text-[11px] font-medium ${PRIORITY[urgency] || PRIORITY.normal}`}
        >
            {row.urgencyLabel || titleCase(urgency)}
        </span>
    );
}
function Actions({ row, onView, onEdit, onDelete, deleteLoading }) {
    const pending = String(row.status).toLowerCase() === 'pending';
    const cls =
        'inline-flex size-8 items-center justify-center border border-transparent text-[#8792A1] transition-colors hover:border-[#303A47] hover:bg-[#1A222D] hover:text-[#EEF1F5] disabled:opacity-40';
    return (
        <div className="flex items-center justify-end gap-1">
            <button
                type="button"
                title="View request"
                aria-label="View request"
                onClick={() => onView(row)}
                className={cls}
            >
                <Eye size={15} />
            </button>
            {pending && (
                <>
                    <button
                        type="button"
                        title="Edit request"
                        aria-label="Edit request"
                        onClick={() => onEdit(row)}
                        className={cls}
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        type="button"
                        title="Delete request"
                        aria-label="Delete request"
                        disabled={deleteLoading}
                        onClick={() => onDelete(row)}
                        className={`${cls} hover:text-[#D1959B]`}
                    >
                        <Trash2 size={14} />
                    </button>
                </>
            )}
        </div>
    );
}
export default function Table({
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
    onView,
    onEdit,
    onDelete,
    onViewOrganization,
    deleteLoading,
}) {
    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            width: '56px',
            align: 'center',
            render: (value) => (
                <span className="text-[11px] tabular-nums text-[#697586]">
                    {String(value ?? '—').padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'Help Request',
            width: 'minmax(210px,1.8fr)',
            sortable: true,
            sortKey: 'title',
            render: (_, row) => <RequestIdentity row={row} />,
        },
        {
            key: 'locationName',
            header: 'Location',
            width: 'minmax(120px,0.85fr)',
            render: (value) => (
                <span className="text-[12px] text-[#AEB7C3]">
                    {value || '—'}
                </span>
            ),
        },
        {
            key: 'assignedOrganization',
            header: 'Assigned Organization',
            width: 'minmax(180px,1.15fr)',
            render: (_, row) => (
                <OrganizationCell
                    row={row}
                    onViewOrganization={onViewOrganization}
                />
            ),
        },
        {
            key: 'urgency',
            header: 'Urgency',
            width: 'minmax(90px,0.6fr)',
            sortable: true,
            sortKey: 'urgency',
            render: (_, row) => <Priority row={row} />,
        },
        {
            key: 'status',
            header: 'Status',
            width: 'minmax(110px,0.75fr)',
            sortable: true,
            sortKey: 'status',
            render: (_, row) => <Status row={row} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '130px',
            align: 'right',
            render: (_, row) => (
                <Actions
                    row={row}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    deleteLoading={deleteLoading}
                />
            ),
        },
    ];
    const empty = (
        <div className="flex min-h-56 flex-col items-center justify-center gap-2 px-5 py-10 text-center">
            <ClipboardList size={22} className="text-[#697586]" />
            <p className="text-[13px] font-semibold! text-[#EEF1F5]">
                No help requests found
            </p>
            <p className="text-[11px] text-[#697586]">
                Try changing your search or filters.
            </p>
        </div>
    );
    return (
        <>
            <div className="bg-[#0E1219] lg:hidden">
                {rows.length
                    ? rows.map((row) => (
                          <article
                              key={row.id}
                              className="border-b border-[#29323E] px-4 py-3.5 last:border-0"
                          >
                              <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                      <RequestIdentity row={row} />
                                  </div>
                                  <Actions
                                      row={row}
                                      onView={onView}
                                      onEdit={onEdit}
                                      onDelete={onDelete}
                                      deleteLoading={deleteLoading}
                                  />
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                  <Priority row={row} />
                                  <Status row={row} />
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#8792A1]">
                                  <span>{row.locationName}</span>
                                  <OrganizationCell
                                      row={row}
                                      onViewOrganization={onViewOrganization}
                                  />
                              </div>
                          </article>
                      ))
                    : empty}
            </div>
            <div className="hidden min-w-0 bg-[#0E1219] lg:block">
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
