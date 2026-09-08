import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const CampaignPagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const startItem =
        totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium text-text-secondary">
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
                campaigns
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-text-secondary transition-colors hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={[
                            'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[10px] font-bold transition-colors',
                            page === currentPage
                                ? 'bg-primary text-white'
                                : 'border border-border bg-white text-text-secondary hover:border-primary/30 hover:text-primary',
                        ].join(' ')}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-text-secondary transition-colors hover:border-primary/30 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
};

export default CampaignPagination;
