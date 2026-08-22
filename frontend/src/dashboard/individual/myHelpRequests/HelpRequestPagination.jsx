import React from 'react';

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

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    ).filter((page) => {
        if (totalPages <= 5) {
            return true;
        }

        return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
        );
    });

    return (
        <div className="flex flex-col gap-4 px-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary">
                Showing{' '}
                <span className="font-semibold text-text-primary">
                    {startItem}–{endItem}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-text-primary">
                    {totalItems}
                </span>{' '}
                {totalItems === 1 ? 'help request' : 'help requests'}
            </p>

            <div className="flex items-center rounded-lg border border-border bg-white p-1">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className="rounded-md px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                    Previous
                </button>

                {pages.map((page, index) => {
                    const previousPage = pages[index - 1];

                    const showEllipsis =
                        previousPage && page - previousPage > 1;

                    return (
                        <React.Fragment key={page}>
                            {showEllipsis && (
                                <span className="px-1 text-xs text-text-secondary">
                                    …
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={`h-7 min-w-7 rounded-md px-2 text-xs font-semibold transition-all ${
                                    currentPage === page
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:bg-background-alt hover:text-text-primary'
                                }`}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    );
                })}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className="rounded-md px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default HelpRequestPagination;
