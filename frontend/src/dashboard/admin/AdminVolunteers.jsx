import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/volunteers',
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
                        data.message || 'Unable to load volunteers.',
                    );
                }

                setVolunteers(data.volunteers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

    const rows = volunteers.map((volunteer) => ({
        ...volunteer,
        volunteerName: volunteer.user?.name || 'Unknown',
        email: volunteer.user?.email || 'N/A',
        organization: volunteer.organization?.name || 'Independent',
        joinedDate: new Date(volunteer.created_at).toLocaleDateString(),
    }));

    const columns = [
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
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'joinedDate',
            header: 'Joined',
        },
        {
            key: 'id',
            header: 'Actions',
            align: 'right',
            render: () => (
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
                    title="Volunteers"
                    subtitle="Manage volunteers registered on the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading volunteers...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Volunteers"
                    subtitle="Manage volunteers registered on the Stand For People platform."
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
                title="Volunteers"
                subtitle="Manage volunteers registered on the Stand For People platform."
            />

            <DataTable
                title="All Volunteers"
                columns={columns}
                rows={rows}
                empty={{
                    icon: Users,
                    title: 'No volunteers found',
                    message: 'Volunteers will appear here after registration.',
                }}
            />
        </div>
    );
};

export default AdminVolunteers;
