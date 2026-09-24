import React, { useState } from "react";
import { CheckCircle2, Loader2, ShieldAlert, UserRound, X } from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    description: "Volunteer can receive new campaign assignments.",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    activeClass: "border-emerald-300 bg-emerald-50",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Volunteer is temporarily unavailable for assignments.",
    icon: UserRound,
    iconClass: "text-slate-500",
    activeClass: "border-slate-300 bg-slate-50",
  },
  {
    value: "suspended",
    label: "Suspended",
    description: "Volunteer is restricted from receiving assignments.",
    icon: ShieldAlert,
    iconClass: "text-rose-600",
    activeClass: "border-rose-300 bg-rose-50",
  },
];

const EditModal = ({
  open,
  volunteer,
  loading = false,
  saving = false,
  error = "",
  onClose,
  onSave,
}) => {
  const initialStatus = volunteer?.status || "inactive";

  const [status, setStatus] = useState(initialStatus);

  if (!open) {
    return null;
  }

  const volunteerName =
    volunteer?.user?.name ||
    volunteer?.name ||
    volunteer?.volunteerName ||
    "Unknown volunteer";

  const volunteerEmail =
    volunteer?.user?.email || volunteer?.email || "No email available";

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!volunteer?.id || saving) {
      return;
    }

    await onSave?.(volunteer.id, status);
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/45
        px-4 py-6
        backdrop-blur-[2px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-volunteer-title">
      <div
        className="
          flex w-full max-w-lg
          max-h-[90vh]
          flex-col
          overflow-hidden
          border border-border
          bg-surface
          shadow-2xl
        ">
        {/* HEADER */}
        <div className="shrink-0 border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-primary" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Volunteer administration
                </span>
              </div>

              <h2
                id="edit-volunteer-title"
                className="
                  font-fraunces
                  text-[25px]
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-text-primary
                ">
                Update volunteer status
              </h2>

              <p className="mt-1.5 text-[12px] leading-5 text-text-secondary">
                Change the volunteer's current administrative status.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              title="Close"
              aria-label="Close"
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                border border-border
                text-text-secondary
                transition-colors
                hover:border-text-secondary/30
                hover:bg-background
                hover:text-text-primary
                disabled:cursor-not-allowed
                disabled:opacity-50
              ">
              <X size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-60 items-center justify-center px-6">
              <div className="text-center">
                <Loader2
                  size={25}
                  className="mx-auto mb-3 animate-spin text-primary"
                />

                <p className="text-sm font-semibold text-text-primary">
                  Loading volunteer...
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Retrieving volunteer information.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* VOLUNTEER SUMMARY */}
              <div className="border-b border-border bg-background px-6 py-5">
                <div className="flex items-center gap-3.5">
                  <div
                    className="
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      bg-primary/10
                      text-sm font-bold
                      text-primary
                    ">
                    {volunteerName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {volunteerName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                      {volunteerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="px-6 py-6">
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                    Volunteer status
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Status controls whether this volunteer can participate in
                    new campaign assignments.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {STATUS_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const selected = status === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setStatus(option.value)}
                        disabled={saving}
                        className={`
                          flex w-full
                          items-start gap-3
                          border
                          px-4 py-3.5
                          text-left
                          transition-all
                          ${
                            selected
                              ? option.activeClass
                              : "border-border bg-surface hover:border-text-secondary/30 hover:bg-background"
                          }
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        `}>
                        <span
                          className={`
                            mt-0.5 flex h-7 w-7 shrink-0
                            items-center justify-center
                            ${selected ? "bg-white" : "bg-background-alt"}
                          `}>
                          <Icon
                            size={15}
                            strokeWidth={1.9}
                            className={option.iconClass}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-3">
                            <span className="text-[13px] font-semibold text-text-primary">
                              {option.label}
                            </span>

                            {selected && (
                              <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                                Selected
                              </span>
                            )}
                          </span>

                          <span className="mt-0.5 block text-[11px] leading-4 text-text-secondary">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="mt-5 border-l-4 border-red-500 bg-red-50 px-4 py-3">
                    <p className="text-xs font-medium leading-5 text-red-600">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div
                className="
                  flex shrink-0
                  items-center justify-end
                  gap-2.5
                  border-t border-border
                  bg-background
                  px-6 py-4
                ">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="
                    inline-flex h-9
                    items-center justify-center
                    border border-border
                    bg-surface
                    px-4
                    text-xs font-semibold
                    text-text-secondary
                    transition-colors
                    hover:border-text-secondary/30
                    hover:bg-white
                    hover:text-text-primary
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  ">
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !volunteer?.id}
                  className="
                    inline-flex h-9
                    items-center justify-center
                    gap-2
                    bg-primary
                    px-4
                    text-xs font-semibold
                    text-white
                    transition-colors
                    hover:bg-primary-hover
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  ">
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} strokeWidth={2} />
                      Save status
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
