import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Download,
    Send,
    X,
    Search,
    SlidersHorizontal,
    ArrowUp,
    ArrowDown,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import VolunteerRequestModal from './modals/VolunteerRequestModal';
import EditModal from './modals/EditModal';

import VolunteerStats from './components/Stats';
import VolunteerFilters from './components/Filters';
import VolunteerTable from './components/Table';
import VolunteerPagination from './components/Pagination';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import {
    fetchVolunteers,
    fetchVolunteerCandidates,
    fetchVolunteerRequests,
    sendVolunteerRequests,
    fetchVolunteerDetails,
    updateVolunteerStatus,
} from './api/volunteerApi';

const VOLUNTEERS_PER_PAGE = 25;

const Volunteers = () => {
    const navigate = useNavigate();

    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({
        key: 'volunteerName',
        direction: 'asc',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [volunteerRequests, setVolunteerRequests] = useState([]);

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [candidateUsers, setCandidateUsers] = useState([]);
    const [candidateLoading, setCandidateLoading] = useState(false);
    const [candidateError, setCandidateError] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestError, setRequestError] = useState('');

    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState('');

    const [success, setSuccess] = useState({
        open: false,
        action: 'updated',
        entity: 'volunteer',
        name: '',
    });

    const showSuccessDialog = (
        name,
        action = 'updated',
        entity = 'volunteer',
    ) => {
        setSuccess({ open: true, action, entity, name });
    };

    const closeSuccessDialog = () => {
        setSuccess((current) => ({ ...current, open: false }));
    };

    // ============================================================
    // NORMALIZE VOLUNTEER RESPONSE
    // ============================================================

    const normalizeVolunteersResponse = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.volunteers)) {
            return response.volunteers;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    };

    // ============================================================
    // NORMALIZE REQUEST RESPONSE
    // ============================================================

    const normalizeRequestsResponse = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.requests)) {
            return response.requests;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        return [];
    };

    // ============================================================
    // NORMALIZE SINGLE VOLUNTEER RESPONSE
    //
    // IMPORTANT:
    // Keep BOTH volunteer AND assignments.
    // ============================================================

    const normalizeVolunteerDetailsResponse = (response) => {
        if (!response || typeof response !== 'object') {
            return {
                volunteer: null,
                assignments: [],
            };
        }

        const root =
            response?.data &&
            typeof response.data === 'object' &&
            !Array.isArray(response.data)
                ? response.data
                : response;

        const volunteer =
            root?.volunteer && typeof root.volunteer === 'object'
                ? root.volunteer
                : root;

        /*
         * IMPORTANT:
         * adminShow() returns campaignVolunteerAssignments
         * inside the volunteer object because the backend
         * eager-loads:
         *
         * Volunteer::with([
         *   ...
         *   'campaignVolunteerAssignments',
         * ])
         *
         * Laravel serializes that relationship as:
         *
         * volunteer.campaign_volunteer_assignments
         *
         * Therefore we check both the root response and
         * the volunteer object.
         */
        const assignments =
            root?.assignments ??
            root?.campaign_assignments ??
            root?.campaign_volunteer_assignments ??
            root?.campaignVolunteerAssignments ??
            volunteer?.assignments ??
            volunteer?.campaign_assignments ??
            volunteer?.campaign_volunteer_assignments ??
            volunteer?.campaignVolunteerAssignments ??
            [];

        return {
            volunteer,
            assignments: Array.isArray(assignments) ? assignments : [],
        };
    };

    // ============================================================
    // LOAD INITIAL DATA
    // ============================================================

    useEffect(() => {
        let cancelled = false;

        const loadInitialData = async () => {
            setLoading(true);

            setPageError('');

            try {
                const [volunteerResponse, requestResponse] = await Promise.all([
                    fetchVolunteers(),
                    fetchVolunteerRequests(),
                ]);

                if (cancelled) {
                    return;
                }

                const volunteerList =
                    normalizeVolunteersResponse(volunteerResponse);

                const requestList = normalizeRequestsResponse(requestResponse);

                setVolunteers(volunteerList);
                setVolunteerRequests(requestList);
            } catch (err) {
                console.error('VOLUNTEER LOAD ERROR:', err);

                if (!cancelled) {
                    const message =
                        err?.message || 'Unable to load volunteer information.';

                    setPageError(message);
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

    // ============================================================
    // REFRESH
    // ============================================================

    const refreshVolunteerData = async () => {
        try {
            setPageError('');

            const [volunteerResponse, requestResponse] = await Promise.all([
                fetchVolunteers(),
                fetchVolunteerRequests(),
            ]);

            const volunteerList =
                normalizeVolunteersResponse(volunteerResponse);

            const requestList = normalizeRequestsResponse(requestResponse);

            setVolunteers(volunteerList);
            setVolunteerRequests(requestList);
        } catch (err) {
            console.error('VOLUNTEER REFRESH ERROR:', err);

            const message =
                err?.message || 'Unable to refresh volunteer information.';

            setPageError(message);

            throw err;
        }
    };

    // ============================================================
    // INVITATION MODAL
    // ============================================================

    const openRequestModal = async () => {
        setShowRequestModal(true);
        setCandidateLoading(true);
        setCandidateError('');
        setRequestError('');
        setSelectedUsers([]);

        try {
            const response = await fetchVolunteerCandidates();

            const users = Array.isArray(response)
                ? response
                : Array.isArray(response?.users)
                  ? response.users
                  : Array.isArray(response?.data)
                    ? response.data
                    : [];

            setCandidateUsers(users);
        } catch (err) {
            console.error('VOLUNTEER CANDIDATES LOAD ERROR:', err);

            setCandidateError(
                err?.message || 'Unable to load eligible individuals.',
            );
        } finally {
            setCandidateLoading(false);
        }
    };

    const closeRequestModal = () => {
        if (requestLoading) {
            return;
        }

        setShowRequestModal(false);
        setCandidateUsers([]);
        setSelectedUsers([]);
        setCandidateError('');
        setRequestError('');
    };

    const handleToggleUser = (userId) => {
        setSelectedUsers((current) => {
            if (current.includes(userId)) {
                return current.filter((id) => id !== userId);
            }

            return [...current, userId];
        });
    };

    const handleSelectAll = () => {
        if (candidateUsers.length === 0) {
            return;
        }

        const allIds = candidateUsers.map((user) => user.id);

        const allSelected = allIds.every((id) => selectedUsers.includes(id));

        setSelectedUsers(allSelected ? [] : allIds);
    };

    const handleSendRequests = async () => {
        if (selectedUsers.length === 0) {
            return;
        }

        const selectedCount = selectedUsers.length;

        setRequestLoading(true);
        setRequestError('');

        try {
            await sendVolunteerRequests(selectedUsers);

            setShowRequestModal(false);
            setCandidateUsers([]);
            setSelectedUsers([]);

            await refreshVolunteerData();

            showSuccessDialog(
                selectedCount === 1
                    ? 'Volunteer invitation'
                    : `${selectedCount} volunteer invitations`,
                'created',
                'volunteer invitation',
            );
        } catch (err) {
            console.error('VOLUNTEER REQUEST SEND ERROR:', err);

            setRequestError(
                err?.message || 'Unable to send volunteer invitations.',
            );
        } finally {
            setRequestLoading(false);
        }
    };

    // ============================================================
    // VIEW VOLUNTEER — DEDICATED DETAILS PAGE
    // ============================================================

    const handleViewVolunteer = (volunteerId) => {
        if (volunteerId == null || volunteerId === '') return;
        navigate(
            `/admin/dashboard/volunteers/${encodeURIComponent(volunteerId)}`,
        );
    };

    // ============================================================
    // EDIT VOLUNTEER
    // ============================================================

    const handleEditVolunteer = async (volunteerId) => {
        if (!volunteerId) {
            return;
        }

        setEditModalOpen(true);
        setEditLoading(true);
        setEditError('');
        setSelectedVolunteer(null);

        try {
            const response = await fetchVolunteerDetails(volunteerId);

            const volunteer = normalizeVolunteerDetailsResponse(response);

            setSelectedVolunteer(volunteer.volunteer);
        } catch (err) {
            console.error('VOLUNTEER EDIT LOAD ERROR:', err);

            setEditError(
                err?.message || 'Unable to load volunteer information.',
            );
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditModal = () => {
        if (editSaving) {
            return;
        }

        setEditModalOpen(false);
        setEditLoading(false);
        setEditError('');
        setSelectedVolunteer(null);
    };

    const handleSaveVolunteerStatus = async (status) => {
        if (!selectedVolunteer?.id || editSaving) {
            return;
        }

        setEditSaving(true);
        setEditError('');

        try {
            await updateVolunteerStatus(selectedVolunteer.id, status);

            setEditModalOpen(false);
            setSelectedVolunteer(null);

            await refreshVolunteerData();

            showSuccessDialog(
                selectedVolunteer?.user?.name ||
                    selectedVolunteer?.name ||
                    'Volunteer',
                'updated',
            );
        } catch (err) {
            console.error('VOLUNTEER STATUS UPDATE ERROR:', err);

            setEditError(err?.message || 'Unable to update volunteer status.');
        } finally {
            setEditSaving(false);
        }
    };

    // ============================================================
    // REQUEST FILTERING
    // ============================================================

    /*
     * ALL pending requests.
     *
     * This includes:
     *
     * 1. user_to_admin
     *    Individual applied / requested reactivation.
     *
     * 2. admin_to_user
     *    Admin sent a volunteer invitation.
     *
     * This dataset is used for the Pending statistic.
     */
    const pendingRequests = useMemo(() => {
        return volunteerRequests.filter((request) => {
            const status = String(request?.status ?? '')
                .trim()
                .toLowerCase();

            return status === 'pending';
        });
    }, [volunteerRequests]);

    // Requests are managed on the dedicated Volunteer Requests page.
    const pendingApplicationRequests = useMemo(() => {
        return pendingRequests.filter(
            (request) => request?.request_direction === 'user_to_admin',
        );
    }, [pendingRequests]);

    // ============================================================
    // STATISTICS
    // ============================================================

    const confirmedVolunteers = useMemo(
        () =>
            volunteers.filter(
                (volunteer) =>
                    !['pending', 'invited'].includes(
                        String(volunteer.status ?? '').toLowerCase(),
                    ),
            ),
        [volunteers],
    );

    const statistics = useMemo(() => {
        const active = confirmedVolunteers.filter(
            (volunteer) => volunteer.status === 'active',
        ).length;

        const inactive = confirmedVolunteers.filter(
            (volunteer) => volunteer.status === 'inactive',
        ).length;

        const suspended = confirmedVolunteers.filter(
            (volunteer) => volunteer.status === 'suspended',
        ).length;

        /*
         * Pending includes BOTH:
         *
         * - user -> admin applications
         * - admin -> user invitations
         */
        const pendingApplications = pendingRequests.length;

        return {
            total: confirmedVolunteers.length,
            active,
            inactive,
            suspended,
            pendingApplications,
            invitations: pendingRequests.filter(
                (request) => request?.request_direction === 'admin_to_user',
            ).length,
            applications: pendingApplicationRequests.length,
        };
    }, [confirmedVolunteers, pendingRequests, pendingApplicationRequests]);

    const getAvailability = (volunteer) => {
        const value = volunteer.availability ?? volunteer.user?.availability;
        if (value === true || value === 1 || value === '1') return 'available';
        if (value === false || value === 0 || value === '0')
            return 'unavailable';
        const normalized = String(value ?? '')
            .trim()
            .toLowerCase();
        if (['available', 'yes', 'true'].includes(normalized))
            return 'available';
        if (['unavailable', 'no', 'false'].includes(normalized))
            return 'unavailable';
        return 'unknown';
    };

    const handleSort = (key) => {
        setSortConfig((previous) => {
            if (previous.key !== key) return { key, direction: 'asc' };
            if (previous.direction === 'asc') return { key, direction: 'desc' };
            return { key: null, direction: null };
        });
        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key || !sortConfig.direction)
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} strokeWidth={1.8} />
        ) : (
            <ArrowDown size={14} strokeWidth={1.8} />
        );
    };

    // ============================================================
    // FILTER
    // ============================================================

    const filteredVolunteers = useMemo(() => {
        let result = [...confirmedVolunteers];

        if (statusFilter !== 'all') {
            result = result.filter(
                (volunteer) => volunteer.status === statusFilter,
            );
        }

        if (availabilityFilter !== 'all') {
            result = result.filter(
                (volunteer) =>
                    getAvailability(volunteer) === availabilityFilter,
            );
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((volunteer) => {
                const name = (
                    volunteer.user?.name ||
                    volunteer.name ||
                    ''
                ).toLowerCase();

                const email = (
                    volunteer.user?.email ||
                    volunteer.email ||
                    ''
                ).toLowerCase();

                return name.includes(search) || email.includes(search);
            });
        }

        if (sortConfig.key && sortConfig.direction) {
            const getValue = (volunteer) => {
                switch (sortConfig.key) {
                    case 'volunteerName':
                        return volunteer.user?.name || volunteer.name || '';
                    case 'status':
                        return volunteer.status || '';
                    case 'availability':
                        return getAvailability(volunteer);
                    default:
                        return volunteer[sortConfig.key] ?? '';
                }
            };
            result.sort((a, b) => {
                const comparison = String(getValue(a)).localeCompare(
                    String(getValue(b)),
                    undefined,
                    { numeric: true, sensitivity: 'base' },
                );
                return sortConfig.direction === 'asc'
                    ? comparison
                    : -comparison;
            });
        }
        return result;
    }, [
        confirmedVolunteers,
        searchTerm,
        statusFilter,
        availabilityFilter,
        sortConfig,
    ]);

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredVolunteers.length / VOLUNTEERS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedVolunteers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * VOLUNTEERS_PER_PAGE;

        return filteredVolunteers.slice(
            startIndex,
            startIndex + VOLUNTEERS_PER_PAGE,
        );
    }, [filteredVolunteers, safeCurrentPage]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleAvailabilityChange = (event) => {
        setAvailabilityFilter(event.target.value);
        setCurrentPage(1);
    };

    // ============================================================
    // CSV
    // ============================================================

    const handleExportCSV = () => {
        if (filteredVolunteers.length === 0) {
            return;
        }

        const headers = ['Name', 'Email', 'Status', 'Availability'];

        const csvRows = filteredVolunteers.map((volunteer) => [
            volunteer.user?.name || volunteer.name || '',
            volunteer.user?.email || volunteer.email || '',
            volunteer.status || '',
            volunteer.availability || '',
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
        link.download = 'stand-for-people-volunteers.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessDialog(
            'Volunteer directory export',
            'created',
            'volunteer export',
        );
    };

    // ============================================================
    // TABLE
    // ============================================================

    const rows = paginatedVolunteers.map((volunteer) => ({
        ...volunteer,

        volunteerName:
            volunteer.user?.name || volunteer.name || 'Unknown volunteer',

        email: volunteer.user?.email || volunteer.email || 'N/A',

        availability: getAvailability(volunteer),
    }));

    const tableColumns = [
        {
            key: 'volunteerName',
            header: 'Volunteer',
            sortable: true,
            sortKey: 'volunteerName',
            width: 'minmax(210px, 1.6fr)',
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: 'minmax(115px, 0.85fr)',
        },
        {
            key: 'availability',
            header: 'Availability',
            sortable: true,
            sortKey: 'availability',
            width: 'minmax(145px, 1fr)',
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '100px',
        },
    ];

    // ============================================================
    // LOADING / ERROR — SAME STRUCTURE AS USERS
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Volunteers"
                    subtitle="Manage volunteer accounts, applications, and participation."
                />
                <LoadingUI
                    variant="page"
                    title="Loading volunteers..."
                    description="Please wait while we retrieve the volunteer directory."
                />
            </div>
        );
    }

    if (pageError) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Volunteers"
                    subtitle="Manage volunteer accounts, applications, and participation."
                />
                <LoadingError
                    title="Unable to load volunteers"
                    message={pageError}
                />
            </div>
        );
    }

    const activeFilterCount =
        Number(statusFilter !== 'all') + Number(availabilityFilter !== 'all');
    const filters = (
        <VolunteerFilters
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            availabilityFilter={availabilityFilter}
            onAvailabilityChange={handleAvailabilityChange}
        />
    );

    return (
        <>
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="All Volunteers"
                    subtitle="Manage confirmed volunteer memberships and availability."
                    action={
                        <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:justify-end">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredVolunteers.length === 0}
                                className="group inline-flex h-10 items-center justify-center gap-2 border border-[#343e4b] bg-transparent px-3.5 font-sans text-[12px] font-medium whitespace-nowrap text-[#b8c2cf] transition-colors duration-150 hover:border-[#4b596a] hover:bg-[#1c232d] hover:text-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4b596a] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Download
                                    size={15}
                                    strokeWidth={1.8}
                                    className="shrink-0 text-[#8492a3] transition-colors group-hover:text-[#d5dde6]"
                                />
                                Export CSV
                            </button>
                            <button
                                type="button"
                                onClick={openRequestModal}
                                className="group inline-flex h-10 items-center justify-center gap-2.5 border border-[#0f766e] bg-[#0f766e] px-4 font-sans text-[12px] font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:border-[#115e59] hover:bg-[#115e59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4]"
                            >
                                <Send
                                    size={16}
                                    strokeWidth={2}
                                    className="shrink-0"
                                />
                                Invite Volunteers
                            </button>
                        </div>
                    }
                />

                <VolunteerStats
                    total={statistics.total}
                    active={statistics.active}
                    invitations={statistics.invitations}
                    applications={statistics.applications}
                    inactive={statistics.inactive}
                    suspended={statistics.suspended}
                />

                {/* VOLUNTEER DIRECTORY */}
                <section className="pt-2 lg:pt-3">
                    {/* ===============================================
                        SECTION HEADING
                    =============================================== */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            pb-5
                            sm:pb-6
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div className="min-w-0">
                            <h2
                                className="
                                    font-sans!

                                    text-[20px]
                                    font-semibold!
                                    leading-tight
                                    tracking-[-0.02em]
                                    text-[#EEF1F5]!
                                "
                            >
                                Volunteer Directory
                            </h2>

                            <p
                                className="
                                    mt-2
                                    max-w-xl

                                    font-sans!
                                    text-[12px]
                                    leading-[1.65]

                                    text-[#8792A1]
                                "
                            >
                                Browse and manage registered volunteer profiles.
                            </p>
                        </div>
                    </div>

                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex h-10 w-full items-center justify-between border border-[#252D38] bg-[#0E1219] px-3.5 font-sans! text-[11px] font-medium! text-[#AEB7C3]! transition-colors hover:border-[#35404E] hover:bg-[#151B24]"
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={14} /> Filters
                            </span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center bg-[#1D2632] px-1.5 text-[10px] text-[#EEF1F5]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:min-h-[610px] xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="relative min-h-0 min-w-0 xl:min-h-[610px] xl:h-full">
                            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:absolute xl:inset-0">
                                <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                    <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="relative">
                                                <Search
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#697586]"
                                                />
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                    placeholder="Search by name or email"
                                                    className="h-10 w-full border border-[#29323E] bg-[#0A0E14] pr-16 pl-9 font-sans! text-[12px] font-medium! text-[#EEF1F5]! outline-none transition-colors placeholder:text-[#5E6978] hover:border-[#394553] focus:border-[#4B5869] focus:ring-0"
                                                />
                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchTerm('');
                                                            setCurrentPage(1);
                                                        }}
                                                        className="absolute top-1/2 right-3 -translate-y-1/2 font-sans! text-[10px] font-semibold! text-[#788493]! hover:text-[#EEF1F5]!"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <span className="shrink-0 font-sans! text-[11px] font-medium! text-[#AAB3BF]!">
                                            {filteredVolunteers.length}{' '}
                                            {filteredVolunteers.length === 1
                                                ? 'result'
                                                : 'results'}
                                        </span>
                                    </div>
                                </div>
                                <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0A0E14] [&::-webkit-scrollbar-thumb]:bg-[#303A47] hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]">
                                    <VolunteerTable
                                        columns={tableColumns}
                                        rows={rows}
                                        resultCount={filteredVolunteers.length}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        onView={handleViewVolunteer}
                                        onEdit={handleEditVolunteer}
                                    />
                                </div>
                                {filteredVolunteers.length > 0 && (
                                    <div className="shrink-0 border-t border-[#252D38] bg-[#1A222D]">
                                        <VolunteerPagination
                                            currentPage={safeCurrentPage}
                                            totalPages={totalPages}
                                            totalItems={
                                                filteredVolunteers.length
                                            }
                                            perPage={VOLUNTEERS_PER_PAGE}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <aside className="hidden min-w-0 border border-[#252D38] bg-[#0E1219] xl:min-h-[610px] xl:block">
                            {filters}
                        </aside>
                    </div>
                </section>
            </div>

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-100 xl:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="absolute inset-0 bg-[#05070A]/75 backdrop-blur-[2px]"
                    />
                    <div className="absolute right-0 bottom-0 left-0 max-h-[85vh] overflow-y-auto border-t border-[#252D38] bg-[#0E1219] shadow-[0_-20px_60px_rgba(0,0,0,0.45)] sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:h-full sm:max-h-none sm:w-[340px] sm:border-t-0 sm:border-l md:w-[360px] lg:w-[380px]">
                        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#252D38] bg-[#0E1219]/95 px-4 py-3.5 backdrop-blur-md">
                            <div>
                                <p className="font-sans! text-[10px] font-semibold! uppercase tracking-[0.12em] text-[#697586]!">
                                    Volunteer directory
                                </p>
                                <p className="mt-1 font-sans! text-[14px] font-semibold! text-[#EEF1F5]!">
                                    Filters
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close filters"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="flex h-9 w-9 items-center justify-center border border-[#29323E] bg-[#151B24] text-[#8792A1] transition-colors hover:bg-[#1A222D] hover:text-[#EEF1F5]"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {filters}
                        <div className="sticky bottom-0 z-30 border-t border-[#252D38] bg-[#0E1219]/95 p-4 backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="flex h-10 w-full items-center justify-center border border-[#394555] bg-[#171E28] font-sans! text-[12px] font-semibold! text-[#EEF1F5]! hover:bg-[#1D2632]"
                            >
                                Show {filteredVolunteers.length}{' '}
                                {filteredVolunteers.length === 1
                                    ? 'volunteer'
                                    : 'volunteers'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessDialog
                open={success.open}
                entity={success.entity}
                action={success.action}
                name={success.name}
                onClose={closeSuccessDialog}
            />

            <VolunteerRequestModal
                open={showRequestModal}
                users={candidateUsers}
                selectedUsers={selectedUsers}
                loading={candidateLoading}
                submitting={requestLoading}
                error={candidateError || requestError}
                onClose={closeRequestModal}
                onToggleUser={handleToggleUser}
                onSelectAll={handleSelectAll}
                onSubmit={handleSendRequests}
            />

            {/* EDIT VOLUNTEER */}

            <EditModal
                open={editModalOpen}
                volunteer={selectedVolunteer?.volunteer || selectedVolunteer}
                loading={editLoading}
                saving={editSaving}
                error={editError}
                onClose={closeEditModal}
                onSave={handleSaveVolunteerStatus}
            />
        </>
    );
};

export default Volunteers;
