import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Download,
  Plus,
  Search,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";

import CampaignStats from "./components/Stats";
import CampaignCategoryTabs from "./components/CategoryTabs";
import CampaignFilters from "./components/Filters";
import CampaignTable from "./components/Table";
import CampaignPagination from "./components/Pagination";

import CampaignViewModal from "./modals/ViewModal";
import CampaignVerificationModal from "./modals/VerificationModal";
// import CampaignStatusUpdateModal from "./modals/StatusUpdateModal";
import CampaignEditModal from "./modals/EditModal";
import CampaignSuccessToast from "./components/SuccessToast";
import CampaignRelatedDetailsModal from "./modals/RelatedDetailsModal";
import CampaignCreateModal from "./modals/CampaignCreateModal";
import CampaignAssignmentModal from "./modals/AssignmentModal";

import {
  fetchCampaigns,
  fetchCampaignVolunteerCandidates,
  fetchCampaignVolunteerAssignments,
  assignCampaignVolunteer,
  verifyCampaign,
  // updateCampaignStatus,
  updateCampaign,
  createCampaign,
} from "./api/campaignsAPI";

const CAMPAIGNS_PER_PAGE = 25;

/*
|--------------------------------------------------------------------------
| CAMPAIGN STATUS WORKFLOW
|--------------------------------------------------------------------------
|
| unverified → active
| unverified → rejected
|
| active → completed
| active → cancelled
|
| rejected / completed / cancelled → no further transition
|
| IMPORTANT:
| There is NO pending_review status.
|
*/

const CAMPAIGN_STATUS_TRANSITIONS = {
  unverified: ["active", "rejected"],
  active: ["completed", "cancelled"],
  rejected: [],
  completed: [],
  cancelled: [],
};

const EDITABLE_STATUSES = ["unverified", "active"];

const STATUS_CHANGEABLE_STATUSES = ["active"];

/*
|--------------------------------------------------------------------------
| Normalize campaign
|--------------------------------------------------------------------------
*/

const normalizeCampaign = (campaign) => {
  if (!campaign) {
    return campaign;
  }

  return {
    ...campaign,
    status: campaign.status || "",
  };
};

const normalizeCampaigns = (campaigns) => {
  if (!Array.isArray(campaigns)) {
    return [];
  }

  return campaigns.map(normalizeCampaign);
};

/*
|--------------------------------------------------------------------------
| Campaign type label
|--------------------------------------------------------------------------
*/

const getCampaignTypeLabel = (type) => {
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

const Campaigns = () => {
  // =========================================================
  // Campaign data
  // =========================================================

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // Success toast
  // =========================================================

  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  const showSuccessToast = (message) => {
    setSuccessToast({
      show: true,
      message,
    });
  };

  useEffect(() => {
    if (!successToast.show) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessToast({
        show: false,
        message: "",
      });
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [successToast.show, successToast.message]);

  // =========================================================
  // Create modal
  // =========================================================

  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // =========================================================
  // View modal
  // =========================================================

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // =========================================================
  // Related campaign details modal
  // =========================================================

  const [relatedCampaign, setRelatedCampaign] = useState(null);

  // =========================================================
  // Verification modal
  // =========================================================

  const [verificationCampaign, setVerificationCampaign] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // =========================================================
  // Status update modal
  // =========================================================

  // const [statusCampaign, setStatusCampaign] = useState(null);
  // const [statusLoading, setStatusLoading] = useState(false);
  // const [statusError, setStatusError] = useState("");

  // =========================================================
  // Edit modal
  // =========================================================

  const [editCampaign, setEditCampaign] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // =========================================================
  // Assignment modal
  // =========================================================

  const [assignmentCampaign, setAssignmentCampaign] = useState(null);
  const [assignmentVolunteers, setAssignmentVolunteers] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");

  // =========================================================
  // Filters
  // =========================================================

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================================================
  // Sorting
  // =========================================================

  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // =========================================================
  // Pagination
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // Load campaigns
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCampaigns();

        if (cancelled) {
          return;
        }

        const fetchedCampaigns = data?.campaigns || data?.data || [];

        setCampaigns(normalizeCampaigns(fetchedCampaigns));
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message || "Something went wrong while loading campaigns.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // Statistics
  // =========================================================

  const statistics = useMemo(() => {
    return {
      total: campaigns.length,

      unverified: campaigns.filter(
        (campaign) => campaign.status === "unverified",
      ).length,

      active: campaigns.filter((campaign) => campaign.status === "active")
        .length,

      completed: campaigns.filter((campaign) => campaign.status === "completed")
        .length,

      rejected: campaigns.filter((campaign) => campaign.status === "rejected")
        .length,

      cancelled: campaigns.filter((campaign) => campaign.status === "cancelled")
        .length,
    };
  }, [campaigns]);

  // =========================================================
  // Status tabs
  // =========================================================

  const categoryTabs = useMemo(
    () => [
      {
        key: "all",
        label: "All Campaigns",
        count: statistics.total,
      },
      {
        key: "unverified",
        label: "Unverified",
        count: statistics.unverified,
      },
      {
        key: "active",
        label: "Active",
        count: statistics.active,
      },
      {
        key: "completed",
        label: "Completed",
        count: statistics.completed,
      },
      {
        key: "rejected",
        label: "Rejected",
        count: statistics.rejected,
      },
      {
        key: "cancelled",
        label: "Cancelled",
        count: statistics.cancelled,
      },
    ],
    [statistics],
  );

  // =========================================================
  // Filtering + sorting
  // =========================================================

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];

    if (activeCategory !== "all") {
      result = result.filter((campaign) => campaign.status === activeCategory);
    }

    if (typeFilter !== "all") {
      result = result.filter((campaign) => campaign.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (campaign) => campaign.category === categoryFilter,
      );
    }

    if (organizationFilter !== "all") {
      result = result.filter(
        (campaign) =>
          String(campaign.organization_id) === String(organizationFilter),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((campaign) => campaign.status === statusFilter);
    }

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((campaign) => {
        const title = String(campaign.title || "").toLowerCase();

        const description = String(campaign.description || "").toLowerCase();

        const category = String(campaign.category || "").toLowerCase();

        const organizationName = String(
          campaign.organization?.name || "",
        ).toLowerCase();

        const location = String(
          campaign.location || campaign.district || "",
        ).toLowerCase();

        return (
          title.includes(search) ||
          description.includes(search) ||
          category.includes(search) ||
          organizationName.includes(search) ||
          location.includes(search)
        );
      });
    }

    if (!sortConfig.key || !sortConfig.direction) {
      return result;
    }

    result.sort((a, b) => {
      let first = a[sortConfig.key];
      let second = b[sortConfig.key];

      if (
        ["created_at", "start_date", "end_date", "proposal_date"].includes(
          sortConfig.key,
        )
      ) {
        first = first ? new Date(first).getTime() : 0;
        second = second ? new Date(second).getTime() : 0;
      }

      if (["target_amount", "collected_amount"].includes(sortConfig.key)) {
        first = Number(first || 0);
        second = Number(second || 0);
      }

      first = first ?? "";
      second = second ?? "";

      if (typeof first === "string") {
        first = first.toLowerCase();
        second = String(second).toLowerCase();
      }

      if (first < second) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (first > second) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [
    campaigns,
    activeCategory,
    typeFilter,
    categoryFilter,
    organizationFilter,
    statusFilter,
    searchTerm,
    sortConfig,
  ]);

  // =========================================================
  // Pagination
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCampaigns = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE;

    return filteredCampaigns.slice(startIndex, startIndex + CAMPAIGNS_PER_PAGE);
  }, [filteredCampaigns, safeCurrentPage]);

  // =========================================================
  // Filter controls
  // =========================================================

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleTypeChange = (event) => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleOrganizationChange = (event) => {
    setOrganizationFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // =========================================================
  // Sorting
  // =========================================================

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key !== key) {
        return {
          key,
          direction: "asc",
        };
      }

      if (current.direction === "asc") {
        return {
          key,
          direction: "desc",
        };
      }

      return {
        key: null,
        direction: null,
      };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown size={14} strokeWidth={1.8} />;
    }

    if (sortConfig.direction === "asc") {
      return <ArrowUp size={14} strokeWidth={2} />;
    }

    return <ArrowDown size={14} strokeWidth={2} />;
  };

  // =========================================================
  // Create campaign
  // =========================================================

  const handleCreate = () => {
    setCreateError("");
    setCreateCampaignOpen(true);
  };

  const handleCreateConfirm = async (payload) => {
    try {
      setCreateLoading(true);
      setCreateError("");

      const data = await createCampaign(payload);

      const createdCampaign = data?.campaign || data?.data || data;

      if (createdCampaign) {
        const normalizedCampaign = normalizeCampaign({
          ...createdCampaign,
          status: createdCampaign.status || "unverified",
        });

        setCampaigns((current) => [normalizedCampaign, ...current]);
      } else {
        const refreshed = await fetchCampaigns();

        const fetchedCampaigns = refreshed?.campaigns || refreshed?.data || [];

        setCampaigns(normalizeCampaigns(fetchedCampaigns));
      }

      setCreateCampaignOpen(false);
      setCreateError("");
      setCurrentPage(1);

      showSuccessToast("Campaign created successfully.");
    } catch (err) {
      setCreateError(err?.message || "Campaign creation failed.");
    } finally {
      setCreateLoading(false);
    }
  };

  // =========================================================
  // View
  // =========================================================

  const handleView = (campaign) => {
    setSelectedCampaign(campaign);
  };

  // =========================================================
  // Campaign type / related information
  // =========================================================

  const handleCampaignTypeClick = (campaign) => {
    if (!campaign) {
      return;
    }

    setRelatedCampaign(campaign);
  };

  // =========================================================
  // Edit
  // =========================================================

  const handleEdit = (campaign) => {
    if (!EDITABLE_STATUSES.includes(campaign.status)) {
      return;
    }

    setEditError("");
    setEditCampaign(campaign);
  };

  const handleEditConfirm = async (payload) => {
    if (!editCampaign) {
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const data = await updateCampaign(editCampaign.id, payload);

      const updatedCampaign = normalizeCampaign(
        data?.campaign ||
          data?.data || {
            ...editCampaign,
            ...payload,
          },
      );

      setCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === editCampaign.id ? updatedCampaign : campaign,
        ),
      );

      setEditCampaign(null);

      showSuccessToast("Campaign information updated successfully.");
    } catch (err) {
      setEditError(err?.message || "Campaign information update failed.");
    } finally {
      setEditLoading(false);
    }
  };

  // =========================================================
  // Verification
  // =========================================================

  const handleReview = (campaign) => {
    if (campaign.status !== "unverified") {
      return;
    }

    setVerificationError("");
    setVerificationCampaign(campaign);
  };

  const handleVerificationConfirm = async ({ status, verification_note }) => {
    if (!verificationCampaign) {
      return;
    }

    if (status !== "active" && status !== "rejected") {
      setVerificationError("Invalid verification decision.");
      return;
    }

    if (verificationCampaign.status !== "unverified") {
      setVerificationError(
        "Only unverified campaigns can be verified or rejected.",
      );
      return;
    }

    try {
      setVerificationLoading(true);
      setVerificationError("");

      await verifyCampaign(verificationCampaign.id, {
        status,
        verification_note: verification_note || null,
      });

      setCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === verificationCampaign.id
            ? {
                ...campaign,
                status,
                verification_note: verification_note || null,
              }
            : campaign,
        ),
      );

      setVerificationCampaign(null);
      setVerificationError("");

      showSuccessToast(
        status === "active"
          ? "Campaign verified successfully."
          : "Campaign rejected successfully.",
      );

      try {
        const data = await fetchCampaigns();

        const fetchedCampaigns = data?.campaigns || data?.data || [];

        setCampaigns(normalizeCampaigns(fetchedCampaigns));
      } catch {
        // Local state is already updated.
      }
    } catch (err) {
      setVerificationError(err?.message || "Campaign verification failed.");
    } finally {
      setVerificationLoading(false);
    }
  };

  // =========================================================
  // Change Status
  // =========================================================

  // const handleStatusUpdate = (campaign) => {
  //   if (!STATUS_CHANGEABLE_STATUSES.includes(campaign.status)) {
  //     return;
  //   }

  //   setStatusError("");
  //   setStatusCampaign(campaign);
  // };

  // const handleStatusConfirm = async ({
  //   status: newStatus,
  //   status_note,
  // }) => {
  //   if (!statusCampaign) {
  //     return;
  //   }

  //   const allowedStatuses =
  //     CAMPAIGN_STATUS_TRANSITIONS[statusCampaign.status] || [];

  //   if (!allowedStatuses.includes(newStatus)) {
  //     setStatusError("This status transition is not allowed.");
  //     return;
  //   }

  //   try {
  //     setStatusLoading(true);
  //     setStatusError("");

  //     const data = await updateCampaignStatus(statusCampaign.id, {
  //       status: newStatus,
  //       status_note: status_note || null,
  //     });

  //     const updatedCampaign = normalizeCampaign(
  //       data?.campaign ||
  //         data?.data || {
  //           ...statusCampaign,
  //           status: newStatus,
  //           status_note: status_note || null,
  //         },
  //     );

  //     setCampaigns((current) =>
  //       current.map((campaign) =>
  //         campaign.id === statusCampaign.id ? updatedCampaign : campaign,
  //       ),
  //     );

  //     setStatusCampaign(null);

  //     showSuccessToast(
  //       newStatus === "completed"
  //         ? "Campaign marked as completed successfully."
  //         : "Campaign cancelled successfully.",
  //     );
  //   } catch (err) {
  //     setStatusError(err?.message || "Campaign status update failed.");
  //   } finally {
  //     setStatusLoading(false);
  //   }
  // };

  // =========================================================
  // Campaign volunteer assignment
  // =========================================================

  const handleAssignment = async (campaign) => {
    if (!campaign || campaign.status !== "active") {
      return;
    }

    setAssignmentCampaign(campaign);
    setAssignmentVolunteers([]);
    setAssignmentHistory([]);
    setAssignmentError("");
    setAssignmentLoading(true);

    try {
      const [candidateData, assignmentData] = await Promise.all([
        fetchCampaignVolunteerCandidates(),
        fetchCampaignVolunteerAssignments(campaign.id),
      ]);

      const volunteers = candidateData?.volunteers || candidateData?.data || [];

      const assignments =
        assignmentData?.assignments || assignmentData?.data || [];

      setAssignmentVolunteers(Array.isArray(volunteers) ? volunteers : []);
      setAssignmentHistory(Array.isArray(assignments) ? assignments : []);
    } catch (err) {
      setAssignmentError(
        err?.message || "Unable to load campaign volunteer information.",
      );
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleAssignmentConfirm = async (payload) => {
    if (!assignmentCampaign) {
      return;
    }

    try {
      setAssignmentSubmitting(true);
      setAssignmentError("");

      await assignCampaignVolunteer(assignmentCampaign.id, payload);

      const [candidateData, assignmentData] = await Promise.all([
        fetchCampaignVolunteerCandidates(),
        fetchCampaignVolunteerAssignments(assignmentCampaign.id),
      ]);

      const volunteers = candidateData?.volunteers || candidateData?.data || [];

      const assignments =
        assignmentData?.assignments || assignmentData?.data || [];

      setAssignmentVolunteers(Array.isArray(volunteers) ? volunteers : []);
      setAssignmentHistory(Array.isArray(assignments) ? assignments : []);

      showSuccessToast("Volunteer assigned to campaign successfully.");
    } catch (err) {
      setAssignmentError(
        err?.message || "Campaign volunteer assignment failed.",
      );
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  const handleAssignmentClose = () => {
    if (assignmentSubmitting) {
      return;
    }

    setAssignmentCampaign(null);
    setAssignmentVolunteers([]);
    setAssignmentHistory([]);
    setAssignmentError("");
    setAssignmentLoading(false);
  };

  // =========================================================
  // CSV export
  // =========================================================

  const handleExportCSV = () => {
    if (filteredCampaigns.length === 0) {
      return;
    }

    const headers = [
      "Campaign",
      "Campaign Type",
      "Target",
      "Collected",
      "Start Date",
      "End Date",
      "Status",
    ];

    const csvRows = filteredCampaigns.map((campaign) => [
      campaign.title || "",
      campaign.type || "",
      campaign.target_amount ?? "",
      campaign.collected_amount ?? 0,

      campaign.start_date
        ? new Date(campaign.start_date).toLocaleDateString()
        : "",

      campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : "",

      campaign.status || "",
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

    link.download = "stand-for-people-campaigns.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Campaigns"
          subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
        />

        <div className="flex min-h-70 items-center justify-center border-y border-border bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

            <p className="text-sm font-semibold text-text-primary">
              Loading campaigns...
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              Please wait while we retrieve the campaign list.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // Error
  // =========================================================

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Campaigns"
          subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
        />

        <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // =========================================================
  // Prepare table rows
  // =========================================================

  const rows = paginatedCampaigns.map((campaign, index) => ({
    ...campaign,

    serialNumber: (safeCurrentPage - 1) * CAMPAIGNS_PER_PAGE + index + 1,

    campaignType: getCampaignTypeLabel(campaign.type),

    target:
      campaign.target_amount !== null && campaign.target_amount !== undefined
        ? `৳${Number(campaign.target_amount).toLocaleString()}`
        : "—",

    collected: `৳${Number(campaign.collected_amount || 0).toLocaleString()}`,

    formattedStartDate: campaign.start_date
      ? new Date(campaign.start_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",

    formattedEndDate: campaign.end_date
      ? new Date(campaign.end_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",

    locationName:
      campaign.location || campaign.district || "Location not specified",
  }));

  // =========================================================
  // Table columns
  // =========================================================

  const columns = [
    {
      key: "serialNumber",
      header: "#",
      align: "center",
      width: "60px",
    },

    {
      key: "title",
      header: "Campaign",
      sortable: true,
      sortKey: "title",

      render: (value, row) => (
        <div className="min-w-0 max-w-90">
          <p className="truncate font-semibold text-text-primary">
            {value || "Untitled campaign"}
          </p>

          {row.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
              {row.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {row.category && (
              <span className="inline-flex items-center rounded-full bg-background-alt px-2 py-0.5 text-[10px] font-semibold capitalize text-text-secondary">
                {row.category}
              </span>
            )}

            {row.locationName !== "Location not specified" && (
              <>
                <span className="text-[10px] text-slate-300">•</span>

                <span className="truncate text-[10px] font-medium text-text-secondary">
                  {row.locationName}
                </span>
              </>
            )}
          </div>
        </div>
      ),
    },

    {
      key: "campaignType",
      header: "Campaign Type",
      sortable: true,
      sortKey: "type",

      render: (value, row) => (
        <button
          type="button"
          onClick={() => handleCampaignTypeClick(row)}
          className="text-left text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary"
          title={
            row.type === "local_case"
              ? "View connected help request"
              : row.type === "organization_proposed"
                ? "View connected organization"
                : "View global campaign details"
          }>
          {value}
        </button>
      ),
    },

    {
      key: "target",
      header: "Target",
      align: "right",
      sortable: true,
      sortKey: "target_amount",

      render: (value) => (
        <span className="whitespace-nowrap font-semibold text-text-primary">
          {value}
        </span>
      ),
    },

    {
      key: "collected",
      header: "Collected",
      align: "right",
      sortable: true,
      sortKey: "collected_amount",

      render: (value) => (
        <span className="whitespace-nowrap font-semibold text-text-primary">
          {value}
        </span>
      ),
    },

    {
      key: "formattedStartDate",
      header: "Start Date",
      sortable: true,
      sortKey: "start_date",

      render: (value) => (
        <span className="whitespace-nowrap text-sm font-medium text-text-primary">
          {value}
        </span>
      ),
    },

    {
      key: "formattedEndDate",
      header: "End Date",
      sortable: true,
      sortKey: "end_date",

      render: (value) => (
        <span className="whitespace-nowrap text-sm font-medium text-text-primary">
          {value}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",
      sortable: true,
      sortKey: "status",
    },

    {
      key: "actions",
      header: "Actions",
      align: "right",

      render: (_, row) => {
        const canEdit = EDITABLE_STATUSES.includes(row.status);

        const canVerify = row.status === "unverified";

        // const canChangeStatus = STATUS_CHANGEABLE_STATUSES.includes(
        //   row.status,
        // );

        const canAssign = row.status === "active";

        return (
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => handleView(row)}
              className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary">
              View
            </button>

            {canEdit && (
              <button
                type="button"
                onClick={() => handleEdit(row)}
                className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary">
                Edit
              </button>
            )}

            {canVerify && (
              <button
                type="button"
                onClick={() => handleReview(row)}
                className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover">
                Verify
              </button>
            )}

            {canAssign && (
              <button
                type="button"
                onClick={() => handleAssignment(row)}
                className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover">
                Assign Volunteers
              </button>
            )}

            {/*
              {canChangeStatus && (
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(row)}
                  className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                >
                  Change Status
                </button>
              )}
            */}
          </div>
        );
      },
    },
  ];

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="space-y-9">
      {/* SUCCESS TOAST */}

      <CampaignSuccessToast
        show={successToast.show}
        message={successToast.message}
      />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        title="Campaigns"
        subtitle="Review, verify, and manage fundraising campaigns across the Stand For People platform."
        action={
          <div className="flex w-full items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredCampaigns.length === 0}
              className="
                group
                inline-flex
                h-10
                items-center
                gap-2
                border
                border-border
                bg-surface
                px-4
                text-sm
                font-medium
                text-text-primary
                transition-all
                hover:border-primary/30
                hover:bg-background-alt
                disabled:cursor-not-allowed
                disabled:opacity-50
              ">
              <Download
                size={15}
                strokeWidth={1.8}
                className="
                  text-text-secondary
                  transition-colors
                  group-hover:text-primary
                "
              />

              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                bg-primary
                px-4
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                hover:bg-primary-hover
              ">
              <Plus size={17} strokeWidth={2} />

              <span>Add Campaign</span>
            </button>
          </div>
        }
      />

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <CampaignStats
        total={statistics.total}
        unverified={statistics.unverified}
        active={statistics.active}
        completed={statistics.completed}
        rejected={statistics.rejected}
        cancelled={statistics.cancelled}
      />

      {/* =====================================================
          CAMPAIGN MANAGEMENT
      ===================================================== */}

      <section className="border-t border-border pt-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* =================================================
              MAIN WORKSPACE
          ================================================= */}

          <div className="min-w-0">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Campaign directory
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                  Campaign records
                </h2>
              </div>

              <p className="text-xs font-medium text-text-secondary">
                {filteredCampaigns.length}{" "}
                {filteredCampaigns.length === 1 ? "campaign" : "campaigns"}{" "}
                shown
              </p>
            </div>

            <div className="overflow-hidden border border-border bg-surface">
              {/* =================================================
                  SEARCH
              ================================================= */}

              <div className="border-b border-border px-5 py-4">
                <div className="relative w-full">
                  <Search
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search campaigns by title, organization, category or location..."
                    className="h-10 w-full border border-border bg-background pl-10 pr-4 text-[13px] font-medium text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 hover:border-text-secondary/30 focus:border-primary/50 focus:bg-surface"
                  />
                </div>
              </div>

              {/* =================================================
                  CAMPAIGN TABLE
              ================================================= */}

              <CampaignTable
                columns={columns}
                rows={rows}
                onSort={handleSort}
                getSortIcon={getSortIcon}
                resultCount={filteredCampaigns.length}
              />
            </div>

            {filteredCampaigns.length > 0 && (
              <CampaignPagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={filteredCampaigns.length}
                itemsPerPage={CAMPAIGNS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside className="h-fit bg-primary text-white">
            <div className="border-b border-white/15 px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                Directory controls
              </p>

              <h3 className="mt-1 text-base font-bold tracking-tight text-white">
                Refine campaigns
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-white/70">
                Filter campaign records using the available campaign criteria.
              </p>
            </div>

            <div className="px-5 py-5">
              <div className="overflow-x-auto">
                <CampaignCategoryTabs
                  tabs={categoryTabs}
                  activeCategory={activeCategory}
                  onChange={handleCategoryChange}
                />
              </div>

              <div className="mt-6">
                <CampaignFilters
                  typeFilter={typeFilter}
                  categoryFilter={categoryFilter}
                  organizationFilter={organizationFilter}
                  statusFilter={statusFilter}
                  campaigns={campaigns}
                  onTypeChange={handleTypeChange}
                  onCategoryChange={handleCategoryFilterChange}
                  onOrganizationChange={handleOrganizationChange}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {createCampaignOpen && (
        <CampaignCreateModal
          loading={createLoading}
          error={createError}
          onClose={() => {
            if (!createLoading) {
              setCreateCampaignOpen(false);
              setCreateError("");
            }
          }}
          onConfirm={handleCreateConfirm}
        />
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {selectedCampaign && (
        <CampaignViewModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {/* =====================================================
          RELATED CAMPAIGN DETAILS
      ===================================================== */}

      {relatedCampaign && (
        <CampaignRelatedDetailsModal
          campaign={relatedCampaign}
          onClose={() => setRelatedCampaign(null)}
        />
      )}

      {/* =====================================================
          VERIFICATION MODAL
      ===================================================== */}

      {verificationCampaign && (
        <CampaignVerificationModal
          campaign={verificationCampaign}
          loading={verificationLoading}
          error={verificationError}
          onClose={() => {
            if (!verificationLoading) {
              setVerificationCampaign(null);
              setVerificationError("");
            }
          }}
          onConfirm={handleVerificationConfirm}
        />
      )}

      {/* =====================================================
          STATUS UPDATE MODAL
      ===================================================== */}

      {/* {statusCampaign && (
        <CampaignStatusUpdateModal
          campaign={statusCampaign}
          allowedStatuses={
            CAMPAIGN_STATUS_TRANSITIONS[statusCampaign.status] || []
          }
          loading={statusLoading}
          error={statusError}
          onClose={() => {
            if (!statusLoading) {
              setStatusCampaign(null);
              setStatusError("");
            }
          }}
          onConfirm={handleStatusConfirm}
        />
      )} */}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editCampaign && (
        <CampaignEditModal
          campaign={editCampaign}
          loading={editLoading}
          error={editError}
          onClose={() => {
            if (!editLoading) {
              setEditCampaign(null);
              setEditError("");
            }
          }}
          onConfirm={handleEditConfirm}
        />
      )}

      {/* =====================================================
          ASSIGN VOLUNTEER MODAL
      ===================================================== */}

      {assignmentCampaign && (
        <CampaignAssignmentModal
          campaign={assignmentCampaign}
          volunteers={assignmentVolunteers}
          assignments={assignmentHistory}
          loading={assignmentLoading || assignmentSubmitting}
          error={assignmentError}
          onClose={handleAssignmentClose}
          onConfirm={handleAssignmentConfirm}
        />
      )}
    </div>
  );
};

export default Campaigns;
