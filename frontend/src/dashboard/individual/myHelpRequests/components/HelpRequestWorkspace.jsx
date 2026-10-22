import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import HelpRequestFilters from './HelpRequestFilters';
import HelpRequestTable from './HelpRequestTable';
import HelpRequestPagination from './HelpRequestPagination';

export default function HelpRequestWorkspace({
    categoryTabs,
    activeCategory,
    onCategoryChange,
    searchTerm,
    categoryFilter,
    priorityFilter,
    statusFilter,
    helpRequests,
    onSearchChange,
    onCategoryFilterChange,
    onPriorityChange,
    onStatusChange,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const reset = () => {
        onCategoryChange('all');
        onCategoryFilterChange({ target: { value: 'all' } });
        onPriorityChange({ target: { value: 'all' } });
        onStatusChange({ target: { value: 'all' } });
    };
    const filters = {
        categoryTabs,
        activeCategory,
        onCategoryChange,
        categoryFilter,
        priorityFilter,
        statusFilter,
        helpRequests,
        onCategoryFilterChange,
        onPriorityChange,
        onStatusChange,
        onClearFilters: reset,
    };
    return (
        <section className="pt-2 lg:pt-3">
            <div className="mb-5">
                <h2 className="text-[20px] font-semibold tracking-tight text-[#EEF1F5]">
                    My Help Request Directory
                </h2>
                <p className="mt-2 text-[12px] text-[#8792A1]">
                    View and manage requests you have submitted.
                </p>
            </div>
            <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="mb-5 flex h-10 w-full items-center justify-between border border-[#29323E] bg-[#0E1219] px-3.5 text-[12px] text-[#AEB7C3] xl:hidden"
            >
                <span className="flex items-center gap-2">
                    <SlidersHorizontal size={15} />
                    Filters
                </span>
                <span className="text-[#697586]">Refine requests</span>
            </button>
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 xl:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="absolute inset-0 bg-black/70"
                    />
                    <div className="absolute inset-y-0 right-0 w-[min(340px,90vw)] overflow-y-auto border-l border-[#29323E] bg-[#0E1219]">
                        <div className="flex items-center justify-between border-b border-[#29323E] px-4 py-3 text-[#EEF1F5]">
                            Request filters
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                aria-label="Close filters"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <HelpRequestFilters {...filters} />
                        <div className="p-4">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="h-10 w-full bg-[#263343] text-[12px] text-[#EEF1F5]"
                            >
                                Show results
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 overflow-hidden border border-[#252D38] bg-[#0E1219]">
                    <div className="flex flex-col gap-3 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#697586]"
                            />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={onSearchChange}
                                placeholder="Search by request, category or location"
                                className="h-10 w-full border border-[#35404E] bg-[#0E1219] pl-9 pr-4 text-[12px] text-[#DCE3EC] outline-none placeholder:text-[#697586] focus:border-[#64748B]"
                            />
                        </div>
                        <span className="shrink-0 text-[11px] text-[#AAB3BF]">
                            {resultCount}{' '}
                            {resultCount === 1 ? 'result' : 'results'}
                        </span>
                    </div>
                    <div className="min-w-0 overflow-x-auto">
                        <HelpRequestTable
                            rows={rows}
                            onSort={onSort}
                            getSortIcon={getSortIcon}
                            resultCount={resultCount}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                    {totalItems > 0 && (
                        <div className="border-t border-[#252D38]">
                            <HelpRequestPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </div>
                <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block">
                    <HelpRequestFilters {...filters} />
                </aside>
            </div>
        </section>
    );
}
