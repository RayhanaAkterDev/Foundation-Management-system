import React from 'react';
import { Bell } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import EmptyState from '@/components/dashboard/EmptyState';

// Mock notifications — replace with API data later
const mockNotifications = [
  { id: 'n1', title: 'Help request approved', body: 'Your request "School Supplies for 3 Children" has been approved.', time: '2 days ago', read: false },
  { id: 'n2', title: 'Volunteer activity reminder', body: 'Food Packing Drive is scheduled for Aug 15. Don\'t forget to attend!', time: '5 days ago', read: false },
  { id: 'n3', title: 'Campaign update', body: 'Back to School Drive 2025 has reached 72% of its goal.', time: '1 week ago', read: true },
];

const IndividualNotifications = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay up to date with your activities and platform updates."
      />

      {mockNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          message="You're all caught up. New notifications will appear here."
        />
      ) : (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <ul className="divide-y divide-[#e5e7eb]">
            {mockNotifications.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.read ? 'bg-primary/3' : ''}`}
              >
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${!n.read ? 'bg-primary/10 text-primary' : 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${!n.read ? 'text-text-primary' : 'text-[#6b7280]'}`}>{n.title}</p>
                  <p className="mt-0.5 text-sm text-[#6b7280]">{n.body}</p>
                  <p className="mt-1 text-xs text-[#6b7280]">{n.time}</p>
                </div>
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IndividualNotifications;
