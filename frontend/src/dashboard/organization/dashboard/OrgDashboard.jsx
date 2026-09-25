import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Loader2,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeDate = (date) => {
  if (!date) return "";

  const now = new Date();
  const target = new Date(date);

  const diff = now.getTime() - target.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return formatDate(date);
};

const statusStyles = {
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  unverified: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

const urgencyStyles = {
  critical: "text-red-700 bg-red-50 border-red-200",
  high: "text-orange-700 bg-orange-50 border-orange-200",
  normal: "text-slate-600 bg-slate-50 border-slate-200",
  low: "text-sky-700 bg-sky-50 border-sky-200",
};

const StatCard = ({ icon: Icon, label, value, description }) => {
  return (
    <div className="relative min-w-0 bg-white px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-teal-50 text-teal-700">
          <Icon size={17} strokeWidth={1.8} />
        </div>

        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-4 text-[30px] font-semibold leading-none tracking-tight text-slate-900">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-[11px] leading-4 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "")
    .toLowerCase()
    .replaceAll(" ", "_");

  const style =
    statusStyles[normalized] || "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold capitalize ${style}`}>
      {String(status || "Unknown").replaceAll("_", " ")}
    </span>
  );
};

const UrgencyBadge = ({ urgency }) => {
  if (!urgency || urgency === "normal") return null;

  const style =
    urgencyStyles[urgency] || "text-slate-600 bg-slate-50 border-slate-200";

  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${style}`}>
      {urgency}
    </span>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400">
        <Icon size={21} strokeWidth={1.6} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">{title}</p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
};

export default function OrgDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    const token = getToken();

    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await axios.get(`${API_URL}/organization/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setDashboard(response.data?.data || null);
    } catch (err) {
      console.error("Organization dashboard error:", err);

      setError(
        err.response?.data?.message || "Unable to load organization dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const token = getToken();

      if (!token) {
        if (!cancelled) {
          setError("Authentication token not found.");
          setLoading(false);
        }

        return;
      }

      try {
        const response = await axios.get(`${API_URL}/organization/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!cancelled) {
          setDashboard(response.data?.data || null);

          setLoading(false);
        }
      } catch (err) {
        console.error("Organization dashboard error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load organization dashboard.",
          );

          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="mx-auto animate-spin text-teal-700" size={28} />

            <p className="mt-4 text-sm text-slate-500">
              Loading organization dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] bg-background">
        <div className="mx-auto max-w-2xl">
          <div className="border border-red-200 bg-white px-6 py-8 text-center">
            <XCircle className="mx-auto text-red-500" size={30} />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Dashboard could not be loaded
            </h2>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchDashboard();
              }}
              className="mt-6 inline-flex items-center gap-2 bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800">
              Try again
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const organization = dashboard.organization || {};

  const overview = dashboard.overview || {};

  const requests = dashboard.requests || [];

  const campaigns = dashboard.campaigns || [];

  const volunteers = dashboard.volunteers || {};

  const completionRate =
    overview.assigned_requests > 0
      ? Math.round(
          (overview.completed_requests / overview.assigned_requests) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[1400px]">
        {/* =====================================================
                    ORGANIZATION HERO
                ====================================================== */}

        <section className="overflow-hidden border border-slate-200 bg-white">
          <div className="flex flex-col lg:flex-row">
            <div className="relative flex-1 overflow-hidden bg-teal-800 px-6 py-7 sm:px-8 lg:px-10 lg:py-9">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[40px] border-teal-700/50" />

              <div className="absolute -bottom-28 right-20 h-48 w-48 rounded-full border-[28px] border-teal-700/40" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200">
                    Organization workspace
                  </span>

                  <span className="h-1 w-1 rounded-full bg-teal-400" />

                  <span className="text-[10px] font-medium text-teal-200">
                    {organization.type || "Organization"}
                  </span>
                </div>

                <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {organization.name || "Organization"}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-teal-100">
                  {organization.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />

                      {organization.location}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} />

                    {organization.verification_status === "verified"
                      ? "Verified organization"
                      : "Verification pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col justify-between border-t border-slate-200 bg-white p-6 lg:w-[250px] lg:border-l lg:border-t-0">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Workspace
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Organization operations
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Manage requests, campaigns and volunteer activity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard/organization/profile")}
                className="mt-6 inline-flex h-10 items-center justify-between border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700">
                Organization profile
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
                    OVERVIEW STRIP
                ====================================================== */}

        <section className="mt-5 grid grid-cols-1 gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={HeartHandshake}
            label="Assigned requests"
            value={overview.assigned_requests ?? 0}
            description="Requests assigned to your organization"
          />

          <StatCard
            icon={Clock3}
            label="Active requests"
            value={overview.active_requests ?? 0}
            description="Requests currently in progress"
          />

          <StatCard
            icon={BriefcaseBusiness}
            label="Active campaigns"
            value={overview.active_campaigns ?? 0}
            description="Currently active campaigns"
          />

          <StatCard
            icon={Users}
            label="Volunteers"
            value={volunteers.total ?? 0}
            description={`${volunteers.active_assignments ?? 0} active assignments`}
          />
        </section>

        {/* =====================================================
                    MAIN OPERATIONS AREA
                ====================================================== */}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          {/* =================================================
                        REQUEST QUEUE
                    ================================================== */}

          <div className="overflow-hidden border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-teal-600" />

                  <h2 className="text-sm font-bold text-slate-900">
                    Request queue
                  </h2>
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Recent help requests requiring organizational action
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard/organization/requests")}
                className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-teal-700 transition hover:text-teal-800 sm:self-auto">
                View all requests
                <ArrowRight size={14} />
              </button>
            </div>

            {requests.length === 0 ? (
              <EmptyState
                icon={HeartHandshake}
                title="No assigned requests"
                description="Help requests assigned to your organization will appear here."
              />
            ) : (
              <div>
                {requests.map((request, index) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/dashboard/organization/responses/${request.help_request_id || request.id}`,
                      )
                    }
                    className="group flex w-full items-center gap-4 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-50">
                    <span className="w-6 shrink-0 text-[10px] font-semibold tabular-nums text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-teal-50 text-teal-700">
                      <HeartHandshake size={18} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-teal-700">
                          {request.title}
                        </p>

                        <UrgencyBadge urgency={request.urgency} />
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        {request.district && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={11} />

                            {request.district}
                          </span>
                        )}

                        <span>
                          Updated {formatRelativeDate(request.updated_at)}
                        </span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <StatusBadge status={request.status} />
                    </div>

                    <ChevronRight
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600"
                      size={18}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
                        OPERATIONS SUMMARY
                    ================================================== */}

          <aside className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-amber-500" />

                <h2 className="text-sm font-bold text-slate-900">Operations</h2>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Current response performance
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Completion rate
                  </p>

                  <p className="mt-2 text-[42px] font-semibold leading-none tracking-tight text-slate-900">
                    {completionRate}
                    <span className="text-xl text-slate-400">%</span>
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} strokeWidth={1.7} />
                </div>
              </div>

              <div className="mt-5 h-2 bg-slate-100">
                <div
                  className="h-full bg-teal-600 transition-all"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>

              <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-slate-500">
                    Completed requests
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {overview.completed_requests ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-slate-500">
                    Active requests
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {overview.active_requests ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-slate-500">
                    Active campaigns
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {overview.active_campaigns ?? 0}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard/organization/requests")}
                className="mt-5 flex w-full items-center justify-between border border-slate-200 px-3.5 py-3 text-xs font-bold text-slate-700 transition hover:border-teal-600 hover:text-teal-700">
                Manage requests
                <ArrowRight size={15} />
              </button>
            </div>
          </aside>
        </section>

        {/* =====================================================
                    CAMPAIGNS + VOLUNTEERS
                ====================================================== */}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          {/* =================================================
                        CAMPAIGNS
                    ================================================== */}

          <div className="overflow-hidden border border-slate-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-amber-500" />

                  <h2 className="text-sm font-bold text-slate-900">
                    Campaign activity
                  </h2>
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Latest campaigns managed by your organization
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard/organization/campaigns")}
                className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-teal-700 transition hover:text-teal-800 sm:self-auto">
                Manage campaigns
                <ArrowRight size={14} />
              </button>
            </div>

            {campaigns.length === 0 ? (
              <EmptyState
                icon={BriefcaseBusiness}
                title="No campaigns yet"
                description="Campaigns created or assigned to your organization will appear here."
              />
            ) : (
              <div>
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/dashboard/organization/campaigns/${campaign.id}`,
                      )
                    }
                    className="group flex w-full items-center gap-4 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-slate-50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-50 text-amber-700">
                      <BriefcaseBusiness size={18} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-teal-700">
                        {campaign.title}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        {campaign.start_date && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={11} />

                            {formatDate(campaign.start_date)}
                          </span>
                        )}

                        {campaign.end_date && (
                          <span>until {formatDate(campaign.end_date)}</span>
                        )}
                      </div>
                    </div>

                    <StatusBadge status={campaign.status} />

                    <ChevronRight
                      className="shrink-0 text-slate-300 transition group-hover:text-teal-600"
                      size={18}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
                        VOLUNTEERS
                    ================================================== */}

          <aside className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-teal-600" />

                <h2 className="text-sm font-bold text-slate-900">
                  Volunteer capacity
                </h2>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Current volunteer allocation
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-teal-50 text-teal-700">
                  <Users size={22} strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-[32px] font-semibold leading-none tracking-tight text-slate-900">
                    {volunteers.total ?? 0}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Assigned volunteers
                  </p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-slate-500">
                    Active assignments
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {volunteers.active_assignments ?? 0}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-slate-500">
                    Active campaigns
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {overview.active_campaigns ?? 0}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard/organization/volunteers")}
                className="mt-5 flex w-full items-center justify-between border border-slate-200 px-3.5 py-3 text-xs font-bold text-slate-700 transition hover:border-teal-600 hover:text-teal-700">
                View volunteers
                <ArrowRight size={15} />
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
