import { apiRequest } from '@/api/client';

// --------------------------------
// Organizations - List
// --------------------------------

export const fetchOrganizations = async () => {
    return apiRequest('/admin/organizations');
};

// --------------------------------
// Organizations - View
// --------------------------------

export const fetchOrganization = async (organizationId) => {
    return apiRequest(`/admin/organizations/${organizationId}`);
};

// --------------------------------
// Organizations - Update
// --------------------------------

export const updateOrganization = async (
    organizationId,
    formData,
) => {
    return apiRequest(`/admin/organizations/${organizationId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
    });
};

// --------------------------------
// Organizations - Verification
// --------------------------------

export const updateOrganizationVerification = async (
    organizationId,
    verificationStatus,
) => {
    return apiRequest(
        `/admin/organizations/${organizationId}/verification`,
        {
            method: 'PATCH',
            body: JSON.stringify({
                verification_status: verificationStatus,
            }),
        },
    );
};

// --------------------------------
// Organizations - Delete
// --------------------------------

export const deleteOrganization = async (organizationId) => {
    return apiRequest(`/admin/organizations/${organizationId}`, {
        method: 'DELETE',
    });
};
