import PriorityQueue from "./PriorityQueue";
import CaseRegister from "./CaseRegister";

import { formatCurrency } from "../utils/helpRequestUtils";

const CaseWorkspace = ({
  pending,
  counts,
  assignments,
  filteredRequests,
  loading,
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  onClearFilters,
  onOpenCase,
  filters,
  statusConfig,
}) => (
  <main className="min-w-0 space-y-8">
    {/* =================================================
            PRIORITY QUEUE
        ================================================= */}

    <section className="min-w-0">
      <PriorityQueue
        pending={pending}
        counts={counts}
        formatCurrency={formatCurrency}
        onViewCase={() => pending && onOpenCase(pending)}
        onRespond={() => pending && onOpenCase(pending)}
      />
    </section>

    {/* =================================================
            CASE REGISTER
        ================================================= */}

    <section className="min-w-0">
      <CaseRegister
        assignments={assignments}
        filteredRequests={filteredRequests}
        loading={loading}
        search={search}
        setSearch={setSearch}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
        counts={counts}
        onClearFilters={onClearFilters}
        onOpenCase={onOpenCase}
        statusConfig={statusConfig}
      />
    </section>
  </main>
);

export default CaseWorkspace;
