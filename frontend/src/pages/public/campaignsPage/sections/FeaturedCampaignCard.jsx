import React from 'react';
import { ArrowUpRight, HeartHandshake, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

const bn = (value) =>
    String(value).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

const money = (value) => `৳${bn(Number(value || 0).toLocaleString('en-BD'))}`;

const getImage = (campaign) =>
    campaign?.cover_image_url ||
    campaign?.cover_image ||
    campaign?.banner_url ||
    campaign?.banner ||
    campaign?.image_url ||
    campaign?.image ||
    defaultCampaignImage;

const categoryNames = {
    Education: 'শিক্ষা',
    Food: 'খাদ্য সহায়তা',
    Health: 'স্বাস্থ্যসেবা',
    Healthcare: 'স্বাস্থ্যসেবা',
    Nutrition: 'পুষ্টি সহায়তা',
    Water: 'বিশুদ্ধ পানি',
    'Clean Water': 'বিশুদ্ধ পানি',
    'Emergency Relief': 'জরুরি সহায়তা',
    'Child Support': 'শিশু সহায়তা',
    'Women Empowerment': 'নারীর ক্ষমতায়ন',
};

const FeaturedCampaignCard = ({ campaign }) => {
    if (!campaign) return null;

    const raised = Math.max(
        0,
        Number(campaign.raised ?? campaign.collected_amount ?? 0) || 0,
    );

    const goal = Math.max(
        0,
        Number(
            campaign.goal ??
                campaign.target ??
                campaign.target_amount ??
                campaign.goal_amount ??
                0,
        ) || 0,
    );

    const progress =
        goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    const title = campaign.title || 'মানবিক সহায়তার উদ্যোগ';
    const location = campaign.location || campaign.district;
    const category =
        categoryNames[campaign.category] ||
        campaign.category ||
        'মানবিক উদ্যোগ';

    return (
        <Link
            to={`/campaign/${campaign.id}`}
            aria-label={`${title} — বিস্তারিত দেখুন`}
            className="group block h-full min-w-0 rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
        >
            <article className="relative isolate h-[425px] overflow-hidden rounded-[18px] bg-[#163b36] transition-transform duration-300 group-hover:-translate-y-1 sm:h-[450px] lg:h-[465px]">
                {/* Full photographic background */}
                <img
                    src={getImage(campaign)}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.055]"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = defaultCampaignImage;
                    }}
                />

                {/* Gentle contrast only */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg,rgba(5,25,22,.24) 0%,transparent 38%,rgba(5,25,22,.12) 60%,rgba(5,25,22,.55) 100%)',
                    }}
                />

                {/* Top category */}
                <div className="absolute left-4 top-4 right-4">
                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-bengali text-[11px] font-semibold text-[#115e59] shadow-sm">
                        <HeartHandshake size={13} className="shrink-0" />
                        <span className="truncate">{category}</span>
                    </span>
                </div>

                {/* Floating information panel */}
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                    <div className="rounded-[14px] bg-[#f9faf6] px-4 pb-4 pt-4 shadow-[0_12px_32px_rgba(0,0,0,.12)] sm:px-5 sm:pb-5 sm:pt-5">
                        {location && (
                            <p className="mb-2 flex items-center gap-1.5 font-bengali text-[11px] text-[#72827d]">
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate">{location}</span>
                            </p>
                        )}

                        <h3 className="line-clamp-2 min-h-[3.15em] font-bengali text-[18px] font-semibold leading-[1.55] text-[#142c29] transition-colors group-hover:text-[#0f766e] sm:text-[19px]">
                            {title}
                        </h3>

                        <div className="mt-4 flex items-end justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bengali text-[11px] text-[#81908b]">
                                    সংগৃহীত অনুদান
                                </p>
                                <p className="mt-0.5 text-[20px] font-semibold text-[#0f766e]">
                                    {money(raised)}
                                </p>
                            </div>

                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-white transition-all duration-300 group-hover:bg-[#134e4a]">
                                <ArrowUpRight size={19} />
                            </span>
                        </div>

                        {goal > 0 && (
                            <div className="mt-4">
                                <div
                                    className="h-[5px] overflow-hidden rounded-full bg-[#e0e9e4]"
                                    role="progressbar"
                                    aria-label="অনুদান সংগ্রহের অগ্রগতি"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={progress}
                                >
                                    <div
                                        className="h-full rounded-full bg-[#0f766e]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="mt-2 flex items-center justify-between gap-2 font-bengali text-[11px] text-[#71827d]">
                                    <span>লক্ষ্য {money(goal)}</span>
                                    <span className="font-semibold text-[#0f766e]">
                                        {bn(progress)}% সম্পন্ন
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default FeaturedCampaignCard;
