import React from 'react';
import { HandCoins } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminDonations, mockAdminStats } from '@/data/mockAdmin';

const columns = [
  { key: 'donor', header: 'Donor' },
  { key: 'campaign', header: 'Campaign' },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (val) => <span className="font-medium">₱{val.toLocaleString()}</span>,
  },
  { key: 'date', header: 'Date' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
];

const AdminDonations = () => (
  <div className="space-y-6">
    <PageHeader
      title="Donations"
      subtitle="All donations made through the Stand For People platform."
    />
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <StatCard label="Total Donations" value={`₱${mockAdminStats.totalDonations.toLocaleString()}`} icon={HandCoins} />
      <StatCard label="This Month" value={`₱${mockAdminStats.donationsThisMonth.toLocaleString()}`} icon={HandCoins} iconColor="bg-blue-50" trend={12} trendLabel="vs last month" />
      <StatCard label="Donors" value={mockAdminStats.totalDonors.toLocaleString()} icon={HandCoins} iconColor="bg-amber-50" />
    </div>
    <DataTable
      title="Donation Transactions"
      columns={columns}
      rows={mockAdminDonations}
      empty={{ icon: HandCoins, title: 'No donations yet', message: 'Donation transactions will appear here.' }}
    />
  </div>
);

export default AdminDonations;
