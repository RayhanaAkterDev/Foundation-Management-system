import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
    HiArrowSmLeft,
    HiArrowSmRight,
    HiOutlineExclamationCircle,
} from 'react-icons/hi';

import {
    fetchPublicCampaigns,
    fetchPublicCategories,
} from '@/api/publicCampaignsApi';

import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

import CampaignCard from './sections/CampaignCard';
import HeroSection from './sections/HeroSection';

const CAMPAIGNS_PER_PAGE = 12;

const Campaigns = () => {
    const { categoryId } = useParams();

    const [campaigns, setCampaigns] = useState([]);
    const [categoryName, setCategoryName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    /* =========================================================
        LOAD DATA
    ========================================================== */
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
        setCurrentPage(1);

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

    /* =========================================================
        INITIAL FETCH / CATEGORY CHANGE
    ========================================================== */
    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                await loadCampaignData();
            } catch (err) {
                if (cancelled) return;

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

    /* =========================================================
        RETRY
    ========================================================== */
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

    /* =========================================================
        PAGE DATA
    ========================================================== */
    const isCategoryPage = Boolean(categoryId);

    const pageTitle = isCategoryPage ? categoryName || 'উদ্যোগ' : 'সব উদ্যোগ';

    const pageEyebrow = isCategoryPage ? 'সহায়তার ক্ষেত্র' : 'চলমান উদ্যোগ';

    const pageDescription = isCategoryPage
        ? categoryName
            ? `${categoryName} সম্পর্কিত চলমান উদ্যোগগুলো দেখুন এবং আপনার সামর্থ্য অনুযায়ী মানুষের পাশে দাঁড়ান।`
            : 'এই সহায়তার ক্ষেত্রের উদ্যোগগুলো এই মুহূর্তে পাওয়া যাচ্ছে না।'
        : 'মানুষের জরুরি প্রয়োজন ও দীর্ঘমেয়াদি পরিবর্তনের জন্য চলমান উদ্যোগগুলো দেখুন এবং আপনার সামর্থ্য অনুযায়ী পাশে দাঁড়ান।';

    /* =========================================================
        HERO IMAGES
    ========================================================== */
    const heroImage =
        campaigns[0]?.image ||
        campaigns[0]?.cover_image ||
        defaultCampaignImage;

    const secondaryHeroImage =
        campaigns[1]?.image || campaigns[1]?.cover_image || heroImage;

    /* =========================================================
        PAGINATION
    ========================================================== */
    const totalPages = Math.ceil(campaigns.length / CAMPAIGNS_PER_PAGE);

    const paginatedCampaigns = useMemo(() => {
        const start = (currentPage - 1) * CAMPAIGNS_PER_PAGE;

        return campaigns.slice(start, start + CAMPAIGNS_PER_PAGE);
    }, [campaigns, currentPage]);

    const showPagination = campaigns.length > CAMPAIGNS_PER_PAGE;

    const paginationPages = useMemo(() => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [
                1,
                '...',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ];
    }, [currentPage, totalPages]);

    /* =========================================================
        SCROLL
    ========================================================== */
    const scrollToCampaigns = () => {
        document.getElementById('campaign-list')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const changePage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) {
            return;
        }

        setCurrentPage(page);

        window.requestAnimationFrame(() => {
            document.getElementById('campaign-list')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    };

    return (
        <main className="min-h-screen bg-surface">
            {/* =====================================================
    EDITORIAL HERO — COMPACT VERSION
====================================================== */}
            <section className="section-gap mt-16">
                <div className="container-width">
                    <div
                        className="
                relative
                isolate
                overflow-hidden

                lg:min-h-[500px]
            "
                    >
                        {/* PAPER TEXTURE */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-[0.16]"
                            style={{
                                backgroundImage: `
                        radial-gradient(
                            circle,
                            rgba(52, 45, 37, .16) .55px,
                            transparent .7px
                        )
                    `,
                                backgroundSize: '11px 11px',
                            }}
                        />

                        {/* SOFT PAPER LIGHT */}
                        <div
                            aria-hidden="true"
                            className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/50
                    via-transparent
                    to-[#d9ccb5]/20
                "
                        />

                        <div
                            className="
                    relative
                    z-10
                    grid

                    lg:min-h-[500px]
                    lg:grid-cols-[0.9fr_1.1fr]
                "
                        >
                            {/* =========================================
                    LEFT CONTENT
                ========================================== */}
                            <div
                                className="
                        relative
                        z-30
                        flex
                        flex-col
                        justify-center
                        px-7
                        py-10

                        sm:px-9
                        sm:py-12

                        lg:px-11
                        lg:py-12

                        xl:px-12
                    "
                            >
                                {/* EYEBROW */}
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-px w-9 bg-accent" />

                                    <span
                                        className="
                                font-bengali
                                text-[10px]
                                font-semibold
                                text-accent
                            "
                                    >
                                        {pageEyebrow}
                                    </span>
                                </div>

                                {/* HEADLINE */}
                                <h1
                                    className="
        max-w-[620px]
        font-bengali
        text-[2.7rem]
        font-medium!
        leading-[1.16]
        tracking-[-0.045em]
        text-text-primary

        sm:text-[3.3rem]
        lg:text-[3.75rem]
        xl:text-[4.5rem]
    "
                                >
                                    <span className="block">মানুষের পাশে</span>

                                    <span className="block">দাঁড়ানোর</span>

                                    <span
                                        className="
            relative
            inline-block
            pr-2
            text-accent
        "
                                    >
                                        গল্পগুলো
                                    </span>
                                </h1>
                                {/* DESCRIPTION */}
                                <p
                                    className="
                            mt-6
                            max-w-[410px]
                            font-bengali
                            text-[11px]
                            leading-[1.95]
                            text-text-secondary

                            sm:text-[14px]

                            xl:text-base
                        "
                                >
                                    মানুষের জরুরি প্রয়োজন ও দীর্ঘমেয়াদি
                                    পরিবর্তনের জন্য চলমান উদ্যোগগুলো দেখুন এবং
                                    আপনার সামর্থ্য অনুযায়ী পাশে দাঁড়ান।
                                </p>

                                {/* ACTION */}
                                <button
                                    type="button"
                                    onClick={scrollToCampaigns}
                                    className="
                            group
                            mt-12
                            flex
                            w-fit
                            items-center
                            gap-4
                        "
                                >
                                    <span
                                        className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-primary
                                text-white!
                                transition-transform
                                duration-300

                                group-hover:scale-105
                            "
                                    >
                                        <HiArrowSmRight
                                            className="
                                    text-[18px]
                                    transition-transform
                                    duration-300

                                    group-hover:translate-x-1
                                "
                                        />
                                    </span>

                                    <span
                                        className="
                                font-bengali
                                text-[11px]
                                font-semibold
                                text-text-primary

                                sm:text-[12px]
                            "
                                    >
                                        একটি উদ্যোগ খুঁজুন
                                    </span>

                                    <span
                                        className="
                                h-px
                                w-12
                                bg-text-primary/30
                                transition-all
                                duration-300

                                group-hover:w-16
                            "
                                    />
                                </button>
                            </div>

                            {/* =========================================
                    RIGHT COLLAGE — SMALLER
                ========================================== */}
                            <div
                                className="
                        relative
                        mx-auto
                        min-h-[390px]
                        w-full
                        max-w-[620px]

                        sm:min-h-[440px]

                        lg:min-h-0
                        lg:max-w-none
                    "
                            >
                                {/* BACK PAPER */}
                                <div
                                    aria-hidden="true"
                                    className="
                            absolute
                            bottom-[11%]
                            left-[13%]
                            top-[11%]
                            w-[65%]
                            -rotate-2
                            bg-[#e9e0d0]
                        "
                                />

                                {/* =====================================
                        MAIN IMAGE
                    ====================================== */}
                                <div
                                    className="
                            absolute
                            bottom-[10%]
                            left-[17%]
                            top-[10%]
                            z-10
                            w-[61%]
                            rotate-[1deg]
                            overflow-hidden
                            bg-[#ddd2bf]
                            shadow-[0_20px_45px_rgba(52,43,34,.14)]
                        "
                                    style={{
                                        clipPath:
                                            'polygon(1% 1%, 97% 0%, 100% 5%, 98% 16%, 100% 29%, 98% 43%, 100% 58%, 98% 74%, 100% 91%, 97% 99%, 83% 97%, 70% 100%, 55% 97%, 41% 100%, 26% 97%, 12% 100%, 1% 97%, 2% 82%, 0% 66%, 2% 50%, 0% 34%, 2% 17%)',
                                    }}
                                >
                                    <img
                                        src={heroImage}
                                        alt="মানুষের পাশে দাঁড়ানোর গল্প"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;

                                            e.currentTarget.src =
                                                defaultCampaignImage;
                                        }}
                                    />
                                </div>

                                {/* =====================================
                        LEFT NEWSPAPER NOTE
                    ====================================== */}
                                <div
                                    className="
                            absolute
                            left-[5%]
                            top-[12%]
                            z-30
                            w-[120px]
                            -rotate-[4deg]
                            bg-[#eee6d6]
                            px-4
                            py-5
                            shadow-[0_10px_25px_rgba(40,32,24,.07)]

                            sm:w-[140px]

                            lg:left-[4%]
                        "
                                    style={{
                                        clipPath:
                                            'polygon(2% 0, 98% 2%, 100% 16%, 97% 31%, 100% 47%, 97% 63%, 100% 80%, 97% 100%, 3% 98%, 0 82%, 3% 65%, 0 48%, 3% 30%, 0 13%)',
                                    }}
                                >
                                    <p
                                        className="
                                font-bengali
                                text-[13px]
                                leading-[1.75]
                                text-text-secondary

                                sm:text-[15px]
                            "
                                    >
                                        ছোট সহায়তাও
                                        <br />
                                        বড় পরিবর্তন
                                        <br />
                                        আনে
                                    </p>
                                </div>

                                {/* =====================================
                        SECOND PHOTO
                    ====================================== */}
                                <div
                                    className="
                            absolute
                            right-[7%]
                            top-[16%]
                            z-30
                            w-[29%]
                            rotate-[4deg]
                            bg-[#f2ebdf]
                            p-2
                            shadow-[0_16px_35px_rgba(42,34,27,.17)]

                            sm:p-2.5
                        "
                                >
                                    <div className="aspect-[0.92/1] overflow-hidden">
                                        <img
                                            src={secondaryHeroImage}
                                            alt="মানবিক উদ্যোগ"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;

                                                e.currentTarget.src =
                                                    defaultCampaignImage;
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* =====================================
                        RIGHT NEWSPAPER NOTE
                    ====================================== */}
                                <div
                                    className="
                            absolute
                            bottom-[10%]
                            right-[5%]
                            z-40
                            w-[130px]
                            rotate-[2deg]
                            bg-[#eee6d6]
                            px-4
                            py-4

                            sm:w-[150px]
                        "
                                    style={{
                                        clipPath:
                                            'polygon(1% 3%, 98% 0%, 100% 18%, 97% 37%, 100% 56%, 97% 75%, 100% 97%, 82% 100%, 64% 97%, 45% 100%, 25% 97%, 1% 100%, 3% 78%, 0 57%, 3% 34%, 0 13%)',
                                    }}
                                >
                                    <p
                                        className="
                                text-center
                                font-bengali
                                text-[11px]
                                leading-[1.8]
                                text-text-secondary

                                sm:text-[13px]
                            "
                                    >
                                        মানুষ থেকে
                                        <br />
                                        মানুষের সহায়তা
                                    </p>
                                </div>

                                {/* =====================================
                        SMALL BOTANICAL DOODLE
                    ====================================== */}
                                <svg
                                    viewBox="0 0 120 130"
                                    fill="none"
                                    aria-hidden="true"
                                    className="
                            absolute
                            bottom-[4%]
                            right-[5%]
                            z-50
                            hidden
                            h-[75px]
                            w-[62px]
                            rotate-[8deg]
                            text-text-primary/30

                            sm:block
                        "
                                >
                                    <path
                                        d="M15 118C43 86 66 56 94 17"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                    />

                                    <path
                                        d="M42 85C29 84 20 77 16 66C29 65 40 71 45 80"
                                        stroke="currentColor"
                                    />

                                    <path
                                        d="M56 68C46 58 44 47 48 37C59 43 64 54 61 65"
                                        stroke="currentColor"
                                    />

                                    <path
                                        d="M67 55C78 49 89 49 99 54C91 64 80 68 70 63"
                                        stroke="currentColor"
                                    />

                                    <path
                                        d="M78 39C72 29 72 20 76 11C85 18 89 27 85 36"
                                        stroke="currentColor"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CAMPAIGNS
            ====================================================== */}
            <section
                id="campaign-list"
                className="
                    container-width
                "
            >
                {/* SECTION INTRO */}
                {!loading && !error && (
                    <header>
                        <div
                            className="
                                grid
                                gap-8

                                lg:grid-cols-[1fr_430px]
                                lg:items-end
                                lg:gap-16
                            "
                        >
                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-px w-10 bg-accent" />

                                    <span className="font-bengali text-[11px] font-semibold text-primary">
                                        {pageEyebrow}
                                    </span>
                                </div>

                                <h2
                                    className="
                                        font-bengali
                                        text-[2.7rem]
                                        font-semibold
                                        leading-[1.15]
                                        tracking-[-0.04em]
                                        text-text-primary

                                        sm:text-[3.5rem]
                                        lg:text-[4.1rem]
                                    "
                                >
                                    {pageTitle}
                                </h2>
                            </div>

                            <p
                                className="
                                    font-bengali
                                    text-[13px]
                                    leading-[2]
                                    text-text-secondary
                                "
                            >
                                {pageDescription}
                            </p>
                        </div>

                        <div
                            className="
                                mt-10
                                flex
                                items-center
                                justify-between
                                border-t
                                border-border/70
                                pt-4
                            "
                        >
                            <span className="font-bengali text-[10px] text-text-muted">
                                {isCategoryPage && categoryName
                                    ? `${categoryName} বিভাগের উদ্যোগ`
                                    : 'মানুষের পাশে থাকার চলমান গল্প'}
                            </span>

                            <span className="font-bengali text-[10px] text-text-muted">
                                মোট {campaigns.length}টি উদ্যোগ
                            </span>
                        </div>
                    </header>
                )}

                {/* =================================================
                    LOADING
                ================================================== */}
                {loading && (
                    <div
                        className="
                            mt-10
                            grid
                            grid-cols-1
                            gap-6

                            lg:grid-cols-12
                        "
                    >
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className={
                                    item === 0 || item === 3
                                        ? 'lg:col-span-7'
                                        : 'lg:col-span-5'
                                }
                            >
                                <div className="h-[560px] animate-pulse bg-black/[0.045]" />
                            </div>
                        ))}
                    </div>
                )}

                {/* =================================================
                    ERROR
                ================================================== */}
                {!loading && error && (
                    <div className="mt-12 border-y border-red-200 py-20">
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
                                    transition-colors

                                    hover:bg-red-600
                                    hover:text-white!
                                "
                            >
                                আবার চেষ্টা করুন
                            </button>
                        </div>
                    </div>
                )}

                {/* =================================================
                    CAMPAIGN GRID
                ================================================== */}
                {!loading && !error && campaigns.length > 0 && (
                    <>
                        <div
                            className="
                                    mt-10
                                    grid
                                    grid-cols-1
                                    gap-6

                                    md:grid-cols-2

                                    lg:grid-cols-12
                                "
                        >
                            {paginatedCampaigns.map((campaign, index) => {
                                const total = paginatedCampaigns.length;

                                const isLast = index === total - 1;

                                const isOddLast = isLast && total % 2 !== 0;

                                const position = index % 4;

                                const isWide = position === 0 || position === 3;

                                const globalIndex =
                                    (currentPage - 1) * CAMPAIGNS_PER_PAGE +
                                    index;

                                /*
                                 * Important:
                                 * An unmatched final campaign
                                 * becomes full width.
                                 *
                                 * No ugly 5-column hole.
                                 */
                                const columnClass = isOddLast
                                    ? 'md:col-span-2 lg:col-span-12'
                                    : isWide
                                      ? 'lg:col-span-7'
                                      : 'lg:col-span-5';

                                return (
                                    <div
                                        key={campaign.id}
                                        className={columnClass}
                                    >
                                        <CampaignCard
                                            campaign={campaign}
                                            index={globalIndex}
                                            variant={
                                                isOddLast
                                                    ? 'feature'
                                                    : isWide
                                                      ? 'landscape'
                                                      : 'portrait'
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* =====================================
                                PAGINATION
                            ====================================== */}
                        {showPagination && (
                            <nav
                                aria-label="Campaign pagination"
                                className="
                                        mt-14
                                        flex
                                        flex-wrap
                                        items-center
                                        justify-center
                                        gap-2

                                        sm:mt-16
                                    "
                            >
                                <button
                                    type="button"
                                    aria-label="Previous page"
                                    disabled={currentPage === 1}
                                    onClick={() => changePage(currentPage - 1)}
                                    className="
                                            mr-2
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-border
                                            text-text-primary
                                            transition-all
                                            duration-300

                                            hover:border-primary
                                            hover:bg-primary
                                            hover:text-white!

                                            disabled:pointer-events-none
                                            disabled:opacity-25
                                        "
                                >
                                    <HiArrowSmLeft className="text-[19px]" />
                                </button>

                                {paginationPages.map((page, index) => {
                                    if (page === '...') {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="
                                                            flex
                                                            h-11
                                                            min-w-8
                                                            items-center
                                                            justify-center
                                                            text-text-muted
                                                        "
                                            >
                                                ···
                                            </span>
                                        );
                                    }

                                    const active = currentPage === page;

                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => changePage(page)}
                                            aria-current={
                                                active ? 'page' : undefined
                                            }
                                            className={`
                                                        flex
                                                        h-11
                                                        min-w-11
                                                        items-center
                                                        justify-center
                                                        px-3
                                                        text-[11px]
                                                        font-semibold
                                                        transition-all
                                                        duration-300

                                                        ${
                                                            active
                                                                ? 'bg-primary text-white!'
                                                                : 'text-text-secondary hover:bg-background-alt hover:text-primary'
                                                        }
                                                    `}
                                        >
                                            {String(page).padStart(2, '0')}
                                        </button>
                                    );
                                })}

                                <button
                                    type="button"
                                    aria-label="Next page"
                                    disabled={currentPage === totalPages}
                                    onClick={() => changePage(currentPage + 1)}
                                    className="
                                            ml-2
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-border
                                            text-text-primary
                                            transition-all
                                            duration-300

                                            hover:border-primary
                                            hover:bg-primary
                                            hover:text-white!

                                            disabled:pointer-events-none
                                            disabled:opacity-25
                                        "
                                >
                                    <HiArrowSmRight className="text-[19px]" />
                                </button>
                            </nav>
                        )}
                    </>
                )}

                {/* =================================================
                    EMPTY
                ================================================== */}
                {!loading && !error && campaigns.length === 0 && (
                    <div className="mt-12 border-y border-border py-24 text-center">
                        <div className="mx-auto h-px w-12 bg-accent" />

                        <p className="mt-6 font-bengali text-[11px] font-semibold text-primary">
                            এই মুহূর্তে কোনো উদ্যোগ নেই
                        </p>

                        <h3 className="mx-auto mt-5 max-w-2xl font-bengali text-[27px] font-semibold leading-[1.6] text-text-primary">
                            {isCategoryPage
                                ? categoryName
                                    ? `${categoryName} বিভাগে এখন কোনো চলমান উদ্যোগ নেই।`
                                    : 'এই সহায়তার ক্ষেত্রটি খুঁজে পাওয়া যায়নি।'
                                : 'এই মুহূর্তে কোনো চলমান উদ্যোগ প্রকাশিত হয়নি।'}
                        </h3>

                        <p className="mx-auto mt-4 max-w-md font-bengali text-[13px] leading-[2] text-text-secondary">
                            নতুন উদ্যোগ প্রকাশিত হলে এখানে দেখা যাবে।
                        </p>
                    </div>
                )}
            </section>

            {/* =====================================================
                BOTTOM CTA

                Much closer to campaign grid now.
            ====================================================== */}
            <div className="mt-20 sm:mt-24 lg:mt-28">
                <HeroSection />
            </div>
        </main>
    );
};

export default Campaigns;
