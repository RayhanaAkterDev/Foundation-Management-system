import React, { useEffect, useMemo, useState } from 'react';
import {
    ChevronsUpDown,
    ArrowUp,
    ArrowDown,
    Download,
    Plus,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { getMyHelpRequests, deleteHelpRequest } from './api/helpRequestAPI';

import Stats from './components/HelpRequestStats';
import Filters from './components/HelpRequestFilters';
import Table from './components/HelpRequestTable';
import Pagination from './components/HelpRequestPagination';

import HelpRequestModals from './modals/HelpRequestModals';

import { HELP_REQUESTS_PER_PAGE } from './constants/helpRequestConstants';

import {
    normalizeHelpRequest,
    normalizeHelpRequests,
    getStatusLabel,
    getUrgencyLabel,
    getAssignmentInfo,
} from './utils/helpRequestUtils';

const MyHelpRequests = () => {
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [successToast, setSuccessToast] = useState({
        show: false,
        message: '',
    });

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const [deleteRequestItem, setDeleteRequestItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    /*
     * --------------------------------------------------------------------------
     * Success toast
     * --------------------------------------------------------------------------
     */

    const showSuccessToast = (message) => {
        setSuccessToast({
            show: true,
            message,
        });
    };

    useEffect(() => {
        if (!successToast.show) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setSuccessToast({
                show: false,
                message: '',
            });
        }, 4000);

        return () => clearTimeout(timer);
    }, [successToast.show]);

    /*
     * --------------------------------------------------------------------------
     * Statistics
     * --------------------------------------------------------------------------
     *
     * HelpRequest.status:
     *
     * pending
     * verified
     * rejected
     * completed
     *
     * Assignment.status:
     *
     * pending
     * accepted
     * rejected
     * in_progress
     * completed
     *
     * "Assigned" is calculated from the organization assignment and is NOT
     * treated as a HelpRequest.status.
     * --------------------------------------------------------------------------
     */

    const statistics = useMemo(() => {
        const hasOrganizationAssignment = (request) => {
            if (!request || request.status !== 'verified') {
                return false;
            }

            const assignmentInfo = getAssignmentInfo(request);
            const currentAssignment = assignmentInfo?.currentAssignment;

            if (!currentAssignment) {
                return false;
            }

            if (
                String(currentAssignment.status || '').toLowerCase() ===
                'rejected'
            ) {
                return false;
            }

            return Boolean(
                currentAssignment.organization_id ||
                currentAssignment.organization?.id,
            );
        };

        const stats = {
            total: helpRequests.length,
            pending: 0,
            verified: 0,
            assigned: 0,
            completed: 0,
            rejected: 0,
        };

        helpRequests.forEach((request) => {
            switch (request.status) {
                case 'pending':
                    stats.pending += 1;
                    break;

                case 'verified':
                    stats.verified += 1;

                    if (hasOrganizationAssignment(request)) {
                        stats.assigned += 1;
                    }

                    break;

                case 'completed':
                    stats.completed += 1;
                    break;

                case 'rejected':
                    stats.rejected += 1;
                    break;

                default:
                    break;
            }
        });

        return stats;
    }, [helpRequests]);

    /*
     * --------------------------------------------------------------------------
     * Organization drawer
     * --------------------------------------------------------------------------
     */

    const handleViewOrganization = (assignmentInfo, request) => {
        const organization = assignmentInfo?.currentAssignment?.organization;

        if (!organization) {
            return;
        }

        setSelectedOrganization({
            organization,
            currentAssignment: assignmentInfo.currentAssignment,
            assignments: Array.isArray(request?.assignments)
                ? request.assignments
                : [],
        });
    };

    const handleCloseOrganization = () => {
        setSelectedOrganization(null);
    };

    /*
     * --------------------------------------------------------------------------
     * Load help requests
     * --------------------------------------------------------------------------
     */

    useEffect(() => {
        let cancelled = false;

        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getMyHelpRequests();

                if (cancelled) {
                    return;
                }

                const fetchedRequests =
                    data?.help_requests ||
                    data?.helpRequests ||
                    data?.data ||
                    [];

                setHelpRequests(normalizeHelpRequests(fetchedRequests));
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Something went wrong while loading your help requests.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
     * --------------------------------------------------------------------------
     * Create request
     * --------------------------------------------------------------------------
     */

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleRequestCreated = (createdRequest) => {
        if (createdRequest) {
            const formattedRequest = normalizeHelpRequest(createdRequest);

            setHelpRequests((previousRequests) => [
                formattedRequest,
                ...previousRequests,
            ]);

            setCurrentPage(1);
        }

        setShowModal(false);

        showSuccessToast('Your help request was submitted successfully.');
    };

    /*
     * --------------------------------------------------------------------------
     * View request
     * --------------------------------------------------------------------------
     */

    const handleView = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseDetails = () => {
        setSelectedRequest(null);
    };

    /*
     * --------------------------------------------------------------------------
     * Edit request
     * --------------------------------------------------------------------------
     */

    const handleEdit = (request) => {
        if (!request || request.status !== 'pending') {
            return;
        }

        setEditingRequest(request);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        if (deleteLoading) {
            return;
        }

        setShowEditModal(false);
        setEditingRequest(null);
    };

    const handleRequestUpdated = (updatedRequest) => {
        if (!updatedRequest) {
            handleCloseEditModal();
            return;
        }

        const formattedRequest = normalizeHelpRequest(updatedRequest);

        setHelpRequests((previousRequests) =>
            previousRequests.map((request) =>
                request.id === formattedRequest.id ? formattedRequest : request,
            ),
        );

        setShowEditModal(false);
        setEditingRequest(null);

        setSelectedRequest((currentRequest) =>
            currentRequest?.id === formattedRequest.id
                ? formattedRequest
                : currentRequest,
        );

        showSuccessToast('Your help request was updated successfully.');
    };

    /*
     * --------------------------------------------------------------------------
     * Delete request
     * --------------------------------------------------------------------------
     */

    const handleDelete = (request) => {
        if (!request || request.status !== 'pending' || deleteLoading) {
            return;
        }

        setDeleteError('');
        setDeleteRequestItem(request);
    };

    const handleCloseDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setDeleteRequestItem(null);
        setDeleteError('');
    };

    const handleDeleteConfirm = async () => {
        if (!deleteRequestItem || deleteLoading) {
            return;
        }

        try {
            setDeleteLoading(true);
            setDeleteError('');

            await deleteHelpRequest(deleteRequestItem.id);

            const deletedId = deleteRequestItem.id;

            setHelpRequests((currentRequests) =>
                currentRequests.filter((request) => request.id !== deletedId),
            );

            setSelectedRequest((currentRequest) =>
                currentRequest?.id === deletedId ? null : currentRequest,
            );

            if (editingRequest?.id === deletedId) {
                setShowEditModal(false);
                setEditingRequest(null);
            }

            setDeleteRequestItem(null);

            showSuccessToast('Your help request was deleted successfully.');
        } catch (err) {
            setDeleteError(err?.message || 'Unable to delete help request.');
        } finally {
            setDeleteLoading(false);
        }
    };

    /*
     * --------------------------------------------------------------------------
     * Category tabs
     * --------------------------------------------------------------------------
     */

    const categoryTabs = useMemo(
        () => [
            {
                key: 'all',
                label: 'All Requests',
                count: statistics.total,
            },
            {
                key: 'pending',
                label: 'Pending',
                count: statistics.pending,
            },
            {
                key: 'verified',
                label: 'Verified',
                count: statistics.verified,
            },
            {
                key: 'assigned',
                label: 'Assigned',
                count: statistics.assigned,
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

    /*
     * --------------------------------------------------------------------------
     * Filtering
     * --------------------------------------------------------------------------
     */

    const filteredHelpRequests = useMemo(() => {
        const hasOrganizationAssignment = (request) => {
            if (!request || request.status !== 'verified') {
                return false;
            }

            const assignmentInfo = getAssignmentInfo(request);
            const currentAssignment = assignmentInfo?.currentAssignment;

            if (!currentAssignment) {
                return false;
            }

            if (
                String(currentAssignment.status || '').toLowerCase() ===
                'rejected'
            ) {
                return false;
            }

            return Boolean(
                currentAssignment.organization_id ||
                currentAssignment.organization?.id,
            );
        };

        return helpRequests.filter((request) => {
            /*
             * Category tab
             *
             * "assigned" is not a HelpRequest.status.
             * It is derived from the current organization assignment.
             */
            if (activeCategory === 'assigned') {
                if (!hasOrganizationAssignment(request)) {
                    return false;
                }
            } else if (
                activeCategory !== 'all' &&
                request.status !== activeCategory
            ) {
                return false;
            }

            /*
             * Category filter
             */
            if (
                categoryFilter !== 'all' &&
                request.category !== categoryFilter
            ) {
                return false;
            }

            /*
             * Priority / urgency filter
             *
             * Actual backend values:
             * normal
             * high
             * critical
             */
            if (priorityFilter !== 'all') {
                const requestPriority = String(request?.urgency ?? '')
                    .trim()
                    .toLowerCase();

                const selectedPriority = String(priorityFilter)
                    .trim()
                    .toLowerCase();

                if (requestPriority !== selectedPriority) {
                    return false;
                }
            }

            /*
             * Status filter
             *
             * Actual HelpRequest.status values:
             * pending
             * verified
             * rejected
             *
             * Assigned is intentionally NOT handled here because
             * Assigned is an assignment-derived category/filter.
             */
            if (statusFilter !== 'all') {
                const requestStatus = String(request?.status ?? '')
                    .trim()
                    .toLowerCase();

                const selectedStatus = String(statusFilter)
                    .trim()
                    .toLowerCase();

                if (requestStatus !== selectedStatus) {
                    return false;
                }
            }

            /*
             * Search
             */
            const normalizedSearch = searchTerm.trim().toLowerCase();

            if (normalizedSearch) {
                const searchableText = [
                    request?.title,
                    request?.description,
                    request?.category,
                    request?.district,
                    request?.address,
                    request?.urgency,
                    request?.status,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                if (!searchableText.includes(normalizedSearch)) {
                    return false;
                }
            }

            return true;
        });
    }, [
        helpRequests,
        activeCategory,
        categoryFilter,
        priorityFilter,
        statusFilter,
        searchTerm,
    ]);

    const sortedHelpRequests = useMemo(() => {
        const result = [...filteredHelpRequests];
        if (!sortConfig.key || !sortConfig.direction) return result;
        result.sort((a, b) => {
            let first = a[sortConfig.key];
            let second = b[sortConfig.key];
            if (sortConfig.key === 'created_at') {
                first = first ? new Date(first).getTime() : 0;
                second = second ? new Date(second).getTime() : 0;
            }
            if (typeof first === 'string') first = first.toLowerCase();
            if (typeof second === 'string') second = second.toLowerCase();
            first ??= '';
            second ??= '';
            if (first === second) return 0;
            return (
                (first < second ? -1 : 1) *
                (sortConfig.direction === 'asc' ? 1 : -1)
            );
        });
        return result;
    }, [filteredHelpRequests, sortConfig]);

    /*
     * --------------------------------------------------------------------------
     * Pagination
     * --------------------------------------------------------------------------
     */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredHelpRequests.length / HELP_REQUESTS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedHelpRequests = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * HELP_REQUESTS_PER_PAGE;

        return sortedHelpRequests.slice(
            startIndex,
            startIndex + HELP_REQUESTS_PER_PAGE,
        );
    }, [sortedHelpRequests, safeCurrentPage]);

    /*
     * --------------------------------------------------------------------------
     * Filter handlers
     * --------------------------------------------------------------------------
     */

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
        setCurrentPage(1);
    };

    const handlePriorityChange = (event) => {
        setPriorityFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveCategory('all');
        setCategoryFilter('all');
        setPriorityFilter('all');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    /*
     * --------------------------------------------------------------------------
     * Sorting
     * --------------------------------------------------------------------------
     */

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

        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} strokeWidth={2} />
        ) : (
            <ArrowDown size={14} strokeWidth={2} />
        );
    };

    /*
     * --------------------------------------------------------------------------
     * CSV export
     * --------------------------------------------------------------------------
     */

    const handleExportCSV = () => {
        if (filteredHelpRequests.length === 0) {
            return;
        }

        const headers = [
            'Help Request',
            'Category',
            'District',
            'Urgency',
            'Status',
            'Created Date',
        ];

        const csvRows = filteredHelpRequests.map((request) => [
            request.title || '',
            request.category || '',
            request.district || '',
            request.urgency || '',
            getStatusLabel(request.status) || '',
            request.created_at
                ? new Date(request.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                  })
                : '',
        ]);

        const escapeCSVValue = (value) =>
            `"${String(value ?? '').replace(/"/g, '""')}"`;

        const csvContent = [
            headers.map(escapeCSVValue).join(','),
            ...csvRows.map((row) => row.map(escapeCSVValue).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'stand-for-people-my-help-requests.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const header = (
        <PageHeader
            title="My Help Requests"
            subtitle="Follow the progress of your requests and manage pending submissions."
            action={
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        disabled={!filteredHelpRequests.length}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-[12px] font-medium text-[#B8C2CF] hover:bg-[#1C232D] disabled:opacity-40"
                    >
                        <Download size={15} />
                        Export
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenModal}
                        className="inline-flex h-10 items-center gap-2 border border-[#46566A] bg-[#263343] px-4 text-[12px] font-medium text-[#EEF1F5] hover:bg-[#304155]"
                    >
                        <Plus size={15} />
                        New Request
                    </button>
                </div>
            }
        />
    );

    if (loading || error) {
        return (
            <div className="space-y-10 lg:space-y-12">
                {header}
                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading help requests..."
                        description="Retrieving your submitted requests."
                    />
                ) : (
                    <LoadingError
                        title="Unable to load help requests"
                        message={error}
                    />
                )}
            </div>
        );
    }

    const rows = paginatedHelpRequests.map((request, index) => ({
        ...request,
        serialNumber:
            (safeCurrentPage - 1) * HELP_REQUESTS_PER_PAGE + index + 1,
        statusLabel: getStatusLabel(request.status),
        urgencyLabel: getUrgencyLabel(request.urgency),
        assignmentInfo: getAssignmentInfo(request),
        formattedCreatedDate: request.created_at
            ? new Date(request.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              })
            : '—',
        locationName:
            request.district || request.address || 'Location not specified',
    }));

    const filterProps = {
        categoryTabs,
        activeCategory,
        onCategoryChange: handleCategoryChange,
        categoryFilter,
        priorityFilter,
        statusFilter,
        helpRequests,
        onCategoryFilterChange: handleCategoryFilterChange,
        onPriorityChange: handlePriorityChange,
        onStatusChange: handleStatusChange,
        onClearFilters: clearFilters,
    };

    return (
        <>
            <div className="space-y-10 lg:space-y-12">
                {header}
                <Stats {...statistics} />
                <section className="pt-2 lg:pt-3">
                    <div className="mb-5">
                        <h2 className="font-sans! text-[20px]! font-semibold! tracking-[-0.02em] !text-[#EEF1F5]">
                            My Help Request Directory
                        </h2>
                        <p className="mt-2 text-[12px] leading-5 text-[#8792A1]">
                            View and manage requests you have submitted.
                        </p>
                    </div>
                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-10 w-full items-center justify-between border border-[#29323E] bg-[#0E1219] px-3.5 text-[12px] text-[#AEB7C3]"
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={15} />
                                Filters
                            </span>
                            <span className="text-[#697586]">
                                Refine requests
                            </span>
                        </button>
                    </div>
                    {mobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 xl:hidden">
                            <button
                                type="button"
                                aria-label="Close filters"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="absolute inset-0 bg-black/70"
                            />
                            <div className="absolute inset-y-0 right-0 w-[min(340px,90vw)] overflow-y-auto border-l border-[#29323E] bg-[#0E1219]">
                                <div className="flex items-center justify-between border-b border-[#29323E] px-4 py-3 text-[13px] text-[#EEF1F5]">
                                    Request filters
                                    <button
                                        type="button"
                                        aria-label="Close filters"
                                        onClick={() =>
                                            setMobileFiltersOpen(false)
                                        }
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <Filters {...filterProps} />
                                <div className="p-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileFiltersOpen(false)
                                        }
                                        className="h-10 w-full bg-[#263343] text-[12px] text-[#EEF1F5]"
                                    >
                                        Show results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="min-w-0 overflow-hidden border border-[#252D38] bg-[#0E1219]">
                            <div className="border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="relative min-w-0 flex-1">
                                        <Search
                                            size={15}
                                            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#697586]"
                                        />
                                        <input
                                            type="search"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Search by request, category or location"
                                            className="h-10 w-full border border-[#35404E] bg-[#0E1219] pr-4 pl-9 text-[12px] text-[#DCE3EC] outline-none placeholder:text-[#697586] focus:border-[#64748B]"
                                        />
                                    </div>
                                    <span className="shrink-0 text-[11px] text-[#AAB3BF]">
                                        {filteredHelpRequests.length}{' '}
                                        {filteredHelpRequests.length === 1
                                            ? 'result'
                                            : 'results'}
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0 overflow-x-auto">
                                <Table
                                    rows={rows}
                                    onSort={handleSort}
                                    getSortIcon={getSortIcon}
                                    resultCount={filteredHelpRequests.length}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onViewOrganization={handleViewOrganization}
                                    deleteLoading={deleteLoading}
                                />
                            </div>
                            {filteredHelpRequests.length > 0 && (
                                <div className="border-t border-[#252D38] bg-[#1A222D]">
                                    <Pagination
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredHelpRequests.length}
                                        itemsPerPage={HELP_REQUESTS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block">
                            <Filters {...filterProps} />
                        </div>
                    </div>
                </section>
            </div>
            <SuccessDialog
                open={successToast.show}
                title="Action completed"
                message={successToast.message}
                onClose={() => setSuccessToast({ show: false, message: '' })}
            />
            <HelpRequestModals
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                handleRequestCreated={handleRequestCreated}
                selectedRequest={selectedRequest}
                handleCloseDetails={handleCloseDetails}
                editingRequest={editingRequest}
                showEditModal={showEditModal}
                handleCloseEditModal={handleCloseEditModal}
                handleRequestUpdated={handleRequestUpdated}
                deleteRequestItem={deleteRequestItem}
                deleteLoading={deleteLoading}
                deleteError={deleteError}
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleDeleteConfirm={handleDeleteConfirm}
                selectedOrganization={selectedOrganization}
                handleCloseOrganization={handleCloseOrganization}
            />
        </>
    );
};

export default MyHelpRequests;
