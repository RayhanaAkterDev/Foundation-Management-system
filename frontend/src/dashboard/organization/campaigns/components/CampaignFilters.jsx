import { useMemo } from 'react';
import {
    Check,
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Globe2,
    Layers3,
    MapPin,
    RotateCcw,
    UsersRound,
} from 'lucide-react';

import CategoryTabs from './CampaignCategoryTabs';

const STATUS_LABELS = [
    { key: 'all', label: 'All campaigns' },
    { key: 'unverified', label: 'Unverified' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'pending', label: 'Pending' },
];

const CAMPAIGN_TYPES = [
    {
        value: 'all',
        label: 'All campaign types',
        icon: Layers3,
    },
    {
        value: 'local_case',
        label: 'Local case',
        icon: MapPin,
    },
    {
        value: 'organization_proposed',
        label: 'Organization proposed',
        icon: UsersRound,
    },
    {
        value: 'global_situation',
        label: 'Global situation',
        icon: Globe2,
    },
];

function formatLabel(value) {
    return String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function FilterSection({ title, icon: Icon, children, first = false }) {
    return (
        <section
            className={`px-3 py-4 sm:px-4 ${
                first ? '' : 'border-t border-[#252D38]'
            }`}
        >
            <div className="mb-3 flex items-center gap-2 px-2">
                {Icon && (
                    <Icon
                        size={13}
                        strokeWidth={1.7}
                        className="shrink-0 text-[#697586]"
                    />
                )}

                <h4 className="m-0! font-sans! text-[10px]! font-semibold! uppercase tracking-[0.08em] text-[#8792A1]!">
                    {title}
                </h4>
            </div>

            {children}
        </section>
    );
}

function FilterOption({ label, icon: Icon, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`group relative flex min-h-10 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#64748B] ${
                active ? 'bg-[#1A222D]' : 'hover:bg-[#151B24]'
            }`}
        >
            {active && (
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-0.5 bg-[#8493A6]"
                />
            )}

            {Icon && (
                <Icon
                    size={15}
                    strokeWidth={1.7}
                    className={`shrink-0 ${
                        active
                            ? 'text-[#C2CBD6]'
                            : 'text-[#697586] group-hover:text-[#AEB7C3]'
                    }`}
                />
            )}

            <span
                className={`min-w-0 flex-1 truncate text-[12px] leading-5 ${
                    active
                        ? 'font-semibold text-[#EEF1F5]'
                        : 'font-medium text-[#8792A1] group-hover:text-[#B8C0CA]'
                }`}
            >
                {label}
            </span>

            <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    active
                        ? 'border-[#8493A6] bg-[#8493A6]'
                        : 'border-[#455160]'
                }`}
            >
                {active && (
                    <Check
                        size={10}
                        strokeWidth={2.5}
                        className="text-[#0E1219]"
                    />
                )}
            </span>
        </button>
    );
}

function DropdownFilter({ label, value, options, onChange, icon: Icon }) {
    return (
        <FilterSection title={label} icon={Icon}>
            <div className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    aria-label={label}
                    className="h-10 w-full appearance-none border border-[#343E4B] bg-[#151C25] px-3 pr-10 text-[12px] font-medium text-[#DCE3EC]! outline-none transition-colors duration-150 hover:border-[#455160] focus:border-[#64748B] focus:ring-0"
                >
                    {options.map((option) => (
                        <option
                            key={String(option.value)}
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
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#8792A1]"
                />
            </div>
        </FilterSection>
    );
}

export default function CampaignFilters({
    campaigns = [],
    statusFilter = 'all',
    setStatusFilter,
    typeFilter = 'all',
    onTypeChange,
    categoryFilter = 'all',
    onCategoryChange,
    activeFilterCount = 0,
    onClearFilters,
}) {
    const tabs = useMemo(() => {
        const counts = campaigns.reduce((result, campaign) => {
            const status = String(campaign?.status || '')
                .trim()
                .toLowerCase();

            result[status] = (result[status] || 0) + 1;

            return result;
        }, {});

        return STATUS_LABELS.filter(
            ({ key }) =>
                key === 'all' || counts[key] > 0 || key === statusFilter,
        ).map(({ key, label }) => ({
            key,
            label,
            count: key === 'all' ? campaigns.length : counts[key] || 0,
        }));
    }, [campaigns, statusFilter]);

    const categories = useMemo(() => {
        const categoryMap = new Map();

        campaigns.forEach((campaign) => {
            const category = String(campaign?.category || '').trim();

            if (!category) return;

            const normalized = category.toLowerCase();

            if (!categoryMap.has(normalized)) {
                categoryMap.set(normalized, category);
            }
        });

        return [...categoryMap.entries()]
            .map(([value, label]) => ({
                value,
                label: formatLabel(label),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [campaigns]);

    const clearFilters = () => {
        if (onClearFilters) {
            onClearFilters();
            return;
        }

        setStatusFilter?.('all');
        onTypeChange?.('all');
        onCategoryChange?.('all');
    };

    return (
        <div className="flex w-full flex-col bg-[#0E1219]">
            {/* FILTER HEADER */}

            <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-[#252D38] bg-[#1A222D] px-4 sm:px-5">
                <h3 className="m-0! font-sans! text-[15px]! font-semibold! text-[#EEF1F5]!">
                    Filter
                </h3>

                {activeFilterCount > 0 && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8792A1] transition-colors hover:text-[#EEF1F5]"
                    >
                        <RotateCcw size={12} />
                        Clear all
                    </button>
                )}
            </div>

            {/* CAMPAIGN STATUS */}

            <FilterSection title="Campaign status" icon={ClipboardList} first>
                <CategoryTabs
                    tabs={tabs}
                    activeCategory={statusFilter}
                    onChange={setStatusFilter}
                />
            </FilterSection>

            {/* CAMPAIGN TYPE */}

            <FilterSection title="Campaign type" icon={Layers3}>
                <div className="space-y-1">
                    {CAMPAIGN_TYPES.map(({ value, label, icon }) => (
                        <FilterOption
                            key={value}
                            label={label}
                            icon={icon}
                            active={typeFilter === value}
                            onClick={() => onTypeChange?.(value)}
                        />
                    ))}
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
                onChange={onCategoryChange}
            />
        </div>
    );
}
