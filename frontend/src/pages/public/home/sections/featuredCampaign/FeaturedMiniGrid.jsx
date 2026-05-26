import React from 'react';
import featuredCampaignsData from './data/featuredCampaignData';

const FeaturedMiniGrid = () => {
    return (
        <div className="grid grid-cols-2 gap-6">
            {featuredCampaignsData.map((campaign) => (
                <div
                    key={campaign.id}
                    className="rounded-xl shadow-sm border border-border bg-surface"
                >
                    <div className="p-6 flex flex-col space-y-2">
                        <h4 className="text-primary text-lg font-bold">
                            {campaign.title}
                        </h4>

                        <p className="text-text-secondary text-sm">
                            {campaign.description}
                        </p>

                        {/* progress bar */}
                        <div className="progress-bar flex flex-col gap-2 mt-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h5 className="text-primary text-lg font-semibold">
                                        {campaign.raisedAmount}
                                    </h5>

                                    <p className="text-xs text-text-secondary font-medium leading-none">
                                        raised of {campaign.goalAmount} goal
                                    </p>
                                </div>

                                <p className="text-primary text-lg font-semibold">
                                    {campaign.progress}
                                </p>
                            </div>

                            <div className="w-full h-2 bg-primary-hover rounded-3xl"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeaturedMiniGrid;
