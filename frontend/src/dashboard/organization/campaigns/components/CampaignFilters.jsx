import React from 'react';

import { ChevronDown, Filter, Search } from 'lucide-react';

const CampaignFilters = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1 sm:max-w-md">
                <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                    strokeWidth={1.8}
                />

                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search campaigns..."
                    className="h-10 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/8"
                />
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 text-text-secondary sm:flex">
                    <Filter className="h-3.5 w-3.5" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                        Filter
                    </span>
                </div>

                <div className="relative w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="h-10 w-full min-w-35 appearance-none rounded-xl border border-border bg-white px-3.5 pr-9 text-xs font-semibold text-text-primary outline-none transition-colors hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/8 sm:w-auto"
                    >
                        <option value="all">All campaigns</option>

                        <option value="active">Active</option>

                        <option value="completed">Completed</option>

                        <option value="pending">Pending</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                </div>
            </div>
        </div>
    );
};

export default CampaignFilters;
