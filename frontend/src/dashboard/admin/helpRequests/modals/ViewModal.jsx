import React from "react";

import {
  X,
  FileText,
  Users,
  Building2,
  UserRound,
  ShieldCheck,
  CalendarDays,
  CircleAlert,
} from "lucide-react";

const ViewModal = ({ request, loading, error, onClose }) => {
  if (!request && !loading && !error) {
    return null;
  }

  const formatDate = (date, includeTime = false) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
      ...(includeTime && {
        hour: "numeric",
        minute: "2-digit",
      }),
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getUrgencyStyle = (urgency) => {
    if (!urgency) {
      return {
        wrapper: "border-white/15 bg-white/10",
        icon: "bg-white/10 text-white/60",
        text: "text-white/75",
      };
    }

    const normalized = String(urgency).toLowerCase();

    if (normalized.includes("critical")) {
      return {
        wrapper: "border-red-300/40 bg-red-500/15",
        icon: "bg-red-400/20 text-red-100",
        text: "text-red-100",
      };
    }

    if (normalized.includes("high") || normalized.includes("urgent")) {
      return {
        wrapper: "border-orange-300/40 bg-orange-400/15",
        icon: "bg-orange-300/20 text-orange-100",
        text: "text-orange-100",
      };
    }

    if (normalized.includes("normal")) {
      return {
        wrapper: "border-white/15 bg-white/10",
        icon: "bg-white/10 text-white/70",
        text: "text-white/90",
      };
    }

    return {
      wrapper: "border-white/15 bg-white/10",
      icon: "bg-white/10 text-white/60",
      text: "text-white/75",
    };
  };

  const getAssignments = (helpRequest) => {
    if (!helpRequest) return [];

    if (Array.isArray(helpRequest.assignments)) {
      return helpRequest.assignments;
    }

    if (Array.isArray(helpRequest.help_request_assignments)) {
      return helpRequest.help_request_assignments;
    }

    if (Array.isArray(helpRequest.helpRequestAssignments)) {
      return helpRequest.helpRequestAssignments;
    }

    if (helpRequest.assignment) {
      return [helpRequest.assignment];
    }

    return [];
  };

  const getOrganizationName = (assignment) => {
    if (!assignment) {
      return null;
    }

    const organization = assignment.organization;

    if (organization) {
      if (typeof organization === "string") {
        return organization;
      }

      if (organization.name) {
        return organization.name;
      }

      if (organization.organization_name) {
        return organization.organization_name;
      }

      if (organization.organizationName) {
        return organization.organizationName;
      }

      if (organization.title) {
        return organization.title;
      }
    }

    const organizationUser = assignment.organization_user;

    if (organizationUser) {
      if (typeof organizationUser === "string") {
        return organizationUser;
      }

      if (organizationUser.name) {
        return organizationUser.name;
      }

      if (organizationUser.organization_name) {
        return organizationUser.organization_name;
      }

      if (organizationUser.organizationName) {
        return organizationUser.organizationName;
      }
    }

    const organizationUserCamel = assignment.organizationUser;

    if (organizationUserCamel) {
      if (typeof organizationUserCamel === "string") {
        return organizationUserCamel;
      }

      if (organizationUserCamel.name) {
        return organizationUserCamel.name;
      }

      if (organizationUserCamel.organization_name) {
        return organizationUserCamel.organization_name;
      }

      if (organizationUserCamel.organizationName) {
        return organizationUserCamel.organizationName;
      }
    }

    const directNames = [
      assignment.organization_name,
      assignment.organizationName,
      assignment.org_name,
      assignment.orgName,
      assignment.organization_title,
      assignment.organizationTitle,
    ];

    const directName = directNames.find(
      (value) =>
        value !== null && value !== undefined && String(value).trim() !== "",
    );

    if (directName) {
      return String(directName);
    }

    if (assignment.user) {
      if (assignment.user.organization?.name) {
        return assignment.user.organization.name;
      }

      if (assignment.user.organization_name) {
        return assignment.user.organization_name;
      }

      if (assignment.user.organizationName) {
        return assignment.user.organizationName;
      }

      if (assignment.user.name && assignment.user.role === "organization") {
        return assignment.user.name;
      }
    }

    if (assignment.target_organization) {
      if (typeof assignment.target_organization === "string") {
        return assignment.target_organization;
      }

      return (
        assignment.target_organization.name ||
        assignment.target_organization.organization_name ||
        assignment.target_organization.organizationName ||
        assignment.target_organization.title ||
        null
      );
    }

    if (assignment.targetOrganization) {
      if (typeof assignment.targetOrganization === "string") {
        return assignment.targetOrganization;
      }

      return (
        assignment.targetOrganization.name ||
        assignment.targetOrganization.organization_name ||
        assignment.targetOrganization.organizationName ||
        assignment.targetOrganization.title ||
        null
      );
    }

    return null;
  };

  /*
   * Organization email comes from:
   *
   * help_request_assignments.organization_id
   *        ↓
   * organizations.id
   *        ↓
   * organizations.user_id
   *        ↓
   * users.id
   *        ↓
   * users.email
   *
   * Backend should eager-load:
   * assignments.organization.user
   */
  const getOrganizationEmail = (assignment) => {
    return assignment?.organization?.user?.email || null;
  };

  const assignments = getAssignments(request);

  const organizationAssignmentStatuses = [
    "assigned",
    "pending",
    "accepted",
    "in_progress",
    "completed",
    "rejected",
  ];

  const organizationAssignments = assignments.filter((assignment) => {
    const status = String(assignment?.status || "")
      .trim()
      .toLowerCase();

    return organizationAssignmentStatuses.includes(status);
  });

  const pendingAssignments = assignments.filter((assignment) => {
    const status = String(assignment?.status || "")
      .trim()
      .toLowerCase();

    return status === "assigned" || status === "pending";
  });

  const activeAssignments = assignments.filter((assignment) => {
    const status = String(assignment?.status || "")
      .trim()
      .toLowerCase();

    return ["accepted", "in_progress"].includes(status);
  });

  const completedAssignments = assignments.filter((assignment) => {
    const status = String(assignment?.status || "")
      .trim()
      .toLowerCase();

    return status === "completed";
  });

  const rejectedAssignments = assignments.filter((assignment) => {
    const status = String(assignment?.status || "")
      .trim()
      .toLowerCase();

    return status === "rejected";
  });

  const hasPendingAssignment = pendingAssignments.length > 0;
  const hasActiveAssignment = activeAssignments.length > 0;
  const hasCompletedAssignment = completedAssignments.length > 0;
  const hasRejectedAssignment = rejectedAssignments.length > 0;

  const hasAssignment =
    organizationAssignments.length > 0 ||
    hasPendingAssignment ||
    hasActiveAssignment ||
    hasCompletedAssignment ||
    hasRejectedAssignment;

  const allOrganizationDetails = [
    ...new Map(
      [...organizationAssignments, ...assignments]
        .map((assignment) => {
          const name = getOrganizationName(assignment);
          const email = getOrganizationEmail(assignment);

          return {
            name,
            email,
          };
        })
        .filter((organization) => organization.name)
        .map((organization) => [
          String(organization.name).trim(),
          organization,
        ]),
    ).values(),
  ];

  const volunteerAssignmentRecords = [
    ...activeAssignments,
    ...completedAssignments,
  ];

  const volunteerNames = [
    ...new Set(
      volunteerAssignmentRecords
        .map((assignment) => {
          if (assignment?.volunteer?.name) {
            return assignment.volunteer.name;
          }

          if (assignment?.volunteer?.user?.name) {
            return assignment.volunteer.user.name;
          }

          if (assignment?.volunteer_name) {
            return assignment.volunteer_name;
          }

          if (assignment?.volunteerName) {
            return assignment.volunteerName;
          }

          if (assignment?.volunteer_user?.name) {
            return assignment.volunteer_user.name;
          }

          if (assignment?.volunteerUser?.name) {
            return assignment.volunteerUser.name;
          }

          if (assignment?.user?.name) {
            return assignment.user.name;
          }

          return null;
        })
        .filter(Boolean),
    ),
  ];

  const urgencyStyle = getUrgencyStyle(request?.urgency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5">
      <div
        className="absolute inset-0"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <header className="shrink-0 border-b border-primary-hover bg-primary text-white">
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/70 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close">
              <X size={18} strokeWidth={1.8} />
            </button>

            {request && (
              <div className="flex flex-col gap-7 pr-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                      Help request
                    </span>

                    {request?.id && (
                      <>
                        <span className="text-white/25">•</span>

                        <span className="font-mono text-[10px] text-white/45">
                          #{request.id}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-3">
                    <h2 className="max-w-3xl text-[24px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
                      {request?.title || "Request details"}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {request.status && (
                        <span className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary shadow-sm">
                          {formatValue(request.status)}
                        </span>
                      )}

                      {request.verification_status && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-white/90">
                          <ShieldCheck size={13} />
                          {formatValue(request.verification_status)}
                        </span>
                      )}

                      {hasPendingAssignment && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300/30 bg-amber-400/15 px-2.5 py-1.5 text-[10px] font-semibold text-amber-100">
                          <Building2 size={13} />
                          Assignment Pending
                        </span>
                      )}

                      {!hasPendingAssignment && hasAssignment && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-white/90">
                          <Users size={13} />
                          Assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full shrink-0 border-t border-white/10 pt-5 lg:w-50 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <HeaderMeta
                      label="Category"
                      value={formatValue(request.category)}
                    />

                    <HeaderMeta
                      label="Urgency"
                      value={formatValue(request.urgency)}
                      valueClassName={urgencyStyle.text}
                      valueWrapperClassName=""
                    />

                    <HeaderMeta
                      label="Location"
                      value={
                        request.location || request.address || "Not provided"
                      }
                      truncate
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f8f7]">
          {loading && (
            <div className="flex min-h-[420px] items-center justify-center px-6 py-12">
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/15 border-t-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading request details
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please wait a moment.
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-[420px] items-center justify-center px-6 py-12">
              <div className="w-full max-w-md border border-red-200 bg-white px-7 py-8 text-center shadow-sm">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <CircleAlert size={20} strokeWidth={1.8} />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  Unable to load request
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && request && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
              <main className="min-w-0 bg-white">
                <section className="px-6 py-8 sm:px-8">
                  <SectionHeading
                    icon={FileText}
                    eyebrow="Request details"
                    title="Description"
                  />

                  <div className="mt-6 border-l-2 border-primary/20 pl-5">
                    <p className="whitespace-pre-line text-[14px] leading-7 text-slate-700">
                      {request.description ||
                        request.details ||
                        "No description provided."}
                    </p>
                  </div>
                </section>

                <section className="px-6 py-7 sm:px-8">
                  <div className="flex items-end justify-between gap-4">
                    <SectionHeading
                      icon={Users}
                      eyebrow="Coordination"
                      title="Assignment"
                    />

                    {hasPendingAssignment && (
                      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600 sm:block">
                        Awaiting organization response
                      </span>
                    )}

                    {!hasPendingAssignment && hasActiveAssignment && (
                      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:block">
                        Active assignment
                      </span>
                    )}

                    {!hasPendingAssignment &&
                      !hasActiveAssignment &&
                      hasRejectedAssignment && (
                        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-red-500 sm:block">
                          Organization declined
                        </span>
                      )}
                  </div>

                  {hasPendingAssignment && (
                    <div className="mt-5 overflow-hidden border border-amber-200 bg-amber-50">
                      <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-600">
                          <Building2 size={17} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-amber-700">
                              Assignment request sent
                            </p>

                            <span className="h-1 w-1 rounded-full bg-amber-400" />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-600">
                              Pending response
                            </span>
                          </div>

                          {allOrganizationDetails.length > 0 ? (
                            <div className="mt-3 space-y-3">
                              {allOrganizationDetails.map(
                                (organization, index) => (
                                  <div
                                    key={`${organization.name}-${index}`}
                                    className="flex min-w-0 items-start gap-2.5">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                                    <div className="min-w-0">
                                      <p
                                        className="truncate text-[14px] font-bold text-slate-800"
                                        title={organization.name}>
                                        {organization.name}
                                      </p>

                                      {organization.email && (
                                        <p
                                          className="mt-0.5 truncate text-[11px] font-medium text-slate-500"
                                          title={organization.email}>
                                          {organization.email}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="mt-3 border border-amber-200 bg-white px-4 py-3">
                              <p className="text-[11px] font-semibold text-amber-700">
                                Organization details are not available.
                              </p>
                            </div>
                          )}

                          <p className="mt-3 max-w-2xl text-[11px] leading-5 text-amber-700">
                            An assignment request has been sent to the
                            organization shown above. You&apos;ll be notified
                            when they accept or decline the request.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasActiveAssignment && (
                    <div className="mt-5 grid grid-cols-1 overflow-hidden border border-slate-200 sm:grid-cols-2">
                      <AssignmentRow
                        icon={Building2}
                        label="Organization"
                        organizations={allOrganizationDetails}
                        emptyText="No organization assigned"
                      />

                      <AssignmentRow
                        icon={UserRound}
                        label="Volunteer"
                        names={volunteerNames}
                        emptyText="No volunteer assigned"
                      />
                    </div>
                  )}

                  {!hasPendingAssignment &&
                    !hasActiveAssignment &&
                    (hasCompletedAssignment || hasRejectedAssignment) && (
                      <div className="mt-5 overflow-hidden border border-slate-200 bg-white">
                        <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                              hasRejectedAssignment
                                ? "border-red-200 bg-red-50 text-red-600"
                                : "border-emerald-200 bg-emerald-50 text-emerald-600"
                            }`}>
                            <Building2 size={17} strokeWidth={1.8} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-[9px] font-bold uppercase tracking-[0.13em] ${
                                hasRejectedAssignment
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}>
                              Organization
                            </p>

                            {allOrganizationDetails.length > 0 ? (
                              <div className="mt-2.5 space-y-3">
                                {allOrganizationDetails.map(
                                  (organization, index) => (
                                    <div
                                      key={`${organization.name}-${index}`}
                                      className="flex min-w-0 items-start gap-2.5">
                                      <span
                                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                          hasRejectedAssignment
                                            ? "bg-red-500"
                                            : "bg-emerald-500"
                                        }`}
                                      />

                                      <div className="min-w-0">
                                        <p
                                          className="truncate text-[13px] font-semibold text-slate-800"
                                          title={organization.name}>
                                          {organization.name}
                                        </p>

                                        {organization.email && (
                                          <p
                                            className="mt-0.5 truncate text-[10.5px] font-medium text-slate-500"
                                            title={organization.email}>
                                            {organization.email}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <p className="mt-2 text-xs text-slate-400">
                                Organization details are not available.
                              </p>
                            )}

                            {hasRejectedAssignment && (
                              <p className="mt-3 text-[11px] leading-5 text-red-600">
                                This organization received the assignment
                                request but declined it.
                              </p>
                            )}

                            {hasCompletedAssignment &&
                              !hasRejectedAssignment && (
                                <p className="mt-3 text-[11px] leading-5 text-emerald-600">
                                  This organization was assigned to the request.
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                  {!hasAssignment && (
                    <div className="mt-5 flex items-center gap-4 border border-dashed border-slate-300 bg-slate-50 px-5 py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                        <Users size={17} strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          No active assignment
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                          This request has not been assigned to an organization
                          or volunteer.
                        </p>
                      </div>
                    </div>
                  )}

                  {hasAssignment &&
                    allOrganizationDetails.length === 0 &&
                    volunteerNames.length === 0 && (
                      <div className="mt-3 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
                        <CircleAlert
                          size={15}
                          strokeWidth={1.8}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <p className="text-[11px] leading-5 text-amber-700">
                          An assignment exists, but the assigned organization or
                          volunteer details were not included in the response.
                        </p>
                      </div>
                    )}
                </section>
              </main>

              <aside className="border-t border-slate-200 bg-[#f8faf9] px-6 py-8 lg:border-l lg:border-t-0">
                <SideHeading title="Timeline" icon={CalendarDays} />

                <div className="mt-7 pl-1">
                  <TimelineItem
                    label="Submitted"
                    value={formatDate(request.created_at, true)}
                    active
                  />

                  <TimelineItem
                    label="Last updated"
                    value={formatDate(request.updated_at, true)}
                  />

                  {request.verified_at && (
                    <TimelineItem
                      label="Verified"
                      value={formatDate(request.verified_at, true)}
                      last
                      active
                    />
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeaderMeta = ({
  label,
  value,
  mono = false,
  truncate = false,
  valueClassName = "text-white",
  valueWrapperClassName = "",
}) => {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>

      <div className={`mt-1 max-w-full ${valueWrapperClassName}`}>
        <p
          className={`max-w-full text-[12px] font-semibold leading-5 tracking-[-0.01em] ${valueClassName} ${
            mono ? "font-mono" : ""
          } ${truncate ? "truncate" : ""}`}
          title={truncate ? value : undefined}>
          {value}
        </p>
      </div>
    </div>
  );
};

const SectionHeading = ({ icon: Icon, eyebrow, title }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
        <Icon size={15} strokeWidth={1.9} />
      </span>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary">
          {eyebrow}
        </p>

        <h3 className="mt-0.5 text-[17px] font-bold tracking-tight text-slate-900">
          {title}
        </h3>
      </div>
    </div>
  );
};

const AssignmentRow = ({
  icon: Icon,
  label,
  names,
  organizations,
  emptyText,
}) => {
  return (
    <div className="min-w-0 px-5 py-5 sm:px-6">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-primary">
          <Icon size={16} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
            {label}
          </p>

          {organizations && organizations.length > 0 ? (
            <div className="mt-2.5 space-y-3">
              {organizations.map((organization, index) => (
                <div
                  key={`${organization.name}-${index}`}
                  className="flex min-w-0 items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                  <div className="min-w-0">
                    <p
                      className="truncate text-[13px] font-semibold text-slate-800"
                      title={organization.name}>
                      {organization.name}
                    </p>

                    {organization.email && (
                      <p
                        className="mt-0.5 truncate text-[10.5px] font-medium text-slate-500"
                        title={organization.email}>
                        {organization.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : names && names.length > 0 ? (
            <div className="mt-2.5 space-y-2">
              {names.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="flex min-w-0 items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                  <p
                    className="min-w-0 truncate text-[13px] font-semibold text-slate-800"
                    title={name}>
                    {name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2.5 text-xs font-medium text-slate-400">
              {emptyText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SideHeading = ({ title, icon: Icon }) => {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
        <Icon size={13} strokeWidth={1.9} />
      </span>

      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
        {title}
      </p>
    </div>
  );
};

const TimelineItem = ({ label, value, last = false, active = false }) => {
  return (
    <div className={`relative ${last ? "" : "pb-7"}`}>
      {!last && (
        <div className="absolute bottom-0 left-[5px] top-3 w-px bg-slate-200" />
      )}

      <span
        className={`absolute left-0 top-1 h-2.5 w-2.5 rounded-full border-2 ${
          active
            ? "border-primary bg-primary shadow-[0_0_0_3px_rgba(15,118,110,0.10)]"
            : "border-slate-300 bg-[#f8faf9]"
        }`}
      />

      <div className="pl-6">
        <p
          className={`text-[9px] font-bold uppercase tracking-[0.13em] ${
            active ? "text-primary" : "text-slate-400"
          }`}>
          {label}
        </p>

        <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ViewModal;
