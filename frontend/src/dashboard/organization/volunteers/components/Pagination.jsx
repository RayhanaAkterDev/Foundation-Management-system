import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    perPage = 25,
    onPageChange,
}) {
    const pageCount = Math.max(1, totalPages);
    const page = Math.max(1, Math.min(currentPage, pageCount));

    if (totalItems === 0) return null;

    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, totalItems);

    const pages = Array.from(
        { length: pageCount },
        (_, index) => index + 1,
    ).filter((number) => {
        if (pageCount <= 5) return true;

        return (
            number === 1 || number === pageCount || Math.abs(number - page) <= 1
        );
    });

    return (
        <nav
            aria-label="Volunteer pagination"
            className="bg-[#121821] px-3 py-3 sm:px-4"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-[#697586]">
                    Showing{' '}
                    <span className="font-semibold! text-[#B8C0CA]">
                        {start}–{end}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold! text-[#B8C0CA]">
                        {totalItems}
                    </span>
                </p>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => onPageChange?.(page - 1)}
                        className="inline-flex h-8 items-center gap-1 border border-[#29323E] bg-[#0E1219] px-3 text-[11px] font-medium! text-[#8792A1] transition-colors hover:bg-[#151B24] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft size={13} />
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {pages.map((number, index) => {
                            const previous = pages[index - 1];
                            const showEllipsis =
                                previous && number - previous > 1;

                            const active = page === number;

                            return (
                                <React.Fragment key={number}>
                                    {showEllipsis && (
                                        <span className="px-1 text-[11px] text-[#697586]">
                                            …
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => onPageChange?.(number)}
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        className={`flex h-8 min-w-8 items-center justify-center border px-2 text-[11px] font-semibold! transition-colors ${
                                            active
                                                ? 'border-[#394555] bg-[#1D2632] text-[#EEF1F5]'
                                                : 'border-transparent text-[#697586] hover:border-[#29323E] hover:bg-[#151B24] hover:text-[#B8C0CA]'
                                        }`}
                                    >
                                        {number}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        disabled={page === pageCount}
                        onClick={() => onPageChange?.(page + 1)}
                        className="inline-flex h-8 items-center gap-1 border border-[#29323E] bg-[#0E1219] px-3 text-[11px] font-medium! text-[#8792A1] transition-colors hover:bg-[#151B24] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Next
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
