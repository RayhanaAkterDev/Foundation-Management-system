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
            className="
        group block h-full min-w-0
        rounded-[16px]
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-[#0f766e]
      "
        >
            <article
                className="
          relative isolate flex h-full min-h-[430px]
          flex-col overflow-hidden rounded-[16px]
          bg-[#123e38]
          transition-[transform,box-shadow] duration-300
          group-hover:-translate-y-1
          group-hover:shadow-[0_20px_45px_rgba(12,48,43,0.16)]
          sm:min-h-[460px]
          lg:min-h-[475px]
        "
            >
                {/* Full-bleed photograph */}
                <img
                    src={getImage(campaign)}
                    alt={title}
                    loading="lazy"
                    className="
            absolute inset-0 h-full w-full
            object-cover
            transition-transform duration-700
            ease-out group-hover:scale-[1.06]
          "
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = defaultCampaignImage;
                    }}
                />

                {/* Readable but photographic overlay */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
              linear-gradient(
                180deg,
                rgba(8,30,27,0.24) 0%,
                rgba(8,30,27,0.03) 27%,
                rgba(8,30,27,0.08) 43%,
                rgba(8,30,27,0.67) 72%,
                rgba(8,30,27,0.94) 100%
              )
            `,
                    }}
                />

                {/* Top metadata */}
                <div
                    className="
            relative z-10 flex items-start
            justify-between gap-3 p-4
            sm:p-5
          "
                >
                    <span
                        className="
              inline-flex min-w-0 max-w-[75%]
              items-center gap-1.5
              rounded-full bg-white/95
              px-3 py-1.5
              font-bengali text-[11px]
              font-semibold text-[#115e59]
              shadow-sm
            "
                    >
                        <HeartHandshake size={13} className="shrink-0" />
                        <span className="truncate">{category}</span>
                    </span>

                    <span
                        className="
              flex size-9 shrink-0 items-center
              justify-center rounded-full
              border border-white/40
              bg-black/15 text-white
              backdrop-blur-sm
              transition-all duration-300
              group-hover:border-white
              group-hover:bg-white
              group-hover:text-[#115e59]
            "
                    >
                        <ArrowUpRight size={18} />
                    </span>
                </div>

                {/* Flexible photographic area */}
                <div className="min-h-[110px] flex-1" />

                {/* Editorial content */}
                <div className="relative z-10 px-5 sm:px-6">
                    {location && (
                        <div
                            className="
                mb-3 flex items-center gap-1.5
                font-bengali text-[11px]
                text-white/75
              "
                        >
                            <MapPin size={13} className="shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                    )}

                    <h3
                        className="
              line-clamp-3
              font-bengali text-[21px]
              font-semibold leading-[1.55]
              tracking-[-0.025em]
              text-white
              sm:text-[23px]
              lg:text-[22px]
              xl:text-[24px]
            "
                    >
                        {title}
                    </h3>

                    <div
                        className="
              mt-4 h-px w-full
              bg-white/25
            "
                    />

                    {/* Donation information */}
                    <div
                        className="
              flex items-end justify-between
              gap-3 pt-4
            "
                    >
                        <div className="min-w-0">
                            <p
                                className="
                  font-bengali text-[11px]
                  text-white/65
                "
                            >
                                এখন পর্যন্ত সংগৃহীত
                            </p>

                            <p
                                className="
                  mt-1 text-[23px] font-semibold
                  leading-none tracking-tight
                  text-white sm:text-[25px]
                "
                            >
                                {money(raised)}
                            </p>
                        </div>

                        {goal > 0 && (
                            <div className="shrink-0 text-right">
                                <p
                                    className="
                    font-bengali text-[11px]
                    text-white/60
                  "
                                >
                                    লক্ষ্যমাত্রার
                                </p>

                                <p
                                    className="
                    mt-1 text-[19px] font-semibold
                    leading-none text-[#b9e8d9]
                  "
                                >
                                    {bn(progress)}%
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    {goal > 0 && (
                        <div className="mt-4">
                            <div
                                className="
                  h-[4px] w-full overflow-hidden
                  rounded-full bg-white/25
                "
                                role="progressbar"
                                aria-label="অনুদান সংগ্রহের অগ্রগতি"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={progress}
                            >
                                <div
                                    className="
                    h-full rounded-full
                    bg-[#b9e8d9]
                    transition-[width] duration-500
                  "
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>

                            <div
                                className="
                  mt-2 flex items-center
                  justify-between gap-2
                  font-bengali text-[11px]
                  text-white/65
                "
                            >
                                <span>লক্ষ্য {money(goal)}</span>

                                <span className="text-white/85">
                                    {bn(progress)}% সম্পন্ন
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom editorial action */}
                <div
                    className="
            relative z-10 mt-5
            flex items-center justify-between
            gap-3 border-t border-white/15
            px-5 py-3.5
            sm:px-6
          "
                >
                    <span
                        className="
              font-bengali text-[12px]
              font-medium text-white/90
            "
                    >
                        উদ্যোগটি সম্পর্কে জানুন
                    </span>

                    <span
                        className="
              font-bengali text-[11px]
              text-[#b9e8d9]
              transition-transform duration-300
              group-hover:translate-x-1
            "
                    >
                        বিস্তারিত দেখুন
                    </span>
                </div>
            </article>
        </Link>
    );
};

export default FeaturedCampaignCard;
