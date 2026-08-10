import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

import UserViewModal from './users/UserViewModal';
import UserFormModal from './users/UserFormModal';
import UserDeleteModal from './users/UserDeleteModal';

import {
    createUser,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
} from './users/userApi';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    // -----------------------------
    // Table
    // -----------------------------

    const rows = users.map((user) => ({
        ...user,
        joinedDate: new Date(user.created_at).toLocaleDateString(),
        status: user.email_verified_at ? 'active' : 'pending',
    }));

    const columns = [
        {
            key: 'name',
            header: 'Name',
        },
        {
            key: 'email',
            header: 'Email',
        },
        {
            key: 'role',
            header: 'Role',
            render: (value) => <span className="capitalize">{value}</span>,
        },
        {
            key: 'joinedDate',
            header: 'Joined',
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'id',
            header: 'Actions',
            align: 'right',
            render: (_, row) => (
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => handleViewUser(row.id)}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        onClick={() => openEditModal(row.id)}
                        className="text-xs font-medium text-text-secondary hover:text-primary hover:underline"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => openDeleteModal(row)}
                        className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
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
                    subtitle="All registered users on the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading users...
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
                    subtitle="All registered users on the Stand For People platform."
                />

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <PageHeader
                    title="Users"
                    subtitle="All registered users on the Stand For People platform."
                    action={
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                            >
                                Add User
                            </button>

                            <button
                                type="button"
                                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary transition-colors hover:bg-[#eef3f6]"
                            >
                                Export CSV
                            </button>
                        </div>
                    }
                />

                <DataTable
                    title="All Users"
                    columns={columns}
                    rows={rows}
                    empty={{
                        icon: Users,
                        title: 'No users found',
                        message: 'Users will appear here after registration.',
                    }}
                />
            </div>

            {/* View User */}
            <UserViewModal
                user={selectedUser}
                loading={viewLoading}
                error={viewError}
                onClose={closeViewModal}
            />

            {/* Add User */}
            <UserFormModal
                mode="add"
                open={showAddModal}
                loading={addLoading}
                error={addError}
                fieldErrors={addFieldErrors}
                onClose={closeAddModal}
                onSubmit={handleAddUser}
            />

            {/* Edit User */}
            <UserFormModal
                mode="edit"
                open={Boolean(selectedEditUser)}
                loading={editLoading}
                error={editError}
                fieldErrors={editFieldErrors}
                user={selectedEditUser}
                onClose={closeEditModal}
                onSubmit={handleEditUser}
            />

            {/* Edit Loading */}
            {editLoading && !selectedEditUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="rounded-2xl bg-white px-6 py-5 shadow-xl">
                        <p className="text-sm text-text-secondary">
                            Loading user details...
                        </p>
                    </div>
                </div>
            )}

            {/* Delete User */}
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
