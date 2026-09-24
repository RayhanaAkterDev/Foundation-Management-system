import { apiRequest } from "@/api/client";

// ============================================================
// VOLUNTEER DIRECTORY
// ============================================================

export const fetchVolunteers = async () => {
  return apiRequest("/admin/volunteers");
};

export const fetchVolunteerDetails = async (volunteerId) => {
  return apiRequest(`/admin/volunteers/${volunteerId}`);
};

export const updateVolunteerStatus = async (volunteerId, status) => {
  return apiRequest(`/admin/volunteers/${volunteerId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
};

// ============================================================
// VOLUNTEER CANDIDATES
// ============================================================

export const fetchVolunteerCandidates = async () => {
  return apiRequest("/admin/volunteers/candidates");
};

// ============================================================
// VOLUNTEER APPLICATIONS
// ============================================================

export const fetchVolunteerRequests = async () => {
  return apiRequest("/admin/volunteers/requests");
};

export const sendVolunteerRequests = async (userIds) => {
  return apiRequest("/admin/volunteers/requests", {
    method: "POST",
    body: JSON.stringify({
      user_ids: userIds,
    }),
  });
};

export const acceptVolunteerApplication = async (requestId) => {
  return apiRequest(`/admin/volunteers/requests/${requestId}/accept`, {
    method: "PATCH",
  });
};

export const rejectVolunteerApplication = async (requestId) => {
  return apiRequest(`/admin/volunteers/requests/${requestId}/reject`, {
    method: "PATCH",
  });
};

export const cancelVolunteerInvitation = async (requestId) => {
  return apiRequest(`/admin/volunteers/requests/${requestId}/cancel`, {
    method: "PATCH",
  });
};
