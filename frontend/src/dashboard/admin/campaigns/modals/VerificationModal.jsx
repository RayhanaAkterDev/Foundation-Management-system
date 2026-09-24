import React, { useState } from "react";

import {
  X,
  CircleCheck,
  CircleX,
  LoaderCircle,
  ShieldCheck,
  MessageSquareText,
} from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";

const VerificationModal = ({
  campaign,
  loading = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [verificationNote, setVerificationNote] = useState("");

  if (!campaign) {
    return null;
  }

  const options = [
    {
      status: "active",
      label: "Approve campaign",
      description: "Make this campaign active and available for fundraising.",
      icon: CircleCheck,
      wrapper:
        "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40",
      selectedWrapper:
        "border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-100",
      iconClass: "bg-emerald-50 text-emerald-600",
      selectedIconClass: "bg-emerald-600 text-white",
    },
    {
      status: "rejected",
      label: "Reject campaign",
      description:
        "Decline this campaign when it does not meet platform requirements.",
      icon: CircleX,
      wrapper:
        "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/40",
      selectedWrapper: "border-red-400 bg-red-50/70 ring-2 ring-red-100",
      iconClass: "bg-red-50 text-red-600",
      selectedIconClass: "bg-red-600 text-white",
    },
  ];

  const currentStatus = campaign.status || "unknown";
  const isUnverified = campaign.status === "unverified";
  const isRejecting = selectedStatus === "rejected";
  const rejectionNoteMissing = isRejecting && !verificationNote.trim();

  const handleSelectStatus = (status) => {
    if (loading || !isUnverified) {
      return;
    }

    if (status !== "active" && status !== "rejected") {
      return;
    }

    setSelectedStatus(status);
  };

  const handleConfirm = () => {
    if (loading || !selectedStatus || !isUnverified) {
      return;
    }

    const note = verificationNote.trim();

    if (selectedStatus === "rejected" && !note) {
      return;
    }

    onConfirm({
      status: selectedStatus,
      verification_note: note || null,
    });
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setSelectedStatus(null);
    setVerificationNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[5px] sm:p-6">
      <div
        className="absolute inset-0"
        onClick={!loading ? handleClose : undefined}
      />

      <div className="relative z-10 w-full max-w-130 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
        {/* Header */}

        <div className="relative border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close">
            <X size={17} strokeWidth={1.8} />
          </button>

          <div className="flex items-center gap-3.5 pr-9">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={20} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Verify campaign
              </h2>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {campaign.title || "Untitled campaign"}
              </p>
            </div>
          </div>
        </div>

        {/* Campaign summary */}

        <div className="border-b border-slate-100 px-6 py-4 sm:px-7">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
            <p className="min-w-0 truncate text-sm font-semibold text-slate-800">
              {campaign.title || "Untitled campaign"}
            </p>

            <div className="shrink-0">
              <StatusBadge status={currentStatus} />
            </div>
          </div>
        </div>

        {/* Content */}

        <div className="px-6 py-5 sm:px-7">
          {!isUnverified && (
            <div className="mb-4 border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800">
                This campaign cannot be verified.
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Only campaigns with the status <strong>unverified</strong> can
                be approved or rejected.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold text-red-700">
                Verification failed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">{error}</p>
            </div>
          )}

          {/* Decisions */}

          <div className="space-y-2.5">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedStatus === option.status;
              const isSubmitting = loading && isSelected;

              return (
                <button
                  key={option.status}
                  type="button"
                  disabled={loading || !isUnverified}
                  onClick={() => handleSelectStatus(option.status)}
                  className={`group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 disabled:cursor-not-allowed ${
                    isSelected ? option.selectedWrapper : option.wrapper
                  } ${loading && !isSelected ? "opacity-40" : ""} ${
                    !isUnverified ? "cursor-not-allowed opacity-50" : ""
                  }`}>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? option.selectedIconClass : option.iconClass
                    }`}>
                    {isSubmitting ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Icon size={18} />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">
                      {option.label}
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                      {option.description}
                    </span>
                  </span>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? option.status === "active"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-red-500 bg-red-500"
                        : "border-slate-300 bg-white"
                    }`}>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Note */}

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquareText size={14} className="text-slate-400" />

              <label
                htmlFor="verification-note"
                className="text-xs font-semibold text-slate-800">
                Verification note
              </label>

              {isRejecting && (
                <span className="text-[10px] font-medium text-red-500">
                  Required
                </span>
              )}
            </div>

            <textarea
              id="verification-note"
              value={verificationNote}
              onChange={(event) => setVerificationNote(event.target.value)}
              disabled={loading || !isUnverified}
              rows={3}
              placeholder={
                isRejecting
                  ? "Explain why this campaign is being rejected..."
                  : "Add a note about this verification decision..."
              }
              className={`w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                rejectionNoteMissing
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-primary focus:ring-primary/10"
              }`}
            />

            {rejectionNoteMissing && (
              <p className="mt-1.5 text-[11px] font-medium text-red-600">
                A note is required when rejecting a campaign.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:px-7">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading ||
              !selectedStatus ||
              !isUnverified ||
              rejectionNoteMissing
            }
            onClick={handleConfirm}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isRejecting
                ? "bg-red-600 shadow-red-600/20 hover:bg-red-700"
                : "bg-primary shadow-primary/20 hover:bg-primary-hover"
            }`}>
            {loading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Processing...
              </>
            ) : isRejecting ? (
              <>
                <CircleX size={16} />
                Reject Campaign
              </>
            ) : selectedStatus === "active" ? (
              <>
                <CircleCheck size={16} />
                Approve Campaign
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
