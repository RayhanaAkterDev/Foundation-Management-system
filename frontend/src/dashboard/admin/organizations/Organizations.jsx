import React, { useEffect, useMemo, useState } from 'react';

import {
    Plus,
    Download,
    Search,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import CategoryTabs from './components/CategoryTabs';
import Stats from './components/Stats';
import Table from './components/Table';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import SuccessToast from './components/SuccessToast';

import VerificationModal from './modals/VerificationModal';
import FormModal from './modals/FormModal';
import ViewModal from './modals/ViewModal';
import DeleteModal from './modals/DeleteModal';

import {
    fetchOrganizations,
    fetchOrganization,
    createOrganization,
    updateOrganization,
    updateOrganizationVerification,
    deleteOrganization,
} from './api/organizationApi';

const ORGANIZATIONS_PER_PAGE = 25;

const Organizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ============================================================
    // FILTERS / SEARCH / SORTING
    // ============================================================

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // ============================================================
    // VIEW ORGANIZATION
    // ============================================================

    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

    // ============================================================
    // REVIEW / VERIFICATION ORGANIZATION
    // ============================================================

    const [selectedReviewOrganization, setSelectedReviewOrganization] =
        useState(null);

    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // ============================================================
    // ADD ORGANIZATION
    // ============================================================

    const [showAddModal, setShowAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [addFieldErrors, setAddFieldErrors] = useState({});

    // ============================================================
    // EDIT ORGANIZATION
    // ============================================================

    const [selectedEditOrganization, setSelectedEditOrganization] =
        useState(null);

    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    // ============================================================
    // DELETE ORGANIZATION
    // ============================================================

    const [selectedDeleteOrganization, setSelectedDeleteOrganization] =
        useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // ============================================================
    // SUCCESS TOAST
    // ============================================================

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

    // ============================================================
    // LOAD ORGANIZATIONS
    // ============================================================

    const loadOrganizations = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchOrganizations();

            setOrganizations(data.organizations || []);
        } catch (err) {
            setError(
                err.message ||
                    'Something went wrong while loading organizations.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadInitialOrganizations = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await fetchOrganizations();

                if (!cancelled) {
                    setOrganizations(data.organizations || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                            'Something went wrong while loading organizations.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialOrganizations();

        return () => {
            cancelled = true;
        };
    }, []);

    // ============================================================
    // VIEW ORGANIZATION
    // ============================================================

    const handleViewOrganization = async (organizationId) => {
        setViewLoading(true);
        setViewError('');
        setSelectedOrganization(null);

        try {
            const data = await fetchOrganization(organizationId);

            setSelectedOrganization(data.organization);
        } catch (err) {
            setViewError(err.message || 'Unable to load organization.');
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        if (viewLoading) {
            return;
        }

        setSelectedOrganization(null);
        setViewError('');
    };

    // ============================================================
    // REVIEW / VERIFICATION ORGANIZATION
    // ============================================================

    const handleReviewOrganization = (organization) => {
        setReviewError('');
        setSelectedReviewOrganization(organization);
    };

    const closeReviewModal = () => {
        if (reviewLoading) {
            return;
        }

        setSelectedReviewOrganization(null);
        setReviewError('');
    };

    const handleVerificationChange = async (status) => {
        if (!selectedReviewOrganization) {
            return;
        }

        setReviewLoading(true);
        setReviewError('');

        try {
            await updateOrganizationVerification(
                selectedReviewOrganization.id,
                status,
            );

            setSelectedReviewOrganization(null);

            await loadOrganizations();

            showSuccessToast(
                status === 'verified'
                    ? 'Organization verified successfully.'
                    : status === 'rejected'
                      ? 'Organization rejected successfully.'
                      : 'Organization kept pending.',
            );
        } catch (err) {
            setReviewError(
                err.message || 'Unable to update verification status.',
            );
        } finally {
            setReviewLoading(false);
        }
    };

    // ============================================================
    // ADD ORGANIZATION
    // ============================================================

    const openAddModal = () => {
        setAddError('');
        setAddFieldErrors({});
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        if (addLoading) {
            return;
        }

        setShowAddModal(false);
        setAddError('');
        setAddFieldErrors({});
    };

    const handleAddOrganization = async (formData) => {
        setAddLoading(true);
        setAddError('');
        setAddFieldErrors({});

        try {
            await createOrganization(formData);

            setShowAddModal(false);

            await loadOrganizations();

            setCurrentPage(1);

            showSuccessToast('Organization added successfully.');
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setAddFieldErrors(err.errors);
            }

            setAddError(err.message || 'Unable to create organization.');
        } finally {
            setAddLoading(false);
        }
    };

    // ============================================================
    // EDIT ORGANIZATION
    // ============================================================

    const openEditModal = async (organizationId) => {
        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});
        setSelectedEditOrganization(null);

        try {
            const data = await fetchOrganization(organizationId);
            const organization = data.organization;

            if (organization?.verification_status === 'rejected') {
                setEditError('Rejected organizations cannot be edited.');
                return;
            }

            setSelectedEditOrganization(organization);
        } catch (err) {
            setEditError(err.message || 'Unable to load organization.');
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditModal = () => {
        if (editLoading) {
            return;
        }

        setSelectedEditOrganization(null);
        setEditError('');
        setEditFieldErrors({});
    };

    const handleEditOrganization = async (formData) => {
        if (!selectedEditOrganization) {
            return;
        }

        if (selectedEditOrganization.verification_status === 'rejected') {
            setEditError('Rejected organizations cannot be edited.');
            return;
        }

        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});

        try {
            await updateOrganization(selectedEditOrganization.id, formData);

            setSelectedEditOrganization(null);

            await loadOrganizations();

            showSuccessToast('Organization updated successfully.');
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setEditFieldErrors(err.errors);
            }

            setEditError(err.message || 'Unable to update organization.');
        } finally {
            setEditLoading(false);
        }
    };

    // ============================================================
    // DELETE ORGANIZATION
    // ============================================================

    const openDeleteModal = (organization) => {
        setDeleteError('');
        setSelectedDeleteOrganization(organization);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setSelectedDeleteOrganization(null);
        setDeleteError('');
    };

    const handleDeleteOrganization = async () => {
        if (!selectedDeleteOrganization) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');

        try {
            await deleteOrganization(selectedDeleteOrganization.id);

            setSelectedDeleteOrganization(null);

            await loadOrganizations();

            setCurrentPage(1);

            showSuccessToast('Organization deleted successfully.');
        } catch (err) {
            setDeleteError(err.message || 'Unable to delete organization.');
        } finally {
            setDeleteLoading(false);
        }
    };

    // ============================================================
    // STATISTICS
    // ============================================================

    const statistics = useMemo(() => {
        return {
            total: organizations.length,

            verified: organizations.filter(
                (organization) =>
                    organization.verification_status === 'verified',
            ).length,

            pending: organizations.filter(
                (organization) =>
                    organization.verification_status === 'pending',
            ).length,

            rejected: organizations.filter(
                (organization) =>
                    organization.verification_status === 'rejected',
            ).length,
        };
    }, [organizations]);

    // ============================================================
    // CATEGORY TABS
    // ============================================================

    const categoryTabs = useMemo(
        () => [
            {
                key: 'all',
                label: 'All Organizations',
                count: statistics.total,
            },
            {
                key: 'verified',
                label: 'Verified',
                count: statistics.verified,
            },
            {
                key: 'pending',
                label: 'Pending',
                count: statistics.pending,
            },
            {
                key: 'rejected',
                label: 'Rejected',
                count: statistics.rejected,
            },
        ],
        [statistics],
    );

    // ============================================================
    // FILTERING + SORTING
    // ============================================================

    const filteredOrganizations = useMemo(() => {
        let result = [...organizations];

        // Category filter
        if (activeCategory !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.verification_status === activeCategory,
            );
        }

        // Verification status filter
        if (statusFilter !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.verification_status === statusFilter,
            );
        }

        // Organization type filter
        if (typeFilter !== 'all') {
            result = result.filter(
                (organization) => organization.organization_type === typeFilter,
            );
        }

        // Search
        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter((organization) => {
                const name = organization.name?.toLowerCase() || '';
                const email = organization.user?.email?.toLowerCase() || '';
                const registrationNumber =
                    organization.registration_number?.toLowerCase() || '';
                const type =
                    organization.organization_type?.toLowerCase() || '';

                return (
                    name.includes(search) ||
                    email.includes(search) ||
                    registrationNumber.includes(search) ||
                    type.includes(search)
                );
            });
        }

        // Sorting
        if (!sortConfig.key || !sortConfig.direction) {
            return result;
        }

        result.sort((firstOrganization, secondOrganization) => {
            let first = firstOrganization[sortConfig.key];
            let second = secondOrganization[sortConfig.key];

            if (sortConfig.key === 'created_at') {
                first = new Date(first).getTime();
                second = new Date(second).getTime();

                if (Number.isNaN(first)) {
                    first = 0;
                }

                if (Number.isNaN(second)) {
                    second = 0;
                }
            }

            first = first ?? '';
            second = second ?? '';

            if (typeof first === 'string') {
                first = first.toLowerCase();
            }

            if (typeof second === 'string') {
                second = second.toLowerCase();
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
        organizations,
        activeCategory,
        statusFilter,
        typeFilter,
        searchTerm,
        sortConfig,
    ]);

    // ============================================================
    // PAGINATION
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(filteredOrganizations.length / ORGANIZATIONS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedOrganizations = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * ORGANIZATIONS_PER_PAGE;

        return filteredOrganizations.slice(
            startIndex,
            startIndex + ORGANIZATIONS_PER_PAGE,
        );
    }, [filteredOrganizations, safeCurrentPage]);

    // ============================================================
    // CONTROLS
    // ============================================================

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleTypeChange = (type) => {
        setTypeFilter(type);
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
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

    // ============================================================
    // CSV EXPORT
    // ============================================================

    const handleExportCSV = () => {
        if (filteredOrganizations.length === 0) {
            return;
        }

        const headers = [
            'Organization',
            'Type',
            'Contact Email',
            'Registration Number',
            'Verification Status',
            'Registered',
        ];

        const csvRows = filteredOrganizations.map((organization) => [
            organization.name,
            organization.organization_type,
            organization.user?.email,
            organization.registration_number,
            organization.verification_status,
            organization.created_at
                ? new Date(organization.created_at).toLocaleDateString()
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
        link.download = 'stand-for-people-organizations.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessToast('Organizations exported successfully.');
    };

    // ============================================================
    // TABLE ROWS
    // ============================================================

    const rows = paginatedOrganizations.map((organization, index) => ({
        ...organization,

        contactEmail: organization.user?.email || '—',

        registeredDate: organization.created_at
            ? new Date(organization.created_at).toLocaleDateString()
            : '—',

        serialNumber:
            (safeCurrentPage - 1) * ORGANIZATIONS_PER_PAGE + index + 1,
    }));

    // ============================================================
    // TABLE COLUMNS
    // ============================================================

    const columns = [
        {
            key: 'serialNumber',
            header: '#',
        },
        {
            key: 'name',
            header: 'Organization',
            sortable: true,
        },
        {
            key: 'registration_number',
            header: 'Reg. No.',
            sortable: true,
        },
        {
            key: 'organization_type',
            header: 'Type',
            sortable: true,
        },
        {
            key: 'verification_status',
            header: 'Verification',
            sortable: true,
        },
        {
            key: 'registeredDate',
            header: 'Registered',
            sortable: true,
        },
        {
            key: 'actions',
            header: 'Actions',
        },
    ];

    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div
                            className="
                                mx-auto
                                mb-4
                                h-8
                                w-8
                                animate-spin
                                rounded-full
                                border-2
                                border-border
                                border-t-primary
                            "
                        />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading organizations...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the organization list.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR STATE
    // ============================================================

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                />

                <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <>
            <div className="space-y-9">
                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                    action={
                        <div className="flex w-full items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredOrganizations.length === 0}
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
                                onClick={openAddModal}
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
                                <Plus size={17} strokeWidth={2} />
                                <span>Add Organization</span>
                            </button>
                        </div>
                    }
                />

                {/* ==================================================
                    ORGANIZATION OVERVIEW
                ================================================== */}

                <Stats
                    total={statistics.total}
                    verified={statistics.verified}
                    pending={statistics.pending}
                    rejected={statistics.rejected}
                />

                {/* ==================================================
                    ORGANIZATION MANAGEMENT
                ================================================== */}

                <section className="mt-24">
                    <div className="mb-6">
                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                border-b
                                border-border
                                pb-5
                                sm:flex-row
                                sm:items-end
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
                                    Organization management
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
                                    Review registered organizations,
                                    verification status, and organization
                                    details across the platform.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2.5">
                                <span className="h-8 border-l border-border" />

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
                                        {filteredOrganizations.length}{' '}
                                        <span className="font-normal text-text-secondary">
                                            {filteredOrganizations.length === 1
                                                ? 'organization'
                                                : 'organizations'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
    MANAGEMENT WORKSPACE
================================================== */}

                    <div
                        className="
        grid
        items-stretch
        gap-6
        xl:grid-cols-[minmax(0,1fr)_280px]
    "
                    >
                        {/* ==================================================
        LEFT — ORGANIZATION TABLE WORKSPACE
    ================================================== */}

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
                            {/* Workspace toolbar */}

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
                                    {/* Search */}

                                    <div className="min-w-0 flex-1">
                                        <div className="relative">
                                            <Search
                                                size={17}
                                                strokeWidth={1.8}
                                                className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-text-secondary
                            "
                                            />

                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                placeholder="Search by organization name, email, registration number"
                                                className="
                                h-10
                                w-full
                                border
                                border-border
                                bg-background
                                pl-10
                                pr-16
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

                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-text-secondary
                                    transition-colors
                                    hover:text-primary
                                "
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Directory context */}

                                    <div
                                        className="
                        flex
                        shrink-0
                        items-center
                        gap-5
                    "
                                    >
                                        <div
                                            className="
                            hidden
                            h-7
                            border-l
                            border-border
                            lg:block
                        "
                                        />

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
                                                {filteredOrganizations.length}{' '}
                                                {filteredOrganizations.length ===
                                                1
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
                                        Registered organizations
                                    </p>

                                    <p className="mt-0.5 text-xs text-text-secondary">
                                        Browse and review organizations in the
                                        platform directory
                                    </p>
                                </div>

                                <span className="text-[11px] font-medium text-text-secondary">
                                    Sorted by organization
                                </span>
                            </div>

                            {/* Table — ONLY this area scrolls */}

                            <div
                                className="
                min-h-0
                flex-1
                overflow-x-auto
                overflow-y-auto
            "
                            >
                                <div className="min-w-190">
                                    <Table
                                        columns={columns}
                                        rows={rows}
                                        onSort={handleSort}
                                        getSortIcon={getSortIcon}
                                        resultCount={
                                            filteredOrganizations.length
                                        }
                                        onView={handleViewOrganization}
                                        onReview={handleReviewOrganization}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                    />
                                </div>
                            </div>

                            {/* Pagination */}

                            {filteredOrganizations.length > 0 && (
                                <div className="shrink-0 border-t border-border">
                                    <Pagination
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={
                                            filteredOrganizations.length
                                        }
                                        itemsPerPage={ORGANIZATIONS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>

                        {/* ==================================================
        RIGHT — ORGANIZATION FILTER SIDEBAR
        Height comes naturally from its content.
        NO overflow / NO fixed height.
    ================================================== */}

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
                            {/* Sidebar heading */}

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
                                    Refine organizations
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
                                    Narrow the organization directory by
                                    verification state and organization type.
                                </p>
                            </div>

                            {/* Organization category */}

                            <div
                                className="
                border-y
                border-white/10
                bg-black/4
                px-4
                py-5
            "
                            >
                                <div className="mb-3 flex items-center justify-between px-1">
                                    <p
                                        className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-white/45
                    "
                                    >
                                        Organization status
                                    </p>

                                    <span
                                        className="
                        text-[10px]
                        font-medium
                        tabular-nums
                        text-white/30
                    "
                                    >
                                        {categoryTabs.length}
                                    </span>
                                </div>

                                <CategoryTabs
                                    tabs={categoryTabs}
                                    activeCategory={activeCategory}
                                    onChange={handleCategoryChange}
                                />
                            </div>

                            {/* Filters */}

                            <div className="bg-black/4 px-4 py-5">
                                {/* Organization type */}

                                <Filters
                                    typeFilter={typeFilter}
                                    onTypeChange={handleTypeChange}
                                />

                                {/* Verification status */}

                                <div className="mt-7">
                                    <div className="mb-3 px-1">
                                        <p
                                            className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-white/45
                        "
                                        >
                                            Verification filter
                                        </p>

                                        <p
                                            className="
                            mt-1
                            text-[11px]
                            leading-4
                            text-white/30
                        "
                                        >
                                            Filter organizations by their
                                            current verification state.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </div>

            {/* ============================================================
                SUCCESS TOAST
            ============================================================ */}

            <SuccessToast show={toast.show} message={toast.message} />

            {/* ============================================================
                VIEW MODAL
            ============================================================ */}

            <ViewModal
                organization={selectedOrganization}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            {/* ============================================================
                VERIFICATION MODAL
            ============================================================ */}

            <VerificationModal
                organization={selectedReviewOrganization}
                loading={reviewLoading}
                error={reviewError}
                onClose={closeReviewModal}
                onConfirm={handleVerificationChange}
            />

            {/* ============================================================
                ADD ORGANIZATION MODAL
            ============================================================ */}

            <FormModal
                key={showAddModal ? 'add-open' : 'add-closed'}
                mode="add"
                open={showAddModal}
                loading={addLoading}
                error={addError}
                fieldErrors={addFieldErrors}
                onClose={closeAddModal}
                onSubmit={handleAddOrganization}
            />

            {/* ============================================================
                EDIT ORGANIZATION MODAL
            ============================================================ */}

            <FormModal
                key={selectedEditOrganization?.id || 'edit-organization'}
                mode="edit"
                open={Boolean(selectedEditOrganization)}
                loading={editLoading}
                error={editError}
                fieldErrors={editFieldErrors}
                organization={selectedEditOrganization}
                onClose={closeEditModal}
                onSubmit={handleEditOrganization}
            />

            {/* ============================================================
                EDIT LOADING
            ============================================================ */}

            {editLoading && !selectedEditOrganization && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-4
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-sm
                            border
                            border-border
                            bg-white
                            px-6
                            py-5
                            shadow-xl
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    h-5
                                    w-5
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-border
                                    border-t-primary
                                "
                            />

                            <p className="text-sm font-semibold text-text-primary">
                                Loading organization details...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
                EDIT ERROR
            ============================================================ */}

            {editError && !selectedEditOrganization && !editLoading && (
                <div
                    className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/30
                            p-4
                        "
                >
                    <div
                        className="
                                w-full
                                max-w-sm
                                border
                                border-border
                                bg-white
                                p-6
                                shadow-xl
                            "
                    >
                        <p className="text-sm font-semibold text-text-primary">
                            Unable to edit organization
                        </p>

                        <p className="mt-2 text-xs leading-5 text-text-secondary">
                            {editError}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setEditError('');
                            }}
                            className="
                                    mt-5
                                    text-xs
                                    font-semibold
                                    text-primary
                                    transition-colors
                                    hover:text-primary-hover
                                "
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* ============================================================
                DELETE MODAL
            ============================================================ */}

            <DeleteModal
                organization={selectedDeleteOrganization}
                loading={deleteLoading}
                error={deleteError}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteOrganization}
            />
        </>
    );
};

export default Organizations;
