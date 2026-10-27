import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';
import FeaturedCampaignCard from '../sections/FeaturedCampaignCard';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 6;

const FeaturedCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadFeaturedCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();
                const featured = (Array.isArray(data) ? data : [])
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
                if (isMounted) setCampaigns(featured);
            } catch (err) {
                console.error('Failed to load featured campaigns:', err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadFeaturedCampaigns();
        return () => {
            isMounted = false;
        };
    }, []);

    const visibleCampaigns = campaigns.slice(0, visibleCount);
    const hasMore = visibleCount < campaigns.length;

    return (
        <main className="min-h-screen bg-page mt-20">
            <section className="pt-12 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
                <div className="container-width">
                    <div className="max-w-[850px]">
                        <p className="mb-5 font-bengali text-sm font-semibold tracking-wide text-primary">
                            নির্বাচিত মানবিক উদ্যোগ
                        </p>
                        <h1 className="font-bengali text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.45] tracking-[-0.025em] text-text-primary">
                            প্রতিটি উদ্যোগে{' '}
                            <span className="text-primary">
                                পরিবর্তনের সম্ভাবনা
                            </span>
                        </h1>
                        <p className="mt-5 max-w-[620px] font-bengali text-[15px] leading-8 text-text-secondary sm:text-base">
                            শিক্ষা, চিকিৎসা, খাদ্য কিংবা জরুরি সহায়তা—প্রতিটি
                            উদ্যোগের সঙ্গে জড়িয়ে আছে মানুষের জীবন। আপনার
                            সহযোগিতায় পৌঁছে যাক প্রয়োজনীয় সহায়তা।
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-20 sm:pb-24 lg:pb-28">
                <div className="container-width">
                    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
                        <div>
                            <p className="mb-2 font-bengali text-xs font-medium text-text-secondary sm:text-sm">
                                একসঙ্গে পরিবর্তনের পথে
                            </p>
                            <h2 className="font-bengali text-[1.65rem] font-semibold leading-snug text-text-primary sm:text-[2rem]">
                                মানুষের পাশে, প্রতিদিন
                            </h2>
                        </div>
                        <Link
                            to="/campaigns"
                            className="inline-flex items-center gap-2 font-bengali text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                        >
                            সব ক্যাম্পেইন <ArrowRight size={17} />
                        </Link>
                    </div>

                    {loading ? (
                        <div
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
                            aria-label="ক্যাম্পেইন লোড হচ্ছে"
                            aria-busy="true"
                        >
                            {Array.from({ length: INITIAL_COUNT }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="h-[440px] animate-pulse rounded-2xl bg-slate-200/70 sm:h-[470px] lg:h-[490px] xl:h-[510px]"
                                    />
                                ),
                            )}
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-black/5 bg-white px-6 py-14 text-center">
                            <h3 className="font-bengali text-xl font-semibold text-text-primary">
                                ক্যাম্পেইনগুলো এখন দেখানো যাচ্ছে না
                            </h3>
                            <p className="mt-2 font-bengali text-sm text-text-secondary">
                                কিছুক্ষণ পর আবার চেষ্টা করুন।
                            </p>
                        </div>
                    ) : campaigns.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                                {visibleCampaigns.map((campaign, index) => (
                                    <FeaturedCampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        index={index}
                                    />
                                ))}
                            </div>
                            {hasMore && (
                                <div className="mt-10 flex justify-center sm:mt-12">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setVisibleCount((count) =>
                                                Math.min(
                                                    count + LOAD_MORE_COUNT,
                                                    campaigns.length,
                                                ),
                                            )
                                        }
                                        className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-white px-6 py-3.5 font-bengali text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                        আরও ক্যাম্পেইন দেখুন{' '}
                                        <ChevronDown size={17} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-2xl border border-black/5 bg-white px-6 py-16 text-center">
                            <h3 className="font-bengali text-xl font-semibold text-text-primary sm:text-2xl">
                                এই মুহূর্তে কোনো নির্বাচিত ক্যাম্পেইন নেই
                            </h3>
                            <p className="mt-3 font-bengali text-sm text-text-secondary">
                                নতুন উদ্যোগ যুক্ত হলে এখানে দেখতে পাবেন।
                            </p>
                            <Link
                                to="/campaigns"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bengali text-sm font-semibold text-white"
                            >
                                সব ক্যাম্পেইন দেখুন <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default FeaturedCampaigns;
