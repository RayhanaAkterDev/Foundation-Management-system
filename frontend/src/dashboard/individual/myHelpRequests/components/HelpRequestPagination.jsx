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
        <div className="flex min-h-9 items-center justify-between gap-4 px-1">
            <p className="whitespace-nowrap text-[11px] leading-4 text-text-secondary">
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

            <div className="flex shrink-0 items-center rounded-md border border-border bg-white">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className="
                        rounded-l-md
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-text-secondary
                        transition-colors
                        hover:bg-background-alt
                        hover:text-text-primary
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                    "
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
                                <span className="px-1 text-[11px] text-text-secondary">
                                    …
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={`
                                    h-7
                                    min-w-7
                                    rounded-md
                                    px-2
                                    text-[11px]
                                    font-semibold
                                    transition-all
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

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className="
                        rounded-r-md
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-text-secondary
                        transition-colors
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
    );
};

export default HelpRequestPagination;
