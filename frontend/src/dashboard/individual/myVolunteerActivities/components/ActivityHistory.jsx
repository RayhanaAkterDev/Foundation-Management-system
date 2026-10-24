import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, SlidersHorizontal, X } from 'lucide-react';
import ActivityHistoryTable from './ActivityHistoryTable';
import ActivityHistoryFilters from './ActivityHistoryFilters';
import ActivityHistoryPagination from './ActivityHistoryPagination';

const PER_PAGE = 25;

export default function ActivityHistory({ rows = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'assigned_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const counts = useMemo(() => {
        const result = { all: rows.length };
        rows.forEach((row) => { result[row.status] = (result[row.status] ?? 0) + 1; });
        return result;
    }, [rows]);

    const filteredRows = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const result = rows.filter((row) =>
            (statusFilter === 'all' || row.status === statusFilter) &&
            (!query || [row.campaign_title, row.location, row.status, row.rejection_reason].some((value) => String(value ?? '').toLowerCase().includes(query)))
        );
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                const left = a[sortConfig.key] ?? '';
                const right = b[sortConfig.key] ?? '';
                const comparison = String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }
        return result;
    }, [rows, searchTerm, statusFilter, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const visibleRows = filteredRows.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    const handleSort = (key) => {
        setSortConfig((previous) => previous.key !== key
            ? { key, direction: 'asc' }
            : previous.direction === 'asc'
              ? { key, direction: 'desc' }
              : { key: null, direction: null });
        setCurrentPage(1);
    };
    const getSortIcon = (key) => sortConfig.key !== key || !sortConfig.direction
        ? <ChevronsUpDown size={14} strokeWidth={1.8} />
        : sortConfig.direction === 'asc'
          ? <ArrowUp size={14} strokeWidth={1.8} />
          : <ArrowDown size={14} strokeWidth={1.8} />;

    const changeFilter = (value) => { setStatusFilter(value); setCurrentPage(1); };
    const filters = <ActivityHistoryFilters value={statusFilter} onChange={changeFilter} counts={counts} />;

    return (
        <section className="min-w-0 pt-2 lg:pt-3">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
                <div className="min-w-0">
                    <h2 className="font-sans! text-[20px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">Activity history</h2>
                    <p className="mt-2 text-[12px] leading-5 text-[#8792A1]">All campaign assignments and their current status.</p>
                </div>
                <span className="text-[11px] text-[#AAB3BF]">{rows.length} {rows.length === 1 ? 'assignment' : 'assignments'}</span>
            </div>

            <div className="mb-4 xl:hidden">
                <button type="button" onClick={() => setMobileFiltersOpen(true)} className="flex h-10 w-full items-center justify-between border border-[#252D38] bg-[#0E1219] px-3.5 text-[11px] font-medium! text-[#AEB7C3]!">
                    <span className="flex items-center gap-2"><SlidersHorizontal size={14} /> Filters</span>
                    {statusFilter !== 'all' && <span className="bg-[#1D2632] px-2 py-1 text-[10px] text-[#EEF1F5]">1 active</span>}
                </button>
            </div>

            <div className="grid min-w-0 gap-6 xl:min-h-[610px] xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="relative min-h-0 min-w-0 xl:h-full xl:min-h-[610px]">
                    <div className="flex min-h-0 min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                        <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div className="relative min-w-0 flex-1">
                                    <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#697586]" />
                                    <input type="text" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} placeholder="Search campaigns, locations or status"
                                        className="h-10 w-full border border-[#29323E] bg-[#0A0E14] pr-16 pl-9 font-sans! text-[12px] font-medium! text-[#EEF1F5]! outline-none placeholder:text-[#5E6978] hover:border-[#394553] focus:border-[#4B5869] focus:ring-0" />
                                    {searchTerm && <button type="button" onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-semibold! text-[#8792A1] hover:text-[#EEF1F5]">Clear</button>}
                                </div>
                                <span className="shrink-0 text-[11px] text-[#AAB3BF]">{filteredRows.length} {filteredRows.length === 1 ? 'result' : 'results'}</span>
                            </div>
                        </div>
                        <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0A0E14] [&::-webkit-scrollbar-thumb]:bg-[#303A47]">
                            <ActivityHistoryTable rows={visibleRows} resultCount={filteredRows.length} onSort={handleSort} getSortIcon={getSortIcon} />
                        </div>
                        {filteredRows.length > 0 && <div className="shrink-0 border-t border-[#252D38] bg-[#1A222D]"><ActivityHistoryPagination currentPage={safePage} totalPages={totalPages} totalItems={filteredRows.length} perPage={PER_PAGE} onPageChange={setCurrentPage} /></div>}
                    </div>
                </div>
                <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block xl:min-h-[610px]">{filters}</aside>
            </div>
            {mobileFiltersOpen && <div className="fixed inset-0 z-100 xl:hidden">
                <button type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-[#05070A]/75" />
                <div className="absolute right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto border-t border-[#252D38] bg-[#0E1219] sm:top-0 sm:left-auto sm:h-full sm:max-h-none sm:w-[340px] sm:border-l sm:border-t-0">
                    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#252D38] bg-[#0E1219] px-4 py-3.5"><h3 className="text-[14px] font-semibold! text-[#EEF1F5]!">Filters</h3><button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center border border-[#29323E] bg-[#151B24] text-[#8792A1]"><X size={16} /></button></div>
                    {filters}
                    <div className="sticky bottom-0 border-t border-[#252D38] bg-[#0E1219] p-4"><button type="button" onClick={() => setMobileFiltersOpen(false)} className="h-10 w-full border border-[#394555] bg-[#171E28] text-[12px] font-semibold! text-[#EEF1F5]!">Show {filteredRows.length} {filteredRows.length === 1 ? 'assignment' : 'assignments'}</button></div>
                </div>
            </div>}
        </section>
    );
}
