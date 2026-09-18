import React, { useEffect, useMemo, useState } from 'react';

import { HandCoins } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

import { getMyDonations } from './api/donationApi';

const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString('en-BD');
};

const formatDate = (date) => {
    if (!date) {
        return '—';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const columns = [
    {
        key: 'campaign',
        header: 'Campaign',
    },
    {
        key: 'amount',
        header: 'Amount',
        align: 'right',
        render: (val) => (
            <span className="font-medium text-text-primary">
                ৳{formatAmount(val)}
            </span>
        ),
    },
    {
        key: 'date',
        header: 'Date',
    },
    {
        key: 'status',
        header: 'Status',
        render: (val) => <StatusBadge status={val} />,
    },
];

const MyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [summary, setSummary] = useState({
        totalDonated: 0,
        donationCount: 0,
        lastDonation: '—',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDonations = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getMyDonations();

                const donationData = Array.isArray(response?.donations)
                    ? response.donations
                    : [];

                setDonations(donationData);

                setSummary({
                    totalDonated: Number(response?.summary?.totalDonated || 0),
                    donationCount: Number(
                        response?.summary?.donationCount || 0,
                    ),
                    lastDonation: response?.summary?.lastDonation || '—',
                });
            } catch (err) {
                console.error('Failed to load donations:', err);

                setError(
                    'Unable to load your donation history. Please try again.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadDonations();
    }, []);

    const rows = useMemo(() => {
        return donations.map((donation) => ({
            id: donation.id,

            campaign:
                donation.campaign?.title ||
                donation.campaign?.name ||
                'Campaign',

            amount: Number(donation.amount || 0),

            date: formatDate(donation.created_at),

            status: donation.status || 'completed',
        }));
    }, [donations]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Donations"
                subtitle="A record of all your contributions to campaigns and causes."
                action={
                    <button
                        type="button"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                    >
                        <HandCoins className="h-4 w-4" />
                        Donate Now
                    </button>
                }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                    label="Total Donated"
                    value={`৳${formatAmount(summary.totalDonated)}`}
                    icon={HandCoins}
                    subtext="all time"
                />

                <StatCard
                    label="Donations Made"
                    value={summary.donationCount}
                    icon={HandCoins}
                    iconColor="bg-blue-50"
                    subtext="total transactions"
                />

                <StatCard
                    label="Last Donation"
                    value={summary.lastDonation}
                    icon={HandCoins}
                    iconColor="bg-amber-50"
                    subtext="most recent"
                />
            </div>

            {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <DataTable
                title="Donation History"
                columns={columns}
                rows={rows}
                loading={loading}
                empty={{
                    icon: HandCoins,
                    title: 'No donations yet',
                    message:
                        'Your donation history will appear here once you contribute to a campaign.',
                }}
            />
        </div>
    );
};

export default MyDonations;
