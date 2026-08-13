import React, { useEffect, useMemo, useState } from 'react';
import { Download, ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import HelpRequestViewModal from './helpRequests/HelpRequestViewModal';
import HelpRequestVerificationModal from './helpRequests/HelpRequestVerificationModal';
import HelpRequestAssignmentModal from './helpRequests/HelpRequestAssignmentModal';
import HelpRequestStats from './helpRequests/HelpRequestStats';
import HelpRequestCategoryTabs from './helpRequests/HelpRequestCategoryTabs';
import HelpRequestFilters from './helpRequests/HelpRequestFilters';
import HelpRequestTable from './helpRequests/HelpRequestTable';
import HelpRequestPagination from './helpRequests/HelpRequestPagination';
import HelpRequestSuccessToast from './helpRequests/HelpRequestSuccessToast';

const HELP_REQUESTS_PER_PAGE = 25;

const AdminHelpRequests = () => {
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --------------------------------
    // Filters / Search / Sorting
    // --------------------------------

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

    // --------------------------------
    // View request
    // --------------------------------

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

    // --------------------------------
    // Review / Verification
    // --------------------------------

    const [selectedReviewRequest, setSelectedReviewRequest] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // --------------------------------
    // Assignment
    // --------------------------------

    const [selectedAssignmentRequest, setSelectedAssignmentRequest] =
        useState(null);

    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [assignmentError, setAssignmentError] = useState('');

    // --------------------------------
    // Success toast
    // --------------------------------

    const [toast, setToast] = useState({
        show: false,
        message: '',
    });

    const showSuccessToast = (message) => {
        setToast({
            show: true,
            message,
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: '',
            });
        }, 3000);
    };

    // --------------------------------
    // Authentication
    // --------------------------------

    const getAuthToken = () => {
        return (
            localStorage.getItem('auth_token') ||
            sessionStorage.getItem('auth_token')
        );
    };

    // --------------------------------
    // Load help requests
    // --------------------------------

    useEffect(() => {
        let cancelled = false;

        const loadRequests = async () => {
            try {
                setLoading(true);
                setError('');

                const token = getAuthToken();

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/help-requests',
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load help requests.',
                    );
                }

                if (!cancelled) {
                    setHelpRequests(data.helpRequests || []);
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                            'Something went wrong while loading help requests.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadRequests();

        return () => {
            cancelled = true;
        };
    }, []);

    // --------------------------------
    // Refresh help requests
    // --------------------------------

    const loadHelpRequests = async () => {
        try {
            setError('');

            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                'http://127.0.0.1:8000/api/admin/help-requests',
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to load help requests.',
                );
            }

            setHelpRequests(data.helpRequests || []);
        } catch (err) {
            setError(
                err.message ||
                    'Something went wrong while loading help requests.',
            );
        }
    };

    // --------------------------------
    // View help request
    // --------------------------------

    const handleViewRequest = async (requestId) => {
        setViewLoading(true);
        setViewError('');
        setSelectedRequest(null);

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/help-requests/${requestId}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load help request.');
            }

            setSelectedRequest(data.help_request);
        } catch (err) {
            setViewError(err.message || 'Unable to load help request.');
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedRequest(null);
        setViewError('');
    };

    // --------------------------------
    // Review help request
    // --------------------------------

    const handleReviewRequest = (request) => {
        setReviewError('');
        setSelectedReviewRequest(request);
    };

    const closeReviewModal = () => {
        if (reviewLoading) {
            return;
        }

        setSelectedReviewRequest(null);
        setReviewError('');
    };

    const handleVerificationChange = async (status) => {
        if (!selectedReviewRequest) {
            return;
        }

        setReviewLoading(true);
        setReviewError('');

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/help-requests/${selectedReviewRequest.id}/verification`,
                {
                    method: 'PATCH',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to update help request status.',
                );
            }

            setSelectedReviewRequest(null);

            await loadHelpRequests();

            showSuccessToast(
                status === 'verified'
                    ? 'Help request verified successfully.'
                    : 'Help request rejected successfully.',
            );
        } catch (err) {
            setReviewError(
                err.message || 'Unable to update help request status.',
            );
        } finally {
            setReviewLoading(false);
        }
    };

    // --------------------------------
    // Assignment
    // --------------------------------

    const handleAssignRequest = (request) => {
        setAssignmentError('');
        setSelectedAssignmentRequest(request);
    };

    const closeAssignmentModal = () => {
        if (assignmentLoading) {
            return;
        }

        setSelectedAssignmentRequest(null);
        setAssignmentError('');
    };

    const handleAssignment = async (assignmentData) => {
        if (!selectedAssignmentRequest) {
            return;
        }

        setAssignmentLoading(true);
        setAssignmentError('');

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/help-requests/${selectedAssignmentRequest.id}/assignment`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(assignmentData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                const assignmentErrorResponse = new Error(
                    data.message || 'Unable to assign help request.',
                );

                assignmentErrorResponse.status = response.status;
                assignmentErrorResponse.errors = data.errors;

                throw assignmentErrorResponse;
            }

            setSelectedAssignmentRequest(null);

            await loadHelpRequests();

            showSuccessToast('Help request assigned successfully.');
        } catch (err) {
            setAssignmentError(err.message || 'Unable to assign help request.');
        } finally {
            setAssignmentLoading(false);
        }
    };

    // --------------------------------
    // Statistics
    // --------------------------------

    const statistics = useMemo(() => {
        return {
            total: helpRequests.length,

            pending: helpRequests.filter(
                (request) => request.status === 'pending',
            ).length,

            verified: helpRequests.filter(
                (request) => request.status === 'verified',
            ).length,

            assigned: helpRequests.filter(
                (request) => request.status === 'assigned',
            ).length,

            completed: helpRequests.filter(
                (request) => request.status === 'completed',
            ).length,

            rejected: helpRequests.filter(
                (request) => request.status === 'rejected',
            ).length,
        };
    }, [helpRequests]);

    // --------------------------------
    // Category tabs
    // --------------------------------

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

    // --------------------------------
    // Filtering + sorting
    // --------------------------------

    const filteredHelpRequests = useMemo(() => {
        let result = [...helpRequests];

        if (activeCategory !== 'all') {
            result = result.filter(
                (request) => request.status === activeCategory,
            );
        }

        if (categoryFilter !== 'all') {
            result = result.filter(
                (request) => request.category === categoryFilter,
            );
        }

        if (priorityFilter !== 'all') {
            result = result.filter(
                (request) => request.priority === priorityFilter,
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(
                (request) => request.status === statusFilter,
            );
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((request) => {
                const requesterName =
                    request.user?.name || request.requester?.name || '';

                const requesterEmail =
                    request.user?.email || request.requester?.email || '';

                return (
                    request.title?.toLowerCase().includes(search) ||
                    request.description?.toLowerCase().includes(search) ||
                    request.category?.toLowerCase().includes(search) ||
                    requesterName.toLowerCase().includes(search) ||
                    requesterEmail.toLowerCase().includes(search)
                );
            });
        }

        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        result.sort((a, b) => {
            let first = a[sortConfig.key];
            let second = b[sortConfig.key];

            if (sortConfig.key === 'created_at') {
                first = new Date(first).getTime();
                second = new Date(second).getTime();
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
        helpRequests,
        activeCategory,
        categoryFilter,
        priorityFilter,
        statusFilter,
        searchTerm,
        sortConfig,
    ]);

    // --------------------------------
    // Pagination
    // --------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredHelpRequests.length / HELP_REQUESTS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedHelpRequests = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * HELP_REQUESTS_PER_PAGE;

        return filteredHelpRequests.slice(
            startIndex,
            startIndex + HELP_REQUESTS_PER_PAGE,
        );
    }, [filteredHelpRequests, safeCurrentPage]);

    // --------------------------------
    // Controls
    // --------------------------------

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
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

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

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
        if (filteredHelpRequests.length === 0) {
            return;
        }

        const headers = [
            'Requester',
            'Request',
            'Category',
            'Priority',
            'Status',
            'Submitted',
        ];

        const csvRows = filteredHelpRequests.map((request) => [
            request.user?.name || request.requester?.name || '',

            request.title || '',
            request.category || '',
            request.priority || '',
            request.status || '',

            request.created_at
                ? new Date(request.created_at).toLocaleDateString()
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
        link.download = 'stand-for-people-help-requests.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessToast('Help requests exported successfully.');
    };

    // --------------------------------
    // Table rows
    // --------------------------------

    const rows = paginatedHelpRequests.map((request, index) => ({
        ...request,

        requesterName: request.user?.name || request.requester?.name || '—',

        requesterEmail: request.user?.email || request.requester?.email || '—',

        submittedDate: request.created_at
            ? new Date(request.created_at).toLocaleDateString()
            : '—',

        serialNumber:
            (safeCurrentPage - 1) * HELP_REQUESTS_PER_PAGE + index + 1,
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

        {
            key: 'title',
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',
        },

        {
            key: 'requesterName',
            header: 'Requester',
        },

        {
            key: 'category',
            header: 'Category',
            sortable: true,
            sortKey: 'category',
        },

        {
            key: 'priority',
            header: 'Priority',
            sortable: true,
            sortKey: 'priority',
        },

        {
            key: 'submittedDate',
            header: 'Submitted',
            sortable: true,
            sortKey: 'created_at',
        },

        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
        },

        {
            key: 'id',
            header: 'Actions',
            align: 'right',

            render: (_, row) => (
                <div className="flex items-center justify-end gap-4">
                    {row.status === 'pending' && (
                        <button
                            type="button"
                            onClick={() => handleReviewRequest(row)}
                            className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                        >
                            Review
                        </button>
                    )}

                    {row.status === 'verified' && (
                        <button
                            type="button"
                            onClick={() => handleAssignRequest(row)}
                            className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                        >
                            Assign
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => handleViewRequest(row.id)}
                        className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                    >
                        View
                    </button>
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
                    title="Help Requests"
                    subtitle="Review, verify, and coordinate help requests submitted through the Stand For People platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading help requests...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the request list.
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
                    title="Help Requests"
                    subtitle="Review, verify, and coordinate help requests submitted through the Stand For People platform."
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
        <>
            <div className="space-y-9">
                <PageHeader
                    title="Help Requests"
                    subtitle="Review, verify, and coordinate help requests submitted through the Stand For People platform."
                    action={
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            disabled={filteredHelpRequests.length === 0}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    }
                />

                {/* Help Request Overview */}

                <section>
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                Platform overview
                            </p>

                            <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                                Help request base
                            </h2>
                        </div>

                        <p className="hidden text-xs text-text-secondary sm:block">
                            Current request distribution
                        </p>
                    </div>

                    <HelpRequestStats
                        total={statistics.total}
                        pending={statistics.pending}
                        verified={statistics.verified}
                        assigned={statistics.assigned}
                        completed={statistics.completed}
                        rejected={statistics.rejected}
                    />
                </section>

                {/* Help Request Management */}

                <section className="border-t border-border pt-8">
                    <div className="mb-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Administration
                        </p>

                        <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-text-primary">
                                    Help request management
                                </h2>
                            </div>

                            <p className="text-xs font-medium text-text-secondary">
                                {filteredHelpRequests.length}{' '}
                                {filteredHelpRequests.length === 1
                                    ? 'request'
                                    : 'requests'}{' '}
                                shown
                            </p>
                        </div>
                    </div>

                    {/* Categories */}

                    <HelpRequestCategoryTabs
                        tabs={categoryTabs}
                        activeCategory={activeCategory}
                        onChange={handleCategoryChange}
                    />

                    {/* Filters */}

                    <div className="mt-4">
                        <HelpRequestFilters
                            searchTerm={searchTerm}
                            categoryFilter={categoryFilter}
                            priorityFilter={priorityFilter}
                            statusFilter={statusFilter}
                            helpRequests={helpRequests}
                            onSearchChange={handleSearchChange}
                            onCategoryChange={handleCategoryFilterChange}
                            onPriorityChange={handlePriorityChange}
                            onStatusChange={handleStatusChange}
                        />
                    </div>

                    {/* Table */}

                    <div className="mt-5">
                        <HelpRequestTable
                            columns={columns}
                            rows={rows}
                            onSort={handleSort}
                            getSortIcon={getSortIcon}
                            resultCount={filteredHelpRequests.length}
                        />
                    </div>

                    {/* Pagination */}

                    {filteredHelpRequests.length > 0 && (
                        <HelpRequestPagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            totalItems={filteredHelpRequests.length}
                            itemsPerPage={HELP_REQUESTS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </section>
            </div>

            {/* Toast */}

            <HelpRequestSuccessToast
                show={toast.show}
                message={toast.message}
            />

            {/* View */}

            <HelpRequestViewModal
                request={selectedRequest}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            {/* Review / Verification */}

            <HelpRequestVerificationModal
                request={selectedReviewRequest}
                loading={reviewLoading}
                error={reviewError}
                onClose={closeReviewModal}
                onConfirm={handleVerificationChange}
            />

            {/* Assignment */}

            <HelpRequestAssignmentModal
                request={selectedAssignmentRequest}
                loading={assignmentLoading}
                error={assignmentError}
                onClose={closeAssignmentModal}
                onConfirm={handleAssignment}
            />
        </>
    );
};

export default AdminHelpRequests;
