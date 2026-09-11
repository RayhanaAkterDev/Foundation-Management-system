import React from 'react';

const Pagination = ({
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

    const goToPrevious = () => {
        onPageChange(Math.max(1, currentPage - 1));
    };

    const goToNext = () => {
        onPageChange(Math.min(totalPages, currentPage + 1));
    };

    return (
        <nav
            aria-label="Pagination"
            className="
                bg-background
                px-4 py-3.5
                sm:px-5
            "
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Result summary */}
                <div className="flex items-center justify-between gap-4 sm:justify-start">
                    <p className="text-[12px] leading-5 text-text-secondary">
                        Showing{' '}
                        <span className="font-semibold text-text-primary">
                            {startItem}–{endItem}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-text-primary">
                            {totalItems}
                        </span>
                    </p>

                    <span className="hidden h-4 w-px bg-border sm:block" />

                    <p className="hidden text-[11px] text-text-secondary sm:block">
                        Page{' '}
                        <span className="font-medium text-text-primary">
                            {currentPage}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-text-primary">
                            {totalPages}
                        </span>
                    </p>
                </div>

                {/* Pagination controls */}
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                    {/* Previous */}
                    <button
                        type="button"
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="
                            inline-flex h-8 items-center
                            px-3
                            text-[11px] font-semibold
                            text-text-secondary
                            transition-colors
                            hover:border-primary/25
                            hover:bg-background-alt
                            hover:text-text-primary
                            disabled:cursor-not-allowed
                            disabled:opacity-35
                        "
                    >
                        Previous
                    </button>

                    {/* Pages */}
                    <div className="flex items-center gap-1">
                        {pages.map((page, index) => {
                            const previousPage = pages[index - 1];

                            const showEllipsis =
                                previousPage && page - previousPage > 1;

                            return (
                                <React.Fragment key={page}>
                                    {showEllipsis && (
                                        <span
                                            aria-hidden="true"
                                            className="
                                                flex h-8 w-5
                                                items-center justify-center
                                                text-[11px]
                                                text-text-secondary
                                            "
                                        >
                                            …
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        aria-current={
                                            currentPage === page
                                                ? 'page'
                                                : undefined
                                        }
                                        aria-label={`Go to page ${page}`}
                                        onClick={() => onPageChange(page)}
                                        className={`
                                            flex h-8 min-w-8
                                            items-center justify-center
                                            rounded-md
                                            px-2
                                            text-[11px]
                                            font-semibold
                                            transition-colors
                                            ${
                                                currentPage === page
                                                    ? 'bg-primary text-white'
                                                    : 'text-text-secondary hover:bg-background-alt hover:text-text-primary'
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="
                            inline-flex h-8 items-center
                            px-3
                            text-[11px] font-semibold
                            text-text-secondary
                            transition-colors
                            hover:border-primary/25
                            hover:bg-background-alt
                            hover:text-text-primary
                            disabled:cursor-not-allowed
                            disabled:opacity-35
                        "
                    >
                        Next
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Pagination;
