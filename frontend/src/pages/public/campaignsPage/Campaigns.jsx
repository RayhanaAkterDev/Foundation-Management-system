import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    HiArrowSmLeft,
    HiArrowSmRight,
    HiOutlineExclamationCircle,
    HiOutlineSearch,
    HiX,
} from 'react-icons/hi';
import {
    fetchPublicCampaigns,
    fetchPublicCategories,
} from '@/api/publicCampaignsApi';
import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';
import CampaignCard from './sections/CampaignCard';
import HeroSection from './sections/HeroSection';

const PER_PAGE = 12;
const bn = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);
const categoryTranslations = {
    education: 'শিক্ষা',
    food: 'খাদ্য সহায়তা',
    health: 'স্বাস্থ্যসেবা',
    healthcare: 'স্বাস্থ্যসেবা',
    nutrition: 'পুষ্টি সহায়তা',
    water: 'বিশুদ্ধ পানি',
    'clean water': 'বিশুদ্ধ পানি',
    'emergency relief': 'জরুরি সহায়তা',
    'child support': 'শিশু সহায়তা',
    'women empowerment': 'নারীর ক্ষমতায়ন',
    shelter: 'আশ্রয়',
    environment: 'পরিবেশ',
    disaster: 'দুর্যোগ সহায়তা',
};
const displayCategory = (value) => {
    const original = String(value || '').trim();
    return (
        categoryTranslations[original.toLowerCase()] ||
        bn(original.replace(/[-_]/g, ' '))
    );
};
const normalizeSearch = (value) =>
    String(value ?? '')
        .normalize('NFKC')
        .toLocaleLowerCase()
        .replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)))
        .replace(/\s+/g, ' ')
        .trim();
const searchableText = (campaign) =>
    [
        campaign?.title,
        campaign?.name,
        campaign?.description,
        campaign?.short_description,
        campaign?.summary,
        campaign?.category?.name,
        campaign?.category?.slug,
        typeof campaign?.category === 'string' ? campaign.category : '',
        campaign?.location,
        campaign?.district,
        campaign?.organization?.name,
        campaign?.organization_name,
    ]
        .filter(
            (value) => typeof value === 'string' || typeof value === 'number',
        )
        .join(' ');
const getImage = (campaign) =>
    campaign?.cover_image_url ||
    campaign?.cover_image ||
    campaign?.banner_url ||
    campaign?.banner ||
    campaign?.image_url ||
    campaign?.image ||
    defaultCampaignImage;
const imageFallback = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultCampaignImage;
};

const Campaigns = () => {
    const { categoryId } = useParams();
    const [campaigns, setCampaigns] = useState([]);
    const [categoryName, setCategoryName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let active = true;
        const normalized = categoryId
            ? decodeURIComponent(categoryId).trim().toLowerCase()
            : null;
        const load = async () => {
            try {
                const [campaignData, categoryData] = await Promise.all([
                    fetchPublicCampaigns(
                        normalized ? { category: normalized } : {},
                    ),
                    fetchPublicCategories(),
                ]);
                if (!active) return;
                const items = Array.isArray(campaignData) ? campaignData : [];
                const categories = Array.isArray(categoryData)
                    ? categoryData
                    : [];
                const match = normalized
                    ? categories.find(
                          (item) =>
                              String(item?.slug ?? '')
                                  .trim()
                                  .toLowerCase() === normalized,
                      )
                    : null;
                setCampaigns(items);
                setCategoryName(match?.name ?? null);
                setCurrentPage(1);
                setError(null);
            } catch (err) {
                if (!active) return;
                console.error('Error loading public campaigns:', err);
                setCampaigns([]);
                setError(
                    'উদ্যোগগুলোর তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।',
                );
            } finally {
                if (active) setLoading(false);
            }
        };
        // Start the request in a microtask so the effect does not synchronously set state.
        Promise.resolve().then(() => {
            if (!active) return;
            setLoading(true);
            setError(null);
            return load();
        });
        return () => {
            active = false;
        };
    }, [categoryId]);

    const retry = async () => {
        setLoading(true);
        setError(null);
        try {
            const normalized = categoryId
                ? decodeURIComponent(categoryId).trim().toLowerCase()
                : null;
            const [campaignData, categoryData] = await Promise.all([
                fetchPublicCampaigns(
                    normalized ? { category: normalized } : {},
                ),
                fetchPublicCategories(),
            ]);
            const categories = Array.isArray(categoryData) ? categoryData : [];
            const match = normalized
                ? categories.find(
                      (item) =>
                          String(item?.slug ?? '')
                              .trim()
                              .toLowerCase() === normalized,
                  )
                : null;
            setCampaigns(Array.isArray(campaignData) ? campaignData : []);
            setCategoryName(match?.name ?? null);
            setCurrentPage(1);
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
    const localizedCategory = categoryName
        ? displayCategory(categoryName)
        : null;
    const pageTitle = isCategoryPage
        ? localizedCategory || 'উদ্যোগ'
        : 'সব উদ্যোগ';
    const pageEyebrow = isCategoryPage ? 'সহায়তার ক্ষেত্র' : 'চলমান উদ্যোগ';
    const pageDescription = isCategoryPage
        ? localizedCategory
            ? `${localizedCategory} সম্পর্কিত চলমান উদ্যোগগুলো দেখুন এবং আপনার সামর্থ্য অনুযায়ী মানুষের পাশে দাঁড়ান।`
            : 'এই সহায়তার ক্ষেত্রের উদ্যোগগুলো এই মুহূর্তে পাওয়া যাচ্ছে না।'
        : 'মানুষের জরুরি প্রয়োজন ও দীর্ঘমেয়াদি পরিবর্তনের জন্য চলমান উদ্যোগগুলো দেখুন এবং আপনার সামর্থ্য অনুযায়ী পাশে দাঁড়ান।';

    const heroImage = getImage(campaigns[0]);
    const secondaryHeroImage = getImage(campaigns[1] || campaigns[0]);
    const filteredCampaigns = useMemo(() => {
        const query = normalizeSearch(searchQuery);
        if (!query) return campaigns;
        const terms = query.split(' ');
        return campaigns.filter((campaign) => {
            const haystack = normalizeSearch(searchableText(campaign));
            return terms.every((term) => haystack.includes(term));
        });
    }, [campaigns, searchQuery]);
    const totalPages = Math.ceil(filteredCampaigns.length / PER_PAGE);
    const paginatedCampaigns = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filteredCampaigns.slice(start, start + PER_PAGE);
    }, [filteredCampaigns, currentPage]);
    const pages = useMemo(() => {
        if (totalPages <= 5)
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, '…', totalPages];
        if (currentPage >= totalPages - 2)
            return [
                1,
                '…',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        return [
            1,
            '…',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '…',
            totalPages,
        ];
    }, [currentPage, totalPages]);
    const scrollToCampaigns = () =>
        document
            .getElementById('campaign-list')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };
    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };
    const changePage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        window.requestAnimationFrame(scrollToCampaigns);
    };

    return (
        <main className="min-h-screen overflow-x-clip bg-surface">
            <section className="section-gap mt-8 sm:mt-12 lg:mt-16">
                <div className="container-width">
                    <div className="relative isolate overflow-hidden">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-[0.13]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle, rgba(52,45,37,.16) .55px, transparent .7px)',
                                backgroundSize: '11px 11px',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/50 via-transparent to-[#d9ccb5]/20"
                        />
                        <div className="relative z-10 grid items-center lg:min-h-120 lg:grid-cols-[0.95fr_1.05fr]">
                            <div className="relative z-20 flex flex-col justify-center px-4 py-9 sm:px-8 sm:py-12 lg:px-10 xl:px-12">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-px w-8 bg-accent" />
                                    <span className="font-bengali text-xs font-semibold text-accent">
                                        {pageEyebrow}
                                    </span>
                                </div>
                                <h1 className="max-w-155 font-bengali text-[clamp(2.15rem,6.5vw,4.5rem)] font-medium leading-[1.2] tracking-[-0.035em] text-text-primary">
                                    <span className="block">মানুষের পাশে</span>
                                    <span className="block">দাঁড়ানোর</span>
                                    <span className="block text-accent">
                                        গল্পগুলো
                                    </span>
                                </h1>
                                <p className="mt-5 max-w-110 font-bengali text-sm leading-[1.9] text-text-secondary sm:text-base">
                                    {pageDescription}
                                </p>
                                <button
                                    type="button"
                                    onClick={scrollToCampaigns}
                                    className="group mt-8 flex w-fit items-center gap-3 font-bengali text-sm font-semibold text-text-primary sm:mt-10"
                                >
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:scale-105">
                                        <HiArrowSmRight className="text-xl transition-transform group-hover:translate-x-1" />
                                    </span>
                                    একটি উদ্যোগ খুঁজুন{' '}
                                    <span className="h-px w-7 bg-text-primary/30 transition-all group-hover:w-12" />
                                </button>
                            </div>
                            <div className="relative mx-auto h-75 w-full max-w-140 sm:h-97.5 lg:h-120 lg:max-w-none">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-y-[12%] left-[16%] w-[60%] -rotate-2 bg-[#e9e0d0]"
                                />
                                <div
                                    className="absolute inset-y-[11%] left-[19%] z-10 w-[58%] rotate-1 overflow-hidden bg-[#ddd2bf] shadow-[0_16px_40px_rgba(52,43,34,.14)]"
                                    style={{
                                        clipPath:
                                            'polygon(1% 1%,97% 0%,100% 5%,98% 16%,100% 29%,98% 43%,100% 58%,98% 74%,100% 91%,97% 99%,83% 97%,70% 100%,55% 97%,41% 100%,26% 97%,12% 100%,1% 97%,2% 82%,0% 66%,2% 50%,0% 34%,2% 17%)',
                                    }}
                                >
                                    <img
                                        src={heroImage}
                                        alt="মানুষের পাশে দাঁড়ানোর উদ্যোগ"
                                        onError={imageFallback}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute left-[3%] top-[12%] z-20 w-27.5 -rotate-4 bg-[#eee6d6] px-3 py-4 shadow-md sm:w-36.25 sm:px-4 sm:py-5">
                                    <p className="font-bengali text-xs leading-[1.75] text-text-secondary sm:text-sm">
                                        ছোট সহায়তাও
                                        <br />
                                        বড় পরিবর্তন
                                        <br />
                                        আনে
                                    </p>
                                </div>
                                <div className="absolute right-[5%] top-[17%] z-20 w-[29%] rotate-[4deg] bg-[#f2ebdf] p-1.5 shadow-[0_14px_30px_rgba(42,34,27,.17)] sm:p-2.5">
                                    <div className="aspect-[0.92/1] overflow-hidden">
                                        <img
                                            src={secondaryHeroImage}
                                            alt="মানবিক উদ্যোগের আরেকটি দৃশ্য"
                                            onError={imageFallback}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="absolute bottom-[9%] right-[4%] z-30 w-28.75 rotate-2 bg-[#eee6d6] px-3 py-3 sm:w-37.5 sm:px-4 sm:py-4">
                                    <p className="text-center font-bengali text-xs leading-[1.8] text-text-secondary sm:text-sm">
                                        মানুষ থেকে
                                        <br />
                                        মানুষের সহায়তা
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="campaign-list"
                className="container-width scroll-mt-24 pb-2"
            >
                {!loading && !error && (
                    <header>
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)] lg:items-end lg:gap-12">
                            <div>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="h-px w-9 bg-accent" />
                                    <span className="font-bengali text-xs font-semibold text-primary">
                                        {pageEyebrow}
                                    </span>
                                </div>
                                <h2 className="font-bengali text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-text-primary">
                                    {pageTitle}
                                </h2>
                            </div>
                            <p className="max-w-xl font-bengali text-sm leading-[1.9] text-text-secondary">
                                {pageDescription}
                            </p>
                        </div>

                        {/* Search UI */}

                        <div className="mt-9 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                            <div className="group relative w-full min-w-0 sm:max-w-125">
                                <HiOutlineSearch
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-primary transition-transform duration-200 group-focus-within:scale-110"
                                />

                                <input
                                    id="campaign-search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="নাম বা বিষয় দিয়ে উদ্যোগ খুঁজুন"
                                    aria-label="উদ্যোগ অনুসন্ধান"
                                    autoComplete="off"
                                    className="h-12 w-full appearance-none border-0 border-b border-border bg-transparent py-2 pl-9 pr-10 font-bengali text-sm text-text-primary outline-none! ring-0 transition-colors placeholder:text-text-muted/70! focus:border-border! focus:outline-none! focus:ring-0! focus-visible:outline-none! focus-visible:ring-0! sm:h-13 sm:text-base [&::-webkit-search-cancel-button]:hidden"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="অনুসন্ধান মুছুন"
                                        className="absolute right-0 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-text-muted transition-colors hover:text-primary"
                                    >
                                        <HiX
                                            aria-hidden="true"
                                            className="text-lg"
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="flex shrink-0 items-center gap-2 font-bengali text-xs text-text-muted sm:text-sm">
                                <span className="size-1.5 rounded-full bg-accent" />
                                <span>
                                    {searchQuery.trim()
                                        ? `${bn(filteredCampaigns.length)}টি উদ্যোগ পাওয়া গেছে`
                                        : `মোট ${bn(campaigns.length)}টি উদ্যোগ`}
                                </span>
                            </div>
                        </div>
                    </header>
                )}

                {loading && (
                    <div
                        role="status"
                        aria-label="উদ্যোগগুলো লোড হচ্ছে"
                        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12"
                    >
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className={
                                    item % 3 === 0
                                        ? 'lg:col-span-7'
                                        : 'lg:col-span-5'
                                }
                            >
                                <div className="h-85 animate-pulse rounded-xl bg-black/5 sm:h-105" />
                            </div>
                        ))}
                        <span className="sr-only">উদ্যোগগুলো লোড হচ্ছে…</span>
                    </div>
                )}
                {!loading && error && (
                    <div
                        className="mt-10 border-y border-red-200 px-4 py-16 text-center sm:py-20"
                        role="alert"
                    >
                        <HiOutlineExclamationCircle className="mx-auto text-3xl text-red-600" />
                        <h3 className="mt-4 font-bengali text-xl font-semibold text-text-primary">
                            উদ্যোগগুলো লোড করা যায়নি
                        </h3>
                        <p className="mx-auto mt-3 max-w-lg font-bengali text-sm leading-[1.9] text-text-secondary">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={retry}
                            className="mt-6 rounded-full border border-red-600 px-6 py-3 font-bengali text-sm font-semibold text-red-700 transition-colors hover:bg-red-600 hover:text-white"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}
                {!loading && !error && filteredCampaigns.length > 0 && (
                    <>
                        <div className="mt-8 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-12">
                            {paginatedCampaigns.map((campaign, index) => {
                                const isLast =
                                    index === paginatedCampaigns.length - 1;
                                const isOddLast =
                                    isLast &&
                                    paginatedCampaigns.length % 2 !== 0;
                                const isWide =
                                    index % 4 === 0 || index % 4 === 3;
                                return (
                                    <div
                                        key={campaign.id}
                                        className={`min-w-0 ${isOddLast ? 'md:col-span-2 lg:col-span-12' : isWide ? 'lg:col-span-7' : 'lg:col-span-5'}`}
                                    >
                                        <CampaignCard
                                            campaign={campaign}
                                            index={
                                                (currentPage - 1) * PER_PAGE +
                                                index
                                            }
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
                        {totalPages > 1 && (
                            <nav
                                aria-label="উদ্যোগের পৃষ্ঠা নির্বাচন"
                                className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:mt-14 sm:gap-2"
                            >
                                <button
                                    type="button"
                                    aria-label="আগের পৃষ্ঠা"
                                    disabled={currentPage === 1}
                                    onClick={() => changePage(currentPage - 1)}
                                    className="flex size-10 items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:size-11"
                                >
                                    <HiArrowSmLeft className="text-xl" />
                                </button>
                                {pages.map((page, index) =>
                                    page === '…' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            aria-hidden="true"
                                            className="flex h-10 min-w-5 items-center justify-center text-text-muted"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            type="button"
                                            aria-label={`${bn(page)} নম্বর পৃষ্ঠা`}
                                            aria-current={
                                                currentPage === page
                                                    ? 'page'
                                                    : undefined
                                            }
                                            onClick={() => changePage(page)}
                                            className={`flex size-10 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:size-11 ${currentPage === page ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background-alt hover:text-primary'}`}
                                        >
                                            {bn(String(page).padStart(2, '0'))}
                                        </button>
                                    ),
                                )}
                                <button
                                    type="button"
                                    aria-label="পরের পৃষ্ঠা"
                                    disabled={currentPage === totalPages}
                                    onClick={() => changePage(currentPage + 1)}
                                    className="flex size-10 items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:size-11"
                                >
                                    <HiArrowSmRight className="text-xl" />
                                </button>
                            </nav>
                        )}
                    </>
                )}
                {!loading &&
                    !error &&
                    campaigns.length > 0 &&
                    filteredCampaigns.length === 0 && (
                        <div
                            className="mt-8 border-y border-border px-4 py-14 text-center sm:py-20"
                            role="status"
                        >
                            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-background-alt text-text-muted">
                                <HiOutlineSearch
                                    aria-hidden="true"
                                    className="text-2xl"
                                />
                            </div>
                            <h3 className="mt-5 font-bengali text-xl font-semibold text-text-primary sm:text-2xl">
                                কোনো মিল পাওয়া যায়নি
                            </h3>
                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-[1.9] text-text-secondary">
                                অন্য কোনো শব্দ দিয়ে খুঁজে দেখুন অথবা অনুসন্ধান
                                মুছে সব উদ্যোগ দেখুন।
                            </p>
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="mt-6 rounded-full bg-primary px-6 py-3 font-bengali text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            >
                                সব উদ্যোগ দেখুন
                            </button>
                        </div>
                    )}
                {!loading && !error && campaigns.length === 0 && (
                    <div className="mt-10 border-y border-border px-4 py-16 text-center sm:py-20">
                        <div className="mx-auto h-px w-12 bg-accent" />
                        <p className="mt-5 font-bengali text-xs font-semibold text-primary">
                            এই মুহূর্তে কোনো উদ্যোগ নেই
                        </p>
                        <h3 className="mx-auto mt-4 max-w-2xl font-bengali text-xl font-semibold leading-[1.6] text-text-primary sm:text-2xl">
                            {isCategoryPage
                                ? localizedCategory
                                    ? `${localizedCategory} বিভাগে এখন কোনো চলমান উদ্যোগ নেই।`
                                    : 'এই সহায়তার ক্ষেত্রটি খুঁজে পাওয়া যায়নি।'
                                : 'এই মুহূর্তে কোনো চলমান উদ্যোগ প্রকাশিত হয়নি।'}
                        </h3>
                        <p className="mx-auto mt-4 max-w-md font-bengali text-sm leading-[1.9] text-text-secondary">
                            নতুন উদ্যোগ প্রকাশিত হলে এখানে দেখা যাবে।
                        </p>
                    </div>
                )}
            </section>
            <div className="mt-16 sm:mt-20 lg:mt-24">
                <HeroSection />
            </div>
        </main>
    );
};

export default Campaigns;
