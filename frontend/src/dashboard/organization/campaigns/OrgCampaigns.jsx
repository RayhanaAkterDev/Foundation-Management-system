import React, { useMemo, useState } from 'react';

import CampaignPageHeader from './components/CampaignPageHeader';
import CampaignOverview from './components/CampaignOverview';
import CampaignFilters from './components/CampaignFilters';
import CampaignList from './components/CampaignList';
import CampaignPagination from './components/CampaignPagination';

import { mockOrgCampaigns } from '@/data/mockOrganization';

const CAMPAIGNS_PER_PAGE = 9;

const OrgCampaigns = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const campaigns = Array.isArray(mockOrgCampaigns) ? mockOrgCampaigns : [];

    const filteredCampaigns = useMemo(() => {
        const query = search.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const status = String(campaign?.status || '')
                .trim()
                .toLowerCase();

            const searchMatch =
                !query ||
                [
                    campaign?.title,
                    campaign?.description,
                    campaign?.category,
                    campaign?.deadline,
                    campaign?.helpRequestTitle,
                    campaign?.help_request?.title,
                    campaign?.help_request_title,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query);

            const statusMatch =
                statusFilter === 'all' || status === statusFilter;

            return searchMatch && statusMatch;
        });
    }, [campaigns, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE),
    );

    const paginatedCampaigns = useMemo(() => {
        const start = (currentPage - 1) * CAMPAIGNS_PER_PAGE;

        return filteredCampaigns.slice(start, start + CAMPAIGNS_PER_PAGE);
    }, [filteredCampaigns, currentPage]);

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleCreateCampaign = () => {
        // Campaign creation logic will be connected later.
    };

    const handleOpenCampaign = (campaign) => {
        // Campaign detail logic will be connected later.
        console.log('Open campaign:', campaign);
    };

    return (
        <div className="space-y-6">
            <CampaignPageHeader onCreate={handleCreateCampaign} />

            <CampaignOverview campaigns={campaigns} />

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-text-primary">
                        Campaign register
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                        Monitor the campaigns your organization is managing and
                        the support connected to each case.
                    </p>
                </div>

                <CampaignFilters
                    search={search}
                    setSearch={handleSearchChange}
                    statusFilter={statusFilter}
                    setStatusFilter={handleStatusChange}
                />

                <CampaignList
                    campaigns={paginatedCampaigns}
                    onOpen={handleOpenCampaign}
                />

                {filteredCampaigns.length > 0 && (
                    <CampaignPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredCampaigns.length}
                        itemsPerPage={CAMPAIGNS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                )}
            </section>
        </div>
    );
};

export default OrgCampaigns;
