import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Users, HeartHandshake, BarChart3, ShieldCheck, AlertCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
  mockOrganization,
  mockOrgCampaignSummary,
  mockOrgVolunteerSummary,
  mockOrgImpact,
  mockOrgCampaigns,
  mockOrgResponses,
  mockOrgActivity,
} from '@/data/mockOrganization';

const OrgDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Manage Campaigns', icon: Megaphone, onClick: () => navigate('/dashboard/organization/campaigns') },
    { label: 'Organization Profile', icon: ShieldCheck, onClick: () => navigate('/dashboard/organization/profile') },
    { label: 'View Responses', icon: HeartHandshake, onClick: () => navigate('/dashboard/organization/responses') },
    { label: 'View Reports', icon: BarChart3, onClick: () => navigate('/dashboard/organization/reports') },
  ];

  const activeCampaigns = mockOrgCampaigns.filter((c) => c.status === 'active');
  const pendingResponses = mockOrgResponses.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
            Welcome, {mockOrganization.name}
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Here's an overview of your organization's campaigns, volunteers, and impact.
          </p>
        </div>
        {/* Verification badge */}
        <div className="shrink-0">
          {mockOrganization.verificationStatus === 'verified' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Organization
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              <AlertCircle className="h-3.5 w-3.5" /> Verification Pending
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Campaigns" value={mockOrgCampaignSummary.active} icon={Megaphone} subtext={`${mockOrgCampaignSummary.completed} completed`} />
        <StatCard label="Volunteers" value={mockOrgVolunteerSummary.total} icon={Users} iconColor="bg-blue-50" subtext={`${mockOrgVolunteerSummary.hoursThisMonth} hrs this month`} />
        <StatCard label="Beneficiaries" value={mockOrgImpact.totalBeneficiaries.toLocaleString()} icon={HeartHandshake} iconColor="bg-amber-50" subtext="total reached" />
        <StatCard label="Communities" value={mockOrgImpact.communitiesReached} icon={BarChart3} iconColor="bg-purple-50" subtext="reached" />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Active Campaigns */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">Active Campaigns</h2>
            <button type="button" onClick={() => navigate('/dashboard/organization/campaigns')} className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {activeCampaigns.map((c) => (
              <li key={c.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">{c.title}</p>
                    <p className="text-xs text-[#6b7280]">{c.beneficiaries} beneficiaries · Deadline {c.deadline}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#eef3f6]">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(Math.round((c.spent / c.budget) * 100), 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Feed */}
        <ActivityFeed items={mockOrgActivity} />
      </div>

      {/* Pending Responses */}
      {pendingResponses.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <h2 className="font-['Fraunces'] text-base font-semibold text-amber-800">Pending Responses ({pendingResponses.length})</h2>
          </div>
          <ul className="space-y-2">
            {pendingResponses.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-amber-100">
                <p className="text-sm text-text-primary">{r.helpRequest}</p>
                <button type="button" onClick={() => navigate('/dashboard/organization/responses')} className="text-xs font-medium text-primary hover:underline shrink-0">Review</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;
