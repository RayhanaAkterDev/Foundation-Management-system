import { campaigns } from './campaigns';
import { categories } from './categories';

// ==============================
// CORE DATA EXPORTS
// ==============================

export const allCampaigns = campaigns;
export const allCategories = categories;

// ==============================
// CATEGORY HELPERS
// ==============================

export const getAllCategories = () => categories;

export const getCategoryById = (id) =>
    categories.find(
        (category) => String(category.id) === String(id)
    );

export const getFeaturedCategories = () =>
    categories.filter((category) => category.featured);

export const featuredCategories = getFeaturedCategories();

// ==============================
// CAMPAIGN HELPERS
// ==============================

export const getAllCampaigns = () => campaigns;

export const getCampaignById = (id) =>
    campaigns.find(
        (campaign) => String(campaign.id) === String(id)
    );

// ==============================
// CAMPAIGN FILTERS
// ==============================

export const getActiveCampaigns = () =>
    campaigns.filter((campaign) => campaign.status === 'active');

export const getUrgentCampaigns = () =>
    campaigns.filter(
        (campaign) =>
            campaign.urgency === 'critical' ||
            campaign.urgency === 'urgent'
    );

export const getFeaturedCampaigns = () =>
    campaigns.filter((campaign) => campaign.featured === true);

export const getLocalImpactCampaigns = () =>
    campaigns.filter((campaign) => campaign.localImpact === true);

// ==============================
// 🔥 FIXED CATEGORY FILTER (MAIN BUG FIX)
// ==============================

export const getCampaignsByCategory = (categoryId) => {
    if (!categoryId || categoryId === 'all') return campaigns;

    return campaigns.filter(
        (campaign) =>
            String(campaign.category).trim() ===
            String(categoryId).trim()
    );
};

// ==============================
// CATEGORY + CAMPAIGNS BUNDLE
// ==============================

export const getCategoryWithCampaigns = (categoryId) => {
    const category = getCategoryById(categoryId);

    if (!category) return null;

    return {
        ...category,
        campaigns: getCampaignsByCategory(categoryId),
    };
};

// ==============================
// SORTING HELPERS
// ==============================

export const getCampaignsSortedByUrgency = () => {
    const order = {
        critical: 0,
        urgent: 1,
        normal: 2,
    };

    return [...campaigns].sort(
        (a, b) =>
            (order[a.urgency] ?? 999) -
            (order[b.urgency] ?? 999)
    );
};

// newest first
export const getNewestCampaigns = () =>
    [...campaigns].sort((a, b) => b.id - a.id);

// ==============================
// COUNTS
// ==============================

export const getTotalCampaignsCount = () => campaigns.length;

export const getTotalCategoriesCount = () => categories.length;

export const getActiveCount = () => getActiveCampaigns().length;

export const getUrgentCount = () => getUrgentCampaigns().length;

export const getFeaturedCount = () => getFeaturedCampaigns().length;

export const getLocalImpactCount = () =>
    getLocalImpactCampaigns().length;

export const getCategoryCount = (categoryId) =>
    getCampaignsByCategory(categoryId).length;

// active campaigns under category
export const getCategoryActiveCount = (categoryId) =>
    getCampaignsByCategory(categoryId).filter(
        (campaign) => campaign.status === 'active'
    ).length;

// urgent campaigns under category
export const getCategoryUrgentCount = (categoryId) =>
    getCampaignsByCategory(categoryId).filter(
        (campaign) =>
            campaign.urgency === 'critical' ||
            campaign.urgency === 'urgent'
    ).length;

// ==============================
// DASHBOARD STATS
// ==============================

export const getAllCampaignStats = () => ({
    total: getTotalCampaignsCount(),
    active: getActiveCount(),
    urgent: getUrgentCount(),
    featured: getFeaturedCount(),
    localImpact: getLocalImpactCount(),
    categories: getTotalCategoriesCount(),
});