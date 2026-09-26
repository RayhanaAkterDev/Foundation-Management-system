import React, { useEffect, useState } from 'react';

import { fetchCategories } from '@/api/categories';

import CategoryHeader from './sections/CategoryHeader';
import AllCategoriesView from './sections/AllCategoriesView';

import Button from '@/components/Button';

import { Link } from 'react-router-dom';

import SectionHeading from '@/components/SectionHeading';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories:', error);
                setCategories([]);
            }
        };

        loadCategories();
    }, []);

    const visibleCategories = showAll
        ? categories
        : categories.slice(0, 6);

    return (
        <>
            <div className="container-width section-gap mt-24">
                <CategoryHeader
                    title="Explore Causes"
                    description="Choose a category to find campaigns that match what you care about. Every cause represents real people in need."
                    activeCategory="all"
                />

                <div className="mt-10">
                    <AllCategoriesView categories={visibleCategories} />

                    {categories.length > 6 && (
                        <div className="mt-16 text-center">
                            <Button
                                onClick={() => setShowAll(!showAll)}
                                variant="ghost"
                                size="lg"
                            >
                                {showAll
                                    ? 'Show fewer categories'
                                    : `Load more categories (${categories.length - 6})`}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="section-gap text-center bg-surface">
                <div className="max-w-4xl mx-auto space-y-5">
                    <SectionHeading
                        title="Explore all active campaigns and support real people in need"
                        headingSize="sectionHero"
                        description="Every campaign is verified and represents real human situations. Your contribution directly supports food, medicine, and emergency relief."
                        descriptionSize="hero"
                    />
                </div>

                <div className="mt-8">
                    <Link to="/campaigns">
                        <Button size="lg" className="px-10 py-4">
                            Browse All Campaigns
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-text-secondary mt-5">
                    Verified humanitarian campaigns • Updated continuously
                </p>
            </div>
        </>
    );
};

export default CategoriesPage;