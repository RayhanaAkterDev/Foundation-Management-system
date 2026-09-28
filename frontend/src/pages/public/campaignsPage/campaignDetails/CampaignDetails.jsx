import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { fetchPublicCampaignById } from '@/api/publicCampaignsApi';

import CampaignMainContent from './components/CampaignMainContent';

import DonationSidebar from './components/DonationSidebar';

import { useChatbotContext } from '@/components/chatbot/useChatbotContext';

const CampaignDetails = () => {
    const { id } = useParams();

    const { setPageContext } = useChatbotContext();

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
                console.error('Failed to load campaign:', err);

                if (!cancelled) {
                    setCampaign(null);
                    setError('Unable to load this campaign right now.');
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

    /*
     * ============================================================
     * CHATBOT PAGE CONTEXT
     * ============================================================
     *
     * Give the chatbot only public campaign information.
     *
     * Do not pass the entire campaign object because it may contain
     * internal/backend fields that the chatbot does not need.
     */
    useEffect(() => {
        if (!campaign) {
            setPageContext(null);

            return;
        }

        const organizer =
            typeof campaign.organizer === 'object' ? campaign.organizer : null;

        setPageContext({
            type: 'campaign',
            title: campaign.title || '',
            description: campaign.description || '',
            category: campaign.category || '',
            district: campaign.district || '',
            status: campaign.status || '',
            organizer: organizer?.name || campaign.organizer || '',
        });

        return () => {
            setPageContext(null);
        };
    }, [campaign, setPageContext]);

    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {
        return (
            <main className="min-h-screen bg-surface">
                <div className="container-width section-gap mt-20">
                    <div className="text-center">
                        <p className="font-bengali text-sm text-text-secondary">
                            উদ্যোগের তথ্য লোড হচ্ছে...
                        </p>

                        <div className="mx-auto mt-5 h-px w-10 bg-accent" />
                    </div>
                </div>
            </main>
        );
    }

    /* ============================================================
       NOT FOUND / ERROR
    ============================================================ */

    if (!campaign) {
        return (
            <main className="min-h-screen bg-surface">
                <div className="container-width section-gap mt-20">
                    <div className="text-center">
                        <span className="font-bengali text-[10px] font-semibold text-accent">
                            উদ্যোগ
                        </span>

                        <h2 className="mt-4 font-bengali text-3xl font-semibold text-text-primary">
                            উদ্যোগটি খুঁজে পাওয়া যায়নি
                        </h2>

                        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-text-secondary">
                            {error ||
                                'The campaign you are looking for does not exist or may have been removed.'}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    /* ============================================================
       ORGANIZER FALLBACK
    ============================================================ */

    const organizer =
        typeof campaign.organizer === 'object'
            ? campaign.organizer
            : {
                  name: campaign.organizer || 'Stand For People',
                  role: '',
                  verified: false,
              };

    /* ============================================================
       PAGE
    ============================================================ */

    return (
        <main className="min-h-screen bg-surface section-gap mt-20">
            <div className="container-width">
                <div
                    className="
                        grid
                        grid-cols-1
                        items-start
                        gap-12
                        lg:grid-cols-[minmax(0,1fr)_340px]
                        lg:gap-16
                        xl:grid-cols-[minmax(0,1fr)_360px]
                        xl:gap-20
                    "
                >
                    <CampaignMainContent campaign={campaign} />

                    <DonationSidebar
                        campaign={campaign}
                        organizer={organizer}
                    />
                </div>
            </div>
        </main>
    );
};

export default CampaignDetails;
