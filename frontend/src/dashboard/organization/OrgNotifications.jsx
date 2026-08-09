import React from 'react';
import { Bell } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import EmptyState from '@/components/dashboard/EmptyState';

const mockOrgNotifications = [
  { id: 'n1', title: 'New help request assigned', body: 'Your organization has been assigned: "Medical Assistance — Senior Citizens".', time: '7 days ago', read: false },
  { id: 'n2', title: 'Campaign milestone reached', body: '"Back to School Drive 2025" has reached 72% of its fundraising goal.', time: '1 day ago', read: false },
  { id: 'n3', title: 'Volunteer joined', body: '3 new volunteers joined your Livelihood Training team.', time: '3 days ago', read: true },
];

const OrgNotifications = () => (
  <div className="space-y-6">
    <PageHeader title="Notifications" subtitle="Updates about your campaigns, responses, and volunteers." />
    {mockOrgNotifications.length === 0 ? (
      <EmptyState icon={Bell} title="No notifications" message="You're all caught up." />
    ) : (
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <ul className="divide-y divide-[#e5e7eb]">
          {mockOrgNotifications.map((n) => (
            <li key={n.id} className={`flex items-start gap-4 px-5 py-4 ${!n.read ? 'bg-primary/3' : ''}`}>
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${!n.read ? 'bg-primary/10 text-primary' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${!n.read ? 'text-text-primary' : 'text-[#6b7280]'}`}>{n.title}</p>
                <p className="mt-0.5 text-sm text-[#6b7280]">{n.body}</p>
                <p className="mt-1 text-xs text-[#6b7280]">{n.time}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default OrgNotifications;
