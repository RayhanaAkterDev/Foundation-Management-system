import { Link } from 'react-router-dom';
import { ArrowUpRight, HeartHandshake, MapPin, Target } from 'lucide-react';

import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

const bn = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

const money = (value) => `৳${bn(Number(value || 0).toLocaleString('en-BD'))}`;

const getImage = (campaign) =>
    campaign.cover_image_url ||
    campaign.cover_image ||
    campaign.banner_url ||
    campaign.banner ||
    campaign.image_url ||
    campaign.image ||
    defaultCampaignImage;

const getDescription = (campaign) =>
    campaign.short_description ||
    campaign.shortDescription ||
    campaign.description ||
    '';

const categoryNames = {
    Education: 'শিক্ষা',
    Food: 'খাদ্য সহায়তা',
    Health: 'স্বাস্থ্যসেবা',
    Healthcare: 'স্বাস্থ্যসেবা',
    Nutrition: 'পুষ্টি সহায়তা',
    Water: 'বিশুদ্ধ পানি',
    'Clean Water': 'বিশুদ্ধ পানি',
    'Disaster Relief': 'দুর্যোগ সহায়তা',
    'Emergency Relief': 'জরুরি সহায়তা',
    'Child Support': 'শিশু সহায়তা',
    'Women Empowerment': 'নারীর ক্ষমতায়ন',
    'Disaster Recovery': 'দুর্যোগ পুনর্বাসন',
};

const banglaCategory = (value) =>
    categoryNames[value] || value || 'মানবিক উদ্যোগ';

function CampaignPhoto({ campaign }) {
    return (
        <img
            src={getImage(campaign)}
            alt={campaign.title || 'মানবিক উদ্যোগ'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = defaultCampaignImage;
            }}
        />
    );
}

export default function FeaturedCampaignCard({ campaign, index = 0 }) {
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

    const title = campaign.title || 'মানবিক সহায়তার উদ্যোগ';
    const description = getDescription(campaign);
    const location = campaign.location || campaign.district || '';

    return (
        <Link
            to={`/campaign/${campaign.id}`}
            aria-label={`${title} — বিস্তারিত দেখুন`}
            className="group block h-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
        >
            <article className="flex h-full min-w-0 flex-col overflow-hidden border border-[#e1e8e2] bg-white transition-all duration-300 hover:border-[#a8cbbd] hover:shadow-[0_14px_35px_-28px_rgba(15,75,60,0.3)]">
                {/* Top identification */}
                <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[#edf1ed] px-5 py-3 sm:px-6">
                    <span className="inline-flex items-center gap-2 font-bengali text-[12px] font-semibold text-[#147361]">
                        <HeartHandshake size={15} strokeWidth={1.8} />
                        নির্বাচিত মানবিক উদ্যোগ
                    </span>

                    <span className="font-bengali text-[12px] text-[#899a91]">
                        {bn(String(index + 1).padStart(2, '0'))}
                    </span>
                </div>

                {/* Main content */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
                    <div className="flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                            <p className="font-bengali text-[12px] font-semibold text-[#16806c]">
                                {banglaCategory(campaign.category)}
                            </p>

                            <h3 className="mt-3 line-clamp-3 font-bengali text-[19px] font-semibold leading-[1.6] text-[#152c27] transition-colors group-hover:text-[#0f766e] sm:text-[20px]">
                                {title}
                            </h3>
                        </div>

                        <div className="h-[105px] w-[105px] shrink-0 overflow-hidden bg-[#e8efea] sm:h-[118px] sm:w-[118px]">
                            <CampaignPhoto campaign={campaign} />
                        </div>
                    </div>

                    {description && (
                        <p className="mt-4 line-clamp-2 min-h-[3.5em] font-bengali text-[13px] leading-[1.8] text-[#6c7e74]">
                            {description}
                        </p>
                    )}

                    {location && (
                        <div className="mt-4 flex min-w-0 items-center gap-1.5 text-[#829087]">
                            <MapPin size={13} className="shrink-0" />
                            <span className="truncate font-bengali text-[12px]">
                                {location}
                            </span>
                        </div>
                    )}

                    {/* Funding */}
                    <div className="mt-auto pt-6">
                        <div className="border-t border-[#e7ede8] pt-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="min-w-0">
                                    <p className="font-bengali text-[11px] text-[#829188]">
                                        সংগৃহীত সহায়তা
                                    </p>

                                    <p className="mt-2 break-words text-[20px] font-semibold tracking-tight text-[#126b59]">
                                        {money(raised)}
                                    </p>
                                </div>

                                <div className="min-w-0 border-l border-[#e7ede8] pl-4">
                                    <p className="inline-flex items-center gap-1 font-bengali text-[11px] text-[#829188]">
                                        <Target size={12} />
                                        লক্ষ্যমাত্রা
                                    </p>

                                    <p className="mt-2 break-words text-[16px] font-semibold text-[#30483d]">
                                        {goal > 0
                                            ? money(goal)
                                            : 'নির্ধারিত নয়'}
                                    </p>
                                </div>
                            </div>

                            {progress !== null && (
                                <div className="mt-5">
                                    <div
                                        role="progressbar"
                                        aria-label="সহায়তা সংগ্রহের অগ্রগতি"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={progress}
                                        className="h-[5px] overflow-hidden rounded-full bg-[#e5ede7]"
                                    >
                                        <div
                                            className="h-full rounded-full bg-[#14816c] transition-[width] duration-500"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="mt-2.5 flex items-center justify-between gap-3">
                                        <span className="font-bengali text-[11px] text-[#87968d]">
                                            সংগ্রহের অগ্রগতি
                                        </span>

                                        <span className="font-bengali text-[11px] font-semibold text-[#147361]">
                                            {bn(progress)}% সম্পন্ন
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex min-h-[58px] items-center justify-between gap-3 bg-[#f0f5f1] px-5 py-3.5 transition-colors group-hover:bg-[#e6f0e9] sm:px-6">
                    <span className="font-bengali text-[13px] font-semibold text-[#195b4d]">
                        উদ্যোগটি সম্পর্কে জানুন
                    </span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#147361] transition-colors group-hover:bg-[#147361] group-hover:text-white">
                        <ArrowUpRight size={17} />
                    </span>
                </div>
            </article>
        </Link>
    );
}
