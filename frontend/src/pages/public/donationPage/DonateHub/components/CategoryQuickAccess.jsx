import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    TbArrowUpRight,
    TbArrowRight,
    TbBook,
    TbFirstAidKit,
    TbHome,
    TbToolsKitchen2,
    TbBuildingCommunity,
    TbAlertTriangle,
    TbDots,
} from 'react-icons/tb';

import { fetchCategories } from '@/api/categories';

const categoryVisuals = {
    Education: {
        icon: TbBook,
        name: 'শিক্ষা',
        description:
            'প্রতিটি শিশুর শেখার সুযোগ তৈরি করতে শিক্ষাসামগ্রী ও প্রয়োজনীয় সহায়তা পৌঁছে দিন।',
    },
    Healthcare: {
        icon: TbFirstAidKit,
        name: 'স্বাস্থ্যসেবা',
        description:
            'চিকিৎসা ও জরুরি স্বাস্থ্যসেবার প্রয়োজনে থাকা মানুষের পাশে দাঁড়ান।',
    },
    'Food Assistance': {
        icon: TbToolsKitchen2,
        name: 'খাদ্য সহায়তা',
        description:
            'খাদ্যসংকটে থাকা পরিবারগুলোর কাছে প্রয়োজনীয় খাবার পৌঁছে দিতে সহায়তা করুন।',
    },
    Shelter: {
        icon: TbHome,
        name: 'আশ্রয়',
        description: 'নিরাপদ আশ্রয়ের প্রয়োজন এমন মানুষের পাশে দাঁড়ান।',
    },
    Livelihood: {
        icon: TbBuildingCommunity,
        name: 'জীবিকা',
        description:
            'দক্ষতা, কর্মসংস্থান ও স্বনির্ভরতার মাধ্যমে নতুন সম্ভাবনা তৈরি করুন।',
    },
    'Disaster Relief': {
        icon: TbAlertTriangle,
        name: 'দুর্যোগ সহায়তা',
        description:
            'দুর্যোগে ক্ষতিগ্রস্ত মানুষের জরুরি সহায়তা ও পুনর্বাসনে অংশ নিন।',
    },
    Other: {
        icon: TbDots,
        name: 'অন্যান্য',
        description:
            'বিভিন্ন মানবিক প্রয়োজন পূরণে চলমান উদ্যোগগুলোর সঙ্গে যুক্ত হোন।',
    },
};

const toBangla = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

const getVisual = (name) =>
    categoryVisuals[name] || {
        icon: TbDots,
        name: name || 'অন্যান্য',
        description: 'এই সহায়তার ক্ষেত্রের উদ্যোগগুলো সম্পর্কে জানুন।',
    };

const CategoryQuickAccess = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;

        const loadCategories = async () => {
            try {
                const data = await fetchCategories();

                const source = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                      ? data.data
                      : Array.isArray(data?.categories)
                        ? data.categories
                        : Array.isArray(data?.data?.data)
                          ? data.data.data
                          : [];
                const featured = source
                    .filter(
                        (category) =>
                            category.featured === true ||
                            category.featured === 1 ||
                            category.featured === '1',
                    )
                    .slice(0, 4);

                if (active) {
                    setCategories(featured);
                    setError(false);
                }
            } catch (error) {
                console.error('বিভাগগুলো লোড করা যায়নি:', error);

                if (active) {
                    setCategories([]);
                    setError(true);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadCategories();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return (
            <section className="section-gap bg-surface">
                <div className="container-width animate-pulse">
                    <div className="h-7 w-64 bg-[#e5ebe8]" />
                    <div className="mt-4 h-4 w-80 max-w-full bg-[#e5ebe8]" />
                    <div className="mt-9 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
                        <div className="h-[300px] bg-[#edf2ef]" />
                        <div className="grid gap-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-[92px] bg-[#edf2ef]"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section-gap bg-surface">
                <div
                    className="container-width border-y border-[#e1e9e3] py-12 text-center"
                    role="alert"
                >
                    <p className="font-bengali text-[16px] font-semibold text-text-primary">
                        সহায়তার বিভাগগুলো লোড করা যায়নি
                    </p>
                    <p className="mt-2 font-bengali text-[13px] text-text-secondary">
                        অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
                    </p>
                </div>
            </section>
        );
    }
    if (!categories.length) return null;

    const [main, ...rest] = categories;
    const mainVisual = getVisual(main.name);
    const MainIcon = mainVisual.icon;

    return (
        <section className="section-gap overflow-hidden bg-surface">
            <div className="container-width">
                {/* Heading */}
                <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#e1e9e3] pb-6 sm:mb-10 sm:flex-row sm:items-end">
                    <div className="max-w-[650px]">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-[6px] w-[6px] bg-[#d99a43]" />
                            <span className="font-bengali text-[12px] font-semibold text-[#a5793f]">
                                বিষয়ভিত্তিক উদ্যোগ
                            </span>
                        </div>

                        <h2 className="font-bengali text-[clamp(1.7rem,2.8vw,2.3rem)] font-semibold leading-[1.45] text-text-primary">
                            সহায়তার ক্ষেত্র বেছে নিন
                        </h2>

                        <p className="mt-3 max-w-[560px] font-bengali text-[13px] leading-[1.9] text-text-secondary sm:text-[14px]">
                            শিক্ষা, স্বাস্থ্য, খাদ্য কিংবা আশ্রয়—আপনার আগ্রহের
                            ক্ষেত্র থেকে মানবিক উদ্যোগগুলো খুঁজে নিন।
                        </p>
                    </div>

                    <Link
                        to="/categories"
                        className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-primary/30 pb-1.5 font-bengali text-[12px] font-semibold text-primary transition-colors hover:border-primary"
                    >
                        সকল বিভাগ দেখুন
                        <TbArrowUpRight
                            size={17}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>

                {/* Category directory */}
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-7">
                    {/* Main category */}
                    <Link
                        to={`/campaigns?category=${encodeURIComponent(main.slug)}`}
                        className="group relative flex min-h-[300px] min-w-0 flex-col justify-between overflow-hidden bg-[#eaf2ed] p-6 transition-colors hover:bg-[#e2eee7] sm:min-h-[330px] sm:p-9 lg:min-h-[355px]"
                    >
                        <div className="pointer-events-none absolute -bottom-14 -right-14 flex h-64 w-64 items-center justify-center border border-[#bfd7ca]/50 sm:h-80 sm:w-80">
                            <div className="flex h-[74%] w-[74%] items-center justify-center border border-[#bfd7ca]/60">
                                <MainIcon
                                    size={115}
                                    stroke={0.7}
                                    className="text-[#9ec5b2]/45"
                                />
                            </div>
                        </div>

                        <div className="relative z-10 flex items-start justify-between gap-4">
                            <span className="inline-flex items-center gap-2 font-bengali text-[11px] font-semibold text-[#4c8068]">
                                <span className="h-1.5 w-1.5 bg-primary" />
                                নির্বাচিত সহায়তার ক্ষেত্র
                            </span>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#bcd4c5] bg-white/70 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <TbArrowUpRight size={19} />
                            </span>
                        </div>

                        <div className="relative z-10 max-w-[410px]">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#c6ded0] bg-white/70 text-primary">
                                <MainIcon size={25} stroke={1.5} />
                            </div>

                            <h3 className="font-bengali text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-[1.4] text-[#163f32]">
                                {mainVisual.name}
                            </h3>

                            <p className="mt-3 max-w-[340px] font-bengali text-[13px] leading-[1.85] text-[#607b6c]">
                                {mainVisual.description}
                            </p>

                            <span className="mt-6 inline-flex items-center gap-2 border-b border-primary/40 pb-1.5 font-bengali text-[12px] font-semibold text-primary">
                                সংশ্লিষ্ট উদ্যোগ দেখুন
                                <TbArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </span>
                        </div>
                    </Link>

                    {/* Supporting category rows */}
                    <div className="flex min-w-0 flex-col border-t border-[#e2eae4] lg:border-t-0">
                        {rest.map((category, index) => {
                            const visual = getVisual(category.name);
                            const Icon = visual.icon;

                            return (
                                <Link
                                    key={category.id}
                                    to={`/campaigns?category=${encodeURIComponent(category.slug)}`}
                                    className="group flex min-w-0 flex-1 items-center gap-4 border-b border-[#e2eae4] py-5 transition-colors hover:bg-[#f7faf7] sm:gap-5 sm:px-3 lg:px-4"
                                >
                                    <span className="hidden shrink-0 self-start pt-1 text-[11px] font-medium text-[#a4b5a9] sm:block">
                                        {toBangla(
                                            String(index + 2).padStart(2, '0'),
                                        )}
                                    </span>

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#edf3ee] text-primary transition-colors group-hover:bg-[#dcece2] sm:h-14 sm:w-14">
                                        <Icon size={25} stroke={1.4} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bengali text-[16px] font-semibold text-text-primary transition-colors group-hover:text-primary sm:text-[18px]">
                                            {visual.name}
                                        </h3>

                                        <p className="mt-1 line-clamp-2 font-bengali text-[12px] leading-[1.75] text-text-secondary sm:text-[13px]">
                                            {visual.description}
                                        </p>
                                    </div>

                                    <TbArrowUpRight
                                        size={19}
                                        className="shrink-0 text-[#87a799] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom editorial note */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#e2eae4] pt-5">
                    <p className="font-bengali text-[12px] leading-6 text-text-secondary">
                        প্রতিটি সহায়তার ক্ষেত্রেই রয়েছে মানুষের পাশে দাঁড়ানোর
                        সুযোগ।
                    </p>

                    <Link
                        to="/categories"
                        className="inline-flex items-center gap-2 font-bengali text-[12px] font-semibold text-primary"
                    >
                        আরও সহায়তার ক্ষেত্র
                        <TbArrowRight size={17} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryQuickAccess;
