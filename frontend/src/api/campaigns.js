// 1. Get all campaigns
export const getCampaigns = async () => {
    const res = await fetch('/data/campaigns.json');
    const data = await res.json();
    return data;
};

// 2. Get single campaign by ID (for details page)
export const getCampaignById = async (id) => {
    const res = await fetch('/data/campaigns.json');
    const data = await res.json();

    return data.find((campaign) => campaign.id === Number(id));
};

// 3. Card view (only data needed for cards)
export const getCampaignCardView = (campaigns) => {
    return campaigns.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.shortDescription,
        image: c.image,
        progress: c.progress,
        raised: c.raised,
        targetAmount: c.targetAmount,
        daysLeft: c.daysLeft,
        category: c.category,
        urgency: c.urgency,
        supporters: c.supporters,
    }));
};