import React from 'react';
import { Users } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockOrgVolunteers, mockOrgVolunteerSummary } from '@/data/mockOrganization';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'hours', header: 'Hours', align: 'center' },
  { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
];

const OrgVolunteers = () => (
  <div className="space-y-6">
    <PageHeader
      title="Volunteers"
      subtitle="Manage volunteers supporting your organization's campaigns."
      action={
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
          <Users className="h-4 w-4" /> Invite Volunteer
        </button>
      }
    />
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <StatCard label="Total Volunteers" value={mockOrgVolunteerSummary.total} icon={Users} />
      <StatCard label="Hours This Month" value={mockOrgVolunteerSummary.hoursThisMonth} icon={Users} iconColor="bg-blue-50" />
      <StatCard label="Upcoming Activities" value={mockOrgVolunteerSummary.upcoming} icon={Users} iconColor="bg-amber-50" />
    </div>
    <DataTable
      title="Volunteer Roster"
      columns={columns}
      rows={mockOrgVolunteers}
      empty={{ icon: Users, title: 'No volunteers yet', message: 'Invite volunteers to support your campaigns and programs.' }}
    />
  </div>
);

export default OrgVolunteers;
