import React from 'react';
import {
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Gauge,
    RotateCcw,
} from 'lucide-react';
import CategoryTabs from './CategoryTabs';

const DEFAULT_STATUS = [
    { value: 'all', label: 'All requests' },
    { value: 'pending', label: 'Needs response' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'active', label: 'In progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Declined' },
];
const labelOf = (value) =>
    String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (x) => x.toUpperCase());
const optionOf = (item) =>
    typeof item === 'string' ? { value: item, label: labelOf(item) } : item;

function Dropdown({ title, icon: Icon, value, options, onChange }) {
    return (
        <section className="border-t border-[#252D38] px-4 py-5">
            <label className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]">
                <Icon size={14} strokeWidth={1.7} />
                {title}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    aria-label={title}
                    className="h-10 w-full appearance-none border border-[#343E4B] bg-[#151C25] px-3 pr-9 text-[12px] text-[#DCE3EC] outline-none transition-colors hover:border-[#455160] focus:border-[#64748B]"
                >
                    {options
                        .map(optionOf)
                        .filter(
                            (item) =>
                                item?.value !== undefined &&
                                item?.value !== null,
                        )
                        .map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                                className="bg-[#151C25] text-[#DCE3EC]"
                            >
                                {item.label ?? labelOf(item.value)}
                            </option>
                        ))}
                </select>
                <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8792A1]"
                />
            </div>
        </section>
    );
}

export default function Filters({
    filters = {},
    values = {},
    counts = {},
    onChange,
    onClear,
}) {
    const statusOptions =
        Array.isArray(filters.status) && filters.status.length
            ? filters.status.map(optionOf)
            : DEFAULT_STATUS;
    const categories =
        Array.isArray(filters.category) && filters.category.length
            ? filters.category
            : [{ value: 'all', label: 'All categories' }];
    const priorities =
        Array.isArray(filters.priority) && filters.priority.length
            ? filters.priority
            : [
                  { value: 'all', label: 'All priorities' },
                  ...['critical', 'high', 'medium', 'normal'].map((value) => ({
                      value,
                      label: labelOf(value),
                  })),
              ];
    const activeCount = ['status', 'category', 'priority'].filter(
        (key) => values[key] && values[key] !== 'all',
    ).length;
    return (
        <aside className="flex h-full min-h-full w-full flex-col bg-[#0E1219]">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#252D38] bg-[#1A222D] px-5">
                <h3 className="text-[15px] font-semibold text-[#EEF1F5]!">
                    Filter
                </h3>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={() => onClear?.()}
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#8792A1] hover:text-[#EEF1F5]!"
                    >
                        <RotateCcw size={12} />
                        Clear all
                    </button>
                )}
            </div>
            <section className="px-3 py-4 sm:px-4">
                <h4 className="mb-3 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]!">
                    <ClipboardList size={14} />
                    Request status
                </h4>
                <CategoryTabs
                    tabs={statusOptions.map((option) => ({
                        key: option.value,
                        label: option.label,
                        count: counts[option.value] ?? 0,
                    }))}
                    activeCategory={values.status ?? 'all'}
                    onChange={(value) => onChange?.('status', value)}
                />
            </section>
            <Dropdown
                title="Category"
                icon={FolderOpen}
                value={values.category ?? 'all'}
                options={categories}
                onChange={(value) => onChange?.('category', value)}
            />
            <Dropdown
                title="Priority"
                icon={Gauge}
                value={values.priority ?? 'all'}
                options={priorities}
                onChange={(value) => onChange?.('priority', value)}
            />
        </aside>
    );
}
