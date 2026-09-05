import React, { useEffect, useMemo, useState } from 'react';

import {
    ArrowDown,
    ArrowUp,
    Building2,
    ChevronsUpDown,
    Download,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import HelpRequestStats from './myHelpRequests/HelpRequestStats';
import HelpRequestCategoryTabs from './myHelpRequests/HelpRequestCategoryTabs';
import HelpRequestFilters from './myHelpRequests/HelpRequestFilters';
import HelpRequestTable from './myHelpRequests/HelpRequestTable';
import HelpRequestPagination from './myHelpRequests/HelpRequestPagination';
import HelpRequestDetailsModal from './myHelpRequests/HelpRequestDetailsModal';
import HelpRequestEditModal from './myHelpRequests/HelpRequestEditModal';
import HelpRequestModal from './myHelpRequests/HelpRequestModal';
import HelpRequestDeleteModal from './myHelpRequests/HelpRequestDeleteModal';
import HelpRequestSuccessToast from './myHelpRequests/HelpRequestSuccessToast';
import OrganizationInfoDrawer from './myHelpRequests/OrganizationInfoDrawer';

import {
    getMyHelpRequests,
    deleteHelpRequest,
} from './myHelpRequests/helpRequestAPI';

const HELP_REQUESTS_PER_PAGE = 25;

// =========================================================
// Helpers
// =========================================================

const normalizeHelpRequest = (request) => {
    if (!request) {
        return request;
    }

    return {
        ...request,
        id: request.id,
        title: request.title || '',
        description: request.description || '',
        category: request.category || '',
        urgency: request.urgency || 'normal',
        district: request.district || '',
        address: request.address || '',
        status: request.status || '',
        verification_note: request.verification_note || '',
        verificationNote: request.verification_note || '',
        notes: request.verification_note || '',
        assignments: Array.isArray(request.assignments)
            ? request.assignments
            : [],
    };
};

const normalizeHelpRequests = (requests) => {
    if (!Array.isArray(requests)) {
        return [];
    }

    return requests.map(normalizeHelpRequest);
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'Pending';

        case 'verified':
            return 'Verified';

        case 'assigned':
            return 'Assigned';

        case 'in_progress':
            return 'In Progress';

        case 'completed':
            return 'Completed';

        case 'rejected':
            return 'Rejected';

        default:
            return status || '—';
    }
};

const getUrgencyLabel = (urgency) => {
    switch (urgency) {
        case 'critical':
            return 'Critical';

        case 'urgent':
            return 'Urgent';

        case 'high':
            return 'High';

        case 'normal':
            return 'Normal';

        case 'low':
            return 'Low';

        default:
            return urgency || 'Normal';
    }
};

const getAssignmentInfo = (request) => {
    const assignments = Array.isArray(request?.assignments)
        ? request.assignments
        : [];

    if (assignments.length === 0) {
        return {
            state: 'not_assigned',
            label: 'Not assigned',
            currentAssignment: null,
            previousAssignment: null,
        };
    }

    const sortedAssignments = [...assignments].sort((a, b) => {
        const first = a?.assigned_at ? new Date(a.assigned_at).getTime() : 0;

        const second = b?.assigned_at ? new Date(b.assigned_at).getTime() : 0;

        return second - first;
    });

    const currentAssignment = sortedAssignments[0];

    const pendingStatuses = ['pending'];

    if (pendingStatuses.includes(currentAssignment?.status)) {
        return {
            state: 'pending',
            label: 'Assignment pending',
            currentAssignment,
            previousAssignment: sortedAssignments[1] || null,
        };
    }

    const acceptedStatuses = [
        'assigned',
        'accepted',
        'active',
        'in_progress',
        'completed',
    ];

    if (acceptedStatuses.includes(currentAssignment?.status)) {
        return {
            state: 'accepted',
            label:
                currentAssignment?.organization?.name ||
                'Organization assigned',
            currentAssignment,
            previousAssignment:
                sortedAssignments
                    .slice(1)
                    .find(
                        (assignment) =>
                            assignment?.organization &&
                            assignment?.id !== currentAssignment?.id,
                    ) || null,
        };
    }

    return {
        state: 'not_assigned',
        label: 'Not assigned',
        currentAssignment: null,
        previousAssignment: null,
    };
};

// =========================================================
// Component
// =========================================================

const MyHelpRequests = () => {
    // =========================================================
    // Help request data
    // =========================================================

    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // =========================================================
    // Create modal
    // =========================================================

    const [showModal, setShowModal] = useState(false);

    // =========================================================
    // Edit modal
    // =========================================================

    const [editingRequest, setEditingRequest] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // =========================================================
    // Success toast
    // =========================================================

    const [successToast, setSuccessToast] = useState({
        show: false,
        message: '',
    });

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

        return () => {
            clearTimeout(timer);
        };
    }, [successToast.show]);

    // =========================================================
    // View modal
    // =========================================================

    const [selectedRequest, setSelectedRequest] = useState(null);

    // =========================================================
    // Organization drawer
    // =========================================================

    const [selectedOrganization, setSelectedOrganization] = useState(null);

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

    // =========================================================
    // Delete modal
    // =========================================================

    const [deleteRequestItem, setDeleteRequestItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // =========================================================
    // Filters
    // =========================================================

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
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
    // Load help requests
    // =========================================================

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

    // =========================================================
    // CREATE
    // =========================================================

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

    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (request) => {
        setSelectedRequest(request);
    };

    const handleCloseDetails = () => {
        setSelectedRequest(null);
    };

    // =========================================================
    // EDIT
    // =========================================================

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

        setSelectedRequest((currentRequest) => {
            if (!currentRequest) {
                return null;
            }

            return currentRequest.id === formattedRequest.id
                ? formattedRequest
                : currentRequest;
        });

        showSuccessToast('Your help request was updated successfully.');
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (request) => {
        if (!request || request.status !== 'pending') {
            return;
        }

        if (deleteLoading) {
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
        if (!deleteRequestItem) {
            return;
        }

        if (deleteLoading) {
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

    // =========================================================
    // Statistics
    // =========================================================

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

    // =========================================================
    // Status tabs
    // =========================================================

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

    // =========================================================
    // Filtering + sorting
    // =========================================================

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
                (request) => request.urgency === priorityFilter,
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
                const title = String(request.title || '').toLowerCase();

                const description = String(
                    request.description || '',
                ).toLowerCase();

                const category = String(request.category || '').toLowerCase();

                const district = String(request.district || '').toLowerCase();

                const address = String(request.address || '').toLowerCase();

                return (
                    title.includes(search) ||
                    description.includes(search) ||
                    category.includes(search) ||
                    district.includes(search) ||
                    address.includes(search)
                );
            });
        }

        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        result.sort((a, b) => {
            let first = a[sortConfig.key];
            let second = b[sortConfig.key];

            if (['created_at', 'updated_at'].includes(sortConfig.key)) {
                first = first ? new Date(first).getTime() : 0;

                second = second ? new Date(second).getTime() : 0;
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

    // =========================================================
    // Pagination
    // =========================================================

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

    // =========================================================
    // Filter controls
    // =========================================================

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
    // CSV export
    // =========================================================

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
        link.download = 'stand-for-people-my-help-requests.csv';

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
                    title="My Help Requests"
                    subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading help requests...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve your requests.
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
                    title="My Help Requests"
                    subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
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
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',

            render: (value, row) => (
                <div className="min-w-0 max-w-90">
                    <p className="truncate font-semibold text-text-primary">
                        {value || 'Untitled help request'}
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
            key: 'urgencyLabel',
            header: 'Priority',
            sortable: true,
            sortKey: 'urgency',

            render: (value) => (
                <span className="whitespace-nowrap text-sm font-semibold text-text-primary">
                    {value}
                </span>
            ),
        },

        {
            key: 'formattedCreatedDate',
            header: 'Submitted',
            sortable: true,
            sortKey: 'created_at',

            render: (value) => (
                <span className="whitespace-nowrap text-sm font-medium text-text-primary">
                    {value}
                </span>
            ),
        },

        {
            key: 'assignmentInfo',
            header: 'Assignment',
            sortable: true,
            label: 'Assignment',

            render: (value, row) => {
                const assignment = value;

                if (assignment?.state === 'pending') {
                    return (
                        <span className="text-sm font-medium text-amber-600">
                            Assignment pending
                        </span>
                    );
                }

                if (assignment?.state === 'accepted') {
                    return (
                        <button
                            type="button"
                            onClick={() =>
                                handleViewOrganization(assignment, row)
                            }
                            disabled={
                                !assignment.currentAssignment?.organization
                            }
                            className="inline-flex max-w-full items-center gap-1.5 text-left text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline disabled:cursor-default disabled:no-underline"
                        >
                            <Building2
                                size={14}
                                strokeWidth={1.8}
                                className="shrink-0"
                            />

                            <span className="truncate">{assignment.label}</span>
                        </button>
                    );
                }

                return (
                    <span className="text-sm text-gray-500">Not assigned</span>
                );
            },
        },

        {
            key: 'statusLabel',
            header: 'Status',
            sortable: true,
            sortKey: 'status',

            render: (value, row) => (
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        row.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.status === 'rejected'
                              ? 'bg-red-50 text-red-700'
                              : row.status === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-primary/10 text-primary'
                    }`}
                >
                    {value}
                </span>
            ),
        },

        {
            key: 'actions',
            header: 'Actions',
            align: 'right',

            render: (_, row) => {
                const canEdit = row.status === 'pending';

                const canDelete = row.status === 'pending';

                return (
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                        >
                            View
                        </button>

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                disabled={deleteLoading}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Pencil size={13} strokeWidth={1.8} />
                                Edit
                            </button>
                        )}

                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                disabled={deleteLoading}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={13} strokeWidth={1.8} />
                                Delete
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
            {/* SUCCESS TOAST */}

            <HelpRequestSuccessToast
                show={successToast.show}
                message={successToast.message}
            />

            <PageHeader
                title="My Help Requests"
                subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
                action={
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                        >
                            <Plus size={16} />
                            New Request
                        </button>

                        <button
                            type="button"
                            onClick={handleExportCSV}
                            disabled={filteredHelpRequests.length === 0}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                }
            />

            {/* Statistics */}

            <section>
                <div className="mb-4 flex items-end justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Overview
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            Request base
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

            {/* Management */}

            <section className="border-t border-border pt-8">
                <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        Requests
                    </p>

                    <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <h2 className="text-lg font-bold tracking-tight text-text-primary">
                            My help requests
                        </h2>

                        <p className="text-xs font-medium text-text-secondary">
                            {filteredHelpRequests.length}{' '}
                            {filteredHelpRequests.length === 1
                                ? 'request'
                                : 'requests'}{' '}
                            shown
                        </p>
                    </div>
                </div>

                <HelpRequestCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />

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

                <div className="mt-5">
                    <HelpRequestTable
                        columns={columns}
                        rows={rows}
                        onSort={handleSort}
                        getSortIcon={getSortIcon}
                        resultCount={filteredHelpRequests.length}
                    />
                </div>

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

            {/* CREATE HELP REQUEST MODAL */}

            <HelpRequestModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={handleRequestCreated}
            />

            {/* VIEW DETAILS MODAL */}

            {selectedRequest && (
                <HelpRequestDetailsModal
                    isOpen={Boolean(selectedRequest)}
                    request={selectedRequest}
                    onClose={handleCloseDetails}
                />
            )}

            {/* EDIT HELP REQUEST MODAL */}

            <HelpRequestEditModal
                key={editingRequest?.id || 'edit-help-request'}
                isOpen={showEditModal}
                request={editingRequest}
                onClose={handleCloseEditModal}
                onSuccess={handleRequestUpdated}
            />

            {/* DELETE HELP REQUEST MODAL */}

            {deleteRequestItem && (
                <HelpRequestDeleteModal
                    isOpen={Boolean(deleteRequestItem)}
                    request={deleteRequestItem}
                    loading={deleteLoading}
                    deleting={deleteLoading}
                    error={deleteError}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            {/* ORGANIZATION INFO DRAWER */}

            <OrganizationInfoDrawer
                isOpen={Boolean(selectedOrganization)}
                organization={selectedOrganization?.organization}
                currentAssignment={selectedOrganization?.currentAssignment}
                assignments={selectedOrganization?.assignments || []}
                onClose={handleCloseOrganization}
            />
        </div>
    );
};

export default MyHelpRequests;
