import React from 'react';
import { HeartHandshake } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockOrgResponses } from '@/data/mockOrganization';

const columns = [
  { key: 'helpRequest', header: 'Help Request' },
  { key: 'assignedDate', header: 'Assigned Date' },
  { key: 'lead', header: 'Team Lead', render: (val) => val || <span className="text-[#6b7280]">Unassigned</span> },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
];

const OrgResponses = () => (
  <div className="space-y-6">
    <PageHeader
      title="Assistance & Responses"
      subtitle="Help requests your organization has been assigned to respond to."
    />
    <DataTable
      title="Assigned Responses"
      columns={columns}
      rows={mockOrgResponses}
      empty={{ icon: HeartHandshake, title: 'No responses yet', message: 'SP Admin will assign help requests to your organization based on your focus areas.' }}
    />
  </div>
);

export default OrgResponses;
