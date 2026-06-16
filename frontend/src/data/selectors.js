import { campaigns } from './campaigns';
import { categories } from './categories';

// ALL CAMPAIGNS (RAW SOURCE)
export const allCampaigns = campaigns;

// ACTIVE CAMPAIGNS
export const activeCampaigns = campaigns.filter(
    campaign => campaign.status === 'active'
);

// URGENT CAMPAIGNS
export const urgentCampaigns = campaigns.filter(
    campaign =>
        campaign.urgency === 'critical' ||
        campaign.urgency === 'urgent'
);

// FEATURED CATEGORIES
export const featuredCategories = categories.filter(
    category => category.featured
);

// TOTAL COUNTS (IMPORTANT FIX)
export const totalCampaigns = campaigns.length;
export const totalUrgentCampaigns = urgentCampaigns.length;
export const totalCategories = categories.length;

// CATEGORY HELPERS
export const getCategoryById = (id) =>
    categories.find(category => category.id === id);

// CAMPAIGNS BY CATEGORY (SOURCE OF TRUTH)
export const getCampaignsByCategory = (categoryId) =>
    campaigns.filter(campaign => campaign.category === categoryId);

// CATEGORY COUNT (FIXED LOGIC)
export const getCategoryCount = (categoryId) =>
    getCampaignsByCategory(categoryId).length;