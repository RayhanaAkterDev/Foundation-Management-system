import React from 'react';
import { Megaphone } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockOrgCampaigns } from '@/data/mockOrganization';

const columns = [
  { key: 'title', header: 'Campaign' },
  { key: 'beneficiaries', header: 'Beneficiaries', align: 'center' },
  {
    key: 'budget',
    header: 'Budget',
    align: 'right',
    render: (val) => `₱${val.toLocaleString()}`,
  },
  {
    key: 'spent',
    header: 'Spent',
    align: 'right',
    render: (val) => `₱${val.toLocaleString()}`,
  },
  { key: 'deadline', header: 'Deadline' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
];

const OrgCampaigns = () => (
  <div className="space-y-6">
    <PageHeader
      title="Campaigns"
      subtitle="Manage your organization's active and completed campaigns."
      action={
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
          <Megaphone className="h-4 w-4" /> New Campaign
        </button>
      }
    />
    <DataTable
      title="All Campaigns"
      columns={columns}
      rows={mockOrgCampaigns}
      empty={{ icon: Megaphone, title: 'No campaigns yet', message: 'Create your first campaign to start coordinating support.' }}
    />
  </div>
);

export default OrgCampaigns;
