import React from 'react';

import { ChevronsUpDown } from 'lucide-react';

import EmptyState from './EmptyState';

// ============================================================
// HELPERS
// ============================================================

const getAlignmentClass = (align) => {
    if (align === 'right') {
        return 'text-right';
    }

    if (align === 'center') {
        return 'text-center';
    }

    return 'text-left';
};

const getContentAlignmentClass = (align) => {
    if (align === 'right') {
        return 'justify-end';
    }

    if (align === 'center') {
        return 'justify-center';
    }

    return 'justify-start';
};

// ============================================================
// DATA TABLE
// ============================================================

const DataTable = ({
    columns = [],
    rows = [],
    keyField = 'id',
    empty,
    onSort,
    getSortIcon,
}) => {
    const gridTemplate = columns
        .map((column) => column.width || 'minmax(0, 1fr)')
        .join(' ');

    // ========================================================
    // EMPTY STATE
    // ========================================================

    if (rows.length === 0) {
        return (
            <div
                className="
                    flex
                    min-h-65
                    w-full
                    items-center
                    justify-center

                    bg-[#22252D]

                    px-5
                    py-10
                "
            >
                <div
                    className="
                        w-full
                        max-w-70
                    "
                >
                    <EmptyState
                        icon={empty?.icon}
                        title={empty?.title || 'No records found'}
                        message={
                            empty?.message ||
                            'There is currently no data to display.'
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            role="table"
            className="
                min-w-190
                w-full

                bg-[#22252D]
                isolate
            "
        >
            {/* =====================================================
                ACTUAL TABLE COLUMN HEADER

                THIS is the sticky row:
                # / User / Role / Verification / Status / Actions

                The outer Users.jsx table area is the scroll container.
            ===================================================== */}

            <div
                role="row"
                className="
                    sticky
                    top-0
                    z-40

                    grid
                    min-h-11
                    items-center

                    border-b
                    border-[#343944]

                    bg-[#1F2229]

                    px-3

                    shadow-[0_1px_0_rgba(52,57,68,1)]

                    sm:px-4
                "
                style={{
                    gridTemplateColumns: gridTemplate,
                }}
            >
                {columns.map((column) => {
                    const sortable = Boolean(column.sortable && onSort);

                    const sortKey = column.sortKey || column.key;

                    return (
                        <div
                            key={column.key}
                            role="columnheader"
                            className={`
                                min-w-0
                                px-2

                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.13em]

                                text-[#7F8794]

                                ${getAlignmentClass(column.align)}
                            `}
                        >
                            {sortable ? (
                                <button
                                    type="button"
                                    onClick={() => onSort(sortKey)}
                                    className={`
                                        group

                                        inline-flex
                                        min-h-8
                                        items-center
                                        gap-1.5

                                        whitespace-nowrap

                                        text-[#7F8794]

                                        transition-colors
                                        duration-150

                                        hover:text-[#C3C7CF]

                                        focus:outline-none
                                        focus:ring-0

                                        ${
                                            column.align === 'right'
                                                ? 'ml-auto'
                                                : ''
                                        }

                                        ${
                                            column.align === 'center'
                                                ? 'mx-auto'
                                                : ''
                                        }
                                    `}
                                >
                                    <span>{column.header}</span>

                                    <span
                                        className="
                                            flex
                                            h-4
                                            w-4
                                            shrink-0
                                            items-center
                                            justify-center

                                            text-[#626A78]

                                            transition-colors
                                            duration-150

                                            group-hover:text-[#A8AFBB]
                                        "
                                    >
                                        {getSortIcon ? (
                                            getSortIcon(sortKey)
                                        ) : (
                                            <ChevronsUpDown
                                                size={12}
                                                strokeWidth={1.8}
                                            />
                                        )}
                                    </span>
                                </button>
                            ) : (
                                <span
                                    className={`
                                        flex
                                        min-h-8
                                        items-center

                                        ${getContentAlignmentClass(
                                            column.align,
                                        )}
                                    `}
                                >
                                    {column.header}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* =====================================================
                TABLE DATA ROWS
            ===================================================== */}

            <div role="rowgroup">
                {rows.map((row, rowIndex) => (
                    <div
                        key={row[keyField] ?? rowIndex}
                        role="row"
                        className="
                                grid
                                min-h-15
                                items-center

                                border-b
                                border-[#2F333D]

                                bg-[#22252D]

                                px-3

                                transition-colors
                                duration-150

                                last:border-b-0

                                hover:bg-[#272B34]

                                sm:px-4
                            "
                        style={{
                            gridTemplateColumns: gridTemplate,
                        }}
                    >
                        {columns.map((column) => {
                            const value = row[column.key];

                            return (
                                <div
                                    key={column.key}
                                    role="cell"
                                    className={`
                                                min-w-0
                                                px-2

                                                text-[11px]
                                                leading-5

                                                text-[#C3C7CF]

                                                ${getAlignmentClass(
                                                    column.align,
                                                )}

                                                ${
                                                    column.nowrap
                                                        ? 'whitespace-nowrap'
                                                        : ''
                                                }
                                            `}
                                >
                                    {column.render
                                        ? column.render(value, row, rowIndex)
                                        : (value ?? '—')}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataTable;
