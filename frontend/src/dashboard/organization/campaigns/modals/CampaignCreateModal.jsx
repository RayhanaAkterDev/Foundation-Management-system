import React, { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  FileText,
  Loader2,
  MapPin,
  Target,
  X,
} from "lucide-react";

import { apiRequest } from "@/api/client";
import { fetchAssignments } from "@/dashboard/organization/helpRequests/api/helpRequestApi";

const initialForm = {
  type: "local_case",
  title: "",
  description: "",
  category: "",
  district: "",
  location: "",
  affected_areas: "",
  target_amount: "",
  start_date: "",
  end_date: "",
  cover_image: null,
  help_request_id: "",
};

const CAMPAIGN_TYPES = [
  {
    value: "local_case",
    label: "Local case",
    description:
      "Create a campaign connected to a help request assigned to your organization.",
  },
  {
    value: "organization_proposed",
    label: "Organization proposed",
    description:
      "Propose a campaign based on your organization’s own initiative.",
  },
];

const CATEGORIES = [
  "Education",
  "Healthcare",
  "Food Assistance",
  "Shelter",
  "Livelihood",
  "Disaster Relief",
  "Other",
];

const CampaignCreateModal = ({
  open,
  initialHelpRequestId = null,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState(initialForm);

  const [assignments, setAssignments] = useState([]);

  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isHelpRequestOpen, setIsHelpRequestOpen] = useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  /*
   * Load accepted organization assignments whenever
   * the campaign modal is opened.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const loadAssignments = async () => {
      try {
        setIsLoadingAssignments(true);
        setError("");

        const response = await fetchAssignments();

        if (cancelled) {
          return;
        }

        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.assignments)
              ? response.assignments
              : [];

        const normalized = items.map((assignment) => {
          const helpRequest =
            assignment?.help_request || assignment?.helpRequest || null;

          return {
            assignmentId: assignment?.id ?? assignment?.assignment_id ?? null,

            status: String(assignment?.status || "")
              .trim()
              .toLowerCase(),

            helpRequestId:
              assignment?.help_request_id ?? helpRequest?.id ?? null,

            helpRequest,

            rawAssignment: assignment,
          };
        });

        setAssignments(normalized);

        /*
         * If Start Support opened this modal for a specific
         * Help Request, automatically connect that request.
         */
        if (initialHelpRequestId) {
          const matchingAssignment = normalized.find(
            (assignment) =>
              String(assignment.helpRequestId) === String(initialHelpRequestId),
          );

          /*
           * Keep the Help Request ID even if the assignment
           * response does not contain the nested Help Request
           * object. The backend remains the final authority.
           */
          if (matchingAssignment) {
            const helpRequest = matchingAssignment.helpRequest;

            /*
             * IMPORTANT:
             * Start with a completely fresh form.
             * Do not preserve values from a previous HR.
             */
            setForm({
              ...initialForm,

              type: "local_case",

              help_request_id: String(
                matchingAssignment.helpRequestId ?? initialHelpRequestId,
              ),

              title: helpRequest?.title || "",

              description: helpRequest?.description || "",

              category: helpRequest?.category || "",

              district: helpRequest?.district || "",

              location: helpRequest?.location || helpRequest?.address || "",
            });
          } else {
            /*
             * Still preserve the ID received from Start Support.
             * Start with a clean form so no previous campaign data
             * can leak into this campaign.
             */
            setForm({
              ...initialForm,
              type: "local_case",
              help_request_id: String(initialHelpRequestId),
            });
          }
        } else {
          /*
           * Normal "Create Campaign" opening without a specific
           * Help Request.
           *
           * Always start with a clean form.
           */
          setForm({
            ...initialForm,
            type: "local_case",
          });
        }
      } catch (requestError) {
        if (!cancelled) {
          setAssignments([]);

          setError(
            requestError?.message || "Unable to load eligible help requests.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAssignments(false);
        }
      }
    };

    loadAssignments();

    return () => {
      cancelled = true;
    };
  }, [open, initialHelpRequestId]);

  /*
   * Only accepted assignments can be selected for
   * a Local Case campaign.
   */
  const usableAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const helpRequest = assignment.helpRequest;

      const assignmentStatus = String(assignment.status || "")
        .trim()
        .toLowerCase();

      const helpRequestStatus = String(helpRequest?.status || "")
        .trim()
        .toLowerCase();

      const hasHelpRequestId =
        assignment.helpRequestId !== null &&
        assignment.helpRequestId !== undefined &&
        String(assignment.helpRequestId).trim() !== "";

      const alreadyConnected =
        Boolean(helpRequest?.campaign_id) ||
        Boolean(helpRequest?.campaignId) ||
        Boolean(helpRequest?.campaign);

      return (
        assignmentStatus === "accepted" &&
        helpRequestStatus === "verified" &&
        hasHelpRequestId &&
        !alreadyConnected
      );
    });
  }, [assignments]);

  /*
   * Find the currently selected Help Request.
   *
   * Search all normalized assignments here instead of only
   * usableAssignments so the Start Support ID is not lost.
   */
  const selectedAssignment = useMemo(() => {
    if (!form.help_request_id) {
      return null;
    }

    return (
      assignments.find(
        (assignment) =>
          String(assignment.helpRequestId) === String(form.help_request_id),
      ) || null
    );
  }, [form.help_request_id, assignments]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setForm({
      ...initialForm,
      help_request_id: "",
    });

    setAssignments([]);
    setError("");
    setFieldErrors({});
    setIsHelpRequestOpen(false);

    onClose?.();
  };

  const handleFieldChange = (event) => {
    const { name, value, files } = event.target;

    setForm((current) => ({
      ...current,

      [name]: name === "cover_image" ? files?.[0] || null : (value ?? ""),
    }));

    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };

      delete next[name];

      return next;
    });

    if (error) {
      setError("");
    }
  };

  /*
   * Campaign type switching.
   *
   * Every type change starts with a fresh campaign form.
   *
   * Local Case:
   *   - User must select a Help Request again.
   *
   * Organization Proposed:
   *   - No Help Request.
   *   - No previous HR data remains.
   */
  const handleTypeChange = (type) => {
    setForm({
      ...initialForm,
      type,
      help_request_id: "",
    });

    setIsHelpRequestOpen(false);
    setError("");
    setFieldErrors({});
  };

  /*
   * Selecting a Help Request must ALWAYS replace the
   * previously selected Help Request's data.
   *
   * Do not use:
   *   current.title || helpRequest?.title
   *
   * because that would preserve the old HR's data.
   */
  const handleHelpRequestSelect = (assignment) => {
    const helpRequest = assignment?.helpRequest;

    setForm((current) => ({
      ...current,

      type: "local_case",

      help_request_id:
        assignment?.helpRequestId !== null &&
        assignment?.helpRequestId !== undefined
          ? String(assignment.helpRequestId)
          : "",

      /*
       * Always replace HR-derived fields.
       */
      title: helpRequest?.title || "",

      description: helpRequest?.description || "",

      category: helpRequest?.category || "",

      district: helpRequest?.district || "",

      location: helpRequest?.location || helpRequest?.address || "",

      /*
       * These are campaign-specific fields.
       * Do not carry values from a previous HR/campaign.
       */
      affected_areas: "",

      target_amount: "",

      start_date: "",

      end_date: "",

      cover_image: null,
    }));

    setIsHelpRequestOpen(false);

    setFieldErrors((current) => {
      if (!current.help_request_id) {
        return current;
      }

      const next = { ...current };

      delete next.help_request_id;

      return next;
    });

    setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!form.type) {
      errors.type = "Campaign type is required.";
    }

    if (
      form.type === "local_case" &&
      !String(form.help_request_id || "").trim()
    ) {
      errors.help_request_id = "Please select an eligible help request.";
    }

    if (!String(form.title || "").trim()) {
      errors.title = "Campaign title is required.";
    }

    if (!String(form.description || "").trim()) {
      errors.description = "Campaign description is required.";
    }

    if (!String(form.category || "").trim()) {
      errors.category = "Campaign category is required.";
    }

    if (!String(form.location || "").trim()) {
      errors.location = "Campaign location is required.";
    }

    if (!form.target_amount) {
      errors.target_amount = "Target amount is required.";
    } else if (Number(form.target_amount) <= 0) {
      errors.target_amount = "Target amount must be greater than zero.";
    }

    if (!form.start_date) {
      errors.start_date = "Start date is required.";
    }

    if (!form.end_date) {
      errors.end_date = "End date is required.";
    }

    if (form.start_date && form.end_date) {
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);

      if (endDate < startDate) {
        errors.end_date = "End date cannot be earlier than the start date.";
      }
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("type", String(form.type || ""));

      formData.append("title", String(form.title || "").trim());

      formData.append("description", String(form.description || "").trim());

      formData.append("category", String(form.category || "").trim());

      /*
       * Scope intentionally removed.
       */

      if (String(form.district || "").trim()) {
        formData.append("district", String(form.district).trim());
      }

      if (String(form.location || "").trim()) {
        formData.append("location", String(form.location).trim());
      }

      if (String(form.affected_areas || "").trim()) {
        formData.append("affected_areas", String(form.affected_areas).trim());
      }

      formData.append("target_amount", String(form.target_amount || ""));

      formData.append("start_date", String(form.start_date || ""));

      formData.append("end_date", String(form.end_date || ""));

      if (
        form.type === "local_case" &&
        String(form.help_request_id || "").trim()
      ) {
        formData.append("help_request_id", String(form.help_request_id));
      }

      if (form.cover_image instanceof File) {
        formData.append("cover_image", form.cover_image);
      }

      await apiRequest("/campaigns", {
        method: "POST",
        body: formData,
      });

      /*
       * Reset only after successful creation.
       */
      setForm({
        ...initialForm,
        help_request_id: "",
      });

      setAssignments([]);
      setError("");
      setFieldErrors({});
      setIsHelpRequestOpen(false);

      onCreated?.();
    } catch (requestError) {
      setError(requestError?.message || "Unable to create the campaign.");

      setFieldErrors(requestError?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  const inputClass = (field) =>
    `h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-4 focus:ring-primary/8 ${
      fieldErrors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-border hover:border-slate-300"
    }`;

  const errorMessage = (field) =>
    fieldErrors[field] ? (
      <p className="mt-1.5 text-[11px] leading-4 text-red-600">
        {Array.isArray(fieldErrors[field])
          ? fieldErrors[field][0]
          : fieldErrors[field]}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-[3px] sm:p-5">
      <div className="flex max-h-[94vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.2)]">
        {/* Header */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-border bg-white px-5 py-4 sm:px-7 lg:px-8">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <Target className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold tracking-[-0.01em] text-text-primary sm:text-base">
                  Create campaign
                </h2>

                <span className="hidden rounded-full bg-primary/8 px-2.5 py-1 text-[9px] font-semibold text-primary sm:inline-flex">
                  New campaign
                </span>
              </div>

              <p className="mt-0.5 text-[11px] text-text-secondary sm:text-xs">
                Turn a verified need into coordinated community support.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-all hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Left guide */}
            <aside className="hidden border-r border-primary/10 bg-[#f0fdfa] lg:block">
              <div className="sticky top-0 px-7 py-8 xl:px-8">
                <div className="border-b border-primary/10 pb-7">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-4 w-4" strokeWidth={2} />
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    Campaign setup
                  </p>

                  <p className="mt-2.5 text-[12px] leading-5 text-slate-600">
                    Build a clear campaign that gives supporters enough context
                    to understand the need and take action.
                  </p>
                </div>

                <div className="mt-7">
                  <p className="mb-5 text-[11px] font-semibold text-slate-500">
                    Follow these steps
                  </p>

                  <div className="relative space-y-7">
                    <div className="absolute left-[15px] top-5 h-[calc(100%-40px)] w-px bg-primary/15" />

                    <div className="relative flex gap-4">
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white ring-4 ring-[#f0fdfa]">
                        1
                      </span>

                      <div className="pt-0.5">
                        <p className="text-[13px] font-semibold text-text-primary">
                          Campaign source
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                          Choose whether the campaign comes from a local case or
                          your organization.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex gap-4">
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-[11px] font-bold text-primary ring-4 ring-[#f0fdfa]">
                        2
                      </span>

                      <div className="pt-0.5">
                        <p className="text-[13px] font-semibold text-text-primary">
                          Campaign details
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                          Explain what support is needed and where it will make
                          an impact.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex gap-4">
                      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white text-[11px] font-bold text-primary ring-4 ring-[#f0fdfa]">
                        3
                      </span>

                      <div className="pt-0.5">
                        <p className="text-[13px] font-semibold text-text-primary">
                          Funding & timing
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                          Set the target amount and campaign period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-9">
                  <div className="rounded-xl border border-primary/15 bg-white/80 p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold text-text-primary">
                          Verification
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                          Campaigns are submitted for administrator review
                          before becoming publicly available.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main form */}
            <div className="min-w-0 bg-white">
              <div className="space-y-9 px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-red-800">
                        Unable to continue
                      </p>

                      <p className="mt-0.5 text-[11px] leading-5 text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Campaign source */}
                <section>
                  <div className="mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold tracking-[0.1em] text-primary">
                        01
                      </span>

                      <h3 className="text-[15px] font-bold text-text-primary">
                        Campaign source
                      </h3>
                    </div>

                    <p className="mt-1.5 text-[11px] leading-5 text-text-secondary sm:text-xs">
                      Choose how this campaign is being created.
                    </p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {CAMPAIGN_TYPES.map((type) => {
                      const selected = form.type === type.value;

                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleTypeChange(type.value)}
                          className={`group relative rounded-xl border p-5 text-left transition-all ${
                            selected
                              ? "border-primary bg-primary/[0.045] shadow-sm"
                              : "border-border bg-white hover:border-primary/30 hover:bg-surface"
                          }`}>
                          <div className="flex items-start gap-3.5">
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-primary bg-white"
                                  : "border-slate-300 bg-white"
                              }`}>
                              {selected && (
                                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                              )}
                            </span>

                            <div className="min-w-0 pr-10">
                              <p className="text-[13px] font-semibold text-text-primary">
                                {type.label}
                              </p>

                              <p className="mt-2 text-[11px] leading-5 text-text-secondary">
                                {type.description}
                              </p>
                            </div>
                          </div>

                          {selected && (
                            <span className="absolute right-4 top-4 text-[9px] font-bold uppercase tracking-wider text-primary">
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Help request */}
                {form.type === "local_case" && (
                  <section className="border-t border-border pt-8">
                    <div className="mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-bold tracking-[0.1em] text-primary">
                          02
                        </span>

                        <label className="text-[15px] font-bold text-text-primary">
                          Connect a help request
                          <span className="ml-1 text-red-500">*</span>
                        </label>
                      </div>

                      <p className="mt-1.5 text-[11px] leading-5 text-text-secondary sm:text-xs">
                        Select a help request currently accepted by your
                        organization.
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setIsHelpRequestOpen((current) => !current)
                        }
                        disabled={isLoadingAssignments || isSubmitting}
                        className={`flex min-h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left transition-all ${
                          fieldErrors.help_request_id
                            ? "border-red-300"
                            : isHelpRequestOpen
                              ? "border-primary ring-4 ring-primary/8"
                              : "border-border hover:border-primary/40"
                        } disabled:cursor-not-allowed disabled:bg-surface`}>
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-text-secondary">
                            <FileText className="h-4 w-4" />
                          </span>

                          <span className="min-w-0">
                            <span
                              className={`block truncate text-[12px] font-semibold ${
                                selectedAssignment
                                  ? "text-text-primary"
                                  : "text-text-secondary"
                              }`}>
                              {isLoadingAssignments
                                ? "Loading eligible help requests..."
                                : selectedAssignment?.helpRequest?.title ||
                                  (form.help_request_id
                                    ? `Help request #${form.help_request_id}`
                                    : "Select a help request")}
                            </span>

                            {selectedAssignment && (
                              <span className="mt-0.5 block text-[10px] text-text-secondary">
                                Help request #{selectedAssignment.helpRequestId}
                              </span>
                            )}
                          </span>
                        </div>

                        {isLoadingAssignments ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-text-secondary" />
                        ) : (
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${
                              isHelpRequestOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {isHelpRequestOpen && !isLoadingAssignments && (
                        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-30 max-h-64 overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
                          {usableAssignments.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
                                <FileText className="h-4 w-4 text-text-secondary" />
                              </span>

                              <p className="mt-3 text-[12px] font-semibold text-text-primary">
                                No eligible help requests
                              </p>

                              <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-text-secondary">
                                Only help requests currently accepted by your
                                organization can be connected to a new local
                                campaign.
                              </p>
                            </div>
                          ) : (
                            usableAssignments.map((assignment) => (
                              <button
                                key={
                                  assignment.assignmentId ||
                                  assignment.helpRequestId
                                }
                                type="button"
                                onClick={() =>
                                  handleHelpRequestSelect(assignment)
                                }
                                className={`flex w-full items-start gap-3 rounded-lg px-3.5 py-3.5 text-left transition-colors hover:bg-surface ${
                                  String(form.help_request_id) ===
                                  String(assignment.helpRequestId)
                                    ? "bg-primary/5"
                                    : ""
                                }`}>
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-text-secondary">
                                  <FileText className="h-4 w-4" />
                                </span>

                                <span className="min-w-0">
                                  <span className="block truncate text-[12px] font-semibold text-text-primary">
                                    {assignment.helpRequest?.title ||
                                      `Help request #${assignment.helpRequestId}`}
                                  </span>

                                  <span className="mt-1 block text-[10px] text-text-secondary">
                                    HR ID: #{assignment.helpRequestId}
                                  </span>
                                </span>

                                {String(form.help_request_id) ===
                                  String(assignment.helpRequestId) && (
                                  <span className="ml-auto shrink-0 text-[10px] font-semibold text-primary">
                                    Selected
                                  </span>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {errorMessage("help_request_id")}
                  </section>
                )}

                {/* Campaign details */}
                <section className="border-t border-border pt-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold tracking-[0.1em] text-primary">
                        {form.type === "local_case" ? "03" : "02"}
                      </span>

                      <h3 className="text-[15px] font-bold text-text-primary">
                        Campaign details
                      </h3>
                    </div>

                    <p className="mt-1.5 text-[11px] leading-5 text-text-secondary sm:text-xs">
                      Give supporters a clear understanding of the campaign.
                    </p>
                  </div>

                  <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                    {/* Title */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="campaign-title"
                        className="text-[11px] font-semibold text-text-primary">
                        Campaign title
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        id="campaign-title"
                        name="title"
                        type="text"
                        value={form.title || ""}
                        onChange={handleFieldChange}
                        placeholder="Give your campaign a clear, specific title"
                        className={`mt-2 ${inputClass("title")}`}
                      />

                      {errorMessage("title")}
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="campaign-description"
                        className="text-[11px] font-semibold text-text-primary">
                        Description
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <textarea
                        id="campaign-description"
                        name="description"
                        rows={5}
                        value={form.description || ""}
                        onChange={handleFieldChange}
                        placeholder="Explain the situation, what support is needed, and the impact this campaign aims to create."
                        className={`mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-[12px] leading-6 text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-4 focus:ring-primary/8 ${
                          fieldErrors.description
                            ? "border-red-300"
                            : "border-border hover:border-slate-300"
                        }`}
                      />

                      {errorMessage("description")}
                    </div>

                    {/* Category */}
                    <div>
                      <label
                        htmlFor="campaign-category"
                        className="text-[11px] font-semibold text-text-primary">
                        Category
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative mt-2">
                        <select
                          id="campaign-category"
                          name="category"
                          value={form.category || ""}
                          onChange={handleFieldChange}
                          className={`h-11 w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/8 ${
                            fieldErrors.category
                              ? "border-red-300"
                              : "border-border hover:border-slate-300"
                          }`}>
                          <option value="">Select a category</option>

                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
                          strokeWidth={1.8}
                        />
                      </div>

                      {errorMessage("category")}
                    </div>

                    {/* District */}
                    <div>
                      <label
                        htmlFor="campaign-district"
                        className="text-[11px] font-semibold text-text-primary">
                        District
                      </label>

                      <input
                        id="campaign-district"
                        name="district"
                        type="text"
                        value={form.district || ""}
                        onChange={handleFieldChange}
                        placeholder="Enter district"
                        className={`mt-2 ${inputClass("district")}`}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label
                        htmlFor="campaign-location"
                        className="text-[11px] font-semibold text-text-primary">
                        Location
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative mt-2">
                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                        <input
                          id="campaign-location"
                          name="location"
                          type="text"
                          value={form.location || ""}
                          onChange={handleFieldChange}
                          placeholder="Enter campaign location"
                          className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-4 focus:ring-primary/8 ${
                            fieldErrors.location
                              ? "border-red-300"
                              : "border-border hover:border-slate-300"
                          }`}
                        />
                      </div>

                      {errorMessage("location")}
                    </div>

                    {/* Affected areas */}
                    <div>
                      <label
                        htmlFor="campaign-affected-areas"
                        className="text-[11px] font-semibold text-text-primary">
                        Affected areas
                      </label>

                      <input
                        id="campaign-affected-areas"
                        name="affected_areas"
                        type="text"
                        value={form.affected_areas || ""}
                        onChange={handleFieldChange}
                        placeholder="List affected areas"
                        className={`mt-2 ${inputClass("affected_areas")}`}
                      />
                    </div>
                  </div>
                </section>

                {/* Funding & timeline */}
                <section className="border-t border-border pt-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold tracking-[0.1em] text-primary">
                        {form.type === "local_case" ? "04" : "03"}
                      </span>

                      <h3 className="text-[15px] font-bold text-text-primary">
                        Funding & timeline
                      </h3>
                    </div>

                    <p className="mt-1.5 text-[11px] leading-5 text-text-secondary sm:text-xs">
                      Define the financial target and period for the campaign.
                    </p>
                  </div>

                  <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                    {/* Target */}
                    <div>
                      <label
                        htmlFor="campaign-target"
                        className="text-[11px] font-semibold text-text-primary">
                        Target amount
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative mt-2">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-text-secondary">
                          ৳
                        </span>

                        <input
                          id="campaign-target"
                          name="target_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.target_amount || ""}
                          onChange={handleFieldChange}
                          placeholder="0.00"
                          className={`h-11 w-full rounded-lg border bg-white pl-8 pr-3.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/50 focus:border-primary focus:ring-4 focus:ring-primary/8 ${
                            fieldErrors.target_amount
                              ? "border-red-300"
                              : "border-border hover:border-slate-300"
                          }`}
                        />
                      </div>

                      {errorMessage("target_amount")}
                    </div>

                    {/* Cover image */}
                    <div>
                      <label
                        htmlFor="campaign-cover-image"
                        className="text-[11px] font-semibold text-text-primary">
                        Cover image
                      </label>

                      <input
                        id="campaign-cover-image"
                        name="cover_image"
                        type="file"
                        accept="image/*"
                        onChange={handleFieldChange}
                        className="mt-2 block h-11 w-full rounded-lg border border-border bg-white px-2.5 py-2 text-[10px] text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-[10px] file:font-semibold file:text-text-primary hover:border-slate-300"
                      />
                    </div>

                    {/* Start date */}
                    <div>
                      <label
                        htmlFor="campaign-start-date"
                        className="text-[11px] font-semibold text-text-primary">
                        Start date
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative mt-2">
                        <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                        <input
                          id="campaign-start-date"
                          name="start_date"
                          type="date"
                          value={form.start_date || ""}
                          onChange={handleFieldChange}
                          className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3.5 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/8 ${
                            fieldErrors.start_date
                              ? "border-red-300"
                              : "border-border hover:border-slate-300"
                          }`}
                        />
                      </div>

                      {errorMessage("start_date")}
                    </div>

                    {/* End date */}
                    <div>
                      <label
                        htmlFor="campaign-end-date"
                        className="text-[11px] font-semibold text-text-primary">
                        End date
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <div className="relative mt-2">
                        <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                        <input
                          id="campaign-end-date"
                          name="end_date"
                          type="date"
                          value={form.end_date || ""}
                          onChange={handleFieldChange}
                          className={`h-11 w-full rounded-lg border bg-white pl-10 pr-3.5 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/8 ${
                            fieldErrors.end_date
                              ? "border-red-300"
                              : "border-border hover:border-slate-300"
                          }`}
                        />
                      </div>

                      {errorMessage("end_date")}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-20 flex shrink-0 items-center justify-between border-t border-border bg-white/95 px-5 py-3.5 backdrop-blur sm:px-7 lg:px-9">
            <p className="hidden text-[11px] text-text-secondary sm:block">
              Your campaign will be reviewed before publication.
            </p>

            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-10 rounded-lg px-4 text-[11px] font-semibold text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}

                {isSubmitting ? "Creating..." : "Create campaign"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignCreateModal;
