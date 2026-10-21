import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    Clock3,
    Download,
    RotateCcw,
    Search,
    X,
    XCircle,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import { SlidersHorizontal } from 'lucide-react';

import HelpRequestStats from './components/Stats';
import HelpRequestFilters from './components/Filters';
import HelpRequestTable from './components/Table';
import HelpRequestPagination from './components/Pagination';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import HelpRequestVerificationModal from './modals/VerificationModal';
import HelpRequestAssignmentModal from './modals/AssignmentModal';
import HelpRequestReassignmentModal from './modals/ReassignmentModal';

import UserViewModal from './modals/UserViewModal';
import OrganizationViewModal from './modals/OrganizationViewModal';

import {
    fetchHelpRequests,
    updateHelpRequestVerification,
    assignHelpRequest,
    fetchOrganizations,
    fetchVolunteers,
} from './api/helpRequestAPI';

import { fetchUser } from '@/dashboard/admin/users/api/userApi';
import { fetchOrganization } from '@/dashboard/admin/organizations/api/organizationApi';
import { apiRequest } from '@/api/client';

const HELP_REQUESTS_PER_PAGE = 25;

const HelpRequests = () => {
    const navigate = useNavigate();
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --------------------------------
    // Withdrawal requests
    // --------------------------------

    const [withdrawalRequests, setWithdrawalRequests] = useState([]);
    const [withdrawalError, setWithdrawalError] = useState('');

    const [selectedWithdrawalRequest, setSelectedWithdrawalRequest] =
        useState(null);

    const [withdrawalReviewLoading, setWithdrawalReviewLoading] =
        useState(false);

    const [withdrawalReviewError, setWithdrawalReviewError] = useState('');

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
    // View requester
    // --------------------------------

    const [selectedUser, setSelectedUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState('');

    // --------------------------------
    // View organization
    // --------------------------------

    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [organizationLoading, setOrganizationLoading] = useState(false);
    const [organizationError, setOrganizationError] = useState('');

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

    // --------------------------------
    // Assignment / Support data
    // --------------------------------

    const [organizations, setOrganizations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [assignmentDataLoading, setAssignmentDataLoading] = useState(false);

    // --------------------------------
    // Add Support
    // --------------------------------

    const [selectedSupportRequest, setSelectedSupportRequest] = useState(null);
    const [supportError, setSupportError] = useState('');

    // --------------------------------
    // Reassignment
    // --------------------------------

    const [selectedReassignmentRequest, setSelectedReassignmentRequest] =
        useState(null);

    const reassignmentLoading = false;
    const [reassignmentError, setReassignmentError] = useState('');

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
    // Load withdrawal requests
    // --------------------------------

    const loadWithdrawalRequests = async () => {
        try {
            setWithdrawalError('');

            const data = await apiRequest(
                '/admin/help-requests/withdrawal-requests',
            );

            setWithdrawalRequests(data.withdrawalRequests || []);
        } catch (err) {
            setWithdrawalError(
                err.message ||
                    'Unable to load organization withdrawal requests.',
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
                const [helpRequestData, withdrawalData] = await Promise.all([
                    fetchHelpRequests(),
                    apiRequest('/admin/help-requests/withdrawal-requests'),
                ]);

                if (cancelled) {
                    return;
                }

                const requests = helpRequestData.helpRequests || [];
                const pendingWithdrawals =
                    withdrawalData.withdrawalRequests || [];

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
                    setWithdrawalRequests(pendingWithdrawals);

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
                setWithdrawalRequests(pendingWithdrawals);
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
    // Withdrawal review
    // --------------------------------

    const handleReviewWithdrawal = (assignment) => {
        if (!assignment) {
            return;
        }

        setWithdrawalReviewError('');
        setSelectedWithdrawalRequest(assignment);
    };

    const closeWithdrawalReview = () => {
        if (withdrawalReviewLoading) {
            return;
        }

        setSelectedWithdrawalRequest(null);
        setWithdrawalReviewError('');
    };

    const handleWithdrawalDecision = async (decision) => {
        if (!selectedWithdrawalRequest || withdrawalReviewLoading) {
            return;
        }

        setWithdrawalReviewLoading(true);
        setWithdrawalReviewError('');

        try {
            await apiRequest(
                `/admin/help-requests/assignments/${selectedWithdrawalRequest.id}/withdrawal`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        decision,
                    }),
                },
            );

            setWithdrawalRequests((currentRequests) =>
                currentRequests.filter(
                    (item) =>
                        String(item.id) !==
                        String(selectedWithdrawalRequest.id),
                ),
            );

            setSelectedWithdrawalRequest(null);

            await Promise.all([loadHelpRequests(), loadWithdrawalRequests()]);

            if (decision === 'approved') {
                showSuccessToast(
                    'Organization withdrawal approved successfully.',
                );
            } else {
                showSuccessToast('Organization withdrawal request rejected.');
            }
        } catch (err) {
            setWithdrawalReviewError(
                err.message ||
                    `Unable to ${
                        decision === 'approved' ? 'approve' : 'reject'
                    } the withdrawal request.`,
            );
        } finally {
            setWithdrawalReviewLoading(false);
        }
    };

    // Dedicated request pages replace the old View/Edit modals.
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
    // View organization
    // --------------------------------

    const handleViewOrganization = async (organizationId) => {
        if (!organizationId) {
            setOrganizationError('Organization information is unavailable.');
            setSelectedOrganization(null);
            return;
        }

        setOrganizationLoading(true);
        setOrganizationError('');
        setSelectedOrganization(null);

        try {
            const data = await fetchOrganization(organizationId);

            setSelectedOrganization(data.organization);
        } catch (err) {
            setOrganizationError(
                err.message || 'Unable to load organization details.',
            );
        } finally {
            setOrganizationLoading(false);
        }
    };

    const closeOrganizationModal = () => {
        setSelectedOrganization(null);
        setOrganizationError('');
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
    // Add Support
    // --------------------------------

    const handleAddSupportRequest = async (request) => {
        const additionalSupportRequested = hasAdditionalSupportRequest(request);

        if (!additionalSupportRequested) {
            showActionMessage(
                'Additional Support Not Requested',
                'The assigned organization has not requested additional support for this help request.',
            );

            return;
        }

        setSupportError('');
        setSelectedSupportRequest(request);
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

            setSupportError(
                err.message ||
                    'Unable to load organizations and volunteers for additional support.',
            );
        } finally {
            setAssignmentDataLoading(false);
        }
    };

    const closeSupportModal = () => {
        if (assignmentDataLoading) {
            return;
        }

        setSelectedSupportRequest(null);
        setSupportError('');
        setOrganizations([]);
        setVolunteers([]);
    };

    // --------------------------------
    // Reassignment
    // --------------------------------

    const handleReassignRequest = async (request) => {
        const withdrawalRequested = hasOrganizationRequestedWithdrawal(request);

        if (!withdrawalRequested) {
            showActionMessage(
                'Reassignment Not Requested',
                'The assigned organization has not requested withdrawal, so this help request cannot be reassigned yet.',
            );

            return;
        }

        const pendingWithdrawal = getPendingWithdrawalAssignment(request);

        if (pendingWithdrawal) {
            showActionMessage(
                'Withdrawal Awaiting Review',
                'The organization has requested withdrawal, but the request is still waiting for admin review. Approve the withdrawal before reassigning this help request.',
            );

            return;
        }

        setReassignmentError('');
        setSelectedReassignmentRequest(request);
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

            setReassignmentError(
                err.message ||
                    'Unable to load organizations and volunteers for reassignment.',
            );
        } finally {
            setAssignmentDataLoading(false);
        }
    };

    const closeReassignmentModal = () => {
        if (reassignmentLoading || assignmentDataLoading) {
            return;
        }

        setSelectedReassignmentRequest(null);
        setReassignmentError('');
        setOrganizations([]);
        setVolunteers([]);
    };

    const handleReassignment = async () => {
        if (!selectedReassignmentRequest) {
            return;
        }

        setReassignmentError(
            'Reassignment is not connected to an API yet. No changes have been saved.',
        );
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
                (request) =>
                    request.status === 'verified' &&
                    !hasActiveOrganizationAssignment(request),
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

        // Pending category includes both:
        // - request.status === "pending"
        // - organization assignment.status === "pending"
        if (activeCategory !== 'all') {
            result = result.filter((request) => {
                if (activeCategory === 'pending') {
                    return (
                        request.status === 'pending' ||
                        hasPendingOrganizationAssignment(request)
                    );
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

            render: (value, row) => {
                const pendingWithdrawal = getPendingWithdrawalAssignment(row);

                if (pendingWithdrawal) {
                    return (
                        <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-[#D0AA70]">
                            <RotateCcw size={13} strokeWidth={2} />
                            Withdrawal requested
                        </div>
                    );
                }

                return value || '—';
            },
        },

        {
            key: 'id',
            header: 'Actions',
            align: 'right',
            width: '470px',

            render: (_, row) => {
                const hasAssignment = hasExistingAssignment(row);

                const hasPendingOrganization =
                    hasPendingOrganizationAssignment(row);

                const hasActiveOrganization =
                    hasActiveOrganizationAssignment(row);

                const pendingWithdrawal = getPendingWithdrawalAssignment(row);

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

                        {/* WITHDRAWAL REVIEW */}
                        {pendingWithdrawal && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleReviewWithdrawal(pendingWithdrawal)
                                }
                                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#D8B47B] transition-colors hover:text-[#F0C98D]"
                            >
                                <RotateCcw size={13} strokeWidth={2} />
                                Review Withdrawal
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

                        {/* REASSIGN */}
                        {row.status === 'verified' &&
                            hasActiveOrganization &&
                            !pendingWithdrawal && (
                                <button
                                    type="button"
                                    onClick={() => handleReassignRequest(row)}
                                    className="shrink-0 text-xs font-semibold text-amber-600 transition-colors hover:text-[#D0AA70]"
                                >
                                    Reassign
                                </button>
                            )}

                        {/* ADD SUPPORT */}
                        {row.status === 'verified' &&
                            hasActiveOrganization &&
                            !pendingWithdrawal && (
                                <button
                                    type="button"
                                    onClick={() => handleAddSupportRequest(row)}
                                    className="shrink-0 text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                                >
                                    Add Support
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

                {/* --------------------------------
                    Withdrawal Requests
                   -------------------------------- */}

                {withdrawalRequests.length > 0 && (
                    <section className="border border-[#303A47] bg-[#10161F]">
                        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#443723] bg-[#241E15] text-[#D0AA70]">
                                        <RotateCcw size={17} strokeWidth={2} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#D0AA70]">
                                            Action required
                                        </p>

                                        <h2 className="mt-1 text-lg font-bold tracking-tight text-[#E5EAF0]">
                                            Organization withdrawal requests
                                        </h2>

                                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#8792A1]">
                                            An organization has requested to
                                            withdraw from a help request. Review
                                            the reason before deciding whether
                                            to approve or reject the withdrawal.
                                        </p>
                                    </div>
                                </div>

                                <div className="inline-flex w-fit shrink-0 items-center gap-2 border border-[#443723] bg-[#241E15] px-3 py-1.5 text-xs font-medium text-[#D0AA70]">
                                    <Clock3 size={13} />
                                    {withdrawalRequests.length}{' '}
                                    {withdrawalRequests.length === 1
                                        ? 'pending request'
                                        : 'pending requests'}
                                </div>
                            </div>

                            <div className="divide-y divide-[#252D38] border border-[#303A47] bg-[#0E1219]">
                                {withdrawalRequests.map((assignment) => {
                                    const helpRequest =
                                        assignment?.help_request ||
                                        assignment?.helpRequest ||
                                        {};

                                    const organization =
                                        assignment?.organization || {};

                                    const organizationName =
                                        organization?.name ||
                                        organization?.user?.name ||
                                        'Organization unavailable';

                                    const requestTitle =
                                        helpRequest?.title || 'Help request';

                                    const requestedAt =
                                        assignment?.withdrawal_requested_at;

                                    return (
                                        <div
                                            key={assignment.id}
                                            className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold text-[#E5EAF0]">
                                                        {organizationName}
                                                    </span>

                                                    <span className="text-xs text-[#8792A1]">
                                                        requested withdrawal
                                                    </span>
                                                </div>

                                                <p className="mt-1 truncate text-sm font-medium! text-[#E5EAF0]">
                                                    {requestTitle}
                                                </p>

                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8792A1]">
                                                    {requestedAt && (
                                                        <span>
                                                            Requested{' '}
                                                            {formatDateTime(
                                                                requestedAt,
                                                            )}
                                                        </span>
                                                    )}

                                                    {assignment?.withdrawal_reason && (
                                                        <span className="max-w-xl truncate">
                                                            Reason:{' '}
                                                            {
                                                                assignment.withdrawal_reason
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReviewWithdrawal(
                                                        assignment,
                                                    )
                                                }
                                                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 border border-[#343E4B] bg-[#202A36] px-4 text-xs font-medium text-[#E5EAF0] transition-colors hover:bg-[#2A3645]"
                                            >
                                                <RotateCcw size={14} />
                                                Review
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {withdrawalError && (
                    <LoadingError
                        title="Unable to load withdrawal requests"
                        message={withdrawalError}
                    />
                )}

                {actionMessage.show && (
                    <div className="space-y-3">
                        <LoadingError
                            title={actionMessage.title}
                            message={actionMessage.message}
                        />
                        <button
                            type="button"
                            onClick={closeActionMessage}
                            className="border border-[#343E4B] px-4 py-2 text-[12px] text-[#B8C2CF] hover:bg-[#1A222D]"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Help Request Overview */}

                <HelpRequestStats
                    total={statistics.total}
                    pending={statistics.pending}
                    verified={statistics.verified}
                    inProgress={statistics.inProgress}
                    completed={statistics.completed}
                    rejected={statistics.rejected}
                />

                {/* ==================================================
                    HELP REQUEST MANAGEMENT
                ================================================== */}

                <section className="pt-2 lg:pt-3">
                    {/* Same section-heading hierarchy as Users.jsx */}
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

                    {/* MANAGEMENT WORKSPACE — matches Users.jsx */}
                    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        {/* TABLE: desktop height is governed by the sidebar */}
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

                                {/* Single scroll owner, just like Users.jsx */}
                                <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0A0E14] [&::-webkit-scrollbar-thumb]:bg-[#303A47] hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]">
                                    <HelpRequestTable
                                        columns={columns}
                                        rows={rows}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        resultCount={
                                            filteredHelpRequests.length
                                        }
                                        onRequesterClick={handleViewUser}
                                        onOrganizationClick={
                                            handleViewOrganization
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

                        {/* FILTER: natural content height sets desktop row height */}
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

            {/* --------------------------------
                Withdrawal Review Modal
            -------------------------------- */}

            {selectedWithdrawalRequest && (
                <WithdrawalReviewModal
                    assignment={selectedWithdrawalRequest}
                    loading={withdrawalReviewLoading}
                    error={withdrawalReviewError}
                    onClose={closeWithdrawalReview}
                    onDecision={handleWithdrawalDecision}
                    onOrganizationClick={handleViewOrganization}
                />
            )}

            {/* --------------------------------
                Action message
            -------------------------------- */}

            {/* --------------------------------
                Toast
            -------------------------------- */}

            <SuccessDialog
                open={toast.show}
                title="Action completed"
                message={toast.message}
                onClose={() => setToast({ show: false, message: '' })}
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
                View organization
            -------------------------------- */}

            <OrganizationViewModal
                organization={selectedOrganization}
                loading={organizationLoading}
                error={organizationError}
                onClose={closeOrganizationModal}
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
                Initial Assignment
            -------------------------------- */}

            <HelpRequestAssignmentModal
                request={selectedAssignmentRequest}
                organizations={organizations}
                volunteers={volunteers}
                loading={assignmentLoading || assignmentDataLoading}
                error={assignmentError}
                onClose={closeAssignmentModal}
                onConfirm={handleAssignment}
            />

            {/* --------------------------------
                Add Support
            -------------------------------- */}

            {selectedSupportRequest && (
                <HelpRequestAssignmentModal
                    key={`support-${selectedSupportRequest.id}`}
                    request={selectedSupportRequest}
                    organizations={organizations}
                    volunteers={volunteers}
                    loading={assignmentDataLoading}
                    error={supportError}
                    onClose={closeSupportModal}
                    onConfirm={() => {
                        setSupportError(
                            'Additional support is not connected to an API yet. No changes have been saved.',
                        );
                    }}
                />
            )}

            {/* --------------------------------
                Reassignment
            -------------------------------- */}

            <HelpRequestReassignmentModal
                key={selectedReassignmentRequest?.id || 'reassignment-modal'}
                request={selectedReassignmentRequest}
                open={Boolean(selectedReassignmentRequest)}
                loading={reassignmentLoading || assignmentDataLoading}
                error={reassignmentError}
                organizations={organizations}
                volunteers={volunteers}
                onClose={closeReassignmentModal}
                onSubmit={handleReassignment}
                onOrganizationClick={handleViewOrganization}
            />
        </>
    );
};

/*
|--------------------------------------------------------------------------
| Withdrawal Review Modal
|--------------------------------------------------------------------------
*/

const WithdrawalReviewModal = ({
    assignment,
    loading = false,
    error = '',
    onClose,
    onDecision,
    onOrganizationClick,
}) => {
    if (!assignment) {
        return null;
    }

    const helpRequest =
        assignment?.help_request || assignment?.helpRequest || {};

    const organization = assignment?.organization || {};

    const organizationName =
        organization?.name ||
        organization?.user?.name ||
        'Organization unavailable';

    const organizationId =
        organization?.id || assignment?.organization_id || null;

    const requestTitle = helpRequest?.title || 'Help request';

    const requestDescription =
        helpRequest?.description || 'No description provided.';

    const requestedAt = assignment?.withdrawal_requested_at;

    const reason =
        assignment?.withdrawal_reason || 'No withdrawal reason was provided.';

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                onClick={!loading ? handleClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border border-[#303A47] bg-[#10161F] shadow-2xl">
                <div className="flex items-start justify-between gap-5 border-b border-[#29333F] px-6 py-5 sm:px-7">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#443723] bg-[#241E15] text-[#D0AA70]">
                            <RotateCcw size={18} strokeWidth={2} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D0AA70]">
                                Withdrawal review
                            </p>

                            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#E5EAF0]">
                                Organization withdrawal request
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-[#8792A1]">
                                Review the organization's reason before
                                approving or rejecting the withdrawal.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8792A1] transition-colors hover:bg-[#151C25] hover:text-[#E5EAF0] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-6 sm:px-7">
                    <div className="space-y-5">
                        <div className="border border-[#303A47] bg-[#151C25] p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8792A1]">
                                        Organization
                                    </p>

                                    <button
                                        type="button"
                                        disabled={!organizationId}
                                        onClick={() =>
                                            onOrganizationClick?.(
                                                organizationId,
                                            )
                                        }
                                        className="mt-1 text-left text-base font-bold text-[#E5EAF0] transition-colors hover:text-[#EEF1F5] disabled:cursor-default disabled:hover:text-[#E5EAF0]"
                                    >
                                        {organizationName}
                                    </button>
                                </div>

                                <span className="inline-flex shrink-0 items-center gap-1.5 bg-[#241E15] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#D0AA70]">
                                    <Clock3 size={11} />
                                    Pending review
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8792A1]">
                                Help request
                            </p>

                            <h3 className="mt-1 text-base font-bold text-[#E5EAF0]">
                                {requestTitle}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#8792A1]">
                                {requestDescription}
                            </p>
                        </div>

                        {requestedAt && (
                            <div className="border-t border-[#29333F] pt-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8792A1]">
                                    Requested
                                </p>

                                <p className="mt-1 text-sm font-medium! text-[#E5EAF0]">
                                    {formatDateTime(requestedAt)}
                                </p>
                            </div>
                        )}

                        <div className="border-t border-[#29333F] pt-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8792A1]">
                                Organization's reason
                            </p>

                            <div className="mt-2 border border-[#443723] bg-[#241E15] px-4 py-4">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-[#E5EAF0]">
                                    {reason}
                                </p>
                            </div>
                        </div>

                        <div className="border border-[#303A47] bg-[#151C25] px-4 py-4">
                            <p className="text-xs font-bold text-[#E5EAF0]">
                                What happens after your decision?
                            </p>

                            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-[#8792A1]">
                                <li>
                                    <span className="font-semibold text-[#E5EAF0]">
                                        Approve:
                                    </span>{' '}
                                    The current organization assignment becomes
                                    withdrawn and remains in history.
                                </li>

                                <li>
                                    <span className="font-semibold text-[#E5EAF0]">
                                        Reject:
                                    </span>{' '}
                                    The organization remains assigned and can
                                    continue the help request.
                                </li>

                                <li>
                                    <span className="font-semibold text-[#E5EAF0]">
                                        Reassignment:
                                    </span>{' '}
                                    A replacement organization will be handled
                                    separately after an approved withdrawal.
                                </li>
                            </ul>
                        </div>

                        {loading && (
                            <LoadingUI
                                title="Processing withdrawal..."
                                description="Please wait while your decision is saved."
                            />
                        )}

                        {error && (
                            <LoadingError
                                title="Unable to review withdrawal"
                                message={error}
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#29333F] bg-[#10161F] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="h-10 rounded-lg border border-[#303A47] px-4 text-sm font-semibold text-[#8792A1] transition-colors hover:bg-[#151C25] hover:text-[#E5EAF0] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => onDecision?.('rejected')}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#493038] bg-[#10161F] px-4 text-sm font-bold text-red-600 transition-colors hover:bg-[#281A1F] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <XCircle size={16} />

                            {loading ? 'Processing...' : 'Reject Withdrawal'}
                        </button>

                        <button
                            type="button"
                            onClick={() => onDecision?.('approved')}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#263343] px-5 text-sm font-bold text-white! transition-colors hover:bg-[#354559] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />

                            {loading ? 'Processing...' : 'Approve Withdrawal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
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

const getPendingWithdrawalAssignment = (request) => {
    if (!request) {
        return null;
    }

    const assignments = getOrganizationAssignments(request);

    return (
        assignments.find(
            (assignment) =>
                Boolean(
                    assignment?.organization_id || assignment?.organization,
                ) &&
                String(assignment?.withdrawal_status || '')
                    .trim()
                    .toLowerCase() === 'pending',
        ) || null
    );
};

const hasOrganizationRequestedWithdrawal = (request) => {
    if (!request) {
        return false;
    }

    if (request.organization_withdrawal_requested === true) {
        return true;
    }

    if (request.withdrawal_requested === true) {
        return true;
    }

    if (request.assignment?.withdrawal_requested === true) {
        return true;
    }

    if (request.assigned_organization?.withdrawal_requested === true) {
        return true;
    }

    if (request.assignment?.withdrawal_status === 'pending') {
        return true;
    }

    if (
        request.organization_withdrawal_status === 'requested' ||
        request.organization_withdrawal_status === 'pending'
    ) {
        return true;
    }

    if (Array.isArray(request.assignments)) {
        return request.assignments.some((assignment) => {
            if (!assignment?.organization_id) {
                return false;
            }

            return (
                assignment.withdrawal_requested === true ||
                assignment.withdrawal_status === 'requested' ||
                assignment.withdrawal_status === 'pending' ||
                assignment.status === 'withdrawal_requested' ||
                assignment.status === 'withdrawal_pending'
            );
        });
    }

    return false;
};

const hasAdditionalSupportRequest = (request) => {
    if (!request) {
        return false;
    }

    if (request.additional_support_requested === true) {
        return true;
    }

    if (request.support_requested === true) {
        return true;
    }

    if (request.need_additional_support === true) {
        return true;
    }

    if (request.additional_help_requested === true) {
        return true;
    }

    if (request.assignment?.additional_support_requested === true) {
        return true;
    }

    if (request.assignment?.support_requested === true) {
        return true;
    }

    if (request.assigned_organization?.additional_support_requested === true) {
        return true;
    }

    if (request.assigned_organization?.support_requested === true) {
        return true;
    }

    if (
        request.additional_support_status === 'requested' ||
        request.additional_support_status === 'pending'
    ) {
        return true;
    }

    if (
        request.support_request_status === 'requested' ||
        request.support_request_status === 'pending'
    ) {
        return true;
    }

    if (Array.isArray(request.assignments)) {
        return request.assignments.some(
            (assignment) =>
                assignment?.additional_support_requested === true ||
                assignment?.support_requested === true ||
                assignment?.additional_support_status === 'requested' ||
                assignment?.additional_support_status === 'pending' ||
                assignment?.support_request_status === 'requested' ||
                assignment?.support_request_status === 'pending' ||
                assignment?.status === 'support_requested',
        );
    }

    return false;
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

const formatDateTime = (value) => {
    if (!value) {
        return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString('en-BD', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

export default HelpRequests;
