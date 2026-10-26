import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { ArrowRight } from 'lucide-react';

import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';

import FeaturedCampaignCard from '../sections/FeaturedCampaignCard';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;
const MAX_FEATURED_COUNT = 12;

const FeaturedCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadFeaturedCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();

                const featured = [...data]
                    .filter(
                        (campaign) =>
                            campaign?.status === 'active' &&
                            (campaign?.is_featured === true ||
                                campaign?.is_featured === 1 ||
                                campaign?.is_featured === '1'),
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.created_at || 0) -
                            new Date(a.created_at || 0),
                    );

                if (isMounted) {
                    setCampaigns(featured);
                }
            } catch (error) {
                console.error('Failed to load featured campaigns:', error);

                if (isMounted) {
                    setCampaigns([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadFeaturedCampaigns();

        return () => {
            isMounted = false;
        };
    }, []);

    const visibleCampaigns = campaigns.slice(
        0,
        Math.min(visibleCount, MAX_FEATURED_COUNT),
    );

    const hasMore =
        visibleCount < MAX_FEATURED_COUNT && visibleCount < campaigns.length;

    const handleLoadMore = () => {
        setVisibleCount((current) =>
            Math.min(current + LOAD_MORE_COUNT, MAX_FEATURED_COUNT),
        );
    };

    return (
        <main className="min-h-screen bg-page">
            {/* Hero */}
            <section className="relative overflow-hidden pt-28 pb-14 lg:pt-32 lg:pb-16 xl:pt-36">
                <div className="container-width">
                    <div className="max-w-4xl">
                        <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                            নির্বাচিত ক্যাম্পেইন
                        </p>

                        <h1 className="max-w-4xl font-bengali text-[2.45rem] font-semibold leading-[1.15] tracking-[-0.035em] text-text-primary sm:text-[2.8rem] lg:text-[3.2rem] lg:leading-[1.14] xl:text-[3.5rem]">
                            মানুষের পাশে দাঁড়ানোর
                            <br />
                            চলমান উদ্যোগগুলো
                        </h1>

                        <p className="mt-5 max-w-2xl font-sans text-[15px] leading-7 text-text-secondary lg:text-base lg:leading-7">
                            আমাদের নির্বাচিত মানবিক উদ্যোগগুলো দেখুন এবং আপনার
                            পছন্দের ক্যাম্পেইনে সহায়তা করুন।
                        </p>
                    </div>
                </div>
            </section>

            {/* Campaigns */}
            <section className="pb-20 lg:pb-24 xl:pb-28">
                <div className="container-width">
                    {loading ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="aspect-[4/5] animate-pulse rounded-xl bg-white/70 sm:aspect-[5/6]"
                                />
                            ))}
                        </div>
                    ) : campaigns.length > 0 ? (
                        <>
                            <div className="mb-8 flex items-end justify-between gap-6">
                                <div>
                                    <p className="font-sans text-sm font-medium! text-text-secondary">
                                        সাম্প্রতিক নির্বাচিত উদ্যোগ
                                    </p>

                                    <h2 className="mt-1 font-bengali text-2xl font-semibold tracking-[-0.02em] text-text-primary lg:text-[2rem]">
                                        চলমান ক্যাম্পেইন
                                    </h2>
                                </div>

                                <Link
                                    to="/campaigns"
                                    className="hidden shrink-0 items-center gap-2 font-sans text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:flex"
                                >
                                    সব ক্যাম্পেইন
                                    <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                                {visibleCampaigns.map((campaign, index) => (
                                    <FeaturedCampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMore && (
                                <div className="mt-10 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleLoadMore}
                                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3 font-sans text-sm font-semibold text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white!"
                                    >
                                        আরও ক্যাম্পেইন দেখুন
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-[28px] border border-black/5 bg-white px-6 py-16 text-center">
                            <h2 className="font-bengali text-2xl font-semibold text-text-primary">
                                এই মুহূর্তে কোনো সক্রিয় ক্যাম্পেইন নেই
                            </h2>

                            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-text-secondary">
                                নতুন ক্যাম্পেইন শুরু হলে এখানে দেখা যাবে।
                            </p>

                            <Link
                                to="/campaigns"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-sans text-sm font-semibold text-white!"
                            >
                                ক্যাম্পেইন দেখুন
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default FeaturedCampaigns;
