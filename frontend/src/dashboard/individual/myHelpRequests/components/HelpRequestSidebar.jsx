import HelpRequestCategoryTabs from './HelpRequestCategoryTabs';
import HelpRequestFilters from './HelpRequestFilters';

const HelpRequestSidebar = ({
    workspaceSidebarRef,
    categoryTabs,
    activeCategory,
    onCategoryChange,
    searchTerm,
    categoryFilter,
    priorityFilter,
    statusFilter,
    helpRequests,
    onSearchChange,
    onCategoryFilterChange,
    onPriorityChange,
    onStatusChange,
}) => (
                        <aside
                            ref={workspaceSidebarRef}
                            className="
                order-first
                min-w-0
                self-start
                overflow-hidden
                border-b
                border-border
                bg-primary/7
                lg:order-none
                lg:border-b-0
                lg:border-l
            "
                        >
                            <div className="p-5 sm:p-7">
                                {/* =================================================
                    REQUEST STATUS
                ================================================== */}

                                <div>
                                    <div className="mb-5 flex items-center gap-2.5">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <span className="relative h-3.5 w-3.5">
                                                <span className="absolute left-0 top-0.5 h-px w-3.5 bg-primary" />
                                                <span className="absolute left-1 top-1.5 h-px w-2.5 bg-primary" />
                                                <span className="absolute left-2 top-2.5 h-px w-1.5 bg-primary" />
                                            </span>
                                        </span>

                                        <div>
                                            <p className="text-[13px] font-extrabold leading-5 tracking-[-0.005em] text-text-primary">
                                                Request status
                                            </p>

                                            <p className="mt-1 text-[11px] font-normal leading-4.5 text-text-secondary">
                                                Browse by current stage
                                            </p>
                                        </div>
                                    </div>

                                    <HelpRequestCategoryTabs
                                        tabs={categoryTabs}
                                        activeCategory={activeCategory}
                                        onChange={onCategoryChange}
                                    />
                                </div>

                                {/* =================================================
                    FILTERS
                ================================================== */}

                                <div className="mt-9 border-t border-border pt-8">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <span className="relative h-3.5 w-3.5">
                                                    <span className="absolute left-0 top-0.5 h-px w-3.5 bg-primary" />
                                                    <span className="absolute left-1 top-1.5 h-px w-2.5 bg-primary" />
                                                    <span className="absolute left-2 top-2.5 h-px w-1.5 bg-primary" />
                                                </span>
                                            </span>

                                            <div>
                                                <p className="text-[13px] font-extrabold leading-5 tracking-[-0.005em] text-text-primary">
                                                    Filter requests
                                                </p>

                                                <p className="mt-1 text-[11px] font-normal leading-4.5 text-text-secondary">
                                                    Narrow down your results
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="
                            min-w-0
                            [&>div]:grid!
                            [&>div]:w-full!
                            [&>div]:grid-cols-1!
                            [&>div]:gap-5!
                            [&>div>div]:w-full!
                            [&>div>div]:min-w-0!
                            [&_label]:mb-2!
                            [&_label]:block!
                            [&_label]:w-full!
                            [&_label]:text-[11px]!
                            [&_input]:w-full!
                            [&_input]:min-w-0!
                            [&_select]:w-full!
                            [&_select]:min-w-0!
                            [&_button]:max-w-full!
                        "
                                    >
                                        <HelpRequestFilters
                                            searchTerm={searchTerm}
                                            categoryFilter={categoryFilter}
                                            priorityFilter={priorityFilter}
                                            statusFilter={statusFilter}
                                            helpRequests={helpRequests}
                                            onSearchChange={onSearchChange}
                                            onCategoryChange={
                                                onCategoryFilterChange
                                            }
                                            onPriorityChange={
                                                onPriorityChange
                                            }
                                            onStatusChange={onStatusChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </aside>

);

export default HelpRequestSidebar;
