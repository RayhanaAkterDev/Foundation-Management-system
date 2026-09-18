import React, { useMemo } from 'react';

import { ChevronDown } from 'lucide-react';

const Filters = ({
    typeFilter,
    categoryFilter,
    organizationFilter,
    campaigns,
    onTypeChange,
    onCategoryChange,
    onOrganizationChange,
}) => {
    // --------------------------------
    // Categories
    // --------------------------------

    const categories = useMemo(() => {
        return [
            ...new Set(
                campaigns.map((campaign) => campaign.category).filter(Boolean),
            ),
        ];
    }, [campaigns]);

    // --------------------------------
    // Organizations
    // --------------------------------

    const organizations = useMemo(() => {
        const organizationMap = new Map();

        campaigns.forEach((campaign) => {
            const organization = campaign.organization;

            if (organization?.id && organization?.name) {
                organizationMap.set(organization.id, organization.name);
            }
        });

        return Array.from(organizationMap.entries()).map(([id, name]) => ({
            id,
            name,
        }));
    }, [campaigns]);

    // --------------------------------
    // Shared select styles
    // --------------------------------

    const selectClassName = `
        h-10 w-full appearance-none
        border border-white/10
        bg-white
        px-3.5 pr-9
        text-[12px] font-medium text-slate-800
        outline-none transition-colors
        hover:border-white/20
        focus:border-white/30
        focus:bg-white
    `;

    const optionClassName = 'bg-white text-slate-800';

    return (
        <div className="space-y-6">
            {/* ================================================
                CAMPAIGN TYPE
            ================================================= */}

            <div>
                <div className="mb-2.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                        Campaign type
                    </p>
                </div>

                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={onTypeChange}
                        className={selectClassName}
                    >
                        <option value="all" className={optionClassName}>
                            All campaign types
                        </option>

                        <option value="local_case" className={optionClassName}>
                            Local Case
                        </option>

                        <option
                            value="organization_proposed"
                            className={optionClassName}
                        >
                            Organization Proposed
                        </option>

                        <option
                            value="global_situation"
                            className={optionClassName}
                        >
                            Global Situation
                        </option>
                    </select>

                    <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className="
                            pointer-events-none absolute right-3
                            top-1/2 -translate-y-1/2
                            text-slate-500
                        "
                    />
                </div>
            </div>

            {/* ================================================
                CATEGORY
            ================================================= */}

            <div>
                <div className="mb-2.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                        Category
                    </p>
                </div>

                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={onCategoryChange}
                        className={selectClassName}
                    >
                        <option value="all" className={optionClassName}>
                            All categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                                className={optionClassName}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className="
                            pointer-events-none absolute right-3
                            top-1/2 -translate-y-1/2
                            text-slate-500
                        "
                    />
                </div>
            </div>

            {/* ================================================
                ORGANIZATION
            ================================================= */}

            <div>
                <div className="mb-2.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                        Organization
                    </p>
                </div>

                <div className="relative">
                    <select
                        value={organizationFilter}
                        onChange={onOrganizationChange}
                        className={selectClassName}
                    >
                        <option value="all" className={optionClassName}>
                            All organizations
                        </option>

                        {organizations.map((organization) => (
                            <option
                                key={organization.id}
                                value={organization.id}
                                className={optionClassName}
                            >
                                {organization.name}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className="
                            pointer-events-none absolute right-3
                            top-1/2 -translate-y-1/2
                            text-slate-500
                        "
                    />
                </div>
            </div>
        </div>
    );
};

export default Filters;
