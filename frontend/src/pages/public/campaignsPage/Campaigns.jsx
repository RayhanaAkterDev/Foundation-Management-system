import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchPublicCampaigns, fetchPublicCategories } from '@/api/publicCampaignsApi';

import CampaignCard from './sections/CampaignCard';
import SectionHeading from '@/components/SectionHeading';
import Pagination from './sections/Pagination';
import SearchBar from './sections/SearchBar';
import HeroSection from './sections/HeroSection';

const ITEMS_PER_PAGE = 6;

const Campaigns = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState(categoryId || 'all');

    useEffect(() => {
        if (categoryId) {
            setActiveCategory(categoryId);
        } else {
            setActiveCategory('all');
        }
    }, [categoryId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [campaignsData, categoriesData] = await Promise.all([
                fetchPublicCampaigns(),
                fetchPublicCategories(),
            ]);

            setCampaigns(campaignsData || []);
            setCategories(categoriesData || []);
        } catch (err) {
            console.error('Error loading public campaigns:', err);
            setError('Unable to load campaigns from the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCategoryClick = (catName) => {
        setActiveCategory(catName);
        setCurrentPage(1);
        if (catName === 'all') {
            navigate('/campaigns');
        } else {
            navigate(`/campaigns/category/${encodeURIComponent(catName)}`);
        }
    };

    // Filter by category and search
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return campaigns.filter((c) => {
            const matchesCategory =
                activeCategory === 'all' ||
                !activeCategory ||
                String(c.category || '').toLowerCase() === String(activeCategory).toLowerCase();

            if (!matchesCategory) return false;

            if (!q) return true;

            const title = (c.title || '').toLowerCase();
            const desc = (c.shortDescription || c.description || '').toLowerCase();
            const location = (c.location || c.district || '').toLowerCase();

            return title.includes(q) || desc.includes(q) || location.includes(q);
        });
    }, [search, campaigns, activeCategory]);

    // pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

    const current = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    return (
        <section className="bg-surface min-h-screen">
            {/* HERO */}
            <HeroSection />

            <div
                id="explore"
                className="container-width pb-14 md:pb-16 lg:pb-20"
            >
                {/* HEADER */}
                <SectionHeading
                    align="left"
                    title={activeCategory !== 'all' && activeCategory ? `${activeCategory} Campaigns` : `Active Campaigns`}
                    headingSize="sectionHero"
                />

                <p className="text-gray-600 mt-2 max-w-2xl">
                    Discover verified causes and support real people in need.
                </p>

                {/* CATEGORY FILTER PILLS */}
                {categories.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleCategoryClick('all')}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                activeCategory === 'all'
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-primary/50'
                            }`}
                        >
                            All ({campaigns.length})
                        </button>

                        {categories.map((cat) => {
                            const name = cat.name || cat;
                            const count = cat.count;
                            const isSelected =
                                String(activeCategory).toLowerCase() === String(name).toLowerCase();

                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => handleCategoryClick(name)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                        isSelected
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:border-primary/50'
                                    }`}
                                >
                                    {name} {count !== undefined && `(${count})`}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* SEARCH */}
                <div className="mt-6 max-w-xl">
                    <SearchBar
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-95 rounded-3xl bg-gray-200 animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* ERROR STATE */}
                {!loading && error && (
                    <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                        <p className="font-semibold text-lg">{error}</p>
                        <button
                            type="button"
                            onClick={loadData}
                            className="mt-4 rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* GRID */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
                        {current.length > 0 ? (
                            current.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-200/60 p-8">
                                <div className="text-4xl mb-3">🌱</div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    No active campaigns found
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                                    {search
                                        ? `No campaigns matched your search for "${search}".`
                                        : activeCategory !== 'all'
                                        ? `There are currently no active campaigns in the "${activeCategory}" category.`
                                        : 'There are currently no active campaigns available for public view.'}
                                </p>
                                {(search || activeCategory !== 'all') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            handleCategoryClick('all');
                                        }}
                                        className="mt-4 text-sm font-semibold text-primary hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* PAGINATION */}
                {!loading && !error && filtered.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-center mt-10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Campaigns;
