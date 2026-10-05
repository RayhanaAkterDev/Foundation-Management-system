// src/dashboard/admin/organizations/utils/organizationDetailsUtils.js

/* ==========================================================================
   FORMAT DATE
============================================================================ */

export const formatDate = (value) => {
    if (!value) {
        return 'Not provided';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not provided';
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

/* ==========================================================================
   FORMAT TYPE / ENUM VALUE
============================================================================ */

export const formatType = (value) => {
    if (value === undefined || value === null || value === '') {
        return 'Not provided';
    }

    return String(value)
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
};

/* ==========================================================================
   FORMAT LIST
============================================================================ */

export const formatList = (value) => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === 'string') {
                    return item.trim();
                }

                return item;
            })
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
            return [];
        }

        /*
         * Some organization fields may arrive from the API as
         * JSON encoded arrays.
         *
         * Example:
         * '["education","healthcare"]'
         */
        try {
            const parsedValue = JSON.parse(trimmedValue);

            if (Array.isArray(parsedValue)) {
                return parsedValue
                    .map((item) => {
                        if (typeof item === 'string') {
                            return item.trim();
                        }

                        return item;
                    })
                    .filter(Boolean);
            }
        } catch {
            // Normal strings continue to comma-separated parsing.
        }

        return trimmedValue
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

/* ==========================================================================
   FORMAT LIST AS TEXT
============================================================================ */

export const formatListText = (value) => {
    const items = formatList(value);

    if (!items.length) {
        return 'Not provided';
    }

    return items.map((item) => formatType(item)).join(', ');
};

/* ==========================================================================
   NORMALIZE OPTIONAL VALUE
============================================================================ */

export const getDisplayValue = (value, fallback = 'Not provided') => {
    if (value === undefined || value === null) {
        return fallback;
    }

    if (typeof value === 'string' && !value.trim()) {
        return fallback;
    }

    return value;
};

/* ==========================================================================
   ORGANIZATION EMAIL
============================================================================ */

export const getOrganizationEmail = (organization) => {
    return (
        organization?.user?.email ||
        organization?.email ||
        'Not provided'
    );
};

/* ==========================================================================
   ORGANIZATION NAME
============================================================================ */

export const getOrganizationName = (organization) => {
    return organization?.name?.trim() || 'Unnamed organization';
};

/* ==========================================================================
   ORGANIZATION INITIAL
============================================================================ */

export const getOrganizationInitial = (organization) => {
    const name = organization?.name?.trim();

    if (!name) {
        return null;
    }

    return name.charAt(0).toUpperCase();
};

/* ==========================================================================
   VERIFICATION STATUS
============================================================================ */

export const getVerificationStatus = (organization) => {
    return organization?.verification_status || 'pending';
};

export const isOrganizationVerified = (organization) => {
    return getVerificationStatus(organization) === 'verified';
};

/* ==========================================================================
   ORGANIZATION PROFILE DATA
============================================================================ */

export const getOrganizationDetailsData = (organization) => {
    if (!organization) {
        return {
            name: 'Unnamed organization',
            initial: null,

            email: 'Not provided',
            phone: 'Not provided',
            website: 'Not provided',
            address: 'Not provided',

            organizationType: 'Not provided',
            registrationNumber: 'Not provided',

            verificationStatus: 'pending',
            verified: false,

            mission: 'Not provided',

            focusAreas: [],
            communitiesServed: [],
            primaryActivities: [],

            teamSize: 'Not provided',

            createdAt: 'Not provided',
            updatedAt: 'Not provided',
        };
    }

    return {
        name: getOrganizationName(organization),

        initial: getOrganizationInitial(organization),

        email: getOrganizationEmail(organization),

        phone: getDisplayValue(organization.phone),

        website: getDisplayValue(organization.website),

        address: getDisplayValue(organization.address),

        organizationType: formatType(
            organization.organization_type,
        ),

        registrationNumber: getDisplayValue(
            organization.registration_number,
        ),

        verificationStatus: getVerificationStatus(organization),

        verified: isOrganizationVerified(organization),

        mission: getDisplayValue(organization.mission),

        focusAreas: formatList(organization.focus_areas),

        communitiesServed: formatList(
            organization.communities_served,
        ),

        primaryActivities: formatList(
            organization.primary_activities,
        ),

        teamSize: getDisplayValue(organization.team_size),

        createdAt: formatDate(organization.created_at),

        updatedAt: formatDate(organization.updated_at),
    };
};