import React from 'react';

import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

import ExploreAllCategoriesCta from './ExploreAllCategoriesCta';

const RightPanel = ({ categories = [], active, setActive }) => {
    return (
        <div className="lg:sticky lg:top-24">
            {/* =================================================
                INTRO
            ================================================== */}
            <Motion variant="fadeUp">
                <SectionHeading
                    gap="md"
                    align="left"
                    title="কোথায় সহায়তা পৌঁছাবে?"
                    headingClass="
                        font-bengali!
                        font-medium!
                        leading-[1.45]!
                        text-text-primary!
                    "
                    headingSize="sectionHero"
                    description="
                        আপনার সহায়তার ক্ষেত্রটি বেছে নিন। প্রতিটি বিভাগ
                        বাস্তব মানুষের বাস্তব প্রয়োজনের সঙ্গে যুক্ত।
                    "
                    descriptionSize="sectionHero"
                    descriptionClass="
                        font-bengali!
                        text-text-secondary!
                    "
                />
            </Motion>

            {/* =================================================
                CATEGORY LABEL
            ================================================== */}
            <div className="mt-9 mb-4 flex items-center gap-2.5">
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
                    সহায়তার ক্ষেত্র
                </p>
            </div>

            {/* =================================================
                CATEGORY LIST
            ================================================== */}
            <div className="overflow-hidden border-y border-border">
                {categories.map((cat, index) => {
                    const isActive = active?.id === cat.id;

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActive(cat)}
                            className={`
                                group
                                relative
                                w-full
                                text-left
                                transition-colors
                                duration-200
                                ${
                                    isActive
                                        ? 'bg-surface-teal'
                                        : 'bg-transparent hover:bg-surface-soft'
                                }
                            `}
                        >
                            {/* Active indicator */}
                            <span
                                className={`
                                    absolute
                                    inset-y-0
                                    left-0
                                    w-0.5
                                    origin-center
                                    bg-primary
                                    transition-transform
                                    duration-300
                                    ${isActive ? 'scale-y-100' : 'scale-y-0'}
                                `}
                            />

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-4
                                    px-4
                                    py-4
                                    sm:px-5
                                    sm:py-[1.1rem]
                                "
                            >
                                {/* Number */}
                                <span
                                    className={`
                                        pt-0.5
                                        shrink-0
                                        text-[11px]
                                        font-medium
                                        tabular-nums
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

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                        "
                                    >
                                        <span
                                            className={`
                                                font-bengali
                                                text-[15px]
                                                leading-[1.6]
                                                transition-colors
                                                duration-200
                                                sm:text-base
                                                ${
                                                    isActive
                                                        ? 'font-medium text-primary'
                                                        : 'font-normal text-text-primary group-hover:text-primary'
                                                }
                                            `}
                                        >
                                            {cat.name}
                                        </span>

                                        <span
                                            className={`
                                                shrink-0
                                                text-base
                                                leading-none
                                                transition-all
                                                duration-200
                                                ${
                                                    isActive
                                                        ? 'translate-x-0 text-primary opacity-100'
                                                        : '-translate-x-1 text-primary opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                                                }
                                            `}
                                        >
                                            →
                                        </span>
                                    </div>

                                    {cat.description && (
                                        <p
                                            className={`
                                                mt-1.5
                                                max-w-sm
                                                font-bengali
                                                text-xs
                                                leading-[1.75]
                                                transition-colors
                                                duration-200
                                                ${
                                                    isActive
                                                        ? 'text-text-secondary'
                                                        : 'text-text-muted'
                                                }
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

            {/* =================================================
                ALL CATEGORIES
            ================================================== */}
            <div className="mt-7">
                <ExploreAllCategoriesCta />
            </div>
        </div>
    );
};

export default RightPanel;
