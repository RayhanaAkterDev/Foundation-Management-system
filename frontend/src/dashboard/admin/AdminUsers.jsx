import React from 'react';
import { Users } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminUsers } from '@/data/mockAdmin';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', render: (val) => <span className="capitalize">{val}</span> },
  { key: 'joinedDate', header: 'Joined' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
  {
    key: 'id',
    header: 'Actions',
    align: 'right',
    // eslint-disable-next-line no-unused-vars
    render: (_, row) => (
      <button type="button" className="text-xs font-medium text-primary hover:underline">
        View
      </button>
    ),
  },
];

const AdminUsers = () => (
  <div className="space-y-6">
    <PageHeader
      title="Users"
      subtitle="All registered users on the Stand For People platform."
      action={
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors">
          Export CSV
        </button>
      }
    />
    <DataTable
      title="All Users"
      columns={columns}
      rows={mockAdminUsers}
      empty={{ icon: Users, title: 'No users found', message: 'Users will appear here after registration.' }}
    />
  </div>
);

export default AdminUsers;
