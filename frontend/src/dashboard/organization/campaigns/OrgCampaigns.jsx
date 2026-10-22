import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Download,
    Plus,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import CampaignOverview from './components/CampaignOverview';
import CampaignFilters from './components/CampaignFilters';
import CampaignTable from './components/CampaignTable';
import CampaignPagination from './components/CampaignPagination';

const BASE = '/organization/dashboard/campaigns';
const CAMPAIGNS_PER_PAGE = 25;

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function getCampaigns() {
    const token =
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token');

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}/organization/campaigns`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || 'Failed to load campaigns.');
    }

    return Array.isArray(data?.campaigns) ? data.campaigns : [];
}

function getCampaignType(campaign) {
    const raw = String(campaign?.type ?? campaign?.campaignType ?? '')
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const helpRequestId =
        campaign?.help_request_id ??
        campaign?.helpRequest?.id ??
        campaign?.help_request?.id;

    if (raw === 'local_case' || raw === 'localcase' || helpRequestId != null) {
        return 'local_case';
    }

    if (
        [
            'organization_proposed',
            'org_proposed',
            'organization',
            'org',
        ].includes(raw)
    ) {
        return 'organization_proposed';
    }

    if (raw === 'global' || raw === 'global_situation') {
        return 'global_situation';
    }

    return raw;
}

function compareValues(first, second, key, direction) {
    if (['target_amount', 'collected_amount'].includes(key)) {
        first = Number(first ?? 0);
        second = Number(second ?? 0);
    } else if (['start_date', 'end_date', 'created_at'].includes(key)) {
        first = first ? new Date(first).getTime() : 0;
        second = second ? new Date(second).getTime() : 0;

        first = Number.isFinite(first) ? first : 0;
        second = Number.isFinite(second) ? second : 0;
    } else {
        first = String(first ?? '').toLowerCase();
        second = String(second ?? '').toLowerCase();
    }

    if (first < second) return direction === 'asc' ? -1 : 1;
    if (first > second) return direction === 'asc' ? 1 : -1;

    return 0;
}

export default function OrgCampaigns() {
    const navigate = useNavigate();
    const location = useLocation();

    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await getCampaigns();

                if (!cancelled) {
                    setCampaigns(data);
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    console.error(
                        'Failed to fetch organization campaigns:',
                        err,
                    );

                    setCampaigns([]);
                    setError(
                        err?.message ||
                            'Something went wrong while loading campaigns.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!location.state?.openCreateCampaign) return;

        const timer = window.setTimeout(() => {
            navigate(`${BASE}/add`, {
                replace: true,
                state: {
                    openCreateCampaign: true,
                    helpRequestId: location.state?.helpRequestId ?? null,
                },
            });
        }, 0);

        return () => window.clearTimeout(timer);
    }, [location.state, navigate]);

    const retry = async () => {
        setIsLoading(true);
        setError('');

        try {
            setCampaigns(await getCampaigns());
        } catch (err) {
            console.error('Failed to fetch organization campaigns:', err);

            setCampaigns([]);
            setError(
                err?.message || 'Something went wrong while loading campaigns.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCampaigns = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = campaigns.filter((campaign) => {
            const status = String(campaign?.status || '')
                .trim()
                .toLowerCase();

            const category = String(campaign?.category || '')
                .trim()
                .toLowerCase();

            const campaignType = getCampaignType(campaign);

            const searchMatch =
                !query ||
                [
                    campaign?.title,
                    campaign?.description,
                    campaign?.category,
                    campaign?.deadline,
                    campaign?.end_date,
                    campaign?.helpRequestTitle,
                    campaign?.help_request?.title,
                    campaign?.help_request_title,
                    campaign?.location,
                    campaign?.district,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            const statusMatch =
                statusFilter === 'all' || status === statusFilter;

            const typeMatch =
                typeFilter === 'all' || campaignType === typeFilter;

            const categoryMatch =
                categoryFilter === 'all' ||
                category === categoryFilter.toLowerCase();

            return searchMatch && statusMatch && typeMatch && categoryMatch;
        });

        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) =>
                compareValues(
                    a[sortConfig.key],
                    b[sortConfig.key],
                    sortConfig.key,
                    sortConfig.direction,
                ),
            );
        }

        return result;
    }, [
        campaigns,
        search,
        statusFilter,
        typeFilter,
        categoryFilter,
        sortConfig,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedCampaigns = useMemo(() => {
        const start = (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE;

        return filteredCampaigns.slice(start, start + CAMPAIGNS_PER_PAGE);
    }, [filteredCampaigns, safeCurrentPage]);

    const tableRows = useMemo(
        () =>
            paginatedCampaigns.map((campaign, index) => ({
                ...campaign,
                serialNumber:
                    (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE + index + 1,
            })),
        [paginatedCampaigns, safeCurrentPage],
    );

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleTypeChange = (value) => {
        setTypeFilter(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setStatusFilter('all');
        setTypeFilter('all');
        setCategoryFilter('all');
        setCurrentPage(1);
    };

    const activeFilterCount = [statusFilter, typeFilter, categoryFilter].filter(
        (value) => value !== 'all',
    ).length;

    const handleSort = (key) => {
        setSortConfig((current) => {
            if (current.key !== key) {
                return { key, direction: 'asc' };
            }

            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }

            return { key: null, direction: null };
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        }

        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} strokeWidth={2} />
        ) : (
            <ArrowDown size={14} strokeWidth={2} />
        );
    };

    const handleView = (campaign) => {
        if (campaign?.id == null) return;
        navigate(`${BASE}/${campaign.id}`);
    };

    const handleExportCSV = () => {
        if (!filteredCampaigns.length) return;

        const rows = [
            [
                'Campaign',
                'Category',
                'Target',
                'Collected',
                'Start Date',
                'End Date',
                'Status',
            ],
            ...filteredCampaigns.map((campaign) => [
                campaign.title || '',
                campaign.category || '',
                campaign.target_amount ?? '',
                campaign.collected_amount ?? 0,
                campaign.start_date || '',
                campaign.end_date || campaign.deadline || '',
                campaign.status || '',
            ]),
        ];

        const content = rows
            .map((row) =>
                row
                    .map((value) => {
                        const safe = String(value ?? '')
                            .replace(/^[=+\-@\t\r]/, "'")
                            .replace(/"/g, '""');

                        return `"${safe}"`;
                    })
                    .join(','),
            )
            .join('\r\n');

        const blob = new Blob(['\uFEFF', content], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'organization-campaigns.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const renderFilters = () => (
        <CampaignFilters
            campaigns={campaigns}
            statusFilter={statusFilter}
            setStatusFilter={handleStatusChange}
            typeFilter={typeFilter}
            onTypeChange={handleTypeChange}
            categoryFilter={categoryFilter}
            onCategoryChange={handleCategoryChange}
            activeFilterCount={activeFilterCount}
            onClearFilters={resetFilters}
        />
    );

    if (isLoading || error) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Campaigns"
                    subtitle="Manage fundraising campaigns created by your organization."
                />

                {isLoading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading campaigns..."
                        description="Please wait while we retrieve your campaigns."
                    />
                ) : (
                    <div className="space-y-4">
                        <LoadingError
                            title="Unable to load campaigns"
                            message={error}
                        />

                        <button
                            type="button"
                            onClick={retry}
                            className="h-10 border border-[#343E4B] bg-[#151C25] px-5 text-[12px] font-medium text-[#EEF1F5] hover:bg-[#202A35]"
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-10 font-sans lg:space-y-12">
            <PageHeader
                title="Campaigns"
                subtitle="Manage fundraising campaigns created by your organization."
                action={
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            disabled={!filteredCampaigns.length}
                            className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-[12px] font-medium text-[#B8C2CF] transition-colors hover:bg-[#1C232D] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Download size={15} />
                            Export
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`${BASE}/add`)}
                            className="inline-flex h-10 items-center gap-2 bg-[#263343] px-4 text-[12px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#354559]"
                        >
                            <Plus size={16} />
                            Add Campaign
                        </button>
                    </div>
                }
            />

            <CampaignOverview campaigns={campaigns} />

            <section className="pt-2 lg:pt-3">
                <div className="pb-5 sm:pb-6">
                    <h2 className="m-0! font-sans! text-[20px]! font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                        Campaign Directory
                    </h2>

                    <p className="mt-2 mb-0! text-[12px] text-[#8792A1]">
                        Browse and manage your organization's fundraising
                        campaigns.
                    </p>
                </div>

                {/* MOBILE FILTER TRIGGER */}

                <div className="mb-5 xl:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex h-10 w-full items-center justify-between border border-[#29323E] bg-[#0E1219] px-3.5 text-[12px] text-[#AEB7C3]"
                    >
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal size={15} />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center bg-[#263343] px-1 text-[10px] text-[#EEF1F5]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </span>

                        <span className="text-[#697586]">Refine campaigns</span>
                    </button>
                </div>

                {/* MOBILE FILTER DRAWER */}

                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-1000 xl:hidden">
                        <button
                            type="button"
                            aria-label="Close filters"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="absolute inset-0 bg-black/70"
                        />

                        <div className="absolute inset-y-0 right-0 flex w-[min(340px,90vw)] flex-col border-l border-[#29323E] bg-[#0E1219]">
                            <div className="flex shrink-0 items-center justify-between border-b border-[#29323E] px-4 py-4">
                                <span className="text-[13px] font-semibold text-[#EEF1F5]">
                                    Campaign filters
                                </span>

                                <button
                                    type="button"
                                    aria-label="Close filters"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="text-[#AEB7C3] hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {renderFilters()}
                            </div>

                            <div className="shrink-0 border-t border-[#252D38] p-4">
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="h-10 w-full bg-[#263343] text-[12px] font-medium text-[#EEF1F5]"
                                >
                                    Show {filteredCampaigns.length} results
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/*
                    DESKTOP STRUCTURE

                    The sidebar establishes the grid row's natural height.

                    The table column is positioned inside that row,
                    so its content cannot increase the sidebar height.

                    The table body scrolls independently.
                */}

                <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                    {/* TABLE COLUMN */}

                    <div className="min-w-0 xl:relative xl:min-h-0">
                        <div className="flex min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                            {/* SEARCH TOOLBAR */}

                            <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="relative min-w-0 flex-1">
                                        <Search
                                            size={15}
                                            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#697586]"
                                        />

                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) =>
                                                handleSearchChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Search campaigns by title or category"
                                            className="h-10 w-full border border-[#35404E] bg-[#0E1219] pr-4 pl-9 text-[12px] text-[#DCE3EC] outline-none placeholder:text-[#697586] hover:border-[#455160] focus:border-[#64748B]"
                                        />
                                    </div>

                                    <span className="shrink-0 text-[11px] font-medium text-[#AAB3BF]">
                                        {filteredCampaigns.length}{' '}
                                        {filteredCampaigns.length === 1
                                            ? 'result'
                                            : 'results'}
                                    </span>
                                </div>
                            </div>

                            {/* INDEPENDENT TABLE SCROLL AREA */}

                            <div className="min-w-0 bg-[#0E1219] xl:min-h-0 xl:flex-1 xl:overflow-auto">
                                <CampaignTable
                                    rows={tableRows}
                                    onSort={handleSort}
                                    getSortIcon={getSortIcon}
                                    onView={handleView}
                                    resultCount={filteredCampaigns.length}
                                />
                            </div>

                            {/* FIXED PAGINATION FOOTER */}

                            {filteredCampaigns.length > 0 && (
                                <div className="shrink-0 border-t border-[#252D38]">
                                    <CampaignPagination
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredCampaigns.length}
                                        itemsPerPage={CAMPAIGNS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SIDEBAR — DETERMINES DESKTOP HEIGHT */}

                    <aside className="hidden min-w-0 min-h-[620px] self-start border border-[#252D38] bg-[#0E1219] xl:block">
                        {renderFilters()}
                    </aside>
                </div>
            </section>
        </div>
    );
}
