import React from 'react';
import { ArrowUpRight, HeartHandshake, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';

import SectionHeading from '@/components/SectionHeading';

const isEnabled = (value) =>
    value === true || value === 1 || value === '1';

const getCampaignImage = (campaign) =>
    campaign?.cover_image_url ||
    campaign?.cover_image ||
    campaign?.banner_url ||
    campaign?.banner ||
    campaign?.image_url ||
    campaign?.image ||
    null;

const getCampaignDescription = (campaign) =>
    campaign?.shortDescription ||
    campaign?.short_description ||
    campaign?.description ||
    '';

const getProgress = (campaign) => {
    const goal = Number(
        campaign?.target_amount ?? campaign?.goal_amount ?? 0
    );
    const collected = Number(campaign?.collected_amount ?? 0);

    if (
        !Number.isFinite(goal) ||
        !Number.isFinite(collected) ||
        goal <= 0 ||
        collected < 0
    ) {
        return null;
    }

    return Math.min(100, Math.round((collected / goal) * 100));
};

const formatCurrency = (amount) =>
    `৳${Number(amount || 0).toLocaleString('en-BD')}`;

const UrgentSection = ({ campaigns = [] }) => {
    const urgentCampaigns = (Array.isArray(campaigns) ? campaigns : [])
        .filter(Boolean)
        .filter((campaign) => isEnabled(campaign.is_urgent))
        .sort(
            (a, b) =>
                Number(a.urgency_priority ?? a.priority ?? 2) -
                Number(b.urgency_priority ?? b.priority ?? 2)
        )
        .slice(0, 5);

    const mainCampaign = urgentCampaigns[0];
    const supportingCampaigns = urgentCampaigns.slice(1);

    return (
        <section className="section-gap border-y border-border bg-background-alt/40">
            <div className="container-width space-y-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <SectionHeading
                            align="left"
                            title="জরুরি সহায়তার আবেদন"
                            description="যেসব মানবিক উদ্যোগে দ্রুত সহায়তা প্রয়োজন, সেগুলোকে অগ্রাধিকার দিয়ে পাশে দাঁড়ান।"
                        />
                    </div>

                    {urgentCampaigns.length > 0 && (
                        <Link
                            to="/campaigns"
                            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-primary/30 pb-1 text-sm font-semibold text-primary transition-colors hover:border-primary"
                        >
                            সব ক্যাম্পেইন
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                    )}
                </div>

                {mainCampaign ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                        {/* Main urgent campaign */}
                        <Link
                            to={`/campaign/${mainCampaign.id}`}
                            className="group min-w-0 overflow-hidden border border-border bg-surface transition-colors hover:border-primary/40 lg:col-span-7"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden bg-background-alt sm:aspect-[2/1]">
                                {getCampaignImage(mainCampaign) ? (
                                    <img
                                        src={getCampaignImage(mainCampaign)}
                                        alt={mainCampaign.title || 'জরুরি ক্যাম্পেইন'}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="flex h-full min-h-48 items-center justify-center">
                                        <HeartHandshake
                                            size={42}
                                            strokeWidth={1.2}
                                            className="text-text-secondary"
                                        />
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 pt-16 sm:p-6 sm:pt-20">
                                    <span className="inline-flex items-center gap-2 border border-white/30 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                                        <Siren size={14} />
                                        জরুরি সহায়তা
                                    </span>

                                    <h3 className="mt-3 text-xl font-semibold leading-snug text-white sm:text-2xl">
                                        {mainCampaign.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-5 p-5 sm:p-6">
                                {getCampaignDescription(mainCampaign) && (
                                    <p className="line-clamp-3 text-sm leading-7 text-text-secondary">
                                        {getCampaignDescription(mainCampaign)}
                                    </p>
                                )}

                                {getProgress(mainCampaign) !== null && (
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-end justify-between gap-2">
                                            <div>
                                                <p className="text-xs text-text-secondary">
                                                    সংগৃহীত অনুদান
                                                </p>
                                                <p className="mt-1 text-lg font-semibold text-text-primary">
                                                    {formatCurrency(
                                                        mainCampaign.collected_amount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-text-secondary">
                                                    লক্ষ্যমাত্রা
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-text-primary">
                                                    {formatCurrency(
                                                        mainCampaign.target_amount ??
                                                            mainCampaign.goal_amount
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="h-2 overflow-hidden bg-background-alt"
                                            role="progressbar"
                                            aria-label="অনুদান সংগ্রহের অগ্রগতি"
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={getProgress(mainCampaign)}
                                        >
                                            <div
                                                className="h-full bg-primary transition-[width] duration-500"
                                                style={{
                                                    width: `${getProgress(mainCampaign)}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="text-xs text-text-secondary">
                                            লক্ষ্যমাত্রার {getProgress(mainCampaign)}% সংগৃহীত
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                        <HeartHandshake size={17} />
                                        সহায়তার হাত বাড়ান
                                    </span>

                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary transition-colors group-hover:text-primary">
                                        বিস্তারিত দেখুন
                                        <ArrowUpRight
                                            size={16}
                                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Other urgent campaigns */}
                        <div className="flex min-w-0 flex-col lg:col-span-5">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <h3 className="text-sm font-semibold text-text-primary">
                                    আরও জরুরি ক্যাম্পেইন
                                </h3>
                                <span className="text-xs text-text-secondary">
                                    {supportingCampaigns.length}টি
                                </span>
                            </div>

                            {supportingCampaigns.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {supportingCampaigns.map((campaign) => {
                                        const image = getCampaignImage(campaign);
                                        const priority = Number(
                                            campaign.urgency_priority ??
                                                campaign.priority ??
                                                2
                                        );

                                        return (
                                            <Link
                                                key={campaign.id}
                                                to={`/campaign/${campaign.id}`}
                                                className="group flex min-w-0 gap-4 py-4 transition-colors"
                                            >
                                                <div className="h-24 w-28 shrink-0 overflow-hidden bg-background-alt sm:h-28 sm:w-36">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={campaign.title || 'জরুরি ক্যাম্পেইন'}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <HeartHandshake
                                                                size={24}
                                                                className="text-text-secondary"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <span className="text-[11px] font-semibold text-primary">
                                                            জরুরি সহায়তা
                                                        </span>
                                                        {priority === 1 && (
                                                            <span className="text-[10px] font-semibold text-orange-600">
                                                                সর্বোচ্চ অগ্রাধিকার
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h4 className="line-clamp-2 text-sm font-semibold leading-6 text-text-primary transition-colors group-hover:text-primary sm:text-base">
                                                        {campaign.title}
                                                    </h4>

                                                    {getCampaignDescription(campaign) && (
                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                                                            {getCampaignDescription(campaign)}
                                                        </p>
                                                    )}

                                                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                                        বিস্তারিত
                                                        <ArrowUpRight size={13} />
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-1 flex-col justify-center py-8">
                                    <p className="text-sm font-medium text-text-primary">
                                        আপাতত এটিই প্রধান জরুরি ক্যাম্পেইন।
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        নতুন জরুরি উদ্যোগ যুক্ত হলে এখানে দেখা যাবে।
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="border-y border-border px-5 py-12 text-center">
                        <HeartHandshake
                            size={28}
                            strokeWidth={1.4}
                            className="mx-auto mb-3 text-text-secondary"
                        />
                        <p className="text-base font-semibold text-text-primary">
                            এই মুহূর্তে কোনো জরুরি ক্যাম্পেইন নেই
                        </p>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                            যাচাইকৃত কোনো ক্যাম্পেইনকে জরুরি হিসেবে চিহ্নিত করা হলে
                            এখানে দেখানো হবে।
                        </p>
                        <Link
                            to="/campaigns"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                        >
                            সব ক্যাম্পেইন দেখুন
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UrgentSection;