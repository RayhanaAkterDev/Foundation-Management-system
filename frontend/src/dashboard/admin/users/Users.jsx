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

import UserViewModal from './modals/ViewModal';
import UserFormModal from './modals/FormModal';
import UserDeleteModal from './modals/DeleteModal';

import UserStats from './components/Stats';
import UserCategoryTabs from './components/CategoryTabs';
import UserFilters from './components/Filters';
import UserTable from './components/Table';
import UserPagination from './components/Pagination';
import UserSuccessToast from './components/SuccessToast';

import {
    createUser,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
} from './api/userApi';

const USERS_PER_PAGE = 25;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedUser, setSelectedUser] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [addFieldErrors, setAddFieldErrors] = useState({});

    const [selectedEditUser, setSelectedEditUser] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [toast, setToast] = useState({
        show: false,
        message: '',
    });

    // --------------------------------
    // Success toast
    // --------------------------------

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
    // Load users
    // --------------------------------

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await fetchUsers();

            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const loadInitialUsers = async () => {
            try {
                const data = await fetchUsers();

                if (!cancelled) {
                    setUsers(data.users);
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialUsers();

        return () => {
            cancelled = true;
        };
    }, []);

    // --------------------------------
    // View user
    // --------------------------------

    const handleViewUser = async (userId) => {
        setViewLoading(true);
        setViewError('');
        setSelectedUser(null);

        try {
            const data = await fetchUser(userId);

            setSelectedUser(data.user);
        } catch (err) {
            setViewError(err.message);
        } finally {
            setViewLoading(false);
        }
    };

    const closeViewModal = () => {
        setSelectedUser(null);
        setViewError('');
    };

    // --------------------------------
    // Add user
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

    const handleAddUser = async (formData) => {
        setAddLoading(true);
        setAddError('');
        setAddFieldErrors({});

        try {
            await createUser(formData);

            setShowAddModal(false);

            await loadUsers();

            setCurrentPage(1);

            showSuccessToast('User added successfully.');
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
    // Edit user
    // --------------------------------

    const openEditModal = async (userId) => {
        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});
        setSelectedEditUser(null);

        try {
            const data = await fetchUser(userId);

            setSelectedEditUser(data.user);
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

        setSelectedEditUser(null);
        setEditError('');
        setEditFieldErrors({});
    };

    const handleEditUser = async (formData) => {
        if (!selectedEditUser) {
            return;
        }

        setEditLoading(true);
        setEditError('');
        setEditFieldErrors({});

        try {
            await updateUser(selectedEditUser.id, formData);

            setSelectedEditUser(null);

            await loadUsers();

            showSuccessToast('User updated successfully.');
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
    // Delete user
    // --------------------------------

    const openDeleteModal = (user) => {
        setDeleteError('');
        setSelectedDeleteUser(user);
    };

    const closeDeleteModal = () => {
        if (deleteLoading) {
            return;
        }

        setSelectedDeleteUser(null);
        setDeleteError('');
    };

    const handleDeleteUser = async () => {
        if (!selectedDeleteUser) {
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');

        try {
            await deleteUser(selectedDeleteUser.id);

            setSelectedDeleteUser(null);

            await loadUsers();

            showSuccessToast('User deleted successfully.');
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
            total: users.length,

            individuals: users.filter((user) => user.role === 'individual')
                .length,

            organizations: users.filter((user) => user.role === 'organization')
                .length,

            administrators: users.filter((user) => user.role === 'admin')
                .length,
        };
    }, [users]);

    // --------------------------------
    // Category tabs
    // --------------------------------

    const categoryTabs = useMemo(
        () => [
            {
                key: 'all',
                label: 'All Users',
                count: statistics.total,
            },
            {
                key: 'individual',
                label: 'Individuals',
                count: statistics.individuals,
            },
            {
                key: 'organization',
                label: 'Organizations',
                count: statistics.organizations,
            },
            {
                key: 'admin',
                label: 'Administrators',
                count: statistics.administrators,
            },
        ],
        [statistics],
    );

    // --------------------------------
    // Filtering + sorting
    // --------------------------------

    const filteredUsers = useMemo(() => {
        let result = [...users];

        if (activeCategory !== 'all') {
            result = result.filter((user) => user.role === activeCategory);
        }

        if (statusFilter !== 'all') {
            result = result.filter((user) => user.status === statusFilter);
        }

        const search = searchTerm.trim().toLowerCase();

        if (search) {
            result = result.filter(
                (user) =>
                    user.name?.toLowerCase().includes(search) ||
                    user.email?.toLowerCase().includes(search),
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
    }, [users, activeCategory, statusFilter, searchTerm, sortConfig]);

    // --------------------------------
    // Pagination
    // --------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / USERS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedUsers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;

        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, safeCurrentPage]);

    // --------------------------------
    // Controls
    // --------------------------------

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
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

    // --------------------------------
    // CSV Export
    // --------------------------------

    const handleExportCSV = () => {
        if (filteredUsers.length === 0) {
            return;
        }

        const headers = ['Name', 'Email', 'Role', 'Status', 'Joined'];

        const csvRows = filteredUsers.map((user) => [
            user.name,
            user.email,
            user.role,
            user.status,
            new Date(user.created_at).toLocaleDateString(),
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
        link.download = 'stand-for-people-users.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showSuccessToast('Users exported successfully.');
    };

    // --------------------------------
    // Table
    // --------------------------------

    const rows = paginatedUsers.map((user, index) => ({
        ...user,

        serialNumber: (safeCurrentPage - 1) * USERS_PER_PAGE + index + 1,

        joinedDate: new Date(user.created_at).toLocaleDateString(),
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
            header: 'Name',
            sortable: true,
            sortKey: 'name',
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true,
            sortKey: 'email',
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            sortKey: 'role',
        },
        {
            key: 'joinedDate',
            header: 'Joined',
            sortable: true,
            sortKey: 'created_at',
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
        },
        {
            key: 'id',
            header: 'Actions',
            align: 'right',

            render: (_, row) => (
                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => handleViewUser(row.id)}
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
                        onClick={() => openDeleteModal(row)}
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
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
                />

                <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading users...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the user list.
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
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
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
                    title="Users"
                    subtitle="Review and manage everyone connected to Stand For People, including their roles, account status, and platform access."
                    action={
                        <div className="flex w-full items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredUsers.length === 0}
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

                                <span>Add User</span>
                            </button>
                        </div>
                    }
                />

                {/* User overview */}
                <UserStats
                    total={statistics.total}
                    individuals={statistics.individuals}
                    organizations={statistics.organizations}
                    administrators={statistics.administrators}
                />

                {/* --------------------------------
                    USER MANAGEMENT
                --------------------------------- */}
                <section>
                    {/* Section heading */}
                    <div className="mb-6">
                        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2.5">
                                    <span className="h-1.5 w-1.5 bg-primary" />

                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                        Administration
                                    </span>
                                </div>

                                <h2 className="font-fraunces text-[25px] font-semibold leading-tight tracking-tight text-text-primary">
                                    User management
                                </h2>

                                <p className="mt-1.5 max-w-xl text-[13px] leading-5 text-text-secondary">
                                    Review accounts, roles, and access across
                                    the platform.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2.5">
                                <span className="h-8 border-l border-border" />

                                <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                                        Showing
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-text-primary">
                                        {filteredUsers.length}{' '}
                                        <span className="font-normal text-text-secondary">
                                            {filteredUsers.length === 1
                                                ? 'user'
                                                : 'users'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Management workspace */}
                    <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                        {/* LEFT — USER TABLE WORKSPACE */}
                        <div className="flex min-h-0 min-w-0 flex-col border border-border bg-surface">
                            {/* Workspace toolbar */}
                            <div className="shrink-0 border-b border-border px-5 py-4">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    {/* Search */}
                                    <div className="min-w-0 flex-1 lg:max-w-full">
                                        <div className="relative">
                                            <Search
                                                size={17}
                                                strokeWidth={1.8}
                                                className="
                                                    pointer-events-none
                                                    absolute left-3.5 top-1/2
                                                    -translate-y-1/2
                                                    text-text-secondary
                                                "
                                            />

                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                placeholder="Search by name or email"
                                                className="
                                                    h-10 w-full
                                                    border border-border
                                                    bg-background
                                                    pl-10 pr-16
                                                    text-[13px]
                                                    font-medium
                                                    text-text-primary
                                                    outline-none
                                                    transition-colors
                                                    placeholder:text-text-secondary/70
                                                    focus:border-primary/50
                                                    focus:bg-surface
                                                "
                                            />

                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="
                                                        absolute right-3
                                                        top-1/2
                                                        -translate-y-1/2
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-text-secondary
                                                        transition-colors
                                                        hover:text-text-primary
                                                    "
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Table context */}
                                    <div className="flex shrink-0 items-center gap-5">
                                        <div className="hidden h-7 border-l border-border lg:block" />

                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                                Directory
                                            </p>

                                            <p className="mt-0.5 text-xs font-medium text-text-primary">
                                                {filteredUsers.length} results
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table heading */}
                            <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-5 py-3.5">
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">
                                        Registered users
                                    </p>

                                    <p className="mt-0.5 text-xs text-text-secondary">
                                        Browse and review platform accounts
                                    </p>
                                </div>

                                <span className="text-[11px] font-medium text-text-secondary">
                                    Sorted by account
                                </span>
                            </div>

                            {/* Scrollable table */}
                            <div className="min-h-0 max-h-130 flex-1 overflow-y-auto">
                                <UserTable
                                    columns={columns}
                                    rows={rows}
                                    onSort={handleSort}
                                    getSortIcon={getSortIcon}
                                    resultCount={filteredUsers.length}
                                />
                            </div>

                            {/* Pagination */}
                            {filteredUsers.length > 0 && (
                                <div className="shrink-0 border-t border-border">
                                    <UserPagination
                                        currentPage={safeCurrentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredUsers.length}
                                        itemsPerPage={USERS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>

                        {/* RIGHT — CATEGORY + FILTER SIDEBAR */}
                        <aside className="flex min-h-0 flex-col border border-primary/90 bg-primary">
                            {/* Sidebar heading */}
                            <div className="shrink-0 px-5 pb-5 pt-6">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                                    Directory controls
                                </p>

                                <h2 className="mt-1.5 font-fraunces text-[21px] leading-tight text-white">
                                    Refine users
                                </h2>

                                <p className="mt-2 max-w-55 text-[12px] leading-5 text-white/50">
                                    Narrow the directory by account type and
                                    current status.
                                </p>
                            </div>

                            {/* User role */}
                            <div className="border-y border-white/10 bg-black/4 px-4 py-5">
                                <div className="mb-3 flex items-center justify-between px-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                                        User role
                                    </p>

                                    <span className="text-[10px] font-medium tabular-nums text-white/30">
                                        {categoryTabs.length}
                                    </span>
                                </div>

                                <UserCategoryTabs
                                    tabs={categoryTabs}
                                    activeCategory={activeCategory}
                                    onChange={handleCategoryChange}
                                />
                            </div>

                            {/* Status */}
                            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
                                <div className="mb-3 px-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                                        Account status
                                    </p>

                                    <p className="mt-1 text-[11px] leading-4 text-white/30">
                                        Filter accounts by their current state.
                                    </p>
                                </div>

                                <UserFilters
                                    statusFilter={statusFilter}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                        </aside>
                    </div>
                </section>
            </div>

            {/* Toast */}
            <UserSuccessToast show={toast.show} message={toast.message} />

            {/* View */}
            <UserViewModal
                user={selectedUser}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            {/* Add */}
            <UserFormModal
                mode="add"
                open={showAddModal}
                loading={addLoading}
                error={addError}
                fieldErrors={addFieldErrors}
                onClose={closeAddModal}
                onSubmit={handleAddUser}
            />

            {/* Edit */}
            <UserFormModal
                key={selectedEditUser?.id || 'edit-user'}
                mode="edit"
                open={Boolean(selectedEditUser)}
                loading={editLoading}
                error={editError}
                fieldErrors={editFieldErrors}
                user={selectedEditUser}
                onClose={closeEditModal}
                onSubmit={handleEditUser}
            />

            {editLoading && !selectedEditUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="rounded-xl bg-white px-6 py-5 shadow-xl">
                        <p className="text-sm text-text-secondary">
                            Loading user details...
                        </p>
                    </div>
                </div>
            )}

            {/* Delete */}
            <UserDeleteModal
                user={selectedDeleteUser}
                loading={deleteLoading}
                error={deleteError}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteUser}
            />
        </>
    );
};

export default Users;
