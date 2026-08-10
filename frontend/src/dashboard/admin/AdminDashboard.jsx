import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Building2,
    HeartHandshake,
    Megaphone,
    HandCoins,
    UserCheck,
    BarChart3,
    ShieldCheck,
} from 'lucide-react';

import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusBadge from '@/components/dashboard/StatusBadge';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/dashboard',
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to load admin dashboard.',
                    );
                }

                setDashboardData(data);
            } catch (err) {
                setError(
                    err.message ||
                        'Something went wrong while loading the dashboard.',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const quickActions = [
        {
            label: 'Review Help Requests',
            icon: HeartHandshake,
            onClick: () => navigate('/dashboard/admin/help-requests'),
        },
        {
            label: 'Verify Organizations',
            icon: ShieldCheck,
            onClick: () => navigate('/dashboard/admin/verification'),
        },
        {
            label: 'Manage Campaigns',
            icon: Megaphone,
            onClick: () => navigate('/dashboard/admin/campaigns'),
        },
        {
            label: 'Review Users',
            icon: Users,
            onClick: () => navigate('/dashboard/admin/users'),
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <p className="text-sm text-text-secondary">
                    Loading admin dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="text-sm font-semibold text-red-700">
                    Unable to load dashboard
                </h2>

                <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
        );
    }

    const stats = dashboardData?.stats || {};

    const pendingRequests = dashboardData?.pendingHelpRequests || [];

    const pendingVerifications = dashboardData?.pendingVerifications || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-fraunces text-2xl font-semibold text-text-primary">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-text-secondary">
                    Platform-wide overview for Stand For People.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Users"
                    value={(stats.totalUsers || 0).toLocaleString()}
                    icon={Users}
                />

                <StatCard
                    label="Organizations"
                    value={stats.totalOrganizations || 0}
                    icon={Building2}
                    iconColor="bg-blue-50"
                    subtext={`${stats.pendingVerification || 0} pending verification`}
                />

                <StatCard
                    label="Help Requests"
                    value={stats.totalHelpRequests || 0}
                    icon={HeartHandshake}
                    iconColor="bg-amber-50"
                    subtext={`${stats.pendingHelpRequests || 0} pending`}
                />

                <StatCard
                    label="Active Campaigns"
                    value={stats.activeCampaigns || 0}
                    icon={Megaphone}
                    iconColor="bg-purple-50"
                    subtext="across all organizations"
                />
            </div>

            {/* Second stats row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Total Donations"
                    value={`৳${Number(
                        stats.totalDonations || 0,
                    ).toLocaleString()}`}
                    icon={HandCoins}
                />

                <StatCard
                    label="Volunteers"
                    value={(stats.totalVolunteers || 0).toLocaleString()}
                    icon={UserCheck}
                    iconColor="bg-emerald-50"
                />

                <StatCard
                    label="Reports Generated"
                    value={stats.reportsGenerated || 0}
                    icon={BarChart3}
                    iconColor="bg-blue-50"
                />
            </div>

            {/* Quick Actions */}
            <QuickActions actions={quickActions} />

            {/* Pending sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Help Requests */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
                        <h2 className="font-fraunces text-base font-semibold text-text-primary">
                            Pending Help Requests
                            {pendingRequests.length > 0 && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/dashboard/admin/help-requests')
                            }
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            View all
                        </button>
                    </div>

                    <ul className="divide-y divide-[#e5e7eb]">
                        {pendingRequests.length === 0 ? (
                            <li className="px-5 py-6 text-sm text-text-secondary">
                                No pending help requests.
                            </li>
                        ) : (
                            pendingRequests.map((request) => (
                                <li
                                    key={request.id}
                                    className="flex items-center justify-between gap-3 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-text-primary">
                                            {request.title}
                                        </p>

                                        <p className="text-xs text-text-secondary">
                                            {request.category} ·{' '}
                                            {request.district}
                                        </p>
                                    </div>

                                    <StatusBadge status={request.status} />
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Verification Queue */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
                        <h2 className="font-fraunces text-base font-semibold text-text-primary">
                            Verification Queue
                            {pendingVerifications.length > 0 && (
                                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    {pendingVerifications.length}
                                </span>
                            )}
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/dashboard/admin/verification')
                            }
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            View all
                        </button>
                    </div>

                    <ul className="divide-y divide-[#e5e7eb]">
                        {pendingVerifications.length === 0 ? (
                            <li className="px-5 py-6 text-sm text-text-secondary">
                                No pending organizations.
                            </li>
                        ) : (
                            pendingVerifications.map((organization) => (
                                <li
                                    key={organization.id}
                                    className="flex items-center justify-between gap-3 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-text-primary">
                                            {organization.name}
                                        </p>

                                        <p className="text-xs text-text-secondary">
                                            {organization.organization_type ||
                                                'Organization'}
                                        </p>
                                    </div>

                                    <StatusBadge
                                        status={
                                            organization.verification_status
                                        }
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {/* Activity */}
            <ActivityFeed
                items={dashboardData?.recentActivity || []}
                title="Platform Activity"
            />
        </div>
    );
};

export default AdminDashboard;
