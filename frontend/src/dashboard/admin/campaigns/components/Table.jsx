import React from 'react';
import {
    CalendarDays,
    Eye,
    Pencil,
    BadgeCheck,
    UserRoundPlus,
    Megaphone,
} from 'lucide-react';
import DataTable from '@/components/dashboard/DataTable';

const STATUS = {
    unverified: ['Unverified', 'border-[#443723] bg-[#241E15] text-[#D0AA70]'],
    active: ['Active', 'border-[#294438] bg-[#14231D] text-[#8EC5A3]'],
    completed: ['Completed', 'border-[#30445A] bg-[#192636] text-[#A4BEDC]'],
    rejected: ['Rejected', 'border-[#493038] bg-[#281A1F] text-[#D1959B]'],
    cancelled: ['Cancelled', 'border-[#343E4B] bg-[#1A222D] text-[#AEB7C3]'],
};
const ICONS = {
    view: Eye,
    edit: Pencil,
    verify: BadgeCheck,
    'assign volunteers': UserRoundPlus,
};

function Status({ value }) {
    const [label, style] = STATUS[String(value || '').toLowerCase()] || [
        String(value || 'Unknown'),
        'border-[#343E4B] bg-[#1A222D] text-[#AEB7C3]',
    ];
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 text-[10px] font-medium ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

function Actions({ column, row }) {
    if (typeof column?.render !== 'function') return null;
    const original = column.render(row[column.key], row);
    const buttons = [];
    const visit = (node) =>
        React.Children.forEach(node, (child) => {
            if (!React.isValidElement(child)) return;
            if (child.type === 'button') buttons.push(child);
            else if (child.props?.children) visit(child.props.children);
        });
    visit(original);
    if (!buttons.length) return original;
    return (
        <div className="flex flex-wrap items-center justify-end gap-1">
            {buttons.map((button, index) => {
                const parts = [];
                const read = (node) =>
                    React.Children.forEach(node, (child) => {
                        if (typeof child === 'string') parts.push(child);
                        else if (
                            React.isValidElement(child) &&
                            child.props?.children
                        )
                            read(child.props.children);
                    });
                read(button.props.children);
                const text =
                    parts.join(' ').trim() ||
                    button.props['aria-label'] ||
                    'Action';
                const Icon = ICONS[text.toLowerCase()] || Eye;
                return React.cloneElement(button, {
                    key: button.key ?? `${text}-${index}`,
                    title: text,
                    'aria-label': `${text}: ${row.title || 'campaign'}`,
                    className:
                        'inline-flex h-8 w-8 items-center justify-center border border-transparent text-[#8792A1] transition-colors hover:border-[#303A47] hover:bg-[#1A222D] hover:text-[#EEF1F5] disabled:opacity-40',
                    children: <Icon size={15} strokeWidth={1.8} />,
                });
            })}
        </div>
    );
}

function Identity({ row }) {
    return (
        <div className="min-w-0">
            <p
                title={row.title}
                className="truncate text-[12px] font-semibold text-[#EEF1F5]"
            >
                {row.title || 'Untitled campaign'}
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-2 text-[10px] text-[#697586]">
                <span className="truncate capitalize">
                    {row.category || 'General'}
                </span>
                {row.locationName &&
                    row.locationName !== 'Location not specified' && (
                        <span className="truncate">· {row.locationName}</span>
                    )}
            </div>
        </div>
    );
}

export default function Table({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
}) {
    const actionColumn = columns.find((c) => c.key === 'actions');
    const typeColumn = columns.find((c) => c.key === 'campaignType');
    const empty = (
        <div className="flex min-h-64 flex-col items-center justify-center bg-[#0E1219] px-6 text-center">
            <Megaphone size={23} className="text-[#697586]" />
            <p className="mt-3 text-[13px] font-semibold text-[#EEF1F5]">
                No campaigns found
            </p>
            <p className="mt-1 text-[11px] text-[#697586]">
                Try changing your search or filter options.
            </p>
        </div>
    );
    const enhancedColumns = [
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
            header: 'Campaign',
            width: 'minmax(200px,1.8fr)',
            sortable: true,
            sortKey: 'title',
            render: (_, row) => <Identity row={row} />,
        },
        {
            key: 'campaignType',
            header: 'Source',
            width: 'minmax(130px,1fr)',
            sortable: true,
            sortKey: 'type',
            render: (value, row) => typeColumn?.render?.(value, row) ?? value,
        },
        {
            key: 'target',
            header: 'Target',
            width: 'minmax(100px,0.8fr)',
            sortable: true,
            sortKey: 'target_amount',
            render: (value) => (
                <span className="text-[11px] text-[#CDD6E1]">{value}</span>
            ),
        },
        {
            key: 'collected',
            header: 'Collected',
            width: 'minmax(100px,0.8fr)',
            sortable: true,
            sortKey: 'collected_amount',
            render: (value) => (
                <span className="text-[11px] text-[#CDD6E1]">{value}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: 'minmax(110px,0.7fr)',
            sortable: true,
            sortKey: 'status',
            render: (value) => <Status value={value} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '165px',
            align: 'right',
            render: (_, row) => <Actions column={actionColumn} row={row} />,
        },
    ];
    return (
        <>
            <div className="bg-[#0E1219] lg:hidden">
                {rows.length
                    ? rows.map((row) => (
                          <article
                              key={row.id}
                              className="border-b border-[#252D38] px-4 py-4 last:border-b-0"
                          >
                              <Identity row={row} />
                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-[11px] text-[#AEB7C3]">
                                      {typeColumn?.render?.(
                                          row.campaignType,
                                          row,
                                      ) ?? row.campaignType}
                                  </span>
                                  <Status value={row.status} />
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#252D38] pt-3 text-[11px]">
                                  <div>
                                      <span className="text-[#697586]">
                                          Target
                                      </span>
                                      <p className="mt-1 text-[#CDD6E1]">
                                          {row.target}
                                      </p>
                                  </div>
                                  <div>
                                      <span className="text-[#697586]">
                                          Collected
                                      </span>
                                      <p className="mt-1 text-[#CDD6E1]">
                                          {row.collected}
                                      </p>
                                  </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between border-t border-[#252D38] pt-3">
                                  <span className="flex items-center gap-1 text-[10px] text-[#697586]">
                                      <CalendarDays size={12} />
                                      {row.formattedStartDate || '—'}
                                  </span>
                                  <Actions column={actionColumn} row={row} />
                              </div>
                          </article>
                      ))
                    : empty}
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
                        icon: Megaphone,
                        title: 'No campaigns found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </>
    );
}
