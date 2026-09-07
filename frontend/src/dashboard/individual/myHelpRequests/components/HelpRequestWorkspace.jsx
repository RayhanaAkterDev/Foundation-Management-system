import HelpRequestTable from './HelpRequestTable';
import HelpRequestPagination from './HelpRequestPagination';
import HelpRequestSidebar from './HelpRequestSidebar';

const HelpRequestWorkspace = ({
    workspaceHeight,
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
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)] h-auto lg:h-224!">
        <div
            className="grid min-w-0 min-h-0 lg:h-full lg:grid-cols-[minmax(0,1fr)_300px]"
            style={
                workspaceHeight
                    ? {
                          height: `${workspaceHeight}px`,
                      }
                    : undefined
            }
        >
            <div className="flex min-w-0 min-h-0 flex-col bg-white lg:h-full">
                <div className="shrink-0 border-b border-border px-5 pt-8 pb-7 shadow-4xl sm:px-6 sm:pt-10 sm:pb-8 lg:px-6 lg:pt-12">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-[24px] font-extrabold leading-tight tracking-[-0.035em] text-text-primary sm:text-[28px]">
                                Help requests
                            </h2>

                            <p className="mt-2 max-w-lg text-[13px] leading-5.5 text-text-secondary">
                                Keep track of the requests you have submitted
                                and see <br className="hidden sm:block" />
                                where each one currently stands.
                            </p>
                        </div>

                        <div className="flex items-center gap-5 self-start sm:gap-6 lg:self-auto">
                            <div>
                                <div className="text-[22px] font-extrabold leading-none tracking-[-0.03em] text-text-primary sm:text-[24px]">
                                    {resultCount}
                                </div>

                                <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-text-secondary">
                                    Total requests
                                </div>
                            </div>

                            <div className="h-10 w-px bg-border" />

                            <div className="min-w-0">
                                <div className="text-[13px] font-semibold text-text-primary">
                                    Submitted
                                </div>

                                <div className="mt-1 text-[11px] text-text-secondary">
                                    Your request history
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="min-h-0 min-w-0 flex-1 overflow-y-scroll overflow-x-auto overscroll-contain bg-white"
                    style={{ scrollbarGutter: 'stable' }}
                >
                    <div className="w-full min-w-180 overflow-x-visible bg-white sm:min-w-0">
                        <HelpRequestTable
                            columns={columns}
                            rows={rows}
                            onSort={onSort}
                            getSortIcon={getSortIcon}
                            resultCount={resultCount}
                        />
                    </div>
                </div>

                {resultCount > 0 && (
                    <div className="shrink-0 border-t border-border bg-white px-4 py-4 sm:px-6 lg:px-8">
                        <HelpRequestPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
            </div>

            <HelpRequestSidebar
                workspaceSidebarRef={workspaceSidebarRef}
                categoryTabs={categoryTabs}
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                priorityFilter={priorityFilter}
                statusFilter={statusFilter}
                helpRequests={helpRequests}
                onSearchChange={onSearchChange}
                onCategoryFilterChange={onCategoryFilterChange}
                onPriorityChange={onPriorityChange}
                onStatusChange={onStatusChange}
            />
        </div>
    </section>
);

export default HelpRequestWorkspace;
