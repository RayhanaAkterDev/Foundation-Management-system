import React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import EmptyState from './EmptyState';

const DataTable = ({
    columns = [],
    rows = [],
    keyField = 'id',
    title,
    action,
    empty,
    onSort,
    getSortIcon,
    resultCount,
}) => {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-white">
            {/* Table Header */}
            {(title || action || resultCount !== undefined) && (
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                    <div className="min-w-0">
                        {title && (
                            <h2 className="text-sm font-semibold text-text-primary">
                                {title}
                            </h2>
                        )}

                        {resultCount !== undefined && (
                            <p
                                className={`text-xs text-text-secondary ${
                                    title ? 'mt-1' : ''
                                }`}
                            >
                                {resultCount}{' '}
                                {resultCount === 1 ? 'user' : 'users'} found
                            </p>
                        )}
                    </div>

                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}

            {/* Empty */}
            {rows.length === 0 ? (
                <div className="px-6 py-16">
                    <EmptyState {...(empty || {})} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-205">
                        <thead>
                            <tr className="border-b border-border bg-background-alt/35">
                                {columns.map((col) => {
                                    const sortable = col.sortable && onSort;

                                    const sortKey = col.sortKey || col.key;

                                    return (
                                        <th
                                            key={col.key}
                                            style={{
                                                width: col.width,
                                            }}
                                            className={`whitespace-nowrap px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary ${
                                                col.align === 'right'
                                                    ? 'text-right'
                                                    : col.align === 'center'
                                                      ? 'text-center'
                                                      : 'text-left'
                                            }`}
                                        >
                                            {sortable ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onSort(sortKey)
                                                    }
                                                    className={`group inline-flex items-center gap-1.5 transition-colors hover:text-text-primary ${
                                                        col.align === 'right'
                                                            ? 'ml-auto'
                                                            : ''
                                                    }`}
                                                >
                                                    <span>{col.header}</span>

                                                    <span className="flex h-4 w-4 items-center justify-center text-text-secondary transition-colors group-hover:text-primary">
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
                                    className="group border-b border-border/70 transition-colors last:border-b-0 hover:bg-background-alt/30"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-5 py-4 text-[13px] text-text-primary ${
                                                col.align === 'right'
                                                    ? 'text-right'
                                                    : col.align === 'center'
                                                      ? 'text-center'
                                                      : 'text-left'
                                            }`}
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : (row[col.key] ?? '—')}
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
