import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { ArrowRight, Clock3 } from 'lucide-react';

import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';

import CampaignCard from '../sections/CampaignCard';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const getUrgencyScore = (campaign) => {
    const target = Number(campaign?.target_amount || 0);
    const collected = Number(campaign?.collected_amount || 0);

    const remaining = Math.max(target - collected, 0);

    const progress = target > 0 ? Math.min(collected / target, 1) : 0;

    // Open-ended campaigns are less urgent than
    // campaigns with a real deadline.
    if (!campaign?.end_date) {
        return 0;
    }

    const today = new Date();
    const endDate = new Date(campaign.end_date);

    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Higher score = more urgent.
    const deadlineScore =
        daysRemaining <= 0 ? 100 : Math.max(0, 60 - daysRemaining * 3);

    const fundingGapScore =
        target > 0 ? Math.min((remaining / target) * 40, 40) : 0;

    const progressPenalty = progress * 15;

    return deadlineScore + fundingGapScore - progressPenalty;
};

const UrgentCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadUrgentCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();

                const urgent = [...data]
                    .filter((campaign) => campaign?.status === 'active')
                    .sort((a, b) => {
                        const scoreDifference =
                            getUrgencyScore(b) - getUrgencyScore(a);

                        if (Math.abs(scoreDifference) > 0.01) {
                            return scoreDifference;
                        }

                        // If urgency is similar,
                        // newer campaign comes first.
                        return new Date(b.created_at) - new Date(a.created_at);
                    });

                if (isMounted) {
                    setCampaigns(urgent);
                }
            } catch (error) {
                console.error('Failed to load urgent campaigns:', error);

                if (isMounted) {
                    setCampaigns([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUrgentCampaigns();

        return () => {
            isMounted = false;
        };
    }, []);

    const visibleCampaigns = campaigns.slice(0, visibleCount);

    const hasMore = visibleCount < campaigns.length;

    const handleLoadMore = () => {
        setVisibleCount((current) =>
            Math.min(current + LOAD_MORE_COUNT, campaigns.length),
        );
    };

    return (
        <main className="min-h-screen bg-page">
            {/* Hero */}
            <section className="relative overflow-hidden pt-28 pb-14 lg:pt-32 lg:pb-16 xl:pt-36">
                <div className="container-width">
                    <div className="max-w-4xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                            <Clock3 size={14} />
                            Urgent Appeals
                        </div>

                        <h1 className="max-w-4xl font-bengali text-[2.45rem] font-semibold leading-[1.15] tracking-[-0.035em] text-text-primary sm:text-[2.8rem] lg:text-[3.2rem] lg:leading-[1.14] xl:text-[3.5rem]">
                            যেসব উদ্যোগে এখনই
                            <br />
                            সহায়তা প্রয়োজন
                        </h1>

                        <p className="mt-5 max-w-2xl font-sans text-[15px] leading-7 text-text-secondary lg:text-base lg:leading-7">
                            সময়সীমা ও প্রয়োজনের মাত্রা বিবেচনা করে বর্তমানে
                            সবচেয়ে জরুরি ক্যাম্পেইনগুলো এখানে দেখানো হচ্ছে।
                        </p>
                    </div>
                </div>
            </section>

            {/* Campaigns */}
            <section className="pb-20 lg:pb-24 xl:pb-28">
                <div className="container-width">
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-[420px] animate-pulse rounded-[28px] bg-white/70"
                                />
                            ))}
                        </div>
                    ) : campaigns.length > 0 ? (
                        <>
                            <div className="mb-8">
                                <p className="font-sans text-sm font-medium text-text-secondary">
                                    Active campaigns requiring attention
                                </p>

                                <h2 className="mt-1 font-bengali text-2xl font-semibold tracking-[-0.02em] text-text-primary lg:text-[2rem]">
                                    জরুরি ক্যাম্পেইন
                                </h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:gap-7 xl:grid-cols-3">
                                {visibleCampaigns.map((campaign) => (
                                    <CampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                    />
                                ))}
                            </div>

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
                                এই মুহূর্তে কোনো জরুরি ক্যাম্পেইন নেই
                            </h2>

                            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-text-secondary">
                                বর্তমানে কোনো সক্রিয় ক্যাম্পেইন জরুরি হিসেবে
                                অগ্রাধিকার পাচ্ছে না।
                            </p>

                            <Link
                                to="/campaigns"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-sans text-sm font-semibold text-white!"
                            >
                                সব ক্যাম্পেইন দেখুন
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default UrgentCampaigns;
