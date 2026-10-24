import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage,
    perPage = 10,
    onPageChange,
    itemLabel = 'assignments',
}) {
    const size = Math.max(1, Number(itemsPerPage ?? perPage) || 10);

    const pageCount = Math.max(1, Number(totalPages) || 1);

    const page = Math.max(1, Math.min(Number(currentPage) || 1, pageCount));

    if (totalItems === 0) {
        return null;
    }

    const startItem = (page - 1) * size + 1;
    const endItem = Math.min(page * size, totalItems);

    const pages = Array.from(
        { length: pageCount },
        (_, index) => index + 1,
    ).filter((number) => {
        if (pageCount <= 5) {
            return true;
        }

        return (
            number === 1 || number === pageCount || Math.abs(number - page) <= 1
        );
    });

    const goToPrevious = () => {
        onPageChange?.(Math.max(1, page - 1));
    };

    const goToNext = () => {
        onPageChange?.(Math.min(pageCount, page + 1));
    };

    return (
        <nav
            aria-label={`${itemLabel} pagination`}
            className="
                bg-[#121821]
                px-3 py-3
                sm:px-4
            "
        >
            <div
                className="
                    flex flex-col gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* RESULT SUMMARY */}

                <div
                    className="
                        flex min-w-0 items-center
                        justify-between gap-3
                        sm:justify-start
                    "
                >
                    <p
                        className="
                            whitespace-nowrap
                            text-[10px] leading-5
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
                </div>

                {/* PAGINATION CONTROLS */}

                <div
                    className="
                        flex min-w-0 items-center
                        justify-between gap-2
                        sm:justify-end
                    "
                >
                    {/* PREVIOUS */}

                    <button
                        type="button"
                        onClick={goToPrevious}
                        disabled={page === 1}
                        aria-label="Previous page"
                        className="
                            inline-flex h-8 shrink-0
                            items-center justify-center gap-1
                            border border-[#29323E]
                            bg-[#0E1219] px-2.5
                            text-[10px] font-medium!
                            text-[#8792A1]
                            transition-[background-color,border-color,color]
                            duration-150 ease-out
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

                    {/* PAGE NUMBERS */}

                    <div
                        className="
                            flex min-w-0 items-center
                            justify-center gap-1
                        "
                    >
                        {pages.map((number, index) => {
                            const previousPage = pages[index - 1];

                            const showEllipsis =
                                previousPage && number - previousPage > 1;

                            const active = page === number;

                            return (
                                <React.Fragment key={number}>
                                    {showEllipsis && (
                                        <span
                                            aria-hidden="true"
                                            className="
                                                flex h-8 w-4
                                                items-center justify-center
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
                                        aria-label={`Go to page ${number}`}
                                        onClick={() => onPageChange?.(number)}
                                        className={`
                                            flex h-8 min-w-8
                                            items-center justify-center
                                            border px-2
                                            text-[10px] font-semibold!
                                            tabular-nums
                                            transition-[background-color,border-color,color]
                                            duration-150 ease-out
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
                                        {number}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* NEXT */}

                    <button
                        type="button"
                        onClick={goToNext}
                        disabled={page === pageCount}
                        aria-label="Next page"
                        className="
                            inline-flex h-8 shrink-0
                            items-center justify-center gap-1
                            border border-[#29323E]
                            bg-[#0E1219] px-2.5
                            text-[10px] font-medium!
                            text-[#8792A1]
                            transition-[background-color,border-color,color]
                            duration-150 ease-out
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
}
