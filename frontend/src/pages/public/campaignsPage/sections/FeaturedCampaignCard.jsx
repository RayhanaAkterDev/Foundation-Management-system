import React from 'react';
import { ArrowUpRight, HeartHandshake, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

const banglaDigits = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const currency = (value) =>
    `৳${banglaDigits(Number(value || 0).toLocaleString('en-BD'))}`;

const imageOf = (campaign) =>
    campaign?.cover_image_url ||
    campaign?.cover_image ||
    campaign?.banner_url ||
    campaign?.banner ||
    campaign?.image_url ||
    campaign?.image ||
    defaultCampaignImage;

const FeaturedCampaignCard = ({ campaign, index = 0 }) => {
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
        goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : null;
    const location = campaign.location || campaign.district;

    return (
        <Link
            to={`/campaign/${campaign.id}`}
            aria-label={`${campaign.title || 'নির্বাচিত ক্যাম্পেইন'} — বিস্তারিত দেখুন`}
            className="group block min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
            <article className="relative isolate aspect-[4/5] min-h-[350px] overflow-hidden rounded-xl bg-[#173e3b] sm:aspect-[5/6] sm:min-h-[390px] xl:aspect-[4/5]">
                <img
                    src={imageOf(campaign)}
                    alt={campaign.title || 'নির্বাচিত ক্যাম্পেইন'}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = defaultCampaignImage;
                    }}
                />
                {/* Preserve the photograph at the top; reserve dark contrast for the text. */}
                <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent via-30% to-[#071c1a]/95" />
                <div className="absolute inset-0 bg-linear-to-t from-[#071c1a]/45 via-transparent to-transparent" />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
                    <span className="inline-flex max-w-[75%] items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-3 py-1.5 font-bengali text-xs font-semibold text-[#115e59] shadow-sm">
                        <HeartHandshake size={13} className="shrink-0" />
                        <span className="truncate">
                            {campaign.category || 'নির্বাচিত উদ্যোগ'}
                        </span>
                    </span>
                    <span className="text-xs font-medium tracking-widest text-white/90">
                        {banglaDigits(String(index + 1).padStart(2, '0'))}
                    </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    {location && (
                        <p className="mb-2 flex items-center gap-1.5 truncate font-bengali text-xs text-white/75">
                            <MapPin size={13} className="shrink-0" />
                            <span className="truncate">{location}</span>
                        </p>
                    )}

                    <h3 className="line-clamp-3 font-bengali text-[20px] font-semibold leading-[1.45] text-white sm:text-[22px]">
                        {campaign.title || 'মানবিক সহায়তার উদ্যোগ'}
                    </h3>

                    <div className="mt-5 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                            <p className="font-bengali text-[11px] text-white/70">
                                সংগৃহীত অনুদান
                            </p>
                            <p className="mt-0.5 text-lg font-semibold text-white sm:text-xl">
                                {currency(raised)}
                            </p>
                        </div>
                        {goal > 0 && (
                            <div className="min-w-0 text-right">
                                <p className="font-bengali text-[11px] text-white/70">
                                    লক্ষ্যমাত্রা
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-white/90">
                                    {currency(goal)}
                                </p>
                            </div>
                        )}
                    </div>

                    {progress !== null && (
                        <div className="mt-3 flex items-center gap-3">
                            <div
                                className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/30"
                                role="progressbar"
                                aria-label="অনুদান সংগ্রহের অগ্রগতি"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={progress}
                            >
                                <div
                                    className="h-full rounded-full bg-[#79dfc6]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="shrink-0 text-xs font-semibold text-white">
                                {banglaDigits(progress)}%
                            </span>
                        </div>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                        <span className="font-bengali text-sm font-semibold text-white">
                            উদ্যোগটি দেখুন
                        </span>
                        <span className="flex size-9 items-center justify-center rounded-full border border-white/55 text-white transition-colors group-hover:border-[#79dfc6] group-hover:bg-[#79dfc6] group-hover:text-[#073d34]">
                            <ArrowUpRight size={18} />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default FeaturedCampaignCard;
