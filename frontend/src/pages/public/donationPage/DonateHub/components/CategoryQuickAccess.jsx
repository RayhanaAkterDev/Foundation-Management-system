import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowRight } from 'react-icons/tb';
import {
    TbBook,
    TbFirstAidKit,
    TbHome,
    TbToolsKitchen2,
    TbBuildingCommunity,
    TbAlertTriangle,
    TbDots,
} from 'react-icons/tb';

import { fetchCategories } from '@/api/categories';
import SectionHeading from '@/components/SectionHeading';

const categoryVisuals = {
    Education: {
        icon: TbBook,
        description: 'Support access to education and learning opportunities.',
    },
    Healthcare: {
        icon: TbFirstAidKit,
        description:
            'Help people access essential healthcare and medical support.',
    },
    'Food Assistance': {
        icon: TbToolsKitchen2,
        description: 'Support individuals and families facing food insecurity.',
    },
    Shelter: {
        icon: TbHome,
        description: 'Help provide safe and stable shelter for people in need.',
    },
    Livelihood: {
        icon: TbBuildingCommunity,
        description: 'Support people in building sustainable livelihoods.',
    },
    'Disaster Relief': {
        icon: TbAlertTriangle,
        description:
            'Respond to urgent needs caused by disasters and emergencies.',
    },
    Other: {
        icon: TbDots,
        description:
            'Support humanitarian needs that fall outside other categories.',
    },
};

const CategoryQuickAccess = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();

                const featured = data
                    .filter((category) => category.featured)
                    .slice(0, 4);

                setCategories(featured);
            } catch (error) {
                console.error('Failed to load categories:', error);
                setCategories([]);
            }
        };

        loadCategories();
    }, []);

    if (!categories.length) return null;

    const [main, ...rest] = categories;

    const mainVisual = categoryVisuals[main.name];
    const MainIcon = mainVisual?.icon || TbDots;

    return (
        <section className="section-gap bg-surface relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 right-0 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container-width relative z-10">
                <div className="mb-10">
                    <SectionHeading
                        align="left"
                        title="Explore by Cause"
                        description="Discover urgent needs and ongoing campaigns by category"
                        descriptionSize="hero"
                    />
                </div>

                <Link
                    to={`/campaigns?category=${main.slug}`}
                    className="
                        group
                        relative
                        block
                        overflow-hidden
                        rounded-3xl
                        border border-border
                        bg-background
                        p-8 md:p-10
                        transition-all duration-300
                        hover:-translate-y-1
                        hover:border-primary/20
                    "
                >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                    </div>

                    <div className="relative flex items-start justify-between gap-8">
                        <div className="max-w-2xl">
                            <div
                                className="
                                    flex h-16 w-16 items-center justify-center
                                    rounded-2xl
                                    bg-primary/10
                                    text-primary
                                    ring-1 ring-primary/15
                                "
                            >
                                <MainIcon size={30} />
                            </div>

                            <div className="mt-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    Featured Cause
                                </p>

                                <h2 className="mt-3 text-3xl font-bold text-text-primary">
                                    {main.name}
                                </h2>

                                <p className="mt-4 max-w-xl leading-relaxed text-text-secondary">
                                    {mainVisual?.description}
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4">
                                <span
                                    className="
                                        inline-flex items-center
                                        rounded-full
                                        bg-primary
                                        px-5 py-2.5
                                        text-sm font-medium
                                        text-white
                                    "
                                >
                                    View campaigns
                                </span>

                                <TbArrowRight
                                    size={20}
                                    className="
                                        text-primary
                                        transition-transform duration-300
                                        group-hover:translate-x-1
                                    "
                                />
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs uppercase tracking-wider text-text-secondary">
                                Most active cause
                            </span>

                            <span className="mt-2 text-sm font-medium text-text-primary">
                                Browse related campaigns
                            </span>
                        </div>
                    </div>
                </Link>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {rest.map((cat) => {
                        const visual = categoryVisuals[cat.name];
                        const Icon = visual?.icon || TbDots;

                        return (
                            <Link
                                key={cat.id}
                                to={`/campaigns?category=${cat.slug}`}
                                className="
                                    group
                                    flex items-center gap-4
                                    rounded-2xl
                                    border border-border
                                    bg-background
                                    p-5
                                    transition-all duration-300
                                    hover:border-primary/20
                                    hover:-translate-y-1
                                "
                            >
                                <div
                                    className="
                                        flex h-11 w-11 shrink-0
                                        items-center justify-center
                                        rounded-xl
                                        bg-primary/10
                                        text-primary
                                    "
                                >
                                    <Icon size={20} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-text-primary">
                                        {cat.name}
                                    </h4>

                                    <p className="mt-1 line-clamp-1 text-xs text-text-secondary">
                                        {visual?.description}
                                    </p>
                                </div>

                                <div
                                    className="
                                        opacity-0
                                        -translate-x-1
                                        transition-all duration-300
                                        group-hover:translate-x-0
                                        group-hover:opacity-100
                                    "
                                >
                                    <TbArrowRight
                                        size={18}
                                        className="text-primary"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link
                        to="/categories"
                        className="
                            inline-flex items-center gap-2
                            text-primary
                            font-medium
                            transition-all duration-300
                            hover:gap-3
                        "
                    >
                        Browse all categories
                        <TbArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryQuickAccess;
