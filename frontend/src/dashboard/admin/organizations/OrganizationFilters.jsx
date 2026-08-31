import React from 'react';

import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

import { ORGANIZATION_TYPES } from './organizationTypes';

const OrganizationFilters = ({
    searchTerm,
    typeFilter,
    statusFilter,
    onSearchChange,
    onTypeChange,
    onStatusChange,
}) => {
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
                    placeholder="Search organizations by name, email or registration number..."
                    className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-border
                        bg-white
                        pl-10
                        pr-4
                        text-sm
                        text-text-primary
                        outline-none
                        transition-colors
                        placeholder:text-text-secondary/65
                        focus:border-primary/40
                        focus:ring-4
                        focus:ring-primary/8
                    "
                />
            </div>

            <div className="hidden h-6 w-px bg-border lg:block" />

            {/* Filter label */}
            <div className="hidden items-center gap-2 px-1 text-text-secondary sm:flex">
                <SlidersHorizontal size={15} />

                <span className="text-xs font-semibold">Filters</span>
            </div>

            {/* Organization Type */}
            <div className="relative">
                <select
                    value={typeFilter}
                    onChange={onTypeChange}
                    className="
                        h-10
                        w-full
                        min-w-36
                        appearance-none
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-3.5
                        pr-9
                        text-sm
                        font-medium
                        text-text-primary
                        outline-none
                        transition-colors
                        hover:border-primary/30
                        focus:border-primary
                        focus:ring-4
                        focus:ring-primary/8
                        sm:w-auto
                    "
                >
                    <option value="all">All types</option>

                    {ORGANIZATION_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={14}
                    className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-text-secondary
                    "
                />
            </div>

            {/* Verification Status */}
            <div className="relative">
                <select
                    value={statusFilter}
                    onChange={onStatusChange}
                    className="
                        h-10
                        w-full
                        min-w-36
                        appearance-none
                        rounded-lg
                        border
                        border-border
                        bg-white
                        px-3.5
                        pr-9
                        text-sm
                        font-medium
                        text-text-primary
                        outline-none
                        transition-colors
                        hover:border-primary/30
                        focus:border-primary
                        focus:ring-4
                        focus:ring-primary/8
                        sm:w-auto
                    "
                >
                    <option value="all">All status</option>

                    <option value="verified">Verified</option>

                    <option value="pending">Pending</option>

                    <option value="rejected">Rejected</option>
                </select>

                <ChevronDown
                    size={14}
                    className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-text-secondary
                    "
                />
            </div>
        </div>
    );
};

export default OrganizationFilters;
