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

    // 🔥 FIX 1: safe text fields (NO crashes)
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

    // 🔥 FIX 2: safe pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

    const current = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    return (
        <section className="section-gap bg-surface">
            <div className="container-width">
                {/* HEADER */}
                <SectionHeading
                    align="left"
                    title={
                        categoryId
                            ? `${campaigns.length} Campaigns`
                            : `${campaigns.length} Active Campaigns`
                    }
                    headingSize="sectionHero"
                    wrapperClass="pt-14 md:pt-16 lg:pt-20"
                />

                {/* SEARCH */}
                <div className="mt-6">
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
                        <p className="text-center col-span-full text-gray-500">
                            No campaigns found
                        </p>
                    )}
                </div>

                {/* PAGINATION */}
                {filtered.length > 0 && (
                    <div className="mt-10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

                {/* HERO */}
                <HeroSection />
            </div>
        </section>
    );
};

export default Campaigns;
