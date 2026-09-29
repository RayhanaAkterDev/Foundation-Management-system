import React from 'react';
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
} from 'react-icons/tb';

const categoryVisuals = {
    education: {
        icon: TbBook,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=88&w=1400',
        tone: 'শিক্ষা',
    },

    healthcare: {
        icon: TbFirstAidKit,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=88&w=1400',
        tone: 'স্বাস্থ্যসেবা',
    },

    'food-assistance': {
        icon: TbToolsKitchen2,
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=88&w=1400',
        tone: 'খাদ্য সহায়তা',
    },

    shelter: {
        icon: TbHome,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=88&w=1400',
        tone: 'আশ্রয়',
    },

    livelihood: {
        icon: TbBuildingCommunity,
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=88&w=1400',
        tone: 'জীবিকা',
    },

    'disaster-relief': {
        icon: TbAlertTriangle,
        image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=88&w=1400',
        tone: 'দুর্যোগ সহায়তা',
    },

    other: {
        icon: TbBuildingCommunity,
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=88&w=1400',
        tone: 'অন্যান্য',
    },

    'water-sanitation': {
        icon: TbDroplet,
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=88&w=1400',
        tone: 'পানি ও স্যানিটেশন',
    },

    'child-support': {
        icon: TbBabyCarriage,
        image: 'https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&q=88&w=1400',
        tone: 'শিশু সহায়তা',
    },

    'women-support': {
        icon: TbWoman,
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=88&w=1400',
        tone: 'নারী সহায়তা',
    },

    'disability-support': {
        icon: TbDisabled,
        image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=88&w=1400',
        tone: 'প্রতিবন্ধী সহায়তা',
    },

    'emergency-relief': {
        icon: TbBolt,
        image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=88&w=1400',
        tone: 'জরুরি সহায়তা',
    },
};

const bengaliNumbers = [
    '০১',
    '০২',
    '০৩',
    '০৪',
    '০৫',
    '০৬',
    '০৭',
    '০৮',
    '০৯',
    '১০',
    '১১',
    '১২',
    '১৩',
    '১৪',
    '১৫',
    '১৬',
    '১৭',
    '১৮',
    '১৯',
    '২০',
];

/*
 * DO NOT CHANGE:
 * Existing masonry positions from your current UI.
 */
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
];

const ArrowIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[18px] w-[18px]"
        aria-hidden="true"
    >
        <path
            d="M5 19L19 5M8 5H19V16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CategoryTile = ({ category, index }) => {
    const visual = categoryVisuals[category.slug];

    if (!visual) {
        return null;
    }

    const Icon = visual.icon;

    return (
        <Link
            to={`/campaigns/category/${category.slug}`}
            className={[
                'group relative min-h-[240px] overflow-hidden bg-slate-300',
                'md:min-h-0',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                desktopPositions[index] || 'md:col-span-3 md:row-span-4',
            ].join(' ')}
        >
            {/* IMAGE */}
            <img
                src={visual.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                loading={index < 4 ? 'eager' : 'lazy'}
            />

            {/*
                DARK OVERLAY

                Your screenshot has bright images in several cards.
                This keeps WHITE text readable on every image.
            */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/90 via-[#07111f]/32 to-[#07111f]/5 transition-all duration-500 group-hover:from-[#07111f]/95 group-hover:via-[#07111f]/38" />

            {/* NUMBER */}
            <div className="absolute left-5 top-5 z-10">
                <span
                    className="
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    border
                    border-white/25
                    bg-[#07111f]/55
                    px-2
                    font-bengali
                    text-[11px]
                    font-medium
                    leading-none
                    !text-white!
                    backdrop-blur-[2px]
                "
                >
                    {bengaliNumbers[index] || '০০'}
                </span>
            </div>

            {/* CARD CONTENT */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 lg:p-7">
                <div className="flex items-end justify-between gap-5">
                    <div className="min-w-0">
                        {/* CATEGORY TYPE */}
                        <div className="mb-2.5 flex items-center gap-2.5">
                            <span
                                className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                border
                                border-white/30
                                bg-white/10
                                !text-white!
                                backdrop-blur-[2px]
                            "
                            >
                                <Icon size={16} strokeWidth={1.6} />
                            </span>

                            <span
                                className="
                                font-bengali
                                text-[12px]
                                font-medium
                                leading-[1.6]
                                !text-white!/85
                            "
                            >
                                {visual.tone}
                            </span>
                        </div>

                        {/* MAIN CARD TITLE */}
                        <h3
                            className="
                            max-w-[19rem]
                            font-bengali
                            text-[20px]
                            font-semibold
                            leading-[1.45]
                            tracking-[-0.015em]
                            !text-white!
                            sm:text-[21px]
                            lg:text-[22px]
                        "
                        >
                            {category.name}
                        </h3>
                    </div>

                    {/* ARROW */}
                    <span
                        className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        !text-[#0b1728]
                        shadow-sm
                        transition-all
                        duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                    "
                    >
                        <ArrowIcon />
                    </span>
                </div>
            </div>
        </Link>
    );
};

const MobileCategory = ({ category, index }) => {
    const visual = categoryVisuals[category.slug];

    if (!visual) {
        return null;
    }

    const Icon = visual.icon;

    return (
        <Link
            to={`/campaigns/category/${category.slug}`}
            className="
                group
                flex
                items-center
                gap-4
                border-b
                border-[#dfe5eb]
                py-4
                first:border-t
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-inset
            "
        >
            {/* IMAGE */}
            <div className="relative h-[82px] w-[104px] shrink-0 overflow-hidden bg-slate-200">
                <img
                    src={visual.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/60 via-transparent to-transparent" />

                <span
                    className="
                    absolute
                    left-2
                    top-2
                    flex
                    h-7
                    min-w-7
                    items-center
                    justify-center
                    bg-[#07111f]/65
                    px-1.5
                    font-bengali
                    text-[10px]
                    font-medium
                    leading-none
                    !text-white!
                "
                >
                    {bengaliNumbers[index] || '০০'}
                </span>
            </div>

            {/* TEXT */}
            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                    <Icon
                        size={15}
                        strokeWidth={1.7}
                        className="shrink-0 !text-[#087f78]"
                    />

                    <span
                        className="
                        font-bengali
                        text-[12px]
                        font-medium
                        leading-5
                        !text-[#65758a]
                    "
                    >
                        {visual.tone}
                    </span>
                </div>

                <h3
                    className="
                    font-bengali
                    text-[18px]
                    font-semibold
                    leading-[1.5]
                    tracking-[-0.01em]
                    !text-[#101b2c]
                    transition-colors
                    duration-200
                    group-hover:!text-[#087f78]
                "
                >
                    {category.name}
                </h3>
            </div>

            {/* ARROW */}
            <span
                className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#d9e0e7]
                !text-[#172235]
                transition-all
                duration-300
                group-hover:border-[#087f78]
                group-hover:bg-[#087f78]
                group-hover:!text-white!
            "
            >
                <ArrowIcon />
            </span>
        </Link>
    );
};

const AllCategoriesView = ({ categories = [] }) => {
    if (!categories.length) {
        return null;
    }

    return (
        <section className="bg-white">
            <div className="section-gap container-width">
                {/* =========================
                    SECTION HEADING
                ========================= */}
                <div className="mb-9 flex items-end justify-between gap-8 sm:mb-11">
                    <div>
                        {/* SMALL LABEL */}
                        <div className="mb-4 flex items-center gap-3">
                            <span
                                className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[#07877e]
                            "
                            />

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

                        {/* SECTION TITLE */}
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

                    {/* COUNT */}
                    <span
                        className="
        hidden
        shrink-0
        font-bengali
        text-[13px]
        font-medium
        leading-6
        !text-[#718096]
        sm:block
    "
                    >
                        {categories.length.toLocaleString('bn-BD')}টি ক্ষেত্র
                    </span>
                </div>

                {/* =========================
                    DESKTOP GRID
                    LAYOUT UNCHANGED
                ========================= */}
                <div
                    className="
                    hidden
                    md:grid
                    md:auto-rows-[68px]
                    md:grid-cols-12
                    md:gap-3
                    lg:auto-rows-[74px]
                "
                >
                    {categories.map((category, index) => (
                        <CategoryTile
                            key={category.id || category.slug}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>

                {/* =========================
                    MOBILE
                ========================= */}
                <div className="md:hidden">
                    {categories.map((category, index) => (
                        <MobileCategory
                            key={category.id || category.slug}
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
