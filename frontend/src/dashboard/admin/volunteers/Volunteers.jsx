import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Download, Loader2, Send, X } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";

import VolunteerRequestModal from "./modals/VolunteerRequestModal";
import ViewModal from "./modals/ViewModal";
import EditModal from "./modals/EditModal";

import VolunteerStats from "./components/Stats";
import VolunteerFilters from "./components/Filters";
import VolunteerTable from "./components/Table";
import VolunteerPagination from "./components/Pagination";
import VolunteerSuccessToast from "./components/SuccessToast";

import {
  fetchVolunteers,
  fetchVolunteerCandidates,
  fetchVolunteerRequests,
  sendVolunteerRequests,
  acceptVolunteerApplication,
  rejectVolunteerApplication,
  fetchVolunteerDetails,
  updateVolunteerStatus,
} from "./api/volunteerApi";

const VOLUNTEERS_PER_PAGE = 25;

const Volunteers = () => {
  const navigate = useNavigate();

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [volunteerRequests, setVolunteerRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [processingRequest, setProcessingRequest] = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [candidateUsers, setCandidateUsers] = useState([]);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateError, setCandidateError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showSuccessToast = (message) => {
    setToast({
      show: true,
      message,
    });

    window.setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 3000);
  };

  // ============================================================
  // NORMALIZE VOLUNTEER RESPONSE
  // ============================================================

  const normalizeVolunteersResponse = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.volunteers)) {
      return response.volunteers;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  // ============================================================
  // NORMALIZE REQUEST RESPONSE
  // ============================================================

  const normalizeRequestsResponse = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.requests)) {
      return response.requests;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  // ============================================================
  // NORMALIZE SINGLE VOLUNTEER RESPONSE
  //
  // IMPORTANT:
  // Keep BOTH volunteer AND assignments.
  // ============================================================

  const normalizeVolunteerDetailsResponse = (response) => {
    if (!response || typeof response !== "object") {
      return {
        volunteer: null,
        assignments: [],
      };
    }

    const root =
      response?.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
        ? response.data
        : response;

    const volunteer =
      root?.volunteer && typeof root.volunteer === "object"
        ? root.volunteer
        : root;

    /*
     * IMPORTANT:
     * adminShow() returns campaignVolunteerAssignments
     * inside the volunteer object because the backend
     * eager-loads:
     *
     * Volunteer::with([
     *   ...
     *   'campaignVolunteerAssignments',
     * ])
     *
     * Laravel serializes that relationship as:
     *
     * volunteer.campaign_volunteer_assignments
     *
     * Therefore we check both the root response and
     * the volunteer object.
     */
    const assignments =
      root?.assignments ??
      root?.campaign_assignments ??
      root?.campaign_volunteer_assignments ??
      root?.campaignVolunteerAssignments ??
      volunteer?.assignments ??
      volunteer?.campaign_assignments ??
      volunteer?.campaign_volunteer_assignments ??
      volunteer?.campaignVolunteerAssignments ??
      [];

    return {
      volunteer,
      assignments: Array.isArray(assignments) ? assignments : [],
    };
  };

  // ============================================================
  // LOAD INITIAL DATA
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      setLoading(true);
      setRequestsLoading(true);

      setPageError("");
      setRequestsError("");

      try {
        const [volunteerResponse, requestResponse] = await Promise.all([
          fetchVolunteers(),
          fetchVolunteerRequests(),
        ]);

        if (cancelled) {
          return;
        }

        const volunteerList = normalizeVolunteersResponse(volunteerResponse);

        const requestList = normalizeRequestsResponse(requestResponse);

        setVolunteers(volunteerList);
        setVolunteerRequests(requestList);
      } catch (err) {
        console.error("VOLUNTEER LOAD ERROR:", err);

        if (!cancelled) {
          const message =
            err?.message || "Unable to load volunteer information.";

          setPageError(message);
          setRequestsError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRequestsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // REFRESH
  // ============================================================

  const refreshVolunteerData = async () => {
    try {
      setPageError("");
      setRequestsError("");

      const [volunteerResponse, requestResponse] = await Promise.all([
        fetchVolunteers(),
        fetchVolunteerRequests(),
      ]);

      const volunteerList = normalizeVolunteersResponse(volunteerResponse);

      const requestList = normalizeRequestsResponse(requestResponse);

      setVolunteers(volunteerList);
      setVolunteerRequests(requestList);
    } catch (err) {
      console.error("VOLUNTEER REFRESH ERROR:", err);

      const message =
        err?.message || "Unable to refresh volunteer information.";

      setPageError(message);
      setRequestsError(message);

      throw err;
    }
  };

  // ============================================================
  // INVITATION MODAL
  // ============================================================

  const openRequestModal = async () => {
    setShowRequestModal(true);
    setCandidateLoading(true);
    setCandidateError("");
    setRequestError("");
    setSelectedUsers([]);

    try {
      const response = await fetchVolunteerCandidates();

      const users = Array.isArray(response)
        ? response
        : Array.isArray(response?.users)
          ? response.users
          : Array.isArray(response?.data)
            ? response.data
            : [];

      setCandidateUsers(users);
    } catch (err) {
      console.error("VOLUNTEER CANDIDATES LOAD ERROR:", err);

      setCandidateError(err?.message || "Unable to load eligible individuals.");
    } finally {
      setCandidateLoading(false);
    }
  };

  const closeRequestModal = () => {
    if (requestLoading) {
      return;
    }

    setShowRequestModal(false);
    setCandidateUsers([]);
    setSelectedUsers([]);
    setCandidateError("");
    setRequestError("");
  };

  const handleToggleUser = (userId) => {
    setSelectedUsers((current) => {
      if (current.includes(userId)) {
        return current.filter((id) => id !== userId);
      }

      return [...current, userId];
    });
  };

  const handleSelectAll = () => {
    if (candidateUsers.length === 0) {
      return;
    }

    const allIds = candidateUsers.map((user) => user.id);

    const allSelected = allIds.every((id) => selectedUsers.includes(id));

    setSelectedUsers(allSelected ? [] : allIds);
  };

  const handleSendRequests = async () => {
    if (selectedUsers.length === 0) {
      return;
    }

    const selectedCount = selectedUsers.length;

    setRequestLoading(true);
    setRequestError("");

    try {
      await sendVolunteerRequests(selectedUsers);

      setShowRequestModal(false);
      setCandidateUsers([]);
      setSelectedUsers([]);

      await refreshVolunteerData();

      showSuccessToast(
        selectedCount === 1
          ? "Volunteer invitation sent successfully."
          : `${selectedCount} volunteer invitations sent successfully.`,
      );
    } catch (err) {
      console.error("VOLUNTEER REQUEST SEND ERROR:", err);

      setRequestError(err?.message || "Unable to send volunteer invitations.");
    } finally {
      setRequestLoading(false);
    }
  };

  // ============================================================
  // APPLICATION ACTIONS
  // ============================================================

  const handleAcceptApplication = async (request) => {
    const requestId = request?.id;

    if (!requestId || processingRequest !== null) {
      return;
    }

    setProcessingRequest({
      id: requestId,
      action: "accept",
    });

    setRequestsError("");

    try {
      await acceptVolunteerApplication(requestId);

      await refreshVolunteerData();

      showSuccessToast(
        `${request?.user?.name || "Applicant"} is now an active volunteer.`,
      );
    } catch (err) {
      console.error("VOLUNTEER APPLICATION ACCEPT ERROR:", err);

      setRequestsError(
        err?.message || "Unable to accept this volunteer application.",
      );
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectApplication = async (request) => {
    const requestId = request?.id;

    if (!requestId || processingRequest !== null) {
      return;
    }

    setProcessingRequest({
      id: requestId,
      action: "reject",
    });

    setRequestsError("");

    try {
      await rejectVolunteerApplication(requestId);

      await refreshVolunteerData();

      showSuccessToast(
        `${request?.user?.name || "Applicant"}'s application was rejected.`,
      );
    } catch (err) {
      console.error("VOLUNTEER APPLICATION REJECT ERROR:", err);

      setRequestsError(
        err?.message || "Unable to reject this volunteer application.",
      );
    } finally {
      setProcessingRequest(null);
    }
  };

  // ============================================================
  // VIEW VOLUNTEER
  // ============================================================

  const handleViewVolunteer = async (volunteerId) => {
    if (!volunteerId) {
      return;
    }

    setViewModalOpen(true);
    setViewLoading(true);
    setViewError("");
    setSelectedVolunteer(null);

    try {
      const response = await fetchVolunteerDetails(volunteerId);

      const volunteer = normalizeVolunteerDetailsResponse(response);

      setSelectedVolunteer(volunteer);
    } catch (err) {
      console.error("VOLUNTEER DETAILS LOAD ERROR:", err);

      setViewError(err?.message || "Unable to load volunteer information.");
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewLoading(false);
    setViewError("");
    setSelectedVolunteer(null);
  };

  // ============================================================
  // VIEW CAMPAIGN
  //
  // IMPORTANT:
  // Use React Router navigation instead of window.location.href.
  // This prevents a full browser page reload.
  // ============================================================

  const handleViewCampaign = (campaignId) => {
    if (!campaignId) {
      return;
    }

    navigate(`/admin/dashboard/campaigns/${campaignId}`);
  };

  // ============================================================
  // EDIT VOLUNTEER
  // ============================================================

  const handleEditVolunteer = async (volunteerId) => {
    if (!volunteerId) {
      return;
    }

    setEditModalOpen(true);
    setEditLoading(true);
    setEditError("");
    setSelectedVolunteer(null);

    try {
      const response = await fetchVolunteerDetails(volunteerId);

      const volunteer = normalizeVolunteerDetailsResponse(response);

      setSelectedVolunteer(volunteer.volunteer);
    } catch (err) {
      console.error("VOLUNTEER EDIT LOAD ERROR:", err);

      setEditError(err?.message || "Unable to load volunteer information.");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    if (editSaving) {
      return;
    }

    setEditModalOpen(false);
    setEditLoading(false);
    setEditError("");
    setSelectedVolunteer(null);
  };

  const handleSaveVolunteerStatus = async (status) => {
    if (!selectedVolunteer?.id || editSaving) {
      return;
    }

    setEditSaving(true);
    setEditError("");

    try {
      await updateVolunteerStatus(selectedVolunteer.id, status);

      setEditModalOpen(false);
      setSelectedVolunteer(null);

      await refreshVolunteerData();

      showSuccessToast("Volunteer status updated successfully.");
    } catch (err) {
      console.error("VOLUNTEER STATUS UPDATE ERROR:", err);

      setEditError(err?.message || "Unable to update volunteer status.");
    } finally {
      setEditSaving(false);
    }
  };

  // ============================================================
  // REQUEST FILTERING
  // ============================================================

  /*
   * ALL pending requests.
   *
   * This includes:
   *
   * 1. user_to_admin
   *    Individual applied / requested reactivation.
   *
   * 2. admin_to_user
   *    Admin sent a volunteer invitation.
   *
   * This dataset is used for the Pending statistic.
   */
  const pendingRequests = useMemo(() => {
    return volunteerRequests.filter((request) => {
      const status = String(request?.status ?? "")
        .trim()
        .toLowerCase();

      return status === "pending";
    });
  }, [volunteerRequests]);

  /*
   * ONLY individual applications / reactivation requests.
   *
   * Admin invitations are intentionally excluded from
   * the Accept/Reject application review section.
   */
  const pendingApplicationRequests = useMemo(() => {
    return pendingRequests.filter(
      (request) => request?.request_direction === "user_to_admin",
    );
  }, [pendingRequests]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const active = volunteers.filter(
      (volunteer) => volunteer.status === "active",
    ).length;

    const inactive = volunteers.filter(
      (volunteer) => volunteer.status === "inactive",
    ).length;

    const suspended = volunteers.filter(
      (volunteer) => volunteer.status === "suspended",
    ).length;

    /*
     * Pending includes BOTH:
     *
     * - user -> admin applications
     * - admin -> user invitations
     */
    const pendingApplications = pendingRequests.length;

    return {
      total: volunteers.length,
      active,
      inactive,
      suspended,
      pendingApplications,
    };
  }, [volunteers, pendingRequests]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredVolunteers = useMemo(() => {
    let result = [...volunteers];

    if (statusFilter !== "all") {
      result = result.filter((volunteer) => volunteer.status === statusFilter);
    }

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((volunteer) => {
        const name = (
          volunteer.user?.name ||
          volunteer.name ||
          ""
        ).toLowerCase();

        const email = (
          volunteer.user?.email ||
          volunteer.email ||
          ""
        ).toLowerCase();

        return name.includes(search) || email.includes(search);
      });
    }

    return result;
  }, [volunteers, searchTerm, statusFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVolunteers.length / VOLUNTEERS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedVolunteers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * VOLUNTEERS_PER_PAGE;

    return filteredVolunteers.slice(
      startIndex,
      startIndex + VOLUNTEERS_PER_PAGE,
    );
  }, [filteredVolunteers, safeCurrentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // ============================================================
  // CSV
  // ============================================================

  const handleExportCSV = () => {
    if (filteredVolunteers.length === 0) {
      return;
    }

    const headers = ["Name", "Email", "Status", "Availability"];

    const csvRows = filteredVolunteers.map((volunteer) => [
      volunteer.user?.name || volunteer.name || "",
      volunteer.user?.email || volunteer.email || "",
      volunteer.status || "",
      volunteer.availability || "",
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "stand-for-people-volunteers.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showSuccessToast("Volunteer directory exported successfully.");
  };

  // ============================================================
  // TABLE
  // ============================================================

  const rows = paginatedVolunteers.map((volunteer) => ({
    ...volunteer,

    volunteerName:
      volunteer.user?.name || volunteer.name || "Unknown volunteer",

    email: volunteer.user?.email || volunteer.email || "N/A",

    availability: volunteer.availability || "unavailable",
  }));

  const tableColumns = [
    {
      key: "volunteerName",
      header: "Volunteer",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "availability",
      header: "Availability",
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
    },
  ];

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Volunteers"
          subtitle="Manage registered volunteers, review applications, and coordinate volunteer participation."
        />

        <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
          <div className="text-center">
            <Loader2
              size={28}
              className="mx-auto mb-4 animate-spin text-primary"
            />

            <p className="text-sm font-semibold text-text-primary">
              Loading volunteers...
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Retrieving the volunteer directory and pending applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (pageError) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Volunteers"
          subtitle="Manage registered volunteers, review applications, and coordinate volunteer participation."
        />

        <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
          {pageError}
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <>
      <div className="space-y-10">
        <PageHeader
          title="Volunteers"
          subtitle="Manage registered volunteers, review applications, and coordinate volunteer participation."
          action={
            <div className="flex w-full items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredVolunteers.length === 0}
                className="group inline-flex h-10 items-center gap-2 border border-border bg-surface px-4 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50">
                <Download
                  size={15}
                  strokeWidth={1.8}
                  className="text-text-secondary transition-colors group-hover:text-primary"
                />

                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={openRequestModal}
                className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover">
                <Send size={16} strokeWidth={2} />

                <span>Invite Volunteers</span>
              </button>
            </div>
          }
        />

        <VolunteerStats
          total={statistics.total}
          active={statistics.active}
          pending={statistics.pendingApplications}
          inactive={statistics.inactive}
          suspended={statistics.suspended}
        />

        {/* APPLICATION REVIEW */}

        <section>
          <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2.5 px-2">
                <span className="h-1.5 w-1.5 bg-primary" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  Requires review
                </span>
              </div>

              <h2 className="font-fraunces text-[25px] font-semibold leading-tight tracking-tight text-text-primary">
                Volunteer applications
              </h2>

              <p className="mt-1.5 max-w-xl text-[13px] leading-5 text-text-secondary">
                Review individuals who have applied to join the volunteer
                network. Accepted applications create active volunteer profiles.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden h-8 border-l border-border sm:block" />

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                  Pending
                </p>

                <p className="mt-0.5 text-sm font-semibold text-text-primary">
                  {statistics.pendingApplications}{" "}
                  <span className="font-normal text-text-secondary">
                    {statistics.pendingApplications === 1
                      ? "request"
                      : "requests"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {requestsError && (
            <div className="mb-5 border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
              {requestsError}
            </div>
          )}

          <div className="border border-border bg-surface">
            {requestsLoading ? (
              <div className="flex min-h-35 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Loader2 size={17} className="animate-spin text-primary" />

                  <span>Loading volunteer applications...</span>
                </div>
              </div>
            ) : pendingApplicationRequests.length === 0 ? (
              <div className="flex min-h-35 items-center justify-center px-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-text-primary">
                    No pending applications
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    New individual applications will appear here for review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pendingApplicationRequests.map((request) => {
                  const user = request.user || {};

                  const name = user.name || request.name || "Unknown applicant";

                  const email = user.email || request.email || "N/A";

                  const phone = user.phone || request.phone || "";

                  const createdAt = request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "N/A";

                  const isProcessing = processingRequest?.id === request.id;

                  const isAccepting =
                    isProcessing && processingRequest?.action === "accept";

                  const isRejecting =
                    isProcessing && processingRequest?.action === "reject";

                  return (
                    <div
                      key={request.id}
                      className="group flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-background lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/8 text-sm font-semibold text-primary">
                            {name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <h3 className="truncate text-sm font-semibold text-text-primary">
                                {name}
                              </h3>

                              <span className="inline-flex items-center border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-700">
                                Pending
                              </span>
                            </div>

                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                              <span>{email}</span>

                              {phone && (
                                <>
                                  <span className="text-border">•</span>

                                  <span>{phone}</span>
                                </>
                              )}
                            </div>

                            <p className="mt-2 text-[11px] text-text-secondary">
                              Applied {createdAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 lg:pl-6">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRejectApplication(request)}
                          className="inline-flex h-9 items-center gap-2 border border-border bg-surface px-3.5 text-xs font-semibold text-text-secondary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                          {isRejecting ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <X size={14} strokeWidth={2} />
                          )}

                          <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleAcceptApplication(request)}
                          className="inline-flex h-9 items-center gap-2 bg-primary px-3.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
                          {isAccepting ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} strokeWidth={2} />
                          )}

                          <span>{isAccepting ? "Accepting..." : "Accept"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* VOLUNTEER DIRECTORY */}

        <section className="mt-20">
          <div className="mb-6">
            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2.5 px-2">
                  <span className="h-1.5 w-1.5 bg-primary" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    Administration
                  </span>
                </div>

                <h2 className="font-fraunces text-[25px] font-semibold leading-tight tracking-tight text-text-primary">
                  Volunteer directory
                </h2>

                <p className="mt-1.5 max-w-xl text-[13px] leading-5 text-text-secondary">
                  Manage registered volunteer profiles and their current status
                  and availability.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <span className="hidden h-8 border-l border-border sm:block" />

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                    Showing
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-text-primary">
                    {filteredVolunteers.length}{" "}
                    <span className="font-normal text-text-secondary">
                      {filteredVolunteers.length === 1
                        ? "volunteer"
                        : "volunteers"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex min-h-0 min-w-0 flex-col border border-border bg-surface">
              <div className="shrink-0 border-b border-border px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by volunteer name or email"
                      className="h-10 w-full border border-border bg-background px-3.5 text-[13px] font-medium text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 hover:border-text-secondary/30 focus:border-primary/50 focus:bg-surface"
                    />
                  </div>

                  <div className="flex shrink-0 items-center gap-5">
                    <div className="hidden h-7 border-l border-border lg:block" />

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                        Directory
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-text-primary">
                        {filteredVolunteers.length}{" "}
                        {filteredVolunteers.length === 1 ? "result" : "results"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 border-b border-border bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Registered volunteers
                  </p>

                  <p className="mt-0.5 text-xs text-text-secondary">
                    Status is managed by the administrator. Availability is
                    derived from current campaign assignments.
                  </p>
                </div>

                <span className="text-[11px] font-medium text-text-secondary">
                  {filteredVolunteers.length} registered
                </span>
              </div>

              <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
                <div className="min-w-190">
                  <VolunteerTable
                    columns={tableColumns}
                    rows={rows}
                    resultCount={filteredVolunteers.length}
                    onView={handleViewVolunteer}
                    onEdit={handleEditVolunteer}
                  />
                </div>
              </div>

              {filteredVolunteers.length > 0 && (
                <div className="shrink-0 border-t border-border">
                  <VolunteerPagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    totalItems={filteredVolunteers.length}
                    perPage={VOLUNTEERS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>

            <aside className="flex flex-col self-start border border-primary/90 bg-primary">
              <div className="shrink-0 px-5 pb-5 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Directory controls
                </p>

                <h2 className="mt-1.5 font-fraunces text-[21px] leading-tight text-white">
                  Refine volunteers
                </h2>

                <p className="mt-2 max-w-55 text-[12px] leading-5 text-white/50">
                  Filter registered volunteers by their current account status.
                </p>
              </div>

              <div className="bg-black/4 px-4 py-5">
                <VolunteerFilters
                  statusFilter={statusFilter}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </aside>
          </div>
        </section>
      </div>

      <VolunteerSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() =>
          setToast({
            show: false,
            message: "",
          })
        }
      />

      <VolunteerRequestModal
        open={showRequestModal}
        users={candidateUsers}
        selectedUsers={selectedUsers}
        loading={candidateLoading}
        submitting={requestLoading}
        error={candidateError || requestError}
        onClose={closeRequestModal}
        onToggleUser={handleToggleUser}
        onSelectAll={handleSelectAll}
        onSubmit={handleSendRequests}
      />

      {/* VIEW VOLUNTEER */}

      <ViewModal
        open={viewModalOpen}
        volunteer={selectedVolunteer}
        loading={viewLoading}
        error={viewError}
        onClose={closeViewModal}
        onViewCampaign={handleViewCampaign}
      />

      {/* EDIT VOLUNTEER */}

      <EditModal
        open={editModalOpen}
        volunteer={selectedVolunteer?.volunteer || selectedVolunteer}
        loading={editLoading}
        saving={editSaving}
        error={editError}
        onClose={closeEditModal}
        onSave={handleSaveVolunteerStatus}
      />
    </>
  );
};

export default Volunteers;
