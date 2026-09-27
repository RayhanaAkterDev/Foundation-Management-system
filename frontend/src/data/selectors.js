// ============================================================
// LEGACY CAMPAIGN SELECTORS
// ============================================================
//
// Public campaign data now comes from the Laravel API.
// Do not import ./campaigns here.
//
// These functions are kept temporarily so older components
// importing them do not break while the public campaign
// system is being migrated to the API.
// ============================================================

export const getAllCampaigns = () => [];

export const getCampaignById = () => null;

// ============================================================
// FILTERS
// ============================================================

export const getActiveCampaigns = () => [];

export const getUrgentCampaigns = () => [];

export const getFeaturedCampaigns = () => [];

export const getLocalImpactCampaigns = () => [];

// ============================================================
// CATEGORY FILTER
// ============================================================

export const getCampaignsByCategory = () => [];

// ============================================================
// FEATURED SINGLE
// ============================================================

export const getFeaturedCampaign = () => null;

// ============================================================
// SORTING
// ============================================================

export const getNewestCampaigns = () => [];

// ============================================================
// STATS
// ============================================================

export const getTotalCampaignsCount = () => 0;

export const getActiveCount = () => 0;

export const getUrgentCount = () => 0;

export const getFeaturedCount = () => 0;

export const getLocalImpactCount = () => 0;

export const getCategoryCount = () => 0;

export const getAllCampaignStats = () => ({
    total: 0,
    active: 0,
    urgent: 0,
    featured: 0,
    localImpact: 0,
});

export const getFeaturedCategories = () => [];