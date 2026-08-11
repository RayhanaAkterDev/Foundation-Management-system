import React, { useEffect, useMemo, useState } from 'react';
import {
    Plus,
    Download,
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import UserViewModal from './users/UserViewModal';
import UserFormModal from './users/UserFormModal';
import UserDeleteModal from './users/UserDeleteModal';

import UserStats from './users/UserStats';
import UserCategoryTabs from './users/UserCategoryTabs';
import UserFilters from './users/UserFilters';
import UserTable from './users/UserTable';
import UserPagination from './users/UserPagination';
import UserSuccessToast from './users/UserSuccessToast';

import {
    createUser,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
} from './users/userApi';

const USERS_PER_PAGE = 25;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // -----------------------------
    // Filters / Search / Sorting
    // -----------------------------

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [sortConfig, setSortConfig] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [currentPage, setCurrentPage] = useState(1);

    // -----------------------------
    // View user
    // -----------------------------

    const [selectedUser, setSelectedUser] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

    // -----------------------------
    // Add user
    // -----------------------------

    const [showAddModal, setShowAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [addFieldErrors, setAddFieldErrors] = useState({});

    // -----------------------------
    // Edit user
    // -----------------------------

    const [selectedEditUser, setSelectedEditUser] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editFieldErrors, setEditFieldErrors] = useState({});

    // -----------------------------
    // Delete user
    // -----------------------------

    const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // -----------------------------
    // Success toast
    // -----------------------------

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

    // -----------------------------
    // Load users
    // -----------------------------

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

    // -----------------------------
    // View user
    // -----------------------------

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

    // -----------------------------
    // Add user
    // -----------------------------

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

    // -----------------------------
    // Edit user
    // -----------------------------

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

    // -----------------------------
    // Delete user
    // -----------------------------

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

    // -----------------------------
    // User statistics
    // -----------------------------

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

    // -----------------------------
    // Category tabs
    // -----------------------------

    const categoryTabs = [
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
    ];

    // -----------------------------
    // Filtering + sorting
    // -----------------------------

    const filteredUsers = useMemo(() => {
        let result = [...users];

        if (activeCategory !== 'all') {
            result = result.filter((user) => user.role === activeCategory);
        }

        if (roleFilter !== 'all') {
            result = result.filter((user) => user.role === roleFilter);
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

        // No active sort → keep default order
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
        users,
        activeCategory,
        roleFilter,
        statusFilter,
        searchTerm,
        sortConfig,
    ]);

    // -----------------------------
    // Pagination
    // -----------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / USERS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedUsers = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * USERS_PER_PAGE;

        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, safeCurrentPage]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleRoleChange = (event) => {
        setRoleFilter(event.target.value);
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
            // First click → ascending
            if (current.key !== key) {
                return {
                    key,
                    direction: 'asc',
                };
            }

            // Second click → descending
            if (current.direction === 'asc') {
                return {
                    key,
                    direction: 'desc',
                };
            }

            // Third click → default / unsorted
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

    // -----------------------------
    // CSV Export
    // -----------------------------

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

    // -----------------------------
    // Table rows
    // -----------------------------

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
            render: (value) => (
                <span className="capitalize text-text-primary">
                    {value === 'admin' ? 'Administrator' : value}
                </span>
            ),
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

    // -----------------------------
    // Loading
    // -----------------------------

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                    <p className="text-sm font-medium text-text-primary">
                        Loading users...
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                        Please wait while we retrieve the user list.
                    </p>
                </div>
            </div>
        );
    }

    // -----------------------------
    // Error
    // -----------------------------

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
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
                {/* Page Header */}
                <PageHeader
                    title="Users"
                    subtitle="Manage all registered users on the Stand For People platform."
                    action={
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                disabled={filteredUsers.length === 0}
                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Download size={16} />
                                Export
                            </button>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
                            >
                                <Plus size={17} />
                                Add User
                            </button>
                        </div>
                    }
                />

                {/* Overview */}
                <UserStats
                    total={statistics.total}
                    individuals={statistics.individuals}
                    organizations={statistics.organizations}
                    administrators={statistics.administrators}
                />

                {/* Categories */}
                <UserCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />

                {/* Filters */}
                <UserFilters
                    searchTerm={searchTerm}
                    roleFilter={roleFilter}
                    statusFilter={statusFilter}
                    onSearchChange={handleSearchChange}
                    onRoleChange={handleRoleChange}
                    onStatusChange={handleStatusChange}
                />

                {/* Table */}
                <UserTable
                    columns={columns}
                    rows={rows}
                    onSort={handleSort}
                    getSortIcon={getSortIcon}
                    resultCount={filteredUsers.length}
                />

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <UserPagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={filteredUsers.length}
                        itemsPerPage={USERS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Success Toast */}
            <UserSuccessToast show={toast.show} message={toast.message} />

            {/* Existing Modals */}
            <UserViewModal
                user={selectedUser}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            <UserFormModal
                mode="add"
                open={showAddModal}
                loading={addLoading}
                error={addError}
                fieldErrors={addFieldErrors}
                onClose={closeAddModal}
                onSubmit={handleAddUser}
            />

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

export default AdminUsers;
