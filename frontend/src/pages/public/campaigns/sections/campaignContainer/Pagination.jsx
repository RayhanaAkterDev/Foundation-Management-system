import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-12 md:mt-16 lg:mt-18">
            <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
                {/* Prev */}
                <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="
                        flex items-center gap-1.5 sm:gap-2
                        text-text-secondary
                        hover:text-primary
                        transition-all duration-200
                        focus:outline-none
                        focus:ring-2 focus:ring-primary/30
                        focus:ring-offset-2
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        disabled:pointer-events-none
                    "
                >
                    <FiChevronLeft className="text-lg" />
                    <span className="hidden sm:inline text-sm font-medium">
                        Previous
                    </span>
                </button>

                {/* Center */}
                <div
                    className="
                        rounded-lg
                        border border-border/40
                        bg-muted/20
                        px-3 sm:px-4
                        py-1.5 sm:py-2
                        text-xs sm:text-sm
                        text-text-secondary
                        whitespace-nowrap
                    "
                >
                    Page{' '}
                    <span className="font-semibold text-text-primary">
                        {currentPage}
                    </span>{' '}
                    of {totalPages}
                </div>

                {/* Next */}
                <button
                    type="button"
                    aria-label="Next page"
                    onClick={() =>
                        onPageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="
                        flex items-center gap-1.5 sm:gap-2
                        text-text-secondary
                        hover:text-primary
                        transition-all duration-200
                        focus:outline-none
                        focus:ring-2 focus:ring-primary/30
                        focus:ring-offset-2
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        disabled:pointer-events-none
                    "
                >
                    <span className="hidden sm:inline text-sm font-medium">
                        Next
                    </span>
                    <FiChevronRight className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
