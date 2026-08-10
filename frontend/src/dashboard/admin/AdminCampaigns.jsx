import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/campaigns',
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
                        data.message || 'Unable to load campaigns.',
                    );
                }

                setCampaigns(data.campaigns);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const rows = campaigns.map((campaign) => ({
        ...campaign,
        organization: campaign.organization?.name || 'Unknown',
        target:
            campaign.target_amount !== null
                ? `৳${Number(campaign.target_amount).toLocaleString()}`
                : 'N/A',
        collected: `৳${Number(
            campaign.collected_amount || 0,
        ).toLocaleString()}`,
        startDate: campaign.start_date
            ? new Date(campaign.start_date).toLocaleDateString()
            : 'N/A',
    }));

    const columns = [
        {
            key: 'title',
            header: 'Campaign',
        },
        {
            key: 'organization',
            header: 'Organization',
        },
        {
            key: 'category',
            header: 'Category',
        },
        {
            key: 'target',
            header: 'Target',
        },
        {
            key: 'collected',
            header: 'Collected',
        },
        {
            key: 'status',
            header: 'Status',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'startDate',
            header: 'Start Date',
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
                    title="Campaigns"
                    subtitle="Monitor fundraising campaigns across the Stand For People platform."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading campaigns...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Campaigns"
                    subtitle="Monitor fundraising campaigns across the Stand For People platform."
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
                title="Campaigns"
                subtitle="Monitor fundraising campaigns across the Stand For People platform."
            />

            <DataTable
                title="All Campaigns"
                columns={columns}
                rows={rows}
                empty={{
                    icon: Megaphone,
                    title: 'No campaigns found',
                    message:
                        'Campaigns will appear here after organizations create them.',
                }}
            />
        </div>
    );
};

export default AdminCampaigns;
