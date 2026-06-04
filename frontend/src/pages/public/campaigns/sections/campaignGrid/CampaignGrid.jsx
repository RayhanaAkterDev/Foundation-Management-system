import React from 'react';
import { TbAlertTriangle } from 'react-icons/tb';
import campaigns from './data/campaignsData';

const CampaignGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
            {campaigns.map((c) => {
                const progress = Math.min(
                    Math.round((c.raised / c.goal) * 100),
                    100,
                );

                const isUrgent = c.daysLeft <= 7;

                return (
                    <article
                        key={c.id}
                        className="
                            group overflow-hidden rounded-2xl
                            bg-white border border-border
                            transition-all duration-300
                            hover:-translate-y-1
                            hover:shadow-lg
                        "
                    >
                        {/* IMAGE */}
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={c.image}
                                alt={c.title}
                                className="
                                    h-full w-full object-cover
                                    transition duration-500
                                    group-hover:scale-105
                                "
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                            {isUrgent && (
                                <div
                                    className="
                                        absolute bottom-0 left-0 right-0
                                        flex items-center gap-2
                                        bg-black/45 px-4 py-2
                                        text-xs font-medium text-white
                                        backdrop-blur-sm
                                    "
                                >
                                    <TbAlertTriangle size={14} />

                                    <span>
                                        {c.daysLeft <= 1
                                            ? 'Last day to help'
                                            : `${c.daysLeft} days left • Urgent support needed`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-6">
                            {/* TITLE */}
                            <h3 className="text-xl font-semibold leading-snug text-text-primary">
                                {c.title}
                            </h3>

                            {/* DESCRIPTION */}
                            <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">
                                {c.description}
                            </p>

                            {/* DONATION INFO */}
                            <div className="mt-6">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-text-primary">
                                            ৳{c.raised.toLocaleString()}
                                        </p>

                                        <p className="text-sm text-text-secondary">
                                            raised of ৳{c.goal.toLocaleString()}
                                        </p>
                                    </div>

                                    <span className="text-sm font-medium text-primary">
                                        {progress}%
                                    </span>
                                </div>

                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-700"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                className="
                                    mt-6 w-full rounded-xl
                                    bg-primary py-3
                                    font-medium text-white
                                    transition hover:bg-primary/90
                                "
                            >
                                Donate Now
                            </button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
};

export default CampaignGrid;
