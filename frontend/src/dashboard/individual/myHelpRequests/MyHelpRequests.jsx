import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';

import { getMyHelpRequests, deleteHelpRequest } from './api/helpRequestAPI';

import HelpRequestPageHeader from './components/HelpRequestPageHeader';
import HelpRequestOverview from './components/HelpRequestOverview';
import HelpRequestWorkspace from './components/HelpRequestWorkspace';
import createHelpRequestColumns from './components/HelpRequestTableColumns';
import HelpRequestErrorState from './components/HelpRequestErrorState';
import HelpRequestLoadingState from './components/HelpRequestLoadingState';
import HelpRequestSuccessToast from './components/HelpRequestSuccessToast';
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

    /*
     * --------------------------------------------------------------------------
     * Workspace height
     * --------------------------------------------------------------------------
     */

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

        return filteredHelpRequests.slice(
            startIndex,
            startIndex + HELP_REQUESTS_PER_PAGE,
        );
    }, [filteredHelpRequests, safeCurrentPage]);

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

    /*
     * --------------------------------------------------------------------------
     * Loading / error
     * --------------------------------------------------------------------------
     */

    if (loading) {
        return <HelpRequestLoadingState />;
    }

    if (error) {
        return <HelpRequestErrorState error={error} />;
    }

    /*
     * --------------------------------------------------------------------------
     * Table rows
     * --------------------------------------------------------------------------
     */

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

    /*
     * --------------------------------------------------------------------------
     * Columns
     * --------------------------------------------------------------------------
     */

    const columns = createHelpRequestColumns({
        handleViewOrganization,
        handleView,
        handleEdit,
        handleDelete,
        deleteLoading,
    });

    /*
     * --------------------------------------------------------------------------
     * Render
     * --------------------------------------------------------------------------
     */

    return (
        <div className="min-h-full">
            <div className="mx-auto w-full max-w-400 space-y-10">
                <HelpRequestSuccessToast
                    show={successToast.show}
                    message={successToast.message}
                />

                <HelpRequestPageHeader
                    onNewRequest={handleOpenModal}
                    onExport={handleExportCSV}
                    exportDisabled={filteredHelpRequests.length === 0}
                />

                <HelpRequestOverview statistics={statistics} />

                <HelpRequestWorkspace
                    workspaceHeight={workspaceHeight}
                    workspaceSidebarRef={workspaceSidebarRef}
                    categoryTabs={categoryTabs}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                    searchTerm={searchTerm}
                    categoryFilter={categoryFilter}
                    priorityFilter={priorityFilter}
                    statusFilter={statusFilter}
                    helpRequests={helpRequests}
                    onSearchChange={handleSearchChange}
                    onCategoryFilterChange={handleCategoryFilterChange}
                    onPriorityChange={handlePriorityChange}
                    onStatusChange={handleStatusChange}
                    columns={columns}
                    rows={rows}
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                    resultCount={filteredHelpRequests.length}
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    totalItems={filteredHelpRequests.length}
                    itemsPerPage={HELP_REQUESTS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>

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
        </div>
    );
};

export default MyHelpRequests;
