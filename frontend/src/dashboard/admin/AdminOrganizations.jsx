import React, { useEffect, useMemo, useState } from 'react';
import {
    Plus,
    Download,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import OrganizationStats from './organizations/OrganizationStats';
import OrganizationCategoryTabs from './organizations/OrganizationCategoryTabs';
import OrganizationFilters from './organizations/OrganizationFilters';
import OrganizationTable from './organizations/OrganizationTable';
import OrganizationViewModal from './organizations/OrganizationViewModal';
import OrganizationFormModal from './organizations/OrganizationFormModal';
import OrganizationVerificationModal from './organizations/OrganizationVerificationModal';
import OrganizationDeleteModal from './organizations/OrganizationDeleteModal';
import OrganizationSuccessToast from './organizations/OrganizationSuccessToast';

import {
    fetchOrganizations,
    fetchOrganization,
    updateOrganization,
    updateOrganizationVerification,
    deleteOrganization,
} from './organizations/organizationApi';

const ORGANIZATIONS_PER_PAGE = 25;

const AdminOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ---------------------------------------------------------
    // Filters
    // ---------------------------------------------------------

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // ---------------------------------------------------------
    // Sorting
    // ---------------------------------------------------------

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // ---------------------------------------------------------
    // View
    // ---------------------------------------------------------

    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

    // ---------------------------------------------------------
    // Edit
    // ---------------------------------------------------------

    const [selectedEditOrganization, setSelectedEditOrganization] =
        useState(null);

    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    // ---------------------------------------------------------
    // Verification
    // ---------------------------------------------------------

    const [
        selectedVerificationOrganization,
        setSelectedVerificationOrganization,
    ] = useState(null);

    const [verificationLoading, setVerificationLoading] = useState(false);

    const [verificationError, setVerificationError] = useState('');

    // ---------------------------------------------------------
    // Delete
    // ---------------------------------------------------------

    const [selectedDeleteOrganization, setSelectedDeleteOrganization] =
        useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // ---------------------------------------------------------
    // Toast
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Load organizations
    // ---------------------------------------------------------

    const loadOrganizations = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchOrganizations();

            setOrganizations(data.organizations || []);
        } catch (err) {
            setError(err.message || 'Unable to load organizations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadInitialOrganizations = async () => {
            try {
                const data = await fetchOrganizations();

                if (!cancelled) {
                    setOrganizations(data.organizations || []);
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Unable to load organizations.');
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

    // ---------------------------------------------------------
    // Statistics
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Organization types
    // ---------------------------------------------------------

    const organizationTypes = useMemo(() => {
        return [
            ...new Set(
                organizations
                    .map((organization) => organization.organization_type)
                    .filter(Boolean),
            ),
        ].sort((a, b) => a.localeCompare(b));
    }, [organizations]);

    // ---------------------------------------------------------
    // Category tabs
    // ---------------------------------------------------------

    const categoryTabs = [
        {
            key: 'all',
            label: 'All Organizations',
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
            key: 'rejected',
            label: 'Rejected',
            count: statistics.rejected,
        },
    ];

    // ---------------------------------------------------------
    // View organization
    // ---------------------------------------------------------

    const handleViewOrganization = async (organizationId) => {
        setViewLoading(true);
        setViewError('');
        setSelectedOrganization(null);

        try {
            const data = await fetchOrganization(organizationId);

            setSelectedOrganization(data.organization);
        } catch (err) {
            setViewError(err.message || 'Unable to load organization details.');
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedOrganization(null);
        setViewError('');
    };

    // ---------------------------------------------------------
    // Edit organization
    // ---------------------------------------------------------

    const openEditModal = async (organizationId) => {
        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});
        setSelectedEditOrganization(null);

        try {
            const data = await fetchOrganization(organizationId);

            setSelectedEditOrganization(data.organization);
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

    // ---------------------------------------------------------
    // Verification
    // ---------------------------------------------------------

    const openVerificationModal = (organization) => {
        setVerificationError('');
        setSelectedVerificationOrganization(organization);
    };

    const closeVerificationModal = () => {
        if (verificationLoading) {
            return;
        }

        setSelectedVerificationOrganization(null);
        setVerificationError('');
    };

    const handleVerificationChange = async (status) => {
        if (!selectedVerificationOrganization) {
            return;
        }

        setVerificationLoading(true);
        setVerificationError('');

        try {
            await updateOrganizationVerification(
                selectedVerificationOrganization.id,
                status,
            );

            setSelectedVerificationOrganization(null);

            await loadOrganizations();

            showSuccessToast('Organization verification updated successfully.');
        } catch (err) {
            setVerificationError(
                err.message || 'Unable to update verification status.',
            );
        } finally {
            setVerificationLoading(false);
        }
    };

    // ---------------------------------------------------------
    // Delete
    // ---------------------------------------------------------

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

            showSuccessToast('Organization deleted successfully.');
        } catch (err) {
            setDeleteError(err.message || 'Unable to delete organization.');
        } finally {
            setDeleteLoading(false);
        }
    };

    // ---------------------------------------------------------
    // Filtering + sorting
    // ---------------------------------------------------------

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
                (organization) => organization.organization_type === typeFilter,
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
            result = result.filter((organization) => {
                const name = organization.name?.toLowerCase() || '';

                const email = organization.user?.email?.toLowerCase() || '';

                const type =
                    organization.organization_type?.toLowerCase() || '';

                const registration =
                    organization.registration_number?.toLowerCase() || '';

                return (
                    name.includes(search) ||
                    email.includes(search) ||
                    type.includes(search) ||
                    registration.includes(search)
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

    // ---------------------------------------------------------
    // Pagination
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Filters
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // Sorting
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // CSV Export
    // ---------------------------------------------------------

    const handleExportCSV = () => {
        if (filteredOrganizations.length === 0) {
            return;
        }

        const headers = [
            'Organization',
            'Type',
            'Contact Email',
            'Registration Number',
            'Phone',
            'Verification Status',
            'Registered',
        ];

        const csvRows = filteredOrganizations.map((organization) => [
            organization.name,
            organization.organization_type,
            organization.user?.email,
            organization.registration_number,
            organization.phone,
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

    // ---------------------------------------------------------
    // Table rows
    // ---------------------------------------------------------

    const rows = paginatedOrganizations.map((organization, index) => ({
        ...organization,

        serialNumber:
            (safeCurrentPage - 1) * ORGANIZATIONS_PER_PAGE + index + 1,

        type: organization.organization_type || 'Not specified',

        contactEmail: organization.user?.email || '—',

        registeredDate: organization.created_at
            ? new Date(organization.created_at).toLocaleDateString()
            : '—',

        verificationStatus: organization.verification_status || 'pending',
    }));

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
            key: 'type',
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
            key: 'verificationStatus',
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
                    <button
                        type="button"
                        onClick={() => handleViewOrganization(row.id)}
                        className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={() => openEditModal(row.id)}
                        className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => openVerificationModal(row)}
                        className="text-xs font-semibold text-amber-600 transition-colors hover:text-amber-700"
                    >
                        Review
                    </button>

                    <button
                        type="button"
                        onClick={() => openDeleteModal(row)}
                        className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    // ---------------------------------------------------------
    // Loading
    // ---------------------------------------------------------

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Organizations"
                    subtitle="Review and manage organizations registered on the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                    <p className="text-sm font-medium text-text-primary">
                        Loading organizations...
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                        Please wait while we retrieve the organization list.
                    </p>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------
    // Error
    // ---------------------------------------------------------

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Organizations"
                    subtitle="Review and manage organizations registered on the Stand For People platform."
                />

                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-7">
                <PageHeader
                    title="Organizations"
                    subtitle="Review and manage organizations registered on the Stand For People platform."
                    action={
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            disabled={filteredOrganizations.length === 0}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Download size={16} />
                            Export
                        </button>
                    }
                />

                <OrganizationStats
                    total={statistics.total}
                    verified={statistics.verified}
                    pending={statistics.pending}
                    rejected={statistics.rejected}
                />

                <OrganizationCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />

                <OrganizationFilters
                    searchTerm={searchTerm}
                    typeFilter={typeFilter}
                    statusFilter={statusFilter}
                    organizationTypes={organizationTypes}
                    onSearchChange={handleSearchChange}
                    onTypeChange={handleTypeChange}
                    onStatusChange={handleStatusChange}
                />

                <OrganizationTable
                    columns={columns}
                    rows={rows}
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                    resultCount={filteredOrganizations.length}
                />

                {filteredOrganizations.length > 0 && (
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-xs text-text-secondary">
                            Showing{' '}
                            <span className="font-semibold text-text-primary">
                                {(safeCurrentPage - 1) *
                                    ORGANIZATIONS_PER_PAGE +
                                    1}
                            </span>{' '}
                            –{' '}
                            <span className="font-semibold text-text-primary">
                                {Math.min(
                                    safeCurrentPage * ORGANIZATIONS_PER_PAGE,
                                    filteredOrganizations.length,
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-semibold text-text-primary">
                                {filteredOrganizations.length}
                            </span>{' '}
                            organizations
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={safeCurrentPage === 1}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1),
                                    )
                                }
                                className="h-9 rounded-lg border border-border bg-white px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-white">
                                {safeCurrentPage}
                            </div>

                            <button
                                type="button"
                                disabled={safeCurrentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(totalPages, page + 1),
                                    )
                                }
                                className="h-9 rounded-lg border border-border bg-white px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <OrganizationSuccessToast
                show={toast.show}
                message={toast.message}
            />

            <OrganizationViewModal
                organization={selectedOrganization}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            <OrganizationFormModal
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

            <OrganizationVerificationModal
                organization={selectedVerificationOrganization}
                loading={verificationLoading}
                error={verificationError}
                onClose={closeVerificationModal}
                onConfirm={handleVerificationChange}
            />

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
