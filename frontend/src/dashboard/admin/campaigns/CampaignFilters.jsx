import React, { useMemo } from 'react';

import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const CampaignFilters = ({
    searchTerm,
    typeFilter,
    categoryFilter,
    organizationFilter,
    statusFilter,
    campaigns,
    onSearchChange,
    onTypeChange,
    onCategoryChange,
    onOrganizationChange,
    onStatusChange,
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

    return (
        <div className="flex flex-col gap-3 border-b border-border pb-5 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
                <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search campaigns by title or organization..."
                    className="h-10 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/65 focus:border-primary/40 focus:ring-4 focus:ring-primary/8"
                />
            </div>

            <div className="hidden h-6 w-px bg-border lg:block" />

            {/* Filter label */}
            <div className="hidden items-center gap-2 px-1 text-text-secondary sm:flex">
                <SlidersHorizontal size={15} />

                <span className="text-xs font-semibold">Filters</span>
            </div>

            {/* Campaign Type */}
            <div className="relative">
                <select
                    value={typeFilter}
                    onChange={onTypeChange}
                    className="h-10 w-full min-w-40 appearance-none rounded-lg border border-border bg-white px-3.5 pr-9 text-sm font-medium text-text-primary outline-none transition-colors hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/8 sm:w-auto"
                >
                    <option value="all">All types</option>

                    <option value="local_case">Local Case</option>

                    <option value="organization_proposed">
                        Organization Proposed
                    </option>

                    <option value="global_situation">Global Situation</option>
                </select>

                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
            </div>

            {/* Category */}
            <div className="relative">
                <select
                    value={categoryFilter}
                    onChange={onCategoryChange}
                    className="h-10 w-full min-w-36 appearance-none rounded-lg border border-border bg-white px-3.5 pr-9 text-sm font-medium text-text-primary outline-none transition-colors hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/8 sm:w-auto"
                >
                    <option value="all">All categories</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
            </div>

            {/* Organization */}
            <div className="relative">
                <select
                    value={organizationFilter}
                    onChange={onOrganizationChange}
                    className="h-10 w-full min-w-40 appearance-none rounded-lg border border-border bg-white px-3.5 pr-9 text-sm font-medium text-text-primary outline-none transition-colors hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/8 sm:w-auto"
                >
                    <option value="all">All organizations</option>

                    {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                            {organization.name}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
            </div>

            {/* Status */}
            <div className="relative">
                <select
                    value={statusFilter}
                    onChange={onStatusChange}
                    className="h-10 w-full min-w-36 appearance-none rounded-lg border border-border bg-white px-3.5 pr-9 text-sm font-medium text-text-primary outline-none transition-colors hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/8 sm:w-auto"
                >
                    <option value="all">All status</option>

                    <option value="unverified">Unverified</option>

                    <option value="active">Active</option>

                    <option value="completed">Completed</option>

                    <option value="rejected">Rejected</option>

                    <option value="cancelled">Cancelled</option>
                </select>

                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
            </div>
        </div>
    );
};

export default CampaignFilters;
