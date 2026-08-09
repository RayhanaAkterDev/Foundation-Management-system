import React from 'react';
import { Users } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { mockVolunteerActivities, mockVolunteerSummary } from '@/data/mockIndividual';

const columns = [
  { key: 'activity', header: 'Activity' },
  { key: 'date',     header: 'Date' },
  { key: 'location', header: 'Location' },
  {
    key: 'hours',
    header: 'Hours',
    align: 'center',
    render: (val) => <span>{val != null ? val : '—'}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (val) => <StatusBadge status={val} />,
  },
];

const MyVolunteerActivities = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Activities"
        subtitle="Your volunteer history and upcoming engagements."
        action={
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            <Users className="h-4 w-4" />
            Find Opportunities
          </button>
        }
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard
          label="Total Hours"
          value={mockVolunteerSummary.totalHours}
          icon={Users}
          subtext="hours volunteered"
        />
        <StatCard
          label="Activities"
          value={mockVolunteerSummary.activitiesCount}
          icon={Users}
          iconColor="bg-blue-50"
          subtext="completed"
        />
        <StatCard
          label="Next Activity"
          value={mockVolunteerSummary.nextActivity}
          icon={Users}
          iconColor="bg-amber-50"
          subtext="upcoming"
        />
      </div>

      <DataTable
        title="Activity Log"
        columns={columns}
        rows={mockVolunteerActivities}
        empty={{
          icon: Users,
          title: 'No volunteer activities yet',
          message: 'Browse campaigns to find volunteer opportunities near you.',
        }}
      />
    </div>
  );
};

export default MyVolunteerActivities;
