import React from 'react';
import EmptyState from './EmptyState';

const DataTable = ({ columns = [], rows = [], keyField = 'id', title, action, empty }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm min-w-0">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] px-5 py-4">
          {title && (
            <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">{title}</h2>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState {...(empty || {})} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6b7280] ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {rows.map((row) => (
                <tr
                  key={row[keyField]}
                  className="hover:bg-[#f9fafb] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-5 py-3.5 text-text-primary ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;
