import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-center mt-16">
            <div className="flex items-center gap-6">
                {/* Prev */}
                <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="
                        flex items-center gap-2
                        text-text-secondary
                        hover:text-primary hover:opacity-90
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        disabled:pointer-events-none
                    "
                >
                    <FiChevronLeft />
                    <span className="text-sm font-medium">Previous</span>
                </button>

                {/* Center indicator */}
                <div
                    className="
                    text-sm text-text-secondary
                    px-3 py-1 rounded-md
                    bg-muted/20
                    border border-border/30
                "
                >
                    Page{' '}
                    <span className="text-text-primary font-semibold">
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
                        flex items-center gap-2
                        text-text-secondary
                        hover:text-primary hover:opacity-90
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        disabled:pointer-events-none
                    "
                >
                    <span className="text-sm font-medium">Next</span>
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
