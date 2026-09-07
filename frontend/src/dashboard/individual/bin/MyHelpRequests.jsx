import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

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

const STATUS_LABELS = {
    pending: 'Pending',
    verified: 'Verified',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
};

const URGENCY_LABELS = {
    critical: 'Critical',
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
};

const URGENCY_STYLES = {
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

const STATUS_STYLES = {
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

const ACCEPTED_ASSIGNMENT_STATUSES = new Set([
    'assigned',
    'accepted',
    'active',
    'in_progress',
    'completed',
]);

// =========================================================
// Helpers
// =========================================================

const normalizeHelpRequest = (request) => {
    if (!request) {
        return request;
    }

    const verificationNote = request.verification_note || '';

    return {
        ...request,
        title: request.title || '',
        description: request.description || '',
        category: request.category || '',
        urgency: request.urgency || 'normal',
        district: request.district || '',
        address: request.address || '',
        status: request.status || '',
        verification_note: verificationNote,
        verificationNote,
        notes: verificationNote,
        assignments: Array.isArray(request.assignments)
            ? request.assignments
            : [],
    };
};

const normalizeHelpRequests = (requests) =>
    Array.isArray(requests) ? requests.map(normalizeHelpRequest) : [];

const getStatusLabel = (status) => STATUS_LABELS[status] || status || '—';

const getUrgencyLabel = (urgency) =>
    URGENCY_LABELS[urgency] || urgency || 'Normal';

const getAssignmentInfo = (request) => {
    const assignments = Array.isArray(request?.assignments)
        ? request.assignments
        : [];

    if (!assignments.length) {
        return {
            state: 'not_assigned',
            label: 'Not assigned',
            currentAssignment: null,
            previousAssignment: null,
        };
    }

    const sortedAssignments = [...assignments].sort(
        (a, b) =>
            (b?.assigned_at ? new Date(b.assigned_at).getTime() : 0) -
            (a?.assigned_at ? new Date(a.assigned_at).getTime() : 0),
    );

    const currentAssignment = sortedAssignments[0];

    if (currentAssignment?.status === 'pending') {
        return {
            state: 'pending',
            label: 'Assignment pending',
            currentAssignment,
            previousAssignment: sortedAssignments[1] || null,
        };
    }

    if (ACCEPTED_ASSIGNMENT_STATUSES.has(currentAssignment?.status)) {
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

    // =========================================================
    // Request workspace height
    // Sidebar's natural content height defines the workspace
    // =========================================================

    const workspaceSidebarRef = useRef(null);
    const [workspaceHeight, setWorkspaceHeight] = useState(null);

    useLayoutEffect(() => {
        const sidebar = workspaceSidebarRef.current;

        if (!sidebar) {
            return undefined;
        }

        const updateWorkspaceHeight = () => {
            if (window.innerWidth < 1024) {
                setWorkspaceHeight(null);
                return;
            }

            const height = sidebar.getBoundingClientRect().height;

            if (height > 0) {
                const nextHeight = Math.ceil(height);

                setWorkspaceHeight((currentHeight) =>
                    currentHeight === nextHeight ? currentHeight : nextHeight,
                );
            }
        };

        updateWorkspaceHeight();

        const resizeObserver = new ResizeObserver(() => {
            updateWorkspaceHeight();
        });

        resizeObserver.observe(sidebar);

        window.addEventListener('resize', updateWorkspaceHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateWorkspaceHeight);
        };
    }, []);

    // =========================================================
    // Success toast
    // =========================================================

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

    // =========================================================
    // Organization drawer
    // =========================================================

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

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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

    const handleView = (request) => setSelectedRequest(request);
    const handleCloseDetails = () => setSelectedRequest(null);

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

        setSelectedRequest((currentRequest) =>
            currentRequest?.id === formattedRequest.id
                ? formattedRequest
                : currentRequest,
        );

        showSuccessToast('Your help request was updated successfully.');
    };

    // =========================================================
    // DELETE
    // =========================================================

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

    // =========================================================
    // Statistics
    // =========================================================

    const statistics = useMemo(() => {
        const stats = {
            total: helpRequests.length,
            pending: 0,
            verified: 0,
            assigned: 0,
            completed: 0,
            rejected: 0,
        };

        helpRequests.forEach(({ status }) => {
            if (status in stats) {
                stats[status] += 1;
            }
        });

        return stats;
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
        const search = searchTerm.trim().toLowerCase();

        const result = helpRequests.filter((request) => {
            if (activeCategory !== 'all' && request.status !== activeCategory) {
                return false;
            }

            if (
                categoryFilter !== 'all' &&
                request.category !== categoryFilter
            ) {
                return false;
            }

            if (
                priorityFilter !== 'all' &&
                request.urgency !== priorityFilter
            ) {
                return false;
            }

            if (statusFilter !== 'all' && request.status !== statusFilter) {
                return false;
            }

            if (!search) {
                return true;
            }

            return [
                request.title,
                request.description,
                request.category,
                request.district,
                request.address,
            ].some((value) =>
                String(value || '')
                    .toLowerCase()
                    .includes(search),
            );
        });

        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        const { key, direction } = sortConfig;
        const multiplier = direction === 'asc' ? 1 : -1;

        result.sort((a, b) => {
            let first = a[key];
            let second = b[key];

            if (key === 'created_at' || key === 'updated_at') {
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
                return -1 * multiplier;
            }

            if (first > second) {
                return 1 * multiplier;
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

        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} strokeWidth={2} />
        ) : (
            <ArrowDown size={14} strokeWidth={2} />
        );
    };

    // =========================================================
    // CSV export
    // =========================================================

    const handleExportCSV = () => {
        if (!filteredHelpRequests.length) {
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
            width: '35%',
            render: (value, row) => {
                const urgency =
                    URGENCY_STYLES[row.urgency] || URGENCY_STYLES.normal;

                return (
                    <div className="min-w-0 py-5 pr-8">
                        <p className="truncate text-[15px] font-medium underline leading-5.5 tracking-[-0.01em] text-text-primary">
                            {value || 'Untitled help request'}
                        </p>

                        <p className="mt-1.5 line-clamp-2 text-[12px] font-normal leading-5 text-text-secondary">
                            {row.description || 'No description provided.'}
                        </p>

                        <div className="mt-3 flex min-w-0 items-center gap-2 text-[11px]">
                            {row.category && (
                                <>
                                    <span className="truncate font-semibold capitalize text-primary">
                                        {row.category}
                                    </span>
                                </>
                            )}

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

                        <div className="truncate font-medium text-text-secondary">
                            {row.locationName || 'Location not specified'}

                            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                            <span className="text-[10px] underline tracking-wide ml-2 font-semibold text-text-secondary/80">
                                {row.formattedCreatedDate}
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
            width: '10%',
            render: (value, row) => {
                const status = STATUS_STYLES[row.status] || {
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
            width: '12%',
            render: (value, row) => {
                if (value?.state === 'pending') {
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

                if (value?.state === 'accepted') {
                    return (
                        <div className="py-5">
                            <button
                                type="button"
                                onClick={() =>
                                    handleViewOrganization(value, row)
                                }
                                disabled={
                                    !value.currentAssignment?.organization
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
                                        {value.label}
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
            width: '24%',
            render: (_, row) => {
                const canEdit = row.status === 'pending';
                const canDelete = row.status === 'pending';

                return (
                    <div className="flex items-center justify-end gap-1 py-5">
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
                <HelpRequestSuccessToast
                    show={successToast.show}
                    message={successToast.message}
                />

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}

                <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-[#edf4f4]">
                    <div className="flex flex-col lg:flex-row">
                        {/* =================================================
                            MAIN HEADER
                        ================================================== */}

                        <div className="relative flex min-w-0 flex-1 items-center overflow-hidden bg-primary px-7 py-9 sm:px-9 sm:py-10 lg:px-10 lg:py-11">
                            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-28 border-white/[0.035]" />

                            <div className="pointer-events-none absolute -bottom-28 -left-16 h-52 w-52 rounded-full bg-white/2.5" />

                            <div className="relative max-w-2xl">
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>

                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                                        Personal support
                                    </span>

                                    <span className="h-px w-10 bg-white/20" />
                                </div>

                                <h1 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]">
                                    My Help Requests
                                </h1>

                                <p className="mt-4 max-w-xl text-[14px] font-medium leading-6 text-white/70 sm:text-[15px] sm:leading-7">
                                    Track the requests you've submitted, follow
                                    their progress, and stay connected with the
                                    organizations helping you.
                                </p>

                                <div className="mt-7 flex items-center gap-1.5">
                                    <span className="h-1 w-8 rounded-full bg-white/75" />
                                    <span className="h-1 w-2 rounded-full bg-white/30" />
                                    <span className="h-1 w-2 rounded-full bg-white/15" />
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            QUICK ACTIONS
                        ================================================== */}

                        <div className="flex shrink-0 items-center border-t border-primary/10 bg-[#f4f8f8] px-7 py-7 sm:px-9 lg:w-85 lg:border-l lg:border-t-0 lg:px-8">
                            <div className="w-full">
                                <div className="mb-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                            Quick actions
                                        </span>

                                        <span className="h-px flex-1 bg-primary/10" />
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-text-primary">
                                        Manage your support activity
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5 sm:gap-3">
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

                                    <button
                                        type="button"
                                        onClick={handleExportCSV}
                                        disabled={
                                            filteredHelpRequests.length === 0
                                        }
                                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-white text-text-primary shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-primary/4 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
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
                        HEADER FOOTER STRIP
                    ================================================== */}

                    <div className="flex h-16 items-center justify-between border-t border-primary/10 bg-[#e8f1f1] px-7 sm:px-9 lg:px-10">
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                            Manage · Track · Connect
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-6 rounded-full bg-primary/25" />
                            <span className="h-1.5 w-2 rounded-full bg-primary/15" />
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    REQUEST OVERVIEW
                ====================================================== */}

                <section>
                    <div className="mt-12 px-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-primary/50" />

                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Request overview
                                    </p>
                                </div>

                                <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.12] tracking-[-0.03em] text-text-primary sm:text-[27px]">
                                    Where your requests stand
                                </h2>
                            </div>

                            {statistics.total > 0 && (
                                <div className="flex items-center gap-2 pb-0.5">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />

                                    <p className="text-[11px] font-medium leading-5 text-text-secondary">
                                        Updated from your submitted requests
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_5px_24px_rgba(15,23,42,0.04)]">
                        <div className="grid lg:grid-cols-[280px_1fr]">
                            <div className="relative overflow-hidden border-b border-primary/10 bg-primary/7 px-7 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
                                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border-18 border-primary/4.5" />

                                <div className="pointer-events-none absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-primary/2.5" />

                                <div className="relative">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                                                Total submitted
                                            </p>

                                            <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                                                Your request history
                                            </p>
                                        </div>

                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-white text-primary shadow-sm">
                                            <ArrowUpRight
                                                size={16}
                                                strokeWidth={1.8}
                                            />
                                        </span>
                                    </div>

                                    <div className="mt-7 flex items-end gap-2.5">
                                        <span className="text-[52px] font-extrabold leading-[0.9] tracking-[-0.045em] text-text-primary">
                                            {statistics.total}
                                        </span>

                                        <span className="mb-0.5 text-xs font-bold text-text-secondary">
                                            requests
                                        </span>
                                    </div>

                                    <p className="mt-35 max-w-57.5 text-xs leading-5 text-text-secondary">
                                        Every request you have submitted through
                                        Stand For People.
                                    </p>

                                    <div className="mt-6 flex items-center gap-1.5">
                                        <span className="h-1 w-7 rounded-full bg-primary/50" />
                                        <span className="h-1 w-2 rounded-full bg-primary/20" />
                                        <span className="h-1 w-2 rounded-full bg-primary/10" />
                                    </div>
                                </div>
                            </div>

                            <div className="min-w-0 bg-white px-6 py-7 sm:px-8 lg:px-9 lg:py-8">
                                <div className="flex items-start justify-between gap-5">
                                    <div>
                                        <p className="text-[15px] font-bold leading-5 text-text-primary">
                                            Active request flow
                                        </p>

                                        <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                                            Requests currently moving through
                                            support
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-lg border border-primary/10 bg-primary/4.5 px-3 py-1.5 text-[11px] font-bold text-primary">
                                        {statistics.pending +
                                            statistics.verified +
                                            statistics.assigned}{' '}
                                        active
                                    </span>
                                </div>

                                <div className="relative mt-9">
                                    <div className="absolute left-3 right-3 top-3 h-px bg-border sm:left-4 sm:right-4" />

                                    <div className="relative grid grid-cols-3">
                                        <div className="min-w-0 text-left">
                                            <div className="flex justify-start">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-amber-500 shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
                                                    {statistics.pending}
                                                </p>

                                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                                    Pending
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                    Waiting for review
                                                </p>
                                            </div>
                                        </div>

                                        <div className="min-w-0 text-center">
                                            <div className="flex justify-center">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
                                                    {statistics.verified}
                                                </p>

                                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                                    Verified
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                    Request confirmed
                                                </p>
                                            </div>
                                        </div>

                                        <div className="min-w-0 text-right">
                                            <div className="flex justify-end">
                                                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-primary shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
                                                    {statistics.assigned}
                                                </p>

                                                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                                    Assigned
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-text-secondary">
                                                    Organization connected
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 grid border-t border-border sm:grid-cols-2">
                                    <div className="flex items-center justify-between gap-5 border-b border-border px-1 py-5 sm:border-b-0 sm:border-r sm:pr-7">
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            </span>

                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold leading-5 text-text-primary">
                                                    Completed
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-5 text-text-secondary">
                                                    Successfully supported
                                                    requests
                                                </p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 text-[21px] font-extrabold leading-none tracking-tight text-emerald-600">
                                            {statistics.completed}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-5 px-1 py-5 sm:pl-7">
                                        <div className="flex min-w-0 items-center gap-3.5">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50">
                                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                            </span>

                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold leading-5 text-text-primary">
                                                    Rejected
                                                </p>

                                                <p className="mt-0.5 text-[11px] leading-5 text-text-secondary">
                                                    Requests that could not
                                                    proceed
                                                </p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 text-[21px] font-extrabold leading-none tracking-tight text-red-500">
                                            {statistics.rejected}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
    REQUEST WORKSPACE
====================================================== */}

                <section className="overflow-hidden h-224! rounded-2xl border border-border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
                    <div
                        className="
            grid
            h-full
            min-w-0
            min-h-0
            lg:grid-cols-[minmax(0,1fr)_300px]
        "
                        style={
                            workspaceHeight
                                ? {
                                      height: `${workspaceHeight}px`,
                                  }
                                : undefined
                        }
                    >
                        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

                        <div
                            className="
                flex
                h-full
                min-w-0
                min-h-0
                flex-col
                bg-primary/7
            "
                        >
                            {/* =================================================
                REQUEST HEADER — FIXED
            ================================================== */}

                            <div className="shrink-0 px-6 pt-12 pb-8 border-b border-border shadow-4xl">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0">
                                        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.035em] text-text-primary">
                                            Help requests
                                        </h2>

                                        <p className="mt-2 max-w-lg text-[13px] leading-5.5 text-text-secondary">
                                            Keep track of the requests you have
                                            submitted and see <br />
                                            where each one currently stands.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 self-start lg:self-auto">
                                        <div>
                                            <div className="text-[24px] font-extrabold leading-none tracking-[-0.03em] text-text-primary">
                                                {filteredHelpRequests.length}
                                            </div>

                                            <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-text-secondary">
                                                Total requests
                                            </div>
                                        </div>

                                        <div className="h-10 w-px bg-border" />

                                        <div>
                                            <div className="text-[13px] font-semibold text-text-primary">
                                                Submitted
                                            </div>

                                            <div className="mt-1 text-[11px] text-text-secondary">
                                                Your request history
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                TABLE DATA — ONLY THIS AREA SCROLLS
            ================================================== */}

                            <div
                                className="
        min-h-0
        min-w-0
        flex-1
        overflow-y-scroll
        overflow-x-hidden
        overscroll-contain
        bg-white
    "
                                style={{
                                    scrollbarGutter: 'stable',
                                }}
                            >
                                <div className="w-full min-w-0 overflow-x-hidden bg-white">
                                    <HelpRequestTable
                                        columns={columns}
                                        rows={rows}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        resultCount={
                                            filteredHelpRequests.length
                                        }
                                    />
                                </div>
                            </div>

                            {/* =================================================
                PAGINATION — FIXED
            ================================================== */}

                            {filteredHelpRequests.length > 0 && (
                                <div className="shrink-0 border-t border-border bg-primary/0.5 px-5 py-4 sm:px-6 lg:px-8">
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

                        {/* =====================================================
            RIGHT SIDEBAR
            Its natural content height defines the workspace
        ====================================================== */}

                        <aside
                            ref={workspaceSidebarRef}
                            className="
                order-first
                min-w-0
                self-start
                overflow-hidden
                border-b
                border-border
                bg-primary/7
                lg:order-none
                lg:border-b-0
                lg:border-l
            "
                        >
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
                    FILTERS
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
