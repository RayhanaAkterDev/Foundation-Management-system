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
                bg-[#121821]

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

                            text-[#697586]

                            sm:text-[11px]
                        "
                    >
                        Showing{' '}
                        <span
                            className="
                                font-semibold!
                                tabular-nums

                                text-[#B8C0CA]
                            "
                        >
                            {startItem}–{endItem}
                        </span>{' '}
                        of{' '}
                        <span
                            className="
                                font-semibold!
                                tabular-nums

                                text-[#B8C0CA]
                            "
                        >
                            {totalItems}
                        </span>
                    </p>

                    <span
                        aria-hidden="true"
                        className="
                            hidden
                            h-3.5
                            w-px

                            bg-[#303A47]

                            sm:block
                        "
                    />

                    <p
                        className="
                            hidden
                            whitespace-nowrap

                            text-[10px]

                            text-[#697586]

                            sm:block
                        "
                    >
                        Page{' '}
                        <span
                            className="
                                font-medium!
                                tabular-nums

                                text-[#8792A1]
                            "
                        >
                            {currentPage}
                        </span>{' '}
                        of{' '}
                        <span
                            className="
                                font-medium!
                                tabular-nums

                                text-[#8792A1]
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
                    {/* =================================================
                        PREVIOUS
                    ================================================= */}

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
                            border-[#29323E]

                            bg-[#0E1219]

                            px-2.5

                            text-[10px]
                            font-medium!

                            text-[#8792A1]

                            transition-[background-color,border-color,color]
                            duration-150
                            ease-out

                            hover:border-[#394555]
                            hover:bg-[#151B24]
                            hover:text-[#EEF1F5]

                            focus:outline-none
                            focus:ring-0

                            disabled:cursor-not-allowed
                            disabled:opacity-30

                            disabled:hover:border-[#29323E]
                            disabled:hover:bg-[#0E1219]
                            disabled:hover:text-[#8792A1]

                            sm:px-3
                        "
                    >
                        <ChevronLeft size={13} strokeWidth={1.8} />

                        <span className="hidden xs:inline sm:inline">
                            Previous
                        </span>
                    </button>

                    {/* =================================================
                        PAGES
                    ================================================= */}

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

                                                text-[#5E6978]
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
                                            font-semibold!
                                            tabular-nums

                                            transition-[background-color,border-color,color]
                                            duration-150
                                            ease-out

                                            focus:outline-none
                                            focus:ring-0

                                            ${
                                                active
                                                    ? `
                                                        border-[#394555]
                                                        bg-[#1D2632]
                                                        text-[#EEF1F5]
                                                    `
                                                    : `
                                                        border-transparent
                                                        bg-transparent
                                                        text-[#697586]

                                                        hover:border-[#29323E]
                                                        hover:bg-[#151B24]
                                                        hover:text-[#B8C0CA]
                                                    `
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* =================================================
                        NEXT
                    ================================================= */}

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
                            border-[#29323E]

                            bg-[#0E1219]

                            px-2.5

                            text-[10px]
                            font-medium!

                            text-[#8792A1]

                            transition-[background-color,border-color,color]
                            duration-150
                            ease-out

                            hover:border-[#394555]
                            hover:bg-[#151B24]
                            hover:text-[#EEF1F5]

                            focus:outline-none
                            focus:ring-0

                            disabled:cursor-not-allowed
                            disabled:opacity-30

                            disabled:hover:border-[#29323E]
                            disabled:hover:bg-[#0E1219]
                            disabled:hover:text-[#8792A1]

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
