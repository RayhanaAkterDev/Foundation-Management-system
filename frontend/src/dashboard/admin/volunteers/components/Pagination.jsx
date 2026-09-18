import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    perPage = 10,
    onPageChange,
}) => {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;

    const end =
        totalItems === 0 ? 0 : Math.min(currentPage * perPage, totalItems);

    const getPages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, 'ellipsis', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [
                1,
                'ellipsis',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            'ellipsis',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            'ellipsis-end',
            totalPages,
        ];
    };

    const pages = getPages();

    return (
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-text-secondary">
                Showing{' '}
                <span className="font-semibold text-text-primary">
                    {start}–{end}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-text-primary">
                    {totalItems}
                </span>{' '}
                volunteers
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex h-8 w-8 items-center justify-center border border-border bg-white text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={15} strokeWidth={1.8} />
                </button>

                {pages.map((page, index) => {
                    if (typeof page !== 'number') {
                        return (
                            <span
                                key={`${page}-${index}`}
                                className="flex h-8 w-7 items-center justify-center text-[11px] text-text-secondary"
                            >
                                …
                            </span>
                        );
                    }

                    const active = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange?.(page)}
                            className={`
                                flex h-8 min-w-8 items-center justify-center border px-2 text-[11px] font-semibold transition-colors
                                ${
                                    active
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-border bg-white text-text-secondary hover:bg-background-alt hover:text-text-primary'
                                }
                            `}
                            aria-current={active ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex h-8 w-8 items-center justify-center border border-border bg-white text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Next page"
                >
                    <ChevronRight size={15} strokeWidth={1.8} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
