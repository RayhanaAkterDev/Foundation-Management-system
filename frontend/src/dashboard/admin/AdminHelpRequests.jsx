import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminHelpRequests = () => {
    const [helpRequests, setHelpRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHelpRequests = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/help-requests',
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
                        data.message || 'Unable to load help requests.',
                    );
                }

                setHelpRequests(data.helpRequests);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHelpRequests();
    }, []);

    const rows = helpRequests.map((request) => ({
        ...request,
        requester: request.user?.name || 'Unknown',
        submittedDate: new Date(request.created_at).toLocaleDateString(),
    }));

    const columns = [
        {
            key: 'title',
            header: 'Request',
        },
        {
            key: 'requester',
            header: 'Requester',
        },
        {
            key: 'category',
            header: 'Category',
        },
        {
            key: 'district',
            header: 'District',
        },
        {
            key: 'urgency',
            header: 'Urgency',
            render: (value) => <span className="capitalize">{value}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'submittedDate',
            header: 'Submitted',
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
                    title="Help Requests"
                    subtitle="Review and manage help requests submitted by individuals."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading help requests...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Help Requests"
                    subtitle="Review and manage help requests submitted by individuals."
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
                title="Help Requests"
                subtitle="Review and manage help requests submitted by individuals."
            />

            <DataTable
                title="All Help Requests"
                columns={columns}
                rows={rows}
                empty={{
                    icon: ClipboardList,
                    title: 'No help requests found',
                    message:
                        'Help requests will appear here after individuals submit them.',
                }}
            />
        </div>
    );
};

export default AdminHelpRequests;
