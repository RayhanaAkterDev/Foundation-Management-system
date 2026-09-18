import React from 'react';

import { ChevronsUpDown } from 'lucide-react';

import EmptyState from './EmptyState';

const DataTable = ({
    columns = [],
    rows = [],
    keyField = 'id',
    empty,
    onSort,
    getSortIcon,
}) => {
    const getAlignmentClass = (align) => {
        if (align === 'right') return 'text-right';
        if (align === 'center') return 'text-center';
        return 'text-left';
    };

    const gridTemplate = columns
        .map((col) => col.width || 'minmax(0, 1fr)')
        .join(' ');

    return (
        <section className="overflow-hidden border border-border bg-surface">
            {rows.length === 0 ? (
                <div className="px-5 py-14 sm:px-6 sm:py-16">
                    <EmptyState {...(empty || {})} />
                </div>
            ) : (
                <div className="w-full overflow-x-auto overscroll-x-contain">
                    <div className="min-w-190 bg-background-alt">
                        {/* Header */}
                        <div
                            className="
                                grid
                                items-center
                                border-b
                                border-border
                                bg-background
                                px-4
                                py-3.5
                                sm:px-5
                            "
                            style={{
                                gridTemplateColumns: gridTemplate,
                            }}
                        >
                            {columns.map((col) => {
                                const sortable = col.sortable && onSort;
                                const sortKey = col.sortKey || col.key;

                                return (
                                    <div
                                        key={col.key}
                                        className={`
                                            whitespace-nowrap
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-widest
                                            text-text-secondary
                                            ${getAlignmentClass(col.align)}
                                        `}
                                    >
                                        {sortable ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onSort(sortKey)
                                                }
                                                className={`
                                                    group
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    transition-colors
                                                    hover:text-text-primary
                                                    ${
                                                        col.align === 'right'
                                                            ? 'ml-auto'
                                                            : ''
                                                    }
                                                `}
                                            >
                                                <span>{col.header}</span>

                                                <span
                                                    className="
                                                        flex
                                                        h-4
                                                        w-4
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        text-text-secondary
                                                        transition-colors
                                                        group-hover:text-primary
                                                    "
                                                >
                                                    {getSortIcon ? (
                                                        getSortIcon(sortKey)
                                                    ) : (
                                                        <ChevronsUpDown
                                                            size={14}
                                                            strokeWidth={1.8}
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        ) : (
                                            col.header
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Rows */}
                        <div className="px-2 py-2 sm:px-2.5 sm:py-2.5">
                            {rows.map((row) => (
                                <div
                                    key={row[keyField]}
                                    className="
                                        group
                                        relative
                                        mb-1.5
                                        grid
                                        min-h-17
                                        items-center
                                        rounded-lg
                                        bg-background-alt
                                        px-2
                                        transition-all
                                        duration-200
                                        ease-out
                                        last:mb-0
                                        hover:-translate-y-px
                                        hover:bg-white
                                        hover:shadow-[0_6px_20px_-8px_rgba(15,23,42,0.28)]
                                        sm:px-2.5
                                    "
                                    style={{
                                        gridTemplateColumns: gridTemplate,
                                    }}
                                >
                                    {/* Hover accent */}
                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-0
                                            top-1/2
                                            h-7
                                            w-0.5
                                            -translate-y-1/2
                                            rounded-full
                                            bg-primary
                                            opacity-0
                                            transition-all
                                            duration-200
                                            group-hover:h-9
                                            group-hover:opacity-100
                                        "
                                    />

                                    {columns.map((col) => (
                                        <div
                                            key={col.key}
                                            className={`
                                                min-w-0
                                                px-2
                                                py-3.5
                                                text-[13px]
                                                leading-5
                                                text-text-primary
                                                transition-colors
                                                duration-200
                                                group-hover:text-text-primary
                                                sm:px-2.5
                                                sm:py-4
                                                ${getAlignmentClass(col.align)}
                                            `}
                                        >
                                            <div
                                                className={`
                                                    min-w-0
                                                    ${
                                                        col.nowrap
                                                            ? 'whitespace-nowrap'
                                                            : 'wrap-break-word'
                                                    }
                                                `}
                                            >
                                                {col.render
                                                    ? col.render(
                                                          row[col.key],
                                                          row,
                                                      )
                                                    : (row[col.key] ?? '—')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DataTable;