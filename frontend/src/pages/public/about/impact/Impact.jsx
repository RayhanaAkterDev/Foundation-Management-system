import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowRight, TbArrowUpRight, TbMapPin } from 'react-icons/tb';
import {
    fetchPublicCampaigns,
    fetchPublicCategories,
} from '@/api/publicCampaignsApi';

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

const bengaliNumber = (value) =>
    String(value).replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const pageWidth = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10';
const sectionTitle =
    'font-bengali text-[clamp(1.75rem,2.6vw,2.5rem)] font-medium! leading-[1.48] tracking-[-0.012em]';

const bodyText =
    'font-bengali text-[0.94rem] leading-[1.9] text-text-secondary';

function Eyebrow({ children, line = false }) {
    return (
        <div className="flex items-center gap-3 text-[0.8rem] font-medium! text-primary">
            {line ? (
                <span className="h-px w-7 shrink-0 bg-primary" />
            ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            )}
            <span>{children}</span>
        </div>
    );
}

function Count({ value, loading }) {
    return (
        <span className="font-bengali text-[clamp(2rem,3vw,2.85rem)] font-medium! leading-none text-primary tabular-nums">
            {loading ? '—' : bengaliNumber(value)}
        </span>
    );
}

const Impact = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                if (mounted) setLoading(false);
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
            className="min-w-0 overflow-x-clip bg-[#f7f6f1] font-bengali text-text-primary"
        >
            {/* ০১ — সূচনা */}
            <section className="bg-[#f7f6f1]">
                <div className={pageWidth}>
                    <div className="grid items-center gap-9 pb-16 pt-12 sm:gap-11 sm:pb-20 sm:pt-16 lg:mt-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-20 xl:gap-16">
                        <div className="min-w-0 max-w-[590px]">
                            <Eyebrow>Stand For People / আমাদের প্রভাব</Eyebrow>
                            <h1 className="mt-5 max-w-[610px] text-[clamp(2rem,3.25vw,3.1rem)] font-medium! leading-[1.42] tracking-[-0.015em]">
                                একটি প্রয়োজন
                                <span className="block">দৃশ্যমান হলে,</span>
                                <span className="block text-primary">
                                    পরিবর্তনের পথ খুলে যায়।
                                </span>
                            </h1>
                            <p className={`mt-5 max-w-[530px] ${bodyText}`}>
                                Stand For People মানুষের বাস্তব প্রয়োজনকে
                                দৃশ্যমান করে এবং যাঁরা পাশে দাঁড়াতে চান, তাঁদের
                                সঙ্গে সেই প্রয়োজনের সংযোগ তৈরি করে।
                            </p>
                            <Link
                                to="/campaigns"
                                className="group mt-6 inline-flex min-h-11 items-center gap-3 text-[0.91rem] font-medium! text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                            >
                                এখন কোথায় সাহায্য প্রয়োজন
                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white!">
                                    <TbArrowRight size={18} />
                                </span>
                            </Link>
                        </div>
                        <div className="relative ml-auto w-full min-w-0 max-w-[610px] pb-4 sm:pb-5">
                            <div className="aspect-[4/3] overflow-hidden bg-[#dce5dd] sm:aspect-[16/11] lg:aspect-[5/4]">
                                <img
                                    src={humanImages.hero}
                                    alt="মানবিক উদ্যোগে মানুষের অংশগ্রহণ"
                                    fetchPriority="high"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 left-4 flex items-end gap-3 bg-primary-deep px-4 py-3 text-white! sm:left-7 sm:px-5 sm:py-4">
                                <span className="font-bengali text-[1.9rem] font-medium! leading-none tabular-nums sm:text-[2.2rem]">
                                    {loading
                                        ? '—'
                                        : bengaliNumber(campaigns.length)}
                                </span>
                                <span className="pb-0.5 text-[0.81rem] text-white/80">
                                    চলমান উদ্যোগ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ০২ — পরিবর্তনের পথ */}
            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-16 sm:py-20 lg:py-24">
                        <div className="grid gap-5 border-b border-border pb-8 sm:pb-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
                            <Eyebrow line>পরিবর্তনের পথ</Eyebrow>
                            <h2 className={`max-w-[710px] ${sectionTitle}`}>
                                প্রয়োজন দেখা থেকে মানুষের পাশে দাঁড়ানো—
                                <span className="text-primary">
                                    {' '}
                                    এই পথটাই আমাদের কাজ।
                                </span>
                            </h2>
                        </div>

                        <div className="grid items-center gap-8 py-12 sm:gap-10 sm:py-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-14 lg:py-16">
                            <div className="max-w-[460px]">
                                <Eyebrow line>০১ / প্রয়োজন</Eyebrow>
                                <h3 className="mt-4 text-[clamp(1.55rem,2.25vw,2.15rem)] font-medium! leading-[1.5]">
                                    সব পরিবর্তনের শুরু
                                    <span className="block">
                                        একটি বাস্তব প্রয়োজন থেকে।
                                    </span>
                                </h3>
                                <p className={`mt-4 ${bodyText}`}>
                                    চিকিৎসা, শিক্ষা, খাদ্য কিংবা আশ্রয়—প্রয়োজনটি
                                    যখন দৃশ্যমান হয়, তখনই মানুষের পাশে দাঁড়ানোর
                                    পথ তৈরি হতে শুরু করে।
                                </p>
                            </div>
                            <div className="aspect-[16/10] min-w-0 overflow-hidden bg-[#e4e9e2] sm:aspect-[16/9]">
                                <img
                                    src={humanImages.need}
                                    alt="মানুষের বাস্তব প্রয়োজন"
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="grid items-center gap-9 border-t border-border pt-12 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-16">
                            <div className="order-2 grid grid-cols-2 border-y border-border lg:order-1">
                                <div className="min-w-0 py-6 pr-3 sm:py-8 sm:pr-7">
                                    <Count
                                        loading={loading}
                                        value={campaigns.length}
                                    />
                                    <p className="mt-3 text-[0.88rem] font-medium! leading-[1.7]">
                                        সক্রিয় কার্যক্রম
                                    </p>
                                </div>
                                <div className="min-w-0 border-l border-border py-6 pl-4 sm:py-8 sm:pl-8">
                                    <Count
                                        loading={loading}
                                        value={representedCategories.length}
                                    />
                                    <p className="mt-3 text-[0.88rem] font-medium! leading-[1.7]">
                                        সহায়তার ক্ষেত্র
                                    </p>
                                </div>
                            </div>
                            <div className="order-1 max-w-[500px] lg:order-2">
                                <Eyebrow line>০২ / সংযোগ</Eyebrow>
                                <h3 className="mt-4 text-[clamp(1.55rem,2.25vw,2.15rem)] font-medium! leading-[1.5]">
                                    প্রয়োজনকে{' '}
                                    <span className="text-primary">
                                        সঠিক মানুষের কাছে
                                    </span>{' '}
                                    পৌঁছে দেওয়া।
                                </h3>
                                <p className={`mt-4 ${bodyText}`}>
                                    উদ্যোগ, স্বেচ্ছাসেবক, প্রতিষ্ঠান এবং সহায়তা
                                    করতে আগ্রহী মানুষকে একই জায়গায় এনে Stand For
                                    People একটি সহজ সংযোগ তৈরি করে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ০৩ — বর্তমান উদ্যোগ */}
            <section className="bg-[#f6f3ec] py-16 sm:py-20 lg:py-24">
                <div className={pageWidth}>
                    <div className="grid gap-5 lg:grid-cols-[0.55fr_1.45fr] lg:items-end lg:gap-12">
                        <div>
                            <Eyebrow line>০৩ / এখন</Eyebrow>
                            <p className="mt-4 max-w-[300px] text-[0.89rem] leading-[1.85] text-secondary">
                                মানুষের প্রয়োজন থেমে থাকে না। তাই সহায়তার কাজও
                                চলতে থাকে।
                            </p>
                        </div>
                        <h2 className="max-w-[740px] text-[clamp(1.85rem,2.85vw,2.75rem)] font-medium! leading-[1.45] text-primary">
                            প্রভাব কোনো ভবিষ্যতের গল্প নয়।
                            <span className="block text-[#7d8985]">
                                এটি এখনই কোথাও ঘটছে।
                            </span>
                        </h2>
                    </div>

                    <div className="mt-9 border-t border-[#d8d5cd] sm:mt-11">
                        {loading ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="grid gap-8 py-7 lg:grid-cols-[1.35fr_0.65fr]"
                            >
                                <div className="animate-pulse">
                                    <div className="aspect-[16/10] bg-[#e8e4db] sm:aspect-[16/9]" />
                                    <div className="mt-5 h-4 w-28 bg-[#e8e4db]" />
                                    <div className="mt-3 h-6 w-3/4 bg-[#e8e4db]" />
                                </div>
                                <div className="space-y-6">
                                    {[0, 1].map((item) => (
                                        <div
                                            key={item}
                                            className="flex animate-pulse gap-4 border-b border-[#d8d5cd] pb-6"
                                        >
                                            <div className="h-24 w-24 shrink-0 bg-[#e8e4db] sm:w-32" />
                                            <div className="min-w-0 flex-1 space-y-3 pt-2">
                                                <div className="h-3 w-20 bg-[#e8e4db]" />
                                                <div className="h-4 w-full bg-[#e8e4db]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <span className="sr-only">
                                    কার্যক্রমের তথ্য আনা হচ্ছে।
                                </span>
                            </div>
                        ) : visibleCampaigns.length > 0 ? (
                            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
                                {visibleCampaigns[0] && (
                                    <Link
                                        to={`/campaigns/${visibleCampaigns[0]?.id}`}
                                        className="group block min-w-0 border-b border-[#d8d5cd] lg:border-b-0 lg:border-r lg:pr-8"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-[#e5e5de] sm:aspect-[16/9] lg:aspect-[1.35/0.82]">
                                            <img
                                                src={getCampaignImage(
                                                    visibleCampaigns[0],
                                                )}
                                                alt={getCampaignTitle(
                                                    visibleCampaigns[0],
                                                )}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-4 sm:p-6">
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.79rem] leading-[1.7] text-white/90">
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
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <TbMapPin
                                                                size={14}
                                                            />
                                                            {getCampaignLocation(
                                                                visibleCampaigns[0],
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start justify-between gap-4 py-5 sm:py-6">
                                            <div className="min-w-0">
                                                <span className="text-[0.79rem] text-secondary">
                                                    এখনকার একটি উদ্যোগ
                                                </span>
                                                <h3 className="mt-2 break-words text-[clamp(1.2rem,1.8vw,1.65rem)] font-medium! leading-[1.5] text-primary">
                                                    {getCampaignTitle(
                                                        visibleCampaigns[0],
                                                    )}
                                                </h3>
                                            </div>
                                            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c9cbc5] text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white!">
                                                <TbArrowUpRight size={18} />
                                            </span>
                                        </div>
                                    </Link>
                                )}
                                <div className="min-w-0 lg:pl-8">
                                    {visibleCampaigns
                                        .slice(1)
                                        .map((campaign, index) => (
                                            <Link
                                                key={campaign?.id ?? index}
                                                to={`/campaigns/${campaign?.id}`}
                                                className="group flex min-w-0 gap-3 border-b border-[#d8d5cd] py-5 sm:gap-5 sm:py-6"
                                            >
                                                <div className="h-[88px] w-[95px] shrink-0 overflow-hidden bg-[#e5e5de] sm:h-[108px] sm:w-[125px]">
                                                    <img
                                                        src={getCampaignImage(
                                                            campaign,
                                                            index + 1,
                                                        )}
                                                        alt={getCampaignTitle(
                                                            campaign,
                                                        )}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    {getCampaignCategory(
                                                        campaign,
                                                    ) && (
                                                        <p className="break-words text-[0.77rem] leading-[1.6] text-secondary">
                                                            {getCampaignCategory(
                                                                campaign,
                                                            )}
                                                        </p>
                                                    )}
                                                    <h3 className="mt-2 line-clamp-3 break-words text-[1rem] font-medium! leading-[1.55] text-primary sm:text-[1.13rem]">
                                                        {getCampaignTitle(
                                                            campaign,
                                                        )}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))}
                                    <Link
                                        to="/campaigns"
                                        className="group flex min-h-12 items-center justify-between gap-4 py-5 text-[0.9rem] font-medium! text-primary"
                                    >
                                        সব কার্যক্রম দেখুন
                                        <TbArrowRight
                                            size={18}
                                            className="shrink-0 transition-transform group-hover:translate-x-1"
                                        />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="py-12 text-center text-[0.92rem] leading-[1.8] text-secondary"
                                role="status"
                            >
                                {error ||
                                    'এই মুহূর্তে কোনো কার্যক্রম পাওয়া যায়নি।'}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ০৪ — মানুষের অংশগ্রহণ */}
            <section className="bg-[#eaf1ee] py-16 sm:py-20 lg:py-24">
                <div className={pageWidth}>
                    <div className="border-t border-[#cbd7d2] pt-6 sm:pt-8">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Eyebrow line>০৪ / একসঙ্গে</Eyebrow>
                            <span className="text-[0.79rem] text-secondary">
                                Stand For People
                            </span>
                        </div>
                        <div className="mt-9 grid items-end gap-8 sm:mt-11 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
                            <div className="max-w-[760px]">
                                <p className="mb-4 text-[0.86rem] font-medium! text-primary">
                                    মানুষের জন্য
                                </p>
                                <h2 className="text-[clamp(1.9rem,3vw,2.85rem)] font-medium! leading-[1.45] text-primary">
                                    শেষ পর্যন্ত প্রভাব মানে
                                    <span className="block text-[#74817c]">
                                        একটি মানুষের পাশে
                                    </span>
                                    <span className="block">আরেকটি মানুষ।</span>
                                </h2>
                                <p className={`mt-5 max-w-[550px] ${bodyText}`}>
                                    একটি প্রয়োজনের কথা জানা থেকে শুরু করে পাশে
                                    দাঁড়ানো পর্যন্ত—পরিবর্তন তৈরি হয় মানুষের
                                    অংশগ্রহণে।
                                </p>
                            </div>
                            <div className="w-full max-w-[360px] lg:ml-auto lg:max-w-[320px]">
                                <div className="aspect-[5/4] overflow-hidden bg-[#dce5dd] sm:aspect-[4/3] lg:aspect-[4/5]">
                                    <img
                                        src={humanImages.participation}
                                        alt="মানুষের পাশে মানুষের সহায়তা"
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 grid gap-7 border-t border-[#cbd7d2] pt-7 sm:mt-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
                            <p className="max-w-[500px] text-[0.92rem] leading-[1.9] text-secondary">
                                আপনিও প্রয়োজন জানিয়ে অথবা সরাসরি মানুষের পাশে
                                দাঁড়িয়ে এই পথের অংশ হতে পারেন।
                            </p>
                            <div className="flex w-full min-w-0 flex-col border-t border-[#bfcac5] lg:w-[350px]">
                                <Link
                                    to="/request-help"
                                    className="group flex min-h-12 items-center justify-between gap-3 border-b border-[#bfcac5] py-4 text-[0.9rem] font-medium! text-primary"
                                >
                                    সহায়তার প্রয়োজন জানাতে
                                    <TbArrowUpRight
                                        size={19}
                                        className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Link>
                                <Link
                                    to="/volunteer"
                                    className="group flex min-h-12 items-center justify-between gap-3 py-4 text-[0.9rem] font-medium! text-primary"
                                >
                                    স্বেচ্ছাসেবক হিসেবে যুক্ত হতে
                                    <TbArrowUpRight
                                        size={19}
                                        className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
