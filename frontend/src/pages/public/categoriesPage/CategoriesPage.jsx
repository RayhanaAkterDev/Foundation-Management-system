import React, { useEffect, useState } from 'react';

import { ArrowRight } from 'lucide-react';

import { Link } from 'react-router-dom';

import { fetchCategories } from '@/api/categories';

import AllCategoriesView from './sections/AllCategoriesView';

const CategoryLoading = () => {
    return (
        <section
            className="bg-white"
            aria-label="সহায়তার ক্ষেত্রসমূহ লোড হচ্ছে"
        >
            <div className="section-gap container-width">
                {/* SECTION HEADING */}
                <div className="mb-9 flex items-end justify-between gap-8 sm:mb-11">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#07877e]" />

                            <span
                                className="
                                    font-bengali
                                    text-[13px]
                                    font-semibold
                                    leading-6
                                    !text-[#07877e]
                                    sm:text-[14px]
                                "
                            >
                                সহায়তার ক্ষেত্রসমূহ
                            </span>
                        </div>

                        <h2
                            className="
                                font-bengali
                                text-[1.8rem]
                                font-semibold
                                leading-[1.45]
                                tracking-[-0.025em]
                                !text-[#111c2d]
                                sm:text-[2.05rem]
                                lg:text-[2.25rem]
                            "
                        >
                            মানুষের প্রয়োজনের বিভিন্ন ক্ষেত্র
                        </h2>
                    </div>

                    <span
                        className="
                            hidden
                            shrink-0
                            font-bengali
                            text-[13px]
                            font-medium!
                            leading-6
                            !text-[#718096]
                            sm:block
                        "
                    >
                        ক্ষেত্রগুলো লোড হচ্ছে
                    </span>
                </div>

                {/* DESKTOP SKELETON */}
                <div
                    className="
                        hidden
                        md:grid
                        md:auto-rows-[68px]
                        md:grid-cols-12
                        md:gap-3
                        lg:auto-rows-[74px]
                    "
                    aria-hidden="true"
                >
                    {[
                        'md:col-span-5 md:row-span-6',
                        'md:col-span-4 md:row-span-4',
                        'md:col-span-3 md:row-span-4',
                        'md:col-span-3 md:row-span-4',
                        'md:col-span-4 md:row-span-5',
                        'md:col-span-5 md:row-span-4',
                        'md:col-span-3 md:row-span-5',
                        'md:col-span-4 md:row-span-4',
                        'md:col-span-3 md:row-span-4',
                        'md:col-span-5 md:row-span-4',
                        'md:col-span-4 md:row-span-4',
                    ].map((position, index) => (
                        <div
                            key={index}
                            className={`
                                min-h-0
                                animate-pulse
                                rounded-[2px]
                                bg-[#eef2f5]
                                ${position}
                            `}
                        >
                            <div className="h-full w-full bg-gradient-to-br from-[#f4f6f8] via-[#e9eef1] to-[#f4f6f8]" />
                        </div>
                    ))}
                </div>

                {/* MOBILE SKELETON */}
                <div className="md:hidden" aria-hidden="true">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div
                            key={index}
                            className="
                                flex
                                items-center
                                gap-4
                                border-b
                                border-[#dfe5eb]
                                py-4
                                first:border-t
                            "
                        >
                            <div
                                className="
                                    h-[82px]
                                    w-[104px]
                                    shrink-0
                                    animate-pulse
                                    rounded-[2px]
                                    bg-[#edf1f4]
                                "
                            />

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 h-3 w-24 animate-pulse rounded-sm bg-[#edf1f4]" />

                                <div className="h-5 w-32 max-w-full animate-pulse rounded-sm bg-[#e7ecef]" />
                            </div>

                            <div
                                className="
                                    h-10
                                    w-10
                                    shrink-0
                                    animate-pulse
                                    rounded-full
                                    bg-[#edf1f4]
                                "
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadCategories = async () => {
            try {
                setLoading(true);

                const data = await fetchCategories();

                if (cancelled) {
                    return;
                }

                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error('Failed to load categories:', error);
                setCategories([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            {/* =========================================================
                PAGE INTRO
            ========================================================== */}

            <section className="bg-white">
                <div
                    className="
                        container-width
                        section-gap
                        mt-20
                        grid
                        gap-12
                        lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.72fr)]
                        lg:items-end
                        lg:gap-24
                    "
                >
                    {/* LEFT */}

                    <div>
                        <div className="mb-7 flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="h-px w-10 bg-[#f59e0b]"
                            />

                            <span
                                className="
                                    font-bengali
                                    text-[13px]
                                    font-medium!
                                    leading-5
                                    !text-[#64748b]
                                "
                            >
                                সহায়তার ক্ষেত্রসমূহ
                            </span>
                        </div>

                        <h1
                            className="
                                max-w-[800px]
                                font-bengali
                                text-[2.25rem]
                                font-semibold
                                tracking-[-0.028em]
                                !text-[#0f1b2d]
                                leading-22!
                                sm:text-[2.85rem]
                                lg:text-[3.55rem]
                                xl:text-[3.9rem]
                            "
                        >
                            প্রয়োজনের গল্পগুলো ভিন্ন,
                            <br />
                            পাশে থাকার উদ্দেশ্য
                            <br />
                            <span className="text-[#0f766e]">এক</span>
                        </h1>
                    </div>

                    {/* RIGHT */}

                    <div
                        className="
                            lg:max-w-[460px]
                            lg:justify-self-end
                            lg:pb-1
                            xl:max-w-[490px]
                        "
                    >
                        <div className="border-l-2 border-[#0f766e]/20 pl-7 sm:pl-8">
                            <p
                                className="
                                    font-bengali
                                    text-[15px]
                                    font-normal
                                    leading-[2.15]
                                    !text-[#59697d]
                                    sm:text-[16px]
                                    sm:leading-[2.2]
                                "
                            >
                                মানুষের জরুরি ও দীর্ঘমেয়াদি প্রয়োজনকে ঘিরে
                                আমাদের সহায়তার ক্ষেত্রগুলো সাজানো হয়েছে।
                                প্রতিটি ক্ষেত্রের সঙ্গে যুক্ত উদ্যোগগুলো থেকে
                                আপনার জন্য উপযুক্ত অংশগ্রহণের সুযোগটি খুঁজে নিন।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                CATEGORIES
            ========================================================== */}

            {loading ? (
                <CategoryLoading />
            ) : (
                <AllCategoriesView categories={categories} />
            )}

            {/* =========================================================
                ACTIVE CAMPAIGNS CTA
            ========================================================== */}

            {!loading && (
                <section className="bg-white">
                    <div className="container-width section-gap">
                        <div
                            className="
                                grid
                                xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)]
                                lg:gap-16
                                xl:gap-24
                            "
                        >
                            {/* MAIN STATEMENT */}

                            <div className="relative">
                                <div className="mb-8 flex items-center gap-3 sm:mb-9">
                                    <span
                                        aria-hidden="true"
                                        className="h-2 w-2 rounded-full bg-[#f59e0b]"
                                    />

                                    <span
                                        className="
                                            font-bengali
                                            text-[12px]
                                            font-medium!
                                            leading-none
                                            tracking-[0.01em]
                                            !text-[#64748b]
                                            sm:text-[13px]
                                        "
                                    >
                                        এখন যেখানে প্রয়োজন
                                    </span>
                                </div>

                                <h2
                                    className="
                                        max-w-[800px]
                                        font-bengali
                                        text-[2.2rem]
                                        font-bold
                                        leading-[2.75rem]
                                        tracking-[-0.028em]
                                        !text-[#0f1b2d]
                                        sm:text-[2.8rem]
                                        sm:leading-[3.5rem]
                                        lg:text-[52px]
                                        lg:leading-[4.5rem]
                                        xl:text-[52px]
                                        xl:leading-[4.5rem]
                                    "
                                >
                                    একটি প্রয়োজনের পাশে
                                    <br />
                                    দাঁড়ানোর
                                    <span className="text-[#0f766e]">
                                        {' '}
                                        সুযোগ এখানেই।
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-7
                                        max-w-[650px]
                                        font-bengali
                                        text-[14px]
                                        font-normal
                                        leading-[2.1]
                                        !text-[#5e6c7d]
                                        sm:mt-8
                                        sm:text-[15px]
                                        sm:leading-[2.15]
                                    "
                                >
                                    অর্থ, সময় কিংবা নিজের দক্ষতা—আপনার সামর্থ্য
                                    অনুযায়ী মানুষের জীবনে বাস্তব পরিবর্তনের অংশ
                                    হতে পারেন। চলমান উদ্যোগগুলোর মধ্যে আপনার
                                    জন্য উপযুক্ত একটি সুযোগ খুঁজে নিন।
                                </p>
                            </div>

                            {/* ACTION AREA */}

                            <div className="flex lg:items-end">
                                <div
                                    className="
                                        w-full
                                        pt-10
                                        sm:pt-12
                                        lg:pt-0
                                        lg:pb-1
                                        xl:pb-2
                                    "
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            aria-hidden="true"
                                            className="h-px w-8 bg-[#0f766e]"
                                        />

                                        <span
                                            className="
                                                font-bengali
                                                text-[12px]
                                                font-medium!
                                                leading-none
                                                !text-[#64748b]
                                                sm:text-[13px]
                                            "
                                        >
                                            চলমান উদ্যোগ
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-6
                                            max-w-[320px]
                                            font-bengali
                                            text-[13px]
                                            font-normal
                                            leading-[2]
                                            !text-[#6b7888]
                                            sm:text-[14px]
                                            sm:leading-[2.05]
                                        "
                                    >
                                        যাচাই করা উদ্যোগগুলোর মধ্যে মানুষের
                                        বর্তমান প্রয়োজনের সঙ্গে যুক্ত একটি
                                        সুযোগ খুঁজে নিন।
                                    </p>

                                    <Link
                                        to="/campaigns"
                                        className="
                                            group
                                            mt-9
                                            inline-flex
                                            items-center
                                            gap-4
                                            sm:mt-10
                                        "
                                    >
                                        <span
                                            className="
                                                font-bengali
                                                text-[15px]
                                                font-medium!
                                                !text-[#0f766e]
                                                transition-colors
                                                duration-300
                                                group-hover:!text-[#115e59]
                                            "
                                        >
                                            সব উদ্যোগ দেখুন
                                        </span>

                                        <span
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#0f766e]
                                                text-white!
                                                shadow-sm
                                                transition-all
                                                duration-300
                                                group-hover:bg-[#115e59]
                                                group-hover:translate-x-1
                                            "
                                        >
                                            <ArrowRight
                                                size={16}
                                                strokeWidth={1.8}
                                            />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default CategoriesPage;
