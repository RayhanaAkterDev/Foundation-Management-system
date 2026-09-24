import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  PlayCircle,
  UserRound,
  XCircle,
} from "lucide-react";

import DataTable from "@/components/dashboard/DataTable";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";

import {
  acceptCampaignAssignment,
  acceptVolunteerRequest,
  cancelVolunteerRequest,
  completeCampaignAssignment,
  getMyVolunteer,
  rejectCampaignAssignment,
  rejectVolunteerRequest,
  requestCampaignWithdrawal,
  requestVolunteerReactivation,
  resignVolunteer,
  sendVolunteerRequest,
  startCampaignAssignment,
} from "./api/volunteerApi";

// =============================================================
// CONFIG
// =============================================================

const statusConfig = {
  assigned: {
    label: "Pending Response",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },

  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  in_progress: {
    label: "In Progress",
    icon: PlayCircle,
    className: "border-teal-200 bg-teal-50 text-teal-700",
  },

  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },

  withdrawn: {
    label: "Withdrawn",
    icon: XCircle,
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },

  withdrawal_requested: {
    label: "Withdrawal Pending",
    icon: Clock3,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
};

const volunteerStatusCopy = {
  active: {
    title: "Your volunteer account is active.",
    description:
      "You can receive campaign assignments and participate in humanitarian activities.",
  },

  inactive: {
    title: "Your volunteer account is inactive.",
    description: "You are currently not eligible for new campaign assignments.",
  },

  suspended: {
    title: "Your volunteer account is suspended.",
    description:
      "Your volunteer account is currently unavailable for campaign assignments.",
  },
};

// =============================================================
// HELPERS
// =============================================================

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

const getCampaignLocation = (campaign) => {
  if (!campaign) return "Location not specified";

  return (
    campaign.location ||
    campaign.address ||
    campaign.district ||
    "Location not specified"
  );
};

const getRequestDirection = (request) => {
  if (!request?.id) {
    return null;
  }

  const userId = Number(request?.user_id);
  const requestedBy = Number(request?.requested_by);

  if (
    Number.isFinite(userId) &&
    Number.isFinite(requestedBy) &&
    userId === requestedBy
  ) {
    return "application";
  }

  return "invitation";
};

// =============================================================
// CAMPAIGN ASSIGNMENT REQUEST
// =============================================================

const CampaignAssignmentRequest = ({
  assignment,
  actionLoading,
  onAccept,
  onReject,
}) => {
  const campaign = assignment?.campaign;
  const isLoading = actionLoading === assignment?.id;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Campaign Assignment
            </p>

            <h3 className="text-lg font-semibold leading-7 text-slate-900">
              {campaign?.title || "Untitled campaign"}
            </h3>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock3 className="h-3.5 w-3.5" />
            Pending Response
          </span>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <MapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">Location</p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {getCampaignLocation(campaign)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <CalendarDays className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Assigned</p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(assignment?.assigned_at)}
            </p>
          </div>
        </div>

        {assignment?.assignment_note && (
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-medium text-slate-400">
              Assignment Note
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {assignment.assignment_note}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onReject(assignment)}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
          <XCircle className="mr-2 h-4 w-4" />

          {isLoading ? "Processing..." : "Decline"}
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onAccept(assignment)}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50">
          <CheckCircle2 className="mr-2 h-4 w-4" />

          {isLoading ? "Processing..." : "Accept Assignment"}
        </button>
      </div>
    </div>
  );
};

// =============================================================
// VOLUNTEER STATUS PANEL
// =============================================================

const VolunteerStatusPanel = ({
  volunteer,
  request,
  actionLoading,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onRequestReactivation,
  onResign,
}) => {
  // ===========================================================
  // NO VOLUNTEER PROFILE
  // ===========================================================

  if (!volunteer) {
    const requestDirection = getRequestDirection(request);
    const pendingRequest = request?.status === "pending";

    const isOwnApplication =
      pendingRequest && requestDirection === "application";

    const isAdminInvitation =
      pendingRequest && requestDirection === "invitation";

    return (
      <section className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Volunteer with Stand For People
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Join humanitarian campaigns and contribute your skills to people
                and communities who need support.
              </p>
            </div>
          </div>

          {isOwnApplication ? (
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="flex w-fit items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
                <Clock3 className="h-4 w-4" />
                Request Pending
              </div>

              <button
                type="button"
                disabled={actionLoading === "request-cancel"}
                onClick={onCancelRequest}
                className="inline-flex min-h-10 items-center justify-center border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                <XCircle className="mr-2 h-4 w-4" />

                {actionLoading === "request-cancel"
                  ? "Cancelling..."
                  : "Cancel Application"}
              </button>
            </div>
          ) : isAdminInvitation ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={actionLoading === "request-reject"}
                onClick={onRejectRequest}
                className="inline-flex min-h-10 items-center justify-center border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                <XCircle className="mr-2 h-4 w-4" />

                {actionLoading === "request-reject"
                  ? "Declining..."
                  : "Decline"}
              </button>

              <button
                type="button"
                disabled={actionLoading === "request-accept"}
                onClick={onAcceptRequest}
                className="inline-flex min-h-10 items-center justify-center bg-[#0f766e] px-4 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50">
                <CheckCircle2 className="mr-2 h-4 w-4" />

                {actionLoading === "request-accept"
                  ? "Accepting..."
                  : "Accept Request"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={actionLoading === "request"}
              onClick={onSendRequest}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
              {actionLoading === "request" ? "Sending..." : "Join As Volunteer"}
            </button>
          )}
        </div>

        {isOwnApplication && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-sm leading-6 text-slate-500">
              Your volunteer application is currently under review. You can
              cancel the application while it is still pending.
            </p>
          </div>
        )}

        {isAdminInvitation && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-sm leading-6 text-slate-500">
              An administrator has invited you to become a volunteer. Accept the
              request to join the volunteer program, or decline if you are
              unavailable.
            </p>
          </div>
        )}
      </section>
    );
  }

  // ===========================================================
  // EXISTING VOLUNTEER PROFILE
  // ===========================================================

  const status = volunteer?.status || "inactive";

  const availability =
    volunteer?.availability === "available" ? "Available" : "Unavailable";

  const statusCopy =
    volunteerStatusCopy[status] || volunteerStatusCopy.inactive;

  const isActiveVolunteer = status === "active";
  const isInactiveVolunteer = status === "inactive";
  const isSuspendedVolunteer = status === "suspended";

  // A reactivation request is a pending request created by the
  // volunteer themselves.
  const hasPendingReactivationRequest =
    isInactiveVolunteer &&
    request?.status === "pending" &&
    Number(request?.user_id) === Number(request?.requested_by);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0f766e]">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Volunteer Profile
              </h2>

              <StatusBadge status={status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">{statusCopy.title}</p>
          </div>
        </div>

        {isActiveVolunteer ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            {availability}
          </div>
        ) : (
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-slate-400" />

            {availability}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {isInactiveVolunteer
              ? hasPendingReactivationRequest
                ? "Your reactivation request has been sent to the admin and is currently awaiting review."
                : "Your previous volunteer profile is inactive. You can request admin approval to reactivate your volunteer account."
              : isSuspendedVolunteer
                ? "Your volunteer account has been suspended. You cannot request reactivation yourself."
                : statusCopy.description}
          </p>

          <div className="flex shrink-0 flex-wrap gap-2">
            {/* ACTIVE VOLUNTEER */}
            {isActiveVolunteer && (
              <button
                type="button"
                disabled={actionLoading === "resign"}
                onClick={onResign}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                <LogOut className="mr-2 h-4 w-4" />

                {actionLoading === "resign"
                  ? "Resigning..."
                  : "Resign as Volunteer"}
              </button>
            )}

            {/* INACTIVE + NO PENDING REACTIVATION */}
            {isInactiveVolunteer && !hasPendingReactivationRequest && (
              <button
                type="button"
                disabled={actionLoading === "reactivation"}
                onClick={onRequestReactivation}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50">
                <UserRound className="mr-2 h-4 w-4" />

                {actionLoading === "reactivation"
                  ? "Sending..."
                  : "Request Reactivation"}
              </button>
            )}

            {/* INACTIVE + PENDING REACTIVATION */}
            {isInactiveVolunteer && hasPendingReactivationRequest && (
              <>
                <div className="inline-flex min-h-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-700">
                  <Clock3 className="mr-2 h-4 w-4" />
                  Reactivation Pending
                </div>

                <button
                  type="button"
                  disabled={actionLoading === "request-cancel"}
                  onClick={onCancelRequest}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <XCircle className="mr-2 h-4 w-4" />

                  {actionLoading === "request-cancel"
                    ? "Cancelling..."
                    : "Cancel Request"}
                </button>
              </>
            )}

            {/* SUSPENDED */}
            {isSuspendedVolunteer && (
              <div className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700">
                <XCircle className="mr-2 h-4 w-4" />
                Reactivation Unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// =============================================================
// RESIGN CONFIRMATION MODAL
// =============================================================

const ResignConfirmationModal = ({ open, loading, onCancel, onConfirm }) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resign-modal-title">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <LogOut className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="resign-modal-title"
                className="text-lg font-semibold text-slate-900">
                Resign as volunteer?
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Are you sure you want to resign from the volunteer program?
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm leading-6 text-amber-800">
              Your volunteer history will be preserved, but your current
              volunteer status will become inactive. You can request
              reactivation later if you want to volunteer again.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
            <LogOut className="mr-2 h-4 w-4" />

            {loading ? "Resigning..." : "Resign as Volunteer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// MAIN PAGE
// =============================================================

const MyVolunteerActivities = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [request, setRequest] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [assignmentActionId, setAssignmentActionId] = useState(null);

  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const [resignModalOpen, setResignModalOpen] = useState(false);

  // ===========================================================
  // LOAD DATA
  // ===========================================================

  const loadVolunteerData = useCallback(async () => {
    const response = await getMyVolunteer();

    setVolunteer(response?.volunteer ?? null);
    setRequest(response?.request ?? null);

    setAssignments(
      Array.isArray(response?.assignments) ? response.assignments : [],
    );

    return response;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchVolunteerData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyVolunteer();

        if (cancelled) return;

        setVolunteer(response?.volunteer ?? null);
        setRequest(response?.request ?? null);

        setAssignments(
          Array.isArray(response?.assignments) ? response.assignments : [],
        );
      } catch (err) {
        if (cancelled) return;

        setError(err?.message || "Unable to load your volunteer information.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVolunteerData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ===========================================================
  // VOLUNTEER REQUEST ACTIONS
  // ===========================================================

  const handleSendVolunteerRequest = async () => {
    try {
      setActionLoading("request");
      setError("");
      setRequestMessage("");

      const response = await sendVolunteerRequest();

      setRequest(response?.request ?? response ?? null);

      setRequestMessage(
        response?.message ||
          "Your volunteer application has been submitted successfully.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to submit your volunteer application.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestReactivation = async () => {
    try {
      setActionLoading("reactivation");
      setError("");
      setRequestMessage("");

      const response = await requestVolunteerReactivation();

      setRequestMessage(
        response?.message ||
          "Your volunteer reactivation request has been sent to the admin.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to request volunteer reactivation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptVolunteerRequest = async () => {
    if (!request?.id) return;

    try {
      setActionLoading("request-accept");
      setError("");
      setRequestMessage("");

      const response = await acceptVolunteerRequest(request.id);

      setRequestMessage(
        response?.message || "Volunteer invitation accepted successfully.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to accept the volunteer invitation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectVolunteerRequest = async () => {
    if (!request?.id) return;

    try {
      setActionLoading("request-reject");
      setError("");
      setRequestMessage("");

      const response = await rejectVolunteerRequest(request.id);

      setRequestMessage(
        response?.message || "Volunteer invitation declined successfully.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to decline the volunteer invitation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelVolunteerRequest = async () => {
    if (!request?.id) return;

    try {
      setActionLoading("request-cancel");
      setError("");
      setRequestMessage("");

      const response = await cancelVolunteerRequest(request.id);

      setRequestMessage(
        response?.message || "Your volunteer request has been cancelled.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to cancel your volunteer request.");
    } finally {
      setActionLoading(false);
    }
  };

  // ===========================================================
  // RESIGN
  // ===========================================================

  const handleOpenResignModal = () => {
    setError("");
    setRequestMessage("");
    setResignModalOpen(true);
  };

  const handleCloseResignModal = () => {
    if (actionLoading === "resign") {
      return;
    }

    setResignModalOpen(false);
  };

  const handleConfirmResign = async () => {
    try {
      setActionLoading("resign");
      setError("");
      setRequestMessage("");

      const response = await resignVolunteer();

      setRequestMessage(
        response?.message || "You have resigned as a volunteer successfully.",
      );

      setResignModalOpen(false);

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to resign as a volunteer.");
    } finally {
      setActionLoading(false);
    }
  };

  // ===========================================================
  // CAMPAIGN ASSIGNMENT ACTIONS
  // ===========================================================

  const handleAcceptAssignment = async (assignment) => {
    if (!assignment?.id) return;

    try {
      setAssignmentActionId(assignment.id);
      setError("");
      setRequestMessage("");

      const response = await acceptCampaignAssignment(assignment.id);

      setRequestMessage(
        response?.message || "Campaign assignment accepted successfully.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to accept the campaign assignment.");
    } finally {
      setAssignmentActionId(null);
    }
  };

  const handleRejectAssignment = async (assignment) => {
    if (!assignment?.id) return;

    const reason = window.prompt(
      "Please provide a reason for declining this campaign assignment:",
    );

    if (reason === null) {
      return;
    }

    const trimmedReason = reason.trim();

    if (trimmedReason.length < 5) {
      setError(
        "Please provide at least 5 characters explaining why you are declining the assignment.",
      );
      return;
    }

    try {
      setAssignmentActionId(assignment.id);
      setError("");
      setRequestMessage("");

      const response = await rejectCampaignAssignment(
        assignment.id,
        trimmedReason,
      );

      setRequestMessage(
        response?.message || "Campaign assignment declined successfully.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to decline the campaign assignment.");
    } finally {
      setAssignmentActionId(null);
    }
  };

  const handleStartAssignment = async (assignment) => {
    if (!assignment?.id) return;

    try {
      setAssignmentActionId(assignment.id);
      setError("");
      setRequestMessage("");

      const response = await startCampaignAssignment(assignment.id);

      setRequestMessage(
        response?.message || "Campaign activity has been started.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to start the campaign activity.");
    } finally {
      setAssignmentActionId(null);
    }
  };

  const handleCompleteAssignment = async (assignment) => {
    if (!assignment?.id) return;

    try {
      setAssignmentActionId(assignment.id);
      setError("");
      setRequestMessage("");

      const response = await completeCampaignAssignment(assignment.id);

      setRequestMessage(
        response?.message || "Campaign activity completed successfully.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(err?.message || "Unable to complete the campaign activity.");
    } finally {
      setAssignmentActionId(null);
    }
  };

  const handleRequestWithdrawal = async (assignment) => {
    if (!assignment?.id) return;

    const reason = window.prompt(
      "Please provide a reason for requesting withdrawal from this campaign:",
    );

    if (reason === null) {
      return;
    }

    const trimmedReason = reason.trim();

    if (trimmedReason.length < 5) {
      setError(
        "Please provide at least 5 characters explaining why you want to withdraw.",
      );
      return;
    }

    try {
      setAssignmentActionId(assignment.id);
      setError("");
      setRequestMessage("");

      const response = await requestCampaignWithdrawal(
        assignment.id,
        trimmedReason,
      );

      setRequestMessage(
        response?.message || "Your withdrawal request has been submitted.",
      );

      await loadVolunteerData();
    } catch (err) {
      setError(
        err?.message || "Unable to submit the campaign withdrawal request.",
      );
    } finally {
      setAssignmentActionId(null);
    }
  };

  // ===========================================================
  // DERIVED ASSIGNMENTS
  // ===========================================================

  const pendingAssignments = useMemo(
    () => assignments.filter((assignment) => assignment?.status === "assigned"),
    [assignments],
  );

  const activeAssignments = useMemo(
    () =>
      assignments.filter((assignment) =>
        ["accepted", "in_progress", "withdrawal_requested"].includes(
          assignment?.status,
        ),
      ),
    [assignments],
  );

  const stats = useMemo(() => {
    return {
      total: assignments.length,

      pending: assignments.filter((item) => item?.status === "assigned").length,

      active: assignments.filter((item) =>
        ["accepted", "in_progress", "withdrawal_requested"].includes(
          item?.status,
        ),
      ).length,

      completed: assignments.filter((item) => item?.status === "completed")
        .length,
    };
  }, [assignments]);

  const activityRows = useMemo(
    () =>
      assignments
        .filter((assignment) =>
          [
            "assigned",
            "accepted",
            "in_progress",
            "completed",
            "rejected",
            "withdrawal_requested",
            "withdrawn",
          ].includes(assignment?.status),
        )
        .map((assignment) => ({
          ...assignment,
          campaign_title: assignment?.campaign?.title || "Untitled campaign",
          location: getCampaignLocation(assignment?.campaign),
        })),
    [assignments],
  );

  // ===========================================================
  // TABLE
  // ===========================================================

  const assignmentColumns = useMemo(
    () => [
      {
        key: "campaign_title",
        header: "Campaign",
        sortable: true,

        render: (value, row) => (
          <div className="min-w-[220px]">
            <p className="font-semibold text-slate-900">{row.campaign_title}</p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />

              <span>{row.location}</span>
            </div>
          </div>
        ),
      },

      {
        key: "status",
        header: "Status",
        sortable: true,

        render: (value, row) => {
          const config = statusConfig[row?.status] || statusConfig.assigned;

          const Icon = config.icon;

          return (
            <span
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}>
              <Icon className="h-3.5 w-3.5" />

              {config.label}
            </span>
          );
        },
      },

      {
        key: "assigned_at",
        header: "Assigned",
        sortable: true,

        render: (value, row) => (
          <span className="whitespace-nowrap text-sm text-slate-600">
            {formatDate(row?.assigned_at)}
          </span>
        ),
      },

      {
        key: "response_at",
        header: "Response",
        sortable: false,

        render: (value, row) => {
          if (row?.status === "rejected") {
            return (
              <div className="min-w-[130px]">
                <p className="text-sm font-medium text-red-700">Declined</p>

                {row?.rejection_reason && (
                  <p
                    className="mt-1 max-w-[220px] truncate text-xs text-slate-500"
                    title={row.rejection_reason}>
                    {row.rejection_reason}
                  </p>
                )}
              </div>
            );
          }

          if (
            [
              "accepted",
              "in_progress",
              "completed",
              "withdrawal_requested",
              "withdrawn",
            ].includes(row?.status)
          ) {
            return (
              <span className="whitespace-nowrap text-sm font-medium text-emerald-700">
                Accepted
              </span>
            );
          }

          return (
            <span className="text-sm text-slate-400">Awaiting response</span>
          );
        },
      },

      {
        key: "completed_at",
        header: "Completed",
        sortable: true,

        render: (value, row) => (
          <span className="whitespace-nowrap text-sm text-slate-600">
            {formatDate(row?.completed_at)}
          </span>
        ),
      },
    ],
    [],
  );

  // ===========================================================
  // LOADING
  // ===========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Volunteer Activities"
          description="Manage your volunteer assignments and campaign activities."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#0f766e]" />
            Loading your volunteer activities...
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================
  // PAGE
  // ===========================================================

  return (
    <div className="space-y-7">
      <PageHeader
        title="My Volunteer Activities"
        description="Manage your campaign assignments and track your humanitarian contributions."
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {requestMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {requestMessage}
        </div>
      )}

      <VolunteerStatusPanel
        volunteer={volunteer}
        request={request}
        actionLoading={actionLoading}
        onSendRequest={handleSendVolunteerRequest}
        onAcceptRequest={handleAcceptVolunteerRequest}
        onRejectRequest={handleRejectVolunteerRequest}
        onCancelRequest={handleCancelVolunteerRequest}
        onRequestReactivation={handleRequestReactivation}
        onResign={handleOpenResignModal}
      />

      {volunteer && (
        <>
          {/* =================================================
              STATS
          ================================================= */}

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.total}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Campaign assignments
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-800">
                {stats.pending}
              </p>

              <p className="mt-1 text-xs text-amber-700/70">
                Awaiting your response
              </p>
            </div>

            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                Active
              </p>

              <p className="mt-2 text-2xl font-bold text-teal-800">
                {stats.active}
              </p>

              <p className="mt-1 text-xs text-teal-700/70">
                Current activities
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-800">
                {stats.completed}
              </p>

              <p className="mt-1 text-xs text-emerald-700/70">
                Finished activities
              </p>
            </div>
          </section>

          {/* =================================================
              PENDING ASSIGNMENTS
          ================================================= */}

          {pendingAssignments.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Campaign Assignments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review the campaigns you have been invited to support.
                  </p>
                </div>

                <span className="text-sm font-medium text-slate-400">
                  {pendingAssignments.length} pending
                </span>
              </div>

              <div className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <CampaignAssignmentRequest
                    key={assignment.id}
                    assignment={assignment}
                    actionLoading={assignmentActionId}
                    onAccept={handleAcceptAssignment}
                    onReject={handleRejectAssignment}
                  />
                ))}
              </div>
            </section>
          )}

          {/* =================================================
              CURRENT ACTIVITIES
          ================================================= */}

          {activeAssignments.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Current Activities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Campaign assignments you have accepted or started.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {activeAssignments.map((assignment) => {
                  const campaign = assignment?.campaign;
                  const isLoading = assignmentActionId === assignment?.id;

                  const config =
                    statusConfig[assignment?.status] || statusConfig.accepted;

                  const Icon = config.icon;

                  return (
                    <div
                      key={assignment.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Active Campaign
                          </p>

                          <h3 className="mt-1 text-base font-semibold leading-6 text-slate-900">
                            {campaign?.title || "Untitled campaign"}
                          </h3>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}>
                          <Icon className="h-3.5 w-3.5" />

                          {config.label}
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" />

                          {getCampaignLocation(campaign)}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          Assigned {formatDate(assignment?.assigned_at)}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        {assignment?.status === "accepted" && (
                          <>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleStartAssignment(assignment)}
                              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50">
                              <PlayCircle className="mr-2 h-4 w-4" />

                              {isLoading ? "Processing..." : "Start Activity"}
                            </button>

                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleRequestWithdrawal(assignment)
                              }
                              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50">
                              <LogOut className="mr-2 h-4 w-4" />

                              {isLoading
                                ? "Processing..."
                                : "Request Withdrawal"}
                            </button>
                          </>
                        )}

                        {assignment?.status === "in_progress" && (
                          <>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleCompleteAssignment(assignment)
                              }
                              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
                              <CheckCircle2 className="mr-2 h-4 w-4" />

                              {isLoading ? "Processing..." : "Mark Completed"}
                            </button>

                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                handleRequestWithdrawal(assignment)
                              }
                              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50">
                              <LogOut className="mr-2 h-4 w-4" />

                              {isLoading
                                ? "Processing..."
                                : "Request Withdrawal"}
                            </button>
                          </>
                        )}

                        {assignment?.status === "withdrawal_requested" && (
                          <div className="flex w-full items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
                            <Clock3 className="h-4 w-4 shrink-0" />
                            Your withdrawal request is awaiting admin review.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =================================================
              EMPTY ASSIGNMENT STATE
          ================================================= */}

          {assignments.length === 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <CalendarDays className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">
                No campaign assignments yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When an organization assigns you to a campaign, the assignment
                will appear here.
              </p>
            </section>
          )}

          {/* =================================================
              ACTIVITY HISTORY
          ================================================= */}

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Activity History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A record of your campaign assignments and their current status.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <DataTable columns={assignmentColumns} rows={activityRows} />
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          RESIGN CONFIRMATION MODAL
      ===================================================== */}

      <ResignConfirmationModal
        open={resignModalOpen}
        loading={actionLoading === "resign"}
        onCancel={handleCloseResignModal}
        onConfirm={handleConfirmResign}
      />
    </div>
  );
};

export default MyVolunteerActivities;
