import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    Eye,
    Pencil,
    BadgeCheck,
    UserRoundPlus,
    Megaphone,
} from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';

const CAMPAIGNS_PATH = '/admin/dashboard/campaigns';

const STATUS = {
    unverified: ['Unverified', 'border-[#51432F] bg-[#292318] text-[#D6B47C]'],
    active: ['Active', 'border-[#345043] bg-[#1A2C24] text-[#9BCFB0]'],
    completed: ['Completed', 'border-[#354B63] bg-[#1B2B3D] text-[#A9C5E4]'],
    rejected: ['Rejected', 'border-[#56363F] bg-[#301E25] text-[#DEA2AB]'],
    cancelled: ['Cancelled', 'border-[#3B4552] bg-[#202832] text-[#B3BFCD]'],
};

function Status({ value }) {
    const [label, style] = STATUS[String(value || '').toLowerCase()] || [
        String(value || 'Unknown'),
        'border-[#3B4552] bg-[#202832] text-[#B3BFCD]',
    ];

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-[11px] font-medium ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

function ActionButton({ icon: Icon, label, onClick, disabled = false }) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className="
                inline-flex h-8 w-8 shrink-0 items-center justify-center
                border border-transparent text-[#98A5B6]
                transition-colors
                hover:border-[#3B4858] hover:bg-[#25303D]
                hover:text-[#EEF1F5]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-[#8792A1]
                disabled:cursor-not-allowed disabled:opacity-40
            "
        >
            <Icon size={16} strokeWidth={1.8} />
        </button>
    );
}

function Actions({ column, row }) {
    const navigate = useNavigate();

    if (!row) return null;

    const status = String(row.status || '').toLowerCase();

    const canEdit = ['unverified', 'active'].includes(status);
    const canVerify = status === 'unverified';
    const canAssign = status === 'active';

    const original =
        typeof column?.render === 'function'
            ? column.render(row[column.key], row)
            : null;

    const handlers = {};

    const visit = (node) => {
        React.Children.forEach(node, (child) => {
            if (!React.isValidElement(child)) return;

            if (child.type === 'button') {
                const labelParts = [];

                React.Children.forEach(child.props.children, (content) => {
                    if (typeof content === 'string') {
                        labelParts.push(content);
                    }
                });

                const label = (
                    labelParts.join(' ').trim() ||
                    child.props['aria-label'] ||
                    child.props.title ||
                    ''
                ).toLowerCase();

                if (label) {
                    handlers[label] = child.props.onClick;
                }
            } else if (child.props?.children) {
                visit(child.props.children);
            }
        });
    };

    visit(original);

    const campaignId = row.id;

    const handleView = () => {
        if (campaignId === null || campaignId === undefined) return;

        navigate(`${CAMPAIGNS_PATH}/${campaignId}`);
    };

    const handleEdit = () => {
        if (!canEdit || campaignId === null || campaignId === undefined) {
            return;
        }

        navigate(`${CAMPAIGNS_PATH}/${campaignId}/edit`);
    };

    return (
        <div className="flex flex-wrap items-center justify-end gap-1">
            <ActionButton
                icon={Eye}
                label={`View ${row.title || 'campaign'}`}
                onClick={handleView}
            />

            {canEdit && (
                <ActionButton
                    icon={Pencil}
                    label={`Edit ${row.title || 'campaign'}`}
                    onClick={handleEdit}
                />
            )}

            {canVerify && (
                <ActionButton
                    icon={BadgeCheck}
                    label={`Verify ${row.title || 'campaign'}`}
                    onClick={handlers.verify}
                    disabled={typeof handlers.verify !== 'function'}
                />
            )}

            {canAssign && (
                <ActionButton
                    icon={UserRoundPlus}
                    label={`Assign volunteers to ${row.title || 'campaign'}`}
                    onClick={handlers['assign volunteers']}
                    disabled={
                        typeof handlers['assign volunteers'] !== 'function'
                    }
                />
            )}
        </div>
    );
}

function Identity({ row }) {
    return (
        <div className="min-w-0 py-1">
            <p
                title={row.title}
                className="m-0 line-clamp-2 text-[13px] leading-[1.65] font-semibold text-[#EEF1F5]!"
                style={{
                    fontFamily: "'Poppins', 'Noto Sans Bengali', sans-serif",
                }}
            >
                {row.title || 'Untitled campaign'}
            </p>

            <p className="m-0 mt-1 text-[11px] font-medium leading-4 text-[#8FA0B4]!">
                {row.category || 'General'}
            </p>
        </div>
    );
}

function CampaignType({ value, row }) {
    const raw = value ?? row?.campaignType ?? row?.type;

    const type = String(raw ?? '')
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const isLocalCase =
        type === 'local_case' ||
        type === 'localcase' ||
        row?.help_request_id != null ||
        row?.helpRequest?.id != null ||
        row?.help_request?.id != null;

    const helpRequestId =
        row?.help_request_id ?? row?.helpRequest?.id ?? row?.help_request?.id;

    const isOrganizationProposed = [
        'organization_proposed',
        'org_proposed',
        'organization',
        'org',
    ].includes(type);

    const label = isLocalCase
        ? 'Local Case'
        : isOrganizationProposed
          ? 'Organization Proposed'
          : 'Global';

    return (
        <span
            title={
                isLocalCase && helpRequestId != null
                    ? `Local Case #${helpRequestId}`
                    : label
            }
            className={`
                inline-flex max-w-full items-center gap-1.5
                border px-2.5 py-1.5
                text-[11px] leading-4 font-medium
                ${
                    isLocalCase
                        ? 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]'
                        : isOrganizationProposed
                          ? 'border-[#685B40] bg-[#342F23] text-[#E4D0A0]'
                          : 'border-[#3A495B] bg-[#202B38] text-[#C4D2E3]'
                }
            `}
        >
            <span className="truncate">{label}</span>

            {isLocalCase && helpRequestId != null && (
                <span className="shrink-0 font-semibold">#{helpRequestId}</span>
            )}
        </span>
    );
}

function Amount({ value, emphasized = false }) {
    return (
        <span
            className={[
                'whitespace-nowrap text-[12px] tabular-nums',
                emphasized
                    ? 'font-semibold text-[#E3EAF3]'
                    : 'font-medium text-[#B9C5D3]',
            ].join(' ')}
        >
            {value ?? '—'}
        </span>
    );
}

export default function Table({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
}) {
    const actionColumn = columns.find((column) => column.key === 'actions');

    const empty = (
        <div className="flex min-h-64 flex-col items-center justify-center bg-[#10161E] px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center border border-[#344150] bg-[#1B2632] text-[#91A3B8]">
                <Megaphone size={22} strokeWidth={1.6} />
            </span>

            <p className="m-0 mt-4 text-[14px] font-semibold text-[#EEF1F5]!">
                No campaigns found
            </p>

            <p className="m-0 mt-1 text-[12px] text-[#8998AA]!">
                Try changing your search or filter options.
            </p>
        </div>
    );

    const enhancedColumns = [
        {
            key: 'serialNumber',
            header: '#',
            width: '52px',
            align: 'center',
            render: (value) => (
                <span className="text-[11px] tabular-nums text-[#8291A3]">
                    {value === null || value === undefined
                        ? '—'
                        : String(value).padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'Campaign',
            width: 'minmax(310px,2.6fr)',
            sortable: true,
            sortKey: 'title',
            render: (_value, row) => <Identity row={row} />,
        },
        {
            key: 'campaignType',
            header: 'Campaign Type',
            width: 'minmax(150px,1.15fr)',
            sortable: true,
            sortKey: 'type',
            render: (value, row) => <CampaignType value={value} row={row} />,
        },
        {
            key: 'target',
            header: 'Target',
            width: 'minmax(105px,0.8fr)',
            sortable: true,
            sortKey: 'target_amount',
            render: (value) => <Amount value={value} />,
        },
        {
            key: 'collected',
            header: 'Collected',
            width: 'minmax(105px,0.8fr)',
            sortable: true,
            sortKey: 'collected_amount',
            render: (value) => <Amount value={value} emphasized />,
        },
        {
            key: 'status',
            header: 'Status',
            width: 'minmax(115px,0.75fr)',
            sortable: true,
            sortKey: 'status',
            render: (value) => <Status value={value} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '152px',
            align: 'right',
            render: (_value, row) => (
                <Actions column={actionColumn} row={row} />
            ),
        },
    ];

    return (
        <>
            {/* Mobile and tablet */}
            <div className="bg-[#10161E] lg:hidden">
                {rows.length
                    ? rows.map((row, index) => (
                          <article
                              key={row.id ?? index}
                              className="border-b border-[#2D3744] px-4 py-4 last:border-b-0 sm:px-5"
                          >
                              <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                      <Identity row={row} />
                                  </div>

                                  <Status value={row.status} />
                              </div>

                              <div className="mt-3">
                                  <CampaignType
                                      value={row.campaignType}
                                      row={row}
                                  />
                              </div>

                              <div className="mt-3 grid grid-cols-2 gap-3 border-y border-[#2D3744] py-3">
                                  <div className="min-w-0">
                                      <p className="m-0 text-[11px] text-[#8291A3]!">
                                          Target
                                      </p>

                                      <div className="mt-1">
                                          <Amount value={row.target} />
                                      </div>
                                  </div>

                                  <div className="min-w-0">
                                      <p className="m-0 text-[11px] text-[#8291A3]!">
                                          Collected
                                      </p>

                                      <div className="mt-1">
                                          <Amount
                                              value={row.collected}
                                              emphasized
                                          />
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#8392A4]">
                                      <CalendarDays size={14} />
                                      {row.formattedStartDate || '—'}
                                  </span>

                                  <Actions column={actionColumn} row={row} />
                              </div>
                          </article>
                      ))
                    : empty}
            </div>

            {/* Desktop */}
            <div className="hidden min-w-0 bg-[#10161E] lg:block">
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
