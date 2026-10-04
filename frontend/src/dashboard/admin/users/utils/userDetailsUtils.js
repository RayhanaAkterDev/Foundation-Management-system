// src/dashboard/admin/users/utils/userDetailsUtils.js

export const formatType = (value) => {
    if (!value) return 'Not provided';

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatList = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed.filter(Boolean);
            }

            return parsed ? [String(parsed)] : [];
        } catch {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [String(value)];
};

export const formatDate = (value) => {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not provided';
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const getUserDetailsData = (user) => {
    const individualProfile = user?.individual_profile ?? null;
    const organization = user?.organization ?? null;

    const isOrganization = user?.role === 'organization';
    const isAdmin = user?.role === 'admin';

    const roleLabel = isAdmin
        ? 'Administrator'
        : formatType(user?.role);

    const emailVerified = Boolean(user?.email_verified_at);
    const organizationVerified = Boolean(organization?.is_verified);

    const userInitial =
        user?.name?.trim()?.charAt(0)?.toUpperCase() || null;

    /*
    |--------------------------------------------------------------------------
    | Volunteer
    |--------------------------------------------------------------------------
    |
    | Volunteer is only applicable to individual users.
    |
    | The backend provides:
    | - volunteer: the volunteer profile or null
    | - campaign_volunteer_assignments_count: number of campaign
    |   assignments connected to the user
    |
    */

    const volunteer =
        user?.role === 'individual'
            ? user?.volunteer ?? null
            : null;

    const isVolunteer = Boolean(volunteer);

    const volunteerCampaignCount = Number(
        user?.campaign_volunteer_assignments_count ?? 0
    );

    return {
        individualProfile,
        organization,
        isOrganization,
        isAdmin,
        roleLabel,
        emailVerified,
        organizationVerified,
        userInitial,
        volunteer,
        isVolunteer,
        volunteerCampaignCount,
    };
};