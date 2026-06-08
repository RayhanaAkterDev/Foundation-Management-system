import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCampaignById } from '@/api/campaigns';

import CampaignMainContent from './components/CampaignMainContent';
import DonationSidebar from './components/DonationSidebar';

const CampaignDetails = () => {
    const { id } = useParams();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                const data = await getCampaignById(id);
                setCampaign(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="mt-24 text-center text-text-secondary">
                Loading campaign...
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="mt-24 text-center text-text-secondary">
                Campaign not found
            </div>
        );
    }

    const organizer =
        typeof campaign.organizer === 'object'
            ? campaign.organizer
            : {
                  name: campaign.organizer,
                  role: '',
                  verified: false,
              };

    return (
        <div className="mt-20 pt-4 min-h-screen bg-surface">
            <div className="container-width py-10">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-14 items-start">
                    <CampaignMainContent campaign={campaign} />

                    <DonationSidebar
                        campaign={campaign}
                        organizer={organizer}
                    />
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
