import React, { useEffect, useState } from 'react';

import { Megaphone } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

import StatusBadge from '@/components/dashboard/StatusBadge';

import EmptyState from '@/components/dashboard/EmptyState';

import { apiRequest } from '@/api/client';

const CampaignCard = ({ campaign }) => {
    const targetAmount = Number(campaign.target_amount || 0);

    const collectedAmount = Number(campaign.collected_amount || 0);

    const progress =
        targetAmount > 0
            ? Math.min(Math.round((collectedAmount / targetAmount) * 100), 100)
            : 0;

    const deadline = campaign.end_date
        ? new Date(campaign.end_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : 'No deadline';

    return (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate font-['Fraunces'] text-base font-semibold text-text-primary">
                        {campaign.title}
                    </p>

                    <p className="mt-0.5 text-xs text-[#6b7280]">
                        {campaign.category}
                    </p>
                </div>

                <StatusBadge status={campaign.status} />
            </div>

            {campaign.description && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
                    {campaign.description}
                </p>
            )}

            <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-[#6b7280]">
                    <span>
                        ৳{collectedAmount.toLocaleString('en-BD')} raised
                    </span>

                    <span>
                        {targetAmount > 0
                            ? `${progress}% of ৳${targetAmount.toLocaleString(
                                  'en-BD',
                              )}`
                            : 'No target set'}
                    </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef3f6]">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-[#6b7280]">Deadline: {deadline}</p>

                <button
                    type="button"
                    className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
                >
                    Donate
                </button>
            </div>
        </div>
    );
};

const IndividualCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadCampaigns = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await apiRequest('/campaigns');

                if (!isMounted) {
                    return;
                }

                const data = Array.isArray(response?.campaigns)
                    ? response.campaigns
                    : [];

                /*
                 * CampaignController@index already returns
                 * only campaigns with Campaign::STATUS_ACTIVE.
                 *
                 * Do not filter by:
                 * - campaign type
                 * - creator
                 * - organization
                 * - created_by
                 * - any additional status
                 */
                setCampaigns(data);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setError(err?.message || 'Unable to load campaigns.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadCampaigns();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Campaigns"
                subtitle="Discover and support active campaigns from Stand For People and its partner organizations."
            />

            {loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-52 animate-pulse rounded-2xl border border-[#e5e7eb] bg-white"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            ) : campaigns.length === 0 ? (
                <EmptyState
                    icon={Megaphone}
                    title="No active campaigns"
                    message="Check back soon for campaigns you can support."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default IndividualCampaigns;
