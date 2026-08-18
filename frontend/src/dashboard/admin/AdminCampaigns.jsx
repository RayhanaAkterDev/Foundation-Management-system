import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, Download } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import CampaignStats from './campaigns/CampaignStats';
import CampaignCategoryTabs from './campaigns/CampaignCategoryTabs';
import CampaignFilters from './campaigns/CampaignFilters';
import CampaignTable from './campaigns/CampaignTable';
import CampaignPagination from './campaigns/CampaignPagination';
import CampaignViewModal from './campaigns/CampaignViewModal';

import { fetchCampaigns } from './campaigns/campaignsAPI';

const CAMPAIGNS_PER_PAGE = 25;

const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --------------------------------
    // Selected campaign / View modal
    // --------------------------------

    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // --------------------------------
    // Filters / Search / Sorting
    // --------------------------------

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [organizationFilter, setOrganizationFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // --------------------------------
    // Load campaigns
    // --------------------------------

    useEffect(() => {
        let cancelled = false;

        const loadAdminData = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await fetchCampaigns();

                if (cancelled) {
                    return;
                }

                setCampaigns(data.campaigns || data.data || []);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                            'Something went wrong while loading campaigns.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadAdminData();

        return () => {
            cancelled = true;
        };
    }, []);

    // --------------------------------
    // Statistics
    // --------------------------------

    const statistics = useMemo(() => {
        return {
            total: campaigns.length,

            pending: campaigns.filter(
                (campaign) => campaign.status === 'pending_review',
            ).length,

            active: campaigns.filter(
                (campaign) =>
                    campaign.status === 'active' ||
                    campaign.status === 'in_progress',
            ).length,

            completed: campaigns.filter(
                (campaign) => campaign.status === 'completed',
            ).length,

            rejected: campaigns.filter(
                (campaign) => campaign.status === 'rejected',
            ).length,
        };
    }, [campaigns]);

    // --------------------------------
    // Status tabs
    // --------------------------------

    const categoryTabs = useMemo(
        () => [
            {
                key: 'all',
                label: 'All Campaigns',
                count: statistics.total,
            },
            {
                key: 'pending_review',
                label: 'Pending Review',
                count: statistics.pending,
            },
            {
                key: 'active',
                label: 'Active',
                count: statistics.active,
            },
            {
                key: 'completed',
                label: 'Completed',
                count: statistics.completed,
            },
            {
                key: 'rejected',
                label: 'Rejected',
                count: statistics.rejected,
            },
        ],
        [statistics],
    );

    // --------------------------------
    // Filtering + Sorting
    // --------------------------------

    const filteredCampaigns = useMemo(() => {
        let result = [...campaigns];

        // --------------------------------
        // Status tab
        // --------------------------------

        if (activeCategory !== 'all') {
            if (activeCategory === 'active') {
                result = result.filter(
                    (campaign) =>
                        campaign.status === 'active' ||
                        campaign.status === 'in_progress',
                );
            } else {
                result = result.filter(
                    (campaign) => campaign.status === activeCategory,
                );
            }
        }

        // --------------------------------
        // Campaign type
        // --------------------------------

        if (typeFilter !== 'all') {
            result = result.filter((campaign) => campaign.type === typeFilter);
        }

        // --------------------------------
        // Category
        // --------------------------------

        if (categoryFilter !== 'all') {
            result = result.filter(
                (campaign) => campaign.category === categoryFilter,
            );
        }

        // --------------------------------
        // Organization
        // --------------------------------

        if (organizationFilter !== 'all') {
            result = result.filter(
                (campaign) =>
                    String(campaign.organization_id) ===
                    String(organizationFilter),
            );
        }

        // --------------------------------
        // Status filter
        // --------------------------------

        if (statusFilter !== 'all') {
            result = result.filter(
                (campaign) => campaign.status === statusFilter,
            );
        }

        // --------------------------------
        // Search
        // --------------------------------

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((campaign) => {
                const title = campaign.title || '';
                const description = campaign.description || '';
                const category = campaign.category || '';

                const organizationName = campaign.organization?.name || '';

                const location = campaign.location || campaign.district || '';

                return (
                    title.toLowerCase().includes(search) ||
                    description.toLowerCase().includes(search) ||
                    category.toLowerCase().includes(search) ||
                    organizationName.toLowerCase().includes(search) ||
                    location.toLowerCase().includes(search)
                );
            });
        }

        // --------------------------------
        // Sorting
        // --------------------------------

        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        result.sort((a, b) => {
            let first = a[sortConfig.key];
            let second = b[sortConfig.key];

            // Dates

            if (
                sortConfig.key === 'created_at' ||
                sortConfig.key === 'start_date' ||
                sortConfig.key === 'end_date' ||
                sortConfig.key === 'proposal_date'
            ) {
                first = first ? new Date(first).getTime() : 0;
                second = second ? new Date(second).getTime() : 0;
            }

            // Numeric values

            if (
                sortConfig.key === 'target_amount' ||
                sortConfig.key === 'collected_amount'
            ) {
                first = Number(first || 0);
                second = Number(second || 0);
            }

            first = first ?? '';
            second = second ?? '';

            if (typeof first === 'string') {
                first = first.toLowerCase();
                second = String(second).toLowerCase();
            }

            if (first < second) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }

            if (first > second) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }

            return 0;
        });

        return result;
    }, [
        campaigns,
        activeCategory,
        typeFilter,
        categoryFilter,
        organizationFilter,
        statusFilter,
        searchTerm,
        sortConfig,
    ]);

    // --------------------------------
    // Pagination
    // --------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedCampaigns = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE;

        return filteredCampaigns.slice(
            startIndex,
            startIndex + CAMPAIGNS_PER_PAGE,
        );
    }, [filteredCampaigns, safeCurrentPage]);

    // --------------------------------
    // Controls
    // --------------------------------

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleTypeChange = (event) => {
        setTypeFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleOrganizationChange = (event) => {
        setOrganizationFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    // --------------------------------
    // Sorting
    // --------------------------------

    const handleSort = (key) => {
        setSortConfig((current) => {
            if (current.key !== key) {
                return {
                    key,
                    direction: 'asc',
                };
            }

            if (current.direction === 'asc') {
                return {
                    key,
                    direction: 'desc',
                };
            }

            return {
                key: null,
                direction: null,
            };
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        }

        if (sortConfig.direction === 'asc') {
            return <ArrowUp size={14} strokeWidth={2} />;
        }

        if (sortConfig.direction === 'desc') {
            return <ArrowDown size={14} strokeWidth={2} />;
        }

        return <ChevronsUpDown size={14} strokeWidth={1.8} />;
    };

    // --------------------------------
    // CSV Export
    // --------------------------------

    const handleExportCSV = () => {
        if (filteredCampaigns.length === 0) {
            return;
        }

        const headers = [
            'Campaign',
            'Type',
            'Organization',
            'Category',
            'Location',
            'Target',
            'Collected',
            'Status',
            'Start Date',
        ];

        const csvRows = filteredCampaigns.map((campaign) => [
            campaign.title || '',
            campaign.type || '',
            campaign.organization?.name ||
                (campaign.type === 'global_situation'
                    ? 'Stand For People'
                    : ''),
            campaign.category || '',
            campaign.location || campaign.district || '',
            campaign.target_amount ?? '',
            campaign.collected_amount ?? 0,
            campaign.status || '',
            campaign.start_date
                ? new Date(campaign.start_date).toLocaleDateString()
                : '',
        ]);

        const csvContent = [headers, ...csvRows]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? '').replace(/"/g, '""')}"`,
                    )
                    .join(','),
            )
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = 'stand-for-people-campaigns.csv';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // --------------------------------
    // Table rows
    // --------------------------------

    const rows = paginatedCampaigns.map((campaign, index) => ({
        ...campaign,

        serialNumber: (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE + index + 1,

        organizationName:
            campaign.organization?.name ||
            (campaign.type === 'global_situation' ? 'Stand For People' : '—'),

        campaignType:
            campaign.type === 'global_situation'
                ? 'Global Situation'
                : campaign.type === 'organization_proposed'
                  ? 'Organization Proposed'
                  : campaign.type === 'local_case'
                    ? 'Local Case'
                    : campaign.type || '—',

        locationName:
            campaign.location || campaign.district || 'Location not specified',

        target:
            campaign.target_amount !== null &&
            campaign.target_amount !== undefined
                ? `৳${Number(campaign.target_amount).toLocaleString()}`
                : '—',

        collected: `৳${Number(
            campaign.collected_amount || 0,
        ).toLocaleString()}`,
    }));

    // --------------------------------
    // Table columns
    // --------------------------------

    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '60px',
        },

        // --------------------------------
        // Campaign
        // --------------------------------

        {
            key: 'title',
            header: 'Campaign',
            sortable: true,
            sortKey: 'title',

            render: (value, row) => (
                <div className="min-w-0 max-w-90">
                    <p className="truncate font-semibold text-text-primary">
                        {value || 'Untitled campaign'}
                    </p>

                    {row.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                            {row.description}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {row.category && (
                            <span className="inline-flex items-center rounded-full bg-background-alt px-2 py-0.5 text-[10px] font-semibold capitalize text-text-secondary">
                                {row.category}
                            </span>
                        )}

                        {row.locationName &&
                            row.locationName !== 'Location not specified' && (
                                <>
                                    <span className="text-[10px] text-slate-300">
                                        •
                                    </span>

                                    <span className="truncate text-[10px] font-medium text-text-secondary">
                                        {row.locationName}
                                    </span>
                                </>
                            )}
                    </div>
                </div>
            ),
        },

        // --------------------------------
        // Type
        // --------------------------------

        {
            key: 'campaignType',
            header: 'Type',
            sortable: true,
            sortKey: 'type',

            render: (value) => (
                <span className="text-sm font-medium text-text-primary">
                    {value}
                </span>
            ),
        },

        // --------------------------------
        // Organization
        // --------------------------------

        {
            key: 'organizationName',
            header: 'Organization',

            render: (value) => (
                <span className="font-medium text-text-primary">{value}</span>
            ),
        },

        // --------------------------------
        // Target Amount
        // --------------------------------

        {
            key: 'target',
            header: 'Target Amount',
            align: 'right',
            sortable: true,
            sortKey: 'target_amount',

            render: (value) => (
                <span className="whitespace-nowrap font-semibold text-text-primary">
                    {value}
                </span>
            ),
        },

        // --------------------------------
        // Collected
        // --------------------------------

        {
            key: 'collected',
            header: 'Collected',
            align: 'right',
            sortable: true,
            sortKey: 'collected_amount',

            render: (value) => (
                <span className="whitespace-nowrap font-semibold text-text-primary">
                    {value}
                </span>
            ),
        },

        // --------------------------------
        // Status
        // --------------------------------

        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
        },

        // --------------------------------
        // Actions
        // --------------------------------

        {
            key: 'id',
            header: 'Actions',
            align: 'right',

            render: (_, row) => (
                <div className="flex items-center justify-end gap-4">
                    {/* View */}

                    <button
                        type="button"
                        onClick={() => setSelectedCampaign(row)}
                        className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                    >
                        View
                    </button>

                    {/* Review */}

                    {row.status === 'pending_review' && (
                        <button
                            type="button"
                            className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                        >
                            Review
                        </button>
                    )}

                    {/* Monitor */}

                    {(row.status === 'active' ||
                        row.status === 'in_progress') && (
                        <button
                            type="button"
                            className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                        >
                            Monitor
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // --------------------------------
    // Loading
    // --------------------------------

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Campaigns"
                    subtitle="Review, verify, and monitor fundraising campaigns across the Stand For People platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading campaigns...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the campaign list.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // --------------------------------
    // Error
    // --------------------------------

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Campaigns"
                    subtitle="Review, verify, and monitor fundraising campaigns across the Stand For People platform."
                />

                <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    // --------------------------------
    // Render
    // --------------------------------

    return (
        <div className="space-y-9">
            <PageHeader
                title="Campaigns"
                subtitle="Review, verify, and monitor fundraising campaigns across the Stand For People platform."
                action={
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        disabled={filteredCampaigns.length === 0}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={16} />
                        Export
                    </button>
                }
            />

            {/* --------------------------------
                Campaign Overview
            -------------------------------- */}

            <section>
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Platform overview
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            Campaign base
                        </h2>
                    </div>

                    <p className="hidden text-xs text-text-secondary sm:block">
                        Current campaign distribution
                    </p>
                </div>

                <CampaignStats
                    total={statistics.total}
                    pending={statistics.pending}
                    active={statistics.active}
                    completed={statistics.completed}
                    rejected={statistics.rejected}
                />
            </section>

            {/* --------------------------------
                Campaign Management
            -------------------------------- */}

            <section className="border-t border-border pt-8">
                <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        Administration
                    </p>

                    <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-text-primary">
                                Campaign management
                            </h2>
                        </div>

                        <p className="text-xs font-medium text-text-secondary">
                            {filteredCampaigns.length}{' '}
                            {filteredCampaigns.length === 1
                                ? 'campaign'
                                : 'campaigns'}{' '}
                            shown
                        </p>
                    </div>
                </div>

                {/* Status Tabs */}

                <CampaignCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />

                {/* Filters */}

                <div className="mt-4">
                    <CampaignFilters
                        searchTerm={searchTerm}
                        typeFilter={typeFilter}
                        categoryFilter={categoryFilter}
                        organizationFilter={organizationFilter}
                        statusFilter={statusFilter}
                        campaigns={campaigns}
                        onSearchChange={handleSearchChange}
                        onTypeChange={handleTypeChange}
                        onCategoryChange={handleCategoryFilterChange}
                        onOrganizationChange={handleOrganizationChange}
                        onStatusChange={handleStatusChange}
                    />
                </div>

                {/* Table */}

                <div className="mt-5">
                    <CampaignTable
                        columns={columns}
                        rows={rows}
                        onSort={handleSort}
                        getSortIcon={getSortIcon}
                    />
                </div>

                {/* Pagination */}

                {filteredCampaigns.length > 0 && (
                    <CampaignPagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={filteredCampaigns.length}
                        itemsPerPage={CAMPAIGNS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </section>

            {/* --------------------------------
                Campaign View Modal
            -------------------------------- */}

            {selectedCampaign && (
                <CampaignViewModal
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}
        </div>
    );
};

export default AdminCampaigns;
