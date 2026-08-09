import React from 'react';
import { BarChart3, Users, Building2, HeartHandshake, Megaphone, HandCoins, UserCheck } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { mockAdminStats } from '@/data/mockAdmin';

const AdminReports = () => (
  <div className="space-y-6">
    <PageHeader
      title="Reports"
      subtitle="Platform-wide statistics and summary reports for Stand For People."
      action={
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] px-4 text-sm font-medium text-text-primary hover:bg-[#eef3f6] transition-colors">
          <BarChart3 className="h-4 w-4" /> Export Report
        </button>
      }
    />

    {/* Platform summary */}
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Users" value={mockAdminStats.totalUsers.toLocaleString()} icon={Users} trend={8} trendLabel="vs last month" />
      <StatCard label="Organizations" value={mockAdminStats.totalOrganizations} icon={Building2} iconColor="bg-blue-50" />
      <StatCard label="Help Requests" value={mockAdminStats.totalHelpRequests} icon={HeartHandshake} iconColor="bg-amber-50" />
      <StatCard label="Active Campaigns" value={mockAdminStats.activeCampaigns} icon={Megaphone} iconColor="bg-purple-50" />
    </div>

    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <StatCard label="Total Donations" value={`₱${mockAdminStats.totalDonations.toLocaleString()}`} icon={HandCoins} />
      <StatCard label="Total Volunteers" value={mockAdminStats.totalVolunteers.toLocaleString()} icon={UserCheck} iconColor="bg-emerald-50" />
      <StatCard label="Reports Generated" value={mockAdminStats.reportsGenerated} icon={BarChart3} iconColor="bg-blue-50" />
    </div>

    {/* Monthly breakdown */}
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary mb-5">This Month</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">New Users</p>
          <p className="text-2xl font-semibold text-text-primary">{mockAdminStats.newUsersThisMonth}</p>
        </div>
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Donations</p>
          <p className="text-2xl font-semibold text-text-primary">₱{mockAdminStats.donationsThisMonth.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-[#eef3f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280] mb-1">Active Volunteers</p>
          <p className="text-2xl font-semibold text-text-primary">{mockAdminStats.activeVolunteersThisMonth}</p>
        </div>
      </div>
    </div>

    <p className="text-sm text-[#6b7280]">
      Detailed downloadable reports, date filters, and chart breakdowns will be available after backend integration.
    </p>
  </div>
);

export default AdminReports;
