import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    Users,
    Building2,
    HeartHandshake,
    Megaphone,
    HandCoins,
    UserCheck,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';

const AdminReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(
                    'http://127.0.0.1:8000/api/admin/reports',
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load reports.');
                }

                setStats(data.stats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Reports"
                    subtitle="Platform statistics and activity reports."
                />

                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Loading reports...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Reports"
                    subtitle="Platform statistics and activity reports."
                />

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Reports"
                subtitle="Platform statistics and activity reports."
            />

            {/* Platform Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Users"
                    value={Number(stats.totalUsers).toLocaleString()}
                    icon={Users}
                />

                <StatCard
                    label="Organizations"
                    value={Number(stats.totalOrganizations).toLocaleString()}
                    icon={Building2}
                    iconColor="bg-blue-50"
                />

                <StatCard
                    label="Help Requests"
                    value={Number(stats.totalHelpRequests).toLocaleString()}
                    icon={HeartHandshake}
                    iconColor="bg-amber-50"
                />

                <StatCard
                    label="Active Campaigns"
                    value={Number(stats.activeCampaigns).toLocaleString()}
                    icon={Megaphone}
                    iconColor="bg-purple-50"
                />
            </div>

            {/* Additional Statistics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                    label="Total Donations"
                    value={`৳${Number(stats.totalDonations).toLocaleString()}`}
                    icon={HandCoins}
                />

                <StatCard
                    label="Total Volunteers"
                    value={Number(stats.totalVolunteers).toLocaleString()}
                    icon={UserCheck}
                    iconColor="bg-emerald-50"
                />

                <StatCard
                    label="Reports Generated"
                    value={Number(stats.reportsGenerated).toLocaleString()}
                    icon={BarChart3}
                    iconColor="bg-blue-50"
                />
            </div>

            {/* Current Status */}
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <h2 className="mb-5 font-['Fraunces'] text-base font-semibold text-text-primary">
                    Current Platform Status
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-[#eef3f6] p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                            Pending Verifications
                        </p>

                        <p className="text-2xl font-semibold text-text-primary">
                            {Number(stats.pendingVerification).toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#eef3f6] p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                            Pending Help Requests
                        </p>

                        <p className="text-2xl font-semibold text-text-primary">
                            {Number(stats.pendingHelpRequests).toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#eef3f6] p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                            Completed Donations
                        </p>

                        <p className="text-2xl font-semibold text-text-primary">
                            ৳{Number(stats.totalDonations).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-[#6b7280]">
                These statistics are retrieved directly from the platform
                database.
            </p>
        </div>
    );
};

export default AdminReports;
