import React from 'react';
import { Building2 } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminOrganizations } from '@/data/mockAdmin';

const columns = [
  { key: 'name', header: 'Organization' },
  { key: 'type', header: 'Type' },
  { key: 'contactEmail', header: 'Contact' },
  { key: 'registeredDate', header: 'Registered' },
  { key: 'verificationStatus', header: 'Verification', render: (val) => <StatusBadge status={val} /> },
  {
    key: 'id',
    header: 'Actions',
    align: 'right',
    render: () => (
      <div className="flex justify-end gap-3">
        <button type="button" className="text-xs font-medium text-primary hover:underline">View</button>
      </div>
    ),
  },
];

const AdminOrganizations = () => (
  <div className="space-y-6">
    <PageHeader
      title="Organizations"
      subtitle="All organizations registered on the Stand For People platform."
      action={
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors">
          Export CSV
        </button>
      }
    />
    <DataTable
      title="All Organizations"
      columns={columns}
      rows={mockAdminOrganizations}
      empty={{ icon: Building2, title: 'No organizations found', message: 'Organizations will appear here after registration.' }}
    />
  </div>
);

export default AdminOrganizations;
