import React, { useEffect, useState } from 'react';

import { ArrowRight } from 'lucide-react';

import { Link } from 'react-router-dom';

import { fetchCategories } from '@/api/categories';

import AllCategoriesView from './sections/AllCategoriesView';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const loadCategories = async () => {
            try {
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
            }
        };

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            {/* PAGE INTRO */}

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
                                    font-medium
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
                                sm:text-[2.85rem]
                                lg:text-[3.55rem]
                                xl:text-[3.9rem]
                                leading-22!
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

            {/* CATEGORIES */}

            <AllCategoriesView categories={categories} />

            {/* ACTIVE CAMPAIGNS CTA */}

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
                                        font-medium
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
                                অনুযায়ী মানুষের জীবনে বাস্তব পরিবর্তনের অংশ হতে
                                পারেন। চলমান উদ্যোগগুলোর মধ্যে আপনার জন্য
                                উপযুক্ত একটি সুযোগ খুঁজে নিন।
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
                                            font-medium
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
                                    যাচাই করা উদ্যোগগুলোর মধ্যে মানুষের বর্তমান
                                    প্রয়োজনের সঙ্গে যুক্ত একটি সুযোগ খুঁজে নিন।
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
                                            font-medium
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
                                            !text-white
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
        </>
    );
};

export default CategoriesPage;
