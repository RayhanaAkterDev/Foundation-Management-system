import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, HeartHandshake, RefreshCw } from 'lucide-react';

import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';
import CampaignEditorialCard from '../sections/CampaignEditorialCard';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 3;

const bn = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

const getUrgencyScore = (campaign) => {
    const target = Number(campaign?.target_amount || 0);
    const collected = Number(campaign?.collected_amount || 0);

    const remaining = Math.max(target - collected, 0);
    const progress = target > 0 ? Math.min(collected / target, 1) : 0;

    if (!campaign?.end_date) return 0;

    const endDate = new Date(campaign.end_date);
    if (Number.isNaN(endDate.getTime())) return 0;

    const daysRemaining = Math.ceil((endDate - new Date()) / 86400000);

    const deadlineScore =
        daysRemaining <= 0 ? 100 : Math.max(0, 60 - daysRemaining * 3);

    const fundingGapScore =
        target > 0 ? Math.min((remaining / target) * 40, 40) : 0;

    return deadlineScore + fundingGapScore - progress * 15;
};

function CampaignSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[16px] border border-[#e2eae4] bg-white"
        >
            <div className="aspect-[16/10] animate-pulse bg-[#dfe9e2]" />

            <div className="space-y-4 p-6">
                <div className="h-3 w-24 animate-pulse rounded bg-[#e7eee8]" />
                <div className="h-5 w-full animate-pulse rounded bg-[#e3ebe5]" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#e3ebe5]" />

                <div className="pt-5">
                    <div className="flex justify-between gap-5">
                        <div className="h-8 w-28 animate-pulse rounded bg-[#e3ebe5]" />
                        <div className="h-8 w-20 animate-pulse rounded bg-[#e3ebe5]" />
                    </div>
                    <div className="mt-5 h-1.5 animate-pulse rounded bg-[#e3ebe5]" />
                    <div className="mt-7 h-px bg-[#edf1ed]" />
                    <div className="mt-4 h-4 w-40 animate-pulse rounded bg-[#e3ebe5]" />
                </div>
            </div>
        </div>
    );
}

export default function UrgentCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let active = true;

        const loadCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();

                const urgent = [...(Array.isArray(data) ? data : [])]
                    .filter(
                        (campaign) =>
                            campaign?.status === 'active' &&
                            (campaign?.is_urgent === true ||
                                campaign?.is_urgent === 1 ||
                                campaign?.is_urgent === '1'),
                    )
                    .sort((a, b) => {
                        const priorityDifference =
                            Number(b.urgency_priority ?? 2) -
                            Number(a.urgency_priority ?? 2);

                        if (priorityDifference !== 0) {
                            return priorityDifference;
                        }

                        const scoreDifference =
                            getUrgencyScore(b) - getUrgencyScore(a);

                        if (Math.abs(scoreDifference) > 0.01) {
                            return scoreDifference;
                        }

                        return (
                            new Date(b.created_at || 0) -
                            new Date(a.created_at || 0)
                        );
                    });

                if (active) {
                    setCampaigns(urgent);
                    setError(false);
                }
            } catch (err) {
                console.error('Failed to load urgent campaigns:', err);
                if (active) {
                    setError(true);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCampaigns();

        return () => {
            active = false;
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

    return (
        <main className="min-h-screen bg-[#f7f9f7]">
            {/* HERO */}
            <section className="border-b border-[#e5ebe5] bg-[#edf4ef] pb-14 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
                <div className="container-width">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end lg:gap-16">
                        <div className="max-w-[760px]">
                            <p className="inline-flex items-center gap-2 font-bengali text-[13px] font-semibold text-[#a56d27]">
                                <span className="h-2 w-2 rounded-full bg-[#dca047]" />
                                সময়ের দাবি, মানুষের পাশে দাঁড়ানো
                            </p>

                            <h1 className="mt-5 font-bengali text-[clamp(2rem,4.3vw,3.6rem)] font-semibold leading-[1.4] tracking-[-0.035em] text-[#142d27]">
                                কিছু প্রয়োজনে{' '}
                                <span className="text-[#0f766e]">
                                    অপেক্ষার সুযোগ নেই।
                                </span>
                            </h1>

                            <p className="mt-5 max-w-[600px] font-bengali text-[15px] leading-[1.95] text-[#65796d] sm:text-base">
                                দুর্যোগ, চিকিৎসা কিংবা খাদ্যসংকট—কিছু মুহূর্তে
                                দ্রুত এগিয়ে আসাই সবচেয়ে বড় সহায়তা। জরুরি
                                উদ্যোগগুলো দেখুন, সামর্থ্য অনুযায়ী মানুষের পাশে
                                দাঁড়ান।
                            </p>
                        </div>

                        <div className="border-l-[3px] border-[#dfa64e] pl-5 lg:mb-2">
                            <HeartHandshake
                                size={24}
                                className="mb-3 text-[#0f766e]"
                            />
                            <p className="font-bengali text-[14px] font-medium leading-[1.9] text-[#36574b]">
                                আপনার সময়মতো সহায়তাই কারও জীবনে নতুন আশার
                                সূচনা হতে পারে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CAMPAIGNS */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container-width">
                    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#dfe8e1] pb-6 sm:mb-9 sm:flex-row sm:items-end">
                        <div>
                            <p className="inline-flex items-center gap-2 font-bengali text-[12px] font-semibold text-[#a56d27]">
                                <Clock3 size={14} />
                                অগ্রাধিকারপ্রাপ্ত সক্রিয় উদ্যোগ
                            </p>

                            <h2 className="mt-2 font-bengali text-[25px] font-semibold leading-[1.5] text-[#172d27] sm:text-[30px]">
                                যেখানে সহায়তা সবচেয়ে জরুরি
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <div
                            role="status"
                            aria-label="ক্যাম্পেইন লোড হচ্ছে"
                            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:gap-6"
                        >
                            {Array.from({ length: INITIAL_COUNT }).map(
                                (_, index) => (
                                    <CampaignSkeleton key={index} />
                                ),
                            )}
                            <span className="sr-only">
                                জরুরি উদ্যোগগুলো লোড হচ্ছে
                            </span>
                        </div>
                    ) : error ? (
                        <div className="border border-[#e2eae4] bg-white px-6 py-16 text-center">
                            <h3 className="font-bengali text-xl font-semibold text-[#17352b]">
                                উদ্যোগগুলো লোড করা যায়নি
                            </h3>
                            <p className="mt-3 font-bengali text-sm text-[#728277]">
                                অনুগ্রহ করে আবার চেষ্টা করুন।
                            </p>
                            <button
                                type="button"
                                onClick={retry}
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f766e] px-6 py-3 font-bengali text-sm font-semibold text-white hover:bg-[#115e59]"
                            >
                                <RefreshCw size={16} />
                                আবার চেষ্টা করুন
                            </button>
                        </div>
                    ) : campaigns.length > 0 ? (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 lg:gap-6">
                                {visibleCampaigns.map((campaign, index) => (
                                    <CampaignEditorialCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-12 flex flex-col items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setVisibleCount((current) =>
                                                Math.min(
                                                    current + LOAD_MORE_COUNT,
                                                    campaigns.length,
                                                ),
                                            )
                                        }
                                        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#0f766e] px-7 py-3 font-bengali text-[14px] font-semibold text-white transition-colors hover:bg-[#115e59]"
                                    >
                                        আরও{' '}
                                        {bn(
                                            Math.min(
                                                LOAD_MORE_COUNT,
                                                remaining,
                                            ),
                                        )}
                                        টি উদ্যোগ দেখুন
                                        <ArrowRight size={17} />
                                    </button>

                                    <p className="font-bengali text-[12px] text-[#849287]">
                                        আরও {bn(remaining)}টি উদ্যোগ রয়েছে
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="border border-[#e2eae4] bg-white px-6 py-16 text-center">
                            <Clock3
                                size={28}
                                className="mx-auto text-[#0f766e]"
                            />

                            <h3 className="mt-5 font-bengali text-xl font-semibold text-[#17352b]">
                                এই মুহূর্তে কোনো জরুরি উদ্যোগ নেই
                            </h3>

                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-[#728277]">
                                বর্তমানে কোনো সক্রিয় ক্যাম্পেইন জরুরি হিসেবে
                                অগ্রাধিকার পাচ্ছে না।
                            </p>

                            <Link
                                to="/campaigns"
                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f766e] px-6 py-3 font-bengali text-sm font-semibold text-white hover:bg-[#115e59]"
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
}
