import React from 'react';
import { HandCoins } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockDonations, mockDonationSummary } from '@/data/mockIndividual';

const columns = [
  { key: 'campaign', header: 'Campaign' },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (val) => <span className="font-medium text-text-primary">₱{val.toLocaleString()}</span>,
  },
  { key: 'date', header: 'Date' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => <StatusBadge status={val} />,
  },
];

const MyDonations = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Donations"
        subtitle="A record of all your contributions to campaigns and causes."
        action={
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <HandCoins className="h-4 w-4" />
            Donate Now
          </button>
        }
      />

      {/* Summary stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard
          label="Total Donated"
          value={`₱${mockDonationSummary.totalDonated.toLocaleString()}`}
          icon={HandCoins}
          subtext="all time"
        />
        <StatCard
          label="Donations Made"
          value={mockDonationSummary.donationCount}
          icon={HandCoins}
          iconColor="bg-blue-50"
          subtext="total transactions"
        />
        <StatCard
          label="Last Donation"
          value={mockDonationSummary.lastDonation}
          icon={HandCoins}
          iconColor="bg-amber-50"
          subtext="most recent"
        />
      </div>

      <DataTable
        title="Donation History"
        columns={columns}
        rows={mockDonations}
        empty={{
          icon: HandCoins,
          title: 'No donations yet',
          message: 'Your donation history will appear here once you contribute to a campaign.',
        }}
      />
    </div>
  );
};

export default MyDonations;
