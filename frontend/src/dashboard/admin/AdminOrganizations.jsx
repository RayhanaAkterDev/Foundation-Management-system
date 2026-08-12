import React, { useEffect, useMemo, useState } from 'react';
import {
    Plus,
    Download,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import OrganizationViewModal from './organizations/OrganizationViewModal';
import OrganizationVerificationModal from './organizations/OrganizationVerificationModal';
import OrganizationFormModal from './organizations/OrganizationFormModal';
import OrganizationDeleteModal from './organizations/OrganizationDeleteModal';
import OrganizationStats from './organizations/OrganizationStats';
import OrganizationCategoryTabs from './organizations/OrganizationCategoryTabs';
import OrganizationFilters from './organizations/OrganizationFilters';
import OrganizationTable from './organizations/OrganizationTable';
import OrganizationPagination from './organizations/OrganizationPagination';
import OrganizationSuccessToast from './organizations/OrganizationSuccessToast';

const ORGANIZATIONS_PER_PAGE = 25;

const AdminOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --------------------------------
    // Filters / Search / Sorting
    // --------------------------------
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // --------------------------------
    // View organization
    // --------------------------------
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

    // --------------------------------
    // Review / Verification organization
    // --------------------------------
    const [selectedReviewOrganization, setSelectedReviewOrganization] =
        useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // --------------------------------
    // Add organization
    // --------------------------------
    const [showAddModal, setShowAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [addFieldErrors, setAddFieldErrors] = useState({});

    // --------------------------------
    // Edit organization
    // --------------------------------
    const [selectedEditOrganization, setSelectedEditOrganization] =
        useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    // --------------------------------
    // Delete organization
    // --------------------------------
    const [selectedDeleteOrganization, setSelectedDeleteOrganization] =
        useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

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

        setTimeout(() => {
            setToast({
                show: false,
                message: '',
            });
        }, 3000);
    };

    // --------------------------------
    // Authentication
    // --------------------------------
    const getAuthToken = () => {
        return (
            localStorage.getItem('auth_token') ||
            sessionStorage.getItem('auth_token')
        );
    };

    // --------------------------------
    // Load organizations
    // --------------------------------
    const loadOrganizations = async () => {
        try {
            setLoading(true);
            setError('');

            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                'http://127.0.0.1:8000/api/admin/organizations',
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to load organizations.',
                );
            }

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
                const token = getAuthToken();

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/organizations',
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load organizations.',
                    );
                }

                if (!cancelled) {
                    setOrganizations(data.organizations || []);
                    setError('');
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

    // --------------------------------
    // View organization
    // --------------------------------
    const handleViewOrganization = async (organizationId) => {
        setViewLoading(true);
        setViewError('');
        setSelectedOrganization(null);

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/organizations/${organizationId}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to load organization.',
                );
            }

            setSelectedOrganization(data.organization);
        } catch (err) {
            setViewError(err.message);
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedOrganization(null);
        setViewError('');
    };

    // --------------------------------
    // Review organization
    // --------------------------------
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
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/organizations/${selectedReviewOrganization.id}/verification`,
                {
                    method: 'PATCH',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        verification_status: status,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        'Unable to update verification status.',
                );
            }

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
                err.message ||
                    'Unable to update verification status.',
            );
        } finally {
            setReviewLoading(false);
        }
    };

    // --------------------------------
    // Add organization
    // --------------------------------
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
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                'http://127.0.0.1:8000/api/admin/organizations',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                const validationError = new Error(
                    data.message || 'Unable to create organization.',
                );

                validationError.status = response.status;
                validationError.errors = data.errors;

                throw validationError;
            }

            setShowAddModal(false);

            await loadOrganizations();

            setCurrentPage(1);

            showSuccessToast('Organization added successfully.');
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setAddFieldErrors(err.errors);
            }

            setAddError(err.message);
        } finally {
            setAddLoading(false);
        }
    };

    // --------------------------------
    // Edit organization
    // --------------------------------
    const openEditModal = async (organizationId) => {
        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});
        setSelectedEditOrganization(null);

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/organizations/${organizationId}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to load organization.',
                );
            }

            setSelectedEditOrganization(data.organization);
        } catch (err) {
            setEditError(err.message);
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

        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});

        try {
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/organizations/${selectedEditOrganization.id}`,
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                const validationError = new Error(
                    data.message || 'Unable to update organization.',
                );

                validationError.status = response.status;
                validationError.errors = data.errors;

                throw validationError;
            }

            setSelectedEditOrganization(null);

            await loadOrganizations();

            showSuccessToast('Organization updated successfully.');
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setEditFieldErrors(err.errors);
            }

            setEditError(err.message);
        } finally {
            setEditLoading(false);
        }
    };

    // --------------------------------
    // Delete organization
    // --------------------------------
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
            const token = getAuthToken();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/admin/organizations/${selectedDeleteOrganization.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || 'Unable to delete organization.',
                );
            }

            setSelectedDeleteOrganization(null);

            await loadOrganizations();

            showSuccessToast('Organization deleted successfully.');
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    // --------------------------------
    // Statistics
    // --------------------------------
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

    // --------------------------------
    // Category tabs
    // --------------------------------
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

    // --------------------------------
    // Filtering + sorting
    // --------------------------------
    const filteredOrganizations = useMemo(() => {
        let result = [...organizations];

        if (activeCategory !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.verification_status === activeCategory,
            );
        }

        if (typeFilter !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.organization_type === typeFilter,
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(
                (organization) =>
                    organization.verification_status === statusFilter,
            );
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter(
                (organization) =>
                    organization.name?.toLowerCase().includes(search) ||
                    organization.user?.email
                        ?.toLowerCase()
                        .includes(search) ||
                    organization.registration_number
                        ?.toLowerCase()
                        .includes(search),
            );
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
        typeFilter,
        statusFilter,
        searchTerm,
        sortConfig,
    ]);

    // --------------------------------
    // Pagination
    // --------------------------------
    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredOrganizations.length / ORGANIZATIONS_PER_PAGE,
        ),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedOrganizations = useMemo(() => {
        const startIndex =
            (safeCurrentPage - 1) * ORGANIZATIONS_PER_PAGE;

        return filteredOrganizations.slice(
            startIndex,
            startIndex + ORGANIZATIONS_PER_PAGE,
        );
    }, [filteredOrganizations, safeCurrentPage]);

    // --------------------------------
    // Controls
    // --------------------------------
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleTypeChange = (event) => {
        setTypeFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
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
            return (
                <ChevronsUpDown
                    size={14}
                    strokeWidth={1.8}
                />
            );
        }

        if (sortConfig.direction === 'asc') {
            return (
                <ArrowUp
                    size={14}
                    strokeWidth={2}
                />
            );
        }

        if (sortConfig.direction === 'desc') {
            return (
                <ArrowDown
                    size={14}
                    strokeWidth={2}
                />
            );
        }

        return (
            <ChevronsUpDown
                size={14}
                strokeWidth={1.8}
            />
        );
    };

    // --------------------------------
    // CSV Export
    // --------------------------------
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

        const csvRows = filteredOrganizations.map(
            (organization) => [
                organization.name,
                organization.organization_type,
                organization.user?.email,
                organization.registration_number,
                organization.verification_status,
                organization.created_at
                    ? new Date(
                          organization.created_at,
                      ).toLocaleDateString()
                    : '',
            ],
        );

        const csvContent = [headers, ...csvRows]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? '').replace(
                                /"/g,
                                '""',
                            )}"`,
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
        link.download =
            'stand-for-people-organizations.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessToast(
            'Organizations exported successfully.',
        );
    };

    // --------------------------------
    // Table rows
    // --------------------------------
    const rows = paginatedOrganizations.map(
        (organization, index) => ({
            ...organization,

            contactEmail:
                organization.user?.email || '—',

            registeredDate: organization.created_at
                ? new Date(
                      organization.created_at,
                  ).toLocaleDateString()
                : '—',

            serialNumber:
                (safeCurrentPage - 1) *
                    ORGANIZATIONS_PER_PAGE +
                index +
                1,
        }),
    );

    // --------------------------------
    // Table columns
    // --------------------------------
    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '60px',
        },

        {
            key: 'name',
            header: 'Organization',
            sortable: true,
            sortKey: 'name',
        },

        {
            key: 'organization_type',
            header: 'Type',
            sortable: true,
            sortKey: 'organization_type',
        },

        {
            key: 'contactEmail',
            header: 'Contact',
        },

        {
            key: 'registeredDate',
            header: 'Registered',
            sortable: true,
            sortKey: 'created_at',
        },

        {
            key: 'verification_status',
            header: 'Verification',
            sortable: true,
            sortKey: 'verification_status',
        },

        {
            key: 'id',
            header: 'Actions',
            align: 'right',

            render: (_, row) => (
                <div className="flex items-center justify-end gap-4">
                    {row.verification_status === 'pending' && (
                        <button
                            type="button"
                            onClick={() =>
                                handleReviewOrganization(row)
                            }
                            className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                        >
                            Review
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            handleViewOrganization(row.id)
                        }
                        className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            openEditModal(row.id)
                        }
                        className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            openDeleteModal(row)
                        }
                        className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    // --------------------------------
    // Loading
    // --------------------------------
    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading organizations...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the
                            organization list.
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
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                />

                <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-9">
                {/* Header */}
                <PageHeader
                    title="Organizations"
                    subtitle="Manage organizations registered on the Stand For People platform."
                    action={
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={
                                    filteredOrganizations.length === 0
                                }
                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Download size={16} />
                                Export
                            </button>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
                            >
                                <Plus size={17} />
                                Add Organization
                            </button>
                        </div>
                    }
                />

                {/* --------------------------------
                    ORGANIZATION OVERVIEW
                -------------------------------- */}
                <section>
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                Platform overview
                            </p>

                            <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                                Organization base
                            </h2>
                        </div>

                        <p className="hidden text-xs text-text-secondary sm:block">
                            Registered organization distribution
                        </p>
                    </div>

                    <OrganizationStats
                        total={statistics.total}
                        verified={statistics.verified}
                        pending={statistics.pending}
                        rejected={statistics.rejected}
                    />
                </section>

                {/* --------------------------------
                    ORGANIZATION MANAGEMENT
                -------------------------------- */}
                <section className="border-t border-border pt-8">
                    <div className="mb-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Administration
                        </p>

                        <div className="mt-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-text-primary">
                                    Organization management
                                </h2>
                            </div>

                            <p className="text-xs font-medium text-text-secondary">
                                {filteredOrganizations.length}{' '}
                                {filteredOrganizations.length === 1
                                    ? 'organization'
                                    : 'organizations'}{' '}
                                shown
                            </p>
                        </div>
                    </div>

                    {/* Categories */}
                    <OrganizationCategoryTabs
                        tabs={categoryTabs}
                        activeCategory={activeCategory}
                        onChange={handleCategoryChange}
                    />

                    {/* Filters */}
                    <div className="mt-4">
                        <OrganizationFilters
                            searchTerm={searchTerm}
                            typeFilter={typeFilter}
                            statusFilter={statusFilter}
                            organizations={organizations}
                            onSearchChange={
                                handleSearchChange
                            }
                            onTypeChange={handleTypeChange}
                            onStatusChange={
                                handleStatusChange
                            }
                        />
                    </div>

                    {/* Table */}
                    <div className="mt-5">
                        <OrganizationTable
                            columns={columns}
                            rows={rows}
                            onSort={handleSort}
                            getSortIcon={getSortIcon}
                            resultCount={
                                filteredOrganizations.length
                            }
                        />
                    </div>

                    {/* Pagination */}
                    {filteredOrganizations.length > 0 && (
                        <OrganizationPagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            totalItems={
                                filteredOrganizations.length
                            }
                            itemsPerPage={
                                ORGANIZATIONS_PER_PAGE
                            }
                            onPageChange={setCurrentPage}
                        />
                    )}
                </section>
            </div>

            {/* Toast */}
            <OrganizationSuccessToast
                show={toast.show}
                message={toast.message}
            />

            {/* View */}
            <OrganizationViewModal
                organization={selectedOrganization}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            {/* Review / Verification */}
            <OrganizationVerificationModal
                organization={selectedReviewOrganization}
                loading={reviewLoading}
                error={reviewError}
                onClose={closeReviewModal}
                onConfirm={handleVerificationChange}
            />

            {/* Add */}
            <OrganizationFormModal
                key={showAddModal ? 'add-open' : 'add-closed'}
                mode="add"
                open={showAddModal}
                loading={addLoading}
                error={addError}
                fieldErrors={addFieldErrors}
                onClose={closeAddModal}
                onSubmit={handleAddOrganization}
            />

            {/* Edit */}
            <OrganizationFormModal
                key={
                    selectedEditOrganization?.id ||
                    'edit-organization'
                }
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="rounded-xl bg-white px-6 py-5 shadow-xl">
                        <p className="text-sm text-text-secondary">
                            Loading organization details...
                        </p>
                    </div>
                </div>
            )}

            {/* Delete */}
            <OrganizationDeleteModal
                organization={selectedDeleteOrganization}
                loading={deleteLoading}
                error={deleteError}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteOrganization}
            />
        </>
    );
};

export default AdminOrganizations;