import React, { useEffect, useMemo, useState } from 'react';

import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Download,
    Pencil,
    Plus,
    Trash2,
    ArrowUpRight,
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
            <div className="min-h-full">
                <div className="mx-auto w-full max-w-400">
                    <PageHeader
                        title="My Help Requests"
                        subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
                    />

                    <div className="mt-10 flex min-h-105 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white">
                        <div className="text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/15 bg-primary/5">
                                <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
                            </div>

                            <p className="text-sm font-bold text-text-primary">
                                Loading your help requests
                            </p>

                            <p className="mt-2 text-sm text-text-secondary">
                                Retrieving your latest request activity.
                            </p>
                        </div>
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
            <div className="min-h-full bg-background">
                <div className="mx-auto w-full max-w-400 px-4 py-7 sm:px-6 lg:px-8">
                    <PageHeader
                        title="My Help Requests"
                        subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
                    />

                    <div className="mt-10 overflow-hidden rounded-2xl border border-red-200 bg-white">
                        <div className="border-l-4 border-red-500 bg-red-50 px-6 py-5">
                            <p className="text-sm font-bold text-red-800">
                                Unable to load your requests
                            </p>

                            <p className="mt-1.5 text-sm leading-6 text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>
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

    const columns = [
        {
            key: 'title',
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',
            render: (value, row) => {
                const urgencyStyles = {
                    critical: {
                        dot: 'bg-red-500',
                        text: 'text-red-600',
                    },
                    urgent: {
                        dot: 'bg-orange-500',
                        text: 'text-orange-600',
                    },
                    high: {
                        dot: 'bg-amber-500',
                        text: 'text-amber-600',
                    },
                    low: {
                        dot: 'bg-slate-400',
                        text: 'text-text-secondary',
                    },
                    normal: {
                        dot: 'bg-slate-400',
                        text: 'text-text-secondary',
                    },
                };

                const urgency =
                    urgencyStyles[row.urgency] || urgencyStyles.normal;

                return (
                    <div className="min-w-0 py-5 pr-8">
                        {/* Title */}
                        <p className="truncate text-[15px] font-bold leading-5.5 tracking-[-0.01em] text-text-primary">
                            {value || 'Untitled help request'}
                        </p>

                        {/* Description */}
                        <p className="mt-1.5 line-clamp-2 text-[12px] font-normal leading-5 text-text-secondary">
                            {row.description || 'No description provided.'}
                        </p>

                        {/* Category + Location */}
                        <div className="mt-3 flex min-w-0 items-center gap-2 text-[11px]">
                            {row.category && (
                                <>
                                    <span className="truncate font-semibold capitalize text-text-secondary">
                                        {row.category}
                                    </span>

                                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                                </>
                            )}

                            <span className="truncate font-medium text-text-secondary/75">
                                {row.locationName || 'Location not specified'}
                            </span>
                        </div>

                        {/* Submitted + Urgency */}
                        <div className="mt-2.5 flex items-center gap-3">
                            <span className="text-[10px] font-medium text-text-secondary/60">
                                Submitted{' '}
                                <span className="font-semibold text-text-secondary/85">
                                    {row.formattedCreatedDate}
                                </span>
                            </span>

                            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                            <span
                                className={`inline-flex items-center gap-1.5 ${urgency.text}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${urgency.dot}`}
                                />

                                <span className="text-[10px] font-semibold">
                                    {row.urgencyLabel}
                                </span>
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'statusLabel',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: '16%',
            render: (value, row) => {
                const statusStyles = {
                    pending: {
                        dot: 'bg-amber-500',
                        text: 'text-amber-700',
                        background: 'bg-amber-50',
                    },

                    verified: {
                        dot: 'bg-primary',
                        text: 'text-primary',
                        background: 'bg-primary/[0.07]',
                    },

                    assigned: {
                        dot: 'bg-primary',
                        text: 'text-primary',
                        background: 'bg-primary/[0.07]',
                    },

                    in_progress: {
                        dot: 'bg-primary',
                        text: 'text-primary',
                        background: 'bg-primary/[0.10]',
                    },

                    completed: {
                        dot: 'bg-emerald-500',
                        text: 'text-emerald-700',
                        background: 'bg-emerald-50',
                    },

                    rejected: {
                        dot: 'bg-red-500',
                        text: 'text-red-700',
                        background: 'bg-red-50',
                    },
                };

                const status = statusStyles[row.status] || {
                    dot: 'bg-slate-400',
                    text: 'text-text-secondary',
                    background: 'bg-slate-50',
                };

                return (
                    <div className="py-5">
                        <span
                            className={`
              inline-flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              ${status.background}
            `}
                        >
                            <span
                                className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                            />

                            <span
                                className={`
                text-[12px]
                font-semibold
                ${status.text}
              `}
                            >
                                {value}
                            </span>
                        </span>
                    </div>
                );
            },
        },

        {
            key: 'assignmentInfo',
            header: 'Assigned',
            sortable: true,
            sortKey: 'assignmentInfo',
            width: '20%',
            render: (value, row) => {
                const assignment = value;

                {
                    /* Pending assignment */
                }
                if (assignment?.state === 'pending') {
                    return (
                        <div className="py-5">
                            <div className="flex items-center gap-2.5">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />

                                <div className="min-w-0">
                                    <p className="text-[12px] font-semibold text-text-secondary">
                                        Awaiting response
                                    </p>

                                    <p className="mt-0.5 text-[10px] font-medium text-text-secondary/55">
                                        Organization assignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }

                {
                    /* Accepted organization */
                }
                if (assignment?.state === 'accepted') {
                    return (
                        <div className="py-5">
                            <button
                                type="button"
                                onClick={() =>
                                    handleViewOrganization(assignment, row)
                                }
                                disabled={
                                    !assignment.currentAssignment?.organization
                                }
                                className="
                group
                min-w-0
                max-w-60
                text-left
                disabled:cursor-default
              "
                            >
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />

                                    <p
                                        className="
                    truncate
                    text-[13px]
                    font-semibold
                    leading-5
                    text-text-primary
                    transition-colors
                    duration-200
                    group-hover:text-primary
                  "
                                    >
                                        {assignment.label}
                                    </p>
                                </div>

                                <p
                                    className="
                  mt-1
                  pl-4.5
                  text-[10px]
                  font-medium
                  text-text-secondary/60
                  transition-colors
                  duration-200
                  group-hover:text-primary/70
                "
                                >
                                    View organization
                                </p>
                            </button>
                        </div>
                    );
                }

                {
                    /* Not assigned */
                }
                return (
                    <div className="py-5">
                        <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300" />

                            <span className="text-[12px] font-medium text-text-secondary/70">
                                Not assigned
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'actions',
            header: 'Action',
            align: 'right',
            width: '14%',
            render: (_, row) => {
                const canEdit = row.status === 'pending';
                const canDelete = row.status === 'pending';

                return (
                    <div className="flex items-center justify-end gap-1 py-5">
                        {/* View */}
                        <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-3
              py-2
              text-[11px]
              font-semibold
              text-text-secondary
              transition-colors
              duration-200
              hover:bg-slate-100
              hover:text-text-primary
            "
                        >
                            <ArrowUpRight size={14} strokeWidth={1.8} />
                            <span>View</span>
                        </button>

                        {/* Edit */}
                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                disabled={deleteLoading}
                                className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                px-3
                py-2
                text-[11px]
                font-semibold
                text-text-secondary
                transition-colors
                duration-200
                hover:bg-primary/6
                hover:text-primary
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                                <span>Edit</span>
                            </button>
                        )}

                        {/* Delete */}
                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                disabled={deleteLoading}
                                className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                px-3
                py-2
                text-[11px]
                font-semibold
                text-red-500
                transition-colors
                duration-200
                hover:bg-red-50
                hover:text-red-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                            >
                                <Trash2 size={14} strokeWidth={1.8} />
                                <span>Delete</span>
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
        <div className="min-h-full">
            <div className="mx-auto w-full max-w-400 space-y-10">
                {/* =====================================================
                    SUCCESS TOAST
                ====================================================== */}
                <HelpRequestSuccessToast
                    show={successToast.show}
                    message={successToast.message}
                />
                {/* =====================================================
    PAGE HEADER
====================================================== */}

                <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-[#e8f1f1]">
                    {/* =================================================
        MAIN HEADER
    ================================================== */}
                    <div className="flex flex-col lg:flex-row">
                        {/* =================================================
            LEFT — PRIMARY PAGE INTRO
        ================================================== */}
                        <div className="relative flex min-w-0 flex-1 items-center overflow-hidden bg-primary px-7 py-9 sm:px-9 sm:py-10 lg:px-10 lg:py-11">
                            {/* restrained background detail */}
                            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-28 border-white/[0.035]" />

                            <div className="pointer-events-none absolute -bottom-28 -left-16 h-52 w-52 rounded-full bg-white/2.5" />

                            <div className="relative max-w-2xl">
                                {/* eyebrow */}
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>

                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                                        Personal support
                                    </span>

                                    <span className="h-px w-10 bg-white/20" />
                                </div>

                                {/* title */}
                                <h1 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]">
                                    My Help Requests
                                </h1>

                                {/* subtitle */}
                                <p className="mt-4 max-w-xl text-[14px] font-medium leading-6 text-white/70 sm:text-[15px] sm:leading-7">
                                    Track the requests you've submitted, follow
                                    their progress, and stay connected with the
                                    organizations helping you.
                                </p>

                                {/* visual accent */}
                                <div className="mt-7 flex items-center gap-1.5">
                                    <span className="h-1 w-8 rounded-full bg-white/75" />
                                    <span className="h-1 w-2 rounded-full bg-white/30" />
                                    <span className="h-1 w-2 rounded-full bg-white/15" />
                                </div>
                            </div>
                        </div>

                        {/* =================================================
            RIGHT — ACTION AREA
        ================================================== */}
                        <div className="flex shrink-0 items-center border-t border-primary/10 bg-white px-7 py-7 sm:px-9 lg:w-85 lg:border-l lg:border-t-0 lg:px-8">
                            <div className="w-full">
                                {/* action heading */}
                                <div className="mb-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                            Quick actions
                                        </span>

                                        <span className="h-px flex-1 bg-border" />
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-text-primary">
                                        Manage your support activity
                                    </p>
                                </div>

                                {/* actions */}
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    {/* New Request */}
                                    <button
                                        type="button"
                                        onClick={handleOpenModal}
                                        className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md"
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/15">
                                            <Plus size={16} strokeWidth={2.4} />
                                        </span>

                                        <span>New Request</span>
                                    </button>

                                    {/* Export */}
                                    <button
                                        type="button"
                                        onClick={handleExportCSV}
                                        disabled={
                                            filteredHelpRequests.length === 0
                                        }
                                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-text-primary transition-all duration-200 hover:border-primary/25 hover:bg-primary/4 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Export requests"
                                        title="Export requests"
                                    >
                                        <Download size={16} strokeWidth={1.8} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
        BOTTOM ACCENT
    ================================================== */}
                    <div className="flex items-center justify-between border-t bg-white border-primary/10 px-7 py-3.5 sm:px-9 lg:px-10 h-20">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                                Manage · Track · Connect
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-6 rounded-full bg-primary/20" />
                            <span className="h-1.5 w-2 rounded-full bg-primary/10" />
                        </div>
                    </div>
                </section>

                {/* =====================================================
    REQUEST OVERVIEW
====================================================== */}

                <section>
                    {/* =====================================================
    REQUEST OVERVIEW HEADING
====================================================== */}

                    <div className="p-4 mt-12">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            {/* Left — section identity */}

                            <div className="min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-primary/50" />

                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Request overview
                                    </p>
                                </div>

                                <h2 className="mt-3 text-[25px] font-extrabold leading-[1.12] tracking-[-0.03em] text-text-primary sm:text-[27px]">
                                    Where your requests stand
                                </h2>
                            </div>

                            {/* Right — contextual metadata */}

                            {statistics.total > 0 && (
                                <div className="flex shrink-0 items-center gap-2.5 pb-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />

                                    <p className="text-[11px] font-medium leading-5 text-text-secondary">
                                        Updated from your submitted requests
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =================================================
        TOP SUMMARY
    ================================================== */}

                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_5px_24px_rgba(15,23,42,0.04)]">
                        <div className="grid lg:grid-cols-[300px_1fr]">
                            {/* =================================================
                TOTAL SUBMITTED
            ================================================== */}

                            <div className="relative overflow-hidden border-b border-primary/15 bg-primary/10 px-7 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-9 lg:py-9">
                                {/* restrained visual accent */}

                                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border-18 border-primary/4.5" />

                                <div className="pointer-events-none absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-primary/2.5" />

                                <div className="relative">
                                    {/* label row */}

                                    <div className="flex items-start justify-between gap-5">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                                                Total submitted
                                            </p>

                                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                Your request history
                                            </p>
                                        </div>

                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-white text-primary shadow-sm">
                                            <ArrowUpRight
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </span>
                                    </div>

                                    {/* main number */}

                                    <div className="mt-8 flex items-end gap-3">
                                        <span className="text-[56px] font-extrabold leading-[0.9] tracking-tighter text-text-primary">
                                            {statistics.total}
                                        </span>

                                        <span className="mb-1 text-xs font-bold text-text-secondary">
                                            requests
                                        </span>
                                    </div>

                                    {/* supporting text */}

                                    <p className="mt-6 max-w-55 text-xs leading-5 text-text-secondary">
                                        Every request you have submitted through
                                        Stand For People.
                                    </p>

                                    {/* bottom accent */}

                                    <div className="mt-7 flex items-center gap-1.5">
                                        <span className="h-1 w-7 rounded-full bg-primary/50" />
                                        <span className="h-1 w-2 rounded-full bg-primary/20" />
                                        <span className="h-1 w-2 rounded-full bg-primary/10" />
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                ACTIVE REQUEST FLOW
            ================================================== */}

                            <div className="px-7 py-8 sm:px-8 lg:px-9 lg:py-9  bg-white">
                                {/* heading */}

                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <p className="text-[15px] font-bold leading-5 text-text-primary">
                                            Active request flow
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-text-secondary">
                                            Requests currently moving through
                                            support
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-lg border border-primary/15 bg-primary/5.5 px-3 py-1.5 text-[11px] font-bold text-primary">
                                        {statistics.pending +
                                            statistics.verified +
                                            statistics.assigned}{' '}
                                        active
                                    </span>
                                </div>

                                {/* flow */}

                                <div className="relative mt-9">
                                    {/* connecting line */}

                                    <div className="absolute left-3 right-3 top-3 h-px bg-border" />

                                    <div className="relative grid grid-cols-3 gap-6">
                                        {/* Pending */}

                                        <div>
                                            <div className="flex items-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-amber-500 shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[27px] font-extrabold leading-none tracking-[-0.035em] text-text-primary">
                                                    {statistics.pending}
                                                </p>

                                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                                    Pending
                                                </p>

                                                <p className="mt-2.5 hidden text-xs leading-5 text-text-secondary sm:block">
                                                    Waiting for review
                                                </p>
                                            </div>
                                        </div>

                                        {/* Verified */}

                                        <div>
                                            <div className="flex items-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[27px] font-extrabold leading-none tracking-[-0.035em] text-text-primary">
                                                    {statistics.verified}
                                                </p>

                                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                                    Verified
                                                </p>

                                                <p className="mt-2.5 hidden text-xs leading-5 text-text-secondary sm:block">
                                                    Request confirmed
                                                </p>
                                            </div>
                                        </div>

                                        {/* Assigned */}

                                        <div>
                                            <div className="flex items-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-primary shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[27px] font-extrabold leading-none tracking-[-0.035em] text-text-primary">
                                                    {statistics.assigned}
                                                </p>

                                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                                    Assigned
                                                </p>

                                                <p className="mt-2.5 hidden text-xs leading-5 text-text-secondary sm:block">
                                                    Organization connected
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* =================================================
            OUTCOMES
        ================================================== */}

                                    <div className="grid divide-y divide-border border-t mt-20 border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                                        {/* Completed */}

                                        <div className="flex items-center justify-between px-7 transition-colors hover:bg-emerald-50/40 sm:px-8">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                </span>

                                                <div>
                                                    <p className="text-[14px] font-bold leading-5 text-text-primary">
                                                        Completed
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                        Successfully supported
                                                        requests
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-[22px] font-extrabold leading-none tracking-tight text-emerald-600">
                                                {statistics.completed}
                                            </span>
                                        </div>

                                        {/* Rejected */}

                                        <div className="flex items-center justify-between px-7 py-6 transition-colors hover:bg-red-50/40 sm:px-8">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50">
                                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                                </span>

                                                <div>
                                                    <p className="text-[14px] font-bold leading-5 text-text-primary">
                                                        Rejected
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                        Requests that could not
                                                        proceed
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-[22px] font-extrabold leading-none tracking-tight text-red-500">
                                                {statistics.rejected}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden">
                        <HelpRequestStats
                            total={statistics.total}
                            pending={statistics.pending}
                            verified={statistics.verified}
                            assigned={statistics.assigned}
                            completed={statistics.completed}
                            rejected={statistics.rejected}
                        />
                    </div>
                </section>

                {/* =====================================================
    REQUEST WORKSPACE
====================================================== */}

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
                    {/* =================================================
        WORKSPACE BODY
    ================================================== */}

                    <div className="grid min-w-0 lg:grid-cols-[300px_minmax(0,1fr)]">
                        {/* =================================================
            LEFT — REQUEST CONTROLS
        ================================================== */}

                        <aside className="min-w-0 overflow-hidden border-b border-border bg-background lg:border-b-0 lg:border-r">
                            <div className="p-6 sm:p-7">
                                {/* =================================================
                    REQUEST STATUS
                ================================================== */}

                                <div>
                                    <div className="mb-5 flex items-center gap-2.5">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <span className="relative h-3.5 w-3.5">
                                                <span className="absolute left-0 top-0.5 h-px w-3.5 bg-primary" />
                                                <span className="absolute left-1 top-1.5 h-px w-2.5 bg-primary" />
                                                <span className="absolute left-2 top-2.5 h-px w-1.5 bg-primary" />
                                            </span>
                                        </span>

                                        <div>
                                            <p className="text-[13px] font-extrabold leading-5 tracking-[-0.005em] text-text-primary">
                                                Request status
                                            </p>

                                            <p className="mt-1 text-[11px] font-normal leading-4.5 text-text-secondary">
                                                Browse by current stage
                                            </p>
                                        </div>
                                    </div>

                                    <HelpRequestCategoryTabs
                                        tabs={categoryTabs}
                                        activeCategory={activeCategory}
                                        onChange={handleCategoryChange}
                                    />
                                </div>

                                {/* =================================================
                    FILTER REQUESTS
                ================================================== */}

                                <div className="mt-9 border-t border-border pt-8">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <span className="relative h-3.5 w-3.5">
                                                    <span className="absolute left-0 top-0.5 h-px w-3.5 bg-primary" />
                                                    <span className="absolute left-1 top-1.5 h-px w-2.5 bg-primary" />
                                                    <span className="absolute left-2 top-2.5 h-px w-1.5 bg-primary" />
                                                </span>
                                            </span>

                                            <div>
                                                <p className="text-[13px] font-extrabold leading-5 tracking-[-0.005em] text-text-primary">
                                                    Filter requests
                                                </p>

                                                <p className="mt-1 text-[11px] font-normal leading-4.5 text-text-secondary">
                                                    Narrow down your results
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* =================================================
                        FILTER CONTROLS
                        Single vertical column.
                        No nested card.
                    ================================================== */}

                                    <div
                                        className="
                            min-w-0
                            [&>div]:grid!
                            [&>div]:w-full!
                            [&>div]:grid-cols-1!
                            [&>div]:gap-5!
                            [&>div>div]:w-full!
                            [&>div>div]:min-w-0!
                            [&_label]:mb-2!
                            [&_label]:block!
                            [&_label]:w-full!
                            [&_label]:text-[11px]!
                            [&_input]:w-full!
                            [&_input]:min-w-0!
                            [&_select]:w-full!
                            [&_select]:min-w-0!
                            [&_button]:max-w-full!
                        "
                                    >
                                        <HelpRequestFilters
                                            searchTerm={searchTerm}
                                            categoryFilter={categoryFilter}
                                            priorityFilter={priorityFilter}
                                            statusFilter={statusFilter}
                                            helpRequests={helpRequests}
                                            onSearchChange={handleSearchChange}
                                            onCategoryChange={
                                                handleCategoryFilterChange
                                            }
                                            onPriorityChange={
                                                handlePriorityChange
                                            }
                                            onStatusChange={handleStatusChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* =================================================
            RIGHT — REQUEST RESULTS
        ================================================== */}

                        <div className="min-w-0 bg-white">
                            {/* =================================================
                SUBMITTED REQUESTS HEADER
            ================================================== */}

                            <div className="border-b border-border bg-background p-6">
                                {/* =================================================
        WORKSPACE HEADER
    ================================================== */}

                                <div className="border-b border-border pb-6">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="mb-3.5 flex items-center gap-2.5">
                                                <span className="h-2 w-2 rounded-full bg-primary" />

                                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                                                    Request workspace
                                                </span>
                                            </div>

                                            <h2 className="text-[26px] font-extrabold leading-[1.18] tracking-tight text-text-primary sm:text-[28px]">
                                                Your help requests
                                            </h2>

                                            <p className="mt-3 max-w-2xl text-[14px] font-normal leading-6 text-text-secondary">
                                                Review your submissions and
                                                follow each request from
                                                verification through support.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mt-6">
                                    {/* LEFT */}

                                    <div className="flex min-w-0 items-start gap-3.5">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                                <h3 className="text-[16px] font-extrabold leading-5.5 tracking-[-0.015em] text-text-primary">
                                                    Submitted requests
                                                </h3>

                                                <span className="h-1 w-1 rounded-full bg-border" />

                                                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                                                    {
                                                        filteredHelpRequests.length
                                                    }{' '}
                                                    results
                                                </span>
                                            </div>

                                            <p className="mt-2 text-[12px] font-normal leading-5 text-text-secondary">
                                                Your current request activity
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                TABLE
            ================================================== */}

                            <div className="min-w-0 overflow-x-auto">
                                <HelpRequestTable
                                    columns={columns}
                                    rows={rows}
                                    onSort={handleSort}
                                    getSortIcon={getSortIcon}
                                    resultCount={filteredHelpRequests.length}
                                />
                            </div>

                            {/* =================================================
                PAGINATION
            ================================================== */}

                            {filteredHelpRequests.length > 0 && (
                                <div className="border-t border-border bg-[#fafbfb] px-5 py-5 sm:px-6 lg:px-8">
                                    <HelpRequestPagination
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredHelpRequests.length}
                                        itemsPerPage={HELP_REQUESTS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* =====================================================
                MODALS / DRAWER
            ====================================================== */}

            <HelpRequestModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={handleRequestCreated}
            />

            {selectedRequest && (
                <HelpRequestDetailsModal
                    isOpen={Boolean(selectedRequest)}
                    request={selectedRequest}
                    onClose={handleCloseDetails}
                />
            )}

            <HelpRequestEditModal
                key={editingRequest?.id || 'edit-help-request'}
                isOpen={showEditModal}
                request={editingRequest}
                onClose={handleCloseEditModal}
                onSuccess={handleRequestUpdated}
            />

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
