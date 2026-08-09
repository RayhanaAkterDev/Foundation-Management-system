import React from 'react';
import { BarChart3, Users, HeartHandshake, Megaphone, Globe } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { mockOrgImpact, mockOrgCampaignSummary, mockOrgVolunteerSummary } from '@/data/mockOrganization';

const OrgReports = () => (
  <div className="space-y-6">
    <PageHeader
      title="Reports & Impact"
      subtitle="Overview of your organization's reach, outcomes, and contributions."
    />

    {/* Impact Summary */}
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Beneficiaries" value={mockOrgImpact.totalBeneficiaries.toLocaleString()} icon={HeartHandshake} />
      <StatCard label="Campaigns Run" value={mockOrgImpact.totalCampaigns} icon={Megaphone} iconColor="bg-blue-50" />
      <StatCard label="Volunteer Hours" value={mockOrgImpact.totalVolunteerHours.toLocaleString()} icon={Users} iconColor="bg-amber-50" />
      <StatCard label="Communities Reached" value={mockOrgImpact.communitiesReached} icon={Globe} iconColor="bg-purple-50" />
    </div>

    {/* Campaign breakdown */}
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary mb-5">Campaign Performance</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Active Campaigns</p>
          <p className="text-2xl font-semibold text-text-primary">{mockOrgCampaignSummary.active}</p>
        </div>
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Completed Campaigns</p>
          <p className="text-2xl font-semibold text-text-primary">{mockOrgCampaignSummary.completed}</p>
        </div>
      </div>
    </div>

    {/* Volunteer summary */}
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary mb-5">Volunteer Engagement</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Total Volunteers</p>
          <p className="text-2xl font-semibold text-text-primary">{mockOrgVolunteerSummary.total}</p>
        </div>
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Hours This Month</p>
          <p className="text-2xl font-semibold text-text-primary">{mockOrgVolunteerSummary.hoursThisMonth}</p>
        </div>
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Upcoming Activities</p>
          <p className="text-2xl font-semibold text-text-primary">{mockOrgVolunteerSummary.upcoming}</p>
        </div>
      </div>
    </div>

    <p className="text-sm text-[#6b7280]">
      Detailed downloadable reports will be available when the backend is integrated.
    </p>
  </div>
);

export default OrgReports;
