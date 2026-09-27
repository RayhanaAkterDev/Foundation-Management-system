import React, { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { HiOutlineExclamationCircle } from 'react-icons/hi';

import {
    fetchPublicCampaigns,
    fetchPublicCategories,
} from '@/api/publicCampaignsApi';

import CampaignCard from './sections/CampaignCard';
import HeroSection from './sections/HeroSection';

const Campaigns = () => {
    const { categoryId } = useParams();

    const [campaigns, setCampaigns] = useState([]);
    const [, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load campaigns and categories from the backend.
     *
     * Important:
     * The backend performs the category filtering.
     * We do NOT fetch all campaigns and filter them locally.
     */
    const loadCampaignData = useCallback(async () => {
        const normalizedCategoryId = categoryId
            ? decodeURIComponent(categoryId).trim().toLowerCase()
            : null;

        const [campaignsData, categoriesData] = await Promise.all([
            fetchPublicCampaigns(
                normalizedCategoryId
                    ? {
                          category: normalizedCategoryId,
                      }
                    : {},
            ),
            fetchPublicCategories(),
        ]);

        const safeCampaigns = Array.isArray(campaignsData) ? campaignsData : [];
        const safeCategories = Array.isArray(categoriesData)
            ? categoriesData
            : [];

        setCampaigns(safeCampaigns);
        setCategories(safeCategories);

        /**
         * Resolve the page title from the canonical
         * categories API using the URL slug.
         */
        if (normalizedCategoryId) {
            const matchedCategory = safeCategories.find(
                (category) =>
                    String(category?.slug ?? '')
                        .trim()
                        .toLowerCase() === normalizedCategoryId,
            );

            setCategoryName(matchedCategory?.name ?? null);
        } else {
            setCategoryName(null);
        }
    }, [categoryId]);

    /**
     * Fetch whenever the category URL changes.
     */
    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                await loadCampaignData();

                if (cancelled) {
                    return;
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error('Error loading public campaigns:', err);

                setCampaigns([]);

                setError(
                    'উদ্যোগগুলোর তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।',
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [loadCampaignData]);

    /**
     * Retry.
     */
    const handleRetry = async () => {
        try {
            setLoading(true);
            setError(null);

            await loadCampaignData();
        } catch (err) {
            console.error('Error loading public campaigns:', err);

            setCampaigns([]);

            setError(
                'উদ্যোগগুলোর তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।',
            );
        } finally {
            setLoading(false);
        }
    };

    const isCategoryPage = Boolean(categoryId);

    const pageTitle = isCategoryPage ? categoryName || 'উদ্যোগ' : 'সব উদ্যোগ';

    const pageEyebrow = isCategoryPage ? 'সহায়তার ক্ষেত্র' : 'চলমান উদ্যোগ';

    const pageDescription = isCategoryPage
        ? categoryName
            ? `${categoryName} সম্পর্কিত চলমান উদ্যোগগুলো দেখুন এবং আপনার সামর্থ্য অনুযায়ী মানুষের পাশে দাঁড়ান।`
            : 'এই সহায়তার ক্ষেত্রের উদ্যোগগুলো এই মুহূর্তে পাওয়া যাচ্ছে না।'
        : 'মানুষের জরুরি প্রয়োজন ও দীর্ঘমেয়াদি পরিবর্তনের জন্য চলমান উদ্যোগগুলো দেখুন এবং আপনার সামর্থ্য অনুযায়ী পাশে দাঁড়ান।';

    return (
        <main className="min-h-screen bg-surface">
            {/* Heading */}

            {/* CAMPAIGNS AREA */}
            <section
                id="explore"
                className="container-width border-t border-border/70 py-20 sm:py-24 lg:py-28"
            >
                <h1
                    className="
        relative
        z-10
        max-w-[1120px]
        font-bengali
        text-[2.75rem]
        font-semibold
        leading-[1.32]
        tracking-[-0.025em]
        text-text-primary
        sm:text-[4rem]
        sm:leading-[1.24]
        lg:max-w-[1080px]
        lg:text-[5.35rem]
        lg:leading-[1.18]
        xl:max-w-[1180px]
        xl:text-[6.25rem]
        xl:leading-[1.16]
    "
                >
                    মানুষের পাশে থাকার
                    <br />
                    <span className="text-primary">গল্পগুলো এখান থেকেই</span>
                    <br />
                    শুরু হয়।
                </h1>
                {/* EDITORIAL INTRO */}
                {!loading && !error && (
                    <header className="relative">
                        <div className="grid gap-8 lg:grid-cols-[1fr_0.52fr] lg:items-end lg:gap-24">
                            <div>
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="h-px w-10 bg-accent" />

                                    <span className="font-bengali text-[11px] font-semibold tracking-[0.08em] text-primary">
                                        {pageEyebrow}
                                    </span>
                                </div>

                                <h2
                                    className="
                                        max-w-[850px]
                                        font-bengali
                                        text-[2.45rem]
                                        font-semibold
                                        leading-[1.35]
                                        tracking-[-0.03em]
                                        text-text-primary
                                        sm:text-[3.2rem]
                                        lg:text-[4rem]
                                    "
                                >
                                    {pageTitle}
                                </h2>
                            </div>

                            <div className="lg:pb-2">
                                <p
                                    className="
                                        max-w-[440px]
                                        font-bengali
                                        text-[13px]
                                        leading-[2.05]
                                        text-text-secondary
                                        lg:ml-auto
                                    "
                                >
                                    {pageDescription}
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                mt-10
                                flex
                                flex-col
                                gap-3
                                border-t
                                border-border/70
                                pt-5
                                sm:mt-12
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >
                            <p className="font-bengali text-[12px] text-text-secondary">
                                {isCategoryPage && categoryName
                                    ? `${categoryName} বিভাগের উদ্যোগ`
                                    : 'সকল চলমান উদ্যোগ'}
                            </p>

                            <p className="font-bengali text-[11px] text-text-muted">
                                মোট {campaigns.length}টি উদ্যোগ
                            </p>
                        </div>
                    </header>
                )}

                {/* LOADING */}
                {loading && (
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-x-10
                            gap-y-14
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="animate-pulse">
                                <div className="h-[300px] bg-black/5 sm:h-[330px]" />

                                <div className="pt-6">
                                    <div className="h-3 w-20 bg-black/5" />

                                    <div className="mt-5 h-7 w-[88%] bg-black/5" />

                                    <div className="mt-2 h-7 w-[65%] bg-black/5" />

                                    <div className="mt-5 h-3 w-full bg-black/5" />

                                    <div className="mt-2 h-3 w-[78%] bg-black/5" />

                                    <div className="mt-7 h-px w-full bg-black/5" />

                                    <div className="mt-5 h-4 w-28 bg-black/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="border-y border-red-200 py-20 sm:py-24">
                        <div className="mx-auto max-w-xl text-center">
                            <HiOutlineExclamationCircle className="mx-auto text-3xl text-red-600" />

                            <h3 className="mt-5 font-bengali text-[21px] font-semibold text-text-primary">
                                উদ্যোগগুলো লোড করা যায়নি
                            </h3>

                            <p className="mt-3 font-bengali text-[13px] leading-[2] text-text-secondary">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={handleRetry}
                                className="
                                    mt-7
                                    border
                                    border-red-600
                                    px-6
                                    py-3
                                    font-bengali
                                    text-[12px]
                                    font-semibold
                                    text-red-700
                                    transition-all
                                    duration-300
                                    hover:bg-red-600
                                    hover:text-white
                                "
                            >
                                আবার চেষ্টা করুন
                            </button>
                        </div>
                    </div>
                )}

                {/* CAMPAIGNS */}
                {!loading && !error && (
                    <>
                        {campaigns.length > 0 ? (
                            <div
                                className="
                                    mt-12
                                    grid
                                    grid-cols-1
                                    gap-x-10
                                    gap-y-16
                                    sm:grid-cols-2
                                    lg:mt-16
                                    lg:grid-cols-3
                                    lg:gap-y-20
                                "
                            >
                                {campaigns.map((campaign) => (
                                    <CampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div
                                className="
                                    mt-12
                                    border-y
                                    border-border
                                    py-20
                                    text-center
                                    sm:mt-16
                                    sm:py-28
                                "
                            >
                                <div className="mx-auto h-px w-12 bg-accent" />

                                <span
                                    className="
                                        mt-6
                                        block
                                        font-bengali
                                        text-[11px]
                                        font-semibold
                                        tracking-wide
                                        text-primary
                                    "
                                >
                                    এই মুহূর্তে কোনো উদ্যোগ নেই
                                </span>

                                <h3
                                    className="
                                        mx-auto
                                        mt-5
                                        max-w-2xl
                                        font-bengali
                                        text-[25px]
                                        font-semibold
                                        leading-[1.6]
                                        tracking-[-0.015em]
                                        text-text-primary
                                        sm:text-[30px]
                                    "
                                >
                                    {isCategoryPage
                                        ? categoryName
                                            ? `${categoryName} বিভাগে এখন কোনো চলমান উদ্যোগ নেই।`
                                            : 'এই সহায়তার ক্ষেত্রটি খুঁজে পাওয়া যায়নি।'
                                        : 'এই মুহূর্তে কোনো চলমান উদ্যোগ প্রকাশিত হয়নি।'}
                                </h3>

                                <p
                                    className="
                                        mx-auto
                                        mt-4
                                        max-w-md
                                        font-bengali
                                        text-[13px]
                                        leading-[2]
                                        text-text-secondary
                                    "
                                >
                                    নতুন উদ্যোগ প্রকাশিত হলে এখানে দেখা যাবে।
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* HERO */}
            <HeroSection />
        </main>
    );
};

export default Campaigns;
