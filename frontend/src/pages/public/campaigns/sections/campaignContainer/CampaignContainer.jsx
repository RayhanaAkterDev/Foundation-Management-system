import React, { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import campaignsData from './data/campaignsData';
import CampaignCard from './CampaignCard';
import SectionHeading from '@/components/SectionHeading';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 6;

const CampaignContainer = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter
    const filteredCampaigns = useMemo(() => {
        return campaignsData.filter(
            (c) =>
                c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLower()),
        );
    }, [search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const currentCampaigns = useMemo(() => {
        const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredCampaigns.slice(start, end);
    }, [safeCurrentPage, filteredCampaigns]);

    return (
        <section className="section-gap">
            <div className="container-width">
                {/* HEADER (STATIC) */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Ongoing Initiatives
                    </p>

                    <SectionHeading
                        align="left"
                        title="10+ Active Campaigns"
                        headingSize="sectionHero"
                    />

                    {/* SEARCH RESULT INFO (DYNAMIC) */}
                    {search && (
                        <p className="text-sm text-text-secondary">
                            {filteredCampaigns.length} active campaigns found
                        </p>
                    )}
                </div>

                {/* Search */}
                <SearchBar
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}
                />

                {/* Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
                    {filteredCampaigns.length > 0 ? (
                        currentCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-lg font-medium text-text-primary">
                                No campaigns found
                            </p>

                            <p className="text-sm text-text-secondary mt-2">
                                Try searching with different keywords.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredCampaigns.length > 0 && (
                    <Pagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </section>
    );
};

export default CampaignContainer;
