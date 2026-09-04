import {
    ArrowUpRight,
    FileText,
    MapPin,
    RefreshCcw,
    Search,
    X,
} from 'lucide-react';

import { formatCurrency } from './helpRequestUtils';

const ListHeader = ({ children, align = 'left' }) => (
    <div
        className={`text-[8px] font-bold uppercase tracking-[0.14em] text-[#89969b] ${
            align === 'right' ? 'text-right' : ''
        }`}
    >
        {children}
    </div>
);

const CaseRow = ({ request, onOpen, statusConfig }) => {
    const config = statusConfig[request.status] || statusConfig.pending;

    const StatusIcon = config.icon;

    const styles = {
        pending: {
            text: 'text-[#9e6b08]',
            bg: 'bg-[#fff2d1]',
            dot: 'bg-[#e6b63e]',
        },

        assigned: {
            text: 'text-[#60788b]',
            bg: 'bg-[#edf2f5]',
            dot: 'bg-[#8299aa]',
        },

        active: {
            text: 'text-primary',
            bg: 'bg-[#e5f3f0]',
            dot: 'bg-[#63a99f]',
        },

        completed: {
            text: 'text-[#66767b]',
            bg: 'bg-[#eef1f1]',
            dot: 'bg-[#9aa5a8]',
        },

        rejected: {
            text: 'text-[#a9574e]',
            bg: 'bg-[#f9ecea]',
            dot: 'bg-[#c98178]',
        },

        withdrawal: {
            text: 'text-[#a56545]',
            bg: 'bg-[#f7eee9]',
            dot: 'bg-[#ce8968]',
        },
    };

    const status = styles[request.status] || styles.pending;

    const priority =
        request.status === 'pending' || request.status === 'withdrawal';

    return (
        <article
            className={`group relative border-b border-[#e1e8ea] px-6 py-7 transition-all duration-200 last:border-b-0 ${
                priority ? 'bg-[#fffdfa]' : 'bg-white'
            } hover:bg-[#fbfcfc]`}
        >
            {request.status === 'pending' && (
                <span className="absolute bottom-0 left-0 top-0 w-0.75 bg-accent" />
            )}

            {request.status === 'withdrawal' && (
                <span className="absolute bottom-0 left-0 top-0 w-0.75 bg-[#c97d59]" />
            )}

            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_145px_145px_145px] lg:items-center lg:gap-7">
                {/* CASE */}

                <div className="min-w-0">
                    <div className="flex items-start gap-4">
                        <div
                            className={`hidden h-11 w-11 shrink-0 items-center justify-center border border-transparent transition-all duration-200 sm:flex ${
                                priority
                                    ? 'bg-[#fff2d3] text-[#ae770b]'
                                    : 'bg-[#f1f5f6] text-[#728188] group-hover:border-[#d7e6e3] group-hover:bg-[#e8f3f1] group-hover:text-primary'
                            }`}
                        >
                            <FileText
                                className="h-4.25 w-4.25"
                                strokeWidth={1.6}
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={onOpen}
                                    className="text-left text-[14px] font-bold leading-5 tracking-[-0.018em] text-[#23373e] transition-colors hover:text-primary"
                                >
                                    {request.title}
                                </button>

                                {request.status === 'pending' && (
                                    <span className="bg-[#fff0c7] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#956500]">
                                        Action needed
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 max-w-2xl text-[11px] leading-6 text-[#7c898e]">
                                {request.description}
                            </p>

                            <div className="mt-3.5 flex flex-wrap items-center gap-x-4.5 gap-y-2 text-[10px] text-[#89969b]">
                                <span className="font-semibold text-[#52646a]">
                                    {formatCurrency(request.amountNeeded)}
                                </span>

                                <span>{request.category}</span>

                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />

                                    {request.district}
                                </span>

                                <span>
                                    {request.peopleAffected ?? '—'}{' '}
                                    {request.peopleAffected === 1
                                        ? 'person'
                                        : request.peopleAffected
                                          ? 'people'
                                          : ''}
                                </span>
                            </div>

                            {request.status === 'active' &&
                                request.progress !== null && (
                                    <div className="mt-5 max-w-md">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#919da1]">
                                                Assistance progress
                                            </span>

                                            <span className="text-[9px] font-bold text-primary">
                                                {request.progress}%
                                            </span>
                                        </div>

                                        <div className="mt-2 h-1.25 overflow-hidden bg-[#e2eaec]">
                                            <div
                                                className="h-full bg-primary"
                                                style={{
                                                    width: `${request.progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* REQUESTER */}

                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0aaae] lg:hidden">
                        Requester
                    </p>

                    <p className="mt-1.5 text-[11px] font-semibold text-[#42545b] lg:mt-0">
                        {request.individual}
                    </p>

                    <p className="mt-1.5 text-[10px] leading-4 text-[#919da2]">
                        {request.location}
                    </p>
                </div>

                {/* ACTIVITY */}

                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0aaae] lg:hidden">
                        Activity
                    </p>

                    <p className="mt-1.5 text-[11px] font-semibold leading-4 text-[#42545b] lg:mt-0">
                        {request.status === 'active'
                            ? request.lastUpdate || 'In progress'
                            : request.submitted}
                    </p>

                    <p className="mt-1.5 text-[10px] text-[#919da2]">
                        {request.status === 'active'
                            ? ''
                            : request.submittedTime}
                    </p>
                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between gap-4 lg:justify-end">
                    <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 ${status.bg} ${status.text}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                        />

                        <StatusIcon className="h-3 w-3" strokeWidth={1.8} />

                        <span className="text-[9px] font-bold">
                            {config.short}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="flex h-8 w-8 items-center justify-center text-[#9aa5a9] transition-all hover:bg-[#edf3f4] hover:text-primary lg:opacity-0 lg:group-hover:opacity-100"
                        aria-label={`Open ${request.title}`}
                    >
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />
                    </button>
                </div>
            </div>
        </article>
    );
};

const EmptyState = ({ onClear, hasData = false }) => (
    <div className="flex min-h-115 flex-col items-center justify-center border border-[#d8e3e6] bg-white px-6 text-center shadow-[0_10px_30px_rgba(24,53,61,0.035)]">
        <div className="relative flex h-14 w-14 items-center justify-center bg-[#edf4f3] text-primary">
            <Search className="h-5 w-5" strokeWidth={1.5} />

            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
        </div>

        <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-[#263940]">
            {hasData ? 'No matching cases' : 'No assigned cases'}
        </h3>

        <p className="mt-3 max-w-sm text-[12px] leading-6 text-[#89969b]">
            {hasData
                ? 'Nothing matches your current search or status filter.'
                : 'There are no help request assignments for your organization yet.'}
        </p>

        <button
            type="button"
            onClick={onClear}
            className="mt-6 inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold text-white shadow-[0_6px_15px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover"
        >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset view
        </button>
    </div>
);

const CaseRegister = ({
    assignments,
    filteredRequests,
    loading,
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    filters,
    counts,
    onClearFilters,
    onOpenCase,
    statusConfig,
}) => {
    return (
        <section className="mt-20 pb-16 sm:mt-24 lg:mt-28">
            <div className="flex flex-col gap-7 border-b border-[#c9d5d8] pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="h-1.25 w-1.25 rounded-full bg-primary" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#7d8b90]">
                            Case register
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h2 className="text-[31px] font-semibold tracking-[-0.055em] text-[#10232a]">
                            Your cases
                        </h2>

                        <span className="text-[10px] font-medium text-[#9aa5a9]">
                            {filteredRequests.length} of {assignments.length}
                        </span>
                    </div>
                </div>

                <div className="relative w-full lg:w-100">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#849399]" />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search cases, people, locations..."
                        className="h-12 w-full border border-[#cbd8db] bg-white pl-11 pr-10 text-[11px] font-medium text-[#33464d] shadow-[0_4px_14px_rgba(25,52,60,0.025)] outline-none transition-all duration-200 placeholder:text-[#9ba6aa] focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c989c] transition hover:text-[#31444a]"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-9 grid gap-9 xl:grid-cols-[215px_minmax(0,1fr)]">
                {/* FILTER */}

                <nav className="self-start xl:sticky xl:top-6">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#879398]">
                            Case status
                        </p>

                        <span className="text-[9px] font-semibold text-[#a0aaae]">
                            {assignments.length}
                        </span>
                    </div>

                    <div className="overflow-hidden border-y border-[#d2dee1]">
                        {filters.map((filter) => {
                            const selected = activeFilter === filter.key;

                            return (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setActiveFilter(filter.key)}
                                    className={`group relative flex w-full items-center justify-between border-b border-[#e0e7e9] py-4 text-left transition-all duration-200 last:border-b-0 ${
                                        selected
                                            ? 'bg-white px-3.5 text-[#1c3037] shadow-[0_3px_12px_rgba(20,48,56,0.035)]'
                                            : 'px-1 text-[#738187] hover:bg-white/60 hover:px-2 hover:text-primary'
                                    }`}
                                >
                                    {selected && (
                                        <span className="absolute bottom-0 left-0 top-0 w-0.75 bg-primary" />
                                    )}

                                    <span className="text-[11px] font-semibold">
                                        {filter.label}
                                    </span>

                                    <span
                                        className={`min-w-6 text-right text-[11px] font-bold ${
                                            selected
                                                ? 'text-primary'
                                                : 'text-[#a0aaae]'
                                        }`}
                                    >
                                        {counts[filter.key]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {(search || activeFilter !== 'all') && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="mt-6 flex items-center gap-2 text-[10px] font-bold text-primary transition hover:text-primary-hover"
                        >
                            <RefreshCcw className="h-3.5 w-3.5" />
                            Reset filters
                        </button>
                    )}
                </nav>

                {/* CASE LIST */}

                <main className="min-w-0">
                    {loading ? (
                        <div className="flex min-h-115 flex-col items-center justify-center border border-[#d8e3e6] bg-white px-6 text-center shadow-[0_10px_30px_rgba(24,53,61,0.035)]">
                            <div className="relative flex h-14 w-14 items-center justify-center bg-[#edf4f3] text-primary">
                                <RefreshCcw
                                    className="h-5 w-5 animate-spin"
                                    strokeWidth={1.5}
                                />

                                <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
                            </div>

                            <h3 className="mt-6 text-[19px] font-semibold tracking-tight text-[#263940]">
                                Loading cases
                            </h3>

                            <p className="mt-3 max-w-sm text-[12px] leading-6 text-[#89969b]">
                                Retrieving your assigned help requests from the
                                server.
                            </p>
                        </div>
                    ) : filteredRequests.length > 0 ? (
                        <div className="overflow-hidden border border-[#d1dfe2] bg-white shadow-[0_14px_38px_rgba(24,53,61,0.045)]">
                            <div className="hidden border-b border-[#d8e3e5] bg-[#f7f9fa] px-6 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_145px_145px_145px] lg:gap-7">
                                <ListHeader>Case</ListHeader>

                                <ListHeader>Requester</ListHeader>

                                <ListHeader>Activity</ListHeader>

                                <ListHeader align="right">Status</ListHeader>
                            </div>

                            {filteredRequests.map((request) => (
                                <CaseRow
                                    key={request.assignmentId}
                                    request={request}
                                    onOpen={() => onOpenCase(request)}
                                    statusConfig={statusConfig}
                                />
                            ))}

                            <div className="flex items-center justify-between border-t border-[#d9e3e6] bg-[#fafbfb] px-6 py-4">
                                <p className="text-[10px] font-medium text-[#8c989d]">
                                    Showing {filteredRequests.length} cases
                                </p>

                                <span className="flex items-center gap-2 text-[9px] font-semibold text-[#9da7ab]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#76b3aa]" />
                                    Data updated today
                                </span>
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            onClear={onClearFilters}
                            hasData={assignments.length > 0}
                        />
                    )}
                </main>
            </div>
        </section>
    );
};

export default CaseRegister;
