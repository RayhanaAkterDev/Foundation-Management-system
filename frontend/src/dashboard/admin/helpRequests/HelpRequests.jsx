import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Download,
    Search,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { SlidersHorizontal } from 'lucide-react';

import HelpRequestStats from './components/Stats';
import HelpRequestFilters from './components/Filters';
import HelpRequestTable from './components/Table';
import HelpRequestPagination from './components/Pagination';

import HelpRequestVerificationModal from './modals/VerificationModal';
import HelpRequestAssignmentModal from './modals/AssignmentModal';
import ActionMessageModal from './modals/ActionMessageModal';

import {
    fetchHelpRequests,
    updateHelpRequestVerification,
    assignHelpRequest,
    fetchOrganizations,
    fetchVolunteers,
} from './api/helpRequestAPI';

const HELP_REQUESTS_PER_PAGE = 25;

const HelpRequests = () => {
    const navigate = useNavigate();

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
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [statusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // --------------------------------
    // Verification
    // --------------------------------

    const [selectedVerificationRequest, setSelectedVerificationRequest] =
        useState(null);

    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    // --------------------------------
    // Initial Assignment
    // --------------------------------

    const [selectedAssignmentRequest, setSelectedAssignmentRequest] =
        useState(null);

    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [assignmentError, setAssignmentError] = useState('');

    const [organizations, setOrganizations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [assignmentDataLoading, setAssignmentDataLoading] = useState(false);

    // --------------------------------
    // Action message
    // --------------------------------

    const [actionMessage, setActionMessage] = useState({
        show: false,
        title: '',
        message: '',
    });

    const seenRejectedAssignmentsRef = useRef(new Set());

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
    };

    // --------------------------------
    // Action message helpers
    // --------------------------------

    const showActionMessage = (title, message) => {
        setActionMessage({
            show: true,
            title,
            message,
        });
    };

    const closeActionMessage = () => {
        setActionMessage({
            show: false,
            title: '',
            message: '',
        });
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

    // --------------------------------
    // Initial data + polling
    // --------------------------------

    useEffect(() => {
        let cancelled = false;

        const checkForUpdates = async (isInitialLoad = false) => {
            try {
                const helpRequestData = await fetchHelpRequests();

                if (cancelled) {
                    return;
                }

                const requests = helpRequestData.helpRequests || [];

                if (isInitialLoad) {
                    const existingRejectedIds = new Set();

                    requests.forEach((request) => {
                        const assignments = Array.isArray(request?.assignments)
                            ? request.assignments
                            : [];

                        assignments.forEach((assignment) => {
                            if (
                                assignment?.organization_id &&
                                String(assignment?.status)
                                    .trim()
                                    .toLowerCase() === 'rejected'
                            ) {
                                existingRejectedIds.add(assignment.id);
                            }
                        });
                    });

                    seenRejectedAssignmentsRef.current = existingRejectedIds;

                    setHelpRequests(requests);

                    return;
                }

                requests.forEach((request) => {
                    const assignments = Array.isArray(request?.assignments)
                        ? request.assignments
                        : [];

                    assignments.forEach((assignment) => {
                        const isRejected =
                            assignment?.organization_id &&
                            String(assignment?.status).trim().toLowerCase() ===
                                'rejected';

                        if (
                            !isRejected ||
                            seenRejectedAssignmentsRef.current.has(
                                assignment.id,
                            )
                        ) {
                            return;
                        }

                        seenRejectedAssignmentsRef.current.add(assignment.id);

                        const organizationName =
                            assignment?.organization?.name ||
                            assignment?.organization?.user?.name ||
                            'The assigned organization';

                        const requestTitle =
                            request?.title ||
                            assignment?.help_request?.title ||
                            'this help request';

                        const rejectionReason =
                            assignment?.rejection_note ||
                            'No rejection reason was provided.';

                        showActionMessage(
                            'Organization rejected assignment',
                            `${organizationName} rejected "${requestTitle}". Reason: ${rejectionReason}`,
                        );
                    });
                });

                setHelpRequests(requests);
            } catch (err) {
                if (!isInitialLoad || cancelled) {
                    return;
                }

                setError(
                    err.message ||
                        'Something went wrong while loading help requests.',
                );
            }
        };

        const loadInitialRequests = async () => {
            try {
                setLoading(true);
                setError('');

                await checkForUpdates(true);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialRequests();

        const intervalId = window.setInterval(() => {
            checkForUpdates(false);
        }, 10000);

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
        };
    }, []);

    // --------------------------------
    // View / Edit
    // --------------------------------

    const handleViewRequest = (request) => {
        if (request?.id == null) return;

        navigate(
            `/admin/dashboard/help-requests/${encodeURIComponent(request.id)}`,
        );
    };

    const handleEditRequest = (request) => {
        if (request?.id == null) return;

        navigate(
            `/admin/dashboard/help-requests/${encodeURIComponent(request.id)}/edit`,
        );
    };

    // --------------------------------
    // Verification
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
    // Initial Assignment
    // --------------------------------

    const handleAssignRequest = async (request) => {
        setAssignmentError('');
        setSelectedAssignmentRequest(request);
        setAssignmentDataLoading(true);

        try {
            const [organizationData, volunteerData] = await Promise.all([
                fetchOrganizations(),
                fetchVolunteers(),
            ]);

            setOrganizations(organizationData.organizations || []);
            setVolunteers(volunteerData.volunteers || []);
        } catch (err) {
            setOrganizations([]);
            setVolunteers([]);

            setAssignmentError(
                err.message ||
                    'Unable to load organizations and volunteers for assignment.',
            );
        } finally {
            setAssignmentDataLoading(false);
        }
    };

    const closeAssignmentModal = () => {
        if (assignmentLoading || assignmentDataLoading) {
            return;
        }

        setSelectedAssignmentRequest(null);
        setAssignmentError('');
        setOrganizations([]);
        setVolunteers([]);
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
            setOrganizations([]);
            setVolunteers([]);

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
                (request) =>
                    request.status === 'verified' &&
                    hasActiveOrganizationAssignment(request),
            ).length,

            inProgress: helpRequests.filter(
                (request) => request.status === 'in_progress',
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
                key: 'in_progress',
                label: 'In Progress',
                count: statistics.inProgress,
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
            result = result.filter((request) => {
                if (activeCategory === 'pending') {
                    return request.status === 'pending';
                }

                return request.status === activeCategory;
            });
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

        if (assignmentFilter !== 'all') {
            result = result.filter((request) => {
                const assigned = hasExistingAssignment(request);

                return assignmentFilter === 'assigned' ? assigned : !assigned;
            });
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
        assignmentFilter,
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

    const handleAssignmentChange = (event) => {
        setAssignmentFilter(event.target.value);
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
            'Assigned',
            'Status',
            'Submitted',
        ];

        const csvRows = filteredHelpRequests.map((request) => [
            request.user?.name || request.requester?.name || '',
            request.title || '',
            request.category || '',
            request.priority || request.urgency || '',
            getAssignedOrganizationName(request),
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

        assignedOrganization: getAssignedOrganizationName(request),

        assignedOrganizationId: getAssignedOrganizationId(request),

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
            key: 'title',
            header: 'Help Request Details',
            sortable: true,
            sortKey: 'title',
            width: '420px',
        },

        {
            key: 'submittedDate',
            header: 'Submitted',
            sortable: true,
            sortKey: 'created_at',
            width: '120px',
        },

        {
            key: 'priority',
            header: 'Priority',
            sortable: true,
            sortKey: 'priority',
            width: '120px',
            render: (value, row) => value || row.urgency || '—',
        },

        {
            key: 'assignedOrganization',
            header: 'Assigned',
            width: '220px',
            render: (value) => value || 'Not assigned',
        },

        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: '150px',
            render: (value) => value || '—',
        },

        {
            key: 'id',
            header: 'Actions',
            align: 'right',
            width: '300px',

            render: (_, row) => {
                const hasAssignment = hasExistingAssignment(row);
                const hasPendingOrganization =
                    hasPendingOrganizationAssignment(row);

                return (
                    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
                        {/* VIEW */}
                        <button
                            type="button"
                            onClick={() => handleViewRequest(row)}
                            className="shrink-0 text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                        >
                            View
                        </button>

                        {/* EDIT */}
                        <button
                            type="button"
                            onClick={() => handleEditRequest(row)}
                            className="shrink-0 text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                        >
                            Edit
                        </button>

                        {/* VERIFY */}
                        {row.status === 'pending' && (
                            <button
                                type="button"
                                onClick={() => handleVerifyRequest(row)}
                                className="shrink-0 text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                            >
                                Verify
                            </button>
                        )}

                        {/* INITIAL ASSIGNMENT */}
                        {row.status === 'verified' &&
                            !hasAssignment &&
                            !hasPendingOrganization && (
                                <button
                                    type="button"
                                    onClick={() => handleAssignRequest(row)}
                                    className="shrink-0 text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                                >
                                    Assign
                                </button>
                            )}
                    </div>
                );
            },
        },
    ];

    // --------------------------------
    // Loading
    // --------------------------------

    if (loading || error) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Help Requests"
                    subtitle="Verify requests and coordinate assistance through organizations and SP volunteers."
                />

                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading help requests..."
                        description="Please wait while we retrieve the request list."
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

    // --------------------------------
    // Render
    // --------------------------------

    return (
        <>
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Help Requests"
                    subtitle="Verify requests and coordinate assistance through organizations and SP volunteers."
                    action={
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            disabled={filteredHelpRequests.length === 0}
                            className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-transparent px-4 text-[12px] font-medium! text-[#B8C2CF] hover:border-[#4B596A] hover:bg-[#1C232D] disabled:opacity-40"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    }
                />

                <ActionMessageModal
                    show={actionMessage.show}
                    title={actionMessage.title}
                    message={actionMessage.message}
                    onClose={closeActionMessage}
                />

                {/* Help Request Overview */}

                <HelpRequestStats
                    total={statistics.total}
                    pending={statistics.pending}
                    verified={statistics.verified}
                    inProgress={statistics.inProgress}
                    completed={statistics.completed}
                    rejected={statistics.rejected}
                />

                {/* HELP REQUEST MANAGEMENT */}

                <section className="pt-2 lg:pt-3">
                    <div className="flex flex-col gap-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
                        <div className="min-w-0">
                            <h2 className="font-sans! text-[20px]! font-semibold! leading-tight! tracking-[-0.02em] text-[#EEF1F5]!">
                                Help Request Directory
                            </h2>

                            <p className="mt-2 max-w-xl text-[12px] leading-[1.65] text-[#8792A1]">
                                Browse and manage submitted help requests.
                            </p>
                        </div>
                    </div>

                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-10 w-full items-center justify-between border border-[#29323E] bg-[#0E1219] px-3.5 text-[11px] text-[#AEB7C3] hover:bg-[#151B24]"
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={14} />
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

                                <HelpRequestFilters
                                    categoryTabs={categoryTabs}
                                    activeCategory={activeCategory}
                                    onCategoryChange={handleCategoryChange}
                                    categoryFilter={categoryFilter}
                                    priorityFilter={priorityFilter}
                                    assignmentFilter={assignmentFilter}
                                    helpRequests={helpRequests}
                                    onCategoryFilterChange={
                                        handleCategoryFilterChange
                                    }
                                    onPriorityChange={handlePriorityChange}
                                    onAssignmentChange={handleAssignmentChange}
                                    onClearFilters={() => {
                                        handleCategoryChange('all');

                                        handleCategoryFilterChange({
                                            target: { value: 'all' },
                                        });

                                        handlePriorityChange({
                                            target: { value: 'all' },
                                        });

                                        handleAssignmentChange({
                                            target: { value: 'all' },
                                        });
                                    }}
                                />

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

                    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        {/* TABLE */}

                        <div className="relative min-h-0 min-w-0 xl:h-full">
                            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                                <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                    <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="relative">
                                                <Search
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#697586]"
                                                />

                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                    placeholder="Search by request, requester or email"
                                                    className="h-10 w-full border border-[#35404E] bg-[#0E1219] pl-9 pr-4 text-[12px] text-[#DCE3EC] outline-none placeholder:text-[#697586] hover:border-[#455160] focus:border-[#455160]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-3">
                                            <span className="hidden h-7 border-l border-[#303A47] lg:block" />

                                            <span className="text-[11px] font-medium text-[#AAB3BF]">
                                                {filteredHelpRequests.length}{' '}
                                                {filteredHelpRequests.length ===
                                                1
                                                    ? 'result'
                                                    : 'results'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0A0E14] [&::-webkit-scrollbar-thumb]:bg-[#303A47] hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]">
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

                                {filteredHelpRequests.length > 0 && (
                                    <div className="shrink-0 border-t border-[#252D38] bg-[#1A222D]">
                                        <HelpRequestPagination
                                            currentPage={safeCurrentPage}
                                            totalPages={totalPages}
                                            totalItems={
                                                filteredHelpRequests.length
                                            }
                                            itemsPerPage={
                                                HELP_REQUESTS_PER_PAGE
                                            }
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DESKTOP FILTERS */}

                        <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block">
                            <HelpRequestFilters
                                categoryTabs={categoryTabs}
                                activeCategory={activeCategory}
                                onCategoryChange={handleCategoryChange}
                                categoryFilter={categoryFilter}
                                priorityFilter={priorityFilter}
                                assignmentFilter={assignmentFilter}
                                helpRequests={helpRequests}
                                onCategoryFilterChange={
                                    handleCategoryFilterChange
                                }
                                onPriorityChange={handlePriorityChange}
                                onAssignmentChange={handleAssignmentChange}
                                onClearFilters={() => {
                                    handleCategoryChange('all');

                                    handleCategoryFilterChange({
                                        target: { value: 'all' },
                                    });

                                    handlePriorityChange({
                                        target: { value: 'all' },
                                    });

                                    handleAssignmentChange({
                                        target: { value: 'all' },
                                    });
                                }}
                            />
                        </aside>
                    </div>
                </section>
            </div>

            {/* SUCCESS TOAST */}

            <SuccessDialog
                open={toast.show}
                title="Action completed"
                message={toast.message}
                onClose={() => setToast({ show: false, message: '' })}
            />

            {/* VERIFICATION */}

            <HelpRequestVerificationModal
                request={selectedVerificationRequest}
                loading={verificationLoading}
                error={verificationError}
                onClose={closeVerificationModal}
                onConfirm={handleVerificationChange}
            />

            {/* INITIAL ASSIGNMENT */}

            <HelpRequestAssignmentModal
                request={selectedAssignmentRequest}
                organizations={organizations}
                volunteers={volunteers}
                loading={assignmentLoading || assignmentDataLoading}
                error={assignmentError}
                onClose={closeAssignmentModal}
                onConfirm={handleAssignment}
            />
        </>
    );
};

/*
|--------------------------------------------------------------------------
| Assignment status helpers
|--------------------------------------------------------------------------
*/

const normalizeAssignmentStatus = (status) => {
    return String(status || '')
        .trim()
        .toLowerCase();
};

const isPendingOrganizationAssignment = (assignment) => {
    if (!assignment?.organization_id && !assignment?.organization) {
        return false;
    }

    return normalizeAssignmentStatus(assignment.status) === 'pending';
};

const isActiveOrganizationAssignment = (assignment) => {
    if (!assignment?.organization_id && !assignment?.organization) {
        return false;
    }

    return ['assigned', 'accepted', 'in_progress', 'completed'].includes(
        normalizeAssignmentStatus(assignment.status),
    );
};

const getOrganizationAssignments = (request) => {
    if (!request) {
        return [];
    }

    const assignments = [];

    if (Array.isArray(request.assignments)) {
        assignments.push(...request.assignments);
    }

    if (request.assignment) {
        assignments.push(request.assignment);
    }

    return assignments.filter((assignment, index, array) => {
        const assignmentId = assignment?.id;

        if (!assignmentId) {
            return index === array.indexOf(assignment);
        }

        return index === array.findIndex((item) => item?.id === assignmentId);
    });
};

const hasExistingAssignment = (request) => {
    if (!request) {
        return false;
    }

    const organizationAssignments = getOrganizationAssignments(request);

    const hasActiveOrganization = organizationAssignments.some(
        isActiveOrganizationAssignment,
    );

    if (hasActiveOrganization) {
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

const hasPendingOrganizationAssignment = (request) => {
    return getOrganizationAssignments(request).some(
        isPendingOrganizationAssignment,
    );
};

const hasActiveOrganizationAssignment = (request) => {
    return getOrganizationAssignments(request).some(
        isActiveOrganizationAssignment,
    );
};

const getAssignedOrganizationName = (request) => {
    if (!request) {
        return 'Not assigned';
    }

    const organizationAssignments = getOrganizationAssignments(request);

    const pendingAssignment = organizationAssignments.find(
        isPendingOrganizationAssignment,
    );

    if (pendingAssignment) {
        return 'Assignment Pending';
    }

    const activeAssignment = organizationAssignments.find(
        isActiveOrganizationAssignment,
    );

    if (activeAssignment?.organization?.name) {
        return activeAssignment.organization.name;
    }

    if (activeAssignment?.organization?.user?.name) {
        return activeAssignment.organization.user.name;
    }

    if (
        organizationAssignments.length === 0 &&
        request.assigned_organization?.name
    ) {
        return request.assigned_organization.name;
    }

    if (
        organizationAssignments.length === 0 &&
        typeof request.assigned_organization === 'string'
    ) {
        return request.assigned_organization;
    }

    return 'Not assigned';
};

const getAssignedOrganizationId = (request) => {
    if (!request) {
        return null;
    }

    const organizationAssignments = getOrganizationAssignments(request);

    const activeAssignment = organizationAssignments.find(
        isActiveOrganizationAssignment,
    );

    if (activeAssignment?.organization?.id) {
        return activeAssignment.organization.id;
    }

    if (activeAssignment?.organization_id) {
        return activeAssignment.organization_id;
    }

    if (organizationAssignments.length === 0) {
        if (request.assigned_organization?.id) {
            return request.assigned_organization.id;
        }

        if (request.assigned_organization_id) {
            return request.assigned_organization_id;
        }
    }

    return null;
};

export default HelpRequests;
