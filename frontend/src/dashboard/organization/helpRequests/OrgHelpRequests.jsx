import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Download,
    Search,
    X,
    SlidersHorizontal,
    ChevronsUpDown,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';

import {
    acceptAssignment,
    fetchAssignments,
    rejectAssignment,
    requestWithdrawal,
    updateAssignment,
} from './api/helpRequestApi';

import { normalizeAssignment } from './utils/helpRequestUtils';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import DashboardInput from '@/components/dashboard/DashboardInput';

import Stats from './components/Stats';
import Filters from './components/Filters';
import Table from './components/Table';
import Pagination from './components/Pagination';
import CaseReviewDrawer from './components/CaseReviewDrawer';
import RejectionModal from './modals/RejectionModal';
import WithdrawalModal from './modals/WithdrawalModal';

const STATUS_CONFIG = {
    pending: { label: 'Pending', short: 'Pending' },
    verified: { label: 'Verified', short: 'Verified' },
    in_progress: { label: 'In Progress', short: 'In Progress' },
    completed: { label: 'Completed', short: 'Completed' },
    rejected: { label: 'Rejected', short: 'Rejected' },
    withdrawal: {
        label: 'Withdrawal requested',
        short: 'Withdrawal',
    },
};

const OrgHelpRequests = () => {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState('');
    const [toast, setToast] = useState({ show: false, message: '' });

    const [actionLoading, setActionLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [withdrawalRequest, setWithdrawalRequest] = useState(null);
    const [withdrawalReason, setWithdrawalReason] = useState('');
    const [withdrawalError, setWithdrawalError] = useState('');
    const [withdrawalLoading, setWithdrawalLoading] = useState(false);

    const [rejectionRequest, setRejectionRequest] = useState(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [rejectionError, setRejectionError] = useState('');
    const [rejectionLoading, setRejectionLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const [filterValues, setFilterValues] = useState({
        category: 'all',
        priority: 'all',
        assignment: 'all',
        status: 'all',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const pageSize = 10;

    const showSuccess = (message) => setToast({ show: true, message });

    const normalizeAssignments = (rawAssignments) => {
        if (!Array.isArray(rawAssignments)) return [];

        return rawAssignments
            .map((assignment) => {
                try {
                    return normalizeAssignment(assignment);
                } catch (err) {
                    console.error(
                        'Failed to normalize organization assignment:',
                        assignment,
                        err,
                    );
                    return null;
                }
            })
            .filter(Boolean);
    };

    useEffect(() => {
        let cancelled = false;

        const loadInitialAssignments = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const data = await fetchAssignments();

                if (cancelled) return;

                const rawAssignments = Array.isArray(data?.assignments)
                    ? data.assignments
                    : [];

                setAssignments(normalizeAssignments(rawAssignments));
            } catch (err) {
                if (!cancelled) {
                    setLoadError(
                        err?.message ||
                            'Unable to load assigned help requests.',
                    );
                    setAssignments([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadInitialAssignments();

        return () => {
            cancelled = true;
        };
    }, []);

    const getRequestStatus = (request) => {
        const assignmentStatus = String(
            request?.rawAssignment?.status || request?.status || '',
        ).toLowerCase();

        const helpRequestStatus = String(
            request?.rawHelpRequest?.status || '',
        ).toLowerCase();

        if (assignmentStatus === 'rejected') return 'rejected';
        if (assignmentStatus === 'pending') return 'pending';

        if (
            ['pending', 'verified', 'in_progress', 'completed'].includes(
                helpRequestStatus,
            )
        ) {
            return helpRequestStatus;
        }

        if (assignmentStatus === 'in_progress') return 'in_progress';
        if (assignmentStatus === 'completed') return 'completed';

        if (['accepted', 'assigned'].includes(assignmentStatus)) {
            return 'verified';
        }

        return 'pending';
    };

    const counts = useMemo(() => {
        let pendingCount = 0;
        let verifiedCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        let rejectedCount = 0;

        assignments.forEach((request) => {
            const status = getRequestStatus(request);

            switch (status) {
                case 'pending':
                    pendingCount += 1;
                    break;
                case 'verified':
                    verifiedCount += 1;
                    break;
                case 'in_progress':
                    inProgressCount += 1;
                    break;
                case 'completed':
                    completedCount += 1;
                    break;
                case 'rejected':
                    rejectedCount += 1;
                    break;
                default:
                    break;
            }
        });

        return {
            all: assignments.length,
            pending: pendingCount,
            verified: verifiedCount,
            in_progress: inProgressCount,
            completed: completedCount,
            rejected: rejectedCount,
        };
    }, [assignments]);

    const filterOptions = useMemo(() => {
        const categories = [{ value: 'all', label: 'All categories' }];

        const categorySet = new Set();

        assignments.forEach((request) => {
            if (request?.category) categorySet.add(request.category);
        });

        [...categorySet].sort().forEach((category) => {
            categories.push({ value: category, label: category });
        });

        return {
            category: categories,
            priority: [
                { value: 'all', label: 'All priorities' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'normal', label: 'Normal' },
            ],
            assignment: [
                { value: 'all', label: 'All assignments' },
                { value: 'pending', label: 'Needs response' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'rejected', label: 'Declined' },
            ],
            status: [
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'verified', label: 'Verified' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'rejected', label: 'Rejected' },
            ],
        };
    }, [assignments]);

    const handleFilterChange = (key, value) => {
        setFilterValues((current) => ({
            ...current,
            [key]: value,
        }));
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setActiveCategory('all');
        setFilterValues({
            category: 'all',
            priority: 'all',
            assignment: 'all',
            status: 'all',
        });
        setSearch('');
        setCurrentPage(1);
    };

    const filteredRequests = useMemo(() => {
        const query = search.trim().toLowerCase();

        return assignments.filter((request) => {
            const requestStatus = getRequestStatus(request);

            if (activeCategory !== 'all' && requestStatus !== activeCategory) {
                return false;
            }

            if (
                filterValues.category !== 'all' &&
                request.category !== filterValues.category
            ) {
                return false;
            }

            if (filterValues.priority !== 'all') {
                const urgency = String(
                    request.urgency || request.priority || 'normal',
                ).toLowerCase();

                if (urgency !== filterValues.priority) return false;
            }

            if (filterValues.assignment !== 'all') {
                const assignmentStatus = String(
                    request?.rawAssignment?.status || request?.status || '',
                ).toLowerCase();

                const matches =
                    filterValues.assignment === 'assigned'
                        ? ['assigned', 'accepted'].includes(assignmentStatus)
                        : assignmentStatus === filterValues.assignment;

                if (!matches) return false;
            }

            if (
                filterValues.status !== 'all' &&
                requestStatus !== filterValues.status
            ) {
                return false;
            }

            if (query) {
                const searchableText = [
                    request.title,
                    request.description,
                    request.category,
                    request.district,
                    request.address,
                    request.individual,
                    request.location,
                    request.status,
                    request.urgency,
                    request.priority,
                    request.assignmentId,
                ]
                    .filter((value) => value !== null && value !== undefined)
                    .map(String)
                    .join(' ')
                    .toLowerCase();

                if (!searchableText.includes(query)) return false;
            }

            return true;
        });
    }, [activeCategory, assignments, filterValues, search]);

    const handleSort = (key) => {
        setSortConfig((current) => {
            if (current.key !== key) {
                return { key, direction: 'asc' };
            }

            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }

            return { key: null, direction: null };
        });

        setCurrentPage(1);
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

    const sortedRequests = useMemo(() => {
        if (!sortConfig.key || !sortConfig.direction) {
            return filteredRequests;
        }

        const getValue = (request) => {
            switch (sortConfig.key) {
                case 'title':
                    return request.title || '';

                case 'category':
                    return (
                        request.category ||
                        request.rawHelpRequest?.category ||
                        ''
                    );

                case 'district':
                    return (
                        request.district ||
                        request.rawHelpRequest?.district ||
                        ''
                    );

                case 'priority':
                    return (
                        {
                            low: 1,
                            normal: 2,
                            medium: 2,
                            high: 3,
                            urgent: 4,
                            critical: 5,
                        }[
                            String(
                                request.urgency || request.priority || 'normal',
                            ).toLowerCase()
                        ] || 0
                    );

                case 'status':
                    return getRequestStatus(request);

                default:
                    return '';
            }
        };

        return [...filteredRequests].sort((a, b) => {
            const av = getValue(a);
            const bv = getValue(b);

            const compare =
                typeof av === 'number' && typeof bv === 'number'
                    ? av - bv
                    : String(av).localeCompare(String(bv), undefined, {
                          numeric: true,
                          sensitivity: 'base',
                      });

            return sortConfig.direction === 'asc' ? compare : -compare;
        });
    }, [filteredRequests, sortConfig]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRequests.length / pageSize),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedRequests = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;

        return sortedRequests
            .slice(start, start + pageSize)
            .map((request, index) => ({
                ...request,
                serialNumber: start + index + 1,
            }));
    }, [safeCurrentPage, sortedRequests]);

    const handleStartSupport = (request) => {
        const helpRequestId =
            request?.rawHelpRequest?.id ??
            request?.helpRequestId ??
            request?.rawAssignment?.help_request_id ??
            null;

        if (!helpRequestId) {
            setError(
                'Unable to identify this help request. Please refresh the page and try again.',
            );
            return;
        }

        setSelectedRequest(null);

        navigate('/organization/dashboard/campaigns', {
            state: {
                openCreateCampaign: true,
                helpRequestId: String(helpRequestId),
            },
        });
    };

    const handleAssignmentAction = async (request, action) => {
        if (!request?.assignmentId || actionLoading) return;

        if (action === 'reject') {
            setRejectionRequest(request);
            setRejectionNote('');
            setRejectionError('');
            return;
        }

        if (action !== 'accept') return;

        try {
            setActionLoading(true);
            setError('');

            await acceptAssignment(request.assignmentId);

            const data = await fetchAssignments();

            const rawAssignments = Array.isArray(data?.assignments)
                ? data.assignments
                : [];

            const normalized = normalizeAssignments(rawAssignments);
            setAssignments(normalized);

            const updated = normalized.find(
                (item) =>
                    String(item.assignmentId) === String(request.assignmentId),
            );

            setSelectedRequest(updated || null);
            showSuccess('Assignment accepted successfully.');
        } catch (err) {
            setError(err?.message || 'Unable to accept this assignment.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateAssignment = async (assignmentId, fields) => {
        if (!assignmentId || !fields || typeof fields !== 'object') {
            setError(
                'Assignment information is missing. Please refresh the page and try again.',
            );
            return false;
        }

        try {
            setActionLoading(true);
            setError('');

            const response = await updateAssignment(assignmentId, fields);
            const updatedAssignment = response?.assignment;

            if (!updatedAssignment) {
                throw new Error(
                    'The case was updated, but the updated case data was not returned.',
                );
            }

            const updated = normalizeAssignment(updatedAssignment);

            setAssignments((current) =>
                current.map((item) =>
                    String(item.assignmentId) === String(assignmentId)
                        ? updated
                        : item,
                ),
            );

            setSelectedRequest((current) =>
                current && String(current.assignmentId) === String(assignmentId)
                    ? updated
                    : current,
            );

            showSuccess('Case classification updated successfully.');
            return true;
        } catch (err) {
            console.error('FAILED: organization assignment update', err);
            setError(err?.message || 'Failed to update the help request.');
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitRejection = async () => {
        if (!rejectionRequest?.assignmentId || rejectionLoading) return;

        const note = rejectionNote.trim();

        if (!note) {
            setRejectionError(
                'Please provide a reason for rejecting this assignment.',
            );
            return;
        }

        try {
            setRejectionLoading(true);
            setRejectionError('');
            setError('');

            await rejectAssignment(rejectionRequest.assignmentId, note);

            const rejectedAssignmentId = rejectionRequest.assignmentId;

            setRejectionRequest(null);
            setRejectionNote('');

            const data = await fetchAssignments();

            const rawAssignments = Array.isArray(data?.assignments)
                ? data.assignments
                : [];

            const normalized = normalizeAssignments(rawAssignments);
            setAssignments(normalized);

            const updated = normalized.find(
                (item) =>
                    String(item.assignmentId) === String(rejectedAssignmentId),
            );

            setSelectedRequest(updated || null);
            showSuccess('Assignment declined successfully.');
        } catch (err) {
            setRejectionError(
                err?.message || 'Unable to reject this assignment.',
            );
        } finally {
            setRejectionLoading(false);
        }
    };

    const handleSubmitWithdrawal = async () => {
        if (!withdrawalRequest?.assignmentId || withdrawalLoading) return;

        const reason = withdrawalReason.trim();

        if (reason.length < 10) {
            setWithdrawalError(
                'Please provide at least 10 characters explaining why your organization needs to withdraw.',
            );
            return;
        }

        try {
            setWithdrawalLoading(true);
            setWithdrawalError('');
            setError('');

            const response = await requestWithdrawal(
                withdrawalRequest.assignmentId,
                reason,
            );

            const updatedAssignment = response?.assignment;

            if (!updatedAssignment) {
                throw new Error(
                    'Withdrawal request was submitted, but updated assignment data was not returned.',
                );
            }

            const updated = normalizeAssignment(updatedAssignment);

            setAssignments((current) =>
                current.map((item) =>
                    String(item.assignmentId) ===
                    String(withdrawalRequest.assignmentId)
                        ? updated
                        : item,
                ),
            );

            setSelectedRequest((current) =>
                current &&
                String(current.assignmentId) ===
                    String(withdrawalRequest.assignmentId)
                    ? updated
                    : current,
            );

            setWithdrawalRequest(null);
            setWithdrawalReason('');
            setWithdrawalError('');

            showSuccess('Withdrawal request submitted successfully.');
        } catch (err) {
            setWithdrawalError(
                err?.message || 'Unable to submit the withdrawal request.',
            );
        } finally {
            setWithdrawalLoading(false);
        }
    };

    const handleExportCsv = () => {
        const rows = filteredRequests.map((request) => ({
            title: request?.title || '',
            category: request?.category || '',
            district: request?.district || '',
            individual: request?.individual || '',
            status: getRequestStatus(request),
            urgency: request?.urgency || request?.priority || '',
            createdAt: request?.rawHelpRequest?.created_at || '',
        }));

        const headers = [
            'Help Request',
            'Category',
            'District',
            'Requester',
            'Status',
            'Priority',
            'Submitted',
        ];

        const csvRows = [
            headers,
            ...rows.map((row) => [
                row.title,
                row.category,
                row.district,
                row.individual,
                row.status,
                row.urgency,
                row.createdAt,
            ]),
        ];

        const csv = csvRows
            .map((row) =>
                row
                    .map((value) => {
                        const textValue = String(value ?? '');
                        return `"${textValue.replace(/"/g, '""')}"`;
                    })
                    .join(','),
            )
            .join('\n');

        const blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'organization-help-requests.csv';

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        showSuccess('Help requests exported successfully.');
    };

    const filterPanel = (
        <Filters
            filters={filterOptions}
            values={filterValues}
            counts={counts}
            onChange={handleFilterChange}
            onClear={clearFilters}
        />
    );

    return (
        <div className="min-w-0 space-y-10 font-sans lg:space-y-12">
            <PageHeader
                title="Help Requests"
                subtitle="Review and manage help requests assigned to your organization."
                action={
                    <button
                        type="button"
                        onClick={handleExportCsv}
                        disabled={loading || filteredRequests.length === 0}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-transparent px-4 text-[12px] font-medium text-[#B8C2CF] transition-colors hover:border-[#4B596A] hover:bg-[#1C232D] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Download size={16} strokeWidth={1.8} />
                        Export
                    </button>
                }
            />

            {loading ? (
                <LoadingUI
                    variant="page"
                    title="Loading help requests..."
                    description="Please wait while we retrieve your organization's assignments."
                />
            ) : loadError ? (
                <LoadingError
                    title="Unable to load help requests"
                    message={loadError}
                />
            ) : (
                <>
                    {error && (
                        <div className="relative min-w-0">
                            <LoadingError
                                title="Help request action failed"
                                message={error}
                            />
                            <button
                                type="button"
                                onClick={() => setError('')}
                                aria-label="Dismiss error"
                                className="absolute right-3 top-3 flex size-8 items-center justify-center text-[#AAB7C8] hover:text-[#EEF1F5]"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    )}

                    <Stats
                        total={counts.all}
                        pending={counts.pending}
                        verified={counts.verified}
                        in_progress={counts.in_progress}
                        completed={counts.completed}
                        rejected={counts.rejected}
                    />

                    <section className="min-w-0 pt-2 lg:pt-3">
                        <div className="flex flex-col gap-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
                            <div className="min-w-0">
                                <h2 className="font-sans! text-[20px]! font-semibold! leading-tight! tracking-[-0.02em] text-[#EEF1F5]!">
                                    Help Request Directory
                                </h2>
                                <p className="mt-2 max-w-xl text-[12px] leading-[1.65] text-[#8792A1]">
                                    Browse assigned requests and coordinate your
                                    organization's response.
                                </p>
                            </div>
                        </div>

                        <div className="mb-5 xl:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="flex h-10 w-full items-center justify-between border border-[#29323E] bg-[#0E1219] px-3.5 text-[12px] text-[#AEB7C3] transition-colors hover:bg-[#151B24]"
                            >
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal size={15} />
                                    Filters
                                </span>
                                <span className="text-[#788596]">
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
                                    <div className="flex items-center justify-between border-b border-[#29323E] px-4 py-3 text-[14px] font-medium text-[#EEF1F5]">
                                        Request filters
                                        <button
                                            type="button"
                                            aria-label="Close filters"
                                            onClick={() =>
                                                setMobileFiltersOpen(false)
                                            }
                                            className="flex size-8 items-center justify-center text-[#AAB7C3] hover:text-white"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {filterPanel}

                                    <div className="p-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMobileFiltersOpen(false)
                                            }
                                            className="h-10 w-full bg-[#263343] text-[13px] font-medium text-[#EEF1F5]"
                                        >
                                            Show results
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="relative min-h-0 min-w-0 xl:h-full">
                                <div className="flex min-h-[420px] min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                                    <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <DashboardInput
                                                    type="search"
                                                    name="organization-help-request-search"
                                                    leftIcon={Search}
                                                    value={search}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                    placeholder="Search by request, requester or district"
                                                    aria-label="Search help requests"
                                                />
                                            </div>

                                            <span className="shrink-0 text-[12px] font-medium text-[#AAB3BF]">
                                                {filteredRequests.length}{' '}
                                                {filteredRequests.length === 1
                                                    ? 'result'
                                                    : 'results'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0A0E14] [&::-webkit-scrollbar-thumb]:bg-[#303A47] hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]">
                                        <Table
                                            requests={assignments}
                                            filteredRequests={paginatedRequests}
                                            loading={loading}
                                            statusConfig={STATUS_CONFIG}
                                            onOpenCase={setSelectedRequest}
                                            onClearFilters={clearFilters}
                                            search={search}
                                            onSort={handleSort}
                                            getSortIcon={getSortIcon}
                                            resultCount={
                                                filteredRequests.length
                                            }
                                        />
                                    </div>

                                    {filteredRequests.length > 0 && (
                                        <div className="shrink-0 border-t border-[#252D38] bg-[#1A222D]">
                                            <Pagination
                                                currentPage={safeCurrentPage}
                                                totalPages={totalPages}
                                                totalItems={
                                                    filteredRequests.length
                                                }
                                                pageSize={pageSize}
                                                onPageChange={setCurrentPage}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block">
                                {filterPanel}
                            </aside>
                        </div>
                    </section>
                </>
            )}

            <CaseReviewDrawer
                request={selectedRequest}
                statusConfig={STATUS_CONFIG}
                onClose={() => setSelectedRequest(null)}
                onAction={handleAssignmentAction}
                onStartSupport={handleStartSupport}
                onUpdateAssignment={handleUpdateAssignment}
                onRequestWithdrawal={(request) => {
                    if (request?.withdrawalStatus === 'pending') return;

                    setWithdrawalRequest(request);
                    setWithdrawalReason('');
                    setWithdrawalError('');
                }}
                actionLoading={actionLoading}
            />

            <WithdrawalModal
                request={withdrawalRequest}
                reason={withdrawalReason}
                setReason={setWithdrawalReason}
                loading={withdrawalLoading}
                error={withdrawalError}
                onClose={() => {
                    if (withdrawalLoading) return;

                    setWithdrawalRequest(null);
                    setWithdrawalReason('');
                    setWithdrawalError('');
                }}
                onSubmit={handleSubmitWithdrawal}
            />

            <RejectionModal
                request={rejectionRequest}
                note={rejectionNote}
                setNote={setRejectionNote}
                error={rejectionError}
                setError={setRejectionError}
                loading={rejectionLoading}
                onClose={() => {
                    if (rejectionLoading) return;

                    setRejectionRequest(null);
                    setRejectionNote('');
                    setRejectionError('');
                }}
                onSubmit={handleSubmitRejection}
            />

            <SuccessDialog
                open={toast.show}
                title="Action completed"
                message={toast.message}
                onClose={() => setToast({ show: false, message: '' })}
            />
        </div>
    );
};

export default OrgHelpRequests;
