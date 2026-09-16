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

    return (
        <section className="overflow-hidden border border-border bg-surface">
            {rows.length === 0 ? (
                <div className="px-5 py-14 sm:px-6 sm:py-16">
                    <EmptyState {...(empty || {})} />
                </div>
            ) : (
                <div className="w-full overflow-x-auto overscroll-x-contain">
                    <table className="w-full min-w-190 border-collapse bg-background-alt">
                        <thead>
                            <tr className="border-b border-border bg-background">
                                {columns.map((col) => {
                                    const sortable = col.sortable && onSort;
                                    const sortKey = col.sortKey || col.key;

                                    return (
                                        <th
                                            key={col.key}
                                            style={{
                                                width: col.width,
                                            }}
                                            className={`
                                                whitespace-nowrap
                                                px-4 py-3.5
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-widest
                                                text-text-secondary
                                                sm:px-5
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
                                                        ${col.align === 'right' ? 'ml-auto' : ''}
                                                    `}
                                                >
                                                    <span>{col.header}</span>

                                                    <span
                                                        className="
                                                            flex h-4 w-4 shrink-0
                                                            items-center justify-center
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
                                                                strokeWidth={
                                                                    1.8
                                                                }
                                                            />
                                                        )}
                                                    </span>
                                                </button>
                                            ) : (
                                                col.header
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row[keyField]}
                                    className="
                                        group
                                        border-b border-border/70
                                        transition-colors
                                        last:border-b-0
                                        hover:bg-background-alt/30
                                    "
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`
                                                px-4 py-3.5
                                                text-[13px]
                                                leading-5
                                                text-text-primary
                                                sm:px-5 sm:py-4
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
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default DataTable;
