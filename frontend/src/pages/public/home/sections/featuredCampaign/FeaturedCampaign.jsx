import React, { useEffect, useState } from 'react';

import {
    TbArrowUpRight,
    TbCalendar,
    TbHeartFilled,
    TbHeartHandshake,
    TbMapPin,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

import { Link } from 'react-router-dom';

import { fetchFeaturedCampaign } from '@/api/publicCampaignsApi';

import Button from '@/components/Button';
import Motion from '@/components/motion/Motion';

/* =========================================================
   HELPERS
========================================================= */

const toBanglaNumber = (value) => {
    if (value === null || value === undefined) {
        return '০';
    }

    const banglaDigits = {
        0: '০',
        1: '১',
        2: '২',
        3: '৩',
        4: '৪',
        5: '৫',
        6: '৬',
        7: '৭',
        8: '৮',
        9: '৯',
    };

    return String(value).replace(/\d/g, (digit) => banglaDigits[digit]);
};

const formatBanglaAmount = (value) => {
    const amount = Number(value || 0);

    return toBanglaNumber(amount.toLocaleString('en-US'));
};

/* =========================================================
   FEATURED CAMPAIGN SKELETON
========================================================= */

const FeaturedCampaignSkeleton = () => {
    return (
        <section className="section-gap overflow-hidden bg-[#f6f8f7]">
            <div className="container-width">
                <div className="animate-pulse">
                    {/* Section heading */}
                    <div className="mb-10 flex flex-col gap-5 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary/20" />
                                <span className="h-4 w-24 rounded bg-primary/10" />
                            </div>

                            <div className="space-y-3">
                                <div className="h-9 w-[min(100%,_520px)] rounded bg-black/5 sm:h-11 lg:h-12" />
                                <div className="h-9 w-[min(100%,_430px)] rounded bg-primary/10 sm:h-11 lg:h-12" />
                            </div>
                        </div>

                        <div className="flex max-w-xs items-start gap-3 border-l border-primary/10 pl-4">
                            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10" />

                            <div className="w-full space-y-2">
                                <div className="h-3 w-full rounded bg-black/5" />
                                <div className="h-3 w-[85%] rounded bg-black/5" />
                                <div className="h-3 w-[65%] rounded bg-black/5" />
                            </div>
                        </div>
                    </div>

                    {/* Campaign header */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <span className="h-4 w-24 rounded bg-primary/10" />
                            <span className="h-3 w-28 rounded bg-black/5" />
                        </div>

                        <span className="h-3 w-24 rounded bg-black/5" />
                    </div>

                    {/* Campaign image */}
                    <div
                        className="
                            aspect-[4/3]
                            overflow-hidden
                            bg-[#e5ece8]
                            sm:aspect-[16/9]
                            lg:aspect-[2.05/1]
                        "
                    >
                        <div className="flex h-full w-full items-center justify-center">
                            <TbHeartHandshake
                                size={72}
                                strokeWidth={1}
                                className="text-primary/10"
                            />
                        </div>
                    </div>

                    {/* Campaign details */}
                    <div className="grid gap-10 border-b border-border py-8 sm:py-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:py-12">
                        {/* Story skeleton */}
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-7 bg-primary/20" />
                                <span className="h-3 w-24 rounded bg-primary/10" />
                            </div>

                            <div className="max-w-2xl space-y-3">
                                <div className="h-4 w-full rounded bg-black/5" />
                                <div className="h-4 w-[95%] rounded bg-black/5" />
                                <div className="h-4 w-[80%] rounded bg-black/5" />
                            </div>

                            <div className="mt-7 h-4 w-36 rounded bg-black/5" />
                        </div>

                        {/* Funding skeleton */}
                        <div className="lg:border-l lg:border-border lg:pl-10">
                            <div className="h-4 w-32 rounded bg-black/5" />

                            <div className="mt-4 flex items-baseline gap-3">
                                <div className="h-12 w-44 rounded bg-black/5 sm:h-14" />
                                <div className="h-4 w-20 rounded bg-primary/10" />
                            </div>

                            <div className="mt-6 h-2 w-full overflow-hidden bg-[#dfe9e5]">
                                <div className="h-full w-[42%] bg-primary/15" />
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                                <span className="h-3 w-24 rounded bg-black/5" />
                                <span className="h-3 w-20 rounded bg-black/5" />
                            </div>

                            <div className="mt-7 grid grid-cols-2 border-t border-border pt-5">
                                <div className="flex items-center gap-3">
                                    <span className="h-5 w-5 rounded bg-primary/10" />

                                    <div className="space-y-2">
                                        <div className="h-3 w-16 rounded bg-black/5" />
                                        <div className="h-4 w-12 rounded bg-black/5" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-l border-border pl-4">
                                    <span className="h-5 w-5 rounded bg-primary/10" />

                                    <div className="space-y-2">
                                        <div className="h-3 w-16 rounded bg-black/5" />
                                        <div className="h-4 w-12 rounded bg-black/5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer skeleton */}
                    <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 h-5 w-5 shrink-0 rounded bg-primary/10" />

                            <div className="space-y-2">
                                <div className="h-4 w-64 rounded bg-black/5" />
                                <div className="h-3 w-80 max-w-full rounded bg-black/5" />
                            </div>
                        </div>

                        <div className="h-12 w-full rounded bg-primary/10 sm:w-[230px]" />
                    </div>
                </div>
            </div>
        </section>
    );
};

/* =========================================================
   FEATURED CAMPAIGN
========================================================= */

const FeaturedCampaign = () => {
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                setLoading(true);

                const featuredCampaign = await fetchFeaturedCampaign();

                setCampaign(featuredCampaign);
            } catch (error) {
                console.error('Failed to load featured campaign:', error);

                setCampaign(null);
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, []);

    /* =====================================================
       LOADING
    ====================================================== */

    if (loading) {
        return <FeaturedCampaignSkeleton />;
    }

    /* =====================================================
       NO ACTIVE CAMPAIGN
    ====================================================== */

    if (!campaign) {
        return null;
    }

    /* =====================================================
       CAMPAIGN DATA
    ====================================================== */

    const campaignImage = campaign.cover_image || campaign.image || null;

    const progress = Math.min(Math.max(Number(campaign.progress) || 0, 0), 100);

    const isUrgent =
        campaign.urgency === 'urgent' || campaign.urgency === 'critical';

    const hasTarget =
        campaign.targetAmount !== undefined && campaign.targetAmount !== null;

    const hasSupporters =
        campaign.supporters !== undefined && campaign.supporters !== null;

    const hasDaysLeft =
        campaign.daysLeft !== undefined && campaign.daysLeft !== null;

    return (
        <section className="section-gap overflow-hidden bg-[#f6f8f7]">
            <div className="container-width">
                <Motion variant="fadeUp" transition={{ duration: 0.7 }}>
                    {/* =================================================
                        SECTION HEADING
                    ================================================== */}

                    <div className="mb-10 flex flex-col gap-5 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-4 flex items-center gap-3">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        isUrgent ? 'bg-red-500' : 'bg-primary'
                                    }`}
                                />

                                <p className="font-bengali text-sm font-semibold text-primary">
                                    নির্বাচিত উদ্যোগ
                                </p>
                            </div>

                            <h2 className="font-bengali text-[2rem]! font-semibold! leading-[1.45]! text-text-primary! sm:text-[2.6rem]! lg:text-[3rem]!">
                                একটি উদ্যোগ,
                                <span className="block text-primary">
                                    {' '}
                                    অনেক মানুষের আশার গল্প।
                                </span>
                            </h2>
                        </div>

                        <div className="flex max-w-xs items-start gap-3 border-l border-primary/20 pl-4">
                            <TbShieldCheck
                                size={19}
                                className="mt-0.5 shrink-0 text-primary"
                            />

                            <p className="font-bengali text-xs leading-6 text-text-secondary">
                                যাচাইকৃত তথ্যের ভিত্তিতে নির্বাচিত একটি সক্রিয়
                                মানবিক উদ্যোগ।
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        CAMPAIGN EDITORIAL
                    ================================================== */}

                    <article>
                        {/* CAMPAIGN HEADER */}

                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                {campaign.category && (
                                    <span className="font-bengali text-sm font-semibold text-primary">
                                        {campaign.category}
                                    </span>
                                )}

                                {campaign.location && (
                                    <span className="flex items-center gap-1.5 font-bengali text-xs text-text-secondary">
                                        <TbMapPin size={15} />
                                        {campaign.location}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                                <span className="font-bengali text-xs font-medium! text-text-secondary">
                                    সক্রিয় উদ্যোগ
                                </span>
                            </div>
                        </div>

                        {/* =================================================
                            PHOTOGRAPH
                        ================================================== */}

                        <Link
                            to={`/campaign/${campaign.id}`}
                            aria-label={`${campaign.title} - বিস্তারিত দেখুন`}
                            className="
                                group
                                relative
                                block
                                aspect-[4/3]
                                overflow-hidden
                                bg-[#e5ece8]
                                sm:aspect-[16/9]
                                lg:aspect-[2.05/1]
                            "
                        >
                            {campaignImage ? (
                                <img
                                    src={campaignImage}
                                    alt={campaign.title}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition-transform
                                        duration-700
                                        ease-out
                                        group-hover:scale-[1.02]
                                    "
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <TbHeartHandshake
                                        size={80}
                                        strokeWidth={1}
                                        className="text-primary/20"
                                    />
                                </div>
                            )}

                            {/* Image overlay */}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                            {/* Image label */}

                            <div className="absolute left-4 top-4 flex items-center gap-2 bg-white/95 px-4 py-2.5 sm:left-6 sm:top-6">
                                <TbHeartHandshake
                                    size={17}
                                    className="text-primary"
                                />

                                <span className="font-bengali text-xs font-semibold text-text-primary">
                                    মানুষের পাশে সরাসরি সহায়তা
                                </span>
                            </div>

                            {/* Image bottom caption */}

                            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-8 lg:p-10">
                                <div className="max-w-2xl">
                                    <p className="mb-2 font-bengali text-xs font-medium! text-white/75">
                                        এই উদ্যোগের গল্প
                                    </p>

                                    <h3 className="font-bengali text-xl font-semibold leading-relaxed text-white sm:text-2xl lg:text-3xl">
                                        {campaign.title}
                                    </h3>
                                </div>

                                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 text-white transition-colors group-hover:bg-white group-hover:text-primary sm:flex">
                                    <TbArrowUpRight size={22} />
                                </span>
                            </div>
                        </Link>

                        {/* =================================================
                            CAMPAIGN DETAILS
                        ================================================== */}

                        <div className="grid gap-10 border-b border-border py-8 sm:py-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:py-12">
                            {/* Story */}

                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-px w-7 bg-primary" />

                                    <p className="font-bengali text-xs font-semibold text-primary">
                                        উদ্যোগ সম্পর্কে
                                    </p>
                                </div>

                                {campaign.shortDescription && (
                                    <p className="max-w-2xl font-bengali text-[15px] leading-[2] text-text-secondary sm:text-base">
                                        {campaign.shortDescription}
                                    </p>
                                )}

                                <Link
                                    to={`/campaign/${campaign.id}`}
                                    className="group mt-6 inline-flex items-center gap-2 font-bengali text-sm font-semibold text-text-primary transition-colors hover:text-primary"
                                >
                                    <span className="border-b border-black/20 pb-1 transition-colors group-hover:border-primary">
                                        উদ্যোগের গল্প ও বিস্তারিত
                                    </span>

                                    <TbArrowUpRight
                                        size={17}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </div>

                            {/* Funding */}

                            <div className="lg:border-l lg:border-border lg:pl-10">
                                <p className="font-bengali text-sm text-text-secondary">
                                    এখন পর্যন্ত সংগ্রহ হয়েছে
                                </p>

                                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                    <p className="font-bengali text-[2.8rem] font-semibold leading-none tracking-tight text-text-primary sm:text-[3.4rem]">
                                        ৳{formatBanglaAmount(campaign.raised)}
                                    </p>

                                    <span className="font-bengali text-sm font-semibold text-primary">
                                        {toBanglaNumber(progress)}% পূরণ
                                    </span>
                                </div>

                                {/* Progress */}

                                <div
                                    className="mt-6 h-2 w-full overflow-hidden bg-[#dfe9e5]"
                                    role="progressbar"
                                    aria-label="অর্থ সংগ্রহের অগ্রগতি"
                                    aria-valuenow={progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className="h-full bg-primary transition-[width] duration-700 ease-out"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>

                                {hasTarget && (
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <span className="font-bengali text-xs text-text-secondary">
                                            সংগ্রহের অগ্রগতি
                                        </span>

                                        <span className="font-bengali text-xs font-medium! text-text-primary">
                                            লক্ষ্য ৳
                                            {formatBanglaAmount(
                                                campaign.targetAmount,
                                            )}
                                        </span>
                                    </div>
                                )}

                                {/* Campaign metrics */}

                                {(hasSupporters || hasDaysLeft) && (
                                    <div className="mt-7 grid grid-cols-2 border-t border-border pt-5">
                                        {hasSupporters && (
                                            <div
                                                className={
                                                    hasDaysLeft
                                                        ? 'border-r border-border pr-4'
                                                        : ''
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                    <TbUsers
                                                        size={20}
                                                        className="shrink-0 text-primary"
                                                    />

                                                    <div>
                                                        <p className="font-bengali text-xs text-text-secondary">
                                                            সহায়তায় যুক্ত
                                                        </p>

                                                        <p className="mt-1 font-bengali text-base font-semibold text-text-primary">
                                                            {toBanglaNumber(
                                                                campaign.supporters,
                                                            )}{' '}
                                                            জন
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {hasDaysLeft && (
                                            <div
                                                className={
                                                    hasSupporters ? 'pl-4' : ''
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                    <TbCalendar
                                                        size={19}
                                                        className="shrink-0 text-primary"
                                                    />

                                                    <div>
                                                        <p className="font-bengali text-xs text-text-secondary">
                                                            সময় বাকি
                                                        </p>

                                                        <p className="mt-1 font-bengali text-base font-semibold text-text-primary">
                                                            {toBanglaNumber(
                                                                campaign.daysLeft,
                                                            )}{' '}
                                                            দিন
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* =================================================
                            CONTRIBUTION FOOTER
                        ================================================== */}

                        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-8">
                            <div className="flex items-start gap-3">
                                <TbShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-primary"
                                />

                                <div>
                                    <p className="font-bengali text-sm font-semibold text-text-primary">
                                        আপনার সহায়তা পৌঁছে যাক প্রয়োজনের কাছে
                                    </p>

                                    <p className="mt-1 font-bengali text-xs leading-6 text-text-secondary">
                                        যাচাইকৃত উদ্যোগ · নিয়মিত হালনাগাদ ·
                                        স্বচ্ছ সহায়তা ট্র্যাকিং
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:w-auto sm:min-w-[230px]">
                                <Link
                                    to={`/donate/${campaign.id}`}
                                    className="block"
                                >
                                    <Button
                                        className="
                                            w-full
                                            justify-center
                                            gap-2
                                            py-3.5
                                            font-bengali
                                            text-sm
                                        "
                                    >
                                        <TbHeartFilled size={17} />
                                        এই উদ্যোগে সহায়তা করুন
                                    </Button>
                                </Link>

                                <Link
                                    to={`/campaign/${campaign.id}`}
                                    className="inline-flex items-center justify-center gap-2 font-bengali text-xs font-medium! text-text-secondary transition-colors hover:text-primary"
                                >
                                    আরও জানুন
                                    <TbArrowUpRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </article>
                </Motion>
            </div>
        </section>
    );
};

export default FeaturedCampaign;
