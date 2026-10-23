import React, { useMemo } from 'react';
import {
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Gauge,
    RotateCcw,
} from 'lucide-react';

import CategoryTabs from './HelpRequestCategoryTabs';

const titleCase = (value) =>
    String(value || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

function FilterSection({ title, icon: Icon, children, first = false }) {
    return (
        <section
            className={`${first ? '' : 'border-t border-[#252D38]'} px-3 py-4 sm:px-4`}
        >
            <div className="mb-3 flex items-center gap-2 px-2">
                <Icon size={13} className="text-[#697586]" />
                <h4 className="text-[10px] font-semibold! uppercase tracking-[0.08em] !text-[#8792A1]">
                    {title}
                </h4>
            </div>
            {children}
        </section>
    );
}
function SelectFilter({ title, icon, value, onChange, options }) {
    return (
        <FilterSection title={title} icon={icon}>
            <div className="relative">
                <select
                    aria-label={title}
                    value={value}
                    onChange={onChange}
                    className="h-10 w-full appearance-none border border-[#343E4B] bg-[#151C25] px-3 pr-9 text-[12px] font-medium !text-[#DCE3EC] outline-none hover:border-[#455160] focus:border-[#64748B]"
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-[#151C25] text-[#DCE3EC]"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={15}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#8792A1]"
                />
            </div>
        </FilterSection>
    );
}
export default function Filters({
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
    onClearFilters,
}) {
    const categories = useMemo(
        () =>
            [
                ...new Set(
                    helpRequests.map((item) => item.category).filter(Boolean),
                ),
            ]
                .sort()
                .map((value) => ({ value, label: titleCase(value) })),
        [helpRequests],
    );
    const priorities = useMemo(
        () =>
            [
                ...new Set(
                    helpRequests
                        .map((item) => item.urgency || item.priority)
                        .filter(Boolean),
                ),
            ]
                .sort()
                .map((value) => ({ value, label: titleCase(value) })),
        [helpRequests],
    );
    const activeCount = [
        activeCategory,
        categoryFilter,
        priorityFilter,
        statusFilter,
    ].filter((value) => value !== 'all').length;
    return (
        <aside className="flex h-full min-h-full w-full flex-col bg-[#0E1219]">
            <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-[#252D38] bg-[#1A222D] px-4 sm:px-5">
                <h3 className="text-[15px] font-semibold! !text-[#EEF1F5]">
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
            <FilterSection title="Request status" icon={ClipboardList} first>
                <CategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={onCategoryChange}
                />
            </FilterSection>
            <SelectFilter
                title="Category"
                icon={FolderOpen}
                value={categoryFilter}
                onChange={onCategoryFilterChange}
                options={[
                    { value: 'all', label: 'All categories' },
                    ...categories,
                ]}
            />
            <SelectFilter
                title="Urgency"
                icon={Gauge}
                value={priorityFilter}
                onChange={onPriorityChange}
                options={[
                    { value: 'all', label: 'All urgency levels' },
                    ...priorities,
                ]}
            />
            <SelectFilter
                title="Status"
                icon={ClipboardList}
                value={statusFilter}
                onChange={onStatusChange}
                options={[
                    { value: 'all', label: 'All statuses' },
                    ...[
                        'pending',
                        'verified',
                        'in_progress',
                        'completed',
                        'rejected',
                    ].map((value) => ({ value, label: titleCase(value) })),
                ]}
            />
        </aside>
    );
}
