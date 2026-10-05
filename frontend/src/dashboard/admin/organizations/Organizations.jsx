import React, { useEffect, useMemo, useState } from 'react';

import {
    Plus,
    Download,
    Search,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    SlidersHorizontal,
    X,
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
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    // ACTIVE FILTER COUNT
    // ============================================================

    const activeFilterCount = useMemo(() => {
        let count = 0;

        if (activeCategory !== 'all') {
            count += 1;
        }

        if (typeFilter !== 'all') {
            count += 1;
        }

        return count;
    }, [activeCategory, typeFilter]);

    // ============================================================
    // FILTERING + SORTING
    // ============================================================

    const filteredOrganizations = useMemo(() => {
        let result = [...organizations];

        if (activeCategory !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.verification_status === activeCategory,
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.verification_status === statusFilter,
            );
        }

        if (typeFilter !== 'all') {
            result = result.filter(
                (organization) => organization.organization_type === typeFilter,
            );
        }

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
        const actualKey = key === 'registeredDate' ? 'created_at' : key;

        setSortConfig((current) => {
            if (current.key !== actualKey) {
                return {
                    key: actualKey,
                    direction: 'asc',
                };
            }

            if (current.direction === 'asc') {
                return {
                    key: actualKey,
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
        const actualKey = key === 'registeredDate' ? 'created_at' : key;

        if (sortConfig.key !== actualKey) {
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
            width: '44px',
        },
        {
            key: 'name',
            header: 'Organization',
            width: 'minmax(185px, 1.65fr)',
            sortable: true,
        },
        {
            key: 'registration_number',
            header: 'Reg. No.',
            width: 'minmax(82px, 0.72fr)',
            sortable: true,
        },
        {
            key: 'organization_type',
            header: 'Type',
            width: 'minmax(100px, 0.82fr)',
            sortable: true,
        },
        {
            key: 'verification_status',
            header: 'Verification',
            width: 'minmax(118px, 0.92fr)',
            sortable: true,
        },
        {
            key: 'registeredDate',
            header: 'Registered',
            width: 'minmax(105px, 0.82fr)',
            sortable: true,
            sortKey: 'created_at',
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '116px',
            align: 'right',
            nowrap: true,
        },
    ];

    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                />

                <div className="flex min-h-130 items-center justify-center border-y border-[#252D38] bg-[#0E1219]">
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
                                border-[#252D38]
                                border-t-[#84909F]
                            "
                        />

                        <p className="text-[13px] font-semibold! text-[#EEF1F5]">
                            Loading organizations...
                        </p>

                        <p className="mt-1 text-xs text-[#8792A1]">
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
            <div className="space-y-10 lg:space-y-12">
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                />

                <div className="border-l-4 border-[#5A343B] bg-[#28181D] px-5 py-4 text-sm text-[#E9A1A8]">
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
            <div className="space-y-12 lg:space-y-14">
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                    action={
                        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredOrganizations.length === 0}
                                className="
                                    group
                                    inline-flex
                                    h-10
                                    items-center
                                    gap-2
                                    border
                                    border-[#252D38]
                                    bg-[#0E1219]
                                    px-4
                                    text-[11px]
                                    font-medium!
                                    text-[#EEF1F5]
                                    transition-all
                                    hover:border-[#394555]
                                    hover:bg-[#1A222D]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Download
                                    size={15}
                                    strokeWidth={1.8}
                                    className="
                                        text-[#8792A1]
                                        transition-colors
                                        group-hover:text-[#EEF1F5]
                                    "
                                />
                                <span>Export CSV</span>
                            </button>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    gap-2
                                    border
                                    border-[#252D38]
                                    bg-[#1A222D]
                                    px-4
                                    text-[13px]
                                    font-semibold!
                                    text-[#EEF1F5]!
                                    transition-all
                                    hover:bg-[#1D2632]
                                "
                            >
                                <Plus size={17} strokeWidth={2} />
                                <span>Add Organization</span>
                            </button>
                        </div>
                    }
                />

                <Stats
                    total={statistics.total}
                    verified={statistics.verified}
                    pending={statistics.pending}
                    rejected={statistics.rejected}
                />

                <section className="pt-2 lg:pt-3">
                    <div className="mb-6">
                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                border-b
                                border-[#252D38]
                                pb-5
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2.5 px-2">
                                    <span className="h-1.5 w-1.5 bg-[#AEB7C3]!" />

                                    <span
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-[#AEB7C3]!
                                        "
                                    >
                                        Administration
                                    </span>
                                </div>

                                <h2
                                    className="
                                        font-sans!
                                        text-[20px]
                                        font-semibold!
                                        leading-tight!
                                        tracking-tight!
                                        text-[#EEF1F5]!
                                        sm:text-[21px]
                                    "
                                >
                                    Organization management
                                </h2>

                                <p
                                    className="
                                        mt-1.5
                                        max-w-xl
                                        text-[12px]
                                        leading-5
                                        text-[#8792A1]
                                    "
                                >
                                    Review registered organizations,
                                    verification status, and organization
                                    details across the platform.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2.5">
                                <span className="h-8 border-l border-[#252D38]" />

                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]
                                            text-[#8792A1]
                                        "
                                    >
                                        Showing
                                    </p>

                                    <p className="mt-0.5 text-[13px] font-semibold! text-[#EEF1F5]">
                                        {filteredOrganizations.length}{' '}
                                        <span className="font-normal text-[#8792A1]">
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
                        MOBILE / TABLET FILTER TRIGGER
                    ================================================== */}

                    <div className="mb-5 xl:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="
                                flex
                                h-10
                                w-full
                                items-center
                                justify-between
                                border
                                border-[#252D38]
                                bg-[#0E1219]
                                px-3.5
                                font-sans!
                                text-[11px]
                                font-medium!
                                text-[#AEB7C3]
                                transition-colors
                                duration-150
                                hover:border-[#35404E]
                                hover:bg-[#151B24]
                                hover:text-[#EEF1F5]
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal
                                    size={14}
                                    strokeWidth={1.8}
                                />
                                Filters
                            </span>

                            {activeFilterCount > 0 && (
                                <span
                                    className="
                                        flex
                                        h-5
                                        min-w-5
                                        items-center
                                        justify-center
                                        bg-[#1D2632]
                                        px-1.5
                                        text-[9px]
                                        font-semibold!
                                        tabular-nums
                                        text-[#EEF1F5]
                                    "
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* ==================================================
                        MANAGEMENT WORKSPACE
                    ================================================== */}

                    <div
                        className="
                            grid
                            items-stretch
                            gap-6
        xl:grid-cols-[minmax(0,1fr)_300px]
        2xl:grid-cols-[minmax(0,1fr)_320px]
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
                                border-[#252D38]
                                bg-[#0E1219]
                            "
                        >
                            {/* Workspace toolbar */}

                            <div
                                className="
                                    shrink-0
                                    border-b
                                    border-[#252D38]
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
                                                    text-[#8792A1]
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
                                                    border-[#252D38]
                                                    bg-[#0A0E14]
                                                    pl-10
                                                    pr-16
                                                    text-[12px]
                                                    font-medium!
                                                    text-[#EEF1F5]
                                                    outline-none
                                                    transition-colors
                                                    placeholder:text-[#8792A1]/70
                                                    hover:border-text-secondary/30
                                                    focus:border-[#4B5869]
                                                    focus:bg-[#0E1219]
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
                                                        font-semibold!
                                                        uppercase
                                                        tracking-wide
                                                        text-[#8792A1]
                                                        transition-colors
                                                        hover:text-[#EEF1F5]
                                                    "
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

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
                                                border-[#252D38]
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
                                                    text-[#8792A1]
                                                "
                                            >
                                                Directory
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium! text-[#EEF1F5]">
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
                                    border-[#252D38]
                                    bg-[#0E1219]
                                    px-5
                                    py-3.5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <p className="text-[13px] font-semibold! text-[#EEF1F5]">
                                        Registered organizations
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#8792A1]">
                                        Browse and review organizations in the
                                        platform directory
                                    </p>
                                </div>

                                <span className="text-[11px] font-medium! text-[#8792A1]">
                                    Sorted by organization
                                </span>
                            </div>

                            {/* TABLE */}

<div
    className="
        min-h-0
        min-w-0
        flex-1

        overflow-auto

        bg-[#0E1219]

        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-[#0A0E14]
        [&::-webkit-scrollbar-thumb]:bg-[#303A47]
        hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]
    "
>
    <Table
                                    columns={columns}
                                    rows={rows}
                                    onSort={handleSort}
                                    getSortIcon={getSortIcon}
                                    resultCount={filteredOrganizations.length}
                                    onView={handleViewOrganization}
                                    onReview={handleReviewOrganization}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteModal}
                                />
                            </div>

                            {filteredOrganizations.length > 0 && (
                                <div className="shrink-0 border-t border-[#252D38]">
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
                        ================================================== */}

                        <aside
                            className="
                                hidden
                                min-w-0
                                flex-col
                                self-start
                                border
                                border-[#252D38]
                                bg-[#0E1219]
                                xl:flex
                            "
                        >
                            <div className="shrink-0 px-5 pb-5 pt-6">
                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.18em]
                                        text-[#697586]!
                                    "
                                >
                                    Directory controls
                                </p>

                                <h2
                                    className="
                                        mt-1.5
                                        font-sans!
                                        text-[21px]
                                        leading-tight
                                        text-[#EEF1F5]!
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
                                        text-[#8792A1]!
                                    "
                                >
                                    Narrow the organization directory by
                                    verification state and organization type.
                                </p>
                            </div>

                            <div
                                className="
        border-t
        border-[#252D38]
        px-3
        py-4
    "
                            >
                                <div className="mb-3 flex items-center justify-between px-1">
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.16em]
                                            text-[#697586]!
                                        "
                                    >
                                        Organization status
                                    </p>

                                    <span
                                        className="
                                            text-[10px]
                                            font-medium!
                                            tabular-nums
                                            text-[#5E6978]!
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

                            <Filters
                                typeFilter={typeFilter}
                                onTypeChange={handleTypeChange}
                            />
                        </aside>
                    </div>
                </section>
            </div>

            {/* ========================================================
                MOBILE / TABLET FILTER DRAWER
            ======================================================== */}

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-100 xl:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="
                            absolute
                            inset-0
                            bg-[#05070A]/75
                            backdrop-blur-[2px]
                        "
                    />

                    <div
                        className="
        absolute
        bottom-0
        left-0
        right-0

        max-h-[85vh]
        overflow-y-auto

        border-t
        border-[#252D38]

        bg-[#0E1219]

        shadow-[0_-20px_60px_rgba(0,0,0,0.45)]

        sm:bottom-0
        sm:left-auto
        sm:right-0
        sm:top-0

        sm:h-full
        sm:max-h-none
        sm:w-[340px]

        md:w-[360px]

        lg:w-[380px]

        sm:border-l
        sm:border-t-0
    "
                    >
                        <div
                            className="
                                sticky
                                top-0
                                z-30
                                flex
                                items-center
                                justify-between
                                border-b
                                border-[#252D38]
                                bg-[#0E1219]/95
                                px-4
                                py-3.5
                                backdrop-blur-md
                            "
                        >
                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#697586]
                                    "
                                >
                                    Organization directory
                                </p>

                                <p
                                    className="
                                        mt-1
                                        font-sans!
                                        text-[13px]
                                        font-semibold!
                                        text-[#EEF1F5]
                                    "
                                >
                                    Filters
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                aria-label="Close filters"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    border
                                    border-[#29323E]
                                    bg-[#151B24]
                                    text-[#8792A1]
                                    transition-colors
                                    duration-150
                                    hover:border-[#3B4655]
                                    hover:bg-[#1A222D]
                                    hover:text-[#EEF1F5]
                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                <X size={16} strokeWidth={1.8} />
                            </button>
                        </div>

                        <div className="shrink-0 px-5 pb-5 pt-6">
                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#697586]!
                                "
                            >
                                Directory controls
                            </p>

                            <h2
                                className="
                                    mt-1.5
                                    font-sans!
                                    text-[21px]
                                    leading-tight
                                    text-[#EEF1F5]!
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
                                    text-[#8792A1]!
                                "
                            >
                                Narrow the organization directory by
                                verification state and organization type.
                            </p>
                        </div>

                        <div className="border-t border-[#252D38] px-3 py-4">
                            <div className="mb-3 flex items-center justify-between px-1">
                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#697586]!
                                    "
                                >
                                    Organization status
                                </p>

                                <span
                                    className="
                                        text-[10px]
                                        font-medium!
                                        tabular-nums
                                        text-[#5E6978]!
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

                        <Filters
                            typeFilter={typeFilter}
                            onTypeChange={handleTypeChange}
                        />

                        <div
                            className="
                                sticky
                                bottom-0
                                z-30
                                border-t
                                border-[#252D38]
                                bg-[#0E1219]/95
                                p-4
                                backdrop-blur-md
                            "
                        >
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="
                                    flex
                                    h-10
                                    w-full
                                    items-center
                                    justify-center
                                    border
                                    border-[#394555]
                                    bg-[#171E28]
                                    font-sans!
                                    text-[11px]
                                    font-semibold!
                                    text-[#EEF1F5]
                                    transition-colors
                                    duration-150
                                    hover:border-[#4B5869]
                                    hover:bg-[#1D2632]
                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                Show {filteredOrganizations.length}{' '}
                                {filteredOrganizations.length === 1
                                    ? 'organization'
                                    : 'organizations'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessToast show={toast.show} message={toast.message} />

            <ViewModal
                organization={selectedOrganization}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            <VerificationModal
                organization={selectedReviewOrganization}
                loading={reviewLoading}
                error={reviewError}
                onClose={closeReviewModal}
                onConfirm={handleVerificationChange}
            />

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

            {editLoading && !selectedEditOrganization && (
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
                            border-[#252D38]
                            bg-[#0E1219]
                            px-6
                            py-5
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
                                    border-[#252D38]
                                    border-t-[#84909F]
                                "
                            />

                            <p className="text-[13px] font-semibold! text-[#EEF1F5]">
                                Loading organization details...
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                                border-[#252D38]
                                bg-[#0E1219]
                                p-6
                            "
                    >
                        <p className="text-[13px] font-semibold! text-[#EEF1F5]">
                            Unable to edit organization
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#8792A1]">
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
                                    font-semibold!
                                    text-[#AEB7C3]
                                    transition-colors
                                    hover:text-[#EEF1F5]
                                "
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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
