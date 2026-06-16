import React from 'react';
import { categories } from '@/data/categories';

import CategoryHeader from './sections/CategoryHeader';
import AllCategoriesView from './sections/AllCategoriesView';

const CategoriesPage = () => {
    return (
        <div className="container-width section-gap mt-20">
            {/* HERO */}
            <CategoryHeader
                title="Explore Causes"
                description="Choose a category to find campaigns that match what you care about. Every cause represents real people in need."
                activeCategory="all"
            />

            {/* CATEGORY GRID (ONLY REAL CONTENT) */}
            <div className="mt-10">
                <AllCategoriesView categories={categories} />
            </div>

            {/* OPTIONAL CTA */}
            <div className="mt-14 text-center">
                <p className="text-gray-500 text-sm mb-4">
                    Want to see everything at once?
                </p>

                <a
                    href="/campaigns"
                    className="inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                >
                    View All Campaigns
                </a>
            </div>
        </div>
    );
};

export default CategoriesPage;
