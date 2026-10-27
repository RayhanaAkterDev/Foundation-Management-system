import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, HeartHandshake, Siren } from 'lucide-react';

/* ---------------------------------------
   DATA HELPERS
--------------------------------------- */

const isEnabled = (value) => value === true || value === 1 || value === '1';

const getCampaignImage = (campaign) =>
    campaign?.cover_image_url ||
    campaign?.cover_image ||
    campaign?.banner_url ||
    campaign?.banner ||
    campaign?.image_url ||
    campaign?.image ||
    null;

const getCampaignDescription = (campaign) =>
    campaign?.shortDescription ||
    campaign?.short_description ||
    campaign?.description ||
    '';

const getProgress = (campaign) => {
    const goal = Number(campaign?.target_amount ?? campaign?.goal_amount ?? 0);
    const collected = Number(campaign?.collected_amount ?? 0);

    if (
        !Number.isFinite(goal) ||
        !Number.isFinite(collected) ||
        goal <= 0 ||
        collected < 0
    ) {
        return null;
    }

    return Math.min(100, Math.round((collected / goal) * 100));
};

const toBangla = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

const formatCurrency = (amount) =>
    `৳${toBangla(Number(amount || 0).toLocaleString('en-BD'))}`;

/* ---------------------------------------
   SUPPORTING CAMPAIGN ITEM
--------------------------------------- */

const SupportingCampaignItem = ({ campaign }) => {
    const image = getCampaignImage(campaign);

    const priority = Number(
        campaign.urgency_priority ?? campaign.priority ?? 2,
    );

    return (
        <Link
            to={`/campaign/${campaign.id}`}
            className="group flex h-full min-h-0 min-w-0 items-center gap-3 border-b border-border py-3 last:border-b-0 sm:gap-4 lg:py-2.5 xl:py-3"
        >
            {/* Image */}
            <div className="h-[76px] w-[92px] shrink-0 overflow-hidden bg-[#e5ede8] sm:h-[92px] sm:w-[116px] lg:h-[76px] lg:w-[92px] xl:h-[90px] xl:w-[112px]">
                {image ? (
                    <img
                        src={image}
                        alt={campaign.title || 'জরুরি উদ্যোগ'}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <HeartHandshake
                            size={25}
                            strokeWidth={1.4}
                            className="text-[#86a79a]"
                        />
                    </div>
                )}
            </div>

            {/* Content aligned to image height */}
            <div className="flex h-[76px] min-w-0 flex-1 flex-col justify-between py-0.5 sm:h-[92px] lg:h-[76px] xl:h-[90px]">
                <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <span className="font-bengali text-[10px] font-semibold text-primary">
                            জরুরি সহায়তা
                        </span>

                        {priority === 1 && (
                            <span className="font-bengali text-[10px] font-semibold text-[#aa742f]">
                                · সর্বোচ্চ অগ্রাধিকার
                            </span>
                        )}
                    </div>

                    <h4 className="line-clamp-2 font-bengali text-[12px] font-semibold leading-[1.5] text-text-primary transition-colors group-hover:text-primary sm:text-[14px] lg:text-[12px] xl:text-[14px]">
                        {campaign.title}
                    </h4>
                </div>

                <span className="inline-flex w-fit items-center gap-1 font-bengali text-[10px] font-semibold text-primary sm:text-[11px]">
                    বিস্তারিত দেখুন
                    <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </span>
            </div>
        </Link>
    );
};

/* ---------------------------------------
   RESPONSIVE FITTED LIST

   Measures the available height and shows
   only complete items that fit inside it.
--------------------------------------- */

const SupportingCampaignList = ({ campaigns }) => {
    const panelRef = useRef(null);
    const headingRef = useRef(null);
    const footerRef = useRef(null);
    const listRef = useRef(null);

    const [visibleCount, setVisibleCount] = useState(campaigns.length);

    const measure = useCallback(() => {
        const panel = panelRef.current;
        const heading = headingRef.current;
        const footer = footerRef.current;
        const list = listRef.current;

        if (!panel || !heading || !footer || !list) {
            return;
        }

        // Below desktop, all items can be shown.
        if (window.innerWidth < 1024) {
            setVisibleCount(campaigns.length);
            return;
        }

        const availableHeight =
            panel.clientHeight - heading.offsetHeight - footer.offsetHeight;

        if (availableHeight <= 0) {
            setVisibleCount(0);
            return;
        }

        const items = Array.from(list.children);
        let usedHeight = 0;
        let count = 0;

        for (const item of items) {
            const height = item.getBoundingClientRect().height;

            if (usedHeight + height > availableHeight + 1) {
                break;
            }

            usedHeight += height;
            count += 1;
        }

        setVisibleCount(count);
    }, [campaigns.length]);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            measure();
        });

        if (panelRef.current) {
            observer.observe(panelRef.current);
        }

        if (headingRef.current) {
            observer.observe(headingRef.current);
        }

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        const onResize = () => measure();

        window.addEventListener('resize', onResize);

        // Recalculate after initial layout.
        const frame = requestAnimationFrame(measure);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(frame);
        };
    }, [measure]);

    // Recalculate when campaign content changes.
    useEffect(() => {
        const frame = requestAnimationFrame(measure);
        return () => cancelAnimationFrame(frame);
    }, [campaigns, measure]);

    return (
        <div
            ref={panelRef}
            className="flex min-h-0 min-w-0 flex-col lg:absolute lg:inset-0"
        >
            {/* Heading */}
            <div
                ref={headingRef}
                className="flex shrink-0 items-end justify-between gap-3 border-b border-border pb-4"
            >
                <div>
                    <p className="font-bengali text-[11px] font-medium text-[#a57536]">
                        আরও যেসব উদ্যোগে সহায়তা জরুরি
                    </p>

                    <h3 className="mt-1 font-bengali text-[17px] font-semibold leading-[1.5] text-text-primary xl:text-[19px]">
                        আপনার সহায়তার অপেক্ষায়
                    </h3>
                </div>

                <span className="shrink-0 font-bengali text-[12px] font-semibold text-primary">
                    {toBangla(campaigns.length)}টি
                </span>
            </div>

            {/*
                Measurement layer:
                all items stay mounted so actual row heights
                can be measured accurately.
            */}
            <div
                ref={listRef}
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 w-full opacity-0"
                style={{ visibility: 'hidden' }}
            >
                {campaigns.map((campaign) => (
                    <SupportingCampaignItem
                        key={campaign.id}
                        campaign={campaign}
                    />
                ))}
            </div>

            {/* Visible list */}
            <div className="min-h-0 flex-1 overflow-hidden">
                {campaigns.length > 0 ? (
                    <div className="divide-y-0">
                        {campaigns.slice(0, visibleCount).map((campaign) => (
                            <SupportingCampaignItem
                                key={campaign.id}
                                campaign={campaign}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-8">
                        <p className="font-bengali text-[13px] font-medium text-text-primary">
                            আপাতত এটিই প্রধান জরুরি উদ্যোগ।
                        </p>

                        <p className="mt-2 font-bengali text-[12px] leading-6 text-text-secondary">
                            নতুন জরুরি উদ্যোগ যুক্ত হলে এখানে দেখা যাবে।
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {campaigns.length > 0 && (
                <Link
                    ref={footerRef}
                    to="/campaigns"
                    className="group mt-auto flex shrink-0 items-center justify-between gap-3 border-t border-border py-4 font-bengali text-[12px] font-semibold text-primary"
                >
                    <span>সব জরুরি উদ্যোগ দেখুন</span>

                    <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </Link>
            )}
        </div>
    );
};

/* ---------------------------------------
   MAIN URGENT SECTION
--------------------------------------- */

const UrgentSection = ({ campaigns = [], loading = false, error = null }) => {
    const urgentCampaigns = (Array.isArray(campaigns) ? campaigns : [])
        .filter(Boolean)
        .filter((campaign) => isEnabled(campaign.is_urgent))
        .sort(
            (a, b) =>
                Number(a.urgency_priority ?? a.priority ?? 2) -
                Number(b.urgency_priority ?? b.priority ?? 2),
        )
        .slice(0, 5);

    const mainCampaign = urgentCampaigns[0];
    const supportingCampaigns = urgentCampaigns.slice(1);

    const mainProgress = mainCampaign ? getProgress(mainCampaign) : null;

    return (
        <section className="section-gap mt-20 border-y border-border bg-background-alt/40">
            <div className="container-width">
                {/* =====================================
                    SECTION HEADING
                ===================================== */}

                <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-11">
                    <div className="min-w-0 max-w-[740px] flex-1">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-[6px] w-[6px] bg-[#e4a33f]" />

                            <span className="font-bengali text-[12px] font-semibold text-[#a57536]">
                                জরুরি মানবিক সহায়তা
                            </span>
                        </div>

                        <h2 className="font-bengali text-[clamp(1.8rem,3vw,2.75rem)] font-semibold leading-[1.4] tracking-[-0.025em] text-text-primary">
                            কিছু সহায়তা আজই প্রয়োজন
                        </h2>

                        <p className="mt-3 max-w-[620px] font-bengali text-[13px] leading-[1.95] text-text-secondary sm:text-[14px]">
                            চিকিৎসা, দুর্যোগ ও সংকটের মুহূর্তে দ্রুত সহায়তা
                            পৌঁছানো জরুরি। অগ্রাধিকারপ্রাপ্ত উদ্যোগগুলো দেখুন
                            এবং পাশে দাঁড়ান।
                        </p>
                    </div>

                    {urgentCampaigns.length > 0 && (
                        <Link
                            to="/campaigns"
                            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-primary/30 pb-1.5 font-bengali text-[12px] font-semibold text-primary transition-colors hover:border-primary sm:text-[13px]"
                        >
                            সব জরুরি উদ্যোগ
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>
                    )}
                </div>

                {/* =====================================
                    CONTENT
                ===================================== */}

                {loading ? (
                    <div
                        className="grid animate-pulse gap-7 lg:grid-cols-12 lg:gap-8"
                        role="status"
                        aria-label="জরুরি উদ্যোগ লোড হচ্ছে"
                    >
                        <div className="overflow-hidden border border-border bg-surface lg:col-span-7">
                            <div className="aspect-[16/10] bg-[#e2eae6] sm:aspect-[16/9]" />
                            <div className="space-y-4 p-6">
                                <div className="h-3 w-4/5 bg-[#e2eae6]" />
                                <div className="h-3 w-3/5 bg-[#e2eae6]" />
                                <div className="mt-8 h-7 w-1/3 bg-[#e2eae6]" />
                                <div className="h-1.5 w-full bg-[#e2eae6]" />
                            </div>
                        </div>
                        <div className="space-y-5 lg:col-span-5">
                            <div className="h-12 w-2/3 bg-[#e2eae6]" />
                            {[0, 1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-4 border-b border-border pb-4"
                                >
                                    <div className="h-[76px] w-[92px] shrink-0 bg-[#e2eae6]" />
                                    <div className="flex-1 space-y-3 py-2">
                                        <div className="h-3 w-3/4 bg-[#e2eae6]" />
                                        <div className="h-3 w-full bg-[#e2eae6]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <span className="sr-only">জরুরি উদ্যোগ লোড হচ্ছে…</span>
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="border-y border-border py-14 text-center"
                    >
                        <p className="font-bengali text-[16px] font-semibold text-text-primary">
                            জরুরি উদ্যোগগুলো এখন দেখানো যাচ্ছে না
                        </p>
                        <p className="mt-2 font-bengali text-[13px] text-text-secondary">
                            অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
                        </p>
                    </div>
                ) : mainCampaign ? (
                    <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-12 lg:gap-8 xl:gap-10">
                        {/* =====================================
                            LEFT MAIN CAMPAIGN
                        ===================================== */}

                        <Link
                            to={`/campaign/${mainCampaign.id}`}
                            className="group flex min-w-0 flex-col overflow-hidden border border-border bg-surface transition-colors hover:border-primary/40 lg:col-span-7"
                        >
                            {/* Main image */}
                            <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-background-alt sm:aspect-[16/9] lg:aspect-[16/10] xl:aspect-[16/9]">
                                {getCampaignImage(mainCampaign) ? (
                                    <img
                                        src={getCampaignImage(mainCampaign)}
                                        alt={
                                            mainCampaign.title || 'জরুরি উদ্যোগ'
                                        }
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#e2eae4]">
                                        <HeartHandshake
                                            size={42}
                                            strokeWidth={1.3}
                                            className="text-[#7a9b8c]"
                                        />
                                    </div>
                                )}

                                {/* Image overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071b17]/90 via-[#071b17]/25 to-transparent" />

                                {/* Badge */}
                                <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                                    <span className="inline-flex items-center gap-2 border border-white/20 bg-[#fffaf0] px-3 py-2 font-bengali text-[11px] font-semibold text-[#a56824] sm:text-[12px]">
                                        <Siren size={14} strokeWidth={1.8} />
                                        জরুরি সহায়তা প্রয়োজন
                                    </span>
                                </div>

                                {/* Arrow */}
                                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-white text-primary transition-colors group-hover:bg-primary group-hover:text-white sm:right-6 sm:top-6">
                                    <ArrowUpRight size={18} />
                                </span>

                                {/* Main title */}
                                <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-16 sm:px-7 sm:pb-7">
                                    <p
                                        className="mb-2 font-bengali text-[11px] font-semibold text-[#f3c47d] sm:text-[12px]"
                                        style={{ color: '#f3c47d' }}
                                    >
                                        অগ্রাধিকারপ্রাপ্ত মানবিক উদ্যোগ
                                    </p>

                                    <h3
                                        className="line-clamp-3 max-w-[560px] font-bengali text-[clamp(1.25rem,2.1vw,1.9rem)] font-semibold leading-[1.5] !text-white"
                                        style={{ color: '#ffffff' }}
                                    >
                                        {mainCampaign.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Main card content */}
                            <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                                {getCampaignDescription(mainCampaign) && (
                                    <p className="line-clamp-2 font-bengali text-[13px] leading-[1.9] text-text-secondary sm:text-[14px]">
                                        {getCampaignDescription(mainCampaign)}
                                    </p>
                                )}

                                {/* Funding */}
                                {mainProgress !== null && (
                                    <div className="mt-auto pt-5">
                                        <div className="border-t border-border pt-5">
                                            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
                                                <div>
                                                    <p className="font-bengali text-[11px] text-text-secondary">
                                                        এখন পর্যন্ত সংগৃহীত
                                                    </p>

                                                    <p className="mt-1.5 text-[24px] font-semibold leading-none tracking-tight text-primary sm:text-[27px]">
                                                        {formatCurrency(
                                                            mainCampaign.collected_amount,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="font-bengali text-[11px] text-text-secondary">
                                                        মোট লক্ষ্যমাত্রা
                                                    </p>

                                                    <p className="mt-1.5 text-[17px] font-semibold leading-none text-text-primary">
                                                        {formatCurrency(
                                                            mainCampaign.target_amount ??
                                                                mainCampaign.goal_amount,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <div
                                                    className="h-[5px] overflow-hidden bg-[#e3ece5]"
                                                    role="progressbar"
                                                    aria-label="অনুদান সংগ্রহের অগ্রগতি"
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={mainProgress}
                                                >
                                                    <div
                                                        className="h-full bg-primary transition-[width] duration-500"
                                                        style={{
                                                            width: `${mainProgress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <div className="mt-2.5 flex items-center justify-between gap-3">
                                                    <span className="font-bengali text-[11px] text-text-secondary">
                                                        সহায়তা সংগ্রহের অগ্রগতি
                                                    </span>

                                                    <span className="font-bengali text-[12px] font-semibold text-primary">
                                                        {toBangla(mainProgress)}
                                                        % সম্পন্ন
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                                    <span className="inline-flex items-center gap-2 font-bengali text-[12px] font-semibold text-primary sm:text-[13px]">
                                        <HeartHandshake
                                            size={17}
                                            strokeWidth={1.8}
                                        />
                                        সহায়তার হাত বাড়ান
                                    </span>

                                    <span className="inline-flex items-center gap-1.5 font-bengali text-[12px] font-semibold text-text-primary transition-colors group-hover:text-primary">
                                        বিস্তারিত দেখুন
                                        <ArrowUpRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* =====================================
                            RIGHT — HEIGHT-MATCHED LIST
                        ===================================== */}

                        <div className="relative min-w-0 lg:col-span-5 lg:self-stretch">
                            <SupportingCampaignList
                                campaigns={supportingCampaigns}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="border-y border-border px-5 py-12 text-center sm:py-16">
                        <HeartHandshake
                            size={30}
                            strokeWidth={1.4}
                            className="mx-auto mb-4 text-primary"
                        />

                        <h3 className="font-bengali text-[19px] font-semibold text-text-primary">
                            এই মুহূর্তে কোনো জরুরি উদ্যোগ নেই
                        </h3>

                        <p className="mx-auto mt-3 max-w-md font-bengali text-[13px] leading-[1.9] text-text-secondary">
                            নতুন কোনো যাচাইকৃত উদ্যোগ জরুরি হিসেবে চিহ্নিত হলে
                            এখানে দেখানো হবে।
                        </p>

                        <Link
                            to="/campaigns"
                            className="mt-6 inline-flex items-center gap-2 font-bengali text-[13px] font-semibold text-primary"
                        >
                            সব ক্যাম্পেইন দেখুন
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UrgentSection;
