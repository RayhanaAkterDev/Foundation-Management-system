import React, { useMemo } from 'react';
import {
    Building2,
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

import CategoryTabs from './CategoryTabs';

const CAMPAIGN_TYPES = [
    { value: 'all', label: 'All campaign types', icon: Layers3 },
    { value: 'local_case', label: 'Local case', icon: MapPin },
    {
        value: 'organization_proposed',
        label: 'Organization proposed',
        icon: UsersRound,
    },
    { value: 'global_situation', label: 'Global situation', icon: Globe2 },
];

const formatLabel = (value) =>
    String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const FilterOption = ({ label, active, onClick, icon: Icon }) => (
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
                active ? 'border-[#8493A6] bg-[#8493A6]' : 'border-[#455160]'
            }`}
        >
            {active && (
                <Check size={10} strokeWidth={2.5} className="text-[#0E1219]" />
            )}
        </span>
    </button>
);

const FilterSection = ({ title, icon: Icon, children, className = '' }) => (
    <section
        className={`border-t border-[#252D38] px-3 py-4 sm:px-4 ${className}`}
    >
        <div className="mb-3 flex items-center gap-2 px-2">
            {Icon && (
                <Icon
                    size={13}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#697586]"
                />
            )}
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] !text-[#8792A1]">
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
                className="h-10 w-full appearance-none border border-[#343E4B] bg-[#151C25] px-3 pr-10 text-[12px] font-medium !text-[#DCE3EC] outline-none transition-colors duration-150 hover:border-[#455160] focus:border-[#64748B] focus:ring-0"
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
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8792A1]"
            />
        </div>
    </FilterSection>
);

const Filters = ({
    categoryTabs = [],
    activeCategory = 'all',
    onStatusCategoryChange,
    typeFilter = 'all',
    categoryFilter = 'all',
    organizationFilter = 'all',
    campaigns = [],
    onTypeChange,
    onCategoryChange,
    onOrganizationChange,
    activeFilterCount,
    onClearFilters,
}) => {
    const categories = useMemo(
        () =>
            [
                ...new Set(
                    campaigns
                        .map((campaign) => campaign?.category)
                        .filter(Boolean),
                ),
            ]
                .sort((a, b) => String(a).localeCompare(String(b)))
                .map((value) => ({ value, label: formatLabel(value) })),
        [campaigns],
    );

    const organizations = useMemo(() => {
        const map = new Map();
        campaigns.forEach((campaign) => {
            const organization =
                campaign?.organization || campaign?.assigned_organization;
            if (organization?.id != null && organization?.name) {
                map.set(String(organization.id), organization.name);
            }
        });
        return [...map.entries()]
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => String(a.label).localeCompare(String(b.label)));
    }, [campaigns]);

    const activeCount =
        activeFilterCount ??
        [activeCategory, typeFilter, categoryFilter, organizationFilter].filter(
            (value) => value && value !== 'all',
        ).length;

    const emitChange = (handler, value) => handler?.({ target: { value } });

    const handleClear = () => {
        if (onClearFilters) {
            onClearFilters();
            return;
        }
        onStatusCategoryChange?.('all');
        emitChange(onTypeChange, 'all');
        emitChange(onCategoryChange, 'all');
        emitChange(onOrganizationChange, 'all');
    };

    return (
        <aside className="flex h-full min-h-full w-full flex-col overflow-hidden bg-[#0E1219]">
            <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-[#252D38] bg-[#1A222D] px-4 sm:px-5">
                <h3 className="text-[15px] font-semibold !text-[#EEF1F5]">
                    Filter
                </h3>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8792A1] transition-colors hover:text-[#EEF1F5]"
                    >
                        <RotateCcw size={12} />
                        Clear all
                    </button>
                )}
            </div>

            <div className="min-h-0 flex-1">
                <FilterSection
                    title="Campaign status"
                    icon={ClipboardList}
                    className="border-t-0"
                >
                    <CategoryTabs
                        tabs={categoryTabs}
                        activeCategory={activeCategory}
                        onChange={onStatusCategoryChange}
                    />
                </FilterSection>

                <FilterSection title="Campaign type" icon={Layers3}>
                    <div className="space-y-1">
                        {CAMPAIGN_TYPES.map(({ value, label, icon }) => (
                            <FilterOption
                                key={value}
                                label={label}
                                icon={icon}
                                active={typeFilter === value}
                                onClick={() => emitChange(onTypeChange, value)}
                            />
                        ))}
                    </div>
                </FilterSection>

                <DropdownFilter
                    label="Category"
                    icon={FolderOpen}
                    value={categoryFilter}
                    options={[
                        { value: 'all', label: 'All categories' },
                        ...categories,
                    ]}
                    onChange={onCategoryChange}
                />

                <DropdownFilter
                    label="Organization"
                    icon={Building2}
                    value={organizationFilter}
                    options={[
                        { value: 'all', label: 'All organizations' },
                        ...organizations,
                    ]}
                    onChange={onOrganizationChange}
                />
            </div>
        </aside>
    );
};

export default Filters;
