import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Download, Search, X } from "lucide-react";

import {
  acceptAssignment,
  fetchAssignments,
  rejectAssignment,
  requestWithdrawal,
  updateAssignment,
} from "./api/helpRequestApi";

import { normalizeAssignment } from "./utils/helpRequestUtils";

import PageHeader from "@/components/dashboard/PageHeader";

import Stats from "./components/Stats";
import CategoryTabs from "./components/CategoryTabs";
import Filters from "./components/Filters";
import Table from "./components/Table";
import Pagination from "./components/Pagination";
import CaseReviewDrawer from "./components/CaseReviewDrawer";

import RejectionModal from "./modals/RejectionModal";
import WithdrawalModal from "./modals/WithdrawalModal";

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
  pending: {
    label: "Needs response",
    short: "Needs response",
  },

  assigned: {
    label: "Assigned",
    short: "Assigned",
  },

  accepted: {
    label: "Accepted",
    short: "Accepted",
  },

  active: {
    label: "In progress",
    short: "In progress",
  },

  completed: {
    label: "Completed",
    short: "Completed",
  },

  rejected: {
    label: "Declined",
    short: "Declined",
  },

  withdrawal: {
    label: "Withdrawal requested",
    short: "Withdrawal",
  },
};

/* =========================================================
   CATEGORY TABS
========================================================= */

const CATEGORY_KEYS = [
  {
    key: "all",
    label: "All Requests",
  },
  {
    key: "pending",
    label: "Needs response",
  },
  {
    key: "assigned",
    label: "Assigned",
  },
  {
    key: "active",
    label: "In progress",
  },
  {
    key: "completed",
    label: "Completed",
  },
  {
    key: "rejected",
    label: "Declined",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const OrgHelpRequests = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [withdrawalRequest, setWithdrawalRequest] = useState(null);
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [withdrawalError, setWithdrawalError] = useState("");
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const [rejectionRequest, setRejectionRequest] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [rejectionLoading, setRejectionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("all");

  const [filterValues, setFilterValues] = useState({
    category: "all",
    priority: "all",
    assignment: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  /* =========================================================
     NORMALIZE ASSIGNMENTS
  ========================================================= */

  const normalizeAssignments = (rawAssignments) => {
    if (!Array.isArray(rawAssignments)) {
      return [];
    }

    return rawAssignments
      .map((assignment) => {
        try {
          return normalizeAssignment(assignment);
        } catch (err) {
          console.error(
            "Failed to normalize organization assignment:",
            assignment,
            err,
          );

          return null;
        }
      })
      .filter(Boolean);
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadInitialAssignments = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAssignments();

        if (cancelled) {
          return;
        }

        const rawAssignments = Array.isArray(data?.assignments)
          ? data.assignments
          : [];

        const normalizedAssignments = normalizeAssignments(rawAssignments);

        setAssignments(normalizedAssignments);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load assigned help requests.");
          setAssignments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialAssignments();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     REQUEST STATUS HELPERS
  ========================================================= */

  const getRequestStatus = (request) => {
    const assignmentStatus = String(
      request?.rawAssignment?.status || request?.status || "",
    ).toLowerCase();

    const helpRequestStatus = String(
      request?.rawHelpRequest?.status || "",
    ).toLowerCase();

    if (assignmentStatus === "rejected") {
      return "rejected";
    }

    /*
     * Help Request progress is independent from assignment status.
     *
     * The assignment remains "accepted" while the Help Request
     * moves from "verified" to "in_progress".
     */
    if (
      helpRequestStatus === "in_progress" &&
      assignmentStatus === "accepted"
    ) {
      return "active";
    }

    if (helpRequestStatus === "completed" && assignmentStatus !== "rejected") {
      return "completed";
    }

    if (assignmentStatus === "accepted") {
      return "assigned";
    }

    if (assignmentStatus === "pending") {
      return "pending";
    }

    if (assignmentStatus === "in_progress") {
      return "active";
    }

    if (assignmentStatus === "completed") {
      return "completed";
    }

    if (assignmentStatus === "assigned") {
      return "assigned";
    }

    return "pending";
  };

  /* =========================================================
     COUNTS
  ========================================================= */

  const counts = useMemo(() => {
    let pendingCount = 0;
    let assignedCount = 0;
    let activeCount = 0;
    let completedCount = 0;
    let rejectedCount = 0;

    assignments.forEach((request) => {
      const status = getRequestStatus(request);

      switch (status) {
        case "pending":
          pendingCount += 1;
          break;

        case "assigned":
          assignedCount += 1;
          break;

        case "active":
          activeCount += 1;
          break;

        case "completed":
          completedCount += 1;
          break;

        case "rejected":
          rejectedCount += 1;
          break;

        default:
          break;
      }
    });

    return {
      all: assignments.length,
      pending: pendingCount,
      assigned: assignedCount,
      active: activeCount,
      completed: completedCount,
      rejected: rejectedCount,
    };
  }, [assignments]);

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const filterOptions = useMemo(() => {
    const categories = [
      {
        value: "all",
        label: "All categories",
      },
    ];

    const categorySet = new Set();

    assignments.forEach((request) => {
      if (request?.category) {
        categorySet.add(request.category);
      }
    });

    [...categorySet].sort().forEach((category) => {
      categories.push({
        value: category,
        label: category,
      });
    });

    return {
      category: categories,

      priority: [
        {
          value: "all",
          label: "All priorities",
        },
        {
          value: "critical",
          label: "Critical",
        },
        {
          value: "high",
          label: "High",
        },
        {
          value: "medium",
          label: "Medium",
        },
        {
          value: "normal",
          label: "Normal",
        },
      ],

      assignment: [
        {
          value: "all",
          label: "All assignments",
        },
        {
          value: "pending",
          label: "Needs response",
        },
        {
          value: "assigned",
          label: "Assigned",
        },
        {
          value: "rejected",
          label: "Declined",
        },
      ],

      status: [
        {
          value: "all",
          label: "All",
        },
        {
          value: "pending",
          label: "Pending",
        },
        {
          value: "assigned",
          label: "Assigned",
        },
        {
          value: "active",
          label: "Active",
        },
        {
          value: "completed",
          label: "Completed",
        },
        {
          value: "rejected",
          label: "Rejected",
        },
      ],
    };
  }, [assignments]);

  /* =========================================================
     FILTER CHANGE
  ========================================================= */

  const handleFilterChange = (key, value) => {
    setFilterValues((current) => ({
      ...current,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setActiveCategory("all");

    setFilterValues({
      category: "all",
      priority: "all",
      assignment: "all",
      status: "all",
    });

    setSearch("");
    setCurrentPage(1);
  };

  /* =========================================================
     FILTERED REQUESTS
  ========================================================= */

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((request) => {
      const requestStatus = getRequestStatus(request);

      if (activeCategory !== "all" && requestStatus !== activeCategory) {
        return false;
      }

      const selectedCategory = filterValues.category;

      if (selectedCategory !== "all" && request.category !== selectedCategory) {
        return false;
      }

      const selectedPriority = filterValues.priority;

      if (selectedPriority !== "all") {
        const requestUrgency = String(
          request.urgency || request.priority || "normal",
        ).toLowerCase();

        if (requestUrgency !== selectedPriority) {
          return false;
        }
      }

      const selectedAssignment = filterValues.assignment;

      if (
        selectedAssignment !== "all" &&
        requestStatus !== selectedAssignment
      ) {
        return false;
      }

      const selectedStatus = filterValues.status;

      if (selectedStatus !== "all" && requestStatus !== selectedStatus) {
        return false;
      }

      if (query) {
        const searchableText = [
          request.title,
          request.description,
          request.category,
          request.district,
          request.address,
          request.individual,
          request.location,
          request.status,
          request.urgency,
          request.priority,
          request.assignmentId,
        ]
          .filter((value) => value !== null && value !== undefined)
          .map((value) => String(value))
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, assignments, filterValues, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredRequests.slice(start, start + pageSize);
  }, [currentPage, filteredRequests]);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  /* =========================================================
     START SUPPORT
  ========================================================= */

  const handleStartSupport = (request) => {
    const helpRequestId =
      request?.rawHelpRequest?.id ??
      request?.helpRequestId ??
      request?.rawAssignment?.help_request_id ??
      null;

    console.log("START SUPPORT:", {
      request,
      helpRequestId,
    });

    if (!helpRequestId) {
      setError(
        "Unable to identify this help request. Please refresh the page and try again.",
      );

      return;
    }

    setSelectedRequest(null);

    navigate("/organization/dashboard/campaigns", {
      state: {
        openCreateCampaign: true,
        helpRequestId: String(helpRequestId),
      },
    });
  };

  /* =========================================================
     ASSIGNMENT ACTIONS
  ========================================================= */

  const handleAssignmentAction = async (request, action) => {
    console.log("ASSIGNMENT ACTION:", {
      request,
      action,
      assignmentId: request?.assignmentId,
    });

    if (!request?.assignmentId || actionLoading) {
      return;
    }

    if (action === "reject") {
      setRejectionRequest(request);
      setRejectionNote("");
      setRejectionError("");
      return;
    }

    if (action !== "accept") {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await acceptAssignment(request.assignmentId);

      const data = await fetchAssignments();

      const rawAssignments = Array.isArray(data?.assignments)
        ? data.assignments
        : [];

      const normalized = normalizeAssignments(rawAssignments);

      setAssignments(normalized);

      const updated = normalized.find(
        (item) => String(item.assignmentId) === String(request.assignmentId),
      );

      setSelectedRequest(updated || null);
    } catch (err) {
      setError(err?.message || "Unable to accept this assignment.");
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     UPDATE ASSIGNMENT
  ========================================================= */

  const handleUpdateAssignment = async (assignmentId, fields) => {
    if (!assignmentId || !fields || typeof fields !== "object") {
      setError(
        "Assignment information is missing. Please refresh the page and try again.",
      );

      return false;
    }

    try {
      setActionLoading(true);
      setError("");

      const updateResponse = await updateAssignment(assignmentId, fields);

      const updatedAssignment = updateResponse?.assignment;

      if (!updatedAssignment) {
        throw new Error(
          "The case was updated, but the updated case data was not returned.",
        );
      }

      const updated = normalizeAssignment(updatedAssignment);

      setAssignments((currentAssignments) =>
        currentAssignments.map((item) =>
          String(item.assignmentId) === String(assignmentId) ? updated : item,
        ),
      );

      setSelectedRequest((currentRequest) =>
        currentRequest &&
        String(currentRequest.assignmentId) === String(assignmentId)
          ? updated
          : currentRequest,
      );

      return true;
    } catch (err) {
      console.error("FAILED: organization assignment update", err);

      setError(err?.message || "Failed to update the help request.");

      return false;
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     REJECTION
  ========================================================= */

  const handleSubmitRejection = async () => {
    if (!rejectionRequest?.assignmentId || rejectionLoading) {
      return;
    }

    const note = rejectionNote.trim();

    if (!note) {
      setRejectionError(
        "Please provide a reason for rejecting this assignment.",
      );

      return;
    }

    try {
      setRejectionLoading(true);
      setRejectionError("");
      setError("");

      await rejectAssignment(rejectionRequest.assignmentId, note);

      const rejectedAssignmentId = rejectionRequest.assignmentId;

      setRejectionRequest(null);
      setRejectionNote("");

      const data = await fetchAssignments();

      const rawAssignments = Array.isArray(data?.assignments)
        ? data.assignments
        : [];

      const normalized = normalizeAssignments(rawAssignments);

      setAssignments(normalized);

      const updated = normalized.find(
        (item) => String(item.assignmentId) === String(rejectedAssignmentId),
      );

      setSelectedRequest(updated || null);
    } catch (err) {
      setRejectionError(err?.message || "Unable to reject this assignment.");
    } finally {
      setRejectionLoading(false);
    }
  };

  /* =========================================================
     WITHDRAWAL
  ========================================================= */

  const handleSubmitWithdrawal = async () => {
    if (!withdrawalRequest?.assignmentId || withdrawalLoading) {
      return;
    }

    const reason = withdrawalReason.trim();

    if (reason.length < 10) {
      setWithdrawalError(
        "Please provide at least 10 characters explaining why your organization needs to withdraw.",
      );

      return;
    }

    try {
      setWithdrawalLoading(true);
      setWithdrawalError("");
      setError("");

      const response = await requestWithdrawal(
        withdrawalRequest.assignmentId,
        reason,
      );

      const updatedAssignment = response?.assignment;

      if (!updatedAssignment) {
        throw new Error(
          "Withdrawal request was submitted, but updated assignment data was not returned.",
        );
      }

      const updated = normalizeAssignment(updatedAssignment);

      setAssignments((currentAssignments) =>
        currentAssignments.map((item) =>
          String(item.assignmentId) === String(withdrawalRequest.assignmentId)
            ? updated
            : item,
        ),
      );

      setSelectedRequest((currentRequest) =>
        currentRequest &&
        String(currentRequest.assignmentId) ===
          String(withdrawalRequest.assignmentId)
          ? updated
          : currentRequest,
      );

      setWithdrawalRequest(null);
      setWithdrawalReason("");
      setWithdrawalError("");
    } catch (err) {
      setWithdrawalError(
        err?.message || "Unable to submit the withdrawal request.",
      );
    } finally {
      setWithdrawalLoading(false);
    }
  };

  /* =========================================================
     EXPORT CSV
  ========================================================= */

  const handleExportCsv = () => {
    const rows = filteredRequests.map((request) => ({
      title: request?.title || "",
      category: request?.category || "",
      district: request?.district || "",
      individual: request?.individual || "",
      status: getRequestStatus(request),
      urgency: request?.urgency || request?.priority || "",
      createdAt: request?.rawHelpRequest?.created_at || "",
    }));

    const headers = [
      "Help Request",
      "Category",
      "District",
      "Requester",
      "Status",
      "Priority",
      "Submitted",
    ];

    const csvRows = [
      headers,
      ...rows.map((row) => [
        row.title,
        row.category,
        row.district,
        row.individual,
        row.status,
        row.urgency,
        row.createdAt,
      ]),
    ];

    const csv = csvRows
      .map((row) =>
        row
          .map((value) => {
            const textValue = String(value ?? "");

            return `"${textValue.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "organization-help-requests.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div>
      <PageHeader
        title="Help Requests"
        subtitle="Review and manage help requests assigned to your organization through the Stand For People platform."
      />

      {error && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3">
          <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-red-500 transition-colors hover:text-red-700"
              aria-label="Dismiss error">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Stats
        total={counts.all}
        pending={counts.pending}
        assigned={counts.assigned}
        active={counts.active}
        completed={counts.completed}
        rejected={counts.rejected}
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto mt-20 max-w-[1600px]">
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
              Organization workspace
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-text-primary">
              Help request management
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
              Review cases assigned to your organization, respond to
              assignments, and manage active support work.
            </p>
          </div>

          <div className="grid items-stretch lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex min-w-0 flex-col border border-border bg-surface">
              <div className="border-b border-border px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative min-w-0 flex-1 lg:w-full">
                    <Search
                      size={16}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Search help requests..."
                      aria-label="Search help requests"
                      className="w-full border border-border bg-background px-10 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={filteredRequests.length === 0}
                    className="inline-flex items-center justify-center gap-2 border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">
                    <Download size={14} strokeWidth={1.8} />
                    Export CSV
                  </button>
                </div>
              </div>

              <Table
                requests={assignments}
                filteredRequests={paginatedRequests}
                loading={loading}
                statusConfig={STATUS_CONFIG}
                onOpenCase={setSelectedRequest}
                onClearFilters={clearFilters}
                search={search}
              />

              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={filteredRequests.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>

            <Filters
              filters={filterOptions}
              values={filterValues}
              counts={counts}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </div>
        </div>
      </section>

      <CaseReviewDrawer
        request={selectedRequest}
        statusConfig={STATUS_CONFIG}
        onClose={() => setSelectedRequest(null)}
        onAction={handleAssignmentAction}
        onStartSupport={handleStartSupport}
        onUpdateAssignment={handleUpdateAssignment}
        onRequestWithdrawal={(request) => {
          if (request?.withdrawalStatus === "pending") {
            return;
          }

          setWithdrawalRequest(request);
          setWithdrawalReason("");
          setWithdrawalError("");
        }}
        actionLoading={actionLoading}
      />

      <WithdrawalModal
        request={withdrawalRequest}
        reason={withdrawalReason}
        setReason={setWithdrawalReason}
        loading={withdrawalLoading}
        error={withdrawalError}
        onClose={() => {
          if (withdrawalLoading) {
            return;
          }

          setWithdrawalRequest(null);
          setWithdrawalReason("");
          setWithdrawalError("");
        }}
        onSubmit={handleSubmitWithdrawal}
      />

      <RejectionModal
        request={rejectionRequest}
        note={rejectionNote}
        setNote={setRejectionNote}
        error={rejectionError}
        setError={setRejectionError}
        loading={rejectionLoading}
        onClose={() => {
          if (rejectionLoading) {
            return;
          }

          setRejectionRequest(null);
          setRejectionNote("");
          setRejectionError("");
        }}
        onSubmit={handleSubmitRejection}
      />
    </div>
  );
};

export default OrgHelpRequests;
