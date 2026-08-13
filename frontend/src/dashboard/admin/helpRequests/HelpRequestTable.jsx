import React from 'react';

const HelpRequestTable = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
}) => {
    return (
        <div className="overflow-hidden border border-border bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-225 border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-background-alt">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        width: column.width,
                                    }}
                                    className={`px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary ${
                                        column.align === 'center'
                                            ? 'text-center'
                                            : column.align === 'right'
                                              ? 'text-right'
                                              : 'text-left'
                                    }`}
                                >
                                    {column.sortable ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSort(
                                                    column.sortKey ||
                                                        column.key,
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                                        >
                                            {column.header}
                                            {getSortIcon(
                                                column.sortKey || column.key,
                                            )}
                                        </button>
                                    ) : (
                                        column.header
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length > 0 ? (
                            rows.map((row, rowIndex) => (
                                <tr
                                    key={row.id ?? rowIndex}
                                    className="border-b border-border last:border-b-0 transition-colors hover:bg-background"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`px-4 py-4 text-sm ${
                                                column.align === 'center'
                                                    ? 'text-center'
                                                    : column.align === 'right'
                                                      ? 'text-right'
                                                      : 'text-left'
                                            }`}
                                        >
                                            {column.render
                                                ? column.render(
                                                      row[column.key],
                                                      row,
                                                  )
                                                : (row[column.key] ?? '—')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-14 text-center"
                                >
                                    <p className="text-sm font-semibold text-text-primary">
                                        No help requests found
                                    </p>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        Try changing your filters or search
                                        term.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {resultCount > 0 && (
                <div className="border-t border-border px-4 py-3">
                    <p className="text-xs text-text-secondary">
                        Showing{' '}
                        <span className="font-semibold text-text-primary">
                            {resultCount}
                        </span>{' '}
                        matching {resultCount === 1 ? 'request' : 'requests'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default HelpRequestTable;
