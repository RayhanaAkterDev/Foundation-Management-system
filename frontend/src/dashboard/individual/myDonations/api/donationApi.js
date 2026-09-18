import { apiRequest } from '@/api/client';

export const initiateDonation = async ({
    campaignId,
    amount,
    donorName,
    donorEmail,
}) => {
    return apiRequest('/donations', {
        method: 'POST',
        body: JSON.stringify({
            campaign_id: campaignId,
            amount,
            donor_name: donorName || null,
            donor_email: donorEmail || null,
        }),
    });
};