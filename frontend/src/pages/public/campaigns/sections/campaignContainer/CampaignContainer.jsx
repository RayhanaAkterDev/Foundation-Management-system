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

    // SAFE FILTER (prevents .toLowerCase crash)
    const filteredCampaigns = useMemo(() => {
        const query = (search || '').toString().toLowerCase();

        return campaignsData.filter((c) => {
            const title = (c.title || '').toString().toLowerCase();
            const description = (c.description || '').toString().toLowerCase();

            return title.includes(query) || description.includes(query);
        });
    }, [search]);

    // TOTAL PAGES (never 0)
    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    // PAGINATED DATA
    const currentCampaigns = useMemo(() => {
        const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredCampaigns.slice(start, end);
    }, [safeCurrentPage, filteredCampaigns]);

    // ACTIVE CAMPAIGN NUMBER COUNT
    const formatCampaignCount = (count) => {
        if (count <= 10) return `${Math.max(1, count - 1)}+`;

        if (count <= 100) {
            const rounded = Math.floor(count / 5) * 5;
            return `${rounded}+`;
        }

        if (count <= 1000) {
            const rounded = Math.floor(count / 10) * 10;
            return `${rounded}+`;
        }

        const rounded = Math.floor(count / 50) * 50;
        return `${rounded}+`;
    };

    // const stats = [
    //     {
    //         value: '6',
    //         label: 'Urgent Cases',
    //     },
    //     {
    //         value: '14',
    //         label: 'Recently Updated',
    //     },
    //     {
    //         value: '100%',
    //         label: 'Verified',
    //     },
    //     {
    //         value: '1K+',
    //         label: 'Supporters',
    //     },
    // ];

    return (
        <section className="bg-surface section-gap">
            <div className="container-width">
                <div className="">
                    {/* HEADER */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <p
                            className="
                    text-[11px] sm:text-xs
                    uppercase
                    tracking-[0.22em] sm:tracking-[0.3em]
                    text-zinc-500
                "
                        >
                            Ongoing Initiatives
                        </p>

                        <SectionHeading
                            align="left"
                            title={`${formatCampaignCount(campaignsData.length)} Active Campaigns`}
                            headingSize="sectionHero"
                        />
                    </div>

                    {/* Right */}
                    {/* <div className="flex">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-baseline gap-2"
                            >
                                <span className="text-lg font-semibold text-primary">
                                    {stat.value}
                                </span>

                                <span className="text-sm text-text-secondary">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div> */}
                </div>

                {/* SEARCH */}
                <div className="mt-6 md:mt-8">
                    <SearchBar
                        value={search}
                        onChange={(value) => {
                            setSearch(String(value || ''));
                            setCurrentPage(1);
                        }}
                    />

                    {search && (
                        <p className="mt-2 text-sm text-text-secondary/80">
                            {filteredCampaigns.length} active campaign
                            {filteredCampaigns.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {/* GRID */}
                <div
                    className="
                pt-8 md:pt-10
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-5 sm:gap-6 xl:gap-8
            "
                >
                    {filteredCampaigns.length > 0 ? (
                        currentCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                            />
                        ))
                    ) : (
                        <div
                            className="
                        col-span-full
                        flex flex-col items-center justify-center
                        py-14 sm:py-18 md:py-24
                        text-center
                    "
                        >
                            <p className="text-lg font-medium text-text-primary">
                                No campaigns found
                            </p>

                            <p className="mt-2 text-sm text-text-secondary">
                                Try searching with different keywords.
                            </p>
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {filteredCampaigns.length > 0 && (
                    <div className="mt-10 md:mt-12">
                        <Pagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default CampaignContainer;
