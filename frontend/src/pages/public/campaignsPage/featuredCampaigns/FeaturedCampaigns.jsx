import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    ChevronDown,
    HeartHandshake,
    RefreshCw,
} from 'lucide-react';

import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';
import FeaturedCampaignCard from '../sections/FeaturedCampaignCard';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

/* ---------------------------------------
   FEATURED CARD SKELETON
--------------------------------------- */

function FeaturedCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="flex h-full min-h-[420px] flex-col overflow-hidden border border-[#e1e8e2] bg-white"
        >
            {/* Card heading */}
            <div className="flex h-12 items-center justify-between border-b border-[#edf1ed] px-5 sm:px-6">
                <div className="h-3 w-36 animate-pulse rounded bg-[#e5ede7]" />
                <div className="h-3 w-5 animate-pulse rounded bg-[#e5ede7]" />
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6">
                <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1 space-y-4">
                        <div className="h-3 w-20 animate-pulse rounded bg-[#e2ebe4]" />
                        <div className="h-5 w-full animate-pulse rounded bg-[#e2ebe4]" />
                        <div className="h-5 w-4/5 animate-pulse rounded bg-[#e2ebe4]" />
                        <div className="h-5 w-2/3 animate-pulse rounded bg-[#e2ebe4]" />
                    </div>

                    <div className="h-[105px] w-[105px] shrink-0 animate-pulse bg-[#e2ebe4] sm:h-[118px] sm:w-[118px]" />
                </div>

                <div className="mt-5 space-y-2.5">
                    <div className="h-3 w-full animate-pulse rounded bg-[#e9efea]" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-[#e9efea]" />
                </div>

                <div className="mt-5 h-3 w-32 animate-pulse rounded bg-[#e9efea]" />

                {/* Funding */}
                <div className="mt-auto pt-6">
                    <div className="border-t border-[#e7ede8] pt-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="h-3 w-24 animate-pulse rounded bg-[#e5ede7]" />
                                <div className="h-6 w-28 animate-pulse rounded bg-[#e2ebe4]" />
                            </div>

                            <div className="space-y-3 border-l border-[#e7ede8] pl-4">
                                <div className="h-3 w-20 animate-pulse rounded bg-[#e5ede7]" />
                                <div className="h-5 w-24 animate-pulse rounded bg-[#e2ebe4]" />
                            </div>
                        </div>

                        <div className="mt-5 h-[5px] animate-pulse rounded-full bg-[#e5ede7]" />

                        <div className="mt-3 flex justify-between gap-4">
                            <div className="h-3 w-28 animate-pulse rounded bg-[#e5ede7]" />
                            <div className="h-3 w-16 animate-pulse rounded bg-[#e5ede7]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action footer */}
            <div className="flex h-[58px] items-center justify-between bg-[#f0f5f1] px-5 sm:px-6">
                <div className="h-3 w-36 animate-pulse rounded bg-[#dce9df]" />
                <div className="h-8 w-8 animate-pulse rounded-full bg-white" />
            </div>
        </div>
    );
}

/* ---------------------------------------
   FEEDBACK STATES
--------------------------------------- */

function FeedbackState({ type, onRetry }) {
    const isError = type === 'error';

    return (
        <div className="border border-[#e1e8e2] bg-white px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5ef] text-[#0f766e]">
                {isError ? (
                    <RefreshCw size={24} strokeWidth={1.6} />
                ) : (
                    <HeartHandshake size={26} strokeWidth={1.6} />
                )}
            </div>

            <h3 className="mt-5 font-bengali text-[21px] font-semibold leading-[1.5] text-[#17352b] sm:text-[24px]">
                {isError
                    ? 'উদ্যোগগুলো এই মুহূর্তে দেখানো যাচ্ছে না'
                    : 'এই মুহূর্তে কোনো নির্বাচিত উদ্যোগ নেই'}
            </h3>

            <p className="mx-auto mt-3 max-w-md font-bengali text-[14px] leading-[1.9] text-[#728277]">
                {isError
                    ? 'তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
                    : 'নতুন নির্বাচিত উদ্যোগ যুক্ত হলে এখানে দেখতে পাবেন। এর মধ্যে অন্যান্য মানবিক উদ্যোগ ঘুরে দেখতে পারেন।'}
            </p>

            {isError ? (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0f766e] px-6 py-3 font-bengali text-[13px] font-semibold text-white transition-colors hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
                >
                    <RefreshCw size={15} />
                    আবার চেষ্টা করুন
                </button>
            ) : (
                <Link
                    to="/campaigns"
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0f766e] px-6 py-3 font-bengali text-[13px] font-semibold text-white transition-colors hover:bg-[#115e59]"
                >
                    সব ক্যাম্পেইন দেখুন
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

/* ---------------------------------------
   MAIN PAGE
--------------------------------------- */

export default function FeaturedCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

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

                if (isMounted) {
                    setCampaigns(featured);
                    setError(false);
                }
            } catch (err) {
                console.error('Failed to load featured campaigns:', err);

                if (isMounted) {
                    setError(true);
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
    }, [retryKey]);

    const visibleCampaigns = campaigns.slice(0, visibleCount);

    const remaining = Math.max(0, campaigns.length - visibleCount);

    const hasMore = remaining > 0;

    const retry = () => {
        setLoading(true);
        setError(false);
        setRetryKey((current) => current + 1);
    };

    const handleLoadMore = () => {
        setVisibleCount((current) =>
            Math.min(current + LOAD_MORE_COUNT, campaigns.length),
        );
    };

    return (
        <main className="mt-20 min-h-screen bg-page">
            {/* =====================================
                PAGE INTRODUCTION
            ===================================== */}

            <section className="pb-12 pt-12 sm:pb-14 sm:pt-16 lg:pb-16 lg:pt-20">
                <div className="container-width">
                    <div className="max-w-[820px]">
                        <div className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
                            <span className="font-bengali text-[12px] font-semibold text-[#0f766e] sm:text-[13px]">
                                নির্বাচিত মানবিক উদ্যোগ
                            </span>
                        </div>

                        <h1 className="mt-5 font-bengali text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.45] tracking-[-0.025em] text-text-primary">
                            প্রতিটি উদ্যোগে{' '}
                            <span className="text-[#0f766e]">
                                পরিবর্তনের সম্ভাবনা
                            </span>
                        </h1>

                        <p className="mt-5 max-w-[630px] font-bengali text-[15px] leading-[1.95] text-text-secondary sm:text-[16px]">
                            শিক্ষা, চিকিৎসা, খাদ্য কিংবা জরুরি সহায়তা—প্রতিটি
                            উদ্যোগের সঙ্গে জড়িয়ে আছে মানুষের জীবন ও নতুন
                            সম্ভাবনার গল্প। আপনার সহযোগিতায় সেই পরিবর্তনের অংশ
                            হয়ে উঠুন।
                        </p>
                    </div>
                </div>
            </section>

            {/* =====================================
                FEATURED CAMPAIGN COLLECTION
            ===================================== */}

            <section className="pb-20 sm:pb-24 lg:pb-28">
                <div className="container-width">
                    {/* Section heading */}
                    <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#e0e8e2] pb-6 sm:mb-9 sm:flex-row sm:items-end">
                        <div>
                            <p className="font-bengali text-[12px] font-medium text-[#72867a] sm:text-[13px]">
                                একসঙ্গে পরিবর্তনের পথে
                            </p>

                            <h2 className="mt-2 font-bengali text-[25px] font-semibold leading-[1.5] text-text-primary sm:text-[30px]">
                                মানুষের পাশে, প্রতিদিন
                            </h2>
                        </div>

                        <Link
                            to="/campaigns"
                            className="inline-flex w-fit items-center gap-2 font-bengali text-[13px] font-semibold text-[#0f766e] transition-colors hover:text-[#115e59] sm:text-[14px]"
                        >
                            সব ক্যাম্পেইন
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    {/* =====================================
                        LOADING STATE
                    ===================================== */}

                    {loading ? (
                        <div
                            role="status"
                            aria-busy="true"
                            aria-label="নির্বাচিত উদ্যোগগুলো লোড হচ্ছে"
                            className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
                        >
                            {Array.from({
                                length: INITIAL_COUNT,
                            }).map((_, index) => (
                                <FeaturedCardSkeleton key={index} />
                            ))}

                            <span className="sr-only">
                                নির্বাচিত উদ্যোগগুলো লোড হচ্ছে, অনুগ্রহ করে
                                অপেক্ষা করুন।
                            </span>
                        </div>
                    ) : error ? (
                        /* ERROR STATE */
                        <FeedbackState type="error" onRetry={retry} />
                    ) : campaigns.length > 0 ? (
                        <>
                            {/* =====================================
                                CAMPAIGN GRID
                            ===================================== */}

                            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                                {visibleCampaigns.map((campaign, index) => (
                                    <FeaturedCampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* =====================================
                                LOAD MORE
                            ===================================== */}

                            {hasMore && (
                                <div className="mt-11 flex flex-col items-center gap-3 sm:mt-14">
                                    <button
                                        type="button"
                                        onClick={handleLoadMore}
                                        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#b7d4c4] bg-white px-7 py-3 font-bengali text-[14px] font-semibold text-[#0f766e] transition-all duration-200 hover:border-[#0f766e] hover:bg-[#0f766e] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
                                    >
                                        আরও উদ্যোগ দেখুন
                                        <ChevronDown size={17} />
                                    </button>
                                </div>
                            )}

                            {!hasMore && campaigns.length > INITIAL_COUNT && (
                                <div className="mt-12 flex items-center justify-center gap-3">
                                    <span className="h-px w-8 bg-[#cbd9cf]" />
                                    <p className="font-bengali text-[12px] text-[#7b8e81]">
                                        সব নির্বাচিত উদ্যোগ দেখানো হয়েছে
                                    </p>
                                    <span className="h-px w-8 bg-[#cbd9cf]" />
                                </div>
                            )}
                        </>
                    ) : (
                        /* EMPTY STATE */
                        <FeedbackState type="empty" />
                    )}
                </div>
            </section>
        </main>
    );
}
