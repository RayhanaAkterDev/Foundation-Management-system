import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HelpRequestPagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [
                1,
                '...',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ];
    };

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary">
                Showing{' '}
                <span className="font-semibold text-text-primary">
                    {startItem}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-text-primary">
                    {endItem}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-text-primary">
                    {totalItems}
                </span>{' '}
                requests
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-text-secondary transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={15} />
                </button>

                {getPages().map((page, index) =>
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex h-8 w-8 items-center justify-center text-xs text-text-secondary"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-semibold transition-colors ${
                                currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'border border-border bg-white text-text-secondary hover:border-primary/30 hover:text-primary'
                            }`}
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-text-secondary transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
};

export default HelpRequestPagination;
