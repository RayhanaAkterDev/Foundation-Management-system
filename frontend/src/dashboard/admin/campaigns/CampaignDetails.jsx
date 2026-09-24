import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  HandCoins,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchCampaigns } from "./api/campaignsAPI";

const STATUS_CONFIG = {
  unverified: {
    label: "Unverified",
    icon: CircleAlert,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  rejected: {
    label: "Rejected",
    icon: CircleAlert,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: CircleAlert,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const getTypeLabel = (type) => {
  switch (type) {
    case "local_case":
      return "Local Case";

    case "organization_proposed":
      return "Organization Proposed";

    case "global_situation":
      return "Global Situation";

    default:
      return type || "—";
  }
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return `৳${value.toLocaleString("en-BD")}`;
};

const getLocation = (campaign) => {
  return (
    campaign?.location ||
    campaign?.district ||
    campaign?.address ||
    "Location not specified"
  );
};

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCampaign = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchCampaigns();

        if (cancelled) {
          return;
        }

        const campaigns = response?.campaigns || response?.data || [];

        if (!Array.isArray(campaigns)) {
          throw new Error("Invalid campaign data received from the server.");
        }

        const foundCampaign = campaigns.find(
          (item) => String(item?.id) === String(id),
        );

        if (!foundCampaign) {
          setError("Campaign record could not be found.");
          setCampaign(null);
          return;
        }

        setCampaign(foundCampaign);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load campaign details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCampaign();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const status = useMemo(() => {
    return (
      STATUS_CONFIG[campaign?.status] || {
        label: campaign?.status || "Unknown",
        icon: CircleAlert,
        className: "bg-slate-100 text-slate-600 border-slate-200",
      }
    );
  }, [campaign?.status]);

  const StatusIcon = status.icon;

  if (loading) {
    return (
      <div className="space-y-8">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard/campaigns")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary">
          <ArrowLeft size={16} />
          Back to Campaigns
        </button>

        <div className="flex min-h-80 items-center justify-center border-y border-border bg-surface">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

            <p className="text-sm font-semibold text-text-primary">
              Loading campaign...
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Retrieving the campaign record.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-8">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard/campaigns")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary">
          <ArrowLeft size={16} />
          Back to Campaigns
        </button>

        <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold text-red-700">
            {error || "Campaign not found."}
          </p>

          <p className="mt-1 text-xs text-red-600">Campaign ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard/campaigns")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary">
            <ArrowLeft size={16} />
            Back to Campaigns
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Campaign #{campaign.id}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-bold ${status.className}`}>
              <StatusIcon size={13} />

              {status.label}
            </span>
          </div>

          <h1 className="mt-3 max-w-4xl text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {campaign.title || "Campaign"}
          </h1>

          {campaign.description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
              {campaign.description}
            </p>
          )}
        </div>
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Details */}
        <section className="border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Campaign information
            </p>

            <h2 className="mt-1 text-lg font-bold text-text-primary">
              Record details
            </h2>
          </div>

          <div className="grid gap-x-8 gap-y-7 p-6 sm:grid-cols-2">
            <DetailItem
              icon={Tag}
              label="Campaign Type"
              value={getTypeLabel(campaign.type)}
            />

            <DetailItem
              icon={Tag}
              label="Category"
              value={campaign.category || "—"}
            />

            <DetailItem
              icon={MapPin}
              label="Location"
              value={getLocation(campaign)}
            />

            <DetailItem
              icon={CalendarDays}
              label="Start Date"
              value={formatDate(campaign.start_date)}
            />

            <DetailItem
              icon={CalendarDays}
              label="End Date"
              value={formatDate(campaign.end_date)}
            />

            <DetailItem
              icon={Clock3}
              label="Proposal Date"
              value={formatDate(campaign.proposal_date)}
            />

            <DetailItem
              icon={ShieldCheck}
              label="Organization"
              value={
                campaign.organization?.name || campaign.organization_name || "—"
              }
            />

            <DetailItem
              icon={Users}
              label="Organization ID"
              value={
                campaign.organization_id ? `#${campaign.organization_id}` : "—"
              }
            />
          </div>
        </section>

        {/* Financial summary */}
        <aside className="h-fit border border-border bg-primary text-white">
          <div className="border-b border-white/15 px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
              Financial overview
            </p>

            <h2 className="mt-1 text-lg font-bold">Campaign funding</h2>
          </div>

          <div className="space-y-6 px-6 py-6">
            <MoneyItem
              icon={HandCoins}
              label="Target amount"
              value={formatCurrency(campaign.target_amount)}
            />

            <MoneyItem
              icon={CheckCircle2}
              label="Collected amount"
              value={formatCurrency(campaign.collected_amount)}
            />

            <div className="border-t border-white/15 pt-5">
              <p className="text-[11px] font-medium text-white/65">
                Campaign record
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                ID #{campaign.id}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Description */}
      {campaign.description && (
        <section className="border border-border bg-surface">
          <div className="border-b border-border px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Description
            </p>

            <h2 className="mt-1 text-lg font-bold text-text-primary">
              About this campaign
            </h2>
          </div>

          <div className="px-6 py-6">
            <p className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-text-secondary">
              {campaign.description}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 text-primary">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-text-primary wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
};

const MoneyItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Icon size={17} strokeWidth={1.8} className="text-white/75" />

        <span className="text-xs font-medium text-white/70">{label}</span>
      </div>

      <span className="whitespace-nowrap text-sm font-bold text-white">
        {value}
      </span>
    </div>
  );
};

export default CampaignDetails;
