import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ClipboardList,
    Eye,
    Pencil,
    UserRound,
    UserRoundCheck,
    UserRoundPlus,
    RefreshCcw,
    HandHeart,
    CalendarDays,
    AlertCircle,
} from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';

const BASE = '/admin/dashboard/help-requests';

const STATUS = {
    pending: ['Pending', 'border-[#443723] bg-[#241E15] text-[#D0AA70]'],
    verified: ['Verified', 'border-[#294438] bg-[#14231D] text-[#8EC5A3]'],
    in_progress: [
        'In progress',
        'border-[#3D3A57] bg-[#222136] text-[#B4ADD9]',
    ],
    completed: ['Completed', 'border-[#294438] bg-[#14231D] text-[#8EC5A3]'],
    rejected: ['Rejected', 'border-[#493038] bg-[#281A1F] text-[#D1959B]'],
};

const PRIORITY = {
    low: 'text-[#8EC5A3]',
    normal: 'text-[#AEB7C3]',
    high: 'text-[#D0AA70]',
    urgent: 'text-[#E3A06E]',
    critical: 'text-[#E19A9F]',
};

const ACTIONS = {
    view: Eye,
    edit: Pencil,
    verify: UserRoundCheck,
    assign: UserRoundPlus,
    reassign: RefreshCcw,
    'add support': HandHeart,
    'review withdrawal': AlertCircle,
};

const titleCase = (value) =>
    String(value || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getRequester = (row) => {
    const user = row.user || row.requester || {};

    return {
        id: row.requesterId ?? user.id ?? row.user_id,
        name:
            row.requesterName ||
            user.name ||
            user.full_name ||
            'Unknown requester',
        email: row.requesterEmail || user.email || '',
    };
};

// ============================================================
// REQUEST STATUS
// ============================================================

function RequestStatus({ row }) {
    const withdrawal =
        Array.isArray(row.assignments) &&
        row.assignments.some(
            (item) =>
                item.withdrawal_status === 'pending' ||
                item.withdrawal_request_status === 'pending',
        );

    if (withdrawal) {
        return (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap border border-[#443723] bg-[#241E15] px-2 py-1 text-[10px] font-medium text-[#D0AA70]">
                <RefreshCcw size={11} />
                Withdrawal requested
            </span>
        );
    }

    const [label, classes] = STATUS[String(row.status || '').toLowerCase()] || [
        titleCase(row.status || 'Unknown'),
        'border-[#343E4B] bg-[#1A222D] text-[#AEB7C3]',
    ];

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 text-[10px] font-medium ${classes}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

// ============================================================
// REQUEST IDENTITY
// ============================================================

function RequestIdentity({ row }) {
    const date = row.created_at ? new Date(row.created_at) : null;

    const formattedDate =
        date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
              })
            : row.submittedDate || '';

    return (
        <div className="min-w-0">
            <p
                title={row.title || ''}
                className="truncate text-[12px] font-semibold! leading-5 text-[#EEF1F5]"
            >
                {row.title || 'Untitled request'}
            </p>

            <div className="mt-0.5 flex min-w-0 items-center gap-2 text-[10px] leading-4 text-[#697586]">
                <span className="min-w-0 truncate">
                    {titleCase(row.category || 'General')}
                </span>

                {formattedDate && (
                    <span className="inline-flex shrink-0 items-center gap-1">
                        <CalendarDays size={11} strokeWidth={1.7} />
                        {formattedDate}
                    </span>
                )}
            </div>
        </div>
    );
}

// ============================================================
// REQUESTER CELL
// ============================================================

function RequesterCell({ row, onRequesterClick }) {
    const requester = getRequester(row);

    return (
        <button
            type="button"
            disabled={!requester.id || !onRequesterClick}
            onClick={() => onRequesterClick?.(requester.id, row)}
            className="flex min-w-0 max-w-full items-center gap-2.5 text-left disabled:cursor-default"
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#29323E] bg-[#151B24]">
                <UserRound
                    size={15}
                    strokeWidth={1.7}
                    className="text-[#8792A1]"
                />
            </span>

            <span className="min-w-0">
                <span className="block truncate text-[12px] font-semibold! text-[#EEF1F5]">
                    {requester.name}
                </span>

                <span className="mt-0.5 block truncate text-[10px] text-[#697586]">
                    {requester.email}
                </span>
            </span>
        </button>
    );
}

// ============================================================
// PRIORITY CELL
// ============================================================

function PriorityCell({ row }) {
    const priority = String(
        row.priority || row.urgency || 'normal',
    ).toLowerCase();

    return (
        <span
            className={`text-[11px] font-medium ${
                PRIORITY[priority] || PRIORITY.normal
            }`}
        >
            {titleCase(priority)}
        </span>
    );
}

// ============================================================
// EXTRACT EXISTING PARENT ACTION BUTTONS
// ============================================================

function extractButtons(node, output = []) {
    React.Children.forEach(node, (child) => {
        if (!React.isValidElement(child)) return;

        if (child.type === 'button') {
            output.push(child);
        } else if (child.props?.children) {
            extractButtons(child.props.children, output);
        }
    });

    return output;
}

function getButtonLabel(button) {
    const parts = [];

    const collect = (node) => {
        React.Children.forEach(node, (child) => {
            if (typeof child === 'string') {
                parts.push(child);
            } else if (React.isValidElement(child) && child.props?.children) {
                collect(child.props.children);
            }
        });
    };

    collect(button.props.children);

    return (
        parts.join(' ').trim() ||
        button.props['aria-label'] ||
        button.props.title ||
        'Action'
    );
}

// ============================================================
// ROW ACTIONS
//
// View / Edit -> Dedicated routes
// All other actions -> Existing parent handlers
// ============================================================

function RowActions({ column, row }) {
    const navigate = useNavigate();

    if (typeof column?.render !== 'function') {
        return null;
    }

    const original = column.render(row[column.key] ?? row.id, row);

    const buttons = extractButtons(original);

    const handleAction = (button, label, event) => {
        const action = label.trim().toLowerCase();

        if (action === 'view') {
            navigate(`${BASE}/${encodeURIComponent(row.id)}`);
            return;
        }

        if (action === 'edit') {
            navigate(`${BASE}/${encodeURIComponent(row.id)}/edit`);
            return;
        }

        // Preserve the original functionality for all
        // non-navigation actions.
        button.props.onClick?.(event);
    };

    return (
        <div className="flex items-center justify-end gap-0.5 whitespace-nowrap">
            {buttons.map((button, index) => {
                const label = getButtonLabel(button);
                const action = label.trim().toLowerCase();

                const Icon = ACTIONS[action] || AlertCircle;

                const warning = action.includes('withdrawal');

                const isNavigationAction =
                    action === 'view' || action === 'edit';

                const disabled =
                    button.props.disabled ||
                    (isNavigationAction &&
                        (row.id === null ||
                            row.id === undefined ||
                            row.id === ''));

                return React.cloneElement(button, {
                    key: button.key ?? `${label}-${index}`,
                    type: 'button',
                    disabled,
                    title: label,
                    'aria-label': `${label} ${row.title || 'request'}`,
                    onClick: (event) => handleAction(button, label, event),
                    className: `inline-flex h-7 w-7 shrink-0 items-center justify-center border border-transparent bg-transparent p-0 transition-colors duration-150 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-40 ${
                        warning
                            ? 'text-[#D0AA70] hover:border-[#443723] hover:bg-[#241E15]'
                            : 'text-[#8792A1] hover:border-[#303A47] hover:bg-[#1A222D] hover:text-[#EEF1F5]'
                    }`,
                    children: <Icon size={14} strokeWidth={1.8} />,
                });
            })}
        </div>
    );
}

// ============================================================
// MOBILE REQUEST ROW
// ============================================================

function MobileRequestRow({ row, actionColumn, onRequesterClick }) {
    return (
        <article className="border-b border-[#202832] bg-[#0E1219] px-4 py-4 last:border-b-0">
            <RequestIdentity row={row} />

            <div className="mt-3 border-t border-[#202832] pt-3">
                <RequesterCell row={row} onRequesterClick={onRequesterClick} />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <PriorityCell row={row} />
                    <RequestStatus row={row} />
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#202832] pt-3">
                <span className="text-[10px] text-[#697586]">
                    Request #{row.serialNumber ?? row.id}
                </span>

                <RowActions column={actionColumn} row={row} />
            </div>
        </article>
    );
}

// ============================================================
// HELP REQUEST TABLE
// ============================================================

export default function Table({
    columns = [],
    rows = [],
    onSort,
    getSortIcon,
    resultCount,
    onRequesterClick,
}) {
    const actionColumn = columns.find(
        (column) => column.key === 'id' || column.key === 'actions',
    );

    const enhancedColumns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '56px',
            render: (value) => (
                <span className="text-[11px] font-medium! tabular-nums text-[#697586]">
                    {String(value ?? '—').padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',
            width: 'minmax(210px, 1.7fr)',
            render: (_, row) => <RequestIdentity row={row} />,
        },
        {
            key: 'requesterName',
            header: 'Requester',
            width: 'minmax(155px, 1fr)',
            render: (_, row) => (
                <RequesterCell row={row} onRequesterClick={onRequesterClick} />
            ),
        },
        {
            key: 'priority',
            header: 'Urgency',
            sortable: true,
            sortKey: 'priority',
            width: 'minmax(90px, 0.55fr)',
            render: (_, row) => <PriorityCell row={row} />,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: 'minmax(115px, 0.75fr)',
            render: (_, row) => <RequestStatus row={row} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '155px',
            render: (_, row) => <RowActions column={actionColumn} row={row} />,
        },
    ];

    const emptyState = (
        <div className="flex min-h-65 flex-col items-center justify-center bg-[#0E1219] px-6 py-10 text-center">
            <ClipboardList
                size={21}
                strokeWidth={1.5}
                className="text-[#697586]"
            />

            <p className="mt-3 text-[13px] font-semibold! text-[#EEF1F5]">
                No help requests found
            </p>

            <p className="mt-1 text-[11px] text-[#697586]">
                Try changing your search or filter options.
            </p>
        </div>
    );

    return (
        <>
            {/* MOBILE */}
            <div className="bg-[#0E1219] lg:hidden">
                {rows.length === 0
                    ? emptyState
                    : rows.map((row) => (
                          <MobileRequestRow
                              key={row.id}
                              row={row}
                              actionColumn={actionColumn}
                              onRequesterClick={onRequesterClick}
                          />
                      ))}
            </div>

            {/* DESKTOP — SHARED DATA TABLE */}
            <div className="hidden min-w-0 bg-[#0E1219] lg:block">
                <DataTable
                    columns={enhancedColumns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
                    empty={{
                        icon: ClipboardList,
                        title: 'No help requests found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </>
    );
}
