import React from 'react';
import campaigns from './data/campaignsData';

const CampaignGrid = () => {
    return (
        <section className="container-width py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {campaigns.map((campaign) => {
                    const progress = Math.round(
                        (campaign.raised / campaign.goal) * 100
                    );

                    return (
                        <article
                            key={campaign.id}
                            className="
                                group
                                overflow-hidden
                                rounded-3xl
                                border border-border
                                bg-surface
                                transition-all duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                            "
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition-transform
                                        duration-500
                                        group-hover:scale-105
                                    "
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                <span
                                    className={`
                                        absolute top-4 right-4
                                        rounded-full
                                        px-3 py-1
                                        text-xs font-medium
                                        backdrop-blur-sm
                                        ${
                                            campaign.status === 'Urgent'
                                                ? 'bg-red-500/90 text-white'
                                                : 'bg-white/90 text-text-primary'
                                        }
                                    `}
                                >
                                    {campaign.status}
                                </span>

                                <span
                                    className="
                                        absolute bottom-4 left-4
                                        rounded-full
                                        bg-white/90
                                        px-3 py-1
                                        text-xs font-medium
                                        text-text-primary
                                    "
                                >
                                    {campaign.category}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-text-primary line-clamp-2">
                                    {campaign.title}
                                </h3>

                                <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-2">
                                    {campaign.description}
                                </p>

                                {/* Progress */}
                                <div className="mt-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm text-text-secondary">
                                            Progress
                                        </span>

                                        <span className="text-sm font-semibold text-primary">
                                            {progress}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Amounts */}
                                <div className="mt-5 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-text-secondary">
                                            Raised
                                        </p>

                                        <p className="text-lg font-semibold text-text-primary">
                                            ৳
                                            {campaign.raised.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-text-secondary">
                                            Goal
                                        </p>

                                        <p className="text-sm font-medium text-text-primary">
                                            ৳{campaign.goal.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div
                                    className="
                                        mt-6
                                        flex items-center justify-between
                                        border-t border-border
                                        pt-4
                                    "
                                >
                                    <div>
                                        <p className="text-xs text-text-secondary">
                                            Donors
                                        </p>

                                        <p className="font-medium text-text-primary">
                                            {campaign.donors}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-text-secondary">
                                            Time Left
                                        </p>

                                        <p className="font-medium text-text-primary">
                                            {campaign.daysLeft} Days
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="
                                        mt-6
                                        w-full
                                        rounded-xl
                                        border border-border
                                        py-3
                                        text-sm
                                        font-medium
                                        transition-colors
                                        hover:bg-primary
                                        hover:text-white
                                    "
                                >
                                    View Campaign
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default CampaignGrid;