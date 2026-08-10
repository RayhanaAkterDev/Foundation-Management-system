import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/users',
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load users.');
                }

                setUsers(data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

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

            // eslint-disable-next-line no-unused-vars
            render: (_, row) => (
                <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                >
                    View
                </button>
            ),
        },
    ];

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
        <div className="space-y-6">
            <PageHeader
                title="Users"
                subtitle="All registered users on the Stand For People platform."
                action={
                    <button
                        type="button"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary transition-colors hover:bg-[#eef3f6]"
                    >
                        Export CSV
                    </button>
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
    );
};

export default AdminUsers;
