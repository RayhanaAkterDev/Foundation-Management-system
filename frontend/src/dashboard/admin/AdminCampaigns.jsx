import React from 'react';
import { Megaphone } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminCampaigns } from '@/data/mockAdmin';

const columns = [
  { key: 'title', header: 'Campaign' },
  { key: 'organization', header: 'Organization' },
  { key: 'startDate', header: 'Start' },
  { key: 'endDate', header: 'End' },
  {
    key: 'raised',
    header: 'Raised',
    align: 'right',
    render: (val) => `₱${val.toLocaleString()}`,
  },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
  {
    key: 'id',
    header: 'Actions',
    align: 'right',
    render: () => <button type="button" className="text-xs font-medium text-primary hover:underline">View</button>,
  },
];

const AdminCampaigns = () => (
  <div className="space-y-6">
    <PageHeader
      title="Campaigns"
      subtitle="All campaigns running on the Stand For People platform."
      action={
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
          <Megaphone className="h-4 w-4" /> New Campaign
        </button>
      }
    />
    <DataTable
      title="All Campaigns"
      columns={columns}
      rows={mockAdminCampaigns}
      empty={{ icon: Megaphone, title: 'No campaigns found', message: 'Platform campaigns will appear here.' }}
    />
  </div>
);

export default AdminCampaigns;
