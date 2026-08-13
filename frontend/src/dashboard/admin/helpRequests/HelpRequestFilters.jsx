import React, { useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const HelpRequestFilters = ({
    searchTerm,
    categoryFilter,
    priorityFilter,
    statusFilter,
    helpRequests,
    onSearchChange,
    onCategoryChange,
    onPriorityChange,
    onStatusChange,
}) => {
    const categories = useMemo(() => {
        return [
            ...new Set(
                helpRequests.map((request) => request.category).filter(Boolean),
            ),
        ];
    }, [helpRequests]);

    const priorities = useMemo(() => {
        return [
            ...new Set(
                helpRequests.map((request) => request.priority).filter(Boolean),
            ),
        ];
    }, [helpRequests]);

    return (
        <div className="border border-border bg-white">
            <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search
                        size={16}
                        strokeWidth={1.8}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search requests..."
                        className="h-10 w-full rounded-lg border border-border bg-background px-9 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                </div>

                {/* Filters label */}
                <div className="hidden items-center gap-2 text-xs font-semibold text-text-secondary xl:flex">
                    <SlidersHorizontal size={15} />
                    Filters
                </div>

                {/* Category */}
                <select
                    value={categoryFilter}
                    onChange={onCategoryChange}
                    className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option value="all">All Categories</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {/* Priority */}
                <select
                    value={priorityFilter}
                    onChange={onPriorityChange}
                    className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option value="all">All Priorities</option>

                    {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                            {priority}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={statusFilter}
                    onChange={onStatusChange}
                    className="h-10 rounded-lg border border-border bg-white px-3 text-sm font-medium text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option value="all">All Statuses</option>

                    <option value="pending">Pending</option>

                    <option value="verified">Verified</option>

                    <option value="rejected">Rejected</option>

                    <option value="assigned">Assigned</option>

                    <option value="in_progress">In Progress</option>

                    <option value="completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

export default HelpRequestFilters;
