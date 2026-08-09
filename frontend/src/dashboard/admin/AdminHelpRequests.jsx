import React from 'react';
import { HeartHandshake } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminHelpRequests } from '@/data/mockAdmin';

const columns = [
  { key: 'title', header: 'Request' },
  { key: 'requester', header: 'Requester' },
  { key: 'category', header: 'Category' },
  { key: 'submittedDate', header: 'Submitted' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
  {
    key: 'id',
    header: 'Actions',
    align: 'right',
    render: () => (
      <div className="flex justify-end gap-3">
        <button type="button" className="text-xs font-medium text-primary hover:underline">Review</button>
      </div>
    ),
  },
];

const AdminHelpRequests = () => (
  <div className="space-y-6">
    <PageHeader
      title="Help Requests"
      subtitle="All help requests submitted by individuals and communities."
    />
    <DataTable
      title="All Help Requests"
      columns={columns}
      rows={mockAdminHelpRequests}
      empty={{ icon: HeartHandshake, title: 'No help requests found', message: 'Help requests will appear here when submitted.' }}
    />
  </div>
);

export default AdminHelpRequests;
