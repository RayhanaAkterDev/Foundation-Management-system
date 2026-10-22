import React, { useMemo } from 'react';
import {
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Gauge,
    RotateCcw,
    ListFilter,
} from 'lucide-react';
import HelpRequestCategoryTabs from './HelpRequestCategoryTabs';

const format = (value) =>
    String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
function FilterSelect({ label, icon: Icon, value, onChange, options }) {
    return (
        <section className="border-t border-[#252D38] px-4 py-4">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#8792A1]">
                <Icon size={14} />
                {label}
            </div>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="h-10 w-full appearance-none border border-[#343E4B] bg-[#151C25] px-3 pr-9 text-[12px] text-[#DCE3EC] outline-none hover:border-[#455160] focus:border-[#64748B]"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-3 text-[#8792A1]"
                />
            </div>
        </section>
    );
}
export default function HelpRequestFilters({
    categoryTabs = [],
    activeCategory,
    onCategoryChange,
    categoryFilter,
    priorityFilter,
    statusFilter,
    helpRequests = [],
    onCategoryFilterChange,
    onPriorityChange,
    onStatusChange,
    onClearFilters,
}) {
    const categories = useMemo(
        () =>
            [...new Set(helpRequests.map((r) => r?.category).filter(Boolean))]
                .sort()
                .map((value) => ({ value, label: format(value) })),
        [helpRequests],
    );
    const priorities = [
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
    ];
    const activeCount = [
        activeCategory,
        categoryFilter,
        priorityFilter,
        statusFilter,
    ].filter((v) => v && v !== 'all').length;
    return (
        <div className="h-full min-h-full bg-[#0E1219]">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#252D38] bg-[#1A222D] px-4">
                <h3 className="text-[15px] font-semibold text-[#EEF1F5]">
                    Filter
                </h3>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#8792A1] hover:text-[#EEF1F5]"
                    >
                        <RotateCcw size={12} />
                        Clear all
                    </button>
                )}
            </div>
            <section className="px-3 py-4">
                <div className="mb-3 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#8792A1]">
                    <ClipboardList size={14} />
                    Request status
                </div>
                <HelpRequestCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={onCategoryChange}
                />
            </section>
            <FilterSelect
                label="Category"
                icon={FolderOpen}
                value={categoryFilter}
                onChange={onCategoryFilterChange}
                options={[
                    { value: 'all', label: 'All categories' },
                    ...categories,
                ]}
            />
            <FilterSelect
                label="Urgency"
                icon={Gauge}
                value={priorityFilter}
                onChange={onPriorityChange}
                options={[
                    { value: 'all', label: 'All urgency levels' },
                    ...priorities,
                ]}
            />
            <FilterSelect
                label="Status"
                icon={ListFilter}
                value={statusFilter}
                onChange={onStatusChange}
                options={[
                    { value: 'all', label: 'All statuses' },
                    ...['pending', 'verified', 'completed', 'rejected'].map(
                        (value) => ({ value, label: format(value) }),
                    ),
                ]}
            />
        </div>
    );
}
