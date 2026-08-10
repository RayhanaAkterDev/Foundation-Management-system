import React, { useEffect, useState } from 'react';
import { HandCoins } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/donations',
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
                        data.message || 'Unable to load donations.',
                    );
                }

                setDonations(data.donations);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    const rows = donations.map((donation) => ({
        ...donation,
        donor: donation.user?.name || 'Unknown',
        campaign: donation.campaign?.title || 'Unknown',
        formattedAmount: `৳${Number(donation.amount).toLocaleString()}`,
        donatedDate: new Date(donation.created_at).toLocaleDateString(),
    }));

    const columns = [
        {
            key: 'donor',
            header: 'Donor',
        },
        {
            key: 'campaign',
            header: 'Campaign',
        },
        {
            key: 'formattedAmount',
            header: 'Amount',
        },
        {
            key: 'payment_method',
            header: 'Payment',
            render: (value) => (
                <span className="capitalize">{value || 'N/A'}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'donatedDate',
            header: 'Date',
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
                    title="Donations"
                    subtitle="Monitor donations made across the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading donations...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Donations"
                    subtitle="Monitor donations made across the Stand For People platform."
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
                title="Donations"
                subtitle="Monitor donations made across the Stand For People platform."
            />

            <DataTable
                title="All Donations"
                columns={columns}
                rows={rows}
                empty={{
                    icon: HandCoins,
                    title: 'No donations found',
                    message:
                        'Donations will appear here after users make contributions.',
                }}
            />
        </div>
    );
};

export default AdminDonations;
