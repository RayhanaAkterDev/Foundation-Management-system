import React, { useMemo } from 'react';
import {
    ChevronDown,
    FolderOpen,
    Building2,
    Layers3,
    RotateCcw,
} from 'lucide-react';

const label = (value) =>
    String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (x) => x.toUpperCase());

function FilterSelect({ title, icon: Icon, value, onChange, options }) {
    return (
        <section className="border-t border-[#252D38] px-4 py-4">
            <div className="mb-3 flex items-center gap-2 px-1">
                <Icon size={14} strokeWidth={1.7} className="text-[#697586]" />
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#8792A1]">
                    {title}
                </h4>
            </div>
            <div className="relative">
                <select
                    value={value ?? 'all'}
                    onChange={onChange}
                    aria-label={title}
                    className="h-10 w-full appearance-none border border-[#343E4B] bg-[#151C25] px-3 pr-9 text-[12px] font-medium text-[#DCE3EC] outline-none transition-colors hover:border-[#455160] focus:border-[#64748B]"
                >
                    {options.map((item) => (
                        <option
                            key={String(item.value)}
                            value={item.value}
                            className="bg-[#151C25] text-[#DCE3EC]"
                        >
                            {item.label}
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
    typeFilter = 'all',
    categoryFilter = 'all',
    organizationFilter = 'all',
    campaigns = [],
    onTypeChange,
    onCategoryChange,
    onOrganizationChange,
}) {
    const categories = useMemo(
        () =>
            [
                ...new Set(campaigns.map((c) => c.category).filter(Boolean)),
            ].sort(),
        [campaigns],
    );
    const organizations = useMemo(() => {
        const map = new Map();
        campaigns.forEach((c) => {
            const org = c.organization || c.assigned_organization;
            if (org?.id != null && org?.name) map.set(String(org.id), org.name);
        });
        return [...map].map(([value, name]) => ({ value, label: name }));
    }, [campaigns]);
    return (
        <div className="min-w-0">
            <FilterSelect
                title="Campaign type"
                icon={Layers3}
                value={typeFilter}
                onChange={onTypeChange}
                options={[
                    { value: 'all', label: 'All campaign types' },
                    { value: 'local_case', label: 'Local Case' },
                    {
                        value: 'organization_proposed',
                        label: 'Organization Proposed',
                    },
                    { value: 'global_situation', label: 'Global Situation' },
                ]}
            />
            <FilterSelect
                title="Category"
                icon={FolderOpen}
                value={categoryFilter}
                onChange={onCategoryChange}
                options={[
                    { value: 'all', label: 'All categories' },
                    ...categories.map((value) => ({
                        value,
                        label: label(value),
                    })),
                ]}
            />
            <FilterSelect
                title="Organization"
                icon={Building2}
                value={organizationFilter}
                onChange={onOrganizationChange}
                options={[
                    { value: 'all', label: 'All organizations' },
                    ...organizations,
                ]}
            />
        </div>
    );
}
