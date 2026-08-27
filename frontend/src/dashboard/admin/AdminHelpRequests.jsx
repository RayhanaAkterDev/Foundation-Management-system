import React, { useEffect, useMemo, useState } from 'react';

import { Download, ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import HelpRequestViewModal from './helpRequests/HelpRequestViewModal';
import HelpRequestVerificationModal from './helpRequests/HelpRequestVerificationModal';
import HelpRequestAssignmentModal from './helpRequests/HelpRequestAssignmentModal';
import HelpRequestReassignmentModal from './helpRequests/HelpRequestReassignmentModal';

import HelpRequestStats from './helpRequests/HelpRequestStats';
import HelpRequestCategoryTabs from './helpRequests/HelpRequestCategoryTabs';
import HelpRequestFilters from './helpRequests/HelpRequestFilters';
import HelpRequestTable from './helpRequests/HelpRequestTable';
import HelpRequestPagination from './helpRequests/HelpRequestPagination';
import HelpRequestSuccessToast from './helpRequests/HelpRequestSuccessToast';
import UserViewModal from './helpRequests/UserViewModal';

import {
    fetchHelpRequests,
    updateHelpRequestVerification,
    assignHelpRequest,
} from './helpRequests/helpRequestAPI';

import { fetchUser } from './users/userApi';

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
    // View requester
    // --------------------------------

    const [selectedUser, setSelectedUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState('');

    // --------------------------------
    // Verification
    // --------------------------------

    const [selectedVerificationRequest, setSelectedVerificationRequest] =
        useState(null);

    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    // --------------------------------
    // Assignment
    // --------------------------------

    const [selectedAssignmentRequest, setSelectedAssignmentRequest] =
        useState(null);

    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [assignmentError, setAssignmentError] = useState('');

    // --------------------------------
    // Reassignment
    // --------------------------------

    const [selectedReassignmentRequest, setSelectedReassignmentRequest] =
        useState(null);

    const [reassignmentLoading, setReassignmentLoading] = useState(false);
    const [reassignmentError, setReassignmentError] = useState('');

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
    // Load help requests
    // --------------------------------

    const loadHelpRequests = async () => {
        try {
            setError('');

            const data = await fetchHelpRequests();

            setHelpRequests(data.helpRequests || []);
        } catch (err) {
            setError(
                err.message ||
                    'Something went wrong while loading help requests.',
            );
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadRequests = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await fetchHelpRequests();

                if (!cancelled) {
                    setHelpRequests(data.helpRequests || []);
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
    // View help request
    // --------------------------------

    const handleViewRequest = (request) => {
        setViewError('');
        setViewLoading(false);
        setSelectedRequest(request);
    };

    const closeViewModal = () => {
        setSelectedRequest(null);
        setViewError('');
    };

    // --------------------------------
    // View requester
    // --------------------------------

    const handleViewUser = async (userId) => {
        if (!userId) {
            setUserError('Requester information is unavailable.');
            setSelectedUser(null);
            return;
        }

        setUserLoading(true);
        setUserError('');
        setSelectedUser(null);

        try {
            const data = await fetchUser(userId);

            setSelectedUser(data.user);
        } catch (err) {
            setUserError(err.message || 'Unable to load user details.');
        } finally {
            setUserLoading(false);
        }
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setUserError('');
    };

    // --------------------------------
    // Verification
    //
    // pending -> verified
    // pending -> rejected
    // --------------------------------

    const handleVerifyRequest = (request) => {
        setVerificationError('');
        setSelectedVerificationRequest(request);
    };

    const closeVerificationModal = () => {
        if (verificationLoading) {
            return;
        }

        setSelectedVerificationRequest(null);
        setVerificationError('');
    };

    const handleVerificationChange = async (status) => {
        if (!selectedVerificationRequest) {
            return;
        }

        setVerificationLoading(true);
        setVerificationError('');

        try {
            await updateHelpRequestVerification(
                selectedVerificationRequest.id,
                status,
            );

            setSelectedVerificationRequest(null);

            await loadHelpRequests();

            showSuccessToast(
                status === 'verified'
                    ? 'Help request verified successfully.'
                    : 'Help request rejected successfully.',
            );
        } catch (err) {
            setVerificationError(
                err.message || 'Unable to update help request verification.',
            );
        } finally {
            setVerificationLoading(false);
        }
    };

    // --------------------------------
    // Assignment
    //
    // verified + no assignment -> Assign
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
            await assignHelpRequest(
                selectedAssignmentRequest.id,
                assignmentData,
            );

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
    // Reassignment
    //
    // verified + existing assignment -> Reassign
    // --------------------------------

    const handleReassignRequest = (request) => {
        setReassignmentError('');
        setSelectedReassignmentRequest(request);
    };

    const closeReassignmentModal = () => {
        if (reassignmentLoading) {
            return;
        }

        setSelectedReassignmentRequest(null);
        setReassignmentError('');
    };

    const handleReassignment = async (reassignmentData) => {
        if (!selectedReassignmentRequest) {
            return;
        }

        setReassignmentLoading(true);
        setReassignmentError('');

        try {
            /*
             * IMPORTANT:
             *
             * Connect your backend reassignment API here.
             *
             * Example:
             *
             * await reassignHelpRequest(
             *     selectedReassignmentRequest.id,
             *     reassignmentData,
             * );
             *
             * Do NOT use assignHelpRequest() here.
             * Reassignment is a separate action.
             */

            console.log('Reassignment payload:', reassignmentData);

            /*
             * Temporary frontend completion until the
             * reassignment API helper is connected.
             */

            setSelectedReassignmentRequest(null);

            await loadHelpRequests();

            showSuccessToast(
                'Help request reassignment submitted successfully.',
            );
        } catch (err) {
            setReassignmentError(
                err.message || 'Unable to reassign help request.',
            );
        } finally {
            setReassignmentLoading(false);
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
                (request) =>
                    (request.priority || request.urgency) === priorityFilter,
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

            request.priority || request.urgency || '',

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

        requesterId:
            request.user?.id ||
            request.requester?.id ||
            request.user_id ||
            null,

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
            key: 'requester',
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
            render: (value, row) => value || row.urgency || '—',
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

            render: (_, row) => {
                const hasAssignment = hasExistingAssignment(row);

                return (
                    <div className="flex items-center justify-end gap-4">
                        {/* --------------------------------
                            VERIFY
                            pending -> verify/reject
                           -------------------------------- */}

                        {row.status === 'pending' && (
                            <button
                                type="button"
                                onClick={() => handleVerifyRequest(row)}
                                className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                            >
                                Verify
                            </button>
                        )}

                        {/* --------------------------------
                            ASSIGN
                            verified + no assignment
                           -------------------------------- */}

                        {row.status === 'verified' && !hasAssignment && (
                            <button
                                type="button"
                                onClick={() => handleAssignRequest(row)}
                                className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                            >
                                Assign
                            </button>
                        )}

                        {/* --------------------------------
                            REASSIGN
                            verified + existing assignment
                           -------------------------------- */}

                        {row.status === 'verified' && hasAssignment && (
                            <button
                                type="button"
                                onClick={() => handleReassignRequest(row)}
                                className="text-xs font-semibold text-amber-600 transition-colors hover:text-amber-700"
                            >
                                Reassign
                            </button>
                        )}

                        {/* --------------------------------
                            VIEW
                            Always available
                           -------------------------------- */}

                        <button
                            type="button"
                            onClick={() => handleViewRequest(row)}
                            className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                        >
                            View
                        </button>
                    </div>
                );
            },
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
                    subtitle="Verify requests and coordinate assistance through organizations and SP volunteers."
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
                            onRequesterClick={handleViewUser}
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

            {/* --------------------------------
                Toast
               -------------------------------- */}

            <HelpRequestSuccessToast
                show={toast.show}
                message={toast.message}
            />

            {/* --------------------------------
                View request
               -------------------------------- */}

            <HelpRequestViewModal
                request={selectedRequest}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            {/* --------------------------------
                View requester
               -------------------------------- */}

            <UserViewModal
                user={selectedUser}
                loading={userLoading}
                error={userError}
                onClose={closeUserModal}
            />

            {/* --------------------------------
                Verification
               -------------------------------- */}

            <HelpRequestVerificationModal
                request={selectedVerificationRequest}
                loading={verificationLoading}
                error={verificationError}
                onClose={closeVerificationModal}
                onConfirm={handleVerificationChange}
            />

            {/* --------------------------------
                Normal Assignment
               -------------------------------- */}

            <HelpRequestAssignmentModal
                request={selectedAssignmentRequest}
                loading={assignmentLoading}
                error={assignmentError}
                onClose={closeAssignmentModal}
                onConfirm={handleAssignment}
            />

            {/* --------------------------------
                Reassignment
               -------------------------------- */}

            <HelpRequestReassignmentModal
                key={selectedReassignmentRequest?.id || 'reassignment-modal'}
                request={selectedReassignmentRequest}
                open={Boolean(selectedReassignmentRequest)}
                loading={reassignmentLoading}
                error={reassignmentError}
                organizations={[]}
                volunteers={[]}
                onClose={closeReassignmentModal}
                onSubmit={handleReassignment}
            />
        </>
    );
};

/*
 * Determines whether the request already has
 * at least one assignment.
 *
 * Supports several possible API response shapes.
 */

const hasExistingAssignment = (request) => {
    if (!request) {
        return false;
    }

    if (Array.isArray(request.assignments) && request.assignments.length > 0) {
        return true;
    }

    if (request.assigned_organization || request.assigned_organization_id) {
        return true;
    }

    if (
        Array.isArray(request.assigned_volunteers) &&
        request.assigned_volunteers.length > 0
    ) {
        return true;
    }

    if (Array.isArray(request.volunteers) && request.volunteers.length > 0) {
        return true;
    }

    return false;
};

export default AdminHelpRequests;
