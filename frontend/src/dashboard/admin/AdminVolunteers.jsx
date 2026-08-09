import React from 'react';
import { UserCheck } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockAdminVolunteers, mockAdminStats } from '@/data/mockAdmin';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'activity', header: 'Activity' },
  { key: 'organization', header: 'Organization', render: (val) => val || <span className="text-[#6b7280]">Independent</span> },
  { key: 'hours', header: 'Hours', align: 'center' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
];

const AdminVolunteers = () => (
  <div className="space-y-6">
    <PageHeader
      title="Volunteers"
      subtitle="All volunteer activity across the platform."
    />
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <StatCard label="Total Volunteers" value={mockAdminStats.totalVolunteers.toLocaleString()} icon={UserCheck} />
      <StatCard label="Active This Month" value={mockAdminStats.activeVolunteersThisMonth} icon={UserCheck} iconColor="bg-blue-50" />
      <StatCard label="Total Hours" value={mockAdminStats.totalVolunteerHours.toLocaleString()} icon={UserCheck} iconColor="bg-emerald-50" />
    </div>
    <DataTable
      title="Volunteer Records"
      columns={columns}
      rows={mockAdminVolunteers}
      empty={{ icon: UserCheck, title: 'No volunteers found', message: 'Volunteer records will appear here.' }}
    />
  </div>
);

export default AdminVolunteers;
