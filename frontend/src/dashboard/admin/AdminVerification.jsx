import React from 'react';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminVerification } from '@/data/mockAdmin';

const columns = [
  { key: 'organization', header: 'Organization' },
  { key: 'type', header: 'Type' },
  { key: 'contactEmail', header: 'Contact' },
  { key: 'submittedDate', header: 'Submitted' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
  {
    key: 'id',
    header: 'Actions',
    align: 'right',
    render: () => (
      <div className="flex justify-end gap-3">
        <button type="button" className="text-xs font-medium text-emerald-600 hover:underline">Approve</button>
        <button type="button" className="text-xs font-medium text-red-500 hover:underline">Reject</button>
      </div>
    ),
  },
];

const AdminVerification = () => (
  <div className="space-y-6">
    <PageHeader
      title="Organization Verification"
      subtitle="Review and process pending organization verification requests."
    />
    <DataTable
      title="Verification Queue"
      columns={columns}
      rows={mockAdminVerification}
      empty={{ icon: ShieldCheck, title: 'No pending verifications', message: 'All verification requests have been processed.' }}
    />
  </div>
);

export default AdminVerification;
