import { apiRequest } from "@/api/client";

// --------------------------------
// Help Requests - List
// --------------------------------

export const fetchHelpRequests = async () => {
  return apiRequest("/admin/help-requests");
};

// --------------------------------
// Help Requests - View
// --------------------------------

export const fetchHelpRequest = async (helpRequestId) => {
  return apiRequest(`/admin/help-requests/${helpRequestId}`);
};

// --------------------------------
// Help Requests - Update
// --------------------------------

export const updateHelpRequest = async (helpRequestId, requestData) => {
  if (!helpRequestId) {
    throw new Error("Help request ID is required.");
  }

  return apiRequest(`/admin/help-requests/${helpRequestId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: requestData.title,
      description: requestData.description,
      category: requestData.category,
      urgency: requestData.urgency,
      district: requestData.district,
      address: requestData.address ?? null,
    }),
  });
};

// --------------------------------
// Help Requests - Verify / Reject
// --------------------------------

export const updateHelpRequestVerification = async (
  helpRequestId,
  status,
  verificationNote = null,
) => {
  return apiRequest(`/admin/help-requests/${helpRequestId}/verification`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      verification_note: verificationNote,
    }),
  });
};

// --------------------------------
// Help Requests - Urgency
// --------------------------------

export const updateHelpRequestUrgency = async (helpRequestId, urgency) => {
  return apiRequest(`/admin/help-requests/${helpRequestId}/urgency`, {
    method: "PATCH",
    body: JSON.stringify({
      urgency,
    }),
  });
};

// --------------------------------
// Help Requests - Assignment
// --------------------------------

export const assignHelpRequest = async (helpRequestId, assignmentData) => {
  return apiRequest(`/admin/help-requests/${helpRequestId}/assignment`, {
    method: "PATCH",
    body: JSON.stringify(assignmentData),
  });
};

// --------------------------------
// Organizations - Admin List
// --------------------------------

export const fetchOrganizations = async () => {
  return apiRequest("/admin/organizations");
};

// --------------------------------
// Volunteers - Admin List
// --------------------------------

export const fetchVolunteers = async () => {
  return apiRequest("/admin/volunteers");
};
