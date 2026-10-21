import React, { useMemo } from 'react';
import {
    Check,
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Gauge,
    RotateCcw,
    UsersRound,
} from 'lucide-react';

import CategoryTabs from './CategoryTabs';

const COLORS = {
    background: '#0E1219',
    header: '#1A222D',
    hover: '#151B24',
    active: '#1A222D',
    border: '#252D38',
    text: '#EEF1F5',
    muted: '#8792A1',
    subtle: '#697586',
};

const normalize = (value) =>
    String(value ?? '')
        .trim()
        .toLowerCase();

const formatLabel = (value) =>
    String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const FilterOption = ({ label, active, onClick, icon: Icon, count }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`
            group relative flex min-h-10 w-full
            items-center gap-3 px-3 py-2.5 text-left
            transition-colors duration-150
            focus-visible:outline-none
            focus-visible:ring-1
            focus-visible:ring-[#64748B]
            ${active ? 'bg-[#1A222D]' : 'hover:bg-[#151B24]'}
        `}
    >
        {active && (
            <span
                aria-hidden="true"
                className="
                    absolute inset-y-0 left-0
                    w-0.5 bg-[#8493A6]
                "
            />
        )}

        {Icon && (
            <Icon
                size={15}
                strokeWidth={1.7}
                className={
                    active
                        ? 'shrink-0 text-[#C2CBD6]'
                        : 'shrink-0 text-[#697586] group-hover:text-[#AEB7C3]'
                }
            />
        )}

        <span
            className={`
                min-w-0 flex-1 truncate
                text-[12px] leading-5
                ${
                    active
                        ? 'font-semibold text-[#EEF1F5]'
                        : 'font-medium text-[#8792A1] group-hover:text-[#B8C0CA]'
                }
            `}
        >
            {label}
        </span>

        {count !== undefined && count !== null && (
            <span
                className={`
                    shrink-0 text-[11px] tabular-nums
                    ${active ? 'text-[#C2CBD6]' : 'text-[#697586]'}
                `}
            >
                {count}
            </span>
        )}

        <span
            className={`
                flex h-4 w-4 shrink-0 items-center
                justify-center rounded-full border
                ${active ? 'border-[#8493A6] bg-[#8493A6]' : 'border-[#455160]'}
            `}
        >
            {active && (
                <Check size={10} strokeWidth={2.5} className="text-[#0E1219]" />
            )}
        </span>
    </button>
);

const FilterSection = ({ title, icon: Icon, children, className = '' }) => (
    <section
        className={`
            border-t border-[#252D38]
            px-3 py-4 sm:px-4
            ${className}
        `}
    >
        <div className="mb-3 flex items-center gap-2 px-2">
            {Icon && (
                <Icon
                    size={13}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#697586]"
                />
            )}

            <h4
                className="
                    text-[10px] font-semibold
                    uppercase tracking-[0.08em]
                    !text-[#8792A1]
                "
            >
                {title}
            </h4>
        </div>

        {children}
    </section>
);

const DropdownFilter = ({ label, value, options, onChange, icon: Icon }) => (
    <FilterSection title={label} icon={Icon}>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                aria-label={label}
                className="
                    h-10 w-full appearance-none
                    border border-[#343E4B]
                    bg-[#151C25]
                    px-3 pr-10
                    text-[12px] font-medium
                    !text-[#DCE3EC]
                    outline-none
                    transition-colors duration-150
                    hover:border-[#455160]
                    focus:border-[#64748B]
                    focus:ring-0
                "
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
                strokeWidth={1.7}
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute right-3 top-1/2
                    -translate-y-1/2 text-[#8792A1]
                "
            />
        </div>
    </FilterSection>
);

const Filters = ({
    categoryTabs = [],
    activeCategory = 'all',
    onCategoryChange,
    categoryFilter = 'all',
    priorityFilter = 'all',
    assignmentFilter = 'all',
    helpRequests = [],
    onCategoryFilterChange,
    onPriorityChange,
    onAssignmentChange,
    activeFilterCount,
    onClearFilters,
}) => {
    const categories = useMemo(() => {
        const values = [
            ...new Set(
                helpRequests
                    .map((request) => request?.category)
                    .filter(Boolean),
            ),
        ];

        return values
            .sort((a, b) => String(a).localeCompare(String(b)))
            .map((value) => ({
                value,
                label: formatLabel(value),
            }));
    }, [helpRequests]);

    const priorities = useMemo(() => {
        const values = [
            ...new Set(
                helpRequests
                    .map((request) => request?.priority || request?.urgency)
                    .filter(Boolean),
            ),
        ];

        const order = {
            low: 1,
            normal: 2,
            high: 3,
            urgent: 4,
            critical: 5,
        };

        return values
            .sort(
                (a, b) =>
                    (order[normalize(a)] ?? 99) - (order[normalize(b)] ?? 99),
            )
            .map((value) => ({
                value,
                label: formatLabel(value),
            }));
    }, [helpRequests]);

    const activeCount =
        activeFilterCount ??
        [
            activeCategory,
            categoryFilter,
            priorityFilter,
            assignmentFilter,
        ].filter((value) => value && value !== 'all').length;

    const emitChange = (handler, value) => {
        handler?.({ target: { value } });
    };

    const handleClear = () => {
        if (onClearFilters) {
            onClearFilters();
            return;
        }

        onCategoryChange?.('all');
        emitChange(onCategoryFilterChange, 'all');
        emitChange(onPriorityChange, 'all');
        emitChange(onAssignmentChange, 'all');
    };

    return (
        <aside
            className="
                flex h-full min-h-full w-full
                flex-col overflow-hidden
                bg-[#0E1219]
            "
        >
            {/* FILTER HEADER */}
            <div
                className="
                    flex min-h-14 shrink-0
                    items-center justify-between gap-3
                    border-b border-[#252D38]
                    bg-[#1A222D]
                    px-4 sm:px-5
                "
            >
                <h3 className="text-[15px] font-semibold !text-[#EEF1F5]">
                    Filter
                </h3>

                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="
                            inline-flex items-center gap-1.5
                            text-[11px] font-medium
                            text-[#8792A1]
                            transition-colors
                            hover:text-[#EEF1F5]
                        "
                    >
                        <RotateCcw size={12} />
                        Clear all
                    </button>
                )}
            </div>

            {/* FILTER BODY */}
            <div className="min-h-0 flex-1">
                {/* REQUEST STATUS */}
                <FilterSection
                    title="Request status"
                    icon={ClipboardList}
                    className="border-t-0"
                >
                    <CategoryTabs
                        tabs={categoryTabs}
                        activeCategory={activeCategory}
                        onChange={onCategoryChange}
                    />
                </FilterSection>

                {/* ASSIGNMENT */}
                <FilterSection title="Assignment" icon={UsersRound}>
                    <div className="space-y-1">
                        <FilterOption
                            label="All assignments"
                            active={assignmentFilter === 'all'}
                            onClick={() =>
                                emitChange(onAssignmentChange, 'all')
                            }
                        />

                        <FilterOption
                            label="Assigned"
                            active={assignmentFilter === 'assigned'}
                            onClick={() =>
                                emitChange(onAssignmentChange, 'assigned')
                            }
                        />

                        <FilterOption
                            label="Not assigned"
                            active={assignmentFilter === 'unassigned'}
                            onClick={() =>
                                emitChange(onAssignmentChange, 'unassigned')
                            }
                        />
                    </div>
                </FilterSection>

                {/* CATEGORY */}
                <DropdownFilter
                    label="Category"
                    icon={FolderOpen}
                    value={categoryFilter}
                    options={[
                        {
                            value: 'all',
                            label: 'All categories',
                        },
                        ...categories,
                    ]}
                    onChange={(event) => onCategoryFilterChange?.(event)}
                />

                {/* URGENCY */}
                <DropdownFilter
                    label="Urgency"
                    icon={Gauge}
                    value={priorityFilter}
                    options={[
                        {
                            value: 'all',
                            label: 'All urgency levels',
                        },
                        ...priorities,
                    ]}
                    onChange={(event) => onPriorityChange?.(event)}
                />
            </div>
        </aside>
    );
};

export default Filters;
