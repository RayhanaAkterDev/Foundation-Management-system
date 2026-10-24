import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowUpRight,
    CalendarDays,
    HandHeart,
    ImageOff,
    Target,
    TrendingUp,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const formatCurrency = (value) =>
    `৳${Number(value || 0).toLocaleString('en-BD')}`;

const formatDate = (value) => {
    if (!value) return 'No deadline';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No deadline';

    return date.toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const CampaignCard = ({ campaign, onDonate }) => {
    const navigate = useNavigate();

    const goal = Math.max(Number(campaign.target_amount) || 0, 0);
    const raised = Math.max(Number(campaign.collected_amount) || 0, 0);
    const percentage =
        goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
    const remaining = Math.max(goal - raised, 0);

    const image =
        campaign.cover_photo ||
        campaign.cover_image ||
        campaign.cover_image_url ||
        campaign.banner ||
        campaign.image ||
        campaign.photo ||
        null;

    const category =
        typeof campaign.category === 'string'
            ? campaign.category
            : campaign.category?.name;

    const description =
        campaign.description ||
        'Support this humanitarian initiative and help make a meaningful difference.';

    const openDetails = () => {
        if (campaign.id == null) return;
        navigate(`/individual/dashboard/campaigns/${campaign.id}`);
    };

    const handleDonate = (event) => {
        event.stopPropagation();
        onDonate?.(campaign);
    };

    return (
        <article
            role="link"
            tabIndex={0}
            aria-label={`View details for ${campaign.title || 'campaign'}`}
            onClick={openDetails}
            onKeyDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    (event.key === 'Enter' || event.key === ' ')
                ) {
                    event.preventDefault();
                    openDetails();
                }
            }}
            className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-[10px] border border-[#303A47] bg-[#151C25] transition-colors duration-300 hover:border-[#526173] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ABCCF]"
        >
            {/* COVER / EDITORIAL HERO */}
            <div className="relative isolate h-[275px] shrink-0 overflow-hidden bg-[#202B38] sm:h-[295px]">
                {image ? (
                    <img
                        src={image}
                        alt={campaign.title || 'Campaign cover'}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#202B38]">
                        <ImageOff
                            size={34}
                            strokeWidth={1.3}
                            className="text-[#748395]"
                        />
                    </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080D14] via-[#080D14]/65 to-[#080D14]/10" />

                <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
                    <span className="max-w-[65%] truncate rounded-[4px] border border-white/15 bg-[#0C131C]/65 px-3 py-1.5 font-sans! text-[11px] font-medium! text-white! backdrop-blur-md">
                        {category || 'Humanitarian campaign'}
                    </span>

                    <div className="shrink-0 [&_span]:border-white/20! [&_span]:bg-[#0C131C]/70! [&_span]:text-white!">
                        <StatusBadge status={campaign.status} />
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-16 sm:px-6">
                    <h3 className="line-clamp-2 font-sans! text-[20px] font-semibold! leading-[1.35] tracking-[-0.025em] text-white! sm:text-[21px]">
                        {campaign.title || 'Untitled campaign'}
                    </h3>

                    <p className="mt-2.5 line-clamp-2 max-w-[95%] font-sans! text-[12px] leading-[1.7] text-[#D2DCE6]!">
                        {description}
                    </p>
                </div>
            </div>

            {/* FUNDRAISING CONTENT */}
            <div className="flex flex-1 flex-col">
                <div className="px-5 pt-5 sm:px-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#85BBAE]" />
                                <span className="font-sans! text-[11px] font-medium! text-[#9BA8B8]!">
                                    Total raised
                                </span>
                            </div>

                            <p className="mt-2 font-sans! text-[27px] font-semibold! leading-none tracking-[-0.045em] text-[#F0F4F8]!">
                                {formatCurrency(raised)}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5 rounded-[5px] bg-[#253B37] px-2.5 py-1.5">
                            <TrendingUp
                                size={13}
                                strokeWidth={2}
                                className="text-[#9ED5BC]"
                            />
                            <span className="font-sans! text-[12px] font-semibold! text-[#B5E4CC]!">
                                {percentage}%
                            </span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div
                            className="h-[7px] overflow-hidden rounded-full bg-[#303A47]"
                            role="progressbar"
                            aria-label="Campaign funding progress"
                            aria-valuenow={percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="h-full rounded-full bg-[#85BBAE] transition-[width] duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="font-sans! text-[11px] font-medium! text-[#B6C4D2]!">
                                {percentage}% of funding goal
                            </span>

                            <span className="font-sans! text-[11px] text-[#8795A5]!">
                                {goal <= 0
                                    ? 'No funding target'
                                    : remaining > 0
                                      ? `${formatCurrency(remaining)} to go`
                                      : 'Goal achieved'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mx-5 mt-5 grid grid-cols-2 gap-4 border-y border-[#303A47] py-4 sm:mx-6">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <Target
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8C9BAD]"
                            />
                            <span className="font-sans! text-[11px] text-[#8F9DAE]!">
                                Funding target
                            </span>
                        </div>

                        <p className="mt-2 truncate font-sans! text-[14px] font-semibold! text-[#E3E9F0]!">
                            {formatCurrency(goal)}
                        </p>
                    </div>

                    <div className="min-w-0 border-l border-[#303A47] pl-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8C9BAD]"
                            />
                            <span className="font-sans! text-[11px] text-[#8F9DAE]!">
                                Campaign deadline
                            </span>
                        </div>

                        <p className="mt-2 truncate font-sans! text-[14px] font-semibold! text-[#E3E9F0]!">
                            {formatDate(campaign.end_date)}
                        </p>
                    </div>
                </div>

                <div className="mt-auto px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                    <button
                        type="button"
                        onClick={handleDonate}
                        className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-[6px] bg-[#D5E1E8] px-4 py-3 font-sans! text-[12px] font-semibold! text-[#17232F]! transition-all duration-200 hover:bg-[#F0F5F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9ABCCF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151C25]"
                    >
                        <span className="flex items-center gap-2.5">
                            <HandHeart size={17} strokeWidth={1.8} />
                            Support this campaign
                        </span>

                        <ArrowUpRight
                            size={18}
                            strokeWidth={1.8}
                            className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default CampaignCard;
