import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, HeartHandshake, MapPin } from 'lucide-react';

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
};

const getDaysLeft = (campaign) => {
    if (campaign.daysLeft != null) {
        const days = Number(campaign.daysLeft);
        return Number.isFinite(days) ? days : null;
    }

    if (!campaign.end_date) return null;

    const end = new Date(campaign.end_date);

    if (Number.isNaN(end.getTime())) return null;

    return Math.ceil((end.getTime() - Date.now()) / 86400000);
};

export default function CampaignEditorialCard({ campaign }) {
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

    const title = campaign.title || 'জরুরি মানবিক উদ্যোগ';

    const location = campaign.location || campaign.district || '';

    const category =
        categoryNames[campaign.category] ||
        campaign.category ||
        'জরুরি সহায়তা';

    const daysLeft = getDaysLeft(campaign);

    const urgencyLabel =
        daysLeft === null
            ? 'জরুরি সহায়তা প্রয়োজন'
            : daysLeft > 0
              ? `আর ${bn(daysLeft)} দিন বাকি`
              : 'দ্রুত সহায়তা প্রয়োজন';

    return (
        <Link
            to={`/campaign/${campaign.id}`}
            aria-label={`${title} — বিস্তারিত দেখুন`}
            className="group block h-full min-w-0 rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
        >
            <article className="flex h-full min-w-0 flex-col overflow-hidden border border-[#e1e9e3] bg-[#fbfcf9] transition-all duration-300 hover:-translate-y-1 hover:border-[#a9cabb] hover:shadow-[0_16px_36px_-25px_rgba(20,60,45,0.3)]">
                {/* Cover */}
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#e1eae3] sm:aspect-[16/11]">
                    <img
                        src={getImage(campaign)}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = defaultCampaignImage;
                        }}
                    />

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />

                    <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                        <span className="inline-flex max-w-[80%] items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 font-bengali text-[11px] font-semibold text-[#126b59] shadow-sm">
                            <Clock3 size={13} className="shrink-0" />
                            <span className="truncate">{urgencyLabel}</span>
                        </span>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-[#126b59] shadow-sm transition-colors group-hover:bg-[#126b59] group-hover:text-white">
                            <ArrowUpRight size={18} />
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-bengali text-[12px]">
                        <span className="font-semibold text-[#147765]">
                            {category}
                        </span>

                        {location && (
                            <>
                                <span className="h-1 w-1 rounded-full bg-[#b9c8bf]" />
                                <span className="inline-flex min-w-0 items-center gap-1 text-[#7d8d83]">
                                    <MapPin size={12} className="shrink-0" />
                                    <span className="truncate">{location}</span>
                                </span>
                            </>
                        )}
                    </div>

                    <h3 className="mt-3 line-clamp-3 min-h-[4.65em] font-bengali text-[19px] font-semibold leading-[1.55] text-[#19332b] transition-colors group-hover:text-[#0f766e] sm:text-[20px]">
                        {title}
                    </h3>

                    {/* Funding */}
                    <div className="mt-auto pt-5">
                        <div className="flex items-end justify-between gap-3">
                            <div className="min-w-0">
                                <p className="font-bengali text-[11px] text-[#829188]">
                                    সংগৃহীত সহায়তা
                                </p>

                                <p className="mt-1.5 break-words text-[21px] font-semibold text-[#126b59]">
                                    {money(raised)}
                                </p>
                            </div>

                            <div className="min-w-0 text-right">
                                <p className="font-bengali text-[11px] text-[#829188]">
                                    লক্ষ্যমাত্রা
                                </p>

                                <p className="mt-1.5 break-words text-[15px] font-semibold text-[#30483d]">
                                    {goal > 0 ? money(goal) : 'নির্ধারিত নয়'}
                                </p>
                            </div>
                        </div>

                        {progress !== null && (
                            <div className="mt-4">
                                <div
                                    role="progressbar"
                                    aria-label="সহায়তা সংগ্রহের অগ্রগতি"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={progress}
                                    className="h-[5px] overflow-hidden rounded-full bg-[#e3ece5]"
                                >
                                    <div
                                        className="h-full rounded-full bg-[#16806c] transition-[width] duration-500"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-2.5 flex items-center justify-between gap-2">
                                    <span className="font-bengali text-[11px] text-[#849188]">
                                        সংগ্রহের অগ্রগতি
                                    </span>

                                    <span className="font-bengali text-[11px] font-semibold text-[#147765]">
                                        {bn(progress)}% সম্পন্ন
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e5ebe5] pt-4">
                        <span className="inline-flex items-center gap-2 font-bengali text-[12px] font-semibold text-[#234339]">
                            <HeartHandshake size={16} />
                            জরুরি উদ্যোগে পাশে দাঁড়ান
                        </span>

                        <span className="inline-flex shrink-0 items-center gap-1 font-bengali text-[12px] font-semibold text-[#147765]">
                            বিস্তারিত
                            <ArrowUpRight size={15} />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
