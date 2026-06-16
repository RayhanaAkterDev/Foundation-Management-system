import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { categories } from '@/data/categories';
import { urgentCampaigns, getCampaignsByCategory } from '@/data/selectors';
import { campaigns } from '@/data/campaigns';

import CategoryHeader from './sections/CategoryHeader';
import CategorySidebar from './sections/CategorySidebar';
import CategoryGrid from './sections/CategoryGrid';
import CategoryGridPreview from './sections/CategoryGridPreview';
import UrgentRail from './sections/UrgentRail';

const CategoriesPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    // ======================
    // MODE DETECTION (URL ONLY)
    // ======================
    const isAll = !categoryId;
    const isUrgent = categoryId === 'urgent';

    const activeCategory = categories.find((c) => c.id === categoryId);

    // ======================
    // DATA
    // ======================
    const sortedCampaigns = [...campaigns].sort((a, b) => {
        const order = { critical: 0, urgent: 1, normal: 2 };
        return order[a.urgency] - order[b.urgency];
    });

    const categoryCampaigns = activeCategory
        ? getCampaignsByCategory(activeCategory.id)
        : [];

    return (
        <div className="container-width section-gap">
            <CategoryHeader
                title="Explore Categories"
                description="Browse campaigns by category or urgency."
                activeCategory={categoryId || 'all'}
            />

            {/* URGENT RAIL ALWAYS */}
            <div className="mb-10">
                <UrgentRail categories={categories} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* SIDEBAR */}
                <div className="lg:col-span-3">
                    <CategorySidebar categories={categories} />
                </div>

                {/* MAIN */}
                <div className="lg:col-span-9">
                    {/* ALL */}
                    {isAll && (
                        <div className="space-y-6">
                            <CategoryGridPreview
                                campaigns={sortedCampaigns.slice(0, 6)}
                            />

                            <button
                                onClick={() => navigate('/campaigns')}
                                className="text-sm text-white/60 hover:text-white"
                            >
                                See all campaigns →
                            </button>
                        </div>
                    )}

                    {/* URGENT */}
                    {isUrgent && (
                        <CategoryGridPreview campaigns={urgentCampaigns} />
                    )}

                    {/* CATEGORY */}
                    {activeCategory && !isAll && !isUrgent && (
                        <CategoryGrid
                            category={{
                                ...activeCategory,
                                campaigns: categoryCampaigns,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
