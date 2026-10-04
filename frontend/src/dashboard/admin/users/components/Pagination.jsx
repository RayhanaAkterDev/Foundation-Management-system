import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

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
                bg-[#20232A]
                px-3
                py-3

                sm:px-4
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* =====================================================
                    RESULT SUMMARY
                ===================================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-3

                        sm:justify-start
                    "
                >
                    <p
                        className="
                            whitespace-nowrap
                            text-[10px]
                            leading-5
                            text-[#6F7785]

                            sm:text-[11px]
                        "
                    >
                        Showing{' '}
                        <span
                            className="
                                font-semibold
                                tabular-nums
                                text-[#C3C7CF]
                            "
                        >
                            {startItem}–{endItem}
                        </span>{' '}
                        of{' '}
                        <span
                            className="
                                font-semibold
                                tabular-nums
                                text-[#C3C7CF]
                            "
                        >
                            {totalItems}
                        </span>
                    </p>

                    <span
                        className="
                            hidden
                            h-3.5
                            w-px
                            bg-[#343944]

                            sm:block
                        "
                    />

                    <p
                        className="
                            hidden
                            whitespace-nowrap
                            text-[10px]
                            text-[#6F7785]

                            sm:block
                        "
                    >
                        Page{' '}
                        <span
                            className="
                                font-medium
                                tabular-nums
                                text-[#9299A6]
                            "
                        >
                            {currentPage}
                        </span>{' '}
                        of{' '}
                        <span
                            className="
                                font-medium
                                tabular-nums
                                text-[#9299A6]
                            "
                        >
                            {totalPages}
                        </span>
                    </p>
                </div>

                {/* =====================================================
                    CONTROLS
                ===================================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-2

                        sm:justify-end
                    "
                >
                    {/* Previous */}

                    <button
                        type="button"
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="
                            inline-flex
                            h-8
                            shrink-0
                            items-center
                            justify-center
                            gap-1

                            border
                            border-[#343944]

                            bg-[#22252D]

                            px-2.5

                            text-[10px]
                            font-medium
                            text-[#9299A6]

                            transition-colors

                            hover:border-[#404754]
                            hover:bg-[#272B34]
                            hover:text-[#F1F2F4]

                            disabled:cursor-not-allowed
                            disabled:opacity-30
                            disabled:hover:border-[#343944]
                            disabled:hover:bg-[#22252D]
                            disabled:hover:text-[#9299A6]

                            sm:px-3
                        "
                    >
                        <ChevronLeft size={13} strokeWidth={1.8} />

                        <span className="hidden xs:inline sm:inline">
                            Previous
                        </span>
                    </button>

                    {/* Pages */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            justify-center
                            gap-1
                        "
                    >
                        {pages.map((page, index) => {
                            const previousPage = pages[index - 1];

                            const showEllipsis =
                                previousPage && page - previousPage > 1;

                            const active = currentPage === page;

                            return (
                                <React.Fragment key={page}>
                                    {showEllipsis && (
                                        <span
                                            aria-hidden="true"
                                            className="
                                                    flex
                                                    h-8
                                                    w-4
                                                    items-center
                                                    justify-center

                                                    text-[10px]
                                                    text-[#6F7785]
                                                "
                                        >
                                            …
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        aria-label={`Go to page ${page}`}
                                        onClick={() => onPageChange(page)}
                                        className={`
                                                flex
                                                h-8
                                                min-w-8
                                                items-center
                                                justify-center

                                                border

                                                px-2

                                                text-[10px]
                                                font-semibold
                                                tabular-nums

                                                transition-colors

                                                ${
                                                    active
                                                        ? 'border-[#515866] bg-[#393F4C] text-[#F1F2F4]'
                                                        : 'border-transparent text-[#7F8794] hover:border-[#343944] hover:bg-[#272B34] hover:text-[#C3C7CF]'
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
                        aria-label="Next page"
                        className="
                            inline-flex
                            h-8
                            shrink-0
                            items-center
                            justify-center
                            gap-1

                            border
                            border-[#343944]

                            bg-[#22252D]

                            px-2.5

                            text-[10px]
                            font-medium
                            text-[#9299A6]

                            transition-colors

                            hover:border-[#404754]
                            hover:bg-[#272B34]
                            hover:text-[#F1F2F4]

                            disabled:cursor-not-allowed
                            disabled:opacity-30
                            disabled:hover:border-[#343944]
                            disabled:hover:bg-[#22252D]
                            disabled:hover:text-[#9299A6]

                            sm:px-3
                        "
                    >
                        <span className="hidden xs:inline sm:inline">Next</span>

                        <ChevronRight size={13} strokeWidth={1.8} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Pagination;
