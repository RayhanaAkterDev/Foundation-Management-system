import React from 'react';

import SectionHeading from '@/components/SectionHeading';

import Motion from '@/components/motion/Motion';

import ExploreAllCategoriesCta from './ExploreAllCategoriesCta';

const RightPanel = ({ categories = [], active, setActive, campaigns = [] }) => {
    const getActiveCampaignCount = (category) => {
        return campaigns.filter(
            (campaign) =>
                campaign?.status === 'active' &&
                campaign?.category === category?.name,
        ).length;
    };

    return (
        <div className="lg:sticky lg:top-24">
            {/* =================================================
                INTRO
            ================================================== */}
            <Motion variant="fadeUp">
                <SectionHeading
                    gap="md"
                    align="left"
                    title="যেখানে মানুষের প্রয়োজন"
                    headingClass="
                        font-bengali!
                        font-medium!
                        leading-[1.5]!
                        tracking-[-0.01em]
                        text-text-primary!
                    "
                    headingSize="sectionHero"
                    description="
                        মানুষের জীবনের বিভিন্ন প্রয়োজনের সঙ্গে যুক্ত
                        উদ্যোগগুলো থেকে একটি ক্ষেত্র বেছে নিন।
                    "
                    descriptionSize="sectionHero"
                    descriptionClass="
                        font-bengali!
                        leading-[1.95]!
                        text-text-secondary!
                    "
                />
            </Motion>

            {/* =================================================
                CATEGORY LABEL
            ================================================== */}
            <div className="mt-8 mb-4 flex items-center gap-2.5 sm:mt-10">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <p
                    className="
                        font-bengali
                        text-xs
                        font-medium
                        leading-[1.8]
                        text-text-secondary
                    "
                >
                    সহায়তার ক্ষেত্র বেছে নিন
                </p>
            </div>

            {/* =================================================
                MOBILE / TABLET CATEGORY NAV
            ================================================== */}
            <div
                className="
                    grid
                    grid-cols-1
                    gap-2
                    sm:grid-cols-2
                    lg:hidden
                "
            >
                {categories.map((cat, index) => {
                    const isActive = active?.id === cat.id;
                    const activeCampaignCount = getActiveCampaignCount(cat);

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActive(cat)}
                            className={`
                                group
                                relative
                                flex
                                min-h-[4.25rem]
                                items-center
                                gap-3.5
                                rounded-xl
                                border
                                px-4
                                py-3.5
                                text-left
                                transition-all
                                duration-200
                                sm:min-h-[4.5rem]
                                sm:px-4.5
                                ${
                                    isActive
                                        ? 'border-primary/20 bg-primary/[0.055]'
                                        : 'border-border bg-surface hover:border-primary/15 hover:bg-surface-soft'
                                }
                            `}
                        >
                            <span
                                className={`
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-[10px]
                                    font-medium
                                    tabular-nums
                                    transition-colors
                                    ${
                                        isActive
                                            ? 'bg-primary text-white'
                                            : 'bg-background-alt text-text-muted group-hover:text-primary'
                                    }
                                `}
                            >
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <div className="min-w-0 flex-1">
                                <p
                                    className={`
                                        font-bengali
                                        text-[14px]
                                        leading-[1.7]
                                        sm:text-[15px]
                                        ${
                                            isActive
                                                ? 'font-semibold text-primary'
                                                : 'font-medium text-text-primary group-hover:text-primary'
                                        }
                                    `}
                                >
                                    {cat.name} ({activeCampaignCount})
                                </p>

                                {isActive && cat.description && (
                                    <p
                                        className="
                                            mt-0.5
                                            line-clamp-1
                                            font-bengali
                                            text-[11px]
                                            leading-[1.75]
                                            text-text-muted
                                        "
                                    >
                                        {cat.description}
                                    </p>
                                )}
                            </div>

                            <span
                                className={`
                                    shrink-0
                                    text-sm
                                    text-primary
                                    transition-all
                                    duration-200
                                    ${
                                        isActive
                                            ? 'translate-x-0 opacity-100'
                                            : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                                    }
                                `}
                            >
                                →
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* =================================================
                DESKTOP CATEGORY NAV
            ================================================== */}
            <div className="hidden lg:block">
                <div className="border border-border">
                    {categories.map((cat, index) => {
                        const isActive = active?.id === cat.id;
                        const activeCampaignCount = getActiveCampaignCount(cat);

                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActive(cat)}
                                className={`
                                    group
                                    relative
                                    w-full
                                    border-b
                                    border-border
                                    text-left
                                    transition-colors
                                    duration-200
                                    last:border-b-0
                                    ${
                                        isActive
                                            ? 'bg-primary/[0.045]'
                                            : 'bg-transparent hover:bg-surface-soft'
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        absolute
                                        inset-y-0
                                        left-0
                                        w-0.5
                                        bg-primary
                                        transition-transform
                                        duration-300
                                        ${
                                            isActive
                                                ? 'scale-y-100'
                                                : 'scale-y-0'
                                        }
                                    `}
                                />

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-4
                                        px-4
                                        py-4
                                        lg:px-4
                                        lg:py-4
                                        xl:px-5
                                        xl:py-[1.15rem]
                                    "
                                >
                                    <span
                                        className={`
                                            pt-0.5
                                            shrink-0
                                            font-sans
                                            text-[10px]
                                            font-medium
                                            tabular-nums
                                            tracking-[0.08em]
                                            transition-colors
                                            duration-200
                                            ${
                                                isActive
                                                    ? 'text-primary'
                                                    : 'text-text-muted'
                                            }
                                        `}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <span
                                                className={`
                                                    font-bengali
                                                    text-[14px]
                                                    leading-[1.7]
                                                    xl:text-[15px]
                                                    ${
                                                        isActive
                                                            ? 'font-semibold text-primary'
                                                            : 'font-normal text-text-primary group-hover:text-primary'
                                                    }
                                                `}
                                            >
                                                {cat.name} (
                                                {activeCampaignCount})
                                            </span>

                                            <span
                                                className={`
                                                    shrink-0
                                                    text-sm
                                                    text-primary
                                                    transition-all
                                                    duration-200
                                                    ${
                                                        isActive
                                                            ? 'translate-x-0 opacity-100'
                                                            : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                                                    }
                                                `}
                                            >
                                                →
                                            </span>
                                        </div>

                                        {isActive && cat.description && (
                                            <p
                                                className={`
                                                    mt-1
                                                    max-w-sm
                                                    font-bengali
                                                    text-[11px]
                                                    leading-[1.8]
                                                    xl:text-xs
                                                    text-text-secondary
                                                `}
                                            >
                                                {cat.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* =================================================
                ALL CATEGORIES
            ================================================== */}
            <ExploreAllCategoriesCta />
        </div>
    );
};

export default RightPanel;
