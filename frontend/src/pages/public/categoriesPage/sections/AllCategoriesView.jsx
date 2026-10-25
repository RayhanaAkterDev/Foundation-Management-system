import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
    TbAlertTriangle,
    TbBabyCarriage,
    TbBolt,
    TbBook,
    TbBuildingCommunity,
    TbDisabled,
    TbDroplet,
    TbFirstAidKit,
    TbHome,
    TbToolsKitchen2,
    TbWoman,
    TbArrowUpRight,
    TbHeartHandshake,
} from 'react-icons/tb';

/* =========================================================
   CATEGORY VISUALS
========================================================= */

const categoryVisuals = {
    education: {
        icon: TbBook,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85',
        label: 'শিক্ষা',
    },

    healthcare: {
        icon: TbFirstAidKit,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
        label: 'স্বাস্থ্যসেবা',
    },

    'food-assistance': {
        icon: TbToolsKitchen2,
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85',
        label: 'খাদ্য সহায়তা',
    },

    shelter: {
        icon: TbHome,
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
        label: 'আশ্রয়',
    },

    livelihood: {
        icon: TbBuildingCommunity,
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
        label: 'জীবিকা',
    },

    'disaster-relief': {
        icon: TbAlertTriangle,
        image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=85',
        label: 'দুর্যোগ সহায়তা',
    },

    other: {
        icon: TbHeartHandshake,
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85',
        label: 'অন্যান্য',
    },

    'water-sanitation': {
        icon: TbDroplet,
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=85',
        label: 'পানি ও স্যানিটেশন',
    },

    'child-support': {
        icon: TbBabyCarriage,
        image: 'https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1200&q=85',
        label: 'শিশু সহায়তা',
    },

    'women-support': {
        icon: TbWoman,
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=85',
        label: 'নারী সহায়তা',
    },

    'disability-support': {
        icon: TbDisabled,
        image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=85',
        label: 'প্রতিবন্ধী সহায়তা',
    },

    'emergency-relief': {
        icon: TbBolt,
        image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=85',
        label: 'জরুরি সহায়তা',
    },
};

const fallbackVisual = categoryVisuals.other;

const toBengaliDigits = (value) =>
    String(value).replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

/* =========================================================
   MASONRY POSITIONS
========================================================= */

const desktopPositions = [
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
    'md:col-span-3 md:row-span-4',
];

/* =========================================================
   IMAGE WITH FALLBACK
========================================================= */

const CategoryImage = ({ src, alt, priority = false }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-[#dce9e3]">
                <TbHeartHandshake
                    size={38}
                    strokeWidth={1.2}
                    className="text-[#0f766e]/60"
                />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
            className="
                absolute inset-0
                h-full w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.045]
            "
        />
    );
};

/* =========================================================
   DESKTOP CATEGORY TILE
========================================================= */

const CategoryTile = ({ category, index }) => {
    const visual = categoryVisuals[category.slug] || fallbackVisual;
    const Icon = visual.icon;

    const categoryName = category.name || visual.label;
    const categoryNumber = toBengaliDigits(String(index + 1).padStart(2, '0'));

    const position = desktopPositions[index % desktopPositions.length];

    return (
        <Link
            to={`/campaigns/category/${category.slug}`}
            aria-label={`${categoryName} বিভাগের উদ্যোগ দেখুন`}
            className={`
                group relative block
                min-h-0 overflow-hidden
                bg-[#dce9e3]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#0f766e]
                ${position}
            `}
        >
            <CategoryImage
                src={visual.image}
                alt={categoryName}
                priority={index < 3}
            />

            <div
                className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-[#081c20]/90
                    via-[#081c20]/25
                    to-[#081c20]/5
                    transition-colors
                    duration-300
                "
            />

            <span
                className="
                    absolute left-4 top-4 z-10
                    inline-flex min-h-7 min-w-7
                    items-center justify-center
                    border border-white/25
                    bg-black/25 px-2
                    font-bengali text-[11px]
                    text-white!
                    backdrop-blur-sm
                "
            >
                {categoryNumber}
            </span>

            <div
                className="
                    absolute inset-x-0 bottom-0 z-10
                    flex items-end justify-between
                    gap-3 p-4
                    lg:p-5
                "
            >
                <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2 text-white/80">
                        <Icon
                            size={16}
                            strokeWidth={1.6}
                            className="shrink-0"
                        />

                        <span className="font-bengali text-[11px] leading-5">
                            {visual.label}
                        </span>
                    </div>

                    <h3
                        className="
                            font-bengali
                            text-[17px]
                            font-semibold!
                            leading-[1.5]
                            text-white!
                            sm:text-[18px]
                            lg:text-[20px]
                        "
                    >
                        {categoryName}
                    </h3>
                </div>

                <span
                    aria-hidden="true"
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-full bg-white
                        text-[#173f39]
                        transition-transform
                        duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        lg:h-10 lg:w-10
                    "
                >
                    <TbArrowUpRight size={20} strokeWidth={1.8} />
                </span>
            </div>
        </Link>
    );
};

/* =========================================================
   MOBILE CATEGORY TILE
========================================================= */

const MobileCategory = ({ category, index }) => {
    const visual = categoryVisuals[category.slug] || fallbackVisual;
    const Icon = visual.icon;

    const categoryName = category.name || visual.label;

    return (
        <Link
            to={`/campaigns/category/${category.slug}`}
            aria-label={`${categoryName} বিভাগের উদ্যোগ দেখুন`}
            className="
                group relative block
                aspect-[4/5]
                min-w-0 overflow-hidden
                bg-[#dce9e3]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#0f766e]
                sm:aspect-[5/4]
            "
        >
            <CategoryImage src={visual.image} alt={categoryName} />

            <div
                className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-[#081c20]/95
                    via-[#081c20]/20
                    to-transparent
                "
            />

            <span
                className="
                    absolute left-3 top-3
                    flex min-h-6 min-w-6
                    items-center justify-center
                    bg-black/30 px-1.5
                    font-bengali text-[10px]
                    text-white!
                    backdrop-blur-sm
                "
            >
                {toBengaliDigits(String(index + 1).padStart(2, '0'))}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <div className="mb-1.5 flex items-center gap-1.5 text-white/80">
                    <Icon size={13} strokeWidth={1.7} />

                    <span className="font-bengali text-[10px] leading-4">
                        {visual.label}
                    </span>
                </div>

                <div className="flex items-end justify-between gap-2">
                    <h3
                        className="
                            min-w-0
                            font-bengali
                            text-[14px]
                            font-semibold!
                            leading-[1.45]
                            text-white!
                            sm:text-[17px]
                        "
                    >
                        {categoryName}
                    </h3>

                    <span
                        aria-hidden="true"
                        className="
                            flex h-7 w-7 shrink-0
                            items-center justify-center
                            rounded-full bg-white
                            text-[#173f39]
                            transition-transform
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            sm:h-8 sm:w-8
                        "
                    >
                        <TbArrowUpRight size={17} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

/* =========================================================
   ALL CATEGORIES VIEW
========================================================= */

const AllCategoriesView = ({ categories = [] }) => {
    const categoryList = Array.isArray(categories) ? categories : [];

    if (categoryList.length === 0) {
        return (
            <section className="bg-white">
                <div className="container-width py-12 sm:py-16">
                    <div className="border-y border-[#dfe7e4] py-10">
                        <TbHeartHandshake
                            size={30}
                            strokeWidth={1.3}
                            className="text-[#0f766e]"
                        />

                        <h2 className="mt-4 font-bengali text-[22px] font-semibold! text-[#0f172a]">
                            সহায়তার ক্ষেত্রগুলো এখন পাওয়া যাচ্ছে না।
                        </h2>

                        <p className="mt-2 font-bengali text-[14px] leading-7 text-[#64748b]">
                            কিছুক্ষণ পর আবার চেষ্টা করুন।
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white">
            <div className="container-width py-10 sm:py-12 lg:py-14">
                <div
                    className="
                        mb-6 flex flex-col gap-3
                        sm:mb-8
                        sm:flex-row sm:items-end
                        sm:justify-between
                    "
                >
                    <div>
                        <div className="mb-3 flex items-center gap-2.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />

                            <span className="font-bengali text-[12px] font-medium! text-[#0f766e]">
                                সহায়তার ক্ষেত্রসমূহ
                            </span>
                        </div>

                        <h2
                            className="
                                font-bengali
                                text-[1.6rem]
                                font-semibold!
                                leading-[1.45]
                                text-[#0f172a]
                                sm:text-[1.9rem]
                                lg:text-[2.15rem]
                            "
                        >
                            মানুষের প্রয়োজনের বিভিন্ন ক্ষেত্র
                        </h2>
                    </div>

                    <span className="font-bengali text-[12px] text-[#64748b]">
                        {toBengaliDigits(categoryList.length)}টি ক্ষেত্র
                    </span>
                </div>

                {/* DESKTOP / TABLET MASONRY */}
                <div
                    className="
                        hidden
                        md:grid
                        md:grid-cols-12
                        md:auto-rows-[55px]
                        md:gap-2.5
                        lg:auto-rows-[65px]
                        lg:gap-3
                    "
                >
                    {categoryList.map((category, index) => (
                        <CategoryTile
                            key={category.id || category.slug || index}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>

                {/* MOBILE IMAGE GALLERY */}
                <div className="grid grid-cols-2 gap-2.5 md:hidden">
                    {categoryList.map((category, index) => (
                        <MobileCategory
                            key={category.id || category.slug || index}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AllCategoriesView;
