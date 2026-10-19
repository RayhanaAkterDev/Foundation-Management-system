import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    perPage = 10,
    itemsPerPage,
    onPageChange,
}) => {
    if (totalItems === 0) return null;
    const size = itemsPerPage ?? perPage;
    const start = (currentPage - 1) * size + 1;
    const end = Math.min(currentPage * size, totalItems);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (page) =>
            totalPages <= 5 ||
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1,
    );
    const move = (page) =>
        onPageChange?.(Math.max(1, Math.min(totalPages, page)));
    const arrowClass =
        'inline-flex h-8 shrink-0 items-center justify-center gap-1 border border-[#29323E] bg-[#0E1219] px-2.5 text-[10px] font-medium! text-[#8792A1] transition-colors hover:border-[#394555] hover:bg-[#151B24] hover:text-[#EEF1F5] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3';
    return (
        <nav
            aria-label="Volunteer pagination"
            className="bg-[#121821] px-3 py-3 sm:px-4"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-[#697586]">
                    Showing{' '}
                    <span className="font-semibold! tabular-nums text-[#B8C0CA]">
                        {start}–{end}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold! tabular-nums text-[#B8C0CA]">
                        {totalItems}
                    </span>{' '}
                    volunteers
                </p>
                <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={() => move(currentPage - 1)}
                        disabled={currentPage <= 1}
                        aria-label="Previous page"
                        className={arrowClass}
                    >
                        <ChevronLeft size={13} strokeWidth={1.8} />
                        <span className="hidden sm:inline">Previous</span>
                    </button>
                    <div className="flex min-w-0 items-center justify-center gap-1">
                        {pages.map((page, index) => (
                            <React.Fragment key={page}>
                                {index > 0 && page - pages[index - 1] > 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="flex h-8 w-4 items-center justify-center text-[10px] text-[#5E6978]"
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
                                    onClick={() => move(page)}
                                    className={`flex h-8 min-w-8 items-center justify-center border px-2 text-[10px] font-semibold! tabular-nums transition-colors focus:outline-none focus:ring-0 ${currentPage === page ? 'border-[#394555] bg-[#1D2632] text-[#EEF1F5]' : 'border-transparent bg-transparent text-[#697586] hover:border-[#29323E] hover:bg-[#151B24] hover:text-[#B8C0CA]'}`}
                                >
                                    {page}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => move(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        aria-label="Next page"
                        className={arrowClass}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={13} strokeWidth={1.8} />
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Pagination;
