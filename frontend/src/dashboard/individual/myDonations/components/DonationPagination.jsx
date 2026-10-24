import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DonationPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) {
    const startItem =
        totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    ).filter((page) => {
        if (totalPages <= 5) return true;

        return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
        );
    });

    const navigationClass =
        'inline-flex h-8 shrink-0 items-center justify-center gap-1 border border-[#29323E] bg-[#0E1219] px-2.5 text-[10px] font-medium! text-[#8792A1] transition-colors hover:border-[#394555] hover:bg-[#151B24] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-30 sm:px-3';

    return (
        <nav
            aria-label="Donation pagination"
            className="bg-[#121821] px-3 py-3 sm:px-4"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="whitespace-nowrap text-[10px] leading-5 text-[#697586] sm:text-[11px]">
                    Showing{' '}
                    <span className="font-semibold! tabular-nums text-[#B8C0CA]">
                        {startItem}–{endItem}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold! tabular-nums text-[#B8C0CA]">
                        {totalItems}
                    </span>
                </p>

                <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={() =>
                            onPageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className={navigationClass}
                    >
                        <ChevronLeft size={13} strokeWidth={1.8} />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex min-w-0 items-center justify-center gap-1">
                        {pages.map((page, index) => {
                            const previousPage = pages[index - 1];
                            const showEllipsis =
                                previousPage && page - previousPage > 1;
                            const active = currentPage === page;

                            return (
                                <span
                                    key={page}
                                    className="inline-flex items-center gap-1"
                                >
                                    {showEllipsis && (
                                        <span className="flex h-8 w-4 items-center justify-center text-[10px] text-[#5E6978]">
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
                                        className={`flex h-8 min-w-8 items-center justify-center border px-2 text-[10px] font-semibold! tabular-nums transition-colors ${
                                            active
                                                ? 'border-[#394555] bg-[#1D2632] text-[#EEF1F5]'
                                                : 'border-transparent bg-transparent text-[#697586] hover:border-[#29323E] hover:bg-[#151B24] hover:text-[#B8C0CA]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                </span>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onPageChange(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className={navigationClass}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={13} strokeWidth={1.8} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
