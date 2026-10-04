import React from 'react';

import { ChevronsUpDown } from 'lucide-react';

import EmptyState from './EmptyState';

/* ==========================================================================
   HELPERS
============================================================================ */

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

/* ==========================================================================
   DATA TABLE
============================================================================ */

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

    /* ======================================================================
       EMPTY STATE
    ====================================================================== */

    if (rows.length === 0) {
        return (
            <div
                className="
                    flex
                    min-h-65
                    w-full
                    items-center
                    justify-center

                    bg-[#0E1219]

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
                isolate
                min-w-190
                w-full

                bg-[#0E1219]
            "
        >
            {/* =============================================================
                COLUMN HEADER
            ============================================================= */}

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
                    border-[#252D38]

                    bg-[#121821]

                    px-3

                    shadow-[0_1px_0_rgba(37,45,56,0.9)]

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
                                font-semibold!
                                uppercase
                                tracking-[0.13em]

                                text-[#697586]

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

                                        text-[#697586]

                                        transition-colors
                                        duration-150

                                        hover:text-[#AEB7C3]

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

                                            text-[#566171]

                                            transition-colors
                                            duration-150

                                            group-hover:text-[#929CAA]
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

            {/* =============================================================
                TABLE DATA ROWS
            ============================================================= */}

            <div role="rowgroup">
                {rows.map((row, rowIndex) => (
                    <div
                        key={row[keyField] ?? rowIndex}
                        role="row"
                        className="
                            group/row

                            grid
                            min-h-15
                            items-center

                            border-b
                            border-[#202832]

                            bg-[#0E1219]

                            px-3

                            transition-colors
                            duration-150
                            ease-out

                            last:border-b-0

                            hover:bg-[#151B24]

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

                                        text-[#B8C0CA]

                                        transition-colors
                                        duration-150

                                        group-hover/row:text-[#C8CED6]

                                        ${getAlignmentClass(column.align)}

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
