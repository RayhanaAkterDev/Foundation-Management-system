import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HandCoins, Users, HeartHandshake, Megaphone } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
  mockIndividualUser,
  mockDonationSummary,
  mockVolunteerSummary,
  mockHelpRequestSummary,
  mockActiveCampaigns,
  mockIndividualActivity,
  mockHelpRequests,
} from '@/data/mockIndividual';

const IndividualDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Request Help', icon: HeartHandshake, onClick: () => navigate('/dashboard/individual/help-requests') },
    { label: 'Donate', icon: HandCoins, onClick: () => navigate('/dashboard/individual/donations') },
    { label: 'Volunteer', icon: Users, onClick: () => navigate('/dashboard/individual/volunteer') },
    { label: 'Browse Campaigns', icon: Megaphone, onClick: () => navigate('/dashboard/individual/campaigns') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
          Welcome back, {mockIndividualUser.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Here's a summary of your activities and the campaigns you support.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Donated"
          value={`₱${mockDonationSummary.totalDonated.toLocaleString()}`}
          icon={HandCoins}
          subtext={`${mockDonationSummary.donationCount} donations`}
        />
        <StatCard
          label="Volunteer Hours"
          value={mockVolunteerSummary.totalHours}
          icon={Users}
          iconColor="bg-blue-50"
          subtext={`${mockVolunteerSummary.activitiesCount} activities`}
        />
        <StatCard
          label="Help Requests"
          value={mockHelpRequestSummary.total}
          icon={HeartHandshake}
          iconColor="bg-amber-50"
          subtext={`${mockHelpRequestSummary.pending} pending`}
        />
        <StatCard
          label="Active Campaigns"
          value={mockActiveCampaigns.length}
          icon={Megaphone}
          iconColor="bg-purple-50"
          subtext="you're supporting"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Help Requests & Activity */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Help Requests */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">My Help Requests</h2>
            <button
              type="button"
              onClick={() => navigate('/dashboard/individual/help-requests')}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {mockHelpRequests.map((req) => (
              <li key={req.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{req.title}</p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">{req.category} · {req.submittedDate}</p>
                    {req.notes && (
                      <p className="mt-1 text-xs text-[#6b7280] italic">{req.notes}</p>
                    )}
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Feed */}
        <ActivityFeed items={mockIndividualActivity} />
      </div>

      {/* Active Campaigns */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Active Campaigns</h2>
          <button
            type="button"
            onClick={() => navigate('/dashboard/individual/campaigns')}
            className="text-xs font-medium text-primary hover:underline"
          >
            Browse all
          </button>
        </div>
        <div className="divide-y divide-[#e5e7eb]">
          {mockActiveCampaigns.map((c) => (
            <div key={c.id} className="px-5 py-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{c.title}</p>
                  <p className="text-xs text-[#6b7280]">{c.category} · Deadline: {c.deadline}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-text-primary">
                    ₱{c.raised.toLocaleString()} / ₱{c.goal.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#6b7280]">{c.progress}% funded</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eef3f6]">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(c.progress, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboard;
