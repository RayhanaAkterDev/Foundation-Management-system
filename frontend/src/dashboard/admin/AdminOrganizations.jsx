import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

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

        fetchOrganizations();
    }, []);

    const rows = organizations.map((organization) => ({
        ...organization,

        type: organization.organization_type || 'Not specified',

        contactEmail: organization.user?.email || '—',

        registeredDate: organization.created_at
            ? new Date(organization.created_at).toLocaleDateString()
            : '—',

        verificationStatus: organization.verification_status || 'pending',
    }));

    const columns = [
        {
            key: 'name',
            header: 'Organization',
        },
        {
            key: 'type',
            header: 'Type',
        },
        {
            key: 'contactEmail',
            header: 'Contact',
        },
        {
            key: 'registeredDate',
            header: 'Registered',
        },
        {
            key: 'verificationStatus',
            header: 'Verification',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'id',
            header: 'Actions',
            align: 'right',
            render: () => (
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        View
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Organizations"
                    subtitle="All organizations registered on the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading organizations...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Organizations"
                    subtitle="All organizations registered on the Stand For People platform."
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
                title="Organizations"
                subtitle="All organizations registered on the Stand For People platform."
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
                title="All Organizations"
                columns={columns}
                rows={rows}
                empty={{
                    icon: Building2,
                    title: 'No organizations found',
                    message:
                        'Organizations will appear here after registration.',
                }}
            />
        </div>
    );
};

export default AdminOrganizations;
