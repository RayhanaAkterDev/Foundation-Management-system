import React from 'react';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import FeaturedCampaignCard from '@/pages/public/campaignsPage/sections/FeaturedCampaignCard';

const isEnabled = (value) => value === true || value === 1 || value === '1';

const toBanglaNumber = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const FeaturedSection = ({ campaigns = [], loading = false, error = null }) => {
    const featured = (Array.isArray(campaigns) ? campaigns : [])
        .filter(Boolean)
        .filter((campaign) => isEnabled(campaign.is_featured))
        .slice(0, 3);

    return (
        <section
            className="
        section-gap relative w-full
        overflow-hidden
      "
            aria-labelledby="featured-campaigns-title"
        >
            <div className="container-width mx-auto min-w-0">
                {/* SECTION HEADER */}
                <div
                    className="
            mb-8 flex flex-col gap-6
            sm:mb-10
            lg:mb-12 lg:flex-row
            lg:items-end lg:justify-between
            lg:gap-12
          "
                >
                    <div className="min-w-0 max-w-[760px]">
                        {/* Eyebrow */}
                        <div className="mb-4 flex items-center gap-3">
                            <span
                                className="
                  h-px w-7 shrink-0
                  bg-[#0f766e]
                  sm:w-9
                "
                            />

                            <span
                                className="
                  font-bengali text-[11px]
                  font-semibold tracking-wide
                  !text-[#0f766e]
                  sm:text-[12px]
                "
                            >
                                নির্বাচিত ক্যাম্পেইন
                            </span>
                        </div>

                        {/* Heading */}
                        <h2
                            id="featured-campaigns-title"
                            className="
                font-bengali text-[27px]
                font-semibold leading-[1.4]
                tracking-[-0.025em]
                !text-[#0f172a]
                sm:text-[32px]
                md:text-[36px]
                lg:text-[39px]
                xl:text-[40px]
              "
                        >
                            মানুষের পাশে, প্রতিদিন
                        </h2>

                        {/* Description */}
                        <p
                            className="
                mt-4 max-w-[570px]
                font-bengali text-[13px]
                leading-[1.9]
                !text-[#64748b]
                sm:mt-5 sm:text-[14px]
                lg:text-[15px]
              "
                        >
                            যাচাইকৃত উদ্যোগগুলোর মধ্য থেকে বাছাই করা কিছু
                            প্রচেষ্টা— যেখানে আপনার অংশগ্রহণ সরাসরি মানুষের
                            জীবনে প্রভাব ফেলতে পারে।
                        </p>
                    </div>

                    {/* Header link */}
                    {featured.length > 0 && (
                        <Link
                            to="/campaigns/featured"
                            className="
                group inline-flex w-fit shrink-0
                items-center gap-2.5
                border-b border-[#0f766e]/30
                pb-2
                font-bengali text-[12px]
                font-semibold !text-[#0f766e]
                transition-colors duration-300
                hover:border-[#0f766e]
                sm:text-[13px]
                lg:mb-1
              "
                        >
                            সব নির্বাচিত উদ্যোগ
                            <ArrowUpRight
                                size={16}
                                className="
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
                            />
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div
                        className="grid animate-pulse grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                        role="status"
                        aria-label="নির্বাচিত উদ্যোগ লোড হচ্ছে"
                    >
                        {[0, 1, 2].map((item) => (
                            <div
                                key={item}
                                className="min-w-0 border border-border bg-surface p-5"
                            >
                                <div className="mb-6 h-3 w-2/5 bg-[#e2eae6]" />
                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-full bg-[#e2eae6]" />
                                        <div className="h-4 w-4/5 bg-[#e2eae6]" />
                                    </div>
                                    <div className="h-20 w-20 shrink-0 bg-[#e2eae6]" />
                                </div>
                                <div className="mt-8 h-3 w-4/5 bg-[#e2eae6]" />
                                <div className="mt-8 h-6 w-1/3 bg-[#e2eae6]" />
                                <div className="mt-4 h-1 w-full bg-[#e2eae6]" />
                            </div>
                        ))}
                        <span className="sr-only">
                            নির্বাচিত উদ্যোগ লোড হচ্ছে…
                        </span>
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="border-y border-border py-14 text-center"
                    >
                        <p className="font-bengali text-[16px] font-semibold text-text-primary">
                            নির্বাচিত উদ্যোগগুলো এখন দেখানো যাচ্ছে না
                        </p>
                        <p className="mt-2 font-bengali text-[13px] text-text-secondary">
                            অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
                        </p>
                    </div>
                ) : featured.length > 0 ? (
                    <>
                        {/* CAMPAIGN GRID */}
                        <div
                            className="
                grid min-w-0
                grid-cols-1
                gap-5
                sm:grid-cols-2
                sm:gap-5
                lg:grid-cols-3
                lg:gap-6
                xl:gap-7
              "
                        >
                            {featured.map((campaign, index) => (
                                <div
                                    key={campaign.id ?? index}
                                    className="min-w-0"
                                >
                                    <FeaturedCampaignCard
                                        campaign={campaign}
                                        index={index}
                                        variant="hub"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* BOTTOM NAVIGATION */}
                        <div
                            className="
                mt-9 flex flex-col
                items-center gap-4
                sm:mt-11
                lg:mt-12
              "
                        >
                            <div
                                className="
                  flex items-center gap-3
                  font-bengali text-[11px]
                  !text-[#82918c]
                "
                            >
                                <span
                                    className="
                    h-px w-7 bg-[#cbd9d4]
                  "
                                />

                                <span>
                                    {toBanglaNumber(featured.length)}টি
                                    নির্বাচিত উদ্যোগ
                                </span>

                                <span
                                    className="
                    h-px w-7 bg-[#cbd9d4]
                  "
                                />
                            </div>

                            <Link
                                to="/campaigns/featured"
                                className="
                  group inline-flex min-h-12
                  items-center justify-center
                  gap-3 rounded-full
                  border border-[#c9ddd7]
                  bg-white
                  px-6 py-3
                  font-bengali text-[12px]
                  font-semibold !text-[#0f766e]
                  transition-all duration-300
                  hover:border-[#0f766e]
                  hover:bg-[#0f766e]
                  hover:!text-white
                  sm:px-8 sm:text-[13px]
                "
                            >
                                আরও নির্বাচিত উদ্যোগ দেখুন
                                <ArrowRight
                                    size={17}
                                    className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                                />
                            </Link>
                        </div>
                    </>
                ) : (
                    /* EMPTY STATE */
                    <div
                        className="
              flex flex-col items-center
              justify-center
              border-y border-[#e2e8e0]
              px-5 py-16
              text-center
              sm:py-20
            "
                    >
                        <span
                            className="
                mb-5 flex size-14
                items-center justify-center
                rounded-full bg-[#eaf4f2]
                !text-[#0f766e]
              "
                        >
                            <Star size={24} strokeWidth={1.6} />
                        </span>

                        <h3
                            className="
                font-bengali text-[20px]
                font-semibold !text-[#0f172a]
                sm:text-[23px]
              "
                        >
                            নতুন উদ্যোগের অপেক্ষায়
                        </h3>

                        <p
                            className="
                mt-3 max-w-[440px]
                font-bengali text-[13px]
                leading-[1.9]
                !text-[#64748b]
                sm:text-[14px]
              "
                        >
                            এই মুহূর্তে কোনো নির্বাচিত উদ্যোগ নেই। নতুন উদ্যোগ
                            যুক্ত হলে এখানে দেখতে পাবেন। এর মধ্যে অন্য মানবিক
                            উদ্যোগগুলো ঘুরে দেখতে পারেন।
                        </p>

                        <Link
                            to="/campaigns"
                            className="
                group mt-6 inline-flex
                items-center gap-2
                font-bengali text-[13px]
                font-semibold !text-[#0f766e]
                hover:underline
              "
                        >
                            সব উদ্যোগ দেখুন
                            <ArrowRight
                                size={16}
                                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
                            />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSection;
