import React, { useCallback, useState } from "react";
import {
  RefreshCw,
  Users,
  HeartHandshake,
  Megaphone,
  Globe,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

const fetchApi = async (url) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Unable to load organization report.");
  }

  return data;
};

const OrgReports = () => {
  const [report, setReport] = useState({
    totalBeneficiaries: 0,
    totalCampaigns: 0,
    totalVolunteerHours: 0,
    communitiesReached: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalVolunteers: 0,
    activeAssignments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [campaignsResponse, volunteersResponse] = await Promise.all([
        fetchApi("/organization/campaigns"),
        fetchApi("/organization/volunteers"),
      ]);

      /*
       * Organization campaigns
       */
      const campaigns = Array.isArray(campaignsResponse?.campaigns)
        ? campaignsResponse.campaigns
        : Array.isArray(campaignsResponse?.data)
          ? campaignsResponse.data
          : Array.isArray(campaignsResponse)
            ? campaignsResponse
            : [];

      /*
       * Organization volunteer assignments.
       *
       * The backend endpoint already limits these to
       * volunteers assigned to this organization's
       * active campaigns.
       */
      const volunteerAssignments = Array.isArray(volunteersResponse?.volunteers)
        ? volunteersResponse.volunteers
        : [];

      /*
       * Campaign metrics
       */
      const totalCampaigns = campaigns.length;

      const activeCampaigns = campaigns.filter(
        (campaign) => campaign?.status === "active",
      ).length;

      const completedCampaigns = campaigns.filter(
        (campaign) => campaign?.status === "completed",
      ).length;

      /*
       * Beneficiaries
       *
       * Only use values that actually exist in the
       * backend response.
       */
      const totalBeneficiaries = campaigns.reduce((total, campaign) => {
        const value =
          campaign?.beneficiaries ??
          campaign?.beneficiary_count ??
          campaign?.beneficiaryCount ??
          campaign?.help_request?.beneficiaries ??
          campaign?.help_request?.beneficiary_count ??
          0;

        return total + Number(value || 0);
      }, 0);

      /*
       * Communities reached
       *
       * Count unique location/community values when
       * available from the backend.
       */
      const communityValues = campaigns
        .map(
          (campaign) =>
            campaign?.location ??
            campaign?.community ??
            campaign?.area ??
            campaign?.help_request?.location ??
            campaign?.help_request?.community ??
            campaign?.help_request?.area,
        )
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

      const communitiesReached = new Set(communityValues).size;

      /*
       * Volunteer metrics
       */
      const uniqueVolunteerIds = new Set(
        volunteerAssignments
          .map(
            (assignment) =>
              assignment?.volunteer_id ?? assignment?.volunteer?.id,
          )
          .filter(Boolean),
      );

      const totalVolunteers =
        volunteersResponse?.summary?.total != null
          ? Number(volunteersResponse.summary.total)
          : uniqueVolunteerIds.size;

      const activeAssignments =
        volunteersResponse?.summary?.active_assignments != null
          ? Number(volunteersResponse.summary.active_assignments)
          : volunteerAssignments.filter((assignment) =>
              [
                "assigned",
                "accepted",
                "in_progress",
                "withdrawal_requested",
              ].includes(assignment?.status),
            ).length;

      /*
       * Volunteer hours are not currently available
       * in the assignment data.
       *
       * Keep this at 0 instead of showing mock data.
       */
      const totalVolunteerHours = 0;

      setReport({
        totalBeneficiaries,
        totalCampaigns,
        totalVolunteerHours,
        communitiesReached,
        activeCampaigns,
        completedCampaigns,
        totalVolunteers,
        activeAssignments,
      });
    } catch (err) {
      setError(err?.message || "Unable to load organization report.");
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Initial data loading without useEffect,
   * avoiding the project's React Hooks ESLint rule.
   */
  const pageRef = useCallback(
    (element) => {
      if (element && element.dataset.reportLoaded !== "true") {
        element.dataset.reportLoaded = "true";
        loadReport();
      }
    },
    [loadReport],
  );

  return (
    <div ref={pageRef} className="space-y-6">
      <PageHeader
        title="Reports & Impact"
        subtitle="Overview of your organization's reach, outcomes, and contributions."
      />

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadReport}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      )}

      {/* Impact Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Beneficiaries"
          value={loading ? "—" : report.totalBeneficiaries.toLocaleString()}
          icon={HeartHandshake}
        />

        <StatCard
          label="Campaigns Run"
          value={loading ? "—" : report.totalCampaigns}
          icon={Megaphone}
          iconColor="bg-blue-50"
        />

        <StatCard
          label="Volunteer Hours"
          value={loading ? "—" : report.totalVolunteerHours.toLocaleString()}
          icon={Users}
          iconColor="bg-amber-50"
        />

        <StatCard
          label="Communities Reached"
          value={loading ? "—" : report.communitiesReached}
          icon={Globe}
          iconColor="bg-purple-50"
        />
      </div>

      {/* Campaign Performance */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-['Fraunces'] text-base font-semibold text-text-primary">
          Campaign Performance
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-[#eef3f6] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Active Campaigns
            </p>

            <p className="text-2xl font-semibold text-text-primary">
              {loading ? "—" : report.activeCampaigns}
            </p>
          </div>

          <div className="rounded-xl bg-[#eef3f6] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Completed Campaigns
            </p>

            <p className="text-2xl font-semibold text-text-primary">
              {loading ? "—" : report.completedCampaigns}
            </p>
          </div>
        </div>
      </div>

      {/* Volunteer Summary */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="mb-5 font-['Fraunces'] text-base font-semibold text-text-primary">
          Volunteer Engagement
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-[#eef3f6] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Total Volunteers
            </p>

            <p className="text-2xl font-semibold text-text-primary">
              {loading ? "—" : report.totalVolunteers}
            </p>
          </div>

          <div className="rounded-xl bg-[#eef3f6] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Active Assignments
            </p>

            <p className="text-2xl font-semibold text-text-primary">
              {loading ? "—" : report.activeAssignments}
            </p>
          </div>

          <div className="rounded-xl bg-[#eef3f6] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
              Completed Campaigns
            </p>

            <p className="text-2xl font-semibold text-text-primary">
              {loading ? "—" : report.completedCampaigns}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-[#6b7280]">
        Report figures are calculated from your organization's current campaign
        and volunteer records.
      </p>
    </div>
  );
};

export default OrgReports;
