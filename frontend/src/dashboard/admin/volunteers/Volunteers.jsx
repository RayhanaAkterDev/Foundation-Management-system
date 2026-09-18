import React, { useEffect, useMemo, useState } from 'react';

import { Download, Send } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import VolunteerRequestModal from './modals/VolunteerRequestModal';

import VolunteerStats from './components/Stats';

import VolunteerFilters from './components/Filters';

import VolunteerTable from './components/Table';

import VolunteerPagination from './components/Pagination';

import VolunteerSuccessToast from './components/SuccessToast';

import {
    fetchVolunteers,
    fetchVolunteerCandidates,
    sendVolunteerRequests,
} from './api/volunteerApi';

const VOLUNTEERS_PER_PAGE = 25;

const Volunteers = () => {
    const [volunteers, setVolunteers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [statusFilter, setStatusFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);

    // --------------------------------
    // Volunteer request modal
    // --------------------------------

    const [showRequestModal, setShowRequestModal] = useState(false);

    const [candidateUsers, setCandidateUsers] = useState([]);

    const [candidateLoading, setCandidateLoading] = useState(false);

    const [candidateError, setCandidateError] = useState('');

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [requestLoading, setRequestLoading] = useState(false);

    const [requestError, setRequestError] = useState('');

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

        window.setTimeout(() => {
            setToast({
                show: false,
                message: '',
            });
        }, 3000);
    };

    // --------------------------------
    // Normalize API response
    // --------------------------------

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

    // --------------------------------
    // Load volunteers
    // --------------------------------

    useEffect(() => {
        let cancelled = false;

        const loadInitialVolunteers = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetchVolunteers();

                console.log('VOLUNTEER API RESPONSE:', response);

                const volunteerList = normalizeVolunteersResponse(response);

                console.log('NORMALIZED VOLUNTEERS:', volunteerList);

                if (!cancelled) {
                    setVolunteers(volunteerList);
                }
            } catch (err) {
                console.error('VOLUNTEER LOAD ERROR:', err);

                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Unable to load the volunteer directory.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialVolunteers();

        return () => {
            cancelled = true;
        };
    }, []);

    // --------------------------------
    // Open volunteer request modal
    // --------------------------------

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
            setCandidateError(err?.message || 'Unable to load eligible users.');
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

    // --------------------------------
    // Select / deselect users
    // --------------------------------

    const handleToggleUser = (userId) => {
        setSelectedUsers((current) => {
            if (current.includes(userId)) {
                return current.filter((id) => id !== userId);
            }

            return [...current, userId];
        });
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === candidateUsers.length) {
            setSelectedUsers([]);

            return;
        }

        setSelectedUsers(candidateUsers.map((user) => user.id));
    };

    // --------------------------------
    // Send volunteer requests
    // --------------------------------

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

            showSuccessToast(
                selectedCount === 1
                    ? 'Volunteer request sent successfully.'
                    : `${selectedCount} volunteer requests sent successfully.`,
            );
        } catch (err) {
            setRequestError(
                err?.message || 'Unable to send volunteer requests.',
            );
        } finally {
            setRequestLoading(false);
        }
    };

    // --------------------------------
    // Statistics
    // --------------------------------

    const statistics = useMemo(() => {
        const active = volunteers.filter(
            (volunteer) => volunteer.status === 'active',
        ).length;

        const pending = volunteers.filter(
            (volunteer) => volunteer.status === 'pending',
        ).length;

        const inactive = volunteers.filter(
            (volunteer) =>
                volunteer.status !== 'active' && volunteer.status !== 'pending',
        ).length;

        return {
            total: volunteers.length,
            active,
            pending,
            inactive,
        };
    }, [volunteers]);

    // --------------------------------
    // Filtering
    // --------------------------------

    const filteredVolunteers = useMemo(() => {
        let result = [...volunteers];

        if (statusFilter !== 'all') {
            result = result.filter(
                (volunteer) => volunteer.status === statusFilter,
            );
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((volunteer) => {
                const name =
                    volunteer.user?.name?.toLowerCase() ||
                    volunteer.name?.toLowerCase() ||
                    '';

                const email =
                    volunteer.user?.email?.toLowerCase() ||
                    volunteer.email?.toLowerCase() ||
                    '';

                const district =
                    volunteer.district?.toLowerCase() ||
                    volunteer.user?.district?.toLowerCase() ||
                    '';

                const organization =
                    volunteer.organization?.name?.toLowerCase() ||
                    volunteer.organization_name?.toLowerCase() ||
                    '';

                return (
                    name.includes(search) ||
                    email.includes(search) ||
                    district.includes(search) ||
                    organization.includes(search)
                );
            });
        }

        return result;
    }, [volunteers, searchTerm, statusFilter]);

    // --------------------------------
    // Pagination
    // --------------------------------

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

    // --------------------------------
    // Controls
    // --------------------------------

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);

        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);

        setCurrentPage(1);
    };

    // --------------------------------
    // CSV Export
    // --------------------------------

    const handleExportCSV = () => {
        if (filteredVolunteers.length === 0) {
            return;
        }

        const headers = [
            'Name',
            'Email',
            'District',
            'Organization',
            'Status',
            'Joined',
        ];

        const csvRows = filteredVolunteers.map((volunteer) => [
            volunteer.user?.name || volunteer.name || '',

            volunteer.user?.email || volunteer.email || '',

            volunteer.district || volunteer.user?.district || '',

            volunteer.organization?.name ||
                volunteer.organization_name ||
                'Independent',

            volunteer.status || '',

            volunteer.created_at
                ? new Date(volunteer.created_at).toLocaleDateString()
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

        link.download = 'stand-for-people-volunteers.csv';

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessToast('Volunteers exported successfully.');
    };

    // --------------------------------
    // Table rows
    // --------------------------------

    const rows = paginatedVolunteers.map((volunteer, index) => ({
        ...volunteer,

        serialNumber: (safeCurrentPage - 1) * VOLUNTEERS_PER_PAGE + index + 1,

        volunteerName: volunteer.user?.name || volunteer.name || 'Unknown',

        email: volunteer.user?.email || volunteer.email || 'N/A',

        district: volunteer.district || volunteer.user?.district || 'N/A',

        organization:
            volunteer.organization?.name ||
            volunteer.organization_name ||
            'Independent',

        joinedDate: volunteer.created_at
            ? new Date(volunteer.created_at).toLocaleDateString()
            : 'N/A',
    }));

    // --------------------------------
    // Loading
    // --------------------------------

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Volunteers"
                    subtitle="Manage volunteers and coordinate individuals who contribute to humanitarian activities across the platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading volunteers...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the volunteer
                            directory.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // --------------------------------
    // Error
    // --------------------------------

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Volunteers"
                    subtitle="Manage volunteers and coordinate individuals who contribute to humanitarian activities across the platform."
                />

                <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    // --------------------------------
    // Main
    // --------------------------------

    return (
        <>
            <div className="space-y-9">
                <PageHeader
                    title="Volunteers"
                    subtitle="Manage volunteers and coordinate individuals who contribute to humanitarian activities across the platform."
                    action={
                        <div className="flex w-full items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredVolunteers.length === 0}
                                className="
                                    group inline-flex h-10
                                    items-center gap-2
                                    border border-border
                                    bg-surface
                                    px-4
                                    text-sm font-medium
                                    text-text-primary
                                    transition-all
                                    hover:border-primary/30
                                    hover:bg-background-alt
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Download
                                    size={15}
                                    strokeWidth={1.8}
                                    className="
                                        text-text-secondary
                                        transition-colors
                                        group-hover:text-primary
                                    "
                                />

                                <span>Export CSV</span>
                            </button>

                            <button
                                type="button"
                                onClick={openRequestModal}
                                className="
                                    inline-flex h-10
                                    items-center gap-2
                                    bg-primary
                                    px-4
                                    text-sm font-semibold
                                    text-white
                                    shadow-sm
                                    transition-all
                                    hover:bg-primary-hover
                                "
                            >
                                <Send size={16} strokeWidth={2} />

                                <span>Send Volunteer Request</span>
                            </button>
                        </div>
                    }
                />

                <VolunteerStats
                    total={statistics.total}
                    active={statistics.active}
                    pending={statistics.pending}
                    inactive={statistics.inactive}
                />

                <section className="mt-24">
                    <div className="mb-6">
                        <div
                            className="
                                flex flex-col gap-4
                                border-b border-border pb-5
                                sm:flex-row sm:items-end
                                sm:justify-between
                            "
                        >
                            <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2.5 px-2">
                                    <span className="h-1.5 w-1.5 bg-primary" />

                                    <span
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-primary
                                        "
                                    >
                                        Administration
                                    </span>
                                </div>

                                <h2
                                    className="
                                        font-fraunces
                                        text-[25px]
                                        font-semibold
                                        leading-tight
                                        tracking-tight
                                        text-text-primary
                                    "
                                >
                                    Volunteer management
                                </h2>

                                <p
                                    className="
                                        mt-1.5
                                        max-w-xl
                                        text-[13px]
                                        leading-5
                                        text-text-secondary
                                    "
                                >
                                    Review registered volunteers and invite
                                    eligible individuals to contribute to
                                    humanitarian activities.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2.5">
                                <span className="hidden h-8 border-l border-border sm:block" />

                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.16em]
                                            text-text-secondary
                                        "
                                    >
                                        Showing
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-text-primary">
                                        {filteredVolunteers.length}{' '}
                                        <span className="font-normal text-text-secondary">
                                            {filteredVolunteers.length === 1
                                                ? 'volunteer'
                                                : 'volunteers'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            grid
                            items-stretch
                            gap-6
                            xl:grid-cols-[minmax(0,1fr)_280px]
                        "
                    >
                        {/* LEFT — VOLUNTEER TABLE */}

                        <div
                            className="
                                flex
                                min-h-0
                                min-w-0
                                flex-col
                                border
                                border-border
                                bg-surface
                            "
                        >
                            {/* Toolbar */}

                            <div
                                className="
                                    shrink-0
                                    border-b
                                    border-border
                                    px-5
                                    py-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                        lg:flex-row
                                        lg:items-center
                                        lg:justify-between
                                    "
                                >
                                    <div className="min-w-0 flex-1">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Search by name, email, district or organization"
                                            className="
                                                h-10
                                                w-full
                                                border
                                                border-border
                                                bg-background
                                                px-3.5
                                                text-[13px]
                                                font-medium
                                                text-text-primary
                                                outline-none
                                                transition-colors
                                                placeholder:text-text-secondary/70
                                                hover:border-text-secondary/30
                                                focus:border-primary/50
                                                focus:bg-surface
                                            "
                                        />
                                    </div>

                                    <div className="flex shrink-0 items-center gap-5">
                                        <div className="hidden h-7 border-l border-border lg:block" />

                                        <div>
                                            <p
                                                className="
                                                    text-[9px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.16em]
                                                    text-text-secondary
                                                "
                                            >
                                                Directory
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium text-text-primary">
                                                {filteredVolunteers.length}{' '}
                                                {filteredVolunteers.length === 1
                                                    ? 'result'
                                                    : 'results'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table heading */}

                            <div
                                className="
                                    flex
                                    shrink-0
                                    flex-col
                                    gap-2
                                    border-b
                                    border-border
                                    bg-white
                                    px-5
                                    py-3.5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">
                                        Registered volunteers
                                    </p>

                                    <p className="mt-0.5 text-xs text-text-secondary">
                                        Browse and review active volunteer
                                        profiles.
                                    </p>
                                </div>

                                <span className="text-[11px] font-medium text-text-secondary">
                                    Volunteer directory
                                </span>
                            </div>

                            {/* Table */}

                            <div
                                className="
                                    min-h-0
                                    flex-1
                                    overflow-x-auto
                                    overflow-y-auto
                                "
                            >
                                <div className="min-w-190">
                                    <VolunteerTable
                                        columns={[
                                            {
                                                key: 'serialNumber',
                                                header: '#',
                                                align: 'center',
                                                width: '60px',
                                            },
                                            {
                                                key: 'volunteerName',
                                                header: 'Volunteer',
                                            },
                                            {
                                                key: 'email',
                                                header: 'Email',
                                            },
                                            {
                                                key: 'district',
                                                header: 'District',
                                            },
                                            {
                                                key: 'organization',
                                                header: 'Organization',
                                            },
                                            {
                                                key: 'status',
                                                header: 'Status',
                                            },
                                            {
                                                key: 'joinedDate',
                                                header: 'Joined',
                                            },
                                        ]}
                                        rows={rows}
                                        resultCount={filteredVolunteers.length}
                                    />
                                </div>
                            </div>

                            {/* Pagination */}

                            {filteredVolunteers.length > 0 && (
                                <div className="shrink-0 border-t border-border">
                                    <VolunteerPagination
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredVolunteers.length}
                                        perPage={VOLUNTEERS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>

                        {/* RIGHT — FILTERS */}

                        <aside
                            className="
                                flex
                                flex-col
                                self-start
                                border
                                border-primary/90
                                bg-primary
                            "
                        >
                            <div className="shrink-0 px-5 pb-5 pt-6">
                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.18em]
                                        text-white/45
                                    "
                                >
                                    Directory controls
                                </p>

                                <h2
                                    className="
                                        mt-1.5
                                        font-fraunces
                                        text-[21px]
                                        leading-tight
                                        text-white
                                    "
                                >
                                    Refine volunteers
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        max-w-55
                                        text-[12px]
                                        leading-5
                                        text-white/50
                                    "
                                >
                                    Narrow the volunteer directory by their
                                    current account status.
                                </p>
                            </div>

                            <div className="bg-black/4 px-4 py-5">
                                <VolunteerFilters
                                    statusFilter={statusFilter}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                        </aside>
                    </div>
                </section>
            </div>

            {/* Toast */}

            <VolunteerSuccessToast
                show={toast.show}
                message={toast.message}
                onClose={() =>
                    setToast({
                        show: false,
                        message: '',
                    })
                }
            />

            {/* Volunteer request modal */}

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
        </>
    );
};

export default Volunteers;
