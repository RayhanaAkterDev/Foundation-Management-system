import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Download,
    Plus,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import CampaignStats from './components/Stats';
import CampaignFilters from './components/Filters';
import CampaignTable from './components/Table';
import CampaignPagination from './components/Pagination';

import CampaignVerificationModal from './modals/VerificationModal';
import ClassificationModal from './modals/ClassificationModal';
import CampaignAssignmentModal from './modals/AssignmentModal';
import StatusUpdateModal from './modals/StatusUpdateModal';

import {
    fetchCampaigns,
    fetchCampaignVolunteerCandidates,
    fetchCampaignVolunteerAssignments,
    assignCampaignVolunteer,
    verifyCampaign,
    updateCampaignStatus,
} from './api/campaignsAPI';

const CAMPAIGNS_PER_PAGE = 25;
const CAMPAIGNS_PATH = '/admin/dashboard/campaigns';

const EDITABLE_STATUSES = ['unverified', 'active'];

const normalizeCampaign = (campaign) => {
    if (!campaign) return campaign;

    return {
        ...campaign,
        status: campaign.status || '',
        is_featured: Boolean(campaign.is_featured),
        is_urgent: Boolean(campaign.is_urgent),
        urgency_priority: Number(campaign.urgency_priority) || 2,
    };
};

const normalizeCampaigns = (campaigns) => {
    if (!Array.isArray(campaigns)) return [];

    return campaigns.map(normalizeCampaign);
};

const extractCampaigns = (response) => {
    const campaigns =
        response?.campaigns ??
        response?.data?.campaigns ??
        response?.data ??
        response;

    return normalizeCampaigns(campaigns);
};

const getCampaignTypeLabel = (type) => {
    switch (type) {
        case 'local_case':
            return 'Local Case';
        case 'organization_proposed':
            return 'Organization Proposed';
        case 'global_situation':
            return 'Global Situation';
        default:
            return type || '—';
    }
};

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatMoney = (value) => {
    const number = Number(value ?? 0);

    return `৳${Number.isFinite(number) ? number.toLocaleString('en-BD') : '0'}`;
};

const compareValues = (first, second, key, direction) => {
    if (
        ['created_at', 'start_date', 'end_date', 'proposal_date'].includes(key)
    ) {
        first = first ? new Date(first).getTime() : 0;
        second = second ? new Date(second).getTime() : 0;

        first = Number.isFinite(first) ? first : 0;
        second = Number.isFinite(second) ? second : 0;
    } else if (['target_amount', 'collected_amount'].includes(key)) {
        first = Number(first ?? 0);
        second = Number(second ?? 0);
    } else {
        first = String(first ?? '').toLowerCase();
        second = String(second ?? '').toLowerCase();
    }

    if (first < second) return direction === 'asc' ? -1 : 1;
    if (first > second) return direction === 'asc' ? 1 : -1;

    return 0;
};

export default function Campaigns() {
    const navigate = useNavigate();

    // =========================================================
    // CAMPAIGN DATA
    // =========================================================

    const [campaigns, setCampaigns] = useState([]);
    const [classificationCampaign, setClassificationCampaign] = useState(null);
    const [classificationFilter, setClassificationFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // =========================================================
    // SUCCESS DIALOG
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

    const closeSuccessToast = () => {
        setSuccessToast({
            show: false,
            message: '',
        });
    };

    // =========================================================
    // VERIFICATION MODAL
    // =========================================================

    const [verificationCampaign, setVerificationCampaign] = useState(null);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    // =========================================================
    // CAMPAIGN STATUS UPDATE MODAL
    // =========================================================

    const [statusCampaign, setStatusCampaign] = useState(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const [statusUpdateError, setStatusUpdateError] = useState('');

    // =========================================================
    // VOLUNTEER ASSIGNMENT MODAL
    // =========================================================

    const [assignmentCampaign, setAssignmentCampaign] = useState(null);
    const [assignmentVolunteers, setAssignmentVolunteers] = useState([]);
    const [assignmentHistory, setAssignmentHistory] = useState([]);
    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
    const [assignmentError, setAssignmentError] = useState('');

    // =========================================================
    // FILTERS
    // =========================================================

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [organizationFilter, setOrganizationFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deadlineFilter, setDeadlineFilter] = useState('all');

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // =========================================================
    // SORTING & PAGINATION
    // =========================================================

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // LOAD CAMPAIGNS
    // =========================================================

    useEffect(() => {
        let cancelled = false;

        const loadCampaigns = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetchCampaigns();

                if (cancelled) return;

                setCampaigns(extractCampaigns(response));
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Something went wrong while loading campaigns.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCampaigns();

        return () => {
            cancelled = true;
        };
    }, []);

    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(
        () => ({
            total: campaigns.length,
            unverified: campaigns.filter(
                (campaign) => campaign.status === 'unverified',
            ).length,
            active: campaigns.filter((campaign) => campaign.status === 'active')
                .length,
            completed: campaigns.filter(
                (campaign) => campaign.status === 'completed',
            ).length,
            rejected: campaigns.filter(
                (campaign) => campaign.status === 'rejected',
            ).length,
            cancelled: campaigns.filter(
                (campaign) => campaign.status === 'cancelled',
            ).length,
        }),
        [campaigns],
    );

    const categoryTabs = useMemo(
        () => [
            {
                key: 'all',
                label: 'All Campaigns',
                count: statistics.total,
            },
            {
                key: 'unverified',
                label: 'Unverified',
                count: statistics.unverified,
            },
            {
                key: 'active',
                label: 'Active',
                count: statistics.active,
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
            {
                key: 'cancelled',
                label: 'Cancelled',
                count: statistics.cancelled,
            },
        ],
        [statistics],
    );

    // =========================================================
    // FILTERING & SORTING
    // =========================================================

    const filteredCampaigns = useMemo(() => {
        let result = [...campaigns];

        if (activeCategory !== 'all') {
            result = result.filter(
                (campaign) => campaign.status === activeCategory,
            );
        }

        if (typeFilter !== 'all') {
            result = result.filter((campaign) => campaign.type === typeFilter);
        }

        if (categoryFilter !== 'all') {
            result = result.filter(
                (campaign) => campaign.category === categoryFilter,
            );
        }

        if (organizationFilter !== 'all') {
            result = result.filter(
                (campaign) =>
                    String(campaign.organization_id) ===
                    String(organizationFilter),
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(
                (campaign) => campaign.status === statusFilter,
            );
        }

        // CLASSIFICATION FILTER
        if (classificationFilter === 'featured') {
            result = result.filter((campaign) => Boolean(campaign.is_featured));
        } else if (classificationFilter === 'urgent') {
            result = result.filter((campaign) => Boolean(campaign.is_urgent));
        } else if (classificationFilter === 'unclassified') {
            result = result.filter(
                (campaign) => !campaign.is_featured && !campaign.is_urgent,
            );
        }

        // DEADLINE FILTER
        if (deadlineFilter === 'fixed') {
            result = result.filter(
                (campaign) =>
                    campaign.end_date !== null &&
                    campaign.end_date !== undefined &&
                    String(campaign.end_date).trim() !== '',
            );
        } else if (deadlineFilter === 'open') {
            result = result.filter(
                (campaign) =>
                    campaign.end_date === null ||
                    campaign.end_date === undefined ||
                    String(campaign.end_date).trim() === '',
            );
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((campaign) => {
                const searchableValues = [
                    campaign.title,
                    campaign.description,
                    campaign.category,
                    campaign.organization?.name,
                    campaign.organization_name,
                    campaign.location,
                    campaign.district,
                ];

                return searchableValues.some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(search),
                );
            });
        }

        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) =>
                compareValues(
                    a[sortConfig.key],
                    b[sortConfig.key],
                    sortConfig.key,
                    sortConfig.direction,
                ),
            );
        }

        return result;
    }, [
        campaigns,
        activeCategory,
        typeFilter,
        categoryFilter,
        organizationFilter,
        statusFilter,
        classificationFilter,
        deadlineFilter,
        searchTerm,
        sortConfig,
    ]);

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedCampaigns = useMemo(() => {
        const start = (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE;

        return filteredCampaigns.slice(start, start + CAMPAIGNS_PER_PAGE);
    }, [filteredCampaigns, safeCurrentPage]);

    // =========================================================
    // FILTER HANDLERS
    // =========================================================

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleTypeChange = (event) => {
        setTypeFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleOrganizationChange = (event) => {
        setOrganizationFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleClassificationChange = (event) => {
        setClassificationFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleDeadlineChange = (event) => {
        setDeadlineFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setActiveCategory('all');
        setTypeFilter('all');
        setCategoryFilter('all');
        setOrganizationFilter('all');
        setStatusFilter('all');
        setClassificationFilter('all');
        setDeadlineFilter('all');
        setSearchTerm('');
        setCurrentPage(1);
    };

    // =========================================================
    // CLASSIFICATION MANAGEMENT
    // =========================================================

    const handleManageClassification = (campaign) => {
        if (!campaign?.id) return;

        setClassificationCampaign(campaign);
    };

    const handleClassificationSave = ({ campaignId, classification }) => {
        setCampaigns((current) =>
            current.map((campaign) =>
                campaign.id === campaignId
                    ? {
                          ...campaign,
                          ...classification,
                      }
                    : campaign,
            ),
        );

        setClassificationCampaign(null);

        showSuccessToast('Campaign classification updated successfully.');
    };

    // =========================================================
    // SORT HANDLERS
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
    // PAGE NAVIGATION
    // =========================================================

    const handleCreate = () => {
        navigate(`${CAMPAIGNS_PATH}/add`);
    };

    const handleCampaignTypeClick = (campaign) => {
        if (!campaign) return;
    };

    const handleEdit = (campaign) => {
        if (!campaign?.id) return;

        if (!EDITABLE_STATUSES.includes(campaign.status)) {
            return;
        }

        navigate(`${CAMPAIGNS_PATH}/${campaign.id}/edit`);
    };

    const handleView = (campaign) => {
        if (!campaign?.id) return;

        navigate(`${CAMPAIGNS_PATH}/${campaign.id}`);
    };

    // =========================================================
    // CAMPAIGN VERIFICATION
    // =========================================================

    const handleReview = (campaign) => {
        if (campaign.status !== 'unverified') return;

        setVerificationError('');
        setVerificationCampaign(campaign);
    };

    const handleVerificationConfirm = async ({ status, verification_note }) => {
        if (!verificationCampaign) return;

        if (status !== 'active' && status !== 'rejected') {
            setVerificationError('Invalid verification decision.');
            return;
        }

        if (verificationCampaign.status !== 'unverified') {
            setVerificationError(
                'Only unverified campaigns can be verified or rejected.',
            );
            return;
        }

        try {
            setVerificationLoading(true);
            setVerificationError('');

            await verifyCampaign(verificationCampaign.id, {
                status,
                verification_note: verification_note || null,
            });

            setCampaigns((current) =>
                current.map((campaign) =>
                    campaign.id === verificationCampaign.id
                        ? {
                              ...campaign,
                              status,
                              verification_note: verification_note || null,
                          }
                        : campaign,
                ),
            );

            setVerificationCampaign(null);
            setVerificationError('');

            showSuccessToast(
                status === 'active'
                    ? 'Campaign verified successfully.'
                    : 'Campaign rejected successfully.',
            );

            try {
                const response = await fetchCampaigns();

                setCampaigns(extractCampaigns(response));
            } catch {
                // Keep the local status update if refreshing fails.
            }
        } catch (err) {
            setVerificationError(
                err?.message || 'Campaign verification failed.',
            );
        } finally {
            setVerificationLoading(false);
        }
    };

    // =========================================================
    // CAMPAIGN STATUS UPDATE
    // =========================================================

    const handleOpenStatusModal = (campaign) => {
        if (!campaign?.id || campaign.status !== 'active') return;

        setStatusUpdateError('');
        setStatusCampaign(campaign);
    };

    // =========================================================
    // CAMPAIGN STATUS UPDATE
    // =========================================================

    const handleStatusUpdateConfirm = async ({ status, status_note }) => {
        if (!statusCampaign) return;

        if (statusCampaign.status !== 'active') {
            setStatusUpdateError(
                'Only active campaigns can be completed or cancelled.',
            );
            return;
        }

        if (!['completed', 'cancelled'].includes(status)) {
            setStatusUpdateError('Invalid campaign status.');
            return;
        }

        try {
            setStatusUpdateLoading(true);
            setStatusUpdateError('');

            await updateCampaignStatus(statusCampaign.id, {
                status,
                status_note: status_note || null,
            });

            setCampaigns((current) =>
                current.map((campaign) =>
                    campaign.id === statusCampaign.id
                        ? {
                              ...campaign,
                              status,
                              status_note: status_note || null,
                          }
                        : campaign,
                ),
            );

            setStatusCampaign(null);

            showSuccessToast(
                status === 'completed'
                    ? 'Campaign marked as completed successfully.'
                    : 'Campaign cancelled successfully.',
            );

            try {
                const response = await fetchCampaigns();

                setCampaigns(extractCampaigns(response));
            } catch {
                // Preserve the successful local update if refreshing fails.
            }
        } catch (err) {
            // The API client may store validation errors directly on err.errors.
            // Axios-style errors may instead store them in response.data.
            const responseData = err?.response?.data;

            const errors = responseData?.errors ?? err?.errors ?? {};

            const statusError = errors.status;

            const validationError =
                (Array.isArray(statusError) ? statusError[0] : statusError) ||
                Object.values(errors)
                    .flat()
                    .find((message) => typeof message === 'string' && message);

            setStatusUpdateError(
                validationError ||
                    responseData?.message ||
                    (err?.message !== 'Campaign status update failed.'
                        ? err?.message
                        : '') ||
                    'Failed to update campaign status.',
            );
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const handleStatusModalClose = () => {
        if (statusUpdateLoading) return;

        setStatusCampaign(null);
        setStatusUpdateError('');
    };

    // =========================================================
    // VOLUNTEER ASSIGNMENT
    // =========================================================

    const handleAssignment = async (campaign) => {
        if (!campaign || campaign.status !== 'active') {
            return;
        }

        setAssignmentCampaign(campaign);
        setAssignmentVolunteers([]);
        setAssignmentHistory([]);
        setAssignmentError('');
        setAssignmentLoading(true);

        try {
            const [candidateData, assignmentData] = await Promise.all([
                fetchCampaignVolunteerCandidates(),
                fetchCampaignVolunteerAssignments(campaign.id),
            ]);

            const volunteers =
                candidateData?.volunteers ||
                candidateData?.data?.volunteers ||
                candidateData?.data ||
                [];

            const assignments =
                assignmentData?.assignments ||
                assignmentData?.data?.assignments ||
                assignmentData?.data ||
                [];

            setAssignmentVolunteers(
                Array.isArray(volunteers) ? volunteers : [],
            );

            setAssignmentHistory(Array.isArray(assignments) ? assignments : []);
        } catch (err) {
            setAssignmentError(
                err?.message ||
                    'Unable to load campaign volunteer information.',
            );
        } finally {
            setAssignmentLoading(false);
        }
    };

    const handleAssignmentConfirm = async (payload) => {
        if (!assignmentCampaign) return;

        try {
            setAssignmentSubmitting(true);
            setAssignmentError('');

            await assignCampaignVolunteer(assignmentCampaign.id, payload);

            const [candidateData, assignmentData] = await Promise.all([
                fetchCampaignVolunteerCandidates(),
                fetchCampaignVolunteerAssignments(assignmentCampaign.id),
            ]);

            const volunteers =
                candidateData?.volunteers ||
                candidateData?.data?.volunteers ||
                candidateData?.data ||
                [];

            const assignments =
                assignmentData?.assignments ||
                assignmentData?.data?.assignments ||
                assignmentData?.data ||
                [];

            setAssignmentVolunteers(
                Array.isArray(volunteers) ? volunteers : [],
            );

            setAssignmentHistory(Array.isArray(assignments) ? assignments : []);

            showSuccessToast('Volunteer assigned to campaign successfully.');
        } catch (err) {
            setAssignmentError(
                err?.message || 'Campaign volunteer assignment failed.',
            );
        } finally {
            setAssignmentSubmitting(false);
        }
    };

    const handleAssignmentClose = () => {
        if (assignmentSubmitting) return;

        setAssignmentCampaign(null);
        setAssignmentVolunteers([]);
        setAssignmentHistory([]);
        setAssignmentError('');
        setAssignmentLoading(false);
    };

    // =========================================================
    // CSV EXPORT
    // =========================================================

    const handleExportCSV = () => {
        if (filteredCampaigns.length === 0) return;

        const headers = [
            'Campaign',
            'Campaign Type',
            'Target',
            'Collected',
            'Start Date',
            'End Date',
            'Status',
            'Featured',
            'Urgent',
            'Urgency Priority',
        ];

        const csvRows = filteredCampaigns.map((campaign) => [
            campaign.title || '',
            campaign.type || '',
            campaign.target_amount ?? '',
            campaign.collected_amount ?? 0,
            campaign.start_date ? formatDate(campaign.start_date) : '',
            campaign.end_date ? formatDate(campaign.end_date) : '',
            campaign.status || '',
            campaign.is_featured ? 'Yes' : 'No',
            campaign.is_urgent ? 'Yes' : 'No',
            campaign.urgency_priority ?? 2,
        ]);

        const csvContent = [headers, ...csvRows]
            .map((row) =>
                row
                    .map((value) => {
                        const text = String(value ?? '')
                            .replace(/^[=+\-@\t\r]/, "'")
                            .replace(/"/g, '""');

                        return `"${text}"`;
                    })
                    .join(','),
            )
            .join('\r\n');

        const blob = new Blob(['\uFEFF', csvContent], {
            type: 'text/csv;charset=utf-8;',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'stand-for-people-campaigns.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =========================================================
    // LOADING / ERROR
    // =========================================================

    if (loading || error) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Campaigns"
                    subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
                />

                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading campaigns..."
                        description="Please wait while we retrieve the campaign list."
                    />
                ) : (
                    <LoadingError
                        title="Unable to load campaigns"
                        message={error}
                    />
                )}
            </div>
        );
    }

    // =========================================================
    // PREPARE TABLE ROWS
    // =========================================================

    const rows = paginatedCampaigns.map((campaign, index) => ({
        ...campaign,

        serialNumber: (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE + index + 1,

        campaignType: getCampaignTypeLabel(campaign.type),

        target:
            campaign.target_amount !== null &&
            campaign.target_amount !== undefined
                ? formatMoney(campaign.target_amount)
                : '—',

        collected: formatMoney(campaign.collected_amount),

        formattedStartDate: formatDate(campaign.start_date),
        formattedEndDate: formatDate(campaign.end_date),

        locationName:
            campaign.location || campaign.district || 'Location not specified',
    }));

    // =========================================================
    // TABLE COLUMNS
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
            header: 'Campaign',
            sortable: true,
            sortKey: 'title',

            render: (value, row) => (
                <div className="min-w-0 max-w-90">
                    <p className="truncate font-semibold text-[#E5EAF0]">
                        {value || 'Untitled campaign'}
                    </p>

                    {row.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8792A1]">
                            {row.description}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {row.category && (
                            <span className="inline-flex items-center rounded-full bg-[#1A222D] px-2 py-0.5 text-[10px] font-semibold capitalize text-[#8792A1]">
                                {row.category}
                            </span>
                        )}

                        {row.locationName !== 'Location not specified' && (
                            <>
                                <span className="text-[10px] text-[#596575]">
                                    •
                                </span>

                                <span className="truncate text-[10px] font-medium text-[#8792A1]">
                                    {row.locationName}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'campaignType',
            header: 'Campaign Type',
            sortable: true,
            sortKey: 'type',

            render: (value, row) => (
                <button
                    type="button"
                    onClick={() => handleCampaignTypeClick(row)}
                    className="text-left text-sm font-semibold text-[#A9B7C7] underline decoration-[#596575] underline-offset-4 transition-colors hover:text-[#EEF1F5] hover:decoration-[#A9B7C7]"
                    title={
                        row.type === 'local_case'
                            ? 'View connected help request'
                            : row.type === 'organization_proposed'
                              ? 'View connected organization'
                              : 'View global campaign details'
                    }
                >
                    {value}
                </button>
            ),
        },
        {
            key: 'target',
            header: 'Target',
            align: 'right',
            sortable: true,
            sortKey: 'target_amount',

            render: (value) => (
                <span className="whitespace-nowrap font-semibold text-[#E5EAF0]">
                    {value}
                </span>
            ),
        },
        {
            key: 'collected',
            header: 'Collected',
            align: 'right',
            sortable: true,
            sortKey: 'collected_amount',

            render: (value) => (
                <span className="whitespace-nowrap font-semibold text-[#E5EAF0]">
                    {value}
                </span>
            ),
        },
        {
            key: 'formattedStartDate',
            header: 'Start Date',
            sortable: true,
            sortKey: 'start_date',

            render: (value) => (
                <span className="whitespace-nowrap text-sm font-medium text-[#E5EAF0]">
                    {value}
                </span>
            ),
        },
        {
            key: 'formattedEndDate',
            header: 'End Date',
            sortable: true,
            sortKey: 'end_date',

            render: (value) => (
                <span className="whitespace-nowrap text-sm font-medium text-[#E5EAF0]">
                    {value}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',

            render: (_value, row) => {
                const canEdit = EDITABLE_STATUSES.includes(row.status);
                const canVerify = row.status === 'unverified';
                const canAssign = row.status === 'active';

                return (
                    <div className="flex flex-col items-end gap-3">
                        <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="text-right text-xs font-semibold text-[#8792A1] transition-colors hover:text-[#A9B7C7]"
                        >
                            View
                        </button>

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                className="text-right text-xs font-semibold text-[#8792A1] transition-colors hover:text-[#A9B7C7]"
                            >
                                Edit
                            </button>
                        )}

                        {canVerify && (
                            <button
                                type="button"
                                onClick={() => handleReview(row)}
                                className="text-right text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                            >
                                Verify
                            </button>
                        )}

                        {canAssign && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleAssignment(row)}
                                    className="text-right text-xs font-semibold text-[#A9B7C7] transition-colors hover:text-[#EEF1F5]"
                                >
                                    Assign Volunteers
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOpenStatusModal(row)}
                                    className="text-right text-xs font-semibold text-[#C9B58B] transition-colors hover:text-[#F0D9A7]"
                                >
                                    Update Status
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => handleManageClassification(row)}
                            className="text-right text-xs font-semibold text-[#C9B58B] transition-colors hover:text-[#F0D9A7]"
                        >
                            Classification
                        </button>
                    </div>
                );
            },
        },
    ];

    // =========================================================
    // FILTER PANEL
    // =========================================================

    const filterPanel = (
        <CampaignFilters
            categoryTabs={categoryTabs}
            activeCategory={activeCategory}
            onStatusCategoryChange={handleCategoryChange}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            organizationFilter={organizationFilter}
            classificationFilter={classificationFilter}
            deadlineFilter={deadlineFilter}
            campaigns={campaigns}
            onTypeChange={handleTypeChange}
            onCategoryChange={handleCategoryFilterChange}
            onOrganizationChange={handleOrganizationChange}
            onClassificationChange={handleClassificationChange}
            onDeadlineChange={handleDeadlineChange}
            onClearFilters={resetFilters}
        />
    );

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Campaigns"
                    subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
                    action={
                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={!filteredCampaigns.length}
                                className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-[12px] font-medium text-[#B8C2CF] transition-colors hover:bg-[#1C232D] disabled:opacity-40"
                            >
                                <Download size={15} />
                                Export
                            </button>

                            <button
                                type="button"
                                onClick={handleCreate}
                                className="inline-flex h-10 items-center gap-2 bg-[#263343] px-4 text-[12px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#354559]"
                            >
                                <Plus size={16} />
                                Add Campaign
                            </button>
                        </div>
                    }
                />

                <CampaignStats
                    total={statistics.total}
                    unverified={statistics.unverified}
                    active={statistics.active}
                    completed={statistics.completed}
                    rejected={statistics.rejected}
                    cancelled={statistics.cancelled}
                />

                <section className="pt-2 lg:pt-3">
                    <div className="pb-5 sm:pb-6">
                        <h2 className="!font-sans !text-[20px] !font-semibold !tracking-[-0.02em] !text-[#EEF1F5]">
                            Campaign Directory
                        </h2>

                        <p className="mt-2 text-[12px] leading-relaxed text-[#8792A1]">
                            Browse and manage fundraising campaigns.
                        </p>
                    </div>

                    {/* MOBILE FILTER BUTTON */}
                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-10 w-full items-center justify-between border border-[#29323E] bg-[#0E1219] px-3.5 text-[12px] text-[#AEB7C3]"
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={15} />
                                Filters
                            </span>

                            <span className="text-[#697586]">
                                Refine campaigns
                            </span>
                        </button>
                    </div>

                    {/* MOBILE FILTER DRAWER */}
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
                                    <span>Campaign filters</span>

                                    <button
                                        type="button"
                                        aria-label="Close filters"
                                        onClick={() =>
                                            setMobileFiltersOpen(false)
                                        }
                                        className="text-[#AEB7C3] hover:text-white"
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
                                        className="h-10 w-full bg-[#263343] text-[12px] font-medium text-[#EEF1F5]"
                                    >
                                        Show results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TABLE + FILTER SIDEBAR */}
                    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="relative min-h-0 min-w-0 xl:h-full">
                            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                                {/* TABLE TOOLBAR */}
                                <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                    <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="relative min-w-0 flex-1">
                                            <Search
                                                size={15}
                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#697586]"
                                            />

                                            <input
                                                type="search"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                placeholder="Search campaigns by title, organization or location"
                                                className="h-10 w-full border border-[#35404E] bg-[#0E1219] pl-9 pr-4 text-[12px] text-[#DCE3EC] outline-none placeholder:text-[#697586] transition-colors hover:border-[#455160] focus:border-[#455160]"
                                            />
                                        </div>

                                        <span className="shrink-0 text-[11px] font-medium text-[#AAB3BF]">
                                            {filteredCampaigns.length}{' '}
                                            {filteredCampaigns.length === 1
                                                ? 'result'
                                                : 'results'}
                                        </span>
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#303A47]">
                                    <CampaignTable
                                        columns={columns}
                                        rows={rows}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        resultCount={filteredCampaigns.length}
                                        onManageClassification={
                                            handleManageClassification
                                        }
                                        onUpdateStatus={handleOpenStatusModal}
                                    />
                                </div>

                                {/* PAGINATION */}
                                {filteredCampaigns.length > 0 && (
                                    <div className="shrink-0 border-t border-[#252D38] bg-[#1A222D]">
                                        <CampaignPagination
                                            currentPage={safeCurrentPage}
                                            totalPages={totalPages}
                                            totalItems={
                                                filteredCampaigns.length
                                            }
                                            itemsPerPage={CAMPAIGNS_PER_PAGE}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DESKTOP FILTER SIDEBAR */}
                        <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:block">
                            {filterPanel}
                        </aside>
                    </div>
                </section>
            </div>

            {/* SUCCESS DIALOG */}
            <SuccessDialog
                open={successToast.show}
                title="Action completed"
                message={successToast.message}
                onClose={closeSuccessToast}
            />

            {/* CLASSIFICATION MODAL */}
            {classificationCampaign && (
                <ClassificationModal
                    key={classificationCampaign.id}
                    campaign={classificationCampaign}
                    onClose={() => setClassificationCampaign(null)}
                    onSave={handleClassificationSave}
                />
            )}

            {/* VERIFICATION MODAL */}
            {verificationCampaign && (
                <CampaignVerificationModal
                    campaign={verificationCampaign}
                    loading={verificationLoading}
                    error={verificationError}
                    onClose={() => {
                        if (!verificationLoading) {
                            setVerificationCampaign(null);
                            setVerificationError('');
                        }
                    }}
                    onConfirm={handleVerificationConfirm}
                />
            )}

            {/* CAMPAIGN STATUS UPDATE MODAL */}
            {statusCampaign && (
                <StatusUpdateModal
                    key={statusCampaign.id}
                    campaign={statusCampaign}
                    loading={statusUpdateLoading}
                    error={statusUpdateError}
                    onClose={handleStatusModalClose}
                    onConfirm={handleStatusUpdateConfirm}
                />
            )}

            {/* VOLUNTEER ASSIGNMENT MODAL */}
            {assignmentCampaign && (
                <CampaignAssignmentModal
                    campaign={assignmentCampaign}
                    volunteers={assignmentVolunteers}
                    assignments={assignmentHistory}
                    loading={assignmentLoading || assignmentSubmitting}
                    error={assignmentError}
                    onClose={handleAssignmentClose}
                    onConfirm={handleAssignmentConfirm}
                />
            )}
        </>
    );
}
