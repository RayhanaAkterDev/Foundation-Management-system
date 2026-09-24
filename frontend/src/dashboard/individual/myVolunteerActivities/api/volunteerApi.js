import { apiRequest } from "@/api/client";

export const getMyVolunteer = async () => {
  return apiRequest("/volunteer");
};

export const sendVolunteerRequest = async () => {
  return apiRequest("/volunteer", {
    method: "POST",
  });
};

export const requestVolunteerReactivation = async () => {
  return apiRequest("/volunteer/reactivation", {
    method: "PATCH",
  });
};

/*
|--------------------------------------------------------------------------
| Volunteer Requests
|--------------------------------------------------------------------------
*/

// Admin invitation → Individual accepts
export const acceptVolunteerRequest = async (requestId) => {
  return apiRequest(`/volunteer/requests/${requestId}/accept`, {
    method: "PATCH",
  });
};

// Admin invitation → Individual rejects/declines
export const rejectVolunteerRequest = async (requestId) => {
  return apiRequest(`/volunteer/requests/${requestId}/reject`, {
    method: "PATCH",
  });
};

// Individual application → Individual cancels own application
export const cancelVolunteerRequest = async (requestId) => {
  return apiRequest(`/volunteer/requests/${requestId}/cancel`, {
    method: "PATCH",
  });
};

/*
|--------------------------------------------------------------------------
| Campaign Assignments
|--------------------------------------------------------------------------
*/

// Volunteer accepts campaign assignment
export const acceptCampaignAssignment = async (assignmentId) => {
  return apiRequest(`/volunteer/campaign-assignments/${assignmentId}/accept`, {
    method: "PATCH",
  });
};

// Volunteer rejects campaign assignment
export const rejectCampaignAssignment = async (
  assignmentId,
  rejectionReason,
) => {
  return apiRequest(`/volunteer/campaign-assignments/${assignmentId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({
      rejection_reason: rejectionReason,
    }),
  });
};

// Volunteer starts accepted campaign assignment
export const startCampaignAssignment = async (assignmentId) => {
  return apiRequest(`/volunteer/campaign-assignments/${assignmentId}/start`, {
    method: "PATCH",
  });
};

// Volunteer completes campaign assignment
export const completeCampaignAssignment = async (assignmentId) => {
  return apiRequest(
    `/volunteer/campaign-assignments/${assignmentId}/complete`,
    {
      method: "PATCH",
    },
  );
};

// Volunteer requests withdrawal from campaign assignment
export const requestCampaignWithdrawal = async (
  assignmentId,
  withdrawalReason,
) => {
  return apiRequest(
    `/volunteer/campaign-assignments/${assignmentId}/withdraw`,
    {
      method: "PATCH",
      body: JSON.stringify({
        withdrawal_reason: withdrawalReason,
      }),
    },
  );
};

/*
|--------------------------------------------------------------------------
| Volunteer Profile
|--------------------------------------------------------------------------
*/

// Volunteer resigns from volunteer program
export const resignVolunteer = async () => {
  return apiRequest("/volunteer/resign", {
    method: "PATCH",
  });
};


