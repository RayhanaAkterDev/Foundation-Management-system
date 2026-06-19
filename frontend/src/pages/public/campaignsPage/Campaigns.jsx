import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getAllCampaigns, getCampaignsByCategory } from '@/data/selectors';

import CampaignCard from './sections/CampaignCard';
import SectionHeading from '@/components/SectionHeading';
import Pagination from './sections/Pagination';
import SearchBar from './sections/SearchBar';

import HeroSection from './sections/HeroSection';

const ITEMS_PER_PAGE = 6;

const Campaigns = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const { categoryId } = useParams();

    const campaigns = categoryId
        ? getCampaignsByCategory(categoryId)
        : getAllCampaigns();

    // safe text fields
    const filtered = useMemo(() => {
        const q = search.toLowerCase();

        return campaigns.filter((c) => {
            const title = c.title?.toLowerCase() || '';
            const desc =
                c.shortDescription?.toLowerCase() ||
                c.description?.toLowerCase() ||
                '';

            return title.includes(q) || desc.includes(q);
        });
    }, [search, campaigns]);

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
                    title={categoryId ? `Browse Campaigns` : `Active Campaigns`}
                    headingSize="sectionHero"
                />

                <p className="text-gray-600 mt-2 max-w-2xl">
                    Discover verified causes and support real people in need.
                </p>

                {/* SEARCH (minimal, not boxed) */}
                <div className="mt-6 max-w-xl">
                    <SearchBar
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
                    {current.length > 0 ? (
                        current.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 text-gray-500">
                            No campaigns found
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {filtered.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-center">
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
