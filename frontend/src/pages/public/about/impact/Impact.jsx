import React, { useEffect, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';
import {
    TbArrowRight,
    TbArrowUpRight,
    TbHeartHandshake,
    TbMapPin,
} from 'react-icons/tb';

import {
    fetchPublicCampaigns,
    fetchPublicCategories,
} from '@/api/publicCampaignsApi';

/* =========================================================
   TEMPORARY IMAGES
========================================================= */

const fallbackImages = [
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85',
];

const humanImages = {
    hero: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=90',

    need: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1200&q=85',

    participation:
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85',
};

/* =========================================================
   HELPERS
========================================================= */

const getCampaignCategory = (campaign) =>
    campaign?.category?.name ||
    campaign?.category_name ||
    campaign?.category?.title ||
    null;

const getCampaignCategorySlug = (campaign) =>
    campaign?.category?.slug || campaign?.category_slug || null;

const getCampaignTitle = (campaign) =>
    campaign?.title || campaign?.name || 'মানুষের পাশে একটি উদ্যোগ';

const getCampaignLocation = (campaign) =>
    campaign?.location ||
    campaign?.district ||
    campaign?.area ||
    campaign?.address ||
    null;

const getCampaignImage = (campaign, index = 0) =>
    campaign?.cover_image ||
    campaign?.image ||
    campaign?.thumbnail ||
    campaign?.featured_image ||
    fallbackImages[index % fallbackImages.length];

const pageWidth =
    'mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20';

/* =========================================================
   IMPACT PAGE
========================================================= */

const Impact = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const loadImpactData = async () => {
            setLoading(true);
            setError('');

            try {
                const [campaignData, categoryData] = await Promise.all([
                    fetchPublicCampaigns(),
                    fetchPublicCategories(),
                ]);

                if (!mounted) return;

                setCampaigns(Array.isArray(campaignData) ? campaignData : []);

                setCategories(Array.isArray(categoryData) ? categoryData : []);
            } catch {
                if (!mounted) return;

                setError(
                    'বর্তমান কার্যক্রমের তথ্য এই মুহূর্তে দেখানো যাচ্ছে না।',
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadImpactData();

        return () => {
            mounted = false;
        };
    }, []);

    const representedCategories = useMemo(() => {
        const slugs = new Set(
            campaigns.map(getCampaignCategorySlug).filter(Boolean),
        );

        if (!slugs.size) return [];

        return categories.filter((category) => slugs.has(category?.slug));
    }, [campaigns, categories]);

    const visibleCampaigns = useMemo(() => campaigns.slice(0, 3), [campaigns]);

    return (
        <main
            lang="bn"
            className="overflow-hidden bg-[#f7f6f1] text-text-primary"
        >
            {/* =====================================================
                01 — HERO
            ====================================================== */}

            <section className="bg-[#f7f6f1]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            items-center
                            gap-12
                            py-16

                            sm:py-20

                            lg:min-h-[680px]
                            lg:grid-cols-[0.92fr_1.08fr]
                            lg:gap-16
                            lg:py-24

                            xl:gap-24 mt-20
                        "
                    >
                        {/* COPY */}

                        <div className="max-w-[650px]">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-accent" />

                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-primary
                                    "
                                >
                                    Stand For People / Impact
                                </span>
                            </div>

                            <h1
                                className="
                                    mt-7
                                    max-w-[630px]
                                    font-bengali
                                    text-[2.65rem]
                                    font-medium
                                    leading-[1.28]
                                    text-text-primary

                                    sm:text-[3.25rem]

                                    lg:text-[3.65rem]

                                    xl:text-[4rem]
                                "
                            >
                                একটি প্রয়োজন
                                <span className="block">দৃশ্যমান হলে,</span>
                                <span className="block text-primary">
                                    পরিবর্তনের পথ খুলে যায়।
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-7
                                    max-w-[560px]
                                    font-bengali
                                    text-[1rem]
                                    leading-[1.9]
                                    text-text-secondary

                                    lg:text-[1.04rem]
                                "
                            >
                                Stand For People মানুষের বাস্তব প্রয়োজনকে
                                দৃশ্যমান করে এবং যারা পাশে দাঁড়াতে চান তাদের
                                সঙ্গে সেই প্রয়োজনের সংযোগ তৈরি করে।
                            </p>

                            <Link
                                to="/campaigns"
                                className="
                                    group
                                    mt-9
                                    inline-flex
                                    items-center
                                    gap-4
                                    font-bengali
                                    text-[0.96rem]
                                    font-medium
                                    text-primary
                                "
                            >
                                এখন কোথায় সাহায্য প্রয়োজন
                                <span
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-primary/25
                                        transition-all

                                        group-hover:border-primary
                                        group-hover:bg-primary
                                        group-hover:text-white!
                                    "
                                >
                                    <TbArrowRight size={18} />
                                </span>
                            </Link>
                        </div>

                        {/* IMAGE */}

                        <div
                            className="
                                relative
                                ml-auto
                                w-full
                                max-w-[650px]
                            "
                        >
                            <div
                                className="
                                    relative
                                    aspect-[4/3]
                                    overflow-hidden

                                    sm:aspect-[16/11]

                                    lg:aspect-[5/4]
                                "
                            >
                                <img
                                    src={humanImages.hero}
                                    alt="মানবিক উদ্যোগে মানুষের অংশগ্রহণ"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* one quiet evidence marker only */}

                            <div
                                className="
                                    absolute
                                    -bottom-6
                                    left-5
                                    bg-primary-deep
                                    px-5
                                    py-4
                                    text-white!

                                    sm:left-8
                                    sm:px-6
                                "
                            >
                                <div className="flex items-end gap-3">
                                    <span
                                        className="
                                            font-display
                                            text-[2.35rem]
                                            leading-none
                                        "
                                    >
                                        {loading ? '—' : campaigns.length}
                                    </span>

                                    <span
                                        className="
                                            pb-0.5
                                            font-bengali
                                            text-[0.86rem]
                                            text-white!/70
                                        "
                                    >
                                        চলমান উদ্যোগ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                02 — JOURNEY
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-28">
                        {/* INTRO */}

                        <div
                            className="
                                grid
                                gap-7
                                border-b
                                border-border
                                pb-12

                                lg:grid-cols-[0.65fr_1.35fr]
                                lg:items-end
                                lg:pb-16
                            "
                        >
                            <div>
                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-primary
                                    "
                                >
                                    পরিবর্তনের পথ
                                </span>
                            </div>

                            <div className="max-w-[720px]">
                                <h2
                                    className="
                                        font-bengali
                                        text-[2rem]
                                        font-medium
                                        leading-[1.45]
                                        text-text-primary

                                        sm:text-[2.4rem]

                                        lg:text-[2.65rem]
                                    "
                                >
                                    প্রয়োজন দেখা থেকে মানুষের পাশে দাঁড়ানো—
                                    <span className="text-primary">
                                        {' '}
                                        এই পথটাই আমাদের কাজ।
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {/* NEED */}

                        <div
                            className="
                                grid
                                gap-10
                                py-16

                                lg:grid-cols-[0.82fr_1.18fr]
                                lg:items-center
                                lg:gap-20
                                lg:py-24

                                xl:gap-28
                            "
                        >
                            <div className="max-w-[500px]">
                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-primary
                                    "
                                >
                                    01 / প্রয়োজন
                                </span>

                                <h3
                                    className="
                                        mt-5
                                        font-bengali
                                        text-[1.85rem]
                                        font-medium
                                        leading-[1.5]

                                        sm:text-[2.15rem]

                                        lg:text-[2.35rem]
                                    "
                                >
                                    সব পরিবর্তনের শুরু
                                    <span className="block">
                                        একটি বাস্তব প্রয়োজন থেকে।
                                    </span>
                                </h3>

                                <p
                                    className="
                                        mt-6
                                        font-bengali
                                        text-[0.98rem]
                                        leading-[1.9]
                                        text-text-secondary
                                    "
                                >
                                    চিকিৎসা, শিক্ষা, খাদ্য কিংবা আশ্রয়—
                                    প্রয়োজনটি যখন দৃশ্যমান হয়, তখনই মানুষের পাশে
                                    দাঁড়ানোর পথ তৈরি হতে শুরু করে।
                                </p>
                            </div>

                            <div className="relative">
                                <div className="aspect-[16/9] overflow-hidden">
                                    <img
                                        src={humanImages.need}
                                        alt="মানুষের বাস্তব প্রয়োজন"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CONNECTION */}

                        <div
                            className="
                                grid
                                gap-10
                                border-t
                                border-border
                                pt-16

                                lg:grid-cols-[1.05fr_0.95fr]
                                lg:items-center
                                lg:gap-20
                                lg:pt-24

                                xl:gap-28
                            "
                        >
                            {/* NUMBERS */}

                            <div
                                className="
                                    order-2
                                    grid
                                    grid-cols-2
                                    border-y
                                    border-border

                                    lg:order-1
                                "
                            >
                                <div className="py-8 pr-7 sm:py-10 sm:pr-10">
                                    <span
                                        className="
                                            font-display
                                            text-[3.2rem]
                                            leading-none
                                            text-primary

                                            sm:text-[3.75rem]
                                        "
                                    >
                                        {loading ? '—' : campaigns.length}
                                    </span>

                                    <p
                                        className="
                                            mt-4
                                            font-bengali
                                            text-[0.95rem]
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        সক্রিয় কার্যক্রম
                                    </p>
                                </div>

                                <div
                                    className="
                                        border-l
                                        border-border
                                        py-8
                                        pl-7

                                        sm:py-10
                                        sm:pl-10
                                    "
                                >
                                    <span
                                        className="
                                            font-display
                                            text-[3.2rem]
                                            leading-none
                                            text-primary

                                            sm:text-[3.75rem]
                                        "
                                    >
                                        {loading
                                            ? '—'
                                            : representedCategories.length}
                                    </span>

                                    <p
                                        className="
                                            mt-4
                                            font-bengali
                                            text-[0.95rem]
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        সহায়তার ক্ষেত্র
                                    </p>
                                </div>
                            </div>

                            {/* COPY */}

                            <div className="order-1 max-w-[500px] lg:order-2">
                                <span
                                    className="
                                        font-nav
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-primary
                                    "
                                >
                                    02 / সংযোগ
                                </span>

                                <h3
                                    className="
                                        mt-5
                                        font-bengali
                                        text-[1.85rem]
                                        font-medium
                                        leading-[1.5]

                                        sm:text-[2.15rem]

                                        lg:text-[2.35rem]
                                    "
                                >
                                    প্রয়োজনকে
                                    <span className="text-primary">
                                        {' '}
                                        সঠিক মানুষের কাছে
                                    </span>{' '}
                                    পৌঁছে দেওয়া।
                                </h3>

                                <p
                                    className="
                                        mt-6
                                        font-bengali
                                        text-[0.98rem]
                                        leading-[1.9]
                                        text-text-secondary
                                    "
                                >
                                    উদ্যোগ, স্বেচ্ছাসেবক, প্রতিষ্ঠান এবং সহায়তা
                                    করতে আগ্রহী মানুষকে একই জায়গায় এনে SP একটি
                                    সহজ সংযোগ তৈরি করে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                03 — ACTIVE IMPACT
            ====================================================== */}

            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#f6f3ec]
                    py-20

                    sm:py-24

                    lg:py-28
                "
            >
                <div className={pageWidth}>
                    {/* INTRO */}

                    <div
                        className="
                            grid
                            gap-7

                            lg:grid-cols-[0.55fr_1.45fr]
                            lg:items-end
                            lg:gap-16
                        "
                    >
                        <div>
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    font-nav
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-[0.18em]
                                    text-secondary
                                "
                            >
                                <span className="h-px w-8 bg-primary" />
                                <span>03 / এখন</span>
                            </div>

                            <p
                                className="
                                    mt-6
                                    max-w-[300px]
                                    font-bengali
                                    text-[0.92rem]
                                    leading-[1.8]
                                    text-secondary
                                "
                            >
                                মানুষের প্রয়োজন থেমে থাকে না। তাই সহায়তার কাজও
                                চলতে থাকে।
                            </p>
                        </div>

                        <div className="max-w-[760px]">
                            <h2
                                className="
                                    font-bengali
                                    text-[2.25rem]
                                    font-medium
                                    leading-[1.35]
                                    text-primary

                                    sm:text-[2.8rem]

                                    lg:text-[3.25rem]

                                    xl:text-[3.6rem]
                                "
                            >
                                প্রভাব কোনো ভবিষ্যতের গল্প নয়।
                                <span
                                    className="
                                        mt-1
                                        block
                                        text-[#7d8985]
                                    "
                                >
                                    এটি এখনই কোথাও ঘটছে।
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* CAMPAIGNS */}

                    <div
                        className="
                            mt-14
                            border-t
                            border-[#d8d5cd]

                            lg:mt-18
                        "
                    >
                        {visibleCampaigns.length > 0 ? (
                            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
                                {/* FEATURED */}

                                {visibleCampaigns[0] && (
                                    <Link
                                        to={`/campaigns/${visibleCampaigns[0]?.id}`}
                                        className="
                                            group
                                            relative
                                            block
                                            border-b
                                            border-[#d8d5cd]

                                            lg:border-b-0
                                            lg:border-r
                                            lg:pr-10
                                        "
                                    >
                                        <div
                                            className="
                                                relative
                                                aspect-[16/10]
                                                overflow-hidden

                                                sm:aspect-[16/9]

                                                lg:aspect-[1.35/0.82]
                                            "
                                        >
                                            <img
                                                src={getCampaignImage(
                                                    visibleCampaigns[0],
                                                )}
                                                alt={getCampaignTitle(
                                                    visibleCampaigns[0],
                                                )}
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-transform
                                                    duration-700
                                                    ease-out

                                                    group-hover:scale-[1.025]
                                                "
                                            />

                                            <div
                                                className="
                                                    absolute
                                                    inset-x-0
                                                    bottom-0
                                                    bg-gradient-to-t
                                                    from-black/65
                                                    via-black/15
                                                    to-transparent
                                                    p-5

                                                    sm:p-7
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        gap-x-5
                                                        gap-y-2
                                                        font-bengali
                                                        text-xs
                                                        text-white/85
                                                    "
                                                >
                                                    {getCampaignCategory(
                                                        visibleCampaigns[0],
                                                    ) && (
                                                        <span>
                                                            {getCampaignCategory(
                                                                visibleCampaigns[0],
                                                            )}
                                                        </span>
                                                    )}

                                                    {getCampaignLocation(
                                                        visibleCampaigns[0],
                                                    ) && (
                                                        <>
                                                            <span className="h-1 w-1 rounded-full bg-white/60" />

                                                            <span className="flex items-center gap-1.5">
                                                                <TbMapPin
                                                                    size={14}
                                                                />

                                                                {getCampaignLocation(
                                                                    visibleCampaigns[0],
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-6
                                                py-7

                                                sm:py-8
                                            "
                                        >
                                            <div className="max-w-[680px]">
                                                <span
                                                    className="
                                                        font-nav
                                                        text-[10px]
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.18em]
                                                        text-secondary
                                                    "
                                                >
                                                    এখনকার একটি উদ্যোগ
                                                </span>

                                                <h3
                                                    className="
                                                        mt-3
                                                        font-bengali
                                                        text-[1.45rem]
                                                        font-medium
                                                        leading-[1.4]
                                                        text-primary

                                                        sm:text-[1.75rem]

                                                        lg:text-[1.9rem]
                                                    "
                                                >
                                                    {getCampaignTitle(
                                                        visibleCampaigns[0],
                                                    )}
                                                </h3>
                                            </div>

                                            <span
                                                className="
                                                    mt-1
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border
                                                    border-[#c9cbc5]
                                                    text-primary
                                                    transition-all

                                                    group-hover:border-primary
                                                    group-hover:bg-primary
                                                    group-hover:text-white
                                                "
                                            >
                                                <TbArrowUpRight size={19} />
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* SECONDARY */}

                                <div className="lg:pl-10">
                                    {visibleCampaigns
                                        .slice(1)
                                        .map((campaign, index) => (
                                            <Link
                                                key={campaign?.id ?? index}
                                                to={`/campaigns/${campaign?.id}`}
                                                className="
                                                    group
                                                    flex
                                                    gap-5
                                                    border-b
                                                    border-[#d8d5cd]
                                                    py-7

                                                    sm:gap-6
                                                    sm:py-8
                                                "
                                            >
                                                <div
                                                    className="
                                                        h-[105px]
                                                        w-[120px]
                                                        shrink-0
                                                        overflow-hidden

                                                        sm:h-[125px]
                                                        sm:w-[145px]
                                                    "
                                                >
                                                    <img
                                                        src={getCampaignImage(
                                                            campaign,
                                                            index + 1,
                                                        )}
                                                        alt={getCampaignTitle(
                                                            campaign,
                                                        )}
                                                        className="
                                                            h-full
                                                            w-full
                                                            object-cover
                                                            transition-transform
                                                            duration-500

                                                            group-hover:scale-[1.04]
                                                        "
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="
                                                            font-nav
                                                            text-[9px]
                                                            uppercase
                                                            tracking-[0.14em]
                                                            text-secondary
                                                        "
                                                    >
                                                        {getCampaignCategory(
                                                            campaign,
                                                        )}
                                                    </div>

                                                    <h3
                                                        className="
                                                            mt-3
                                                            line-clamp-3
                                                            font-bengali
                                                            text-[1.12rem]
                                                            font-medium
                                                            leading-[1.45]
                                                            text-primary

                                                            sm:text-[1.3rem]
                                                        "
                                                    >
                                                        {getCampaignTitle(
                                                            campaign,
                                                        )}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))}

                                    <Link
                                        to="/campaigns"
                                        className="
                                            group
                                            flex
                                            items-center
                                            justify-between
                                            py-7
                                        "
                                    >
                                        <span className="font-bengali text-sm font-medium text-primary">
                                            সব কার্যক্রম দেখুন
                                        </span>

                                        <TbArrowRight
                                            size={18}
                                            className="
                                                text-primary
                                                transition-transform

                                                group-hover:translate-x-1
                                            "
                                        />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <p className="font-bengali text-sm text-secondary">
                                    এই মুহূর্তে কোনো কার্যক্রম পাওয়া যায়নি।
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* =====================================================
                04 — HUMAN CONNECTION
            ====================================================== */}

            <section
                className="
                    bg-[#eaf1ee]
                    py-20

                    sm:py-24

                    lg:py-28
                "
            >
                <div className={pageWidth}>
                    <div
                        className="
                            border-t
                            border-[#cbd7d2]
                            pt-8

                            sm:pt-10
                        "
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="
                                    font-nav
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-[0.18em]
                                    text-secondary
                                "
                            >
                                04 / একসাথে
                            </span>

                            <span
                                className="
                                    hidden
                                    font-nav
                                    text-[10px]
                                    uppercase
                                    tracking-[0.16em]
                                    text-secondary

                                    sm:block
                                "
                            >
                                Stand For People
                            </span>
                        </div>

                        {/* STATEMENT */}

                        <div
                            className="
                                mt-12
                                grid
                                gap-12

                                lg:mt-16
                                lg:grid-cols-[1.25fr_0.75fr]
                                lg:items-end
                                lg:gap-20
                            "
                        >
                            <div className="max-w-[800px]">
                                <p
                                    className="
                                        mb-6
                                        font-bengali
                                        text-[0.9rem]
                                        font-medium
                                        text-primary
                                    "
                                >
                                    মানুষের জন্য
                                </p>

                                <h2
                                    className="
                                        font-bengali
                                        text-[2.35rem]
                                        font-medium
                                        leading-[1.35]
                                        text-primary

                                        sm:text-[2.9rem]

                                        lg:text-[3.4rem]

                                        xl:text-[3.75rem]
                                    "
                                >
                                    শেষ পর্যন্ত প্রভাব মানে
                                    <span
                                        className="
                                            mt-1
                                            block
                                            text-[#74817c]
                                        "
                                    >
                                        একটি মানুষের পাশে
                                    </span>
                                    <span className="block">আরেকটি মানুষ।</span>
                                </h2>

                                <p
                                    className="
                                        mt-7
                                        max-w-[560px]
                                        font-bengali
                                        text-[0.98rem]
                                        leading-[1.9]
                                        text-secondary
                                    "
                                >
                                    একটি প্রয়োজনের কথা জানা থেকে শুরু করে পাশে
                                    দাঁড়ানো পর্যন্ত— পরিবর্তন তৈরি হয় মানুষের
                                    অংশগ্রহণে।
                                </p>
                            </div>

                            {/* IMAGE */}

                            <div
                                className="
                                    ml-auto
                                    w-full
                                    max-w-[360px]

                                    lg:max-w-[330px]
                                "
                            >
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={humanImages.participation}
                                        alt="মানুষের পাশে মানুষের সহায়তা"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}

                        <div
                            className="
                                mt-14
                                grid
                                gap-8
                                border-t
                                border-[#cbd7d2]
                                pt-8

                                sm:mt-16

                                lg:grid-cols-[1fr_auto]
                                lg:items-end
                            "
                        >
                            <p
                                className="
                                    max-w-[500px]
                                    font-bengali
                                    text-[0.92rem]
                                    leading-[1.8]
                                    text-secondary
                                "
                            >
                                আপনিও প্রয়োজন জানিয়ে অথবা সরাসরি মানুষের পাশে
                                যুক্ত হয়ে এই পথের অংশ হতে পারেন।
                            </p>

                            <div
                                className="
                                    flex
                                    flex-col
                                    border-t
                                    border-[#bfcac5]

                                    lg:min-w-[350px]
                                "
                            >
                                <Link
                                    to="/help-requests/create"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-[#bfcac5]
                                        py-5
                                    "
                                >
                                    <span className="font-bengali text-[0.94rem] font-medium text-primary">
                                        সহায়তার প্রয়োজন জানাতে
                                    </span>

                                    <TbArrowUpRight
                                        size={19}
                                        className="
                                            text-primary
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>

                                <Link
                                    to="/volunteer"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        py-5
                                    "
                                >
                                    <span className="font-bengali text-[0.94rem] font-medium text-primary">
                                        স্বেচ্ছাসেবক হিসেবে যুক্ত হতে
                                    </span>

                                    <TbArrowUpRight
                                        size={19}
                                        className="
                                            text-primary
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Impact;
