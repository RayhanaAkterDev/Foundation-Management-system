import React, { useState } from "react";
import { RefreshCw, Users } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

import { fetchOrganizationVolunteers } from "./api/volunteerApi";

const columns = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "campaign",
    header: "Campaign",
  },
  {
    key: "status",
    header: "Assignment Status",
    render: (val) => <StatusBadge status={val} />,
  },
];

const OrgVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active_campaigns: 0,
    active_assignments: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchOrganizationVolunteers();

      const assignments = Array.isArray(data?.volunteers)
        ? data.volunteers
        : [];

      const normalized = assignments.map((assignment) => ({
        id: assignment?.id,
        name: assignment?.volunteer?.name || "Unknown volunteer",
        campaign: assignment?.campaign?.title || "Unknown campaign",
        status: assignment?.status || "assigned",
      }));

      setVolunteers(normalized);

      setSummary({
        total: Number(data?.summary?.total || 0),
        active_campaigns: Number(data?.summary?.active_campaigns || 0),
        active_assignments: Number(data?.summary?.active_assignments || 0),
      });
    } catch (err) {
      setError(err?.message || "Unable to load organization volunteers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="space-y-6"
      ref={(element) => {
        if (element && !element.dataset.loaded) {
          element.dataset.loaded = "true";
          loadVolunteers();
        }
      }}>
      <PageHeader
        title="Volunteers"
        subtitle="View volunteers assigned to your organization's active campaigns."
      />

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={loadVolunteers}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Assigned Volunteers"
          value={loading ? "—" : summary.total}
          icon={Users}
        />

        <StatCard
          label="Active Campaigns"
          value={loading ? "—" : summary.active_campaigns}
          icon={Users}
          iconColor="bg-blue-50"
        />

        <StatCard
          label="Active Assignments"
          value={loading ? "—" : summary.active_assignments}
          icon={Users}
          iconColor="bg-amber-50"
        />
      </div>

      {/* Volunteer roster */}
      <DataTable
        title="Volunteer Roster"
        columns={columns}
        rows={volunteers}
        loading={loading}
        empty={{
          icon: Users,
          title: "No volunteers assigned",
          message:
            "Volunteers assigned to your active campaigns will appear here.",
        }}
      />
    </div>
  );
};

export default OrgVolunteers;
