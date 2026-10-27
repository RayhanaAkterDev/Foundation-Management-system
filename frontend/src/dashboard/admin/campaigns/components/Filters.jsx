import React, { useMemo } from 'react';
import {
    Check,
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Globe2,
    Layers3,
    MapPin,
    RotateCcw,
    Star,
    UsersRound,
    CalendarDays,
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

const CLASSIFICATION_OPTIONS = [
    { value: 'all', label: 'All classifications' },
    { value: 'featured', label: 'Featured campaigns' },
    { value: 'urgent', label: 'Urgent campaigns' },
    {
        value: 'unclassified',
        label: 'Neither featured nor urgent',
    },
];

const DEADLINE_OPTIONS = [
    { value: 'all', label: 'All deadlines' },
    { value: 'fixed', label: 'Fixed deadline' },
    { value: 'open', label: 'Open-ended' },
];

/*
 * Known Bangla-to-English category equivalents.
 *
 * These mappings are used only for category normalization.
 * The dropdown always displays English names.
 */
const CATEGORY_TRANSLATIONS = {
    শিক্ষা: 'Education',
    শিক্ষার: 'Education',
    স্বাস্থ্য: 'Health',
    চিকিৎসা: 'Healthcare',
    স্বাস্থ্যসেবা: 'Healthcare',
    খাদ্য: 'Food',
    খাদ্যসহায়তা: 'Food Support',
    'খাদ্য সহায়তা': 'Food Support',
    আশ্রয়: 'Shelter',
    বাসস্থান: 'Housing',
    দুর্যোগ: 'Disaster Relief',
    'দুর্যোগ সহায়তা': 'Disaster Relief',
    'দুর্যোগ ত্রাণ': 'Disaster Relief',
    জরুরি: 'Emergency',
    'জরুরি সহায়তা': 'Emergency Relief',
    পানি: 'Water',
    'বিশুদ্ধ পানি': 'Clean Water',
    স্যানিটেশন: 'Sanitation',
    পরিবেশ: 'Environment',
    জীবিকা: 'Livelihood',
    কর্মসংস্থান: 'Employment',
    দারিদ্র্য: 'Poverty',
    'দারিদ্র্য বিমোচন': 'Poverty Alleviation',
    শিশু: 'Children',
    'শিশু সহায়তা': 'Child Support',
    নারী: 'Women',
    'নারী ক্ষমতায়ন': 'Women Empowerment',
    প্রবীণ: 'Elderly',
    প্রতিবন্ধী: 'Disability Support',
    'প্রতিবন্ধী সহায়তা': 'Disability Support',
    মানবিক: 'Humanitarian',
    'মানবিক সহায়তা': 'Humanitarian Aid',
    সমাজকল্যাণ: 'Social Welfare',
    অন্যান্য: 'Other',
    সাধারণ: 'General',
};

const CATEGORY_ALIASES = {
    education: 'Education',
    educational: 'Education',

    health: 'Health',

    healthcare: 'Healthcare',
    'health care': 'Healthcare',
    medical: 'Healthcare',
    'medical support': 'Healthcare',
    'medical assistance': 'Healthcare',

    food: 'Food',
    'food support': 'Food Support',
    'food assistance': 'Food Support',

    shelter: 'Shelter',
    housing: 'Housing',

    disaster: 'Disaster Relief',
    'disaster relief': 'Disaster Relief',
    'disaster support': 'Disaster Relief',

    emergency: 'Emergency',
    'emergency relief': 'Emergency Relief',
    'emergency support': 'Emergency Relief',

    water: 'Water',
    'clean water': 'Clean Water',

    sanitation: 'Sanitation',
    environment: 'Environment',
    livelihood: 'Livelihood',
    employment: 'Employment',
    poverty: 'Poverty',
    'poverty alleviation': 'Poverty Alleviation',

    children: 'Children',
    'child support': 'Child Support',

    women: 'Women',
    'women empowerment': 'Women Empowerment',

    elderly: 'Elderly',

    disability: 'Disability Support',
    'disability support': 'Disability Support',

    humanitarian: 'Humanitarian',
    'humanitarian aid': 'Humanitarian Aid',

    'social welfare': 'Social Welfare',
    other: 'Other',
    others: 'Other',
    general: 'General',
};

const containsBangla = (value) => /[\u0980-\u09FF]/.test(value);

const formatEnglishLabel = (value) =>
    String(value ?? '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

const normalizeCategory = (value) => {
    if (value === null || value === undefined) {
        return '';
    }

    const raw = String(value).trim().replace(/\s+/g, ' ');

    if (!raw) return '';

    const normalizedKey = raw
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (CATEGORY_TRANSLATIONS[raw]) {
        return CATEGORY_TRANSLATIONS[raw];
    }

    if (CATEGORY_ALIASES[normalizedKey]) {
        return CATEGORY_ALIASES[normalizedKey];
    }

    if (containsBangla(raw)) {
        return '';
    }

    return formatEnglishLabel(raw);
};

const buildCategoryOptions = (campaigns) => {
    const categoryMap = new Map();

    (Array.isArray(campaigns) ? campaigns : []).forEach((campaign) => {
        const rawCategory = campaign?.category;

        if (!rawCategory) return;

        const englishLabel = normalizeCategory(rawCategory);

        if (!englishLabel) return;

        const key = englishLabel.toLowerCase();
        const existing = categoryMap.get(key);
        const rawValue = String(rawCategory).trim();

        /*
         * Prefer an English API value when both English and
         * Bangla values represent the same category.
         */
        if (!existing) {
            categoryMap.set(key, {
                value: rawValue,
                label: englishLabel,
                isEnglish: !containsBangla(rawValue),
            });

            return;
        }

        if (!existing.isEnglish && !containsBangla(rawValue)) {
            categoryMap.set(key, {
                value: rawValue,
                label: englishLabel,
                isEnglish: true,
            });
        }
    });

    return [...categoryMap.values()]
        .sort((a, b) => a.label.localeCompare(b.label, 'en'))
        .map(({ value, label }) => ({
            value,
            label,
        }));
};

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
    classificationFilter = 'all',
    deadlineFilter = 'all',
    campaigns = [],
    onTypeChange,
    onCategoryChange,
    onOrganizationChange,
    onClassificationChange,
    onDeadlineChange,
    activeFilterCount,
    onClearFilters,
}) => {
    const categories = useMemo(
        () => buildCategoryOptions(campaigns),
        [campaigns],
    );

    /*
     * Resolve a previously selected Bangla value to its
     * English equivalent when possible.
     */
    const resolvedCategoryFilter = useMemo(() => {
        if (!categoryFilter || categoryFilter === 'all') {
            return 'all';
        }

        const selectedLabel = normalizeCategory(categoryFilter);

        if (!selectedLabel) {
            return categoryFilter;
        }

        const match = categories.find(
            (category) =>
                category.label.toLowerCase() === selectedLabel.toLowerCase(),
        );

        return match?.value ?? categoryFilter;
    }, [categoryFilter, categories]);

    const activeCount =
        activeFilterCount ??
        [
            activeCategory,
            typeFilter,
            categoryFilter,
            organizationFilter,
            classificationFilter,
            deadlineFilter,
        ].filter((value) => value && value !== 'all').length;

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
        emitChange(onClassificationChange, 'all');
        emitChange(onDeadlineChange, 'all');
    };

    return (
        <aside className="flex h-full min-h-full w-full flex-col overflow-hidden bg-[#0E1219]">
            <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-[#252D38] bg-[#1A222D] px-4 sm:px-5">
                <h3 className="text-[15px] font-semibold !text-[#EEF1F5]">
                    Filters
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

            <div className="min-h-0 flex-1 overflow-y-auto">
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

                <DropdownFilter
                    label="Campaign type"
                    icon={Layers3}
                    value={typeFilter}
                    options={CAMPAIGN_TYPES}
                    onChange={onTypeChange}
                />

                <DropdownFilter
                    label="Category"
                    icon={FolderOpen}
                    value={resolvedCategoryFilter}
                    options={[
                        { value: 'all', label: 'All categories' },
                        ...categories,
                    ]}
                    onChange={onCategoryChange}
                />

                <DropdownFilter
                    label="Classification"
                    icon={Star}
                    value={classificationFilter}
                    options={CLASSIFICATION_OPTIONS}
                    onChange={onClassificationChange}
                />

                <DropdownFilter
                    label="Deadline"
                    icon={CalendarDays}
                    value={deadlineFilter}
                    options={DEADLINE_OPTIONS}
                    onChange={onDeadlineChange}
                />
            </div>
        </aside>
    );
};

export default Filters;
