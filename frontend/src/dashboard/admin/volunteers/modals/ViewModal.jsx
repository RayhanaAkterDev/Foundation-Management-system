import React from "react";
import {
  X,
  UserRound,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  CalendarDays,
  Activity,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ArrowUpRight,
  FileText,
} from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusLabel = (status) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getCampaign = (assignment) => {
  if (!assignment || typeof assignment !== "object") {
    return null;
  }

  const campaign = assignment.campaign;

  if (campaign && typeof campaign === "object") {
    return campaign;
  }

  return null;
};

const getCampaignId = (assignment) => {
  if (!assignment || typeof assignment !== "object") {
    return null;
  }

  const campaign = getCampaign(assignment);

  return (
    campaign?.id ?? assignment?.campaign_id ?? assignment?.campaignId ?? null
  );
};

const getCampaignTitle = (assignment) => {
  if (!assignment || typeof assignment !== "object") {
    return null;
  }

  const campaign = getCampaign(assignment);

  return (
    campaign?.title ??
    campaign?.name ??
    campaign?.campaign_title ??
    campaign?.campaign_name ??
    assignment?.campaign_title ??
    assignment?.campaign_name ??
    null
  );
};

/*
|--------------------------------------------------------------------------
| Normalize volunteer detail response
|--------------------------------------------------------------------------
|
| Supported backend shapes:
|
| {
|   volunteer: {...},
|   assignments: [...]
| }
|
| {
|   data: {
|     volunteer: {...},
|     assignments: [...]
|   }
| }
|
| {
|   data: {...volunteer...},
|   assignments: [...]
| }
|
| {
|   ...volunteer,
|   assignments: [...]
| }
|
*/
const normalizeResponse = (response) => {
  if (!response || typeof response !== "object") {
    return {
      volunteer: null,
      assignments: [],
    };
  }

  let root = response;

  // Laravel apiResource / response()->json(['data' => ...])
  if (
    response.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    root = response.data;
  }

  /*
   * Volunteer can be explicitly nested.
   */
  let volunteer = root?.volunteer;

  /*
   * If there is no explicit volunteer key, the root itself
   * can be the volunteer object.
   */
  if (!volunteer || typeof volunteer !== "object") {
    volunteer = root;
  }

  /*
   * Find assignments from the same response level.
   */
  let assignments =
    root?.assignments ??
    root?.campaign_assignments ??
    root?.campaign_volunteer_assignments ??
    root?.campaignVolunteerAssignments ??
    null;

  /*
   * Some Laravel responses may put assignments inside volunteer.
   */
  if (!Array.isArray(assignments)) {
    assignments =
      volunteer?.assignments ??
      volunteer?.campaign_assignments ??
      volunteer?.campaign_volunteer_assignments ??
      volunteer?.campaignVolunteerAssignments ??
      [];
  }

  /*
   * Ensure we never accidentally treat an object as an assignment list.
   */
  if (!Array.isArray(assignments)) {
    assignments = [];
  }

  return {
    volunteer,
    assignments,
  };
};

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        <Icon size={13} strokeWidth={1.8} />
        <span>{label}</span>
      </div>

      <p className="wrap-break-word text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
};

const ViewModal = ({
  open = true,
  volunteer,
  loading = false,
  error = "",
  onClose,
  onViewCampaign,
}) => {
  if (!open) {
    return null;
  }

  const normalized = normalizeResponse(volunteer);

  const data = normalized.volunteer;
  const assignments = normalized.assignments;

  const user = data?.user || {};

  const volunteerStatus = data?.status || "inactive";

  /*
   * Availability is calculated by the backend.
   * Do not invent availability here.
   */
  const availability = data?.availability || "unavailable";

  const skills = Array.isArray(data?.skills)
    ? data.skills
    : typeof data?.skills === "string"
      ? data.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const handleCampaignClick = (assignment) => {
    const campaignId = getCampaignId(assignment);

    if (!campaignId || !onViewCampaign) {
      return;
    }

    onViewCampaign(campaignId, assignment);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}>
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">
              Volunteer Profile
            </p>

            <h2 className="font-[Jost] text-2xl font-semibold tracking-tight text-slate-900">
              Volunteer Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Profile information and campaign participation history.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Close">
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-teal-700" />

                <p className="text-sm font-medium text-slate-700">
                  Loading volunteer details...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <CircleAlert
                  size={19}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to load volunteer details
                  </p>

                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : !data ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <div className="text-center">
                <UserRound size={32} className="mx-auto mb-3 text-slate-300" />

                <p className="text-sm font-medium text-slate-700">
                  Volunteer information is unavailable.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 p-6">
              {/* Profile hero */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xl font-semibold text-white">
                      {(user?.name || "V").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-semibold text-slate-900">
                        {user?.name || "Unnamed Volunteer"}
                      </h3>

                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Mail size={14} />

                        <span className="truncate">
                          {user?.email || "No email"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={volunteerStatus} />

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        availability === "available"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                      {availability === "available" ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <CircleAlert size={13} />
                      )}

                      {availability === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Basic information */}
              <section>
                <div className="mb-4 flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                      Profile
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      Basic Information
                    </h3>
                  </div>
                </div>

                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem
                    icon={UserRound}
                    label="Full Name"
                    value={user?.name}
                  />

                  <InfoItem icon={Mail} label="Email" value={user?.email} />

                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={data?.phone || user?.phone}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="District"
                    value={data?.district}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={data?.address}
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Joined"
                    value={formatDate(data?.created_at)}
                  />
                </div>
              </section>

              {/* Skills */}
              <section>
                <div className="mb-4 flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                      Capabilities
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      Skills
                    </h3>
                  </div>
                </div>

                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                        <BriefcaseBusiness
                          size={14}
                          className="text-teal-700"
                        />

                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills have been added.
                  </p>
                )}
              </section>

              {/* Campaign history */}
              <section>
                <div className="mb-4 flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                      Activity
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      Campaign History
                    </h3>
                  </div>

                  <span className="text-sm text-slate-500">
                    {assignments.length}{" "}
                    {assignments.length === 1 ? "campaign" : "campaigns"}
                  </span>
                </div>

                {assignments.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <Activity
                      size={28}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <p className="text-sm font-semibold text-slate-700">
                      No campaign history
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      This volunteer has not been assigned to a campaign yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    {/* Table header */}
                    <div className="hidden grid-cols-[minmax(0,1fr)_150px_140px_130px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
                      <span>Campaign</span>
                      <span>Assigned</span>
                      <span>Status</span>
                      <span className="text-right">Action</span>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {assignments.map((assignment, index) => {
                        const campaignId = getCampaignId(assignment);
                        const campaignTitle = getCampaignTitle(assignment);
                        const status = assignment?.status;

                        const assignedDate =
                          assignment?.assigned_at ||
                          assignment?.created_at ||
                          null;

                        const canViewCampaign = Boolean(
                          campaignId && onViewCampaign,
                        );

                        return (
                          <div
                            key={
                              assignment?.id ??
                              `${campaignId ?? "campaign"}-${index}`
                            }
                            className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1fr)_150px_140px_130px] md:items-center">
                            {/* Campaign */}
                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <FileText
                                  size={15}
                                  className="shrink-0 text-teal-700"
                                />

                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {campaignTitle ||
                                    (campaignId
                                      ? `Campaign #${campaignId}`
                                      : "Campaign details unavailable")}
                                </p>
                              </div>

                              {campaignId ? (
                                <p className="text-xs text-slate-500">
                                  Campaign #{campaignId}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400">
                                  Campaign information was not included in this
                                  response.
                                </p>
                              )}

                              {/* Mobile action */}
                              <div className="mt-4 md:hidden">
                                <button
                                  type="button"
                                  disabled={!canViewCampaign}
                                  onClick={() =>
                                    handleCampaignClick(assignment)
                                  }
                                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                    canViewCampaign
                                      ? "bg-teal-700 text-white hover:bg-teal-800"
                                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                                  }`}>
                                  View Campaign Details
                                  <ArrowUpRight size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Assigned */}
                            <div>
                              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 md:hidden">
                                <CalendarDays size={12} />
                                Assigned
                              </div>

                              <p className="text-sm font-medium text-slate-700">
                                {formatDate(assignedDate)}
                              </p>
                            </div>

                            {/* Status */}
                            <div>
                              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 md:hidden">
                                <Activity size={12} />
                                Status
                              </div>

                              <StatusBadge status={status} />
                            </div>

                            {/* Action */}
                            <div className="hidden justify-end md:flex">
                              <button
                                type="button"
                                disabled={!canViewCampaign}
                                onClick={() => handleCampaignClick(assignment)}
                                title={
                                  canViewCampaign
                                    ? "View campaign details"
                                    : "Campaign details are unavailable"
                                }
                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                  canViewCampaign
                                    ? "bg-teal-700 text-white hover:bg-teal-800"
                                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                                }`}>
                                View Details
                                <ArrowUpRight size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              {/* Current status */}
              <section className="border-t border-slate-200 pt-6">
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                        Volunteer Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {getStatusLabel(volunteerStatus)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      {availability === "available" ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <CircleAlert size={17} />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                        Availability
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {availability === "available"
                          ? "Available"
                          : "Unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Clock3 size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                        Last Updated
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatDate(data?.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
