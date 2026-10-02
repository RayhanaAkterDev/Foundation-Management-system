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
       EMPTY
    ====================================================================== */

    if (rows.length === 0) {
        return (
            <div
                className="
                    min-h-65
                    bg-[#22252D]
                "
            >
                <EmptyState {...(empty || {})} />
            </div>
        );
    }

    /* ======================================================================
       TABLE
    ====================================================================== */

    return (
        <div
            className="
                w-full
                min-w-0
                bg-[#22252D]
            "
        >
            {/* =============================================================
                SCROLL AREA
            ============================================================= */}

            <div
                className="
                    w-full
                    overflow-x-auto
                    overscroll-x-contain

                    [&::-webkit-scrollbar]:h-1.5
                    [&::-webkit-scrollbar-track]:bg-[#1F2229]
                    [&::-webkit-scrollbar-thumb]:bg-[#404754]

                    hover:[&::-webkit-scrollbar-thumb]:bg-[#515866]
                "
            >
                <div className="min-w-190">
                    {/* =====================================================
                        TABLE HEADER
                    ===================================================== */}

                    <div
                        role="row"
                        className="
                            grid
                            min-h-11
                            items-center

                            border-b
                            border-[#343944]

                            bg-[#1F2229]

                            px-3

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

                                        text-[#7F8794]!

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

                                                text-[#7F8794]!

                                                transition-colors
                                                duration-150

                                                hover:text-[#C3C7CF]!

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

                                                    text-[#626A78]!

                                                    transition-colors
                                                    duration-150

                                                    group-hover:text-[#A8AFBB]!
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
                        TABLE BODY
                    ===================================================== */}

                    <div role="rowgroup">
                        {rows.map((row, rowIndex) => (
                            <div
                                key={row[keyField] ?? rowIndex}
                                role="row"
                                className="
                                        group
                                        relative

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
                                {/* =====================================
                                        ROW HOVER INDICATOR
                                    ===================================== */}

                                <span
                                    aria-hidden="true"
                                    className="
                                            pointer-events-none
                                            absolute
                                            bottom-2.5
                                            left-0
                                            top-2.5

                                            w-0.5

                                            bg-[#7F8794]

                                            opacity-0

                                            transition-opacity
                                            duration-150

                                            group-hover:opacity-100
                                        "
                                />

                                {/* =====================================
                                        CELLS
                                    ===================================== */}

                                {columns.map((column) => (
                                    <div
                                        key={column.key}
                                        role="cell"
                                        className={`
                                                    min-w-0

                                                    px-2
                                                    py-3

                                                    text-[11.5px]
                                                    leading-5

                                                    text-[#C3C7CF]!

                                                    ${getAlignmentClass(
                                                        column.align,
                                                    )}
                                                `}
                                    >
                                        <div
                                            className={`
                                                        min-w-0

                                                        ${
                                                            column.nowrap
                                                                ? 'whitespace-nowrap'
                                                                : 'wrap-break-word'
                                                        }
                                                    `}
                                        >
                                            {column.render
                                                ? column.render(
                                                      row[column.key],
                                                      row,
                                                  )
                                                : (row[column.key] ?? '—')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
