import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, HeartHandshake, Megaphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { apiRequest } from '@/api/client';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import CampaignCard from './components/CampaignCard';
import DonationModal from './components/DonationModal/DonationModal';

const FEATURED_CAMPAIGNS_LIMIT = 4;

const getCurrentUserId = () => {
    if (typeof window === 'undefined') return null;

    for (const storage of [window.localStorage, window.sessionStorage]) {
        try {
            const value = storage.getItem('user');
            if (!value) continue;

            const user = JSON.parse(value);
            const userId = user?.id ?? user?.user?.id;

            if (userId != null) return String(userId);
        } catch {
            // Continue checking other storage.
        }
    }

    return null;
};

const isConnectedToUserHelpRequest = (campaign, userId) => {
    if (!userId || !campaign) return false;

    if (
        campaign.is_connected_to_my_help_request === true ||
        campaign.is_my_help_request_campaign === true
    ) {
        return true;
    }

    const helpRequests = [
        campaign.help_request,
        campaign.helpRequest,
        campaign.help_requests,
        campaign.helpRequests,
    ]
        .filter(Boolean)
        .flatMap((item) => (Array.isArray(item) ? item : [item]));

    return helpRequests.some((helpRequest) => {
        if (!helpRequest || typeof helpRequest !== 'object') {
            return false;
        }

        const ownerId =
            helpRequest.user_id ??
            helpRequest.userId ??
            helpRequest.individual_id ??
            helpRequest.individualId ??
            helpRequest.user?.id ??
            helpRequest.individual?.user_id ??
            helpRequest.individual?.user?.id;

        return ownerId != null && String(ownerId) === String(userId);
    });
};

const isFeaturedCampaign = (campaign) =>
    campaign.is_featured === true ||
    campaign.is_featured === 1 ||
    campaign.is_featured === '1' ||
    campaign.featured === true ||
    campaign.featured === 1 ||
    campaign.featured === '1';

const sortByNewest = (campaigns) =>
    [...campaigns].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;

        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

        return dateB - dateA;
    });

const IndividualCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const currentUserId = useMemo(() => getCurrentUserId(), []);

    useEffect(() => {
        let cancelled = false;

        const fetchCampaigns = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await apiRequest('/campaigns');

                if (cancelled) return;

                const data = Array.isArray(response?.campaigns)
                    ? response.campaigns
                    : [];

                setCampaigns(data);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Unable to load campaigns. Please try again.',
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchCampaigns();

        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const handleRetry = useCallback(() => {
        setReloadKey((current) => current + 1);
    }, []);

    const helpRequestCampaigns = useMemo(
        () =>
            sortByNewest(
                campaigns.filter((campaign) =>
                    isConnectedToUserHelpRequest(campaign, currentUserId),
                ),
            ),
        [campaigns, currentUserId],
    );

    const discoveryCampaigns = useMemo(() => {
        const linkedIds = new Set(
            helpRequestCampaigns.map((campaign) => String(campaign.id)),
        );

        const remaining = campaigns.filter(
            (campaign) => !linkedIds.has(String(campaign.id)),
        );

        const featured = sortByNewest(remaining.filter(isFeaturedCampaign));

        const featuredIds = new Set(
            featured.map((campaign) => String(campaign.id)),
        );

        const others = sortByNewest(
            remaining.filter(
                (campaign) => !featuredIds.has(String(campaign.id)),
            ),
        );

        return [...featured, ...others].slice(0, FEATURED_CAMPAIGNS_LIMIT);
    }, [campaigns, helpRequestCampaigns]);

    return (
        <>
            <div className="min-h-full min-w-0 space-y-9 bg-transparent lg:space-y-11">
                <PageHeader
                    title="Campaigns"
                    subtitle="Discover humanitarian campaigns, follow fundraising efforts connected to your help requests, and support causes that matter."
                />

                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading campaigns..."
                        description="Please wait while we retrieve available campaigns."
                    />
                ) : error ? (
                    <LoadingError
                        title="Unable to load campaigns"
                        message={error}
                        onRetry={handleRetry}
                    />
                ) : (
                    <>
                        {/* CAMPAIGNS LINKED TO HELP REQUESTS */}
                        <section
                            aria-labelledby="help-request-campaigns-heading"
                            className="min-w-0"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#344454] bg-[#17232E] text-[#AFC0D0]">
                                    <HeartHandshake
                                        size={19}
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="help-request-campaigns-heading"
                                        className="font-sans! text-[19px] font-semibold! leading-tight tracking-[-0.02em] text-[#EEF1F5]!"
                                    >
                                        Campaigns for Your Requests
                                    </h2>

                                    <p className="mt-1.5 font-sans! text-[12px] leading-5 text-[#94A2B2]!">
                                        Follow fundraising efforts connected to
                                        your help requests.
                                    </p>
                                </div>
                            </div>

                            {helpRequestCampaigns.length > 0 ? (
                                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:gap-6">
                                    {helpRequestCampaigns.map((campaign) => (
                                        <CampaignCard
                                            key={campaign.id}
                                            campaign={campaign}
                                            onDonate={setSelectedCampaign}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-[#293542] bg-[#111821] px-5 py-6 sm:px-6">
                                    <p className="font-sans! text-[13px] font-medium! text-[#DCE3EA]!">
                                        No campaigns linked to your help
                                        requests yet.
                                    </p>

                                    <p className="mt-2 max-w-2xl font-sans! text-[12px] leading-5 text-[#8795A5]!">
                                        When a campaign is associated with one
                                        of your help requests, it will appear
                                        here.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* NEW AND FEATURED CAMPAIGNS */}
                        <section
                            aria-labelledby="discovery-campaigns-heading"
                            className="min-w-0"
                        >
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#344454] bg-[#17232E] text-[#AFC0D0]">
                                        <Sparkles size={18} strokeWidth={1.7} />
                                    </div>

                                    <div className="min-w-0">
                                        <h2
                                            id="discovery-campaigns-heading"
                                            className="font-sans! text-[19px] font-semibold! leading-tight tracking-[-0.02em] text-[#EEF1F5]!"
                                        >
                                            New & Featured Campaigns
                                        </h2>

                                        <p className="mt-1.5 font-sans! text-[12px] leading-5 text-[#94A2B2]!">
                                            Discover humanitarian initiatives
                                            and find causes to support.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to="/campaigns"
                                    className="inline-flex w-fit shrink-0 items-center gap-2 font-sans! text-[12px] font-medium! text-[#AFC0D0]! transition-colors hover:text-white!"
                                >
                                    All Campaigns
                                    <ArrowRight size={15} />
                                </Link>
                            </div>

                            {discoveryCampaigns.length > 0 ? (
                                <>
                                    <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:gap-6">
                                        {discoveryCampaigns.map((campaign) => (
                                            <CampaignCard
                                                key={campaign.id}
                                                campaign={campaign}
                                                onDonate={setSelectedCampaign}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-7 flex justify-center border-t border-[#293542] pt-6">
                                        <Link
                                            to="/campaigns"
                                            className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#344454] bg-[#17212B] px-5 py-2.5 font-sans! text-[12px] font-medium! text-[#DCE3EA]! transition-colors hover:border-[#506477] hover:bg-[#1D2B38]"
                                        >
                                            Explore All Campaigns
                                            <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="border border-[#293542] bg-[#111821] px-5 py-6 sm:px-6">
                                    <div className="flex items-start gap-3">
                                        <Megaphone
                                            size={19}
                                            strokeWidth={1.7}
                                            className="mt-0.5 shrink-0 text-[#94A2B2]"
                                        />

                                        <div>
                                            <p className="font-sans! text-[13px] font-medium! text-[#DCE3EA]!">
                                                No other campaigns available
                                                right now.
                                            </p>

                                            <p className="mt-2 font-sans! text-[12px] leading-5 text-[#8795A5]!">
                                                Check the complete campaign
                                                directory to explore available
                                                humanitarian initiatives.
                                            </p>

                                            <Link
                                                to="/campaigns"
                                                className="mt-4 inline-flex items-center gap-2 font-sans! text-[12px] font-medium! text-[#AFC0D0]! transition-colors hover:text-white!"
                                            >
                                                Browse All Campaigns
                                                <ArrowRight size={15} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>

            {selectedCampaign && (
                <DonationModal
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}
        </>
    );
};

export default IndividualCampaigns;
