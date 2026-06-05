import React, { useMemo } from 'react';
import { TbAlertTriangle } from 'react-icons/tb';
import campaigns from './data/campaignsData';

const getProgress = (raised, goal) =>
    Math.min(Math.round((raised / goal) * 100), 100);

const getUrgency = (daysLeft) => {
    if (daysLeft <= 3) return 'critical';
    if (daysLeft <= 7) return 'urgent';
    return null;
};

const ProgressRing = ({ progress }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                />

                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-primary"
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-semibold">{progress}%</span>
            </div>
        </div>
    );
};

const CampaignGrid = () => {
    const enhancedCampaigns = useMemo(() => {
        return campaigns.map((c) => ({
            ...c,
            progress: getProgress(c.raised, c.goal),
            urgency: getUrgency(c.daysLeft),
        }));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
            {enhancedCampaigns.map((c) => (
                <article
                    key={c.id}
                    className="
                            group
                            cursor-pointer
                            overflow-hidden
                            rounded-xl
                            border border-border
                            bg-white
                            shadow-sm
                            transition-all duration-300
                        "
                >
                    {/* IMAGE */}
                    <div className="h-52">
                        <img
                            src={c.image}
                            alt={c.title}
                            className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                        />

                        <div className="absolute inset-0 bg-black/10" />

                        <div className="absolute left-4 top-4">
                            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium">
                                {c.category}
                            </span>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col">
                        <div className="flex items-center justify-between">
                            {c.urgency ? (
                                <span
                                    className={`
                                            flex items-center gap-1 text-xs font-medium
                                            ${
                                                c.urgency === 'critical'
                                                    ? 'text-red-600'
                                                    : 'text-orange-600'
                                            }
                                        `}
                                >
                                    <TbAlertTriangle size={14} />
                                    {c.urgency === 'critical'
                                        ? 'Ending soon'
                                        : `${c.daysLeft}d left`}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-500">
                                    Ongoing Campaign
                                </span>
                            )}

                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                                {c.category}
                            </span>
                        </div>

                        <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
                            {c.title}
                        </h3>

                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {c.description}
                        </p>

                        <div className="mt-5 border-t border-gray-100 pt-4 flex justify-between">
                            <div>
                                <p className="text-xl font-bold">
                                    ৳{c.raised.toLocaleString()}
                                    <span className="text-text-secondary text-sm font-normal ml-2">
                                        raised by
                                    </span>
                                </p>
                                <p className="text-sm text-text-secondary font-normal">
                                    {c.supporters} supporters
                                </p>
                            </div>

                            <div className="rounded-full bg-transparent p-1">
                                <ProgressRing progress={c.progress} />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export default CampaignGrid;
