import HelpRequestFilters from './HelpRequestFilters';
export default function HelpRequestSidebar({
    workspaceSidebarRef,
    onCategoryFilterChange,
    ...props
}) {
    return (
        <aside
            ref={workspaceSidebarRef}
            className="min-w-0 border border-[#252D38] bg-[#0E1219]"
        >
            <HelpRequestFilters
                {...props}
                onCategoryFilterChange={onCategoryFilterChange}
            />
        </aside>
    );
}
