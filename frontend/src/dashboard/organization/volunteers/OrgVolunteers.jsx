import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Download,
    Search,
    SlidersHorizontal,
    X,
    ArrowUp,
    ArrowDown,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import VolunteerStats from './components/Stats';
import VolunteerFilters from './components/Filters';
import VolunteerTable from './components/Table';
import VolunteerPagination from './components/Pagination';

import { fetchOrganizationVolunteers } from './api/volunteerApi';

const PER_PAGE = 25;

const INITIAL_SUMMARY = {
    total: 0,
    active_campaigns: 0,
    active_assignments: 0,
};

const normalizeAssignment = (assignment, index) => {
    const volunteer = assignment?.volunteer || {};
    const user = volunteer?.user || {};

    return {
        ...assignment,

        id: assignment?.id ?? `assignment-${index}`,

        name:
            user?.name ||
            volunteer?.name ||
            assignment?.name ||
            'Unknown volunteer',

        email: user?.email || volunteer?.email || assignment?.email || '',

        photo: user?.photo || volunteer?.photo || assignment?.photo || null,

        campaign:
            assignment?.campaign?.title ||
            assignment?.campaign?.name ||
            'Unknown campaign',

        status: assignment?.status || 'assigned',

        volunteer,
        user,
    };
};

const normalizeResponse = (response) => {
    const assignments = Array.isArray(response?.volunteers)
        ? response.volunteers
        : Array.isArray(response?.data?.volunteers)
          ? response.data.volunteers
          : Array.isArray(response)
            ? response
            : [];

    const normalized = assignments.map(normalizeAssignment);

    const responseSummary = response?.summary || response?.data?.summary || {};

    return {
        volunteers: normalized,
        summary: {
            total: Number(responseSummary.total ?? normalized.length),
            active_campaigns: Number(responseSummary.active_campaigns ?? 0),
            active_assignments: Number(responseSummary.active_assignments ?? 0),
        },
    };
};

const OrgVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [summary, setSummary] = useState(INITIAL_SUMMARY);

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [campaignFilter, setCampaignFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc',
    });

    // ============================================================
    // INITIAL DATA LOADING
    // ============================================================

    useEffect(() => {
        let cancelled = false;

        const fetchInitialData = async () => {
            try {
                const response = await fetchOrganizationVolunteers();

                if (cancelled) return;

                const normalized = normalizeResponse(response);

                setVolunteers(normalized.volunteers);
                setSummary(normalized.summary);
                setPageError('');
            } catch (error) {
                if (cancelled) return;

                setPageError(
                    error?.message || 'Unable to load organization volunteers.',
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchInitialData();

        return () => {
            cancelled = true;
        };
    }, []);

    // ============================================================
    // MANUAL RETRY
    // ============================================================

    const loadVolunteers = useCallback(async () => {
        setLoading(true);
        setPageError('');

        try {
            const response = await fetchOrganizationVolunteers();
            const normalized = normalizeResponse(response);

            setVolunteers(normalized.volunteers);
            setSummary(normalized.summary);
        } catch (error) {
            setPageError(
                error?.message || 'Unable to load organization volunteers.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // ============================================================
    // FILTER OPTIONS
    // ============================================================

    const campaignOptions = useMemo(() => {
        const campaigns = [
            ...new Set(
                volunteers
                    .map((volunteer) => volunteer.campaign)
                    .filter(Boolean),
            ),
        ];

        return campaigns.sort((a, b) => a.localeCompare(b));
    }, [volunteers]);

    const statusOptions = useMemo(() => {
        return [
            ...new Set(
                volunteers.map((volunteer) => volunteer.status).filter(Boolean),
            ),
        ].sort((a, b) => a.localeCompare(b));
    }, [volunteers]);

    // ============================================================
    // FILTERING AND SORTING
    // ============================================================

    const filteredVolunteers = useMemo(() => {
        let result = [...volunteers];

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((volunteer) =>
                [
                    volunteer.name,
                    volunteer.email,
                    volunteer.campaign,
                    volunteer.status,
                ].some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(search),
                ),
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(
                (volunteer) =>
                    String(volunteer.status).toLowerCase() ===
                    statusFilter.toLowerCase(),
            );
        }

        if (campaignFilter !== 'all') {
            result = result.filter(
                (volunteer) => volunteer.campaign === campaignFilter,
            );
        }

        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                const first = String(a[sortConfig.key] ?? '');
                const second = String(b[sortConfig.key] ?? '');

                const comparison = first.localeCompare(second, undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });

                return sortConfig.direction === 'asc'
                    ? comparison
                    : -comparison;
            });
        }

        return result;
    }, [volunteers, searchTerm, statusFilter, campaignFilter, sortConfig]);

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredVolunteers.length / PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedVolunteers = useMemo(() => {
        const start = (safeCurrentPage - 1) * PER_PAGE;

        return filteredVolunteers.slice(start, start + PER_PAGE);
    }, [filteredVolunteers, safeCurrentPage]);

    // ============================================================
    // SORT HANDLERS
    // ============================================================

    const handleSort = (key) => {
        setSortConfig((previous) => {
            if (previous.key !== key) {
                return { key, direction: 'asc' };
            }

            if (previous.direction === 'asc') {
                return { key, direction: 'desc' };
            }

            return { key: null, direction: null };
        });

        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key || !sortConfig.direction) {
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        }

        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} strokeWidth={1.8} />
        ) : (
            <ArrowDown size={14} strokeWidth={1.8} />
        );
    };

    // ============================================================
    // CSV EXPORT
    // ============================================================

    const handleExportCSV = () => {
        if (!filteredVolunteers.length) return;

        const headers = ['Volunteer', 'Email', 'Campaign', 'Assignment Status'];

        const records = filteredVolunteers.map((volunteer) => [
            volunteer.name,
            volunteer.email,
            volunteer.campaign,
            volunteer.status,
        ]);

        const csv = [headers, ...records]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? '').replace(/"/g, '""')}"`,
                    )
                    .join(','),
            )
            .join('\r\n');

        const blob = new Blob(['\uFEFF', csv], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'organization-volunteers.csv';

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    // ============================================================
    // FILTER HANDLERS
    // ============================================================

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleCampaignChange = (value) => {
        setCampaignFilter(value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setCampaignFilter('all');
        setCurrentPage(1);
    };

    const activeFilterCount =
        Number(statusFilter !== 'all') + Number(campaignFilter !== 'all');

    // ============================================================
    // TABLE CONFIGURATION
    // ============================================================

    const tableColumns = [
        {
            key: 'name',
            header: 'Volunteer',
            sortable: true,
            sortKey: 'name',
            width: 'minmax(200px, 1.4fr)',
        },
        {
            key: 'campaign',
            header: 'Campaign',
            sortable: true,
            sortKey: 'campaign',
            width: 'minmax(180px, 1.2fr)',
        },
        {
            key: 'status',
            header: 'Assignment Status',
            sortable: true,
            sortKey: 'status',
            width: 'minmax(150px, 0.9fr)',
        },
    ];

    const filters = (
        <VolunteerFilters
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            campaignFilter={campaignFilter}
            onCampaignChange={handleCampaignChange}
            statusOptions={statusOptions}
            campaignOptions={campaignOptions}
            onClear={clearFilters}
        />
    );

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Volunteers"
                    subtitle="View volunteers assigned to your organization's campaigns."
                />

                <LoadingUI
                    variant="page"
                    title="Loading volunteers..."
                    description="Retrieving volunteer assignments and campaign information."
                />
            </div>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (pageError) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Volunteers"
                    subtitle="View volunteers assigned to your organization's campaigns."
                />

                <LoadingError
                    title="Unable to load volunteers"
                    message={pageError}
                    onRetry={loadVolunteers}
                />

                <button
                    type="button"
                    onClick={loadVolunteers}
                    className="border border-[#343E4B] bg-[#151C26] px-4 py-2.5 text-[12px] font-semibold! text-[#EEF1F5] hover:bg-[#1A222D]"
                >
                    Try again
                </button>
            </div>
        );
    }

    // ============================================================
    // MAIN PAGE
    // ============================================================

    return (
        <>
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Volunteers"
                    subtitle="View volunteers assigned to your organization's campaigns."
                    action={
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            disabled={!filteredVolunteers.length}
                            className="inline-flex h-10 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-4 text-[12px] font-medium! text-[#B8C2CF] transition-colors hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Download size={15} strokeWidth={1.8} />
                            Export CSV
                        </button>
                    }
                />

                <VolunteerStats
                    total={summary.total}
                    activeCampaigns={summary.active_campaigns}
                    activeAssignments={summary.active_assignments}
                />

                <section className="pt-2 lg:pt-3">
                    <div className="mb-6">
                        <h2 className="text-[20px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                            Volunteer Directory
                        </h2>

                        <p className="mt-2 text-[12px] leading-relaxed text-[#8792A1]">
                            Browse volunteers and their campaign assignments.
                        </p>
                    </div>

                    {/* MOBILE FILTER BUTTON */}

                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-10 w-full items-center justify-between border border-[#252D38] bg-[#0E1219] px-4 text-[12px] font-medium! text-[#AEB7C3]"
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={15} />
                                Filters
                            </span>

                            {activeFilterCount > 0 && (
                                <span className="bg-[#1D2632] px-2 py-1 text-[10px] text-[#EEF1F5]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* TABLE + SIDEBAR */}

                    <div className="grid min-w-0 gap-6 xl:min-h-152.5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="relative min-h-0 min-w-0 xl:h-full xl:min-h-152.5">
                            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                                {/* SEARCH HEADER */}

                                <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="relative min-w-0 flex-1">
                                            <Search
                                                size={15}
                                                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#697586]"
                                            />

                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(event) => {
                                                    setSearchTerm(
                                                        event.target.value,
                                                    );
                                                    setCurrentPage(1);
                                                }}
                                                placeholder="Search volunteers or campaigns"
                                                className="h-10 w-full border border-[#29323E] bg-[#0A0E14] pr-14 pl-9 text-[12px] text-[#EEF1F5]! outline-none placeholder:text-[#5E6978] focus:border-[#4B5869]"
                                            />

                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setCurrentPage(1);
                                                    }}
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-medium! text-[#8792A1] hover:text-[#EEF1F5]"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        <span className="shrink-0 text-[11px] font-medium! text-[#AAB3BF]">
                                            {filteredVolunteers.length}{' '}
                                            {filteredVolunteers.length === 1
                                                ? 'result'
                                                : 'results'}
                                        </span>
                                    </div>
                                </div>

                                {/* TABLE */}

                                <div className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-auto [scrollbar-color:#303A47_transparent]">
                                    <VolunteerTable
                                        columns={tableColumns}
                                        rows={paginatedVolunteers}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        resultCount={filteredVolunteers.length}
                                    />
                                </div>

                                {/* PAGINATION */}

                                {filteredVolunteers.length > 0 && (
                                    <div className="shrink-0 border-t border-[#252D38]">
                                        <VolunteerPagination
                                            currentPage={safeCurrentPage}
                                            totalPages={totalPages}
                                            totalItems={
                                                filteredVolunteers.length
                                            }
                                            perPage={PER_PAGE}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DESKTOP FILTER SIDEBAR */}

                        <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block">
                            {filters}
                        </aside>
                    </div>
                </section>
            </div>

            {/* MOBILE FILTER DRAWER */}

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-100 xl:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="absolute inset-0 bg-[#05070A]/75"
                    />

                    <div className="absolute right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto border-t border-[#252D38] bg-[#0E1219] sm:top-0 sm:left-auto sm:w-90 sm:max-h-none sm:border-t-0 sm:border-l">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#252D38] bg-[#151C26] px-5 py-4">
                            <h3 className="text-[15px] font-semibold! text-[#EEF1F5]!">
                                Filter volunteers
                            </h3>

                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                aria-label="Close filters"
                                className="flex h-8 w-8 items-center justify-center text-[#8792A1] hover:text-[#EEF1F5]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {filters}

                        <div className="sticky bottom-0 border-t border-[#252D38] bg-[#0E1219] p-4">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="h-10 w-full border border-[#394555] bg-[#1A222D] text-[12px] font-semibold! text-[#EEF1F5] hover:bg-[#202B38]"
                            >
                                Show {filteredVolunteers.length} results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrgVolunteers;
