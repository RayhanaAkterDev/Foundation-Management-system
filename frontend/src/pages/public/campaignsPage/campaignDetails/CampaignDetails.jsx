import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { fetchPublicCampaignById } from '@/api/publicCampaignsApi';

import CampaignMainContent from './components/CampaignMainContent';

import DonationSidebar from './components/DonationSidebar';

const CampaignDetails = () => {
    const { id } = useParams();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            return;
        }

        let cancelled = false;

        const loadCampaign = async () => {
            try {
                const data = await fetchPublicCampaignById(id);

                if (cancelled) {
                    return;
                }

                setCampaign(data);
            } catch (err) {
                console.error(
                    'Failed to load campaign:',
                    err
                );

                if (!cancelled) {
                    setCampaign(null);
                    setError(
                        'Unable to load this campaign right now.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCampaign();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-surface">
                <div className="container-width pt-32 text-center">
                    <p className="text-text-secondary">
                        Loading campaign...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================
    // NOT FOUND / ERROR
    // ============================================================

    if (!campaign) {
        return (
            <div className="min-h-screen bg-surface">
                <div className="container-width pt-32 text-center">
                    <h2 className="text-2xl font-semibold text-text-primary">
                        Campaign not found
                    </h2>

                    <p className="mt-3 text-text-secondary">
                        {error ||
                            'The campaign you are looking for does not exist or may have been removed.'}
                    </p>
                </div>
            </div>
        );
    }

    // ============================================================
    // ORGANIZER FALLBACK
    // ============================================================

    const organizer =
        typeof campaign.organizer === 'object'
            ? campaign.organizer
            : {
                  name:
                      campaign.organizer ||
                      'Stand For People',
                  role: '',
                  verified: false,
              };

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="min-h-screen bg-surface mt-20 pt-4">
            <div className="container-width py-10">
                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[minmax(0,1fr)_380px]
                        gap-10
                        lg:gap-14
                        items-start
                    "
                >
                    {/* MAIN CONTENT */}
                    <CampaignMainContent
                        campaign={campaign}
                    />

                    {/* DONATION SIDEBAR */}
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