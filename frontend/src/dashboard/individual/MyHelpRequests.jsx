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
            <div className="min-h-full bg-linear-to-b from-primary/4 via-background to-background">
                <div className="mx-auto w-full max-w-400 px-4 py-7 sm:px-6 lg:px-8">
                    <PageHeader
                        title="My Help Requests"
                        subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
                    />

                    <div className="mt-10 flex min-h-105 items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                        <div className="text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-primary/15 via-primary/10 to-transparent shadow-inner">
                                <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
                            </div>

                            <p className="text-sm font-bold text-text-primary">
                                Loading your help requests
                            </p>

                            <p className="mt-2 text-xs text-text-secondary">
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
            <div className="min-h-full bg-linear-to-b from-red-50/40 via-background to-background">
                <div className="mx-auto w-full max-w-400 px-4 py-7 sm:px-6 lg:px-8">
                    <PageHeader
                        title="My Help Requests"
                        subtitle="Track and manage the help requests you have submitted through the Stand For People platform."
                    />

                    <div className="mt-10 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_8px_30px_rgba(220,38,38,0.06)]">
                        <div className="border-l-4 border-red-500 bg-linear-to-r from-red-50 to-transparent px-6 py-5">
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
                <div className="min-w-0 max-w-110 py-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-primary/5 text-primary shadow-sm ring-1 ring-primary/10">
                            <Building2 size={15} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-extrabold leading-5 text-text-primary">
                                {value || 'Untitled help request'}
                            </p>

                            {row.description && (
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                                    {row.description}
                                </p>
                            )}

                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                {row.category && (
                                    <span className="rounded-full bg-linear-to-r from-primary/10 to-primary/4 px-2.5 py-1 text-[10px] font-extrabold capitalize text-primary ring-1 ring-primary/10">
                                        {row.category}
                                    </span>
                                )}

                                {row.locationName !==
                                    'Location not specified' && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                                        <span className="truncate text-[10px] font-medium text-text-secondary">
                                            {row.locationName}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },

        {
            key: 'urgencyLabel',
            header: 'Priority',
            sortable: true,
            sortKey: 'urgency',

            render: (value, row) => {
                const priorityClass =
                    row.urgency === 'critical'
                        ? 'border-red-200 bg-linear-to-r from-red-50 to-red-50/40 text-red-600 shadow-[0_1px_4px_rgba(239,68,68,0.15)]'
                        : row.urgency === 'urgent'
                          ? 'border-orange-200 bg-linear-to-r from-orange-50 to-orange-50/40 text-orange-600 shadow-[0_1px_4px_rgba(249,115,22,0.15)]'
                          : row.urgency === 'high'
                            ? 'border-amber-200 bg-linear-to-r from-amber-50 to-amber-50/40 text-amber-600 shadow-[0_1px_4px_rgba(245,158,11,0.15)]'
                            : row.urgency === 'low'
                              ? 'border-slate-200 bg-linear-to-r from-slate-50 to-slate-50/40 text-slate-500'
                              : 'border-primary/15 bg-linear-to-r from-primary/10 to-primary/3 text-primary shadow-[0_1px_4px_rgba(0,0,0,0.06)]';

                return (
                    <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${priorityClass}`}
                    >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_0_3px_currentColor] opacity-90" />
                        {value}
                    </span>
                );
            },
        },

        {
            key: 'formattedCreatedDate',
            header: 'Submitted',
            sortable: true,
            sortKey: 'created_at',

            render: (value) => (
                <div className="whitespace-nowrap">
                    <p className="text-xs font-bold text-text-primary">
                        {value}
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-text-secondary">
                        Submitted
                    </p>
                </div>
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
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-linear-to-r from-amber-50 to-amber-50/40 px-2.5 py-1.5 shadow-[0_1px_4px_rgba(245,158,11,0.12)]">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />

                            <span className="whitespace-nowrap text-[10px] font-extrabold text-amber-700">
                                Assignment pending
                            </span>
                        </div>
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
                            className="group flex max-w-full items-center gap-2.5 rounded-xl border border-primary/15 bg-linear-to-r from-primary/6 to-primary/2 px-2.5 py-2 text-left shadow-sm transition-all hover:-translate-y-px hover:border-primary/25 hover:from-primary/10 hover:to-primary/4 hover:shadow-md disabled:cursor-default disabled:hover:translate-y-0"
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/30">
                                <Building2 size={13} strokeWidth={1.9} />
                            </span>

                            <span className="min-w-0">
                                <span className="block truncate text-[10px] font-extrabold uppercase tracking-wide text-primary/70">
                                    Organization
                                </span>

                                <span className="block truncate text-xs font-extrabold text-primary group-hover:underline">
                                    {assignment.label}
                                </span>
                            </span>
                        </button>
                    );
                }

                return (
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        Not assigned
                    </span>
                );
            },
        },

        {
            key: 'statusLabel',
            header: 'Status',
            sortable: true,
            sortKey: 'status',

            render: (value, row) => {
                const statusClass =
                    row.status === 'completed'
                        ? 'border-emerald-200 bg-linear-to-r from-emerald-50 to-emerald-50/40 text-emerald-700 shadow-[0_1px_4px_rgba(16,185,129,0.15)]'
                        : row.status === 'rejected'
                          ? 'border-red-200 bg-linear-to-r from-red-50 to-red-50/40 text-red-600 shadow-[0_1px_4px_rgba(239,68,68,0.15)]'
                          : row.status === 'pending'
                            ? 'border-amber-200 bg-linear-to-r from-amber-50 to-amber-50/40 text-amber-700 shadow-[0_1px_4px_rgba(245,158,11,0.15)]'
                            : row.status === 'verified'
                              ? 'border-blue-200 bg-linear-to-r from-blue-50 to-blue-50/40 text-blue-700 shadow-[0_1px_4px_rgba(59,130,246,0.15)]'
                              : 'border-primary/15 bg-linear-to-r from-primary/10 to-primary/3 text-primary shadow-[0_1px_4px_rgba(0,0,0,0.06)]';

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-extrabold ${statusClass}`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        {value}
                    </span>
                );
            },
        },

        {
            key: 'actions',
            header: 'Actions',
            align: 'right',

            render: (_, row) => {
                const canEdit = row.status === 'pending';
                const canDelete = row.status === 'pending';

                return (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="rounded-lg border border-transparent px-2.5 py-1.5 text-[10px] font-extrabold text-text-secondary transition-all hover:border-primary/15 hover:bg-primary/6 hover:text-primary"
                        >
                            View
                        </button>

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                disabled={deleteLoading}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-[10px] font-extrabold text-text-secondary transition-all hover:border-primary/15 hover:bg-primary/6 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Pencil size={11} />
                                Edit
                            </button>
                        )}

                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                disabled={deleteLoading}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-[10px] font-extrabold text-red-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={11} />
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
        <div className="min-h-full bg-linear-to-b from-primary/[0.035] via-background to-background pb-14">
            <div className="mx-auto w-full max-w-400 space-y-10 px-4 py-7 sm:px-6 lg:px-8">
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

                <section>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-linear-to-r from-primary/10 to-primary/3 px-3 py-1.5 shadow-sm">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_3px_rgba(0,0,0,0.04)]" />

                                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-primary">
                                    Personal support
                                </span>
                            </div>

                            <PageHeader
                                title="My Help Requests"
                                subtitle="Track the requests you've submitted, follow their progress, and stay connected with the organizations helping you."
                            />
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredHelpRequests.length === 0}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-extrabold text-text-primary shadow-sm transition-all hover:-translate-y-px hover:border-primary/25 hover:bg-primary/4 hover:text-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                            >
                                <Download size={15} strokeWidth={1.8} />
                                Export
                            </button>

                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-hover px-5 text-xs font-extrabold text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary/30"
                            >
                                <Plus size={16} strokeWidth={2.2} />
                                New Request
                            </button>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    REQUEST OVERVIEW
                ====================================================== */}

                <section>
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-text-secondary">
                                Request overview
                            </p>

                            <h2 className="mt-1.5 text-xl font-extrabold tracking-tight text-text-primary">
                                Where your requests stand
                            </h2>
                        </div>

                        {statistics.total > 0 && (
                            <p className="hidden text-xs font-medium text-text-secondary sm:block">
                                Updated from your submitted requests
                            </p>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
                        {/* Top summary */}

                        <div className="grid border-b border-border lg:grid-cols-[280px_1fr]">
                            {/* Total */}

                            <div className="relative overflow-hidden border-b border-border bg-linear-to-br from-primary/9 via-primary/3 to-white px-7 py-7 lg:border-b-0 lg:border-r sm:px-8">
                                <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-linear-to-br from-primary/20 to-primary/5 blur-[2px]" />

                                <div className="absolute bottom-0 right-8 h-12 w-12 translate-y-7 rounded-full bg-primary/6" />

                                <div className="relative">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-text-secondary">
                                                Total submitted
                                            </span>

                                            <p className="mt-1 text-[10px] font-medium text-text-secondary">
                                                Your request history
                                            </p>
                                        </div>

                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-white text-primary shadow-md">
                                            <ArrowUpRight
                                                size={15}
                                                strokeWidth={1.8}
                                            />
                                        </span>
                                    </div>

                                    <div className="mt-6 flex items-end gap-3">
                                        <span className="bg-linear-to-br from-text-primary to-text-primary/70 bg-clip-text text-5xl font-extrabold leading-none tracking-[-0.055em] text-transparent">
                                            {statistics.total}
                                        </span>

                                        <span className="mb-0.5 text-xs font-semibold text-text-secondary">
                                            requests
                                        </span>
                                    </div>

                                    <p className="mt-4 max-w-50 text-xs leading-5 text-text-secondary">
                                        Every request you have submitted through
                                        Stand For People.
                                    </p>
                                </div>
                            </div>

                            {/* Active status area */}

                            <div className="px-6 py-7 sm:px-8">
                                <div className="mb-7 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-extrabold text-text-primary">
                                            Active request flow
                                        </p>

                                        <p className="mt-1 text-[11px] text-text-secondary">
                                            Requests currently moving through
                                            support
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-linear-to-r from-primary/12 to-primary/4 px-2.5 py-1 text-[10px] font-extrabold text-primary shadow-sm">
                                        {statistics.pending +
                                            statistics.verified +
                                            statistics.assigned}{' '}
                                        active
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-3 right-3 top-3 h-px bg-linear-to-r from-amber-200 via-blue-200 to-primary/30" />

                                    <div className="relative grid grid-cols-3 gap-5">
                                        {/* Pending */}

                                        <div>
                                            <div className="flex items-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-amber-400 to-amber-500 shadow-md ring-1 ring-amber-100">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-2xl font-extrabold tracking-tight text-text-primary">
                                                    {statistics.pending}
                                                </p>

                                                <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-text-secondary">
                                                    Pending
                                                </p>

                                                <p className="mt-2 hidden text-[11px] leading-4 text-text-secondary sm:block">
                                                    Waiting for review
                                                </p>
                                            </div>
                                        </div>

                                        {/* Verified */}

                                        <div>
                                            <div className="flex items-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-blue-400 to-blue-500 shadow-md ring-1 ring-blue-100">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-2xl font-extrabold tracking-tight text-text-primary">
                                                    {statistics.verified}
                                                </p>

                                                <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-text-secondary">
                                                    Verified
                                                </p>

                                                <p className="mt-2 hidden text-[11px] leading-4 text-text-secondary sm:block">
                                                    Request confirmed
                                                </p>
                                            </div>
                                        </div>

                                        {/* Assigned */}

                                        <div>
                                            <div className="flex items-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-primary to-primary-hover shadow-md ring-1 ring-primary/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <p className="text-2xl font-extrabold tracking-tight text-text-primary">
                                                    {statistics.assigned}
                                                </p>

                                                <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-text-secondary">
                                                    Assigned
                                                </p>

                                                <p className="mt-2 hidden text-[11px] leading-4 text-text-secondary sm:block">
                                                    Organization connected
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Outcomes */}

                        <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                            <div className="flex items-center justify-between px-7 py-5 transition-colors hover:bg-linear-to-r hover:from-emerald-50/50 hover:to-transparent sm:px-8">
                                <div className="flex items-center gap-3.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 shadow-sm">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    </span>

                                    <div>
                                        <p className="text-xs font-extrabold text-text-primary">
                                            Completed
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-text-secondary">
                                            Successfully supported requests
                                        </p>
                                    </div>
                                </div>

                                <span className="text-xl font-extrabold tracking-tight text-emerald-600">
                                    {statistics.completed}
                                </span>
                            </div>

                            <div className="flex items-center justify-between px-7 py-5 transition-colors hover:bg-linear-to-r hover:from-red-50/50 hover:to-transparent sm:px-8">
                                <div className="flex items-center gap-3.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-linear-to-br from-red-50 to-red-100/50 text-red-500 shadow-sm">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                    </span>

                                    <div>
                                        <p className="text-xs font-extrabold text-text-primary">
                                            Rejected
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-text-secondary">
                                            Requests that could not proceed
                                        </p>
                                    </div>
                                </div>

                                <span className="text-xl font-extrabold tracking-tight text-red-500">
                                    {statistics.rejected}
                                </span>
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

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
                    {/* Workspace heading */}

                    <div className="border-b border-border bg-linear-to-r from-primary/3 to-transparent px-6 py-7 sm:px-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary/12 to-primary/4 px-2.5 py-1 shadow-sm">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                                    <span className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-primary">
                                        Request workspace
                                    </span>
                                </div>

                                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-text-primary">
                                    Your help requests
                                </h2>

                                <p className="mt-1.5 max-w-xl text-xs leading-5 text-text-secondary">
                                    Review your submissions and follow each
                                    request from verification through support.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-border bg-linear-to-br from-slate-50 to-white px-4 py-2.5 shadow-sm">
                                <div className="h-7 w-px bg-border" />

                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-text-secondary">
                                        Showing
                                    </p>

                                    <p className="mt-0.5 text-sm font-extrabold text-text-primary">
                                        {filteredHelpRequests.length}
                                        <span className="ml-1 font-medium text-text-secondary">
                                            requests
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status navigation */}

                    <div className="border-b border-border bg-white px-4 sm:px-6">
                        <HelpRequestCategoryTabs
                            tabs={categoryTabs}
                            activeCategory={activeCategory}
                            onChange={handleCategoryChange}
                        />
                    </div>

                    {/* Filters */}

                    <div className="border-b border-border bg-linear-to-b from-slate-50/80 to-slate-50/40 px-5 py-5 sm:px-6">
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

                    <div className="p-4 sm:p-6">
                        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                            <HelpRequestTable
                                columns={columns}
                                rows={rows}
                                onSort={handleSort}
                                getSortIcon={getSortIcon}
                                resultCount={filteredHelpRequests.length}
                            />
                        </div>
                    </div>

                    {/* Pagination */}

                    {filteredHelpRequests.length > 0 && (
                        <div className="border-t border-border bg-linear-to-b from-slate-50/60 to-slate-50/20 px-5 py-4 sm:px-6">
                            <HelpRequestPagination
                                currentPage={safeCurrentPage}
                                totalPages={totalPages}
                                totalItems={filteredHelpRequests.length}
                                itemsPerPage={HELP_REQUESTS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
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
