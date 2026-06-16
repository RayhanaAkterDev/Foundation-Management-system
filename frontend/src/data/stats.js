import { campaigns } from './campaigns';

// ======================================
// ALL CAMPAIGNS
// ======================================
export const getAllCampaigns = () => campaigns;

export const getActiveCampaigns = () =>
    campaigns.filter(c => c.status === 'active');

// ======================================
// URGENT CAMPAIGNS
// ======================================
export const getUrgentCampaigns = () =>
    campaigns.filter(
        c => c.urgency === 'critical' || c.urgency === 'urgent'
    );

// ======================================
// CATEGORY BASED
// ======================================
export const getCampaignsByCategory = (categoryId) =>
    campaigns.filter(c => c.category === categoryId);

// ======================================
// COUNT HELPERS
// ======================================
export const getTotalCampaignsCount = () => campaigns.length;

export const getUrgentCount = () =>
    getUrgentCampaigns().length;

export const getCategoryCount = (categoryId) =>
    getCampaignsByCategory(categoryId).length;

export const getActiveCount = (categoryId) =>
    getCampaignsByCategory(categoryId)
        .filter(c => c.status === 'active')
        .length;