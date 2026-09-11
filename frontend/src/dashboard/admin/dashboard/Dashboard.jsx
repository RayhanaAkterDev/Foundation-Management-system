import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AlertCircle } from 'lucide-react';

import DashboardHero from './sections/DashboardHero';
import AttentionSection from './sections/AttentionSection';
import ResponseFlowSection from './sections/ResponseFlowSection';
import NetworkSection from './sections/NetworkSection';
import AdministrationSection from './sections/AdministrationSection';
import ActivitySection from './sections/ActivitySection';

import { getRequestUrgency } from './utils/dashboardHelpers';

const API_BASE = 'https://stand-for-people-api.onrender.com/api';

// ============================================================
// RESPONSE HELPERS
// ============================================================

const getPayload = (result) => {
    return result?.data ?? result ?? {};
};

const getCollection = (result, keys = []) => {
    const payload = getPayload(result);

    if (Array.isArray(payload)) {
        return payload;
    }

    for (const key of keys) {
        if (Array.isArray(payload?.[key])) {
            return payload[key];
        }
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.items)) {
        return payload.items;
    }

    return [];
};

const getCollectionTotal = (result, fallback = 0) => {
    const payload = getPayload(result);

    const total =
        payload?.total ??
        payload?.meta?.total ??
        payload?.pagination?.total ??
        payload?.data?.total;

    if (typeof total === 'number') {
        return total;
    }

    return fallback;
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        stats: {},

        pendingHelpRequests: [],
        pendingVerifications: [],
        latestCampaigns: [],
        recentActivity: [],

        totalUsers: 0,
        totalIndividualUsers: 0,
        totalOrganizations: 0,
        totalVolunteers: 0,
        totalHelpRequests: 0,

        totalCampaigns: 0,
        pendingCampaigns: 0,
        activeCampaigns: 0,

        totalDonations: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError('');

                const token =
                    localStorage.getItem('auth_token') ||
                    sessionStorage.getItem('auth_token');

                const headers = {
                    Accept: 'application/json',
                    ...(token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {}),
                };

                // ==================================================
                // FETCH
                // ==================================================

                const [
                    dashboardResponse,
                    usersResponse,
                    organizationsResponse,
                    volunteersResponse,
                    helpRequestsResponse,
                    campaignsResponse,
                ] = await Promise.all([
                    fetch(`${API_BASE}/admin/dashboard`, {
                        headers,
                    }),

                    fetch(`${API_BASE}/admin/users`, {
                        headers,
                    }),

                    fetch(`${API_BASE}/admin/organizations`, {
                        headers,
                    }),

                    fetch(`${API_BASE}/admin/volunteers`, {
                        headers,
                    }),

                    fetch(`${API_BASE}/admin/help-requests`, {
                        headers,
                    }),

                    fetch(`${API_BASE}/admin/campaigns`, {
                        headers,
                    }),
                ]);

                if (!dashboardResponse.ok) {
                    throw new Error('Unable to load dashboard data.');
                }

                if (!usersResponse.ok) {
                    throw new Error('Unable to load user data.');
                }

                if (!organizationsResponse.ok) {
                    throw new Error('Unable to load organization data.');
                }

                if (!volunteersResponse.ok) {
                    throw new Error('Unable to load volunteer data.');
                }

                if (!helpRequestsResponse.ok) {
                    throw new Error('Unable to load help request data.');
                }

                if (!campaignsResponse.ok) {
                    throw new Error('Unable to load campaign data.');
                }

                // ==================================================
                // PARSE
                // ==================================================

                const [
                    dashboardResult,
                    usersResult,
                    organizationsResult,
                    volunteersResult,
                    helpRequestsResult,
                    campaignsResult,
                ] = await Promise.all([
                    dashboardResponse.json(),
                    usersResponse.json(),
                    organizationsResponse.json(),
                    volunteersResponse.json(),
                    helpRequestsResponse.json(),
                    campaignsResponse.json(),
                ]);

                const dashboard = getPayload(dashboardResult);

                // ==================================================
                // USERS
                // ==================================================

                const users = getCollection(usersResult, ['users']);

                const totalUsers = getCollectionTotal(
                    usersResult,
                    dashboard?.stats?.totalUsers ?? users.length,
                );

                const totalIndividualUsers = users.filter(
                    (user) => user?.role === 'individual',
                ).length;

                // ==================================================
                // ORGANIZATIONS
                // ==================================================

                const organizations = getCollection(organizationsResult, [
                    'organizations',
                ]);

                const totalOrganizations = getCollectionTotal(
                    organizationsResult,
                    organizations.length,
                );

                // ==================================================
                // VOLUNTEERS
                // ==================================================

                const volunteers = getCollection(volunteersResult, [
                    'volunteers',
                ]);

                const totalVolunteers = getCollectionTotal(
                    volunteersResult,
                    dashboard?.stats?.totalVolunteers ?? volunteers.length,
                );

                // ==================================================
                // HELP REQUESTS
                // ==================================================

                const helpRequests = getCollection(helpRequestsResult, [
                    'helpRequests',
                    'help_requests',
                    'requests',
                ]);

                const totalHelpRequests = getCollectionTotal(
                    helpRequestsResult,
                    helpRequests.length,
                );

                // ==================================================
                // CAMPAIGNS
                // ==================================================

                const campaigns = getCollection(campaignsResult, ['campaigns']);

                const totalCampaigns = getCollectionTotal(
                    campaignsResult,
                    campaigns.length,
                );

                const unverifiedCampaigns = campaigns.filter(
                    (campaign) => campaign?.status === 'unverified',
                );

                const activeCampaigns = campaigns.filter(
                    (campaign) => campaign?.status === 'active',
                ).length;

                const pendingCampaignCount = unverifiedCampaigns.length;

                // ==================================================
                // DASHBOARD LIST DATA
                // ==================================================

                const pendingHelpRequests =
                    dashboard?.pendingHelpRequests ??
                    dashboard?.pending_help_requests ??
                    dashboard?.pendingRequests ??
                    [];

                const pendingVerifications =
                    dashboard?.pendingVerifications ??
                    dashboard?.pending_verifications ??
                    [];

                const recentActivity =
                    dashboard?.recentActivity ??
                    dashboard?.recent_activity ??
                    [];

                // ==================================================
                // DONATIONS
                // ==================================================

                const totalDonations =
                    dashboard?.stats?.totalDonations ??
                    dashboard?.stats?.totalDonationAmount ??
                    dashboard?.stats?.donations ??
                    0;

                // ==================================================
                // STORE
                // ==================================================

                if (mounted) {
                    setDashboardData({
                        stats: {
                            ...(dashboard?.stats || {}),

                            totalUsers,
                            totalIndividualUsers,
                            totalOrganizations,
                            totalVolunteers,
                            totalHelpRequests,

                            totalCampaigns,
                            pendingCampaigns: pendingCampaignCount,
                            activeCampaigns,

                            totalDonations,
                        },

                        pendingHelpRequests,

                        pendingVerifications,

                        latestCampaigns: unverifiedCampaigns,

                        recentActivity,

                        totalUsers,
                        totalIndividualUsers,
                        totalOrganizations,
                        totalVolunteers,
                        totalHelpRequests,

                        totalCampaigns,
                        pendingCampaigns: pendingCampaignCount,
                        activeCampaigns,

                        totalDonations,
                    });
                }
            } catch (err) {
                if (mounted) {
                    setError(err?.message || 'Unable to load dashboard data.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboard();

        return () => {
            mounted = false;
        };
    }, []);

    // ============================================================
    // DATA
    // ============================================================

    const {
        stats,

        pendingHelpRequests,
        pendingVerifications,
        latestCampaigns,
        recentActivity,

        totalUsers,
        totalIndividualUsers,
        totalOrganizations,
        totalVolunteers,
        totalHelpRequests,

        totalCampaigns,
        pendingCampaigns,
        activeCampaigns,

        totalDonations,
    } = dashboardData;

    // ============================================================
    // PENDING COUNTS
    // ============================================================

    const pendingRequestCount =
        stats?.pendingRequests ??
        stats?.pendingHelpRequests ??
        pendingHelpRequests.length;

    const pendingVerificationCount =
        stats?.pendingVerifications ?? pendingVerifications.length;

    const pendingCampaignCount = pendingCampaigns;

    // ============================================================
    // URGENT REQUESTS
    // ============================================================

    const urgentRequests = useMemo(
        () =>
            pendingHelpRequests.filter((request) =>
                ['critical', 'urgent', 'high'].includes(
                    getRequestUrgency(request),
                ),
            ),
        [pendingHelpRequests],
    );

    // ============================================================
    // TOTAL PENDING
    // ============================================================

    const totalPending =
        Number(pendingRequestCount) +
        Number(pendingVerificationCount) +
        Number(pendingCampaignCount);

    // ============================================================
    // NAVIGATION
    // ============================================================

    const navigateTo = (path) => {
        navigate(path);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <>
            <DashboardHero
                loading={loading}
                totalPending={totalPending}
                urgentRequestCount={urgentRequests.length}
                pendingVerificationCount={pendingVerificationCount}
                pendingCampaignCount={pendingCampaignCount}
                pendingVolunteerCount={
                    stats?.pendingVolunteers ??
                    stats?.pendingVolunteerApplications ??
                    stats?.volunteerApplicationsPending ??
                    0
                }
            />

            {error && (
                <div className="mt-5 flex items-center gap-3 border border-accent/30 bg-accent/8 px-5 py-4">
                    <AlertCircle size={17} className="shrink-0 text-accent" />

                    <p className="font-jost text-sm text-text-primary">
                        {error}
                    </p>
                </div>
            )}

            <AttentionSection
                loading={loading}
                pendingHelpRequests={pendingHelpRequests}
                pendingVerifications={pendingVerifications}
                pendingRequestCount={pendingRequestCount}
                pendingVerificationCount={pendingVerificationCount}
                urgentRequestCount={urgentRequests.length}
                onOpenRequests={() =>
                    navigateTo('/admin/dashboard/help-requests')
                }
                onOpenVerification={() =>
                    navigateTo('/admin/dashboard/verification')
                }
            />

            <ResponseFlowSection
                loading={loading}
                latestCampaigns={latestCampaigns}
                pendingCampaignCount={pendingCampaignCount}
                totalCampaigns={totalCampaigns}
                activeCampaigns={activeCampaigns}
                onOpenCampaigns={() => navigateTo('/admin/dashboard/campaigns')}
                onOpenCampaign={(campaign) =>
                    navigateTo(`/admin/dashboard/campaigns/${campaign.id}`)
                }
            />

            <NetworkSection
                loading={loading}
                totalUsers={totalUsers}
                totalIndividualUsers={totalIndividualUsers}
                totalOrganizations={totalOrganizations}
                totalVolunteers={totalVolunteers}
                totalHelpRequests={totalHelpRequests}
                totalCampaigns={totalCampaigns}
                activeCampaigns={activeCampaigns}
                totalDonations={totalDonations}
            />

            <AdministrationSection onNavigate={navigateTo} />

            <ActivitySection recentActivity={recentActivity} />

            <footer className="border-t border-border pt-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center bg-primary text-[9px] font-semibold text-white">
                            SP
                        </div>

                        <div>
                            <p className="font-jost text-[11px] font-medium leading-4 text-text-primary">
                                Stand For People
                            </p>

                            <p className="font-jost text-[9px] leading-4 text-text-secondary">
                                Humanitarian coordination platform
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
                        {[
                            ['Users', '/admin/dashboard/users'],
                            ['Organizations', '/admin/dashboard/organizations'],
                            ['Reports', '/admin/dashboard/reports'],
                            ['Settings', '/admin/dashboard/settings'],
                        ].map(([label, path]) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => navigateTo(path)}
                                className="
                        font-jost
                        text-[10px]
                        font-medium
                        text-text-secondary
                        transition-colors
                        hover:text-primary
                    "
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Bottom line */}
                <div className="mt-5 flex flex-col gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-jost text-[9px] text-text-secondary/70">
                        Administration workspace
                    </p>

                    <p className="font-jost text-[9px] text-text-secondary/60">
                        © Stand For People
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Dashboard;
