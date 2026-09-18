import { apiRequest } from '@/api/client';

export const initiateDonation = async ({
    campaignId,
    amount,
    donorName,
    donorEmail,
    donorPhone,
}) => {
    return apiRequest('/donations', {
        method: 'POST',
        body: JSON.stringify({
            campaign_id: campaignId,
            amount: Number(amount),
            donor_name: donorName || null,
            donor_email: donorEmail || null,
            donor_phone: donorPhone || null,
        }),
    });
};

export const getMyDonations = async () => {
    return apiRequest('/donations/my', {
        method: 'GET',
    });
};