import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    Eye,
    Flame,
    Megaphone,
    MoreHorizontal,
    Pencil,
    Star,
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
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] border px-2.5 py-1 text-[11px] font-medium ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

function ClassificationLabels({ row }) {
    const isFeatured = Boolean(row?.is_featured);
    const isUrgent = Boolean(row?.is_urgent);
    const priority = Number(row?.urgency_priority);

    if (!isFeatured && !isUrgent) return null;

    return (
        <>
            {isFeatured && (
                <span
                    title="Featured campaign"
                    className="inline-flex h-[21px] shrink-0 items-center gap-1 whitespace-nowrap rounded-[4px] border border-[#6C5936]/60 bg-[#3B3020]/70 px-1.5 text-[10px] font-medium text-[#E9C886]"
                >
                    <Star size={11} strokeWidth={1.8} />
                    Featured
                </span>
            )}

            {isUrgent && (
                <span
                    title={
                        Number.isInteger(priority) &&
                        priority >= 1 &&
                        priority <= 4
                            ? `Urgent campaign - Priority ${priority}`
                            : 'Urgent campaign'
                    }
                    className="inline-flex h-[21px] shrink-0 items-center gap-1 whitespace-nowrap rounded-[4px] border border-[#794742]/60 bg-[#432725]/70 px-1.5 text-[10px] font-medium text-[#E9A29A]"
                >
                    <Flame size={11} strokeWidth={1.8} />
                    Urgent
                    {Number.isInteger(priority) &&
                        priority >= 1 &&
                        priority <= 4 && (
                            <span className="border-l border-[#9D615A]/50 pl-1 font-medium">
                                P{priority}
                            </span>
                        )}
                </span>
            )}
        </>
    );
}

function Identity({ row }) {
    return (
        <div className="min-w-0 py-2">
            <p
                title={row?.title}
                className="m-0 line-clamp-2 text-[12px] font-semibold leading-[1.65] !text-[#EEF1F5]"
                style={{
                    fontFamily: "'Poppins', 'Noto Sans Bengali', sans-serif",
                }}
            >
                {row?.title || 'Untitled campaign'}
            </p>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
                <span
                    title={row?.category || 'General'}
                    className="max-w-full truncate text-[10px] font-medium leading-5 text-[#8F9CAD]"
                >
                    {row?.category || 'General'}
                </span>

                {(row?.is_featured || row?.is_urgent) && (
                    <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-[#586675]"
                    />
                )}

                <ClassificationLabels row={row} />
            </div>
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
            className={`inline-flex max-w-full items-center gap-1.5 rounded-[4px] border px-2 py-1 text-[10px] font-medium leading-4 ${
                isLocalCase
                    ? 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]'
                    : isOrganizationProposed
                      ? 'border-[#685B40] bg-[#342F23] text-[#E4D0A0]'
                      : 'border-[#3A495B] bg-[#202B38] text-[#C4D2E3]'
            }`}
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
            className={`whitespace-nowrap text-[11px] tabular-nums ${
                emphasized
                    ? 'font-semibold text-[#E3EAF3]'
                    : 'font-medium text-[#B9C5D3]'
            }`}
        >
            {value ?? '—'}
        </span>
    );
}

function CampaignDate({ value, openEnded = false }) {
    if (openEnded) {
        return (
            <span className="whitespace-nowrap text-[10px] font-medium text-[#A9C5E4]">
                Open-ended
            </span>
        );
    }

    return (
        <span className="whitespace-nowrap text-[10px] tabular-nums text-[#B9C5D3]">
            {value || '—'}
        </span>
    );
}

/*
 * Retain the parent campaign page's existing
 * action callbacks.
 */
function extractActionHandlers(column, row) {
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

    return handlers;
}

function Actions({ column, row, onManageClassification, onUpdateStatus }) {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState(null);

    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    const status = String(row?.status || '').toLowerCase();

    const canEdit = ['unverified', 'active'].includes(status);
    const canVerify = status === 'unverified';
    const canAssign = status === 'active';
    const canClassify = status === 'active';
    const canUpdateStatus = status === 'active';

    const handlers = extractActionHandlers(column, row);
    const campaignId = row?.id;

    const handleView = () => {
        if (campaignId == null) return;
        navigate(`${CAMPAIGNS_PATH}/${campaignId}`);
    };

    const handleEdit = () => {
        if (!canEdit || campaignId == null) return;
        navigate(`${CAMPAIGNS_PATH}/${campaignId}/edit`);
    };

    const additionalActions = [];

    if (canVerify) {
        additionalActions.push({
            label: 'Verify campaign',
            onClick: handlers.verify,
            disabled: typeof handlers.verify !== 'function',
            tone: 'text-[#A8D7C0]',
        });
    }

    if (canAssign) {
        additionalActions.push({
            label: 'Assign volunteers',
            onClick: handlers['assign volunteers'],
            disabled: typeof handlers['assign volunteers'] !== 'function',
            tone: 'text-[#C5D0DD]',
        });
    }

    if (canUpdateStatus) {
        additionalActions.push({
            label: 'Update campaign status',
            onClick: () => onUpdateStatus?.(row),
            disabled: typeof onUpdateStatus !== 'function',
            tone: 'text-[#C9B58B]',
        });
    }

    if (canClassify) {
        additionalActions.push({
            label: 'Manage classification',
            onClick: () => onManageClassification?.(row),
            disabled: typeof onManageClassification !== 'function',
            tone: 'text-[#E4D0A0]',
        });
    }

    useLayoutEffect(() => {
        if (!menuOpen || !triggerRef.current) return;

        const updatePosition = () => {
            const rect = triggerRef.current?.getBoundingClientRect();

            if (!rect) return;

            const menuHeight = Math.max(
                menuRef.current?.offsetHeight || 0,
                additionalActions.length * 40 + 8,
            );

            const gap = 6;
            const viewportPadding = 12;

            const spaceAbove = rect.top - viewportPadding;
            const spaceBelow =
                window.innerHeight - rect.bottom - viewportPadding;

            const openDown =
                spaceBelow >= menuHeight + gap || spaceBelow >= spaceAbove;

            const top = openDown
                ? Math.min(
                      rect.bottom + gap,
                      window.innerHeight - menuHeight - viewportPadding,
                  )
                : Math.max(viewportPadding, rect.top - menuHeight - gap);

            const menuWidth = 196;

            const left = Math.max(
                viewportPadding,
                Math.min(
                    rect.right - menuWidth,
                    window.innerWidth - menuWidth - viewportPadding,
                ),
            );

            setMenuPosition({
                top,
                left,
                width: menuWidth,
            });
        };

        const handleOutsideClick = (event) => {
            if (
                !triggerRef.current?.contains(event.target) &&
                !menuRef.current?.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
                triggerRef.current?.focus();
            }
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        document.addEventListener('pointerdown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            document.removeEventListener('pointerdown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menuOpen, additionalActions.length]);

    const executeAction = (action) => {
        if (action.disabled) return;

        setMenuOpen(false);
        action.onClick?.();
    };

    const buttonClass =
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#354150] bg-[#19222D] text-[#B9C5D3] transition-colors hover:border-[#526276] hover:bg-[#25313F] hover:text-[#EEF1F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8792A1]';

    return (
        <>
            <div className="flex w-full items-center justify-start gap-1.5 py-1">
                <button
                    type="button"
                    onClick={handleView}
                    aria-label="View campaign"
                    title="View campaign"
                    className={buttonClass}
                >
                    <Eye size={14} strokeWidth={1.8} />
                </button>

                {canEdit && (
                    <button
                        type="button"
                        onClick={handleEdit}
                        aria-label="Edit campaign"
                        title="Edit campaign"
                        className={buttonClass}
                    >
                        <Pencil size={13} strokeWidth={1.8} />
                    </button>
                )}

                {additionalActions.length > 0 && (
                    <button
                        ref={triggerRef}
                        type="button"
                        aria-label="More campaign actions"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        title="More actions"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className={`${buttonClass} ${
                            menuOpen
                                ? 'border-[#526276] bg-[#25313F] text-[#EEF1F5]'
                                : ''
                        }`}
                    >
                        <MoreHorizontal size={16} strokeWidth={1.8} />
                    </button>
                )}
            </div>

            {menuOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        aria-label="Campaign actions"
                        style={{
                            position: 'fixed',
                            top: menuPosition?.top ?? -9999,
                            left: menuPosition?.left ?? -9999,
                            width: menuPosition?.width ?? 196,
                            zIndex: 9999,
                            visibility: menuPosition ? 'visible' : 'hidden',
                        }}
                        className="rounded-[5px] border border-[#34404D] bg-[#1B242E] p-1 shadow-xl shadow-black/40"
                    >
                        {additionalActions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
                                role="menuitem"
                                disabled={action.disabled}
                                onClick={() => executeAction(action)}
                                className={`flex min-h-9 w-full items-center rounded-[3px] px-3 py-2 text-left text-[11px] font-medium transition-colors hover:bg-[#293542] disabled:cursor-not-allowed disabled:opacity-40 ${action.tone}`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </>
    );
}

export default function Table({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
    onManageClassification,
    onUpdateStatus,
}) {
    const actionColumn = columns.find((column) => column.key === 'actions');

    const renderActions = (row) => (
        <Actions
            column={actionColumn}
            row={row}
            onManageClassification={onManageClassification}
            onUpdateStatus={onUpdateStatus}
        />
    );

    const enhancedColumns = [
        {
            key: 'serialNumber',
            header: '#',
            width: '52px',
            align: 'center',
            render: (value) => (
                <span className="text-[10px] tabular-nums text-[#8291A3]">
                    {value == null ? '—' : String(value).padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'Campaign',
            width: 'minmax(280px,2.5fr)',
            sortable: true,
            sortKey: 'title',
            render: (_value, row) => <Identity row={row} />,
        },
        {
            key: 'campaignType',
            header: 'Type',
            width: 'minmax(145px,1fr)',
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
            key: 'formattedStartDate',
            header: 'Start Date',
            width: 'minmax(115px,0.85fr)',
            sortable: true,
            sortKey: 'start_date',
            render: (value) => <CampaignDate value={value} />,
        },
        {
            key: 'formattedEndDate',
            header: 'End Date',
            width: 'minmax(115px,0.85fr)',
            sortable: true,
            sortKey: 'end_date',
            render: (value, row) => (
                <CampaignDate value={value} openEnded={!row.end_date} />
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: 'minmax(115px,0.8fr)',
            sortable: true,
            sortKey: 'status',
            render: (value) => <Status value={value} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '125px',
            align: 'left',
            render: (_value, row) => renderActions(row),
        },
    ];

    const empty = (
        <div className="flex min-h-64 flex-col items-center justify-center bg-[#10161E] px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center border border-[#344150] bg-[#1B2632] text-[#91A3B8]">
                <Megaphone size={22} strokeWidth={1.6} />
            </span>

            <p className="m-0 mt-4 text-[14px] font-semibold !text-[#EEF1F5]">
                No campaigns found
            </p>

            <p className="m-0 mt-1 text-[12px] !text-[#8998AA]">
                Try changing your search or filter options.
            </p>
        </div>
    );

    return (
        <>
            {/* Mobile and tablet */}
            <div className="bg-[#10161E] lg:hidden">
                {rows.length
                    ? rows.map((row, index) => (
                          <article
                              key={row?.id ?? index}
                              className="border-b border-[#2D3744] px-4 py-5 last:border-b-0 sm:px-5"
                          >
                              <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                      <Identity row={row} />
                                  </div>

                                  <div className="shrink-0">
                                      <Status value={row.status} />
                                  </div>
                              </div>

                              <div className="mt-3">
                                  <CampaignType
                                      value={row.campaignType}
                                      row={row}
                                  />
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-[#2D3744] py-4 sm:grid-cols-4">
                                  <div>
                                      <p className="m-0 text-[10px] font-medium !text-[#8291A3]">
                                          Target
                                      </p>
                                      <div className="mt-1">
                                          <Amount value={row.target} />
                                      </div>
                                  </div>

                                  <div>
                                      <p className="m-0 text-[10px] font-medium !text-[#8291A3]">
                                          Collected
                                      </p>
                                      <div className="mt-1">
                                          <Amount
                                              value={row.collected}
                                              emphasized
                                          />
                                      </div>
                                  </div>

                                  <div>
                                      <p className="m-0 text-[10px] font-medium !text-[#8291A3]">
                                          Start Date
                                      </p>
                                      <div className="mt-1 flex items-center gap-1.5">
                                          <CalendarDays
                                              size={12}
                                              className="shrink-0 text-[#8291A3]"
                                          />
                                          <CampaignDate
                                              value={row.formattedStartDate}
                                          />
                                      </div>
                                  </div>

                                  <div>
                                      <p className="m-0 text-[10px] font-medium !text-[#8291A3]">
                                          End Date
                                      </p>
                                      <div className="mt-1 flex items-center gap-1.5">
                                          <CalendarDays
                                              size={12}
                                              className="shrink-0 text-[#8291A3]"
                                          />
                                          <CampaignDate
                                              value={row.formattedEndDate}
                                              openEnded={!row.end_date}
                                          />
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-3">{renderActions(row)}</div>
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
