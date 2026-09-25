import { useState } from "react";

import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageSquareText,
  Pencil,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import UrgencyBadge from "./UrgencyBadge";
import { formatCurrency } from "../utils/helpRequestUtils";

const categories = [
  "Education",
  "Healthcare",
  "Food Assistance",
  "Shelter",
  "Livelihood",
  "Disaster Relief",
  "Other",
];

// =========================================================
// HELPERS
// =========================================================

const getProgressLabel = (status) => {
  if (status === "completed") return "Completed";
  if (status === "active" || status === "in_progress") return "In progress";
  if (status === "accepted") return "Accepted";
  if (status === "assigned") return "Awaiting response";

  return "Not started";
};

const getProgressSteps = (status) => {
  const normalizedStatus = status === "in_progress" ? "active" : status;

  const stages = ["assigned", "accepted", "active", "completed"];

  const currentIndex = stages.indexOf(normalizedStatus);

  return stages.map((stage, index) => ({
    key: stage,
    label:
      stage === "assigned"
        ? "Assigned"
        : stage === "accepted"
          ? "Accepted"
          : stage === "active"
            ? "Support"
            : "Completed",
    active: currentIndex >= 0 && index <= currentIndex,
    current: stage === normalizedStatus,
  }));
};

// =========================================================
// EDIT PANEL
// =========================================================

const EditCasePanel = ({
  request,
  onUpdateAssignment,
  actionLoading,
  onCancel,
}) => {
  const [category, setCategory] = useState(request.category || "");
  const [urgency, setUrgency] = useState(request.urgency || "normal");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!request.assignmentId) {
      setError(
        "Assignment information is missing. Please refresh the page and try again.",
      );
      return;
    }

    if (!onUpdateAssignment) {
      setError(
        "Update function is not available. Please refresh the page and try again.",
      );
      return;
    }

    const trimmedCategory = category.trim();

    if (!trimmedCategory) {
      setError("Please select a category.");
      return;
    }

    if (!["low", "normal", "high", "critical"].includes(urgency)) {
      setError("Please select a valid priority.");
      return;
    }

    const fields = {
      category: trimmedCategory,
      urgency,
    };

    try {
      const success = await onUpdateAssignment(request.assignmentId, fields);

      if (!success) {
        setError(
          "The case could not be updated. Please check the error message and try again.",
        );
        return;
      }

      onCancel();
    } catch (err) {
      console.error("Case update failed:", err);

      setError(
        err?.message || "The case could not be updated. Please try again.",
      );
    }
  };

  return (
    <div className="mt-5 rounded-xl border border-[#d9e3e0] bg-[#f8faf9] p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-[10px] font-medium text-[#64777b]">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#d4dfdc] bg-white px-3 text-[11px] text-[#243b40] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10">
            <option value="">Select category</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-medium text-[#64777b]">
            Priority
          </label>

          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="h-10 w-full rounded-lg border border-[#d4dfdc] bg-white px-3 text-[11px] capitalize text-[#243b40] outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-[#fff6f4] px-3 py-2 text-[10px] leading-4 text-[#92584e]">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-lg px-4 text-[10px] font-semibold text-[#66787c] hover:bg-white">
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={actionLoading}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0f766e] px-4 text-[10px] font-semibold text-white hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50">
          {actionLoading ? (
            <RotateCcw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save changes
        </button>
      </div>
    </div>
  );
};

// =========================================================
// STATUS NOTICE
// =========================================================

const StatusNotice = ({ type }) => {
  if (type === "withdrawal") {
    return (
      <div className="mb-7 flex gap-3 rounded-xl border border-[#eadfc8] bg-[#fffbf2] px-4 py-3.5">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#9b7e47]" />

        <div>
          <p className="text-[11px] font-semibold text-[#5d5035]">
            Withdrawal request under review
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#806f4e]">
            Administration is reviewing the request. This assignment remains
            active until a decision is made.
          </p>
        </div>
      </div>
    );
  }

  if (type === "assigned") {
    return (
      <div className="mb-7 flex gap-3 rounded-xl border border-[#d7e8e4] bg-[#f2f9f7] px-4 py-3.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />

        <div>
          <p className="text-[11px] font-semibold text-[#294b4b]">
            This assignment needs your decision
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#668084]">
            Review the request and decide whether your organization can provide
            support.
          </p>
        </div>
      </div>
    );
  }

  if (type === "accepted") {
    return (
      <div className="mb-7 flex gap-3 rounded-xl border border-[#d7e8e4] bg-[#f2f9f7] px-4 py-3.5">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />

        <div>
          <p className="text-[11px] font-semibold text-[#294b4b]">
            Assignment accepted
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#668084]">
            Your organization has accepted this case and can now begin providing
            support.
          </p>
        </div>
      </div>
    );
  }

  if (type === "active") {
    return (
      <div className="mb-7 flex gap-3 rounded-xl border border-[#d7e8e4] bg-[#f2f9f7] px-4 py-3.5">
        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />

        <div>
          <p className="text-[11px] font-semibold text-[#294b4b]">
            Support is currently active
          </p>

          <p className="mt-1 text-[10px] leading-5 text-[#668084]">
            Your organization is currently handling this case.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

// =========================================================
// ACTION ITEM
// =========================================================

const CommandAction = ({
  icon: Icon,
  title,
  description,
  onClick,
  danger = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#f6f9f8] disabled:cursor-not-allowed disabled:opacity-50">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          danger ? "bg-[#fff1ef] text-[#a65c51]" : "bg-[#e9f4f1] text-[#0f766e]"
        }`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[11px] font-semibold ${
            danger ? "text-[#805048]" : "text-[#30484e]"
          }`}>
          {title}
        </p>

        <p className="mt-1 text-[9px] leading-4 text-[#829195]">
          {description}
        </p>
      </div>

      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#a0abad] transition-transform group-hover:translate-x-0.5" />
    </button>
  );
};

// =========================================================
// FOOTER
// =========================================================

const DrawerFooter = ({
  request,
  onClose,
  onAction,
  onStartSupport,
  actionLoading,
}) => {
  const withdrawalPending = request.withdrawalStatus === "pending";

  /*
   * IMPORTANT:
   *
   * request.status is the Help Request lifecycle status.
   * request.assignmentStatus is the actual organization
   * assignment status.
   *
   * We must use assignmentStatus to decide whether the
   * organization can Accept/Decline or Start Support.
   */

  const assignmentStatus = String(
    request.assignmentStatus || request.rawAssignment?.status || "",
  ).toLowerCase();

  const helpRequestStatus = String(
    request.helpRequestStatus || request.rawHelpRequest?.status || "",
  ).toLowerCase();

  if (withdrawalPending) {
    return (
      <div className="flex items-center justify-between border-t border-[#dce5e3] bg-white px-7 py-4">
        <div>
          <p className="text-[11px] font-semibold text-[#4d6166]">
            Awaiting administration
          </p>

          <p className="mt-0.5 text-[9px] text-[#8b999c]">
            The withdrawal request is being reviewed.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg border border-[#d4dfdc] px-5 text-[10px] font-semibold text-[#465b60] hover:bg-[#f7f9f8]">
          Close
        </button>
      </div>
    );
  }

  /*
   * PENDING ASSIGNMENT
   *
   * Only a genuinely pending assignment can be
   * accepted or rejected.
   */
  if (assignmentStatus === "pending") {
    return (
      <div className="flex items-center justify-between border-t border-[#dce5e3] bg-white px-7 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-2 text-[10px] font-semibold text-[#738287] hover:text-[#30484e]">
          Close
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onAction(request, "reject")}
            disabled={actionLoading}
            className="h-9 rounded-lg border border-[#d4dfdc] px-5 text-[10px] font-semibold text-[#5f7075] hover:bg-[#f7f9f8] disabled:opacity-50">
            Decline
          </button>

          <button
            type="button"
            onClick={() => onAction(request, "accept")}
            disabled={actionLoading}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#0f766e] px-5 text-[10px] font-semibold text-white hover:bg-[#115e59] disabled:opacity-50">
            {actionLoading ? (
              <RotateCcw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Accept assignment
          </button>
        </div>
      </div>
    );
  }

  /*
   * ACCEPTED ASSIGNMENT
   *
   * The assignment remains "accepted" even after the
   * organization starts support.
   *
   * Start Support creates the Local Case Campaign.
   */
  if (assignmentStatus === "accepted" && helpRequestStatus === "verified") {
    return (
      <div className="flex items-center justify-between border-t border-[#dce5e3] bg-white px-7 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-2 text-[10px] font-semibold text-[#738287] hover:text-[#30484e]">
          Close
        </button>

        <button
          type="button"
          onClick={() => onStartSupport?.(request)}
          disabled={actionLoading}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0f766e] px-5 text-[10px] font-semibold text-white hover:bg-[#115e59] disabled:opacity-50">
          {actionLoading ? (
            <RotateCcw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" />
          )}
          Start support
        </button>
      </div>
    );
  }

  /*
   * ONGOING
   *
   * The Help Request is now in_progress.
   * Only Close is available.
   */
  if (
    helpRequestStatus === "in_progress" ||
    request.status === "active" ||
    request.status === "in_progress"
  ) {
    return (
      <div className="flex justify-end border-t border-[#dce5e3] bg-white px-7 py-4">
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg border border-[#d4dfdc] px-5 text-[10px] font-semibold text-[#465b60] hover:bg-[#f7f9f8]">
          Close
        </button>
      </div>
    );
  }

  /*
   * COMPLETED / REJECTED / OTHER TERMINAL STATES
   */
  return (
    <div className="flex justify-end border-t border-[#dce5e3] bg-white px-7 py-4">
      <button
        type="button"
        onClick={onClose}
        className="h-9 rounded-lg border border-[#d4dfdc] px-5 text-[10px] font-semibold text-[#465b60] hover:bg-[#f7f9f8]">
        Close
      </button>
    </div>
  );
};

// =========================================================
// MAIN DRAWER
// =========================================================

const CaseReviewDrawer = ({
  request,
  onClose,
  onAction,
  onStartSupport,
  actionLoading,
  statusConfig,
  onUpdateAssignment,
  onRequestWithdrawal,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!request) return null;

  const config = statusConfig[request.status] || {
    label: request.status,
  };

  const withdrawalPending = request.withdrawalStatus === "pending";

  const canEdit =
    !withdrawalPending &&
    (request.status === "accepted" ||
      request.status === "active" ||
      request.status === "in_progress");

  const canRequestWithdrawal =
    !withdrawalPending &&
    (request.status === "accepted" ||
      request.status === "active" ||
      request.status === "in_progress");

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const amount =
    request.amountNeeded || request.amount
      ? formatCurrency(request.amountNeeded || request.amount)
      : null;

  const requesterName =
    request.requesterName || request.requester?.name || "Unknown requester";

  const requesterLocation =
    request.address ||
    request.requesterAddress ||
    request.district ||
    "Location not provided";

  const progress = Math.min(request.progress || 0, 100);

  const progressSteps = getProgressSteps(request.status);

  const isOngoing =
    request.status === "active" || request.status === "in_progress";

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close case review"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#10282c]/55 backdrop-blur-[1px]"
      />

      {/* DRAWER */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[900px] flex-col overflow-hidden bg-white shadow-[-20px_0_60px_rgba(17,38,42,0.18)]">
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-[#e2e9e7] px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eaf4f1]">
              <BriefcaseBusiness
                className="h-4 w-4 text-[#0f766e]"
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#334a50]">
                Case review
              </p>

              <p className="mt-0.5 font-mono text-[9px] text-[#9aa6a9]">
                #{request.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#829195] hover:bg-[#f4f7f6] hover:text-[#334a50]">
            <X className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </header>

        {/* SCROLLING CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* CASE INTRO */}
          <section className="border-b border-[#e2e9e7] bg-[#f8faf9] px-8 py-7">
            <div className="flex items-start justify-between gap-8">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e6f3f0] px-2.5 py-1 text-[9px] font-semibold text-[#0f766e]">
                    {config?.label || request.status}
                  </span>

                  <UrgencyBadge urgency={request.urgency} />
                </div>

                <h1 className="max-w-[680px] text-[27px] font-semibold leading-[1.2] tracking-[-0.04em] text-[#1d343a]">
                  {request.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-[#7c8d91]">
                  <span className="flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5" />
                    {requesterName}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {requesterLocation}
                  </span>
                </div>
              </div>

              {amount && (
                <div className="shrink-0 border-l border-[#dce5e3] pl-7 text-right">
                  <p className="text-[10px] text-[#829195]">Amount needed</p>

                  <p className="mt-1 text-[21px] font-semibold tracking-[-0.035em] text-[#0f766e]">
                    {amount}
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="px-8 py-8">
            <div className="grid grid-cols-[minmax(0,1fr)_250px] gap-9">
              {/* MAIN */}
              <main className="min-w-0">
                <StatusNotice
                  type={
                    withdrawalPending
                      ? "withdrawal"
                      : request.assignmentStatus === "pending"
                        ? "assigned"
                        : request.assignmentStatus === "accepted" &&
                            request.helpRequestStatus === "verified"
                          ? "accepted"
                          : isOngoing
                            ? "active"
                            : null
                  }
                />

                {/* DESCRIPTION */}
                <section>
                  <div className="mb-4 flex items-center gap-2.5">
                    <FileText
                      className="h-4 w-4 text-[#0f766e]"
                      strokeWidth={1.5}
                    />

                    <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#273e44]">
                      Request details
                    </h2>
                  </div>

                  <div className="border-l-2 border-[#d9e9e5] pl-5">
                    <p className="text-[13px] leading-[2] text-[#52676c]">
                      {request.description ||
                        "No additional description was provided for this request."}
                    </p>
                  </div>
                </section>

                {/* PEOPLE */}
                <section className="mt-10">
                  <div className="mb-4 flex items-center gap-2.5">
                    <UserRound
                      className="h-4 w-4 text-[#0f766e]"
                      strokeWidth={1.5}
                    />

                    <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#273e44]">
                      Requester
                    </h2>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-[#f7f9f8] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3f1ed] text-[#0f766e]">
                        <UserRound className="h-4 w-4" strokeWidth={1.5} />
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold text-[#30464c]">
                          {requesterName}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[9px] text-[#89979a]">
                          <MapPin className="h-3 w-3" />
                          {requesterLocation}
                        </p>
                      </div>
                    </div>

                    <div className="max-w-[180px] text-right">
                      <p className="text-[9px] leading-4 text-[#87969a]">
                        {request.assignmentNote ||
                          request.note ||
                          "No additional administrative note has been provided."}
                      </p>
                    </div>
                  </div>
                </section>

                {/* LIFECYCLE */}
                {(request.status === "assigned" ||
                  request.status === "accepted" ||
                  request.status === "active" ||
                  request.status === "in_progress" ||
                  request.status === "completed" ||
                  withdrawalPending) && (
                  <section className="mt-10">
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <Activity
                            className="h-4 w-4 text-[#0f766e]"
                            strokeWidth={1.5}
                          />

                          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-[#273e44]">
                            Support progress
                          </h2>
                        </div>

                        <p className="mt-1.5 text-[10px] text-[#8a999c]">
                          Follow the case through each stage of support.
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[18px] font-semibold text-[#30474d]">
                          {progress}%
                        </p>

                        <p className="text-[9px] text-[#89979a]">
                          {getProgressLabel(request.status)}
                        </p>
                      </div>
                    </div>

                    <div className="relative pl-2">
                      <div className="absolute bottom-4 left-[7px] top-4 w-px bg-[#dce6e3]" />

                      <div
                        className="absolute left-[7px] top-4 w-px bg-[#0f766e] transition-all duration-500"
                        style={{
                          height:
                            request.status === "completed"
                              ? "calc(100% - 32px)"
                              : isOngoing
                                ? "66%"
                                : request.status === "accepted"
                                  ? "33%"
                                  : "0%",
                        }}
                      />

                      <div className="space-y-6">
                        {progressSteps.map((step) => (
                          <div
                            key={step.key}
                            className="relative flex items-start gap-4">
                            <div
                              className={`relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                                step.active
                                  ? "border-[#0f766e] bg-[#0f766e]"
                                  : "border-[#cbd8d5] bg-white"
                              }`}>
                              {step.active && (
                                <span className="h-1 w-1 rounded-full bg-white" />
                              )}
                            </div>

                            <div className="-mt-0.5">
                              <p
                                className={`text-[11px] font-semibold ${
                                  step.current
                                    ? "text-[#0f766e]"
                                    : step.active
                                      ? "text-[#445b60]"
                                      : "text-[#9aa6a9]"
                                }`}>
                                {step.label}
                              </p>

                              {step.current && (
                                <p className="mt-1 text-[9px] text-[#89979a]">
                                  Current stage
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </main>

              {/* RIGHT INFORMATION RAIL */}
              <aside className="min-w-0">
                <div className="sticky top-0">
                  {/* CASE FACTS */}
                  <section>
                    <h3 className="mb-4 text-[11px] font-semibold text-[#42585d]">
                      Case information
                    </h3>

                    <div className="space-y-5">
                      <div>
                        <p className="text-[9px] text-[#95a1a4]">Category</p>

                        <p className="mt-1 text-[11px] font-semibold text-[#344a50]">
                          {request.category || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#95a1a4]">District</p>

                        <p className="mt-1 text-[11px] font-semibold text-[#344a50]">
                          {request.district || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#95a1a4]">
                          Support type
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-[#344a50]">
                          {request.supportType ||
                            request.resourceType ||
                            "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-[#95a1a4]">Received</p>

                        <p className="mt-1 text-[11px] font-semibold text-[#344a50]">
                          {request.createdAt ||
                            request.submittedAt ||
                            "Not provided"}
                        </p>
                      </div>

                      {request.peopleAffected && (
                        <div>
                          <p className="text-[9px] text-[#95a1a4]">
                            People affected
                          </p>

                          <p className="mt-1 text-[11px] font-semibold text-[#344a50]">
                            {request.peopleAffected}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* CLASSIFICATION */}
                  {canEdit && (
                    <section className="mt-9 border-t border-[#e4eae8] pt-7">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-semibold text-[#42585d]">
                          Classification
                        </h3>

                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 text-[9px] font-semibold text-[#0f766e] hover:text-[#115e59]">
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>
                        )}
                      </div>

                      {!isEditing ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="text-[9px] text-[#95a1a4]">
                              Category
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-[#344a50]">
                              {request.category || "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] text-[#95a1a4]">
                              Priority
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  request.urgency === "critical"
                                    ? "bg-red-500"
                                    : request.urgency === "high"
                                      ? "bg-orange-400"
                                      : request.urgency === "low"
                                        ? "bg-slate-400"
                                        : "bg-[#0f766e]"
                                }`}
                              />

                              <span className="text-[11px] font-semibold capitalize text-[#344a50]">
                                {request.urgency || "Normal"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <EditCasePanel
                          request={request}
                          onUpdateAssignment={onUpdateAssignment}
                          actionLoading={actionLoading}
                          onCancel={handleCancelEdit}
                        />
                      )}
                    </section>
                  )}

                  {/* ACTIONS */}
                  {canRequestWithdrawal && (
                    <section className="mt-9 border-t border-[#e4eae8] pt-7">
                      <h3 className="text-[11px] font-semibold text-[#42585d]">
                        Case actions
                      </h3>

                      <div className="mt-3 space-y-1">
                        <CommandAction
                          icon={MessageSquareText}
                          title="Request additional support"
                          description="Notify administration if additional resources or coordination are needed."
                          onClick={() =>
                            onRequestWithdrawal?.(request, "additional_support")
                          }
                          disabled={actionLoading}
                        />

                        <CommandAction
                          icon={RotateCcw}
                          title="Request withdrawal"
                          description="Ask administration to review a withdrawal request."
                          danger
                          onClick={() =>
                            onRequestWithdrawal?.(request, "withdrawal")
                          }
                          disabled={actionLoading}
                        />
                      </div>
                    </section>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DrawerFooter
          request={request}
          onClose={handleClose}
          onAction={onAction}
          onStartSupport={onStartSupport}
          actionLoading={actionLoading}
        />
      </aside>
    </div>
  );
};

export default CaseReviewDrawer;
