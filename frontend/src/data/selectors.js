import { campaigns } from './campaigns';
import { categories } from './categories';

// ==============================
// CORE
// ==============================

export const allCampaigns = campaigns;
export const allCategories = categories;

// ==============================
// CATEGORY
// ==============================

export const getAllCategories = () => categories;

export const getCategoryById = (id) =>
    categories.find((c) => String(c.id) === String(id));

export const getFeaturedCategories = () =>
    categories.filter((c) => c.featured);

// 🔥 IMPORTANT FIX (this was missing earlier)
export const featuredCategories = getFeaturedCategories();

// ==============================
// CAMPAIGNS
// ==============================

export const getAllCampaigns = () => campaigns;

export const getCampaignById = (id) => {
    if (!id) return null;

    return campaigns.find(
        (c) => String(c.id) === String(id)
    );
};

// ==============================
// FILTERS
// ==============================

export const getActiveCampaigns = () =>
    campaigns.filter((c) => c.status === 'active');

export const getUrgentCampaigns = () =>
    campaigns.filter(
        (c) => c.urgency === 'urgent' || c.urgency === 'critical'
    );

export const getFeaturedCampaigns = () =>
    campaigns.filter((c) => c.featured === true);

export const getLocalImpactCampaigns = () =>
    campaigns.filter((c) => c.localImpact === true);

// ==============================
// CATEGORY FILTER
// ==============================

export const getCampaignsByCategory = (categoryId) => {
    if (!categoryId || categoryId === 'all') return campaigns;

    return campaigns.filter(
        (c) =>
            String(c.category).trim() ===
            String(categoryId).trim()
    );
};

// ==============================
// FEATURED SINGLE
// ==============================

export const getFeaturedCampaign = () => {
    return (
        campaigns.find((c) => c.featured === true) ||
        campaigns[0] ||
        null
    );
};

// ==============================
// SORTING
// ==============================

export const getNewestCampaigns = () =>
    [...campaigns].sort((a, b) => b.id - a.id);

// ==============================
// STATS
// ==============================

export const getTotalCampaignsCount = () => campaigns.length;
export const getTotalCategoriesCount = () => categories.length;

export const getActiveCount = () => getActiveCampaigns().length;
export const getUrgentCount = () => getUrgentCampaigns().length;
export const getFeaturedCount = () => getFeaturedCampaigns().length;
export const getLocalImpactCount = () => getLocalImpactCampaigns().length;

export const getCategoryCount = (categoryId) =>
    getCampaignsByCategory(categoryId).length;

export const getAllCampaignStats = () => ({
    total: getTotalCampaignsCount(),
    active: getActiveCount(),
    urgent: getUrgentCount(),
    featured: getFeaturedCount(),
    localImpact: getLocalImpactCount(),
    categories: getTotalCategoriesCount(),
});