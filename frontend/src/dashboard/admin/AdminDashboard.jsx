import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, HeartHandshake, Megaphone, HandCoins, UserCheck, ShieldCheck, BarChart3 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusBadge from '@/components/dashboard/StatusBadge';
import {
  mockAdminStats,
  mockAdminActivity,
  mockAdminVerification,
  mockAdminHelpRequests,
} from '@/data/mockAdmin';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Review Help Requests', icon: HeartHandshake, onClick: () => navigate('/dashboard/admin/help-requests') },
    { label: 'Verify Organizations', icon: ShieldCheck, onClick: () => navigate('/dashboard/admin/verification') },
    { label: 'Manage Campaigns', icon: Megaphone, onClick: () => navigate('/dashboard/admin/campaigns') },
    { label: 'Review Users', icon: Users, onClick: () => navigate('/dashboard/admin/users') },
  ];

  const pendingVerifications = mockAdminVerification.filter((v) => v.status === 'pending');
  const pendingRequests = mockAdminHelpRequests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">Platform-wide overview for Stand For People.</p>
      </div>

      {/* Stats row 1 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={mockAdminStats.totalUsers.toLocaleString()} icon={Users} subtext={`+${mockAdminStats.newUsersThisMonth} this month`} trend={8} />
        <StatCard label="Organizations" value={mockAdminStats.totalOrganizations} icon={Building2} iconColor="bg-blue-50" subtext={`${mockAdminStats.pendingVerification} pending verification`} />
        <StatCard label="Help Requests" value={mockAdminStats.totalHelpRequests} icon={HeartHandshake} iconColor="bg-amber-50" subtext={`${mockAdminStats.pendingHelpRequests} pending`} />
        <StatCard label="Active Campaigns" value={mockAdminStats.activeCampaigns} icon={Megaphone} iconColor="bg-purple-50" subtext="across all orgs" />
      </div>

      {/* Stats row 2 */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Donations" value={`₱${mockAdminStats.totalDonations.toLocaleString()}`} icon={HandCoins} />
        <StatCard label="Volunteers" value={mockAdminStats.totalVolunteers.toLocaleString()} icon={UserCheck} iconColor="bg-emerald-50" />
        <StatCard label="Reports Generated" value={mockAdminStats.reportsGenerated} icon={BarChart3} iconColor="bg-blue-50" />
      </div>

      <QuickActions actions={quickActions} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Pending Help Requests */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">
              Pending Help Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{pendingRequests.length}</span>
              )}
            </h2>
            <button type="button" onClick={() => navigate('/dashboard/admin/help-requests')} className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {pendingRequests.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{r.title}</p>
                  <p className="text-xs text-[#6b7280]">{r.requester} · {r.submittedDate}</p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>

        {/* Pending Verifications */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
            <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">
              Verification Queue
              {pendingVerifications.length > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{pendingVerifications.length}</span>
              )}
            </h2>
            <button type="button" onClick={() => navigate('/dashboard/admin/verification')} className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
          <ul className="divide-y divide-[#e5e7eb]">
            {pendingVerifications.slice(0, 5).map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{v.organization}</p>
                  <p className="text-xs text-[#6b7280]">{v.type} · Submitted {v.submittedDate}</p>
                </div>
                <StatusBadge status={v.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ActivityFeed items={mockAdminActivity} title="Platform Activity" />
    </div>
  );
};

export default AdminDashboard;
