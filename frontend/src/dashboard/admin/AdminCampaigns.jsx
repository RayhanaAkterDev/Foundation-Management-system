import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown, Download } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import CampaignStats from './campaigns/CampaignStats';
import CampaignCategoryTabs from './campaigns/CampaignCategoryTabs';
import CampaignFilters from './campaigns/CampaignFilters';
import CampaignTable from './campaigns/CampaignTable';
import CampaignPagination from './campaigns/CampaignPagination';

import CampaignViewModal from './campaigns/CampaignViewModal';
import CampaignVerificationModal from './campaigns/CampaignVerificationModal';
import CampaignStatusUpdateModal from './campaigns/CampaignStatusUpdateModal';
import CampaignEditModal from './campaigns/CampaignEditModal';

import {
    fetchCampaigns,
    verifyCampaign,
    updateCampaignStatus,
    updateCampaign,
} from './campaigns/campaignsAPI';

const CAMPAIGNS_PER_PAGE = 25;

/*
|--------------------------------------------------------------------------
| Campaign status transitions
|--------------------------------------------------------------------------
|
| pending_review → verified → active → completed
|                         ↘
|                          cancelled
|
*/

const CAMPAIGN_STATUS_TRANSITIONS = {
    pending_review: ['verified', 'rejected'],
    verified: ['active'],
    active: ['completed', 'cancelled'],
    completed: [],
    rejected: [],
    cancelled: [],
};

const EDITABLE_STATUSES = ['pending_review', 'verified', 'active'];

const STATUS_CHANGEABLE_STATUSES = ['verified', 'active'];

const AdminCampaigns = () => {
    // =========================================================
    // Campaign data
    // =========================================================

    const [campaigns, setCampaigns] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // =========================================================
    // View modal
    // =========================================================

    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // =========================================================
    // Verification modal
    // =========================================================

    const [verificationCampaign, setVerificationCampaign] = useState(null);

    const [verificationLoading, setVerificationLoading] = useState(false);

    const [verificationError, setVerificationError] = useState('');

    // =========================================================
    // Status update modal
    // =========================================================

    const [statusCampaign, setStatusCampaign] = useState(null);

    const [statusLoading, setStatusLoading] = useState(false);

    const [statusError, setStatusError] = useState('');

    // =========================================================
    // Edit modal
    // =========================================================

    const [editCampaign, setEditCampaign] = useState(null);

    const [editLoading, setEditLoading] = useState(false);

    const [editError, setEditError] = useState('');

    // =========================================================
    // Filters
    // =========================================================

    const [activeCategory, setActiveCategory] = useState('all');

    const [searchTerm, setSearchTerm] = useState('');

    const [typeFilter, setTypeFilter] = useState('all');

    const [categoryFilter, setCategoryFilter] = useState('all');

    const [organizationFilter, setOrganizationFilter] = useState('all');

    const [statusFilter, setStatusFilter] = useState('all');

    // =========================================================
    // Sorting
    // =========================================================

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    // =========================================================
    // Pagination
    // =========================================================

    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // Load campaigns
    // =========================================================

    const loadCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchCampaigns();

            setCampaigns(data?.campaigns || data?.data || []);
        } catch (err) {
            setError(
                err?.message || 'Something went wrong while loading campaigns.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    /*
     * Do not call loadCampaigns() directly inside useEffect.
     *
     * This avoids the React hooks/set-state-in-effect warning
     * that you were getting.
     */
    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await fetchCampaigns();

                if (cancelled) {
                    return;
                }

                setCampaigns(data?.campaigns || data?.data || []);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Something went wrong while loading campaigns.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, []);

    // =========================================================
    // Statistics
    // =========================================================

    const statistics = useMemo(() => {
        return {
            total: campaigns.length,

            pending: campaigns.filter(
                (campaign) => campaign.status === 'pending_review',
            ).length,

            verified: campaigns.filter(
                (campaign) => campaign.status === 'verified',
            ).length,

            active: campaigns.filter((campaign) => campaign.status === 'active')
                .length,

            completed: campaigns.filter(
                (campaign) => campaign.status === 'completed',
            ).length,

            rejected: campaigns.filter(
                (campaign) => campaign.status === 'rejected',
            ).length,

            cancelled: campaigns.filter(
                (campaign) => campaign.status === 'cancelled',
            ).length,
        };
    }, [campaigns]);

    // =========================================================
    // Status tabs
    // =========================================================

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
                key: 'verified',
                label: 'Verified',
                count: statistics.verified,
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
            {
                key: 'cancelled',
                label: 'Cancelled',
                count: statistics.cancelled,
            },
        ],
        [statistics],
    );

    // =========================================================
    // Filtering + sorting
    // =========================================================

    const filteredCampaigns = useMemo(() => {
        let result = [...campaigns];

        // -----------------------------------------------------
        // Status tab
        // -----------------------------------------------------

        if (activeCategory !== 'all') {
            result = result.filter(
                (campaign) => campaign.status === activeCategory,
            );
        }

        // -----------------------------------------------------
        // Campaign type
        // -----------------------------------------------------

        if (typeFilter !== 'all') {
            result = result.filter((campaign) => campaign.type === typeFilter);
        }

        // -----------------------------------------------------
        // Category
        // -----------------------------------------------------

        if (categoryFilter !== 'all') {
            result = result.filter(
                (campaign) => campaign.category === categoryFilter,
            );
        }

        // -----------------------------------------------------
        // Organization
        // -----------------------------------------------------

        if (organizationFilter !== 'all') {
            result = result.filter(
                (campaign) =>
                    String(campaign.organization_id) ===
                    String(organizationFilter),
            );
        }

        // -----------------------------------------------------
        // Status filter
        // -----------------------------------------------------

        if (statusFilter !== 'all') {
            result = result.filter(
                (campaign) => campaign.status === statusFilter,
            );
        }

        // -----------------------------------------------------
        // Search
        // -----------------------------------------------------

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((campaign) => {
                const title = String(campaign.title || '').toLowerCase();

                const description = String(
                    campaign.description || '',
                ).toLowerCase();

                const category = String(campaign.category || '').toLowerCase();

                const organizationName = String(
                    campaign.organization?.name || '',
                ).toLowerCase();

                const location = String(
                    campaign.location || campaign.district || '',
                ).toLowerCase();

                return (
                    title.includes(search) ||
                    description.includes(search) ||
                    category.includes(search) ||
                    organizationName.includes(search) ||
                    location.includes(search)
                );
            });
        }

        // -----------------------------------------------------
        // Sorting
        // -----------------------------------------------------

        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        result.sort((a, b) => {
            let first = a[sortConfig.key];
            let second = b[sortConfig.key];

            if (
                [
                    'created_at',
                    'start_date',
                    'end_date',
                    'proposal_date',
                ].includes(sortConfig.key)
            ) {
                first = first ? new Date(first).getTime() : 0;
                second = second ? new Date(second).getTime() : 0;
            }

            if (
                ['target_amount', 'collected_amount'].includes(sortConfig.key)
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

    // =========================================================
    // Pagination
    // =========================================================

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

    // =========================================================
    // Filter controls
    // =========================================================

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

    // =========================================================
    // Sorting
    // =========================================================

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

        return <ArrowDown size={14} strokeWidth={2} />;
    };

    // =========================================================
    // View
    // =========================================================

    const handleView = (campaign) => {
        setSelectedCampaign(campaign);
    };

    // =========================================================
    // Edit
    // =========================================================

    const handleEdit = (campaign) => {
        if (!EDITABLE_STATUSES.includes(campaign.status)) {
            return;
        }

        setEditError('');
        setEditCampaign(campaign);
    };

    const handleEditConfirm = async (payload) => {
        if (!editCampaign) {
            return;
        }

        try {
            setEditLoading(true);
            setEditError('');

            const data = await updateCampaign(editCampaign.id, payload);

            const updatedCampaign = data?.campaign ||
                data?.data || {
                    ...editCampaign,
                    ...payload,
                };

            setCampaigns((current) =>
                current.map((campaign) =>
                    campaign.id === editCampaign.id
                        ? updatedCampaign
                        : campaign,
                ),
            );

            setEditCampaign(null);
        } catch (err) {
            setEditError(err?.message || 'Campaign information update failed.');
        } finally {
            setEditLoading(false);
        }
    };

    // =========================================================
    // Verification
    // =========================================================

    const handleReview = (campaign) => {
        if (campaign.status !== 'pending_review') {
            return;
        }

        setVerificationError('');
        setVerificationCampaign(campaign);
    };

    const handleVerificationConfirm = async ({ status, verification_note }) => {
        if (!verificationCampaign) {
            return;
        }

        try {
            setVerificationLoading(true);
            setVerificationError('');

            await verifyCampaign(verificationCampaign.id, {
                status,
                verification_note,
            });

            setVerificationCampaign(null);

            await loadCampaigns();
        } catch (err) {
            setVerificationError(
                err?.message || 'Campaign verification failed.',
            );
        } finally {
            setVerificationLoading(false);
        }
    };

    // =========================================================
    // Change Status
    // =========================================================

    const handleStatusUpdate = (campaign) => {
        if (!STATUS_CHANGEABLE_STATUSES.includes(campaign.status)) {
            return;
        }

        setStatusError('');
        setStatusCampaign(campaign);
    };

    const handleStatusConfirm = async (newStatus) => {
        if (!statusCampaign) {
            return;
        }

        const allowedStatuses =
            CAMPAIGN_STATUS_TRANSITIONS[statusCampaign.status] || [];

        if (!allowedStatuses.includes(newStatus)) {
            setStatusError('This status transition is not allowed.');
            return;
        }

        try {
            setStatusLoading(true);
            setStatusError('');

            const data = await updateCampaignStatus(statusCampaign.id, {
                status: newStatus,
            });

            const updatedCampaign = data?.campaign ||
                data?.data || {
                    ...statusCampaign,
                    status: newStatus,
                };

            setCampaigns((current) =>
                current.map((campaign) =>
                    campaign.id === statusCampaign.id
                        ? updatedCampaign
                        : campaign,
                ),
            );

            setStatusCampaign(null);
        } catch (err) {
            setStatusError(err?.message || 'Campaign status update failed.');
        } finally {
            setStatusLoading(false);
        }
    };

    // =========================================================
    // CSV export
    // =========================================================

    const handleExportCSV = () => {
        if (filteredCampaigns.length === 0) {
            return;
        }

        const headers = [
            'Campaign',
            'Campaign Type',
            'Target',
            'Collected',
            'Start Date',
            'End Date',
            'Status',
        ];

        const csvRows = filteredCampaigns.map((campaign) => [
            campaign.title || '',
            campaign.type || '',
            campaign.target_amount ?? '',
            campaign.collected_amount ?? 0,

            campaign.start_date
                ? new Date(campaign.start_date).toLocaleDateString()
                : '',

            campaign.end_date
                ? new Date(campaign.end_date).toLocaleDateString()
                : '',

            campaign.status || '',
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

    // =========================================================
    // Loading
    // =========================================================

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Campaigns"
                    subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
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

    // =========================================================
    // Error
    // =========================================================

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Campaigns"
                    subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
                />

                <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    // =========================================================
    // Prepare table rows
    // =========================================================

    const rows = paginatedCampaigns.map((campaign, index) => ({
        ...campaign,

        serialNumber: (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE + index + 1,

        campaignType:
            campaign.type === 'global_situation'
                ? 'Global Situation'
                : campaign.type === 'organization_proposed'
                  ? 'Organization Proposed'
                  : campaign.type === 'local_case'
                    ? 'Local Case'
                    : campaign.type || '—',

        target:
            campaign.target_amount !== null &&
            campaign.target_amount !== undefined
                ? `৳${Number(campaign.target_amount).toLocaleString()}`
                : '—',

        collected: `৳${Number(
            campaign.collected_amount || 0,
        ).toLocaleString()}`,

        formattedStartDate: campaign.start_date
            ? new Date(campaign.start_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              })
            : '—',

        formattedEndDate: campaign.end_date
            ? new Date(campaign.end_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              })
            : '—',

        locationName:
            campaign.location || campaign.district || 'Location not specified',
    }));

    // =========================================================
    // Table columns
    // =========================================================

    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '60px',
        },

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

                        {row.locationName !== 'Location not specified' && (
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

        {
            key: 'campaignType',
            header: 'Campaign Type',
            sortable: true,
            sortKey: 'type',

            render: (value) => (
                <span className="text-sm font-medium text-text-primary">
                    {value}
                </span>
            ),
        },

        {
            key: 'target',
            header: 'Target',
            align: 'right',
            sortable: true,
            sortKey: 'target_amount',

            render: (value) => (
                <span className="whitespace-nowrap font-semibold text-text-primary">
                    {value}
                </span>
            ),
        },

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

        {
            key: 'formattedStartDate',
            header: 'Start Date',
            sortable: true,
            sortKey: 'start_date',

            render: (value) => (
                <span className="whitespace-nowrap text-sm font-medium text-text-primary">
                    {value}
                </span>
            ),
        },

        {
            key: 'formattedEndDate',
            header: 'End Date',
            sortable: true,
            sortKey: 'end_date',

            render: (value) => (
                <span className="whitespace-nowrap text-sm font-medium text-text-primary">
                    {value}
                </span>
            ),
        },

        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
        },

        // =====================================================
        // Actions
        // =====================================================

        {
            key: 'actions',
            header: 'Actions',
            align: 'right',

            render: (_, row) => {
                const canEdit = EDITABLE_STATUSES.includes(row.status);

                const canVerify = row.status === 'pending_review';

                const canChangeStatus = STATUS_CHANGEABLE_STATUSES.includes(
                    row.status,
                );

                return (
                    <div className="flex items-center justify-end gap-4">
                        {/* VIEW - always available */}
                        <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                        >
                            View
                        </button>

                        {/* EDIT - only non-terminal campaigns */}
                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                            >
                                Edit
                            </button>
                        )}

                        {/* VERIFY - pending review only */}
                        {canVerify && (
                            <button
                                type="button"
                                onClick={() => handleReview(row)}
                                className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                            >
                                Verify
                            </button>
                        )}

                        {/* CHANGE STATUS - verified/active only */}
                        {canChangeStatus && (
                            <button
                                type="button"
                                onClick={() => handleStatusUpdate(row)}
                                className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                            >
                                Change Status
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    // =========================================================
    // Render
    // =========================================================

    return (
        <div className="space-y-9">
            <PageHeader
                title="Campaigns"
                subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
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

            {/* =================================================
                Statistics
            ================================================= */}

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

            {/* =================================================
                Campaign management
            ================================================= */}

            <section className="border-t border-border pt-8">
                <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        Administration
                    </p>

                    <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <h2 className="text-lg font-bold tracking-tight text-text-primary">
                            Campaign management
                        </h2>

                        <p className="text-xs font-medium text-text-secondary">
                            {filteredCampaigns.length}{' '}
                            {filteredCampaigns.length === 1
                                ? 'campaign'
                                : 'campaigns'}{' '}
                            shown
                        </p>
                    </div>
                </div>

                <CampaignCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />

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

                <div className="mt-5">
                    <CampaignTable
                        columns={columns}
                        rows={rows}
                        onSort={handleSort}
                        getSortIcon={getSortIcon}
                        resultCount={filteredCampaigns.length}
                    />
                </div>

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

            {/* =================================================
                View Modal
            ================================================= */}

            {selectedCampaign && (
                <CampaignViewModal
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}

            {/* =================================================
                Verification Modal
            ================================================= */}

            {verificationCampaign && (
                <CampaignVerificationModal
                    campaign={verificationCampaign}
                    loading={verificationLoading}
                    error={verificationError}
                    onClose={() => {
                        if (!verificationLoading) {
                            setVerificationCampaign(null);

                            setVerificationError('');
                        }
                    }}
                    onConfirm={handleVerificationConfirm}
                />
            )}

            {/* =================================================
                Status Update Modal
            ================================================= */}

            {statusCampaign && (
                <CampaignStatusUpdateModal
                    campaign={statusCampaign}
                    allowedStatuses={
                        CAMPAIGN_STATUS_TRANSITIONS[statusCampaign.status] || []
                    }
                    loading={statusLoading}
                    error={statusError}
                    onClose={() => {
                        if (!statusLoading) {
                            setStatusCampaign(null);
                            setStatusError('');
                        }
                    }}
                    onConfirm={handleStatusConfirm}
                />
            )}

            {/* =================================================
                Edit Modal
            ================================================= */}

            {editCampaign && (
                <CampaignEditModal
                    campaign={editCampaign}
                    loading={editLoading}
                    error={editError}
                    onClose={() => {
                        if (!editLoading) {
                            setEditCampaign(null);
                            setEditError('');
                        }
                    }}
                    onConfirm={handleEditConfirm}
                />
            )}
        </div>
    );
};

export default AdminCampaigns;
